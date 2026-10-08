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
  function iduLine() {
    return "HUB: dirty indoor / low airflow. 1 SH / 10 SC, suction 68, coil is a popsicle. SC in band — not the overcharge 3/20. Filter, blower, coil. Do not add gas.";
  }
  function weakLine() {
    return "HUB: weak compressor. 26 SH / 10 SC, head 248, suction 155, amps 4.2. SC in band — not the leak 28/2. Compressor cannot pull suction down or build head. Valves or compressor. Do not add gas.";
  }
  function mildLine() {
    return "HUB: mild day / low load. 11 SH / 10 SC, head 278, suction 138, amps 8.1. OD 70. Cond TD in seat. Soft head is the weather, not weak valves. Weak comp is 26 SH / 248 head / 4.2 A. Do not add gas. Do not condemn the compressor.";
  }
  function pistonLine() {
    return "HUB: piston / fixed orifice on a 75° day. Chart target is 18 SH, not TXV 10. Glass reads 18 SH / 10 SC, suction 143, head 295, amps 8.0. SC is the check. Do not add gas to hit 10.";
  }
  function leakLine() {
    return "HUB: high SH + low SC = starved. Leak or undercharge — recover, find it, weigh-in. Don't top off.";
  }
  function restrictLine() {
    return "HUB: high SH + high SC = restriction / plugged drier. Cold at the drier outlet. Do not add gas.";
  }
  function txvLine() {
    return "HUB: high SH, SC in band. Not a restriction — that stacks liquid and SC. Bulb is off the suction line. Strap it. Do not add gas.";
  }
  function airLine() {
    return "HUB: air / noncondensables. 12 SH / 22 SC, head 530. SH in band — not the overcharge 3/20. Glass stays clear, not bubbles. Discharge line too hot to hold. Recover, evacuate, weigh in. Do not wash the coil. Do not add gas.";
  }
  function kind(fault) {
    var f = fault || "";
    if (/noncondensable|air in the circuit/i.test(f)) return "air";
    if (/iced evaporator|dirty id|dirty filter|low airflow|dirty indoor/i.test(f)) return "idu";
    if (/fan dead|od fan|condenser fan/i.test(f)) return "fan";
    if (/dirty condenser|dirty od|rooftop/i.test(f)) return "dirty";
    if (/txv|bulb|strap/i.test(f)) return "txv";
    if (/overcharge/i.test(f)) return "over";
    if (/restrict|drier|plugged/i.test(f)) return "restrict";
    if (/piston chart|fixed orifice|piston 75/i.test(f)) return "piston";
    if (/mild day|low load|light load/i.test(f)) return "mild";
    if (/weak compressor|weak valves|worn compressor/i.test(f)) return "weak";
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
    if (k === "piston") return pistonLine();
    if (k === "mild") return mildLine();
    if (k === "weak") return weakLine();
    if (k === "leak" && hiSH && loSC) return leakLine();
    if (k === "restrict" && hiSH && hiSC) return restrictLine();
    if (k === "txv" && hiSH && !hiSC) return txvLine();
    if (k === "air") return airLine();
    if (k === "idu") return iduLine();
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
    } else if (k === "idu") {
      if (tripped) return;
      setText("g-plow", "68 psig");
      setText("sb-ps", "68 psig");
      setText("sb-sst", "SST 20°F");
      setText("sb-sl", "SL 21°F");
      setText("g-sh", "1.0");
      setText("sb-sh", "1.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 55° (ID−SST) · seat 15–20° — blown. Return is warm, coil is a popsicle. Airflow, not charge.");
      setText("g-phigh", "320 psig");
      setText("sb-ph", "320 psig");
      setText("sb-sct", "SCT 102°F");
      setText("sb-ll", "LL 92°F");
      setText("g-sc", "10.0");
      setText("sb-sc", "10.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD in seat — not a dirty outdoor coil. Head is not the story.");
      setText("sb-call", "Name it off the glass: 1 SH / 10 SC. Near-zero SH + SC in band + ice = dirty ID / low airflow. Overcharge is 3 SH / 20 SC. Filter, blower, coil. Do not add gas.");
      setText("sb-shsc-formula", "RUNNING — dirty ID fingerprint. SH 1 (near zero) · SC 10 (in band). Ice call. Do not add gas.");
    } else if (k === "piston") {
      if (tripped) return;
      setText("g-plow", "143 psig");
      setText("sb-ps", "143 psig");
      setText("sb-sst", "SST 50°F");
      setText("sb-sl", "SL 68°F");
      setText("g-sh", "18.0");
      setText("sb-sh", "18.0 °F SH (piston chart 18 — not TXV 10)");
      setText("sb-etd", "Evap TD 25° (ID−SST). Piston runs a hotter suction line than a TXV. Not a leak.");
      setText("g-phigh", "295 psig");
      setText("sb-ph", "295 psig");
      setText("sb-sct", "SCT 95°F");
      setText("sb-ll", "LL 85°F");
      setText("g-sc", "10.0");
      setText("sb-sc", "10.0 °F SC (check only — do not charge by SC)");
      setText("sb-ctd", "Cond TD 20° (SCT−OD) · seat 15–25 on a 75° day. Head is the weather.");
      setText("g-amps", "8.0 A");
      setText("sb-amps", "8.0 A — nameplate neighborhood. Not the weak-comp 4.2 A.");
      setText("sb-call", "Name it off the chart: 18 SH / 10 SC on a 75° day, WB 63. Piston target is 18, not TXV 10. SC in band is the check. Do not add gas to hit 10.");
      setText("sb-shsc-formula", "RUNNING — piston chart 75°F. SH 18 (chart) · SC 10 (check) · head 295 · OD 75. Not a TXV. Do not add gas.");
    } else if (k === "mild") {
      if (tripped) return;
      setText("g-plow", "138 psig");
      setText("sb-ps", "138 psig");
      setText("sb-sst", "SST 48°F");
      setText("sb-sl", "SL 59°F");
      setText("g-sh", "11.0");
      setText("sb-sh", "11.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 17° (ID−SST) · seat 15–20° — in seat. Coil is fed. Load is light, not flooded.");
      setText("g-phigh", "278 psig");
      setText("sb-ph", "278 psig");
      setText("sb-sct", "SCT 90°F");
      setText("sb-ll", "LL 80°F");
      setText("g-sc", "10.0");
      setText("sb-sc", "10.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD 20° (SCT−OD) · seat 20–30° — in seat. OD is 70, not 95. Soft head is the day.");
      setText("g-amps", "8.1 A");
      setText("sb-amps", "8.1 A — in the nameplate neighborhood. Not the weak-comp 4.2 A.");
      setText("sb-call", "Name it off the glass: 11 SH / 10 SC. Head 278 on a 70° day, suction 138, amps 8.1. SH and SC in band, cond TD in seat. Soft head is low load / mild day — not a weak compressor. Do not add gas. Do not condemn the compressor.");
      setText("sb-shsc-formula", "RUNNING — mild day / low load. SH 11 (in band) · SC 10 (in band) · head 278 · OD 70 · amps 8.1. Not weak comp.");
    } else if (k === "weak") {
      if (tripped) return;
      setText("g-plow", "155 psig");
      setText("sb-ps", "155 psig");
      setText("sb-sst", "SST 54°F");
      setText("sb-sl", "SL 80°F");
      setText("g-sh", "26.0");
      setText("sb-sh", "26.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 21° (ID−SST) · seat 15–20° — high. Coil is not flooded. Compressor is not pulling the suction down.");
      setText("g-phigh", "248 psig");
      setText("sb-ph", "248 psig");
      setText("sb-sct", "SCT 84°F");
      setText("sb-ll", "LL 74°F");
      setText("g-sc", "10.0");
      setText("sb-sc", "10.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD low — head never built. Not a dirty-coil call. Not a leak — SC is in band.");
      setText("g-amps", "4.2 A");
      setText("sb-amps", "4.2 A — low. Nameplate is not this. Weak valves or compressor.");
      setText("sb-call", "Name it off the glass: 26 SH / 10 SC. Head 248, suction 155, amps 4.2. High SH + SC in band + low head = weak compressor. Leak is 28 SH / 2 SC and suction pulled down. Do not add gas.");
      setText("sb-shsc-formula", "RUNNING — weak compressor fingerprint. SH 26 (high) · SC 10 (in band) · head 248 · amps 4.2. Do not add gas.");
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
    } else if (k === "txv") {
      if (tripped) return;
      setText("g-plow", "118 psig");
      setText("sb-ps", "118 psig");
      setText("sb-sst", "SST 40°F");
      setText("sb-sl", "SL 68°F");
      setText("g-sh", "28.0");
      setText("sb-sh", "28.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 35° (ID−SST) · seat 15–20° — high. Coil starved. Bulb is not on the suction line.");
      setText("g-phigh", "418 psig");
      setText("sb-ph", "418 psig");
      setText("sb-sct", "SCT 116°F");
      setText("sb-ll", "LL 106°F");
      setText("g-sc", "10.0");
      setText("sb-sc", "10.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD in seat — not a dirty-coil call. SC in band — not a restriction.");
      setText("sb-call", "Name it off the glass: 28 SH / 10 SC. High SH + SC in band = TXV strap, not a plugged drier. Strap the bulb. Do not add gas.");
      setText("sb-shsc-formula", "RUNNING — TXV strap. SH 28 (high) · SC 10 (in band). Restriction would stack SC. Strap the bulb.");
    } else if (k === "air") {
      if (tripped) return;
      setText("g-plow", "118 psig");
      setText("sb-ps", "118 psig");
      setText("sb-sst", "SST 40°F");
      setText("sb-sl", "SL 52°F");
      setText("g-sh", "12.0");
      setText("sb-sh", "12.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD in seat. Coil is fed. This is not a starve and not a flood.");
      setText("g-phigh", "530 psig");
      setText("sb-ph", "530 psig");
      setText("sb-sct", "SCT 140°F");
      setText("sb-ll", "LL 118°F");
      setText("g-sc", "22.0");
      setText("sb-sc", "22.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Head 530. Cond TD looks high because air is sitting in the condenser — not a dirty-coil call. Discharge line too hot to hold.");
      setText("sb-call", "Name it off the glass: 12 SH / 22 SC. SH in band + high SC + clear glass = noncondensables. Overcharge is 3 SH / 20 SC. Recover, evacuate, weigh in. Do not add gas.");
      setText("sb-shsc-formula", "RUNNING — noncondensable fingerprint. SH 12 (in band) · SC 22 (high) · head 530. Clear glass. Not the overcharge 3/20.");
    } else if (k === "over") {
      if (tripped) return;
      setText("g-plow", "148 psig");
      setText("sb-ps", "148 psig");
      setText("sb-sst", "SST 48°F");
      setText("sb-sl", "SL 51°F");
      setText("g-sh", "3.0");
      setText("sb-sh", "3.0 °F SH (seat 8–14)");
      setText("sb-etd", "Evap TD 27° (ID−SST) · seat 15–20° — low. Coil is flooded. SC is high, so this is extra gas, not a dirty filter.");
      setText("g-phigh", "455 psig");
      setText("sb-ph", "455 psig");
      setText("sb-sct", "SCT 124°F");
      setText("sb-ll", "LL 104°F");
      setText("g-sc", "20.0");
      setText("sb-sc", "20.0 °F SC (seat 8–14)");
      setText("sb-ctd", "Cond TD in seat — not a dirty-coil call. Extra liquid is sitting in the condenser.");
      setText("sb-call", "Name it off the glass: 3 SH / 20 SC. Low SH + high SC = overcharge. Recover to nameplate. Do not turn the TXV to hide it.");
      setText("sb-shsc-formula", "RUNNING — overcharge fingerprint. SH 3 (low) · SC 20 (high). Recover to nameplate. Do not add gas.");
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
    "txv-bulb": "TXV strap off: hunting / starve — strap the bulb to the suction line.",
    "weak-comp": "Weak compressor: high SH, low head, amps low — SC stays in band. Do not add gas.",
    mild: "Mild day / low load: SH and SC in band, head soft because OD is 70. Amps normal. Do not condemn the compressor.",
    piston: "Piston on a 75° day: chart SH is 18, not TXV 10. SC is the check. Do not add gas to hit 10."
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
  function mountMild() {
    var host = document.getElementById("sb-faults");
    if (!host || host.querySelector('[data-fault="mild"]')) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.setAttribute("data-fault", "mild");
    b.textContent = "Mild day";
    b.addEventListener("click", function () {
      host.querySelectorAll("[data-fault]").forEach(function (n) { n.classList.remove("primary"); });
      b.classList.add("primary");
      setText("sb-fault", "FAULT  -  Mild day / low load — SH/SC in band  -  head soft  -  amps normal");
    });
    host.appendChild(b);
  }
  function mountWeak() {
    var host = document.getElementById("sb-faults");
    if (!host || host.querySelector('[data-fault="weak-comp"]')) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.setAttribute("data-fault", "weak-comp");
    b.textContent = "Weak comp";
    b.addEventListener("click", function () {
      host.querySelectorAll("[data-fault]").forEach(function (n) { n.classList.remove("primary"); });
      b.classList.add("primary");
      setText("sb-fault", "FAULT  -  Weak compressor — high SH  -  low head  -  amps low");
    });
    host.appendChild(b);
  }
  function mountPiston() {
    var host = document.getElementById("sb-faults");
    if (!host || host.querySelector('[data-fault="piston"]')) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn";
    b.setAttribute("data-fault", "piston");
    b.textContent = "Piston 75";
    b.addEventListener("click", function () {
      host.querySelectorAll("[data-fault]").forEach(function (n) { n.classList.remove("primary"); });
      b.classList.add("primary");
      setText("sb-fault", "FAULT  -  Piston chart 75°F — target SH 18, not TXV 10  -  do not add gas");
      var od = document.getElementById("sb-out");
      if (od) { od.value = "75"; od.dispatchEvent(new Event("input", { bubbles: true })); od.dispatchEvent(new Event("change", { bubbles: true })); }
      window.LtMeteringKind = "piston";
      var seat = document.querySelector("[data-part='piston'], [data-field='piston']");
      if (seat) { seat.classList.add("on"); seat.setAttribute("aria-pressed", "true"); }
    });
    host.appendChild(b);
  }
  function tick() {
    mountMild();
    mountWeak();
    mountPiston();
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
