/* Shop floor: Saturday meter stays on Ken's iced-filter ticket only. */
(function () {
  "use strict";
  function cleanSheet() {
    var y = document.getElementById("svc-vitals");
    if (!y) return;
    var html = y.innerHTML;
    var next = html.replace(/(?:\s*-\s*){2,}/g, " - ").replace(/\s{2,}/g, " ");
    if (next !== html) y.innerHTML = next;
  }
  function isKenAir(name, job) {
    return /ken/i.test(name) && /barber|ice|suction|filter|airflow/i.test(name + " " + job);
  }
  function matchMeter() {
    var nameEl = document.getElementById("svc-name");
    var jobEl = document.getElementById("svc-job");
    var ticket = document.querySelector(".sm-ticket");
    var wrap = document.querySelector(".sm-wrap");
    if (!nameEl || !ticket) return;
    var name = (nameEl.textContent || "").trim();
    var job = jobEl ? (jobEl.textContent || "").trim() : "";
    if (!name) return;
    var ken = isKenAir(name, job);
    if (wrap) wrap.style.display = ken ? "" : "none";
    if (!ken) return;
    ticket.innerHTML = "<strong>SATURDAY \u00b7 Ken \u2014 barbershop</strong> \u00b7 suction iced \u00b7 filter black \u00b7 ODT 88\u00b0 \u00b7 same ticket \u00b7 airflow before charge";
  }
  function tick() {
    cleanSheet();
    matchMeter();
  }
  setInterval(tick, 800);
  document.addEventListener("click", function () { setTimeout(tick, 60); });
})();
