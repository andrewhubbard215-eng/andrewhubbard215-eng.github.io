/* Allstars Recovery photo bench gzip loader */
(function () {
  "use strict";
  var n = 0, total = 2;
  function boot() {
    var b64 = window.__LT_RC_GZ;
    if (!b64) return;
    function fail(e) {
      console.error("Recovery boot failed", e);
      var root = document.getElementById("recovery-root");
      if (root) root.textContent = "Recovery room failed to load. Hard-refresh.";
    }
    try {
      var bin = Uint8Array.from(atob(b64), function (c) { return c.charCodeAt(0); });
      if (typeof DecompressionStream !== "function") { fail(new Error("no DecompressionStream")); return; }
      new Response(new Blob([bin]).stream().pipeThrough(new DecompressionStream("gzip")))
        .text()
        .then(function (src) {
          var s = document.createElement("script");
          s.text = src;
          document.head.appendChild(s);
        })
        .catch(fail);
    } catch (e) { fail(e); }
  }
  function next() {
    if (n >= total) { boot(); return; }
    var s = document.createElement("script");
    s.src = "recovery-room.g" + n + ".js?v=5";
    s.onload = function () { n += 1; next(); };
    s.onerror = function () { console.error("rc gz chunk fail", n); };
    document.head.appendChild(s);
  }
  next();
})();
