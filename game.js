/* HVAC Allstars — chunked game load (Pages push size) */
(function () {
  var parts = ["game.p0.js", "game.p1.js", "game.p2.js", "game.p3.js", "game.p4.js"];
  var i = 0, buf = "";
  function next() {
    if (i >= parts.length) {
      try { (0, eval)(buf); } catch (e) { console.error("game load failed", e); }
      return;
    }
    fetch(parts[i] + "?v=204c")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { buf += t; i++; next(); })
      .catch(function (e) { console.error("game chunk fail", parts[i], e); });
  }
  next();
})();
