/* All-Star Exam — UNTIMED. Hide clock. Keep Next. 18/25 section stamp. */
(function () {
  "use strict";
  function patch() {
    var qa = window.QuizArena;
    if (!qa || qa._untimedPatched) return !!qa;
    var orig = qa.start;
    if (typeof orig !== "function") return false;
    qa.start = function (host, opts) {
      opts = opts || {};
      opts.untimed = true;
      opts.timerMax = 0;
      opts.hideTimer = true;
      var api = orig.call(this, host, opts);
      function scrub() {
        try {
          var root = host || document.getElementById("quiz-root") || document.querySelector(".qa-root, #screen-quiz");
          if (!root) return;
          root.querySelectorAll(".qa-timer-bar, .qa-timer-text, .qa-exam-time, .qa-timer").forEach(function (el) {
            el.style.display = "none";
          });
          if (!root.querySelector(".qa-untimed-banner")) {
            var tip = document.createElement("p");
            tip.className = "qa-untimed-banner";
            tip.style.cssText = "margin:8px 0;font-size:13px;opacity:.9";
            tip.textContent = "All-Star Exam is UNTIMED. Pass a section at 18/25. Next stays on screen — no rush clock.";
            var bar = root.querySelector(".qa-exam-bar, .qa-head, header, .qa-lobby");
            if (bar && bar.parentNode) bar.parentNode.insertBefore(tip, bar.nextSibling);
            else root.insertBefore(tip, root.firstChild);
          }
          root.querySelectorAll(".qa-next, button.qa-next, #qa-next").forEach(function (b) {
            b.classList.remove("hidden");
            b.style.display = "";
            b.style.visibility = "visible";
          });
          if (api && typeof api.stop === "function" && !api._untimedTimerKilled) {
            /* leave stop intact; timerMax already 1e9 inside arena when untimed */
            api._untimedTimerKilled = true;
          }
        } catch (e) {}
      }
      scrub();
      var mo = new MutationObserver(scrub);
      try {
        var root = host || document.getElementById("quiz-root");
        if (root) mo.observe(root, { childList: true, subtree: true });
      } catch (e) {}
      setInterval(scrub, 1000);
      return api;
    };
    qa._untimedPatched = true;
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (patch() || ++n > 40) clearInterval(t); }, 250);
  document.addEventListener("DOMContentLoaded", patch);
})();
