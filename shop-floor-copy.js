/* Shop floor copy — vocational status tips (v65). Parts LEFT. No combat. Equalized standing ≠ charge = DO NOT RECOVER. Never jump a safety. */
(function () {
  "use strict";
  function setStatus(msg) {
    var st = document.getElementById("sb-status");
    if (st) st.textContent = msg;
  }
  function boot() {
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var st = document.getElementById("sb-status");
    if (st && /Standing pressures\s+-\s+Tech\s+-\s+seat the four LEFT/i.test(st.textContent || "")) {
      setStatus("FIRST YEAR LOCK: LOTO + meter 24V R-C/Y BEFORE any hose. Hoses COMPLETELY OFF ports. HOLD each dial solid FULL green ~0.8s until BOTH 0.0 proven. Then seat COMP · COND · TXV · EVAP LEFT only. Parts LEFT. Prove ZERO every hook-up. EQUALIZED / STANDING = DO NOT RECOVER (standing ≠ charge). Seat 4 LEFT, start compressor, wait 2 min stable, THEN read SH/SC. Never jump a safety. lowSH+highSC=over · highSH+highSC=restrict · highSH+lowSC=low. Meter each step. No skip.");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(boot, 800);
})();
