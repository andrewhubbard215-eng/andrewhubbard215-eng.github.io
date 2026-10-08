/* Morning stamp — visible banner after the pinned boot HTML. Injects diamond CSS if the boot missed it. */
(function () {
  "use strict";
  var LABEL = "HVAC Allstars - v3.5.405 - shop floor";
  function stamp() {
    var nodes = document.querySelectorAll(".version-strip");
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = LABEL;
    if (!document.getElementById("phone-diamond-css")) {
      var link = document.createElement("link");
      link.id = "phone-diamond-css";
      link.rel = "stylesheet";
      link.href = "phone-diamond.css?v=1";
      document.head.appendChild(link);
    }
  }
  stamp();
  setInterval(stamp, 1200);
})();
