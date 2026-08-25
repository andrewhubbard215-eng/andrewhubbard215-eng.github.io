/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v114";
const CORE = [
  "./",
  "./index.html",
  "./style.css?v=114",
  "./game.js?v=105",
  "./sandbox.js?v=107",
  "./quiz-arena.js?v=96",
  "./hub-ai.js?v=82",
  "./instructor.js?v=96",
  "./electrical.js?v=43",
  "./dragdrop.js?v=43",
  "./webgl-cycle.js?v=57",
  "./minisplit.js",
  "./ai-helper.js",
  "./service.js?v=96",
  "./commandments.js?v=106",
  "./compete.js?v=94",
  "./chat.js?v=106",
  "./badges.js?v=93",
  "./curriculum.js",
  "./daily.js",
  "./tutorial.js?v=93",
  "./phone-tools.js?v=104",
  "./manifest.webmanifest",
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
