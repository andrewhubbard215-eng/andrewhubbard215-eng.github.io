/* Shop floor: phone clip was hiding the chart lines under SH/SC. */
(function () {
  "use strict";
  var IDS = ["sb-sst", "sb-sl", "sb-etd", "sb-sct", "sb-ll", "sb-ctd"];
  function show() {
    if (!document.getElementById("sandbox-root")) return;
    for (var i = 0; i < IDS.length; i++) {
      var el = document.getElementById(IDS[i]);
      if (!el) continue;
      el.style.setProperty("display", "block", "important");
      el.style.setProperty("visibility", "visible", "important");
      el.style.setProperty("opacity", "1", "important");
      el.style.setProperty("height", "auto", "important");
      el.style.setProperty("max-height", "none", "important");
      el.style.setProperty("overflow", "visible", "important");
      el.style.setProperty("font", "600 13px/1.35 ui-monospace, Consolas, monospace", "important");
      el.style.setProperty("color", "#f5e6c8", "important");
      el.style.setProperty("margin", "2px 0 4px", "important");
    }
  }
  setInterval(show, 400);
  document.addEventListener("click", function () {
    setTimeout(show, 40);
    setTimeout(show, 280);
  }, true);
  if (document.readyState === "complete") show();
  else window.addEventListener("load", show);
})();
