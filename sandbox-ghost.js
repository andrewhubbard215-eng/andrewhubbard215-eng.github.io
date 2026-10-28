/* Allstars — Ghost-shell See Inside. Cutaway follows live run; narrate what each part DOES. */
(function () {
  "use strict";

  var NODES = {
    compressor: { x: 120, y: 150, lab: "COMP" },
    condenser: { x: 320, y: 70, lab: "COND" },
    metering: { x: 520, y: 150, lab: "TXV" },
    evaporator: { x: 320, y: 220, lab: "EVAP" }
  };

  /* Part jobs — physics talk, not drawing talk. */
  var SAY = {
    compressor:
      "Scroll orbits and squeezes suction vapor into hot high-pressure gas — that starts the high side.",
    condenser:
      "Outdoor coil rejects heat. Hot discharge vapor condenses into liquid on the high side.",
    metering:
      "Metering drops pressure at this seat. Flash gas is born here — liquid becomes a cold two-phase mix.",
    evaporator:
      "Indoor coil absorbs heat. Liquid boils off; only vapor leaves toward the compressor."
  };

  var focus = "compressor";
  var on = false;
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
  function meteringLab() {
    var kind = (window.LtMeteringKind || "txv").toLowerCase();
    if (kind === "piston" || kind === "orifice") return "PISTON";
    if (kind === "eev") return "EEV";
    return "TXV";
  }
  function setText(el, s) {
    if (el && el.textContent !== s) el.textContent = s;
  }

  function ensureUi() {
    var root = document.getElementById("sandbox-root");
    if (!root) return null;
    var btn = document.getElementById("sb-ghost-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "sb-ghost-toggle";
      btn.className = "btn sb-ghost-toggle";
      btn.textContent = "See Inside";
      btn.title = "Ghost-shell cutaway — scroll, condense, TXV flash, boil. Live physics.";
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        on = !on;
        btn.classList.toggle("primary", on);
        btn.textContent = on ? "See Inside · ON" : "See Inside";
        var panel = document.getElementById("sb-ghost-narrate");
        if (panel) panel.hidden = !on;
        var c = document.getElementById("sb-ghost");
        if (c) c.style.display = on ? "block" : "none";
        narrate();
        if (on && !raf) raf = requestAnimationFrame(draw);
      });
      var bar = root.querySelector(".sb-toolbar") || root.querySelector(".sb-main") || root;
      var mute = document.getElementById("sb-sound-mute");
      if (mute && mute.parentNode) mute.parentNode.insertBefore(btn, mute);
      else bar.appendChild(btn);
    }
    var narr = document.getElementById("sb-ghost-narrate");
    if (!narr) {
      narr = document.createElement("p");
      narr.id = "sb-ghost-narrate";
      narr.className = "sb-ghost-narrate";
      narr.setAttribute("role", "status");
      narr.hidden = true;
      var tip = document.getElementById("sb-phone-tip");
      var main = root.querySelector(".sb-main");
      if (tip && tip.parentNode) tip.parentNode.insertBefore(narr, tip.nextSibling);
      else if (main) main.insertBefore(narr, main.firstChild);
      else root.appendChild(narr);
    }
    return btn;
  }

  function ensureCanvas() {
    var wrap = document.getElementById("sb-canvas-wrap");
    var base = document.getElementById("sb-canvas");
    if (!wrap || !base) return null;
    var c = document.getElementById("sb-ghost");
    if (!c) {
      c = document.createElement("canvas");
      c.id = "sb-ghost";
      c.width = base.width || 640;
      c.height = base.height || 280;
      c.setAttribute("aria-hidden", "true");
      c.style.cssText =
        "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;border-radius:8px;display:none";
      wrap.style.position = wrap.style.position || "relative";
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

  function narrate() {
    var narr = document.getElementById("sb-ghost-narrate");
    if (!narr) return;
    if (!on) {
      setText(narr, "");
      return;
    }
    if (!seated("compressor") || !seated("condenser") || !seated("metering") || !seated("evaporator")) {
      setText(narr, "See Inside waits on a closed loop — seat COMP · COND · " + meteringLab() + " · EVAP, then Start.");
      return;
    }
    if (!running()) {
      setText(
        narr,
        "Loop seated. Start compressor — See Inside follows live physics (scroll · condense · flash · boil)."
      );
      return;
    }
    var id = focus;
    if (id === "metering") {
      setText(narr, meteringLab() + " — " + SAY.metering);
    } else {
      setText(narr, (NODES[id] && NODES[id].lab) + " — " + (SAY[id] || ""));
    }
  }

  function drawScroll(ctx, n, phase) {
    ctx.save();
    ctx.translate(n.x, n.y);
    ctx.strokeStyle = "rgba(248,113,113,.95)";
    ctx.lineWidth = 2;
    for (var i = 0; i < 3; i++) {
      var a = phase * 1.8 + i * 2.1;
      ctx.beginPath();
      ctx.ellipse(0, 0, 16 + i * 3, 10 + i * 2, a, 0, Math.PI * 2);
      ctx.stroke();
    }
    var bx = Math.cos(phase * 2.4) * 18;
    var by = Math.sin(phase * 2.4) * 11;
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCondense(ctx, n, phase) {
    ctx.save();
    ctx.translate(n.x, n.y);
    for (var i = 0; i < 8; i++) {
      var t = (phase * 0.35 + i * 0.12) % 1;
      var x = -28 + i * 8;
      var y = -8 + t * 18;
      var cool = t > 0.55;
      ctx.fillStyle = cool ? "rgba(245,158,11,.95)" : "rgba(239,68,68," + (0.9 - t * 0.4) + ")";
      ctx.beginPath();
      if (cool) {
        ctx.ellipse(x, y, 3, 4.5, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(x, y - 2, 2.5 + (1 - t), 0, Math.PI * 2);
      }
      ctx.fill();
    }
    ctx.restore();
  }

  function drawFlash(ctx, n, phase) {
    var spikes = 6;
    for (var i = 0; i < spikes; i++) {
      var ang = -Math.PI / 2 + (i - 2.5) * 0.28 + Math.sin(phase + i) * 0.04;
      var len = 14 + (i % 3) * 5;
      ctx.strokeStyle = i % 2 ? "rgba(253,224,71,.95)" : "rgba(255,255,255,.85)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(n.x + Math.cos(ang) * len, n.y + Math.sin(ang) * len + 6);
      ctx.stroke();
    }
  }

  function drawBoil(ctx, n, phase) {
    ctx.save();
    ctx.translate(n.x, n.y);
    for (var i = 0; i < 7; i++) {
      var t = (phase * 0.45 + i * 0.14) % 1;
      var x = -24 + i * 8 + Math.sin(phase + i) * 2;
      var y = 10 - t * 22;
      if (t < 0.55) {
        ctx.strokeStyle = "rgba(147,197,253,.9)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 3 + t * 2, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillStyle = "rgba(59,130,246," + (0.85 - (t - 0.55)) + ")";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawShell(ctx, n, active) {
    ctx.save();
    ctx.strokeStyle = active ? "rgba(148,163,184,.85)" : "rgba(71,85,105,.45)";
    ctx.lineWidth = active ? 2 : 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.arc(n.x, n.y, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function draw(ts) {
    var c = ensureCanvas();
    ensureUi();
    if (!c || !on) {
      raf = 0;
      if (c) {
        var ctx0 = c.getContext("2d");
        ctx0.clearRect(0, 0, c.width, c.height);
      }
      return;
    }
    if (!t0) t0 = ts;
    var phase = (ts - t0) / 200;
    var ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);

    var live = running();
    var ids = ["compressor", "condenser", "metering", "evaporator"];
    ids.forEach(function (id) {
      var n = NODES[id];
      if (!n) return;
      if (id === "metering") n = Object.assign({}, n, { lab: meteringLab() });
      drawShell(ctx, n, seated(id) && focus === id);
      if (!seated(id) || !live) return;
      if (id === "compressor") drawScroll(ctx, n, phase);
      else if (id === "condenser") drawCondense(ctx, n, phase);
      else if (id === "metering") drawFlash(ctx, n, phase);
      else if (id === "evaporator") drawBoil(ctx, n, phase);
    });

    narrate();
    raf = requestAnimationFrame(draw);
  }

  function bindFocus() {
    var root = document.getElementById("sandbox-root");
    if (!root || root.getAttribute("data-lt-ghost-focus") === "1") return;
    root.setAttribute("data-lt-ghost-focus", "1");
    root.addEventListener(
      "click",
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        var seat = t.closest("#sb-seats .sb-seat[data-seat]");
        var part = t.closest("#sandbox-root [data-part]");
        var id = (seat && seat.getAttribute("data-seat")) || (part && part.getAttribute("data-part"));
        if (id && SAY[id]) {
          focus = id;
          narrate();
        }
      },
      true
    );
  }

  function mount() {
    ensureUi();
    ensureCanvas();
    bindFocus();
    narrate();
    if (on && !raf) raf = requestAnimationFrame(draw);
  }

  var t = null;
  var obs = new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(mount, 80);
  });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
