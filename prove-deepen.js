/* PS prove deepen v15 — vent path + opens mid-cycle. Loads after board-codes.js */
(function () {
  "use strict";
  var PROVE = [
    {
      id: "hose",
      label: "1 \u00b7 Hose / trap",
      ask: "Inducer ran (or should). Pressure switch stays open. First move?",
      good: "Pull the hose, clear water/kink, check the condensate trap. Wet trap kills vacuum at the barb.",
      bad: "Swap the pressure switch first.",
      whyWrong: "Don't condemn the switch before hose and trap. Water and kink fake a bad PS every day."
    },
    {
      id: "vent",
      label: "2 \u00b7 Vent path",
      ask: "Hose and trap are clear. Still open. What else kills draft before you condemn the motor?",
      good: "Check termination, bird nest, ice, common-vent share, and long runs. Restricted vent = weak vacuum at the switch.",
      bad: "Skip the roof/sidewall and go straight to a new inducer.",
      whyWrong: "Nest, ice, and shared vents fake a dead motor every winter. Prove the path outdoors before you buy a draft motor."
    },
    {
      id: "inducer",
      label: "3 \u00b7 Inducer",
      ask: "Hose, trap, and vent path look open. Still open. Prove the draft motor?",
      good: "Confirm inducer is spinning and pulling. Voltage at the plug, then amp if it hums. No pull = no close.",
      bad: "Condemn the inducer because the switch never closed.",
      whyWrong: "Don't condemn the inducer before trap/hose (and vent). Dead draft often starts upstream of the motor."
    },
    {
      id: "meter",
      label: "4 \u00b7 24V across",
      ask: "Draft path looks open. How do you prove the switch electrically?",
      good: "Meter 24V across the two switch wires with the inducer running. 24V sitting there = switch still open.",
      bad: "Ohm the switch on the bench first and call it.",
      whyWrong: "Bench ohm is not running vacuum. In the unit, the circuit under load tells you if it's open."
    },
    {
      id: "rating",
      label: "5 \u00b7 Vacuum vs rating",
      ask: "Inducer pulls. What number matters?",
      good: "Compare inducer vacuum (manometer) to the switch rating printed on the part. Weak draft \u2260 bad switch.",
      bad: "If it clicks on the bench it's good — replace nothing else.",
      whyWrong: "Bench click is not running vacuum. Match pull to the rating before you buy a switch."
    },
    {
      id: "midcycle",
      label: "6 \u00b7 Opens mid-cycle",
      ask: "It lit once, then dropped on a pressure-switch open. Same prove path?",
      good: "Yes — trap filling, hose softening, vent icing, or HX crack can steal vacuum after light-off. Re-prove hose/trap/vent under fire, then rating.",
      bad: "Board is flaky — swap it because it ran once.",
      whyWrong: "One light then open is usually draft dying under heat, not a random board. Prove again with the unit hot."
    },
    {
      id: "last",
      label: "7 \u00b7 Switch last",
      ask: "Hose, trap, vent, inducer, 24V, and draft (cold and hot) all check out. Now?",
      good: "Now replace the switch. Switch LAST — after the prove path.",
      bad: "Order a board. The board is waiting on a closed switch.",
      whyWrong: "Parts-cannon boards eat callbacks. Prove path first; switch last."
    }
  ];

  function install() {
    var bc = window.BoardCodes;
    if (!bc || typeof bc.openProve !== "function") return false;
    if (bc._proveDeepen15) return true;
    bc.openProve = function openProveDeepen() {
      var wrap = document.getElementById("el-prove-overlay");
      if (!wrap) {
        wrap = document.createElement("div");
        wrap.id = "el-prove-overlay";
        wrap.className = "el-locker";
        document.body.appendChild(wrap);
      }
      var pi = 0, pScore = 0, pTried = 0, pWhy = "";
      function close() {
        try { wrap.remove(); } catch (_) {}
        try {
          document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
          var hub = document.getElementById("screen-hub");
          if (hub) hub.classList.add("active");
          if (typeof window.ltGoHub === "function") window.ltGoHub();
          else if (typeof window.ltGo === "function") window.ltGo("hub");
          else if (typeof window.ltPlay === "function") window.ltPlay("hub");
        } catch (_) {}
      }
      function draw() {
        var step = PROVE[pi % PROVE.length];
        wrap.innerHTML =
          '<header class="sb-toolbar"><strong>Pressure-switch prove</strong>' +
          '<span class="muted"> Hose/trap \u2192 vent \u2192 inducer \u2192 24V \u2192 rating \u2192 mid-cycle \u2192 switch LAST</span>' +
          '<span class="el-locker-brands" style="margin-left:auto">' +
          '<button type="button" class="btn" data-drill="locker">Locker</button>' +
          '<button type="button" class="btn" data-drill="soo">Furnace SOO</button>' +
          '<button type="button" class="btn" id="el-prove-close">Close</button></span></header>' +
          '<p class="eyebrow">' + step.label + " of " + PROVE.length + "</p>" +
          "<p>" + step.ask + "</p>" +
          '<div class="el-locker-opts">' +
          (Math.random() < 0.5
            ? '<button type="button" class="btn el-prove-opt" data-ok="1">' + step.good + "</button>" +
              '<button type="button" class="btn el-prove-opt" data-ok="0">' + step.bad + "</button>"
            : '<button type="button" class="btn el-prove-opt" data-ok="0">' + step.bad + "</button>" +
              '<button type="button" class="btn el-prove-opt" data-ok="1">' + step.good + "</button>') +
          "</div>" +
          "<p class='hub-chip' style='margin-top:12px'>" +
          (pWhy || "Don't condemn the switch until the draft path is proven.") +
          "</p><p class='muted'>Score " + pScore + "/" + pTried + "</p>";
        wrap.querySelector("#el-prove-close").onclick = close;
        wrap.querySelectorAll("[data-drill]").forEach(function (b) {
          b.onclick = function (e) {
            e.preventDefault();
            var k = b.getAttribute("data-drill");
            try { wrap.remove(); } catch (_) {}
            if (k === "soo" && bc.openSoo) bc.openSoo();
            else if (bc.openLocker) bc.openLocker();
          };
        });
        wrap.querySelectorAll(".el-prove-opt").forEach(function (b) {
          b.onclick = function () {
            pTried += 1;
            var ok = b.getAttribute("data-ok") === "1";
            if (ok) pScore += 1;
            pWhy = ok
              ? "RIGHT \u2014 " + step.good
              : "WRONG \u2014 " + step.whyWrong + " Right path: " + step.good;
            pi += 1;
            draw();
          };
        });
      }
      draw();
    };
    bc._proveDeepen15 = true;
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    if (install() || ++n > 40) clearInterval(t);
  }, 250);
  document.addEventListener("DOMContentLoaded", install);
})();
