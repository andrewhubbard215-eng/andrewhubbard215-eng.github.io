/* HVAC Allstars — hub-ai loader (sync parts; rebuilds HubAI) */
(function () {
  "use strict";
  var n = 9;
  var parts = [];
  for (var i = 0; i < n; i++) {
    var x = new XMLHttpRequest();
    x.open("GET", "hub-part-" + i + ".txt", false);
    x.send();
    if (x.status !== 200 && x.status !== 0) {
      console.error("hub-ai part failed", i, x.status);
      return;
    }
    parts.push(x.responseText);
  }
  eval(parts.join(""));
})();
