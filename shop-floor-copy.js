/* Shop-floor copy override — no combat on vehicle cards */
(function () {
  function scrub() {
    var title = document.getElementById("arena-title");
    if (title && /arena/i.test(title.textContent || "")) {
      title.textContent = (title.textContent || "").replace(/\s*arena/i, " — shop truck");
    }
    document.querySelectorAll("#arena-copy, .arena-copy, [data-arena-copy]").forEach(function (el) {
      var t = el.textContent || "";
      if (/combat|twisted yard/i.test(t)) {
        el.textContent = /falcon/i.test(t)
          ? "Shop truck \u00b7 gauges on the seat, not the yard \u00b7 parts LEFT"
          : "HVAC service van \u00b7 roof racks \u00b7 recovery tank \u00b7 parts LEFT";
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrub);
  } else {
    scrub();
  }
  setInterval(scrub, 800);
})();
