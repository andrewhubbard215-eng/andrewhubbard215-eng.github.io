/* No-cool float prove — drain first, don't jump the switch. */
(function () {
  "use strict";
  var STEPS = [
    { label: "1 · Call", ask: "No cool. First prove?", good: "Confirm the Y call at the thermostat and at the board. No call, no cooling sequence.", bad: "Jump the float so the condenser starts.", whyWrong: "Jumping a safety hides a full pan. Prove the call first — then walk the string." },
    { label: "2 · 240 / disconnect", ask: "Y is present. Next?", good: "Prove 240 at the disconnect and the contactor line side before you chase 24V ghosts.", bad: "Change the capacitor because the fan is quiet.", whyWrong: "Dead 240 looks like a dead cap. Meter line before parts." },
    { label: "3 · R–C then Y", ask: "Line voltage is good. Control side?", good: "Meter R to C (transformer alive), then Y at the outdoor. Open Y never pulls in the coil.", bad: "Replace the contactor coil first.", whyWrong: "No Y means the coil never sees 24V. Prove the string, don't shotgun the contactor." },
    { label: "4 · HPC / LPC", ask: "Y is at the unit. Still open. Where?", good: "Meter across HPC then LPC. An open pressure switch is a fingerprint — dirty coil, airflow, or charge — not a new board.", bad: "Bypass both pressure switches to get cooling now.", whyWrong: "Bypassing HPC/LPC is how compressors die. Prove why it opened." },
    { label: "5 · Float", ask: "HPC and LPC are closed. Coil still dark. Next box?", good: "Meter the condensate float. Open float = full pan or tripped safety. Clear the drain, then prove the switch closed.", bad: "Jump the float and leave. Customer has air.", whyWrong: "WRONG — jumped float is a Saturday callback and a wet ceiling. Drain first, switch last." },
    { label: "6 · Coil → T1 → compressor", ask: "Float is closed. How do you finish the string?", good: "24V at the contactor coil, then T1/T2 out to the compressor. No T1 = open contacts. T1 with no run = compressor or overload.", bad: "Order a compressor because the outdoor is quiet.", whyWrong: "Quiet outdoor is not a condemned compressor until coil and T1 are proven." }
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
    var a = '<button type="button" class="btn el-float-opt" data-ok="1">' + step.good + "</button>";
    var b = '<button type="button" class="btn el-float-opt" data-ok="0">' + step.bad + "</button>";
    wrap.innerHTML =
      '<header class="sb-toolbar"><strong>Float / no-cool prove</strong>' +
      '<span class="muted"> Call → 240 → R–C → Y → HPC → LPC → float → coil → T1</span>' +
      '<button type="button" class="btn" id="el-float-close">Close</button></header>' +
      '<p class="eyebrow">' + step.label + " of " + STEPS.length + "</p><p>" + step.ask + "</p>" +
      '<div class="el-locker-opts">' + (Math.random() < 0.5 ? a + b : b + a) + "</div>" +
      "<p class='hub-chip'>" + (why || "Don't jump the float. Prove the drain.") + "</p>" +
      "<p class='muted'>Score " + score + "/" + tried + "</p>";
    wrap.querySelector("#el-float-close").onclick = function () { close(wrap); };
    wrap.querySelectorAll(".el-float-opt").forEach(function (btn) {
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
  function openFloat() {
    var wrap = document.getElementById("el-float-overlay");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "el-float-overlay";
      wrap.className = "el-locker";
      document.body.appendChild(wrap);
    }
    draw(wrap);
  }
  window.FloatProve = { open: openFloat };
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-mode='float']");
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    openFloat();
  }, true);
})();
