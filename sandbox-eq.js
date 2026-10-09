/* Standing P/T: unit off, charge migrates to the colder coil. Not outdoor sat. */
(function () {
  "use strict";
  var TP = [40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120];
  var PP = [118, 130, 143, 156, 170, 185, 201, 218, 236, 255, 275, 296, 318, 341, 365, 390, 417];
  function numF(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var m = String(el.textContent || "").match(/(-?\d+)/);
    return m ? Number(m[1]) : null;
  }
  function sat(t) {
    if (t <= TP[0]) return PP[0];
    if (t >= TP[TP.length - 1]) return PP[PP.length - 1];
    var i = 0;
    while (i < TP.length - 1 && t > TP[i + 1]) i++;
    var span = TP[i + 1] - TP[i];
    var k = span ? (t - TP[i]) / span : 0;
    return Math.round(PP[i] + (PP[i + 1] - PP[i]) * k);
  }
  function setP(id, psi) {
    var el = document.getElementById(id);
    if (!el) return;
    var next = psi + " psig";
    if (el.textContent !== next) el.textContent = next;
  }
  function running() {
    var run = document.getElementById("sb-run");
    return !!(run && /stop/i.test(run.textContent || ""));
  }
  function paint() {
    if (!document.getElementById("sandbox-root") && !document.getElementById("sb-ps")) return;
    var on = running();
    var ps = document.getElementById("sb-ps-title");
    var ph = document.getElementById("sb-ph-title");
    var sst = document.getElementById("sb-sst");
    var sct = document.getElementById("sb-sct");
    var method = document.getElementById("sb-method");
    var chip = document.getElementById("sb-eq-chip");
    if (ps) ps.textContent = on ? "Blue hose \u2014 suction / LPC" : "Blue hose \u2014 suction / LPC standing";
    if (ph) ph.textContent = on ? "Red hose \u2014 liquid / HPC" : "Red hose \u2014 liquid / HPC standing";
    if (on) {
      if (method && /standing|migrat/i.test(method.textContent || "")) method.textContent = "\u2014 charge method after readings settle";
      return;
    }
    var od = numF("sb-out-v");
    var idt = numF("sb-in-v");
    if (od == null) od = 95;
    if (idt == null) idt = 75;
    var cold = Math.min(od, idt);
    var side = cold === idt && idt !== od ? "indoor" : cold === od && idt !== od ? "outdoor" : "both coils";
    var psi = sat(cold);
    setP("sb-ps", psi);
    setP("sb-ph", psi);
    setP("g-plow", psi);
    setP("g-phigh", psi);
    if (sst) sst.textContent = "migrated to " + side + " " + cold + "\u00b0F";
    if (sct) sct.textContent = "same P as blue hose \u2014 cold-coil sat";
    if (method) method.textContent = "standing \u00b7 blue = red = cold coil " + cold + "\u00b0F \u00b7 no SH/SC until it runs";
    if (chip) {
      chip.textContent = "EQUALIZED \u2014 charge sat at the colder coil (" + side + " " + cold + "\u00b0F, " + psi + " psig). Not outdoor sat. No SH/SC until it runs.";
    }
  }
  setInterval(paint, 350);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})();
