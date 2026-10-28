/* Prove Path Card — vocational diagnostic sheet. Door sticker is law. First-year tech walks the prove, not the jump. */
(function () {
  "use strict";
  if (window.LTProvePath) return;
  window.LTProvePath = { open: openCard };

  function openCard(kind) {
    var existing = document.getElementById("lt-prove-card");
    if (existing) existing.remove();
    var card = document.createElement("div");
    card.id = "lt-prove-card";
    card.style.cssText = "position:fixed;inset:12px;z-index:9999;background:#1a140c;color:#f4e7c8;border:2px solid #d4a017;border-radius:8px;padding:16px;overflow:auto;font:15px/1.4 sans-serif;max-width:480px;margin:auto;box-shadow:0 8px 32px #000a;";
    var title = kind === "ps" ? "Pressure-switch prove path" : "No-cool diagnostic sheet";
    var steps = kind === "ps" ? [
      "1. Hose / trap / vent — clear the path. Wet trap or plugged hose keeps the switch open.",
      "2. Inducer spins — prove the motor runs and creates vacuum.",
      "3. Meter 24V across the switch. Open = ~24V sitting there. Closed = near 0.",
      "4. Pull vacuum and compare to the switch rating on the door sticker.",
      "5. Replace the switch LAST. Never jump it to keep heat on."
    ] : [
      "Call → 240V at disconnect → R–C 24V → Y call → HPC → LPC → float → contactor coil → T1 → compressor.",
      "Dark after gold is the open. Meter across the part, not to ground.",
      "HPC/LPC open reads ~24V across. Do not jump the float. Prove airflow before charge."
    ];
    var why = kind === "ps" ? "<p style='margin:10px 0;color:#fbbf24'><b>WHY WRONG — jumping the switch:</b> Lights into a dead vent or wet trap. Customer gets heat tonight, you get the CO callback Saturday. Path before parts.</p>" : "<p style='margin:10px 0;color:#fbbf24'><b>WHY WRONG — jumping the float:</b> Hides a full pan. Wet ceiling and a Saturday callback. Drain first, switch last.</p>";
    card.innerHTML = "<h3 style='margin:0 0 8px;color:#d4a017'>" + title + "</h3>" +
      steps.map(function (s) { return "<p style='margin:6px 0'>" + s + "</p>"; }).join("") +
      why +
      "<button id='lt-prove-close' style='margin-top:12px;padding:8px 16px;background:#d4a017;color:#1a140c;border:0;border-radius:4px;font-weight:700'>Close</button>";
    document.body.appendChild(card);
    document.getElementById("lt-prove-close").onclick = function () { card.remove(); };
  }

  // Auto-offer on furnace SOO or electrical ladder if present
  function offer() {
    if (document.getElementById("lt-prove-offer")) return;
    var soo = document.getElementById("el-soo-overlay") || document.querySelector("[data-soo]");
    var ladder = document.getElementById("el-ladder");
    var target = soo || ladder;
    if (!target) return;
    var btn = document.createElement("button");
    btn.id = "lt-prove-offer";
    btn.textContent = "Prove path card";
    btn.style.cssText = "position:absolute;top:8px;right:8px;z-index:50;background:#d4a017;color:#1a140c;border:0;padding:6px 10px;border-radius:4px;font:13px sans-serif;font-weight:700;";
    btn.onclick = function (e) { e.stopPropagation(); openCard(soo ? "ps" : "nocool"); };
    (target.parentElement || document.body).appendChild(btn);
  }

  setTimeout(offer, 800);
  var mo = new MutationObserver(offer);
  mo.observe(document.body, { childList: true, subtree: true });
})();
