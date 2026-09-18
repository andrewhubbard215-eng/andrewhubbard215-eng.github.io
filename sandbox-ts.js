/* Evening SAVE — DX TS sheet: phone tap targets, hook v=8, vocational SC copy. */
(function () {
  "use strict";
  function loadHook() {
    var old = document.querySelector("script[data-sb-hook]");
    if (old && /v=8/.test(old.src || "")) return;
    if (old) old.remove();
    var s = document.createElement("script");
    s.src = "sandbox-hook.js?v=12";
    s.setAttribute("data-sb-hook", "1");
    document.head.appendChild(s);
  }
  function injectCss() {
    if (document.getElementById("sb-ts-fix-css")) return;
    var s = document.createElement("style");
    s.id = "sb-ts-fix-css";
    s.textContent =
      "#sb-ts{max-height:42vh;overflow-y:auto;-webkit-overflow-scrolling:touch}" +
      "#sb-ts li{min-height:44px;padding:8px 10px;display:flex;flex-direction:column;gap:2px;cursor:pointer}" +
      "#sb-ts li.wait{outline:1px solid #e8c450;background:rgba(232,196,80,.08)}" +
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
    root.querySelectorAll("p, li, span, strong").forEach(function (p) {
      var t = p.textContent || "";
      if (/Low SC — leak or non-condensables/i.test(t)) {
        p.textContent = "Low SC — undercharge / leak. Non-condensables raise head, they do not drop SC.";
      }
      if (/High head \+ low SC is condenser air/i.test(t)) {
        p.textContent = "High head + low-to-normal SC is condenser air, not a charge problem.";
      }
      if (/High SC — overcharge or dirty condenser/i.test(t)) {
        p.textContent = "High SC — overcharge or restriction. Dirty condenser raises head and usually drops SC.";
      }
    });
  }
  function armTaps(ol) {
    if (!ol || ol.__tsTap) return;
    ol.__tsTap = 1;
    ol.addEventListener("click", function (e) {
      var li = e.target.closest("li");
      if (!li || !ol.contains(li)) return;
      var wait = ol.querySelector("li.wait");
      if (wait && li !== wait) {
        wait.scrollIntoView({ block: "nearest", behavior: "smooth" });
        return;
      }
      if (li.classList.contains("wait")) {
        li.classList.remove("wait");
        li.classList.add("done");
        var nxt = li.nextElementSibling;
        if (nxt && nxt.tagName === "LI") nxt.classList.add("wait");
        paintStrip();
      }
    });
  }
  function paintStrip() {
    var ol = document.getElementById("sb-ts");
    var el = ensureStrip();
    if (!ol || !el) return;
    fixCopy(ol);
    armTaps(ol);
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
    loadHook();
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
