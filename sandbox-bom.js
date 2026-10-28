/* HVAC Allstars — bench leftover BOM (parts LEFT). Loads after sandbox.js */
(function () {
  function slotLabel(el) {
    var lab = (el.querySelector(".empty") && el.querySelector(".empty").textContent) || el.dataset.slot || "";
    var strong = el.querySelector("strong");
    if (strong) lab = strong.textContent || lab;
    return (lab || "").replace(/\s+/g, " ").trim();
  }

  function paintBom() {
    var ul = document.getElementById("sb-bom");
    if (!ul) return;
    if (ul.dataset.painting === "1") return;
    var slots = document.querySelectorAll("#sb-slots .sb-slot");
    if (!slots.length) return;
    var left = [];
    slots.forEach(function (el) {
      if (el.classList.contains("filled")) return;
      var lab = slotLabel(el) || el.dataset.slot || "";
      var req = el.classList.contains("required") || el.classList.contains("core");
      left.push("<li class='sb-bom-left'>" + lab + "<small> LEFT on the bench" + (req ? " · required" : "") + "</small></li>");
    });
    var existing = ul.querySelector(".sb-bom-hd");
    if (existing) {
      var drop = existing;
      while (drop) {
        var n = drop.nextSibling;
        drop.parentNode.removeChild(drop);
        drop = n && n.classList && (n.classList.contains("sb-bom-left") || n.classList.contains("sb-bom-hd")) ? n : null;
      }
    }
    if (!left.length) return;
    ul.dataset.painting = "1";
    ul.insertAdjacentHTML("beforeend", "<li class='sb-bom-hd'>Still on the bench</li>" + left.join(""));
    ul.dataset.painting = "0";
  }

  function markTray() {
    var seatedSlots = {};
    var seatedIds = {};
    document.querySelectorAll("#sb-slots .sb-slot.filled").forEach(function (el) {
      var slot = el.dataset.slot || "";
      seatedSlots[slot] = true;
      var name = (el.querySelector("strong") && el.querySelector("strong").textContent) || "";
      name = name.toLowerCase();
      if (slot) seatedIds[slot] = true;
      if (/piston/.test(name)) seatedIds.piston = true;
      if (/capillar/.test(name)) seatedIds.capillary = true;
      if (/txv|metering/.test(name)) seatedIds.metering = true;
    });
    document.querySelectorAll("#sb-items .sb-item[data-id]").forEach(function (el) {
      var id = el.dataset.id;
      var seated = !!(seatedIds[id] || seatedSlots[id]);
      el.classList.toggle("sb-on-loop", seated);
      var small = el.querySelector("small");
      if (!small) return;
      if (seated) {
        if (!small.dataset.bench) small.dataset.bench = small.textContent || "";
        small.textContent = "ON THE LOOP · not LEFT on the bench";
      } else if (small.dataset.bench) {
        small.textContent = small.dataset.bench;
        delete small.dataset.bench;
      }
    });
  }

  function tick() {
    paintBom();
    markTray();
  }

  function boot() {
    if (!document.getElementById("sb-bom-loop-css")) {
      var s = document.createElement("style");
      s.id = "sb-bom-loop-css";
      s.textContent = ".sb-item.sb-on-loop{opacity:.48;border-color:rgba(45,212,191,.35)}.sb-item.sb-on-loop small{color:#2dd4bf}";
      document.head.appendChild(s);
    }
    tick();
    var root = document.getElementById("sandbox-root") || document.body;
    if (root && !root.dataset.benchObs) {
      root.dataset.benchObs = "1";
      new MutationObserver(tick).observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(tick, 800);
})();
