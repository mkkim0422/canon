// UI. 해시 라우팅: #home · #camera(첫 실행) · #camera.settings · #lenses · #scene.<id> · #r.<scene>.<subject> · #style.<id> · #settings
// (구분자는 점. 아티팩트 호스팅은 / 해시를 막음). 마크업만 담당. 숫자·규칙은 data.js, 계산은 exposure.js, 다이얼 문구는 dials.js.
const APP_NAME = '카메라 치트키';
const $ = (id) => document.getElementById(id);
const K = { camera: 'cck.camera', lens: 'cck.lens', recent: 'cck.recent', tab: 'cck.tab', setup: 'cck.setupDone' };

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 무시 */ } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { /* 무시 */ } },
};
// 예전 키(6d2.*) 1회 마이그레이션. 예전 사용자는 6D2 바디로 간주.
(function migrate() {
  try {
    if (localStorage.getItem(K.camera) != null || localStorage.getItem('6d2.lens') == null) return;
    for (const [o, n] of [['6d2.lens', K.lens], ['6d2.recent', K.recent], ['6d2.tab', K.tab], ['6d2.setupDone', K.setup]]) {
      const v = localStorage.getItem(o);
      if (v != null) { localStorage.setItem(n, v); localStorage.removeItem(o); }
    }
    localStorage.setItem(K.camera, JSON.stringify('eos6d2'));
  } catch (e) { /* 무시 */ }
})();

const cameraId = () => { const id = store.get(K.camera, null); return byId(CAMERAS, id) ? id : null; };
const camera = () => byId(CAMERAS, cameraId());
function lensId() {
  const cam = camera(); if (!cam) return null;
  const ok = compatibleLenses(cam);
  const id = store.get(K.lens, null);
  return ok.some((l) => l.id === id) ? id : ok[0].id;
}
const setupDone = () => !!store.get(K.setup, false);
const li = (items) => items.map((x) => `<li>${x}</li>`).join('');
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// 인라인 선 아이콘 (20px, stroke 1.5, currentColor). 꼭 필요한 곳(뒤로, 설정)만.
const svg = (d) => `<svg class="i" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICONS = {
  settings: svg('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
  back: svg('<path d="M15 5l-7 7 7 7"/>'),
};
const ic = (id) => ICONS[id] || '';
const slotImg = (src) => src ? `<img src="${esc(src)}" alt="" onerror="this.remove()">` : '';

function route() {
  const h = location.hash.replace(/^#/, '') || 'home';
  const [page, a, b] = h.split('.');
  const view = $('view');
  window.scrollTo(0, 0);
  if (page === 'camera') return renderCameraSelect(view, a === 'settings');
  if (!cameraId()) return renderCameraSelect(view, false);
  if (page === 'lenses') return renderLensCheck(view);
  if (page === 'scene' && byId(SCENES, a)) return renderSubjects(view, a);
  if (page === 'r' && byId(SCENES, a) && byId(SUBJECTS, b)) return renderResult(view, { type: 'scene', scene: a, subject: b });
  if (page === 'style' && byId(STYLES, a)) return renderResult(view, { type: 'style', id: a });
  if (page === 'settings') return renderSettings(view);
  renderHome(view);
}

function header(title, back, opts = {}) {
  const cam = camera(), l = cam && byId(LENSES, lensId());
  return `<header class="bar${back ? ' sub' : ''}">
    ${back ? `<a class="icon-btn press" href="${back}" aria-label="뒤로">${ic('back')}</a>` : ''}
    <h1>${title}</h1>
    ${opts.lens && cam ? `<a class="pill press" href="#settings">${cam.short} · ${l.chip}</a>` : ''}
    ${opts.noGear ? '' : `<a class="icon-btn press" href="#settings" aria-label="설정">${ic('settings')}</a>`}
  </header>${opts.subtitle ? `<p class="subtitle">${opts.subtitle}</p>` : ''}`;
}

const segment = (items, cur, attr, extra = '') => `<nav class="seg ${extra}" role="tablist">
  ${items.map((it) => `<button role="tab" aria-selected="${it.id === cur}" class="${it.id === cur ? 'on' : ''}" data-${attr}="${it.id}">${it.label}</button>`).join('')}
