/* All-Star Exam — HPC/LPC cutout + PS prove fingerprints. Why-right / why-wrong. */
(function () {
  "use strict";
  var ITEMS = [
    {
      q: "R-410A running. Head climbs past 580 psig and the compressor stops. First true call?",
      choices: [
        "HPC opened — prove dirty ODU / dead OD fan / overcharge before you jumper the switch",
        "Add gas — high head always means undercharge",
        "Jump HPC and leave it jumped so the customer has air",
        "Replace the compressor — high head cooked it for sure"
      ],
      a: 0,
      why: "HPC is a safety. Contactor dropped because head hit cutout. Prove airflow and charge on the high side. Do not jumper a high-pressure switch and walk away.",
      whyWrong: "Jumpering HPC or adding gas on a high-head trip is a callback and a hazard. Find why head climbed."
    },
    {
      q: "R-410A running. Suction falls to 40 psig or below and the compressor drops. Do not add gas yet. Why?",
      choices: [
        "LPC opened — prove ID airflow, restriction, or leak path before you weigh in",
        "Always add two pounds first, then look",
        "LPC means the compressor is mechanically seized",
        "Ignore LPC — only HPC matters on 410A"
      ],
      a: 0,
      why: "LPC dropped the contactor. Low side can be starved by airflow, a restriction, or a leak. Adding gas blind hides the fingerprint.",
      whyWrong: "Gas-first on an LPC trip is a first-year habit that misses dirty coils and restrictions."
    },
    {
      q: "Gas furnace. Inducer ran. Pressure switch stays open. First prove?",
      choices: [
        "Pull the hose, dump the trap, look for a kink. Water and kink fake a dead switch.",
        "Swap the pressure switch first — cheapest part on the truck",
        "Order a board — it never saw a close",
        "Jump the switch and light it for the customer"
      ],
      a: 0,
      why: "Hose/trap first. Wet trap and kink kill vacuum at the barb. Switch LAST after hose, vent, inducer, 24V across, and vacuum vs rating.",
      whyWrong: "Parts-cannon switch or jumper before hose/trap is a callback. Prove draft path. Door sticker is law — do not invent codes."
    },
    {
      q: "It lit once, then dropped on pressure-switch open mid-cycle. Next move?",
      choices: [
        "Re-prove hose/trap/vent hot — trap filling, hose softening, vent icing, or HX leak can steal vacuum after light-off",
        "Board is flaky — swap it because it ran once",
        "New pressure switch only — it already clicked once",
        "Skip the roof and condemn the inducer"
      ],
      a: 0,
      why: "One light then open is draft dying under heat. Prove hose, trap, and vent with the unit hot. Match pull to the rating printed on the switch. Switch last.",
      whyWrong: "One light does not prove a bad board or a bad switch. Heat changes draft. Prove again running."
    },
    {
      q: "No-cool. Call is on, 240 at the disconnect, R–C is 24V, Y is live. Contactor never pulls. Float switch is in the drain pan. Next prove?",
      choices: [
        "Open the float, meter across it. Stuck-open float drops Y before HPC/LPC/coil. Clear the drain, then prove the rest of the string.",
        "Add gas first — no-cool always means undercharge",
        "Jump the float and leave it jumped so the house stays cold",
        "Replace the compressor — Y is hot so the motor is dead"
      ],
      a: 0,
      why: "No-cool sheet: call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. A full pan opens the float and kills Y to the coil. Prove the float before you condemn safeties or the compressor.",
      whyWrong: "Gas-first or jumping a safety hides a plugged drain. First-year techs skip the pan and eat a callback."
    },
    {
      q: "Inducer hums, no spin. Pressure switch stays open. Hose, trap, and vent are clear. What do you prove before a board?",
      choices: [
        "120V at the inducer plug, then amp against the nameplate. Hums with no spin is a seized or open-start motor — not a board that never saw a close.",
        "Swap the board — the switch never closed so the board is blind",
        "Jump the pressure switch and ship it",
        "New pressure switch — the motor is humming so draft is fine"
      ],
      a: 0,
      why: "Prove the draft motor before the board. Voltage at the plug means the board already called. No spin + hum = inducer, not IFC. Switch last, after vacuum vs the rating on the door sticker.",
      whyWrong: "A board does not spin the wheel. Hums with voltage at the plug is a motor prove. Jumping the switch skips the draft path."
    },
    {
      q: "Flame is visible. Board drops on flame sense. What do you prove before a new board?",
      choices: [
        "Microamps in series with the flame rod — good rod is about 1–5 µA. Low µA: dirty rod, cracked porcelain, poor ground, or weak flame. Clean and re-meter.",
        "Eyes say the flame is blue, so the board is bad",
        "Jump the flame sensor and leave the jumper",
        "Swap the gas valve — visible flame means the rod is fine"
      ],
      a: 0,
      why: "Flame prove is microamps, not your eyes. Typical good rod is about 1–5 µA. Clean the rod, check porcelain and ground, then re-meter before you buy a board.",
      whyWrong: "A pretty flame is not a prove. Eyes and a jumper skip the µA path. Dirty rod and bad ground fake a dead board."
    },
    {
      q: "Contactor is in. Compressor hums, no start. What do you do before you cut a winding?",
      choices: [
        "Lock it out. Meter the dual run cap (HERM/C and FAN/C). Open or shorted cap — replace the cap, do not condemn the compressor on a hum.",
        "Cut the common winding so it stops humming",
        "Add a hard-start and leave the dead cap",
        "Jump HERM to C and ship it"
      ],
      a: 0,
      why: "Hum with the contactor pulled in is a start prove, not a seized scroll. Lock out, meter the dual run cap, replace an open or shorted cap. A hard-start on a dead cap still eats the compressor.",
      whyWrong: "Cutting a winding or jumping HERM to C is not a repair. Cap first, compressor last."
    },
    {
      q: "Dual run cap is stamped 45/5 µF. Meter reads 28 µF HERM and 5 µF FAN. Compressor hums, fan runs. What do you do?",
      choices: [
        "Lock it out. HERM is weak — under about 90% of the stamp. Replace the cap. Do not condemn the compressor on a low µF.",
        "Fan side matches the stamp, so the cap is good — change the compressor",
        "Add a hard-start and leave the 28 µF",
        "Jump HERM to FAN and ship it"
      ],
      a: 0,
      why: "A run cap goes weak before it goes open. Replace under about 90% of the stamp (45 µF wants about 40 µF or better). 28 µF will hum the compressor and cook the winding. Fan µF can still read fine.",
      whyWrong: "A good FAN side does not clear HERM. A hard-start on a weak cap still eats the compressor. Cap first, compressor last."
    },
    {
      q: "R-410A. Suction 100 psig, SH 28 F. Liquid 340 psig, SC 22 F. Indoor delta-T is weak. What is the call?",
      choices: [
        "High SH and high SC together — restriction (TXV, drier, or kink). Do not add gas.",
        "Low charge — add gas until SH comes down",
        "Overcharge — recover until head falls",
        "Bad valves — high SC always means a weak compressor"
      ],
      a: 0,
      why: "Starved evaporator is high superheat. Liquid stacking ahead of a restriction is high subcool. Low charge is high SH and low SC. Adding gas on a restriction floods the condenser and trips HPC.",
      whyWrong: "Gas-first on high SH ignores subcool. High SC is not overcharge when SH is also high, and it is not a compressor call."
    },
    {
      q: "R-410A. Suction 140 psig, SH 4 F. Liquid 420 psig, SC 18 F. Suction line sweats back to the compressor. Indoor delta-T is weak. What is the call?",
      choices: [
        "Low SH and high SC — overcharge. Recover. Do not add gas.",
        "Low charge — add gas until the suction line stops sweating",
        "Restriction — high head always means a drier",
        "Bad valves — recover to zero and change the compressor first"
      ],
      a: 0,
      why: "Overcharge stacks liquid in the condenser (high subcool) and floods the evaporator (low superheat). A suction line sweating back to the shell is liquid coming home. Recover to the nameplate or to target SC. Adding gas trips HPC.",
      whyWrong: "Sweat on the suction line is not a low-charge call. High head with low SH is not a restriction — restriction is high SH and high SC together."
    },
    {
      q: "R-410A. Suction 95 psig, SH 26 F. Liquid 280 psig, SC 2 F. Indoor delta-T is weak. Evaporator is not flooded. What is the call?",
      choices: [
        "High SH and low SC — low charge. Leak-check, then weigh in. Do not call it a restriction.",
        "Restriction — high SH always means a TXV or drier",
        "Overcharge — recover until the suction line warms up",
        "Bad valves — change the compressor before you touch the charge"
      ],
      a: 0,
      why: "Low charge starves the evaporator (high superheat) and does not stack liquid (low subcool). Restriction is high SH and high SC together. Prove the leak path, then weigh in to target.",
      whyWrong: "High SH alone is not a restriction. A restriction stacks subcool. Recovering on low SC empties a system that is already short."
    },
    {
      q: "R-410A. Suction 105 psig, SH 3 F. Liquid 310 psig, SC 10 F. Evaporator is icing. Return filter is packed. Indoor delta-T is weak. What is the call?",
      choices: [
        "Low indoor airflow — dirty filter or blocked return. Change the filter, clear the return, prove airflow. Do not recover.",
        "Overcharge — low SH means recover until the coil thaws",
        "Low charge — add gas until the ice melts",
        "Restriction — ice on the coil always means a TXV"
      ],
      a: 0,
      why: "Low airflow lets the coil get too cold: superheat collapses and the coil ices. Subcool stays near target and head is not stacked, so this is not overcharge. Overcharge is low SH with high SC and high head. Fix the filter and the return before you touch the charge.",
      whyWrong: "Low SH with a normal SC is not overcharge. Adding gas on an iced coil floods it worse. Ice alone is not a TXV — restriction is high SH and high SC."
    },
    {
      q: "R-410A. Suction 118 psig, SH 12 F. Liquid 450 psig, SC 15 F. Outdoor coil is packed with cottonwood. Indoor delta-T is weak. What is the call?",
      choices: [
        "Dirty condenser — heat cannot leave. Wash the outdoor coil, then re-read SH/SC. Do not recover yet.",
        "Overcharge — high head always means recover",
        "Low charge — add gas until head falls",
        "Restriction — high head means a liquid-line drier"
      ],
      a: 0,
      why: "A matted outdoor coil cannot reject heat. Head climbs and subcool stacks a little while superheat stays near target. Overcharge is low SH with high SC and a suction line sweating home. Wash the coil, then re-read before you touch the charge.",
      whyWrong: "High head alone is not an overcharge. Overcharge floods the evaporator (low SH). Recovering a correct charge after a dirty coil leaves the system short."
    }
  ];
  function inject() {
    var qa = window.QuizArena;
    if (!qa || !qa.BANK) return false;
    var bank = qa.BANK;
    var key = bank.charge ? "charge" : bank.epa608 ? "epa608" : Object.keys(bank)[0];
    if (!key || !Array.isArray(bank[key])) return false;
    if (bank[key]._cutoutInjected12) return true;
    ITEMS.forEach(function (it) {
      var have = bank[key].some(function (q) { return q && q.q === it.q; });
      if (!have) bank[key].push(it);
    });
    bank[key]._cutoutInjected12 = true;
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (inject() || ++n > 40) clearInterval(t); }, 250);
  document.addEventListener("DOMContentLoaded", inject);
})();
