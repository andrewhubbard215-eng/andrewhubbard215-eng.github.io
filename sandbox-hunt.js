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
    if (!run || !/stop/i.test(run.textContent || "")) return;
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
      if (isFinite(n) && n < 500) ph.textContent = Math.round(n * 1.08) + " psig";
      sc.textContent = "22.0 \u00b0F SC  (seat 8–14)";
      var gsc = document.getElementById("g-sc");
      if (gsc) gsc.textContent = "22.0\u00b0";
    }
  }, 220);
})();
