/* Shop-floor copy override — callback talks meter and sheet, not bombs */
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
    var st = document.getElementById("el-status");
    if (st) {
      var t = st.textContent || "";
      if (/Defused/i.test(t)) t = t.replace(/Defused\.?/i, "Callback closed.");
      if (/Gauges of God/i.test(t)) t = "Callback closed. Safety string proved. Parts stay LEFT.";
      if (/callback is still armed/i.test(t)) {
        t = t.replace(/callback is still armed\. Cut the open, not the live\./i, "callback is still open. Isolate the open, not the live.");
      }
      if (t !== st.textContent) st.textContent = t;
    }
    var win = document.getElementById("el-win");
    if (win) {
      var brow = win.querySelector(".eyebrow");
      if (brow && /Defused/i.test(brow.textContent || "")) brow.textContent = "Callback closed";
      var h = win.querySelector("h2");
      if (h && /GAUGES OF GOD|Gauges of God/i.test(h.textContent || "")) h.textContent = "NO-COOL CLOSED";
      var msg = win.querySelector(".el-overlay-msg");
      if (msg && /Gauges of God/i.test(msg.textContent || "")) {
        msg.textContent = "You found the open with the meter. Prove it, write the sheet, parts stay LEFT.";
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrub);
  } else {
    scrub();
  }
  setInterval(scrub, 800);
})();
