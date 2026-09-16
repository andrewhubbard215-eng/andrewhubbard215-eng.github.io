/* Clock In + floor cards must work even when locker nodes are missing. */
(function () {
  function show(id) {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.remove("active");
    });
    var el = document.getElementById("screen-" + id);
    if (el) el.classList.add("active");
  }
  function goHub() {
    show("hub");
    var name = document.getElementById("hub-name");
    if (name && (!name.textContent || name.textContent === "Tech")) name.textContent = "Guest";
  }
  function isStubPlay(fn) {
    if (typeof fn !== "function") return true;
    var src = Function.prototype.toString.call(fn);
    return src.indexOf('mode === "character"') >= 0 || src.indexOf("mode === 'character'") >= 0;
  }
  var sbCtl = null;
  function startSandbox() {
    show("sandbox");
    var root = document.getElementById("sandbox-root");
    if (!root || !window.HVACSandbox || !window.HVACSandbox.start) return;
    try {
      if (sbCtl && sbCtl.stop) sbCtl.stop();
    } catch (_) {}
    try {
      sbCtl = window.HVACSandbox.start(root, { nickname: "Guest" });
      var hub = sbCtl && sbCtl.getHubBtn && sbCtl.getHubBtn();
      if (hub) hub.onclick = function () { goHub(); };
    } catch (e) {
      root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>Hard-refresh (Ctrl+Shift+R).</p></div>";
    }
  }
  function startElectrical(opts) {
    show("electrical");
    var root = document.getElementById("electrical-root");
    if (!root) return;
    if (window.HVACElectrical && window.HVACElectrical.start) {
      try { window.HVACElectrical.start(root, opts || {}); } catch (_) {}
    } else if (window.ElectricalFat && window.ElectricalFat.start) {
      try { window.ElectricalFat.start(root, opts || {}); } catch (_) {}
    }
  }
  function rescuePlay(m) {
    if (!m) return;
    if (m === "hub") return goHub();
    if (m === "sandbox") return startSandbox();
    if (m === "electrical" || m === "elguide") return startElectrical({ guide: m === "elguide" });
    if (m === "defusal") return startElectrical({ defuse: true });
    if (m === "quiz" && window.QuizArena && window.QuizArena.start) {
      show("quiz");
      try { window.QuizArena.start(document.getElementById("quiz-root")); } catch (_) {}
      return;
    }
    if (m === "minisplit" && window.MiniSplit && window.MiniSplit.start) {
      show("minisplit");
      try { window.MiniSplit.start(document.getElementById("minisplit-root")); } catch (_) {}
      return;
    }
    if (m === "service") {
      show("service");
      if (window.ServiceCalls && window.ServiceCalls.start) {
        try { window.ServiceCalls.start(document.getElementById("svc-choices")); } catch (_) {}
      }
      return;
    }
    if (m === "epa608" && window.Epa608 && window.Epa608.start) {
      show("epa608");
      try { window.Epa608.start(document.getElementById("epa608-root")); } catch (_) {}
      return;
    }
    if (m === "commandments" && window.Commandments && window.Commandments.start) {
      show("commandments");
      try { window.Commandments.start(document.getElementById("commandments-root")); } catch (_) {}
      return;
    }
    if (m === "rapture") {
      show("rapture");
      return;
    }
    if (m === "boardcodes") {
      startElectrical({ guide: true });
      setTimeout(function () {
        var BC = window.BoardCodes || window.LtBoardCodes;
        var open = BC && (BC.openLocker || BC.openProve || BC.open);
        if (typeof open === "function") open();
      }, 120);
      return;
    }
    show(m);
  }
  function play(m) {
    if (!m) return;
    if (typeof window.ltPlay === "function" && !isStubPlay(window.ltPlay)) {
      window.ltPlay(m);
      return;
    }
    rescuePlay(m);
  }
  function bindCards() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-bound") === "2") return;
      card.setAttribute("data-lt-bound", "2");
      card.addEventListener("click", function (e) {
        e.preventDefault();
        play(card.getAttribute("data-mode"));
      });
    });
  }
  function bind() {
    var btn = document.getElementById("btn-start");
    if (btn && !btn.getAttribute("data-lt-bound")) {
      btn.setAttribute("data-lt-bound", "1");
      btn.addEventListener(
        "click",
        function () {
          try { goHub(); } catch (_) {}
        },
        true
      );
    }
    bindCards();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  setInterval(bindCards, 1000);
})();
