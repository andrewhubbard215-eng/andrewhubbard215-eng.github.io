/* Voltmeter school — 24V control + 240V power. Guided then unguided. Live string strip on the bay. Does not replace Follow the call / land-lugs. */
(function () {
  "use strict";
  var STEPS = [
    {
      id: "meter",
      label: "1 - Meter first",
      ask: "Before you open a panel, what do you prove with the voltmeter?",
      good: "Confirm the meter on a known live source, then prove the disconnect is dead (or live) before you touch.",
      bad: "Stick the probes in and hope the display means something.",
      whyWrong: "A dead meter lies. Prove the tool, then prove the circuit.",
      drip: "meter_open",
      face: "---",
      unit: "VAC",
      string: [
        ["Known live", "prove first"],
        ["Disconnect", "not yet"],
        ["L1–L2", "—"],
        ["R–C", "—"]
      ]
    },
    {
      id: "scale",
      label: "2 - Right scale",
      ask: "You're checking a residential outdoor unit. Which VAC range?",
      good: "VAC, range above line voltage (≈240V / 208V). Don't sit on a 20V scale for line.",
      bad: "Ohms scale across L1–L2 while it's energized.",
      whyWrong: "Ohms on a live circuit cooks the meter and lies to you.",
      drip: "meter_open",
      face: "240",
      unit: "VAC",
      string: [
        ["Scale", "VAC > line"],
        ["L1–L2", "expect ~240"],
        ["Ohms", "LOCKOUT first"],
        ["R–C", "24 later"]
      ]
    },
    {
      id: "line",
      label: "3 - 240V string",
      ask: "L1 to L2 reads ~240V. L1 to ground ~120V. L2 to ground ~0V. What's wrong?",
      good: "Lost L2 (or open leg). One side is dead — check disconnect, fuse, lug, or utility.",
      bad: "Compressor is bad because amps will be weird later.",
      whyWrong: "Prove power first. A missing leg is a power problem, not a compressor guess.",
      drip: "meter_open",
      face: "0",
      unit: "L2-G",
      string: [
        ["L1–L2", "~240"],
        ["L1–G", "~120"],
        ["L2–G", "0 — OPEN"],
        ["R–C", "not yet"]
      ]
    },
    {
      id: "control",
      label: "4 - 24V string",
      ask: "R to C is 24V. Y to C is 0V on a cool call. Next prove?",
      good: "Thermostat/Y path is open or not calling. Prove R–Y at the thermostat, then at the outdoor board.",
      bad: "Replace the contactor because the outdoor unit is quiet.",
      whyWrong: "No Y means the contactor never got a chance. Prove the 24V string before parts.",
      drip: "vd_24v",
      face: "0",
      unit: "Y-C",
      string: [
        ["L1–L2", "240"],
        ["R–C", "24"],
        ["Y–C", "0 — no call"],
        ["Coil", "dark"]
      ]
    },
    {
      id: "drop",
      label: "5 - Voltage drop",
      ask: "Contactor coil is energized but coil voltage is 18V under load. What does that say?",
      good: "Excessive drop or weak transformer/load. Prove voltage at the coil with the circuit loaded — not only open-circuit.",
      bad: "Coil is fine because you saw 24V with the contactor unplugged.",
      whyWrong: "Unloaded 24V hides a weak supply. Measure under load.",
      drip: "vd_24v",
      face: "18",
      unit: "coil V",
      string: [
        ["R–C open", "24"],
        ["Coil loaded", "18 — DROP"],
        ["Y–C", "call on"],
        ["T1–T2", "weak pull"]
      ]
    },
    {
      id: "unguided",
      label: "6 - Unguided call",
      ask: "No-cool. Indoor fan runs. Outdoor quiet. R–C 24V, Y–C 24V at the outdoor board, L1–L2 240V, contactor coil 24V, T1–T2 0V. What's open?",
      good: "Contactor contacts (or wiring after the contactor). Coil pulled in but power not passing to the compressor circuit.",
      bad: "Bad thermostat — Y never left the house.",
      whyWrong: "You already have Y and coil voltage at the outdoor. The break is after the coil — contacts or load side.",
      drip: "meter_open",
      face: "0",
      unit: "T1-T2",
      string: [
        ["L1–L2", "240"],
        ["Y–C / coil", "24 / 24"],
        ["T1–T2", "0 — OPEN"],
        ["Contacts", "prove next"]
      ]
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
      "#voltmeter-root{padding:16px 28px 28px;max-width:none;width:100%;box-sizing:border-box;min-height:100vh;margin:0}" +
      "#screen-voltmeter.screen.active,#screen-voltmeter.screen-on{display:block;width:100%;min-height:100vh}" +
      "#voltmeter-root .el-locker-opts{display:flex;flex-direction:column;gap:10px;margin:12px 0}" +
      "#voltmeter-root .vm-opt,#voltmeter-root .btn.vm-opt{" +
      "text-align:left;white-space:normal;min-height:56px;padding:14px 16px;" +
      "font-size:16px;line-height:1.35;touch-action:manipulation;-webkit-tap-highlight-color:transparent}" +
      "#voltmeter-root #vm-close{min-height:44px;min-width:44px;touch-action:manipulation}" +
      "#voltmeter-root .vm-probe-bar{position:sticky;top:0;z-index:6;margin:0 0 10px;padding:8px 12px;border-radius:8px;" +
      "background:#1a2430;color:#c9d4de;font-size:12px;letter-spacing:.03em;font-weight:600}" +
      "#voltmeter-root .vm-probe-bar b{color:#7ad0ff}" +
      "#voltmeter-root .vm-bay{display:flex;gap:10px;align-items:stretch;margin:8px 0 12px;flex-wrap:wrap}" +
      "#voltmeter-root .vm-face{min-width:88px;padding:10px 12px;border-radius:10px;background:#0b1220;" +
      "border:1px solid #2a3a4a;text-align:center}" +
      "#voltmeter-root .vm-face strong{display:block;font-size:28px;line-height:1;color:#7ad0ff}" +
      "#voltmeter-root .vm-face span{font-size:11px;letter-spacing:.08em;color:#8aa}" +
      "#voltmeter-root .vm-string{flex:1;min-width:200px;display:grid;grid-template-columns:1fr 1fr;gap:4px 12px;" +
      "padding:8px 10px;border-radius:10px;background:#101820;border:1px solid #243040;font-size:13px}" +
      "#voltmeter-root .vm-string i{font-style:normal;color:#8aa}" +
      "#voltmeter-root .vm-string b{font-weight:700;color:#e8eef4}" +
      "#voltmeter-root .vm-sheet{margin:0 0 10px;padding:8px 10px;border-radius:10px;background:#0d1610;border:1px solid #1e3a28;font-size:13px;color:#cfe8d4}" +
      "#voltmeter-root .vm-sheet b{color:#8fef9a}" +
      "@media (max-width:480px){#voltmeter-root .vm-opt,#voltmeter-root .btn.vm-opt{min-height:64px;padding:16px 18px;font-size:17px}}";
    document.head.appendChild(s);
  }

  function stringHtml(step) {
    var rows = step.string || [];
    var inner = rows.map(function (r) {
      return "<i>" + r[0] + "</i><b>" + r[1] + "</b>";
    }).join("");
    return '<div class="vm-bay">' +
      '<div class="vm-face"><strong>' + (step.face || "—") + "</strong><span>" + (step.unit || "VAC") + "</span></div>" +
      '<div class="vm-string">' + inner + "</div></div>";
  }

  function mount() {
    var host = document.getElementById("voltmeter-root");
    if (!host) return;
    fatCss();
    var pi = 0, score = 0, tried = 0, why = "", guided = true;
    var sheet = [];
    function sheetHtml() {
      if (!sheet.length) return '<p class="vm-sheet">Sheet: nothing proven yet. Meter first.</p>';
      return '<p class="vm-sheet"><b>Sheet</b> — ' + sheet.join(" · ") + "</p>";
    }
    function stamp(step) {
      var marks = {
        meter: "Meter proved live",
        scale: "Scale VAC > line",
        line: "L2-G 0 — open leg",
        control: "Y-C 0 — no call",
        drop: "Coil loaded 18V drop",
        unguided: "T1-T2 0 — contacts"
      };
      var line = marks[step.id];
      if (line && sheet.indexOf(line) < 0) sheet.push(line);
    }
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
        '<span class="muted"> 24V control - 240V power - guided then unguided</span>' +
        '<button type="button" class="btn" id="vm-close" style="margin-left:auto">Shop floor</button></header>' +
        '<p class="vm-probe-bar"><b>BLACK → COM</b>  ·  <b>RED → VΩ</b>  ·  equip ground last</p>' +
        stringHtml(step) +
        sheetHtml() +
        '<p class="eyebrow">' + (guided && pi < 5 ? "Guided" : "Unguided") + " - " + step.label + " of " + STEPS.length + "</p>" +
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
          if (ok) { score += 1; stamp(step); }
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
    btn.innerHTML = "<h3>Voltmeter school</h3><p>24V / 240V string - guided then unguided</p>";
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
