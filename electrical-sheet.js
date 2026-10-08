/* Shop-floor no-cool law on the ladder. Loads after electrical.js. v22 */
(function () {
  var proved = {};
  var painting = false;
  var NAMES = /No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Heat pump, 3A/i;
  function ticketKey() {
    var slip = document.getElementById("el-callback-slip");
    var title = document.querySelector(".el-job-title, #el-job-title, .el-call-title");
    var blob = ((slip && slip.textContent) || "") + " " + ((title && title.textContent) || "");
    var m = blob.match(NAMES);
    if (m) return m[0];
    var armed = document.body && document.body.innerText ? document.body.innerText : "";
    m = armed.match(NAMES);
    return (m && m[0]) || "pending";
  }
  function partName(box) {
    if (!box) return "";
    var raw = (box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || "");
    return String(raw).replace(/\s+/g, " ").trim().slice(0, 42);
  }
  function stampAcross() {
    var n = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    var chips = document.querySelectorAll(".el-across-chip");
    for (var i = 0; i < chips.length; i++) {
      if (!n || chips[i].parentNode !== n) chips[i].parentNode.removeChild(chips[i]);
    }
    if (!n) return;
    var who = partName(n);
    if (!/float|high-pressure|\bHPC\b|low-pressure|\bLPC\b/i.test(who)) return;
    if (n.querySelector(".el-across-chip")) return;
    var chip = document.createElement("small");
    chip.className = "el-across-chip";
    chip.textContent = "~27 V across";
    chip.title = "RED on the inlet, COM on the outlet. The 0.0 V on the box is outlet to C — not across the open.";
    n.appendChild(chip);
  }
  setInterval(stampAcross, 700);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stampAcross);
  else stampAcross();
})();
