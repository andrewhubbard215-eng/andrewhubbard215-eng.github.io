/* truck-pouch split loader v7 - atob assemble, UTF-8 decode, then eval */
(function () {
  "use strict";
  var N = 8, loaded = 0, booted = false;
  function boot() {
    if (booted || loaded !== N) return;
    var parts = window.__TP_B64;
    if (!parts) return;
    var s = "";
    for (var i = 0; i !== N; i++) {
      if (typeof parts[i] !== "string") return;
      s += parts[i];
    }
    booted = true;
    try {
      var bin = atob(s), src = bin;
      /* v7: parts are UTF-8. atob() gives bytes; decode so · ° — − do not show as Â· Â° â€ */
      if (typeof TextDecoder !== "undefined") {
        var u8 = new Uint8Array(bin.length);
        for (var j = 0; j < bin.length; j++) u8[j] = bin.charCodeAt(j);
        src = new TextDecoder("utf-8").decode(u8);
      }
      (0, eval)(src);
    } catch (e) { console.error("truck-pouch boot", e); }
  }
  Array.from({length: N}, function (_, idx) { return idx; }).forEach(function (idx) {
    var el = document.createElement("script");
    el.src = "truck-pouch.p" + idx + ".js?v=6";
    el.async = false;
    el.onload = function () { loaded += 1; boot(); };
    el.onerror = function () { console.error("truck-pouch part fail", idx); };
    (document.head || document.documentElement).appendChild(el);
  });
})();
