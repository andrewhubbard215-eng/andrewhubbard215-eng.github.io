/* Analog manifold faces — fill the empty well under the diamond. */
(function () {
  "use strict";
  function parsePsig(el) {
    if (!el) return null;
    var m = String(el.textContent || "").match(/(-?\d+)/);
    return m ? Number(m[1]) : null;
  }
  function ensure() {
    var box = document.querySelector("#sandbox-root .sb-gauges");
    if (!box) return null;
    var wrap = document.getElementById("sb-analog");
    if (wrap) return wrap;
    wrap = document.createElement("div");
    wrap.id = "sb-analog";
    wrap.setAttribute("data-sb-gauges", "1");
    wrap.innerHTML =
      '<canvas id="sb-g-low" width="220" height="220" aria-label="LPC"></canvas>' +
      '<canvas id="sb-g-high" width="220" height="220" aria-label="HPC"></canvas>';
    box.parentNode.insertBefore(wrap, box);
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
    ctx.fillText(psi == null ? "—" : String(Math.round(psi)), cx, cy + 28);
  }
  function tick() {
    if (!document.getElementById("sandbox-root")) return;
    ensure();
    draw(document.getElementById("sb-g-low"), parsePsig(document.getElementById("sb-ps")), 200, "#38bdf8", "LPC blue");
    draw(document.getElementById("sb-g-high"), parsePsig(document.getElementById("sb-ph")), 500, "#f43f5e", "HPC red");
  }
  setInterval(tick, 250);
  if (document.readyState === "complete") tick();
  else window.addEventListener("load", tick);
})();
