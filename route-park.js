/* Lane A park overlay — sandbox stays on the ticket until Shop floor. */
(function () {
  "use strict";
  function parkBayOnService() {
    if (!window._ltKeepServiceBay) return;
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
  function releasePark() {
    window._ltKeepServiceBay = false;
  }
  function nameplate410() {
    var root = document.getElementById("screen-service");
    if (!root) return;
    var nodes = root.querySelectorAll("p, span, li, div");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children && el.children.length) continue;
      var t = el.textContent || "";
      if (t.indexOf("R-22") === -1) continue;
      var next = t.replace(/R-22/g, "R-410A");
      if (next !== t) el.textContent = next;
    }
  }
  function wireHook() {
    var btn = document.getElementById("svc-hook");
    if (!btn || btn.dataset.parkWired === "2") return;
    btn.dataset.parkWired = "2";
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
  function wireLeave() {
    var shop = document.getElementById("btn-svc-hub");
    if (shop && shop.dataset.parkLeave !== "1") {
      shop.dataset.parkLeave = "1";
      shop.addEventListener("click", releasePark, true);
    }
    var locker = document.getElementById("btn-locker");
    if (locker && locker.dataset.parkLeave !== "1") {
      locker.dataset.parkLeave = "1";
      locker.addEventListener("click", releasePark, true);
    }
  }
  document.addEventListener("click", function (ev) {
    var t = ev.target && ev.target.closest ? ev.target.closest(".mode-card, #btn-svc-hub, #btn-locker") : null;
    if (!t) return;
    releasePark();
  }, true);
  function boot() {
    wireHook();
    wireLeave();
    nameplate410();
    setInterval(function () {
      wireHook();
      wireLeave();
      nameplate410();
      if (window._ltKeepServiceBay) parkBayOnService();
    }, 250);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
