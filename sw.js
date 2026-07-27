/**
 * KUMA routine — service worker
 *
 * 이전 버전(v2026-05-17 앱 셸 캐시)에서 넘어오는 기기를 위해
 * activate 시점에 기존 캐시를 전부 삭제하고 즉시 제어권을 가져온다.
 * 앱이 단일 HTML 이므로 문서는 network-first, 아이콘만 가볍게 캐시한다.
 */
const CACHE = 'kuma-routine-v3';
const ASSETS = [
  './manifest.json',
  './pwa-icon.svg',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).catch(() => {}));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    // 예전 버전이 남긴 캐시를 모두 정리한다
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // 문서와 스크립트는 항상 최신을 우선한다 (옛 화면이 캐시에서 뜨는 것을 막는다)
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req).catch(() => caches.match('./index.html').then(r => r || Response.error()))
    );
    return;
  }

  // 아이콘 등 정적 자산만 cache-first
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => hit))
  );
});
