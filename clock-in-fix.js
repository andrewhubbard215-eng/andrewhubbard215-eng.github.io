/* Clock In + floor cards must work even when locker nodes are missing. */
(function () {
  function goHub() {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.remove("active");
    });
    var hub = document.getElementById("screen-hub");
    if (hub) hub.classList.add("active");
    var name = document.getElementById("hub-name");
    if (name && (!name.textContent || name.textContent === "Tech")) name.textContent = "Guest";
  }
  function play(m) {
    if (!m) return;
    if (typeof window.ltPlay === "function") {
      window.ltPlay(m);
      return;
    }
    if (typeof window.ltGo === "function") {
      if (m === "boardcodes") window.ltGo("electrical");
      else if (m === "elguide" || m === "defusal") window.ltGo("electrical");
      else if (m === "rapture") window.ltGo("rapture");
      else window.ltGo(m);
    }
    if (m === "boardcodes") {
      setTimeout(function () {
        if (window.LtBoardCodes && window.LtBoardCodes.open) window.LtBoardCodes.open();
      }, 80);
    }
  }
  function bindCards() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-bound")) return;
      card.setAttribute("data-lt-bound", "1");
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
          setTimeout(function () {
            try {
              goHub();
              if (typeof window.ltGo === "function") window.ltGo("hub");
            } catch (_) {}
          }, 0);
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
