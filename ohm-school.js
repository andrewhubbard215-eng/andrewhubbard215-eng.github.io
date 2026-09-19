/* Ohm school — shorted coil / winding checks. Lockout. Does not replace land-lugs. */
(function () {
  "use strict";
  var STEPS = [
    {
      label: "1  -  Lockout first",
      ask: "Before you ohm a contactor coil or compressor winding, what do you do?",
      good: "Kill power, lock/tag, prove dead with a voltmeter on a known live then on the circuit.",
      bad: "Ohm it live — the reading is more honest under voltage.",
      whyWrong: "Ohms on a live circuit cooks the meter and can flash. Lock it out."
    },
    {
      label: "2  -  Coil open vs short",
      ask: "Contactor coil reads OL (open) coil-to-coil. What does that mean?",
      good: "Open coil winding — contactor will never pull in. Replace the contactor.",
      bad: "Normal — coils read infinite when healthy.",
      whyWrong: "A good coil is a low resistance (often tens of ohms), not OL."
    },
    {
      label: "3  -  Shorted coil",
      ask: "Contactor coil reads near 0 Ω coil-to-coil and the 3A control fuse keeps blowing. Likely?",
      good: "Shorted coil (or shorted 24V load). Isolate the coil, confirm low ohms, replace the bad load, then the fuse.",
      bad: "Weak transformer — just turn the thermostat up.",
      whyWrong: "A shorted coil is a dead short across 24V. It will eat fuses until you isolate it."
    },
    {
      label: "4  -  Winding to ground",
      ask: "Compressor C to ground (chassis) reads a few ohms. Power is locked out. Call?",
      good: "Grounded winding — compressor is toast. Do not keep resetting the fuse.",
      bad: "Normal oil film — run it and see if amps settle.",
      whyWrong: "Winding-to-ground continuity means the motor is grounded. Replace the compressor (or condensing unit)."
    },
    {
      label: "5  -  Unguided",
      ask: "No-cool. Fuse on the board keeps opening. Contactor coil ohms ~2 Ω (spec ~40 Ω). R–C open-circuit 24V. What's the fix path?",
      good: "Shorted coil. Replace contactor, prove coil ohms, then replace fuse and re-energize.",
      bad: "Add charge — low suction always blows control fuses.",
      whyWrong: "Charge does not short a coil. Prove the 24V loads with ohms after lockout."
    }
  ];

  function mount() {
    var host = document.getElementById("ohm-root");
    if (!host) return;
    var pi = 0, score = 0, tried = 0, why = "", guided = true;
    function close() {
      try {
        document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
        var hub = document.getElementById("screen-hub");
        if (hub) hub.classList.add("active");
        if (typeof window.ltGoHub === "function") window.ltGoHub();
        else if (typeof window.ltPlay === "function") window.ltPlay("hub");
      } catch (_) {}
    }
    function draw() {
      var step = STEPS[pi % STEPS.length];
      host.innerHTML =
        '<header class="sb-toolbar"><strong>Ohm school</strong>' +
        '<span class="muted"> Shorted coil  -  windings  -  lockout</span>' +
        '<button type="button" class="btn" id="ohm-close" style="margin-left:auto">Shop floor</button></header>' +
        '<p class="eyebrow">' + (guided && pi < 4 ? "Guided" : "Unguided") + "  -  " + step.label + "</p>" +
        "<p>" + step.ask + "</p>" +
        '<div class="el-locker-opts">' +
        (Math.random() < 0.5
          ? '<button type="button" class="btn ohm-opt" data-ok="1">' + step.good + "</button>" +
            '<button type="button" class="btn ohm-opt" data-ok="0">' + step.bad + "</button>"
          : '<button type="button" class="btn ohm-opt" data-ok="0">' + step.bad + "</button>" +
            '<button type="button" class="btn ohm-opt" data-ok="1">' + step.good + "</button>") +
        "</div>" +
        "<p class='hub-chip' style='margin-top:12px'>" + (why || "Lockout. Prove dead. Then ohm.") + "</p>" +
        "<p class='muted'>Score " + score + "/" + tried + "</p>";
      host.querySelector("#ohm-close").onclick = close;
      host.querySelectorAll(".ohm-opt").forEach(function (b) {
        b.onclick = function () {
          tried += 1;
          var ok = b.getAttribute("data-ok") === "1";
          if (ok) score += 1;
          why = ok ? "RIGHT — " + step.good : "WRONG — " + step.whyWrong + " Right path: " + step.good;
          pi += 1;
          if (pi >= 4) guided = false;
          draw();
        };
      });
    }
    draw();
  }

  function open() {
    var screen = document.getElementById("screen-ohm");
    if (!screen) {
      screen = document.createElement("section");
      screen.id = "screen-ohm";
      screen.className = "screen";
      screen.innerHTML = '<div id="ohm-root"></div>';
      (document.getElementById("app") || document.body).appendChild(screen);
    }
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    screen.classList.add("active");
    mount();
  }

  window.OhmSchool = { open: open, start: open };

  function injectCard() {
    var grid = document.getElementById("hub-options");
    if (!grid || grid.querySelector('[data-mode="ohm"]')) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mode-card";
    btn.setAttribute("data-mode", "ohm");
    btn.innerHTML = "<h3>Ohm school</h3><p>Shorted coil  -  windings  -  lockout first</p>";
    btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
    var after = grid.querySelector('[data-mode="voltmeter"]') || grid.querySelector('[data-mode="electrical"]');
    if (after && after.nextSibling) grid.insertBefore(btn, after.nextSibling);
    else grid.appendChild(btn);
  }
  setInterval(injectCard, 800);
  document.addEventListener("DOMContentLoaded", injectCard);
})();
