/* Shop floor copy — vocational status tips (v60). Parts LEFT. No combat. SH/SC textbook fingerprints. */
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
    if (st && /Standing pressures\s+-\s+Tech\s+-\s+seat the four LEFT/i.test(st.textContent || "")) {
      setStatus("FIRST YEAR LOCK: LOTO + meter 24V R-C/Y BEFORE any hose. Hoses OFF. HOLD full green 0.0 BOTH. Then seat COMP · COND · TXV · EVAP LEFT only. Parts LEFT. Prove ZERO. Run for SH/SC: low SH+high SC=overcharge · high SH+high SC=restriction · high SH+low SC=low charge.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTip);
  } else {
    setTimeout(bootTip, 400);
  }
})();
