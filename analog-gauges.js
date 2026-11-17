/* Analog manifold faces — both sides always visible, follow live LPC/HPC. v46: clearer seat LEFT on both-zero chip. Parts LEFT. No combat. */
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
      tip.textContent = "ZERO BOTH FIRST — hoses COMPLETELY OFF ports, green 0.0 PROVEN on BOTH. Then seat 4 LEFT. LOTO + meter 24V if powered. Prove zero every hook-up. Equalized (blue=red) = migration ONLY — DO NOT RECOVER or ADD. Standing is NOT a charge — never add refrigerant on equalized or standing. Only charge after run with proven SH/SC. 80% recovery tank is scale weight ONLY — never gauge or feel. NEVER JUMP A SAFETY. Parts LEFT only.";
      wrap.appendChild(tip);
      var bothChip = document.createElement("div");
      bothChip.id = "sb-both-zero-chip";
      bothChip.style.cssText = "grid-column:1/-1;text-align:center;font:bold 15px sans-serif;color:#22c55e;margin-top:2px;display:none;background:#0a1a0a;padding:4px;border-radius:4px";
      bothChip.textContent = "BOTH DIALS 0.0 PROVEN GREEN — hoses OFF. SEAT 4 LEFT. PARTS LEFT. LOTO if powered. Standing ≠ charge. Never add on equalized. 80% recovery tank = SCALE WEIGHT ONLY — never gauge or feel."; bothChip.style.border = "2px solid #22c55e";
      wrap.appendChild(bothChip);
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
        msg.innerHTML = isZero ? "0.0 PROVEN GREEN<br>this dial OK · prove BOTH · hoses OFF" : "ZERO BOTH FIRST<br>hoses completely OFF ports<br>must read 0.0 PROVEN green";
        if (isZero) {
          cv.dataset.zeroProven = "1";
          var blue = document.getElementById("sb-gauge-blue");
          var red = document.getElementById("sb-gauge-red");
          var chip = document.getElementById("sb-both-zero-chip");
          if (blue && red && blue.dataset.zeroProven === "1" && red.dataset.zeroProven === "1" && chip) {
            chip.style.display = "block";
            chip.style.color = "#22c55e";
          }
        }
        document.body.appendChild(msg);
        setTimeout(function() { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 2800);
      }
      function startHold() {
        clearTimeout(holdTimer);
        if (holdProgress && holdProgress.parentNode) holdProgress.parentNode.removeChild(holdProgress);
        holdProgress = document.createElement("div");
        holdProgress.style.cssText = "position:fixed;bottom:18%;left:50%;transform:translateX(-50%);background:#0b1220;color:#fbbf24;padding:10px 16px;border:2px solid #fbbf24;border-radius:8px;z-index:9998;font:bold 16px sans-serif;text-align:center;";
        holdProgress.textContent = "HOLD for 0.0 PROVEN";
        document.body.appendChild(holdProgress);
        holdTimer = setTimeout(showZeroMsg, 500);
      }
      function endHold() {
        clearTimeout(holdTimer);
        if (holdProgress && holdProgress.parentNode) holdProgress.parentNode.removeChild(holdProgress);
      }
      cv.addEventListener("pointerdown", startHold);
      cv.addEventListener("pointerup", endHold);
      cv.addEventListener("pointerleave", endHold);
      cv.addEventListener("pointercancel", endHold);
    });
    if (box && !box.contains(wrap)) box.insertBefore(wrap, box.firstChild);
    return wrap;
  }
  function draw(cv, psi) {
    var ctx = cv.getContext("2d");
    var w = cv.width, h = cv.height;
    ctx.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h * 0.62, r = Math.min(w, h) * 0.42;
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 14;
    ctx.stroke();
    var max = Number(cv.dataset.max) || 400;
    var frac = Math.max(0, Math.min(1, (psi || 0) / max));
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * frac);
    ctx.strokeStyle = cv.dataset.color || "#38bdf8";
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText((psi == null ? "--" : psi.toFixed(1)) + " psig", cx, cy - 6);
    ctx.font = "11px sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(cv.dataset.label || "", cx, cy + 16);
  }
  function tick() {
    var box = document.getElementById("sandbox-gauges") || document.getElementById("sb-gauges") || document.querySelector(".sb-gauges, #sandbox-root .gauges");
    if (!box) return;
    ensureWrap(box);
    var blue = document.getElementById("sb-gauge-blue");
    var red = document.getElementById("sb-gauge-red");
    var lpc = document.getElementById("sb-lpc") || document.querySelector("[data-psi='lpc'], .psi-low");
    var hpc = document.getElementById("sb-hpc") || document.querySelector("[data-psi='hpc'], .psi-high");
    var lp = parsePsig(lpc);
    var hp = parsePsig(hpc);
    if (blue) { blue.dataset.psig = lp == null ? "" : String(lp); draw(blue, lp); }
    if (red) { red.dataset.psig = hp == null ? "" : String(hp); draw(red, hp); }
    var chip = document.getElementById("sb-eq-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "sb-eq-chip";
      chip.style.cssText = "grid-column:1/-1;text-align:center;font:bold 11px sans-serif;color:#fbbf24;margin-top:2px;max-width:92vw";
      var wrap = document.getElementById("sb-analog-wrap");
      if (wrap) wrap.appendChild(chip);
    }
    if (chip) {
      var amb = 75;
      var eq = lp != null && hp != null && Math.abs(lp - hp) < 8 && Math.abs(lp - amb) < 12;
      chip.textContent = eq ? "STOP — DO NOT RECOVER or ADD. FIRST: seat COMP\u00b7COND\u00b7TXV\u00b7EVAP LEFT. ZERO both (green 0.0 PROVEN, hoses OFF). LOTO + meter 24V string. Unit off. Blue=red=ambient = migration only. Never recover, never add. Prove filter & coils CLEAR — no dirt, no ice — before naming undercharge. Iced suction = DO NOT ADD or RECOVER. NEVER add to ice. Then power on, wait 5-10 min stable SH/SC. Parts LEFT only." : "Prove ZERO both dials every hook-up. Seat 4 LEFT. LOTO first. Standing is NOT a charge.";
    }
  }
  setInterval(tick, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
})();
