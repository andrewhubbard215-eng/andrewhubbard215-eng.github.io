/* v3.5.233 — restore #sandbox-root after Service Hook gauges park; clear gauge-run latch. */
(function () {
  "use strict";
  function restoreBayHome() {
    var home = document.getElementById("screen-sandbox");
    var root = document.getElementById("sandbox-root");
    var host = document.getElementById("svc-system-host");
    if (!home || !root) return;
    if (root.parentNode !== home) home.appendChild(root);
    if (host && !host.contains(root)) {
      host.innerHTML =
        '<p class="lede" style="padding:12px 16px">System bay — ticket rides the slim rail. Hook gauges, read SH/SC on the manifold, system stays clickable.</p>';
    }
    try { document.documentElement.removeAttribute("data-lt-gauge-run"); } catch (e) {}
  }
  window.ltRestoreSandboxBay = restoreBayHome;
  function wireHub() {
    var hubBtn = document.getElementById("btn-svc-hub");
    if (!hubBtn || hubBtn.dataset.bayRestore === "233") return;
    hubBtn.dataset.bayRestore = "233";
    hubBtn.addEventListener("click", function () { restoreBayHome(); }, true);
  }
  var _start = window.ltStartSandbox;
  if (typeof _start === "function" && !_start._ltBayRestore) {
    window.ltStartSandbox = function () {
      restoreBayHome();
      return _start.apply(this, arguments);
    };
    window.ltStartSandbox._ltBayRestore = true;
  }
  function boot() {
    wireHub();
    setInterval(function () {
      wireHub();
      if (typeof window.ltStartSandbox === "function" && !window.ltStartSandbox._ltBayRestore) {
        var s = window.ltStartSandbox;
        window.ltStartSandbox = function () {
          restoreBayHome();
          return s.apply(this, arguments);
        };
        window.ltStartSandbox._ltBayRestore = true;
      }
    }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
