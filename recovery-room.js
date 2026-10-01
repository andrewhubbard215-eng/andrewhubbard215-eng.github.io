/* Allstars — Recovery room. Scale is the proof. 80% WC is a stop. Vacuum ≠ recovery. */
(function () {
  "use strict";

  var WC_LB = 10; /* small teaching bottle — scale hits 80% WC stop */
  var STOP_PCT = 80;
  var SYS_CHARGE = 9.0; /* lb in system — enough to hit 80% on this bottle */

  var state = null;
  var drag = null;
  var tick = null;

  function fresh() {
    return {
      machine: "tray",
      vacuum: "tray",
      scale: "tray",
      cylinder: "tray",
      vaporHose: false,
      liquidHose: false,
      machineOn: false,
      vacuumOn: false,
      recovered: 0,
      systemLeft: SYS_CHARGE,
      pLow: 162,
      pHigh: 442
    };
  }

  function pct() {
    return Math.min(100, Math.round((state.recovered / WC_LB) * 1000) / 10);
  }
  function atStop() {
    return pct() >= STOP_PCT;
  }
  function canRecover() {
    return (
      state.machine === "bay" &&
      state.cylinder === "bay" &&
      state.scale === "bay" &&
      state.vaporHose &&
      state.liquidHose &&
      state.machineOn &&
      !atStop() &&
      state.systemLeft > 0.05
    );
  }

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function setStatus(msg, warn) {
    var s = document.getElementById("rc-status");
    if (!s) return;
    s.textContent = msg;
    s.style.color = warn ? "#fbbf24" : "#e2e8f0";
  }

  function paintGauges() {
    var lo = document.getElementById("rc-plow");
    var hi = document.getElementById("rc-phigh");
    if (lo) lo.textContent = Math.round(state.pLow) + " psig";
    if (hi) hi.textContent = Math.round(state.pHigh) + " psig";
  }

  function paintScale() {
    var sc = document.getElementById("rc-scale-read");
    if (!sc) return;
    var p = pct();
    sc.textContent =
      state.recovered.toFixed(1) + " lb on scale · " + p.toFixed(1) + "% of " + WC_LB + " lb WC";
    sc.classList.toggle("rc-stop", p >= STOP_PCT);
    var bar = document.getElementById("rc-scale-bar");
    if (bar) {
      bar.style.width = Math.min(100, p) + "%";
      bar.style.background = p >= STOP_PCT ? "#ef4444" : p >= 70 ? "#f59e0b" : "#22c55e";
    }
  }

  function paintTrayBay() {
    var tray = document.getElementById("rc-tray");
    var bay = document.getElementById("rc-bay-parts");
    if (!tray || !bay) return;
    tray.innerHTML = "";
    bay.innerHTML = "";
    var items = [
      { id: "machine", label: "Recovery machine", key: "machine" },
      { id: "vacuum", label: "Vacuum pump", key: "vacuum" },
      { id: "scale", label: "Scale", key: "scale" },
      { id: "cylinder", label: "Recovery cylinder", key: "cylinder" }
    ];
    items.forEach(function (it) {
      var where = state[it.key];
      var b = el("button", "btn rc-part", it.label);
      b.type = "button";
      b.setAttribute("data-rc-part", it.id);
      b.draggable = true;
      if (where === "tray") tray.appendChild(b);
      else bay.appendChild(b);
    });
    var hv = document.getElementById("rc-hose-vapor");
    var hl = document.getElementById("rc-hose-liquid");
    if (hv) {
      hv.classList.toggle("primary", state.vaporHose);
      hv.textContent = state.vaporHose ? "Vapor hose · ON system" : "Vapor hose · drag to LO";
    }
    if (hl) {
      hl.classList.toggle("primary", state.liquidHose);
      hl.textContent = state.liquidHose ? "Liquid hose · ON system" : "Liquid hose · drag to HI";
    }
    var msw = document.getElementById("rc-machine-sw");
    var vsw = document.getElementById("rc-vacuum-sw");
    if (msw) {
      msw.disabled = state.machine !== "bay";
      msw.textContent = state.machineOn ? "Recovery machine · ON" : "Recovery machine · OFF";
      msw.classList.toggle("primary", state.machineOn);
    }
    if (vsw) {
      vsw.disabled = state.vacuum !== "bay";
      vsw.textContent = state.vacuumOn ? "Vacuum pump · ON" : "Vacuum pump · OFF";
      vsw.classList.toggle("primary", state.vacuumOn);
    }
  }

  function narrate() {
    if (atStop()) {
      setStatus("80% WC — STOP. Scale is the proof. Change cylinders before you cook the bottle.", true);
      return;
    }
    if (state.vacuumOn && state.machineOn) {
      setStatus("Vacuum pump is for dehydration AFTER the charge is out — kill recovery first.", true);
      return;
    }
    if (state.vacuumOn && state.systemLeft > 0.5) {
      setStatus("Vacuum pump running with charge still in the box — wrong tool. Recover first.", true);
      return;
    }
    if (canRecover()) {
      setStatus("Recovering — gauges drop, scale climbs. Proof is on the scale, not the tank stamp.");
      return;
    }
    if (state.machine !== "bay") {
      setStatus("Drag the recovery machine onto the bay. It can go back to the tray anytime.");
      return;
    }
    if (state.scale !== "bay" || state.cylinder !== "bay") {
      setStatus("Scale under the cylinder — scale is the proof. Seat both on the bay.");
      return;
    }
    if (!state.vaporHose || !state.liquidHose) {
      setStatus("Drag vapor hose to LO and liquid hose to HI. No open ports.");
      return;
    }
    if (!state.machineOn) {
      setStatus("Hoses and bottle set. Flip Recovery machine ON. Vacuum stays OFF until empty.");
      return;
    }
    if (state.systemLeft <= 0.05) {
      setStatus("System empty enough for this bay. Now vacuum is the separate tool — dehydration pull.");
      return;
    }
    setStatus("Recovery bay ready.");
  }

  function placePart(id, dest) {
    if (id === "machine") state.machine = dest;
    else if (id === "vacuum") state.vacuum = dest;
    else if (id === "scale") state.scale = dest;
    else if (id === "cylinder") state.cylinder = dest;
    if (state.machine !== "bay") state.machineOn = false;
    if (state.vacuum !== "bay") state.vacuumOn = false;
    paintTrayBay();
    paintScale();
    narrate();
  }

  function connectHose(which) {
    if (which === "vapor") state.vaporHose = true;
    if (which === "liquid") state.liquidHose = true;
    paintTrayBay();
    narrate();
  }

  function stepRecover() {
    if (!canRecover()) {
      if (state.machineOn && atStop()) {
        state.machineOn = false;
        paintTrayBay();
        narrate();
      }
      return;
    }
    var bite = 0.12;
    if (state.systemLeft < bite) bite = state.systemLeft;
    state.systemLeft -= bite;
    state.recovered += bite;
    var done = 1 - state.systemLeft / SYS_CHARGE;
    state.pLow = Math.max(0, 162 * (1 - done * 0.98));
    state.pHigh = Math.max(5, 442 * (1 - done * 0.95));
    if (atStop()) {
      state.machineOn = false;
      state.recovered = (STOP_PCT / 100) * WC_LB;
    }
    paintGauges();
    paintScale();
    paintTrayBay();
    narrate();
  }

  function bindDrag(root) {
    root.addEventListener("dragstart", function (ev) {
      var t = ev.target.closest("[data-rc-part], [data-rc-hose]");
      if (!t || !ev.dataTransfer) return;
      var part = t.getAttribute("data-rc-part");
      var hose = t.getAttribute("data-rc-hose");
      drag = part ? { kind: "part", id: part } : { kind: "hose", id: hose };
      try {
        ev.dataTransfer.setData("text/lt-rc", JSON.stringify(drag));
        ev.dataTransfer.effectAllowed = "move";
      } catch (e) {}
    });
    root.addEventListener("dragover", function (ev) {
      ev.preventDefault();
    });
    root.addEventListener("drop", function (ev) {
      ev.preventDefault();
      var raw = null;
      try {
        raw = JSON.parse(ev.dataTransfer.getData("text/lt-rc") || "null");
      } catch (e) {}
      if (!raw) raw = drag;
      drag = null;
      if (!raw) return;
      var zone = ev.target.closest("[data-rc-drop]");
      var port = ev.target.closest("[data-rc-port]");
      if (raw.kind === "hose" && port) {
        var p = port.getAttribute("data-rc-port");
        if (raw.id === "vapor" && p === "lo") connectHose("vapor");
        else if (raw.id === "liquid" && p === "hi") connectHose("liquid");
        else setStatus("Wrong port — vapor → LO, liquid → HI.", true);
        return;
      }
      if (raw.kind === "part" && zone) {
        var dest = zone.getAttribute("data-rc-drop");
        if (dest === "bay" || dest === "tray") placePart(raw.id, dest);
      }
    });
    root.addEventListener("click", function (ev) {
      var part = ev.target.closest("[data-rc-part]");
      if (part) {
        var id = part.getAttribute("data-rc-part");
        var where = state[id === "machine" ? "machine" : id === "vacuum" ? "vacuum" : id];
        placePart(id, where === "tray" ? "bay" : "tray");
        return;
      }
      var hose = ev.target.closest("[data-rc-hose]");
      if (hose) {
        var hid = hose.getAttribute("data-rc-hose");
        if (hid === "vapor") state.vaporHose = !state.vaporHose;
        if (hid === "liquid") state.liquidHose = !state.liquidHose;
        paintTrayBay();
        narrate();
      }
    });
  }

  function build(root) {
    state = fresh();
    root.innerHTML = "";
    var wrap = el("div", "rc-wrap");
    wrap.innerHTML =
      '<header class="hub-head rc-head">' +
      "<h2>Recovery room</h2>" +
      '<button type="button" class="btn" id="rc-hub">Shop floor</button>' +
      "</header>" +
      '<p class="rc-lede">Scale is the proof. <strong>80% WC is a stop.</strong> Vacuum pump is a separate tool — not the recovery machine.</p>' +
      '<div class="rc-layout">' +
      '<aside class="rc-tray-col" data-rc-drop="tray"><p class="rc-label">Parts tray</p><div id="rc-tray"></div>' +
      '<button type="button" class="btn rc-hose" id="rc-hose-vapor" data-rc-hose="vapor" draggable="true">Vapor hose</button>' +
      '<button type="button" class="btn rc-hose" id="rc-hose-liquid" data-rc-hose="liquid" draggable="true">Liquid hose</button>' +
      "</aside>" +
      '<main class="rc-bay" data-rc-drop="bay">' +
      '<div class="rc-gauges"><div class="panel"><strong>LO</strong><div id="rc-plow">162 psig</div>' +
      '<button type="button" class="btn" data-rc-port="lo">LO port</button></div>' +
      '<div class="panel"><strong>HI</strong><div id="rc-phigh">442 psig</div>' +
      '<button type="button" class="btn" data-rc-port="hi">HI port</button></div></div>' +
      '<div id="rc-bay-parts" class="rc-bay-parts"></div>' +
      '<div class="rc-scale panel"><strong>Scale</strong>' +
      '<div id="rc-scale-read">0.0 lb · 0% WC</div>' +
      '<div class="rc-scale-track"><div id="rc-scale-bar"></div></div>' +
      "<p>Stop line 80% of water capacity — never fill solid.</p></div>" +
      '<div class="rc-switches">' +
      '<button type="button" class="btn" id="rc-machine-sw">Recovery machine · OFF</button>' +
      '<button type="button" class="btn" id="rc-vacuum-sw">Vacuum pump · OFF</button>' +
      '<button type="button" class="btn" id="rc-reset">Reset bay</button>' +
      "</div></main></div>" +
      '<p id="rc-status" class="rc-status" role="status"></p>';
    root.appendChild(wrap);

    document.getElementById("rc-hub").onclick = function () {
      if (typeof window.ltGoHub === "function") window.ltGoHub();
      else if (typeof window.ltGo === "function") window.ltGo("hub");
    };
    document.getElementById("rc-machine-sw").onclick = function () {
      if (state.machine !== "bay") return;
      if (!state.machineOn && atStop()) {
        narrate();
        return;
      }
      state.machineOn = !state.machineOn;
      if (state.machineOn && state.vacuumOn) state.vacuumOn = false;
      paintTrayBay();
      narrate();
    };
    document.getElementById("rc-vacuum-sw").onclick = function () {
      if (state.vacuum !== "bay") return;
      state.vacuumOn = !state.vacuumOn;
      if (state.vacuumOn && state.machineOn) state.machineOn = false;
      paintTrayBay();
      narrate();
    };
    document.getElementById("rc-reset").onclick = function () {
      state = fresh();
      paintTrayBay();
      paintGauges();
      paintScale();
      narrate();
    };

    bindDrag(wrap);
    paintTrayBay();
    paintGauges();
    paintScale();
    narrate();

    if (tick) clearInterval(tick);
    tick = setInterval(stepRecover, 400);
  }

  function start(root) {
    if (!root) root = document.getElementById("recovery-root");
    if (!root) return;
    build(root);
  }

  function maybeStart() {
    var screen = document.getElementById("screen-recovery");
    var root = document.getElementById("recovery-root");
    if (!screen || !root) return;
    if (screen.classList.contains("active") || screen.classList.contains("screen-on")) {
      if (!root.getAttribute("data-rc-built") || !root.querySelector(".rc-wrap")) {
        root.setAttribute("data-rc-built", "1");
        start(root);
      }
    }
  }

  window.LtRecoveryRoom = { start: start };

  var t = null;
  var obs = new MutationObserver(function () {
    clearTimeout(t);
    t = setTimeout(maybeStart, 60);
  });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", maybeStart);
  else maybeStart();
})();
