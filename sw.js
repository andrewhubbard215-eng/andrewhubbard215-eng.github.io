/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v290";
const CORE = [
  "./",
  "./index.html",
  "./sku.js?v=10",
  "./style.css?v=141",
  "./phone-floor.css?v=19",
  "./sb-tabs.css?v=2",
  "./lab-glass.css?v=1",
  "./game.js?v=205",
  "./shop-floor-copy.js?v=8",
  "./sandbox.js?v=139",
  "./sandbox-hook.js?v=13",
  "./sandbox-ts.js?v=2",
  "./sandbox-sliders.js?v=2",
  "./sandbox-cutout.js?v=1",
  "./sandbox-td.js?v=1",
  "./route-floor.js?v=7",
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
  "./hub-ai.js?v=83",
  "./drip.js?v=3",
  "./instructor.js?v=97",
  "./electrical.js?v=135",
  "./electrical-fat.js?v=4",
  "./electrical-lite.js?v=4",
  "./electrical-phone.js?v=4",
  "./electrical-sheet.js?v=1",
  "./board-codes.js?v=16",
  "./prove-deepen.js?v=1",
  "./voltmeter-school.js?v=4",
  "./ohm-school.js?v=1",
  "./ohms-law-school.js?v=3",
  "./ohms-law-arcade-bench.js?v=2",
  "./ohms-law-arcade-tickets.js?v=2",
  "./ohms-law-arcade-play.js?v=3",
  "./truck-pouch.js?v=3",
  "./truck-pouch.css?v=3",
  "./exam-untimed.js?v=2",
  "./board-codes.css?v=4",
  "./dragdrop.js?v=48",
  "./webgl-cycle.js?v=57",
  "./minisplit.js?v=9",
  "./minisplit-phone.js?v=4",
  "./minisplit-chip-preview.js?v=1",
  "./ai-helper.js",
  "./service.js?v=107",
  "./commandments.js?v=119",
  "./epa608.js?v=1",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=96",
  "./curriculum.js",
  "./daily.js?v=3",
  "./daily-clock.js?v=1",
  "./clock-in-form.js?v=21",
  "./clock-in-floor.js?v=28",
  "./pitch.html",
  "./sandbox.html",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./lincoln-tech.jpg",
  "./hub-portrait.jpg",
  "./jesus.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VER).then((c) => c.addAll(CORE).catch(() => c.addAll(["./index.html", "./manifest.webmanifest"])))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VER).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const nav = req.mode === "navigate" || url.pathname === "/" || /index\.html$/i.test(url.pathname);
  if (nav) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VER).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((h) => h || caches.match("./index.html")))
    );
    return;
  }
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok && (res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(VER).then((c) => c.put(req, copy));
        }
          return res;
      })
        .catch(() => caches.match(req))
  );
});
