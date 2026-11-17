/* Furnace pressure-switch prove path — hose/trap/vent → 24V across → vacuum vs rating → switch LAST. Door sticker is law. */
(function () {
  "use strict";
  var STEPS = [
    {
      ask: "Inducer runs but pressure switch never closes. First prove before you touch the switch?",
      good: "Pull the hose. Check trap, vent, and inducer wheel for debris or water. Hose/trap/vent first.",
      bad: "Replace the pressure switch. It is not closing so it is bad.",
      why: "A blocked hose, full trap, or restricted vent keeps the switch open. Prove the air path before you condemn the switch."
    },
    {
      ask: "Hose, trap, and vent are clear. Inducer is spinning. Next meter move?",
      good: "Meter 24V across the switch contacts while the inducer runs. Open switch means no continuity; closed means 0V drop.",
      bad: "Jumper the pressure switch so the board sees closed.",
      why: "You need to know if the switch is actually open or if the board is lying. Meter across before you jump or replace."
    },
    {
      ask: "24V is present on one side of the switch. How do you prove the vacuum is enough?",
      good: "Connect a manometer or vacuum gauge to the switch port. Compare actual vacuum to the rating stamped on the switch or door sticker.",
      bad: "Assume the inducer is weak and replace the motor.",
      why: "The switch has a specific close rating. Low vacuum (dirty wheel, wrong orifice, long vent) keeps it open. Prove vacuum vs rating."
    },
    {
      ask: "Vacuum meets the rating. Switch still open. Last step?",
      good: "Now replace the pressure switch. Hose, vent, inducer, and vacuum are proven. Switch is last.",
      bad: "Keep jumping it for the rest of the season.",
      why: "Switch last. Never leave a jumper in. Door sticker is law — use the exact rating the board expects."
    }
  ];

  function openSheet() {
    var old = document.getElementById("ps-prove-sheet");
    if (old) old.remove();
    var root = document.createElement("div");
    root.id = "ps-prove-sheet";
    root.style.cssText = "position:fixed;inset:0;z-index:90;background:#0c121c;color:#e8eef6;overflow:auto;padding:16px 16px 48px;font:15px/1.4 system-ui,sans-serif";
    var i = 0;
    function paint() {
      var s = STEPS[i];
      root.innerHTML =
        "<p style='margin:0 0 8px;letter-spacing:.08em;font-size:12px;color:#9bb'>PS PROVE PATH · " + (i + 1) + " / " + STEPS.length + "</p>" +
        "<h2 style='margin:0 0 8px;font-size:20px'>Hose/trap/vent → 24V → vacuum vs rating → switch LAST</h2>" +
        "<p>" + s.ask + "</p>" +
        "<button type='button' data-ok='1' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #3d6'>" + s.good + "</button>" +
        "<button type='button' data-ok='0' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #633'>" + s.bad + "</button>" +
        "<p id='ps-why' style='min-height:3em;color:#f4e7c8'>Door sticker is law. Never invent OEM codes or ratings.</p>" +
        "<button type='button' id='ps-back' style='margin-top:12px;padding:10px 14px'>Shop floor</button>";
      root.querySelectorAll("[data-ok]").forEach(function (b) {
        b.onclick = function () {
          var ok = b.getAttribute("data-ok") === "1";
          var why = document.getElementById("ps-why");
          if (!why) return;
          if (ok) {
            why.textContent = "RIGHT — " + s.good;
            if (i < STEPS.length - 1) {
              setTimeout(function () { i += 1; paint(); }, 700);
            } else {
              why.textContent = "RIGHT — path complete. Hose/trap/vent first. Vacuum vs rating. Switch last. Never jump a safety.";
            }
          } else {
            why.textContent = "WRONG — " + s.why + " Right path: " + s.good;
          }
        };
      });
      root.querySelector("#ps-back").onclick = function () { root.remove(); };
    }
    document.body.appendChild(root);
    paint();
  }

  function mount() {
    var modes = document.querySelector("#furnace-root .el-modes") || document.querySelector(".furnace-modes") || document.querySelector(".el-modes");
    if (!modes || modes.querySelector("#el-mode-psprove")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-psprove";
    b.textContent = "PS prove sheet";
    b.onclick = function (e) {
      e.preventDefault();
      openSheet();
    };
    modes.appendChild(b);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
  setTimeout(mount, 1500);
})();
