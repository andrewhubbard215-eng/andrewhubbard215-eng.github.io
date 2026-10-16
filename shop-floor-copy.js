/* Shop-floor copy override v179 — LOOP OPEN holds. Service call tip shortened for rail: wait stable SH/SC, read numbers, pick. */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W · inducer · PS · ignitor · valve · flame · blower";
      }
    });
  }
  // RESTORED STUB - full file pending
  function scrub() { vocationalTiles(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  window.addEventListener("lt-screen", scrub);
})();
