/* Clock-in floor v39 — last-good router blob + card bind that game.js stub cannot eat. */
(function () {
  function show(id) {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.remove("active");
      s.classList.remove("screen-on");
    });
    var el = document.getElementById("screen-" + id);
    if (el) {
      el.classList.add("active");
      el.classList.add("screen-on");
    }
  }
  function goHub() {
    if (typeof window.ltGoHub === "function") {
      try { window.ltGoHub(); return; } catch (_) {}
    }
    show("hub");
  }
  function openMode(m) {
    if (!m || m === "character") return;
    if (m === "hub") return goHub();
    if (m === "film") {
      show("film");
      var fr = document.getElementById("film-root");
      if (fr && window.LtFilm && window.LtFilm.start) {
        try { window.LtFilm.start(fr); } catch (_) {}
      }
      return;
    }
    if (m === "shoplabs") {
      show("shoplabs");
      var lr = document.getElementById("shoplabs-root");
      if (lr && window.ShopLabs && window.ShopLabs.start) {
        try { window.ShopLabs.start(lr); } catch (_) {}
      }
      return;
    }
    if (typeof window.ltPlayGo === "function") {
      try { window.ltPlayGo(m); return; } catch (_) {}
    }
    show(m);
  }
  function bindCards() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-bound") === "39") return;
      card.setAttribute("data-lt-bound", "39");
      card.addEventListener(
        "click",
        function (e) {
          if (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
          openMode(card.getAttribute("data-mode"));
        },
        true
      );
    });
  }
  function rootPatch(id, loadingRe, btnId, copy) {
    var el = document.getElementById(id);
    if (!el) return;
    var obs = new MutationObserver(function () {
      if (loadingRe.test(el.innerHTML || "") && !document.getElementById(btnId)) {
        el.innerHTML =
          "<div class='panel' style='margin:20px'><p>" +
          copy +
          "</p><p><button type='button' class='btn' id='" +
          btnId +
          "'>Shop floor</button></p></div>";
        var b = document.getElementById(btnId);
        if (b)
          b.onclick = function (e) {
            if (e) e.preventDefault();
            goHub();
          };
      }
    });
    try {
      obs.observe(el, { childList: true, subtree: true });
    } catch (_) {}
  }
  function afterBlob() {
    rootPatch("sandbox-root", /Loading system bay/, "sb-load-hub", "Loading system bay… seat LEFT when the gauges paint.");
    rootPatch("electrical-root", /Loading land lugs/, "el-load-hub", "Loading land lugs… chips LEFT.");
    bindCards();
    setInterval(bindCards, 1000);
  }
  var s = document.createElement("script");
  s.src =
    "https://raw.githubusercontent.com/andrewhubbard215-eng/andrewhubbard215-eng.github.io/54a0489fe2395ff89e3332f5e33596e5c1b559d2/clock-in-floor.js";
  s.onload = afterBlob;
  s.onerror = function () {
    afterBlob();
  };
  document.head.appendChild(s);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindCards);
  else bindCards();
})();