</nav>`;

// {isoSteps} {shutterSteps} → 현재 값부터 다음 3단계 "1000 → 1250 → 1600 → 2000"
function stepsFrom(table, cur, fmt) {
  const i = table.findIndex((x) => Math.abs(x - cur) / cur < 1e-6);
  if (i < 0) return fmt(cur);
  return table.slice(i, i + 4).map(fmt).join(' → ');
}
function fillSteps(text, r) {
  const T = tablesFor(r.camera);
  return text
    .replace('{isoSteps}', stepsFrom(T.isos, r.iso, (x) => String(x)))
    .replace('{shutterSteps}', stepsFrom(T.shutters, r.shutter, fmtShutter))
    .replace('{maxShutter}', fmtShutter(r.camera.shutterFastest))
    .replace(/\{isoHard\}/g, String(r.camera.isoHard));
}
// 설정 문구의 바디 값 치환
function fillCam(text, cam) {
  const c = cam.cModes || [];
  return String(text)
    .replace(/\{isoUsable\}/g, cam.isoUsable).replace(/\{isoHard\}/g, cam.isoHard)
    .replace(/\{c1\}/g, c[0] || 'C1').replace(/\{c2\}/g, c[1] || 'C2')
    .replace(/\{afStill\}/g, cam.afModes.still).replace(/\{afKid\}/g, cam.afModes.kid)
    .replace(/\{afAreaStill\}/g, cam.afAreaStill).replace(/\{afAreaKid\}/g, cam.afAreaKid)
    .replace(/\{burst\}/g, cam.burstFps);
}

// ---------- 카메라 선택 (첫 실행 / 설정에서 변경) ----------
function renderCameraSelect(view, fromSettings) {
  const cur = cameraId();
  view.innerHTML = `
    ${header(fromSettings ? '카메라 변경' : APP_NAME, fromSettings ? '#settings' : null, { noGear: true })}
    <p class="lead">${fromSettings ? '바디를 바꾸면 설정 페이지가 바뀌어 등록 완료가 초기화됩니다.' : '어떤 카메라를 쓰시나요? 한 번만 고르면 됩니다.'}</p>
    <div class="list">
      ${CAMERAS.map((c) => `<button type="button" class="card press choose ${c.id === cur ? 'on' : ''}" data-camera="${c.id}"><b>${c.name}</b>${c.verified ? '' : '<small>검증 전 (값이 틀릴 수 있음)</small>'}</button>`).join('')}
    </div>
    <p class="lead small">다른 기종은 추가 예정입니다.</p>`;
  view.querySelectorAll('[data-camera]').forEach((b) => b.addEventListener('click', () => {
    const next = b.dataset.camera;
    if (next !== cur) { store.set(K.camera, next); store.del(K.setup); store.del(K.recent); }
    const cam = byId(CAMERAS, next);
    if (!compatibleLenses(cam).some((l) => l.id === store.get(K.lens, null))) store.set(K.lens, compatibleLenses(cam)[0].id);
    location.hash = fromSettings ? 'settings' : 'lenses';
  }));
}

// ---------- 렌즈 체크 (첫 실행) ----------
function renderLensCheck(view) {
  const cam = camera(), cur = lensId();
  view.innerHTML = `
    ${header('내 렌즈', '#camera', { noGear: true })}
    <p class="lead">${cam.name}에 쓰는 렌즈를 고르세요. 결과 화면에서 언제든 바꿀 수 있습니다.</p>
    <div class="list">${lensRadios(cam, cur)}</div>
    <a class="btn press" href="#home">시작하기</a>`;
  bindLensRadios(view);
}
function lensRadios(cam, cur) {
  return compatibleLenses(cam).map((l) => `<label class="card press radio ${l.id === cur ? 'on' : ''}">
    <input type="radio" name="lens" id="lens-${l.id}" value="${l.id}" ${l.id === cur ? 'checked' : ''}>
    <span class="txt"><b>${l.label}${l.mount !== cam.mount ? ' <span class="tag">어댑터</span>' : ''}</b><small>${l.note}</small></span></label>`).join('');
}
function bindLensRadios(view) {
  view.querySelectorAll('input[name=lens]').forEach((inp) => inp.addEventListener('change', () => {
    store.set(K.lens, inp.value);
    view.querySelectorAll('.radio').forEach((l) => l.classList.toggle('on', l.querySelector('input').value === inp.value));
  }));
}

// ---------- 홈 ----------
function renderHome(view) {
  const cam = camera();
  const tab = store.get(K.tab, 'scene');
  const recent = store.get(K.recent, null);
  let recentCard = '';
  if (recent && byId(SCENES, recent.scene) && byId(SUBJECTS, recent.subject)) {
    const s = byId(SCENES, recent.scene), u = byId(SUBJECTS, recent.subject);
    recentCard = `<a class="card press recent" href="#r.${s.id}.${u.id}"><span class="label-accent">최근</span><b>${s.label} · ${u.label}</b></a>`;
  }
  const banner = setupDone() || !cam.hasCModes ? '' : `<a class="banner press" href="#settings"><b>${cam.cModes.join('·')} 등록이 먼저예요</b><span>설정하러 가기 ›</span></a>`;
  view.innerHTML = `
    ${header(APP_NAME, null, { lens: true })}
    ${banner}
    ${recentCard}
    ${segment([{ id: 'scene', label: '상황으로 찾기' }, { id: 'style', label: '원하는 사진으로 찾기' }], tab, 'tab')}
    ${tab === 'scene' ? `
      <div class="grid">
        ${SCENES.map((s) => `<a class="card press scene" href="#scene.${s.id}"><b>${s.label}</b><small>${s.sub}</small></a>`).join('')}
      </div>` : `
      <div class="list">
        ${STYLES.map((s) => `<a class="card press style" href="#style.${s.id}">
          <span class="slot">${slotImg(s.image)}</span>
          <span class="txt"><b>${s.title}</b><small>${s.desc}</small></span>
        </a>`).join('')}
      </div>`}`;
  view.querySelectorAll('.seg button').forEach((b) => b.addEventListener('click', () => { store.set(K.tab, b.dataset.tab); renderHome(view); }));
}

// ---------- 피사체 선택 ----------
function renderSubjects(view, sceneId) {
  const cam = camera(), s = byId(SCENES, sceneId);
  view.innerHTML = `
    ${header(s.label, '#home', { subtitle: s.sub })}
    <p class="lead">누구를 찍나요?</p>
    <div class="grid">
      ${SUBJECTS.map((u, i) => `<a class="card press scene tall" href="#r.${s.id}.${u.id}"><b>${u.label}</b><small>${cam.hasCModes ? cam.cModes[u.id === 'kid' ? 1 : 0] + ' 모드 · ' : ''}최소 셔터 ${fmtShutter(u.minShutter)}</small></a>`).join('')}
    </div>`;
}

// ---------- 결과 ----------
function renderResult(view, req, opts = {}) {
  const cam = camera();
  let r, style = null, back;
  const lens = lensId(); // 전역 렌즈. 스타일도 현재 렌즈로 계산하고 권장 렌즈는 따로 표시.
  if (req.type === 'style') {
    style = byId(STYLES, req.id);
    r = compute(cam.id, style.scene, style.subject, lens, style.override);
    back = '#home';
    store.set(K.tab, 'style');
  } else {
    r = compute(cam.id, req.scene, req.subject, lens);
    back = `#scene.${req.scene}`;
    store.set(K.recent, { scene: req.scene, subject: req.subject });
    store.set(K.tab, 'scene');
  }
  const isAv = r.mode === 'Av';
  const title = style ? style.title : r.scene.label;
  const subtitle = style ? `${r.scene.label} · ${r.subject.label}` : r.subject.label;
  const num = (key, text) => `<b class="num" data-key="${key}">${text}</b>`;
  const recLens = style && style.lens !== lens && lensCompatible(cam, byId(LENSES, style.lens)) ? byId(LENSES, style.lens) : null;
  const capped = r.flags.some((f) => f.type === 'isoCapped' || f.type === 'tooDark');
  const evLabel = `${r.light.label}(EV ${r.ev}${r.est ? ', 추정' : ''})`;
  const needSetup = cam.hasCModes && !setupDone();
  const modeLabel = r.cmode || 'Av';

  const context = `${cam.short} · ${r.lens.label}${r.cropNote ? ` · ${r.cropNote}` : ''}${r.adapter ? ' · <span class="muted">어댑터 필요</span>' : ''}${recLens ? ` · <span class="info">권장 렌즈 ${recLens.tab}</span>` : ''}`;
  const keyCard = isAv ? `
    <section class="card key">
      <p class="sub">${context}</p>
      <div class="nums">
        <div><span>조리개</span>${num('aperture', `f/${r.aperture}`)}</div>
        <div><span>노출보정</span>${num('ec', fmtEC(r.ec))}</div>
        <div><span>모드</span><b class="num">${modeLabel}</b></div>
      </div>
      <p class="sub">${evLabel} 기준 예상: ${num('shutter', fmtShutter(r.shutter))} · ${num('iso', `ISO ${r.iso}`)}${capped ? ' <span class="warn">· ISO 상한 도달</span>' : ''}</p>
    </section>` : `
    <section class="card key">
      <p class="sub">${context} · <b>M 모드, 수동 ISO</b></p>
      <div class="nums">
        <div><span>조리개</span>${num('aperture', `f/${r.aperture}`)}</div>
        <div><span>셔터</span>${num('shutter', fmtShutter(r.shutter))}</div>
        <div><span>ISO</span>${num('iso', r.iso)}</div>
      </div>
      <p class="sub">이 값으로 맞추세요. ${evLabel} 기준${capped ? ` <span class="warn">· ISO ${cam.isoHard}에서도 부족</span>` : ''}. 얼굴 밝기는 ISO로 조절</p>
    </section>`;

  const dial = dialSteps(r);
  if (isAv && needSetup) dial[0] += ' <span class="muted">(⚙ 등록 필요)</span>';

  const detail = [];
  if (r.lens.fieldTip) detail.push(r.lens.fieldTip);
  if (cam.family === 'rf') detail.push('눈 검출 AF가 켜져 있으면 측거점을 고를 필요 없음. 화면에서 눈을 자동으로 잡음');
  if (isAv && cam.hasCModes) {
    detail.push(`${r.cmode} 모드에 포함: ISO 자동 상한 ${r.isoMax}, 최소 셔터 ${fmtShutter(r.minShutterDefault)}`);
    detail.push('모드 다이얼을 다른 데로 돌렸다 오면 노출보정이 0으로 돌아감 (C 모드 특성)');
  }
  if (isAv && !cam.hasCModes) detail.push(`ISO 자동 상한 ${r.isoMax}, 최소 셔터 ${fmtShutter(r.minShutter)} (이 기종은 C 모드가 없어 메뉴에서 직접)`);
  detail.push(`${r.af} · ${r.afArea}`, `드라이브 ${r.drive}`, r.afTip,
    `측광 ${r.metering} · WB ${r.wb.label}${r.wb.k !== '자동' ? ` (${r.wb.k})` : ''} · 픽처스타일 ${r.ps}`);
  if (r.apNotes.length) detail.push(r.apNotes.join(' '));

  const rules = [...flagRules(r), ...r.adjust].map(([c, a]) => [c, fillSteps(a, r)]);
  const lensList = compatibleLenses(cam);

  view.innerHTML = `
    ${header(title, back, { subtitle })}
    <div class="lens-row" role="radiogroup" aria-label="렌즈"><span class="lbl">렌즈</span>
      ${lensList.map((l) => `<button type="button" role="radio" aria-checked="${l.id === lens}" class="lens-btn ${l.id === lens ? 'on' : ''}" data-lens="${l.id}">${l.tab || l.short}</button>`).join('')}
    </div>
    ${style ? `
      <section class="card cond">
        <div class="slot wide">${slotImg(style.image)}${style.image ? '' : '<small>내 사진 자리</small>'}</div>
        ${style.image ? '<p class="caption">AI 생성 샘플 · 내 사진으로 교체 가능</p>' : ''}
        <p><span class="label-accent">이 사진이 되는 조건</span>${style.conditions}</p>
        <p><span class="label-warn">흔한 실패 원인</span>${style.failure}</p>
      </section>` : ''}
    ${keyCard}
    <section class="card">
      <h2>다이얼 순서</h2>
      <ol class="steps">${dial.map((d, i) => `<li><span class="n">${i + 1}</span><span>${d}</span></li>`).join('')}</ol>
      <details class="more"><summary>자세히</summary><ul>${li(detail)}</ul></details>
    </section>
    <section class="card">
      <h2>현장 조정</h2>
      <div class="rules">${rules.map(([c, a]) => `<div class="rule${c ? '' : ' full'}"><span class="c">${c}</span><span class="a">${a}</span></div>`).join('')}</div>
    </section>
    ${r.tips.length ? `<section class="card tips"><h2>팁</h2>${r.tips.map((t) => `<p>${t}</p>`).join('')}</section>` : ''}
    <p class="why">${r.why}</p>
    <a class="btn press" href="#home">다른 상황 고르기</a>
    <p class="foot">값은 시작점이에요. 한 장 찍고 재생 화면에서 얼굴 밝기부터 확인</p>`;

  view.querySelectorAll('.lens-row button').forEach((btn) => btn.addEventListener('click', () => {
    if (btn.dataset.lens === lensId()) return;
    store.set(K.lens, btn.dataset.lens);
    const y = window.scrollY;
    renderResult(view, req, { prev: { aperture: r.aperture, shutter: r.shutter, iso: r.iso, ec: r.ec } });
    window.scrollTo(0, y);
  }));
  if (opts.prev) {
    const cur = { aperture: r.aperture, shutter: r.shutter, iso: r.iso, ec: r.ec };
    const sel = Object.keys(cur).filter((k) => cur[k] !== opts.prev[k]).map((k) => `.num[data-key="${k}"]`).join(',');
    const changed = sel ? view.querySelectorAll(sel) : [];
    changed.forEach((el) => el.classList.add('flash'));
    setTimeout(() => changed.forEach((el) => el.classList.remove('flash')), 300);
  }
}

