/* Shop floor copy — vocational status tips (v53). Parts LEFT. No combat. */
(function () {
  "use strict";
  function setStatus(msg) {
    var st = document.getElementById("sb-status");
    if (st && msg) st.textContent = msg;
  }
  /* Initial standing tip if sandbox loads with open loop */
  function bootTip() {
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var st = document.getElementById("sb-status");
    if (st && /Standing pressures - Tech - seat the four LEFT/i.test(st.textContent || "")) {
      setStatus("LOTO + meter 24V first. Hoses OFF — HOLD each dial (do not release until green progress bar FULL ~0.8s) until BOTH green 0.0 proven. Then seat COMP · COND · TXV · EVAP LEFT, then Start.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTip);
  } else {
    setTimeout(bootTip, 400);
  }
})();
