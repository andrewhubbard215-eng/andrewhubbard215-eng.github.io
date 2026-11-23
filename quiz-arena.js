/* quiz-arena split loader — assembles tip parts then evals */
(function () {
  "use strict";
  var N = 16;
  var loaded = 0;
  var booted = false;
  function boot() {
    if (booted || loaded < N) return;
    var parts = window.__QA_PARTS;
    if (!parts) return;
    var s = "";
    for (var i = 0; i < N; i++) {
      if (typeof parts[i] !== "string") return;
      s += parts[i];
    }
    booted = true;
    try { (0, eval)(s); } catch (e) { console.error("quiz-arena boot", e); }
  }
  for (var i = 0; i < N; i++) {
    (function (idx) {
      var el = document.createElement("script");
      el.src = "quiz-arena.p" + idx + ".js?v=4";
      el.async = false;
      el.onload = function () { loaded += 1; boot(); };
      el.onerror = function () { console.error("quiz-arena part fail", idx); };
      (document.head || document.documentElement).appendChild(el);
    })(i);
  }
})();