// ---------- 설정 ----------
function renderSettings(view) {
  const cam = camera(), cur = lensId();
  // page: 숫자 = PDF 쪽수, 문자열 = 온라인 가이드 URL
  const pageTxt = (pages) => {
    if (!pages.length) return '<em class="warn">메뉴 위치 미확인</em>';
    const nums = pages.filter((p) => typeof p === 'number'), urls = [...new Set(pages.filter((p) => typeof p === 'string'))];
    return `<small>${nums.length ? `(매뉴얼 p.${nums.join('·')})` : ''}${urls.map((u, i) => ` <a href="${esc(u)}" target="_blank" rel="noopener">온라인 가이드${urls.length > 1 ? ' ' + (i + 1) : ''}</a>`).join('')}</small>`;
  };
  const koTxt = (ko) => ko ? ` <span class="ko">(${ko} 추정)</span>` : '';
  const card = (i, title, value, path, pages, ko, why, note) => `<section class="card setup">
    <h3><span class="n">${i}</span>${title}</h3>
    <div class="val">${value}</div>
    <div class="path">${path}${koTxt(ko)} ${pageTxt(pages)}</div>
    ${why || note ? `<div class="whyline">${why || ''}${note ? ` <small>${note}</small>` : ''}</div>` : ''}
  </section>`;

  const common = SETUP_COMMON.filter((s) => (!s.onlyMount || s.onlyMount === cam.mount) && (!s.onlyIf || cam.menu[s.onlyIf])).map((s, i) => {
    const m = cam.menu[s.key] || {};
    return card(i + 1, fillCam(s.title, cam), fillCam(s.value, cam), m.path || '', m.page ? [m.page] : [], s.pathKo, fillCam(s.why || '', cam), s.note);
  }).join('');

  let cmodes;
  if (cam.hasCModes) {
    cmodes = `<h2 class="sec">2. ${cam.cModes.join('·')} 등록</h2>
      <p class="lead">공통 설정을 끝낸 상태에서 순서대로. ${cam.cModes[0]} = 가만히 있는 사람, ${cam.cModes[1]} = 움직이는 아이.</p>
      <div class="list">${SETUP_CMODE_STEPS.map((base, i) => {
        const s = Object.assign({}, base, base[cam.family] || {});   // family별 문구 덮어쓰기 (예: rf)
        const pages = [];
        let path = s.path || '';
        if (s.menuKey) { const m = cam.menu[s.menuKey]; path = (m.path || '') + (s.pathSuffix || ''); if (m.page) pages.push(m.page); }
        if (s.pageKey && cam.pages[s.pageKey]) pages.push(cam.pages[s.pageKey]);
        (s.pageKeys || []).forEach((k) => cam.pages[k] && pages.push(cam.pages[k]));
        (s.menuKeys || []).forEach((k) => cam.menu[k] && cam.menu[k].page && pages.push(cam.menu[k].page));
        return card(i + 1, fillCam(s.title, cam), fillCam(s.value, cam), path, pages, s.pathKo, s.why, s.note);
      }).join('')}</div>`;
  } else {
    cmodes = `<h2 class="sec">2. 피사체 세트</h2>
      <section class="card"><p>이 기종은 C 모드가 없어서 피사체를 바꿀 때 AF 동작·AF 영역·드라이브를 직접 바꿔야 해요. 결과 화면 다이얼 순서에 그 단계가 들어갑니다.</p></section>`;
  }

  view.innerHTML = `
    ${header('설정', '#home', { noGear: true })}
    <p class="lead">처음 한 번만 15분. 순서대로 하고 맨 아래 등록 완료를 누르세요.</p>
    <h2 class="sec">내 카메라</h2>
    <a class="card press mycam" href="#camera.settings"><span class="txt"><b>${cam.name}</b><small>${cam.verified ? '매뉴얼 검증 완료' : '검증 전'} · 누르면 변경</small></span><span class="chev">›</span></a>
    <h2 class="sec">내 렌즈</h2>
    <div class="list">${lensRadios(cam, cur)}</div>
    <h2 class="sec">1. 공통 설정</h2>
    <div class="list">${common}</div>
    ${cmodes}
    <p class="lead small">메뉴명은 영문 매뉴얼 기준이고 괄호 안 한글은 추정입니다. 카메라에서 확인 후 알려주면 확정합니다.</p>
    <button type="button" class="btn press" id="setupDone">${setupDone() ? '등록 완료됨 (다시 누르면 해제)' : '등록 완료'}</button>`;
  bindLensRadios(view);
  $('setupDone').addEventListener('click', () => { store.set(K.setup, !setupDone()); renderSettings(view); window.scrollTo(0, document.body.scrollHeight); });
}

window.addEventListener('hashchange', route);
document.addEventListener('DOMContentLoaded', route);

// 안드로이드 앱(Capacitor)에서 뒤로가기: 홈이 아니면 한 화면 뒤로, 홈이면 앱 종료. 웹에서는 아무것도 안 함.
(function bindAndroidBack() {
  const capApp = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App;
  if (!capApp || !capApp.addListener) return;
  capApp.addListener('backButton', () => {
    const h = location.hash.replace(/^#/, '');
    if (!h || h === 'home' || !cameraId()) capApp.exitApp();
    else if (history.length > 1) history.back();
    else location.hash = 'home';
  });
})();
