/* Clock-in floor v41 — cards start sandbox / PS prove. No remote blob. */
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
    if (m === "sandbox" && typeof window.ltStartSandbox === "function") {
      try { window.ltStartSandbox(); return; } catch (_) {}
    }
    /* Injected schools — floor capture used to swallow their own open() clicks. */
    if (m === "voltmeter" && window.VoltmeterSchool && typeof window.VoltmeterSchool.open === "function") {
      try { window.VoltmeterSchool.open(); return; } catch (_) {}
    }
    if (m === "ohm" && window.OhmSchool && typeof window.OhmSchool.open === "function") {
      try { window.OhmSchool.open(); return; } catch (_) {}
    }
    if ((m === "truck-pouch" || m === "truck") && window.TruckPouch && typeof window.TruckPouch.open === "function") {
      try { window.TruckPouch.open(); return; } catch (_) {}
    }
    if (m === "prove") {
      var BC = window.BoardCodes || window.LtBoardCodes;
      if (BC && typeof BC.openProve === "function") { try { BC.openProve(); return; } catch (_) {} }
    }
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
    if (m === "defusal" || m === "electrical" || m === "elguide") {
      if (typeof window.ltPlay === "function") {
        try { window.ltPlay(m); return; } catch (_) {}
      }
      show("electrical");
      return;
    }
    if (m === "service") {
      show("service");
      try {
        var host = document.getElementById("svc-choices") || document.querySelector("#screen-service .svc-card") || document.getElementById("screen-service");
        if (host && window.ServiceCalls && typeof window.ServiceCalls.start === "function") {
          window.ServiceCalls.start(host, { onHub: goHub });
        }
      } catch (_) {}
      return;
    }
    /* Stub ltPlayGo only handles hub/character — do not return early or every other bay goes blank. */
    if (typeof window.ltPlayGo === "function") {
      try {
        var handled = window.ltPlayGo(m);
        if (handled === true) return;
      } catch (_) {}
    }
    show(m);
  }
  function bindCards() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-bound") === "41") return;
      card.setAttribute("data-lt-bound", "41");
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
    rootPatch("sandbox-root", /Loading system bay/, "sb-load-hub", "Loading system bay\u2026 seat LEFT when the gauges paint.");
    rootPatch("electrical-root", /Loading land lugs/, "el-load-hub", "Loading land lugs\u2026 chips LEFT.");
    bindCards();
    setInterval(bindCards, 1000);
  }
  afterBlob();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindCards);
  else bindCards();
})();
