/* Shop-floor: collapse charge SOP + stamp field SH/SC / running-pressure targets. */
(function () {
  function collapseCharge() {
    var w = document.getElementById("sb-charge-win");
    if (w && !w.dataset.ltFloorOnce) {
      w.classList.add("collapsed");
      w.dataset.ltFloorOnce = "1";
    }
  }
  function stampTargets() {
    if (document.getElementById("lt-charge-targets")) return;
    var host =
      document.getElementById("sb-status") ||
      document.getElementById("g-tgt") ||
      document.getElementById("sb-hint");
    if (!host || !host.parentNode) return;
    var p = document.createElement("p");
    p.id = "lt-charge-targets";
    p.style.cssText =
      "margin:8px 0 0;padding:8px 10px;font-size:12px;line-height:1.35;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:rgba(0,0,0,.35)";
    p.textContent =
      "Field targets · R-410A @ ~75° indoor / 95° outdoor: suction 115–130 psig · head 380–450. TXV: charge by SC 8–12°, SH is a check 8–12°. Piston: charge by SH (chart), SC is a check. High head + low SH = airflow or overcharge — do not keep adding gas.";
    host.parentNode.insertBefore(p, host.nextSibling);
  }
  function tick() {
    collapseCharge();
    stampTargets();
  }
  var obs = new MutationObserver(tick);
  obs.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tick);
  } else {
    tick();
  }
})();
