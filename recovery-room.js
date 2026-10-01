/* Allstars Recovery photo bench plain-src loader v6 */
(function () {
  "use strict";
  var n = 0, total = 19;
  function boot() {
    var src = window.__LT_RC_SRC;
    if (!src) return;
    try {
      var s = document.createElement("script");
      s.text = src;
      document.head.appendChild(s);
    } catch (e) {
      console.error("Recovery boot failed", e);
      var root = document.getElementById("recovery-root");
      if (root) root.textContent = "Recovery room failed to load. Hard-refresh.";
    }
  }
  function next() {
    if (n >= total) { boot(); return; }
    var s = document.createElement("script");
    s.src = "recovery-room.s" + n + ".js?v=7";
    s.onload = function () { n += 1; next(); };
    s.onerror = function () {
      console.error("rc src chunk fail", n);
      var root = document.getElementById("recovery-root");
      if (root) root.textContent = "Recovery chunk " + n + " missing. Hard-refresh.";
    };
    document.head.appendChild(s);
  }
  next();
})();
