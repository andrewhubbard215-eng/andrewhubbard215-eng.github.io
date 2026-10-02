/* Shop save — TS sheet follows the bay, not a free tap.
   v14 — restore step copy (running-P sweeper was clobbering step 1).
   Advance only when the work is real: seat LEFT, run, read SH, read SC, name a fault. */
(function () {
  "use strict";
  var STEPS = [
    { n: "1", title: "Standing first", body: "Unit off. Equalized P/T only. No SH/SC until the compressor is running." },
    { n: "2", title: "Seat the four LEFT", body: "Compressor, condenser, TXV, evaporator on the LEFT tray. Then start." },
    { n: "3", title: "Read SH", body: "SH = suction line T − dew point. TXV: 8–14° is a check. Piston: charge by SH." },
    { n: "4", title: "Read SC", body: "SC = start of boiling − liquid line T. TXV: charge by SC 8–14°. Low SC = undercharge/leak. Air/noncondensables raise head AND high SC." },
    { n: "5", title: "Name the fingerprint", body: "High SH + low SC = leak. High SH + high SC = restriction. Low SH + high SC = overcharge. High head + SC about normal = dirty condenser. High head + high SC = air/noncondensables." }
  ];
  var named = false;

  function injectCss() {
    var s = document.getElementById("sb-ts-fix-css");
    if (!s) {
      s = document.createElement("style");
      s.id = "sb-ts-fix-css";
      document.head.appendChild(s);
    }
    s.textContent =
      "#sandbox-root #sb-ts,#sandbox-root #sb-ts:focus-within,#sandbox-root #sb-ts:hover{list-style:none;margin:6px 0 0!important;padding:0!important;display:grid!important;gap:3px;min-height:32px!important;max-height:22vh!important;overflow-y:auto!important;flex:0 0 auto;visibility:visible!important}" +
      "#sb-ts li{min-height:32px;padding:5px 8px;display:flex;flex-wrap:wrap;align-items:center;gap:6px;cursor:default;background:#14171a;border:1px solid #2a3138;border-radius:6px}" +
      "#sb-ts li.wait{outline:1px solid #e8c450;background:rgba(232,196,80,.08)}" +
      "#sb-ts li.done{opacity:.72}" +
      "#sb-ts li b{width:22px;height:22px;border-radius:4px;background:#CE0034;color:#fff;font-size:11px;display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}" +
      "#sb-ts li.done b{background:#3d7a52}" +
      "#sb-ts li strong{font-size:13px}" +
      "#sb-ts li p{display:none;margin:0;flex:1 1 100%;font-size:12px;color:#9aa3ad}" +
      "#sb-ts li.wait p{display:block}" +
      ".sb-phone-vitals .pv-ts{flex:1 1 100%;font-size:11px;font-weight:600;color:#e8c450;letter-spacing:.02em}" +
      "@media (max-width:480px){#sandbox-root #sb-ts,#sandbox-root #sb-ts:hover,#sandbox-root #sb-ts:focus-within{max-height:28vh!important;overflow-y:auto!important;display:grid!important;-webkit-overflow-scrolling:touch}#sb-ts li:not(.wait):not(.done){min-height:28px;padding:4px 6px}#sb-ts li.wait p{font-size:11px;line-height:1.3}#sb-fp,.sb-fp{order:3}#sb-sliders,.sb-sliders,#sb-run{order:2}}";
  }

  function mountList() {
    var root = document.getElementById("sandbox-root");
    if (!root) return null;
    var ol = document.getElementById("sb-ts");
    if (!ol) {
      ol = document.createElement("ol");
      ol.id = "sb-ts";
      ol.className = "sb-ts";
      STEPS.forEach(function (step, i) {
        var li = document.createElement("li");
        if (i === 0) li.className = "wait";
        li.innerHTML = "<b>" + step.n + "</b> <strong>" + step.title + "</strong><p>" + step.body + "</p>";
        ol.appendChild(li);
      });
    }
    var tip = document.getElementById("sb-phone-tip");
    var status = document.getElementById("sb-status");
    if (tip && tip.parentNode && ol.previousElementSibling !== tip) {
      tip.parentNode.insertBefore(ol, tip.nextSibling);
    } else if (!ol.parentNode && status && status.parentNode) {
      status.parentNode.insertBefore(ol, status.nextSibling);
    } else if (!ol.parentNode && root) {
      root.appendChild(ol);
    }
    ol.style.setProperty("display", "grid", "important");
    ol.style.setProperty("flex", "0 0 auto", "important");
    ol.style.setProperty("height", "auto", "important");
    ol.style.setProperty("min-height", "96px", "important");
    ol.style.setProperty("max-height", "22vh", "important");
    ol.style.setProperty("overflow-y", "auto", "important");
    ol.style.setProperty("visibility", "visible", "important");
    ol.style.setProperty("margin", "6px 0 0", "important");
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
      el.textContent = "TS · close the loop";
      bar.appendChild(el);
    }
    return el;
  }

  function armFault() {
    var box = document.getElementById("sb-faults");
    if (!box || box.__tsFault) return;
    box.__tsFault = 1;
    box.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      named = true;
      paintStrip();
    });
  }

  function bay() {
    var run = document.getElementById("sb-run");
    var on = !!(run && /stop/i.test(run.textContent || ""));
    var strip = ((document.getElementById("sb-left-strip") || {}).textContent) || "";
    var seated = /COMP/i.test(strip) && /COND/i.test(strip) && /TXV/i.test(strip) && /EVAP/i.test(strip) && /seated/i.test(strip);
    var sh = ((document.getElementById("sb-sh") || {}).textContent) || "";
    var sc = ((document.getElementById("sb-sc") || {}).textContent) || "";
    var shOk = on && /\d/.test(sh) && /SH/i.test(sh) && !/no SH/i.test(sh);
    var scOk = on && /\d/.test(sc) && /SC/i.test(sc) && !/no SC/i.test(sc);
    if (!on) named = false;
    return { on: on, seated: seated, shOk: shOk, scOk: scOk };
  }

  function stageOf(b) {
    if (!(b.seated && b.on && b.shOk && b.scOk)) {
      if (b.seated && b.on && b.shOk) return 3;
      if (b.seated) return 2;
      return 1;
    }
    return named ? 6 : 5;
  }

  function sync(ol) {
    var lis = ol.querySelectorAll("li");
    STEPS.forEach(function (step, i) {
      var li = lis[i];
      if (!li) return;
      var p = li.querySelector("p");
      var strong = li.querySelector("strong");
      if (strong && strong.textContent !== step.title) strong.textContent = step.title;
      if (p && p.textContent !== step.body) p.textContent = step.body;
    });
    var stage = stageOf(bay());
    Array.prototype.forEach.call(lis, function (li, i) {
      li.classList.remove("wait", "done");
      if (i + 1 < stage) li.classList.add("done");
      else if (i + 1 === stage) li.classList.add("wait");
    });
    return stage;
  }

  function paintStrip() {
    var ol = document.getElementById("sb-ts") || mountList();
    var el = ensureStrip();
    if (!ol) return;
    armFault();
    var stage = sync(ol);
    if (!el) return;
    if (stage > 5) {
      el.textContent = "TS · fingerprint named";
      return;
    }
    var wait = ol.querySelector("li.wait");
    var n = wait ? ((wait.querySelector("b") || {}).textContent || "?") : "?";
    var title = wait ? ((wait.querySelector("strong") || {}).textContent || "next step") : "next step";
    el.textContent = "TS " + n + " · " + title;
  }

  function boot() {
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
