// 사진 → Features(분류값만). analyzeImage(file, mode) → Promise<Features>
// mode 'mock': 파일명(경로 제외 basename, 대소문자 무시)이 img/ 샘플 9개 중 하나면 MOCK_FEATURES의 그 항목, 아니면 softKid. 0.8초 지연.
// mode 'gemini': Gemini generateContent에 1024px 축소본을 보내 Features JSON을 받는다(아래 gemini 절). 키는 localStorage 'cck.geminiKey'.
// 반환 전 validateFeatures()로 허용값 밖은 'unknown'(또는 false / 'mid')으로 치환하고, 숫자 필드가 와도 버린다.

const FEATURE_ENUMS = {
  light: ['sunny', 'shade', 'backlit', 'overcast', 'window', 'home', 'dim', 'night', 'studio', 'unknown'],
  dof: ['shallow', 'medium', 'deep'],
  motion: ['frozen', 'still', 'blur'],
  focalFeel: ['wide', 'normal', 'tele'],
  subject: ['kid', 'adult', 'group', 'none'],
  framing: ['face', 'halfbody', 'full'],
  saturation: ['low', 'mid', 'high'],
  warmth: ['cool', 'neutral', 'warm'],
  contrast: ['low', 'mid', 'high'],
};

function validateFeatures(raw) {
  const f = raw && typeof raw === 'object' ? raw : {};
  const pick = (v, list, fallback) => (list.includes(v) ? v : fallback);
  const c = f.color && typeof f.color === 'object' ? f.color : {};
  let conf = Number(f.lightConfidence);
  if (!Number.isFinite(conf)) conf = 0;
  conf = Math.min(1, Math.max(0, conf));
  const notes = Array.isArray(f.notes) ? f.notes.filter((n) => typeof n === 'string' && n.trim()).slice(0, 3) : [];
  // 허용 필드만 다시 조립 → AI가 보낸 숫자 필드(fNumber, iso 등)는 여기서 자연히 버려진다.
  return {
    light: pick(f.light, FEATURE_ENUMS.light, 'unknown'),
    lightConfidence: conf,
    artificialLight: f.artificialLight === true,
    rimLight: f.rimLight === true,
    dof: pick(f.dof, FEATURE_ENUMS.dof, 'medium'),
    motion: pick(f.motion, FEATURE_ENUMS.motion, 'still'),
    focalFeel: pick(f.focalFeel, FEATURE_ENUMS.focalFeel, 'normal'),
    subject: pick(f.subject, FEATURE_ENUMS.subject, 'none'),
    framing: pick(f.framing, FEATURE_ENUMS.framing, 'halfbody'),
    color: {
      saturation: pick(c.saturation, FEATURE_ENUMS.saturation, 'mid'),
      warmth: pick(c.warmth, FEATURE_ENUMS.warmth, 'neutral'),
      contrast: pick(c.contrast, FEATURE_ENUMS.contrast, 'mid'),
    },
    notes,
  };
}

function mockKeyForFile(file) {
  const name = String((file && file.name) || '').split(/[\\/]/).pop().toLowerCase();
  const base = name.replace(/\.(jpe?g|png|webp|heic)$/i, '');
  return Object.keys(MOCK_FEATURES).find((k) => k.toLowerCase() === base) || 'softKid';
}

// opts(gemini만): { key } 로 저장된 키 대신 쓸 키를 넘길 수 있다(설정의 연결 테스트). 반환은 두 모드 모두 validateFeatures()를 거친 Features.
function analyzeImage(file, mode = 'mock', opts = {}) {
  if (mode === 'gemini') return analyzeWithGemini(file, opts);
  return new Promise((resolve) => setTimeout(resolve, 800)).then(() => {
    const key = mockKeyForFile(file);
    return validateFeatures(JSON.parse(JSON.stringify(MOCK_FEATURES[key])));
  });
}

