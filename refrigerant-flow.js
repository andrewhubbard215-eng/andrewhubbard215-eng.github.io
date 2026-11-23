/* Flow lines lock to live seat centers. No guessed X. */
(function () {
  "use strict";
  var LEGS = [
    { name: "Suction", state: "LP vapor", color: "#38bdf8", from: "evaporator", to: "compressor" },
    { name: "Discharge", state: "HP hot vapor", color: "#f43f5e", from: "compressor", to: "condenser" },
    { name: "Liquid", state: "HP liquid", color: "#fbbf24", from: "condenser", to: "metering" },
    { name: "Flash", state: "LP mix", color: "#5eead4", from: "metering", to: "evaporator" }
  ];
  function running() {
    var btn = document.getElementById("sb-run");
    return !!(btn && /stop/i.test(btn.textContent || ""));
  }
  function hostEl() {
    return document.getElementById("sb-seats") || document.getElementById("sb-canvas-wrap");
  }
  function ensure(host) {
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var svg = document.getElementById("sb-flow");
    if (svg && svg.parentNode !== host) {
      svg.parentNode.removeChild(svg);
      svg = null;
    }
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "sb-flow";
      svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:8;overflow:visible;";
      host.appendChild(svg);
    }
    return svg;
  }
  function center(host, seat) {
    var el = document.querySelector('#sb-seats [data-seat="' + seat + '"]');
    if (!el) return null;
    var hr = host.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    if (!hr.width || !hr.height) return null;
    return { x: (r.left + r.width / 2) - hr.left, y: (r.top + r.height / 2) - hr.top };
  }
  var phase = 0;
  function draw() {
    var host = hostEl();
    var svg = host && ensure(host);
    if (!svg) return;
    var w = host.clientWidth || 1;
    var h = host.clientHeight || 1;
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("preserveAspectRatio", "none");
    var pts = {
      compressor: center(host, "compressor"),
      condenser: center(host, "condenser"),
      metering: center(host, "metering"),
      evaporator: center(host, "evaporator")
    };
    if (!pts.compressor || !pts.condenser || !pts.metering || !pts.evaporator) {
      svg.innerHTML = "";
      return;
    }
    var on = running();
    phase = (phase + (on ? 0.012 : 0.002)) % 1;
    var cx = (pts.compressor.x + pts.condenser.x + pts.metering.x + pts.evaporator.x) / 4;
    var cy = (pts.compressor.y + pts.condenser.y + pts.metering.y + pts.evaporator.y) / 4;
    var html = "";
    LEGS.forEach(function (leg) {
      var a = pts[leg.from], b = pts[leg.to];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      var dx = mx - cx, dy = my - cy;
      var len = Math.hypot(dx, dy) || 1;
      var lx = mx + (dx / len) * 18;
      var ly = my + (dy / len) * 18;
      html += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y +
        '" stroke="' + leg.color + '" stroke-width="4" stroke-linecap="round" opacity="0.9"/>';
      html += '<text x="' + lx + '" y="' + ly + '" fill="' + leg.color +
        '" font-size="13" font-weight="700" text-anchor="middle">' + leg.name + '</text>';
      html += '<text x="' + lx + '" y="' + (ly + 14) + '" fill="#f4e7c8" font-size="11" text-anchor="middle">' + leg.state + '</text>';
      for (var k = 0; k < 3; k++) {
        var u = (phase + k / 3) % 1;
        html += '<circle cx="' + (a.x + (b.x - a.x) * u) + '" cy="' + (a.y + (b.y - a.y) * u) +
          '" r="' + (on ? 6 : 4) + '" fill="' + leg.color + '"/>';
      }
    });
    svg.innerHTML = html;
  }
  setInterval(draw, 50);
})();
