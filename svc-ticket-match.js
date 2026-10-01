/* Shop floor: no-cool sheet separators + Saturday meter is not the ticket above. */
(function () {
  "use strict";
  function cleanSheet() {
    var y = document.getElementById("svc-vitals");
    if (!y) return;
    var html = y.innerHTML;
    var next = html.replace(/(?:\s*-\s*){2,}/g, " - ").replace(/\s{2,}/g, " ");
    if (next !== html) y.innerHTML = next;
  }
  function matchMeter() {
    var nameEl = document.getElementById("svc-name");
    var jobEl = document.getElementById("svc-job");
    var ticket = document.querySelector(".sm-ticket");
    if (!nameEl || !ticket) return;
    var name = (nameEl.textContent || "").trim();
    var job = jobEl ? (jobEl.textContent || "").trim() : "";
    if (!name) return;
    var ken = /ken/i.test(name) && /barber|ice|suction|filter/i.test(name + " " + job);
    if (ken) {
      ticket.innerHTML = "<strong>SATURDAY · Ken — barbershop</strong> · suction iced · filter black · ODT 88° · same ticket";
      return;
    }
    var safe = name.replace(/[<>]/g, "");
    ticket.innerHTML = "<strong>METER BAY · Saturday airflow drill</strong> · Ken · iced suction · black filter · ODT 88° · not " + safe + " — do not write these readings on the ticket above";
  }
  function tick() {
    cleanSheet();
    matchMeter();
  }
  setInterval(tick, 800);
  document.addEventListener("click", function () { setTimeout(tick, 60); });
})();
