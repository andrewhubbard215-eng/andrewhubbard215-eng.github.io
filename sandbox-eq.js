/* Standing P/T: unit off, charge migrates to the colder coil. Ambient sat only. Parts LEFT. Do not recover. 80% tank stop is law. v3.5.934 */
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
    if (t >= TP[TP.length - 1]) return PP[TP.length - 1];
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
      if (method && /standing|migrat/i.test(method.textContent || "")) method.textContent = "Wait 5\u201310 min for stable SH/SC. Do not call charge on first glass.";
      if (chip) { chip.style.background = ""; chip.style.border = ""; chip.style.animation = ""; }
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
    if (method) method.textContent = "STOP RECOVERY: LOTO / meter 24V FIRST · EQUALIZED · blue=red · AMBIENT SAT ONLY (migration to cold coil " + cold + "°F) · ZERO DIALS (hoses OFF) · PARTS LEFT · 80% tank stop is law · do NOT recover or add — STOP · no SH/SC until Start";
    if (chip) {
      chip.textContent = "STOP RECOVERY NOW: EQUALIZED blue=red=ambient SAT ONLY = DO NOT RECOVER. Ambient match = migration only. FIRST: seat COMP·COND·TXV·EVAP LEFT. LOTO / meter 24V string. Migration to cold coil " + side + " " + cold + "°F / " + psi + " psig. ZERO DIALS (hoses OFF). PARTS LEFT. 80% recovery tank stop is law. Do NOT recover or add — STOP. No SH/SC until Start.";
      chip.style.background = "#ffcc00"; chip.style.color = "#000";
      chip.style.border = "2px solid #ff3b30";
      chip.style.animation = "eqPulse 1.2s ease-in-out infinite";
    }
  }
  if (!document.getElementById("eq-pulse-style")) {
    var st = document.createElement("style");
    st.id = "eq-pulse-style";
    st.textContent = "@keyframes eqPulse { 0%,100%{box-shadow:0 0 0 0 rgba(255,204,0,.9); background:#ffcc00; color:#000} 50%{box-shadow:0 0 0 12px rgba(255,59,48,0); background:#ff3b30; color:#fff} }";
    document.head.appendChild(st);
  }
  setInterval(paint, 350);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paint);
  else paint();
})();
