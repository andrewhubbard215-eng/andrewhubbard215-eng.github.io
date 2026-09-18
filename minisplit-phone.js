/* Mini-split phone completable + store Lincoln scrub — companion tip */
(function () {
  "use strict";
  function isPhone() {
    return window.matchMedia && window.matchMedia("(max-width: 480px)").matches;
  }
  function isStore() {
    try {
      return document.documentElement.classList.contains("sku-store") ||
        /[?&]sku=store\b/.test(location.search);
    } catch (_) { return false; }
  }
  function scrubLincoln(host) {
    if (!host || !isStore()) return;
    host.querySelectorAll(".brand-bar, .brand-mark, .brand-word").forEach(function (n) {
      n.style.display = "none";
    });
    host.querySelectorAll("h2").forEach(function (h) {
      if (/lincoln/i.test(h.textContent || "")) h.textContent = "Mini-split install";
    });
  }
  function softDefaults(api) {
    if (!isPhone() || !api || !api._values) return;
    /* nudge sliders so a thumb can hit the band without desktop precision */
    api._values.flareQuality = 82;
    api._values.torque = 13;
    api._values.n2 = 500;
    api._values.microns = 400;
    api._values.decay = 600;
    api._values.deltaT = 18;
  }
  function wrap() {
    var MS = window.MiniSplitInstall;
    if (!MS || MS._phoneWrapped) return;
    var orig = MS.start;
    if (typeof orig !== "function") return;
    MS._phoneWrapped = true;
    MS.start = function (host, opts) {
      var handle = orig.call(this, host, opts);
      try {
        /* expose values bag if present via closure — re-render with soft phone defaults */
        if (isPhone() && host) {
          var ranges = host.querySelectorAll("#ms-range");
          /* After first paint, set range to mid-band targets once */
          var map = {
            flareQuality: 85,
            torque: 13,
            n2: 500,
            microns: 350,
            decay: 500,
            deltaT: 20
          };
          ranges.forEach(function (r) {
            var label = (r.closest("label") || {}).textContent || "";
            var key = null;
            if (/Flare/i.test(label)) key = "flareQuality";
            else if (/Torque/i.test(label)) key = "torque";
            else if (/N₂|N2/i.test(label)) key = "n2";
            else if (/Microns after/i.test(label)) key = "decay";
            else if (/Microns/i.test(label)) key = "microns";
            else if (/ΔT|delta/i.test(label)) key = "deltaT";
            if (key && map[key] != null) {
              r.value = String(map[key]);
              r.dispatchEvent(new Event("input", { bubbles: true }));
            }
          });
        }
        scrubLincoln(host);
        /* re-scrub after each step re-render */
        if (host && !host._msObs) {
          host._msObs = new MutationObserver(function () { scrubLincoln(host); });
          host._msObs.observe(host, { childList: true, subtree: true });
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
