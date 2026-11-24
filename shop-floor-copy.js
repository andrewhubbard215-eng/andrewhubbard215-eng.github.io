/* Shop floor copy — vocational status tips (v55). Parts LEFT. No combat. */
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
      setStatus("LOTO + meter 24V first. Hoses OFF. HOLD each dial until green bar FULL (~0.8s) both 0.0. Then seat LEFT. Standing≠charge. Never jump safety.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTip);
  } else {
    setTimeout(bootTip, 400);
  }
})();
