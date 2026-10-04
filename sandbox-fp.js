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
    if (hiSH && hiSC) return "HUB: high SH + high SC = restriction / plugged drier. Cold at the drier outlet. Do not add gas.";
    if (loSH && hiSC) return "HUB: low SH + high SC = overcharge. Recover to nameplate. Do not turn the TXV to hide it.";
    if (loSH && loSC) return "HUB: low SH + low SC = airflow first. Dirty evap, blower, or filter — not a charge dart.";
    if (hiSH) return "HUB: high SH only — evaporator starved. Confirm SC before you call it a leak.";
    if (hiSC && !loSH && !hiSH) return "HUB: high SC, SH in band = heat rejection. Dirty condenser or OD fan dead. Wash the coil and prove the fan before you recover. Discharge too hot to hold after that is air — recover, vacuum, weigh in.";
    if (hiSC) return "HUB: high SC with low SH = overcharge. Recover to nameplate. Do not wash a clean coil to hide extra gas.";
    if (loSC) return "HUB: low SC — not enough liquid in the condenser. Charge or condenser airflow.";
    return "HUB: SH and SC together. One number is a coin flip.";
  }
  function num(el) {
    if (!el) return NaN;
    var n = parseFloat(String(el.textContent || "").replace(/[^\d.-]/g, ""));
    return n;
  }
  function mount() {
    var fp = document.getElementById("sb-fp");
    if (fp) return fp;
    var host = document.getElementById("sb-faults") || document.getElementById("sb-run") || document.getElementById("sandbox-root");
    if (!host) return null;
    fp = document.createElement("p");
    fp.id = "sb-fp";
    fp.className = "sb-fp";
    fp.setAttribute("role", "status");
    fp.style.cssText = "margin:4px 8px 6px;padding:6px 8px;font:13px/1.35 sans-serif;color:#f3e2b0;background:#121820;border:1px solid #8a6a10;border-radius:8px";
    if (host.id === "sandbox-root") host.appendChild(fp);
    else host.parentNode.insertBefore(fp, host);
    return fp;
  }
  function tick() {
    var fp = mount();
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
    if (fp.textContent !== line) fp.textContent = line;
  }
  setInterval(tick, 700);
})();
