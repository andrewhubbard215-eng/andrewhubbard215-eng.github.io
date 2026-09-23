/* HVAC Allstars — Start compressor yells when parts still LEFT */
(function () {
  "use strict";
  function missing() {
    var need = ["compressor", "condenser", "metering", "evaporator"];
    var slots = document.querySelectorAll("#sb-slots .sb-slot[data-slot]");
    if (!slots.length) {
      return need.filter(function (id) {
        var el = document.querySelector('#sandbox-root [data-part="' + id + '"]');
        return el && !el.classList.contains("primary") && el.getAttribute("aria-pressed") !== "true";
      });
    }
    return need.filter(function (id) {
      var sl = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
      return !sl || !(sl.classList.contains("filled") || sl.querySelector("img, strong, .rm"));
    });
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
    ban.textContent = "PARTS LEFT — seat " + miss.join(", ") + " on the rail. Compressor stays off. Standing P/T only. No SH/SC until the loop is closed.";
    clearTimeout(ban._t);
    ban._t = setTimeout(function () {
      if (ban.parentNode) ban.parentNode.removeChild(ban);
    }, 8000);
  }
  function arm() {
    var btn = document.getElementById("sb-run");
    if (!btn || btn.dataset.yellArmed === "1") return;
    btn.dataset.yellArmed = "1";
    btn.addEventListener("click", function () {
      var miss = missing();
      if (miss.length) yell(miss);
    }, true);
  }
  setInterval(arm, 400);
})();
