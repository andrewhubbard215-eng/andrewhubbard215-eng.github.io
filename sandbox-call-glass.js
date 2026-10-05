/* Name the charge call from the SH/SC the tech can read.
   Engine repaint can overwrite the latch. Do not call undercharge off the knob. */
(function () {
  "use strict";
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
  function nameFromGlass() {
    var line = document.getElementById("sb-call");
    var sh = document.getElementById("sb-sh");
    var sc = document.getElementById("sb-sc");
    if (!line || !sh || !sc || !running()) return;
    var shv = readNum(sh);
    var scv = readNum(sc);
    if (shv == null || scv == null) return;
    var ch = charge();
    var text = line.textContent || "";
    if (shv >= 8 && shv <= 14 && scv >= 8 && scv <= 14) {
      if (Math.abs(100 - ch) >= 4) {
        text = "Gauges still in seat (" + shv.toFixed(1) + " SH / " + scv.toFixed(1) + " SC). Charge knob is " + ch.toFixed(0) + "% \u2014 do not call undercharge off the knob. Name it from SH/SC.";
      } else if (/undercharge|overcharge|High SH|low SC/i.test(text)) {
        text = "In seat. TXV \u2014 charge by SC (8\u201314). Airflow first if it drifts.";
      }
    } else if (/do not call undercharge off the knob/.test(text)) {
      text = "SH " + shv.toFixed(1) + " / SC " + scv.toFixed(1) + " \u2014 name the fault from the glass, not the charge knob.";
    }
    if (line.textContent !== text) line.textContent = text;
  }
  setInterval(nameFromGlass, 400);
  document.addEventListener("input", function (ev) {
    if (ev.target && ev.target.id === "sb-charge") setTimeout(nameFromGlass, 60);
  }, true);
})();
