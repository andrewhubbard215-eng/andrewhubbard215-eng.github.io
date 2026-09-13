/* HVAC Allstars — bench leftover BOM (parts LEFT). Loads after sandbox.js */
(function () {
  function patch() {
    var ul = document.getElementById("sb-bom");
    if (!ul) return;
    if (ul.dataset.benchHook === "1") return;
    var obs = new MutationObserver(function () {
      if (ul.dataset.painting === "1") return;
      var text = ul.textContent || "";
      if (text.indexOf("Still on the bench") !== -1 || text.indexOf("LEFT on the bench") !== -1) return;
      var slots = document.querySelectorAll("#sb-slots .sb-slot");
      if (!slots.length) return;
      var left = [];
      slots.forEach(function (el) {
        if (el.classList.contains("filled")) return;
        var lab = (el.querySelector(".empty") && el.querySelector(".empty").textContent) || el.dataset.slot || "";
        var req = el.classList.contains("required") || el.classList.contains("core");
        left.push("<li class='sb-bom-left'>" + lab + "<small> LEFT on the bench" + (req ? " · required" : "") + "</small></li>");
      });
      if (!left.length) return;
      ul.dataset.painting = "1";
      ul.insertAdjacentHTML("beforeend", "<li class='sb-bom-hd'>Still on the bench</li>" + left.join(""));
      ul.dataset.painting = "0";
      ul.dataset.benchHook = "1";
    });
    obs.observe(ul, { childList: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", patch);
  else patch();
  setInterval(patch, 1200);
})();
