/* Live SH/SC fingerprint on the sandbox strip — shop talk, not a coin flip. */
(function () {
  "use strict";
  function classify(sh, sc, tgtSH, tgtSC) {
    if (!(sh >= 0) || !(sc >= 0)) return null;
    var hiSH = sh > tgtSH + 6;
    var loSH = sh < Math.max(2, tgtSH - 6);
    var hiSC = sc > tgtSC + 6;
    var loSC = sc < Math.max(1, tgtSC - 6);
    if (Math.abs(sh - tgtSH) <= 4 && Math.abs(sc - tgtSC) <= 4)
      return "HUB: SH/SC in band. That's a charged, breathing system.";
    if (hiSH && loSC) return "HUB: high SH + low SC = starved. Leak or undercharge — recover, find it, weigh-in. Don't top off.";
    if (hiSH && hiSC) return "HUB: high SH + high SC = restriction or TXV nearly closed. Check drier drop and bulb strap before gas.";
    if (loSH && hiSC) return "HUB: low SH + high SC = overcharge or TXV too open. Recover to nameplate. Slug risk.";
    if (loSH && loSC) return "HUB: low SH + low SC = airflow first. Dirty evap, blower, or filter — not a charge dart.";
    if (hiSH) return "HUB: high SH only — evaporator starved. Confirm SC before you call it a leak.";
    if (hiSC) return "HUB: high SC only — stacked liquid. Weigh-out before you add.";
    if (loSC) return "HUB: low SC — not enough liquid in the condenser. Charge or condenser airflow.";
    return "HUB: SH and SC together. One number is a coin flip.";
  }
  function num(el) {
    if (!el) return NaN;
    var n = parseFloat(String(el.textContent || "").replace(/[^\d.-]/g, ""));
    return n;
  }
  function tick() {
    var fp = document.getElementById("sb-fp");
    var shEl = document.getElementById("g-sh");
    var scEl = document.getElementById("g-sc");
    var tgt = document.getElementById("g-tgt");
    if (!fp || !shEl || !scEl) return;
    var sh = num(shEl);
    var sc = num(scEl);
    if (isNaN(sh) || isNaN(sc)) return;
    var tgtSH = 10, tgtSC = 10;
    if (tgt && tgt.textContent) {
      var parts = String(tgt.textContent).split("/");
      if (parts.length >= 2) {
        tgtSH = parseFloat(parts[0]) || tgtSH;
        tgtSC = parseFloat(parts[1]) || tgtSC;
      }
    }
    var line = classify(sh, sc, tgtSH, tgtSC);
    if (!line) return;
    var cur = fp.textContent || "";
    if (/coin flip|don't chase one number|SH and SC together/i.test(cur) || /in band|starved|restriction|overcharge|airflow first|stacked liquid|not enough liquid/i.test(line)) {
      if (cur !== line) fp.textContent = line;
    }
  }
  setInterval(tick, 700);
})();
