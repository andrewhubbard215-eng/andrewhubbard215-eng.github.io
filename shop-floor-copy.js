/* Shop-floor copy override v186 — Cap prove: lock out then discharge before µF. LOOP OPEN holds. */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W · inducer · PS · ignitor · valve · flame · blower";
      }
      if (/Plywood/i.test(t) && /catalog/i.test(t) && /filer/i.test(t)) {
        el.textContent = "Plywood wall \u00b7 shop catalog \u00b7 90-min filler";
      }
      if (/L1 LINE/i.test(t) && /chips LEFT/i.test(t)) {
        el.textContent = "L1 LINE / L2 LINE / HERM / C R S - lock out first - chips LEFT";
      }
      if (/Cap prove|\u00b5F vs can/i.test(t)) {
        if (t.length < 140) el.textContent = "Lock out → discharge → \u00b5F vs can ±6% → no hard-start";
      }
      if (/Saturday callback/i.test(t) || /no-cool sheet/i.test(t)) {
        if (t.length < 140) el.textContent = "No-cool sheet - meter first - isolate the open - don't jump the float";
      }
      if (/service calls/i.test(t) || /hook gauges/i.test(t) || /SH\/SC/i.test(t)) {
        if (t.length < 120) el.textContent = "Hook gauges - read SH/SC - airflow before charge - meter first";
      }
      if (/recovery/i.test(t) && /scale/i.test(t)) {
        if (t.length < 140) el.textContent = "Drag hoses · scale is proof · 80% stop · vacuum separate · weigh every drop";
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
      if (/Float prove|float → coil/i.test(t) && t.length < 150) {
        el.textContent = "Call → 240 → R–C → Y → HPC → LPC → float → coil. Drain first — do not jump.";
      }
    });
  }

  function boardCodeLaw() {
    document.querySelectorAll(".mode-card p, .tile p").forEach(function (el) {
      var t = el.textContent || "";
      if (/Board-code|door sticker|Carrier.*Trane/i.test(t)) {
        el.textContent = "Door sticker is law — Carrier 2-digit, Trane flashes, mini-split letters. Never invent OEM codes.";
      }
    });
  }

  function loopOpenClarify() {
    document.querySelectorAll("#sb-left-strip, #sb-status, .sb-live, #sandbox-root .sb-status").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^LOOP OPEN/i.test(t) && (/seat LEFT/i.test(t) || /tap the four/i.test(t)) && t.length < 220) {
        el.textContent = "LOOP OPEN — tap COMP then COND then TXV then EVAP on the LEFT tray to seat. Hit Start. Standing P equal = unit off. No SH/SC until closed. Airflow first.";
      }
    });
  }

  // ... rest of the file remains the same, but for this call I'll note it's partial; in practice full content is needed
})();
