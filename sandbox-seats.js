/* HVAC Allstars — four LEFT diamond seats with real part plates */
(function () {
  "use strict";
  var PARTS = [
    { id: "compressor", label: "COMP", src: "parts/compressor.png" },
    { id: "condenser", label: "COND", src: "parts/condenser.png" },
    { id: "metering", label: "TXV", src: "parts/metering.png" },
    { id: "evaporator", label: "EVAP", src: "parts/evaporator.png" }
  ];

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
    paint();
  }

  function missingPretty() {
    return PARTS.filter(function (p) { return !filled(p.id); }).map(function (p) { return labelFor(p.id); });
  }

  function paintStrip() {
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
      strip.textContent = "LOOP OPEN — seat LEFT: " + miss.join(" · ") + ". Standing P/T only. No SH/SC until the circuit is closed.";
    } else {
      strip.style.color = "#5eead4";
      strip.textContent = "LOOP CLOSED — COMP · COND · " + meteringName() + " · EVAP seated. Start compressor. Then read SH/SC.";
    }
  }

  function paint() {
    document.querySelectorAll("#sb-seats .sb-seat").forEach(function (btn) {
      var id = btn.getAttribute("data-seat");
      var on = filled(id);
      btn.classList.toggle("on", on);
      var span = btn.querySelector("span");
      var name = labelFor(id);
      if (span) span.textContent = on ? name + " SEATED" : name + " LEFT";
    });
    var run = document.getElementById("sb-run");
    if (run && !/Stop compressor/i.test(run.textContent || "")) {
      run.textContent = allSeated() ? "Start compressor" : "Seat 4 LEFT first";
    }
    paintStrip();
  }

  function guardRun(ev) {
    var run = document.getElementById("sb-run");
    if (!run || (ev.target !== run && !run.contains(ev.target))) return;
    if (allSeated()) return;
    if (/Stop compressor/i.test(run.textContent || "")) return;
    ev.preventDefault();
    ev.stopPropagation();
    var st = document.getElementById("sb-status");
    if (st) {
      st.textContent = "Parts LEFT — seat COMP, COND, " + meteringName() + ", EVAP before the compressor. Standing pressure is not a diagnosis.";
    }
    paint();
  }

  function mount() {
    var canvas = document.getElementById("sb-canvas");
    if (!canvas || document.getElementById("sb-seats")) return;
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
