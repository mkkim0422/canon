// data.js의 모든 값을 docs/facts.md와 대조하고, 상황별 계산표를 facts.md에 다시 쓴다.
// 실행: node check.js      (실패가 있으면 종료 코드 1)
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = __dirname;
const factsPath = path.join(root, 'docs', 'facts.md');
const factsMd = fs.readFileSync(factsPath, 'utf8');

// 1) facts.md의 기준값 블록
const m = factsMd.match(/```json facts\n([\s\S]*?)\n```/);
if (!m) { console.error('facts.md에 ```json facts 블록이 없음'); process.exit(1); }
const F = JSON.parse(m[1]);

// 2) data.js + exposure.js + dials.js 로드
const src = ['data.js', 'exposure.js', 'dials.js'].map((f) => fs.readFileSync(path.join(root, 'js', f), 'utf8')).join('\n') +
  '\n;({ CAMERA_COMMON, CAMERAS, APERTURES, SHUTTERS, ISOS, WB, LENSES, LIGHTS, SUBJECTS, SCENES, STYLES, SETUP_COMMON, SETUP_CMODE_STEPS, compute, flagRules, fmtShutter, fmtEC, lensCompatible, compatibleLenses, DIALS, dialSteps })';
const D = vm.runInNewContext(src, {});

const fails = [], warns = [];
const fail = (s) => fails.push(s);
const warn = (s) => warns.push(s);
const approx = (a, b) => Math.abs(a - b) / b < 1e-6;
const MENU_KEYS = ['imageQuality', 'isoAutoRange', 'minShutter', 'pictureStyle', 'wb', 'awbPriority', 'alo', 'highIsoNr', 'antiFlicker', 'customMode', 'lensAdapter'];
const FAMILIES = ['ff2dial', 'crop2dial', 'crop1dial', 'rf', 'rf1dial', 'rf2dial'];

// 3) 바디
if (!D.CAMERAS.length) fail('CAMERAS가 비어 있음');
for (const c of D.CAMERAS) {
  const f = F.cameras[c.id];
  const report = c.verified ? fail : warn;
  if (!f) { fail(`CAMERAS.${c.id}: facts.md cameras에 없음`); continue; }
  for (const k of ['isoMin', 'isoMax', 'isoAutoMaxMin', 'shutterLongest', 'crop', 'mount', 'hasCModes', 'hasMinShutter']) if (c[k] !== f[k]) report(`CAMERAS.${c.id}.${k} ${c[k]} ≠ facts ${f[k]}`);
  if (!approx(c.shutterFastest, f.shutterFastest)) report(`CAMERAS.${c.id}.shutterFastest 불일치`);
  if (!FAMILIES.includes(c.family)) fail(`CAMERAS.${c.id}.family '${c.family}' 는 ${FAMILIES.join('|')} 중 하나`);
  if (!['EF', 'RF'].includes(c.mount)) fail(`CAMERAS.${c.id}.mount`);
  if (!(c.isoUsable <= c.isoHard && c.isoHard <= c.isoMax)) fail(`CAMERAS.${c.id}: isoUsable ≤ isoHard ≤ isoMax 위반`);
  if (!D.ISOS.includes(c.isoUsable) || !D.ISOS.includes(c.isoHard)) fail(`CAMERAS.${c.id}: isoUsable/isoHard 표준값 아님`);
  if (c.hasCModes && !(Array.isArray(c.cModes) && c.cModes.length >= 2)) fail(`CAMERAS.${c.id}: hasCModes인데 cModes 2개 미만`);
  if (!c.afModes || !c.afModes.still || !c.afModes.kid) fail(`CAMERAS.${c.id}.afModes still/kid 필요`);
  if (!c.afAreaStill || !c.afAreaKid || !c.burstFps) fail(`CAMERAS.${c.id}: afAreaStill/afAreaKid/burstFps 필요`);
  if (!c.manualUrl) report(`CAMERAS.${c.id}: manualUrl 없음`);
  if (!c.name || !c.short) fail(`CAMERAS.${c.id}: name/short 필요`);
  for (const k of MENU_KEYS) {
    const e = c.menu && c.menu[k];
    if (!e) { fail(`CAMERAS.${c.id}.menu.${k} 없음`); continue; }
    const ok = e.page != null || (e.na && c.mount === 'EF' && k === 'lensAdapter');
    if (!ok) report(`CAMERAS.${c.id}.menu.${k}: page 없음 (UI에 미확인)${c.verified ? ' — verified: true 불가' : ''}`);
    if (e.page != null && !f.menuPages.includes(e.page)) report(`CAMERAS.${c.id}.menu.${k}: p.${e.page}는 facts.md menuPages에 없음`);
  }
  for (const [k, p] of Object.entries(c.pages || {})) if (!f.menuPages.includes(p)) report(`CAMERAS.${c.id}.pages.${k}: p.${p}는 facts.md menuPages에 없음`);
}

