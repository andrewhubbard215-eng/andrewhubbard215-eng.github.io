/* Allstars — refrigeration-poster pipes on the diamond. No third-party logo. */
(function () {
  "use strict";
  var NODES = {
    compressor: { x: 120, y: 150, lab: "COMP" },
    condenser: { x: 320, y: 70, lab: "COND" },
    metering: { x: 520, y: 150, lab: "TXV" },
    evaporator: { x: 320, y: 220, lab: "EVAP" }
  };
  var raf = 0;
  var t0 = 0;

  function seated(id) {
    var plate = document.querySelector('#sb-seats .sb-seat[data-seat="' + id + '"]');
    if (plate && plate.classList.contains("on")) return true;
    var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
    return !!(part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true"));
  }
  function running() {
    var run = document.getElementById("sb-run");
    return !!(run && /stop/i.test(run.textContent || ""));
  }
  function ensureCanvas() {
    var wrap = document.getElementById("sb-canvas-wrap");
    var base = document.getElementById("sb-canvas");
    if (!wrap || !base) return null;
    var c = document.getElementById("sb-poster");
    if (!c) {
      c = document.createElement("canvas");
      c.id = "sb-poster";
      c.width = base.width || 640;
      c.height = base.height || 280;
      c.setAttribute("aria-hidden", "true");
      c.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2;border-radius:8px";
      wrap.style.position = wrap.style.position || "relative";
      wrap.insertBefore(c, wrap.firstChild.nextSibling);
      var seats = document.getElementById("sb-seats");
      if (seats) wrap.insertBefore(c, seats);
      else wrap.appendChild(c);
    }
    if (c.width !== (base.width || 640) || c.height !== (base.height || 280)) {
      c.width = base.width || 640;
      c.height = base.height || 280;
    }
    return c;
  }
  function pipe(ctx, a, b, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = width + 4;
    ctx.stroke();
    ctx.restore();
  }
  function label(ctx, n, color) {
    ctx.fillStyle = color || "#f8fafc";
    ctx.font = "bold 12px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    var lx = n.x,
      ly = n.y;
    if (n.lab === "COND") ly = n.y - 38;
    else if (n.lab === "EVAP") ly = n.y + 40;
    else if (n.lab === "COMP") {
      ctx.textAlign = "left";
      lx = n.x + 34;
    } else if (n.lab === "TXV" || n.lab === "PISTON" || n.lab === "EEV") {
      ctx.textAlign = "right";
      lx = n.x - 34;
    }
    ctx.strokeStyle = "rgba(0,0,0,.55)";
    ctx.lineWidth = 3;
    ctx.strokeText(n.lab, lx, ly);
    ctx.fillText(n.lab, lx, ly);
  }
  function flashAtTxv(ctx, n, phase) {
    var spikes = 7;
    for (var i = 0; i < spikes; i++) {
      var ang = -Math.PI / 2 + (i - 3) * 0.22 + Math.sin(phase + i) * 0.05;
      var len = 18 + (i % 3) * 6 + Math.sin(phase * 2 + i) * 3;
      ctx.strokeStyle = i % 2 ? "rgba(253,224,71,.95)" : "rgba(255,255,255,.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(n.x + Math.cos(ang) * len, n.y + Math.sin(ang) * len + 8);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(147,197,253,.45)";
    for (var j = 0; j < 5; j++) {
      var t = (phase * 0.4 + j * 0.15) % 1;
      var x = n.x + (NODES.evaporator.x - n.x) * t;
      var y = n.y + (NODES.evaporator.y - n.y) * t + Math.sin(phase + j) * 4;
      ctx.beginPath();
      ctx.arc(x, y, 2 + (1 - t) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  function draw(ts) {
    var c = ensureCanvas();
    if (!c) {
      raf = requestAnimationFrame(draw);
      return;
    }
    if (!t0) t0 = ts;
    var phase = (ts - t0) / 180;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    var comp = NODES.compressor,
      cond = NODES.condenser,
      txv = Object.assign({}, NODES.metering),
      evap = NODES.evaporator;
    var kind = (window.LtMeteringKind || "txv").toLowerCase();
    if (kind === "piston" || kind === "orifice") txv.lab = "PISTON";
    else if (kind === "eev") txv.lab = "EEV";
    else txv.lab = "TXV";

    ctx.strokeStyle = "rgba(51,65,85,.55)";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(comp.x, comp.y);
    ctx.lineTo(cond.x, cond.y);
    ctx.lineTo(txv.x, txv.y);
    ctx.lineTo(evap.x, evap.y);
    ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    var on = running();
    var w = on ? 7 : 5;
    /* RED discharge COMP→COND */
    if (seated("compressor") && seated("condenser")) pipe(ctx, comp, cond, "#ef4444", w);
    else pipe(ctx, comp, cond, "rgba(239,68,68,.28)", 3);
    /* ORANGE liquid COND→TXV */
    if (seated("condenser") && seated("metering")) pipe(ctx, cond, txv, "#f59e0b", w);
    else pipe(ctx, cond, txv, "rgba(245,158,11,.28)", 3);
    /* LOW blue after TXV flash through EVAP */
    if (seated("metering") && seated("evaporator")) pipe(ctx, txv, evap, "#3b82f6", w - 1);
    else pipe(ctx, txv, evap, "rgba(59,130,246,.25)", 3);
    /* BLUE suction EVAP→COMP */
    if (seated("evaporator") && seated("compressor")) pipe(ctx, evap, comp, "#3b82f6", w);
    else pipe(ctx, evap, comp, "rgba(59,130,246,.28)", 3);

    if (seated("metering") && on) flashAtTxv(ctx, txv, phase);

    label(ctx, comp, "#f8fafc");
    label(ctx, cond, "#f8fafc");
    label(ctx, txv, "#fde68a");
    label(ctx, evap, "#f8fafc");

    ctx.font = "10px ui-sans-serif, system-ui, sans-serif";
    ctx.textAlign = "left";
    var legend = [
      ["#ef4444", "Discharge"],
      ["#f59e0b", "Liquid"],
      ["#3b82f6", "Suction"]
    ];
    var lx = 12,
      ly = c.height - 12;
    legend.forEach(function (row, i) {
      ctx.fillStyle = row[0];
      ctx.fillRect(lx + i * 88, ly - 7, 10, 4);
      ctx.fillStyle = "rgba(248,250,252,.8)";
      ctx.fillText(row[1], lx + 14 + i * 88, ly - 3);
    });

    raf = requestAnimationFrame(draw);
  }
  function start() {
    if (!raf) raf = requestAnimationFrame(draw);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  var obs = new MutationObserver(function () {
    ensureCanvas();
  });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
})();
