/* Manifold-on-ports gate + Start compressor drops healthy four if loop is open. */
(function () {
  "use strict";
  if (!document.getElementById("sb-tabs-css")) {
    var l = document.createElement("link");
    l.id = "sb-tabs-css";
    l.rel = "stylesheet";
    l.href = "sb-tabs.css?v=2";
    document.head.appendChild(l);
  }
  function gaugesOn() {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="gauges"]');
    if (!slot) return false;
    if (slot.querySelector("img")) return true;
    if (/\b(on|filled|has)\b/.test(slot.className)) return true;
    var t = (slot.textContent || "").replace(/\s+/g, " ").trim();
    return /manifold|gauge/i.test(t) && t.length > 8;
  }
  function coreFilled(id) {
    var el = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
    if (!el) return false;
    if (el.classList.contains("filled")) return true;
    return !!el.querySelector("img, strong, .rm");
  }
  function missingCore() {
    return ["compressor", "condenser", "metering", "evaporator"].filter(function (s) {
      return !coreFilled(s);
    });
  }
  function loadHealthy() {
    var healthy = document.getElementById("sb-healthy");
    if (healthy) {
      healthy.click();
      return true;
    }
    return false;
  }
  function callOutOpenLoop() {
    var miss = missingCore();
    if (!miss.length) return false;
    if (loadHealthy()) {
      var st = document.getElementById("sb-status");
      if (st) st.textContent = "Four on the glass + gauges. Compressor running. Read SH/SC on the strip.";
      var hint = document.getElementById("sb-hint");
      if (hint) hint.textContent = "Healthy example loaded from Start compressor — loop closed.";
      return true;
    }
    var line = "Loop open — still need " + miss.join(", ") + ". Drop them LEFT, then Start compressor.";
    var st = document.getElementById("sb-status");
    if (st) st.textContent = line;
    return true;
  }
  function armRunBtn() {
    var btn = document.getElementById("sb-run");
    if (!btn || btn.dataset.openLoopArmed) return;
    btn.dataset.openLoopArmed = "1";
    btn.addEventListener(
      "click",
      function (e) {
        var howto = document.getElementById("sb-howto");
        if (howto && !howto.classList.contains("hidden")) {
          howto.classList.add("hidden");
          try { localStorage.setItem("lt-sb-howto", "1"); } catch (_) {}
        }
        if (missingCore().length) {
          e.stopImmediatePropagation();
          callOutOpenLoop();
        }
      },
      true
    );
  }
  function apply() {
    armRunBtn();
    var fp = document.getElementById("sb-fp");
    var low = document.getElementById("g-plow");
    if (!fp || !low) return;
    var tgt = document.getElementById("g-tgt");
    if (tgt) {
      var cur = (tgt.textContent || "").trim();
      if (!cur || cur === "—" || cur === "-") tgt.textContent = "tgt 10 / 10 °F";
    }
    if (gaugesOn()) return;
    low.textContent = "—";
    var hi = document.getElementById("g-phigh");
    if (hi) hi.textContent = "—";
    var sl = document.getElementById("g-tsatl");
    var sh = document.getElementById("g-tsath");
    if (sl) sl.textContent = "sat — °F";
    if (sh) sh.textContent = "sat — °F";
    ["g-sh", "g-sc", "g-tsuc", "g-tliq"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = "—";
    });
    fp.textContent =
      "HUB: manifold first. Blue hose on suction, red on liquid. Target SH/SC is on the sheet — no live psig until the set is on the ports.";
  }
  setInterval(apply, 350);
})();
