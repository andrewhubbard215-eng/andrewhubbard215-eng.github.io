/* Land Lugs: prefer photo bench (LtElectricalLite) when guide opens. Restores PLACEHOLDER damage. */
(function () {
  "use strict";
  function show(id) {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.remove("active");
      s.classList.remove("screen-on");
    });
    if (id === "defusal" || id === "elguide") id = "electrical";
    var el = document.getElementById("screen-" + id);
    if (el) {
      el.classList.add("active");
      el.classList.add("screen-on");
    }
  }
  function startElectrical(opts) {
    show("electrical");
    var root = document.getElementById("electrical-root");
    if (!root) return;
    opts = opts || {};
    var lab =
      opts.guide && window.LtElectricalLite && window.LtElectricalLite.start
        ? window.LtElectricalLite
        : window.HVACElectrical || window.ElectricalLab || window.LtElectricalLite || null;
    if (lab && lab.start) {
      try {
        lab.start(root, opts);
      } catch (_) {}
    }
  }
  function play(m) {
    if (!m) return;
    if (m === "electrical" || m === "elguide") return startElectrical({ guide: m === "elguide" });
    if (m === "defusal") return startElectrical({ defuse: true });
    if (typeof window.ltPlay === "function" && !window.ltPlay._ltLugsRoute) {
      try {
        return window.ltPlay(m);
      } catch (_) {}
    }
  }
  var prev = window.ltPlay;
  function dispatch(mode) {
    if (!mode || mode === "character") return;
    if (mode === "electrical" || mode === "elguide" || mode === "defusal") return play(mode);
    if (typeof prev === "function") return prev(mode);
  }
  dispatch._ltLugsRoute = true;
  window.ltPlay = dispatch;
  window.ltPlayGo = dispatch;
  /* If PLACEHOLDER wiped clock-in-fix, rebind mode cards */
  function bind() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-lugs") === "1") return;
      card.setAttribute("data-lt-lugs", "1");
      card.addEventListener(
        "click",
        function (e) {
          var m = card.getAttribute("data-mode");
          if (m === "electrical" || m === "elguide" || m === "defusal") {
            e.preventDefault();
            e.stopPropagation();
            play(m);
          }
        },
        true
      );
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  setInterval(bind, 1500);
})();
