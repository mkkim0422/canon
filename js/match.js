// '이 사진처럼 찍기' 매핑. 명세는 docs/match.md — 규칙 추가는 문서 먼저.
// matchFeatures(features, currentSceneId, currentSubjectId, cameraId, lensId, ownedLensIds)
// 숫자는 전부 compute()에서만 나온다. features의 값은 분류값으로만 쓴다. 노출보정은 현재 상황(scene.ec)에서만.

const MATCH = {
  // (a) light → 상황 id
  lightToScene: { sunny: 'outdoorSunny', shade: 'outdoorShade', backlit: 'backlit', overcast: 'cloudyRain', window: 'indoorWindow', home: 'indoorEvening', dim: 'cafe', night: 'nightPortrait', studio: null, unknown: null },
  // (f) 현재 상황 → light
  sceneToLight: { outdoorSunny: 'sunny', outdoorShade: 'shade', backlit: 'backlit', cloudyRain: 'overcast', indoorWindow: 'window', indoorEvening: 'home', cafe: 'dim', nightPortrait: 'night' },
  family: { sunny: 'sun', backlit: 'sun', shade: 'soft', overcast: 'soft', window: 'indoorDay', home: 'indoorDay', dim: 'dark', night: 'dark' },
  bright: ['sunny', 'backlit', 'shade', 'overcast', 'window'],
  lightLabel: { sunny: '맑은 직사광', shade: '그늘빛', backlit: '역광', overcast: '흐린 빛', window: '창가 빛', home: '실내 조명', dim: '어두운 실내', night: '야간 불빛', studio: '조명 장비', unknown: '' },
  dofLabel: { shallow: '배경 강하게 흐림', medium: '배경 적당히 분리', deep: '앞뒤 선명' },
  focalLabel: { tele: '망원 느낌', wide: '광각 느낌', normal: '' },
  artificial: { what: '조명 장비 느낌', why: '플래시·스튜디오 조명을 쓴 사진', alt: '설정만으론 재현 불가. 배경 흐림·색감만 가져오기', linkSceneId: null },
  rim: { what: '머리카락 테두리 빛', why: '햇빛을 등진 역광이라 지금 빛으론 안 됨', alt: '오후 4시 이후 창가·야외. 실내면 스탠드를 뒤쪽 45도에', linkSceneId: 'backlit' },
  mismatch: [
    { photo: ['sunny', 'backlit'], now: ['window', 'home', 'dim', 'night'], what: '1/1000 이상의 쨍한 정지', why: '밝기 부족', alt: '밝은 곳으로', linkSceneId: 'outdoorSunny' },
    { photo: ['night'], now: ['sunny', 'backlit', 'shade', 'overcast', 'window'], what: '배경 불빛 보케', why: '불빛이 없음', alt: '해 진 뒤 간판·가로등 앞', linkSceneId: 'nightPortrait' },
    { photo: ['overcast', 'shade'], now: ['sunny'], what: '부드러운 그림자', why: '직사광', alt: '그늘로', linkSceneId: 'outdoorShade' },
    { photo: ['window'], now: ['sunny'], what: '한쪽에서 오는 부드러운 창빛', why: '직사광은 그림자가 강함', alt: '그늘 가장자리 또는 창가 실내', linkSceneId: 'indoorWindow' },
  ],
};

