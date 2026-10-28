/* Shop floor: sheet is complaint + nameplate weather.
   Ken: no black filter. Priya: no cold-liquid lecture. Jess: no bubble-in-glass.
   Uncle Ray: no matted-coil / high-head on the sheet.
   DIY Dave: no oil, no open-to-atmosphere on the sheet. */
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
      .replace(/18\\" clearance gone/gi, "")
      .replace(/1\\" filter black/gi, "")
      .replace(/Coil matted/gi, "")
      .replace(/High head/gi, "")
      .replace(/High amps/gi, "")
      .replace(/Liquid cold at evaporator/gi, "")
      .replace(/Bubble in glass/gi, "")
      .replace(/Long lineset/gi, "")
      .replace(/Starved zone/gi, "")
      .replace(/Weigh it in/gi, "")
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

  function isPriya(name, job) {
    return /priya/i.test(name) && /zone|office/i.test(name + " " + job);
  }
  function isJess(name, job) {
    return /jess/i.test(name) && /apartment|lineset|install|no cool/i.test(name + " " + job);
  }
  function isRay(name, job) {
    return /uncle ray/i.test(name) || (/ray/i.test(name) && /ranch|juniper/i.test(name + " " + job));
  }
  function isDave(name, job) {
    return /diy dave/i.test(name) || (/dave/i.test(name) && /garage|opened|valve/i.test(name + " " + job));
  }
  function priyaSheet() {
    return "<strong>NO-COOL SHEET</strong> - Complaint only - <em>Nameplate</em> R-410A TXV - 3-zone - ODT 90\u00b0 - conf room IDB 81\u00b0 - Other zones still pulling. Hook gauges on that zone before you call the whole system.";
  }
  function jessSheet() {
    return "<strong>NO-COOL SHEET</strong> - Complaint only - <em>Nameplate</em> R-410A TXV - factory 6.3 lb - 75 ft lineset - ODT 84\u00b0 - Two-day install. Hook gauges. High SH with low SC is not a restriction. Chart is for after you read the glass.";
  }
  function raySheet() {
    return "<strong>NO-COOL SHEET</strong> - Complaint only - <em>Nameplate</em> R-22 TXV - ODT 95\u00b0 - IDB 80\u00b0 - ranch, runs all day, never catches up. Hook gauges. Airflow and the coil face before the jug.";
  }
  function daveSheet() {
    return "<strong>NO-COOL SHEET</strong> - Complaint only - <em>Nameplate</em> R-410A TXV - ODT 86\u00b0 - garage. Customer wants a recharge. Hook gauges. Numbers live on the manifold \u2014 do not charge from the sheet.";
  }
  function paintSheet(vitals, key, html) {
    if (!vitals) return;
    if (vitals.getAttribute(key) !== "1") {
      vitals.innerHTML = html;
      vitals.setAttribute(key, "1");
    }
  }
  function clearSheetFlags(vitals, keep) {
    if (!vitals) return;
    ["data-priya-sheet", "data-jess-sheet", "data-ken-sheet", "data-ray-sheet", "data-dave-sheet"].forEach(function (k) {
      if (k !== keep) vitals.removeAttribute(k);
    });
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
    if (isPriya(name, job)) {
      clearSheetFlags(vitals, "data-priya-sheet");
      ticket.innerHTML = "<strong>PRIYA \u00b7 office</strong> \u00b7 one zone dead \u00b7 ODT 90\u00b0 \u00b7 conf room 81\u00b0 \u00b7 meter that zone";
      paintSheet(vitals, "data-priya-sheet", priyaSheet());
      return;
    }
    if (isJess(name, job)) {
      clearSheetFlags(vitals, "data-jess-sheet");
      ticket.innerHTML = "<strong>JESS \u00b7 apartment</strong> \u00b7 no cool after install \u00b7 factory 6.3 lb \u00b7 75 ft \u00b7 ODT 84\u00b0 \u00b7 hook gauges";
      paintSheet(vitals, "data-jess-sheet", jessSheet());
      return;
    }
    if (isRay(name, job)) {
      clearSheetFlags(vitals, "data-ray-sheet");
      ticket.innerHTML = "<strong>UNCLE RAY \u00b7 ranch</strong> \u00b7 never catches up \u00b7 ODT 95\u00b0 \u00b7 IDB 80\u00b0 \u00b7 hook gauges";
      paintSheet(vitals, "data-ray-sheet", raySheet());
      return;
    }
    if (isDave(name, job)) {
      clearSheetFlags(vitals, "data-dave-sheet");
      ticket.innerHTML = "<strong>DIY DAVE \u00b7 garage</strong> \u00b7 wants a recharge \u00b7 ODT 86\u00b0 \u00b7 hook gauges";
      paintSheet(vitals, "data-dave-sheet", daveSheet());
      return;
    }
    if (vitals) clearSheetFlags(vitals, null);
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
    cleanSheet();
    matchMeter();
  }
  setInterval(tick, 800);
  document.addEventListener("click", function () { setTimeout(tick, 60); });
})();
