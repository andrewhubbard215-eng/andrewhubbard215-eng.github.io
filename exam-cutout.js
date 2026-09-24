/* All-Star Exam — HPC/LPC cutout fingerprints. Why-right / why-wrong. */
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
    }
  ];
  function inject() {
    var qa = window.QuizArena;
    if (!qa || !qa.BANK) return false;
    var bank = qa.BANK;
    var key = bank.charge ? "charge" : bank.epa608 ? "epa608" : Object.keys(bank)[0];
    if (!key || !Array.isArray(bank[key])) return false;
    if (bank[key]._cutoutInjected) return true;
    ITEMS.forEach(function (it) { bank[key].push(it); });
    bank[key]._cutoutInjected = true;
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (inject() || ++n > 40) clearInterval(t); }, 250);
  document.addEventListener("DOMContentLoaded", inject);
})();
