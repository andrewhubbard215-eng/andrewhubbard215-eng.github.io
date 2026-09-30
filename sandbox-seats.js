/* HVAC Allstars — four LEFT diamond seats with real part plates */
(function () {
  "use strict";
  var PARTS = [
    { id: "compressor", label: "COMP", src: "parts/compressor.png" },
    { id: "condenser", label: "COND", src: "parts/condenser.png" },
    { id: "metering", label: "TXV", src: "parts/metering.png" },
    { id: "evaporator", label: "EVAP", src: "parts/evaporator.png" }
  ];

  var NODES = {
    compressor: { x: 120, y: 150 },
    condenser: { x: 320, y: 70 },
    metering: { x: 520, y: 150 },
    evaporator: { x: 320, y: 220 }
  };

  function layoutSeats() {
    var canvas = document.getElementById("sb-canvas");
    var wrap = document.getElementById("sb-canvas-wrap");
    var layer = document.getElementById("sb-seats");
    if (!canvas || !wrap || !layer) return;
    var cr = canvas.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    if (!cr.width || !cr.height || !wr.width || !wr.height) return;
    var cs = window.getComputedStyle(canvas);
    var padL = parseFloat(cs.paddingLeft) || 0;
    var padT = parseFloat(cs.paddingTop) || 0;
    var padR = parseFloat(cs.paddingRight) || 0;
    var padB = parseFloat(cs.paddingBottom) || 0;
    var contentW = Math.max(1, cr.width - padL - padR);
    var contentH = Math.max(1, cr.height - padT - padB);
    var originX = cr.left - wr.left + padL;
    var originY = cr.top - wr.top + padT;
    var CW = canvas.width || 640;
    var CH = canvas.height || 280;
    Object.keys(NODES).forEach(function (id) {
      var btn = layer.querySelector('.sb-seat[data-seat="' + id + '"]');
      if (!btn) return;
      var n = NODES[id];
      var left = originX + (n.x / CW) * contentW;
      var top = originY + (n.y / CH) * contentH;
      btn.style.left = Math.round(left) + "px";
      btn.style.top = Math.round(top) + "px";
      btn.style.right = "auto";
      btn.style.bottom = "auto";
      btn.style.transform = "translate(-50%, -50%)";
    });
  }

  function meteringName() {
    var kind = "";
    try {
      if (window.HVACSandbox && typeof window.HVACSandbox.meteringKind === "function") {
        kind = window.HVACSandbox.meteringKind() || "";
      }
    } catch (e) {}
    if (!kind) kind = window.LtMeteringKind || "";
    var blob = kind + " " +
      ((document.getElementById("sb-sysbanner") || {}).textContent || "") + " " +
      ((document.getElementById("sb-sysinfo") || {}).textContent || "") + " " +
      ((document.getElementById("g-method") || {}).textContent || "");
    if (/piston|orifice|cap-?tube|fixed/i.test(blob) && !/\bEEV\b|\bTXV\b/i.test(kind)) return "PISTON";
    if (/eev/i.test(blob)) return "EEV";
    return "TXV";
  }

  function setText(el, s) {
    if (el && el.textContent !== s) el.textContent = s;
  }

  function labelFor(id) {
    if (id === "metering") return meteringName();
    if (id === "compressor") return "COMP";
    if (id === "condenser") return "COND";
    return "EVAP";
  }

  function filled(id) {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
    if (slot && (slot.classList.contains("filled") || slot.querySelector("img, strong, .rm"))) return true;
    var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
    return !!(part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true"));
  }

  function allSeated() {
    return PARTS.every(function (p) { return filled(p.id); });
  }

  function seat(id) {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
    if (slot) {
      slot.classList.add("filled", "has");
      if (!slot.querySelector("strong")) {
        var s = document.createElement("strong");
        s.textContent = id;
        slot.appendChild(s);
      }
    }
    var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
    if (part) {
      try { part.click(); } catch (e) {}
    }
    var plate = document.querySelector('#sb-seats .sb-seat[data-seat="' + id + '"]');
    if (plate) plate.classList.add("on");
    paint();
  }

  function seatAllFour() {
    PARTS.forEach(function (p) {
      if (!filled(p.id)) seat(p.id);
    });
    var st = document.getElementById("sb-status");
    if (st) st.textContent = "LOOP CLOSED — four seated. Start compressor. Then read SH/SC.";
    var yell = document.getElementById("sb-parts-yell");
    if (yell && yell.parentNode) yell.parentNode.removeChild(yell);
    paint();
    return allSeated();
  }
  window.LtSeatAllFour = seatAllFour;

  var missUntil = 0;
  function missDrop(partId, seatId) {
    missUntil = Date.now() + 2800;
    var want = labelFor(partId);
    var got = seatId ? labelFor(seatId) : "empty glass";
    var st = document.getElementById("sb-status") || document.getElementById("sb-left-strip");
    if (st) {
      st.style.color = "#fbbf24";
      st.textContent = "Wrong seat — " + want + " belongs on the " + want + " node, not " + got + ".";
    }
    var plate = seatId && document.querySelector('#sb-seats .sb-seat[data-seat="' + seatId + '"]');
    if (plate) {
      plate.style.outline = "2px solid #f87171";
      setTimeout(function () { plate.style.outline = ""; }, 700);
    }
  }

  function seatAtPoint(x, y) {
    var els = document.elementsFromPoint(x, y) || [];
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (!el || !el.closest) continue;
      var seat = el.closest("#sb-seats .sb-seat[data-seat]");
      if (seat) return seat.getAttribute("data-seat");
    }
    return null;
  }

  function ensureGhost() {
    var g = document.getElementById("lt-part-ghost");
    if (g) return g;
    g = document.createElement("div");
    g.id = "lt-part-ghost";
    g.setAttribute("aria-hidden", "true");
    g.style.cssText = "position:fixed;z-index:9999;pointer-events:none;display:none;width:72px;height:72px;border-radius:12px;border:2px solid #f59e0b;background:rgba(15,23,42,.92);box-shadow:0 8px 24px rgba(0,0,0,.45);align-items:center;justify-content:center;overflow:hidden";
    g.innerHTML = '<img alt="" style="width:56px;height:56px;object-fit:contain;background:#e8eef6;border-radius:8px;padding:2px" />';
    document.body.appendChild(g);
    return g;
  }

  function bindRailDrag() {
    var root = document.getElementById("sandbox-root");
    if (!root || root.getAttribute("data-lt-rail-drag") === "1") return;
    root.setAttribute("data-lt-rail-drag", "1");

    var drag = null;

    function partFromEvent(ev) {
      var t = ev.target;
      if (!t || !t.closest) return null;
      var btn = t.closest('#sandbox-root [data-part]');
      if (!btn) return null;
      var id = btn.getAttribute("data-part");
      if (!id || id === "gauges") return null;
      if (!PARTS.some(function (p) { return p.id === id; })) return null;
      return { el: btn, id: id };
    }

    function onDown(ev) {
      if (ev.button != null && ev.button !== 0) return;
      var hit = partFromEvent(ev);
      if (!hit) return;
      var pt = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
      drag = {
        id: hit.id,
        el: hit.el,
        startX: pt.clientX,
        startY: pt.clientY,
        moved: false,
        pointerId: ev.pointerId,
        suppressClick: false
      };
      try {
        if (ev.pointerId != null && hit.el.setPointerCapture) hit.el.setPointerCapture(ev.pointerId);
      } catch (e) {}
    }

    function onMove(ev) {
      if (!drag) return;
      var pt = ev.touches && ev.touches[0] ? ev.touches[0] : ev;
      var dx = pt.clientX - drag.startX;
      var dy = pt.clientY - drag.startY;
      if (!drag.moved && (dx * dx + dy * dy) < 64) return;
      if (!drag.moved) {
        drag.moved = true;
        drag.suppressClick = true;
        var g = ensureGhost();
        var img = g.querySelector("img");
        var srcBtn = drag.el.querySelector("img");
        var part = PARTS.filter(function (p) { return p.id === drag.id; })[0];
        if (img) img.src = (srcBtn && srcBtn.src) || (part && part.src) || "";
        g.style.display = "flex";
        drag.ghost = g;
        document.documentElement.classList.add("lt-dragging-part");
      }
      if (drag.ghost) {
        drag.ghost.style.left = (pt.clientX - 36) + "px";
        drag.ghost.style.top = (pt.clientY - 36) + "px";
      }
      if (ev.cancelable) ev.preventDefault();
    }

    function endDrag(ev) {
      if (!drag) return;
      var d = drag;
      drag = null;
      document.documentElement.classList.remove("lt-dragging-part");
      if (d.ghost) d.ghost.style.display = "none";
      try {
        if (d.pointerId != null && d.el.releasePointerCapture) d.el.releasePointerCapture(d.pointerId);
      } catch (e) {}
      if (!d.moved) return;
      var pt = (ev.changedTouches && ev.changedTouches[0]) || ev;
      var over = seatAtPoint(pt.clientX, pt.clientY);
      if (over === d.id) {
        seat(d.id);
        var st = document.getElementById("sb-status");
        if (st) st.textContent = labelFor(d.id) + " seated — drop or tap the rest LEFT.";
      } else if (over) {
        missDrop(d.id, over);
      } else {
        var st2 = document.getElementById("sb-status") || document.getElementById("sb-left-strip");
        if (st2) {
          st2.style.color = "#fbbf24";
          st2.textContent = "Miss — drag " + labelFor(d.id) + " onto its " + labelFor(d.id) + " seat on the diamond.";
        }
      }
      if (d.suppressClick) {
        var kill = function (e) {
          e.preventDefault();
          e.stopPropagation();
          document.removeEventListener("click", kill, true);
        };
        document.addEventListener("click", kill, true);
        setTimeout(function () { document.removeEventListener("click", kill, true); }, 400);
      }
    }

    root.addEventListener("pointerdown", onDown, true);
    window.addEventListener("pointermove", onMove, { capture: true, passive: false });
    window.addEventListener("pointerup", endDrag, true);
    window.addEventListener("pointercancel", endDrag, true);
    root.addEventListener("touchstart", onDown, { capture: true, passive: true });
    window.addEventListener("touchmove", onMove, { capture: true, passive: false });
    window.addEventListener("touchend", endDrag, true);

    document.addEventListener("dragstart", function (ev) {
      var hit = partFromEvent(ev);
      if (!hit) return;
      try { ev.dataTransfer.setData("text/lt-part", hit.id); ev.dataTransfer.effectAllowed = "copy"; } catch (e) {}
      hit.el.setAttribute("data-lt-dragging", hit.id);
    }, true);
    document.addEventListener("dragend", function (ev) {
      var hit = partFromEvent(ev);
      if (hit) hit.el.removeAttribute("data-lt-dragging");
    }, true);
  }

  function missingPretty() {
    return PARTS.filter(function (p) { return !filled(p.id); }).map(function (p) { return labelFor(p.id); });
  }

  function compressorRunning() {
    var runBtn = document.getElementById("sb-run");
    var t = (runBtn && runBtn.textContent) || "";
    if (/Stop compressor/i.test(t)) return true;
    var st = ((document.getElementById("sb-status") || {}).textContent || "");
    if (/Compressor on/i.test(st)) return true;
    return false;
  }

  var TEACH = [
    "Dirty condenser: high head, SC about normal — clean the coil.",
    "Overcharge: low SH, high SC — recover to nameplate.",
    "Restriction: high SH and high SC — find the starve.",
    "Air/noncondensables: high head AND high SC — recover, evacuate, recharge.",
    "Near-zero SH with ice: airflow first — do not add gas.",
    "Never top off to hide a leak. Never chase bubble point on the ticket."
  ];
  function teachLine() {
    var tip = document.getElementById("sb-phone-tip");
    if (!tip) return;
    var i = Math.floor(Date.now() / 12000) % TEACH.length;
    if (!tip.getAttribute("data-lt-teach") || tip.getAttribute("data-lt-teach") !== String(i)) {
      tip.setAttribute("data-lt-teach", String(i));
      tip.textContent = TEACH[i];
    }
  }

  function paintStrip() {
    if (Date.now() < missUntil) return;
    var miss = missingPretty();
    var strip = document.getElementById("sb-left-strip");
    if (!strip) {
      strip = document.createElement("p");
      strip.id = "sb-left-strip";
      strip.setAttribute("role", "status");
      strip.style.cssText = "margin:6px 12px 0;font:700 13px/1.35 sans-serif;letter-spacing:.02em";
      var host = document.getElementById("sb-status") || document.querySelector("#sandbox-root .sb-live") || document.getElementById("sandbox-root");
      if (host && host.parentNode && host.id === "sb-status") host.parentNode.insertBefore(strip, host.nextSibling);
      else if (host) host.insertBefore(strip, host.firstChild);
    }
    if (!strip) return;
    if (miss.length) {
      strip.style.color = "#fbbf24";
      setText(strip, "LOOP OPEN — seat LEFT: " + miss.join(" · ") + ". Standing P/T only. No SH/SC until the circuit is closed.");
    } else {
      var running = compressorRunning();
      strip.style.color = "#5eead4";
      setText(strip, running
        ? "RUNNING — COMP · COND · " + meteringName() + " · EVAP seated. Read live SH/SC. Do not chase standing P."
        : "LOOP CLOSED — COMP · COND · " + meteringName() + " · EVAP seated. Start compressor. Then read SH/SC.");
    }
  }

  function paint() {
    layoutSeats();
    document.querySelectorAll("#sb-seats .sb-seat").forEach(function (btn) {
      var id = btn.getAttribute("data-seat");
      var on = filled(id);
      if (btn.classList.contains("on") !== on) btn.classList.toggle("on", on);
      var span = btn.querySelector("span");
      var name = labelFor(id);
      if (span) setText(span, on ? name + " SEATED" : name + " LEFT");
    });
    var run = document.getElementById("sb-run");
    if (run && !/Stop compressor/i.test(run.textContent || "")) {
      setText(run, allSeated() ? "Start compressor" : "Seat 4 LEFT first");
    }
    if (allSeated()) {
      var yell = document.getElementById("sb-parts-yell");
      if (yell && yell.parentNode) yell.parentNode.removeChild(yell);
    }
    lockChargeUntilSeated();
    paintStrip();
    teachLine();
  }

  function lockChargeUntilSeated() {
    var chg = document.getElementById("sb-charge");
    if (!chg) return;
    var closed = allSeated();
    chg.disabled = !closed;
    chg.title = closed
      ? "Nameplate charge % after the loop is closed"
      : "Loop open — do not dump charge. Seat COMP · COND · TXV · EVAP first.";
    var lab = chg.closest("label") || chg.parentNode;
    if (lab && lab.style) lab.style.opacity = closed ? "" : "0.45";
  }

  function flashMissing() {
    document.querySelectorAll("#sb-seats .sb-seat").forEach(function (btn) {
      var id = btn.getAttribute("data-seat");
      if (filled(id)) return;
      btn.style.outline = "2px solid #fbbf24";
      btn.style.outlineOffset = "3px";
      setTimeout(function () {
        btn.style.outline = "";
        btn.style.outlineOffset = "";
      }, 900);
    });
    var st = document.getElementById("sb-status");
    var miss = missingPretty();
    if (st && miss.length) {
      st.textContent = "Don't jump the compressor. Tap LEFT plates first: " + miss.join(" · ") + ".";
    }
  }

  function guardRun(ev) {
    var run = document.getElementById("sb-run");
    if (!run || (ev.target !== run && !run.contains(ev.target))) return;
    if (allSeated()) {
      setTimeout(paint, 40);
      return;
    }
    if (/Stop compressor/i.test(run.textContent || "")) return;
    ev.preventDefault();
    ev.stopPropagation();
    flashMissing();
    paint();
  }

  function mount() {
    var canvas = document.getElementById("sb-canvas");
    if (!canvas) return;
    bindRailDrag();
    if (document.getElementById("sb-seats")) { layoutSeats(); return; }
    var wrap = document.getElementById("sb-canvas-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "sb-canvas-wrap";
      canvas.parentNode.insertBefore(wrap, canvas);
      wrap.appendChild(canvas);
    }
    var layer = document.createElement("div");
    layer.id = "sb-seats";
    PARTS.forEach(function (p) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sb-seat";
      b.setAttribute("data-seat", p.id);
      b.setAttribute("aria-label", labelFor(p.id) + " LEFT");
      b.innerHTML = '<img src="' + p.src + '" alt="" /><span>' + labelFor(p.id) + " LEFT</span>';
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        seat(p.id);
      });
      layer.appendChild(b);
    });
    wrap.appendChild(layer);
    layoutSeats();
    if (!window.__ltSeatLayoutBound) {
      window.__ltSeatLayoutBound = 1;
      window.addEventListener("resize", layoutSeats);
      if (window.visualViewport) window.visualViewport.addEventListener("resize", layoutSeats);
    }
    if (!document.documentElement.getAttribute("data-lt-seat-guard")) {
      document.documentElement.setAttribute("data-lt-seat-guard", "1");
      document.addEventListener("click", guardRun, true);
    }
    paint();
  }

  var obs = new MutationObserver(function () { mount(); paint(); });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