// 4) 표준값 표 (전역 표는 모든 바디 범위를 포함, 바디별로는 tablesFor가 자름)
for (const l of D.LIGHTS) {
  const f = F.lights[l.id];
  if (!f) { fail(`LIGHTS.${l.id}: facts.md에 없음`); continue; }
  if (l.ev !== f.ev) fail(`LIGHTS.${l.id}.ev ${l.ev} ≠ facts ${f.ev}`);
  if (!!l.est !== !!f.est) fail(`LIGHTS.${l.id}.est 표시 불일치 (facts: ${!!f.est})`);
}

// 5) 렌즈
for (const l of D.LENSES) {
  const f = F.lenses[l.id];
  if (!f) { fail(`LENSES.${l.id}: facts.md에 없음`); continue; }
  for (const k of ['mount', 'wide', 'tele', 'apMin', 'apMax', 'is', 'minFocus']) if (l[k] !== f[k]) fail(`LENSES.${l.id}.${k} ${l[k]} ≠ facts ${f[k]}`);
  if (f.isStops != null && l.isStops !== f.isStops) fail(`LENSES.${l.id}.isStops 불일치`);
  if (l.portraitFocal < l.wide || l.portraitFocal > l.tele) fail(`LENSES.${l.id}.portraitFocal 범위 밖`);
  // portraitAp 규칙: f/1.4→2, f/1.8·2→2.2, f/2.8→2.8, f/4→4 (그 외는 apMin 그대로)
  const ruleAp = l.apMin <= 1.4 ? 2 : l.apMin <= 2 ? 2.2 : l.apMin <= 2.8 ? 2.8 : l.apMin <= 4 ? 4 : l.apMin;
  if (l.portraitAp !== ruleAp) fail(`LENSES.${l.id}.portraitAp ${l.portraitAp} ≠ 규칙값 ${ruleAp}`);
  if (!D.APERTURES.includes(l.portraitAp)) fail(`LENSES.${l.id}.portraitAp 표준값 아님`);
  if (l.is && l.isStops == null) warn(`LENSES.${l.id}: IS 스톱 수 미확인 → isStopsDefault(${D.CAMERA_COMMON.isStopsDefault}) 적용`);
  if (!l.chip || !l.tab) fail(`LENSES.${l.id}: chip/tab 표기 필요`);
}

// 6) 피사체
for (const s of D.SUBJECTS) {
  if (!D.SHUTTERS.some((x) => approx(x, s.minShutter))) fail(`SUBJECTS.${s.id}.minShutter가 표준값 아님`);
  if (!s.afAreaHint || !s.afTip) fail(`SUBJECTS.${s.id}: afAreaHint/afTip 필요`);
}

