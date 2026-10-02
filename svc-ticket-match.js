/* Shop floor: Saturday meter stays on Ken's iced-filter ticket only.
   Sheet is complaint + nameplate weather. Do not name the black filter or the charge lecture. */
(function () {
  "use strict";
  function cleanSheet() {
    var y = document.getElementById("svc-vitals");
    if (!y) return;
    var html = y.innerHTML;
    var next = html
      .replace(/TXV:\s*charge by SC[^.]*\./gi, "")
      .replace(/Piston:\s*charge by SH[^.]*\./gi, "")
      .replace(/oil on the slab/gi, "")
      .replace(/lines cut\s*-\s*no recovery/gi, "")
      .replace(/Open to atmosphere[^-]*/gi, "")
      .replace(/oil smell\s*-\s*no recovery gear/gi, "")
      .replace(/18\" clearance gone/gi, "")
      .replace(/1\" filter black/gi, "")
      .replace(/Coil matted/gi, "")
      .replace(/(?:\s*-\s*){2,}/g, " - ")
      .replace(/\s{2,}/g, " ");
    if (next !== html) y.innerHTML = next;
  }
  function isKenAir(name, job) {
    return /ken/i.test(name) && /barber|ice|suction|filter|airflow/i.test(name + " " + job);
  }
  function kenSheet() {
    return "<strong>NO-COOL SHEET</strong> - Complaint only - <em>Nameplate</em> R-410A TXV - ODT 88\u00b0 - IDB 72\u00b0 - Run 15 min. Meter the filter and the glass before the jug. Airflow before charge.";
  }
  function matchMeter() {
    var nameEl = document.getElementById("svc-name");
    var jobEl = document.getElementById("svc-job");
    var ticket = document.querySelector(".sm-ticket");
    var wrap = document.querySelector(".sm-wrap");
    var vitals = document.getElementById("svc-vitals");
    if (!nameEl || !ticket) return;
    var name = (nameEl.textContent || "").trim();
    var job = jobEl ? (jobEl.textContent || "").trim() : "";
    if (!name) return;
    var ken = isKenAir(name, job);
    if (wrap) wrap.style.display = ken ? "" : "none";
    if (!ken) return;
    ticket.innerHTML = "<strong>SATURDAY \u00b7 Ken \u2014 barbershop</strong> \u00b7 suction iced \u00b7 ODT 88\u00b0 \u00b7 same ticket \u00b7 meter filter and glass";
    if (vitals && vitals.getAttribute("data-ken-sheet") !== "1") {
      vitals.innerHTML = kenSheet();
      vitals.setAttribute("data-ken-sheet", "1");
    } else if (vitals && /Filter black|charge by SC/i.test(vitals.textContent || "")) {
      vitals.innerHTML = kenSheet();
      vitals.setAttribute("data-ken-sheet", "1");
    }
  }
  function tick() {
    var nameEl = document.getElementById("svc-name");
    var vitals = document.getElementById("svc-vitals");
    if (nameEl && vitals && !/ken/i.test(nameEl.textContent || "")) {
      vitals.removeAttribute("data-ken-sheet");
    }
    cleanSheet();
    matchMeter();
  }
  setInterval(tick, 800);
  document.addEventListener("click", function () { setTimeout(tick, 60); });
})();
