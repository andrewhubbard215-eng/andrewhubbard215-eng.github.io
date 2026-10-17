/* Shop-floor copy override v182 — Saturday callback tip + airflow. Lock out first. LOOP OPEN holds. */
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
      if (/Saturday callback/i.test(t) || /no-cool sheet/i.test(t)) {
        if (t.length < 140) el.textContent = "No-cool sheet - meter first - isolate the open - don't jump the float";
      }
      if (/service calls/i.test(t) || /hook gauges/i.test(t) || /SH\/SC/i.test(t)) {
        if (t.length < 120) el.textContent = "Hook gauges - read SH/SC - airflow before charge - meter first";
      }
    });
  }
  function scrub() { vocationalTiles(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  window.addEventListener("lt-screen", scrub);
})();