// 조정 규칙 문구 검사
function checkRule(label, rule, isM) {
  if (!Array.isArray(rule) || rule.length !== 2 || typeof rule[0] !== 'string' || typeof rule[1] !== 'string') { fail(`${label}: [조건, 조치] 쌍이 아님`); return; }
  const [c, a] = rule;
  if (!a) fail(`${label}: 조치가 비었음`);
  if (/\.\s*$/.test(a)) fail(`${label}: 조치 끝에 마침표 "${a}"`);
  if (/\.\s*$/.test(c)) fail(`${label}: 조건 끝에 마침표 "${c}"`);
  if (/^[+-]\d/.test(a)) fail(`${label}: 조치가 "+x"로 시작. "노출보정 +x" 형태로: "${a}"`);
  if (/(^|[^출])보정 [+-]?\d/.test(a)) fail(`${label}: "보정"은 "노출보정"으로: "${a}"`);
  if (!isM && /12800|\{isoHard\}/.test(a) && !/Auto range|Max for Auto/.test(a)) fail(`${label}: ISO 상한 변경은 메뉴 경로(Auto range 또는 Max for Auto) 포함: "${a}"`);
  if (/12800/.test(a)) fail(`${label}: 바디별 비상 상한은 {isoHard} 플레이스홀더로: "${a}"`);
}

// 7) 상황
if (D.SCENES.length !== 8) fail(`상황은 8개 고정인데 ${D.SCENES.length}개`);
for (const s of D.SCENES) {
  if (!D.LIGHTS.find((l) => l.id === s.light)) fail(`SCENES.${s.id}.light '${s.light}' 없음`);
  if (!['Av', 'M'].includes(s.mode)) fail(`SCENES.${s.id}.mode는 Av 또는 M`);
  if ('aperture' in s) fail(`SCENES.${s.id}.aperture: 렌즈별 숫자 금지. apRule('portrait'|'wideOpen')로`);
  if (s.apRule && !['portrait', 'wideOpen'].includes(s.apRule)) fail(`SCENES.${s.id}.apRule '${s.apRule}'`);
  if (Math.abs(s.ec) > F.ecMax) fail(`SCENES.${s.id}.ec 범위 밖`);
  if ('isoMax' in s) fail(`SCENES.${s.id}.isoMax는 바디(isoUsable)에서 읽는다. 상황에 두지 말 것`);
  if (s.wb !== 'awbAmb') fail(`SCENES.${s.id}.wb는 전 상황 'awbAmb' (프리셋은 조정 규칙으로)`);
  if (!F.pictureStyles.some((p) => s.ps.startsWith(p))) fail(`SCENES.${s.id}.ps '${s.ps}' 픽처스타일 아님`);
  if (!Array.isArray(s.adjust) || s.adjust.length < 2 || s.adjust.length > 4) fail(`SCENES.${s.id}.adjust는 2~4개`);
  (s.adjust || []).forEach((r, i) => checkRule(`SCENES.${s.id}.adjust[${i}]`, r, s.mode === 'M'));
  if (!s.why) fail(`SCENES.${s.id}.why 없음`);
  if (!s.sub) fail(`SCENES.${s.id}.sub(카드 부제) 없음`);
  if (!Array.isArray(s.tips)) fail(`SCENES.${s.id}.tips 배열 필요`);
  for (const [key, c] of Object.entries(s.perCombo || {})) {
    const [lensId, subId] = key.split('.');
    const lensOk = ['*', 'slow', 'fast'].includes(lensId) || D.LENSES.find((l) => l.id === lensId);
    if (!lensOk || !D.SUBJECTS.find((u) => u.id === subId)) fail(`SCENES.${s.id}.perCombo '${key}' 키는 '렌즈id|slow|fast|*.피사체'`);
    if (c.minShutter != null && !D.SHUTTERS.some((x) => approx(x, c.minShutter))) fail(`SCENES.${s.id}.perCombo '${key}' minShutter 표준값 아님`);
    if (c.adjustFirst) checkRule(`SCENES.${s.id}.perCombo '${key}'.adjustFirst`, c.adjustFirst, s.mode === 'M');
    if (c.adjustLast) checkRule(`SCENES.${s.id}.perCombo '${key}'.adjustLast`, c.adjustLast, s.mode === 'M');
  }
}

