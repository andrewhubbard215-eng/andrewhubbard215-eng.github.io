/* Inducer prove sheet — call for heat, motor, hose/trap/vent, 24V, vacuum, switch LAST. */
(function () {
  "use strict";
  var STEPS = [
    {
      ask: "No heat. Thermostat is calling. What has to happen before the ignitor?",
      good: "Inducer starts and proves draft. Ignitor does not come on until the pressure switch closes.",
      bad: "Jump the pressure switch so the ignitor comes on now.",
      why: "A jumped switch lights into a dead vent. Inducer first, prove draft, then ignition."
    },
    {
      ask: "Inducer is dead quiet. Next meter move?",
      good: "Voltage at the inducer plug on a call for heat. No voltage: board output or harness. Voltage and no spin: motor or cap.",
      bad: "Replace the board because the inducer did not start.",
      why: "A dead motor or open harness looks like a bad board. Meter the plug before you condemn the board."
    },
    {
      ask: "Inducer hums, will not spin. What do you check before a new motor?",
      good: "Amp draw against the nameplate, wheel free, and the cap if it has one. A locked wheel pulls high amps and trips.",
      bad: "Swap the pressure switch. The hum is the switch.",
      why: "The switch does not spin the wheel. Hums are motor, cap, or a bound wheel."
    },
    {
      ask: "Inducer spins. Switch stays open. Order of prove?",
      good: "Hose and trap, then vent termination, then 24V across the switch, then manometer vs the rating on the switch. Switch last.",
      bad: "Replace the switch first. Spinning means the vent is fine.",
      why: "Water in the trap, a kinked hose, or a blocked vent fake an open switch every winter. Path before parts."
    },
    {
      ask: "Switch rating on the door is -0.50 in. w.c. Manometer on the inducer tap reads -0.20 in. w.c. with the wheel spinning. Switch is open. Next move?",
      good: "Draft is short of the rating. Recheck the hose, trap, and vent termination. Do not replace the switch while vacuum is below the close point.",
      bad: "Replace the pressure switch. The manometer already proved the board is lying.",
      why: "A switch that is open at -0.20 when it is rated to close at -0.50 is doing its job. Weak draft is hose, trap, vent, or a weak wheel — switch last."
    }
  ];

  function sheet() {
    var old = document.getElementById("inducer-prove-sheet");
    if (old) old.remove();
    var root = document.createElement("div");
    root.id = "inducer-prove-sheet";
    root.style.cssText = "position:fixed;inset:0;z-index:80;background:#0c121c;color:#e8eef6;overflow:auto;padding:16px 16px 48px;font:15px/1.4 system-ui,sans-serif";
    var i = 0;
    function paint() {
      var s = STEPS[i];
      root.innerHTML =
        "<p style='margin:0 0 8px;letter-spacing:.08em;font-size:12px;color:#9bb'>INDUCER PROVE · " + (i + 1) + " / " + STEPS.length + "</p>" +
        "<h2 style='margin:0 0 8px;font-size:20px'>Inducer before ignition</h2>" +
        "<p>" + s.ask + "</p>" +
        "<button type='button' data-ok='1' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #3d6'>" + s.good + "</button>" +
        "<button type='button' data-ok='0' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #633'>" + s.bad + "</button>" +
        "<p id='inducer-why' style='min-height:3em;color:#f4e7c8'>Hose / trap / vent → 24V across → vacuum vs rating → switch last.</p>" +
        "<button type='button' id='inducer-back' style='margin-top:12px;padding:10px 14px'>Shop floor</button>";
      root.querySelectorAll("[data-ok]").forEach(function (b) {
        b.onclick = function () {
          var ok = b.getAttribute("data-ok") === "1";
          var why = document.getElementById("inducer-why");
          if (!why) return;
          if (ok) {
            why.textContent = "RIGHT — " + s.good;
            if (i < STEPS.length - 1) {
              setTimeout(function () { i += 1; paint(); }, 700);
            } else {
              why.textContent = "RIGHT — path proved. Switch is last, and only if hose, trap, vent, voltage, and vacuum all check out.";
            }
          } else {
            why.textContent = "WRONG — " + s.why + " Right path: " + s.good;
          }
        };
      });
      root.querySelector("#inducer-back").onclick = function () { root.remove(); };
    }
    document.body.appendChild(root);
    paint();
  }

  function mountCard() {
    if (document.getElementById("inducer-prove-card")) return true;
    var nav = document.querySelector(".hub-nav, #hub-options");
    if (!nav) return false;
    var btn = document.createElement("button");
    btn.className = "mode-card";
    btn.id = "inducer-prove-card";
    btn.type = "button";
    btn.innerHTML = "<h3>Inducer prove</h3><p>Call → motor → hose/trap/vent → 24V → vacuum → switch LAST</p>";
    btn.onclick = function (e) {
      e.preventDefault();
      sheet();
    };
    var ps = Array.prototype.find.call(nav.querySelectorAll(".mode-card, a.mode-card"), function (el) {
      return /PS prove|Furnace SOO/i.test(el.textContent || "");
    });
    if (ps && ps.nextSibling) nav.insertBefore(btn, ps.nextSibling);
    else nav.appendChild(btn);
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    n += 1;
    if (mountCard() || n > 50) clearInterval(t);
  }, 400);
})();
