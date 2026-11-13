/* HVAC Allstars — offline cache (v1190: tighter ZERO BOTH COMPLETELY OFF + equalized migration only. Parts LEFT. No combat) */
const VER = "lt-allstars-v1190";
const CORE = [
"./",
"./index.html",
"./icon-192.png",
"https://raw.githubusercontent.com/andrewhubbard215-eng/andrewhubbard215-eng.github.io/015e4eafa4bc2ab80dfbea157aa10fad84541f42/index.html",
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
self.addEventListener("fetch", function (e) {
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