// 8) 스타일
if (D.STYLES.length !== 9) fail(`스타일은 9개인데 ${D.STYLES.length}개`);
for (const st of D.STYLES) {
  const sc = D.SCENES.find((s) => s.id === st.scene);
  if (!sc) fail(`STYLES.${st.id}.scene '${st.scene}' 없음`);
  if (!D.SUBJECTS.find((s) => s.id === st.subject)) fail(`STYLES.${st.id}.subject 없음`);
  const lens = D.LENSES.find((l) => l.id === st.lens);
  if (!lens) fail(`STYLES.${st.id}.lens 없음`);
  const o = st.override || {};
  if (o.aperture != null && lens && (o.aperture < lens.apMin || o.aperture > lens.apMax)) fail(`STYLES.${st.id}.override.aperture 렌즈 범위 밖`);
  if (o.ec != null && Math.abs(o.ec) > F.ecMax) fail(`STYLES.${st.id}.override.ec 범위 밖`);
  if (o.iso != null && !D.ISOS.includes(o.iso)) fail(`STYLES.${st.id}.override.iso 표준값 아님`);
  if (o.minShutter != null && !D.SHUTTERS.some((x) => approx(x, o.minShutter))) fail(`STYLES.${st.id}.override.minShutter 표준값 아님`);
  if (o.light && !D.LIGHTS.find((l) => l.id === o.light)) fail(`STYLES.${st.id}.override.light 없음`);
  if (o.wb && !D.WB[o.wb]) fail(`STYLES.${st.id}.override.wb 없음`);
  if (o.mode && !['Av', 'M'].includes(o.mode)) fail(`STYLES.${st.id}.override.mode`);
  if (o.adjust) {
    if (o.adjust.length < 2 || o.adjust.length > 4) fail(`STYLES.${st.id}.override.adjust는 2~4개`);
    o.adjust.forEach((r, i) => checkRule(`STYLES.${st.id}.override.adjust[${i}]`, r, (o.mode || (sc && sc.mode)) === 'M'));
  }
  if (o.dialExtra && !Array.isArray(o.dialExtra)) fail(`STYLES.${st.id}.override.dialExtra 배열 필요`);
  if (o.mode && sc && o.mode !== sc.mode && !o.why) fail(`STYLES.${st.id}: 모드를 바꾸면 override.why로 이유를 써야 함`);
  if (!st.recommend || typeof st.recommend !== 'object') fail(`STYLES.${st.id}.recommend 필요 (빈 객체 허용)`);
  else for (const k of Object.keys(st.recommend)) if (!['maxAp', 'minFocal', 'maxWide'].includes(k)) fail(`STYLES.${st.id}.recommend.${k}: maxAp|minFocal|maxWide만`);
  if (o.apRule && !['portrait', 'wideOpen'].includes(o.apRule)) fail(`STYLES.${st.id}.override.apRule`);
  if (!st.conditions || !st.failure) fail(`STYLES.${st.id}: conditions/failure 필요`);
  if (!('image' in st)) fail(`STYLES.${st.id}: image 슬롯 필요 (null 허용)`);
  if (st.image && !fs.existsSync(path.join(root, st.image))) fail(`STYLES.${st.id}.image '${st.image}' 파일 없음`);
  if (st.image) { const sz = fs.statSync(path.join(root, st.image)).size; if (sz > 300 * 1024) fail(`STYLES.${st.id}.image ${Math.round(sz / 1024)}KB > 300KB`); }
}

