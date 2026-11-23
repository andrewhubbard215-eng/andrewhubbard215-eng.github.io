/* HVAC Allstars — guided lugs: "Next device" stays locked until neutral (N) and ground (G) are landed on this device */
(function () {
  "use strict";
  var MSG = "Land N + G first";
  var WHY = "Land neutral (N) and ground (G) on this device first";
  function check() {
    var btn = document.getElementById("el-zoom-next");
    var need = document.getElementById("el-zoom-need");
    if (!btn || !need) return;
    var miss = false;
    var items = need.querySelectorAll("li");
    for (var i = 0; i < items.length; i++) {
      var li = items[i];
      if (li.classList.contains("miss") && /off-white|green/i.test(li.textContent || "")) miss = true;
    }
    if (miss) {
      if (!btn.disabled) btn.disabled = true;
      if (btn.textContent !== MSG) btn.textContent = MSG;
      if (btn.title !== WHY) btn.title = WHY;
    } else {
      if (btn.disabled) btn.disabled = false;
      if (btn.textContent === MSG) btn.textContent = "Next device →";
      if (btn.title === WHY) btn.title = "";
    }
  }
  var obs = new MutationObserver(check);
  function start() {
    if (document.body) obs.observe(document.body, { childList: true, subtree: true });
    check();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
