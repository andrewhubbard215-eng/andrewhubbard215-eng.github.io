/* Furnace SOO floor — flame µA prove. Shop card opens BoardCodes.openSoo. */
(function () {
  "use strict";
  function deepen() {
    var bc = window.BoardCodes;
    if (!bc || typeof bc.openSoo !== "function" || bc._sooFlameUa) return false;
    bc._sooFlameUa = true;
    var raw = bc.openSoo;
    bc.openSoo = function () {
      raw();
      var wrap = document.getElementById("el-soo-overlay");
      if (!wrap || wrap.getAttribute("data-flameua") === "1") return;
      wrap.setAttribute("data-flameua", "1");
      var extra = document.createElement("p");
      extra.className = "hub-chip";
      extra.style.marginTop = "8px";
      extra.textContent =
        "Flame prove is microamps, not your eyes. Typical good rod is about 1–5 µA to the board. Low µA: dirty rod, cracked porcelain, poor ground, or weak flame. Clean and re-meter before you buy a board.";
      wrap.appendChild(extra);
    };
    return true;
  }
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    if (deepen() || n > 40) clearInterval(t);
  }, 400);
  document.addEventListener("DOMContentLoaded", deepen);
})();