// 9) 설정 항목: 공통 항목 key는 menu 키여야 하고, C 모드 단계의 pageKey/menuKey가 바디에 있어야 함
const OPTIONAL_MENU_KEYS = ['subjectDetect', 'shutterMode', 'afOperation', 'afArea', 'driveMode']; // 미러리스 전용 선택 키
for (const s of D.SETUP_COMMON) {
  if (!MENU_KEYS.concat(OPTIONAL_MENU_KEYS).includes(s.key)) fail(`SETUP_COMMON '${s.title}': key '${s.key}'는 menu 키가 아님`);
  if (OPTIONAL_MENU_KEYS.includes(s.key) && s.onlyIf !== s.key) fail(`SETUP_COMMON '${s.title}': 선택 키는 onlyIf: '${s.key}' 필요 (DSLR에서 숨김)`);
}
for (const c of D.CAMERAS) for (const [k, e] of Object.entries(c.menu)) {
  if (!MENU_KEYS.concat(OPTIONAL_MENU_KEYS).includes(k)) fail(`CAMERAS.${c.id}.menu.${k}: 알 수 없는 키`);
  if (OPTIONAL_MENU_KEYS.includes(k) && e.page != null && F.cameras[c.id] && !F.cameras[c.id].menuPages.includes(e.page)) (c.verified ? fail : warn)(`CAMERAS.${c.id}.menu.${k}: 페이지가 facts.md에 없음`);
}
for (const s of D.SETUP_COMMON) if (/하이라이트 톤 우선|Highlight tone/.test(s.title)) fail('SETUP에 하이라이트 톤 우선 금지 (최저 ISO 200 → 야외 맑음 1/4000 초과)');
for (const c of D.CAMERAS.filter((x) => x.hasCModes)) for (const s of D.SETUP_CMODE_STEPS) {
  const keys = [].concat(s.pageKey || [], s.pageKeys || []);
  for (const k of keys) if (!c.pages || c.pages[k] == null) (c.verified ? fail : warn)(`CAMERAS.${c.id}.pages.${k} 없음 (C 모드 단계 '${s.title}')`);
  for (const k of [].concat(s.menuKey || [], s.menuKeys || [])) if (!c.menu[k]) fail(`CAMERAS.${c.id}.menu.${k} 없음 (C 모드 단계 '${s.title}')`);
}

// 10) 다이얼 템플릿: family 4종 모두 av/m이 문자열 배열을 돌려주는지
const sampleR = D.compute(D.CAMERAS[0].id, 'outdoorShade', 'still', D.compatibleLenses(D.CAMERAS[0])[0].id);
for (const fam of FAMILIES) {
  const t = D.DIALS[fam];
  if (!t || typeof t.av !== 'function' || typeof t.m !== 'function') { fail(`DIALS.${fam}: av/m 함수 필요`); continue; }
  const rr = Object.assign({}, sampleR, { camera: Object.assign({}, sampleR.camera, { family: fam }) });
  for (const mode of ['av', 'm']) {
    const out = t[mode](rr);
    if (!Array.isArray(out) || !out.length || out.some((x) => typeof x !== 'string')) fail(`DIALS.${fam}.${mode}: 문자열 배열이어야 함`);
  }
}
if (!/C1|C2/.test(D.DIALS.ff2dial.av(sampleR)[0])) fail('DIALS.ff2dial.av 첫 단계는 C 모드 다이얼이어야 함');
// 10c) 최소 셔터 메뉴가 없는 바디(hasMinShutter: false): 움직이는 아이는 M + ISO AUTO(r.mAuto, 첫 단계 M), 가만히 있는 사람은 Av. C 모드도 없어야 한다.
for (const cam of D.CAMERAS.filter((x) => x.hasMinShutter === false)) {
  const l = D.compatibleLenses(cam)[0].id;
  const kid = D.compute(cam.id, 'outdoorShade', 'kid', l), still = D.compute(cam.id, 'outdoorShade', 'still', l);
  if (!kid.mAuto || !/<b>M<\/b>/.test(D.dialSteps(kid)[0])) fail(`${cam.short}: 최소 셔터 메뉴 없음 → 움직이는 아이는 M + ISO AUTO여야 함`);
  if (still.mAuto || !/<b>Av<\/b>/.test(D.dialSteps(still)[0])) fail(`${cam.short}: 가만히 있는 사람은 Av여야 함`);
  if (cam.hasCModes) fail(`${cam.short}: hasMinShutter false인데 hasCModes true (C 모드 등록 단계에 Min. shutter spd.가 들어감)`);
  if (!cam.menu.minShutter.na) fail(`${cam.short}: menu.minShutter.na 필요 (설정 없음 표기)`);
}

