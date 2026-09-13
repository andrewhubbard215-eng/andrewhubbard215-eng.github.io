/* Dual SKU: campus (Lincoln Tech, default) vs store (unbranded HVAC Allstars).
   ?sku=store | ?sku=campus  — also persisted. Store hostnames force store. */
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

  function applyHead() {
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

  if (!document.querySelector('script[src*="board-codes.js"]')) {
    var s = document.createElement("script");
    s.src = "board-codes.js?v=1";
    document.head.appendChild(s);
  }
  if (!document.querySelector('link[href*="board-codes.css"]')) {
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "board-codes.css?v=1";
    document.head.appendChild(l);
  }
})(window);
