/* Name the charge call from the SH/SC the tech can read.
   Engine repaint can overwrite the latch. Do not call undercharge off the knob.
   Noncondensable: glass stays clear. Call is air, not a leak, not a top-off. */
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
  function noncondensableOn() {
    var nodes = document.querySelectorAll("button, [data-fault]");
    for (var i = 0; i < nodes.length; i++) {
      var label = (nodes[i].textContent || "") + " " + (nodes[i].getAttribute("data-fault") || "");
      if (!/noncondensable/i.test(label)) continue;
      var cls = nodes[i].className || "";
      if (/\bprimary\b|\bon\b|\bactive\b|\bsel\b/.test(cls)) return true;
      if (nodes[i].getAttribute("aria-pressed") === "true") return true;
    }
    var st = ((document.getElementById("sb-status") || {}).textContent || "") + " " +
      ((document.getElementById("sb-fault") || {}).textContent || "");
    return /noncondensable|air in the circuit/i.test(st);
  }
  function pistonOn() {
    var st = state();
    return /piston chart|fixed orifice|piston 75/i.test(st);
  }
  function mildOn() {
    var st = ((document.getElementById("sb-status") || {}).textContent || "") + " " +
      ((document.getElementById("sb-fault") || {}).textContent || "");
    return /mild day|low load|light load/i.test(st);
  }
  function weakOn() {
    var st = ((document.getElementById("sb-status") || {}).textContent || "") + " " +
      ((document.getElementById("sb-fault") || {}).textContent || "");
    return /weak compressor|weak valves|worn compressor/i.test(st);
  }
  function icedOn() {
    var st = ((document.getElementById("sb-status") || {}).textContent || "") + " " +
      ((document.getElementById("sb-fault") || {}).textContent || "");
    return /iced evaporator|dirty id|low airflow|dirty indoor/i.test(st);
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
    if (noncondensableOn()) {
      text = "Air / noncondensables. Glass stays clear — not a leak. High head + high SC. Recover, evacuate, weigh in. Do not add gas.";
    } else if (pistonOn()) {
      text = "Piston chart on a 75° day. 18 SH is the target, not TXV 10. SC 10 is the check. Do not add gas to hit 10.";
    } else if (mildOn()) {
      text = "Mild day / low load. 11 SH / 10 SC, head soft, amps normal. Weather, not weak valves. Do not add gas. Do not condemn the compressor.";
    } else if (weakOn()) {
      text = "Weak compressor. 26 SH / 10 SC, head low, amps low. SC in band — not a leak. Do not add gas.";
    } else if (shv >= 8 && shv <= 14 && scv >= 8 && scv <= 14) {
      if (Math.abs(100 - ch) >= 4) {
        text = "Gauges still in seat (" + shv.toFixed(1) + " SH / " + scv.toFixed(1) + " SC). Charge knob is " + ch.toFixed(0) + "% — do not call undercharge off the knob. Name it from SH/SC.";
      } else if (/undercharge|overcharge|High SH|low SC/i.test(text)) {
        text = "In seat. TXV — charge by SC (8–14). Airflow first if it drifts.";
      }
    } else if (/do not call undercharge off the knob/.test(text)) {
      text = "SH " + shv.toFixed(1) + " / SC " + scv.toFixed(1) + " — name the fault from the glass, not the charge knob.";
    }
    if (line.textContent !== text) line.textContent = text;
  }
  function paintGlass(shv, scv) {
    var sc = document.getElementById("sb-sc");
    if (!sc || !sc.parentNode) return;
    var line = document.getElementById("sb-glass");
    if (!line) {
      line = document.createElement("div");
      line.id = "sb-glass";
      line.setAttribute("data-shop", "sight-glass");
      line.style.marginTop = "6px";
      line.style.fontWeight = "700";
      line.style.color = "#f4e7c8";
      sc.parentNode.insertBefore(line, sc.nextSibling);
    }
    var text;
    if (!running() || scv == null) {
      var cut = document.getElementById("sb-cutout");
      var cutOn = cut && /HPC CUTOUT/i.test(cut.textContent || "") && cut.style.display !== "none";
      if (noncondensableOn() && cutOn) {
        text = "Sight glass: no flow — compressor off on HPC. Column was clear, not bubbles. Air in the circuit, not a leak. Recover, evacuate, weigh in. Do not add gas.";
      } else {
        text = "Sight glass: no flow. Compressor off — bubbles mean nothing.";
      }
    } else if (noncondensableOn()) {
      text = "Sight glass: clear. Not bubbles. Not a leak. Air in the circuit — high head + high SC. Recover, evacuate, weigh in. Do not add gas.";
    } else if (icedOn()) {
      text = "Sight glass: clear. Not bubbles. Coil is iced — near-zero SH, SC in band. Filter, blower, coil. Do not add gas.";
    } else if (pistonOn()) {
      text = "Sight glass: clear. Not bubbles. Piston at chart — 18 SH on a 75° day is not a low charge. Do not add gas to hit TXV 10.";
    } else if (mildOn()) {
      text = "Sight glass: clear. Not bubbles. SH and SC in band. Soft head is a 70° day, not a leak and not a weak compressor.";
    } else if (weakOn()) {
      text = "Sight glass: clear. Not bubbles. Charge is still in the column. High SH + low head + low amps = weak compressor, not a leak. Do not add gas.";
    } else if (scv < 4) {
      text = "Sight glass: bubbles / flash gas. SC " + scv.toFixed(1) + " — low. Find the leak. Do not top off.";
    } else if (scv < 8) {
      text = "Sight glass: occasional bubble. SC " + scv.toFixed(1) + " short of seat 8–14.";
    } else if (shv != null && shv > 16 && scv > 16) {
      text = "Sight glass: clear. SC " + scv.toFixed(1) + " high with high SH — liquid stacked ahead of the restriction. Do not add gas.";
    } else if (shv != null && shv > 16 && scv >= 8 && scv <= 16) {
      text = "Sight glass: clear. SC " + scv.toFixed(1) + " in band, SH high — not a restriction. Restriction stacks liquid and SC. Bulb is off the suction line. Strap it. Do not add gas.";
    } else if (shv != null && shv < 6 && scv > 16) {
      text = "Sight glass: clear / full. High SC is overcharge, not a bubble call.";
    } else {
      text = "Sight glass: clear. Full column. Charge by SC (8–14), not by bubbles.";
    }
    if (line.textContent !== text) line.textContent = text;
  }
  function tick() {
    nameFromGlass();
    var sh = document.getElementById("sb-sh");
    var sc = document.getElementById("sb-sc");
    paintGlass(readNum(sh), readNum(sc));
  }
  setInterval(tick, 400);
  document.addEventListener("input", function (ev) {
    if (ev.target && ev.target.id === "sb-charge") setTimeout(tick, 60);
  }, true);
})();
