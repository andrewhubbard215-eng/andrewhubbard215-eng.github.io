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
    if (on) return;
    if (ps && /Standing LPC/i.test(ps.textContent || "")) ps.textContent = "Standing LPC (equalized)";
    if (ph && /Standing HPC/i.test(ph.textContent || "")) ph.textContent = "Standing HPC (equalized)";
    if (sst) {
      var n = String(sst.textContent || "").match(/(-?\d+)/);
      if (n) sst.textContent = "equalized to ODT " + n[1] + "\u00b0F";
    }
    if (sct && /eq|equaliz|both/i.test(sct.textContent || "")) sct.textContent = "equalized \u00b7 both sides";
  }
  setInterval(paint, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})();
