/* HVAC Allstars — offline cache (v1200: no-cool METER FIRST ALWAYS clearer + equalized STOP. Parts LEFT. No combat) */
const VER = "lt-allstars-v1200";
const CORE = [
"./",
"./index.html",
"./icon-192.png",
"https://raw.githubusercontent.com/andrewhubbard215-eng/andrewhubbard215-eng.github.io/19929303c1ba1e1a0a9063add9063123282320a2/index.html",
"./sku.js?v=17",
"./style.css?v=147",
"./svc-rail.css?v=1",
"./sandbox-layout.css?v=44",
"./sandbox-pc.css?v=12",
"./truck-pouch.css?v=8",
"./board-codes.css?v=4",
"./phone-floor.css?v=52",
"./phone-p0.css?v=15",
"./phone-rail.css?v=7",
"./saturday-phone.css?v=4",
"./theme-amber-bench.css?v=2",
"./exam-epa.css?v=2",
"./manifest.webmanifest"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return Promise.all(CORE.map(function (u) { return c.add(u).catch(function () { return null; }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VER; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
