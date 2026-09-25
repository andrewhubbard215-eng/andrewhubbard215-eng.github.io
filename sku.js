/* Dual SKU — keep both forever.
   campus = Lincoln Tech licensed seats (default on this GitHub Pages host).
   store  = HVAC Allstars — same locker richness, no Lincoln HCR catalog.
   ?sku=campus | ?sku=store  — persisted. Do not drop the Lincoln edition.
   v16 — branding + hide HCR units on store. Do NOT clip the hero or wash the bay.
   Do NOT inject hook/route/copy/board-codes here. */
(function (global) {
  "use strict";
  var params = new URLSearchParams(location.search);
  var saved = "";
  try {
    saved = localStorage.getItem("lt-sku") || "";
  } catch (_) {}
  var host = (location.hostname || "").toLowerCase();
  var sku = "campus";
  if (/hvacallstars\.(app|com|net)|play\.google/.test(host)) sku = "store";
  if (saved === "store" || saved === "campus") sku = saved;
  var q = (params.get("sku") || params.get("edition") || "").toLowerCase();
  if (q === "store" || q === "campus") {
    sku = q;
    try {
      localStorage.setItem("lt-sku", sku);
    } catch (_) {}
  }
  if (params.get("play") === "1" && q !== "campus") {
    sku = "store";
    try {
      localStorage.setItem("lt-sku", "store");
    } catch (_) {}
  }

  var isStore = sku === "store";
  var brand = {
    sku: sku,
    isStore: isStore,
    org: isStore ? "HVAC Allstars" : "Lincoln Tech",
    title: isStore ? "HVAC Allstars" : "Lincoln Tech HVAC Allstars",
    mark: isStore ? "HA" : "LT",
    exam: isStore ? "EPA 608 · OSHA 30 · shop floor" : "EPA 608 · OSHA 30 · Lincoln Tech",
    school: isStore ? "trade school" : "Lincoln Tech",
    roof: isStore ? "Rooftop · the heavens open" : "Lincoln Tech roof · the heavens open",
    packCurriculum: isStore ? "Shop floor" : "Lincoln Tech",
    program: isStore ? "SHOP-HVAC" : "HCRX101",
  };

  var doc = document.documentElement;
  doc.setAttribute("data-sku", sku);
  doc.classList.toggle("sku-store", isStore);
  doc.classList.toggle("sku-campus", !isStore);

  function injectSkuCss() {
    var s = document.getElementById("lt-sku-css");
    if (!s) {
      s = document.createElement("style");
      s.id = "lt-sku-css";
      document.head.appendChild(s);
    }
    s.textContent =
      "html.sku-store .lincoln-only{display:none!important}" +
      "html.sku-campus .store-only{display:none!important}" +
      "html.sku-store .cu-card[data-id^=\"hcr\"]{display:none!important}" +
      "html.sku-store .lincoln-catalog{display:none!important}" +
      "html.sku-store [data-lincoln-curriculum]{display:none!important}";
  }

  function applyHead() {
    injectSkuCss();
    document.title = brand.title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        isStore
          ? "HVAC Allstars — daily vocational trainer. EPA 608, OSHA 30, electrical box, DX sandbox, Professor HUB."
          : "Lincoln Tech HVAC Allstars — daily vocational training sim with Professor Andrew Hubbard. Mini-split, sandbox, EPA 608, service calls."
      );
    }
    var apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", "HVAC Allstars");
    document.querySelectorAll(".brand-mark").forEach(function (el) {
      el.textContent = brand.mark;
    });
    var kick = document.getElementById("cut-kicker");
    if (kick) kick.textContent = brand.roof;
    scrubLincoln(document.body);
    watchLincoln();
  }

  function skipScrub() {
    return /campus\.html|store\.html|support\.html|privacy\.html|lincoln\//i.test(location.pathname);
  }

  function scrubLincoln(root) {
    if (!isStore || !root || skipScrub()) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentElement;
        if (!p || /SCRIPT|STYLE|NOSCRIPT|TEXTAREA/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (!n.nodeValue || !/Lincoln|HCR/i.test(n.nodeValue)) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var n;
    while ((n = w.nextNode())) {
      n.nodeValue = remapHcr(
        n.nodeValue
          .replace(/official Lincoln Technical Institute/gi, "official school")
          .replace(/Lincoln Technical Institute/gi, "a trade school")
          .replace(/Lincoln Tech HVAC Allstars/gi, "HVAC Allstars")
          .replace(/Lincoln catalog/gi, "shop catalog")
          .replace(/Lincoln Tech/gi, "HVAC Allstars"),
      );
    }
  }

  var lincolnWatch = null;
  function watchLincoln() {
    if (!isStore || lincolnWatch || skipScrub() || !document.body) return;
    var t = 0;
    lincolnWatch = new MutationObserver(function (muts) {
      var hit = false;
      for (var i = 0; i < muts.length; i++) {
        var tx = (muts[i].target && muts[i].target.textContent) || "";
        if (tx.indexOf("Lincoln") !== -1 || tx.indexOf("HCR") !== -1) {
          hit = true;
          break;
        }
      }
      if (!hit) return;
      clearTimeout(t);
      t = setTimeout(function () {
        scrubLincoln(document.body);
      }, 40);
    });
    lincolnWatch.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function remapHcr(text) {
    if (!text) return text;
    return text
      .replace(/HCRX101/g, "SHOP-HVAC")
      .replace(/HCR114/g, "OL-240")
      .replace(/HCR117/g, "AC-260")
      .replace(/HCR110/g, "CT-290")
      .replace(/HCR109/g, "CR-280")
      .replace(/HCR108/g, "AD-270")
      .replace(/HCR105/g, "RF-250")
      .replace(/HCR103/g, "HT-230")
      .replace(/HCR102/g, "EL-220")
      .replace(/HCR101/g, "SF-210")
      .replace(/HCR200/g, "AX-300");
  }

  function courseCode(code) {
    if (!isStore) return code;
    return remapHcr(String(code || ""));
  }

  function t(campus, store) {
    return isStore ? store : campus;
  }

  global.LtBrand = brand;
  global.LtBrand.t = t;
  global.LtBrand.course = courseCode;
  global.LtBrand.remapHcr = remapHcr;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHead);
  } else {
    applyHead();
  }
})(window);
