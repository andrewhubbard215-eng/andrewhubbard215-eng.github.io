/* Electrical phone-safe chunked load (Pages push size) */
(function () {
  var parts = ["electrical.p0.js", "electrical.p1.js", "electrical.p2.js", "electrical.p3.js", "electrical.p4.js", "electrical.p5.js", "electrical.p6.js", "electrical.p7.js"];
  var i = 0, buf = "";
  function next() {
    if (i >= parts.length) {
      try { (0, eval)(buf); } catch (e) { console.error("electrical load failed", e); }
      return;
    }
    fetch(parts[i] + "?v=133c")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (t) { buf += t; i++; next(); })
      .catch(function (e) { console.error("electrical chunk fail", parts[i], e); });
  }
  next();
})();
