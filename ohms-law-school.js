/* Ohm's Law school — V=IR class demo + HVAC tickets. Separate from ohm-school (shorted coil). */
(function () {
  "use strict";

  var DEMO = { V: 24, R: 40 };

  var TICKETS = [
    {
      label: "Ticket · Shorted coil overload",
      ask: "24V control. Contactor coil should be ~40 Ω. It reads ~2 Ω. About what amp draw on the 24V circuit, and what happens?",
      good: "I = V/R ≈ 24/2 = 12 A — blows the control fuse / overloads the transformer. Replace the shorted coil, then the fuse.",
      bad: "I = V×R = 48 A — transformer is fine, just weak thermostat wire.",
      whyWrong: "Ohm's law is I = V/R, not V×R. A near-short draws huge current and eats the fuse."
    },
    {
      label: "Ticket · Open winding",
      ask: "Compressor run winding reads OL (open). Locked-rotor amps on a healthy motor would be high. What does OL mean for current and the call?",
      good: "Open = infinite R → I ≈ 0 through that winding. Motor won't start/run. Replace compressor (or condensing unit) after lockout prove-dead.",
      bad: "OL means low resistance — expect overload amps and a hot compressor.",
      whyWrong: "OL is open circuit: no path, no current. Overload amps need a low-R short or locked rotor, not an open winding."
    }
  ];

  function irLine(V, R) {
    var I = R > 0 ? (V / R) : Infinity;
    var iStr = !isFinite(I) ? "∞ (open)" : (Math.round(I * 1000) / 1000) + " A";
    return "V=" + V + " V · R=" + R + " Ω · I=V/R → " + iStr;
  }

  function mount() {
    var host = document.getElementById("ohms-law-root");
    if (!host) return;
    var mode = "demo"; // demo | tickets
    var pi = 0, score = 0, tried = 0, why = "";
    var V = DEMO.V, R = DEMO.R;

    function close() {
      try {
        document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
        var hub = document.getElementById("screen-hub");
        if (hub) hub.classList.add("active");
        if (typeof window.ltGoHub === "function") window.ltGoHub();
        else if (typeof window.ltPlay === "function") window.ltPlay("hub");
      } catch (_) {}
    }

    function drawDemo() {
      host.innerHTML =
        '<header class="sb-toolbar"><strong>Ohm\'s Law school</strong>' +
        '<span class="muted"> V=IR class demo · HVAC tickets</span>' +
        '<button type="button" class="btn" id="ol-close" style="margin-left:auto">Shop floor</button></header>' +
        '<p class="eyebrow">Class demo · slide V and R</p>' +
        "<p><strong>I = V ÷ R</strong> — voltage over resistance. Short (tiny R) → big I. Open (huge R) → no I.</p>" +
        '<label class="muted">Voltage V (volts) <input id="ol-v" type="range" min="5" max="240" step="1" value="' + V + '"/></label>' +
        '<p id="ol-v-read" class="hub-chip">' + V + " V</p>" +
        '<label class="muted">Resistance R (ohms) <input id="ol-r" type="range" min="1" max="200" step="1" value="' + R + '"/></label>' +
        '<p id="ol-r-read" class="hub-chip">' + R + " Ω</p>" +
        '<p class="sb-live" id="ol-out">' + irLine(V, R) + "</p>" +
        '<p class="muted">Tip: 24V / 40Ω coil ≈ 0.6 A. 24V / 2Ω short ≈ 12 A — fuse candy.</p>' +
        '<button type="button" class="btn primary" id="ol-tickets">HVAC tickets (2)</button>';
      host.querySelector("#ol-close").onclick = close;
      host.querySelector("#ol-tickets").onclick = function () {
        mode = "tickets";
        pi = 0; score = 0; tried = 0; why = "";
        draw();
      };
      function sync() {
        V = +host.querySelector("#ol-v").value;
        R = +host.querySelector("#ol-r").value;
        host.querySelector("#ol-v-read").textContent = V + " V";
        host.querySelector("#ol-r-read").textContent = R + " Ω";
        host.querySelector("#ol-out").textContent = irLine(V, R);
      }
      host.querySelector("#ol-v").oninput = sync;
      host.querySelector("#ol-r").oninput = sync;
    }

    function drawTicket() {
      var step = TICKETS[pi % TICKETS.length];
      host.innerHTML =
        '<header class="sb-toolbar"><strong>Ohm\'s Law school</strong>' +
        '<span class="muted"> HVAC tickets</span>' +
        '<button type="button" class="btn" id="ol-close" style="margin-left:auto">Shop floor</button></header>' +
        '<p class="eyebrow">' + step.label + " · " + (pi + 1) + "/" + TICKETS.length + "</p>" +
        "<p>" + step.ask + "</p>" +
        '<div class="el-locker-opts">' +
        (Math.random() < 0.5
          ? '<button type="button" class="btn ol-opt" data-ok="1">' + step.good + "</button>" +
            '<button type="button" class="btn ol-opt" data-ok="0">' + step.bad + "</button>"
          : '<button type="button" class="btn ol-opt" data-ok="0">' + step.bad + "</button>" +
            '<button type="button" class="btn ol-opt" data-ok="1">' + step.good + "</button>") +
        "</div>" +
        "<p class='hub-chip' style='margin-top:12px'>" + (why || "I = V/R. Short → overload amps. Open → zero amps.") + "</p>" +
        "<p class='muted'>Score " + score + "/" + tried + "</p>" +
        '<button type="button" class="btn" id="ol-demo">Back to V=IR demo</button>';
      host.querySelector("#ol-close").onclick = close;
      host.querySelector("#ol-demo").onclick = function () { mode = "demo"; draw(); };
      host.querySelectorAll(".ol-opt").forEach(function (b) {
        b.onclick = function () {
          tried += 1;
          var ok = b.getAttribute("data-ok") === "1";
          if (ok) score += 1;
          why = ok ? "RIGHT — " + step.good : "WRONG — " + step.whyWrong + " Right path: " + step.good;
          pi += 1;
          draw();
        };
      });
    }

    function draw() {
      if (mode === "demo") drawDemo();
      else drawTicket();
    }
    draw();
  }

  function open() {
    var screen = document.getElementById("screen-ohms-law");
    if (!screen) {
      screen = document.createElement("section");
      screen.id = "screen-ohms-law";
      screen.className = "screen";
      screen.innerHTML = '<div id="ohms-law-root"></div>';
      (document.getElementById("app") || document.body).appendChild(screen);
    }
    document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
    screen.classList.add("active");
    mount();
  }

  window.OhmsLawSchool = { open: open, start: open };

  function injectCard() {
    var grid = document.getElementById("hub-options");
    if (!grid || grid.querySelector('[data-mode="ohms-law"]')) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mode-card";
    btn.setAttribute("data-mode", "ohms-law");
    btn.innerHTML = "<h3>Ohm's Law school</h3><p>V=IR demo · shorted coil amp draw · open winding</p>";
    btn.addEventListener("click", function (e) { e.preventDefault(); open(); });
    var after = grid.querySelector('[data-mode="ohm"]') || grid.querySelector('[data-mode="voltmeter"]') || grid.querySelector('[data-mode="electrical"]');
    if (after && after.nextSibling) grid.insertBefore(btn, after.nextSibling);
    else grid.appendChild(btn);
  }
  setInterval(injectCard, 800);
  document.addEventListener("DOMContentLoaded", injectCard);
})();
