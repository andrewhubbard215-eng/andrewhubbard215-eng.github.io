/* Evening SAVE — DX TS sheet mounts in sandbox. Phone taps. Vocational SC copy. */
(function () {
  "use strict";
  var STEPS = [
    { n: "1", title: "Standing first", body: "Unit off. Equalized P/T only. No SH/SC until the compressor is running." },
    { n: "2", title: "Seat the four LEFT", body: "Compressor, condenser, TXV, evaporator on the LEFT tray. Then start." },
    { n: "3", title: "Read SH", body: "SH = suction line − SST. TXV: 8–14° is a check. Piston: charge by SH." },
    { n: "4", title: "Read SC", body: "SC = SCT − liquid line. TXV: charge by SC 8–14°. Low SC = undercharge/leak — non-condensables raise head, they do not drop SC." },
    { n: "5", title: "Name the fingerprint", body: "High SH + low SC = leak. High head + high SC = overcharge or restriction. High head + low-to-normal SC = condenser air." }
  ];

  function loadHook() {
    var old = document.querySelector("script[data-sb-hook]");
    if (old && /v=13/.test(old.src || "")) return;
    if (old) old.remove();
    var s = document.createElement("script");
    s.src = "sandbox-hook.js?v=13";
    s.setAttribute("data-sb-hook", "1");
    document.head.appendChild(s);
  }

  function injectCss() {
    if (document.getElementById("sb-ts-fix-css")) return;
    var s = document.createElement("style");
    s.id = "sb-ts-fix-css";
    s.textContent =
      "#sb-ts{list-style:none;margin:6px 0 0;padding:0;display:grid;gap:3px;max-height:22vh;overflow-y:auto;-webkit-overflow-scrolling:touch}" +
      "#sb-ts li{min-height:36px;padding:6px 8px;display:flex;flex-direction:column;gap:2px;cursor:pointer;background:#14171a;border:1px solid #2a3138;border-radius:6px}" +
      "#sb-ts li.wait{outline:1px solid #e8c450;background:rgba(232,196,80,.08)}" +
      "#sb-ts li.done{opacity:.72}" +
      "#sb-ts li b{width:22px;height:22px;border-radius:4px;background:#CE0034;color:#fff;font-size:11px;display:inline-flex;align-items:center;justify-content:center}" +
      "#sb-ts li.done b{background:#3d7a52}" +
      "#sb-ts li strong{font-size:12px}" +
      "#sb-ts li p{display:none;margin:2px 0 0;font-size:11px;color:#9aa3ad}" +
      "#sb-ts li.wait p{display:block}" +
      ".sb-phone-vitals .pv-ts{flex:1 1 100%;font-size:11px;font-weight:600;color:#e8c450;letter-spacing:.02em}";
    document.head.appendChild(s);
  }

  function mountList() {
    var root = document.getElementById("sandbox-root");
    if (!root) return null;
    var ol = document.getElementById("sb-ts");
    if (ol) return ol;
    ol = document.createElement("ol");
    ol.id = "sb-ts";
    ol.className = "sb-ts";
    STEPS.forEach(function (step, i) {
      var li = document.createElement("li");
      if (i === 0) li.className = "wait";
      li.innerHTML = "<b>" + step.n + "</b> <strong>" + step.title + "</strong><p>" + step.body + "</p>";
      ol.appendChild(li);
    });
    var status = document.getElementById("sb-status");
    if (status && status.parentNode) status.parentNode.insertBefore(ol, status.nextSibling);
    else root.appendChild(ol);
    return ol;
  }

  function ensureStrip() {
    var bar = document.getElementById("sb-phone-vitals");
    if (!bar) return null;
    var el = document.getElementById("pv-ts");
    if (!el) {
      el = document.createElement("span");
      el.id = "pv-ts";
      el.className = "pv-ts";
      el.textContent = "TS \u00b7 close the loop";
      bar.appendChild(el);
    }
    return el;
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
    var ol = document.getElementById("sb-ts") || mountList();
    var el = ensureStrip();
    if (!ol) return;
    armTaps(ol);
    if (!el) return;
    var wait = ol.querySelector("li.wait");
    if (!wait) {
      el.textContent = "TS \u00b7 SH/SC in band";
      return;
    }
    var n = (wait.querySelector("b") || {}).textContent || "?";
    var title = (wait.querySelector("strong") || {}).textContent || "next step";
    el.textContent = "TS " + n + " \u00b7 " + title;
  }

  function boot() {
    loadHook();
    injectCss();
    if (document.getElementById("sandbox-root")) {
      mountList();
      ensureStrip();
      paintStrip();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
  setInterval(boot, 800);
})();
