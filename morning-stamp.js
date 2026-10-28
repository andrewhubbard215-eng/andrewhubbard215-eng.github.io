/* Morning stamp — banner, and park the phone diamond off the LEFT rail. */
(function () {
  "use strict";
  /* Version from the boot shell meta (index.html APP_VER). Keep the bay name shop-floor-copy wrote. */
  function appVer() {
    var m = document.querySelector('meta[name="lt-app-ver"]');
    return (m && m.content) || window.LT_APP_VER || "v3.5.416";
  }
  function stamp() {
    var ver = appVer();
    var nodes = document.querySelectorAll(".version-strip");
    for (var i = 0; i < nodes.length; i++) {
      var t = nodes[i].textContent || "";
      var next = /v\d+\.\d+\.\d+/.test(t) ? t.replace(/v\d+\.\d+\.\d+/, ver) : "HVAC Allstars - " + ver + " - shop floor";
      if (next !== t) nodes[i].textContent = next;
    }
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
