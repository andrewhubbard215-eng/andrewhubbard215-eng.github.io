/* Shop save — TS sheet follows the bay, not a free tap.
   v23 — standing first body names LOTO+meter then HOLD green 0.0 proven before seat LEFT: equalized is never a charge. Phone max-height holds.
   v20 — standing wait clearer: 5–10 min for stable after start: blue=red is not a diagnosis: equalized is not a charge or diagnosis. Phone max-height still holds.
   v16 — cutout step names the plant on the fault line. Generic fingerprint is not a call.
   v15 — HPC/LPC cutout is not standing. Button no longer says Stop, sheet stayed on step 1.
   Advance only when the work is real: seat LEFT, run, read SH, read SC, name a fault. */
(function () {
  "use strict";
  var STEPS = [
    { n: "1", title: "Standing first", body: "LOTO first + meter outdoor 24V R-C/Y BEFORE any hose. Hoses OFF — HOLD each dial (do not release until green progress bar FULL ~0.8s) until BOTH green 0.0 proven. Then seat four LEFT, Start, wait 5–10 min stable, then read SH/SC. Equalized standing is never a charge or diagnosis. Never jump a safety. Seat only from LEFT. No-cool prove order locked: call → 240 → R–C → Y → HPC → LPC → float → coil → T1 → compressor." },
    { n: "2", title: "Seat the four LEFT", body: "Four parts LEFT green before Start: compressor, condenser, TXV, evaporator. Then start the compressor." },
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
      "@media (max-width:480px){#sandbox-root #sb-ts,#sandbox-root #sb-ts:hover,#sandbox-root #sb-ts:focus-within{max-height:32vh!important;overflow-y:auto!important;display:grid!important;-webkit-overflow-scrolling:touch}#sb-ts li:not(.wait):not(.done){min-height:28px;padding:4px 6px}#sb-ts li.wait p{font-size:11px;line-height:1.3}#sb-fp,.sb-fp{order:3}#sb-sliders,.sb-sliders,#sb-run{order:2}}";
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
    var pcRow = window.matchMedia && window.matchMedia("(min-width: 901px)").matches;
    ol.style.setProperty("display", pcRow ? "flex" : "grid", "important");
    ol.style.setProperty("flex", "0 0 auto", "important");
    return ol;
  }

  function refresh() {
    injectCss();
    mountList();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
  setTimeout(refresh, 800);
  setTimeout(refresh, 2400);
})();
