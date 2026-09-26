/* Standing P/T is equalized to outdoor, not running SST/SCT. */
(function () {
  "use strict";
  function paint() {
    var run = document.getElementById("sb-run");
    var on = !!(run && /stop/i.test(run.textContent || ""));
    var ps = document.getElementById("sb-ps-title");
    var ph = document.getElementById("sb-ph-title");
    var sst = document.getElementById("sb-sst");
    var sct = document.getElementById("sb-sct");
    var method = document.getElementById("sb-method");
    var chip = document.getElementById("sb-eq-chip");
    if (on) {
      if (method && /standing/i.test(method.textContent || "")) method.textContent = "\u2014 charge method after readings settle";
      return;
    }
    if (ps) ps.textContent = "Standing LPC (equalized)";
    if (ph) ph.textContent = "Standing HPC (equalized)";
    if (sst) {
      var n = String(sst.textContent || "").match(/(-?\d+)/);
      if (n) sst.textContent = "equalized to ODT " + n[1] + "\u00b0F";
    }
    if (sct) sct.textContent = "same number both sides";
    if (method) method.textContent = "standing \u00b7 LPC = HPC = OD sat \u00b7 no SH/SC until it runs";
    if (chip && !/both sides/.test(chip.textContent || "")) {
      chip.textContent = "EQUALIZED \u2014 unit off. LPC and HPC same sat P. Do not read SH/SC until it runs.";
    }
  }
  setInterval(paint, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})();
