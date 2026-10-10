/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v702";
const CORE = [
  "./",
  "./index.html"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return c.addAll(CORE).catch(function () { return null; }); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
});
