/* Dual-run cap prove — lock out, discharge, meter µF vs the can. */
(function () {
  "use strict";
  var STEPS = [
    {
      label: "1 · Lock out",
      ask: "Outdoor hums. Contactor is in. First move?",
      good: "Kill the disconnect and lock it out. A pulled-in contactor is still line voltage.",
      bad: "Meter the cap live with the compressor running.",
      whyWrong: "A spinning meter on a live HERM lug is how techs get bit. Lock out before the can."
    },
    {
      label: "2 · Discharge",
      ask: "Disconnect is open. Cap is still in the circuit. Next?",
      good: "Discharge the dual-run cap with a 20k resistor across the terminals. Do not use a screwdriver.",
      bad: "Short the terminals with a screwdriver to be sure.",
      whyWrong: "A screwdriver arc pits the terminals and can blow the can. Resistor discharge, then meter."
    },
    {
      label: "3 · Nameplate",
      ask: "Can reads 45/5 µF ±6%. What is the field window?",
      good: "HERM 45 µF is good from about 42 to 48 µF. Fan 5 µF is good from about 4.7 to 5.3 µF. Out of ±6% is a bad can.",
      bad: "Anything over 30 µF is close enough. Leave it.",
      whyWrong: "Close enough cooks the compressor. The can rating is the spec. ±6% is the window."
    },
    {
      label: "4 · Meter",
      ask: "Leads are off the compressor. Meter shows 28 µF on HERM, 5.0 on fan. Call?",
      good: "HERM is open-low. Replace the dual-run cap. Do not add a hard-start on a dead can.",
      bad: "Hard-start kit. The compressor is weak.",
      whyWrong: "A hard-start on a dead cap still eats the compressor. Replace the can, then prove amps."
    },
    {
      label: "5 · After the can",
      ask: "New cap is seated. How do you close the ticket?",
      good: "Pull the disconnect back in, prove run amps against the nameplate, and listen for a clean start. No hum.",
      bad: "Customer has air. Walk. Amps are optional.",
      whyWrong: "A new can that still hums is a start-winding or compressor prove. Amps close the ticket."
    }
  ];
  var i = 0, score = 0, tried = 0, why = "";

  function close(wrap) {
    try { wrap.remove(); } catch (_) {}
    try {
      document.querySelectorAll(".screen").forEach(function (s) { s.classList.remove("active"); });
      var hub = document.getElementById("screen-hub");
      if (hub) hub.classList.add("active");
      if (typeof window.ltGoHub === "function") window.ltGoHub();
    } catch (_) {}
  }

  function draw(wrap) {
    var step = STEPS[i % STEPS.length];
    var a = '<button type="button" class="btn el-cap-opt" data-ok="1">' + step.good + "</button>";
    var b = '<button type="button" class="btn el-cap-opt" data-ok="0">' + step.bad + "</button>";
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Cap prove</strong>' +
      '<span class="muted"> Lock out → discharge → ±6% vs can → no hard-start on a dead cap</span>' +
      '<button type="button" class="btn" id="el-cap-close">Close</button></header>' +
      '<p class="eyebrow">' + step.label + " of " + STEPS.length + "</p><p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' + (Math.random() < 0.5 ? a + b : b + a) + "</div>" +
      "<p class='hub-chip'>" + (why || "Nameplate is law. ±6% or the can is bad.") + "</p>" +
      "<p class='muted'>Score " + score + "/" + tried + "</p>";
    wrap.querySelector("#el-cap-close").onclick = function () { close(wrap); };
    wrap.querySelectorAll(".el-cap-opt").forEach(function (btn) {
      btn.onclick = function () {
        tried += 1;
        var ok = btn.getAttribute("data-ok") === "1";
        if (ok) score += 1;
        why = ok ? "RIGHT — " + step.good : "WRONG — " + step.whyWrong + " Right path: " + step.good;
        i += 1;
        draw(wrap);
      };
    });
  }

  function openCap() {
    var wrap = document.getElementById("el-cap-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-cap-overlay";
      wrap.className = "el-locker";
      document.body.appendChild(wrap);
    }
    draw(wrap);
  }

  function mountCard() {
    if (document.getElementById("cap-prove-card")) return true;
    var nav = document.querySelector(".hub-nav, #hub-options");
    if (!nav) return false;
    var btn = document.createElement("button");
    btn.className = "mode-card";
    btn.id = "cap-prove-card";
    btn.type = "button";
    btn.setAttribute("data-mode", "cap-prove");
    btn.innerHTML = "<h3>Cap prove</h3><p>Lock out → discharge → µF vs can ±6% → no hard-start</p>";
    btn.onclick = function (e) {
      e.preventDefault();
      openCap();
    };
    var after = Array.prototype.find.call(nav.querySelectorAll(".mode-card"), function (el) {
      return /Float prove|Ohm school/i.test(el.textContent || "");
    });
    if (after && after.nextSibling) nav.insertBefore(btn, after.nextSibling);
    else nav.appendChild(btn);
    return true;
  }

  window.CapProve = { open: openCap };
  var n = 0;
  var t = setInterval(function () {
    n += 1;
    if (mountCard() || n > 40) clearInterval(t);
  }, 500);
})();
