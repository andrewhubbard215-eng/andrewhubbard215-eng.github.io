/* Manifold-on-ports gate. No live psig until gauges are in the Gauges slot. */
(function () {
  "use strict";
  function gaugesOn() {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="gauges"]');
    if (!slot) return false;
    if (slot.querySelector("img")) return true;
    if (/\b(on|filled|has)\b/.test(slot.className)) return true;
    var t = (slot.textContent || "").replace(/\s+/g, " ").trim();
    return /manifold|gauge/i.test(t) && t.length > 8;
  }
  function apply() {
    var fp = document.getElementById("sb-fp");
    var low = document.getElementById("g-plow");
    if (!fp || !low) return;
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
      "HUB: manifold first. Blue hose on suction, red on liquid. No numbers until the set is on the ports.";
  }
  setInterval(apply, 350);
})();
