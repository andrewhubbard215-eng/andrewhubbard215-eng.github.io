/* Live SH/SC fingerprint on the sandbox strip — shop talk, not a coin flip. */
(function () {
  "use strict";
  function heatLine() {
    return "HUB: head is high, SH/SC still in band. Heat rejection — dirty condenser or OD fan dead. Wash the coil and prove the fan spins before you recover. SC in band is not a weigh-out.";
  }
  function fanLine() {
    return "HUB: OD fan dead. Head 618, cond TD 53 — out of seat. Blade is not moving air. Prove the fan and the fan cap before you wash or recover. If the compressor is off, that is the HPC. Do not recover.";
  }
  function dirtyLine() {
    return "HUB: dirty condenser. Fan still moves air, cond TD high, SH/SC in band. Wash the coil. Do not recover a charge that is in band.";
  }
  function leakLine() {
    return "HUB: high SH + low SC = starved. Leak or undercharge — recover, find it, weigh-in. Don't top off.";
  }
  function restrictLine() {
    return "HUB: high SH + high SC = restriction / plugged drier. Cold at the drier outlet. Do not add gas.";
  }
  function kind(fault) {
    var f = fault || "";
    if (/fan dead|od fan|condenser fan/i.test(f)) return "fan";
    if (/dirty condenser|dirty od|rooftop/i.test(f)) return "dirty";
    if (/restrict|drier|plugged/i.test(f)) return "restrict";
    if (/slow leak|undercharge|leak/i.test(f)) return "leak";
    return "";
  }
  function condTd() {
    var el = document.getElementById("sb-ctd");
    if (!el) return NaN;
    var m = String(el.textContent || "").match(/Cond TD\s*(-?[\d.]+)/i);
    return m ? parseFloat(m[1]) : NaN;
  }
  function classify(sh, sc, tgtSH, tgtSC, head, fault) {
    if (!(sh >= 0) || !(sc >= 0)) return null;
    var hiSH = sh > tgtSH + 6;
    var loSH = sh < Math.max(2, tgtSH - 6);
    var hiSC = sc > tgtSC + 6;
    var loSC = sc < Math.max(1, tgtSC - 6);
    var inBand = Math.abs(sh - tgtSH) <= 4 && Math.abs(sc - tgtSC) <= 4;
    var k = kind(fault);
    var faultHeat = k === "fan" || k === "dirty" || /high head/i.test(fault || "");
    var ctd = condTd();
    var tdOut = ctd >= 32;
    if (k === "leak" && hiSH && loSC) return leakLine();
    if (k === "restrict" && hiSH && hiSC) return restrictLine();
    if (inBand && k === "fan") return fanLine();
    if (inBand && k === "dirty") return dirtyLine();
    if (inBand && (faultHeat || tdOut) && (tdOut || head >= 450)) return heatLine();
    if (inBand)
      return "HUB: SH/SC in band. That's a charged, breathing system.";
    if (hiSH && loSC) return leakLine();
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
  function setText(id, text) {
    var el = document.getElementById(id);
    if (el && el.textContent !== text) el.textContent = text;
  }
  function running() {
    var run = document.getElementById("sb-run");
    return !!(run && /stop compressor/i.test(run.textContent || ""));
  }
  function paintSplit(fault) {
    var k = kind(fault);
    if (!k) return;
    var tripped = !running();
    if (k === "fan") {
      setText("g-phigh", "618 psig");
      setText("sb-ph", "618 psig");
      setText("sb-sct", "SCT 148°F");
      setText("sb-ll", "LL 138°F");
      setText("sb-ctd", tripped
        ? "Cond TD 53° (SCT−OD) · seat 20–30° — blown. HPC open. Last call: no air across the coil."
        : "Cond TD 53° (SCT−OD) · seat 20–30° air-cooled — blown. No air across the coil.");
    } else if (k === "dirty") {
      if (tripped) {
        setText("sb-ctd", "Cond TD off — compressor is not running. Equalized P is not a wash call. Start, then read SH/SC.");
        return;
      }
      setText("g-phigh", "498 psig");
      setText("sb-ph", "498 psig");
      setText("sb-sct", "SCT 133°F");
      setText("sb-ll", "LL 123°F");
      setText("sb-ctd", "Cond TD 38° (SCT−OD) · seat 20–30° — high. Fan still moves air. Wash.");
    } else if (k === "leak") {
      if (tripped) return;
      setText("g-plow", "108 psig");
      setText("sb-ps", "108 psig");
      setText("sb-sst", "SST 36°F");
      setText("sb-sl", "SL 64°F");
      setText("g-sh", "28.0");
      setText("sb-sh", "28.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 39° (ID−SST) · seat 15–20° — high. Coil starved.");
      setText("g-phigh", "286 psig");
      setText("sb-ph", "286 psig");
      setText("sb-sct", "SCT 94°F");
      setText("sb-ll", "LL 92°F");
      setText("g-sc", "2.0");
      setText("sb-sc", "2.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD low — not a dirty-coil call. Head followed the charge down.");
      setText("sb-call", "Name it off the glass: 28 SH / 2 SC. High SH + low SC = leak / undercharge. Do not top off. Do not trust the charge knob.");
      setText("sb-shsc-formula", "RUNNING — leak fingerprint. SH 28 (high) · SC 2 (low). Find the leak, recover, weigh-in.");
    } else if (k === "restrict") {
      if (tripped) return;
      setText("g-plow", "108 psig");
      setText("sb-ps", "108 psig");
      setText("sb-sst", "SST 36°F");
      setText("sb-sl", "SL 64°F");
      setText("g-sh", "28.0");
      setText("sb-sh", "28.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 39° (ID−SST) · seat 15–20° — high. Coil starved.");
      setText("g-phigh", "366 psig");
      setText("sb-ph", "366 psig");
      setText("sb-sct", "SCT 110°F");
      setText("sb-ll", "LL 88°F");
      setText("g-sc", "22.0");
      setText("sb-sc", "22.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD in seat — not a dirty-coil call. Liquid is stacked ahead of the plug.");
      setText("sb-call", "Name it off the glass: 28 SH / 22 SC. High SH + high SC = restriction. Feel the drier outlet. Do not add gas.");
      setText("sb-shsc-formula", "RUNNING — restriction fingerprint. SH 28 (high) · SC 22 (high). Do not add gas.");
    }
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
  var TIP = {
    healthy: "Healthy circuit: start compressor, then read live SH/SC. Standing P is not a diagnosis.",
    leak: "Leak / undercharge: high SH, low SC — find the leak. Never top off.",
    "dirty-odu": "Dirty condenser: high head, SC about normal — wash the coil. Do not recover.",
    "dirty-idu": "Dirty ID / low airflow: near-zero SH with ice — airflow first, do not add gas.",
    drier: "Restriction: high SH and high SC — find the starve. Do not add gas.",
    overcharge: "Overcharge: low SH, high SC — recover to nameplate.",
    "od-fan": "Dead OD fan: high head climbing — prove the fan before you jump HPC.",
    air: "Air/noncondensables: high head AND high SC — recover, evacuate, weigh in.",
    "txv-bulb": "TXV strap off: hunting / starve — strap the bulb to the suction line."
  };
  function syncTip() {
    var tip = document.getElementById("sb-phone-tip");
    if (!tip) return;
    if (/Seat COMP/.test(tip.textContent || "")) return;
    var chip = document.querySelector("#screen-sandbox [data-fault].primary, #sandbox-root [data-fault].primary, [data-fault].btn.primary");
    var fid = (chip && chip.getAttribute("data-fault")) || "";
    var line = TIP[fid] || "Ticket SH uses dew point; SC uses start of boiling. Do not chase standing P.";
    if (tip.getAttribute("data-lt-teach") !== fid || tip.textContent !== line) {
      tip.setAttribute("data-lt-teach", fid);
      tip.textContent = line;
    }
  }
  function tick() {
    var fp = mount();
    var shEl = document.getElementById("g-sh");
    var scEl = document.getElementById("g-sc");
    var tgt = document.getElementById("g-tgt");
    if (!fp || !shEl || !scEl) return;
    var faultEl = document.getElementById("sb-fault");
    var fault = faultEl ? faultEl.textContent : "";
    paintSplit(fault);
    syncTip();
    var sh = num(shEl);
    var sc = num(scEl);
    if (isNaN(sh) || isNaN(sc)) {
      var kIdle = kind(fault);
      if (kIdle === "fan" || kIdle === "dirty") return;
      var idle = "HUB: plant clear. Equalized pressure is not a reading. Start the compressor, then call SH/SC. Do not recover off a standing gauge.";
      if (fp.textContent !== idle) fp.textContent = idle;
      return;
    }
    var tgtSH = 10, tgtSC = 10;
    if (tgt && tgt.textContent) {
      var parts = String(tgt.textContent).split("/");
      if (parts.length >= 2) {
        tgtSH = parseFloat(parts[0]) || tgtSH;
        tgtSC = parseFloat(parts[1]) || tgtSC;
      }
    }
    var head = num(document.getElementById("g-phigh"));
    var line = classify(sh, sc, tgtSH, tgtSC, head, fault);
    if (!line) return;
    if (fp.textContent !== line) fp.textContent = line;
  }
  setInterval(tick, 400);
  var watch = new MutationObserver(function () { tick(); });
  function arm() {
    var n = document.getElementById("g-phigh") || document.getElementById("sb-fault");
    if (!n || n.getAttribute("data-fp-arm")) return;
    n.setAttribute("data-fp-arm", "1");
    watch.observe(n, { childList: true, characterData: true, subtree: true });
  }
  setInterval(arm, 1000);
  arm();
})();
