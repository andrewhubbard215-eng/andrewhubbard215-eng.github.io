/* Board-code locker — door sticker is law. Live 24V string matches the flash. */
(function () {
  "use strict";
  const LOCKER = {
    carrier: {
      name: "Carrier / Bryant — 2-digit on this door",
      flash: "2-digit",
      sticker: [
        { code: "13", meaning: "Limit switch open", prove: "Prove airflow and the limit before you condemn the board.", open: "limit" },
        { code: "31", meaning: "High-pressure switch open", prove: "Dirty coil / dead OD fan / overcharge. HPC first.", open: "hpc" },
        { code: "32", meaning: "Low-pressure switch open", prove: "Airflow, restriction, or leak. Don't add gas yet.", open: "lpc" }
      ]
    },
    trane: {
      name: "Trane / American Standard — flashes on this door",
      flash: "LED flashes",
      sticker: [
        { code: "2", meaning: "Pressure switch failed to close", prove: "Hose, trap, vent, then 24V across the switch. Switch last.", open: "press" },
        { code: "4", meaning: "Open limit", prove: "Filter, blower, heat exchanger path. Don't jump the limit.", open: "limit" }
      ]
    }
  };

  const STRING = {
    cool: ["R", "fuse", "Y", "HPC", "LPC", "float", "coil"],
    heat: ["R", "fuse", "W", "limit", "PS", "GV"]
  };

  let brand = "carrier";
  let qi = 0;
  let score = 0;
  let tried = 0;
  let why = "";

  function liveFault() {
    try {
      var lab = window.ElectricalLab;
      if (lab && lab.lastState && typeof lab.lastState === "function") {
        var st = lab.lastState();
        if (st && st.fault) return String(st.fault);
      }
    } catch (e) {}
    var slip = document.getElementById("el-callback-slip");
    var t = ((slip && slip.textContent) || "") + ((document.getElementById("el-status") || {}).textContent || "");
    if (/HPC|high-pressure/i.test(t)) return "open_hpc";
    if (/LPC|low-pressure/i.test(t)) return "open_lpc";
    if (/limit/i.test(t)) return "open_limit";
    if (/pressure switch|PS failed/i.test(t)) return "open_press";
    return "";
  }

  function openKey(item) {
    var f = liveFault();
    if (f === "open_hpc") return "hpc";
    if (f === "open_lpc") return "lpc";
    if (f === "open_limit") return "limit";
    if (f === "open_press") return "press";
    return item.open || "";
  }

  function stringHtml(item) {
    var key = openKey(item);
    var heat = key === "limit" || key === "press";
    var nodes = heat ? STRING.heat : STRING.cool;
    var map = { hpc: "HPC", lpc: "LPC", limit: "limit", press: "PS", float: "float" };
    var hit = map[key] || "";
    var boxes = nodes.map(function (n) {
      var dead = hit && n.toLowerCase() === hit.toLowerCase();
      return "<span class='el-str-node" + (dead ? " open" : "") + "'>" + n +
        (dead ? " OPEN" : "") + "</span>";
    }).join("<span class='el-str-arr'>→</span>");
    return "<div class='el-live-string'><strong>LIVE 24V STRING</strong> - meter gold, then the dark box" +
      "<div class='el-str-row'>" + boxes + "</div>" +
      "<p class='muted'>Door code <b>" + item.code + "</b> is this open — prove the path, don't shotgun the board.</p></div>";
  }

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

  function closeLocker(wrap) {
    try { if (wrap && wrap.remove) wrap.remove(); } catch (_) {}
    try {
      document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
      var hub = document.getElementById("screen-hub");
      if (hub) hub.classList.add("active");
      if (typeof window.ltGoHub === "function") window.ltGoHub();
      else if (typeof window.ltPlay === "function") window.ltPlay("hub");
    } catch (_) {}
  }

  function drillToolbar(title, muted, closeId) {
    return '<header class="sb-toolbar"><strong>' + title + "</strong>" +
      '<span class="muted"> ' + muted + "</span>" +
      '<span class="el-locker-brands" style="margin-left:auto">' +
      '<button type="button" class="btn" data-drill="prove">PS prove</button>' +
      '<button type="button" class="btn" data-drill="soo">Furnace SOO</button>' +
      '<button type="button" class="btn" id="' + closeId + '">Close</button>' +
      "</span></header>";
  }

  function wireDrillNav(wrap) {
    wrap.querySelectorAll("[data-drill]").forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        var kind = b.getAttribute("data-drill");
        try { wrap.remove(); } catch (_) {}
        if (kind === "prove") openProve();
        else if (kind === "soo") openSoo();
        else openLocker();
      };
    });
  }

  function openLocker() {
    let wrap = document.getElementById("el-locker-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-locker-overlay";
      wrap.className = "el-locker";
      document.body.appendChild(wrap);
    }
    draw(wrap);
  }

  function draw(wrap) {
    const pack = LOCKER[brand];
    const item = pack.sticker[qi % pack.sticker.length];
    const opts = pack.sticker.slice().sort(function (a, b) { return a.code.localeCompare(b.code); });
    wrap.innerHTML =
      drillToolbar("Board-code locker", "Door sticker is law.", "el-locker-close") +
      '<div class="el-locker-brands">' +
      Object.keys(LOCKER).map(function (k) {
        return '<button type="button" class="btn' + (k === brand ? " primary" : "") + '" data-brand="' + k + '">' +
          LOCKER[k].name.split("\u2014")[0] + "</button>";
      }).join("") +
      "</div>" +
      stringHtml(item) +
      "<p>What does <strong>this door</strong> say <b>" + item.code + "</b> means?</p>" +
      '<div class="el-locker-opts">' +
      opts.map(function (s) {
        return '<button type="button" class="btn el-code-opt" data-code="' + s.code + '">' + s.code + " \u2014 " + s.meaning + "</button>";
      }).join("") +
      "</div><p class='hub-chip'>" +
      (why || "Read the sticker. Match it to the open on the string.") +
      "</p><p class='muted'>Score " + score + "/" + tried + "</p>";
    wrap.querySelector("#el-locker-close").onclick = function () { closeLocker(wrap); };
    wireDrillNav(wrap);
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

  /* Inducer PS prove — hose/trap → inducer → 24V → vacuum vs rating → switch LAST */
  const PROVE = [
    {
      id: "hose",
      label: "1 \u00b7 Hose / trap",
      ask: "Inducer ran (or should). Pressure switch stays open. First move?",
      good: "Pull the hose, clear water/kink, check the condensate trap. Wet trap kills vacuum at the barb.",
      bad: "Swap the pressure switch first.",
      whyWrong: "Don't condemn the switch before hose and trap. Water and kink fake a bad PS every day."
    },
    {
      id: "inducer",
      label: "2 \u00b7 Inducer",
      ask: "Hose and trap are clear. Still open. Prove the draft motor?",
      good: "Confirm inducer is spinning and pulling. Voltage at the plug, then amp if it hums. No pull = no close.",
      bad: "Condemn the inducer because the switch never closed.",
      whyWrong: "Don't condemn the inducer before trap/hose (and vent). Dead draft often starts upstream of the motor."
    },
    {
      id: "meter",
      label: "3 \u00b7 24V across",
      ask: "Draft path looks open. How do you prove the switch electrically?",
      good: "Meter 24V across the two switch wires with the inducer running. 24V sitting there = switch still open.",
      bad: "Ohm the switch on the bench first and call it.",
      whyWrong: "Bench ohm is not running vacuum. In the unit, the circuit under load tells you if it's open."
    },
    {
      id: "rating",
      label: "4 \u00b7 Vacuum vs rating",
      ask: "Inducer pulls. What number matters?",
      good: "Compare inducer vacuum (manometer) to the switch rating printed on the part. Weak draft \u2260 bad switch.",
      bad: "If it clicks on the bench it's good — replace nothing else.",
      whyWrong: "Bench click is not running vacuum. Match pull to the rating before you buy a switch."
    },
    {
      id: "last",
      label: "5 \u00b7 Switch last",
      ask: "Hose, trap, inducer, 24V, and draft all check out. Now?",
      good: "Now replace the switch. Switch LAST — after the prove path.",
      bad: "Order a board. The board is waiting on a closed switch.",
      whyWrong: "Parts-cannon boards eat callbacks. Prove path first; switch last."
    }
  ];
  let pi = 0, pScore = 0, pTried = 0, pWhy = "";

  function mountProveBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-prove")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-prove";
    b.textContent = "PS prove";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openProve();
    };
    modes.appendChild(b);
  }

  function openProve() {
    let wrap = document.getElementById("el-prove-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-prove-overlay";
      wrap.className = "el-locker";
      document.body.appendChild(wrap);
    }
    drawProve(wrap);
  }

  function drawProve(wrap) {
    const step = PROVE[pi % PROVE.length];
    wrap.innerHTML =
      drillToolbar("Pressure-switch prove", "Hose/trap \u2192 inducer \u2192 24V \u2192 vacuum vs rating \u2192 switch LAST", "el-prove-close") +
      '<p class="eyebrow">' + step.label + " of " + PROVE.length + "</p>" +
      "<p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' +
      (Math.random() < 0.5
        ? '<button type="button" class="btn el-prove-opt" data-ok="1">' + step.good + "</button>" +
          '<button type="button" class="btn el-prove-opt" data-ok="0">' + step.bad + "</button>"
        : '<button type="button" class="btn el-prove-opt" data-ok="0">' + step.bad + "</button>" +
          '<button type="button" class="btn el-prove-opt" data-ok="1">' + step.good + "</button>") +
      "</div>" +
      "<p class='hub-chip' style='margin-top:12px'>" +
      (pWhy || "Don't condemn the switch until the draft path is proven.") +
      "</p><p class='muted'>Score " + pScore + "/" + pTried + "</p>";
    wrap.querySelector("#el-prove-close").onclick = function () { closeLocker(wrap); };
    wireDrillNav(wrap);
    wrap.querySelectorAll(".el-prove-opt").forEach(function (b) {
      b.onclick = function () {
        pTried += 1;
        const ok = b.getAttribute("data-ok") === "1";
        if (ok) pScore += 1;
        pWhy = ok
          ? "RIGHT \u2014 " + step.good
          : "WRONG \u2014 " + step.whyWrong + " Right path: " + step.good;
        pi += 1;
        drawProve(wrap);
      };
    });
  }

  /* Furnace SOO — W → inducer → PS close → ignitor → gas valve → flame sense → blower */
  const SOO = [
    {
      id: "w",
      label: "1 \u00b7 W call",
      ask: "Thermostat calls heat. First thing the board must see?",
      good: "24V on W at the board. No W, no sequence. Prove the call before you condemn anything.",
      bad: "Swap the ignitor first.",
      whyWrong: "No call means the board never starts the sequence. Prove W before parts."
    },
    {
      id: "inducer",
      label: "2 \u00b7 Inducer run",
      ask: "W is hot. What must run before ignition?",
      good: "Inducer / draft motor. It has to pull vacuum so the pressure switch can close.",
      bad: "Open the gas valve first.",
      whyWrong: "Don't light gas before the PS closes. Valve waits on a proven draft."
    },
    {
      id: "ps",
      label: "3 \u00b7 Pressure switch close",
      ask: "Inducer is spinning. What proves draft to the board?",
      good: "Pressure switch closes. Hose/trap \u2192 inducer \u2192 24V across \u2192 vacuum vs rating \u2192 switch last.",
      bad: "Jump the switch so it lights for the customer.",
      whyWrong: "Jumping a PS is a vent/CO bypass. Prove draft — don't hide it."
    },
    {
      id: "ign",
      label: "4 \u00b7 Ignitor",
      ask: "Switch is closed. Next in sequence?",
      good: "Hot surface ignitor (or spark) comes up to light. Gas valve waits on that prove.",
      bad: "Gas valve opens before the ignitor is ready.",
      whyWrong: "Don't light gas before the ignitor is proven. Trial starts after the glow/spark."
    },
    {
      id: "gas",
      label: "5 \u00b7 Gas valve",
      ask: "Ignitor is ready. What opens next?",
      good: "Gas valve opens for the trial. Burners should light while flame sense watches.",
      bad: "Kick the indoor blower on with the valve.",
      whyWrong: "Blower is after flame prove, not with the valve. Sequence keeps heat exchanger from cold shock."
    },
    {
      id: "flame",
      label: "6 \u00b7 Flame sense",
      ask: "Burners light. What keeps the gas valve energized?",
      good: "Flame rod rectifies to the board (\u00b5A). No sense, valve drops after the trial.",
      bad: "If you see fire it's fine — leave it.",
      whyWrong: "Your eyes are not flame sense. Board needs \u00b5A or it locks out."
    },
    {
      id: "blower",
      label: "7 \u00b7 Blower",
      ask: "Flame is proven. When does the indoor blower start?",
      good: "After the board's heat-on delay. Limit stays in series the whole time.",
      bad: "Blower should already be on with the inducer.",
      whyWrong: "That's not this sequence. Blower waits on flame prove + delay."
    }
  ];
  let si = 0, sScore = 0, sTried = 0, sWhy = "";

  function mountSooBtn() {
    const modes = document.querySelector("#electrical-root .el-modes");
    if (!modes || modes.querySelector("#el-mode-soo")) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "el-mode-btn";
    b.id = "el-mode-soo";
    b.textContent = "Furnace SOO";
    b.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      openSoo();
    };
    modes.appendChild(b);
  }

  function openSoo() {
    let wrap = document.getElementById("el-soo-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-soo-overlay";
      wrap.className = "el-locker";
      document.body.appendChild(wrap);
    }
    drawSoo(wrap);
  }

  function drawSoo(wrap) {
    const step = SOO[si % SOO.length];
    wrap.innerHTML =
      drillToolbar("Furnace sequence of operation", "W \u2192 inducer \u2192 PS close \u2192 ignitor \u2192 gas valve \u2192 flame sense \u2192 blower", "el-soo-close") +
      '<p class="eyebrow">' + step.label + " of " + SOO.length + "</p>" +
      "<p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' +
      (Math.random() < 0.5
        ? '<button type="button" class="btn el-soo-opt" data-ok="1">' + step.good + "</button>" +
          '<button type="button" class="btn el-soo-opt" data-ok="0">' + step.bad + "</button>"
        : '<button type="button" class="btn el-soo-opt" data-ok="0">' + step.bad + "</button>" +
          '<button type="button" class="btn el-soo-opt" data-ok="1">' + step.good + "</button>") +
      "</div>" +
      "<p class='hub-chip' style='margin-top:12px'>" +
      (sWhy || "Walk the sequence. Don't skip to parts.") +
      "</p><p class='muted'>Score " + sScore + "/" + sTried + "</p>";
    wrap.querySelector("#el-soo-close").onclick = function () { closeLocker(wrap); };
    wireDrillNav(wrap);
    wrap.querySelectorAll(".el-soo-opt").forEach(function (b) {
      b.onclick = function () {
        sTried += 1;
        const ok = b.getAttribute("data-ok") === "1";
        if (ok) sScore += 1;
        sWhy = ok
          ? "RIGHT \u2014 " + step.good
          : "WRONG \u2014 " + step.whyWrong + " Right path: " + step.good;
        si += 1;
        drawSoo(wrap);
      };
    });
  }

  window.BoardCodes = {
    openLocker: openLocker,
    openProve: openProve,
    openSoo: openSoo,
    openInd: openProve
  };

  setInterval(function () { mountBtn(); mountProveBtn(); mountSooBtn(); }, 800);
  document.addEventListener("DOMContentLoaded", function () {
    mountBtn();
    mountProveBtn();
    mountSooBtn();
  });
})();
