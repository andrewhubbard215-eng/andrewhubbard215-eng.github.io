/* Analog manifold faces — both sides always visible, follow live LPC/HPC. */
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
    if (lowCv) lowCv.style.cssText = "display:block!important;width:min(42vw,168px)!important;height:auto!important;max-height:none!important;";
    if (highCv) highCv.style.cssText = "display:block!important;width:min(42vw,168px)!important;height:auto!important;max-height:none!important;";
    var chip = document.getElementById("sb-eq-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.id = "sb-eq-chip";
      chip.textContent = "EQUALIZED — unit off. Same sat P both sides (colder coil). Do not read SH/SC until it runs.";
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
    ctx.font = "10px sans-serif";
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
    ctx.font = "10px sans-serif";
    ctx.fillText("R-410A psig", cx, cy + r + 20);
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(psi == null ? "\u2014" : String(Math.round(psi)) + " psig", cx, cy + 28);
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
        chip.textContent = "EQUALIZED — unit off. Same sat P both sides (colder coil). Do not read SH/SC until it runs.";
      } else if (!on) {
        chip.textContent = "STANDING — compressor off. No SH/SC until it runs.";
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
