/* SOO deepen — limit/rollout stays in series after blower. */
(function () {
  "use strict";
  function patch() {
    var bc = window.BoardCodes;
    if (!bc || typeof bc.openSoo !== "function" || bc._sooLimit8) return false;
    bc._sooLimit8 = true;
    var rawOpen = bc.openSoo;
    bc.openSoo = function () {
      rawOpen();
      var wrap = document.getElementById("el-soo-overlay");
      if (!wrap || wrap.getAttribute("data-limit8") === "1") return;
      wrap.setAttribute("data-limit8", "1");
      var chip = wrap.querySelector(".hub-chip");
      var extra = document.createElement("p");
      extra.className = "muted";
      extra.style.marginTop = "10px";
      extra.textContent =
        "After flame and blower: limit and rollout stay in series with W. Open limit kills gas. Prove filter, blower, HX — never jump the limit to keep a customer in heat.";
      wrap.appendChild(extra);
      var muted = wrap.querySelector(".sb-toolbar .muted");
      if (muted && muted.textContent.indexOf("limit") === -1) {
        muted.textContent += " → limit in series";
      }
    };
    return true;
  }
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    if (patch() || n > 40) clearInterval(t);
  }, 400);
  document.addEventListener("DOMContentLoaded", patch);
})();
