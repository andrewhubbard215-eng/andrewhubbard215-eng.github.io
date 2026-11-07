/* Analog manifold faces — both sides always visible, follow live LPC/HPC. v26: prove filter/coils before undercharge tip. PC mouse-hold + phone long-press for 0.0 PROVEN green. Safe to seat only after green. */
(function () {
  "use strict";
  function parsePsig(el) {
    if (!el) return null;
    var m = String(el.textContent || el.value || "").match(/(-?\d+)/);
    return m ? Number(m[1]) : null;
  }
  function fromWin() {
    var s = window.LTSandbox || window.sandboxState || window.SB || null;
    if (!s) return { lo: null, hi: null };
    var lo = s.lpc != null ? s.lpc : s.ps != null ? s.ps : s.low;
    var hi = s.hpc != null ? s.hpc : s.ph != null ? s.ph : s.high;
    if (typeof lo === "number" && typeof hi === "number") return { lo: lo, hi: hi };
    return { lo: lo == null ? null : Number(lo), hi: hi == null ? null : Number(hi) };
  }
  function running() {
    var runBtn = document.getElementById("sb-run");
    if (runBtn && /stop/i.test(runBtn.textContent || "")) return true;
    var title = document.getElementById("sb-ps-title");
    if (title && /Suction/i.test(title.textContent || "")) return true;
    var st = document.getElementById("sb-status");
    if (st && /Compressor on/i.test(st.textContent || "")) return true;
    return false;
  }
  function ensure() {
    var box = document.querySelector("#sandbox-root .sb-gauges") || document.getElementById("sb-gauge-run");
    if (!box) return null;
    var wrap = document.getElementById("sb-analog");
    if (!wrap || !document.getElementById("sb-g-low") || !document.getElementById("sb-g-high")) {
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      wrap = document.createElement("div");
      wrap.id = "sb-analog";
      wrap.setAttribute("data-sb-gauges", "1");
      wrap.innerHTML =
        '<canvas id="sb-g-low" width="220" height="220" aria-label="LOW / LPC"></canvas>' +
        '<canvas id="sb-g-high" width="220" height="220" aria-label="HIGH / HPC"></canvas>';
    }
    wrap.style.cssText =
      "display:grid!important;grid-template-columns:1fr 1fr!important;grid-column:1/-1!important;" +
      "justify-items:center!important;gap:6px!important;width:100%!important;" +
      "max-height:none!important;overflow:visible!important;visibility:visible!important;opacity:1!important;";
    var lowCv = wrap.querySelector("#sb-g-low");
    var highCv = wrap.querySelector("#sb-g-high");
    if (lowCv) lowCv.style.cssText = "display:block!important;width:min(48vw,190px)!important;height:auto!important;max-height:none!important;cursor:pointer;";
    if (highCv) highCv.style.cssText = "display:block!important;width:min(48vw,190px)!important;height:auto!important;max-height:none!important;cursor:pointer;";
    [lowCv, highCv].forEach(function(cv) {
      if (!cv || cv.__tapBound) return;
      cv.__tapBound = 1;
      cv.addEventListener("click", function() {
        var big = (cv.style.width || "").indexOf("220") >= 0;
        cv.style.width = big ? "min(48vw,190px)" : "220px";
        cv.style.height = "auto";
        setTimeout(function() { if ((cv.style.width || "").indexOf("220") >= 0) cv.style.width = "min(48vw,190px)"; }, 2500);
      });
      var holdTimer;
      function showZeroMsg() {
        var psi = (cv.dataset.psig ? Number(cv.dataset.psig) : null);
        var isZero = psi != null && Math.abs(psi) < 1;
        var msg = document.createElement("div");
        msg.style.cssText = "position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);background:#0b1220;color:#22c55e;padding:16px 20px;border:2px solid #22c55e;border-radius:8px;z-index:9999;font:bold 18px sans-serif;text-align:center;max-width:80vw;";
        msg.textContent = isZero ? "0.0 PROVEN GREEN — hoses OFF. Safe to seat the hose." : "ZERO FIRST — hoses completely OFF ports. Dial must read 0.0 PROVEN green before any seat.";
        document.body.appendChild(msg);
        setTimeout(function() { if (msg.parentNode) msg.parentNode.removeChild(msg); }, 2200);
      }
      function startHold() { holdTimer = setTimeout(showZeroMsg, 600); }
      function cancelHold() { clearTimeout(holdTimer); }
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
      chip.textContent = "EQUALIZED = DO NOT RECOVER. Unit off. Blue = red ambient only (migration). Never a charge. Zero both (green ring) before any hose. Hold dial for 0.0 PROVEN. Prove filter & coils clear before undercharge. Start, wait stable SH/SC.";
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
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    for (var i = 0; i <= 8; i++) {
      var a = start + (i / 8) * sweep;
      ctx.strokeStyle = "#64748b";
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (r - 4), cy + Math.sin(a) * (r - 4));
      ctx.lineTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14));
      ctx.stroke();
      ctx.fillText(String(Math.round((i / 8) * max)), cx + Math.cos(a) * (r - 26), cy + Math.sin(a) * (r - 26) + 3);
    }
    var p = psi == null ? 0 : Math.max(0, Math.min(max, psi));
    var ang = start + (p / max) * sweep;
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * (r - 18), cy + Math.sin(ang) * (r - 18));
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e2e8f0";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(label, cx, cy + r + 8);
    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText("R-410A psig", cx, cy + r + 20);
    var isPhone = window.innerWidth < 520;
    var isZero = psi != null && Math.abs(psi) < 1;
    if (isZero) {
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy + (isPhone ? 10 : 6), isPhone ? 52 : 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.font = "bold " + (isZero ? (isPhone ? "44" : "32") : (isPhone ? "40" : "28")) + "px sans-serif";
    ctx.fillStyle = isZero ? "#22c55e" : color;
    var numTxt = psi == null ? "\u2014" : (isZero ? "0.0 PROVEN" : String(Math.round(psi)) + " psig");
    ctx.fillText(numTxt, cx, cy + (isPhone ? 32 : 28));
  }
  function first(ids) {
    for (var i = 0; i < ids.length; i++) {
      var v = parsePsig(document.getElementById(ids[i]));
      if (v != null && !isNaN(v)) return v;
    }
    return null;
  }
  var last = "";
  function tick() {
    if (!document.getElementById("sandbox-root")) return;
    if (!ensure()) return;
    var win = fromWin();
    var lo = first(["sb-ps", "g-plow", "sb-lpc"]) ;
    var hi = first(["sb-ph", "g-phigh", "sb-hpc"]);
    if (lo == null && win.lo != null && !isNaN(win.lo)) lo = win.lo;
    if (hi == null && win.hi != null && !isNaN(win.hi)) hi = win.hi;
    var on = running();
    var key = lo + "|" + hi + "|" + on;
    if (key === last && document.getElementById("sb-g-low").dataset.psig != null) return;
    last = key;
    var lowCv = document.getElementById("sb-g-low"), highCv = document.getElementById("sb-g-high");
    draw(lowCv, lo, 200, "#38bdf8", on ? "LOW / LPC suction" : "LOW / LPC standing");
    draw(highCv, hi, 600, "#f43f5e", on ? "HIGH / HPC head" : "HIGH / HPC standing");
    if (lowCv) lowCv.dataset.psig = lo == null ? "" : String(Math.round(lo));
    if (highCv) highCv.dataset.psig = hi == null ? "" : String(Math.round(hi));
    var chip = document.getElementById("sb-eq-chip");
    if (chip) {
      chip.style.display = on ? "none" : "block";
      if (!on && lo != null && hi != null && Math.abs(lo - hi) <= 8) {
        chip.textContent = "EQUALIZED = DO NOT RECOVER. Unit off. Blue = red ambient only (migration). Never a charge. Zero both (green ring) before any hose. Hold dial for 0.0 PROVEN. Prove filter & coils clear before undercharge. Start, wait stable SH/SC.";
      } else if (!on) {
        chip.textContent = "STANDING \u2014 compressor off. No SH/SC until it runs. Zero both gauges first (hoses off). Phone: long-press dial.";
      }
    }
  }
  var mo = null;
  function watch() {
    var root = document.getElementById("sandbox-root");
    if (!root || typeof MutationObserver === "undefined") return;
    if (mo && mo.__root === root) return;
    if (mo) mo.disconnect();
    mo = new MutationObserver(function () { tick(); });
    mo.__root = root;
    mo.observe(root, { childList: true, subtree: true, characterData: true });
  }
  setInterval(function () { watch(); tick(); }, 250);
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t) return;
    var id = t.id || "";
    var txt = (t.textContent || "");
    if (id === "sb-run" || /start compressor|stop compressor/i.test(txt)) {
      last = "";
      setTimeout(tick, 30);
      setTimeout(tick, 200);
      setTimeout(tick, 500);
    }
  }, true);
  if (document.readyState === "complete") { watch(); tick(); }
  else window.addEventListener("load", function () { watch(); tick(); });
})();
