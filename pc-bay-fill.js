/* PC only: service bay was a 456px strip in an 832px host. Fill it. Keep phone caps. */
(function () {
  "use strict";
  if (window.__pcBayFill) return;
  window.__pcBayFill = 1;
  var css = document.createElement("style");
  css.id = "pc-bay-fill";
  css.textContent = "@media(min-width:960px){#svc-system-host{display:flex!important;flex-direction:column}#lt-ticket-bay{flex:1 1 auto;min-height:100%!important;height:100%}#lt-g-low,#lt-g-high{max-height:none!important;height:min(46vh,420px)!important;min-height:260px;width:100%}}";
  document.head.appendChild(css);

  function nums() {
    var preview = document.getElementById("lt-preview");
    var text = preview ? preview.textContent : "";
    var blue = text.match(/Blue\s+(\d+)/);
    var red = text.match(/Red\s+(\d+)/);
    if (!blue || !red) return null;
    return { blue: Number(blue[1]), red: Number(red[1]) };
  }

  function draw(canvas, psig, max, face, needle) {
    if (!canvas) return;
    var box = canvas.getBoundingClientRect();
    if (box.width < 40 || box.height < 40) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var bw = Math.max(280, Math.round(box.width * dpr));
    var bh = Math.max(240, Math.round(box.height * dpr));
    if (Math.abs(canvas.width - bw) > 6 || Math.abs(canvas.height - bh) > 6) {
      canvas.width = bw;
      canvas.height = bh;
    }
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2 + 6;
    var r = Math.min(w, h) * 0.42;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = "#1a140c";
    ctx.fill();
    ctx.lineWidth = Math.max(8, Math.round(h * 0.03));
    ctx.strokeStyle = face;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = "#3a3226";
    ctx.lineWidth = Math.max(6, Math.round(h * 0.02));
    ctx.stroke();
    var frac = Math.max(0, Math.min(1, psig / max));
    var ang = Math.PI * 0.75 + frac * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * (r - 14), cy + Math.sin(ang) * (r - 14));
    ctx.strokeStyle = needle;
    ctx.lineWidth = Math.max(3, Math.round(h * 0.012));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f4e7c8";
    ctx.fill();
    var dig = Math.max(28, Math.round(Math.min(w, h) * 0.16));
    var plateW = Math.round(dig * 3.6);
    var plateH = Math.round(dig * 1.7);
    var plateY = cy + Math.round(h * 0.06);
    ctx.fillStyle = "#0e0c09";
    ctx.fillRect(cx - plateW / 2, plateY, plateW, plateH);
    ctx.fillStyle = "#f4e7c8";
    ctx.textAlign = "center";
    ctx.font = "bold " + dig + "px sans-serif";
    ctx.fillText(String(psig), cx, plateY + dig);
    ctx.font = Math.round(dig * 0.42) + "px sans-serif";
    ctx.fillText("psig", cx, plateY + dig + Math.round(dig * 0.42));
  }

  function tick() {
    if (window.innerWidth < 960) return;
    var svc = document.getElementById("screen-service");
    if (!svc || !svc.classList.contains("active")) return;
    var n = nums();
    if (!n) return;
    draw(document.getElementById("lt-g-low"), n.blue, 250, "#1d4e89", "#7eb6ff");
    draw(document.getElementById("lt-g-high"), n.red, 500, "#8a1d2b", "#ff8b8b");
  }
  setInterval(tick, 700);
})();
