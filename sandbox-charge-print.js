/* Charge off nameplate must move SH/SC. TXV: low charge = high SH, low SC.
   Bay repaints every frame — rewrite in the same turn so the glass keeps the print. */
(function () {
  "use strict";
  var lastKey = "";
  var writing = false;

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
    if (writing) return;
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
    lastKey = charge().toFixed(0) + "|" + shv.toFixed(1) + "|" + scv.toFixed(1);
    writing = true;
    sh.textContent = shv.toFixed(1) + " °F SH  (seat 8–14)";
    sc.textContent = scv.toFixed(1) + " °F SC  (seat 8–14)";
    var gsh = document.getElementById("g-sh");
    var gsc = document.getElementById("g-sc");
    if (gsh) gsh.textContent = shv.toFixed(1);
    if (gsc) gsc.textContent = scv.toFixed(1);
    writing = false;
  }

  var obs = new MutationObserver(paint);
  function arm() {
    var sh = document.getElementById("sb-sh");
    var sc = document.getElementById("sb-sc");
    if (!sh) return;
    obs.observe(sh, { childList: true, characterData: true, subtree: true });
    if (sc) obs.observe(sc, { childList: true, characterData: true, subtree: true });
  }
  setInterval(function () { arm(); paint(); }, 400);
  arm();
})();
