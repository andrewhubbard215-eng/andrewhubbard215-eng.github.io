/* Open safety chip. Meter on the switch to C is the outlet. Across the open is ~27 V. */
(function () {
  function partName(box) {
    if (!box) return "";
    return String(box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || "").replace(/\s+/g, " ").trim();
  }
  function isSafety(who) {
    return /float|hpc|lpc|high-pressure|low-pressure|high-limit|\blimit\b/i.test(who);
  }
  function stamp() {
    var n = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    var chips = document.querySelectorAll(".el-across-chip");
    for (var i = 0; i < chips.length; i++) {
      if (!n || chips[i].parentNode !== n) chips[i].parentNode.removeChild(chips[i]);
    }
    if (n) {
      var who = partName(n);
      if (isSafety(who) && !n.querySelector(".el-across-chip")) {
        var chip = document.createElement("small");
        chip.className = "el-across-chip";
        chip.textContent = "~27 V across";
        chip.title = "RED on the inlet, COM on the outlet. Outlet to C is 0.0 V. 0 V across means the contacts are closed.";
        n.appendChild(chip);
      }
    }
    var lcd = document.getElementById("el-lcd");
    var red = document.getElementById("el-redn");
    var note = document.getElementById("el-across-meter");
    var redName = red ? red.textContent : "";
    var reading = lcd ? parseFloat(lcd.textContent) : NaN;
    var onSwitch = /lpc|hpc|float|limit|pressure/i.test(redName);
    var show = !!(n && onSwitch && reading === 0);
    if (!note && lcd && lcd.parentNode) {
      note = document.createElement("p");
      note.id = "el-across-meter";
      note.className = "el-ladder-kicker";
      lcd.parentNode.appendChild(note);
    }
    if (note) {
      note.textContent = show
        ? "0.0 VAC is outlet to C. Across this open is 27.2 VAC (inlet to outlet). Do not call the contacts closed."
        : "";
      note.style.display = show ? "" : "none";
    }
  }
  setInterval(stamp, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
