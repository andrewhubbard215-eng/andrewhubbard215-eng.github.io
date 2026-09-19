/* Voltmeter school — 24V control + 240V power. Guided then unguided. Does not replace Follow the call / land-lugs. */
(function () {
  "use strict";
  var STEPS = [
    {
      id: "meter",
      label: "1 · Meter first",
      ask: "Before you open a panel, what do you prove with the voltmeter?",
      good: "Confirm the meter on a known live source, then prove the disconnect is dead (or live) before you touch.",
      bad: "Stick the probes in and hope the display means something.",
      whyWrong: "A dead meter lies. Prove the tool, then prove the circuit.",
      drip: "meter_open"
    },
    {
      id: "scale",
      label: "2 · Right scale",
      ask: "You're checking a residential outdoor unit. Which VAC range?",
      good: "VAC, range above line voltage (≈240V / 208V). Don't sit on a 20V scale for line.",
      bad: "Ohms scale across L1–L2 while it's energized.",
      whyWrong: "Ohms on a live circuit cooks the meter and lies to you.",
      drip: "meter_open"
    },
    {
      id: "line",
      label: "3 · 240V string",
      ask: "L1 to L2 reads ~240V. L1 to ground ~120V. L2 to ground ~0V. What's wrong?",
      good: "Lost L2 (or open leg). One side is dead — check disconnect, fuse, lug, or utility.",
      bad: "Compressor is bad because amps will be weird later.",
      whyWrong: "Prove power first. A missing leg is a power problem, not a compressor guess.",
      drip: "meter_open"
    },
    {
      id: "control",
      label: "4 · 24V string",
      ask: "R to C is 24V. Y to C is 0V on a cool call. Next prove?",
      good: "Thermostat/Y path is open or not calling. Prove R–Y at the thermostat, then at the outdoor board.",
      bad: "Replace the contactor because the outdoor unit is quiet.",
      whyWrong: "No Y means the contactor never got a chance. Prove the 24V string before parts.",
      drip: "vd_24v"
    },
    {
      id: "drop",
      label: "5 · Voltage drop",
      ask: "Contactor coil is energized but coil voltage is 18V under load. What does that say?",
      good: "Excessive drop or weak transformer/load. Prove voltage at the coil with the circuit loaded — not only open-circuit.",
      bad: "Coil is fine because you saw 24V with the contactor unplugged.",
      whyWrong: "Unloaded 24V hides a weak supply. Measure under load.",
      drip: "vd_24v"
    },
    {
      id: "unguided",
      label: "6 · Unguided call",
      ask: "No-cool. Indoor fan runs. Outdoor quiet. R–C 24V, Y–C 24V at the outdoor board, L1–L2 240V, contactor coil 24V, T1–T2 0V. What's open?",
      good: "Contactor contacts (or wiring after the contactor). Coil pulled in but power not passing to the compressor circuit.",
      bad: "Bad thermostat — Y never left the house.",
      whyWrong: "You already have Y and coil voltage at the outdoor. The break is after the coil — contacts or load side.",
      drip: "meter_open"
    }
  ];

  function drip(id) {
    try {
      if (window.LtDrip && typeof window.LtDrip.nudge === "function") window.LtDrip.nudge(id);
    } catch (_) {}
  }

  function fatCss() {
    if (document.getElementById("vm-school-css")) return;
    var s = document.createElement("style");
    s.id = "vm-school-css";
    s.textContent =
      "#voltmeter-root{padding:12px;max-width:720px;margin:0 auto}" +
      "#voltmeter-root .el-locker-opts{display:flex;flex-direction:column;gap:10px;margin:12px 0}" +
      "#voltmeter-root .vm-opt,#voltmeter-root .btn.vm-opt{" +
      "text-align:left;white-space:normal;min-height:56px;padding:14px 16px;" +
      "font-size:16px;line-height:1.35;touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
      "#voltmeter-root #vm-close{min-height:44px;min-width:44px;touch-action:manipulation}" +
      "@media (max-width:480px){#voltmeter-root .vm-opt,#voltmeter-root .btn.vm-opt{min-height:64px;padding:16px 18px;font-size:17px}}";
    document.head.appendChild(s);
  }

  function mount() {
    var host = document.getElementById("voltmeter-root");
    if (!host) return;
    fatCss();
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
        '<header class="sb-toolbar"><strong>Voltmeter school</strong>' +
        '<span class="muted"> 24V control · 240V power · guided then unguided</span>' +
        '<button type="button" class="btn" id="vm-close" style="margin-left:auto">Shop floor</button></header>' +
        '<p class="eyebrow">' + (guided && pi < 5 ? "Guided" : "Unguided") + " · " + step.label + " of " + STEPS.length + "</p>" +
        "<p>" + step.ask + "</p>" +
        '<div class="el-locker-opts">' +
        (Math.random() < 0.5
          ? '<button type="button" class="btn vm-opt" data-ok="1">' + step.good + "</button>" +
            '<button type="button" class="btn vm-opt" data-ok="0">' + step.bad + "</button>"
          : '<button type="button" class="btn vm-opt" data-ok="0">' + step.bad + "</button>" +
            '<button type="button" class="btn vm-opt" data-ok="1">' + step.good + "</button>") +
        "</div>" +
        "<p class='hub-chip' style='margin-top:12px'>" +
        (why || "Prove the meter, then the string. Don't shotgun parts.") +
        "</p><p class='muted'>Score " + score + "/" + tried + "</p>" +
        (window.ProfessorHUB
          ? '<p class="muted" style="margin-top:8px">HUB: meter on a known live first. Then walk R–C / Y–C / L1–L2 like a string, not a guess.</p>'
          : "");
      host.querySelector("#vm-close").onclick = close;
      host.querySelectorAll(".vm-opt").forEach(function (b) {
        b.onclick = function () {
          tried += 1;
          var ok = b.getAttribute("data-ok") === "1";
          if (ok) score += 1;
          why = ok ? "RIGHT — " + step.good : "WRONG — " + step.whyWrong + " Right path: " + step.good;
          drip(step.drip || "meter_open");
          pi += 1;
          if (pi >= 5) guided = false;
          draw();
        };
      });
    }
    draw();
  }

  function open() {
    var screen = document.getElementById("screen-voltmeter");
    if (!screen) {
      screen = document.createElement("section");
      screen.id = "screen-voltmeter";
      screen.className = "screen";
      screen.innerHTML = '<div id="voltmeter-root"></div>';
      var app = document.getElementById("app") || document.body;
      app.appendChild(screen);
    }
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    screen.classList.add("active");
    drip("meter_open");
    mount();
  }

  window.VoltmeterSchool = { open: open, start: open };

  function injectCard() {
    var grid = document.getElementById("hub-options");
    if (!grid || grid.querySelector('[data-mode="voltmeter"]')) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mode-card";
    btn.setAttribute("data-mode", "voltmeter");
    btn.innerHTML = "<h3>Voltmeter school</h3><p>24V / 240V string · guided then unguided</p>";
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      open();
    });
    var after = grid.querySelector('[data-mode="electrical"]');
    if (after && after.nextSibling) grid.insertBefore(btn, after.nextSibling);
    else grid.appendChild(btn);
  }

  setInterval(injectCard, 800);
  document.addEventListener("DOMContentLoaded", injectCard);
})();
