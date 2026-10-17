/* Shop-floor copy override v180 — land lugs tip: lock out first. LOOP OPEN holds. */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W · inducer · PS · ignitor · valve · flame · blower";
      }
      if (/L1 LINE/i.test(t) && /chips LEFT/i.test(t)) {
        el.textContent = "L1 LINE / L2 LINE / HERM / C R S - lock out first - chips LEFT";
      }
    });
  }
  function scrub() { vocationalTiles(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  window.addEventListener("lt-screen", scrub);
})();
