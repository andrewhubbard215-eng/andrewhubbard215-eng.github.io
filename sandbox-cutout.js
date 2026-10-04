/* HPC / LPC actually cut out — textbook trip, compressor stops.
   Latch the pressure that opened the switch. Do not reprint a later fault
   as the trip (Dirty OD at 498 is not an HPC). Clear when head is back under cutout.
   After HPC, liquid hose is last head. Suction equalized is not an LPC.
   Contactor stays out until the fault path is cleared — do not hammer Start.
   Equalized head under 580 is not a reset. Clear the plant (Healthy / wash), then Start. */
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
    if (st && tripped) st.textContent = tripped + " open — compressor off. Clear the fault path before you pull the contactor in.";
  }

  function retitle(id, next, fallback) {
    var title = document.getElementById(id);
    if (!title) return;
    if (!title.getAttribute("data-cutout-was")) title.setAttribute("data-cutout-was", title.textContent || fallback);
    title.setAttribute("data-cutout-label", "1");
    title.textContent = next;
  }

  function markLastHead() {
    retitle("sb-ph-title", "Last head at HPC — not standing", "HPC standing (liquid hose)");
    retitle("sb-ps-title", "Suction equalized — compressor off", "LPC standing (suction hose)");
    var root = document.getElementById("sandbox-root") || document.body;
    var nodes = root.querySelectorAll("p, span, div, label, small, li, strong");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.id === "sb-ph-title" || el.id === "sb-ps-title") continue;
      if (el.children.length) continue;
      var tx = el.textContent || "";
      if (/HPC standing/i.test(tx) && !el.getAttribute("data-cutout-label")) {
        el.setAttribute("data-cutout-was", tx);
        el.setAttribute("data-cutout-label", "1");
        el.textContent = "Last head at HPC — not standing. Standing is equalized.";
      }
    }
  }

  function clearLastHead() {
    var nodes = document.querySelectorAll("[data-cutout-label]");
    for (var i = 0; i < nodes.length; i++) {
      var was = nodes[i].getAttribute("data-cutout-was");
      if (was) nodes[i].textContent = was;
      nodes[i].removeAttribute("data-cutout-label");
      nodes[i].removeAttribute("data-cutout-was");
    }
  }

  function armHammer() {
    var btn = document.getElementById("sb-run");
    if (!btn || btn.getAttribute("data-cutout-arm")) return;
    btn.setAttribute("data-cutout-arm", "1");
    btn.addEventListener("click", function (ev) {
      if (!tripped || !ev.isTrusted) return;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      var ps = num("sb-ps");
      var ph = num("sb-ph");
      banner(tripped, isFinite(ps) ? ps.toFixed(0) : "—", latched || (isFinite(ph) ? ph.toFixed(0) : "—"));
      var st = document.getElementById("sb-status");
      if (st) st.textContent = tripped + " still open. Contactor stays out. Clear the fault path, then Start.";
    }, true);
  }

  function holdContactor() {
    var btn = document.getElementById("sb-run");
    if (!btn || !tripped) return;
    if (!btn.getAttribute("data-cutout-btn")) btn.setAttribute("data-cutout-btn", btn.textContent || "Start compressor");
    btn.textContent = "Contactor open — clear fault";
  }

  function releaseContactor() {
    var btn = document.getElementById("sb-run");
    if (!btn) return;
    var was = btn.getAttribute("data-cutout-btn");
    if (was) btn.textContent = was;
    btn.removeAttribute("data-cutout-btn");
  }


  function faultLine() {
    var el = document.getElementById("sb-fault");
    return el ? String(el.textContent || "") : "";
  }
  function faultHoldsHPC() {
    return /fan dead|overcharge|noncondens|air in the system/i.test(faultLine());
  }
  function faultHoldsLPC() {
    return /restriction|leak|low charge|airflow|iced/i.test(faultLine());
  }

  function clearTrip() {
    tripped = "";
    latched = "";
    clearLastHead();
    releaseContactor();
    banner("", "", "");
    var st = document.getElementById("sb-status");
    if (st && /HPC open|LPC open|still open/i.test(st.textContent || "")) {
      st.textContent = "Cutout reset — head and suction back in range. Start compressor. Read SH/SC.";
    }
  }

  setInterval(function () {
    if (!document.getElementById("sandbox-root") || !document.getElementById("sb-run")) return;
    armHammer();
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
      markLastHead();
      holdContactor();
      return;
    }
    if (running && ps <= LPC) {
      tripped = "LPC";
      latched = ps.toFixed(0);
      banner("LPC", latched, ph.toFixed(0));
      stopComp();
      holdContactor();
      return;
    }
    if (tripped === "HPC" && ph < HPC && !faultHoldsHPC()) {
      clearTrip();
      return;
    }
    if (tripped === "LPC" && ps > LPC && !faultHoldsLPC()) {
      clearTrip();
      return;
    }
    if (!running && tripped === "HPC") { banner("HPC", ps.toFixed(0), latched || ph.toFixed(0)); markLastHead(); holdContactor(); }
    if (!running && tripped === "LPC") { banner("LPC", latched || ps.toFixed(0), ph.toFixed(0)); holdContactor(); }
  }, 400);
})();