// 10b) portraitAp 적용 확인: 모든 바디×렌즈에서 야외 그늘(Av) 조리개 = lens.portraitAp
for (const cam of D.CAMERAS) for (const l of D.compatibleLenses(cam)) {
  const r = D.compute(cam.id, 'outdoorShade', 'still', l.id);
  if (r.aperture !== l.portraitAp) fail(`${cam.short}×${l.id}: 야외 그늘 조리개 f/${r.aperture} ≠ portraitAp f/${l.portraitAp}`);
}
// 11) 1/8000 바디에서 야외 맑음 자동 조임이 덜 조여지는지 (shutterFastest를 바디에서 읽는지)
{
  const base = D.CAMERAS[0];
  const fast = Object.assign({}, base, { id: '_test8000', shutterFastest: 1 / 8000 });
  D.CAMERAS.push(fast);
  const a4000 = D.compute(base.id, 'outdoorSunny', 'still', 'ef50', { aperture: 1.8 });
  const a8000 = D.compute(fast.id, 'outdoorSunny', 'still', 'ef50', { aperture: 1.8 });
  D.CAMERAS.pop();
  if (!a4000.autoStopped || a4000.aperture <= 1.8) fail('1/4000 바디에서 야외 맑음 f/1.8은 자동으로 조여져야 함');
  if (!(a8000.aperture < a4000.aperture)) fail(`1/8000 바디의 자동 조임(f/${a8000.aperture})이 1/4000 바디(f/${a4000.aperture})보다 덜 조여져야 함`);
}

// 12) 전체 조합 계산 + 범위 검사 + 표 생성 (CAMERAS × 호환 LENSES × SCENES × SUBJECTS, 스타일은 바디별 권장 렌즈 또는 첫 호환 렌즈)
const rows = [];
let comboCount = 0;
function checkResult(label, r, isDefault) {
  const cam = r.camera, report = cam.verified ? fail : warn;
  comboCount++;
  if (isDefault && r.flags.some((f) => f.type === 'tooDark' || f.type === 'tooBright')) report(`${label}: 기본 조합에 ${r.flags.map((f) => f.type).join(',')} 플래그. 조리개·최소 셔터를 조정할 것`);
  if (!(r.aperture >= r.lens.apMin && r.aperture <= r.lens.apMax)) fail(`${label}: 조리개 f/${r.aperture} 렌즈 범위 밖`);
  if (r.shutter < cam.shutterFastest - 1e-9 || r.shutter > cam.shutterLongest) fail(`${label}: 셔터 ${r.shutter} 바디 범위 밖`);
  if (r.iso < cam.isoMin || r.iso > cam.isoMax) fail(`${label}: ISO ${r.iso} 바디 범위 밖`);
  if (!Number.isFinite(r.shutter) || !Number.isFinite(r.iso)) fail(`${label}: NaN`);
  // minShutterCap 바디(6D 1/250)는 상한으로 묶인 경우를 허용(flag minShutterCapped, 현장 조정에 M + ISO AUTO 안내)
  if (r.mode === 'Av' && r.minShutter > r.subject.minShutter + 1e-9 && !r.flags.some((f) => f.type === 'minShutterCapped') && r.minShutterSource === 'subject') fail(`${label}: 최소 셔터가 피사체 기준보다 느림`);
  D.flagRules(r).forEach((rule, i) => checkRule(`${label} flagRules[${i}]`, rule, r.mode === 'M'));
  const steps = D.dialSteps(r);
  if (!steps.length) fail(`${label}: 다이얼 문구 없음`);
  const flag = r.flags.map((f) => f.type).join(',');
  const ev = `${r.ev}${r.est ? '*' : ''}${r.ec ? ` − (${D.fmtEC(r.ec)})` : ''} = ${r.evEff}`;
  const check = `${r.aperture}² × 100 ÷ (${r.iso} × 2^${r.evEff}) = ${D.fmtShutter((r.aperture * r.aperture * 100) / (r.iso * Math.pow(2, r.evEff)))}`;
  rows.push(`| ${label} | ${r.mode} | f/${r.aperture} | ${D.fmtEC(r.ec)} | ${r.mode === 'Av' ? r.isoMax : '-'} | ${D.fmtShutter(r.minShutter)} | ${ev} | ${D.fmtShutter(r.shutter)} | ${r.iso} | ${check} | ${flag || '-'} |`);
}
for (const cam of D.CAMERAS) {
  const lenses = D.compatibleLenses(cam);
  if (!lenses.length) fail(`CAMERAS.${cam.id}: 호환 렌즈 없음`);
  rows.push(`| **${cam.name}** | | | | | | | | | | |`);
  for (const s of D.SCENES) for (const lens of lenses) for (const sub of D.SUBJECTS) {
    checkResult(`${cam.short} / ${s.label} / ${lens.short} / ${sub.label}`, D.compute(cam.id, s.id, sub.id, lens.id), true);
  }
  rows.push(`| **${cam.name} · 원하는 사진** | | | | | | | | | | |`);
  for (const st of D.STYLES) {
    const lens = lenses.find((l) => l.id === st.lens) || lenses[0];
    checkResult(`${cam.short} / ${st.title} (${lens.short})`, D.compute(cam.id, st.scene, st.subject, lens.id, st.override));
  }
}

