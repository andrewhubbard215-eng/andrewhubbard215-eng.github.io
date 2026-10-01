/* Assemble EPA_BANK parts (loaded sync via index.html script tags). */
(function () {
  "use strict";
  var parts = window.__EPA_BANK_PARTS;
  if (!parts) {
    console.error("epa-exam-bank: parts missing");
    return;
  }
  var s = "";
  for (var i = 0; i < parts.length; i++) {
    if (typeof parts[i] !== "string") {
      console.error("epa-exam-bank: part " + i + " missing");
      return;
    }
    s += parts[i];
  }
  try {
    (0, eval)(s);
  } catch (e) {
    console.error("epa-exam-bank boot", e);
  }
})();
