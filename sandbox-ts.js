/* Evening SAVE — DX TS sheet vocational fix + phone strip. */
(function () {
  "use strict";
  function injectCss() {
    if (document.getElementById("sb-ts-fix-css")) return;
    var s = document.createElement("style");
    s.id = "sb-ts-fix-css";
    s.textContent =
      ".sb-phone-vitals .pv-ts{flex:1 1 100%;font-size:11px;font-weight:600;color:#e8c450;letter-spacing:.02em}";
    document.head.appendChild(s);
  }
  function ensureStrip() {
    var bar = document.getElementById("sb-phone-vitals");
    if (!bar) return null;
    var el = document.getElementById("pv-ts");
    if (!el) {
      el = document.createElement("span");
      el.id = "pv-ts";
      el.className = "pv-ts";
      el.textContent = "TS · close the loop";
      bar.appendChild(el);
    }
    return el;
  }
  function fixCopy(root) {
    if (!root) return;
    root.querySelectorAll("p").forEach(function (p) {
      var t = p.textContent || "";
      if (/Low SC — leak or non-condensables/i.test(t)) {
        p.textContent = "Low SC — undercharge / leak. Non-condensables raise head, they do not drop SC.";
      }
      if (/High head \+ low SC is condenser air/i.test(t)) {
        p.textContent = "High head + low-to-normal SC is condenser air, not a charge problem.";
      }
    });
  }
  function paintStrip() {
    var ol = document.getElementById("sb-ts");
    var el = ensureStrip();
    if (!ol || !el) return;
    fixCopy(ol);
    var wait = ol.querySelector("li.wait");
    if (!wait) {
      el.textContent = "TS · SH/SC in band";
      return;
    }
    var n = (wait.querySelector("b") || {}).textContent || "?";
    var title = (wait.querySelector("strong") || {}).textContent || "next step";
    el.textContent = "TS " + n + " · " + title;
  }
  function boot() {
    injectCss();
    ensureStrip();
    paintStrip();
    var ol = document.getElementById("sb-ts");
    if (ol && !ol.__tsObs) {
      var mo = new MutationObserver(paintStrip);
      mo.observe(ol, { childList: true, subtree: true, characterData: true });
      ol.__tsObs = mo;
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(boot, 800);
})();
