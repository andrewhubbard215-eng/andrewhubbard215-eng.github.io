/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v544";
const CORE = [
  "./",
  "./index.html",
  "./svc-ticket-match.js?v=4",
  "./service.js?v=110",
  "./sw.js"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return c.addAll(CORE).catch(function () {}); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  var isNav = e.request.mode === "navigate" || e.request.destination === "document" ||
    /\/$|\.html$/i.test(url.pathname) || url.pathname === "/" || url.pathname.endsWith("/index.html");
  var isAsset = /\.(css|js)(\?|$)/i.test(url.pathname + url.search) ||
    /\.(css|js)$/i.test(url.pathname);
  if (isNav || isAsset) {
    e.respondWith(fetch(e.request).then(function (res) {
      try {
        var copy = res.clone();
        caches.open(VER).then(function (c) { c.put(e.request, copy); });
      } catch (err) {}
      return res;
    }).catch(function () {
      return caches.match(e.request).then(function (hit) {
        return hit || (isNav ? caches.match("./index.html") : undefined);
      });
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function (hit) {
    return hit || fetch(e.request);
  }));
});
