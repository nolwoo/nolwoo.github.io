/* 보카 티처 서비스워커 — 오프라인 사용을 위한 캐시.
   앱을 고칠 때마다 CACHE 버전을 올리면 폰에서 새 버전을 받아 간다. */
const CACHE = "voca-teacher-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./words.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* 네트워크 우선 → 실패하면 캐시.
   덕분에 온라인일 땐 항상 최신 버전을 보고, 비행기모드에서도 앱이 뜬다. */
self.addEventListener("fetch", e => {
  if(e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request).then(hit => hit || caches.match("./index.html")))
  );
});
