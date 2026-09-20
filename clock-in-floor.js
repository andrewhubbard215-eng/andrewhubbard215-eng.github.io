/* Clock In + floor cards must work even when locker nodes are missing.
   Owns navigation: stub game.js ltPlay is a no-op for sandbox/electrical — we replace it. */
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
  function floorName() {
    try {
      var raw = localStorage.getItem("lt-hvac-allstars-html-v1");
      if (raw) {
        var s = JSON.parse(raw);
        if (s && s.callsign && String(s.callsign).trim()) {
          return String(s.callsign).trim().slice(0, 16);
        }
      }
    } catch (_) {}
    var el = document.getElementById("hub-name");
    var t = el && el.textContent ? el.textContent.trim() : "";
    if (t && t !== "Guest") return t;
    return "Tech";
  }
  function paintWallet() {
    function set(id, val) {
      var n = document.getElementById(id);
      if (n) n.textContent = val;
    }
    var cash = 0, jobs = 0, xp = 0;
    try {
      var raw = localStorage.getItem("lt-hvac-allstars-html-v1");
      if (raw) {
        var s = JSON.parse(raw);
        cash = Number(s.cash) || 0;
        jobs = Number(s.jobsCompleted) || 0;
        xp = Number(s.xp) || 0;
      }
    } catch (_) {}
    set("hub-name", floorName());
    set("hub-cash", "$" + Math.round(cash).toLocaleString("en-US"));
    set("hub-jobs", jobs + " jobs");
    set("hub-xp", xp + " XP");
  }
  function goHub() {
    show("hub");
    paintWallet();
    var hub = document.getElementById("screen-hub");
    if (hub) {
      hub.classList.add("active");
      hub.classList.add("screen-on");
    }
    var title = document.getElementById("screen-title");
    if (title) {
      title.classList.remove("active");
      title.classList.remove("screen-on");
    }
  }
  window.ltGoHub = goHub;
  function isStubPlay(fn) {
    if (typeof fn !== "function") return true;
    var src = Function.prototype.toString.call(fn);
    return src.indexOf('mode === "character"') >= 0 || src.indexOf("mode === 'character'") >= 0;
  }
  var sbCtl = null;
  var sbScripts = ["sandbox.js?v=139", "sandbox-hook.js?v=13"];
  var sbLoading = false;
  function loadSandboxScripts(done) {
    if (window.HVACSandbox && window.HVACSandbox.start) {
      if (!window._ltSbHookLoaded) {
        var h = document.createElement("script");
        h.src = "sandbox-hook.js?v=13";
        h.onload = function () { window._ltSbHookLoaded = true; done(); };
        h.onerror = function () { done(); };
        document.head.appendChild(h);
        return;
      }
      return done();
    }
    if (sbLoading) {
      var n = 0;
      var t = setInterval(function () {
        n++;
        if (window.HVACSandbox && window.HVACSandbox.start) {
          clearInterval(t);
          done();
        } else if (n > 80) {
          clearInterval(t);
          done(new Error("timeout"));
        }
      }, 50);
      return;
    }
    sbLoading = true;
    var i = 0;
    function next() {
      if (i >= sbScripts.length) {
        sbLoading = false;
        window._ltSbHookLoaded = true;
        return done();
      }
      var s = document.createElement("script");
      s.src = sbScripts[i++];
      s.onload = next;
      s.onerror = function () {
        sbLoading = false;
        done(new Error("script"));
      };
      document.head.appendChild(s);
    }
    next();
  }
  window.ltStartSandbox = startSandbox;
  function startSandbox() {
    show("sandbox");
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    function run() {
      if (!window.HVACSandbox || !window.HVACSandbox.start) {
        root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>Hard-refresh (Ctrl+Shift+R).</p></div>";
        return;
      }
      try {
        if (sbCtl && sbCtl.stop) sbCtl.stop();
      } catch (_) {}
      try {
        sbCtl = window.HVACSandbox.start(root, { nickname: floorName() });
        var hub = sbCtl && sbCtl.getHubBtn && sbCtl.getHubBtn();
        if (hub) hub.onclick = function () { goHub(); };
        setTimeout(function () {
          if (!root.querySelector("#sb-run") && !root.querySelector("[data-part]")) {
            try { sbCtl = window.HVACSandbox.start(root, { nickname: floorName() }); } catch (_) {}
          }
          if (typeof window._ltEnsureEasySeat === "function") {
            try { window._ltEnsureEasySeat(); } catch (_) {}
          }
        }, 100);
        setTimeout(function () {
          if (typeof window._ltEnsureEasySeat === "function") {
            try { window._ltEnsureEasySeat(); } catch (_) {}
          }
        }, 400);
      } catch (e) {
        root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>Hard-refresh (Ctrl+Shift+R).</p></div>";
      }
    }
    if (window.HVACSandbox && window.HVACSandbox.start) return run();
    root.innerHTML = "<div class='panel' style='margin:20px'><p>Loading system bay…</p></div>";
    loadSandboxScripts(function (err) {
      if (err) {
        root.innerHTML = "<div class='panel' style='margin:20px'><h2>System sandbox</h2><p>Hard-refresh (Ctrl+Shift+R).</p></div>";
        return;
      }
      run();
    });
  }
  function electricalLab() {
    return (
      window.HVACElectrical ||
      window.ElectricalLab ||
      window.LtElectricalLite ||
      window.LtElectrical ||
      window.ElectricalFat ||
      null
    );
  }
  function emptyRootFallback(root) {
    root.innerHTML =
      "<div class='panel' style='margin:16px;padding:16px;max-width:480px'>" +
      "<h2>Land lugs</h2>" +
      "<p>24V path - R C Y G W. Ladder lighten cleared the root — tap a lug color, then the screw.</p>" +
      "<div style='display:flex;flex-wrap:wrap;gap:8px;margin:12px 0'>" +
      "<button type='button' class='btn primary el-lug' data-lug='hot'>Hot - black</button>" +
      "<button type='button' class='btn el-lug' data-lug='neu'>Neutral - off-white</button>" +
      "<button type='button' class='btn el-lug' data-lug='gnd'>Ground - green</button>" +
      "</div>" +
      "<button type='button' class='btn' data-lt-close-hub>Shop floor</button></div>";
  }
  function loadElectricalLite(done) {
    /* Phone OOM path — never pull electrical.js / electrical-fat.js from the floor router. */
    var lab = electricalLab();
    if (lab && lab.start) return done();
    if (window._ltElLiteLoading) {
      var n = 0;
      var t = setInterval(function () {
        n++;
        if (electricalLab() && electricalLab().start) {
          clearInterval(t);
          done();
        } else if (n > 80) {
          clearInterval(t);
          done(new Error("timeout"));
        }
      }, 50);
      return;
    }
    window._ltElLiteLoading = true;
    var s = document.createElement("script");
    s.src = "electrical-lite.js?v=5";
    s.onload = function () {
      window._ltElLiteLoading = false;
      done();
    };
    s.onerror = function () {
      window._ltElLiteLoading = false;
      done(new Error("script"));
    };
    document.head.appendChild(s);
  }
  function startElectrical(opts) {
    show("electrical");
    var root = document.getElementById("electrical-root");
    if (!root) return;
    function run() {
      var lab = electricalLab();
      if (lab && lab.start) {
        try { lab.start(root, opts || {}); } catch (_) {}
      }
      setTimeout(function () {
        if (!root || !root.children || root.children.length === 0 || !(root.innerHTML || "").trim()) {
          emptyRootFallback(root);
        }
      }, 80);
      if (!root.innerHTML) {
        root.innerHTML =
          "<div class='panel' style='margin:20px'><h2>No-cool sheet</h2><p>Ladder did not paint. Hard-refresh (Ctrl+Shift+R) and clock back in.</p><button type='button' class='btn' data-lt-close-hub>Shop floor</button></div>";
      }
    }
    if (electricalLab() && electricalLab().start) return run();
    root.innerHTML = "<div class='panel' style='margin:20px'><p>Loading land lugs…</p></div>";
    loadElectricalLite(function () {
      run();
    });
  }
  function bindShopFloor(id) {
    var hub = document.getElementById(id);
    if (!hub) return;
    hub.onclick = function (e) {
      if (e) e.preventDefault();
      goHub();
    };
  }
  function miniSplitLab() {
    return window.MiniSplitInstall || window.MiniSplit || window.MiniSplitLab || null;
  }
  function startMiniSplit() {
    show("minisplit");
    var root = document.getElementById("minisplit-root");
    if (!root) return;
    var lab = miniSplitLab();
    if (lab && lab.start) {
      try { lab.start(root, { onDone: function () { goHub(); } }); } catch (_) {}
    }
    setTimeout(function () {
      var hubBtn = root.querySelector("#ms-hub");
      if (hubBtn && !hubBtn.getAttribute("data-lt-hub")) {
        hubBtn.setAttribute("data-lt-hub", "1");
        hubBtn.onclick = function (e) {
          if (e) e.preventDefault();
          goHub();
        };
      }
      if (!root || (root.children && root.children.length)) return;
      root.innerHTML =
        "<div class='panel' style='margin:16px;padding:16px;max-width:480px'>" +
        "<h2>Mini-split install</h2>" +
        "<p>Lab did not paint. Hard-refresh (Ctrl+Shift+R) and clock back in.</p>" +
        "<button type='button' class='btn' data-lt-close-hub>Shop floor</button></div>";
      var b = root.querySelector("[data-lt-close-hub]");
      if (b) b.onclick = function (e) { if (e) e.preventDefault(); goHub(); };
    }, 80);
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
    if (m === "minisplit") return startMiniSplit();
    if (m === "service") {
      show("service");
      var host = document.getElementById("screen-service") || document.getElementById("svc-choices");
      if (window.ServiceCalls && window.ServiceCalls.start) {
        try { window.ServiceCalls.start(host, { onHub: goHub }); } catch (_) {}
      }
      bindShopFloor("btn-svc-hub");
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
      bindShopFloor("btn-rapture-hub");
      return;
    }
    if (m === "boardcodes") {
      goHub();
      setTimeout(function () {
        var BC = window.BoardCodes || window.LtBoardCodes;
        var open = BC && (BC.openLocker || BC.openProve || BC.open);
        if (typeof open === "function") open();
      }, 60);
      return;
    }
    if (m === "truck-pouch") {
      show("truck-pouch");
      var tp = document.getElementById("truck-pouch-root");
      var TP = window.TruckPouch || window.LtTruckPouch;
      if (tp && TP && TP.start) {
        try { TP.start(tp); } catch (_) {}
      }
      return;
    }
    show(m);
  }
  function play(m) {
    if (!m) return;
    if (m === "hub") return goHub();
    if (m === "boardcodes" || m === "service" || m === "defusal" || m === "electrical" || m === "elguide" || m === "sandbox" || m === "minisplit") {
      rescuePlay(m);
      return;
    }
    if (typeof window.ltPlay === "function" && !isStubPlay(window.ltPlay) && window.ltPlay !== playDispatch) {
      try { window.ltPlay(m); } catch (_) { rescuePlay(m); return; }
      if (m === "service") bindShopFloor("btn-svc-hub");
      return;
    }
    rescuePlay(m);
  }
  function playDispatch(mode) {
    if (!mode || mode === "character") return;
    play(mode);
  }
  playDispatch._ltFloor = true;
  window.ltPlay = playDispatch;
  window.ltPlayGo = playDispatch;
  function bindCards() {
    document.querySelectorAll(".mode-card[data-mode]").forEach(function (card) {
      if (card.getAttribute("data-lt-bound") === "2") return;
      card.setAttribute("data-lt-bound", "2");
      card.addEventListener("click", function (e) {
        e.preventDefault();
        play(card.getAttribute("data-mode"));
      });
    });
    bindShopFloor("btn-svc-hub");
    bindShopFloor("btn-rapture-hub");
  }
  function bindStart() {
    var btn = document.getElementById("btn-start");
    if (!btn) return;
    if (btn.getAttribute("data-lt-bound") === "1") return;
    btn.setAttribute("data-lt-bound", "1");
    btn.addEventListener(
      "click",
      function (e) {
        if (e) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
        try { goHub(); } catch (_) {}
      },
      true
    );
  }
  function bind() {
    bindStart();
    bindCards();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
  setInterval(function () {
    bindCards();
    var btn = document.getElementById("btn-start");
    if (btn && btn.getAttribute("data-lt-bound") !== "1") bindStart();
  }, 1000);

  document.addEventListener(
    "click",
    function (e) {
      var t = e.target && e.target.closest ? e.target.closest("#el-locker-close, #el-prove-close, #el-soo-close, [data-lt-close-hub]") : null;
      if (!t) return;
      try {
        var wrap = document.getElementById("el-locker-overlay");
        if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      } catch (_) {}
      try { goHub(); } catch (_) {}
    },
    true
  );
})();
