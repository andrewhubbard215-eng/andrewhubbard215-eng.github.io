/* Shop-floor copy override v199 — bay strip: voltmeter school + ohm school no longer mislabel as saturday callback. Prev v198 recovery tip. */
(function () {
  function bayStrip() {
    var strip = document.querySelector(".version-strip");
    if (!strip) return;
    var bay = "shop floor";
    var tabSat = document.querySelector(".el-tab.active, .sat-tab.active, [data-el-tab].active");
    var tabTxt = ((tabSat && tabSat.textContent) || "").toLowerCase();
    var lite = document.querySelector(".el-lite-head, .el-lite-panel h2");
    var liteTxt = ((lite && lite.textContent) || "").toLowerCase();
    var root = document.getElementById("electrical-root");
    var lines = ((root && root.innerText) || "").split("\n").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    var title = "";
    for (var i = 0; i < lines.length && i < 8; i++) {
      if (/saturday|callback|no-cool|land lugs|l1 line|follow the call|ladder/.test(lines[i])) { title = lines[i]; break; }
    }
    function screenOn(id) {
      var el = document.getElementById(id);
      if (!el) return false;
      if (el.classList.contains("active") || el.classList.contains("screen-on")) return true;
      if (el.offsetParent) return true;
      return false;
    }
    function appVer() {
      var m = document.querySelector('meta[name="lt-app-ver"]');
      return (m && m.content) || window.LT_APP_VER || "v3.5.594";
    }
    if (screenOn("screen-voltmeter") || document.getElementById("voltmeter-root")) bay = "voltmeter school";
    else if (screenOn("screen-ohm") || document.getElementById("ohm-root")) bay = "ohm school";
    else if (screenOn("screen-electrical")) {
      if (/saturday|callback|no-cool/.test(title) || /saturday|callback/.test(tabTxt) || /saturday|callback|no-cool/.test(liteTxt) || document.querySelector(".sat-sheet, #sat-root, [data-mode='defusal'].active"))
        bay = "saturday callback";
      else if (/land lugs|l1 line/.test(title) || /lug|land/.test(tabTxt) || /land lugs|l1 line/.test(liteTxt)) bay = "land lugs";
      else bay = "ladder";
    } else if (screenOn("screen-sandbox")) bay = "sandbox";
    else if (screenOn("screen-quiz")) bay = "exam";
    else if (screenOn("screen-minisplit")) bay = "mini-split";
    else if (screenOn("screen-service")) bay = "service calls";
    else if (screenOn("screen-truck-pouch")) bay = "on the job";
    strip.textContent = "HVAC Allstars - " + appVer() + " - " + bay;
  }
  function tick() { try { bayStrip(); } catch (e) {} }
  setInterval(tick, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
})();
