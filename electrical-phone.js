/* Electrical phone OOM gate — ≤480px NEVER full electrical.js paint.
   Prefer electrical-lite.js (R/C/Y/G/W chips + land targets + Next/Hub). */
(function () {
  "use strict";

  function isPhone() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 480px)").matches);
    } catch (_) {
      return typeof window !== "undefined" && window.innerWidth && window.innerWidth <= 480;
    }
  }

  function markLite() {
    window.LtElectricalPhone = window.LtElectricalPhone || {};
    window.LtElectricalPhone.deferFat = true;
    window.LtElectricalPhone.lite = true;
    window.LtElectricalPhone.light = true;
  }

  function killFatScripts() {
    if (!isPhone()) return;
    try {
      markLite();
      document.querySelectorAll('script[src*="electrical-fat"], script[src*="electrical.js"]').forEach(function (s) {
        var src = s.getAttribute("src") || "";
        if (/electrical-lite/i.test(src)) return;
        if (/electrical\.js/i.test(src) || /electrical-fat/i.test(src)) {
          try { s.parentNode && s.parentNode.removeChild(s); } catch (_) {}
        }
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
              isPhone() &&
              (/electrical-fat/i.test(node.src) ||
                (/electrical\.js/i.test(node.src) && !/electrical-lite/i.test(node.src) && !/electrical-phone/i.test(node.src) && !/electrical-sheet/i.test(node.src)))
            ) {
              return node;
            }
          } catch (_) {}
          return _append.apply(this, arguments);
        };
      }
    } catch (_) {}
  }

  function ensureLite(cb) {
    if (!isPhone()) return;
    markLite();
    killFatScripts();
    if (window.LtElectricalLite && window.LtElectricalLite.start) {
      window.ElectricalLab = window.LtElectricalLite;
      window.HVACElectrical = window.LtElectricalLite;
      if (cb) cb();
      return;
    }
    if (window.ElectricalLab && window.ElectricalLab.lite && window.ElectricalLab.start) {
      if (cb) cb();
      return;
    }
    if (window.__elLiteLoading) {
      if (cb) {
        var n = 0;
        var t = setInterval(function () {
          n++;
          if ((window.LtElectricalLite && window.LtElectricalLite.start) || n > 40) {
            clearInterval(t);
            if (window.LtElectricalLite) {
              window.ElectricalLab = window.LtElectricalLite;
              window.HVACElectrical = window.LtElectricalLite;
            }
            cb();
          }
        }, 50);
      }
      return;
    }
    window.__elLiteLoading = true;
    var s = document.createElement("script");
    s.src = "electrical-lite.js?v=1";
    s.onload = function () {
      window.__elLiteLoading = false;
      if (window.LtElectricalLite) {
        window.ElectricalLab = window.LtElectricalLite;
        window.HVACElectrical = window.LtElectricalLite;
      }
      if (cb) cb();
    };
    s.onerror = function () {
      window.__elLiteLoading = false;
      if (cb) cb();
    };
    (document.head || document.documentElement).appendChild(s);
  }

  function replaceHeavyStart() {
    if (!isPhone()) return;
    ensureLite(function () {
      var API = window.ElectricalLab || window.HVACElectrical || window.LtElectrical;
      if (!API || typeof API.start !== "function") return;
      if (API.lite || API._phoneLiteBound) return;
      /* Full electrical.js somehow present — never let it paint on phone */
      API._phoneLiteBound = true;
      API.start = function (root, opts) {
        ensureLite(function () {
          var lite = window.LtElectricalLite || window.ElectricalLab;
          if (lite && lite.lite && lite.start) lite.start(root, opts || {});
          else paintEmergency(root);
        });
        return {
          stop: function () {},
          getHubBtn: function () {
            return root && root.querySelector("#el-hub");
          }
        };
      };
    });
  }

  function paintEmergency(root) {
    if (!root) return;
    root.innerHTML =
      "<div class='panel' style='margin:16px;padding:16px;max-width:480px'>" +
      "<h2>Land lugs</h2>" +
      "<p>Phone lite path. Tap a chip, then a land target.</p>" +
      "<div id='el-lugs-wrap' style='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0'>" +
      "<button type='button' class='btn primary el-lug' data-lug='R'>R</button>" +
      "<button type='button' class='btn el-lug' data-lug='C'>C</button>" +
      "<button type='button' class='btn el-lug' data-lug='Y'>Y</button>" +
      "<button type='button' class='btn el-lug' data-lug='G'>G</button>" +
      "<button type='button' class='btn el-lug' data-lug='W'>W</button>" +
      "</div>" +
      "<div id='el-wires' style='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0'>" +
      "<button type='button' class='btn el-lug' data-lug='hot'>Hot · black</button>" +
      "<button type='button' class='btn el-lug' data-lug='neu'>Neutral · off-white</button>" +
      "<button type='button' class='btn el-lug' data-lug='gnd'>Ground · green</button>" +
      "</div>" +
      "<button type='button' class='btn primary' id='el-lite-next'>Next</button> " +
      "<button type='button' class='btn' id='el-hub' data-lt-close-hub>Shop floor</button></div>";
  }

  function hideHeavyChrome() {
    if (!isPhone()) return;
    try {
      document.querySelectorAll(
        "#screen-electrical .hub-chip, #screen-electrical .hub-ai-dock, #hub-ai, .el-win-jesus, [data-hubai-toggle]"
      ).forEach(function (n) {
        n.style.display = "none";
      });
      document.querySelectorAll(
        'link[rel="preload"][as="image"], link[rel="prefetch"]'
      ).forEach(function (l) {
        var href = l.getAttribute("href") || "";
        if (/(hub-portrait|jesus\.png|garage|starr|arena|engle|falcon|gauges)/i.test(href)) {
          l.parentNode && l.parentNode.removeChild(l);
        }
      });
    } catch (_) {}
  }

  function boot() {
    if (!isPhone()) return;
    markLite();
    killFatScripts();
    hideHeavyChrome();
    ensureLite(replaceHeavyStart);
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
            killFatScripts();
            ensureLite(replaceHeavyStart);
            hideHeavyChrome();
          }
        },
        true
      );
    }
  }

  if (isPhone()) {
    markLite();
    killFatScripts();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
