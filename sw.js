/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v154";
const CORE = [
  "./",
  "./index.html",
  "./sku.js?v=2",
  "./style.css?v=137",
  "./sb-tabs.css?v=1",
  "./lab-glass.css?v=1",
  "./game.js?v=129",
  "./sandbox.js?v=119",
  "./sandbox-hook.js?v=2",
  "./sandbox-bom.js?v=1",
  "./quiz-arena.js?v=98",
  "./hub-ai.js?v=82",
  "./instructor.js?v=97",
  "./electrical.js?v=128",
  "./board-codes.js?v=2",
  "./board-codes.css?v=1",
  "./dragdrop.js?v=45",
  "./webgl-cycle.js?v=57",
  "./minisplit.js?v=2",
  "./ai-helper.js",
  "./service.js?v=96",
  "./commandments.js?v=119",
  "./epa608.js?v=1",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=95",
  "./curriculum.js",
  "./daily.js",
  "./tutorial.js?v=97",
  "./phone-tools.js?v=104",
  "./pitch.html",
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
