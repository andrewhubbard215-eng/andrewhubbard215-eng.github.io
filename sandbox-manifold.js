/* Phone manifold sheet — open gauges without covering EVAP LEFT. */
(function () {
  "use strict";

  function phone() {
    return window.matchMedia("(max-width: 1100px)").matches;
  }

  function closeSheet(root, gauges, btn) {
    gauges.classList.remove("drawer-open");
    root.classList.remove("manifold-open");
    if (btn) {
      btn.textContent = "Manifold";
      btn.setAttribute("aria-pressed", "false");
    }
  }

  function ensure() {
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var gauges = root.querySelector(".sb-gauges");
    if (!gauges) return;
    if (!phone()) {
      closeSheet(root, gauges, document.getElementById("sb-manifold-toggle"));
      return;
    }
    var bar = document.getElementById("sb-phone-vitals");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sb-phone-vitals";
      bar.className = "sb-phone-vitals";
      var main = root.querySelector(".sb-main") || root;
      main.appendChild(bar);
    }
    var btn = document.getElementById("sb-manifold-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "sb-manifold-toggle";
      btn.className = "btn tiny";
      btn.textContent = "Manifold";
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var open = gauges.classList.toggle("drawer-open");
        root.classList.toggle("manifold-open", open);
        btn.textContent = open ? "Close gauges" : "Manifold";
        btn.setAttribute("aria-pressed", open ? "true" : "false");
      });
      bar.appendChild(btn);
    }
  }

  setInterval(ensure, 700);
  document.addEventListener("DOMContentLoaded", ensure);
  if (document.body) ensure();
})();
