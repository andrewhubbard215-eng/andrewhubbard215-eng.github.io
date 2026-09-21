/* Dual SKU — keep both forever.
   campus = Lincoln Tech licensed seats (default on this GitHub Pages host).
   store  = unbranded HVAC Allstars (Play TWA launches with ?sku=store).
   ?sku=campus | ?sku=store  — persisted. Do not drop the Lincoln edition. */
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
  // Play TWA always ships unbranded unless they explicitly ask for campus.
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
    exam: isStore ? "EPA 608 · OSHA 30 · shop curriculum" : "EPA 608 · OSHA 30 · Lincoln Tech",
    school: isStore ? "trade school" : "Lincoln Tech",
    roof: isStore ? "Rooftop · the heavens open" : "Lincoln Tech roof · the heavens open",
    packCurriculum: isStore ? "Shop curriculum" : "Lincoln Tech",
  };

  var doc = document.documentElement;
  doc.setAttribute("data-sku", sku);
  doc.classList.toggle("sku-store", isStore);
  doc.classList.toggle("sku-campus", !isStore);

  function injectSkuCss() {
    if (document.getElementById("lt-sku-css")) return;
    var s = document.createElement("style");
    s.id = "lt-sku-css";
    s.textContent =
      "html.sku-store .lincoln-only{display:none!important}" +
      "html.sku-campus .store-only{display:none!important}" +
      "html.sku-store .bg-lincoln{filter:saturate(.35) brightness(.7)}";
    document.head.appendChild(s);
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
        if (!p) return NodeFilter.FILTER_REJECT;
        var tag = p.tagName;
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") {
          return NodeFilter.FILTER_REJECT;
        }
        if (!n.nodeValue || n.nodeValue.indexOf("Lincoln") === -1) return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      },
    });
    var n;
    while ((n = w.nextNode())) {
      n.nodeValue = n.nodeValue
        .replace(/official Lincoln Technical Institute/gi, "official school")
        .replace(/Lincoln Technical Institute/gi, "a trade school")
        .replace(/Lincoln Tech HVAC Allstars/gi, "HVAC Allstars")
        .replace(/Lincoln Tech/gi, "HVAC Allstars");
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
        if (tx.indexOf("Lincoln") !== -1) {
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

  function t(campus, store) {
    return isStore ? store : campus;
  }

  global.LtBrand = brand;
  global.LtBrand.t = t;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyHead);
  } else {
    applyHead();
  }

  function addScript(src) {
    if (document.querySelector('script[src*="' + src.split("?")[0] + '"]')) return;
    var s = document.createElement("script");
    s.src = src;
    s.defer = true;
    document.head.appendChild(s);
  }
  if (!document.querySelector('script[src*="board-codes.js"]')) {
    var s = document.createElement("script");
    s.src = "board-codes.js?v=4";
    document.head.appendChild(s);
  }
  if (!document.querySelector('script[src*="charge-floor.js"]')) {
    var cf = document.createElement("script");
    cf.src = "charge-floor.js?v=2";
    document.head.appendChild(cf);
  }
  if (!document.querySelector('script[src*="sandbox-bom.js"]')) {
    var bom = document.createElement("script");
    bom.defer = true;
    bom.src = "sandbox-bom.js?v=2";
    document.head.appendChild(bom);
  }
  addScript("sandbox-hook.js?v=12");
  addScript("route-floor.js?v=2");
  addScript("shop-floor-copy.js?v=2");
  if (!document.querySelector('link[href*="board-codes.css"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "board-codes.css?v=2";
    document.head.appendChild(l);
  }
  if (!document.querySelector('link[href*="lab-glass.css"]')) {
    var g = document.createElement("link");
    g.rel = "stylesheet";
    g.href = "lab-glass.css?v=1";
    document.head.appendChild(g);
  }
})(window);