// ---------- gemini 모드 (실제 AI 분석) ----------
// 규약: 모델은 GEMINI_MODEL 상수 하나(설정 페이지에 노출하지 않음). 프롬프트는 GEMINI_PROMPT 상수. 숫자(조리개·셔터·ISO)는 요청도 사용도 하지 않는다.
// 이미지·응답은 어떤 경우에도 localStorage·콘솔에 남기지 않는다(GEMINI_DEBUG는 개발 중에만 true, 커밋은 false).
// 호출 방식은 https://ai.google.dev/api/generate-content (generateContent REST) 기준. 2026-10 문서의 이미지 이해 예제는 최신 flash 모델 gemini-3.8-flash.
const GEMINI_MODEL = 'gemini-3.8-flash';
const GEMINI_ENDPOINT = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const GEMINI_KEY_STORAGE = 'cck.geminiKey'; // app.js의 K.geminiKey와 같은 키. JSON.stringify 저장이라 읽을 때 파싱.
const GEMINI_TIMEOUT_MS = 20000;
const GEMINI_MAX_EDGE = 1024, GEMINI_JPEG_Q = 0.85;
const GEMINI_DEBUG = false;

const GEMINI_PROMPT = [
  'You classify a reference photograph for a beginner photographer. Return ONLY JSON matching this schema. Do not output camera settings or numbers.',
  '',
  'Schema (every field required):',
  '- light: one of sunny (hard shadows, direct sun) / shade (soft open shade outdoors) / backlit (sun behind the subject) / overcast (cloudy sky, no shadows) / window (indoor, daylight coming from a window) / home (indoor evening, household lamps) / dim (cafe or restaurant, low light) / night (outdoor at night with city lights) / studio (flash or studio lighting) / unknown',
  '- lightConfidence: number 0-1, how sure you are about light',
  '- artificialLight: boolean, true if flash or studio light is visible',
  '- rimLight: boolean, true if the hair edge glows from light behind the subject',
  '- dof: shallow (background strongly blurred) / medium / deep (everything sharp)',
  '- motion: frozen (a moving subject captured sharp) / still (posed, not moving) / blur (intentional motion blur)',
  '- focalFeel: wide (wide-angle look, stretched perspective) / normal / tele (compressed background, telephoto look)',
  '- subject: kid / adult / group / none',
  '- framing: face (head and shoulders or closer) / halfbody / full',
  '- color: { saturation: low / mid / high, warmth: cool / neutral / warm, contrast: low / mid / high }',
  '- notes: array of up to 3 short Korean sentences about notable things in the photo (no camera settings, no numbers)',
  '',
  "If the image contains no people, set subject to 'none' and still classify light and color.",
].join('\n');

// responseSchema(문서의 generationConfig.responseSchema). FEATURE_ENUMS와 같은 값. 숫자 필드는 lightConfidence뿐.
const GEMINI_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    light: { type: 'string', enum: FEATURE_ENUMS.light },
    lightConfidence: { type: 'number' },
    artificialLight: { type: 'boolean' },
    rimLight: { type: 'boolean' },
    dof: { type: 'string', enum: FEATURE_ENUMS.dof },
    motion: { type: 'string', enum: FEATURE_ENUMS.motion },
    focalFeel: { type: 'string', enum: FEATURE_ENUMS.focalFeel },
    subject: { type: 'string', enum: FEATURE_ENUMS.subject },
    framing: { type: 'string', enum: FEATURE_ENUMS.framing },
    color: {
      type: 'object',
      properties: {
        saturation: { type: 'string', enum: FEATURE_ENUMS.saturation },
        warmth: { type: 'string', enum: FEATURE_ENUMS.warmth },
        contrast: { type: 'string', enum: FEATURE_ENUMS.contrast },
      },
      required: ['saturation', 'warmth', 'contrast'],
    },
    notes: { type: 'array', items: { type: 'string' } },
  },
  required: ['light', 'lightConfidence', 'artificialLight', 'rimLight', 'dof', 'motion', 'focalFeel', 'subject', 'framing', 'color', 'notes'],
};

