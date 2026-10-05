/* Charge off nameplate must move SH/SC.
   TXV: charge by SC (seat 8–14). Piston: charge by chart SH from OD dry bulb + indoor WB.
   Bay repaints every frame — rewrite in the same turn so the glass keeps the print.
   Call line is a separate node so the SH/SC observer does not loop. */
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

  function pistonOn() {
    var kind = "";
    try {
      if (window.HVACSandbox && typeof window.HVACSandbox.meteringKind === "function") {
        kind = window.HVACSandbox.meteringKind() || "";
      }
    } catch (e) {}
    if (!kind) kind = window.LtMeteringKind || "";
    var seat = document.querySelector('#sb-seats .sb-seat[data-seat="metering"]');
    var blob = kind + " " + (seat ? seat.textContent : "") + " " +
      ((document.getElementById("g-method") || {}).textContent || "");
    if (/piston|orifice|fixed/i.test(blob)) return true;
    var btn = document.querySelector("[data-part='piston'], [data-field='piston']");
    if (btn && (btn.classList.contains("on") || btn.classList.contains("active") || btn.getAttribute("aria-pressed") === "true")) return true;
    return false;
  }

  /* Fixed-orifice required-SH chart, school table. OD rows 75/85/95/105, WB cols 55/60/65/70/75. */
  function chartSH(od, wb) {
    var ods = [75, 85, 95, 105];
    var wbs = [55, 60, 65, 70, 75];
    var table = [
      [18, 23, 28, 33, 38],
      [10, 15, 20, 25, 30],
      [5, 10, 15, 20, 25],
      [0, 5, 10, 15, 20]
    ];
    function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    od = clamp(od, 75, 105);
    wb = clamp(wb, 55, 75);
    var oi = 0;
    while (oi < ods.length - 2 && od > ods[oi + 1]) oi++;
    var wi = 0;
    while (wi < wbs.length - 2 && wb > wbs[wi + 1]) wi++;
    var ot = (od - ods[oi]) / (ods[oi + 1] - ods[oi]);
    var wt = (wb - wbs[wi]) / (wbs[wi + 1] - wbs[wi]);
    var r0 = lerp(table[oi][wi], table[oi][wi + 1], wt);
    var r1 = lerp(table[oi + 1][wi], table[oi + 1][wi + 1], wt);
    return Math.round(lerp(r0, r1, ot));
  }

  function seat(shv, scv, piston, target) {
    if (piston) {
      return shv.toFixed(1) + " °F SH  (piston chart " + target + "°F — charge by SH)";
    }
    return shv.toFixed(1) + " °F SH  (TXV seat 8–14)";
  }

  function callText(shv, scv, piston, target) {
    if (!running() || shv == null || scv == null) {
      return "Standing. Equalized P is not a call. Seat four, start, then name SH/SC.";
    }
    if (piston) {
      var dlt = shv - target;
      if (Math.abs(dlt) <= 5) return "Piston chart " + target + "°F. SH in chart. Do not charge by SC.";
      if (dlt > 5) return "SH above piston chart (" + target + "°F). Low charge or low airflow. Do not charge by SC.";
      return "SH under piston chart (" + target + "°F). Flood risk. Pull charge. Do not charge by SC.";
    }
    var shHi = shv > 14, shLo = shv < 8, scHi = scv > 14, scLo = scv < 8;
    if (!shHi && !shLo && !scHi && !scLo) return "In seat. TXV — charge by SC (8–14). Airflow first if it drifts.";
    if (shHi && scLo) return "High SH / low SC — undercharge. Leak and airflow check before adding gas.";
    if (shLo && scHi) return "Low SH / high SC — overcharge. Pull gas. Do not add.";
    if (shHi && scHi) return "High SH / high SC — restriction or dirty coil. Do not add gas.";
    if (shLo && scLo) return "Low SH / low SC — low load or overfeed. Check indoor WB and blower.";
    if (scLo) return "SC under 8 — light on liquid. Charge by SC after airflow.";
    if (scHi) return "SC over 14 — stacked liquid. Pull charge. Charge by SC.";
    if (shHi) return "SH over 14 — starved evap. Confirm airflow, then charge by SC.";
    return "SH under 8 — flood risk. Confirm load before pulling charge.";
  }

  function ensureCall() {
    var line = document.getElementById("sb-call");
    if (line) return line;
    var sh = document.getElementById("sb-sh");
    if (!sh) return null;
    line = document.createElement("p");
    line.id = "sb-call";
    line.setAttribute("data-shop", "fingerprint-call");
    line.style.cssText = "margin:8px 0 0;padding:6px 8px;font:600 13px/1.35 sans-serif;color:#f4e7c8;background:#1a140c;border-left:3px solid #e0a040";
    var anchor = sh.parentElement || sh;
    if (anchor.parentElement) anchor.parentElement.insertBefore(line, anchor.nextSibling);
    else anchor.appendChild(line);
    return line;
  }

  function paint() {
    if (writing) return;
    var sh = document.getElementById("sb-sh");
    var sc = document.getElementById("sb-sc");
    var line = ensureCall();
    if (!sh || !sc) return;
    if (!running()) {
      if (line && line.textContent.indexOf("Standing") !== 0) line.textContent = callText(null, null, false, 0);
      lastKey = "stand";
      return;
    }
    var rawSh = readNum(sh);
    var rawSc = readNum(sc);
    if (rawSh == null || rawSc == null) return;
    var d = (100 - charge()) / 100;
    var off = Math.abs(d) >= 0.04;
    var shv = off ? Math.round((rawSh + d * 40) * 10) / 10 : rawSh;
    var scv = off ? Math.round((rawSc - d * 32) * 10) / 10 : rawSc;
    if (shv < 0) shv = 0;
    if (scv < 0) scv = 0;
    var piston = pistonOn();
    var od = readNum(document.getElementById("sb-out-v")) || 95;
    var wb = readNum(document.getElementById("sb-wb-v")) || 63;
    var target = chartSH(od, wb);
    var key = charge().toFixed(0) + "|" + shv.toFixed(1) + "|" + scv.toFixed(1) + "|" + (piston ? "P" + target : "T");
    if (key === lastKey) return;
    lastKey = key;
    writing = true;
    sh.textContent = seat(shv, scv, piston, target);
    sc.textContent = piston
      ? scv.toFixed(1) + " °F SC  (piston — do not charge by SC)"
      : scv.toFixed(1) + " °F SC  (TXV seat 8–14 — charge by SC)";
    if (line) line.textContent = callText(shv, scv, piston, target);
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
