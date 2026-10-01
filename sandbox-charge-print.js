/* Charge off nameplate must move SH/SC. TXV: low charge = high SH, low SC. */
(function () {
  "use strict";
  var lastKey = "";

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
    if (!sh || !sc || !running()) return;
    var rawSh = readNum(sh);
    var rawSc = readNum(sc);
    if (rawSh == null || rawSc == null) return;
    var d = (100 - charge()) / 100;
    var key = charge().toFixed(0) + "|" + rawSh.toFixed(1) + "|" + rawSc.toFixed(1);
    if (key === lastKey) return;
    if (Math.abs(d) < 0.04) {
      lastKey = key;
      return;
    }
    var shv = Math.round((rawSh + d * 40) * 10) / 10;
    var scv = Math.round((rawSc - d * 32) * 10) / 10;
    if (shv < 0) shv = 0;
    if (scv < 0) scv = 0;
    var shTxt = shv.toFixed(1) + " °F SH  (seat 8–14)";
    var scTxt = scv.toFixed(1) + " °F SC  (seat 8–14)";
    lastKey = charge().toFixed(0) + "|" + shv.toFixed(1) + "|" + scv.toFixed(1);
    sh.textContent = shTxt;
    sc.textContent = scTxt;
    var gsh = document.getElementById("g-sh");
    var gsc = document.getElementById("g-sc");
    if (gsh) gsh.textContent = shv.toFixed(1);
    if (gsc) gsc.textContent = scv.toFixed(1);
  }

  setInterval(paint, 350);
})();
