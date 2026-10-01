/* Refrigerant flow — follow live seat centers on the diamond, not guessed %. */
(function () {
  "use strict";
  var FALLBACK = {
    compressor: [18, 50],
    condenser: [50, 14],
    metering: [82, 50],
    evaporator: [50, 86]
  };
  var LEGS = [
    { name: "Suction vapor", state: "LP cool vapor", color: "#38bdf8", from: "evaporator", to: "compressor" },
    { name: "Discharge vapor", state: "HP hot vapor", color: "#f43f5e", from: "compressor", to: "condenser" },
    { name: "Liquid line", state: "HP subcooled liquid", color: "#fbbf24", from: "condenser", to: "metering" },
    { name: "Flash to evaporator", state: "LP mix → boil", color: "#5eead4", from: "metering", to: "evaporator" }
  ];
  function running() {
    var btn = document.getElementById("sb-run");
    return !!(btn && /stop/i.test(btn.textContent || ""));
  }
  function hostEl() {
    return document.getElementById("sb-seats") || document.getElementById("sb-canvas") || document.getElementById("sb-canvas-wrap");
  }
  function ensure() {
    var host = hostEl();
    if (!host) return null;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var svg = document.getElementById("sb-flow");
    if (svg && svg.parentNode !== host) {
      svg.parentNode.removeChild(svg);
      svg = null;
    }
    if (!svg) {
      svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.id = "sb-flow";
      svg.setAttribute("viewBox", "0 0 100 100");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:8;overflow:visible;";
      host.appendChild(svg);
    }
    return svg;
  }
  function seatXY(seat) {
    var host = hostEl();
    if (!host) return FALLBACK[seat];
    var el = host.querySelector('[data-seat="' + seat + '"]') || document.querySelector('#sb-seats [data-seat="' + seat + '"]');
    if (!el) return FALLBACK[seat];
    var hr = host.getBoundingClientRect();
    var r = el.getBoundingClientRect();
    if (!hr.width || !hr.height) return FALLBACK[seat];
    return [
      ((r.left + r.width / 2) - hr.left) / hr.width * 100,
      ((r.top + r.height / 2) - hr.top) / hr.height * 100
    ];
  }
  var phase = 0;
  function draw() {
    var svg = ensure();
    if (!svg) return;
    var on = running();
    phase = (phase + (on ? 0.012 : 0.002)) % 1;
    var pts = {
      compressor: seatXY("compressor"),
      condenser: seatXY("condenser"),
      metering: seatXY("metering"),
      evaporator: seatXY("evaporator")
    };
    var html = "";
    LEGS.forEach(function (leg, i) {
      var a = pts[leg.from], b = pts[leg.to];
      if (!a || !b) return;
      var x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
      var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      html += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +
        '" stroke="' + leg.color + '" stroke-width="1.4" stroke-linecap="round" opacity="0.9"/>';
      html += '<text x="' + mx + '" y="' + (my - 2) + '" fill="' + leg.color +
        '" font-size="2.6" font-weight="700" text-anchor="middle">' + leg.name + '</text>';
      html += '<text x="' + mx + '" y="' + (my + 1.2) + '" fill="#f4e7c8" font-size="1.8" text-anchor="middle">' + leg.state + '</text>';
      for (var k = 0; k < 3; k++) {
        var u = (phase + k / 3) % 1;
        html += '<circle cx="' + (x1 + (x2 - x1) * u) + '" cy="' + (y1 + (y2 - y1) * u) +
          '" r="' + (on ? 1.2 : 0.7) + '" fill="' + leg.color + '"/>';
      }
    });
    svg.innerHTML = html;
  }
  setInterval(draw, 40);
})();
