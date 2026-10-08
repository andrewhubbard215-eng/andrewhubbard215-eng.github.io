/* Morning stamp — visible banner after the pinned boot HTML. */
(function () {
  "use strict";
  var LABEL = "HVAC Allstars - v3.5.405 - shop floor";
  function stamp() {
    var nodes = document.querySelectorAll(".version-strip");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = LABEL;
  }
  stamp();
  setInterval(stamp, 1200);
})();
