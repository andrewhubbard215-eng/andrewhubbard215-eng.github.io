/* All-Star Exam: why-wrong per answer on the HPC/LPC and pressure-switch items,
   plus one LPC/HPC meter prove (black COM, red V-ohm, 24V across = open).
   Every cutout item gets its own why-wrong so Quiz Arena never shows the generic line. */
(function () {
  "use strict";
  var W = {
    "R-410A running. Head climbs past 580 psig and the compressor stops. First true call?": [
      "Why it's wrong: high head is not a low-charge fingerprint. Adding gas on a high-head trip stacks more liquid in the condenser and trips HPC again.",
      "Why it's wrong: HPC is the only thing between that head and a blown seal or a cooked compressor. A jumpered safety is a liability and a callback.",
      "Why it's wrong: a trip is the switch doing its job. Prove the OD fan, the coil, and the charge first. The compressor is last, never first."
    ],
    "R-410A running. Suction falls to 40 psig or below and the compressor drops. Do not add gas yet. Why?": [
      "Why it's wrong: two pounds blind on a dirty filter or a plugged drier floods the condenser and hides the real fault. Charge by the math (SC on a TXV), never by habit.",
      "Why it's wrong: LPC opens on low suction, not a locked rotor. A seized compressor hums and pulls LRA with the contactor in. That is a different prove.",
      "Why it's wrong: LPC protects the compressor from a starved low side and from pulling a vacuum through a leak. Both safeties are in the Y string."
    ],
    "Gas furnace. Inducer ran. Pressure switch stays open. First prove?": [
      "Why it's wrong: cheap is not proven. A new switch on a wet trap or kinked hose stays open just like the old one.",
      "Why it's wrong: the board did its job. It ran the inducer and is waiting on a close. Prove the draft path before you blame the brain.",
      "Why it's wrong: the pressure switch proves the flue is venting. Jumper it and you can fill the house with CO. Never light it on a jumper."
    ],
    "It lit once, then dropped on pressure-switch open mid-cycle. Next move?": [
      "Why it's wrong: one good cycle and then an open means draft is fading under heat. The board is reporting it, not causing it.",
      "Why it's wrong: it clicked closed once, so the switch can close. Something is stealing vacuum once it heats up. Prove that first.",
      "Why it's wrong: the inducer pulled enough to light. Prove hose, trap, and vent hot before you condemn the motor."
    ],
    "Furnace no heat. Inducer is running. Pressure switch is open. You read 24V across the switch terminals. Manometer on the hose is under the switch rating. What do you replace first?": [
      "Why it's wrong: 24V across any open switch in a live string is normal. It means the switch is open, not that it is broken. Vacuum under the rating says the draft is short, not the switch.",
      "Why it's wrong: 24V reaching one side of the switch proves the board is sending the call. The board is fine. The draft is not.",
      "Why it's wrong: a running inducer does not prove draft. The switch does. The gas valve stays closed until the switch closes."
    ]
  };
  var METER = {
    q: "No-cool. Y is called, contactor coil is dead. Meter on AC volts, black in COM, red in V\u03a9. Across the LPC you read 24V. Across the HPC you read 0V. What is the call?",
    choices: [
      "LPC is open. 24V across a switch in a live string means open, 0V means closed. Gauge suction against the cut-in printed on the switch before you condemn it.",
      "HPC is the bad one. 0V means no power is reaching it.",
      "Swap the leads, red in COM, to read the switch the right way",
      "Jumper the LPC and start the compressor to see if it cools"
    ],
    a: 0,
    why: "Prove path: meter across each safety in the Y string, black COM, red V\u03a9, AC volts. A closed switch has the same voltage on both sides, so it reads 0V. An open switch drops the whole 24V across itself. So the LPC is open. Gauge the low side. If suction is under the cut-in, find why (airflow, restriction, leak). To condemn the switch: lock out, pull one wire, read ohms. Closed is near 0 \u03a9, open is OL. Suction above cut-in and still OL means a bad switch.",
    whyWrong: "24V across is open, 0V across is closed. Black COM, red V\u03a9. Never jumper a safety to test it.",
    wrong: [
      null,
      "Why it's wrong: 0V across a closed switch is normal because both sides sit at the same 24V. 0V across the HPC means it is closed and passing Y. The 24V reading is your open switch.",
      "Why it's wrong: black always goes in COM and red in V\u03a9. Swapping leads on AC volts tells you nothing new and builds a bad habit for DC and amps.",
      "Why it's wrong: the LPC is telling you suction is low. Jumper it on a starved low side and you pull the compressor into a vacuum or burn it up on a leak. Gauge first."
    ]
  };
  function fill(it) {
    if (!it || !it.q || it.wrong) return;
    var list = W[it.q];
    var n = (it.choices || it.c || []).length;
    if (list && n === 4) {
      var k = 0;
      it.wrong = [0, 1, 2, 3].map(function (i) { return i === it.a ? null : list[k++]; });
    } else if (it.whyWrong && n) {
      it.wrong = (it.choices || it.c).map(function (_, i) { return i === it.a ? null : "Why it's wrong: " + it.whyWrong; });
    }
  }
  function run() {
    var qa = window.QuizArena;
    if (!qa || !qa.BANK) return false;
    var bank = qa.BANK;
    var key = bank.charge ? "charge" : bank.epa608 ? "epa608" : Object.keys(bank)[0];
    if (!key || !Array.isArray(bank[key])) return false;
    if (!bank[key].some(function (q) { return q && W[q.q]; })) return false; /* wait for exam-cutout */
    Object.keys(bank).forEach(function (k) {
      if (Array.isArray(bank[k])) bank[k].forEach(fill);
    });
    if (!bank[key].some(function (q) { return q && q.q === METER.q; })) bank[key].push(METER);
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (run() || ++n > 60) clearInterval(t); }, 300);
})();
