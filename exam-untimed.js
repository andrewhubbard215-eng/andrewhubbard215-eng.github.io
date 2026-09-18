/* All-Star Exam — force untimed Universal path; keep Next on screen; 18/25 section stamp */
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
      try {
        var root = host || document.getElementById("quiz-root");
        if (root) {
          root.querySelectorAll(".qa-timer-bar, .qa-timer-text, .qa-exam-time").forEach(function (el) {
            el.style.display = "none";
          });
          var tip = document.createElement("p");
          tip.className = "qa-untimed-banner";
          tip.style.cssText = "margin:8px 0;font-size:13px;opacity:.9";
          tip.textContent = "All-Star Exam is UNTIMED. Pass a section at 18/25. Next stays on screen — no rush clock.";
          var bar = root.querySelector(".qa-exam-bar, .qa-head, header");
          if (bar && bar.parentNode) bar.parentNode.insertBefore(tip, bar.nextSibling);
          else root.insertBefore(tip, root.firstChild);
          var mo = new MutationObserver(function () {
            root.querySelectorAll(".qa-next, button.qa-next").forEach(function (b) {
              b.classList.remove("hidden");
              b.style.display = "";
              b.style.visibility = "visible";
            });
          });
          mo.observe(root, { childList: true, subtree: true });
        }
      } catch (e) {}
      return api;
    };
    qa._untimedPatched = true;
    return true;
  }
  var n = 0;
  var t = setInterval(function () { if (patch() || ++n > 40) clearInterval(t); }, 250);
  document.addEventListener("DOMContentLoaded", patch);
})();
