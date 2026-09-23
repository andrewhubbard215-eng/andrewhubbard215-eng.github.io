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
  function compressorOn() {
    var runBtn = document.getElementById("sb-run");
    if (runBtn && /stop/i.test(runBtn.textContent || "")) return true;
    var ps = document.getElementById("sb-ps-title");
    if (ps && /LPC \/ Suction/i.test(ps.textContent || "")) return true;
    var st = document.getElementById("sb-status");
    if (st && /Compressor on/i.test(st.textContent || "")) return true;
    var sh = document.getElementById("sb-sh");
    if (sh && /\d/.test(sh.textContent || "") && !/off \(no SH\)/i.test(sh.textContent || "")) return true;
    return false;
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
    var running = compressorOn();
    var od = num("sb-out", 95);
    var idb = num("sb-in", 75);
    var wb = num("sb-wb", 63);
    var sst = satFromLabel("sb-sst");
    var sct = satFromLabel("sb-sct");
    var etd = ensure("sb-etd", "sb-sh");
    var ctd = ensure("sb-ctd", "sb-sc");
    var method = ensure("sb-method", "sb-etd");
    if (etd) etd.textContent = running && sst != null ? "Evap TD " + Math.round(idb - sst) + "\u00b0 (ID\u2212SST)" : "\u2014 off (no TD)";
    if (ctd) ctd.textContent = running && sct != null ? "Cond TD " + Math.round(sct - od) + "\u00b0 (SCT\u2212OD)" : "\u2014 off (no TD)";
    if (method) {
      var tgt = pistonSh(od, wb);
      var kind = meteringKind();
      if (!running) {
        method.textContent = "\u2014 charge method after compressor on";
      } else if (kind === "piston") {
        method.textContent = "Piston \u00b7 charge by SH " + tgt + "\u00b0 (ODB " + Math.round(od) + " / WB " + Math.round(wb) + ") \u00b7 SC is a check";
      } else if (kind === "eev") {
        method.textContent = "EEV \u00b7 weigh-in \u00b7 SH/SC are checks only";
      } else {
        method.textContent = "TXV \u00b7 charge by SC 8\u201314\u00b0 \u00b7 SH is a check (seat 8\u201314)";
      }
    }
  }
  function armRun() {
    var runBtn = document.getElementById("sb-run");
    if (!runBtn || runBtn.dataset.tdArmed === "1") return;
    runBtn.dataset.tdArmed = "1";
    runBtn.addEventListener("click", function () {
      setTimeout(paint, 0);
      setTimeout(paint, 50);
      setTimeout(paint, 160);
    });
  }
  setInterval(function () { armRun(); paint(); }, 400);
  armRun();
  paint();
})();
