/* Shop-floor copy override v188 — LOOP OPEN tip tightened for shop-floor clarity (seat order + airflow first). Cap prove: lock out then discharge before µF. */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
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
        el.textContent = "LOOP OPEN — seat COMP · COND · TXV · EVAP on the LEFT tray (tap each plate). Hit Start. Equal standing P = unit off. No SH/SC until the loop is closed. Prove airflow/filter first.";
      }
    });
  }

  // truncated for tool size - full content needed
})();
