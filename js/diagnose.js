// '내 사진 진단'. diagnose(exif, pixels, cameraId, lensId) → { lights, findings, sceneGuess, subjectGuess, next, exifSummary, gear }
// 명세는 docs/diagnose.md — 규칙·임계값을 바꿀 때는 문서 먼저. AI API 미사용, 오프라인.
// exif: exif.js readExif() 결과(또는 null). pixels: pixels.js analyzePixels() 결과. 숫자 세팅(next)은 compute()에서만.

const DIAG = {
  S_LOW: 12,           // 라플라시안 분산 임계. test-diag.html(샘플 9장 vs 블러 9장)로 산출: 원본 최소 51.3 · 블러 최대 2.5 의 기하평균 11.3 → 12. 근거는 docs/diagnose.md (b)
  FACE_BAD: 0.30, FACE_WARN: 0.40,
  HL_BAD: 0.08, HL_WARN: 0.03,
  EV_MAX_DIFF: 2,
  AP_WIDE_MARGIN: 0.3,
  KID_SHUTTER: 1 / 500,
  BACKLIT_EC: 0.7,
  IS_STOPS_DEFAULT: 4, // is: true 인데 isStops가 없는 렌즈(EF 24-105 IS)
  // (a) light id → 상황 id. 같은 EV가 여럿이면 이 순서로 먼저 맞는 것.
  lightToScene: [['sunny', 'outdoorSunny'], ['shade', 'outdoorShade'], ['overcast', 'outdoorShade'], ['window', 'indoorWindow'], ['home', 'indoorEvening'], ['dim', 'cafe'], ['nightFace', 'nightPortrait']],
  autoPrograms: ['P', 'Creative', 'Action', 'Portrait', 'Landscape'],
  manualPrograms: ['Av', 'Tv', 'M'],
};
const SEV = { bad: 0, warn: 1, info: 2 };
const KEY_ORDER = ['gear', 'mode', 'blur', 'face', 'highlights', 'noise', 'flash', 'noexif', 'ok'];

const normName = (s) => String(s || '').toLowerCase().replace(/[\s\-_]/g, '');
// EXIF Model("Canon EOS 6D Mark II") → CAMERAS. 이름 포함 비교.
function matchCamera(model) {
  const m = normName(model);
  return m ? CAMERAS.find((c) => m.includes(normName(c.name))) || null : null;
}
// EXIF LensModel("EF50mm f/1.8 STM") → LENSES. 공백 제거 후 같거나 포함.
function matchLens(lens) {
  const m = normName(lens);
  return m ? LENSES.find((l) => { const n = normName(l.label); return m === n || m.includes(n) || n.includes(m); }) || null : null;
}

// (a) EV100 = log2(N²/t) − log2(ISO/100) + EC
function ev100(exif) {
  if (!exif || !(exif.fNumber > 0) || !(exif.exposureTime > 0) || !(exif.iso > 0)) return null;
  return log2(exif.fNumber * exif.fNumber / exif.exposureTime) - log2(exif.iso / 100) + (exif.ec || 0);
}
function guessScene(exif) {
  const ev = ev100(exif);
  if (ev == null) return { ev: null, sceneId: null, lightId: null };
  let best = null;
  for (const [lightId, sceneId] of DIAG.lightToScene) {
    const l = byId(LIGHTS, lightId);
    const d = Math.abs(l.ev - ev);
    if (!best || d < best.d - 1e-9) best = { d, lightId, sceneId };
  }
  if (!best || best.d >= DIAG.EV_MAX_DIFF) return { ev, sceneId: null, lightId: null };
  let sceneId = best.sceneId;
  if (sceneId === 'outdoorShade' && (exif.ec || 0) > 0) sceneId = 'backlit';
  return { ev, sceneId, lightId: best.lightId };
}

function exifSummary(exif) {
  if (!exif) return null;
  const p = [exif.fNumber != null && `f/${exif.fNumber}`, exif.exposureTime != null && fmtShutter(exif.exposureTime), exif.iso != null && `ISO ${exif.iso}`,
    exif.focal != null && `${Math.round(exif.focal)}mm`, exif.ec != null && `보정 ${fmtEC(exif.ec)}`, exif.program || null].filter(Boolean);
  return p.length ? p.join(' · ') : null;
}

