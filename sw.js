/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v504";
const CORE = [
  "./",
  "./index.html",
  "./nocool-lock.js?v=2",
  "./sku.js?v=17",
  "./style.css?v=147",
  "./svc-rail.css?v=1",
  "./sandbox-layout.css?v=43",
  "./sandbox-faults-wrap.css?v=3",
  "./sandbox-pc.css?v=11",
  "./phone-floor.css?v=43",
  "./phone-p0.css?v=14",
  "./phone-rail.css?v=1",
  "./saturday-phone.css?v=1",
  "./sb-tabs.css?v=3",
  "./lab-glass.css?v=1",
  "./game.js?v=206",
  "./teach-locks.js?v=2",
  "./shop-floor-copy.js?v=46",
  "./sandbox.js?v=166",
  "./sandbox-hunt.js?v=2",
  "./sandbox-eq.js?v=4",
  "./sandbox-hook.js?v=18",
  "./sandbox-seats.js?v=29",
  "./sandbox-packs.js?v=1",
  "./sandbox-poster.js?v=1",
  "./sandbox-sound.js?v=1",
  "./sandbox-ghost.js?v=1",
  "./recovery-room.js?v=2",
  "./recovery-room.css?v=2",
  "./parts/condenser.png",
  "./parts/gauges.png",
  "./parts/rc/machine.png?v=2",
  "./parts/rc/tank.png?v=2",
  "./parts/rc/scale.png?v=2",
  "./parts/rc/vacuum.png?v=2",
  "./parts/rc/hoses.png?v=2",
  "./parts/rc/ice-bucket.png?v=2",
  "./parts/rc/machine-bay.png?v=2",
  "./parts/rc/tank-bay.png?v=2",
  "./parts/rc/scale-bay.png?v=2",
  "./parts/rc/vacuum-bay.png?v=2",
  "./parts/rc/hoses-bay.png?v=2",
  "./parts/rc/ice-bucket-bay.png?v=2",
  "./service-meter.js?v=1",
  "./service-meter.b0.js?v=1",
  "./service-meter.b1.js?v=1",
  "./service-meter.b2.js?v=1",
  "./service-meter.b3.js?v=1",
  "./service-meter.b4.js?v=1",
  "./sandbox-yell.js?v=5",
  "./lugs-lock.js?v=1",
  "./sandbox-ts.js?v=11",
  "./sandbox-sliders.js?v=10",
  "./sandbox-stand.js?v=1",
  "./sandbox-cutout.js?v=1",
  "./sandbox-td.js?v=7",
  "./analog-gauges.js?v=7",
  "./route-floor.js?v=13",
  "./route-park.js?v=1",
  "./bay-restore.js?v=1",
  "./route-boot-fix.js?v=1",
  "./charge-floor.js?v=3",
  "./quiz-arena.js?v=4",
  "./quiz-arena.p0.js?v=4",
  "./quiz-arena.p1.js?v=4",
  "./quiz-arena.p2.js?v=4",
  "./quiz-arena.p3.js?v=4",
  "./quiz-arena.p4.js?v=4",
  "./quiz-arena.p5.js?v=4",
  "./quiz-arena.p6.js?v=4",
  "./quiz-arena.p7.js?v=4",
  "./quiz-arena.p8.js?v=4",
  "./quiz-arena.p9.js?v=4",
  "./quiz-arena.p10.js?v=4",
  "./quiz-arena.p11.js?v=4",
  "./quiz-arena.p12.js?v=4",
  "./quiz-arena.p13.js?v=4",
  "./quiz-arena.p14.js?v=4",
  "./quiz-arena.p15.js?v=4",
  "./hub-ai.js?v=84",
  "./drip.js?v=6",
  "./instructor.js?v=97",
  "./electrical.js?v=137",
  "./electrical-fat.js?v=4",
  "./electrical-lite.js?v=8",
  "./electrical-phone.js?v=5",
  "./electrical-sheet.js?v=7",
  "./saturday-arm.js?v=1",
  "./board-codes.js?v=19",
  "./prove-deepen.js?v=2",
  "./soo-limit.js?v=1",
  "./furnace-soo-floor.js?v=3",
  "./voltmeter-school.js?v=8",
  "./ohm-school.js?v=3",
  "./ohms-law-school.js?v=4",
  "./ohms-law-arcade-bench.js?v=2",
  "./ohms-law-arcade-tickets.js?v=2",
  "./ohms-law-arcade-play.js?v=6",
  "./truck-pouch.js?v=6",
  "./truck-pouch.p0.js?v=6",
  "./truck-pouch.p1.js?v=6",
  "./truck-pouch.p2.js?v=6",
  "./truck-pouch.p3.js?v=6",
  "./truck-pouch.p4.js?v=6",
  "./truck-pouch.p5.js?v=6",
  "./truck-pouch.p6.js?v=6",
  "./truck-pouch.p7.js?v=6",
  "./truck-pouch.css?v=8",
  "./exam-untimed.js?v=3",
  "./exam-cutout.js?v=3",
  "./epa-exam-bank.js?v=1",
  "./exam-epa.js?v=1",
  "./exam-epa.css?v=1",
  "./board-codes.css?v=4",
  "./dragdrop.js?v=50",
  "./webgl-cycle.js?v=57",
  "./minisplit.js?v=10",
  "./minisplit-phone.js?v=4",
  "./minisplit-chip-preview.js?v=1",
  "./ai-helper.js",
  "./service.js?v=108",
  "./commandments.js?v=120",
  "./epa608.js?v=2",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=96",
  "./curriculum.js",
  "./daily.js?v=3",
  "./daily-clock.js?v=1",
  "./clock-in-form.js?v=21",
  "./clock-in-fix.js?v=29",
  "./clock-in-floor.js?v=48",
  "./shop-labs-data.js?v=3",
  "./shop-labs-floor.js?v=5",
  "./shop-labs-print.js?v=1"
];
self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VER).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
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
