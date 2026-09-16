/* Board-code locker — door sticker is law. Training cards only; field door wins. */
(function () {
  "use strict";
  const LOCKER = {
    carrier: {
      name: "Carrier / Bryant — 2-digit on this door",
      flash: "2-digit",
      sticker: [
        { code: "13", meaning: "Limit switch open", prove: "Prove airflow and the limit before you condemn the board." },
        { code: "31", meaning: "High-pressure switch open", prove: "Dirty coil / dead OD fan / overcharge. HPC first." },
        { code: "32", meaning: "Low-pressure switch open", prove: "Airflow, restriction, or leak. Don't add gas yet." }
      ]
    },
    trane: {
      name: "Trane / American Standard — flashes on this door",
      flash: "LED flashes",
      sticker: [
        { code: "2", meaning: "Pressure switch failed to close", prove: "Hose, trap, vent, then 24V across the switch. Switch last." },
        { code: "4", meaning: "Open limit", prove: "Filter, blower, heat exchanger path. Don't jump the limit." }
      ]
    }
  };

  let brand = "carrier";
  let qi = 0;
  let score = 0;
  let tried = 0;
  let why = "";

  function mountBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-codes")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-codes";
    b.textContent = "Board-code locker";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openLocker();
    };
    modes.appendChild(b);
  }

  function openLocker() {
    let wrap = document.getElementById("el-locker-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-locker-overlay";
      wrap.className = "el-locker";
      const root = document.getElementById("electrical-root") || document.body;
      root.appendChild(wrap);
    }
    draw(wrap);
  }

  function draw(wrap) {
    const pack = LOCKER[brand];
    const item = pack.sticker[qi % pack.sticker.length];
    const opts = pack.sticker.slice().sort(function (a, b) { return a.code.localeCompare(b.code); });
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Board-code locker</strong>' +
      '<span class="muted"> Door sticker is law.</span>' +
      '<button type="button" class="btn" id="el-locker-close">Close</button></header>' +
      '<div class="el-locker-brands">' +
      Object.keys(LOCKER).map(function (k) {
        return '<button type="button" class="btn' + (k === brand ? " primary" : "") + '" data-brand="' + k + '">' +
          LOCKER[k].name.split("\u2014")[0] + "</button>";
      }).join("") +
      "</div>" +
      "<p>What does <strong>this door</strong> say <b>" + item.code + "</b> means?</p>" +
      '<div class="el-locker-opts">' +
      opts.map(function (s) {
        return '<button type="button" class="btn el-code-opt" data-code="' + s.code + '">' + s.code + " \u2014 " + s.meaning + "</button>";
      }).join("") +
      "</div><p class='hub-chip'>" +
      (why || "Read the sticker. Then pick.") +
      "</p><p class='muted'>Score " + score + "/" + tried + "</p>";
    wrap.querySelector("#el-locker-close").onclick = function () { wrap.remove(); };
    wrap.querySelectorAll("[data-brand]").forEach(function (b) {
      b.onclick = function () { brand = b.getAttribute("data-brand"); qi = 0; why = ""; draw(wrap); };
    });
    wrap.querySelectorAll(".el-code-opt").forEach(function (b) {
      b.onclick = function () {
        tried += 1;
        const ok = b.getAttribute("data-code") === item.code;
        if (ok) score += 1;
        why = ok ? "RIGHT \u2014 " + item.prove : "WRONG \u2014 this door says " + item.code + " = " + item.meaning;
        qi += 1;
        draw(wrap);
      };
    });
  }

  window.BoardCodes = { openLocker: openLocker, openProve: openLocker, openSoo: openLocker, openInd: openLocker };
  setInterval(mountBtn, 800);
  document.addEventListener("DOMContentLoaded", mountBtn);
})();
