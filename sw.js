/* HVAC Allstars — offline cache (v1281: board-code locker tighter first-year prove. Meter the open. Door sticker is law. Parts LEFT. No combat) */
const VER = "lt-allstars-v1281";
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
"./phone-floor.css?v=54",
"./phone-p0.css?v=16",
"./phone-rail.css?v=7",
"./saturday-phone.css?v=4",
"./theme-amber-bench.css?v=2",
"./exam-epa.css?v=2",
"./manifest.webmanifest",
"./no-cool-prove.js?v=6",
"./ps-prove.js?v=1"
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
