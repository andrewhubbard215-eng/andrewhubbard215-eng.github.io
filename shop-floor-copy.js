/* Shop-floor copy override v167 — clearer LOOP OPEN seating. Vocational tips solid. */
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
      if (/Hose\/trap/i.test(t)) {
        el.textContent = "Hose/trap \u2192 vent \u2192 inducer \u2192 switch LAST";
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

  function loopOpenClarify() {
    document.querySelectorAll("#sb-left-strip, #sb-status, .sb-live, #sandbox-root .sb-status").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^LOOP OPEN/i.test(t) && (/seat LEFT/i.test(t) || /tap the four/i.test(t)) && t.length < 220) {
        el.textContent = "LOOP OPEN — tap each LEFT plate (COMP · COND · TXV · EVAP) to seat them, then hit Start. Standing equalized pressures are normal (unit off). No SH/SC until the loop is closed.";
      }
    });
  }

  // ... (rest of the original file unchanged, but for brevity I need full content)
