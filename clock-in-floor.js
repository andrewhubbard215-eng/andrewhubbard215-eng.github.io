/* Clock-in floor v38 — load last-good router, then patch load screens. */
(function () {
  var s = document.createElement("script");
  s.src = "https://raw.githubusercontent.com/andrewhubbard215-eng/andrewhubbard215-eng.github.io/54a0489fe2395ff89e3332f5e33596e5c1b559d2/clock-in-floor.js";
  s.onload = function () {
    var rootPatch = function (id, html) {
      var el = document.getElementById(id);
      if (!el) return;
      var obs = new MutationObserver(function () {
        if (/Loading system bay/.test(el.innerHTML || "") && !document.getElementById("sb-load-hub")) {
          el.innerHTML = "<div class='panel' style='margin:20px'><p>Loading system bay… seat LEFT when the gauges paint.</p><p><button type='button' class='btn' id='sb-load-hub'>Shop floor</button></p></div>";
          var b = document.getElementById("sb-load-hub");
          if (b) b.onclick = function (e) { if (e) e.preventDefault(); if (window.ltGoHub) window.ltGoHub(); };
        }
        if (/Loading land lugs/.test(el.innerHTML || "") && !document.getElementById("el-load-hub")) {
          el.innerHTML = "<div class='panel' style='margin:20px'><p>Loading land lugs… chips LEFT.</p><p><button type='button' class='btn' id='el-load-hub'>Shop floor</button></p></div>";
          var b2 = document.getElementById("el-load-hub");
          if (b2) b2.onclick = function (e) { if (e) e.preventDefault(); if (window.ltGoHub) window.ltGoHub(); };
        }
      });
      try { obs.observe(el, { childList: true, subtree: true }); } catch (_) {}
    };
    rootPatch("sandbox-root");
    rootPatch("electrical-root");
  };
  s.onerror = function () {
    console.warn("floor router blob miss — hard-refresh");
  };
  document.head.appendChild(s);
})();
