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
    mountPs(wrap);
    mountUa(wrap);
  }

  var UA_ASK = "Valve opened. Burners light, then drop in about 4 seconds. Flame looks fine. Next meter?";
  var UA_GOOD = "Series microamps on the flame-sense lead. A good rod is about 1–5 µA. 0.2 µA is a weak prove: clean the rod, check porcelain and ground, re-meter. Board last.";
  var UA_BAD = "Replace the ignition board. Your eyes already proved the flame.";
  var UA_WRONG = "The board only believes rectified microamps. A dirty rod can show flame and still drop the valve. Meter the sense lead before you buy a board.";

  function mountUa(wrap) {
    if (!wrap || wrap.getAttribute("data-uadrill") === "1") return;
    wrap.setAttribute("data-uadrill", "1");
    var box = document.createElement("div");
    box.className = "el-locker-opts";
    box.style.marginTop = "12px";
    box.innerHTML =
      "<p class='eyebrow'>10 · Flame µA prove</p><p>" + UA_ASK + "</p>" +
      "<button type='button' class='btn' data-ua='1'>" + UA_GOOD + "</button>" +
      "<button type='button' class='btn' data-ua='0'>" + UA_BAD + "</button>" +
      "<p class='hub-chip' id='soo-ua-why'>Eyes are not a prove. 1–5 µA holds the valve. Under 1 µA, clean and re-meter. Board last.</p>";
    wrap.appendChild(box);
    box.querySelectorAll("[data-ua]").forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var ok = b.getAttribute("data-ua") === "1";
        var why = box.querySelector("#soo-ua-why");
        if (why) why.textContent = ok ? ("RIGHT — " + UA_GOOD) : ("WRONG — " + UA_WRONG + " Right path: " + UA_GOOD);
      };
    });
  }

  var PS_ASK = "Inducer ran. Board will not light. Pressure switch still open. Next move?";
  var PS_GOOD = "Hose, trap, and vent first. Then meter 24V across the switch. Pull vacuum vs the switch rating. Replace the switch LAST.";
  var PS_BAD = "Swap the pressure switch so the board sees a close.";
  var PS_WRONG = "A new switch on a plugged hose or wet trap still sits open. Prove the path before you buy parts.";

  function mountPs(wrap) {
    if (!wrap || wrap.getAttribute("data-psdrill") === "1") return;
    wrap.setAttribute("data-psdrill", "1");
    var box = document.createElement("div");
    box.className = "el-locker-opts";
    box.style.marginTop = "12px";
    box.innerHTML =
      "<p class='eyebrow'>9 · Pressure-switch prove</p><p>" + PS_ASK + "</p>" +
      "<button type='button' class='btn' data-ps='1'>" + PS_GOOD + "</button>" +
      "<button type='button' class='btn' data-ps='0'>" + PS_BAD + "</button>" +
      "<p class='hub-chip' id='soo-ps-why'>Hose / trap / vent → 24V across → vacuum vs rating → switch last.</p>";
    wrap.appendChild(box);
    box.querySelectorAll("[data-ps]").forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        e.stopPropagation();
        var ok = b.getAttribute("data-ps") === "1";
        var why = box.querySelector("#soo-ps-why");
        if (why) why.textContent = ok ? ("RIGHT — " + PS_GOOD) : ("WRONG — " + PS_WRONG + " Right path: " + PS_GOOD);
      };
    });
  }

  function deepen() {
    var bc = window.BoardCodes;
    if (!bc || typeof bc.openSoo !== "function" || bc._sooFlameUa3) return false;
    bc._sooFlameUa3 = true;
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
