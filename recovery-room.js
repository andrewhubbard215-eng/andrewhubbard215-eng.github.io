/* Allstars Recovery photo bench plain-src loader v5 */
(function () {
  "use strict";
  var n = 0, total = 4;
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
    s.src = "recovery-room.s" + n + ".js?v=5";
    s.onload = function () { n += 1; next(); };
    s.onerror = function () { console.error("rc src chunk fail", n); };
    document.head.appendChild(s);
  }
  next();
})();
