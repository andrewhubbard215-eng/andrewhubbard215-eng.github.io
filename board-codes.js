/* Board-code locker — door sticker is law. Training cards only; field door wins. */
(function () {
  "use strict";
  const LOCKER = {
    carrier: {
      name: "Carrier / Bryant — 2-digit on this door",
      flash: "2-digit",
      sticker: [
        { code: "13", meaning: "Limit switch open", prove: "Prove airflow and the limit before you condemn the board." },
        { code: "31", meaning: "High-pressure switch open", prove: "Dirty coil / dead OD fan / overcharge. HPC first." },
        { code: "32", meaning: "Low-pressure switch open", prove: "Airflow, restriction, or leak. Don't add gas yet." },
        { code: "33", meaning: "Limit / rollout related on THIS sticker", prove: "Flame rollout and limit are safeties. Find heat, not a new board." },
        { code: "41", meaning: "Blower / indoor motor fault on THIS sticker", prove: "Tap the motor plug and 24V enable before you order a board." }
      ]
    },
    trane: {
      name: "Trane / American Standard — flashes on this door",
      flash: "LED flashes",
      sticker: [
        { code: "2", meaning: "Pressure switch failed to close", prove: "Hose, trap, vent, then 24V across the switch. Switch last." },
        { code: "3", meaning: "Pressure switch opened after ignition", prove: "Inducer still running? Hose off or water in the trap." },
        { code: "4", meaning: "Open limit", prove: "Filter, blower, heat exchanger path. Don't jump the limit." },
        { code: "6", meaning: "Flame sensed out of sequence", prove: "Ground, flame rod, and gas off. Not a thermostat problem." },
        { code: "8", meaning: "Ignitor / flame failure on THIS sticker", prove: "24V to the gas valve after prove. Watch the trial." }
      ]
    },
    minisplit: {
      name: "Ductless head — letters on this remote/board sticker",
      flash: "letter",
      sticker: [
        { code: "E1", meaning: "Communication error (this sticker)", prove: "S / polarity / splice at the head. Don't add 410A." },
        { code: "E4", meaning: "Outdoor coil / discharge sensor (this sticker)", prove: "Unplug and ohm the sensor vs the chart on the door." },
        { code: "P0", meaning: "IPM / inverter protection (this sticker)", prove: "Voltage, amp draw, and the outdoor board — not a TXV first." },
        { code: "P4", meaning: "Compressor drive fault (this sticker)", prove: "Ohm windings and check the reactor. Don't guess gas." },
        { code: "F1", meaning: "Indoor coil sensor (this sticker)", prove: "Sensor at the indoor coil. Letter on the door beats memory." }
      ]
    }
  };

  let brand = "carrier";
  let qi = 0;
  let score = 0;
  let tried = 0;
  let why = "";

  function mountBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-codes")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-codes";
    b.textContent = "Board-code locker";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openLocker();
    };
    modes.appendChild(b);
  }

  function openLocker() {
    let wrap = document.getElementById("el-locker-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-locker-overlay";
      wrap.className = "el-locker";
      const root = document.getElementById("electrical-root") || document.body;
      root.appendChild(wrap);
    }
    draw(wrap);
  }

  function draw(wrap) {
    const pack = LOCKER[brand];
    const item = pack.sticker[qi % pack.sticker.length];
    const opts = pack.sticker.slice().sort(function (a, b) { return a.code.localeCompare(b.code); });
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Board-code locker</strong>' +
      '<span class="muted"> Door sticker is law. Field door beats this trainer.</span>' +
      '<button type="button" class="btn" id="el-locker-close">Close</button></header>' +
      '<div class="el-locker-brands">' +
      Object.keys(LOCKER).map(function (k) {
        return '<button type="button" class="btn' + (k === brand ? " primary" : "") + '" data-brand="' + k + '">' +
          LOCKER[k].name.split("—")[0] + "</button>";
      }).join("") +
      "</div>" +
      '<div class="el-locker-grid"><aside class="el-sticker"><p class="eyebrow">INSIDE DOOR — ' + pack.name + "</p><ol>" +
      pack.sticker.map(function (s) { return "<li><b>" + s.code + "</b> " + s.meaning + "</li>"; }).join("") +
      '</ol><p class="sb-hint">If the door in the field disagrees, the field door wins.</p></aside><section>' +
      '<p class="eyebrow">' + pack.flash + " on the board</p>" +
      '<div class="el-flash">' + item.code + "</div>" +
      "<p>What does <strong>this door</strong> say that flash means?</p>" +
      '<div class="el-locker-opts">' +
      opts.map(function (s) {
        return '<button type="button" class="btn el-code-opt" data-code="' + s.code + '">' + s.code + " — " + s.meaning + "</button>";
      }).join("") +
      "</div><p class='hub-chip' style='margin-top:12px'>" +
      (why || "Read the sticker. Then pick. Memory is how techs order the wrong board.") +
      "</p><p class='muted'>Score " + score + "/" + tried + "</p></section></div>";

    wrap.querySelector("#el-locker-close").onclick = function () { wrap.remove(); };
    wrap.querySelectorAll("[data-brand]").forEach(function (b) {
      b.onclick = function () { brand = b.getAttribute("data-brand"); qi = 0; why = ""; draw(wrap); };
    });
    wrap.querySelectorAll(".el-code-opt").forEach(function (b) {
      b.onclick = function () {
        tried += 1;
        const ok = b.getAttribute("data-code") === item.code;
        if (ok) score += 1;
        why = ok
          ? "RIGHT — " + item.prove
          : "WRONG — off-sticker. This door says " + item.code + " = " + item.meaning + ". " + item.prove;
        qi += 1;
        draw(wrap);
      };
    });
  }

  const PROVE = [
    { id: "hose", label: "1 · Hose", ask: "Inducer is running. Pressure switch is open. First move?", good: "Pull the hose off the switch and blow/clear it. Look for water, kink, or a disconnected barb.", bad: "Swap the switch. Parts first is how you eat a callback." },
    { id: "trap", label: "2 · Trap", ask: "Hose is clear. Still open. Next?", good: "Check the condensate trap. Water-logged trap kills vacuum at the switch.", bad: "Jump the switch and call it fixed. That's a safety bypass." },
    { id: "vent", label: "3 · Vent", ask: "Hose and trap look dry. Next?", good: "Prove the vent/intake. Bird nest, cap, or ice kills draft before the switch ever fails.", bad: "Crank the gas valve. Draft problem is not a gas problem." },
    { id: "meter", label: "4 · 24V across", ask: "Draft path is open. How do you prove the switch electrically?", good: "Meter 24V across the two switch wires with the inducer running. 24V sitting there = switch still open.", bad: "Ohm the switch on the bench first. In the unit, the circuit tells you if it's open under load." },
    { id: "rating", label: "5 · Vacuum vs rating", ask: "Inducer pulls. What number matters?", good: "Compare inducer vacuum (or manometer) to the switch rating printed on the part. Weak draft ≠ bad switch.", bad: "If it clicks on the bench it's good. Bench click is not running vacuum." },
    { id: "last", label: "6 · Switch last", ask: "Hose, trap, vent, 24V, and draft all check out. Now?", good: "Now replace the switch. Switch last — after the prove path.", bad: "Order a board. The board is waiting on a closed switch, not the other way around." }
  ];
  let pi = 0;
  let pScore = 0;
  let pTried = 0;
  let pWhy = "";

  function mountProveBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-prove")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-prove";
    b.textContent = "Pressure-switch prove";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openProve();
    };
    modes.appendChild(b);
  }

  function openProve() {
    let wrap = document.getElementById("el-prove-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-prove-overlay";
      wrap.className = "el-locker";
      const root = document.getElementById("electrical-root") || document.body;
      root.appendChild(wrap);
    }
    drawProve(wrap);
  }

  function drawProve(wrap) {
    const step = PROVE[pi % PROVE.length];
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Pressure-switch prove</strong>' +
      '<span class="muted"> Hose → trap → vent → 24V across → vacuum vs rating → switch last</span>' +
      '<button type="button" class="btn" id="el-prove-close">Close</button></header>' +
      '<p class="eyebrow">' + step.label + " of 6</p>" +
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
    wrap.querySelector("#el-prove-close").onclick = function () { wrap.remove(); };
    wrap.querySelectorAll(".el-prove-opt").forEach(function (b) {
      b.onclick = function () {
        pTried += 1;
        const ok = b.getAttribute("data-ok") === "1";
        if (ok) pScore += 1;
        pWhy = ok
          ? "RIGHT — " + step.good
          : "WRONG — " + step.bad + " Right path: " + step.good;
        pi += 1;
        drawProve(wrap);
      };
    });
  }

  window.BoardCodes = { openLocker: openLocker, openProve: openProve };

  document.addEventListener("click", function (e) {
    const btn = e.target && e.target.closest && e.target.closest('[data-mode="pressprove"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof window.ltPlay === "function") window.ltPlay("electrical");
    setTimeout(openProve, 450);
  }, true);

  setInterval(function () { mountBtn(); mountProveBtn(); }, 800);
  document.addEventListener("DOMContentLoaded", function () { mountBtn(); mountProveBtn(); });

  function injectExam() {
    const bank = window.QuizArena && window.QuizArena.BANK && window.QuizArena.BANK.curriculum;
    if (!bank || bank._lockerItem) return;
    bank._lockerItem = true;
    bank.push({
      q: "Board flashes a 2-digit code you don't recognize. First move:",
      choices: [
        "Order a new control board — codes are universal",
        "Read the sticker on THIS unit's door, then prove that safety",
        "Add refrigerant until the light goes out",
        "Jump the limit and see if it stays running"
      ],
      a: 1,
      why: "Door sticker is law. OEM numbers are not interchangeable. Prove the safety the sticker names.",
      wrong: {
        0: "Why it's wrong: codes are brand- and board-specific. Ordering a board from memory is how you eat a callback.",
        2: "Why it's wrong: a flash is a control/safety story, not a charge chart.",
        3: "Why it's wrong: jumping a limit hides fire risk. Prove airflow and the limit path."
      }
    });
    bank.push({
      q: "Furnace inducer runs, pressure switch will not close. Correct prove order:",
      choices: [
        "Replace the switch, then the board, then the inducer",
        "Hose → trap → vent → 24V across the switch → vacuum vs printed rating → switch last",
        "Jump the switch so the customer has heat tonight",
        "Add refrigerant — low charge opens every pressure switch"
      ],
      a: 1,
      why: "Draft path first. The switch is last after hose, trap, vent, meter, and rating all check out.",
      wrong: {
        0: "Why it's wrong: parts-cannon. Most 'bad switches' are water in the trap or a blocked vent.",
        2: "Why it's wrong: jumping a pressure switch hides a vent/CO risk. Prove, don't bypass.",
        3: "Why it's wrong: a furnace pressure switch is draft, not 410A. Charge chart does not close it."
      }
    });
  }
  setInterval(injectExam, 500);
})();
