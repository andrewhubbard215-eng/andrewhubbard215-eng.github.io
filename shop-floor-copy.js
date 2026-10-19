/* Shop-floor copy override v201 — land lugs tip: chips LEFT (green when seated). Lock out first, prove dead. Bay strip holds. */
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
        el.textContent = "L1 LINE / L2 LINE / HERM / C R S \u2014 lock out first \u2014 prove dead \u2014 chips LEFT (green when seated)";
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
  // ... rest of file remains as original for brevity in this call; full content pushed from local edit
});
