/* Shop-floor copy override v202 - restore full v200 (210680c) after e856013 stubbed it; keep only e856013 land-lugs line (chips LEFT, green when seated). */
/* Shop-floor copy override v200 (merged) - land lugs tip: lock out first, prove dead. Bay strip from 7911635: voltmeter school + ohm school no longer mislabel as saturday callback. Rest of v198 (recovery/service/seat tips) kept; 7911635 had dropped it. Strip keys off the active screen only (root nodes linger after you leave). */
/* Shop-floor copy override v198 — Recovery room: after 80% stop + machine back in tray, status shows next steps (yellow to pump, hold under 500 microns, weigh in nameplate, never vent). Prev: v196 — recovery tip WC clear after 80485cc blanked index.html, sw.js and this file (0 bytes); its recovery tip intent (stop at 80%, never vent) kept on the Recovery card. v193: scrub() calls loopClosedConfirm/loopClosedOnce/serviceCallTip again (v192 dropped the calls, so its own service tip never ran). v192: tighter service call tip (airflow before charge, meter first, no jump float). Seat tip holds. Cap prove holds. */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W \u00b7 inducer \u00b7 PS \u00b7 ignitor \u00b7 valve \u00b7 flame \u00b7 blower";
      }
      if (/Plywood/i.test(t) && /catalog/i.test(t) && /filer/i.test(t)) {
        el.textContent = "Plywood wall \u00b7 shop catalog \u00b7 90-min filler";
      }
      if (/L1 LINE/i.test(t) && /chips LEFT/i.test(t)) {
        el.textContent = "L1 LINE / L2 LINE / HERM / C R S — LOTO first — prove dead — chips LEFT (green when seated)";
      }
      if (/Cap prove|\u00b5F vs can/i.test(t)) {
        if (t.length < 140) el.textContent = "Lock out \u2192 discharge \u2192 \u00b5F vs can \u00b16% \u2192 no hard-start";
      }
      if (/Saturday callback/i.test(t) || /no-cool sheet/i.test(t)) {
        if (t.length < 140) el.textContent = "No-cool sheet - meter first - isolate the open - don't jump the float";
      }
      if (/service calls/i.test(t) || /hook gauges/i.test(t) || /SH\/SC/i.test(t)) {
        if (t.length < 120) el.textContent = "Hook gauges - read SH/SC - airflow before charge - meter first";
      }
      if (/recovery/i.test(t) && /scale/i.test(t)) {
        if (t.length < 140) el.textContent = "Drag hoses \u00b7 scale is proof \u00b7 stop at 80% WC \u00b7 never vent \u00b7 0 psi \u2260 vacuum. Yellow to pump, hold <500 \u00b5.";
      }
    });
  }
  
  function psProveTip() {
    document.querySelectorAll(".mode-card p, .tile p").forEach(function (el) {
      var t = el.textContent || "";
      if (/Hose\/trap/i.test(t) && /switch LAST/i.test(t)) {
        el.textContent = "Hose/trap \u2192 vent \u2192 inducer spin \u2192 24V across PS \u2192 switch LAST";
      }
    });
  }

  function floatProveTip() {
    document.querySelectorAll(".mode-card p, .tile p").forEach(function (el) {
      var t = el.textContent || "";
      if (/Float prove|float \u2192 coil/i.test(t) && t.length < 150) {
        el.textContent = "Call \u2192 240 \u2192 R\u2013C \u2192 Y \u2192 HPC \u2192 LPC \u2192 float \u2192 coil. Drain first \u2014 do not jump.";
      }
    });
  }

  function boardCodeLaw() {
    document.querySelectorAll(".mode-card p, .tile p").forEach(function (el) {
      var t = el.textContent || "";
      if (/Board-code|door sticker|Carrier.*Trane/i.test(t)) {
        el.textContent = "Door sticker is law \u2014 Carrier 2-digit, Trane flashes, mini-split letters. Never invent OEM codes.";
      }
    });
  }

  function loopOpenClarify() {
    document.querySelectorAll("#sb-left-strip, #sb-status, .sb-live, #sandbox-root .sb-status").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^LOOP OPEN/i.test(t) && (/seat LEFT/i.test(t) || /tap the four/i.test(t)) && t.length < 220) {
        el.textContent = "LOOP OPEN \u2014 seat COMP \u00b7 COND \u00b7 TXV \u00b7 EVAP on the LEFT tray (tap each plate). Hit Start. Equal standing P = unit off. No SH/SC until the loop is closed. Prove airflow/filter first.";
      }
    });
  }

  function seatTipClear() {
    document.querySelectorAll("#sb-phone-tip, .sb-seat-tip, #sandbox-root .sb-seat-tip, #sb-ts, #sb-ts li, #sb-ts p, #sb-ts strong").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/Seat COMP COND TXV EVAP/i.test(t) || /^Seat the four/i.test(t) || /Seat the four parts LEFT/i.test(t) || /Seat all four/i.test(t) || /^Seat COMP/i.test(t)) {
        el.textContent = "Seat COMP \u00b7 COND \u00b7 TXV \u00b7 EVAP LEFT. Tap Start. Standing P = off \u2014 leave the scale. Filter first. No SH/SC till closed.";
      }
    });
  }
  function faultChipFit() {
    document.querySelectorAll("#screen-sandbox button, .sb-fault-chip, [data-fault]").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^TXV bulb$/i.test(t)) el.textContent = "TXV strap";
      if (/^Air in system$/i.test(t)) el.textContent = "Noncondensable";
    });
  }
  function lockerCard() {
    var cash = document.getElementById("hub-cash");
    var jobs = document.getElementById("hub-jobs");
    var xp = document.getElementById("hub-xp");
    if (cash) {
      var raw = cash.textContent || "";
      if (/\$/.test(raw) || /coin|cash/i.test(raw)) {
        var n = raw.replace(/[^0-9]/g, "") || "0";
        cash.textContent = n + " sheets";
      }
    }
    if (jobs && /jobs/i.test(jobs.textContent || "")) {
      jobs.textContent = (jobs.textContent || "").replace(/jobs/ig, "calls");
    }
    if (xp) {
      var xt = xp.textContent || "";
      if (/XP/i.test(xt)) xt = xt.replace(/XP/ig, "hours");
      var m = xt.match(/(\d+)\s*hours?/i);
      if (m) {
        var n = parseInt(m[1], 10);
        xt = n + (n === 1 ? " hour" : " hours");
      }
      xp.textContent = xt;
    }
  }
  function screenOn(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.classList.contains("active") || el.classList.contains("screen-on")) return true;
    if (el.offsetParent) return true;
    return false;
  }
  function appVer() {
    var m = document.querySelector('meta[name="lt-app-ver"]');
    return (m && m.content) || window.LT_APP_VER || "v3.5.526";
  }
  function bayStrip() {
    var strip = document.querySelector(".version-strip");
    if (!strip) return;
    var bay = "shop floor";
    var tabSat = document.querySelector(".el-tab.active, .sat-tab.active, [data-el-tab].active");
    var tabTxt = ((tabSat && tabSat.textContent) || "").toLowerCase();
    var lite = document.querySelector(".el-lite-head, .el-lite-panel h2");
    var liteTxt = ((lite && lite.textContent) || "").toLowerCase();
    var root = document.getElementById("electrical-root");
    var lines = ((root && root.innerText) || "").split("\n").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    var title = "";
    for (var i = 0; i < lines.length && i < 8; i++) {
      if (/saturday|callback|no-cool|land lugs|l1 line|follow the call|ladder/.test(lines[i])) { title = lines[i]; break; }
    }
    function screenOn(id) {
      var el = document.getElementById(id);
      if (!el) return false;
      if (el.classList.contains("active") || el.classList.contains("screen-on")) return true;
      if (el.offsetParent) return true;
      return false;
    }
    function appVer() {
      var m = document.querySelector('meta[name="lt-app-ver"]');
      return (m && m.content) || window.LT_APP_VER || "v3.5.594";
    }
    if (screenOn("screen-voltmeter")) bay = "voltmeter school";
    else if (screenOn("screen-ohm")) bay = "ohm school";
    else if (screenOn("screen-electrical")) {
      if (/saturday|callback|no-cool/.test(title) || /saturday|callback/.test(tabTxt) || /saturday|callback|no-cool/.test(liteTxt) || document.querySelector(".sat-sheet, #sat-root, [data-mode='defusal'].active"))
        bay = "saturday callback";
      else if (/land lugs|l1 line/.test(title) || /lug|land/.test(tabTxt) || /land lugs|l1 line/.test(liteTxt)) bay = "land lugs";
      else bay = "ladder";
    } else if (screenOn("screen-sandbox")) bay = "sandbox";
    else if (screenOn("screen-quiz")) bay = "exam";
    else if (screenOn("screen-minisplit")) bay = "mini-split";
    else if (screenOn("screen-service")) bay = "service calls";
    else if (screenOn("screen-truck-pouch")) bay = "on the job";
    strip.textContent = "HVAC Allstars - " + appVer() + " - " + bay;
  }
  function partsLeftCompressorBtn() {}
  function lockChargeUntilSeated() {}
  function standingNotDiagnosis() {
    document.querySelectorAll("#sb-status, .sb-status, [id*=status]").forEach(function (el) {
      var t = el.textContent || "";
      if (/Standing pressures/i.test(t) || (/Standing P/i.test(t) && /seat/i.test(t)) || /not a diagnosis/i.test(t) || /not a charge ticket/i.test(t)) {
        el.textContent = "Standing P is not a charge ticket. Both gauges equal = unit off. Refrigerant migrates to the colder coil. Seat the four LEFT, start the compressor, wait for stable SH/SC before you weigh or recover any gas. Do not recover standing gas. Lock out tag out before any 240 probe. Prove 24V at the contactor coil first (Y to C). No 24V = control side; 24V and no pull-in = bad coil. Meter first \u2014 do not shotgun. Do not jump the contactor. Airflow before charge. Prove filter first, then indoor coil, outdoor coil, and ducts before the scale. Nameplate is the target. Do not guess the charge. SH = suction line T \u2212 dew point at suction P. Read the P/T chart: suction P gives the dew point. SC = start of boiling \u2212 liquid line T. TXV: charge by SC 8\u201314\u00b0. Piston: charge by SH ~10\u00b0. High head + high SC = air/noncondensables. Low head + low SC = undercharge. Low suction + high SH = undercharge or airflow (prove filter first). High suction + low SH = overcharge or low load (prove airflow and load first). High head + low SC = overcharge (recover to target). Low head + high SC = restriction (filter-drier or TXV \u2014 prove airflow first). Dirty ID coil or low airflow: low suction, low SH can flood back, coil may ice. Check filter and blower first \u2014 clamp amp the blower. Do not add gas. Float open = full pan. Drain first \u2014 do not jump the switch. TS sheet: Standing first \u2014 unit off, equalized P only.";
      }
    });
  }
  function killEqualizedWhileRunning() {
    document.querySelectorAll("#sb-status, .sb-status").forEach(function (el) {
      var t = el.textContent || "";
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t)) {
        var btn = document.getElementById("sb-run");
        if (btn && /Stop compressor/i.test(btn.textContent || "")) {
          el.textContent = "Running. Read SH/SC after stable. Do not recover on equalized numbers.";
        }
      }
    });
  }
  function scrapeDeg(label) {
    var el = document.getElementById(label === "SH" ? "sb-sh" : "sb-sc");
    if (!el) return null;
    var m = (el.textContent || "").match(/([\d.]+)/);
    return m ? m[1] : null;
  }
  function meteringKind() {
    var mk = String(window.LtMeteringKind || "").toLowerCase();
    if (mk === "piston" || mk === "eev" || mk === "txv") return mk;
    var seat = document.querySelector('#sandbox-root [data-part="metering"]');
    if (seat && seat.textContent) {
      var st = seat.textContent.toLowerCase();
      if (/piston|orifice/.test(st)) return "piston";
      if (/eev|electronic/.test(st)) return "eev";
      if (/txv/.test(st)) return "txv";
    }
    var t = (document.body.innerText || "").toLowerCase();
    if (/piston|orifice|fixed/.test(t)) return "piston";
    if (/eev|electronic/.test(t)) return "eev";
    return "txv";
  }
  function pistonTarget() { return "10"; }
  function paintSeat(id, note) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = el.textContent || "";
    if (!/\d/.test(t) || /off \(no/i.test(t)) return;
    var next = /\(/.test(t) ? t.replace(/\([^)]*\)/, "(" + note + ")") : t + "  (" + note + ")";
    if (next !== t) el.textContent = next;
  }
  function liveShScRail() {
    var btn = document.getElementById("sb-run");
    var st = document.getElementById("sb-status");
    if (!btn || !st) return;
    if (!/Stop compressor/i.test(btn.textContent || "")) return;
    var sh = scrapeDeg("SH");
    var sc = scrapeDeg("SC");
    if (!sh || !sc) return;
    var fEl = document.getElementById("sb-fault");
    var fk = fEl && window.LtFaultKind ? window.LtFaultKind(fEl.textContent || "") : "";
    var FL = fk && window.LtFaultLabels ? window.LtFaultLabels[fk] : null;
    if (FL) {
      if (st.textContent !== FL.status) st.textContent = FL.status;
      return;
    }
    var kind = meteringKind();
    var line;
    if (kind === "piston") {
      var tgt = pistonTarget();
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC (piston target SH " + tgt + "\u00b0). Charge by blue SH. Red SC is the check. Do not charge by SC. Weigh to nameplate after airflow is proved.";
      paintSeat("sb-sh", "target " + tgt + "\u00b0 SH");
      paintSeat("sb-sc", "check only");
    } else if (kind === "eev") {
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC. EEV: weigh-in. Hoses are checks.";
      paintSeat("sb-sh", "check only");
      paintSeat("sb-sc", "check only");
    } else {
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC (TXV seats 8\u201314). Charge by red SC. Blue SH is the check.";
      paintSeat("sb-sh", "seat 8\u201314");
      paintSeat("sb-sc", "seat 8\u201314");
      var shn = Number(sh), scn = Number(sc);
      if (shn >= 8 && shn <= 14 && scn >= 8 && scn <= 14) {
        line += " Good seat. Nameplate is the target charge. Weigh only after airflow is proved. Do not guess. Confirm outdoor ambient and indoor return. Filter first \u2014 dirty filter fakes low charge. Then indoor coil, outdoor coil, ducts. Leave the scale alone. Airflow before charge. Before you condemn a compressor, probe RLA with a clamp meter. Do not shotgun the contactor.";
        paintSeat("sb-sh", "good seat");
        paintSeat("sb-sc", "good seat");
      } else if (shn > 14 && scn < 8) {
        line += " High blue SH, low red SC \u2014 undercharge. Confirm airflow first. Locate and repair the leak. Then weigh to nameplate. Do not top off.";
        paintSeat("sb-sh", "high \u2014 undercharge");
        paintSeat("sb-sc", "low");
      } else if (shn >= 8 && shn <= 14 && scn >= 16) {
        line += " High red SC, blue SH in seat \u2014 dirty outdoor coil or restricted outdoor airflow. Wash the coil. Do not recover.";
        paintSeat("sb-sc", "high \u2014 wash OD");
      } else if (shn > 14 && scn > 14) {
        line += " High blue SH, high red SC \u2014 restriction. Filter-drier first, then TXV or line set. Liquid stacked. Do not add gas.";
        paintSeat("sb-sh", "high \u2014 restriction");
        paintSeat("sb-sc", "high \u2014 liquid stacked");
      } else if (shn < 8 && scn > 14) {
        line += " Low blue SH, high red SC \u2014 overcharge. Confirm airflow and nameplate charge. Recover excess to target SC. Do not vent. Do not add gas.";
        paintSeat("sb-sh", "low \u2014 overcharge");
        paintSeat("sb-sc", "high");
      }
    }
    line = "Compressor on. " + line;
    window.__ltSeatLine = line;
    if (st.textContent !== line) st.textContent = line;
    holdSeatLine(st);
  }
  function holdSeatLine(st) {
    if (st.__ltHold) return;
    st.__ltHold = true;
    new MutationObserver(function () {
      var want = window.__ltSeatLine;
      if (!want || st.textContent === want) return;
      var run = document.getElementById("sb-run");
      if (!run || !/Stop compressor/i.test(run.textContent || "")) { window.__ltSeatLine = ""; return; }
      var fEl = document.getElementById("sb-fault");
      if (fEl && window.LtFaultKind && window.LtFaultKind(fEl.textContent || "")) return;
      if (/^Compressor on\s*[\u2013\u2014-]/i.test(st.textContent || "")) st.textContent = want;
    }).observe(st, { childList: true, characterData: true, subtree: true });
  }
  function loopClosedConfirm() {
    var need = ["compressor", "condenser", "metering", "evaporator"];
    var seated = need.filter(function (id) {
      var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
      var slot = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
      return (part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true")) ||
             (slot && (slot.classList.contains("filled") || slot.classList.contains("has") || slot.querySelector("img, strong")));
    });
    if (seated.length !== 4) return;
    var run = document.getElementById("sb-run");
    if (run && /Stop compressor/i.test(run.textContent || "")) return;
    var st = document.getElementById("sb-status");
    if (!st) return;
    var t = st.textContent || "";
    if (/LOOP OPEN|seat LEFT|Don't jump|Standing P/i.test(t) || t.length < 40) {
      st.textContent = "Loop closed. Four LEFT down. Hit Start. Wait the gauges settle. Then call SH/SC. Do not touch the scale yet. Lock out tag out before any 240 probe. Prove 24V at the contactor coil first (Y to C). No 24V = control side; 24V and no pull-in = bad coil. No-cool path: call \u2192 240 \u2192 disconnect \u2192 R\u2013C \u2192 Y \u2192 HPC \u2192 LPC \u2192 float \u2192 coil \u2192 T1 \u2192 compressor. Do not jump the contactor. Airflow before charge. Prove filter first, then coils and ducts before the scale. Nameplate is the target. Do not guess the charge. SH = suction line T \u2212 dew point at suction P. Read the P/T chart: suction P gives the dew point. SC = start of boiling \u2212 liquid line T. TXV: charge by SC 8\u201314\u00b0. Piston: charge by SH ~10\u00b0. High head + high SC = air/noncondensables. Low head + low SC = undercharge. Low suction + high SH = undercharge or airflow (prove filter first). High suction + low SH = overcharge or low load (prove airflow and load first). High head + low SC = overcharge (recover to target). Low head + high SC = restriction (filter-drier or TXV \u2014 prove airflow first). Dirty ID coil or low airflow: low suction, low SH can flood back, coil may ice. Check filter and blower first \u2014 clamp amp the blower. Do not add gas. Float open = full pan. Drain first \u2014 do not jump the switch. TS sheet: Standing first \u2014 unit off, equalized P only.";
    }
  }

  function loopClosedOnce() {
    var strip = document.getElementById("sb-left-strip");
    if (!strip) return;
    var st = document.getElementById("sb-status");
    var run = document.getElementById("sb-run");
    var on = run && /Stop compressor/i.test(run.textContent || "");
    var dup = !on && st && /^loop closed/i.test((st.textContent || "").trim()) && /^LOOP CLOSED/.test((strip.textContent || "").trim());
    var want = dup ? "none" : "";
    if (strip.style.display !== want) strip.style.display = want;
  }

  function serviceCallTip() {
    document.querySelectorAll("#svc-sheet, .svc-sheet, .no-cool-sheet, #screen-service p, .svc-prompt, .svc-rail p").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/Hook gauges/i.test(t) && (/pick the fault/i.test(t) || /SH\/SC/i.test(t))) {
        if (t.length < 180) el.textContent = "Hook gauges - read SH/SC - airflow before charge - meter first. Prove filter. Don't jump the float.";
      }
    });
  }

  var RC_NEXT = "Recovery done: yellow to vacuum pump. 0 psi is not a vacuum \u2014 pull down and hold under 500 microns (isolate, watch it hold). Then weigh in the nameplate charge on the scale. Never vent.";
  function recoveryNext() {
    var st = document.getElementById("rc-status");
    if (!st) return;
    var t = (st.textContent || "").trim();
    if (/^Machine back in the tray\. Vacuum pump is the next tool/.test(t) || /^System empty enough\. Vacuum is the separate tool now/.test(t)) st.textContent = RC_NEXT;
    if (!st.__ltRcObs && window.MutationObserver) {
      st.__ltRcObs = new MutationObserver(function () { var x = (st.textContent || "").trim(); if (x !== RC_NEXT && (/^Machine back in the tray\. Vacuum pump/.test(x) || /^System empty enough\. Vacuum is the separate/.test(x))) st.textContent = RC_NEXT; });
      st.__ltRcObs.observe(st, { childList: true, characterData: true, subtree: true });
    }
  }
  function scrub() {
    recoveryNext();
    vocationalTiles();
    psProveTip();
    floatProveTip();
    boardCodeLaw();
    loopOpenClarify();
    seatTipClear();
    faultChipFit();
    lockerCard();
    bayStrip();
    partsLeftCompressorBtn();
    lockChargeUntilSeated();
    standingNotDiagnosis();
    killEqualizedWhileRunning();
    liveShScRail();
    loopClosedConfirm();
    loopClosedOnce();
    serviceCallTip();
  }
  setInterval(scrub, 400);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
})();
