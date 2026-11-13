const CACHE_NAME = "oromia-stem-suite-offline-v9";
const APP_SHELL = [
  "./", "./index.html", "./manifest.webmanifest", "./css/style.css",
  "./js/app.js", "./js/labs/shared.js", "./js/labs/physics.js",
  "./js/labs/chemistry.js", "./js/labs/mathematics.js", "./js/labs/biology.js",
  "./icons/icon-192.png", "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith("oromia-stem-suite-") && name !== CACHE_NAME).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  const isAppAsset = url.pathname.endsWith(".js") || url.pathname.endsWith(".css") || url.pathname.endsWith(".html") || request.mode === "navigate";
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (isAppAsset) {
      // Network-first ensures GitHub Pages updates replace stale JavaScript and CSS.
      try {
        const fresh = await fetch(request, {cache:"no-store"});
        if (fresh && fresh.ok) {
          const key = request.mode === "navigate" ? "./index.html" : request;
          await cache.put(key, fresh.clone());
        }
        return fresh;
      } catch (_) {
        return (await cache.match(request)) || (await cache.match("./index.html")) || (await cache.match("./")) || new Response("Offline page unavailable", {status:503});
      }
    }
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const fresh = await fetch(request);
      if (fresh && fresh.ok) await cache.put(request, fresh.clone());
      return fresh;
    } catch (_) {
      return new Response("This resource is not available offline yet.", {status:503,headers:{"Content-Type":"text/plain"}});
    }
  })());
});
