/* All-Star Exam: why-wrong per answer on the HPC/LPC and pressure-switch items,
   plus one LPC/HPC meter prove (black COM, red V-ohm, 24V across = open).
   Every cutout item (all 18) gets its own why-wrong so Quiz Arena never shows the generic line. */
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
    "No-cool. Call is on, 240 at the disconnect, R\u2013C is 24V, Y is live. Contactor never pulls. Float switch is in the drain pan. Next prove?": [
      "Why it's wrong: the contactor never pulled, so the compressor never ran. Charge cannot stop a coil from pulling in. Prove the Y string first, and the pan is wet.",
      "Why it's wrong: the float is a water safety. Jump it on a full pan and the drain overflows into the ceiling. Clear the drain, then let the float close on its own.",
      "Why it's wrong: Y at the stat does not mean Y at the coil. The float sits between them. A compressor never gets a call when the contactor never pulls."
    ],
    "Inducer hums, no spin. Pressure switch stays open. Hose, trap, and vent are clear. What do you prove before a board?": [
      "Why it's wrong: hum means voltage is already at the motor. The board sent the call. A board cannot spin a seized wheel.",
      "Why it's wrong: the switch is open because no draft is being pulled. Jump it with a dead inducer and flue gas has nowhere to go. That is CO in the house.",
      "Why it's wrong: hum is not draft. A wheel that does not spin pulls no vacuum. A new switch stays open on a dead inducer."
    ],
    "Flame is visible. Board drops on flame sense. What do you prove before a new board?": [
      "Why it's wrong: the board cannot see flame. It reads microamps through the rod. A blue flame on a dirty rod still reads low \u00b5A.",
      "Why it's wrong: flame sense is the safety that shuts the gas when the fire goes out. Jump it and the valve can dump raw gas. Never leave a flame safety jumpered.",
      "Why it's wrong: visible flame proves the valve opened and gas burned. The drop is on sense, so the rod, porcelain, and ground are the prove. Meter \u00b5A first."
    ],
    "Contactor is in. Compressor hums, no start. What do you do before you cut a winding?": [
      "Why it's wrong: you never cut a winding. That destroys the compressor. Hum with the contactor in is a start prove, and the cap is first.",
      "Why it's wrong: a hard-start helps a good cap kick a tight compressor. On a dead cap the run winding still has no help once it starts. Replace the cap.",
      "Why it's wrong: jumping HERM to C shorts the cap terminals and can blow the cap or the breaker. It is not a repair. Lock out and meter the cap."
    ],
    "Dual run cap is stamped 45/5 \u00b5F. Meter reads 28 \u00b5F HERM and 5 \u00b5F FAN. Compressor hums, fan runs. What do you do?": [
      "Why it's wrong: a dual cap is two caps in one can. FAN reading good proves only the fan side. HERM at 28 of 45 is weak, and that is your hum.",
      "Why it's wrong: a hard-start only helps the kick. The weak 28 \u00b5F still runs the compressor short of help and cooks the winding. Replace the cap.",
      "Why it's wrong: HERM to FAN puts the fan side in the compressor circuit. The \u00b5F is wrong and nothing is fixed. Lock out and replace the cap."
    ],
    "R-410A. Suction 100 psig, SH 28 F. Liquid 340 psig, SC 22 F. Indoor delta-T is weak. What is the call?": [
      "Why it's wrong: low charge is high SH with LOW SC. SC of 22 says liquid is stacking. Add gas on a restriction and you flood the condenser and trip HPC.",
      "Why it's wrong: overcharge floods the evaporator, so SH runs low. SH of 28 is a starved coil. High SH plus high SC is a restriction, not too much gas.",
      "Why it's wrong: weak valves give low head and low SC. Head at 340 with SC 22 is liquid backed up ahead of a restriction, not a weak compressor."
    ],
    "R-410A. Suction 140 psig, SH 4 F. Liquid 420 psig, SC 18 F. Suction line sweats back to the compressor. Indoor delta-T is weak. What is the call?": [
      "Why it's wrong: a sweating suction line is liquid coming home. SH of 4 with SC of 18 is too much gas. Adding more slugs the compressor and trips HPC.",
      "Why it's wrong: a restriction starves the evaporator, so SH runs high. SH of 4 is a flooded coil. Low SH plus high SC is overcharge.",
      "Why it's wrong: weak valves give low head and low SC. 420 head with 18 SC is a stacked condenser. Recover to target SC, do not change the compressor."
    ],
    "R-410A. Suction 95 psig, SH 26 F. Liquid 280 psig, SC 2 F. Indoor delta-T is weak. Evaporator is not flooded. What is the call?": [
      "Why it's wrong: a restriction stacks liquid ahead of it, so SC runs high. SC of 2 means no liquid is stacking. High SH with low SC is low charge.",
      "Why it's wrong: overcharge is low SH and high SC. This reads the opposite: SH 26, SC 2. Recovering a short system makes it worse.",
      "Why it's wrong: the gauges say the system is short of gas, not that the compressor is weak. Leak-check and weigh in, then re-read SH and SC."
    ],
    "R-410A. Suction 105 psig, SH 3 F. Liquid 310 psig, SC 10 F. Evaporator is icing. Return filter is packed. Indoor delta-T is weak. What is the call?": [
      "Why it's wrong: SC is 10, right on target, so charge is fine. Low SH here is from no air across the coil. Recover and you end up short once the filter is changed.",
      "Why it's wrong: ice is from low airflow, not low gas. SH of 3 says the coil is already flooded. Adding gas floods it more. Change the filter first.",
      "Why it's wrong: a restriction gives high SH. SH of 3 is a coil with no air across it. The packed filter is the fingerprint, not the TXV."
    ],
    "R-410A. Suction 118 psig, SH 12 F. Liquid 450 psig, SC 15 F. Outdoor coil is packed with cottonwood. Indoor delta-T is weak. What is the call?": [
      "Why it's wrong: SH and SC are near target, so the charge is close. High head is heat that cannot leave a packed coil. Wash it first, then read again.",
      "Why it's wrong: adding gas to 450 psig head pushes it toward the HPC cutout. Head is high because the coil is dirty, not because the system is short.",
      "Why it's wrong: a restriction gives high SH. SH of 12 is normal. The cottonwood on the coil is the fingerprint."
    ],
    "R-410A. Suction 125 psig, SH 14 F. Liquid 490 psig, SC 22 F. Outdoor coil is clean. Ambient 85 F. Discharge line is too hot to hold. What is the call?": [
      "Why it's wrong: overcharge floods the evaporator, so SH runs low. SH of 14 is normal. High head on a clean coil with normal SH points to air in the system.",
      "Why it's wrong: the coil is already clean. Washing it will not drop the head. Air does not condense, so it rides high in the condenser.",
      "Why it's wrong: adding gas to 490 psig head trips HPC. A hot discharge line here is heat from air in the system, not a short charge."
    ],
    "R-410A. Suction 165 psig, SH 22 F. Liquid 250 psig, SC 3 F. Compressor amps are well under nameplate. Indoor delta-T is weak. Coil is clean. What is the call?": [
      "Why it's wrong: overcharge raises head. Head is low at 250 with suction high at 165. Pressures pulling together is a compressor that is not pumping.",
      "Why it's wrong: a low charge pulls suction down, not up to 165. Low amps with high suction and low head is weak valves. Gas will not fix it.",
      "Why it's wrong: a dirty condenser raises head. Head is low and the coil is clean. Low amps say the compressor is not doing the work."
    ],
    "R-410A. Suction 78 psig, SH 28 F. Liquid 340 psig, SC 18 F. Filter-drier outlet is cold and sweating. Coil is clean. Indoor delta-T is weak. What is the call?": [
      "Why it's wrong: low charge gives LOW SC. SC of 18 says liquid is stacking. A cold, sweating drier outlet is a pressure drop across a restriction.",
      "Why it's wrong: overcharge gives low SH. SH of 28 is a starved coil. Recover a restriction and you end up short once the drier is changed.",
      "Why it's wrong: the coil is clean and head is normal. A sweating drier is a temp-drop across it. Prove the drier and the TXV."
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
