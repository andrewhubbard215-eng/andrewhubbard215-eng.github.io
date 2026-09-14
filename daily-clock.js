/* Clock today's practice when a tech taps a Daily Training Aid drill. */
(function () {
  "use strict";
  function mark(drill, mode) {
    if (!window.DailyTrain || !window.DailyTrain.recordPractice) return;
    window.DailyTrain.recordPractice(drill || mode, { source: "daily" });
  }
  function bind() {
    var root = document.getElementById("daily-root");
    if (!root || root.getAttribute("data-clock-bound")) return;
    root.setAttribute("data-clock-bound", "1");
    root.addEventListener(
      "click",
      function (e) {
        var btn = e.target && e.target.closest && e.target.closest(".daily-drill");
        if (!btn) return;
        mark(btn.getAttribute("data-drill"), btn.getAttribute("data-mode"));
      },
      true
    );
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  setInterval(bind, 1500);
})();
