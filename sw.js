/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v247";
const CORE = [
  "./",
  "./index.html",
  "./sku.js?v=10",
  "./style.css?v=139",
  "./phone-floor.css?v=6",
  "./sb-tabs.css?v=2",
  "./lab-glass.css?v=1",
  "./game.js?v=205",
  "./shop-floor-copy.js?v=8",
  "./sandbox.js?v=129",
  "./route-floor.js?v=4",
  "./charge-floor.js?v=2",
  "./quiz-arena.js?v=98",
  "./hub-ai.js?v=82",
  "./instructor.js?v=97",
  "./electrical.js?v=131",
  "./electrical-fat.js?v=2",
  "./electrical-sheet.js?v=1",
  "./board-codes.js?v=15",
  "./prove-deepen.js?v=1",
  "./board-codes.css?v=4",
  "./dragdrop.js?v=45",
  "./webgl-cycle.js?v=57",
  "./minisplit.js?v=2",
  "./ai-helper.js",
  "./service.js?v=103",
  "./commandments.js?v=119",
  "./epa608.js?v=1",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=96",
  "./curriculum.js",
  "./daily.js?v=3",
  "./daily-clock.js?v=1",
  "./clock-in-fix.js?v=15",
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
