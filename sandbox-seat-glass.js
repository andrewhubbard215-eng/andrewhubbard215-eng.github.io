/* Four seated: stop telling the tech to seat LEFT. Read SH/SC after start. */
(function () {
  "use strict";
  if (window.__ltSeatGlass) return;
  window.__ltSeatGlass = 1;
  var IDS = ["compressor", "condenser", "metering", "evaporator"];
  function seated() {
    return IDS.every(function (id) {
      var seat = document.querySelector('#sb-seats .sb-seat[data-part="' + id + '"], #sb-seats .sb-seat[data-seat="' + id + '"]');
      return !!(seat && /\bon\b/.test(seat.className || ""));
    });
  }
  function running() {
    var b = document.getElementById("sb-run");
    return !!(b && /stop/i.test(b.textContent || ""));
  }
  function setText(id, text) {
    var el = document.getElementById(id);
    if (!el || el.textContent === text) return;
    el.textContent = text;
  }
  function tick() {
    if (!document.getElementById("sandbox-root")) return;
    if (!seated() || running()) return;
    var line = "Four seated — COMP · COND · TXV · EVAP. Start the compressor. Then read SH/SC off the glass.";
    ["sb-status", "sb-formula", "sb-method", "sb-call"].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (/seat|LEFT|LOOP OPEN/i.test(el.textContent || "")) setText(id, line);
    });
    var ts = document.getElementById("pv-ts");
    if (ts && /seat/i.test(ts.textContent || "")) setText("pv-ts", "TS 3 · Four seated — start");
  }
  setInterval(tick, 400);
})();
