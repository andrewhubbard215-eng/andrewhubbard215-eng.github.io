/* Shop-floor: keep charging SOP collapsed so cycle + parts stay visible. */
(function () {
  function collapseCharge() {
    var w = document.getElementById("sb-charge-win");
    if (w && !w.dataset.ltFloorOnce) {
      w.classList.add("collapsed");
      w.dataset.ltFloorOnce = "1";
    }
  }
  var obs = new MutationObserver(collapseCharge);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", collapseCharge);
  } else {
    collapseCharge();
  }
})();
