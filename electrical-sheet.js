/* Shop-floor no-cool law on the ladder. Loads after electrical.js */
(function () {
  function paint() {
    var k = document.querySelector(".el-ladder-kicker");
    if (k && k.id !== "el-ts-note") {
      k.textContent =
        "Meter first. Top rail is 240. Bottom is the 24V cool string. Don't slap a cap until T1 is hot. Don't jump the float.";
    }
    var ol = document.getElementById("el-ts");
    if (ol && !document.getElementById("el-ts-note")) {
      var note = document.createElement("p");
      note.id = "el-ts-note";
      note.className = "el-ladder-kicker";
      note.textContent =
        "No-cool sheet: write the open before you guess the part. Isolate it. Parts stay LEFT on the bench.";
      ol.parentNode.insertBefore(note, ol);
    }
  }
  function boot() {
    var root = document.getElementById("electrical-root") || document.body;
    if (root && !root.dataset.sheetObs) {
      root.dataset.sheetObs = "1";
      new MutationObserver(paint).observe(root, { childList: true, subtree: true });
    }
    paint();
    setInterval(paint, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
