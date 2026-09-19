/* LtDrip — HUB drip ear. Teach IN THE WRENCH. One shop one-liner per tip id ~6h.
   Slip the real name only after they've heard the shop line twice for that id.
   Corner-sized ear; pointer-events none except dismiss; never cover hose/lug or pouch fat nums. */
(function (global) {
  "use strict";

  var SIX_H = 6 * 60 * 60 * 1000;
  var STORE_KEY = "ltDripState_v1";
  var tips = Object.create(null);
  var earEl = null;
  var hideTimer = 0;
  var lastShownAt = 0;
  var MIN_GAP_MS = 45000;

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      return raw ? JSON.parse(raw) : { tips: {} };
    } catch (_) {
      return { tips: {} };
    }
  }

  function save(st) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(st));
    } catch (_) {}
  }

  function tipState(id) {
    var st = load();
    if (!st.tips[id]) st.tips[id] = { shows: 0, lastAt: 0, realUnlocked: false };
    return { store: st, tip: st.tips[id] };
  }

  function canShow(id) {
    var pair = tipState(id);
    var t = pair.tip;
    var now = Date.now();
    if (now - lastShownAt < MIN_GAP_MS) return false;
    if (t.lastAt && now - t.lastAt < SIX_H) return false;
    return true;
  }

  function register(id, when, shopLine, realName) {
    if (!id || !shopLine) return;
    tips[id] = { id: id, when: when || "", shopLine: shopLine, realName: realName || "" };
  }

  function ensureCss() {
    if (document.getElementById("lt-drip-css")) return;
    var s = document.createElement("style");
    s.id = "lt-drip-css";
    s.textContent =
      "#lt-drip-ear{position:fixed;right:8px;bottom:calc(10px + env(safe-area-inset-bottom,0px));" +
      "z-index:28;max-width:min(200px,42vw);min-width:0;padding:8px 10px;border-radius:12px;" +
      "background:rgba(12,18,28,.92);border:1px solid rgba(94,234,212,.35);color:#e2e8f0;" +
      "font-size:12px;line-height:1.35;box-shadow:0 8px 24px rgba(0,0,0,.35);" +
      "display:none;gap:8px;align-items:flex-start;pointer-events:none}" +
      "#lt-drip-ear.on{display:flex}" +
      "#lt-drip-ear .lt-drip-x{pointer-events:auto}" +
      "#lt-drip-ear img{width:28px;height:28px;border-radius:8px;object-fit:cover;flex:0 0 auto;pointer-events:none}" +
      "#lt-drip-ear .lt-drip-body{flex:1;min-width:0;pointer-events:none}" +
      "#lt-drip-ear strong{display:block;font-size:11px;letter-spacing:.04em;color:#5eead4;margin-bottom:2px}" +
      "#lt-drip-ear p{margin:0}" +
      "#lt-drip-ear .lt-drip-x{position:absolute;top:2px;right:6px;border:0;background:transparent;" +
      "color:rgba(226,232,240,.7);font-size:16px;line-height:1;padding:4px;cursor:pointer}" +
      "body.dragging-part #lt-drip-ear,body.dragging-hose #lt-drip-ear,body.dragging-wire #lt-drip-ear," +
      "#screen-sandbox.drop-hot #lt-drip-ear,#screen-electrical.drop-hot #lt-drip-ear," +
      "body.el-lug-drag #lt-drip-ear,body.sb-hose-drag #lt-drip-ear{pointer-events:none!important;opacity:.28}" +
      "body:has(#screen-truck-pouch.active) #lt-drip-ear{bottom:auto;top:calc(88px + env(safe-area-inset-top,0px));right:6px;max-width:min(160px,36vw)}" +
      "@media(max-width:480px){#lt-drip-ear{max-width:min(168px,40vw);font-size:11px;bottom:calc(56px + env(safe-area-inset-bottom,0px))}" +
      "body:has(#screen-electrical.active) #lt-drip-ear,body:has(#screen-sandbox.active) #lt-drip-ear{bottom:calc(72px + env(safe-area-inset-bottom,0px))}}";
    document.head.appendChild(s);
  }

  function ensureEar() {
    ensureCss();
    if (earEl && document.body.contains(earEl)) return earEl;
    earEl = document.createElement("aside");
    earEl.id = "lt-drip-ear";
    earEl.setAttribute("aria-live", "polite");
    earEl.innerHTML =
      '<button type="button" class="lt-drip-x" aria-label="Dismiss">×</button>' +
      '<img src="hub-portrait.jpg" alt="" />' +
      '<div class="lt-drip-body"><strong>HUB</strong><p class="lt-drip-line"></p></div>';
    document.body.appendChild(earEl);
    earEl.querySelector(".lt-drip-x").onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      hide();
    };
    return earEl;
  }

  function hide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    ensureEar().classList.remove("on");
  }

  function lineFor(tip, tipSt) {
    var line = tip.shopLine;
    if (tip.realName && tipSt.shows >= 2) line = tip.shopLine + " (" + tip.realName + ")";
    return line;
  }

  function show(id, force) {
    var tip = tips[id];
    if (!tip) return false;
    if (!force && !canShow(id)) return false;
    var pair = tipState(id);
    var tipSt = pair.tip;
    var now = Date.now();
    if (!force && tipSt.lastAt && now - tipSt.lastAt < SIX_H) return false;
    tipSt.shows = (tipSt.shows || 0) + 1;
    tipSt.lastAt = now;
    if (tipSt.shows >= 2 && tip.realName) tipSt.realUnlocked = true;
    pair.store.tips[id] = tipSt;
    save(pair.store);
    lastShownAt = now;
    var el = ensureEar();
    var p = el.querySelector(".lt-drip-line");
    if (p) p.textContent = lineFor(tip, tipSt);
    el.classList.add("on");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 9000);
    return true;
  }

  function trigger(id) { return show(id, false); }

  var CONTEXT_MAP = [
    { re: /ohms_short|shorted.?coil|24V.?2.?Ω|fuse.?candy|ohm.?short/i, ids: ["ohms_short"] },
    { re: /ohms_open|open.?winding|OL.?winding|infinite.?ohm/i, ids: ["ohms_open"] },
    { re: /kvl_loop|kirchhoff|loop.?sum|series.?drop|voltage.?around/i, ids: ["kvl_loop"] },
    { re: /meter_open|meter.?across.?open|open.?switch|dead.?leg|voltmeter/i, ids: ["meter_open", "kvl_loop"] },
    { re: /sh_coil|coil.?sh|total.?sh|target.?sh|superheat/i, ids: ["sh_coil"] },
    { re: /sc_dirty|dirty.?roof|dirty.?odu|high.?sc|overcharge|subcool/i, ids: ["sc_dirty"] },
    { re: /txv_vs_piston|txv.?vs.?piston|piston.?charge|metering/i, ids: ["txv_vs_piston"] },
    { re: /txv_hunt|txv.?hunt|hunting.?txv|bulb.?hunt/i, ids: ["txv_hunt"] },
    { re: /glide_454b|454b|dew|bubble|glide|a2l/i, ids: ["glide_454b"] },
    { re: /fraction_liquid|fraction|liquid.?in|blend/i, ids: ["fraction_liquid"] },
    { re: /manifold_colors|blue.?hose|red.?hose|manifold.?color|yellow.?hose|gauges/i, ids: ["manifold_colors"] },
    { re: /recover_608|recover|weigh.?in|608|evacuate/i, ids: ["recover_608"] },
    { re: /vd_24v|skinny.?wire|voltage.?drop|coil.?chatter|thermostat.?wire/i, ids: ["vd_24v"] },
    { re: /cfm_filter|dirty.?filter|airflow|cfm|don.?t.?add.?gas/i, ids: ["cfm_filter"] },
    { re: /sandbox|live.?box|sh.?sc/i, ids: ["sh_coil", "sc_dirty", "manifold_colors"] },
    { re: /grade|next.?ticket|service.?call|fault/i, ids: ["sh_coil", "sc_dirty"] },
    { re: /pouch|pt.?chart|on.?the.?job/i, ids: ["glide_454b", "ohms_short"] },
    { re: /electrical|open.?circuit/i, ids: ["meter_open", "kvl_loop"] }
  ];

  function nudge(idOrCtx) {
    var key = String(idOrCtx || "").trim();
    if (!key) {
      if (trigger("manifold_colors")) return "manifold_colors";
      return null;
    }
    if (tips[key]) {
      if (trigger(key)) return key;
      return null;
    }
    var candidates = [];
    for (var i = 0; i < CONTEXT_MAP.length; i++) {
      if (CONTEXT_MAP[i].re.test(key)) candidates = candidates.concat(CONTEXT_MAP[i].ids);
    }
    if (!candidates.length) candidates = ["manifold_colors"];
    for (var j = 0; j < candidates.length; j++) {
      if (trigger(candidates[j])) return candidates[j];
    }
    return null;
  }

  register("ohms_short", "ohm|arcade|pouch",
    "Shorted coil? Amps go through the roof — 24 volts into 2 ohms is fuse candy. Feel the heat before you swap the board.",
    "shorted coil / I = V/R");
  register("ohms_open", "ohm|arcade|electrical",
    "Open winding reads OL — path is dead. Don't chase voltage when the winding already quit.",
    "open winding");
  register("kvl_loop", "electrical|voltmeter",
    "Walk the loop — every drop adds up to the supply. Missing volts? That's your open.",
    "Kirchhoff's voltage law (KVL)");
  register("sh_coil", "sandbox|service|grade",
    "Coil SH is at the bulb. Total SH is at the compressor. Target SH is the chart. Three different stories.",
    "coil SH vs total SH vs target");
  register("sc_dirty", "sandbox|service|grade",
    "High SC on a dirty roof can look like overcharge. Wash the coil before you recover a jug you didn't need.",
    "dirty condenser vs overcharge");
  register("txv_vs_piston", "sandbox|manifold",
    "TXV holds SH — charge by subcool. Piston? Charge by SH off the chart. Don't mix the recipes.",
    "TXV vs piston charging");
  register("glide_454b", "sandbox|pouch|454B",
    "454B ain't one number — dew on the low, bubble on the high. Glide means your P/T chart has two faces.",
    "dew / bubble / glide");
  register("fraction_liquid", "454B|charge|recover",
    "Blends leave the jug uneven if you vapor-charge. Liquid in — fractionation is real.",
    "fractionation / liquid-in");
  register("manifold_colors", "sandbox|gauges",
    "Blue hugs suction, red hugs liquid, yellow is the utility. Colors keep you from swapping tanks blind.",
    "manifold hose colors");
  register("recover_608", "608|recover|service",
    "Recover before you open. Weigh it back in. Don't top off a leak and call it fixed.",
    "EPA 608 recover / weigh-in");
  register("vd_24v", "pouch|electrical",
    "Long skinny thermostat wire steals push. Coil chatters under ~21 volts — upsize or shorten the run.",
    "24V voltage drop");
  register("cfm_filter", "service|airflow|pouch",
    "Low SH and low SC together? Air first. Dirty filter looks like a charge problem — don't add gas for dirt.",
    "airflow before charge");
  register("meter_open", "electrical|voltmeter",
    "Meter across an open switch — you should see source voltage. Zero there means the feed never arrived.",
    "open-circuit voltage prove");
  register("txv_hunt", "sandbox|txv",
    "TXV hunting? Bulb loose, wrong charge, or hunting SH. Strap the bulb tight before you blame the valve.",
    "TXV hunting");

  function softFromSandbox() {
    try {
      var shEl = document.getElementById("sb-sh") || document.getElementById("g-sh");
      var scEl = document.getElementById("sb-sc") || document.getElementById("g-sc");
      var fault = document.getElementById("sb-fault");
      var txt = ((shEl && shEl.textContent) || "") + " " + ((scEl && scEl.textContent) || "") + " " + ((fault && fault.textContent) || "");
      var shN = parseFloat(txt.match(/SH[:\s]*([-\d.]+)/i) && RegExp.$1);
      var scN = parseFloat(txt.match(/SC[:\s]*([-\d.]+)/i) && RegExp.$1);
      if (/dirty.?odu|dirty.?roof|high.?sc|overcharge/i.test(txt) || (isFinite(scN) && scN > 20)) nudge("sc_dirty");
      else if (/high.?sh|undercharge|leak/i.test(txt) || (isFinite(shN) && shN > 30)) nudge("sh_coil");
      else if (/454B|A2L/i.test(txt)) nudge("glide_454b");
      else if (/TXV.?hunt|hunting/i.test(txt)) nudge("txv_hunt");
      else if (/TXV|piston|EEV/i.test(txt)) nudge("txv_vs_piston");
    } catch (_) {}
  }

  function wireSoftHooks() {
    document.addEventListener("click", function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var btn = t.closest("button, [data-mode], a.btn");
      if (!btn) return;
      var id = (btn.id || "") + " " + (btn.getAttribute("data-mode") || "") + " " + (btn.textContent || "");
      if (/tp-sandbox|see it on a live box|sandbox/i.test(id) && /sandbox|live box/i.test(id)) nudge("manifold_colors");
      else if (/svc-next|next.?ticket/i.test(id)) nudge("sh_coil");
      else if (/svc-hook|hook.?gauge/i.test(id)) nudge("manifold_colors");
      else if (/ol-short|24V - 2Ω|shorted/i.test(id)) nudge("ohms_short");
      else if (/ol-open|open.?wind/i.test(id)) nudge("ohms_open");
      else if (/tp-ref|454B|tp-hub/i.test(id) || /454B/.test(btn.value || "")) nudge("glide_454b");
      else if (/recover|weigh|608|epa608/i.test(id)) nudge("recover_608");
      else if (/vm-opt|voltmeter|defusal|electrical/i.test(id)) nudge("meter_open");
      else if (/ms-do|minisplit/i.test(id)) nudge("recover_608");
      else if (/filter|airflow|cfm/i.test(id)) nudge("cfm_filter");
    }, true);
    setInterval(function () {
      var sb = document.getElementById("screen-sandbox");
      if (sb && sb.classList.contains("active")) softFromSandbox();
    }, 25000);
    document.addEventListener("change", function (ev) {
      var el = ev.target;
      if (!el) return;
      if (el.id === "tp-ref" && /454B/i.test(el.value || "")) nudge("glide_454b");
      if (el.id === "tp-tab" && /454|ref|a2l/i.test(el.value || "")) nudge("glide_454b");
    });
    document.addEventListener("lt-ohm-wrong", function () { nudge("ohms_short"); });
    document.addEventListener("lt-el-open", function () { nudge("meter_open"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { ensureEar(); wireSoftHooks(); });
  } else {
    ensureEar();
    wireSoftHooks();
  }

  global.LtDrip = { register: register, trigger: trigger, nudge: nudge, show: show, hide: hide, tips: tips };
})(window);
