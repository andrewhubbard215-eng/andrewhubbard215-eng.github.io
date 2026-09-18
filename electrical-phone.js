/* Electrical phone OOM lighten — Follow the call / Land lugs survive ~390px under memory pressure.
   Strips heavy imgs, defers electrical-fat, skips combat art preload. Land-lugs chip still works. */
(function () {
  "use strict";

  function isPhone() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 480px)").matches);
    } catch (_) {
      return typeof window !== "undefined" && window.innerWidth && window.innerWidth <= 480;
    }
  }

  var TINY =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  var HEAVY_RE = /(hub-portrait|jesus\.png|parts\/|lincoln-tech|garage\.jpg|starr\.jpg|arena\.jpg|engle\.jpg|hoodgun|falcon|gauges\.png)/i;

  function stripImg(img) {
    if (!img || img.tagName !== "IMG") return;
    var src = img.getAttribute("src") || "";
    if (!src || src.indexOf("data:") === 0) return;
    if (HEAVY_RE.test(src) || src.length > 8) {
      if (!img.getAttribute("data-el-src")) img.setAttribute("data-el-src", src);
      img.setAttribute("src", TINY);
      img.setAttribute("loading", "lazy");
      img.style.maxWidth = "48px";
      img.style.maxHeight = "48px";
      img.style.objectFit = "contain";
    }
  }

  function stripTree(root) {
    if (!root || !isPhone()) return;
    try {
      root.querySelectorAll("img").forEach(stripImg);
      root.querySelectorAll(".hub-chip, .hub-ai-dock, #hub-ai, .el-win-jesus, .el-guide > img").forEach(function (n) {
        n.style.display = "none";
      });
      root.querySelectorAll("#el-win img, #el-guide img, .el-dmm-img").forEach(function (n) {
        stripImg(n);
        n.style.display = "none";
      });
    } catch (_) {}
  }

  function deferFat() {
    if (!isPhone()) return;
    try {
      if (window.__elFatDeferred) return;
      window.__elFatDeferred = true;
      window.LtElectricalPhone = window.LtElectricalPhone || {};
      window.LtElectricalPhone.deferFat = true;
    } catch (_) {}
  }

  function noPreloadCombat() {
    if (!isPhone()) return;
    try {
      document.querySelectorAll('link[rel="preload"][as="image"], link[rel="prefetch"]').forEach(function (l) {
        var href = l.getAttribute("href") || "";
        if (HEAVY_RE.test(href)) l.parentNode && l.parentNode.removeChild(l);
      });
    } catch (_) {}
  }

  function lightenOpen() {
    if (!isPhone()) return;
    deferFat();
    noPreloadCombat();
    var root = document.getElementById("electrical-root");
    var screen = document.getElementById("screen-electrical");
    stripTree(root);
    stripTree(screen);
    if (root) {
      try {
        var meter = root.querySelector(".el-meter");
        if (meter && window.innerWidth <= 390) {
          meter.querySelectorAll("img").forEach(function (i) {
            stripImg(i);
            i.style.display = "none";
          });
        }
      } catch (_) {}
    }
  }

  function wrapElectrical() {
    var API = window.ElectricalLab || window.LtElectrical || window.Electrical;
    if (!API || API._phoneWrapped) return;
    var orig = API.start || API.open;
    if (typeof orig !== "function") return;
    API._phoneWrapped = true;
    var wrap = function () {
      var ret = orig.apply(this, arguments);
      try {
        setTimeout(lightenOpen, 0);
        setTimeout(lightenOpen, 200);
        setTimeout(lightenOpen, 800);
        var root = document.getElementById("electrical-root");
        if (root && !root._elPhoneObs && typeof MutationObserver === "function") {
          root._elPhoneObs = new MutationObserver(function () {
            if (isPhone()) stripTree(root);
          });
          root._elPhoneObs.observe(root, { childList: true, subtree: true });
        }
      } catch (_) {}
      return ret;
    };
    if (API.start) API.start = wrap;
    if (API.open) API.open = wrap;
  }

  function onScreen() {
    var s = document.getElementById("screen-electrical");
    if (s && s.classList.contains("active")) lightenOpen();
  }

  function boot() {
    if (!isPhone()) return;
    deferFat();
    noPreloadCombat();
    wrapElectrical();
    onScreen();
    if (!window._elPhoneBooted) {
      window._elPhoneBooted = true;
      document.addEventListener(
        "click",
        function (e) {
          var t = e.target && e.target.closest && e.target.closest('[data-mode="electrical"], [data-mode="elguide"], [data-mode="defusal"]');
          if (t) {
            setTimeout(lightenOpen, 50);
            setTimeout(lightenOpen, 400);
            setTimeout(wrapElectrical, 0);
          }
        },
        true
      );
      setInterval(function () {
        wrapElectrical();
        onScreen();
      }, 2000);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 500);
})();
