const CACHE_NAME = "kuma-routine-cache-v20260517-8";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css?v=20260517-24",
  "./app.js?v=20260517-24",
  "./manifest.json",
  "./pwa-icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./simbol.svg",
  "./tip.svg",
  "./tip-light.svg",
  "./BIcon_ell_off.svg",
  "./Icon_Bell_on.svg",
  "./Icon_Clock.svg",
  "./Icon_Download.svg",
  "./Icon_Menu.svg",
  "./Icon_Plus.svg",
  "./Icon_Settings.svg",
  "./Icon_Share.svg",
  "./Icon_Smile.svg",
  "./Icon_Trash.svg",
  "./btn_click.svg",
  "./btn_m_click.svg",
  "./btn_m_normal.svg",
  "./btn_normal.svg",
  "./redbtn_m_click.svg",
  "./redbtn_m_normal.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      });
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const visibleClient = clients.find((client) => "focus" in client);
      if (visibleClient) return visibleClient.focus();
      if (self.clients.openWindow) return self.clients.openWindow("./");
      return undefined;
    })
  );
});
