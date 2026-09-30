/* Lane A park overlay — keep sandbox on the service ticket */
(function () {
  "use strict";
  function parkBayOnService() {
    var host = document.getElementById("svc-system-host");
    var root = document.getElementById("sandbox-root");
    if (host && root && root.parentNode !== host) {
      host.innerHTML = "";
      host.appendChild(root);
    }
    var sand = document.getElementById("screen-sandbox");
    if (sand) {
      sand.classList.remove("active");
      sand.classList.remove("screen-on");
    }
    var svc = document.getElementById("screen-service");
    if (!svc) return;
    document.querySelectorAll(".screen").forEach(function (s) {
      if (s === svc) return;
      s.classList.remove("active");
      s.classList.remove("screen-on");
    });
    svc.classList.add("active");
    svc.classList.add("screen-on");
    svc.style.display = "";
  }
  function wireHook() {
    var btn = document.getElementById("svc-hook");
    if (!btn || btn.dataset.parkWired === "1") return;
    btn.dataset.parkWired = "1";
    btn.addEventListener("click", function () {
      window._ltKeepServiceBay = true;
      var n = 0;
      var t = setInterval(function () {
        n++;
        parkBayOnService();
        var root = document.getElementById("sandbox-root");
        if ((root && root.parentNode && root.parentNode.id === "svc-system-host" && n > 8) || n > 50) {
          clearInterval(t);
          parkBayOnService();
        }
      }, 80);
    }, true);
  }
  function boot() {
    wireHook();
    setInterval(function () {
      wireHook();
      if (window._ltKeepServiceBay) parkBayOnService();
    }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
