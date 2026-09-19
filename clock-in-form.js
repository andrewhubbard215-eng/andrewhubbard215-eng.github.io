/* Name/callsign form — Clock In still lands on the shop floor if locker is empty. */
(function () {
  function go() {
    if (typeof window.ltGoHub === "function") window.ltGoHub();
    else if (typeof window.ltGo === "function") window.ltGo("hub");
  }
  var btn = document.getElementById("btn-start");
  if (btn && !btn.getAttribute("data-lt-form")) {
    btn.setAttribute("data-lt-form", "1");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      go();
    });
  }
})();
