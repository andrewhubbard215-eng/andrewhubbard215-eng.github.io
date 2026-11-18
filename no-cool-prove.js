/* No-cool diagnostic sheet — LOTO → call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. Meter first. Only charge after run + SH/SC. */
(function () {
  "use strict";
  var STEPS = [
    {
      ask: "Customer says no cool. Before you open the disconnect or touch the unit, first safety move?",
      good: "LOTO the disconnect. Verify zero energy with your meter. Then start the sheet.",
      bad: "Open the panel and start metering live.",
      why: "Lockout-tagout first. A live unit bites. Prove dead before you prove the fault."
    },
    {
      ask: "Customer says no cool. Thermostat is set to cool and calling. First meter move before you open the unit?",
      good: "Confirm 240V at the disconnect. No voltage there and the outdoor never starts — power first.",
      bad: "Jump Y at the contactor so the compressor runs.",
      why: "No power at the disconnect looks like a dead compressor. Meter the source before you touch the system."
    },
    {
      ask: "240V is good at the disconnect. Contactor is not pulled in. Next?",
      good: "Meter 24V R to C at the outdoor board or contactor coil. No 24V: follow the call back to the thermostat and control wiring.",
      bad: "Replace the contactor. It is not pulling in so it must be bad.",
      why: "An open in the 24V string (stat, HPC, LPC, float, coil) keeps the contactor open. Meter the string before you swap parts."
    },
    {
      ask: "24V is present R to C. Contactor still open. Where do you meter next?",
      good: "Y to C. No voltage on Y: the call is open upstream (stat, board, or open safety). Voltage on Y and no pull: coil or contactor.",
      bad: "Assume the compressor is locked and pull the wires.",
      why: "Y is the cooling call. An open HPC, LPC, or float sits in that path. Find the dark box before you condemn the compressor."
    },
    {
      ask: "Y has 24V but float is open on the ladder. What does that mean?",
      good: "Float switch open — pan is full or switch failed. Clear the drain, prove the switch closed, then continue. Do not jumper the float.",
      bad: "Jumper the float so the system runs while you look for the clog later.",
      why: "An open float is protecting the house from a flood. Jumping it can water-damage the ceiling. Clear the path first."
    },
    {
      ask: "Y has 24V. Contactor pulls. Compressor does not start. Next prove?",
      good: "Meter T1 to T2 at the contactor. Voltage there and no start: compressor or capacitor. No voltage: contactor contacts or wiring.",
      bad: "Add refrigerant. Low charge is the only thing that stops a compressor.",
      why: "The sheet is electrical until the compressor is proven running. Charge faults show on the gauges after the machine is running."
    },
    {
      ask: "HPC is open on the ladder. What does that mean before you reset or bypass?",
      good: "High pressure cutout. Dirty outdoor coil, dead outdoor fan, or overcharge. Prove airflow and pressures. Do not jump the HPC.",
      bad: "Jumper the HPC so the customer gets cool air now.",
      why: "An open HPC is protecting the system. Jumping it can destroy the compressor. Find why pressure went high."
    },
    {
      ask: "Compressor is running. Gauges show equalized or standing pressures. Do you add charge?",
      good: "NO. Standing or equalized is NOT a charge. Only charge after stable run with proven SH/SC. Prove zero on both dials first.",
      bad: "Add a little refrigerant. Standing looks low.",
      why: "Standing pressures are ambient. Equalized means migration only. Never add or recover on standing. Charge only after the system is running and SH/SC is proven."
    }
  ];

  function openSheet() {
    var old = document.getElementById("nocool-prove-sheet");
    if (old) old.remove();
    var root = document.createElement("div");
    root.id = "nocool-prove-sheet";
    root.style.cssText = "position:fixed;inset:0;z-index:90;background:#0c121c;color:#e8eef6;overflow:auto;padding:16px 16px 48px;font:15px/1.4 system-ui,sans-serif";
    var i = 0;
    function paint() {
      var s = STEPS[i];
      root.innerHTML =
        "<p style='margin:0 0 8px;letter-spacing:.08em;font-size:12px;color:#9bb'>NO-COOL SHEET · " + (i + 1) + " / " + STEPS.length + "</p>" +
        "<h2 style='margin:0 0 8px;font-size:20px'>Meter first. Isolate the open.</h2>" +
        "<p>" + s.ask + "</p>" +
        "<button type='button' data-ok='1' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #3d6'>" + s.good + "</button>" +
        "<button type='button' data-ok='0' style='display:block;width:100%;text-align:left;margin:8px 0;padding:12px;border-radius:8px;border:1px solid #633'>" + s.bad + "</button>" +
        "<p id='nocool-why' style='min-height:3em;color:#f4e7c8'>Call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. Standing is NOT a charge.</p>" +
        "<button type='button' id='nocool-back' style='margin-top:12px;padding:10px 14px'>Shop floor</button>";
      root.querySelectorAll("[data-ok]").forEach(function (b) {
        b.onclick = function () {
          var ok = b.getAttribute("data-ok") === "1";
          var why = document.getElementById("nocool-why");
          if (!why) return;
          if (ok) {
            why.textContent = "RIGHT — " + s.good;
            if (i < STEPS.length - 1) {
              setTimeout(function () { i += 1; paint(); }, 700);
            } else {
              why.textContent = "RIGHT — sheet complete. LOTO first. Open isolated. Never jump a safety. Standing is NOT a charge. Only charge after stable run + proven SH/SC. Parts LEFT only — never invent.";
            }
          } else {
            why.textContent = "WRONG — " + s.why + " Right path: " + s.good;
          }
        };
      });
      root.querySelector("#nocool-back").onclick = function () { root.remove(); };
    }
    document.body.appendChild(root);
    paint();
  }

  function mount() {
    var modes = document.querySelector("#electrical-root .el-modes") || document.querySelector(".el-modes");
    if (!modes || modes.querySelector("#el-mode-nocool")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-nocool";
    b.textContent = "No-cool sheet";
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
