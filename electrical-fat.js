/* Phone-width fat-hit for Land lugs + pin no-cool sheet on Saturday callback timer. */
(function () {
  "use strict";
  function _elPhone() {
    try {
      if (window.LtElectricalPhone && window.LtElectricalPhone.deferFat) return true;
      return !!(window.matchMedia && window.matchMedia("(max-width:480px)").matches);
    } catch (_) { return false; }
  }
  /* On phone: skip pinSlip interval (DOM thrash) — fat-hit still works via pointerup */
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
      "#electrical-root .el-lugs{gap:10px}}" +
      ".el-callback-slip{margin:8px 0 0;padding:8px 10px;border-left:3px solid #CE0034;background:#1a1410;color:#f7f3ea;font-size:13px;line-height:1.35}" +
      ".el-callback-slip span{display:block;margin-top:4px;color:#d8cbb0;font-size:12px}";
    document.head.appendChild(s);
  }
  function pinSlip() {
    var bar = document.getElementById("el-defuse-bar");
    if (!bar) return;
    var slip = document.getElementById("el-callback-slip");
    if (!slip) {
      slip = document.createElement("div");
      slip.id = "el-callback-slip";
      slip.className = "el-callback-slip";
      var brief = bar.querySelector("#el-job-brief");
      if (brief && brief.parentNode) brief.parentNode.insertBefore(slip, brief.nextSibling);
      else bar.appendChild(slip);
    }
    var now = document.querySelector("#el-ts .el-ts-step.now");
    var title = now ? (now.querySelector("strong") || {}).textContent || "Walk the string" : "Walk Y through the safeties";
    var say = now ? (now.querySelector("p") || {}).textContent || "Meter gold, then the dark box." : "Meter gold, then the dark box. Don't shotgun.";
    slip.innerHTML = "<strong>NO-COOL SHEET</strong> · " + title + "<span>" + say + "</span>";
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
  if (!_elPhone()) setInterval(pinSlip, 400);
})();
