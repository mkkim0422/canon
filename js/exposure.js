// 노출 계산. 공식은 docs/facts.md 공식 절. 데이터는 data.js.
// compute(cameraId, sceneId, subjectId, lensId, override) → 설정값 + 예상 결과 + 플래그. 문구는 만들지 않는다(dials.js).

const log2 = (x) => Math.log(x) / Math.LN2;
const byId = (arr, id) => arr.find((x) => x.id === id);

function nearest(table, v) {
  let best = table[0], bd = Infinity;
  for (const x of table) {
    const d = Math.abs(log2(x) - log2(v));
    if (d < bd) { bd = d; best = x; }
  }
  return best;
}
// v 이상 중 가장 가까운 값 (조리개 조이기)
function atLeast(table, v) {
  const c = table.filter((x) => x >= v - 1e-9);
  return c.length ? c.reduce((a, b) => (Math.abs(a - v) < Math.abs(b - v) ? a : b)) : table[table.length - 1];
}
// v 이하 중 가장 가까운 값 (셔터: 이보다 느려지면 안 됨)
function atMost(table, v) {
  const c = table.filter((x) => x <= v + 1e-9);
  return c.length ? c.reduce((a, b) => (Math.abs(a - v) < Math.abs(b - v) ? a : b)) : table[table.length - 1];
}

function fmtShutter(t) {
  if (t >= 1) return (Number.isInteger(t) ? t : +t.toFixed(1)) + '초';
  if (t >= 0.3) return t.toFixed(1) + '초';
  return '1/' + Math.round(1 / t);
}
function fmtEC(ec) {
  if (!ec) return '0';
  return (ec > 0 ? '+' : '') + (+ec.toFixed(1));
}

// 바디·렌즈 마운트 호환. EF 바디 + RF 렌즈는 불가. RF 바디 + EF 렌즈는 어댑터.
function lensCompatible(camera, lens) {
  return camera.mount === lens.mount || (camera.mount === 'RF' && lens.mount === 'EF');
}
// 같은 마운트(네이티브) 렌즈를 먼저, 어댑터 렌즈를 뒤에
function compatibleLenses(camera) {
  return LENSES.filter((l) => lensCompatible(camera, l)).sort((a, b) => (a.mount === camera.mount ? 0 : 1) - (b.mount === camera.mount ? 0 : 1));
}

// 바디에서 쓸 수 있는 표준값 (셔터 최고속·ISO 범위로 자름)
function tablesFor(camera) {
  return {
    shutters: SHUTTERS.filter((t) => t >= camera.shutterFastest - 1e-12 && t <= camera.shutterLongest),
    isos: ISOS.filter((i) => i >= camera.isoMin && i <= camera.isoMax),
  };
}

