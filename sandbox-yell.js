/* HVAC Allstars — Start compressor blocked until parts seated LEFT */
(function () {
  "use strict";
  function seated(id) {
    var aliases = id === "metering" ? ["metering", "txv"] : [id];
    var i;
    for (i = 0; i < aliases.length; i++) {
      var sl = document.querySelector('#sb-slots .sb-slot[data-slot="' + aliases[i] + '"]');
      if (sl && (sl.classList.contains("filled") || sl.querySelector("img, strong, .rm"))) return true;
      var el = document.querySelector('#sandbox-root [data-part="' + aliases[i] + '"]');
      if (el && (el.classList.contains("primary") || el.getAttribute("aria-pressed") === "true")) return true;
    }
    var labels = id === "metering" ? ["txv", "metering"] : [id];
    var btns = document.querySelectorAll("#sandbox-root button, #sandbox-root .sb-part");
    for (i = 0; i < btns.length; i++) {
      var t = (btns[i].textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
      var p = (btns[i].getAttribute("data-part") || "").toLowerCase();
      if (labels.indexOf(t) === -1 && labels.indexOf(p) === -1) continue;
      if (btns[i].classList.contains("primary") || btns[i].getAttribute("aria-pressed") === "true") return true;
    }
    return false;
  }
  function missing() {
    var need = ["compressor", "condenser", "metering", "evaporator"];
    return need.filter(function (id) { return !seated(id); });
  }
  function pretty(id) {
    return id === "metering" ? "TXV" : id;
  }
  function yell(miss) {
    var ban = document.getElementById("sb-parts-yell");
    if (!ban) {
      ban = document.createElement("div");
      ban.id = "sb-parts-yell";
      ban.setAttribute("role", "status");
      ban.style.cssText = "position:fixed;left:12px;right:12px;top:56px;z-index:80;background:#7f1d1d;color:#fff;padding:10px 14px;border-radius:8px;font:700 14px/1.35 sans-serif;box-shadow:0 8px 24px #0008";
      (document.getElementById("sandbox-root") || document.body).appendChild(ban);
    }
    ban.textContent = "PARTS LEFT — seat " + miss.map(pretty).join(", ") + " on the rail. Compressor stays off. Standing P/T only. No SH/SC until the loop is closed.";
    clearTimeout(ban._t);
    ban._t = setTimeout(function () {
      if (ban.parentNode) ban.parentNode.removeChild(ban);
    }, 8000);
  }
  function blockStart(e) {
    var t = e.target && e.target.closest ? e.target.closest("#sb-run") : null;
    if (!t) return;
    if (/stop/i.test(t.textContent || "")) return;
    var miss = missing();
    if (!miss.length) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    yell(miss);
    var st = document.getElementById("sb-status");
    if (st) st.textContent = "Standing pressures - Tech - seat the four LEFT";
  }
  if (!window.__ltYellCap) {
    window.__ltYellCap = 1;
    document.addEventListener("click", blockStart, true);
    document.addEventListener("pointerdown", blockStart, true);
  }
})();
