/* Shop floor copy — vocational status tips (v54). Parts LEFT. No combat. */
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
      setStatus("Prove ZERO first: LOTO + meter 24V. Hoses completely OFF — HOLD each dial solid (green bar FULL ~0.8s) until BOTH gauges show green 0.0. Only then seat COMP · COND · TXV · EVAP from LEFT rail. Never seat with hoses on or pressure showing.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTip);
  } else {
    setTimeout(bootTip, 400);
  }
})();
