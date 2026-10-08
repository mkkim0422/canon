// 오프라인 캐시(앱 셸 + 샘플 사진). 네트워크 우선, 실패 시 캐시. 버전을 올리면 옛 캐시 삭제.
// claude.ai 아티팩트 호스팅은 서비스워커를 막으므로 index.html에서만 등록(실패해도 앱은 그대로 동작).
const VERSION = 'cck-2026-10-09';
const SHELL = ['./', './index.html', './css/style.css', './manifest.webmanifest', './img/icon.svg',
  './js/data.js', './js/exposure.js', './js/dials.js', './js/exif.js', './js/mock-features.js', './js/analyze.js', './js/match.js', './js/pixels.js', './js/diagnose.js', './js/app.js',
  './img/softKid.jpg', './img/rimLight.jpg', './img/silhouette.jpg', './img/windowHalf.jpg', './img/freeze.jpg', './img/nightBokeh.jpg', './img/rainTone.jpg', './img/cafeMood.jpg', './img/familySelf.jpg'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;   // Gemini API 등 외부 요청은 건드리지 않음
  e.respondWith(fetch(e.request).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; })
    .catch(() => caches.match(e.request).then((hit) => hit || caches.match('./index.html'))));
});
