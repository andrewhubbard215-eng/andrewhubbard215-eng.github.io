/* HPC / LPC actually cut out — textbook trip, compressor stops.
   Latch the pressure that opened the switch. Do not reprint a later fault
   as the trip (Dirty OD at 498 is not an HPC). Clear when head is back under cutout. */
(function () {
  "use strict";
  var HPC = 580;
  var LPC = 40;
  var tripped = "";
  var latched = "";

  function num(id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var n = parseFloat(String(el.textContent || "").replace(/[^\d.-]/g, ""));
    return isFinite(n) ? n : NaN;
  }

  function banner(kind, ps, ph) {
    var root = document.getElementById("sandbox-root");
    if (!root) return;
    var b = document.getElementById("sb-cutout");
    if (!b) {
      b = document.createElement("p");
      b.id = "sb-cutout";
      b.style.cssText = "margin:8px 12px;padding:8px 10px;border:1px solid #ce0034;background:#2a0b12;color:#fecaca;font-size:13px;border-radius:8px";
      var st = document.getElementById("sb-status") || root.firstChild;
      if (st && st.parentNode) st.parentNode.insertBefore(b, st);
      else root.insertBefore(b, root.firstChild);
    }
    if (kind === "HPC") {
      b.textContent = "HPC CUTOUT · high side " + ph + " psig ≥ " + HPC + ". Contactor dropped. Dead fan, packed coil, or overcharge — prove that head before you jump HPC.";
    } else if (kind === "LPC") {
      b.textContent = "LPC CUTOUT · low side " + ps + " psig ≤ " + LPC + ". Contactor dropped. Airflow / restriction / leak — do not add gas yet.";
    } else {
      b.textContent = "";
      b.style.display = "none";
      return;
    }
    b.style.display = "block";
  }

  function stopComp() {
    var btn = document.getElementById("sb-run");
    if (btn && /stop/i.test(btn.textContent || "")) {
      try { btn.click(); } catch (e) {}
    }
    var st = document.getElementById("sb-status");
    if (st && tripped) st.textContent = tripped + " open — compressor off. Reset by clearing the fault path, then Start.";
  }

  function clearTrip() {
    tripped = "";
    latched = "";
    banner("", "", "");
    var st = document.getElementById("sb-status");
    if (st && /HPC open|LPC open/i.test(st.textContent || "")) {
      st.textContent = "Cutout reset — head and suction back in range. Start compressor. Read SH/SC.";
    }
  }

  setInterval(function () {
    if (!document.getElementById("sandbox-root") || !document.getElementById("sb-run")) return;
    var ps = num("sb-ps");
    var ph = num("g-phigh");
    if (!isFinite(ph)) ph = num("sb-ph");
    if (!isFinite(ps) || !isFinite(ph)) return;
    var running = false;
    var btn = document.getElementById("sb-run");
    if (btn && /stop/i.test(btn.textContent || "")) running = true;
    if (running && ph >= HPC) {
      tripped = "HPC";
      latched = ph.toFixed(0);
      banner("HPC", ps.toFixed(0), latched);
      stopComp();
      return;
    }
    if (running && ps <= LPC) {
      tripped = "LPC";
      latched = ps.toFixed(0);
      banner("LPC", latched, ph.toFixed(0));
      stopComp();
      return;
    }
    if (tripped === "HPC" && ph < HPC) {
      clearTrip();
      return;
    }
    if (tripped === "LPC" && ps > LPC) {
      clearTrip();
      return;
    }
    if (!running && tripped === "HPC") banner("HPC", ps.toFixed(0), latched || ph.toFixed(0));
    if (!running && tripped === "LPC") banner("LPC", latched || ps.toFixed(0), ph.toFixed(0));
  }, 400);
})();
