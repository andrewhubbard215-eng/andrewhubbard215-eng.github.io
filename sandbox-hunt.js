/* Overlay: liquid-line restriction vs TXV strap. Loads after sandbox.js */
(function () {
  "use strict";
  function bind() {
    var sb = window.HVACSandbox;
    if (!sb || !sb.start || window.__ltHuntBound) return;
    window.__ltHuntBound = 1;
    var load = sb.loadRouteTicket;
    sb.loadRouteTicket = function (t) {
      window._ltHunt = t;
      return load ? load.apply(this, arguments) : t;
    };
  }
  document.addEventListener("click", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-fault]");
    if (b) window._ltHunt = b.getAttribute("data-fault");
    bind();
  }, true);

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
  }

  setInterval(function () {
    bind();
    var id = window._ltHunt || window._ltTicketId;
    var run = document.getElementById("sb-run");
    var running = !!(run && /stop/i.test(run.textContent || ""));
    var ph = document.getElementById("sb-ph");
    if (!running) {
      if (ph && ph.dataset.airBase) delete ph.dataset.airBase;
      return;
    }
    if (id === "txv-bulb") {
      var sst = 57;
      var hunt = 8 + 12 * Math.sin(Date.now() / 650);
      var slv = sst + hunt;
      setText("sb-ps", "158 psig");
      setText("sb-sst", "SST " + sst + "\u00b0F");
      setText("sb-sl", "SL " + slv.toFixed(0) + "\u00b0F");
      setText("sb-sh", hunt.toFixed(1) + " \u00b0F SH  (seat 8\u201314)");
      setText("sb-ph", "430 psig");
      setText("sb-sct", "SCT 118\u00b0F");
      setText("sb-ll", "LL 108\u00b0F");
      setText("sb-sc", "10.0 \u00b0F SC  (seat 8\u201314)");
      setText("g-sh", hunt.toFixed(1) + "\u00b0");
      setText("g-sc", "10.0\u00b0");
      setText("g-plow", "158 psig");
      setText("g-phigh", "430 psig");
      var note = document.getElementById("sb-split");
      if (note) note.textContent = "Strap/bulb hunt \u2014 SH swings, SC stays in band. Not a liquid-line restriction.";
    } else if (id === "drier") {
      setText("sb-ps", "98 psig");
      setText("sb-sst", "SST 30\u00b0F");
      setText("sb-sl", "SL 58\u00b0F");
      setText("sb-sh", "28.0 \u00b0F SH  (seat 8\u201314)");
      setText("sb-ph", "360 psig");
      setText("sb-sct", "SCT 108\u00b0F");
      setText("sb-ll", "LL 86\u00b0F");
      setText("sb-sc", "22.0 \u00b0F SC  (seat 8\u201314)");
      setText("g-sh", "28.0\u00b0");
      setText("g-sc", "22.0\u00b0");
      setText("g-plow", "98 psig");
      setText("g-phigh", "360 psig");
      var dnote = document.getElementById("sb-split");
      if (dnote) dnote.textContent = "Restriction after drier \u2014 high SH + high SC. Outlet cold. Do not add gas. Not a bulb strap.";
    } else if (id === "air" && ph) {
      var n = parseFloat(String(ph.textContent).replace(/[^\d.-]/g, ""));
      if (isFinite(n)) {
        if (!ph.dataset.airBase) ph.dataset.airBase = String(n);
        var elevated = Math.round(Number(ph.dataset.airBase) * 1.12);
        ph.textContent = elevated + " psig";
        setText("g-phigh", elevated + " psig");
      }
      setText("sb-sc", "22.0 \u00b0F SC  (seat 8\u201314)");
      setText("g-sc", "22.0\u00b0");
    } else if (ph && ph.dataset.airBase) {
      delete ph.dataset.airBase;
    }
  }, 220);
})();
