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
          LOCKER[k].name.split("\u2014")[0] + "</button>";
      }).join("") +
      "</div>" +
      '<div class="el-locker-grid"><aside class="el-sticker"><p class="eyebrow">INSIDE DOOR \u2014 ' + pack.name + "</p><ol>" +
      pack.sticker.map(function (s) { return "<li><b>" + s.code + "</b> " + s.meaning + "</li>"; }).join("") +
      '</ol><p class="sb-hint">If the door in the field disagrees, the field door wins.</p></aside><section>' +
      '<p class="eyebrow">' + pack.flash + " on the board</p>" +
      '<div class="el-flash">' + item.code + "</div>" +
      "<p>What does <strong>this door</strong> say that flash means?</p>" +
      '<div class="el-locker-opts">' +
      opts.map(function (s) {
        return '<button type="button" class="btn el-code-opt" data-code="' + s.code + '">' + s.code + " \u2014 " + s.meaning + "</button>";
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
          ? "RIGHT \u2014 " + item.prove
          : "WRONG \u2014 off-sticker. This door says " + item.code + " = " + item.meaning + ". " + item.prove;
        qi += 1;
        draw(wrap);
      };
    });
  }

  const PROVE = [
    { id: "hose", label: "1 \u00b7 Hose", ask: "Inducer is running. Pressure switch is open. First move?", good: "Pull the hose off the switch and blow/clear it. Look for water, kink, or a disconnected barb.", bad: "Swap the switch. Parts first is how you eat a callback." },
    { id: "trap", label: "2 \u00b7 Trap", ask: "Hose is clear. Still open. Next?", good: "Check the condensate trap. Water-logged trap kills vacuum at the switch.", bad: "Jump the switch and call it fixed. That's a safety bypass." },
    { id: "vent", label: "3 \u00b7 Vent", ask: "Hose and trap look dry. Next?", good: "Prove the vent/intake. Bird nest, cap, or ice kills draft before the switch ever fails.", bad: "Crank the gas valve. Draft problem is not a gas problem." },
    { id: "meter", label: "4 \u00b7 24V across", ask: "Draft path is open. How do you prove the switch electrically?", good: "Meter 24V across the two switch wires with the inducer running. 24V sitting there = switch still open.", bad: "Ohm the switch on the bench first. In the unit, the circuit tells you if it's open under load." },
    { id: "rating", label: "5 \u00b7 Vacuum vs rating", ask: "Inducer pulls. What number matters?", good: "Compare inducer vacuum (or manometer) to the switch rating printed on the part. Weak draft \u2260 bad switch.", bad: "If it clicks on the bench it's good. Bench click is not running vacuum." },
    { id: "last", label: "6 \u00b7 Switch last", ask: "Hose, trap, vent, 24V, and draft all check out. Now?", good: "Now replace the switch. Switch last \u2014 after the prove path.", bad: "Order a board. The board is waiting on a closed switch, not the other way around." }
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
      '<span class="muted"> Hose \u2192 trap \u2192 vent \u2192 24V across \u2192 vacuum vs rating \u2192 switch last</span>' +
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
          ? "RIGHT \u2014 " + step.good
          : "WRONG \u2014 " + step.bad + " Right path: " + step.good;
        pi += 1;
        drawProve(wrap);
      };
    });
  }

  const SOO = [
    { id: "w", label: "1 \u00b7 Call for heat", ask: "Thermostat calls heat. First thing the board must see?", good: "24V on W at the board. No W, no sequence. Prove the call before you condemn the inducer.", bad: "Swap the ignitor first. No call means the board never starts the sequence." },
    { id: "inducer", label: "2 \u00b7 Inducer", ask: "W is hot. What must run before ignition?", good: "Inducer / draft motor. It has to pull vacuum so the pressure switch can close.", bad: "Gas valve first. Valve waits on a proven draft." },
    { id: "ps", label: "3 \u00b7 Pressure switch", ask: "Inducer is spinning. What proves draft to the board?", good: "Pressure switch closes. Hose \u2192 trap \u2192 vent \u2192 24V across \u2192 vacuum vs rating \u2192 switch last.", bad: "Jump the switch so it lights. That's a vent/CO bypass." },
    { id: "ign", label: "4 \u00b7 Ignition", ask: "Switch is closed. Next in sequence?", good: "Hot surface ignitor or spark lights, THEN the gas valve opens for the trial.", bad: "Blower on immediately. Blower is after flame prove, not before." },
    { id: "flame", label: "5 \u00b7 Flame sense", ask: "Burners light. What keeps the gas valve energized?", good: "Flame rod rectifies to the board. No \u00b5A, valve drops after the trial.", bad: "Leave it \u2014 if you see fire it's fine. The board needs flame sense, not your eyes." },
    { id: "blower", label: "6 \u00b7 Blower delay", ask: "Flame is proven. When does the indoor blower start?", good: "After the board's heat-on delay. Limit stays in series the whole time.", bad: "Blower should already be on with the inducer. That's not this sequence." }
  ];
  let si = 0, sScore = 0, sTried = 0, sWhy = "";

  function mountSooBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-soo")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-soo";
    b.textContent = "Furnace sequence";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSoo();
    };
    modes.appendChild(b);
  }

  function openSoo() {
    let wrap = document.getElementById("el-soo-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-soo-overlay";
      wrap.className = "el-locker";
      const root = document.getElementById("electrical-root") || document.body;
      root.appendChild(wrap);
    }
    drawSoo(wrap);
  }

  function drawSoo(wrap) {
    const step = SOO[si % SOO.length];
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Furnace sequence of operation</strong>' +
      '<span class="muted"> W \u2192 inducer \u2192 pressure switch \u2192 ignition \u2192 flame sense \u2192 blower delay</span>' +
      '<button type="button" class="btn" id="el-soo-close">Close</button></header>' +
      '<p class="eyebrow">' + step.label + " of 6</p>" +
      "<p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' +
      (Math.random() < 0.5
        ? '<button type="button" class="btn el-soo-opt" data-ok="1">' + step.good + "</button>" +
          '<button type="button" class="btn el-soo-opt" data-ok="0">' + step.bad + "</button>"
        : '<button type="button" class="btn el-soo-opt" data-ok="0">' + step.bad + "</button>" +
          '<button type="button" class="btn el-soo-opt" data-ok="1">' + step.good + "</button>') +
      "</div>" +
      "<p class='hub-chip' style='margin-top:12px'>" +
      (sWhy || "Walk the sequence. Don't skip to parts.") +
      "</p><p class='muted'>Score " + sScore + "/" + sTried + "</p>";
    wrap.querySelector("#el-soo-close").onclick = function () { wrap.remove(); };
    wrap.querySelectorAll(".el-soo-opt").forEach(function (b) {
      b.onclick = function () {
        sTried += 1;
        const ok = b.getAttribute("data-ok") === "1";
        if (ok) sScore += 1;
        sWhy = ok
          ? "RIGHT \u2014 " + step.good
          : "WRONG \u2014 " + step.bad + " Right path: " + step.good;
        si += 1;
        drawSoo(wrap);
      };
    });
  }

  const IND = [
    { id: "call", label: "1 \u00b7 Call", ask: "No inducer on a heat call. First prove?", good: "24V on W at the board and 120V to the inducer plug while the board is calling. No call, no motor.", bad: "Swap the inducer. Dead motor and a board that never sent power look the same until you meter." },
    { id: "amp", label: "2 \u00b7 Amp / spin", ask: "Board is sending 120V. Inducer hums, no spin. Next?", good: "Check the wheel for debris and amp the motor. Locked rotor eats a capacitor or a winding \u2014 prove mechanical first.", bad: "Jump the pressure switch so it lights anyway. A locked inducer is a vent/CO problem, not a switch problem." },
    { id: "vac", label: "3 \u00b7 Vacuum", ask: "Wheel spins. Pressure switch still open. What number?", good: "Manometer at the hose barb vs the switch rating printed on the part. Weak pull is vent, trap, or a tired inducer \u2014 not automatically a switch.", bad: "If the wheel turns, draft is proven. Spin is not vacuum." },
    { id: "cap", label: "4 \u00b7 Cap / windings", ask: "Voltage good, wheel free, vacuum low. Next test?", good: "Cap spec on the can and winding ohms to the motor chart. Weak cap = weak RPM = weak vacuum.", bad: "Order a board. The board already proved it sent power." },
    { id: "last", label: "5 \u00b7 Motor last", ask: "Hose, trap, vent, voltage, cap, and windings all check. Now?", good: "Replace the inducer. Motor last \u2014 after the prove path, same rule as the pressure switch.", bad: "Replace board and switch together so you don't come back. That's a parts cannon." }
  ];
  let ii = 0, iScore = 0, iTried = 0, iWhy = "";

  function mountIndBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-inducer")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-inducer";
    b.textContent = "Inducer diagnostics";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openInd();
    };
    modes.appendChild(b);
  }

  function openInd() {
    let wrap = document.getElementById("el-ind-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-ind-overlay";
      wrap.className = "el-locker";
      const root = document.getElementById("electrical-root") || document.body;
      root.appendChild(wrap);
    }
    drawInd(wrap);
  }

  function drawInd(wrap) {
    const step = IND[ii % IND.length];
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Inducer diagnostics</strong>' +
      '<span class="muted"> Call/voltage \u2192 wheel/amps \u2192 vacuum vs rating \u2192 cap/ohms \u2192 motor last</span>' +
      '<button type="button" class="btn" id="el-ind-close">Close</button></header>' +
      '<p class="eyebrow">' + step.label + " of 5</p>" +
      "<p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' +
      (Math.random() < 0.5
        ? '<button type="button" class="btn el-ind-opt" data-ok="1">' + step.good + "</button>" +
          '<button type="button" class="btn el-ind-opt" data-ok="0">' + step.bad + "</button>"
        : '<button type="button" class="btn el-ind-opt" data-ok="0">' + step.bad + "</button>" +
          '<button type="button" class="btn el-ind-opt" data-ok="1">' + step.good + "</button>') +
      "</div>" +
      "<p class='hub-chip' style='margin-top:12px'>" +
      (iWhy || "Spin is not vacuum. Meter the call before you condemn the motor.") +
      "</p><p class='muted'>Score " + iScore + "/" + iTried + "</p>";
    wrap.querySelector("#el-ind-close").onclick = function () { wrap.remove(); };
    wrap.querySelectorAll(".el-ind-opt").forEach(function (b) {
      b.onclick = function () {
        iTried += 1;
        const ok = b.getAttribute("data-ok") === "1";
        if (ok) iScore += 1;
        iWhy = ok
          ? "RIGHT \u2014 " + step.good
          : "WRONG \u2014 " + step.bad + " Right path: " + step.good;
        ii += 1;
        drawInd(wrap);
      };
    });
  }

  window.BoardCodes = { openLocker: openLocker, openProve: openProve, openSoo: openSoo, openInd: openInd };

  document.addEventListener("click", function (e) {
    const btn = e.target && e.target.closest && e.target.closest('[data-mode="pressprove"]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if (typeof window.ltPlay === "function") window.ltPlay("electrical");
    setTimeout(openProve, 450);
  }, true);

  setInterval(function () { mountBtn(); mountProveBtn(); mountSooBtn(); mountIndBtn(); }, 800);
  document.addEventListener("DOMContentLoaded", function () { mountBtn(); mountProveBtn(); mountSooBtn(); mountIndBtn(); });

  function injectExam() {
    const bank = window.QuizArena && window.QuizArena.BANK && window.QuizArena.BANK.curriculum;
    if (!bank || bank._lockerItem) return;
    bank._lockerItem = true;
    bank.push({
      q: "Board flashes a 2-digit code you don't recognize. First move:",
      choices: [
        "Order a new control board \u2014 codes are universal",
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
        "Hose \u2192 trap \u2192 vent \u2192 24V across the switch \u2192 vacuum vs printed rating \u2192 switch last",
        "Jump the switch so the customer has heat tonight",
        "Add refrigerant \u2014 low charge opens every pressure switch"
      ],
      a: 1,
      why: "Draft path first. The switch is last after hose, trap, vent, meter, and rating all check out.",
      wrong: {
        0: "Why it's wrong: parts-cannon. Most 'bad switches' are water in the trap or a blocked vent.",
        2: "Why it's wrong: jumping a pressure switch hides a vent/CO risk. Prove, don't bypass.",
        3: "Why it's wrong: a furnace pressure switch is draft, not 410A. Charge chart does not close it."
      }
    });
    bank.push({
      q: "Correct gas-furnace sequence of operation:",
      choices: [
        "W \u2192 gas valve \u2192 ignitor \u2192 inducer \u2192 blower",
        "W \u2192 inducer \u2192 pressure switch prove \u2192 ignition \u2192 flame sense \u2192 blower on delay",
        "Blower first so the heat exchanger is already moving air",
        "Jump W to R at the board and skip the inducer"
      ],
      a: 1,
      why: "Draft must prove before gas. Flame sense keeps the valve. Blower follows the board delay.",
      wrong: {
        0: "Why it's wrong: gas before draft is a vent/CO story. Inducer and pressure switch come first.",
        2: "Why it's wrong: indoor blower is after flame prove on a standard gas furnace, not before.",
        3: "Why it's wrong: jumping W to R forces a call but does not prove draft or flame."
      }
    });
    bank.push({
      q: "Inducer hums on a heat call, wheel does not spin, pressure switch stays open. First moves:",
      choices: [
        "Replace the pressure switch \u2014 the board asked for draft",
        "Meter 120V at the plug, free the wheel, amp the motor, then vacuum vs switch rating",
        "Jump the pressure switch and light it for the customer",
        "Add 410A \u2014 low charge is why every switch stays open"
      ],
      a: 1,
      why: "Prove call voltage and mechanical spin before you condemn switch or motor. Vacuum vs printed rating decides draft.",
      wrong: {
        0: "Why it's wrong: an open switch is a symptom. Locked wheel or dead voltage looks the same on the LED.",
        2: "Why it's wrong: jumping the switch with no draft is a CO path. Prove, don't bypass.",
        3: "Why it's wrong: furnace draft switch is inches of water, not suction PSIG."
      }
    });
  }
  setInterval(injectExam, 500);
})();
