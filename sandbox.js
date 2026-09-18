/* HVAC Allstars — System Sandbox phone-safe tip (soft-open, no combat weight). */
(function (global) {
  "use strict";
  var PT410 = [[-40,10.8],[-20,24.8],[0,48.6],[20,78.3],[40,118],[60,170],[80,235],[100,317],[120,418]];
  function satP(tF) {
    var c = PT410;
    if (tF <= c[0][0]) return c[0][1];
    if (tF >= c[c.length - 1][0]) return c[c.length - 1][1];
    for (var i = 0; i < c.length - 1; i++) {
      var t0 = c[i][0], p0 = c[i][1], t1 = c[i + 1][0], p1 = c[i + 1][1];
      if (tF >= t0 && tF <= t1) return p0 + ((tF - t0) / (t1 - t0)) * (p1 - p0);
    }
    return c[0][1];
  }
  function satT(p) {
    var c = PT410;
    if (p <= c[0][1]) return c[0][0];
    if (p >= c[c.length - 1][1]) return c[c.length - 1][0];
    for (var i = 0; i < c.length - 1; i++) {
      var t0 = c[i][0], p0 = c[i][1], t1 = c[i + 1][0], p1 = c[i + 1][1];
      if (p >= p0 && p <= p1) return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0);
    }
    return c[0][0];
  }
  function start(root, opts) {
    if (!root) return { stop: function () {}, getHubBtn: function () { return null; } };
    var outdoor = 95, indoor = 75, charge = 100, running = false, raf = 0;
    var placed = { compressor: false, condenser: false, metering: false, evaporator: false };
    var nick = (opts && opts.nickname) || "Tech";
    function sim() {
      var te = indoor - (running ? 18 : 0);
      var tc = outdoor + (running ? 22 : 0);
      var factor = charge / 100;
      var ps = satP(te) * (0.85 + 0.15 * factor);
      var ph = satP(tc) * (0.9 + 0.2 * (2 - factor));
      if (!running) {
        var stand = satP(outdoor);
        ps = stand;
        ph = stand;
      }
      var sst = satT(ps), sct = satT(ph);
      var sl = running ? (sst + 10 + (100 - charge) * 0.08) : indoor;
      var ll = running ? (sct - 10 + (charge - 100) * 0.06) : outdoor;
      var sh = running ? Math.max(0, sl - sst) : 0;
      var sc = running ? Math.max(0, sct - ll) : 0;
      return { ps: ps, ph: ph, sh: sh, sc: sc, sst: sst, sct: sct, sl: sl, ll: ll };
    }
    function paint() {
      var s = sim();
      var el = function (id) { return document.getElementById(id); };
      if (el("sb-ps")) el("sb-ps").textContent = s.ps.toFixed(0) + " psig";
      if (el("sb-ph")) el("sb-ph").textContent = s.ph.toFixed(0) + " psig";
      if (el("sb-sh")) el("sb-sh").textContent = running ? (s.sh.toFixed(1) + " °F SH") : "\u2014 off (no SH)";
      if (el("sb-sc")) el("sb-sc").textContent = running ? (s.sc.toFixed(1) + " °F SC") : "\u2014 off (no SC)";
      if (el("sb-status")) {
        el("sb-status").textContent = running
          ? ("Compressor on \u00b7 " + nick + " \u00b7 charge " + charge + "%")
          : ("Standing pressures \u00b7 " + nick + " \u00b7 drop the four on the LEFT");
      }
    }
    function mount() {
      root.innerHTML =
        '<div class="sb-layout" style="display:grid;grid-template-columns:148px 1fr;gap:8px;min-height:70vh;padding:8px">' +
        '<aside class="sb-palette" style="display:flex;flex-direction:column;gap:6px">' +
        '<p class="eyebrow" style="margin:0;font-size:11px">Parts \u00b7 LEFT</p>' +
        '<button type="button" class="btn" data-part="compressor">Compressor</button>' +
        '<button type="button" class="btn" data-part="condenser">Condenser</button>' +
        '<button type="button" class="btn" data-part="metering">TXV</button>' +
        '<button type="button" class="btn" data-part="evaporator">Evaporator</button>' +
        '<button type="button" class="btn" id="sb-hub">Shop floor</button>' +
        "</aside>" +
        '<main class="sb-main" style="display:flex;flex-direction:column;gap:8px">' +
        '<div class="sb-toolbar" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">' +
        '<label>OD °F <input id="sb-out" type="range" min="60" max="115" value="95" /><span id="sb-out-v">95</span></label>' +
        '<label>ID °F <input id="sb-in" type="range" min="65" max="85" value="75" /><span id="sb-in-v">75</span></label>' +
        '<label>Charge % <input id="sb-charge" type="range" min="60" max="130" value="100" /><span id="sb-charge-v">100</span></label>' +
        '<button type="button" class="btn primary" id="sb-run">Start compressor</button>' +
        "</div>" +
        '<p id="sb-status" class="sb-status" style="margin:0;font-size:13px;color:#5eead4"></p>' +
        '<p id="sb-formula" style="margin:0;font-size:12px;opacity:.9">SH = suction line \u2212 sat (low) \u00b7 SC = sat (high) \u2212 liquid line. Unit off = standing pressure only.</p>' +
        '<div class="sb-gauges" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' +
        '<div class="panel"><strong>Suction</strong><div id="sb-ps">\u2014</div><div id="sb-sh">\u2014</div></div>' +
        '<div class="panel"><strong>Head</strong><div id="sb-ph">\u2014</div><div id="sb-sc">\u2014</div></div>' +
        "</div>" +
        '<canvas id="sb-canvas" width="640" height="280" style="width:100%;max-height:40vh;background:#0b1220;border-radius:8px"></canvas>' +
        '<p style="font-size:12px;opacity:.85">Gauges first. SH/SC paint after the compressor is running. Unit off = standing pressure only.</p>' +
        "</main></div>";
      root.querySelectorAll("[data-part]").forEach(function (btn) {
        btn.onclick = function () {
          placed[btn.getAttribute("data-part")] = true;
          btn.classList.add("primary");
          paint();
          draw();
        };
      });
      var out = document.getElementById("sb-out");
      var inn = document.getElementById("sb-in");
      var ch = document.getElementById("sb-charge");
      var run = document.getElementById("sb-run");
      function sync() {
        outdoor = Number(out.value) || 95;
        indoor = Number(inn.value) || 75;
        charge = Number(ch.value) || 100;
        var ov = document.getElementById("sb-out-v");
        var iv = document.getElementById("sb-in-v");
        var cv = document.getElementById("sb-charge-v");
        if (ov) ov.textContent = String(outdoor);
        if (iv) iv.textContent = String(indoor);
        if (cv) cv.textContent = String(charge);
        paint();
        draw();
      }
      out.oninput = inn.oninput = ch.oninput = sync;
      run.onclick = function () {
        var ready = placed.compressor && placed.condenser && placed.metering && placed.evaporator;
        if (!running && !ready) {
          document.getElementById("sb-status").textContent = "Drop all four on the LEFT first \u2014 compressor, condenser, TXV, evaporator.";
          return;
        }
        running = !running;
        run.textContent = running ? "Stop compressor" : "Start compressor";
        paint();
        if (running && !raf) kickLoop();
      };
      paint();
      draw();
    }
    function draw() {
      var canvas = document.getElementById("sb-canvas");
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      if (!ctx) return;
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0b1220";
      ctx.fillRect(0, 0, w, h);
      var slots = [
        { id: "compressor", x: 80, y: 160, label: "Comp" },
        { id: "condenser", x: 280, y: 60, label: "Cond" },
        { id: "metering", x: 480, y: 160, label: "TXV" },
        { id: "evaporator", x: 280, y: 220, label: "Evap" },
      ];
      ctx.strokeStyle = running ? "#5eead4" : "#334155";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(80, 160); ctx.lineTo(280, 60); ctx.lineTo(480, 160); ctx.lineTo(280, 220); ctx.closePath();
      ctx.stroke();
      slots.forEach(function (s) {
        ctx.fillStyle = placed[s.id] ? "#ce0034" : "#1e293b";
        ctx.beginPath();
        ctx.arc(s.x, s.y, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(s.label, s.x, s.y + 4);
      });
    }
    function kickLoop() {
      var last = 0;
      function tick(now) {
        raf = requestAnimationFrame(tick);
        if (now - last < 200) return;
        last = now;
        if (!running) return;
        paint();
        draw();
      }
      raf = requestAnimationFrame(tick);
    }
    var narrow = typeof window !== "undefined" && window.innerWidth && window.innerWidth <= 480;
    if (narrow) {
      root.innerHTML = "<div class='panel' style='margin:16px;padding:16px'><p>Opening system bay\u2026</p><button class='btn' type='button' id='sb-hub-early'>Shop floor</button></div>";
      var early = document.getElementById("sb-hub-early");
      if (early) early.onclick = function () {
        if (typeof window.ltGoHub === "function") window.ltGoHub();
        else if (typeof window.ltPlay === "function") window.ltPlay("hub");
      };
      setTimeout(mount, 60);
    } else {
      mount();
    }
    return {
      stop: function () { if (raf) cancelAnimationFrame(raf); raf = 0; },
      getHubBtn: function () { return document.getElementById("sb-hub") || document.getElementById("sb-hub-early"); },
    };
  }
  global.HVACSandbox = { start: start };
})(window);
