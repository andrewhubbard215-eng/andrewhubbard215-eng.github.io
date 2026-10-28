/* Mini-split chip preview — tap any step to show its visual (Do still credits) */
(function () {
  "use strict";
  function isPhone() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 480px)").matches);
    } catch (_) {
      return !!(window.innerWidth && window.innerWidth <= 480);
    }
  }
  function bind(host) {
    if (!host || !isPhone()) return;
    var MS = window.MiniSplitInstall;
    if (!MS || !MS.STEPS) return;
    host.querySelectorAll(".ms-step").forEach(function (b) {
      if (b._msChipPreview) return;
      b._msChipPreview = true;
      b.addEventListener(
        "click",
        function () {
          var i = +b.getAttribute("data-i");
          if (!(i >= 0 && i < MS.STEPS.length)) return;
          try {
            var card = host.querySelector(".ms-card");
            var st = MS.STEPS[i];
            if (!card || !st) return;
            var h3 = card.querySelector("h3");
            var tip = card.querySelector(".ms-tip");
            var detail = card.querySelector(".ms-detail");
            if (h3) h3.textContent = st.title;
            if (tip) tip.textContent = st.tip;
            if (detail) detail.textContent = st.detail;
            host.querySelectorAll(".ms-step").forEach(function (x) {
              x.classList.toggle("active", +x.getAttribute("data-i") === i);
            });
            var vis = host.querySelector(".ms-step-visual, .ms-diagram-inline .ms-step-visual");
            if (vis) vis.innerHTML = "<strong>Now:</strong> " + st.title.replace(/^\d+\s·\s/, "");
            var doneCount = host.querySelectorAll(".ms-step.done").length;
            var ban = card.querySelector(".ms-preview-banner");
            if (i !== doneCount) {
              if (!ban) {
                ban = document.createElement("p");
                ban.className = "ms-preview-banner";
                ban.textContent = "Preview — Do still required to credit";
                if (h3 && h3.nextSibling) card.insertBefore(ban, h3.nextSibling);
                else card.insertBefore(ban, card.firstChild);
              } else {
                ban.textContent = "Preview — Do still required to credit";
              }
            } else if (ban) {
              ban.remove();
            }
            if (window.LtDrip && typeof window.LtDrip.nudge === "function") {
              if (/flare|torque/i.test(st.id)) window.LtDrip.nudge("manifold_colors");
              else if (/vacuum|decay/i.test(st.id)) window.LtDrip.nudge("recover_608");
            }
          } catch (_) {}
        },
        true
      );
    });
  }
  function tick() {
    var host = document.getElementById("minisplit-root");
    if (host) bind(host);
  }
  setInterval(tick, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
})();
