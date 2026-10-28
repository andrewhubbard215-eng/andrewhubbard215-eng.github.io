/* LtDrip — HUB drip ear. Hide on sandbox so TXV LEFT seat stays tappable. */
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
    try { var raw = localStorage.getItem(STORE_KEY); return raw ? JSON.parse(raw) : { tips: {} }; }
    catch (_) { return { tips: {} }; }
  }
  function save(st) { try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (_) {}
  }
  function tipState(id) {
    var st = load();
    if (!st.tips[id]) st.tips[id] = { shows: 0, lastAt: 0, realUnlocked: false };
    return { store: st, tip: st.tips[id] };
  }
  function canShow(id) {
    var pair = tipState(id); var t = pair.tip; var now = Date.now();
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
      "#lt-drip-ear{position:fixed;right:8px;bottom:calc(10px + env(safe-area-inset-bottom,0px));z-index:28;max-width:min(200px,42vw);padding:8px 10px;border-radius:12px;background:rgba(12,18,28,.92);border:1px solid rgba(94,234,212,.35);color:#e2e8f0;font-size:12px;line-height:1.35;display:none;gap:8px;align-items:flex-start;pointer-events:none}" +
      "#lt-drip-ear.on{display:flex}" +
      "#lt-drip-ear .lt-drip-x{pointer-events:auto;position:absolute;top:2px;right:6px;border:0;background:transparent;color:rgba(226,232,240,.7);font-size:16px;cursor:pointer}" +
      "#lt-drip-ear img{width:28px;height:28px;border-radius:8px;object-fit:cover}" +
      "body:has(#screen-sandbox.active) #lt-drip-ear{display:none!important}";
    document.head.appendChild(s);
  }
  function ensureEar() {
    ensureCss();
    if (earEl && document.body.contains(earEl)) return earEl;
    earEl = document.createElement("aside");
    earEl.id = "lt-drip-ear";
    earEl.innerHTML = '<button type="button" class="lt-drip-x" aria-label="Dismiss">\u00d7</button><img src="hub-portrait.jpg" alt="" /><div class="lt-drip-body"><strong>HUB</strong><p class="lt-drip-line"></p></div>';
    document.body.appendChild(earEl);
    earEl.querySelector(".lt-drip-x").onclick = function (e) { e.preventDefault(); hide(); };
    return earEl;
  }
  function hide() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    ensureEar().classList.remove("on");
  }
  function show(id, force) {
    var tip = tips[id]; if (!tip) return false;
    if (!force && !canShow(id)) return false;
    var pair = tipState(id); var tipSt = pair.tip; var now = Date.now();
    if (!force && tipSt.lastAt && now - tipSt.lastAt < SIX_H) return false;
    tipSt.shows = (tipSt.shows || 0) + 1; tipSt.lastAt = now;
    pair.store.tips[id] = tipSt; save(pair.store); lastShownAt = now;
    var el = ensureEar(); var p = el.querySelector(".lt-drip-line");
    if (p) p.textContent = tip.shopLine;
    el.classList.add("on");
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 9000);
    return true;
  }
  function trigger(id) { return show(id, false); }
  function nudge(idOrCtx) {
    var key = String(idOrCtx || "").trim();
    if (tips[key]) return trigger(key) ? key : null;
    if (trigger("manifold_colors")) return "manifold_colors";
    return null;
  }
  register("manifold_colors", "sandbox|gauges", "Blue hugs suction, red hugs liquid, yellow is the utility. Colors keep you from swapping tanks blind.", "manifold hose colors");
  register("sh_coil", "sandbox", "Coil SH is at the bulb. Total SH is at the compressor. Target SH is the chart.", "coil SH");
  register("sc_dirty", "sandbox", "High head with SC about normal on a dirty roof is a dirty condenser, not overcharge. Wash the coil; do not pull gas.", "dirty condenser");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { ensureEar(); });
  else ensureEar();
  global.LtDrip = { register: register, trigger: trigger, nudge: nudge, show: show, hide: hide, tips: tips };
})(window);
