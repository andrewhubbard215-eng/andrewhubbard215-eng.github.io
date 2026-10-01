/* Refrigerant flow overlay — cooling mode, R-410A split system.
   Path matches sandbox seats: compressor L, condenser top, metering R, evaporator bottom. */
(function () {
  "use strict";
  var LEGS = [
    { name: "Suction vapor", state: "LP cool vapor", color: "#38bdf8", a: [50, 78.6], b: [18.75, 53.6] },
    { name: "Discharge vapor", state: "HP hot vapor", color: "#f43f5e", a: [18.75, 53.6], b: [50, 25] },
    { name: "Liquid line", state: "HP subcooled liquid", color: "#fbbf24", a: [50, 25], b: [81.25, 53.6] },
    { name: "Flash to evaporator", state: "LP mix → boil", color: "#5eead4", a: [81.25, 53.6], b: [50, 78.6] }
  ];
  function running() {
    var btn = document.getElementById("sb-run");
    return !!(btn && /stop/i.test(btn.textContent || ""));
  }
  function ensure() {
    var wrap = document.getElementById("sb-canvas-wrap") || document.getElementById("sb-canvas");
    if (!wrap) return null;
    var host = wrap.parentElement || wrap;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var svg = document.getElementById("sb-flow");
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "sb-flow";
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:7;overflow:visible;";
      host.appendChild(svg);
    }
    return svg;
  }
  function line(leg, t) {
    var x1 = leg.a[0], y1 = leg.a[1], x2 = leg.b[0], y2 = leg.b[1];
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.hypot(dx, dy) || 1;
    var ox = (-dy / len) * 4, oy = (dx / len) * 4;
    return { x1: x1 + ox, y1: y1 + oy, x2: x2 + ox, y2: y2 + oy, mx: mx + ox, my: my + oy };
  }
  var phase = 0;
  function draw() {
    var svg = ensure();
    if (!svg) return;
    var on = running();
    phase = (phase + (on ? 0.012 : 0.002)) % 1;
    var html = "";
    LEGS.forEach(function (leg, i) {
      var p = line(leg);
      html += '<line x1="' + p.x1 + '" y1="' + p.y1 + '" x2="' + p.x2 + '" y2="' + p.y2 +
        '" stroke="' + leg.color + '" stroke-width="1.1" stroke-linecap="round" opacity="0.85"/>';
      html += '<text x="' + p.mx + '" y="' + (p.my - 1.6) + '" fill="' + leg.color +
        '" font-size="2.4" font-weight="700" text-anchor="middle">' + leg.name + '</text>';
      html += '<text x="' + p.mx + '" y="' + (p.my + 1.4) + '" fill="#e2e8f0" font-size="1.8" text-anchor="middle">' + leg.state + '</text>';
      for (var k = 0; k < 3; k++) {
        var u = (phase + k / 3 + i * 0.02) % 1;
        var x = p.x1 + (p.x2 - p.x1) * u;
        var y = p.y1 + (p.y2 - p.y1) * u;
        html += '<circle cx="' + x + '" cy="' + y + '" r="' + (on ? 1.15 : 0.7) + '" fill="' + leg.color + '"/>';
      }
    });
    svg.innerHTML = html;
  }
  setInterval(draw, 40);
})();
