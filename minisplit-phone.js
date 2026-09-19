/* Mini-split phone completable + store Lincoln scrub — companion tip */
(function () {
  "use strict";

  var CSS_ID = "ms-phone-css-v259";

  function isPhone() {
    try {
      return !!(window.matchMedia && window.matchMedia("(max-width: 480px)").matches);
    } catch (_) {
      return !!(window.innerWidth && window.innerWidth <= 480);
    }
  }

  function isStore() {
    try {
      return (
        document.documentElement.classList.contains("sku-store") ||
        /[?&]sku=store\b/.test(location.search) ||
        !!(window.LtBrand && window.LtBrand.isStore)
      );
    } catch (_) {
      return false;
    }
  }

  function ensureCss() {
    if (document.getElementById(CSS_ID)) return;
    var s = document.createElement("style");
    s.id = CSS_ID;
    s.textContent =
      "@media (max-width:480px){" +
      "#screen-minisplit{padding-bottom:96px}" +
      "#minisplit-root .ms-steps{" +
      "display:flex;flex-direction:row;flex-wrap:nowrap;overflow-x:auto;" +
      "-webkit-overflow-scrolling:touch;gap:6px;max-height:none;padding:4px 0 8px}" +
      "#minisplit-root .ms-step{" +
      "flex:0 0 auto;min-width:112px;min-height:48px;font-size:12px;" +
      "padding:8px 10px;touch-action:manipulation}" +
      "#minisplit-root .ms-step.ms-preview:not(.done):not(.active){" +
      "opacity:.88;outline:1px dashed rgba(94,234,212,.55)}" +
      "#minisplit-root .ms-ref{display:none!important}" +
      "#minisplit-root .ms-diagram:not(.ms-diagram-inline){display:none!important}" +
      "#minisplit-root .ms-diagram-inline{" +
      "display:flex!important;flex-wrap:wrap;align-items:center;gap:6px;" +
      "margin:8px 0;padding:10px;border-radius:12px;" +
      "background:rgba(12,18,28,.82);border:1px solid rgba(80,100,120,.4)}" +
      "#minisplit-root .ms-diagram-inline .ms-step-visual{" +
      "flex:1 1 100%;margin:6px 0 0;font-size:13px;font-weight:600}" +
      "#minisplit-root .ms-preview-banner{" +
      "margin:6px 0;font-size:12px;color:#e8c450;font-weight:600}" +
      "#minisplit-root .ms-actions{" +
      "position:sticky;bottom:0;z-index:30;display:flex;flex-wrap:wrap;gap:8px;" +
      "padding:10px 4px calc(10px + env(safe-area-inset-bottom,0px));" +
      "background:linear-gradient(180deg,transparent,rgba(8,12,18,.96) 28%)}" +
      "#minisplit-root .ms-actions .btn{" +
      "min-height:48px;flex:1 1 42%;font-size:15px;touch-action:manipulation}" +
      "#minisplit-root .ms-actions #ms-do{flex:1 1 100%;font-weight:800;min-height:52px}" +
      "#minisplit-root .ms-feedback{" +
      "min-height:1.35em;font-size:14px;font-weight:700;padding:8px 4px;" +
      "position:sticky;bottom:76px;z-index:28;background:rgba(8,12,18,.92);" +
      "border-radius:8px}" +
      "#minisplit-root .ms-feedback.good{color:#5eead4}" +
      "#minisplit-root .ms-feedback.bad{color:#f87171}" +
      "#minisplit-root .ms-metric input[type=range]," +
      "#minisplit-root #ms-range{width:100%;height:40px;touch-action:none}" +
      "#minisplit-root .ms-card .hub-chip," +
      "#minisplit-root .ms-card .hub-chip{display:none}" +
      "#minisplit-root .ms-detail{font-size:12px;max-height:4.2em;overflow:hidden}" +
      "}" +
      "html.sku-store #minisplit-root .brand-bar," +
      "html.sku-store #minisplit-root .brand-mark," +
      "html.sku-store #minisplit-root .brand-word{display:none!important}";
    document.head.appendChild(s);
  }

  function scrubLincoln(host) {
    if (!host || !isStore()) return;
    try {
      host.querySelectorAll(".brand-bar, .brand-mark, .brand-word").forEach(function (n) {
        n.style.display = "none";
      });
      host.querySelectorAll("h2").forEach(function (h) {
        if (/lincoln/i.test(h.textContent || "")) h.textContent = "Mini-split install";
      });
    } catch (_) {}
  }

  function softDefaults(host) {
    if (!isPhone() || !host || host._msSoftDone) return;
    host._msSoftDone = true;
    var map = {
      flareQuality: 85,
      torque: 13,
      n2: 500,
      microns: 350,
      decay: 500,
      deltaT: 20
    };
    host.querySelectorAll("#ms-range").forEach(function (r) {
      var label = ((r.closest("label") || {}).textContent) || "";
      var key = null;
      if (/Flare/i.test(label)) key = "flareQuality";
      else if (/Torque/i.test(label)) key = "torque";
      else if (/N₂|N2/i.test(label)) key = "n2";
      else if (/Microns after|after hold/i.test(label)) key = "decay";
      else if (/Microns/i.test(label)) key = "microns";
      else if (/ΔT|delta|Supply/i.test(label)) key = "deltaT";
      if (key && map[key] != null) {
        r.value = String(map[key]);
        try {
          r.dispatchEvent(new Event("input", { bubbles: true }));
        } catch (_) {}
      }
    });
  }

  function stepIdFromHost(host) {
    var d = host && host.querySelector(".ms-diagram-inline[data-step], .ms-diagram[data-step]");
    return (d && d.getAttribute("data-step")) || "";
  }

  function nudgeDrip(stepId) {
    try {
      if (!window.LtDrip || typeof window.LtDrip.nudge !== "function") return;
      if (/flare|torque/i.test(stepId)) window.LtDrip.nudge("manifold_colors");
      else if (/vacuum|decay/i.test(stepId)) window.LtDrip.nudge("recover_608");
    } catch (_) {}
  }

  function tagPreview(host) {
    if (!host || !isPhone()) return;
    var steps = host.querySelectorAll(".ms-step");
    if (!steps.length) return;
    var frontier = steps.length;
    for (var i = 0; i < steps.length; i++) {
      if (!steps[i].classList.contains("done")) {
        frontier = i;
        break;
      }
    }
    var active = host.querySelector(".ms-step.active");
    var activeI = active ? +active.getAttribute("data-i") : -1;
    steps.forEach(function (b) {
      var i = +b.getAttribute("data-i");
      b.classList.toggle("ms-preview", i !== frontier && !b.classList.contains("done"));
    });
    var card = host.querySelector(".ms-card");
    if (!card) return;
    var ban = card.querySelector(".ms-preview-banner");
    var previewing =
      activeI >= 0 && activeI !== frontier && !(active && active.classList.contains("done"));
    if (previewing) {
      if (!ban) {
        ban = document.createElement("p");
        ban.className = "ms-preview-banner";
        var h3 = card.querySelector("h3");
        if (h3 && h3.nextSibling) card.insertBefore(ban, h3.nextSibling);
        else card.insertBefore(ban, card.firstChild);
      }
      ban.textContent = "Preview — Do still required to credit";
    } else if (ban) {
      ban.remove();
    }
  }

  function fatActions(host) {
    if (!host || !isPhone()) return;
    var doBtn = host.querySelector("#ms-do");
    if (doBtn && !doBtn._msFat) {
      doBtn._msFat = true;
      doBtn.addEventListener("click", function () {
        var fb = host.querySelector("#ms-feedback");
        if (fb) {
          fb.style.fontSize = "14px";
          fb.style.fontWeight = "700";
          fb.style.opacity = "1";
        }
        setTimeout(function () {
          paint(host);
        }, 700);
      });
    }
  }


  function forceChipPreview(host) {
    if (!host || !isPhone()) return;
    var MS = window.MiniSplitInstall;
    if (!MS || !MS.STEPS) return;
    host.querySelectorAll(".ms-step").forEach(function (b) {
      if (b._msChipPreview) return;
      b._msChipPreview = true;
      b.addEventListener(
        "click",
        function (e) {
          var i = +b.getAttribute("data-i");
          if (!(i >= 0 && i < MS.STEPS.length)) return;
          /* Capture: ensure locked chips still navigate (minisplit may ignore). */
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
            var ban = card.querySelector(".ms-preview-banner");
            var frontier = 0;
            host.querySelectorAll(".ms-step").forEach(function (x, idx) {
              if (!x.classList.contains("done") && frontier === 0 && !x.classList.contains("active")) {
                /* keep */
              }
            });
            var doneCount = host.querySelectorAll(".ms-step.done").length;
            if (i !== doneCount) {
              if (!ban) {
                ban = document.createElement("p");
                ban.className = "ms-preview-banner";
                if (h3 && h3.nextSibling) card.insertBefore(ban, h3.nextSibling);
                else card.insertBefore(ban, card.firstChild);
              }
              ban.textContent = "Preview — Do still required to credit";
            } else if (ban) {
              ban.remove();
            }
            nudgeDrip(st.id);
          } catch (_) {}
        },
        true
      );
    });
  }

  function paint(host) {
    if (!host) return;
    ensureCss();
    scrubLincoln(host);
    if (!isPhone()) return;
    softDefaults(host);
    tagPreview(host);
    forceChipPreview(host);
    fatActions(host);
    nudgeDrip(stepIdFromHost(host));
  }

  function wrap() {
    var MS = window.MiniSplitInstall;
    if (!MS || MS._phoneWrapped) return;
    var orig = MS.start;
    if (typeof orig !== "function") return;
    MS._phoneWrapped = true;
    MS.start = function (host, opts) {
      ensureCss();
      var handle = orig.call(this, host, opts);
      try {
        paint(host);
        if (host && !host._msPhoneObs) {
          host._msPhoneObs = new MutationObserver(function () {
            if (host._msPhonePaintT) clearTimeout(host._msPhonePaintT);
            host._msPhonePaintT = setTimeout(function () {
              paint(host);
            }, 30);
          });
          host._msPhoneObs.observe(host, { childList: true, subtree: true });
        }
      } catch (_) {}
      return handle;
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wrap);
  } else {
    wrap();
  }
  setInterval(wrap, 1500);
})();
