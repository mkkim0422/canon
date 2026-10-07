// 사진 → Features(분류값만). analyzeImage(file, mode) → Promise<Features>
// mode 'mock': 파일명(경로 제외 basename, 대소문자 무시)이 img/ 샘플 9개 중 하나면 MOCK_FEATURES의 그 항목, 아니면 softKid. 0.8초 지연.
// mode 'gemini': 2단계 미구현. 호출하면 에러.
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

function analyzeImage(file, mode = 'mock') {
  if (mode === 'gemini') return analyzeWithGemini(file);
  return new Promise((resolve) => setTimeout(resolve, 800)).then(() => {
    const key = mockKeyForFile(file);
    return validateFeatures(JSON.parse(JSON.stringify(MOCK_FEATURES[key])));
  });
}

// 2단계(실제 AI 분석) 틀. 구현 시에도 반환은 반드시 validateFeatures()를 거친다.
function analyzeWithGemini(file) {
  // TODO(2단계):
  //  1) 원본 File을 긴 변 1024px로 축소해 base64 JPEG로 만든다(업로드 용량·비용 절감. EXIF는 exif.js가 원본에서 따로 읽음).
  //  2) 프롬프트: Features 스키마(docs/match.md)의 분류값만 JSON으로 답하게 한다. 숫자(조리개·셔터·ISO) 요청 금지.
  //  3) 응답 JSON → validateFeatures(). 파싱 실패·네트워크 실패 시 { light: 'unknown', ... } 기본값으로 떨어뜨리고 UI에 "분석 실패" 표시.
  //  4) API 키는 앱에 넣지 않는다(프록시 서버 또는 사용자 입력).
  return Promise.reject(new Error('2단계 미구현: gemini 모드는 아직 없음. mode를 "mock"으로 호출할 것'));
}
