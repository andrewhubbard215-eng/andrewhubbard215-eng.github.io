/* Clock-in floor v48 — cards start sandbox / PS prove / furnace SOO. No remote blob. */
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
    if (typeof window.ltRestoreSandboxBay === "function") {
      try { window.ltRestoreSandboxBay(); } catch (_) {}
    }
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
    if (m === "voltmeter" && window.VoltmeterSchool && typeof window.VoltmeterSchool.open === "function") {
      try { window.VoltmeterSchool.open(); return; } catch (_) {}
    }
    if (m === "ohm" && window.OhmSchool && typeof window.OhmSchool.open === "function") {
      try { window.OhmSchool.open(); return; } catch (_) {}
    }
    if ((m === "ohms-tickets" || m === "ohms-law") && window.OhmsLawSchool && typeof window.OhmsLawSchool.open === "function") {
      try { window.OhmsLawSchool.open(); return; } catch (_) {}
    }
    if ((m === "truck-pouch" || m === "truck") && window.TruckPouch && typeof window.TruckPouch.open === "function") {
      try { window.TruckPouch.open(); return; } catch (_) {}
    }
    if (m === "soo") {
      var BCS = window.BoardCodes || window.LtBoardCodes;
      if (BCS && typeof BCS.openSoo === "function") { try { BCS.openSoo(); return; } catch (_) {} }
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
        var host = document.getElementById("screen-service");
        if (host && window.ServiceCalls && typeof window.ServiceCalls.start === "function") {
          window.ServiceCalls.start(host, { onHub: goHub });
        }
      } catch (_) {}
      return;
    }
    if (m === "quiz" && window.QuizArena && typeof window.QuizArena.start === "function") {
      show("quiz");
      try { window.QuizArena.start(document.getElementById("quiz-root"), { onHub: goHub }); } catch (_) {}
      return;
    }
    if (m === "minisplit" && window.MiniSplit && typeof window.MiniSplit.start === "function") {
      show("minisplit");
      try { window.MiniSplit.start(document.getElementById("minisplit-root")); } catch (_) {}
      return;
    }
    if (m === "epa608") {
      show("epa608");
      var E = window.Epa608Tutor || window.Epa608;
      if (E && typeof E.start === "function") { try { E.start(document.getElementById("epa608-root")); } catch (_) {} }
      return;
    }
    if (m === "commandments") {
      show("commandments");
      var C = window.HvacCommandments || window.Commandments;
      if (C && typeof C.start === "function") { try { C.start(document.getElementById("commandments-root")); } catch (_) {} }
      return;
    }
    if (m === "recovery") {
      show("recovery");
      if (window.LtRecoveryRoom && typeof window.LtRecoveryRoom.start === "function") {
        try { window.LtRecoveryRoom.start(document.getElementById("recovery-root")); } catch (_) {}
      }
      return;
    }
    if (m === "desk") {
      try { window.location.href = "/desk/"; } catch (_) {}
      return;
    }
    if (typeof window.ltPlayGo === "function") {
      try {
        var handled = window.ltPlayGo(m);
        if (handled === true) return;
      } catch (_) {}
    }
    show(m);
  }
  function bindCards() {
    document.querySelectorAll(".mode-card").forEach(function (card) {
      if (card.getAttribute("data-lt-bound") === "48") return;
      card.setAttribute("data-lt-bound", "48");
      card.addEventListener(
        "click",
        function (e) {
          var mode = card.getAttribute("data-mode");
          var href = card.getAttribute("href") || "";
          if (!mode && /\/desk\/?$/.test(href)) mode = "desk";
          if (!mode) return;
          if (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
          }
          openMode(mode);
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
  function labFromQuery() {
    try {
      var q = new URLSearchParams(location.search || "").get("lab");
      if (!q) return null;
      var map = {
        sandbox: "sandbox",
        lugs: "elguide",
        electrical: "electrical",
        epa: "epa608",
        epa608: "epa608",
        service: "service"
      };
      return map[String(q).toLowerCase()] || null;
    } catch (_) {
      return null;
    }
  }
  function openLabDoor() {
    var lab = labFromQuery();
    if (!lab || window.__ltLabOpened) return;
    window.__ltLabOpened = 1;
    try {
      var start = document.getElementById("btn-start");
      if (start) start.click();
    } catch (_) {}
    setTimeout(function () {
      try { openMode(lab); } catch (_) {}
    }, 280);
  }
  function afterBlob() {
    rootPatch("sandbox-root", /Loading system bay/, "sb-load-hub", "Loading system bay\u2026 seat LEFT when the gauges paint.");
    rootPatch("electrical-root", /Loading land lugs/, "el-load-hub", "Loading land lugs\u2026 chips LEFT.");
    bindCards();
    setInterval(bindCards, 1000);
    setTimeout(openLabDoor, 500);
    setTimeout(openLabDoor, 1400);
  }
  afterBlob();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindCards);
  else bindCards();
})();