function diagnose(exif, pixels, cameraId, lensId) {
  const findings = [];
  const add = (sev, key, title, detail, fix) => findings.push({ sev, key, title, detail, fix });
  const lights = { blur: 'ok', face: 'ok', highlights: 'ok', noise: 'ok', mode: 'ok' };
  const hasExif = !!(exif && (exif.fNumber != null || exif.exposureTime != null || exif.iso != null));
  const curCam = byId(CAMERAS, cameraId), curLens = byId(LENSES, lensId);

  // 장비: EXIF 바디·렌즈가 현재 선택과 다르면 info. 목록에 있으면 그 id로 계산, 없으면 현재 선택.
  let cam = curCam, lens = curLens;
  const gear = { model: exif ? exif.model : null, lens: exif ? exif.lens : null, matchedCamera: null, matchedLens: null, differs: false };
  if (hasExif) {
    const mc = matchCamera(exif.model), ml = matchLens(exif.lens);
    gear.matchedCamera = mc ? mc.id : null; gear.matchedLens = ml ? ml.id : null;
    const camDiff = !!exif.model && (!mc || mc.id !== cameraId);
    const lensDiff = !!exif.lens && (!ml || ml.id !== lensId);
    if (camDiff || lensDiff) {
      gear.differs = true;
      if (mc && lensCompatible(mc, ml || curLens)) { cam = mc; lens = ml && lensCompatible(mc, ml) ? ml : curLens; }
      else if (ml && lensCompatible(curCam, ml)) lens = ml;
      add('info', 'gear', `이 사진은 ${exif.model || '다른 바디'}+${exif.lens || '다른 렌즈'}로 찍음`, '진단은 그 장비 기준', `앱 설정은 ${curCam.short} · ${curLens.chip}`);
    }
  }

  // (f) 모드
  let flashFired = false;
  if (hasExif) {
    const prog = exif.program;
    if (DIAG.autoPrograms.includes(prog)) { lights.mode = 'bad'; add('bad', 'mode', '오토로 찍힘', `${prog} 모드. 카메라가 조리개·셔터를 다 정함`, cam.hasCModes ? `${cam.cModes.join('/')}로` : 'Av 모드로'); }
    else if (prog === 'other') { lights.mode = 'warn'; add('warn', 'mode', '촬영 모드 확인 불가 (오토일 가능성)', 'EXIF ExposureProgram이 정의되지 않음. 캐논 전자동·SCN은 여기에 기록됨', cam.hasCModes ? `${cam.cModes.join('/')}로` : 'Av 모드로'); }
    flashFired = exif.flash === true;
    if (flashFired) add('info', 'flash', '플래시 사용됨', '이 앱 범위 밖', '플래시를 끄고 ISO 상한으로 버티기');
  }

  // (b) 흔들림
  const sharp = pixels ? pixels.sharpness : null;
  const low = sharp != null && sharp < DIAG.S_LOW;
  if (hasExif && exif.exposureTime > 0) {
    const focal = exif.focal > 0 ? exif.focal : lens.portraitFocal;
    const isStops = lens.is ? (lens.isStops != null ? lens.isStops : DIAG.IS_STOPS_DEFAULT) : 0;
    const slack = lens.is ? Math.pow(2, Math.max(0, isStops - 2)) : 1;
    const limit = Math.min(CAMERA_COMMON.handheldCap, slack / (focal * cam.crop)); // 이보다 느리면(t > limit) 위험
    const slow = exif.exposureTime > limit * 1.0001;
    const wideOpen = exif.fNumber != null && exif.fNumber <= lens.apMin + DIAG.AP_WIDE_MARGIN;
    if (low && slow) { lights.blur = 'bad'; add('bad', 'blur', '손떨림', `${fmtShutter(exif.exposureTime)}는 ${Math.round(focal)}mm 핸드헬드 한계 ${fmtShutter(limit)}보다 느림`, `${cam.hasCModes ? cam.cModes.join('/') : 'ISO 자동'} 최소 셔터가 지켜졌는지, 또는 ISO 상한 올리기`); }
    else if (low && wideOpen) { lights.blur = 'bad'; add('bad', 'blur', '초점 빗나감 (심도 얕음)', `f/${exif.fNumber} 최대 개방 근처. 눈에서 몇 cm만 벗어나도 흐려짐`, 'f/2.2로 조이고 눈에 1점 AF'); }
    else if (low) { lights.blur = 'warn'; add('warn', 'blur', '초점 또는 피사체 움직임', `셔터 ${fmtShutter(exif.exposureTime)}는 충분한데 선명하지 않음`, `${cam.afModes.kid} + 연사`); }
    else if (slow) { lights.blur = 'warn'; add('warn', 'blur', '운 좋게 멈춤. 다음엔 위험', `${fmtShutter(exif.exposureTime)}는 ${Math.round(focal)}mm 한계 ${fmtShutter(limit)}보다 느림`, `최소 셔터 ${fmtShutter(limit)} 이상, 모자라면 ISO 상한 올리기`); }
  } else if (low) {
    lights.blur = 'warn'; add('warn', 'blur', '선명하지 않음', '촬영 정보가 없어 손떨림인지 초점인지 구분 불가', '최소 셔터와 1점 AF 확인');
  }

  // (c) 얼굴
  if (pixels && pixels.faceLuma != null) {
    const est = pixels.faceEstimate ? ' (중앙 기준 추정)' : '';
    const backlit = hasExif && (exif.ec || 0) >= DIAG.BACKLIT_EC;
    if (pixels.faceLuma < DIAG.FACE_BAD) { lights.face = 'bad'; add('bad', 'face', '얼굴 어두움' + est, `얼굴 밝기 ${Math.round(pixels.faceLuma * 100)}%`, backlit ? '노출보정 +1' : '노출보정 +0.7 (역광이면 +1)'); }
    else if (pixels.faceLuma < DIAG.FACE_WARN) { lights.face = 'warn'; add('warn', 'face', '얼굴 조금 어두움' + est, `얼굴 밝기 ${Math.round(pixels.faceLuma * 100)}%`, '노출보정 +0.3'); }
  }

  // (d) 하이라이트
  if (pixels && pixels.clipping) {
    const hl = pixels.clipping.highlights;
    const backlit = hasExif && (exif.ec || 0) >= DIAG.BACKLIT_EC;
    if (hl > DIAG.HL_BAD && !backlit) { lights.highlights = 'bad'; add('bad', 'highlights', '하얗게 날아간 부분 많음', `밝기 250 이상 픽셀 ${(hl * 100).toFixed(1)}%`, '노출보정 −0.3, 해를 등지면 역광 상황으로'); }
    else if (hl > DIAG.HL_WARN) { lights.highlights = 'warn'; add('warn', 'highlights', backlit ? '배경 날아감 (역광이라 정상 범위)' : '하얗게 날아간 부분 있음', `밝기 250 이상 픽셀 ${(hl * 100).toFixed(1)}%`, backlit ? '얼굴만 밝으면 됨. 배경을 살리려면 노출보정 −0.3' : '노출보정 −0.3'); }
  }

  // (e) 노이즈
  if (hasExif && exif.iso > 0) {
    if (exif.iso > cam.isoHard) { lights.noise = 'bad'; add('bad', 'noise', `ISO ${exif.iso} (비상 상한 ${cam.isoHard} 초과)`, '노이즈가 감당 안 되는 범위', '밝은 자리로, 밝은 렌즈로, 또는 방 조명 전부 켜기'); }
    else if (exif.iso > cam.isoUsable) { lights.noise = 'warn'; add('warn', 'noise', `ISO ${exif.iso} (상한 ${cam.isoUsable} 초과)`, '노이즈가 보이기 시작하는 범위', '밝은 자리로, 밝은 렌즈로, 또는 방 조명 전부 켜기'); }
  }

  // EXIF 없음
  if (!hasExif) add('info', 'noexif', '촬영 정보가 없는 사진 (편집·캡처본)', '흔들림·얼굴·하이라이트만 픽셀로 판정', '카메라에서 바로 옮긴 원본 JPEG을 올리면 세팅까지 진단');

  // (g) 정렬: 장비 info는 맨 위 고정, 그다음 bad → warn → info, 같은 심각도면 KEY_ORDER
  const rank = (f) => (f.key === 'gear' ? -1 : SEV[f.sev]);
  findings.sort((a, b) => (rank(a) - rank(b)) || (KEY_ORDER.indexOf(a.key) - KEY_ORDER.indexOf(b.key)));
  // (h) 전부 ok
  if (!findings.some((f) => f.sev !== 'info')) add('info', 'ok', '설정은 문제없음', '구도·순간은 사람 몫', '');

  // (a) 상황·피사체 추정 → next
  const g = hasExif ? guessScene(exif) : { ev: null, sceneId: null, lightId: null };
  const subjectGuess = hasExif && exif.exposureTime > 0 && exif.exposureTime <= DIAG.KID_SHUTTER ? 'kid' : 'still';
  const next = g.sceneId ? compute(cam.id, g.sceneId, subjectGuess, lens.id) : null;

  return { lights, findings, sceneGuess: g.sceneId, subjectGuess, next, exifSummary: exifSummary(hasExif ? exif : null), ev100: g.ev, gear, cameraId: cam.id, lensId: lens.id };
}
