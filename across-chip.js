/* Open safety chip. 0.0 V on the box is outlet to C. Across the open is ~27 V. */
(function () {
  function partName(box) {
    if (!box) return "";
    return String(box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || "").replace(/\s+/g, " ").trim();
  }
  function stamp() {
    var n = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    var chips = document.querySelectorAll(".el-across-chip");
    for (var i = 0; i < chips.length; i++) {
      if (!n || chips[i].parentNode !== n) chips[i].parentNode.removeChild(chips[i]);
    }
    if (!n) return;
    var who = partName(n);
    if (!/float|hpc|lpc|high-pressure|low-pressure/i.test(who)) return;
    if (n.querySelector(".el-across-chip")) return;
    var chip = document.createElement("small");
    chip.className = "el-across-chip";
    chip.textContent = "~27 V across";
    chip.title = "RED on the inlet, COM on the outlet. The 0.0 V on the box is outlet to C — not across the open.";
    n.appendChild(chip);
  }
  setInterval(stamp, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
