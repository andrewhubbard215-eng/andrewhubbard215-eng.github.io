/* Furnace SOO floor — limit/rollout mid-fire + flame µA. Shop card opens BoardCodes.openSoo. */
(function () {
  "use strict";
  var ASK = "Burners ran, then dropped. Board says limit / rollout open. Next move?";
  var GOOD = "Prove filter, blower wheel, supply static, and HX. Limit stays in series with W. Meter across the limit — 24V sitting there means it opened.";
  var BAD = "Jump the limit so the customer stays in heat.";
  var WHY_WRONG = "Jumping a limit hides overheat and can crack an HX. Prove airflow first. Never jumper a safety to keep heat on.";
  var UA = "Flame prove is microamps, not your eyes. Typical good rod is about 1–5 µA. Low µA: dirty rod, cracked porcelain, poor ground, or weak flame. Clean and re-meter before you buy a board.";

  function mountDrill(wrap) {
    if (!wrap || wrap.getAttribute("data-limitdrill") === "1") return;
    wrap.setAttribute("data-limitdrill", "1");
    var box = document.createElement("div");
    box.className = "el-locker-opts";
    box.style.marginTop = "12px";
    box.innerHTML =
      "<p class='eyebrow'>8 · Limit / rollout mid-fire</p><p>" + ASK + "</p>" +
      "<button type='button' class='btn' data-ok='1'>" + GOOD + "</button>" +
      "<button type='button' class='btn' data-ok='0'>" + BAD + "</button>" +
      "<p class='hub-chip' id='soo-limit-why'>Limit and rollout stay in series after blower. Don't jump them.</p>" +
      "<p class='muted'>" + UA + "</p>";
    wrap.appendChild(box);
    box.querySelectorAll("[data-ok]").forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var ok = b.getAttribute("data-ok") === "1";
        var why = box.querySelector("#soo-limit-why");
        if (why) why.textContent = ok ? ("RIGHT — " + GOOD) : ("WRONG — " + WHY_WRONG + " Right path: " + GOOD);
      };
    });
  }

  function deepen() {
    var bc = window.BoardCodes;
    if (!bc || typeof bc.openSoo !== "function" || bc._sooFlameUa2) return false;
    bc._sooFlameUa2 = true;
    var raw = bc.openSoo;
    bc.openSoo = function () {
      raw();
      var wrap = document.getElementById("el-soo-overlay");
      mountDrill(wrap);
    };
    return true;
  }
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    if (deepen() || n > 40) clearInterval(t);
  }, 400);
  document.addEventListener("DOMContentLoaded", deepen);
})();
