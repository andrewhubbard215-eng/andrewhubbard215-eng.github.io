/* HVAC Allstars — offline cache (v988: sandbox-ts v29 equalized tip locked. Parts LEFT. No combat) for Android / Windows PWA */
const VER = "lt-allstars-v988";
const CORE = [
"./",
"./index.html",
"./icon-192.png",
"https://raw.githubusercontent.com/andrewhubbard215-eng/andrewhubbard215-eng.github.io/49ce6e5/index.html",
"./sku.js?v=17",
"./style.css?v=147",
"./svc-rail.css?v=1",
"./sandbox-layout.css?v=44",
"./sandbox-pc.css?v=12",
"./truck-pouch.css?v=8",
"./board-codes.css?v=4",
"./phone-floor.css?v=51",
"./phone-p0.css?v=14",
"./phone-rail.css?v=7",
"./saturday-phone.css?v=4",
"./theme-amber-bench.css?v=2",
"./exam-epa.css?v=2",
"./manifest.webmanifest",
"./sw.js"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () { return null; }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request).then(function (r) { return r || caches.match(e.request, { ignoreSearch: true }); }).then(function (r) { return r || Response.error(); }); }));
});
