/* Morning stamp — banner, and park the phone diamond off the LEFT rail. */
(function () {
  "use strict";
  var LABEL = "HVAC Allstars - v3.5.411 - shop floor";
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
  function parkDiamond() {
    var pal = document.querySelector("#sandbox-root .sb-palette");
    var wrap = document.getElementById("sb-canvas-wrap");
    if (!pal || !wrap || window.innerWidth > 900) return;
    var pr = pal.getBoundingClientRect();
    var wr = wrap.getBoundingClientRect();
    if (wr.width < 40 || pr.width < 20) return;
    if (wr.left < pr.right - 2) {
      var shift = Math.ceil(pr.right - wr.left + 6);
      if (wrap.getAttribute("data-park") !== String(shift)) {
        wrap.setAttribute("data-park", String(shift));
        wrap.style.marginLeft = shift + "px";
        wrap.style.width = "calc(100% - " + shift + "px)";
        try { window.dispatchEvent(new Event("resize")); } catch (e) {}
      }
    }
  }
  stamp();
  parkDiamond();
  setInterval(function () { stamp(); parkDiamond(); }, 900);
})();
