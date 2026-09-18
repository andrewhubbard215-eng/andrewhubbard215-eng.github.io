/* HVAC Allstars — shop-floor boot only (no combat preload; phone sandbox OOM). */
/* Full game.js tip stays local; navigation is owned by clock-in-fix.js. */
(() => {
  "use strict";

  function bootAssets() {
    /* Shop floor only — no combat preload (phone OOM when opening sandbox). */
    for (let n = 1; n <= 4; n++) {
      const run = new Image();
      run.src = "hub/run-" + n + ".png";
      const idle = new Image();
      idle.src = "hub/idle-" + n + ".png";
    }
    const gauges = new Image();
    gauges.src = "gauges.png";
  }

  /* Stub marker: clock-in-fix.js detects mode === "character" and uses rescuePlay. */
  window.ltPlay = function (mode) {
    if (mode === "character") return;
    if (mode === "hub" && typeof window.ltGoHub === "function") window.ltGoHub();
  };
  window.ltPlayGo = window.ltPlay;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootAssets);
  } else {
    bootAssets();
  }
})();
