/* Analog manifold faces — both sides always visible, follow live LPC/HPC. v34: hold progress larger + higher contrast on phone for 0.0 PROVEN. v33: long-press hold progress bigger + clearer on phone. v32: long-press 0.0 check clearer on phone + hold progress. v31: clearer FIRST seat LEFT + ZERO green before hose. Equalized STOP do not recover. LOTO meter 24V. Parts LEFT. No combat. */
(function () {
  "use strict";
  function parsePsig(el) {
    if (!el) return null;
    var m = String(el.textContent || "").match(/(-?\d+(?:\.\d+)?)/);
    return m ? Number(m[1]) : null;
  }
  function ensureWrap(box) {
    var wrap = document.getElementById("sb-analog-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "sb-analog-wrap";
      wrap.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0;justify-items:center;";
      var blue = document.createElement("canvas");
      blue.id = "sb-gauge-blue";
      blue.width = 180; blue.height = 160;
      blue.style.cssText = "width:min(48vw,190px);height:auto;touch-action:manipulation;cursor:pointer;";
      blue.dataset.label = "SUCTION / LPC";
      blue.dataset.color = "#38bdf8";
      blue.dataset.max = "400";
      var red = document.createElement("canvas");
      red.id = "sb-gauge-red";
      red.width = 180; red.height = 160;
      red.style.cssText = "width:min(48vw,190px);height:auto;touch-action:manipulation;cursor:pointer;";
      red.dataset.label = "LIQUID / HPC";
      red.dataset.color = "#f87171";
      red.dataset.max = "600";
      wrap.appendChild(blue);
      wrap.appendChild(red);
      var tip = document.createElement("div");
      tip.style.cssText = "grid-column:1/-1;text-align:center;font:bold 12px sans-serif;color:#22c55e;margin-top:4px";
      tip.textContent = "ZERO BOTH FIRST (hoses OFF) \u2192 seat 4 LEFT \u2192 then power";
      wrap.appendChild(tip);
    }
    ["sb-gauge-blue", "sb-gauge-red"].forEach(function (id) {
      var cv = document.getElementById(id);
      if (!cv || cv.__tapBound) return;
      cv.__tapBound = 1;
      cv.addEventListener("click", function() {
        var big = (cv.style.width || "").indexOf("220") >= 0;
        cv.style.width = big ? "min(48vw,190px)" : "220px";
        cv.style.height = "auto";
        setTimeout(function() { if ((cv.style.width || "").indexOf("220") >= 0) cv.style.width = "min(48vw,190px)"; }, 2500);
      });
      var holdTimer, holdProgress;
      function showZeroMsg() {
        if (holdProgress && holdProgress.parentNode) holdProgress.parentNode.removeChild(holdProgress);
        var psi = (cv.dataset.psig ? Number(cv.dataset.psig) : null);
        var isZero = psi != null && Math.abs(psi) < 1;
        var msg = document.createElement("div");
        msg.style.cssText = "position:fixed;top:38%;left:50%;transform:translate(-50%,-50%);background:#0b1220;color:#22c55e;padding:20px 24px;border:3px solid #22c55e;border-radius:10px;z-index:9999;font:bold 20px sans-serif;text-align:center;max-width:85vw;box-shadow:0 0 20px #22c55e55;";
        msg.innerHTML = isZero ? "0.0 PROVEN GREEN<br>hoses OFF \u00b7 safe to seat" : "ZERO BOTH FIRST<br>hoses completely OFF ports<br>must read 0.0 PROVEN green";
        document.body.appendChild(msg);
        setTimeout(function() { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 2800);
      }
      function startHold() {
        clearTimeout(holdTimer);
        if (holdProgress && holdProgress.parentNode) holdProgress.parentNode.removeChild(holdProgress);
        holdProgress = document.createElement("div");
        holdProgress.style.cssText = "position:absolute;top:2px;left:50%;transform:translateX(-50%);background:#0b1220;color:#22c55e;padding:8px 14px;border:2px solid #22c55e;border-radius:8px;font:bold 18px sans-serif;z-index:10;pointer-events:none;box-shadow:0 0 8px #22c55e88;";
        holdProgress.textContent = "HOLD for 0.0 PROVEN";
        cv.style.position = "relative";
        cv.appendChild(holdProgress);
        holdTimer = setTimeout(showZeroMsg, 650);
      }
      function cancelHold() {
        clearTimeout(holdTimer);
        if (holdProgress && holdProgress.parentNode) holdProgress.parentNode.removeChild(holdProgress);
        holdProgress = null;
      }
      cv.addEventListener("touchstart", startHold);
      cv.addEventListener("touchend", cancelHold);
      cv.addEventListener("touchcancel", cancelHold);
      cv.addEventListener("mousedown", startHold);
      cv.addEventListener("mouseup", cancelHold);
      cv.addEventListener("mouseleave", cancelHold);
      cv.addEventListener("contextmenu", function(e) { e.preventDefault(); });
    });
    var chip = document.getElementById("sb-eq-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "sb-eq-chip";
      chip.textContent = "STOP \u2014 DO NOT RECOVER. FIRST: seat COMP\u00b7COND\u00b7TXV\u00b7EVAP LEFT. ZERO both (green 0.0 PROVEN, hoses OFF). LOTO + meter 24V string. Unit off. Blue=red=ambient = migration only. Never recover, never add. Prove filter & coils CLEAR (no dirt, no ice) before naming undercharge. NEVER add to ice. Then power on, wait 5-10 min stable SH/SC.";
    }
    if (chip.parentNode !== box) box.insertBefore(chip, box.firstChild);
    if (wrap.parentNode !== box) box.insertBefore(wrap, chip.nextSibling);
    return wrap;
  }
  function draw(cv, psi, max, color, label) {
    if (!cv) return;
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    var w = cv.width, h = cv.height, cx = w / 2, cy = h / 2 + 8, r = Math.min(w, h) * 0.42;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0b1220";
    ctx.beginPath();
    ctx.arc(cx, cy, r + 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();
    var start = Math.PI * 0.75, sweep = Math.PI * 1.5;
    ctx.fillStyle = "#94a3b8";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    var ticks = [0, 50, 100, 150, 200, 250, 300, 350, 400];
    if (max > 450) ticks = [0, 100, 200, 300, 400, 500, 600];
    ticks.forEach(function (t) {
      if (t > max) return;
      var ang = start + sweep * (t / max);
      var tx = cx + Math.cos(ang) * (r - 18);
      var ty = cy + Math.sin(ang) * (r - 18);
      ctx.fillText(String(t), tx, ty);
    });
    var isZero = psi != null && Math.abs(psi) < 1;
    if (isZero) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
      ctx.stroke();
    }
    var isPhone = window.innerWidth < 700;
    ctx.font = "bold " + (isZero ? (isPhone ? "44" : "32") : (isPhone ? "40" : "28")) + "px sans-serif";
    ctx.fillStyle = isZero ? "#22c55e" : color;
    var numTxt = psi == null ? "\u2014" : (isZero ? "0.0 PROVEN" : String(Math.round(psi)) + " psig");
    ctx.fillText(numTxt, cx, cy + 6);
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#e2e8f0";
    ctx.fillText(label, cx, cy + 28);
    if (psi != null && !isZero) {
      var ang = start + sweep * Math.min(1, Math.max(0, psi / max));
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(ang) * (r - 28), cy + Math.sin(ang) * (r - 28));
      ctx.stroke();
    }
  }
  function paint() {
    var box = document.getElementById("sb-readout") || document.getElementById("sandbox-bay") || document.querySelector(".sandbox-bay");
    if (!box) return;
    var wrap = ensureWrap(box);
    var blue = document.getElementById("sb-gauge-blue");
    var red = document.getElementById("sb-gauge-red");
    var lp = parsePsig(document.getElementById("sb-lpc"));
    var hp = parsePsig(document.getElementById("sb-hpc"));
    if (blue) { blue.dataset.psig = lp == null ? "" : String(lp); draw(blue, lp, 400, "#38bdf8", "SUCTION / LPC"); }
    if (red) { red.dataset.psig = hp == null ? "" : String(hp); draw(red, hp, 600, "#f87171", "LIQUID / HPC"); }
    var chip = document.getElementById("sb-eq-chip");
    if (chip) {
      var eq = lp != null && hp != null && Math.abs(lp - hp) < 8;
      if (eq) {
        chip.textContent = "STOP \u2014 DO NOT RECOVER. FIRST: seat COMP\u00b7COND\u00b7TXV\u00b7EVAP LEFT. ZERO both (green 0.0 PROVEN, hoses OFF). LOTO + meter 24V string. Unit off. Blue=red=ambient = migration only. Never recover, never add. Prove filter & coils CLEAR (no dirt, no ice) before naming undercharge. NEVER add to ice. Then power on, wait 5-10 min stable SH/SC.";
        chip.style.color = "#fbbf24";
      } else {
        chip.textContent = "STANDING \u2014 compressor off. Parts LEFT. No SH/SC until it runs. Zero both gauges first (hoses off). Phone: tap dial to enlarge \u00b7 long-press for 0.0 check.";
        chip.style.color = "#94a3b8";
      }
    }
  }
  setInterval(paint, 400);
  document.addEventListener("DOMContentLoaded", paint);
})();
