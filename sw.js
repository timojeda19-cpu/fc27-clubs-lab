const CACHE_NAME = 'fc27-clubs-lab-s2-v2';
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-512.png", "./icon-192.png", "./apple-touch-icon.png"];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((res) => res || fetch(e.request).then((r) => {
      if (r && r.ok && new URL(e.request.url).origin === location.origin) {
        const copy = r.clone(); caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
