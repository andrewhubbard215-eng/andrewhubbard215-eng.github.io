/* Shop-floor TD + charge method on live gauges. */
(function () {
  "use strict";
  function num(id, fallback) {
    var el = document.getElementById(id);
    var n = el ? Number(el.value) : fallback;
    return isFinite(n) ? n : fallback;
  }
  function satFromLabel(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var m = String(el.textContent || "").match(/(-?\d+)/);
    return m ? Number(m[1]) : null;
  }
  function ensure(id, afterId) {
    var el = document.getElementById(id);
    if (el) return el;
    var host = document.getElementById(afterId);
    if (!host || !host.parentNode) return null;
    el = document.createElement("div");
    el.id = id;
    host.parentNode.insertBefore(el, host.nextSibling);
    return el;
  }
  function pistonSh(od, wb) {
    return Math.max(6, Math.min(18, Math.round(20 - 0.08 * (od - 82) - 0.55 * (wb - 63))));
  }
  function meteringKind() {
    if (window.LtMeteringKind === "orifice" || window.LtMeteringKind === "piston") return "piston";
    if (window.LtMeteringKind === "eev") return "eev";
    if (window.LtMeteringKind === "txv") return "txv";
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="metering"]');
    var blob = ((slot && (slot.textContent + " " + (slot.dataset.has || ""))) || "") +
      " " +
      ((document.getElementById("sb-sys") || {}).textContent || "") +
      " " +
      ((document.querySelector('#sandbox-root [data-part="metering"]') || {}).textContent || "");
    if (/piston|orifice|cap-?tube|fixed/i.test(blob)) return "piston";
    if (/eev|inverter|greenspeed/i.test(blob)) return "eev";
    var tray = document.querySelector('#sandbox-root [data-part="metering"], #sandbox-root button');
    var pressed = document.querySelector('#sandbox-root [data-part="metering"][aria-pressed="true"], #sandbox-root .sb-part.primary');
    var label = ((pressed && pressed.textContent) || (tray && tray.textContent) || "TXV");
    if (/piston|orifice/i.test(label)) return "piston";
    if (/eev/i.test(label)) return "eev";
    return "txv";
  }
  function paint() {
    var runBtn = document.getElementById("sb-run");
    var running = !!(runBtn && /stop/i.test(runBtn.textContent || ""));
    var od = num("sb-out", 95);
    var idb = num("sb-in", 75);
    var wb = num("sb-wb", 63);
    var sst = satFromLabel("sb-sst");
    var sct = satFromLabel("sb-sct");
    var etd = ensure("sb-etd", "sb-sh");
    var ctd = ensure("sb-ctd", "sb-sc");
    var method = ensure("sb-method", "sb-etd");
    if (etd) etd.textContent = running && sst != null ? "Evap TD " + Math.round(idb - sst) + "° (ID−SST)" : "— off (no TD)";
    if (ctd) ctd.textContent = running && sct != null ? "Cond TD " + Math.round(sct - od) + "° (SCT−OD)" : "— off (no TD)";
    if (method) {
      var tgt = pistonSh(od, wb);
      var kind = meteringKind();
      if (!running) {
        method.textContent = "— charge method after compressor on";
      } else if (kind === "piston") {
        method.textContent = "Piston · charge by SH " + tgt + "° (ODB " + Math.round(od) + " / WB " + Math.round(wb) + ") · SC is a check";
      } else if (kind === "eev") {
        method.textContent = "EEV · weigh-in · SH/SC are checks only";
      } else {
        method.textContent = "TXV · charge by SC 8–14° · SH is a check (seat 8–14)";
      }
    }
  }
  setInterval(paint, 400);
})();