const table = [
  '| 바디 / 상황 / 렌즈 / 피사체 | 모드 | 조리개 | 보정 | ISO 상한 | 최소 셔터 | EV 계산 (EV − 보정) | 예상 셔터 | 예상 ISO | 검산 t = N²·100/(S·2^EV) | 플래그 |',
  '|---|---|---|---|---|---|---|---|---|---|---|',
  ...rows,
  '',
  '`*` = 추정 EV. 플래그: isoCapped = ISO 상한 도달(카메라가 최소 셔터보다 느린 셔터 사용) · tooBright = 바디 최고 셔터 초과(조리개 조이기) · tooDark = 비상 ISO 상한으로도 부족.',
  `생성: ${new Date().toISOString().slice(0, 10)} node check.js`,
].join('\n');

const updated = factsMd.replace(/<!-- CALC:BEGIN -->[\s\S]*?<!-- CALC:END -->/, `<!-- CALC:BEGIN -->\n${table}\n<!-- CALC:END -->`);
if (updated !== factsMd) fs.writeFileSync(factsPath, updated, 'utf8');

// 13) 리포트
const verified = D.CAMERAS.filter((c) => c.verified).map((c) => c.short).join(',');
console.log(`검사 항목: CAMERAS ${D.CAMERAS.length}(검증 ${verified || '없음'}), LENSES ${D.LENSES.length}, LIGHTS ${D.LIGHTS.length}, SUBJECTS ${D.SUBJECTS.length}, SCENES ${D.SCENES.length}, STYLES ${D.STYLES.length}, SETUP 공통 ${D.SETUP_COMMON.length} + C모드 ${D.SETUP_CMODE_STEPS.length}, 다이얼 템플릿 ${FAMILIES.length}, 계산 조합 ${comboCount}, 1/8000 조임 테스트, 조정 규칙 문구 검사`);
console.log('\n' + table.split('\n').slice(0, Math.min(rows.length + 2, 60)).join('\n') + (rows.length > 58 ? '\n…(전체 표는 docs/facts.md)' : ''));
if (warns.length) console.log('\n경고:\n- ' + warns.join('\n- '));
if (fails.length) { console.log('\n실패:\n- ' + fails.join('\n- ')); process.exit(1); }
console.log('\n모든 값이 facts.md 범위 안에 있음. 계산표를 docs/facts.md에 기록함.');
