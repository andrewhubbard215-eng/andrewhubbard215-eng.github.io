/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v259";
const CORE = [
  "./",
  "./index.html",
  "./sku.js?v=10",
  "./style.css?v=139",
  "./phone-floor.css?v=12",
  "./sb-tabs.css?v=2",
  "./lab-glass.css?v=1",
  "./game.js?v=205",
  "./shop-floor-copy.js?v=8",
  "./sandbox.js?v=132",
  "./route-floor.js?v=4",
  "./charge-floor.js?v=2",
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
  "./hub-ai.js?v=82",
  "./instructor.js?v=97",
  "./electrical.js?v=132",
  "./electrical-fat.js?v=3",
  "./electrical-phone.js?v=1",
  "./electrical-sheet.js?v=1",
  "./board-codes.js?v=15",
  "./prove-deepen.js?v=1",
  "./voltmeter-school.js?v=1",
  "./ohm-school.js?v=1",
  "./ohms-law-school.js?v=2",
  "./truck-pouch.js?v=1",
  "./truck-pouch.css?v=1",
  "./exam-untimed.js?v=2",
  "./board-codes.css?v=4",
  "./dragdrop.js?v=46",
  "./webgl-cycle.js?v=57",
  "./minisplit.js?v=2",
  "./minisplit-phone.js?v=1",
  "./ai-helper.js",
  "./service.js?v=104",
  "./commandments.js?v=119",
  "./epa608.js?v=1",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=96",
  "./curriculum.js",
  "./daily.js?v=3",
  "./daily-clock.js?v=1",
  "./clock-in-form.js?v=17",
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
