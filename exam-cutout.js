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
    }
  ];
  function inject() {
    var qa = window.QuizArena;
    if (!qa || !qa.BANK) return false;
    var bank = qa.BANK;
    var key = bank.charge ? "charge" : bank.epa608 ? "epa608" : Object.keys(bank)[0];
    if (!key || !Array.isArray(bank[key])) return false;
    if (bank[key]._cutoutInjected2) return true;
    ITEMS.forEach(function (it) { bank[key].push(it); });
    bank[key]._cutoutInjected2 = true;
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (inject() || ++n > 40) clearInterval(t); }, 250);
  document.addEventListener("DOMContentLoaded", inject);
})();
