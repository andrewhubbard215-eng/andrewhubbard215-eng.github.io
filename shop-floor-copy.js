/* Shop-floor copy override — no combat on vehicle cards */
(function () {
  function scrub() {
    document.querySelectorAll("#arena-copy, .arena-copy, [data-arena-copy]").forEach(function (el) {
      var t = el.textContent || "";
      if (/combat/i.test(t)) {
        el.textContent = /falcon/i.test(t)
          ? "Shop truck \u00b7 keep the gauges on the seat, not the yard"
          : "HVAC service van \u00b7 roof racks \u00b7 recovery tank \u00b7 parts LEFT";
      }
    });
  }
  scrub();
  setInterval(scrub, 800);
})();
