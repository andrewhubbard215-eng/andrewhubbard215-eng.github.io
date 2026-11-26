/* Shop floor copy — vocational status tips (v62). Parts LEFT. No combat. Equalized = DO NOT RECOVER. Never jump a safety. */
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
      setStatus("FIRST YEAR LOCK: LOTO + meter 24V R-C/Y BEFORE any hose. Hoses OFF. HOLD full green 0.0 BOTH. Then seat COMP · COND · TXV · EVAP LEFT only. Parts LEFT. Prove ZERO every hook-up. EQUALIZED / STANDING = DO NOT RECOVER. Never jump a safety. Start compressor, wait 2 min stable, then read SH/SC: lowSH+highSC=over · highSH+highSC=restrict · highSH+lowSC=low. Standing≠charge. Meter each step.");
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(boot, 800);
})();
