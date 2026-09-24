/* HVAC Allstars — four LEFT diamond tap seats */
(function () {
  "use strict";
  var PARTS = [
    { id: "compressor", label: "COMP" },
    { id: "condenser", label: "COND" },
    { id: "metering", label: "TXV" },
    { id: "evaporator", label: "EVAP" }
  ];

  function filled(id) {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
    if (slot && (slot.classList.contains("filled") || slot.querySelector("img, strong, .rm"))) return true;
    var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
    return !!(part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true"));
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

  function paint() {
    document.querySelectorAll("#sb-seats .sb-seat").forEach(function (btn) {
      btn.classList.toggle("on", filled(btn.getAttribute("data-seat")));
    });
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
      b.textContent = p.label;
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        seat(p.id);
      });
      layer.appendChild(b);
    });
    wrap.appendChild(layer);
    paint();
  }

  var obs = new MutationObserver(function () { mount(); paint(); });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