function compute(cameraId, sceneId, subjectId, lensId, ov = {}) {
  const camera = byId(CAMERAS, cameraId);
  const scene = byId(SCENES, sceneId);
  const subject = byId(SUBJECTS, subjectId);
  const lens = byId(LENSES, lensId);
  const light = byId(LIGHTS, ov.light || scene.light);
  const mode = ov.mode || scene.mode;
  // 조합 예외: '렌즈id.피사체' → 'slow|fast.피사체'(최대 개방 f/4 이상이면 slow) → '*.피사체'
  const pc = scene.perCombo || {};
  const combo = pc[lens.id + '.' + subject.id] || pc[(lens.apMin >= 4 ? 'slow' : 'fast') + '.' + subject.id] || pc['*.' + subject.id] || null;
  const T = tablesFor(camera);

  // 조리개: override.aperture → apRule(override 우선, 없으면 scene.apRule, 기본 'portrait') → 렌즈 범위로 클램프
  //   'portrait' = lens.portraitAp (f/1.4→2, f/1.8·2→2.2, f/2.8→2.8, f/4→4), 'wideOpen' = lens.apMin
  const apRule = ov.apRule || scene.apRule || 'portrait';
  let ap = ov.aperture != null ? ov.aperture : apRule === 'wideOpen' ? lens.apMin : lens.portraitAp;
  const apNotes = [];
  if (ap < lens.apMin) { apNotes.push(`이 렌즈 최대 개방 f/${lens.apMin}에 맞춤`); ap = lens.apMin; }
  if (ap > lens.apMax) ap = lens.apMax;
  ap = nearest(APERTURES, ap);

  const ec = ov.ec != null ? ov.ec : scene.ec;
  const evEff = light.ev - ec;

  // 셔터 하한: 피사체 움직임과 핸드헬드 한계(환산 초점거리) 중 빠른 쪽
  const effFocal = Math.round(lens.portraitFocal * camera.crop);
  // IS 여유 = 2^(isStops−2)배 (isStops 미확인이면 isStopsDefault=4 → ×4), 상한 1/15. diagnose.js와 같은 규칙.
  const isStops = lens.is ? (lens.isStops != null ? lens.isStops : CAMERA_COMMON.isStopsDefault) : 0;
  const slack = lens.is ? Math.pow(2, Math.max(0, isStops - 2)) : 1;
  const hand = ov.tripod ? Infinity : Math.min(CAMERA_COMMON.handheldCap, slack / effFocal);
  const minShutter = ov.minShutter != null ? ov.minShutter : (combo && combo.minShutter) || subject.minShutter;
  const tReq = atMost(T.shutters, Math.min(minShutter, hand));
  const isoMax = ov.isoMax != null ? ov.isoMax : camera.isoUsable;

  const isoFor = (t) => (100 * ap * ap) / (t * Math.pow(2, evEff));
  const tFor = (iso) => (ap * ap * 100) / (iso * Math.pow(2, evEff));

  // 조정 규칙 조립: perCombo 앞/뒤 + 상황(또는 override) 규칙
  const adjust = (ov.adjust || scene.adjust).slice();
  if (combo && combo.adjustFirst) adjust.unshift(combo.adjustFirst);
  if (combo && combo.adjustLast) adjust.push(combo.adjustLast);

  const isKid = subject.id === 'kid';
  const afAreaName = isKid ? camera.afAreaKid : camera.afAreaStill;
  const r = {
    camera, scene, subject, lens, light, mode, aperture: ap, apRule, ec, isoMax, minShutter: tReq,
    ev: light.ev, est: !!light.est, evEff, apNotes, flags: [],
    effFocal, cropNote: camera.crop !== 1 ? `환산 ${effFocal}mm` : '',
    adapter: camera.mount === 'RF' && lens.mount === 'EF',
    wb: WB[ov.wb || scene.wb], ps: ov.ps || scene.ps, metering: ov.metering || scene.metering,
    af: camera.afModes[subject.id], afAreaName,
    afArea: ov.afArea || `${afAreaName}. ${subject.afAreaHint}`,
    drive: ov.drive || (isKid ? `연속 고속 (${camera.burstFps}컷/초)` : '1매'), afTip: subject.afTip,
    why: ov.why || scene.why, adjust, tips: ov.tips || scene.tips || [],
    dialExtra: ov.dialExtra || [],
    cmode: camera.hasCModes ? camera.cModes[isKid ? 1 : 0] : null, minShutterDefault: subject.minShutter,
    tripod: !!ov.tripod,
  };

  let iso = null, t = null;

  // M에서 ISO를 지정한 경우: 그 ISO로 셔터가 충분히 빠른지 확인
  if (mode === 'M' && ov.iso) {
    const tt = tFor(ov.iso);
    if (tt <= tReq && tt >= camera.shutterFastest) { iso = ov.iso; t = nearest(T.shutters, tt); }
  }

  if (iso == null) {
    const need = isoFor(tReq);
    if (need <= camera.isoMin) {
      iso = camera.isoMin;
      t = tFor(iso);
      if (t < camera.shutterFastest) {
        // 바디 최고 셔터를 넘는 빛: 조리개를 자동으로 조인다 (1/4000 바디는 f/3.2, 1/8000 바디는 f/2.2 유지 등).
        const nNeed = atLeast(APERTURES, Math.sqrt(Math.pow(2, evEff) * camera.shutterFastest * 100 / camera.isoMin));
        if (nNeed <= lens.apMax) {
          ap = nNeed;
          r.autoStopped = true;
          apNotes.push(`빛이 강해 조리개를 f/${ap}로 조임 (최고 셔터 ${fmtShutter(camera.shutterFastest)})`);
          t = tFor(iso);
        } else {
          r.flags.push({ type: 'tooBright', aperture: nNeed });
          t = camera.shutterFastest;
        }
      }
      t = nearest(T.shutters, t);
    } else {
      t = tReq;
      iso = nearest(T.isos, need);
      const cap = mode === 'Av' ? isoMax : camera.isoHard;
      if (iso > cap) {
        const tSlow = nearest(T.shutters, Math.min(tFor(cap), camera.shutterLongest));
        r.flags.push({ type: mode === 'Av' ? 'isoCapped' : 'tooDark', isoNeeded: iso, cap, shutter: tSlow });
        iso = cap;
        t = tSlow;
      }
    }
  }

  r.aperture = ap;
  r.shutter = t;
  r.iso = iso;
  return r;
}

// 플래그 → 현장 조정 규칙 [조건, 조치] (상황 고유 규칙 앞에 붙음)
function flagRules(r) {
  const out = [];
  const hard = r.camera.isoHard;
  for (const f of r.flags) {
    if (f.type === 'tooBright') {
      out.push(['셔터가 깜빡이면 (빛이 너무 강함)', `조리개를 f/${f.aperture}로 조이기`]);
    } else if (f.type === 'isoCapped') {
      out.push([`지금 밝기면 ISO 상한 ${f.cap}에 걸려 셔터가 ${fmtShutter(f.shutter)}까지 느려지므로`, `MENU → ISO speed settings → Auto range → ${hard}, 또는 더 밝은 자리로`]);
      if (r.lens.apMin >= 4) out.push(['', 'f/1.8~2 단렌즈로 바꾸면 f/2.2에서 빛을 3배 더 받아 ISO가 1.5스톱 내려감']);
    } else if (f.type === 'tooDark') {
      out.push([`ISO ${f.cap}에서도 셔터가 ${fmtShutter(f.shutter)}라 흔들리면`, '얼굴에 빛이 닿는 자리로 이동하거나 피사체를 멈추게 하기']);
    }
  }
  return out;
}