function matchFeatures(features, currentSceneId, currentSubjectId, cameraId, lensId, ownedLensIds) {
  const f = validateFeatures(features);
  const camera = byId(CAMERAS, cameraId);
  const scene = byId(SCENES, currentSceneId);
  const lens = byId(LENSES, lensId);
  const notes = f.notes.slice();

  // (d) 피사체 기본값
  const subjectId = currentSubjectId || ((f.subject === 'kid' && f.motion === 'frozen') ? 'kid' : 'still');
  if (f.motion === 'blur') notes.push('흔들림 효과는 이 앱이 다루지 않음');

  // (b) 조리개 override (숫자는 compute()로 넘길 뿐 features에서 오지 않음)
  const override = {};
  if (f.dof === 'deep') override.aperture = 5.6;
  const settings = compute(camera.id, scene.id, subjectId, lens.id, override);

  // (b)(c) 렌즈 요구 → (i) 판정
  const req = {};
  if (f.dof === 'shallow') req.maxAp = 2.2;
  if (f.focalFeel === 'tele') req.minFocal = 85;
  const meets = (l) => (req.maxAp == null || l.apMin <= req.maxAp) && (req.minFocal == null || Math.round(l.tele * camera.crop) >= req.minFocal);
  const lensOk = meets(lens);
  let lensWarning = null;
  if (!lensOk) {
    const need = [req.maxAp != null && lens.apMin > req.maxAp ? `f/${req.maxAp} 이하 밝은 렌즈` : null,
      req.minFocal != null && Math.round(lens.tele * camera.crop) < req.minFocal ? `${req.minFocal}mm 이상 (환산)` : null].filter(Boolean).join(' + ');
    const okLenses = (ownedLensIds || []).map((id) => byId(LENSES, id)).filter((l) => l && lensCompatible(camera, l) && meets(l)).map((l) => l.id);
    lensWarning = { need: okLenses.length ? need : `${need} (내 렌즈 중엔 없음)`, okLenses };
  }
  const apOk = req.maxAp == null || lens.apMin <= req.maxAp;
  const focalOk = req.minFocal == null || Math.round(lens.tele * camera.crop) >= req.minFocal;

  // (a)(e) sameSceneId
  let sameSceneId = f.lightConfidence >= 0.5 ? (MATCH.lightToScene[f.light] || null) : null;
  if ((f.rimLight || f.light === 'backlit') && f.lightConfidence >= 0.5) sameSceneId = 'backlit';

  const possible = [], impossible = [];

  // (g) 인공 조명 맨 위 고정
  if (f.artificialLight || f.light === 'studio') impossible.push(Object.assign({}, MATCH.artificial));

  // (e) 역광
  if (f.rimLight || f.light === 'backlit') {
    if (scene.id === 'backlit') possible.push({ what: '머리카락 테두리 빛 (해를 등지고)', how: `해를 등지게 세우고 노출보정 ${fmtEC(settings.ec)}` });
    else impossible.push(Object.assign({}, MATCH.rim));
  }

  // (f) 빛 불일치
  const nowLight = MATCH.sceneToLight[scene.id];
  if (f.light !== 'unknown' && f.light !== 'studio' && MATCH.family[f.light] !== MATCH.family[nowLight]) {
    for (const m of MATCH.mismatch) {
      if (m.photo.includes(f.light) && m.now.includes(nowLight) && !impossible.some((x) => x.what === m.what)) {
        impossible.push({ what: m.what, why: m.why, alt: m.alt, linkSceneId: m.linkSceneId });
      }
    }
  }

  // (b) 심도
  if (f.dof === 'shallow' && apOk) possible.push({ what: '배경 강하게 흐림', how: `f/${settings.aperture}, 피사체와 배경 3m 이상 떼기` });
  if (f.dof === 'medium') possible.push({ what: '적당한 배경 분리', how: `f/${settings.aperture}, 눈에 초점` });
  if (f.dof === 'deep') possible.push({ what: '앞뒤 모두 선명', how: `f/${settings.aperture}, 가운데 사람 얼굴에 초점` });

  // (c) 화각
  let moveTip = null;
  if (f.focalFeel === 'tele') {
    if (focalOk) possible.push({ what: '망원 압축감', how: '85mm 이상으로 당겨서, 배경은 멀리' });
    else moveTip = '아이에게 더 가까이, 배경은 더 멀리';
  } else if (f.focalFeel === 'wide') {
    moveTip = '24~35mm 쪽으로 (요구 아님, 분위기)';
  }

  // (h) 색감
  const ps = [], edit = [];
  if (f.color.saturation === 'high') { ps.push('채도 +2'); edit.push('채도 +15'); }
  if (f.color.saturation === 'low') { ps.push('채도 -2'); edit.push('채도 -15'); }
  if (f.color.warmth === 'warm') { ps.push('WB 분위기 우선 유지'); edit.push('따뜻함 +10'); }
  if (f.color.warmth === 'cool') { ps.push('Q → WB 화이트 우선'); edit.push('따뜻함 -10'); }
  if (f.color.contrast === 'high') { ps.push('콘트라스트 +1'); edit.push('대비 +10'); }
  const colorTips = { ps: ps.join(', '), edit: `색감의 절반은 보정이에요. 라이트룸: ${edit.length ? edit.join(', ') : '기본값 그대로'}` };
  if (ps.length) possible.push({ what: '색감 (픽처스타일)', how: colorTips.ps });

  // (j) 최소 보장
  if (!possible.length) possible.push({ what: '초점·노출 기본 세팅', how: `${settings.af} · 노출보정 ${fmtEC(settings.ec)}` });

  // summary
  const colorLabel = f.color.warmth === 'warm' && f.color.saturation === 'high' ? '따뜻한 채도'
    : f.color.warmth === 'warm' ? '따뜻한 톤' : f.color.warmth === 'cool' ? '차가운 톤'
    : f.color.saturation === 'high' ? '채도 높음' : f.color.saturation === 'low' ? '채도 낮음' : '';
  const summary = [MATCH.lightLabel[f.light], MATCH.dofLabel[f.dof], colorLabel, MATCH.focalLabel[f.focalFeel]].filter(Boolean).join(' · ');

  return { settings, summary, sameSceneId, possible, impossible, lensWarning, colorTips, moveTip, subjectId, features: f, notes };
}
