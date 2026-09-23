/* Overlay: TXV bulb hunts SH; air in circuit stacks head/SC. Loads after sandbox.js */
(function () {
  "use strict";
  var start = window.HVACSandbox && window.HVACSandbox.start;
  if (!start) return;
  var load = window.HVACSandbox.loadRouteTicket;
  function bumpTicket(id) {
    window._ltHunt = id;
  }
  window.HVACSandbox.loadRouteTicket = function (t) {
    bumpTicket(t);
    return load ? load.apply(this, arguments) : t;
  };
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-fault]");
    if (b) bumpTicket(b.getAttribute("data-fault"));
  }, true);
  setInterval(function () {
    var id = window._ltHunt || window._ltTicketId;
    var sh = document.getElementById("sb-sh");
    var sl = document.getElementById("sb-sl");
    var ph = document.getElementById("sb-ph");
    var sc = document.getElementById("sb-sc");
    var run = document.getElementById("sb-run");
    var running = !!(run && /stop/i.test(run.textContent || ""));
    if (!running) {
      if (ph && ph.dataset.airBase) delete ph.dataset.airBase;
      return;
    }
    if (id === "txv-bulb" && sh) {
      var sstEl = document.getElementById("sb-sst");
      var sst = sstEl ? parseFloat(String(sstEl.textContent).replace(/[^\d.-]/g, "")) : 40;
      var hunt = 10 + 10 * Math.sin(Date.now() / 650);
      var slv = sst + hunt;
      if (sl) sl.textContent = "SL " + slv.toFixed(0) + "\u00b0F";
      sh.textContent = hunt.toFixed(1) + " \u00b0F SH  (seat 8–14)";
      var gsh = document.getElementById("g-sh");
      if (gsh) gsh.textContent = hunt.toFixed(1) + "\u00b0";
    }
    if (id === "air" && ph && sc) {
      var n = parseFloat(String(ph.textContent).replace(/[^\d.-]/g, ""));
      if (isFinite(n)) {
        if (!ph.dataset.airBase) ph.dataset.airBase = String(n);
        var elevated = Math.round(Number(ph.dataset.airBase) * 1.12);
        ph.textContent = elevated + " psig";
        var gph = document.getElementById("g-phigh");
        if (gph) gph.textContent = elevated + " psig";
      }
      sc.textContent = "22.0 \u00b0F SC  (seat 8–14)";
      var gsc = document.getElementById("g-sc");
      if (gsc) gsc.textContent = "22.0\u00b0";
    } else if (ph && ph.dataset.airBase) {
      delete ph.dataset.airBase;
    }
  }, 220);
})();
