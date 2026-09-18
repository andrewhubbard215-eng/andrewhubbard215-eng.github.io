/* Electrical phone OOM lighten — Follow the call / Land lugs survive ~390px under memory pressure.
   Do NOT load electrical-fat.js. Strip heavy imgs. Hide HUB docks. Lazy-init diagrams. */
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

  var HEAVY_RE =
    /(hub-portrait|jesus\.png|parts\/|lincoln-tech|garage\.jpg|starr\.jpg|arena\.jpg|engle\.jpg|hoodgun|falcon|gauges\.png|dmm\.png)/i;

  function stripImg(img) {
    if (!img || img.tagName !== "IMG") return;
    var src = img.getAttribute("src") || "";
    if (!src || src.indexOf("data:") === 0) return;
    if (HEAVY_RE.test(src) || src.length > 8) {
      if (!img.getAttribute("data-el-src")) img.setAttribute("data-el-src", src);
      img.setAttribute("src", TINY);
      img.removeAttribute("srcset");
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      img.style.maxWidth = "36px";
      img.style.maxHeight = "36px";
      img.style.objectFit = "contain";
      img.style.opacity = "0.35";
    }
  }

  function hideHubChrome(root) {
    if (!root) return;
    try {
      root.querySelectorAll(
        ".hub-chip, .hub-ai-dock, #hub-ai, .el-win-jesus, .el-guide > img, .hub-chip-av, [data-hubai-toggle]"
      ).forEach(function (n) {
        n.style.display = "none";
      });
      root.querySelectorAll("#el-win img, #el-guide img, .el-dmm-img, .el-win-jesus").forEach(function (n) {
        stripImg(n);
        n.style.display = "none";
      });
    } catch (_) {}
  }

  function stripTree(root) {
    if (!root || !isPhone()) return;
    try {
      root.querySelectorAll("img").forEach(stripImg);
      hideHubChrome(root);
    } catch (_) {}
  }

  function killFatScripts() {
    if (!isPhone()) return;
    try {
      window.LtElectricalPhone = window.LtElectricalPhone || {};
      window.LtElectricalPhone.deferFat = true;
      window.LtElectricalPhone.light = true;
      document.querySelectorAll('script[src*="electrical-fat"]').forEach(function (s) {
        try {
          s.parentNode && s.parentNode.removeChild(s);
        } catch (_) {}
      });
      if (!window.__elFatBlockInject) {
        window.__elFatBlockInject = true;
        var _append = Element.prototype.appendChild;
        Element.prototype.appendChild = function (node) {
          try {
            if (
              node &&
              node.tagName === "SCRIPT" &&
              node.src &&
              /electrical-fat/i.test(node.src) &&
              isPhone()
            ) {
              return node;
            }
          } catch (_) {}
          return _append.apply(this, arguments);
        };
      }
    } catch (_) {}
  }

  function deferFat() {
    if (!isPhone()) return;
    try {
      if (window.__elFatDeferred) return;
      window.__elFatDeferred = true;
      window.LtElectricalPhone = window.LtElectricalPhone || {};
      window.LtElectricalPhone.deferFat = true;
      killFatScripts();
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

  function lazyDiagrams(root) {
    if (!root || !isPhone()) return;
    try {
      var heavy = root.querySelectorAll(".el-schematic svg, .el-ladder-art, canvas.el-heavy");
      heavy.forEach(function (n) {
        if (n.getAttribute("data-el-lazy") === "1") return;
        n.setAttribute("data-el-lazy", "1");
        n.style.display = "none";
      });
      if (heavy.length && !root.querySelector("#el-lazy-diagram-btn")) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.id = "el-lazy-diagram-btn";
        btn.className = "btn";
        btn.textContent = "Show diagram (uses more memory)";
        btn.style.cssText = "margin:6px 0";
        btn.onclick = function () {
          root.querySelectorAll("[data-el-lazy='1']").forEach(function (n) {
            n.style.display = "";
          });
          btn.remove();
        };
        var main = root.querySelector(".el-main") || root;
        main.insertBefore(btn, main.firstChild);
      }
    } catch (_) {}
  }

  function lightenOpen() {
    if (!isPhone()) return;
    deferFat();
    killFatScripts();
    noPreloadCombat();
    var root = document.getElementById("electrical-root");
    var screen = document.getElementById("screen-electrical");
    stripTree(root);
    stripTree(screen);
    hideHubChrome(document.body);
    lazyDiagrams(root);
    if (root) {
      try {
        var meter = root.querySelector(".el-meter");
        if (meter) {
          meter.querySelectorAll("img").forEach(function (i) {
            stripImg(i);
            i.style.display = "none";
          });
        }
        root.querySelectorAll(".sb-palette img, .brand-bar img").forEach(stripImg);
      } catch (_) {}
    }
  }

  function wrapElectrical() {
    var API = window.ElectricalLab || window.LtElectrical || window.Electrical || window.HVACElectrical;
    if (!API || API._phoneWrapped) return;
    var orig = API.start || API.open;
    if (typeof orig !== "function") return;
    API._phoneWrapped = true;
    var wrap = function () {
      deferFat();
      killFatScripts();
      var ret = orig.apply(this, arguments);
      try {
        setTimeout(lightenOpen, 0);
        setTimeout(lightenOpen, 120);
        setTimeout(lightenOpen, 400);
        setTimeout(lightenOpen, 1200);
        var root = document.getElementById("electrical-root");
        if (root && !root._elPhoneObs && typeof MutationObserver === "function") {
          root._elPhoneObs = new MutationObserver(function () {
            if (isPhone()) {
              stripTree(root);
              lazyDiagrams(root);
            }
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
    killFatScripts();
    noPreloadCombat();
    wrapElectrical();
    onScreen();
    if (!window._elPhoneBooted) {
      window._elPhoneBooted = true;
      document.addEventListener(
        "click",
        function (e) {
          var t =
            e.target &&
            e.target.closest &&
            e.target.closest(
              '[data-mode="electrical"], [data-mode="elguide"], [data-mode="defusal"], .el-mode-btn'
            );
          if (t) {
            setTimeout(lightenOpen, 30);
            setTimeout(lightenOpen, 300);
            setTimeout(wrapElectrical, 0);
          }
        },
        true
      );
      setInterval(function () {
        wrapElectrical();
        onScreen();
        killFatScripts();
      }, 2500);
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setTimeout(boot, 200);
  setTimeout(boot, 800);
})();
