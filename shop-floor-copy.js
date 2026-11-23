/* Shop floor copy — vocational status tips (v51). Parts LEFT. No combat. */
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
      setStatus("Standing P equalized — seat COMP · COND · TXV · EVAP LEFT, then Start.");
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootTip);
  } else {
    setTimeout(bootTip, 400);
  }
})();
