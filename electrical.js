/* Lincoln Tech HVAC Allstars — Electrical sandbox + timed callback-bomb trainer.
   Field faults only. Not explosive devices.
   Player runs the box: black = hot, off-white = neutral, green = ground. */
(function (global) {
  "use strict";

  const PARTS = [
    { id: "breaker", name: "2-pole breaker", group: "line", img: null, icon: "⬛", slot: "breaker", desc: "L1 / L2 feed · 240 VAC" },
    { id: "disconnect", name: "Fused disconnect", group: "line", img: "parts/disconnect.png", icon: "🔌", slot: "disconnect", desc: "Outdoor disconnect" },
    { id: "ground", name: "Equipment ground", group: "line", img: null, icon: "⏚", slot: "ground", desc: "Green / bare to chassis" },
    { id: "contactor", name: "2-pole contactor", group: "line", img: "parts/contactor.png", icon: "🧲", slot: "contactor", desc: "24V coil · T1/T2 to loads" },
    { id: "capacitor", name: "Dual run capacitor", group: "line", img: "parts/capacitor.png", icon: "🔋", slot: "capacitor", desc: "HERM / FAN / C" },
    { id: "hardstart", name: "Hard-start kit", group: "line", img: null, icon: "⚡", slot: "hardstart", desc: "Start cap + potential relay" },
    { id: "transformer", name: "24V transformer", group: "control", img: "parts/transformer.png", icon: "🔁", slot: "transformer", desc: "Primary 240 · secondary R/C" },
    { id: "fuse", name: "3A control fuse", group: "control", img: "parts/fuse.png", icon: "🧯", slot: "fuse", desc: "R leg protection" },
    { id: "thermostat", name: "Thermostat", group: "control", img: "parts/thermostat.png", icon: "🌡️", slot: "thermostat", desc: "R Y G W O/B C" },
    { id: "hpc", name: "High-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬆️", slot: "hpc", desc: "Opens on high head" },
    { id: "lpc", name: "Low-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬇️", slot: "lpc", desc: "Opens on low suction" },
    { id: "float", name: "Condensate float", group: "control", img: null, icon: "💧", slot: "float", desc: "Breaks Y or R on high water" },
    { id: "relay", name: "Blower relay", group: "control", img: "parts/relay.png", icon: "📦", slot: "relay", desc: "G call · indoor fan" },
    { id: "solenoid", name: "Reversing valve solenoid", group: "control", img: null, icon: "🧲", slot: "solenoid", desc: "Heat-pump O/B" },
    { id: "limit", name: "High-limit switch", group: "control", img: "parts/pressuresw.png", icon: "🔥", slot: "limit", desc: "Furnace high limit in series with W" },
    { id: "sequencer", name: "Heat sequencer", group: "control", img: "parts/relay.png", icon: "📶", slot: "sequencer", desc: "Stages electric strips" },
    { id: "defrost", name: "Defrost control board", group: "control", img: null, icon: "🧊", slot: "defrost", desc: "Heat-pump defrost logic" },
    { id: "lockout", name: "Lockout relay", group: "control", img: "parts/relay.png", icon: "🔒", slot: "lockout", desc: "Holds out after a safety trip" },
    { id: "presssw", name: "Inducer pressure switch", group: "control", img: "parts/pressuresw.png", icon: "🌬️", slot: "presssw", desc: "Must close before ignition" },
    { id: "compressor", name: "Compressor (C/R/S)", group: "loads", img: "parts/compressor.png", icon: "🌀", slot: "compressor", desc: "Common / run / start" },
    { id: "fan", name: "Condenser fan motor", group: "loads", img: "parts/fanmotor.png", icon: "🌬️", slot: "fan", desc: "PSC outdoor fan" },
    { id: "heater", name: "Crankcase heater", group: "loads", img: null, icon: "🔥", slot: "heater", desc: "Off-cycle heat" },
    { id: "inducer", name: "Inducer / draft motor", group: "loads", img: null, icon: "💨", slot: "inducer", desc: "Gas furnace draft · 120 VAC" },
    { id: "pump", name: "Condensate pump", group: "loads", img: null, icon: "💧", slot: "pump", desc: "120V pump · float interlock" },
    { id: "strips", name: "Electric heat strips", group: "loads", img: null, icon: "♨️", slot: "strips", desc: "Air-handler electric heat" },
    { id: "gasvalve", name: "Gas valve", group: "loads", img: null, icon: "🟠", slot: "gasvalve", desc: "24V valve · furnace" },
    { id: "blower", name: "Indoor blower", group: "loads", img: "parts/fanmotor.png", icon: "🌀", slot: "blower", desc: "PSC / ECM indoor fan" },
    { id: "dmm", name: "Digital multimeter", group: "tools", img: "parts/dmm.png", icon: "📟", slot: null, desc: "Click terminals to probe" },
  ];

  const SLOTS = [
    { id: "breaker", x: 4, y: 6, w: 16, label: "Breaker" },
    { id: "disconnect", x: 22, y: 6, w: 16, label: "Disconnect" },
    { id: "ground", x: 40, y: 6, w: 12, label: "Ground" },
    { id: "transformer", x: 54, y: 6, w: 22, label: "24V transformer" },
    { id: "fuse", x: 78, y: 6, w: 18, label: "3A fuse" },
    { id: "contactor", x: 4, y: 28, w: 20, label: "Contactor" },
    { id: "capacitor", x: 26, y: 28, w: 18, label: "Run cap" },
    { id: "hardstart", x: 46, y: 28, w: 14, label: "Hard start" },
    { id: "lockout", x: 62, y: 28, w: 16, label: "Lockout" },
    { id: "defrost", x: 80, y: 28, w: 16, label: "Defrost" },
    { id: "compressor", x: 4, y: 50, w: 20, label: "Compressor" },
    { id: "fan", x: 26, y: 50, w: 18, label: "OD fan" },
    { id: "heater", x: 46, y: 50, w: 14, label: "CCH" },
    { id: "thermostat", x: 62, y: 50, w: 16, label: "Stat" },
    { id: "blower", x: 80, y: 50, w: 16, label: "Blower" },
    { id: "hpc", x: 4, y: 72, w: 15, label: "HPC" },
    { id: "lpc", x: 21, y: 72, w: 15, label: "LPC" },
    { id: "float", x: 38, y: 72, w: 15, label: "Float" },
    { id: "relay", x: 55, y: 72, w: 13, label: "Relay" },
    { id: "solenoid", x: 70, y: 72, w: 13, label: "RV" },
    { id: "limit", x: 85, y: 72, w: 13, label: "Limit" },
    { id: "inducer", x: 4, y: 90, w: 18, label: "Inducer" },
    { id: "presssw", x: 24, y: 90, w: 18, label: "Pressure SW" },
    { id: "gasvalve", x: 44, y: 90, w: 16, label: "Gas valve" },
    { id: "sequencer", x: 62, y: 90, w: 16, label: "Sequencer" },
    { id: "strips", x: 80, y: 90, w: 16, label: "Heat strips" },
    { id: "pump", x: 4, y: 108, w: 18, label: "Cond. pump" },
  ];

  const PROBES = [
    { id: "l1", label: "L1 (line)", group: "line" },
    { id: "l2", label: "L2 (line)", group: "line" },
    { id: "gnd", label: "Ground", group: "line" },
    { id: "load1", label: "Disconnect load L1", group: "line" },
    { id: "load2", label: "Disconnect load L2", group: "line" },
    { id: "t1", label: "Contactor T1", group: "line" },
    { id: "t2", label: "Contactor T2", group: "line" },
    { id: "compc", label: "Compressor C", group: "comp" },
    { id: "compr", label: "Compressor R (run)", group: "comp" },
    { id: "comps", label: "Compressor S (start)", group: "comp" },
    { id: "caph", label: "Cap HERM", group: "cap" },
    { id: "capf", label: "Cap FAN", group: "cap" },
    { id: "capc", label: "Cap C", group: "cap" },
    { id: "r", label: "R (24V hot)", group: "24" },
    { id: "c24", label: "C (24V common)", group: "24" },
    { id: "y", label: "Y (cool call)", group: "24" },
    { id: "g", label: "G (fan call)", group: "24" },
    { id: "w", label: "W (heat call)", group: "24" },
    { id: "o", label: "O/B (reversing valve)", group: "24" },
    { id: "coil", label: "Contactor coil", group: "24" },
    { id: "hpc", label: "HPC switch", group: "24" },
    { id: "lpc", label: "LPC switch", group: "24" },
    { id: "limit", label: "High-limit", group: "24" },
    { id: "fanlead", label: "OD fan lead", group: "line" },
    { id: "striplead", label: "Heat strip lead", group: "line" },
  ];

  const KITS = {
    split: {
      name: "Straight-cool split",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float"],
    },
    heatpump: {
      name: "Heat pump (O/B)",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "solenoid", "defrost"],
    },
    gasac: {
      name: "Gas furnace + A/C",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "relay", "limit", "inducer", "presssw", "gasvalve", "blower"],
    },
    package: {
      name: "Package unit",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "heater", "blower"],
    },
    electric: {
      name: "Air handler + electric heat",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "contactor", "capacitor", "compressor", "fan", "thermostat", "hpc", "lpc", "float", "sequencer", "strips", "blower", "relay"],
    },
    accessory: {
      name: "120V condensate / CCH",
      parts: ["breaker", "disconnect", "ground", "transformer", "fuse", "thermostat", "float", "heater", "pump"],
    },
  };

  /* Neutral is off-white (#cbb892) so it never vanishes on the white box. */
  const WIRE = {
    hot: { id: "hot", name: "Hot", code: "black", fill: "#1a1a1a", stroke: "#000000" },
    neutral: { id: "neutral", name: "Neutral", code: "off-white", fill: "#cbb892", stroke: "#6a5740" },
    ground: { id: "ground", name: "Ground", code: "green", fill: "#1b8f4a", stroke: "#0d5c2e" },
  };

  const NEUTRAL_SLOTS = { transformer: 1, fuse: 1, inducer: 1, pump: 1, blower: 1, heater: 1 };

  /* Timed HVAC electrical trainer. Known field faults — not explosive devices. */
  const JOBS = [
    {
      id: "hpc",
      name: "No-cool at 4:58",
      seconds: 90,
      kit: "split",
      fault: "open_hpc",
      cool: true,
      fan: false,
      brief: "House is 86°. Y is calling. Contactor is out. 24V series string is open. Meter Y through the safeties. Cut the OPEN safety — not R, not the compressor run.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "c", color: "#1a1a1a", label: "C · 24V common", cut: "boom" },
        { id: "y", color: "#e8c450", label: "Y · cool call", cut: "boom" },
        { id: "hpc", color: "#4aa3ff", label: "HPC series lead (open)", cut: "win" },
        { id: "g", color: "#3dba6a", label: "G · indoor fan", cut: "ok" },
      ],
      replaceWin: "hpc",
    },
    {
      id: "cap",
      name: "Hum, no start",
      seconds: 80,
      kit: "split",
      fault: "open_cap",
      cool: true,
      fan: false,
      brief: "Contactor is in. Compressor hums, no start. Lock it out. Do not cut a winding. Replace the dual run cap — or you eat a compressor.",
      wires: [
        { id: "herm", color: "#c0392b", label: "HERM (run winding)", cut: "boom" },
        { id: "fan", color: "#3dba6a", label: "FAN (OD motor)", cut: "ok" },
        { id: "ccommon", color: "#c08a5a", label: "Cap C (common)", cut: "boom" },
        { id: "t1", color: "#e8c450", label: "Contactor T1 (hot)", cut: "boom" },
      ],
      replaceWin: "capacitor",
    },
    {
      id: "fuse",
      name: "3A keeps popping",
      seconds: 100,
      kit: "split",
      fault: "grounded",
      cool: false,
      fan: false,
      brief: "Control fuse is toast. Something is shorted. Find the winding-to-ground BEFORE you slap a new 3A in. Cut the grounded compressor C lead to isolate, then replace the fuse.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "compc", color: "#4aa3ff", label: "Compressor C (grounded)", cut: "win" },
        { id: "gnd", color: "#3dba6a", label: "Chassis ground", cut: "boom" },
        { id: "c24", color: "#1a1a1a", label: "Transformer C", cut: "ok" },
      ],
      replaceWin: null,
    },
    {
      id: "swap",
      name: "Stat wired drunk",
      seconds: 75,
      kit: "split",
      fault: "none",
      cool: true,
      fan: false,
      brief: "Last helper landed Y on G and G on Y. Fan runs, condenser never starts. Cut the mislanded Y (the green that is actually the cool call).",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "ywrong", color: "#3dba6a", label: "Green wire sitting on Y (it's G)", cut: "ok" },
        { id: "gwrong", color: "#e8c450", label: "Yellow wire sitting on G (it's Y)", cut: "win" },
        { id: "c", color: "#1a1a1a", label: "C · common", cut: "boom" },
      ],
      replaceWin: null,
    },
    {
      id: "coil",
      name: "Contactor never pulls in",
      seconds: 85,
      kit: "heatpump",
      fault: "open_coil",
      cool: true,
      fan: false,
      brief: "Y is through HPC/LPC/float. 24V dies at the coil. Replace the contactor — do not cut T1/T2 live.",
      wires: [
        { id: "t1", color: "#c0392b", label: "T1 load hot", cut: "boom" },
        { id: "t2", color: "#4aa3ff", label: "T2 load hot", cut: "boom" },
        { id: "coil+", color: "#e8c450", label: "Coil + (open winding)", cut: "ok" },
        { id: "y", color: "#3dba6a", label: "Y arriving at coil", cut: "ok" },
      ],
      replaceWin: "contactor",
    },
    {
      id: "float",
      name: "Pan is a lake",
      seconds: 70,
      kit: "split",
      fault: "float_open",
      cool: true,
      fan: true,
      brief: "Indoor coil overflowing. Float opened Y. Cut the float out of the cool call ONLY after you confirm it's the open — jumping R to Y live is how you flood the house.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · jumper to Y (cheat)", cut: "boom" },
        { id: "float", color: "#4aa3ff", label: "Float series (open)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y to outdoor", cut: "ok" },
        { id: "g", color: "#3dba6a", label: "G blower", cut: "ok" },
      ],
      replaceWin: "float",
    },
    {
      id: "lpc",
      name: "Iced solid, 2° SH",
      seconds: 85,
      kit: "split",
      fault: "open_lpc",
      cool: true,
      fan: true,
      brief: "LPC is open. Don't add gas until you prove it's not a frozen coil. Cut the open LPC series — not R.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "lpc", color: "#4aa3ff", label: "LPC series lead (open)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y · cool call", cut: "boom" },
        { id: "g", color: "#3dba6a", label: "G · indoor fan", cut: "ok" },
      ],
      replaceWin: "lpc",
    },
    {
      id: "disc",
      name: "Dead set, 86° house",
      seconds: 70,
      kit: "split",
      fault: "open_disc",
      cool: true,
      brief: "No 240 past the disconnect. Don't cut control wiring. Isolate at the open disconnect — not L1 live.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V (still dead)", cut: "ok" },
        { id: "l1", color: "#e8c450", label: "L1 line (live)", cut: "boom" },
        { id: "disc", color: "#4aa3ff", label: "Disconnect load (open)", cut: "win" },
        { id: "gnd", color: "#3dba6a", label: "Equipment ground", cut: "boom" },
      ],
      replaceWin: "disconnect",
    },
    {
      id: "limit",
      name: "Furnace limit trip",
      seconds: 80,
      kit: "gasac",
      fault: "open_limit",
      heat: true,
      cool: false,
      brief: "W is calling. Inducer ran. Limit is open — dirty filter or plugged exchanger until proven otherwise. Cut the open limit, not the gas valve.",
      wires: [
        { id: "w", color: "#c0392b", label: "W · heat call", cut: "boom" },
        { id: "limit", color: "#4aa3ff", label: "High-limit series (open)", cut: "win" },
        { id: "gv", color: "#e8c450", label: "Gas valve 24V", cut: "boom" },
        { id: "g", color: "#3dba6a", label: "G blower", cut: "ok" },
      ],
      replaceWin: "limit",
    },
    {
      id: "rv",
      name: "Heat pump, 3A dead",
      seconds: 90,
      kit: "heatpump",
      fault: "blown_fuse",
      cool: true,
      rev: true,
      brief: "Control fuse is open. RV solenoid is shorted. Isolate the O lead before you slam a new 3A. Cut O, not R.",
      wires: [
        { id: "r", color: "#c0392b", label: "R · 24V hot", cut: "boom" },
        { id: "o", color: "#4aa3ff", label: "O/B to RV solenoid (shorted)", cut: "win" },
        { id: "y", color: "#e8c450", label: "Y cool call", cut: "ok" },
        { id: "c", color: "#1a1a1a", label: "C common", cut: "boom" },
      ],
      replaceWin: "fuse",
    },
  ];

  let host, onXp, onWin;
  let placed = {};
  let callCool = false;
  let callFan = false;
  let callHeat = false;
  let callRev = false;
  let fault = "none";
  let mode = "vac";
  let red = "l1";
  let black = "l2";
  let fusedBlown = false;
  let labMode = "build";
  let job = null;
  let cutSet = {};
  let timeLeft = 0;
  let timerId = 0;
  let defused = false;
  let boom = false;
  let activeKit = "split";
  let probed = false;
  let wonFired = false;
  let runs = [];
  let spool = "hot";
  let pending = null;
  let runSeq = 1;
  let resizeObs = null;
  let zoomSlot = null;

  function has(id) {
    return !!placed[id];
  }

  function lugsFor(slotId) {
    if (slotId === "ground") {
      return [{ id: "gnd", cls: "gnd", label: "G", title: "GROUND · green" }];
    }
    if (slotId === "transformer" || slotId === "fuse") {
      return [
        { id: "hot", cls: "hot", label: "H", title: "HOT · black" },
        { id: "n", cls: "neu", label: "N", title: "NEUTRAL · off-white" },
        { id: "gnd", cls: "gnd", label: "G", title: "GROUND · green" },
      ];
    }
    const p = PARTS.find((x) => x.slot === slotId);
    if (!p || p.group === "tools" || p.group === "control") return [];
    if (slotId === "capacitor" || slotId === "hardstart") return [];
    const lugs = [
      { id: "hot", cls: "hot", label: "H", title: "HOT · black" },
      { id: "gnd", cls: "gnd", label: "G", title: "GROUND · green" },
    ];
    if (NEUTRAL_SLOTS[slotId] || slotId === "breaker" || slotId === "disconnect") {
      lugs.splice(1, 0, { id: "n", cls: "neu", label: "N", title: "NEUTRAL · off-white" });
    }
    return lugs;
  }

  function lugKind(id) {
    if (!id) return "";
    if (id.endsWith(".hot") || id === "src.hot") return "hot";
    if (id.endsWith(".n") || id === "src.n") return "n";
    if (id.endsWith(".gnd") || id === "src.gnd") return "gnd";
    return "";
  }

  function neighbors(node, color) {
    const out = [];
    runs.forEach((r) => {
      if (r.color !== color) return;
      if (r.a === node) out.push(r.b);
      if (r.b === node) out.push(r.a);
    });
    return out;
  }

  function connected(color, from, to) {
    if (!from || !to) return false;
    if (from === to) return true;
    const seen = new Set([from]);
    const q = [from];
    while (q.length) {
      const n = q.shift();
      const next = neighbors(n, color);
      for (let i = 0; i < next.length; i++) {
        const m = next[i];
        if (seen.has(m)) continue;
        if (m === to) return true;
        seen.add(m);
        q.push(m);
      }
    }
    return false;
  }

  function hotAt(lug) { return connected("hot", "src.hot", lug); }
  function neuAt(lug) { return connected("neutral", "src.n", lug); }
  function gndAt(lug) { return connected("ground", "src.gnd", lug); }

  function hasGroundFault() {
    return runs.some((r) => {
      const ka = lugKind(r.a);
      const kb = lugKind(r.b);
      const mixHG = (ka === "hot" && kb === "gnd") || (ka === "gnd" && kb === "hot");
      if (mixHG) return true;
      if (r.color === "hot" && (ka === "gnd" || kb === "gnd")) return true;
      return false;
    });
  }

  function landWire(color, a, b) {
    if (!a || !b || a === b) return false;
    if (!WIRE[color]) return false;
    const dup = runs.some((r) => r.color === color && ((r.a === a && r.b === b) || (r.a === b && r.b === a)));
    if (dup) return false;
    runs.push({ id: "w" + (runSeq++), color: color, a: a, b: b });
    return true;
  }

  function originForColor(color) {
    if (color === "hot") return "src.hot";
    if (color === "neutral") return "src.n";
    return "src.gnd";
  }

  function colorFromLug(id) {
    const k = lugKind(id);
    if (k === "hot") return "hot";
    if (k === "n") return "neutral";
    if (k === "gnd") return "ground";
    return spool;
  }

  function wireGhostHtml(color) {
    const w = WIRE[color] || WIRE.hot;
    return '<i class="el-wire-lead ' + w.id + '"></i><strong>' + w.name + " · " + w.code + "</strong>";
  }

  function resolveDropTarget(el, color) {
    if (!el) return null;
    if (el.dataset && el.dataset.lug) return el.dataset.lug;
    const lugChild = el.closest ? el.closest("[data-lug]") : null;
    if (lugChild && lugChild.dataset.lug) return lugChild.dataset.lug;
    const slot = el.dataset && el.dataset.slot;
    if (!slot) return null;
    const suffix = color === "hot" ? "hot" : color === "neutral" ? "n" : "gnd";
    const want = slot + "." + suffix;
    if (host.querySelector('[data-lug="' + want + '"]')) return want;
    return null;
  }

  function lugMatch(color, lugId) {
    const k = lugKind(lugId);
    return (color === "hot" && k === "hot") || (color === "neutral" && k === "n") || (color === "ground" && k === "gnd");
  }

  function highlightWireTargets(color, hoverEl) {
    if (!host) return;
    const kind = color === "hot" ? "hot" : color === "neutral" ? "n" : "gnd";
    host.querySelectorAll("[data-lug]").forEach((b) => {
      const k = lugKind(b.dataset.lug);
      b.classList.toggle("wire-match", k === kind);
      const hovered = !!(hoverEl && (hoverEl === b || (hoverEl.contains && hoverEl.contains(b)) || hoverEl.dataset.lug === b.dataset.lug));
      b.classList.toggle("over", hovered);
    });
  }

  function clearWireTargets() {
    if (!host) return;
    host.querySelectorAll("[data-lug]").forEach((b) => {
      b.classList.remove("wire-match", "over");
    });
  }

  function dropWireOnLug(color, toLug, fromLug) {
    if (labMode === "defusal" || !toLug || !WIRE[color]) return false;
    const from = fromLug || originForColor(color);
    if (!from || from === toLug) return false;
    landWire(color, from, toLug);
    spool = color;
    pending = null;
    paintLugState();
    paintRuns();
    paintMeter();
    const slot = toLug.split(".")[0];
    if (zoomSlot === slot) syncZoom();
    else if (slot && labMode === "build") openZoom(slot === "src" ? "src" : slot);
    const ok = lugMatch(color, toLug);
    host.querySelectorAll('[data-lug="' + toLug + '"]').forEach((n) => {
      n.classList.add(ok ? "landed-ok" : "landed-bad");
      setTimeout(() => n.classList.remove("landed-ok", "landed-bad"), 700);
    });
    if (onXp) onXp(ok ? 3 : 1);
    return true;
  }

  function bindWireDrags() {
    if (!window.LtDrag || labMode === "defusal") return;
    host.querySelectorAll(".el-spool[data-spool]").forEach((el) => {
      if (el.dataset.wireBound) return;
      el.dataset.wireBound = "1";
      const color = el.dataset.spool;
      window.LtDrag.bindSource(el, {
        id: color,
        allowButtons: true,
        ghostClass: "el-wire-ghost",
        html: wireGhostHtml(color),
        dropSelector: ".el-zoom-screw, #el-source, #el-board .el-slot.filled",
        onDragStart(id) {
          spool = id;
          paintLugState();
          highlightWireTargets(id);
        },
        onHover(target, id, ev) {
          highlightWireTargets(id, target);
          if (zoomSlot) return;
          const lug = resolveDropTarget(target, id);
          const slot = lug ? lug.split(".")[0] : (target && target.dataset.slot);
          if (slot && slot !== "src") showLoupe(placed[slot] || slot, target && target.classList && target.classList.contains("el-slot") ? target : host.querySelector('.el-slot[data-slot="' + slot + '"]'), ev);
        },
        onHoverEnd() {
          clearWireTargets();
          hideLoupe();
        },
        onDrop(_key, id, dropEl) {
          clearWireTargets();
          hideLoupe();
          const screw = dropEl && dropEl.closest ? dropEl.closest(".el-zoom-screw") : null;
          if (screw && screw.dataset.lug) {
            dropWireOnLug(id, screw.dataset.lug, originForColor(id));
            return;
          }
          const slotEl = dropEl && dropEl.closest ? dropEl.closest(".el-slot.filled, #el-source") : dropEl;
          const slot = slotEl && (slotEl.id === "el-source" ? "src" : slotEl.dataset.slot);
          if (slot) openZoom(slot);
        },
      });
    });
  }

  function pullRun(id) {
    runs = runs.filter((r) => r.id !== id);
    paintRuns();
    paintMeter();
  }

  function landFactory() {
    runs = [];
    pending = null;
    const add = (color, a, b) => landWire(color, a, b);
    if (has("breaker")) add("hot", "src.hot", "breaker.hot");
    const hotPrev = has("disconnect") ? "disconnect.hot" : (has("breaker") ? "breaker.hot" : "src.hot");
    if (has("disconnect") && has("breaker")) add("hot", "breaker.hot", "disconnect.hot");
    if (has("transformer")) {
      add("hot", hotPrev, "transformer.hot");
      add("neutral", "src.n", "transformer.n");
    }
    if (has("ground")) add("ground", "src.gnd", "ground.gnd");
    else if (has("disconnect")) add("ground", "src.gnd", "disconnect.gnd");
    else if (has("breaker")) add("ground", "src.gnd", "breaker.gnd");
    const gndPrev = has("ground") ? "ground.gnd" : (has("disconnect") ? "disconnect.gnd" : "breaker.gnd");
    ["contactor", "compressor", "fan", "blower", "heater", "inducer", "pump", "strips", "fuse"].forEach((id) => {
      if (!has(id)) return;
      add("hot", hotPrev, id + ".hot");
      add("ground", gndPrev, id + ".gnd");
      if (NEUTRAL_SLOTS[id] && id !== "transformer") add("neutral", "src.n", id + ".n");
    });
  }

  function circuit() {
    const groundedHot = hasGroundFault();
    const disc = has("disconnect") && fault !== "open_disc";
    const brk = has("breaker");
    const hotBrk = hotAt("breaker.hot");
    const gndOk = gndAt("disconnect.gnd") || gndAt("ground.gnd") || gndAt("breaker.gnd");
    const line = brk && hotBrk && gndOk && !groundedHot;
    const loadHot = line && disc && hotAt("disconnect.hot");
    const xfmrWired = !has("transformer") || (hotAt("transformer.hot") && neuAt("transformer.n"));
    const xfmr = loadHot && has("transformer") && fault !== "no_xfmr" && xfmrWired;
    const fuseOk = has("fuse") && !fusedBlown && fault !== "blown_fuse";
    const rHot = xfmr && fuseOk;
    const y = rHot && has("thermostat") && callCool;
    const g = rHot && has("thermostat") && callFan;
    const limitOk = fault !== "open_limit";
    const w = rHot && has("thermostat") && callHeat && limitOk;
    const o = rHot && has("thermostat") && callRev && has("solenoid");
    const hpc = has("hpc") && fault !== "open_hpc";
    const lpc = has("lpc") && fault !== "open_lpc";
    const flt = has("float") && fault !== "float_open";
    const path = y && hpc && lpc && flt;
    const lockoutHeld = has("lockout") && fault === "lockout";
    const coil = path && has("contactor") && fault !== "open_coil" && !lockoutHeld;
    const pulled = coil;
    const cap = has("capacitor") && fault !== "open_cap";
    const grounded = fault === "grounded";
    const compHot = !has("compressor") || hotAt("compressor.hot");
    const fanHot = !has("fan") || hotAt("fan.hot");
    const compPower = pulled && loadHot && has("compressor") && !grounded && compHot;
    const compRun = compPower && cap;
    const fanRun = pulled && loadHot && has("fan") && cap && fanHot;
    const heater = has("heater") && loadHot && !pulled && hotAt("heater.hot");
    const inducerRun = loadHot && has("inducer") && callHeat && limitOk && hotAt("inducer.hot") && neuAt("inducer.n");
    const gasOn = w && has("gasvalve") && inducerRun && (has("presssw") ? fault !== "open_press" : true);
    const stripsOn = loadHot && has("strips") && has("sequencer") && w && hotAt("strips.hot");
    const blowerRun = loadHot && has("blower") && (g || w || pulled) && hotAt("blower.hot");
    const rla = compRun ? 13.4 : 0;
    const lraAttempt = compPower && !cap ? 0.2 : 0;
    return {
      line, disc, loadHot, xfmr, rHot, y, g, w, o, hpc, lpc, flt, path, coil, pulled,
      cap, grounded, groundedHot, compPower, compRun, fanRun, heater, inducerRun, gasOn, stripsOn,
      blowerRun, rla, lraAttempt, fuseOk, hotBrk, gndOk, xfmrWired,
    };
  }

  function vacBetween(a, b, c) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("l1", "l2") && c.line) return 241.0;
    if ((pair("l1", "gnd") || pair("l2", "gnd")) && c.line) return 120.6;
    if (pair("load1", "load2")) return c.loadHot ? 240.4 : 0;
    if (pair("t1", "t2")) return c.pulled && c.loadHot ? 239.8 : 0;
    if (pair("r", "c24")) return c.rHot ? 27.2 : 0;
    if (pair("y", "c24")) return c.y ? 26.8 : 0;
    if (pair("g", "c24")) return c.g ? 26.9 : 0;
    if (pair("w", "c24")) return c.w ? 26.7 : 0;
    if (pair("o", "c24")) return c.o ? 26.6 : 0;
    if (pair("coil", "c24")) return c.coil ? 26.4 : 0;
    if (pair("hpc", "c24")) return c.y && c.hpc ? 26.5 : 0;
    if (pair("lpc", "c24")) return c.y && c.hpc && c.lpc ? 26.5 : 0;
    if (pair("limit", "c24")) return c.w ? 26.4 : 0;
    if (pair("compr", "compc") || pair("t1", "compc")) return c.compPower ? 239.2 : 0;
    if (pair("fanlead", "t2")) return c.fanRun ? 238.5 : 0;
    if (pair("striplead", "l2")) return c.stripsOn ? 239.0 : 0;
    if (pair("load1", "l1")) return c.disc ? 0.04 : (c.line ? 240.2 : 0);
    return 0;
  }

  function ohmsBetween(a, b, c) {
    if (c.loadHot || c.rHot) return null;
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("compr", "compc") && has("compressor")) return c.grounded ? 0.2 : 1.8;
    if (pair("comps", "compc") && has("compressor")) return c.grounded ? 0.2 : 2.6;
    if (pair("compr", "comps") && has("compressor")) return 4.3;
    if (pair("compc", "gnd") && has("compressor")) return c.grounded ? 0.4 : 9999;
    if (pair("caph", "capc") && has("capacitor")) return fault === "open_cap" ? 9999 : 0.8;
    if (pair("capf", "capc") && has("capacitor")) return 2.1;
    if (pair("coil", "c24") && has("contactor")) return fault === "open_coil" ? 9999 : 18.4;
    if (pair("hpc", "y") && has("hpc")) return fault === "open_hpc" ? 9999 : 0.3;
    if (pair("lpc", "y") && has("lpc")) return fault === "open_lpc" ? 9999 : 0.3;
    if (pair("limit", "w") && has("limit")) return fault === "open_limit" ? 9999 : 0.3;
    return 9999;
  }

  function capBetween(a, b) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (!has("capacitor") || fault === "open_cap") return 0;
    if (pair("caph", "capc")) return 35.2;
    if (pair("capf", "capc")) return 5.1;
    if (pair("caph", "capf")) return 40.0;
    return 0;
  }

  function ampAt(probe, c) {
    if (probe === "compr" || probe === "t1" || probe === "compc") {
      if (c.compRun) return 13.4;
      if (c.compPower && !c.cap) return 0.3;
      return 0;
    }
    if (probe === "fanlead") return c.fanRun ? 1.1 : 0;
    if (probe === "striplead") return c.stripsOn ? 18.4 : 0;
    if (probe === "l1" || probe === "load1") {
      return (c.compRun ? 13.4 : 0) + (c.fanRun ? 1.1 : 0) + (c.stripsOn ? 18.4 : 0);
    }
    return 0;
  }

  function readMeter() {
    const c = circuit();
    if (mode === "ohm" || mode === "cont" || mode === "cap") {
      if (c.loadHot || c.rHot) {
        fusedBlown = true;
        return { val: "OL", unit: "LIVE", note: "You just ohmed a live circuit. Control fuse is toast. Kill power, replace the 3A, try again." };
      }
    }
    if (mode === "vac") {
      const v = vacBetween(red, black, c);
      return { val: v.toFixed(1), unit: "VAC", note: v > 200 ? "Line voltage." : v > 20 ? "Control voltage." : "Dead — check disconnect, fuse, transformer, or call." };
    }
    if (mode === "aac") {
      const a = ampAt(red, c);
      return { val: a.toFixed(1), unit: "A", note: a > 10 ? "RLA in range for a 3-ton." : a > 0.2 && !c.cap ? "Hum, no start — suspect run cap." : "Clamp one hot leg only." };
    }
    if (mode === "ohm") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "Ω", note: "Lock it out first." };
      if (r >= 9999) return { val: "OL", unit: "Ω", note: "Open circuit." };
      if (r < 1 && fault === "grounded") return { val: r.toFixed(1), unit: "Ω", note: "Winding to ground — bad compressor." };
      return { val: r.toFixed(1), unit: "Ω", note: "Power off reading." };
    }
    if (mode === "cont") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "CONT", note: "Lockout first." };
      return { val: r < 50 ? "BEEP" : "OL", unit: "CONT", note: r < 50 ? "Path closed." : "Open." };
    }
    if (mode === "cap") {
      const u = capBetween(red, black);
      return { val: u ? u.toFixed(1) : "OL", unit: "µF", note: u ? "Discharge the cap, then read HERM–C or FAN–C." : "No cap in circuit or open." };
    }
    return { val: "—. —", unit: "", note: "" };
  }

  function statusLine(c) {
    if (labMode === "defusal" && job) {
      if (boom) return "Callback lost. You cut the live or ran out of time.";
      if (defused) return "Defused. HVAC Jesus is on the roof with the Gauges of God.";
      if (c.compRun) return "Compressor is running — but this callback is still armed. Cut the open, not the live.";
      if (fault === "open_hpc" || fault === "open_lpc" || fault === "float_open") {
        return "Y is calling and a safety is open. Meter the 24V series string.";
      }
      if (fault === "open_cap") return "Contactor in, hum no start. Discharge the cap. Read µF.";
      if (fault === "grounded") return "Lock it out. Ohm C to ground before you touch the 3A.";
      if (fault === "open_coil") return "24V dies at the coil. Don't cut T1/T2 live.";
      if (fault === "open_disc") return "No 240 past the disconnect. Meter load side.";
      if (fault === "open_limit") return "W is up, limit is open. Don't jump the gas valve.";
      if (fault === "blown_fuse") return "3A is open. Find the short on O/B before you slap a new fuse.";
      return job.brief;
    }
    if (c.groundedHot) return "You landed hot on ground. That's a dead short. Pull that wire — black is HOT, green is GROUND.";
    if (!has("breaker")) return "Drop the 2-pole breaker — nothing is live yet.";
    if (!c.hotBrk) return "Drag BLACK onto the breaker H screw. Black is hot.";
    if (!has("disconnect")) return "Line is at the disconnect. Drop it, then drag black from the breaker H to the disconnect H.";
    if (!hotAt("disconnect.hot")) return "Drag BLACK onto the disconnect H screw. Hot doesn't jump by itself.";
    if (!c.gndOk) return "Drag GREEN onto the disconnect G (or the ground lug). Green is ground.";
    if (!has("transformer")) return "No 24V. Drop the control transformer.";
    if (!hotAt("transformer.hot") || !neuAt("transformer.n")) {
      return "Drag BLACK onto transformer H and OFF-WHITE onto N. Neutral is cream so it shows on the white box.";
    }
    if (!has("fuse") || fusedBlown) return "Control fuse missing or blown. Replace the 3A on R.";
    if (!has("thermostat")) return "24V is up. Drop a thermostat and call Y.";
    if (!callCool && !callHeat) return "Stat is in. Turn on COOL (Y) or HEAT (W).";
    if (callCool && (!has("hpc") || !has("lpc") || !has("float"))) return "Y is calling. Series safety: HPC, LPC, and float must be in.";
    if (callCool && !has("contactor")) return "Safeties closed. Drop the contactor.";
    if (has("contactor") && !hotAt("contactor.hot")) return "Run BLACK from the disconnect H to the contactor H.";
    if (callCool && !has("capacitor")) return "Contactor will pull in, compressor will hum. Drop the dual run cap.";
    if (callCool && !has("compressor")) return "Power path is ready. Drop the compressor.";
    if (has("compressor") && !hotAt("compressor.hot")) return "Run BLACK to the compressor H and GREEN to its G. That's the load.";
    if (c.compRun) return "Legal start — compressor and OD fan running. Probe RLA and 24V to prove it.";
    if (c.stripsOn) return "Electric heat is on. Clamp the strip lead.";
    if (c.gasOn) return "Gas valve is open, inducer running. Limit is closed.";
    if (c.grounded) return "Shorted winding — meter C to ground. Bad compressor, not a charge problem.";
    if (c.compPower && !c.cap) return "Hum, no start. Contactor is in — discharge the cap and read µF HERM–C.";
    if (fault === "open_coil") return "Y is through the safeties but the coil is open. Contactor never pulls in.";
    if (c.y && !c.path) return "Y is calling but a safety is open (HPC / LPC / float). Meter the 24V path.";
    if (c.pulled && !c.loadHot) return "Coil in, no 240 on T1/T2. Check disconnect and breaker.";
    if (c.rHot && !c.y && !c.w) return "24V is up. Turn on Y or W.";
    return "Circuit incomplete — finish line, control, and loads. Load a kit, then RUN the wires: black hot, off-white neutral, green ground.";
  }

  function thumb(p) {
    if (p.img) return '<img class="part-img" src="' + p.img + '" alt="" draggable="false" />';
    return '<span class="ico">' + p.icon + "</span>";
  }

  function clearTimer() {
    if (timerId) {
      clearInterval(timerId);
      timerId = 0;
    }
  }

  function loadKit(kitId) {
    const kit = KITS[kitId] || KITS.split;
    activeKit = kitId;
    placed = {};
    kit.parts.forEach((id) => {
      const def = PARTS.find((p) => p.id === id);
      if (def && def.slot) placed[def.slot] = id;
    });
    fusedBlown = fault === "blown_fuse";
    if (labMode !== "defusal") {
      runs = [];
      pending = null;
    }
  }

  function setLabMode(next) {
    labMode = next === "defusal" ? "defusal" : "build";
    clearTimer();
    job = null;
    cutSet = {};
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    timeLeft = 0;
    runs = [];
    pending = null;
    if (labMode === "build") {
      fault = "none";
      fusedBlown = false;
    }
    build();
    wire();
  }

  function startJob(jobId) {
    const found = JOBS.find((j) => j.id === jobId) || JOBS[0];
    job = found;
    labMode = "defusal";
    cutSet = {};
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    fault = found.fault || "none";
    callCool = !!found.cool;
    callFan = !!found.fan;
    callHeat = !!found.heat;
    callRev = !!found.rev;
    fusedBlown = fault === "blown_fuse";
    loadKit(found.kit || "split");
    landFactory();
    timeLeft = found.seconds;
    clearTimer();
    timerId = setInterval(tick, 1000);
    build();
    wire();
    if (onXp) onXp(5);
  }

  function tick() {
    if (defused || boom || labMode !== "defusal" || !job) return;
    timeLeft -= 1;
    paintTimer();
    if (timeLeft <= 0) {
      timeLeft = 0;
      boomOut("time");
    }
  }

  function cutWire(wid) {
    if (!job || defused || boom) return { result: "idle" };
    const w = job.wires.find((x) => x.id === wid);
    if (!w || cutSet[wid]) return { result: "idle" };
    cutSet[wid] = true;
    if (w.cut === "boom") {
      boomOut("cut");
      return { result: "boom" };
    }
    paintDefusal();
    if (w.cut === "win") {
      winOut();
      return { result: "win" };
    }
    return { result: "ok" };
  }

  function replacePart() {
    if (!job || !job.replaceWin || defused || boom) return { result: "idle" };
    placed[job.replaceWin] = job.replaceWin;
    if (job.replaceWin === "fuse") fusedBlown = false;
    fault = "none";
    refreshSlots();
    paintMeter();
    winOut();
    return { result: "win" };
  }

  function boomOut(why) {
    if (defused || boom) return;
    boom = true;
    clearTimer();
    const ov = host.querySelector("#el-boom");
    if (ov) {
      ov.classList.add("show");
      const msg = ov.querySelector(".el-overlay-msg");
      if (msg) {
        msg.textContent = why === "time"
          ? "Clock hit zero. Customer is still hot. That's a callback."
          : "You cut the live. Compressor is a paperweight. That's a callback.";
      }
    }
    paintDefusal();
    paintMeter();
  }

  function winOut() {
    if (defused || boom) return;
    defused = true;
    clearTimer();
    const ov = host.querySelector("#el-win");
    if (ov) ov.classList.add("show");
    paintDefusal();
    paintMeter();
    if (onXp) onXp(80);
    if (onWin && !wonFired) {
      wonFired = true;
      setTimeout(() => {
        onWin({ job: job && job.id, mode: "defusal" });
      }, 900);
    }
  }

  function renderPalette(tab) {
    const box = host.querySelector("#el-items");
    if (!box) return;
    box.innerHTML = "";
    let list = PARTS.filter((p) => p.group === tab);
    if (labMode === "defusal" && job) {
      list = PARTS.filter((p) => p.id === "dmm" || (job.replaceWin && p.slot === job.replaceWin));
    }
    list.forEach((p) => {
      const el = document.createElement("div");
      el.className = "sb-item";
      el.draggable = !!p.slot;
      el.dataset.id = p.id;
      el.innerHTML = thumb(p) + "<div><strong>" + p.name + "</strong><small>" + p.desc + "</small></div>";
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", p.id);
        e.dataTransfer.effectAllowed = "copy";
        if (window.LtDrag && window.LtDrag.setHtml5Image) {
          window.LtDrag.setHtml5Image(e, { html: thumb(p), label: p.name });
        }
      });
      if (window.LtDrag && p.slot) {
        window.LtDrag.bindSource(el, {
          id: p.id,
          html: thumb(p) + "<strong>" + p.name + "</strong>",
          slotSelector: "#el-board .el-slot",
          onHover(slot, id, ev) {
            showLoupe(id, slot, ev);
          },
          onHoverEnd() {
            hideLoupe();
          },
          onDrop(slotId, id) {
            place(slotId, id);
            openZoom(slotId);
          },
        });
      }
      el.onclick = () => {
        if (p.slot && (!placed[p.slot] || (labMode === "defusal" && job && job.replaceWin === p.slot))) {
          place(p.slot, p.id);
        }
      };
      box.appendChild(el);
    });
  }

  function place(slot, id) {
    const def = PARTS.find((p) => p.id === id);
    if (!def || def.slot !== slot) return;
    if (labMode === "defusal" && job) {
      if (job.replaceWin !== slot) return;
    }
    placed[slot] = id;
    if (labMode === "defusal" && job && job.replaceWin === slot && !boom && !defused) {
      if (slot === "fuse") fusedBlown = false;
      fault = "none";
      refreshSlots();
      paintMeter();
      winOut();
      return;
    }
    refreshSlots();
    paintMeter();
    if (labMode === "build") openZoom(slot);
    if (onXp && Object.keys(placed).length === 8) onXp(20);
  }

  function lugButtons(slotId) {
    const lugs = lugsFor(slotId);
    if (!lugs.length) return "";
    return '<div class="el-lugs">' + lugs.map((l) =>
      '<button type="button" class="el-lug ' + l.cls + (pending === slotId + "." + l.id ? " pending" : "") +
      '" data-lug="' + slotId + "." + l.id + '" title="' + l.title + '"' +
      (labMode === "defusal" ? " disabled" : "") + ">" + l.label + "</button>"
    ).join("") + "</div>";
  }

  function bindLugs(root) {
    (root || host).querySelectorAll("[data-lug]").forEach((b) => {
      b.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onLug(b.dataset.lug);
      };
      bindLugWire(b);
    });
  }

  function bindLugWire(el) {
    if (!window.LtDrag || labMode === "defusal" || el.disabled) return;
    if (el.dataset.wireBound) return;
    el.dataset.wireBound = "1";
    const fromId = el.dataset.lug;
    const color = colorFromLug(fromId);
    window.LtDrag.bindSource(el, {
      id: fromId,
      allowButtons: true,
      ghostClass: "el-wire-ghost",
      html: wireGhostHtml(color),
      dropSelector: ".el-zoom-screw",
      onDragStart() {
        spool = colorFromLug(fromId);
        pending = fromId;
        paintLugState();
        highlightWireTargets(spool);
      },
      onHover(target, id) {
        highlightWireTargets(colorFromLug(id), target);
      },
      onHoverEnd() {
        clearWireTargets();
      },
      onDrop(_key, id, dropEl) {
        clearWireTargets();
        const screw = dropEl && dropEl.closest ? dropEl.closest(".el-zoom-screw") : dropEl;
        const lug = screw && screw.dataset.lug;
        dropWireOnLug(colorFromLug(id), lug, id);
      },
    });
  }

  function onLug(id) {
    if (labMode === "defusal") return;
    const slot = id.split(".")[0];
    if (!zoomSlot || zoomSlot !== slot) {
      openZoom(slot === "src" ? "src" : slot);
      pending = id;
      paintLugState();
      syncZoom();
      return;
    }
    if (!pending) {
      pending = id;
      paintLugState();
      syncZoom();
      return;
    }
    if (pending === id) {
      pending = null;
      paintLugState();
      syncZoom();
      return;
    }
    landWire(spool, pending, id);
    pending = null;
    paintRuns();
    paintMeter();
    syncZoom();
    if (onXp) onXp(2);
  }

  function paintLugState() {
    if (!host) return;
    host.querySelectorAll("[data-lug]").forEach((b) => {
      b.classList.toggle("pending", b.dataset.lug === pending);
    });
    host.querySelectorAll(".el-spool").forEach((b) => {
      b.classList.toggle("active", b.dataset.spool === spool);
    });
  }

  function srcLugs() {
    return [
      { id: "hot", cls: "hot", label: "H", title: "HOT · black" },
      { id: "n", cls: "neu", label: "N", title: "NEUTRAL · off-white" },
      { id: "gnd", cls: "gnd", label: "G", title: "GROUND · green" },
    ];
  }

  function termsFor(slotId) {
    const lugs = slotId === "src" ? srcLugs() : lugsFor(slotId);
    const n = lugs.length;
    return lugs.map((l, i) => ({
      ...l,
      x: n <= 1 ? 50 : Math.round(18 + (64 * i) / Math.max(1, n - 1)),
      y: n === 1 ? 72 : 80,
    }));
  }

  function lugId(slotId, termId) {
    return (slotId === "src" ? "src." : slotId + ".") + termId;
  }

  function wireOnLug(lug, color) {
    return runs.some((r) => r.color === color && (r.a === lug || r.b === lug));
  }

  function missingTerms(slotId) {
    return termsFor(slotId).filter((t) => {
      const color = t.id === "hot" ? "hot" : t.id === "n" ? "neutral" : "ground";
      return !wireOnLug(lugId(slotId, t.id), color);
    });
  }

  function nextNeedySlot() {
    const order = ["src"].concat(SLOTS.map((s) => s.id));
    const start = Math.max(0, order.indexOf(zoomSlot));
    for (let i = 1; i <= order.length; i++) {
      const id = order[(start + i) % order.length];
      if (id !== "src" && !placed[id]) continue;
      if (!termsFor(id).length) continue;
      if (missingTerms(id).length) return id;
    }
    return null;
  }

  function slotInfo(slotId) {
    if (slotId === "src") {
      return {
        name: "LINE IN",
        desc: "Service feed. Black is hot, off-white is neutral, green is ground.",
        img: null,
        icon: "⚡",
      };
    }
    const cid = placed[slotId];
    const def = PARTS.find((p) => p.id === cid) || PARTS.find((p) => p.slot === slotId);
    const s = SLOTS.find((x) => x.id === slotId);
    return {
      name: def ? def.name : (s ? s.label : slotId),
      desc: def ? def.desc : "Land black, off-white, and green on this device.",
      img: def && def.img,
      icon: def ? def.icon : "•",
    };
  }

  function zoomScrewsHtml(slotId) {
    const terms = termsFor(slotId);
    if (!terms.length) {
      return '<p class="el-zoom-empty">24V device — no line screws. Wire this from the thermostat / transformer.</p>';
    }
    return terms.map((t) => {
      const id = lugId(slotId, t.id);
      const color = t.id === "hot" ? "hot" : t.id === "n" ? "neutral" : "ground";
      const on = wireOnLug(id, color);
      return (
        '<button type="button" class="el-zoom-screw el-lug ' + t.cls +
        (on ? " wired wired-" + (color === "neutral" ? "neu" : color === "ground" ? "gnd" : "hot") : "") +
        (pending === id ? " pending" : "") +
        '" data-lug="' + id + '" data-need="' + color + '" title="' + t.title +
        '" style="left:' + t.x + '%;top:' + t.y + '%">' +
        "<b>" + t.label + "</b><small>" + t.title.split("·")[0].trim() + "</small></button>"
      );
    }).join("");
  }

  function paintZoomNeed() {
    const box = host && host.querySelector("#el-zoom-need");
    const hint = host && host.querySelector("#el-zoom-hint");
    const nextBtn = host && host.querySelector("#el-zoom-next");
    if (!box || !zoomSlot) return;
    const terms = termsFor(zoomSlot);
    if (!terms.length) {
      box.innerHTML = "";
      if (hint) hint.textContent = "This one lives on 24V. Close and grab a line-voltage device.";
      if (nextBtn) nextBtn.hidden = !nextNeedySlot();
      return;
    }
    box.innerHTML = terms.map((t) => {
      const color = t.id === "hot" ? "hot" : t.id === "n" ? "neutral" : "ground";
      const w = WIRE[color];
      const on = wireOnLug(lugId(zoomSlot, t.id), color);
      return '<li class="' + (on ? "ok" : "miss") + '"><i style="background:' + w.fill + ";border-color:" + w.stroke + '"></i>' +
        (on ? "Landed" : "Need") + " " + w.code + " → " + t.label + "</li>";
    }).join("");
    const miss = missingTerms(zoomSlot);
    if (hint) {
      if (!miss.length) hint.textContent = "All screws landed on this device. Next device, or close.";
      else {
        const w = WIRE[spool] || WIRE.hot;
        hint.textContent = "Drag " + w.code + " onto the matching screw on this close-up.";
      }
    }
    if (nextBtn) {
      const n = nextNeedySlot();
      nextBtn.hidden = !n;
      nextBtn.textContent = n ? "Next device →" : "Next device";
    }
  }

  function paintZoomSvg() {
    const svg = host && host.querySelector("#el-zoom-svg");
    if (!svg || !zoomSlot) return;
    const terms = termsFor(zoomSlot);
    const paths = terms.map((t, i) => {
      const color = t.id === "hot" ? "hot" : t.id === "n" ? "neutral" : "ground";
      if (!wireOnLug(lugId(zoomSlot, t.id), color)) return "";
      const w = WIRE[color];
      const sx = 16 + i * 34;
      return '<path d="M ' + sx + ' 2 C ' + sx + " " + (t.y * 0.45) + ", " + t.x + " " + (t.y * 0.55) + ", " + t.x + " " + t.y +
        '" fill="none" stroke="' + w.fill + '" stroke-width="5" stroke-linecap="round"/>' +
        '<circle cx="' + t.x + '" cy="' + t.y + '" r="3.2" fill="' + w.fill + '" stroke="' + w.stroke + '" stroke-width="0.8"/>';
    }).join("");
    svg.innerHTML = paths;
  }

  function syncZoom() {
    if (!host || !zoomSlot) return;
    const z = host.querySelector("#el-zoom");
    if (!z || !z.classList.contains("show")) return;
    z.querySelectorAll(".el-zoom-screw").forEach((b) => {
      const lug = b.dataset.lug;
      const color = b.dataset.need;
      const on = wireOnLug(lug, color);
      b.classList.toggle("wired", on);
      b.classList.toggle("wired-hot", on && color === "hot");
      b.classList.toggle("wired-neu", on && color === "neutral");
      b.classList.toggle("wired-gnd", on && color === "ground");
      b.classList.toggle("pending", pending === lug);
    });
    paintZoomNeed();
    paintZoomSvg();
    paintLugState();
  }

  function openZoom(slotId) {
    if (!host || labMode === "defusal" || !slotId) return;
    if (slotId !== "src" && !placed[slotId]) return;
    zoomSlot = slotId;
    const z = host.querySelector("#el-zoom");
    if (!z) return;
    const info = slotInfo(slotId);
    const img = z.querySelector("#el-zoom-img");
    const ico = z.querySelector("#el-zoom-ico");
    if (info.img) {
      img.src = info.img;
      img.hidden = false;
      ico.hidden = true;
    } else {
      img.removeAttribute("src");
      img.hidden = true;
      ico.hidden = false;
      ico.textContent = info.icon;
    }
    z.querySelector("#el-zoom-name").textContent = info.name;
    z.querySelector("#el-zoom-desc").textContent = info.desc || "Drag the matching color onto each screw on this close-up.";
    const screws = z.querySelector("#el-zoom-screws");
    if (screws) screws.innerHTML = zoomScrewsHtml(slotId);
    bindLugs(z);
    bindWireDrags();
    z.classList.add("show");
    paintZoomNeed();
    paintZoomSvg();
    paintLugState();
  }

  function closeZoom() {
    zoomSlot = null;
    const z = host && host.querySelector("#el-zoom");
    if (z) z.classList.remove("show");
  }

  function showLoupe(partId, slotEl, ev) {
    const loupe = host && host.querySelector("#el-loupe");
    if (!loupe) return;
    const p = PARTS.find((x) => x.id === partId);
    const slotId = slotEl && slotEl.dataset.slot;
    const occupying = slotId && placed[slotId];
    const show = occupying ? PARTS.find((x) => x.id === occupying) || p : p;
    const shot = loupe.querySelector(".el-loupe-shot");
    if (show && show.img) {
      shot.innerHTML = '<img src="' + show.img + '" alt="" />';
    } else {
      shot.innerHTML = '<span class="ico">' + ((show && show.icon) || "•") + "</span>";
    }
    const s = SLOTS.find((x) => x.id === slotId);
    let label = show ? show.name : (p ? p.name : "Part");
    if (occupying) label = "Wiring · " + label;
    else if (s) label = label + " → " + s.label;
    loupe.querySelector(".el-loupe-name").textContent = label;
    loupe.classList.add("on");
    if (ev) {
      const w = 188;
      const x = ev.clientX + 28 + w > window.innerWidth ? ev.clientX - w - 16 : ev.clientX + 28;
      const y = Math.max(8, ev.clientY - 150);
      loupe.style.left = x + "px";
      loupe.style.top = y + "px";
    }
  }

  function hideLoupe() {
    const loupe = host && host.querySelector("#el-loupe");
    if (loupe) loupe.classList.remove("on");
  }

  function onKeyZoom(e) {
    if (e.key === "Escape") closeZoom();
  }

  function refreshSlots() {
    host.querySelectorAll(".el-slot").forEach((el) => {
      const id = el.dataset.slot;
      const cid = placed[id];
      el.classList.toggle("filled", !!cid);
      if (labMode === "defusal" && !cid) {
        el.style.display = "none";
        return;
      }
      el.style.display = "";
      const canRm = labMode !== "defusal" || (job && job.replaceWin === id);
      if (cid) {
        const def = PARTS.find((p) => p.id === cid) || { name: cid, icon: "•" };
        el.innerHTML = thumb(def) + "<strong>" + def.name + "</strong>" +
          (canRm ? "<button class='rm' data-rm='" + id + "'>×</button>" : "") +
          lugButtons(id);
        el.onclick = (e) => {
          if (e.target.closest(".rm, [data-lug]")) return;
          openZoom(id);
        };
      } else {
        const s = SLOTS.find((x) => x.id === id);
        el.innerHTML = "<span class='empty'>Drop " + (s ? s.label : id) + "</span>";
        el.onclick = null;
      }
    });
    host.querySelectorAll(".rm").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        if (labMode === "defusal" && job && job.replaceWin !== b.dataset.rm) return;
        const gone = b.dataset.rm;
        delete placed[gone];
        runs = runs.filter((r) => r.a.indexOf(gone + ".") !== 0 && r.b.indexOf(gone + ".") !== 0);
        refreshSlots();
        paintMeter();
      };
    });
    bindLugs();
    requestAnimationFrame(paintRuns);
  }

  function paintRuns() {
    const svg = host && host.querySelector("#el-runs");
    const inner = host && host.querySelector("#el-board-inner");
    if (!svg || !inner) return;
    const box = inner.getBoundingClientRect();
    const w = Math.max(1, inner.clientWidth);
    const h = Math.max(1, inner.clientHeight);
    svg.setAttribute("viewBox", "0 0 " + w + " " + h);
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    const pos = (lid) => {
      const el = host.querySelector('#el-board [data-lug="' + lid + '"]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
    };
    svg.innerHTML = runs.map((r) => {
      const a = pos(r.a);
      const b = pos(r.b);
      if (!a || !b) return "";
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2 + 22;
      const col = WIRE[r.color] || WIRE.hot;
      return '<path class="el-run-hit" data-run="' + r.id + '" d="M ' + a.x.toFixed(1) + " " + a.y.toFixed(1) +
        " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1) +
        '" fill="none" stroke="' + col.stroke + '" stroke-width="8" stroke-linecap="round"></path>' +
        '<path class="el-run-core" data-run="' + r.id + '" d="M ' + a.x.toFixed(1) + " " + a.y.toFixed(1) +
        " Q " + mx.toFixed(1) + " " + my.toFixed(1) + " " + b.x.toFixed(1) + " " + b.y.toFixed(1) +
        '" fill="none" stroke="' + col.fill + '" stroke-width="4.5" stroke-linecap="round"></path>';
    }).join("");
    svg.querySelectorAll("[data-run]").forEach((p) => {
      p.addEventListener("click", (e) => {
        e.stopPropagation();
        if (labMode === "defusal") return;
        pullRun(p.getAttribute("data-run"));
      });
    });
  }

  function paintSchematic() {
    paintRuns();
  }

  function paintTimer() {
    const el = host.querySelector("#el-timer");
    if (!el) return;
    const s = Math.max(0, timeLeft);
    const mm = String(Math.floor(s / 60)).padStart(1, "0");
    const ss = String(s % 60).padStart(2, "0");
    el.textContent = mm + ":" + ss;
    el.classList.toggle("panic", s <= 20 && !defused && !boom);
    el.classList.toggle("dead", boom || s <= 0);
    el.classList.toggle("won", defused);
  }

  function paintDefusal() {
    if (labMode !== "defusal") return;
    paintTimer();
    const bar = host.querySelector("#el-wires");
    if (bar && job) {
      bar.querySelectorAll(".el-wire-btn").forEach((b) => {
        const id = b.dataset.wire;
        b.classList.toggle("cut", !!cutSet[id]);
        b.disabled = !!cutSet[id] || defused || boom;
      });
    }
    const st = host.querySelector("#el-defuse-state");
    if (st) {
      st.textContent = defused ? "DEFUSED" : boom ? "CALLBACK" : "ARMED";
      st.className = "el-defuse-state" + (defused ? " ok" : boom ? " bad" : "");
    }
  }

  function paintMeter() {
    if (!host) return;
    const c = circuit();
    const r = readMeter();
    const lcd = host.querySelector("#el-lcd");
    if (!lcd) return;
    lcd.textContent = r.val;
    host.querySelector("#el-unit").textContent = r.unit;
    host.querySelector("#el-note").textContent = r.note;
    host.querySelector("#el-status").textContent = statusLine(c);
    host.querySelector("#el-run").classList.toggle("on", c.compRun);
    host.querySelector("#el-24").classList.toggle("on", c.rHot);
    host.querySelector("#el-coil").classList.toggle("on", c.pulled);
    host.querySelector("#el-y").classList.toggle("on", c.y);
    const wLamp = host.querySelector("#el-w");
    if (wLamp) wLamp.classList.toggle("on", c.w);
    const oLamp = host.querySelector("#el-o");
    if (oLamp) oLamp.classList.toggle("on", c.o);
    const chips = [];
    chips.push(c.loadHot ? "240 VAC load" : "load dead");
    chips.push(c.rHot ? "27 VAC R–C" : "no 24V");
    chips.push(c.pulled ? "contactor IN" : "contactor OUT");
    chips.push(c.compRun ? "comp RUN " + c.rla.toFixed(1) + " A" : "comp OFF");
    if (c.stripsOn) chips.push("strips ON");
    if (c.gasOn) chips.push("gas valve OPEN");
    if (c.groundedHot) chips.push("DEAD SHORT");
    host.querySelector("#el-chips").textContent = chips.join(" · ");
    const redn = PROBES.find((p) => p.id === red);
    const blkn = PROBES.find((p) => p.id === black);
    host.querySelector("#el-redn").textContent = redn ? redn.label : red;
    host.querySelector("#el-blkn").textContent = blkn ? blkn.label : black;
    paintSchematic();
    paintDefusal();
  }

  function sourceBarMarkup() {
    return `<div class="el-source" id="el-source">
      <span class="el-source-kicker">LINE IN</span>
      <button type="button" class="el-lug hot" data-lug="src.hot" title="Hot · black" ${labMode === "defusal" ? "disabled" : ""}>H</button>
      <span class="el-source-name">Hot · black</span>
      <button type="button" class="el-lug neu" data-lug="src.n" title="Neutral · off-white" ${labMode === "defusal" ? "disabled" : ""}>N</button>
      <span class="el-source-name">Neutral · off-white</span>
      <button type="button" class="el-lug gnd" data-lug="src.gnd" title="Ground · green" ${labMode === "defusal" ? "disabled" : ""}>G</button>
      <span class="el-source-name">Ground · green</span>
    </div>`;
  }

  function schematicMarkup() {
    return `<svg id="el-runs" class="el-runs" aria-hidden="true"></svg>`;
  }

  function jobPickerMarkup() {
    return `<div class="el-jobs" id="el-jobs">
      <p class="el-jobs-kicker">Callback bomb · known HVAC faults · meter first, cut the OPEN</p>
      <p class="el-jobs-note">These are the callbacks that blow up a Saturday — not movie wiring. Wrong cut = dead compressor, flooded house, or a fried board.</p>
      ${JOBS.map((j) => `<button type="button" class="el-job-card" data-job="${j.id}">
        <span class="el-job-time">${j.seconds}s</span>
        <strong>${j.name}</strong>
        <small>${KITS[j.kit] ? KITS[j.kit].name : j.kit}</small>
        <p>${j.brief}</p>
      </button>`).join("")}
    </div>`;
  }

  function defusalBarMarkup() {
    if (!job) return "";
    const replaceLabel = job.replaceWin
      ? (PARTS.find((p) => p.slot === job.replaceWin || p.id === job.replaceWin) || { name: job.replaceWin }).name
      : null;
    return `<div class="el-defuse-bar" id="el-defuse-bar">
      <div class="el-defuse-top">
        <div class="el-timer ${timeLeft <= 20 ? "panic" : ""}" id="el-timer">${String(Math.floor(timeLeft / 60))}:${String(timeLeft % 60).padStart(2, "0")}</div>
        <div>
          <p class="eyebrow">Callback bomb</p>
          <strong id="el-job-name">${job.name}</strong>
          <span class="el-defuse-state" id="el-defuse-state">ARMED</span>
        </div>
      </div>
      <p class="el-job-brief" id="el-job-brief">${job.brief}</p>
      <div class="el-wires" id="el-wires">
        ${job.wires.map((w) => `<button type="button" class="el-wire-btn" data-wire="${w.id}" style="--wire:${w.color}">
          <i></i><span>${w.label}</span>
        </button>`).join("")}
      </div>
      ${replaceLabel ? `<button type="button" class="btn primary" id="el-replace">Replace ${replaceLabel} (known-good)</button>` : ""}
    </div>`;
  }

  function spoolBarMarkup() {
    if (labMode !== "build") return "";
    return `<div class="el-spools" role="group" aria-label="Wire spool">
      <button type="button" class="el-spool hot ${spool === "hot" ? "active" : ""}" data-spool="hot"><i></i> Hot · black</button>
      <button type="button" class="el-spool neu ${spool === "neutral" ? "active" : ""}" data-spool="neutral"><i></i> Neutral · off-white</button>
      <button type="button" class="el-spool gnd ${spool === "ground" ? "active" : ""}" data-spool="ground"><i></i> Ground · green</button>
      <button type="button" class="btn" id="el-pull">Pull last</button>
    </div>`;
  }

  function build() {
    const kitOpts = Object.keys(KITS).map((k) =>
      `<option value="${k}"${k === activeKit ? " selected" : ""}>${KITS[k].name}</option>`
    ).join("");
    const showPicker = labMode === "defusal" && !job;
    host.innerHTML = `
      <div class="el-layout ${labMode === "defusal" ? "defusal" : "build"}">
        <aside class="sb-palette">
          <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
            <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
            <div class="brand-word"><strong style="font-size:13px">${(window.LtBrand && window.LtBrand.org) || "Lincoln Tech"}</strong><span>${labMode === "defusal" ? "Callback bomb · meter first" : "Electrical box · run the wires"}</span></div>
          </div>
          <div class="el-modes" role="tablist">
            <button type="button" class="el-mode-btn ${labMode === "build" ? "active" : ""}" data-lab="build">Build</button>
            <button type="button" class="el-mode-btn ${labMode === "defusal" ? "active" : ""}" data-lab="defusal" id="el-mode-defuse">Callback bomb</button>
          </div>
          <p class="eyebrow">${labMode === "defusal" ? "Defusal tray" : "Component tray"}</p>
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="line">Line 240</button>
            <button class="sb-tab" data-tab="control">Control 24</button>
            <button class="sb-tab" data-tab="loads">Loads</button>
            <button class="sb-tab" data-tab="tools">Tools</button>
          </div>
          <div id="el-items" class="sb-items"></div>
          <p class="sb-hint">${labMode === "defusal"
            ? "Meter the live circuit. Cut the OPEN. Replace the bad part if you have it. Never cut R or a winding."
            : "Drop a part, then tap it. Wiring happens on the close-up — drag black / off-white / green onto the screws."}</p>
          <div class="hub-chip" style="margin-top:10px;max-width:none">
            <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
            <div><strong>Professor HUB</strong><p>${labMode === "defusal"
              ? "This is a callback bomb — the Saturday kind. Meter Y through the safeties. Cut the open. Leave the live alone."
              : "Tap a device to zoom. Drag black onto H, off-white onto N, green onto G — on that close-up, not the tiny box."}</p></div>
          </div>
        </aside>
        <main class="el-main">
          <header class="sb-toolbar">
            ${labMode === "build" ? `
            <label>Kit
              <select id="el-kit-sel">${kitOpts}</select>
            </label>
            <label>Fault
              <select id="el-fault">
                <option value="none">Healthy circuit</option>
                <option value="open_cap">Open run capacitor</option>
                <option value="open_coil">Open contactor coil</option>
                <option value="open_hpc">Open high-pressure switch</option>
                <option value="open_lpc">Open low-pressure switch</option>
                <option value="float_open">Float switch open (full pan)</option>
                <option value="open_disc">Disconnect open</option>
                <option value="no_xfmr">Open transformer</option>
                <option value="blown_fuse">Blown 3A fuse</option>
                <option value="grounded">Compressor winding to ground</option>
                <option value="open_limit">Open high-limit</option>
                <option value="lockout">Lockout relay held</option>
              </select>
            </label>
            <label class="el-tog"><input type="checkbox" id="el-cool"${callCool ? " checked" : ""} /> Y — Cool</label>
            <label class="el-tog"><input type="checkbox" id="el-fan"${callFan ? " checked" : ""} /> G — Fan</label>
            <label class="el-tog"><input type="checkbox" id="el-heat"${callHeat ? " checked" : ""} /> W — Heat</label>
            <label class="el-tog"><input type="checkbox" id="el-rev"${callRev ? " checked" : ""} /> O/B — RV</label>
            <button class="btn" id="el-kit">Load kit</button>
            <button class="btn" id="el-clear">Clear</button>
            ` : `
            <button class="btn" id="el-jobs-back" ${job ? "" : "style='display:none'"}>All callbacks</button>
            `}
            <button class="btn" id="el-hub">Shop floor</button>
          </header>
          ${labMode === "build" ? spoolBarMarkup() : ""}
          ${showPicker ? jobPickerMarkup() : `
          <div class="el-board" id="el-board">
            <div class="el-board-inner" id="el-board-inner">
            ${sourceBarMarkup()}
            ${schematicMarkup()}
            </div>
          </div>
          ${labMode === "defusal" ? defusalBarMarkup() : ""}
          <p class="el-status" id="el-status"></p>
          <p class="el-chips" id="el-chips"></p>`}
        </main>
        <aside class="el-meter">
          <p class="eyebrow">Digital multimeter</p>
          <img src="parts/dmm.png" alt="DMM" class="el-dmm-img" />
          <div class="dmm-lcd el-lcd"><span id="el-lcd">241.0</span><small id="el-unit">VAC</small></div>
          <div class="el-leads">
            <div><i class="red"></i> RED <b id="el-redn">L1 (line)</b></div>
            <div><i class="blk"></i> COM <b id="el-blkn">L2 (line)</b></div>
          </div>
          <label>Function
            <select id="el-mode">
              <option value="vac">VAC</option>
              <option value="aac">AAC (clamp)</option>
              <option value="ohm">OHMS (lockout)</option>
              <option value="cont">Continuity</option>
              <option value="cap">CAPACITANCE µF</option>
            </select>
          </label>
          <p class="eyebrow" style="margin-top:10px">Probe points — click sets RED, shift-click sets COM</p>
          <div id="el-probes" class="el-probes"></div>
          <p class="dmm-note" id="el-note"></p>
          <div class="el-lamps">
            <span id="el-24">24V</span>
            <span id="el-y">Y</span>
            <span id="el-w">W</span>
            <span id="el-o">O/B</span>
            <span id="el-coil">COIL</span>
            <span id="el-run">COMP</span>
          </div>
        </aside>
        <div class="el-overlay" id="el-boom">
          <div class="el-overlay-card bad">
            <p class="eyebrow">Callback bomb</p>
            <h2>CALLBACK</h2>
            <p class="el-overlay-msg">You cut the live. That's a callback.</p>
            <div class="row" style="gap:8px;justify-content:center;margin-top:12px">
              <button type="button" class="btn primary" id="el-retry">Retry this call</button>
              <button type="button" class="btn" id="el-boom-jobs">All callbacks</button>
            </div>
          </div>
        </div>
        <div class="el-overlay" id="el-win">
          <div class="el-overlay-card ok">
            <img src="jesus.png" alt="HVAC Jesus" class="el-win-jesus" />
            <p class="eyebrow">Defused</p>
            <h2>GAUGES OF GOD</h2>
            <p class="el-overlay-msg">You cut the open, not the live. HVAC Jesus is on the roof.</p>
          </div>
        </div>
        <div class="el-zoom" id="el-zoom">
          <div class="el-zoom-card">
            <button type="button" class="el-zoom-close" id="el-zoom-close" aria-label="Close close-up">×</button>
            <p class="eyebrow">Wire this device</p>
            <strong id="el-zoom-name">Device</strong>
            <p id="el-zoom-desc"></p>
            <div class="el-zoom-work" id="el-zoom-work">
              <img id="el-zoom-img" alt="" hidden />
              <span id="el-zoom-ico" class="ico" hidden></span>
              <svg id="el-zoom-svg" class="el-zoom-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>
              <div id="el-zoom-screws" class="el-zoom-screws"></div>
            </div>
            <div class="el-spools el-zoom-spools" id="el-zoom-spools">
              <button type="button" class="el-spool hot" data-spool="hot"><i></i> Hot · black</button>
              <button type="button" class="el-spool neu" data-spool="neutral"><i></i> Neutral · off-white</button>
              <button type="button" class="el-spool gnd" data-spool="ground"><i></i> Ground · green</button>
            </div>
            <ul class="el-zoom-need" id="el-zoom-need"></ul>
            <p class="el-zoom-hint" id="el-zoom-hint">Drag the matching color onto each screw on this close-up.</p>
            <button type="button" class="btn primary" id="el-zoom-next">Next device →</button>
          </div>
        </div>
        <div class="el-loupe" id="el-loupe" aria-hidden="true">
          <div class="el-loupe-shot"></div>
          <strong class="el-loupe-name"></strong>
        </div>
      </div>`;
    const board = host.querySelector("#el-board");
    const inner = host.querySelector("#el-board-inner") || board;
    if (inner && board) {
      SLOTS.forEach((s) => {
        const el = document.createElement("div");
        el.className = "el-slot";
        el.dataset.slot = s.id;
        el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("over"); });
        el.addEventListener("dragleave", () => el.classList.remove("over"));
        el.addEventListener("drop", (e) => {
          e.preventDefault();
          el.classList.remove("over");
          place(s.id, e.dataTransfer.getData("text/plain"));
        });
        inner.appendChild(el);
      });
    }
    const pb = host.querySelector("#el-probes");
    if (pb) {
      PROBES.forEach((p) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "el-probe";
        b.textContent = p.label;
        b.onclick = (e) => {
          if (e.shiftKey) black = p.id;
          else red = p.id;
          probed = true;
          paintMeter();
        };
        pb.appendChild(b);
      });
    }
    if (board) {
      refreshSlots();
      renderPalette("line");
      paintMeter();
    } else {
      renderPalette("line");
    }
    bindLugs();
    if (resizeObs) {
      resizeObs.disconnect();
      resizeObs = null;
    }
    if (inner && typeof ResizeObserver !== "undefined") {
      resizeObs = new ResizeObserver(() => paintRuns());
      resizeObs.observe(inner);
    }
  }

  function wire() {
    host.querySelectorAll(".el-mode-btn").forEach((t) => {
      t.onclick = () => setLabMode(t.dataset.lab);
    });
    host.querySelectorAll(".sb-tab").forEach((t) => {
      t.onclick = () => {
        host.querySelectorAll(".sb-tab").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        renderPalette(t.dataset.tab);
      };
    });
    host.querySelectorAll(".el-spool").forEach((b) => {
      b.onclick = () => {
        spool = b.dataset.spool;
        pending = null;
        paintLugState();
        if (zoomSlot) syncZoom();
      };
    });
    bindWireDrags();
    const pull = host.querySelector("#el-pull");
    if (pull) {
      pull.onclick = () => {
        if (!runs.length) return;
        runs.pop();
        paintRuns();
        paintMeter();
      };
    }
    const modeEl = host.querySelector("#el-mode");
    if (modeEl) modeEl.onchange = (e) => { mode = e.target.value; paintMeter(); };
    const faultEl = host.querySelector("#el-fault");
    if (faultEl) {
      faultEl.value = fault;
      faultEl.onchange = (e) => {
        fault = e.target.value;
        fusedBlown = fault === "blown_fuse";
        paintMeter();
      };
    }
    const cool = host.querySelector("#el-cool");
    if (cool) cool.onchange = (e) => { callCool = e.target.checked; paintMeter(); };
    const fan = host.querySelector("#el-fan");
    if (fan) fan.onchange = (e) => { callFan = e.target.checked; paintMeter(); };
    const heat = host.querySelector("#el-heat");
    if (heat) heat.onchange = (e) => { callHeat = e.target.checked; paintMeter(); };
    const rev = host.querySelector("#el-rev");
    if (rev) rev.onchange = (e) => { callRev = e.target.checked; paintMeter(); };
    const clr = host.querySelector("#el-clear");
    if (clr) {
      clr.onclick = () => {
        placed = {};
        runs = [];
        pending = null;
        callCool = false;
        callFan = false;
        callHeat = false;
        callRev = false;
        fusedBlown = false;
        fault = "none";
        const c1 = host.querySelector("#el-cool");
        const c2 = host.querySelector("#el-fan");
        const c3 = host.querySelector("#el-heat");
        const c4 = host.querySelector("#el-rev");
        if (c1) c1.checked = false;
        if (c2) c2.checked = false;
        if (c3) c3.checked = false;
        if (c4) c4.checked = false;
        if (faultEl) faultEl.value = "none";
        closeZoom();
        refreshSlots();
        paintMeter();
      };
    }
    const kitBtn = host.querySelector("#el-kit");
    if (kitBtn) {
      kitBtn.onclick = () => {
        const sel = host.querySelector("#el-kit-sel");
        loadKit(sel ? sel.value : "split");
        closeZoom();
        refreshSlots();
        paintMeter();
        if (onXp) onXp(15);
      };
    }
    host.querySelectorAll(".el-job-card").forEach((b) => {
      b.onclick = () => startJob(b.dataset.job);
    });
    host.querySelectorAll(".el-wire-btn").forEach((b) => {
      b.onclick = () => cutWire(b.dataset.wire);
    });
    const rep = host.querySelector("#el-replace");
    if (rep) rep.onclick = () => replacePart();
    const retry = host.querySelector("#el-retry");
    if (retry) retry.onclick = () => { if (job) startJob(job.id); };
    const boomJobs = host.querySelector("#el-boom-jobs");
    if (boomJobs) boomJobs.onclick = () => setLabMode("defusal");
    const jobsBack = host.querySelector("#el-jobs-back");
    if (jobsBack) jobsBack.onclick = () => setLabMode("defusal");
    const zClose = host.querySelector("#el-zoom-close");
    if (zClose) zClose.onclick = (e) => { e.stopPropagation(); closeZoom(); };
    const zNext = host.querySelector("#el-zoom-next");
    if (zNext) {
      zNext.onclick = (e) => {
        e.stopPropagation();
        const n = nextNeedySlot();
        if (n) openZoom(n);
        else closeZoom();
      };
    }
    const z = host.querySelector("#el-zoom");
    if (z) {
      z.onclick = (e) => {
        if (e.target === z) closeZoom();
      };
    }
    const src = host.querySelector("#el-source");
    if (src) {
      src.addEventListener("click", (e) => {
        if (e.target.closest("[data-lug]")) return;
        openZoom("src");
      });
    }
  }

  function start(root, opts) {
    host = root;
    onXp = opts && opts.onXp;
    onWin = opts && opts.onWin;
    placed = {};
    callCool = false;
    callFan = false;
    callHeat = false;
    callRev = false;
    fault = "none";
    fusedBlown = false;
    mode = "vac";
    red = "l1";
    black = "l2";
    labMode = opts && opts.defuse ? "defusal" : "build";
    job = null;
    cutSet = {};
    timeLeft = 0;
    defused = false;
    boom = false;
    wonFired = false;
    probed = false;
    activeKit = "split";
    runs = [];
    spool = "hot";
    pending = null;
    zoomSlot = null;
    clearTimer();
    document.removeEventListener("keydown", onKeyZoom);
    document.addEventListener("keydown", onKeyZoom);
    build();
    wire();
    return {
      stop() {
        clearTimer();
        closeZoom();
        hideLoupe();
        document.removeEventListener("keydown", onKeyZoom);
        if (resizeObs) {
          resizeObs.disconnect();
          resizeObs = null;
        }
      },
      getHubBtn() { return host.querySelector("#el-hub"); },
      startJob,
      cutWire,
      replacePart,
      landWire,
      landFactory,
      dropWireOnLug,
      getState() {
        return {
          labMode,
          job: job && job.id,
          timeLeft,
          defused,
          boom,
          fault,
          cutSet: Object.assign({}, cutSet),
          spool,
          zoomSlot,
          runs: runs.map((r) => ({ id: r.id, color: r.color, a: r.a, b: r.b })),
        };
      },
    };
  }

  global.ElectricalLab = { start, JOBS, KITS, PARTS, WIRE };
})(window);
