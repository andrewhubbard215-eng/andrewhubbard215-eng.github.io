/* Analog manifold faces v3 — follow live LPC/HPC (sb-ps / sb-ph / g-plow / g-phigh) on every change.
   "standing" only while the compressor is OFF. Mounted inside #sandbox-root .sb-gauges. */
(function () {
  "use strict";
  function parsePsig(el) {
    if (!el) return null;
    var m = String(el.textContent || "").match(/(-?\d+)/);
    return m ? Number(m[1]) : null;
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
    var box = document.querySelector("#sandbox-root .sb-gauges");
    if (!box) return null;
    var wrap = document.getElementById("sb-analog");
    if (!wrap || !document.getElementById("sb-g-low") || !document.getElementById("sb-g-high") || !document.getElementById("sb-eq-chip")) {
      if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      wrap = document.createElement("div");
      wrap.id = "sb-analog";
      wrap.setAttribute("data-sb-gauges", "1");
      wrap.innerHTML =
        '<canvas id="sb-g-low" width="220" height="220" aria-label="LPC"></canvas>' +
        '<canvas id="sb-g-high" width="220" height="220" aria-label="HPC"></canvas>' +
        '<div id="sb-eq-chip" style="display:none;width:100%;margin:4px 0 0;padding:6px 10px;border-radius:8px;background:#1e293b;color:#fde68a;font:600 12px/1.3 sans-serif;text-align:center">EQUALIZED — unit off. Do not read SH/SC until it runs.</div>';
    }
    if (wrap.parentNode !== box) box.insertBefore(wrap, box.firstChild);
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
      var x1 = cx + Math.cos(a) * (r - 4);
      var y1 = cy + Math.sin(a) * (r - 4);
      var x2 = cx + Math.cos(a) * (r - 14);
      var y2 = cy + Math.sin(a) * (r - 14);
      ctx.strokeStyle = "#64748b";
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
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
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(psi == null ? "\u2014" : String(Math.round(psi)), cx, cy + 28);
  }
  function first(ids) {
    for (var i = 0; i < ids.length; i++) {
      var v = parsePsig(document.getElementById(ids[i]));
      if (v != null) return v;
    }
    return null;
  }
  var last = "";
  function tick() {
    if (!document.getElementById("sandbox-root")) return;
    if (!ensure()) return;
    var lo = first(["sb-ps", "g-plow"]);
    var hi = first(["sb-ph", "g-phigh"]);
    var on = running();
    var key = lo + "|" + hi + "|" + on;
    if (key === last && document.getElementById("sb-g-low").dataset.psig != null) return;
    last = key;
    var lowCv = document.getElementById("sb-g-low"), highCv = document.getElementById("sb-g-high");
    draw(lowCv, lo, 400, "#38bdf8", on ? "LPC suction" : "LPC standing");
    draw(highCv, hi, 500, "#f43f5e", on ? "HPC head" : "HPC standing");
    lowCv.dataset.psig = lo == null ? "" : String(Math.round(lo));
    highCv.dataset.psig = hi == null ? "" : String(Math.round(hi));
    lowCv.dataset.label = on ? "LPC suction" : "LPC standing";
    highCv.dataset.label = on ? "HPC head" : "HPC standing";
    var chip = document.getElementById("sb-eq-chip");
    if (chip) {
      chip.style.display = on ? "none" : "block";
      if (!on && lo != null && hi != null && Math.abs(lo - hi) <= 8) {
        chip.textContent = "EQUALIZED — unit off. Same sat P both sides. Do not read SH/SC until it runs.";
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
  if (document.readyState === "complete") { watch(); tick(); }
  else window.addEventListener("load", function () { watch(); tick(); });
})();
