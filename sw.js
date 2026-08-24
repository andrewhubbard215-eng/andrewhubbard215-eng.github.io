/* HVAC Allstars — offline cache for Android / Windows PWA */
const VER = "lt-allstars-v77";
const CORE = [
  "./",
  "./index.html",
  "./style.css?v=75",
  "./game.js?v=77",
  "./sandbox.js?v=76",
  "./quiz-arena.js?v=69",
  "./hub-ai.js?v=71",
  "./instructor.js?v=70",
  "./electrical.js?v=43",
  "./dragdrop.js?v=43",
  "./webgl-cycle.js?v=57",
  "./minisplit.js",
  "./ai-helper.js",
  "./service.js",
  "./commandments.js",
  "./compete.js",
  "./chat.js",
  "./badges.js?v=61",
  "./curriculum.js",
  "./daily.js",
  "./tutorial.js?v=40",
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
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === "basic") {
            const copy = res.clone();
            caches.open(VER).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
