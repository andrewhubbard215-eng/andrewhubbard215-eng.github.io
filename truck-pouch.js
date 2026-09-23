/* truck-pouch split loader - atob assemble then eval */
(function () {
  "use strict";
  var N = 8, loaded = 0, booted = false;
  function boot() {
    if (booted || loaded !== N) return;
    var parts = window.__TP_B64;
    if (!parts) return;
    var s = "";
    for (var i = 0; i !== N; i++) {
      if (typeof parts[i] !== "string") return;
      s += parts[i];
    }
    booted = true;
    try { (0, eval)(atob(s)); } catch (e) { console.error("truck-pouch boot", e); }
  }
  Array.from({length: N}, function (_, idx) { return idx; }).forEach(function (idx) {
    var el = document.createElement("script");
    el.src = "truck-pouch.p" + idx + ".js?v=4";
    el.async = false;
    el.onload = function () { loaded += 1; boot(); };
    el.onerror = function () { console.error("truck-pouch part fail", idx); };
    (document.head || document.documentElement).appendChild(el);
  });
})();
