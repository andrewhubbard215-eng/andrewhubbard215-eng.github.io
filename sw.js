/* HVAC Allstars — offline cache (v1381: tighter HOLD zero-prove tip. Hoses COMPLETELY OFF ports, solid FULL green ~0.8s until BOTH 0.0 proven BEFORE any seat LEFT. Parts LEFT. No combat. */
const VER = "lt-allstars-v1381";
const CORE = [
"./",
"./index.html",
"./icon-192.png",
"./sku.js?v=17",
"./style.css?v=147",
"./svc-rail.css?v=1",
"./sandbox-layout.css?v=44",
"./sandbox-pc.css?v=12",
"./truck-pouch.css?v=8",
"./board-codes.css?v=4",
"./phone-floor.css?v=55",
"./phone-sandbox-fit.css?v=6",
"./phone-p0.css?v=16",
"./phone-rail.css?v=7",
"./saturday-phone.css?v=4",
"./theme-amber-bench.css?v=2",
"./exam-epa.css?v=2",
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
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
