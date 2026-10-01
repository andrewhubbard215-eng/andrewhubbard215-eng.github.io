/* Charge off nameplate must move SH/SC. TXV: low charge = high SH, low SC. */
(function () {
  "use strict";
  var lastSh = null;
  var lastSc = null;

  function charge() {
    var s = document.getElementById("sb-charge");
    var n = s ? parseFloat(s.value) : 100;
    return isFinite(n) ? n : 100;
  }

  function running() {
    var b = document.getElementById("sb-run");
    return !!(b && /stop/i.test(b.textContent || ""));
  }

  function readNum(el) {
    if (!el) return null;
    var m = (el.textContent || "").match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }

  function paint() {
    var sh = document.getElementById("sb-sh");
    var sc = document.getElementById("sb-sc");
    if (!sh || !sc || !running()) {
      lastSh = null;
      lastSc = null;
      return;
    }
    var rawSh = readNum(sh);
    var rawSc = readNum(sc);
    if (rawSh == null || rawSc == null) return;
    if (lastSh != null && Math.abs(rawSh - lastSh) < 0.05 && lastSc != null && Math.abs(rawSc - lastSc) < 0.05) return;
    var d = (100 - charge()) / 100;
    var shv = Math.round((rawSh + d * 40) * 10) / 10;
    var scv = Math.round((rawSc - d * 32) * 10) / 10;
    if (shv < 0) shv = 0;
    if (scv < 0) scv = 0;
    lastSh = shv;
    lastSc = scv;
    if (Math.abs(d) < 0.04) return;
    sh.textContent = shv.toFixed(1) + " °F SH  (seat 8–14)";
    sc.textContent = scv.toFixed(1) + " °F SC  (seat 8–14)";
    var gsh = document.getElementById("g-sh");
    var gsc = document.getElementById("g-sc");
    if (gsh) gsh.textContent = shv.toFixed(1);
    if (gsc) gsc.textContent = scv.toFixed(1);
  }

  setInterval(paint, 350);
  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "sb-charge") {
      lastSh = null;
      lastSc = null;
      paint();
    }
  });
})();
