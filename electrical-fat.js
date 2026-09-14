/* Phone-width fat-hit for Land lugs. Evening SAVE. */
(function () {
  "use strict";
  var PAD = 32;
  function elScreenOn() {
    var s = document.getElementById("screen-electrical");
    return !!(s && s.classList.contains("active"));
  }
  function nearestLug(x, y) {
    var best = null, bd = 1e9;
    document.querySelectorAll("#electrical-root [data-lug]").forEach(function (b) {
      var r = b.getBoundingClientRect();
      if (x < r.left - PAD || x > r.right + PAD || y < r.top - PAD || y > r.bottom + PAD) return;
      var d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < bd) { bd = d; best = b; }
    });
    return best;
  }
  function injectCss() {
    if (document.getElementById("el-fat-css")) return;
    var s = document.createElement("style");
    s.id = "el-fat-css";
    s.textContent =
      "@media (max-width:820px){#electrical-root .el-lug{min-width:44px;min-height:44px;touch-action:manipulation}" +
      "#electrical-root .el-lugs{gap:10px}}";
    document.head.appendChild(s);
  }
  document.addEventListener("pointerup", function (e) {
    if (!elScreenOn()) return;
    var hit = document.elementFromPoint(e.clientX, e.clientY);
    if (hit && hit.closest && hit.closest("#electrical-root [data-lug]")) return;
    var lug = nearestLug(e.clientX, e.clientY);
    if (!lug) return;
    try {
      lug.dispatchEvent(new PointerEvent("pointerup", {
        bubbles: true, cancelable: true,
        clientX: e.clientX, clientY: e.clientY,
        pointerId: e.pointerId || 1, pointerType: e.pointerType || "touch"
      }));
    } catch (err) {
      lug.click();
    }
  }, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", injectCss);
  else injectCss();
})();
