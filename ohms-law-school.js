/* Ohm's Law arcade loader — Hub: Twist V/I/R · smoke meter · Easy→Spicy tickets */
(function () {
  "use strict";
  function load(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.async = false;
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error(src)); };
      document.head.appendChild(s);
    });
  }
  function base() {
    var sc = document.currentScript;
    if (sc && sc.src) return sc.src.replace(/[^\/]+$/, "");
    return "";
  }
  var b = base();
  load(b + "ohms-law-arcade-bench.js?v=1")
    .then(function () { return load(b + "ohms-law-arcade-tickets.js?v=1"); })
    .then(function () { return load(b + "ohms-law-arcade-play.js?v=1"); })
    .catch(function (e) { console.warn("Ohm arcade load", e); });
})();
