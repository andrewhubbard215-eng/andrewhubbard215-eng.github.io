/* Clock In must reach the shop floor even when locker stat nodes are missing. */
(function () {
  function goHub() {
    document.querySelectorAll(".screen").forEach(function (s) {
      s.classList.remove("active");
    });
    var hub = document.getElementById("screen-hub");
    if (hub) hub.classList.add("active");
    var name = document.getElementById("hub-name");
    if (name && (!name.textContent || name.textContent === "Tech")) name.textContent = "Guest";
  }
  function bind() {
    var btn = document.getElementById("btn-start");
    if (!btn) return;
    btn.addEventListener(
      "click",
      function () {
        try {
          goHub();
        } catch (_) {}
      },
      true
    );
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