function geminiKey() {
  try {
    const raw = localStorage.getItem(GEMINI_KEY_STORAGE);
    if (!raw) return '';
    try { const v = JSON.parse(raw); return typeof v === 'string' ? v.trim() : ''; } catch (e) { return raw.trim(); }
  } catch (e) { return ''; }
}

// 원본 File → 긴 변 GEMINI_MAX_EDGE JPEG(품질 GEMINI_JPEG_Q) base64. 원본은 보내지 않는다. 객체 URL은 사용 후 revoke.
function fileToJpegBase64(file, maxEdge = GEMINI_MAX_EDGE, quality = GEMINI_JPEG_Q) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    const done = (fn) => { URL.revokeObjectURL(url); fn(); };
    img.onload = () => done(() => {
      try {
        const k = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.naturalWidth * k)); c.height = Math.max(1, Math.round(img.naturalHeight * k));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality).split(',')[1]);
      } catch (e) { reject(new Error('이미지를 변환할 수 없어요')); }
    });
    img.onerror = () => done(() => reject(new Error('이미지를 열 수 없어요')));
    img.src = url;
  });
}

// 응답 텍스트 → JSON. 앞뒤 ```json 코드펜스 제거.
function parseGeminiJson(text) {
  const t = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  try { return JSON.parse(t); } catch (e) { throw new Error('응답 형식 오류'); }
}

const GEMINI_BLOCKED = /^(SAFETY|RECITATION|BLOCKLIST|PROHIBITED_CONTENT|SPII|IMAGE_SAFETY|IMAGE_PROHIBITED_CONTENT|ESCALATION|PUP_LIMITED_DISABLED)$/;

async function analyzeWithGemini(file, opts = {}) {
  const key = opts.key != null ? String(opts.key).trim() : geminiKey();
  if (!key) throw new Error('API 키를 확인해 주세요');
  const data = await fileToJpegBase64(file);
  const body = {
    contents: [{ parts: [{ text: GEMINI_PROMPT }, { inlineData: { mimeType: 'image/jpeg', data } }] }],
    generationConfig: { responseMimeType: 'application/json', responseSchema: GEMINI_RESPONSE_SCHEMA, temperature: 0.2 },
  };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), GEMINI_TIMEOUT_MS);
  let res;
  try {
    res = await fetch(GEMINI_ENDPOINT(opts.model || GEMINI_MODEL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    throw new Error(e && e.name === 'AbortError' ? '응답이 없어요(20초). 다시 시도' : '네트워크 오류. 인터넷 연결을 확인해 주세요');
  }
  if (!res.ok) {
    clearTimeout(timer);
    if (GEMINI_DEBUG) { try { console.warn('gemini http', res.status, (await res.text()).slice(0, 300)); } catch (e) { /* 무시 */ } }
    if (res.status === 400 || res.status === 401 || res.status === 403) throw new Error('API 키를 확인해 주세요');
    if (res.status === 429) throw new Error('요청이 많아요. 잠시 후 다시');
    throw new Error('분석 서버 오류');
  }
  let json;
  try { json = await res.json(); } catch (e) { throw new Error(e && e.name === 'AbortError' ? '응답이 없어요(20초). 다시 시도' : '응답 형식 오류'); } finally { clearTimeout(timer); }
  const cand = json && Array.isArray(json.candidates) ? json.candidates[0] : null;
  const blocked = (json && json.promptFeedback && json.promptFeedback.blockReason) || (cand && GEMINI_BLOCKED.test(cand.finishReason || ''));
  if (!cand || blocked) throw new Error('이 사진은 분석할 수 없어요. 다른 사진으로');
  const text = ((cand.content && cand.content.parts) || []).map((p) => p.text || '').join('');
  if (!text.trim()) throw new Error('응답 형식 오류');
  const raw = parseGeminiJson(text);
  if (GEMINI_DEBUG) console.log('gemini features(raw)', raw); // 개발 중에만. 이미지·전체 응답은 어떤 경우에도 찍지 않는다.
  return validateFeatures(raw); // 허용값 밖 치환 + 숫자 필드 제거
}
