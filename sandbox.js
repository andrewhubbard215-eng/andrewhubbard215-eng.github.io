/* Lincoln Tech HVAC Allstars — Refrigeration Cycle Sandbox */
(function (global) {
  "use strict";

  // ---- P/T charts (psig, sat °F) simplified for training ----
  const PT = {
    "R-410A": [
      [-40, 10.8], [-30, 17.8], [-20, 26.2], [-15, 31.2], [-10, 36.8],
      [-5, 42.9], [0, 49.7], [5, 57.1], [10, 65.2], [15, 74.1],
      [20, 83.6], [25, 94.0], [30, 105.2], [35, 117.3], [40, 130.3],
      [45, 144.4], [50, 159.4], [55, 175.6], [60, 192.9], [65, 211.4],
      [70, 231.2], [75, 252.3], [80, 274.8], [85, 298.8], [90, 324.3],
      [95, 351.4], [100, 380.2], [105, 410.8], [110, 443.2], [115, 477.5],
      [120, 513.8],
    ],
    "R-22": [
      [-40, 0.5], [-30, 4.9], [-20, 10.1], [-10, 16.5], [0, 24.0],
      [5, 28.3], [10, 32.8], [15, 37.7], [20, 43.0], [25, 48.8],
      [30, 54.9], [35, 61.5], [40, 68.5], [45, 76.0], [50, 84.0],
      [55, 92.6], [60, 101.6], [65, 111.2], [70, 121.4], [75, 132.2],
      [80, 143.6], [85, 155.7], [90, 168.4], [95, 181.8], [100, 195.9],
      [105, 210.8], [110, 226.4], [115, 242.8], [120, 260.0],
    ],
    "R-134a": [
      [-40, -7.4], [-30, -3.0], [-20, 2.3], [-10, 8.8], [0, 16.5],
      [5, 21.0], [10, 25.9], [15, 31.3], [20, 37.1], [25, 43.4],
      [30, 50.1], [35, 57.4], [40, 65.2], [45, 73.6], [50, 82.5],
      [55, 92.1], [60, 102.3], [65, 113.2], [70, 124.8], [75, 137.1],
      [80, 150.2], [85, 164.1], [90, 178.9], [95, 194.5], [100, 211.0],
      [105, 228.5], [110, 247.0], [115, 266.5], [120, 287.1],
    ],
    // R-32 approximate training chart (common mini-split / VRF refrigerant)
    "R-32": [
      [-40, 11.5], [-30, 19.0], [-20, 28.0], [-10, 39.0], [0, 52.0],
      [5, 59.5], [10, 67.8], [15, 77.0], [20, 87.0], [25, 98.0],
      [30, 110.0], [35, 123.0], [40, 137.0], [45, 152.5], [50, 169.0],
      [55, 187.0], [60, 206.0], [65, 226.5], [70, 248.5], [75, 272.0],
      [80, 297.0], [85, 323.5], [90, 352.0], [95, 382.0], [100, 414.0],
      [105, 448.0], [110, 484.0], [115, 522.0], [120, 562.0],
    ],
  };

  function satP(ref, tF) {
    const chart = PT[ref] || PT["R-410A"];
    if (tF <= chart[0][0]) return chart[0][1];
    if (tF >= chart[chart.length - 1][0]) return chart[chart.length - 1][1];
    for (let i = 0; i < chart.length - 1; i++) {
      const [t0, p0] = chart[i];
      const [t1, p1] = chart[i + 1];
      if (tF >= t0 && tF <= t1) {
        const u = (tF - t0) / (t1 - t0);
        return p0 + u * (p1 - p0);
      }
    }
    return chart[0][1];
  }

  function satT(ref, p) {
    const chart = PT[ref] || PT["R-410A"];
    if (p <= chart[0][1]) return chart[0][0];
    if (p >= chart[chart.length - 1][1]) return chart[chart.length - 1][0];
    for (let i = 0; i < chart.length - 1; i++) {
      const [t0, p0] = chart[i];
      const [t1, p1] = chart[i + 1];
      if (p >= p0 && p <= p1) {
        const u = (p - p0) / (p1 - p0);
        return t0 + u * (t1 - t0);
      }
    }
    return chart[0][0];
  }

  const COMPONENTS = [
    { id: "compressor", name: "Scroll compressor", group: "parts", icon: "⚡", img: "parts/compressor.png", slot: "compressor", required: true, desc: "Hermetic scroll · drag to compressor slot" },
    { id: "condenser", name: "Outdoor condenser", group: "parts", icon: "🔥", img: "parts/condenser.png", slot: "condenser", required: true, desc: "ODU cabinet · fan + coil" },
    { id: "metering", name: "TXV metering device", group: "parts", icon: "🔽", img: "parts/metering.png", slot: "metering", required: true, desc: "Thermostatic expansion valve" },
    { id: "evaporator", name: "Evaporator A-coil", group: "parts", icon: "❄️", img: "parts/evaporator.png", slot: "evaporator", required: true, desc: "Cased indoor coil · drain pan" },
    { id: "filter", name: "Filter-drier", group: "parts", icon: "🧪", img: "parts/filter.png", slot: "filter", required: false, desc: "Liquid-line drier" },
    { id: "accumulator", name: "Suction accumulator", group: "parts", icon: "🛢", img: "parts/accumulator.png", slot: "accumulator", required: false, desc: "Protects compressor from liquid slug" },
    { id: "receiver", name: "Liquid receiver", group: "parts", icon: "🫙", img: null, slot: "receiver", required: false, desc: "Stores liquid after the condenser" },
    { id: "solenoid", name: "Liquid solenoid", group: "parts", icon: "🧲", img: "parts/relay.png", slot: "solenoid", required: false, desc: "Pump-down valve in the liquid line" },
    { id: "revvalve", name: "Reversing valve (4-way)", group: "parts", icon: "🔀", img: "parts/relay.png", slot: "revvalve", required: false, desc: "Heat pump changeover · discharge in the middle" },
    { id: "sightglass", name: "Sight glass", group: "parts", icon: "👁", img: null, slot: "sightglass", required: false, desc: "Moisture / flash gas in the liquid line" },
    // Electrical
    { id: "disconnect", name: "Fused disconnect", group: "electrical", icon: "🔌", img: "parts/disconnect.png", slot: "disconnect", required: false, desc: "Outdoor disconnect · L1/L2" },
    { id: "contactor", name: "Contactor", group: "electrical", icon: "🧲", img: "parts/contactor.png", slot: "contactor", required: false, desc: "24V coil · line to compressor" },
    { id: "capacitor", name: "Dual run capacitor", group: "electrical", icon: "🔋", img: "parts/capacitor.png", slot: "capacitor", required: false, desc: "Herm / fan / common terminals" },
    { id: "transformer", name: "24V transformer", group: "electrical", icon: "🔁", img: "parts/transformer.png", slot: "transformer", required: false, desc: "Control voltage · C and R" },
    { id: "thermostat", name: "Thermostat", group: "electrical", icon: "🌡️", img: "parts/thermostat.png", slot: "thermostat", required: false, desc: "Y call · 24V control" },
    // Tools
    { id: "gauges", name: "Manifold gauge set", group: "tools", icon: "📊", img: "parts/gauges.png", slot: null, required: false, desc: "Blue low · red high" },
    { id: "dmm", name: "Digital multimeter", group: "tools", icon: "📟", img: "parts/dmm.png", slot: null, required: false, desc: "VAC · AAC · ohms · continuity" },
    { id: "micron", name: "Micron gauge", group: "tools", icon: "📉", img: null, slot: null, required: false, desc: "Deep vacuum readout" },
    // Materials
    { id: "copper", name: "Copper tubing", group: "materials", icon: "🔶", img: null, slot: null, required: false, desc: "Lineset / branch piping" },
    { id: "nitrogen", name: "Dry nitrogen", group: "materials", icon: "💨", img: null, slot: null, required: false, desc: "Purge & pressure test only" },
    { id: "flare", name: "Flare fittings", group: "materials", icon: "🔩", img: null, slot: null, required: false, desc: "Mini-split line connections" },
    { id: "wire", name: "THHN / thermostat wire", group: "materials", icon: "🧵", img: null, slot: null, required: false, desc: "Line voltage + 18/8 control" },
  ];

  function partThumb(c) {
    if (c && c.img) return '<img class="part-img" src="' + c.img + '" alt="' + c.name + '" draggable="false" />';
    return '<span class="ico">' + (c && c.icon ? c.icon : "•") + "</span>";
  }

  // Leading OEM packages — training templates (not licensed replicas)
  const SYSTEMS = [
    {
      id: "goodman-gsx",
      brand: "Goodman",
      name: "GSX14 Split AC",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "orifice",
      seer: "14",
      notes: "Single-stage scroll · piston metering · value residential workhorse",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 20,
      approachEvap: 32,
      targetSH: 14,
      targetSC: 10,
    },
    {
      id: "goodman-gmvc",
      brand: "Goodman",
      name: "GMVC96 Gas Furnace + Coil",
      type: "split-hp-combo",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "Communicating furnace air handler with cased coil · TXV indoor",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 18,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 10,
    },
    {
      id: "carrier-comfort",
      brand: "Carrier",
      name: "Comfort 16 Split",
      type: "split",
      tons: 2.5,
      ref: "R-410A",
      metering: "txv",
      seer: "16",
      notes: "Two-stage outdoor · Puron · factory TXV indoor coil",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 17,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 12,
    },
    {
      id: "carrier-infinity",
      brand: "Carrier",
      name: "Infinity 26 Variable",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "24+",
      notes: "Variable-speed inverter · Greenspeed · tight SH control",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 10,
    },
    {
      id: "daikin-dx",
      brand: "Daikin",
      name: "DX20VC Fit Heat Pump",
      type: "split-hp",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Daikin Fit inverter heat pump · swing compressor · EEV",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 15,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 9,
    },
    {
      id: "daikin-aurora",
      brand: "Daikin",
      name: "Aurora Single-Zone Mini-Split",
      type: "minisplit",
      tons: 1.5,
      ref: "R-410A",
      metering: "eev",
      seer: "20+",
      notes: "Wall-mount IDU · hyper-heating ODU · flare lineset · inverter rotary",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 14,
      approachEvap: 26,
      targetSH: 7,
      targetSC: 8,
    },
    {
      id: "mitsubishi-msz",
      brand: "Mitsubishi",
      name: "MSZ-FS Hyper-Heat Mini-Split",
      type: "minisplit",
      tons: 1,
      ref: "R-410A",
      metering: "eev",
      seer: "28",
      notes: "Premium single-zone · 3D i-see sensor · cold-climate heat pump",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator" },
      approachCond: 12,
      approachEvap: 25,
      targetSH: 6,
      targetSC: 8,
    },
    {
      id: "lg-multi",
      brand: "LG",
      name: "Multi F Dual-Zone Mini-Split",
      type: "minisplit-multi",
      tons: 2,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "One ODU · two wall heads · branch box / electronic expansion",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 15,
      approachEvap: 27,
      targetSH: 7,
      targetSC: 9,
    },
    {
      id: "samsung-windfree",
      brand: "Samsung",
      name: "WindFree Mini-Split",
      type: "minisplit",
      tons: 1,
      ref: "R-32",
      metering: "eev",
      seer: "22",
      notes: "R-32 rotary inverter · wind-free panel · flare connections",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator" },
      approachCond: 13,
      approachEvap: 26,
      targetSH: 6,
      targetSC: 8,
    },
    {
      id: "trane-xr",
      brand: "Trane",
      name: "XR17 Split Heat Pump",
      type: "split-hp",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "17",
      notes: "Climatuff compressor · Spine Fin coil · dual-fuel ready",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 16,
      approachEvap: 30,
      targetSH: 10,
      targetSC: 11,
    },
    {
      id: "rheem-rp",
      brand: "Rheem",
      name: "RP17 Prestige Split",
      type: "split",
      tons: 3,
      ref: "R-410A",
      metering: "txv",
      seer: "17",
      notes: "Three-stage · EcoNet communicating · TXV coil",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 16,
      approachEvap: 29,
      targetSH: 9,
      targetSC: 11,
    },
    {
      id: "lennox-sl",
      brand: "Lennox",
      name: "SL25XCV Variable",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "26",
      notes: "Precise Comfort variable capacity · true communicating system",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 13,
      approachEvap: 27,
      targetSH: 7,
      targetSC: 9,
    },
    {
      id: "bryant-evolution",
      brand: "Bryant",
      name: "Evolution Extreme 24",
      type: "split-inverter",
      tons: 3,
      ref: "R-410A",
      metering: "eev",
      seer: "24",
      notes: "Variable-speed · Evolution control · sister platform to Carrier Infinity",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 14,
      approachEvap: 28,
      targetSH: 8,
      targetSC: 10,
    },
    {
      id: "york-affinity",
      brand: "York",
      name: "Affinity YXV Variable",
      type: "split-inverter",
      tons: 2.5,
      ref: "R-410A",
      metering: "eev",
      seer: "20",
      notes: "Variable-capacity side-discharge option · residential / light commercial",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter" },
      approachCond: 15,
      approachEvap: 29,
      targetSH: 9,
      targetSC: 10,
    },
    {
      id: "generic-r22",
      brand: "Legacy",
      name: "R-22 Replacement Special",
      type: "split",
      tons: 2.5,
      ref: "R-22",
      metering: "orifice",
      seer: "10",
      notes: "Training only · legacy R-22 piston system for recovery practice",
      parts: { compressor: "compressor", condenser: "condenser", metering: "metering", evaporator: "evaporator", filter: "filter", accumulator: "accumulator", revvalve: "revvalve" },
      approachCond: 25,
      approachEvap: 35,
      targetSH: 15,
      targetSC: 10,
    },
  ];

  const SLOTS = [
    { id: "compressor", x: 0.22, y: 0.55, label: "Compressor" },
    { id: "condenser", x: 0.52, y: 0.20, label: "Condenser" },
    { id: "metering", x: 0.82, y: 0.52, label: "Metering" },
    { id: "evaporator", x: 0.52, y: 0.82, label: "Evaporator" },
    { id: "filter", x: 0.70, y: 0.36, label: "Filter-Drier" },
    { id: "accumulator", x: 0.34, y: 0.70, label: "Accumulator" },
    { id: "receiver", x: 0.62, y: 0.28, label: "Receiver" },
    { id: "solenoid", x: 0.76, y: 0.44, label: "Solenoid" },
    { id: "revvalve", x: 0.34, y: 0.40, label: "Rev. valve" },
    { id: "sightglass", x: 0.68, y: 0.40, label: "Sight glass" },
    { id: "disconnect", x: 0.08, y: 0.18, label: "Disconnect" },
    { id: "contactor", x: 0.08, y: 0.38, label: "Contactor" },
    { id: "capacitor", x: 0.08, y: 0.58, label: "Capacitor" },
    { id: "transformer", x: 0.08, y: 0.78, label: "Transformer" },
    { id: "thermostat", x: 0.92, y: 0.18, label: "Thermostat" },
  ];

  // CoolGame-style timed circuit builds (Lincoln Tech clone — not Danfoss IP)
  const CHALLENGES = [
    {
      id: "dx-basic",
      name: "1 · Basic DX circuit",
      time: 60,
      need: ["compressor", "condenser", "metering", "evaporator"],
      hint: "Four core: compressor → condenser → TXV → evaporator → suction home.",
    },
    {
      id: "dx-drier",
      name: "2 · DX + filter-drier",
      time: 70,
      need: ["compressor", "condenser", "filter", "metering", "evaporator"],
      hint: "Drier sits in the liquid line — after the condenser, before the TXV.",
    },
    {
      id: "dx-glass",
      name: "3 · DX + sight glass",
      time: 75,
      need: ["compressor", "condenser", "filter", "sightglass", "metering", "evaporator"],
      hint: "Sight glass after the drier so you can see flash gas / moisture.",
    },
    {
      id: "dx-acc",
      name: "4 · DX + accumulator",
      time: 80,
      need: ["compressor", "condenser", "filter", "metering", "evaporator", "accumulator"],
      hint: "Accumulator on the suction line, into the compressor.",
    },
    {
      id: "pumpdown",
      name: "5 · Pump-down circuit",
      time: 95,
      need: ["compressor", "condenser", "receiver", "filter", "solenoid", "metering", "evaporator"],
      hint: "Receiver after condenser. Liquid solenoid before the TXV — that's pump-down.",
    },
  ];

  const FIELD_JOBS = [
    {
      id: "dirty-odu",
      name: "Rooftop high head",
      complaint: "Unit trips on high pressure. 98°F sun, condenser looks furry.",
      outdoor: 98,
      indoor: 78,
      charge: 100,
      coilCond: "dirty",
      coilEvap: "clean",
      fault: "none",
      fix: "Wash the outdoor coil. Don't add gas.",
    },
    {
      id: "dirty-idu",
      name: "Iced evaporator",
      complaint: "Blows cool then ices the A-coil. Filter was a carpet.",
      outdoor: 88,
      indoor: 74,
      charge: 100,
      coilCond: "clean",
      coilEvap: "dirty",
      fault: "none",
      fix: "Clean indoor coil / filter / blower. Airflow before charge.",
    },
    {
      id: "leak",
      name: "Slow leak, not cooling",
      complaint: "Not cooling. Ice on suction. Gauges look starved.",
      outdoor: 92,
      indoor: 76,
      charge: 62,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "undercharge",
      fix: "Find leak, repair, recover leftover, evacuate, weigh in. Don't top off.",
    },
    {
      id: "overcharge",
      name: "Someone dumped a jug",
      complaint: "High head, high SC, compressor hot. Last tech 'added a little.'",
      outdoor: 90,
      indoor: 75,
      charge: 128,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "overcharge",
      fix: "Recover to nameplate weight. Don't keep adding.",
    },
    {
      id: "drier",
      name: "Restriction after drier",
      complaint: "High SH, high SC, cold drier outlet. Sight glass flashing.",
      outdoor: 95,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "restricted",
      fix: "Replace the filter-drier, then evacuate and weigh in.",
    },
    {
      id: "txv-bulb",
      name: "TXV lost its mind",
      complaint: "Starved coil, hunting then stuck high SH. Bulb looks kicked.",
      outdoor: 94,
      indoor: 76,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "txv_closed",
      fix: "Replace the TXV (and bulb on the suction line, insulated).",
    },
    {
      id: "txv-flood",
      name: "Flooding compressor",
      complaint: "Low SH, liquid hammer on start. TXV won't shut down.",
      outdoor: 85,
      indoor: 72,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "txv_open",
      fix: "Replace the TXV. Don't just add a hard-start.",
    },
    {
      id: "air",
      name: "Air in the circuit",
      complaint: "High head, low SC after a sloppy braze with no nitrogen / no vac.",
      outdoor: 95,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "noncondensables",
      fix: "Recover, replace drier, deep vac, weigh in. You can't 'bleed air' from a 410 system.",
    },
    {
      id: "bad-cap",
      name: "Humming compressor",
      complaint: "Humming, hard start, might trip. If it runs, pressures aren't wild.",
      outdoor: 90,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "none",
      capBad: true,
      fix: "Lock out. Read HERM–C µF vs nameplate. Replace the dual run capacitor.",
    },
    {
      id: "rv-stuck",
      name: "Heat pump stuck in heat",
      complaint: "It's 90°F and it's still blowing hot. O at the board, valve never shifted.",
      outdoor: 90,
      indoor: 76,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "rv_stuck_heat",
      hpMode: "cool",
      fix: "24V at the solenoid (O or B). Click? If coil is hot and slider didn't move, replace the 4-way. Don't condemn the compressor first.",
    },
    {
      id: "rv-bleed",
      name: "Reversing valve bleeding",
      complaint: "Runs in both modes but no capacity. Suction line warm. Discharge and suction close.",
      outdoor: 88,
      indoor: 75,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "rv_bleed",
      hpMode: "cool",
      fix: "Internal leak in the 4-way. Temp on the three tubes. If bypassing, replace the valve — not a charge problem.",
    },
    {
      id: "no-defrost",
      name: "Iced solid in heat",
      complaint: "28°F, outdoor coil is a glacier, house is cold. Board never goes to defrost.",
      outdoor: 28,
      indoor: 68,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "defrost_fail",
      hpMode: "heat",
      fix: "Defrost sensor / board. Force defrost: RV to cool, ODU fan OFF. If it never terminates, sensor or time/temp board.",
    },
    {
      id: "stuck-defrost",
      name: "Stuck in defrost",
      complaint: "Steaming outdoor unit, blowing cool in winter, aux heat screaming.",
      outdoor: 35,
      indoor: 70,
      charge: 100,
      coilCond: "clean",
      coilEvap: "clean",
      fault: "stuck_defrost",
      hpMode: "heat",
      fix: "Terminate defrost. Check coil sensor (should open ~50–70°F). Don't leave it in cool with the fan off all night.",
    },
  ];

  // Cycle path as normalized [x,y] points for particle flow (clockwise from compressor discharge)
  // compressor → condenser → filter → metering → evaporator → accumulator → compressor
  const FLOW_PATH = [
    [0.22, 0.48], // discharge out of compressor
    [0.30, 0.28],
    [0.42, 0.20],
    [0.50, 0.18], // condenser
    [0.60, 0.22],
    [0.68, 0.32], // filter
    [0.76, 0.42],
    [0.82, 0.50], // metering
    [0.78, 0.68],
    [0.64, 0.80],
    [0.50, 0.84], // evaporator
    [0.36, 0.80],
    [0.28, 0.72], // accumulator
    [0.20, 0.62],
    [0.18, 0.55], // back to compressor suction
  ];

  // Phase segments along path index ranges for coloring
  // 0-3 high vapor, 3-6 high liquid, 6-9 low mix, 9-14 low vapor
  function phaseAt(t) {
    // t 0..1 along path
    if (t < 0.22) return "high-vapor";
    if (t < 0.45) return "high-liquid";
    if (t < 0.65) return "low-mix";
    return "low-vapor";
  }

  const PHASE_COLOR = {
    "high-vapor": "#f07178",
    "high-liquid": "#c44e52",
    "low-mix": "#7ec8d3",
    "low-vapor": "#2dd4bf",
  };

  let host = null;
  let canvas = null;
  let ctx = null;
  let raf = 0;
  let placed = {}; // slotId -> componentId
  let challenge = null;
  let challengeLeft = 0;
  let challengeTimer = 0;
  let challengeWon = false;
  let running = false;
  let refrigerant = "R-410A";
  let outdoorF = 95;
  let indoorF = 75;
  let chargePct = 100;
  let fault = "none";
  let txvTarget = 12;
  let coilCond = "clean";
  let coilEvap = "clean";
  let jobMode = null; // null | recreate | mystery
  let activeJob = null;
  let jobAttempts = 0;
  let jobSolved = false;
  let leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
  let n2Acked = false;
  let capBad = false;
  let hpMode = "cool"; // cool | heat
  let frost = 0;
  let defrosting = false;
  let particles = [];
  let animT = 0;
  let onXp = null;
  let gaugesEquipped = false;
  let dmmMode = "vac";
  let dmmProbe = "l1l2";
  let activeSystem = null; // SYSTEMS entry or null (custom)

  function lerpPath(t) {
    // t in [0,1)
    const n = FLOW_PATH.length;
    const f = t * n;
    const i = Math.floor(f) % n;
    const j = (i + 1) % n;
    const u = f - Math.floor(f);
    const a = FLOW_PATH[i];
    const b = FLOW_PATH[j];
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u];
  }

  function requiredComplete() {
    return ["compressor", "condenser", "metering", "evaporator"].every((s) => placed[s]);
  }

  function simulate() {
    const ok = requiredComplete() && running;
    if (!ok) {
      return {
        running: false,
        pHigh: 0,
        pLow: 0,
        tSatHigh: 0,
        tSatLow: 0,
        tLiquid: 0,
        tSuction: 0,
        sh: 0,
        sc: 0,
        status: requiredComplete() ? "System ready — start compressor" : "Place required components",
      };
    }

    // Base design targets from ambients + active OEM package
    const ac = activeSystem ? activeSystem.approachCond : 18;
    const ae = activeSystem ? activeSystem.approachEvap : 30;
    let effectiveMode = hpMode;
    if (fault === "rv_stuck_heat") effectiveMode = "heat";
    if (fault === "rv_stuck_cool") effectiveMode = "cool";
    if (defrosting || fault === "stuck_defrost") effectiveMode = "cool";
    let condSat, evapSat;
    if (effectiveMode === "heat") {
      condSat = indoorF + ac;
      evapSat = outdoorF - ae;
    } else {
      condSat = outdoorF + ac;
      evapSat = indoorF - ae;
    }
    if (defrosting || fault === "stuck_defrost") {
      condSat = outdoorF + ac + 22;
    }
    if (frost > 55 && effectiveMode === "heat" && !defrosting && fault !== "stuck_defrost") {
      evapSat -= Math.min(18, (frost - 55) * 0.4);
    }

    // Faults & charge
    let chargeFactor = chargePct / 100;
    if (fault === "undercharge") chargeFactor = 0.7;
    if (fault === "overcharge") chargeFactor = 1.25;
    if (fault === "dirty_cond") condSat += 18;
    if (fault === "dirty_evap") evapSat -= 12;
    if (fault === "restricted") {
      evapSat -= 15;
      condSat += 5;
    }
    if (fault === "noncondensables") {
      condSat += 22;
    }
    if (fault === "txv_closed") {
      evapSat -= 18;
    }
    if (fault === "txv_open") {
      evapSat += 8;
    }
    if (fault === "rv_bleed") {
      evapSat += 12;
      condSat -= 10;
    }

    // Charge effects
    if (chargeFactor < 1) {
      evapSat -= (1 - chargeFactor) * 20;
      condSat -= (1 - chargeFactor) * 8;
    } else if (chargeFactor > 1) {
      evapSat += (chargeFactor - 1) * 10;
      condSat += (chargeFactor - 1) * 15;
    }

    if (coilCond === "dirty") condSat += 16;
    if (coilEvap === "dirty") evapSat -= 10;

    const pHigh = satP(refrigerant, condSat);
    const pLow = Math.max(0, satP(refrigerant, evapSat));
    const tSatHigh = satT(refrigerant, pHigh);
    const tSatLow = satT(refrigerant, pLow);

    // SC / SH targets — OEM package targets when healthy
    let sc = activeSystem ? activeSystem.targetSC : 10;
    let sh = activeSystem ? activeSystem.targetSH : txvTarget;
    if (fault === "none" && chargeFactor >= 0.9 && chargeFactor <= 1.1) {
      sh = txvTarget;
    }
    if (fault === "undercharge" || chargeFactor < 0.85) {
      sc = 3;
      sh = 28;
    }
    if (fault === "overcharge" || chargeFactor > 1.15) {
      sc = 18;
      sh = 4;
    }
    if (fault === "restricted") {
      sc = 22;
      sh = 30;
    }
    if (fault === "dirty_cond") {
      sc = 6;
      sh = 14;
    }
    if (fault === "dirty_evap") {
      sc = 12;
      sh = 6;
    }
    if (fault === "noncondensables") {
      sc = 4;
      sh = 13;
    }
    if (fault === "txv_closed") {
      sc = 18;
      sh = 36;
    }
    if (fault === "txv_open") {
      sc = 6;
      sh = 2;
    }
    if (fault === "rv_bleed") {
      sc = 5;
      sh = 4;
    }

    if (coilCond === "dirty") {
      sc = Math.min(sc, 7);
    }
    if (coilEvap === "dirty") {
      sh = Math.min(sh, 7);
    }
    const tLiquid = tSatHigh - sc;
    const tSuction = tSatLow + sh;

    let status = "Cycle running";
    if (activeSystem && fault === "none" && chargeFactor >= 0.9 && chargeFactor <= 1.1) {
      status = activeSystem.brand + " " + activeSystem.name + " · healthy";
    }
    if (sh > 22 && sc < 6) status = "Possible undercharge / leak";
    else if (sh < 6 && sc > 16) status = "Possible overcharge";
    else if (sh > 22 && sc > 16) status = "Possible liquid-line restriction";
    else if (fault === "dirty_cond") status = "High head — check condenser airflow";
    else if (fault === "dirty_evap") status = "Low SH — check evaporator airflow";
    else if (fault === "noncondensables") status = "High head + low SC — non-condensables (air) in the condenser";
    else if (fault === "txv_closed") status = "Starved coil — TXV stuck closed / bulb lost charge";
    else if (fault === "txv_open") status = "Flooding — TXV stuck open. Watch liquid slugging.";
    else if (coilCond === "dirty") status = "High head — outdoor coil is dirty. Wash it before you add gas.";
    else if (coilEvap === "dirty") status = "Low SH / ice risk — indoor coil or filter is dirty.";
    else if (fault === "rv_stuck_heat" && hpMode === "cool") status = "Calling COOL but the 4-way is stuck in HEAT. Indoor coil is the condenser.";
    else if (fault === "rv_stuck_cool" && hpMode === "heat") status = "Calling HEAT but the 4-way is stuck in COOL.";
    else if (fault === "rv_bleed") status = "4-way bleeding internally — suction warm, low capacity, pressures closer together.";
    else if (fault === "stuck_defrost" || defrosting) status = "DEFROST: 4-way in cool, ODU fan OFF, outdoor coil steaming. Aux heat should cover the house.";
    else if (frost > 70 && hpMode === "heat") status = "Outdoor coil iced. Need defrost — sensor/board or force it. Don't add gas.";

    const tonsBase = activeSystem ? activeSystem.tons : 3;
    const load = Math.max(0.35, Math.min(1.25, ((indoorF - 65) / 15) * ((115 - outdoorF) / 40 + 0.55)));
    const derate = Math.max(0.4, 1 - (condSat - (outdoorF + 18)) / 80 - ( (indoorF - 30) - evapSat ) / 80);
    const tons = +(tonsBase * load * derate * (0.7 + 0.3 * Math.min(1, chargeFactor))).toFixed(2);
    const btuh = Math.round(tons * 12000);
    const tC = condSat + 460;
    const tE = evapSat + 460;
    const copCarnot = tE / Math.max(1, tC - tE);
    const cop = Math.max(1.2, copCarnot * 0.42);
    const kw = (btuh / 12000) * 3.517 / cop;
    let amps = kw / (240 * 0.85) * 1000;
    if (capBad) amps *= 1.4;

    const tgtSH = txvTarget;
    const tgtSC = activeSystem ? activeSystem.targetSC : 10;
    const shOk = Math.abs(sh - tgtSH) <= 4;
    const scOk = Math.abs(sc - tgtSC) <= 4;
    let deltaT = 20;
    if (coilEvap === "dirty") deltaT = 8;
    else if (fault === "undercharge" || chargeFactor < 0.85) deltaT = 11;
    else if (fault === "restricted" || fault === "txv_closed") deltaT = 9;
    else if (fault === "txv_open" || chargeFactor > 1.15) deltaT = 15;
    else if (coilCond === "dirty") deltaT = 14;
    let glass = "Clear";
    if (fault === "undercharge" || chargeFactor < 0.85) glass = "Bubbles / flashing — starved";
    else if (fault === "restricted") glass = "Flashing after the drier";
    else if (fault === "overcharge" || chargeFactor > 1.15) glass = "Solid — could be overcharged";
    else if (coilCond === "dirty") glass = "Clear (don't trust it — check head)";
    let fp = "SH/SC in the conversation. Confirm delta T and airflow.";
    if (coilCond === "dirty") fp = "HUB: high head. Wash the outdoor coil before you add gas.";
    else if (coilEvap === "dirty") fp = "HUB: low split / low SH. Filter and indoor coil before charge.";
    else if (sh > 20 && sc < 7) fp = "HUB fingerprint: HIGH SH + LOW SC → leak / undercharge. Don't top off.";
    else if (sh < 6 && sc > 15) fp = "HUB fingerprint: LOW SH + HIGH SC → overcharge or flooding TXV.";
    else if (sh > 20 && sc > 15) fp = "HUB fingerprint: HIGH SH + HIGH SC → restriction (drier / TXV).";
    else if (fault === "noncondensables") fp = "HUB: high head + low SC after a sloppy vac = air in the condenser.";
    else if (capBad) fp = "HUB: pressures can look fine. Meter the cap. Humming isn't a charge problem.";
    else if (fault === "rv_stuck_heat" || fault === "rv_stuck_cool") fp = "HUB: 24V on O/B? Click? If the solenoid is energized and the slider didn't move, it's the valve, not the compressor.";
    else if (fault === "rv_bleed") fp = "HUB: 4-way bypass. Discharge and suction temps closer than they should be. Replace the reversing valve.";
    else if (defrosting || fault === "stuck_defrost") fp = "HUB: Defrost is COOL with the outdoor fan off. If it never ends, coil sensor / board. If it never starts, same sensors.";
    else if (frost > 60 && hpMode === "heat") fp = "HUB: Glacier on the ODU. Force defrost. If the RV doesn't shift and the fan doesn't stop, it's defrost control — not charge.";
    else if (shOk && scOk && coilCond === "clean" && coilEvap === "clean") fp = "HUB: SH/SC in band. That's a charged, breathing system.";

    return {
      running: true,
      pHigh,
      pLow,
      tSatHigh,
      tSatLow,
      tLiquid,
      tSuction,
      sh,
      sc,
      status,
      condSat,
      evapSat,
      tons,
      btuh,
      cop,
      amps,
      tgtSH,
      tgtSC,
      shOk,
      scOk,
      deltaT,
      glass,
      fp,
      frost,
      defrosting: !!(defrosting || fault === "stuck_defrost"),
      hpMode: effectiveMode,
    };
  }

  function buildUI(root) {
    root.innerHTML = `
      <div class="sb-layout">
        <aside class="sb-palette">
          <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
            <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
            <div class="brand-word">
              <strong style="font-size:13px">LINCOLN TECH</strong>
              <span>System sandbox · CoolGame circuit builder</span>
            </div>
          </div>
          <p class="eyebrow">Component tray</p>
          <div class="sb-build-progress" id="sb-progress">Core cycle: 0 / 4</div>
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="parts">Parts</button>
            <button class="sb-tab" data-tab="challenges">CoolGame</button>
            <button class="sb-tab" data-tab="field">Field jobs</button>
            <button class="sb-tab" data-tab="electrical">Electrical</button>
            <button class="sb-tab" data-tab="systems">OEM packs</button>
            <button class="sb-tab" data-tab="tools">Tools</button>
            <button class="sb-tab" data-tab="materials">Materials</button>
          </div>
          <div id="sb-items" class="sb-items"></div>
          <p class="sb-hint">CoolGame: drag the right part onto the right slot against the clock. Then run the sim.</p>
          <div class="hub-chip" style="margin:10px 0 0;max-width:none">
            <img src="hub-portrait.jpg" alt="Professor HUB" class="hub-chip-av photo" />
            <div><strong>Professor HUB</strong><p>Four core pieces close the loop. Then start the compressor — I’ll roast your SH/SC.</p></div>
          </div>
        </aside>
        <main class="sb-main">
          <header class="sb-toolbar">
            <div class="sb-controls">
              <label>Refrigerant
                <select id="sb-ref">
                  <option>R-410A</option>
                  <option>R-32</option>
                  <option>R-22</option>
                  <option>R-134a</option>
                </select>
              </label>
              <label>Outdoor °F
                <input id="sb-out" type="range" min="60" max="115" value="95" />
                <span id="sb-out-v">95</span>
              </label>
              <label>Indoor °F
                <input id="sb-in" type="range" min="65" max="85" value="75" />
                <span id="sb-in-v">75</span>
              </label>
              <label>Charge %
                <input id="sb-charge" type="range" min="50" max="130" value="100" />
                <span id="sb-charge-v">100</span>
              </label>
              <label>Mode
                <select id="sb-mode">
                  <option value="cool">Cool</option>
                  <option value="heat">Heat (HP)</option>
                  <option value="defrost">Defrost (force)</option>
                </select>
              </label>
              <label>Fault
                <select id="sb-fault">
                  <option value="none">None (healthy)</option>
                  <option value="undercharge">Undercharge / leak</option>
                  <option value="overcharge">Overcharge</option>
                  <option value="dirty_cond">Dirty condenser</option>
                  <option value="dirty_evap">Dirty evaporator</option>
                  <option value="restricted">Liquid-line restriction</option>
                  <option value="noncondensables">Non-condensables (air)</option>
                  <option value="txv_closed">TXV stuck closed / lost bulb</option>
                  <option value="txv_open">TXV stuck open</option>
                  <option value="rv_stuck_heat">RV stuck in heat</option>
                  <option value="rv_stuck_cool">RV stuck in cool</option>
                  <option value="rv_bleed">RV internal bleed</option>
                </select>
              </label>
              <label>TXV SH target
                <input id="sb-txv" type="range" min="6" max="18" value="12" />
                <span id="sb-txv-v">12</span>
              </label>
            </div>
            <div class="sb-actions">
              <span id="sb-clock" class="sb-clock"></span>
              <button class="btn primary" id="sb-run">Start compressor</button>
              <button class="btn" id="sb-clear">Clear board</button>
              <button class="btn" id="sb-hub">Shop floor</button>
            </div>
          </header>
          <div id="sb-sysbanner" class="sb-sysbanner">Custom build — drop parts or load a system pack</div>
          <div class="sb-stage-wrap">
            <canvas id="sb-canvas"></canvas>
            <div id="sb-slots" class="sb-slots"></div>
          </div>
        </main>
        <aside class="sb-gauges">
          <p class="eyebrow">System simulator</p>
          <div id="sb-sysinfo" class="sb-sysinfo"></div>
          <div class="gauge-pair">
            <div class="gauge blue">
              <span class="g-label">Low side</span>
              <span class="g-val" id="g-plow">—</span>
              <span class="g-unit">psig</span>
              <span class="g-sub" id="g-tsatl">sat — °F</span>
            </div>
            <div class="gauge red">
              <span class="g-label">High side</span>
              <span class="g-val" id="g-phigh">—</span>
              <span class="g-unit">psig</span>
              <span class="g-sub" id="g-tsath">sat — °F</span>
            </div>
          </div>
          <div class="readouts">
            <div><span>Suction temp</span><b id="g-tsuc">—</b></div>
            <div><span>Liquid temp</span><b id="g-tliq">—</b></div>
            <div><span>Superheat</span><b id="g-sh">—</b></div>
            <div><span>Subcooling</span><b id="g-sc">—</b></div>
            <div><span>Target SH / SC</span><b id="g-tgt">—</b></div>
            <div><span>Delta T (split)</span><b id="g-dt">—</b></div>
            <div><span>Sight glass</span><b id="g-glass">—</b></div>
            <div><span>Capacity</span><b id="g-cap">—</b></div>
            <div><span>COP</span><b id="g-cop">—</b></div>
            <div><span>Comp amps</span><b id="g-amps">—</b></div>
          </div>
          <p class="sb-fp" id="sb-fp">HUB: close the loop, start the compressor, then read SH and SC together.</p>
          <p class="eyebrow">Defrost control circuit</p>
          <div id="sb-defrost-d" class="sb-defrost-d">
            <svg viewBox="0 0 340 230" xmlns="http://www.w3.org/2000/svg" aria-label="Heat pump defrost control diagram">
              <text x="8" y="16" fill="#8b98a5" font-size="11">24VAC control · heat pump ODU</text>
              <g id="df-r" class="df-node">
                <rect x="8" y="28" width="70" height="52" rx="6"/>
                <text x="43" y="48" text-anchor="middle" font-size="10">R / C</text>
                <text x="43" y="64" text-anchor="middle" font-size="9">24V xfmr</text>
              </g>
              <g id="df-stat" class="df-node">
                <rect x="98" y="28" width="78" height="52" rx="6"/>
                <text x="137" y="46" text-anchor="middle" font-size="10">T-stat</text>
                <text x="137" y="62" text-anchor="middle" font-size="9">Y  W  O/B</text>
              </g>
              <g id="df-board" class="df-node">
                <rect x="198" y="22" width="134" height="64" rx="6"/>
                <text x="265" y="42" text-anchor="middle" font-size="10">DEFROST BOARD</text>
                <text id="df-board-mode" x="265" y="58" text-anchor="middle" font-size="9">HEAT</text>
                <text id="df-board-led" x="265" y="74" text-anchor="middle" font-size="9">LED off</text>
              </g>
              <line class="df-wire" x1="78" y1="54" x2="98" y2="54"/>
              <line class="df-wire" x1="176" y1="54" x2="198" y2="54"/>
              <g id="df-coil" class="df-node">
                <rect x="8" y="108" width="96" height="48" rx="6"/>
                <text x="56" y="126" text-anchor="middle" font-size="10">ODU coil sensor</text>
                <text x="56" y="142" text-anchor="middle" font-size="9">terminate ~50–70°F</text>
              </g>
              <g id="df-amb" class="df-node">
                <rect x="118" y="108" width="90" height="48" rx="6"/>
                <text x="163" y="126" text-anchor="middle" font-size="10">Outdoor air</text>
                <text x="163" y="142" text-anchor="middle" font-size="9">enable < ~40°F</text>
              </g>
              <g id="df-rv" class="df-node">
                <rect x="224" y="108" width="108" height="48" rx="6"/>
                <text x="278" y="126" text-anchor="middle" font-size="10">RV solenoid O/B</text>
                <text id="df-rv-st" x="278" y="142" text-anchor="middle" font-size="9">de-energized</text>
              </g>
              <line class="df-wire" x1="56" y1="86" x2="56" y2="108"/>
              <line class="df-wire" x1="163" y1="86" x2="163" y2="108"/>
              <line class="df-wire" x1="265" y1="86" x2="265" y2="108"/>
              <g id="df-fan" class="df-node">
                <rect x="8" y="172" width="96" height="48" rx="6"/>
                <text x="56" y="190" text-anchor="middle" font-size="10">ODU fan</text>
                <text id="df-fan-st" x="56" y="206" text-anchor="middle" font-size="9">ON in heat/cool</text>
              </g>
              <g id="df-cc" class="df-node">
                <rect x="118" y="172" width="90" height="48" rx="6"/>
                <text x="163" y="190" text-anchor="middle" font-size="10">Contactor / Y</text>
                <text id="df-cc-st" x="163" y="206" text-anchor="middle" font-size="9">compressor</text>
              </g>
              <g id="df-aux" class="df-node">
                <rect x="224" y="172" width="108" height="48" rx="6"/>
                <text x="278" y="190" text-anchor="middle" font-size="10">Aux / strips W</text>
                <text id="df-aux-st" x="278" y="206" text-anchor="middle" font-size="9">off</text>
              </g>
              <line class="df-wire" x1="56" y1="156" x2="56" y2="172"/>
              <line class="df-wire" x1="163" y1="156" x2="163" y2="172"/>
              <line class="df-wire" x1="278" y1="156" x2="278" y2="172"/>
            </svg>
            <p class="sb-ph-cap">Live: gold = energized. Defrost = RV in cool + ODU fan OFF + aux often ON. Sensors feed the board — not the charge.</p>
          </div>
          <p class="eyebrow">P-H diagram (training sketch)</p>
          <canvas id="sb-ph" width="280" height="170"></canvas>
          <p class="sb-ph-cap">Coolselector-style: 1 suction · 2 discharge · 3 liquid · 4 after TXV. Not a design program.</p>
          <p class="eyebrow">Bill of materials</p>
          <ul id="sb-bom" class="sb-bom"></ul>
          <div class="phase-legend">
            <span class="ph hv">High vapor</span>
            <span class="ph hl">High liquid</span>
            <span class="ph lm">Low mix</span>
            <span class="ph lv">Low vapor</span>
          </div>
          <p class="sb-status" id="sb-status">Place the four core components to close the loop.</p>
          <div id="sb-field" class="sb-field">
            <p class="eyebrow">Field / troubleshoot</p>
            <p id="sb-job-talk" class="sb-job-talk">Recreate a job you saw, or take a mystery call. Clean coils and swap parts — the sim tells you if you actually fixed it.</p>
            <div class="sb-repairs" id="sb-repairs">
              <button type="button" class="btn" data-fix="clean-odu">Clean ODU coil</button>
              <button type="button" class="btn" data-fix="clean-idu">Clean IDU coil</button>
              <button type="button" class="btn" data-fix="replace-filter">Replace air filter</button>
              <button type="button" class="btn" data-fix="replace-rv">Replace reversing valve</button>
              <button type="button" class="btn" data-fix="shift-heat">Call HEAT (O/B)</button>
              <button type="button" class="btn" data-fix="force-defrost">Force defrost</button>
              <button type="button" class="btn" data-fix="end-defrost">Terminate defrost</button>
              <button type="button" class="btn" data-fix="replace-defrost">Replace defrost sensor</button>
              <button type="button" class="btn" data-fix="dirty-odu">Dirty ODU (recreate)</button>
              <button type="button" class="btn" data-fix="dirty-idu">Dirty IDU (recreate)</button>
              <button type="button" class="btn" data-fix="leak-visual">1 Visual leak</button>
              <button type="button" class="btn" data-fix="leak-soap">2 Soap bubbles</button>
              <button type="button" class="btn" data-fix="leak-sniffer">3 Sniffer</button>
              <button type="button" class="btn" data-fix="leak-n2">4 N₂ standing test</button>
              <button type="button" class="btn" data-fix="leak-repair">5 Repair leak</button>
              <button type="button" class="btn" data-fix="add-charge">Add 6% charge</button>
              <button type="button" class="btn" data-fix="pull-charge">Recover 6% charge</button>
              <button type="button" class="btn" data-fix="replace-txv">Replace TXV</button>
              <button type="button" class="btn" data-fix="replace-drier">Replace drier</button>
              <button type="button" class="btn" data-fix="vac-air">Evacuate / vac</button>
              <button type="button" class="btn" data-fix="weigh-in">7 Weigh-in charge</button>
            </div>
            <ol id="sb-leak-steps" class="sb-leak-steps">
              <li data-k="visual">1. Visual — oil stain, mechanical joint, schrader</li>
              <li data-k="soap">2. Soap bubbles on joints</li>
              <li data-k="sniffer">3. Electronic detector (slow, below the joint)</li>
              <li data-k="nitrogen">4. Dry nitrogen standing pressure (no oxygen)</li>
              <li data-k="repair">5. Repair — braze / replace the leaking part</li>
              <li data-k="vac">6. Evacuate to microns</li>
              <li data-k="charge">7. Weigh in nameplate charge — never top off a leaker</li>
            </ol>
            <p class="n2-banner" id="sb-n2-banner">N₂ SAFETY — regulator on the cylinder · dry nitrogen gas only · NEVER oxygen or shop air (oil + O₂ detonates) · N₂ displaces oxygen (asphyxiation) · stay at or below OEM test pressure · no liquid nitrogen on a lineset</p>
            <div id="sb-n2-modal" class="n2-modal hidden">
              <h3>Nitrogen safety — read it</h3>
              <ul>
                <li>Cylinder is ~2200+ psig. <strong>Regulator required.</strong> Never crack a bottle into a hose.</li>
                <li><strong>Dry nitrogen gas only.</strong> Not oxygen. Not shop air. Oil + oxygen can explode.</li>
                <li>Do not exceed the equipment / OEM test pressure. Watch the gauge. Relief path on the regulator.</li>
                <li>N₂ is inert — it will <strong>asphyxiate</strong> you in a closet, crawl, or van with no air.</li>
                <li>Purge while brazing at low flow. Standing test is a hold, not a fill-until-it-pops.</li>
                <li>This is not liquid nitrogen. Freeze burns and over-pressure are both on you.</li>
              </ul>
              <button type="button" class="btn primary" id="sb-n2-go">Regulator on · dry N₂ only · continue</button>
              <button type="button" class="btn" id="sb-n2-no">Cancel</button>
            </div>
          </div>
          <div class="dmm-panel" id="sb-dmm">
            <div class="dmm-head">
              <img src="parts/dmm.png" alt="" />
              <div>
                <p class="eyebrow">Digital multimeter</p>
                <strong>Probe live electrical</strong>
              </div>
            </div>
            <label>Function
              <select id="dmm-mode">
                <option value="vac">VAC</option>
                <option value="aac">AAC (clamp)</option>
                <option value="ohm">OHMS (locked out)</option>
                <option value="cont">Continuity</option>
              </select>
            </label>
            <label>Probe
              <select id="dmm-probe">
                <option value="l1l2">L1–L2 at disconnect</option>
                <option value="load">Load side of disconnect</option>
                <option value="coil">Contactor coil C–Y</option>
                <option value="ob">Reversing valve O/B solenoid</option>
                <option value="rc">Thermostat R–C</option>
                <option value="comp">Compressor amps</option>
                <option value="cap">Capacitor HERM–C</option>
                <option value="wind">Compressor windings (OHM)</option>
              </select>
            </label>
            <div class="dmm-lcd"><span id="dmm-val">—. —</span><small id="dmm-unit">VAC</small></div>
            <p class="dmm-note" id="dmm-note">Drop electrical parts, then probe. Never ohm a live circuit.</p>
          </div>
          <div class="manifold" id="sb-manifold">
            <div class="man-face">
              <div class="man-dial low"><span id="man-low">0</span></div>
              <div class="man-center">HVAC</div>
              <div class="man-dial high"><span id="man-high">0</span></div>
            </div>
            <p class="man-note">Manifold overlay · live</p>
          </div>
        </aside>
      </div>
    `;
  }

  function updateSysBanner() {
    const ban = document.getElementById("sb-sysbanner");
    const info = document.getElementById("sb-sysinfo");
    if (!ban || !info) return;
    if (activeSystem) {
      const s = activeSystem;
      ban.innerHTML = `<strong>${s.brand}</strong> · ${s.name} · ${s.tons} ton · SEER ${s.seer} · ${s.ref} · ${s.metering.toUpperCase()}`;
      info.innerHTML = `
        <div class="sys-card">
          <p class="sys-brand">${s.brand}</p>
          <p class="sys-name">${s.name}</p>
          <p class="sys-meta">${s.tons} ton · SEER ${s.seer} · ${s.type}</p>
          <p class="sys-notes">${s.notes}</p>
        </div>`;
    } else {
      ban.textContent = "Custom build — drop parts or load a system pack";
      info.innerHTML = `<p class="sys-empty">Load Goodman, Carrier, Daikin, Mitsubishi, LG, Samsung, Trane, Rheem, Lennox, Bryant, York — or a mini-split package.</p>`;
    }
  }

  function applySystem(sys) {
    activeSystem = sys;
    placed = Object.assign({}, sys.parts);
    refrigerant = sys.ref;
    running = false;
    particles = [];
    const refSel = document.getElementById("sb-ref");
    if (refSel) {
      refSel.value = sys.ref;
      // ensure option exists
      if (![...refSel.options].some((o) => o.value === sys.ref)) {
        const opt = document.createElement("option");
        opt.value = sys.ref;
        opt.textContent = sys.ref;
        refSel.appendChild(opt);
        refSel.value = sys.ref;
      }
    }
    refreshSlots();
    updateSysBanner();
    document.getElementById("sb-status").textContent =
      sys.brand + " package loaded — start compressor to run the sim.";
    if (onXp) onXp(10);
  }

  function paintClock() {
    const el = document.getElementById("sb-clock");
    if (!el) return;
    if (!challenge) {
      el.textContent = "";
      el.className = "sb-clock";
      return;
    }
    el.textContent = challengeWon ? "DONE  " + challenge.name : challengeLeft + "s  " + challenge.name;
    el.className = "sb-clock" + (challengeWon ? " ok" : challengeLeft <= 10 ? " low" : "");
  }

  function startChallenge(ch) {
    challenge = ch;
    challengeWon = false;
    challengeLeft = ch.time;
    placed = {};
    running = false;
    particles = [];
    activeSystem = null;
    delete host.dataset.loopXp;
    if (challengeTimer) clearInterval(challengeTimer);
    challengeTimer = setInterval(() => {
      if (!challenge || challengeWon) return;
      challengeLeft -= 1;
      paintClock();
      if (challengeLeft <= 0) {
        challengeLeft = 0;
        clearInterval(challengeTimer);
        challengeTimer = 0;
        document.getElementById("sb-status").textContent =
          "Time. Circuit incomplete. HUB: " + ch.hint;
        paintClock();
      }
    }, 1000);
    refreshSlots();
    updateSysBanner();
    paintClock();
    const ban = document.getElementById("sb-sysbanner");
    if (ban) ban.textContent = "CoolGame · " + ch.name + " · " + ch.hint;
    document.getElementById("sb-status").textContent = "Place every required part. Wrong slot won't take it. Clock is running.";
  }

  function checkChallenge() {
    if (!challenge || challengeWon) return;
    const ok = challenge.need.every((id) => placed[id] === id);
    if (!ok) return;
    challengeWon = true;
    if (challengeTimer) clearInterval(challengeTimer);
    challengeTimer = 0;
    const score = Math.max(10, challengeLeft * 10);
    document.getElementById("sb-status").textContent =
      "Circuit closed · +" + score + " pts · " + challengeLeft + "s left. Start the compressor — watch the flow.";
    const ban = document.getElementById("sb-sysbanner");
    if (ban) ban.textContent = "CoolGame complete · " + challenge.name + " · " + score + " pts";
    paintClock();
    if (onXp) onXp(Math.min(40, 15 + Math.round(challengeLeft / 4)));
    running = true;
  }

  function paintCoils() {
    const el = document.getElementById("sb-coils");
    if (el) el.textContent = "ODU coil: " + coilCond + " · IDU: " + coilEvap + " · frost " + Math.round(frost) + "% · " + (defrosting || fault === "stuck_defrost" ? "DEFROST" : hpMode);
    document.querySelectorAll(".sb-slot").forEach((s) => {
      s.classList.toggle("coil-dirty", (s.dataset.slot === "condenser" && coilCond === "dirty") || (s.dataset.slot === "evaporator" && coilEvap === "dirty"));
      s.classList.toggle("coil-frost", s.dataset.slot === "condenser" && frost > 50 && hpMode === "heat");
    });
    const talk = document.getElementById("sb-job-talk");
    if (talk && activeJob && jobMode === "mystery" && !jobSolved) {
      talk.textContent = "CUSTOMER: " + activeJob.complaint + "  ·  HUB: Gauges + SH/SC. Clean coils or swap the part. Don't shotgun.";
    }
  }

  function resetLeak() {
    leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
    paintLeak();
  }

  function leakLocated() {
    return !!(leak.visual || leak.soap || leak.sniffer);
  }

  function leakReadyToCharge() {
    return leakLocated() && leak.nitrogen && leak.repair && leak.vac;
  }

  function paintLeak() {
    const ol = document.getElementById("sb-leak-steps");
    if (!ol) return;
    const done = {
      visual: leak.visual,
      soap: leak.soap,
      sniffer: leak.sniffer,
      nitrogen: leak.nitrogen,
      repair: leak.repair,
      vac: leak.vac,
      charge: leakReadyToCharge() && chargePct >= 94 && chargePct <= 108 && fault === "none",
    };
    ol.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("done", !!done[li.dataset.k]);
    });
  }

  function loadBasePack() {
    const sys = SYSTEMS.find((s) => s.id === "goodman-gsx") || SYSTEMS[0];
    applySystem(sys);
  }

  function startRecreate() {
    jobMode = "recreate";
    activeJob = null;
    jobSolved = false;
    jobAttempts = 0;
    resetLeak();
    capBad = false;
    loadBasePack();
    running = true;
    const faultEl = document.getElementById("sb-fault");
    if (faultEl) faultEl.disabled = false;
    const talk = document.getElementById("sb-job-talk");
    if (talk) {
      talk.textContent =
        "RECREATE: set outdoor/indoor and charge to what you saw. Toggle dirty coils. Swap TXV/drier/charge and watch SH/SC. This is your truck, not a mystery.";
    }
    paintCoils();
    document.getElementById("sb-status").textContent = "Field recreate · match the job you just left.";
  }

  function startMystery(job) {
    jobMode = "mystery";
    activeJob = job;
    jobSolved = false;
    jobAttempts = 0;
    resetLeak();
    loadBasePack();
    outdoorF = job.outdoor;
    indoorF = job.indoor;
    chargePct = job.charge;
    coilCond = job.coilCond;
    coilEvap = job.coilEvap;
    fault = job.fault;
    capBad = !!job.capBad;
    hpMode = job.hpMode || "cool";
    frost = job.fault === "defrost_fail" ? 88 : job.fault === "stuck_defrost" ? 20 : 0;
    defrosting = job.fault === "stuck_defrost";
    running = true;
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (el) el.value = String(v);
    };
    set("sb-out", outdoorF);
    set("sb-in", indoorF);
    set("sb-charge", chargePct);
    set("sb-mode", hpMode);
    const ov = document.getElementById("sb-out-v");
    const iv = document.getElementById("sb-in-v");
    const cv = document.getElementById("sb-charge-v");
    if (ov) ov.textContent = outdoorF;
    if (iv) iv.textContent = indoorF;
    if (cv) cv.textContent = chargePct;
    const faultEl = document.getElementById("sb-fault");
    if (faultEl) {
      faultEl.value = "none";
      faultEl.disabled = true;
    }
    paintCoils();
    document.getElementById("sb-status").textContent = "Mystery call. Diagnose, then repair. Fault list is locked.";
  }

  function jobIsHealthy() {
    const chargeOk = chargePct >= 94 && chargePct <= 108;
    const coilsOk = coilCond === "clean" && coilEvap === "clean";
    const leakOk = !activeJob || activeJob.fault !== "undercharge" || leakReadyToCharge();
    const capOk = !activeJob || !activeJob.capBad || !capBad;
    const defrostOk =
      !activeJob ||
      (activeJob.fault !== "defrost_fail" && activeJob.fault !== "stuck_defrost") ||
      (fault === "none" && frost < 25 && !defrosting);
    return coilsOk && fault === "none" && chargeOk && leakOk && capOk && defrostOk;
  }

  function requestNitrogen(onOk) {
    const modal = document.getElementById("sb-n2-modal");
    if (!modal) {
      if (n2Acked || window.confirm("N₂ SAFETY: regulator, dry nitrogen only, never oxygen or shop air, asphyxiation hazard. Continue?")) {
        n2Acked = true;
        if (onOk) onOk();
      }
      return;
    }
    modal.classList.remove("hidden");
    const go = document.getElementById("sb-n2-go");
    const no = document.getElementById("sb-n2-no");
    const done = (ok) => {
      modal.classList.add("hidden");
      if (ok) {
        n2Acked = true;
        if (onOk) onOk();
      } else {
        document.getElementById("sb-status").textContent = "N₂ cancelled. No standing test without a regulator and dry nitrogen.";
      }
    };
    if (go) go.onclick = () => done(true);
    if (no) no.onclick = () => done(false);
  }

  function applyRepair(kind) {
    jobAttempts += 1;
    if (kind === "clean-odu") coilCond = "clean";
    if (kind === "clean-idu") coilEvap = "clean";
    if (kind === "replace-filter") coilEvap = "clean";
    if (kind === "replace-cap") {
      capBad = false;
      placed.capacitor = "capacitor";
      refreshSlots();
    }
    if (kind === "replace-rv") {
      placed.revvalve = "revvalve";
      if (fault === "rv_stuck_heat" || fault === "rv_stuck_cool" || fault === "rv_bleed") fault = "none";
      refreshSlots();
    }
    if (kind === "shift-heat") {
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "heat";
    }
    if (kind === "shift-cool") {
      hpMode = "cool";
      defrosting = false;
      const m = document.getElementById("sb-mode");
      if (m) m.value = "cool";
    }
    if (kind === "force-defrost") {
      defrosting = true;
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "defrost";
      document.getElementById("sb-status").textContent = "Forced defrost. RV → cool, ODU fan OFF. Watch frost % drop.";
    }
    if (kind === "end-defrost") {
      defrosting = false;
      if (fault === "stuck_defrost") fault = "none";
      hpMode = "heat";
      const m = document.getElementById("sb-mode");
      if (m) m.value = "heat";
    }
    if (kind === "replace-defrost") {
      if (fault === "defrost_fail" || fault === "stuck_defrost") fault = "none";
      defrosting = frost > 40;
      document.getElementById("sb-status").textContent = "Defrost sensor/board replaced. Force a defrost if the coil is still a brick.";
    }
    if (kind === "dirty-odu") coilCond = "dirty";
    if (kind === "dirty-idu") coilEvap = "dirty";
    if (kind === "leak-visual") {
      leak.visual = true;
      document.getElementById("sb-status").textContent = "Oil at the schrader / flare. Visual is step 1 — confirm with soap or a sniffer.";
    }
    if (kind === "leak-soap") {
      leak.soap = true;
      document.getElementById("sb-status").textContent = "Bubbles on the joint. Mark it. Don't bury it in dye and walk away.";
    }
    if (kind === "leak-sniffer") {
      leak.sniffer = true;
      document.getElementById("sb-status").textContent = "Sniffer hit. Move 1–2 in/s, from below — refrigerant is heavier than air.";
    }
    if (kind === "leak-n2") {
      requestNitrogen(function () {
        leak.nitrogen = true;
        document.getElementById("sb-status").textContent =
          "Standing N₂. Regulator on. Dry gas only. Never oxygen/shop air. Watch decay — then repair.";
        paintLeak();
        paintCoils();
      });
      return;
    }
    if (kind === "leak-repair") {
      if (!leakLocated()) {
        document.getElementById("sb-status").textContent = "HUB: you haven't found it. Visual, soap, or sniffer first.";
        paintLeak();
        return;
      }
      leak.repair = true;
      document.getElementById("sb-status").textContent = "Leak repaired (braze / new schrader / new TXV). Now N₂ prove-out if you haven't, then evacuate.";
    }
    if (kind === "weigh-in") {
      const leakJob = (fault === "undercharge") || (activeJob && activeJob.fault === "undercharge");
      if (leakJob && !leakReadyToCharge()) {
        chargePct = Math.min(90, chargePct + 8);
        const c = document.getElementById("sb-charge");
        if (c) c.value = String(chargePct);
        const cv = document.getElementById("sb-charge-v");
        if (cv) cv.textContent = chargePct;
        document.getElementById("sb-status").textContent =
          "Top-off of a leaker. Charge will bleed down. Locate → N₂ → repair → vac → weigh-in. Commandment 5.";
        paintLeak();
        paintCoils();
        return;
      }
      chargePct = 100;
      if (fault === "undercharge" || fault === "overcharge") fault = "none";
      const c = document.getElementById("sb-charge");
      if (c) c.value = "100";
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = "100";
    }
    if (kind === "add-charge") {
      chargePct = Math.min(130, chargePct + 6);
      const c = document.getElementById("sb-charge");
      if (c) c.value = String(chargePct);
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = chargePct;
    }
    if (kind === "pull-charge") {
      chargePct = Math.max(50, chargePct - 6);
      const c = document.getElementById("sb-charge");
      if (c) c.value = String(chargePct);
      const cv = document.getElementById("sb-charge-v");
      if (cv) cv.textContent = chargePct;
    }
    if (kind === "replace-txv") {
      placed.metering = "metering";
      if (fault === "txv_closed" || fault === "txv_open") fault = "none";
      refreshSlots();
    }
    if (kind === "replace-drier") {
      placed.filter = "filter";
      if (fault === "restricted") fault = "none";
      refreshSlots();
    }
    if (kind === "vac-air") {
      leak.vac = true;
      if (fault === "noncondensables") fault = "none";
      if (leak.repair && !leak.nitrogen) {
        document.getElementById("sb-status").textContent = "You pulled a vacuum without an N₂ proof. HUB: standing pressure first, then microns.";
      }
    }
    paintCoils();
    paintLeak();
    if (jobMode === "mystery" && activeJob && !jobSolved && jobIsHealthy()) {
      jobSolved = true;
      const xp = Math.max(20, 80 - jobAttempts * 8);
      if (onXp) onXp(xp);
      document.getElementById("sb-status").textContent =
        "FIXED in " + jobAttempts + " moves · +" + xp + " XP. HUB: " + activeJob.fix;
      const talk = document.getElementById("sb-job-talk");
      if (talk) talk.textContent = "Job closed. " + activeJob.fix;
      const faultEl = document.getElementById("sb-fault");
      if (faultEl) {
        faultEl.disabled = false;
        faultEl.value = "none";
      }
    } else if (jobMode === "mystery" && activeJob && !jobSolved) {
      document.getElementById("sb-status").textContent =
        "Still broken (" + jobAttempts + "). Read SH and SC together. HUB: airflow and charge before you condemn the TXV.";
    } else {
      document.getElementById("sb-status").textContent =
        "Repair applied · ODU " + coilCond + " · IDU " + coilEvap + " · charge " + chargePct + "%";
    }
  }

  function renderPalette(tab) {
    const box = document.getElementById("sb-items");
    box.innerHTML = "";
    if (tab === "challenges") {
      CHALLENGES.forEach((ch) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML =
          `<span class="ico">⏱</span><div><strong>${ch.name}</strong><small>${ch.time}s · ${ch.need.length} parts · ${ch.hint}</small></div>`;
        el.onclick = () => startChallenge(ch);
        box.appendChild(el);
      });
      return;
    }
    if (tab === "field") {
      const rec = document.createElement("div");
      rec.className = "sb-item system";
      rec.innerHTML = `<span class="ico">📋</span><div><strong>Recreate field job</strong><small>Set temps, dirty/clean coils, charge — match what you saw</small></div>`;
      rec.onclick = startRecreate;
      box.appendChild(rec);
      FIELD_JOBS.forEach((j) => {
        const el = document.createElement("div");
        el.className = "sb-item system";
        el.innerHTML = `<span class="ico">🔧</span><div><strong>${j.name}</strong><small>${j.complaint}</small></div>`;
        el.onclick = () => startMystery(j);
        box.appendChild(el);
      });
      return;
    }
    if (tab === "systems") {
      // group by brand
      const brands = [];
      SYSTEMS.forEach((s) => {
        if (!brands.includes(s.brand)) brands.push(s.brand);
      });
      brands.forEach((brand) => {
        const head = document.createElement("div");
        head.className = "sb-brand-head";
        head.textContent = brand;
        box.appendChild(head);
        SYSTEMS.filter((s) => s.brand === brand).forEach((s) => {
          const el = document.createElement("div");
          el.className = "sb-item system";
          el.dataset.sys = s.id;
          const tag =
            s.type.indexOf("minisplit") >= 0
              ? "Mini-split"
              : s.type.indexOf("inverter") >= 0
                ? "Inverter"
                : s.type.indexOf("hp") >= 0
                  ? "Heat pump"
                  : "Split AC";
          el.innerHTML = `<span class="ico">🏷</span><div><strong>${s.name}</strong><small>${s.tons}t · ${s.ref} · SEER ${s.seer} · ${tag}</small></div>`;
          el.onclick = () => applySystem(s);
          box.appendChild(el);
        });
      });
      return;
    }
    COMPONENTS.filter((c) => c.group === tab).forEach((c) => {
      const el = document.createElement("div");
      el.className = "sb-item" + (c.required ? " sb-item-core" : "");
      el.draggable = true;
      el.dataset.id = c.id;
      el.innerHTML = partThumb(c) + `<div><strong>${c.name}</strong><small>${c.desc}</small></div>`;
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", c.id);
        e.dataTransfer.effectAllowed = "copy";
        if (window.LtDrag && window.LtDrag.setHtml5Image) {
          window.LtDrag.setHtml5Image(e, { html: partThumb(c), label: c.name });
        }
      });
      if (window.LtDrag && c.slot) {
        window.LtDrag.bindSource(el, {
          id: c.id,
          html: partThumb(c) + "<strong>" + c.name + "</strong>",
          slotSelector: "#sb-slots .sb-slot",
          onDrop(slotId, id) {
            place(slotId, id);
          },
        });
      }
      el.addEventListener("click", () => {
        if (c.slot && !placed[c.slot]) {
          place(c.slot, c.id);
          activeSystem = null;
          updateSysBanner();
        } else if (c.id === "gauges") {
          gaugesEquipped = true;
          document.getElementById("sb-manifold").classList.add("on");
        } else if (c.id === "dmm") {
          const panel = document.getElementById("sb-dmm");
          if (panel) panel.classList.add("on");
          updateDmm(simulate());
        } else if (c.id === "nitrogen") {
          requestNitrogen(function () {
            document.getElementById("sb-status").textContent =
              "Dry N₂ on the cart. Regulator on. Purge while brazing; standing test for leaks. Never oxygen. Never shop air.";
          });
        }
      });
      box.appendChild(el);
    });
  }

  function place(slotId, compId) {
    const def = COMPONENTS.find((c) => c.id === compId);
    if (!def || !def.slot || def.slot !== slotId) {
      if (def && def.slot && def.slot !== slotId) return;
    }
    if (!def || !def.slot) return;
    placed[slotId] = compId;
    activeSystem = null;
    refreshSlots();
    updateSysBanner();
    if (challenge) checkChallenge();
    if (requiredComplete() && onXp) {
      if (!host.dataset.loopXp) {
        host.dataset.loopXp = "1";
        onXp(25);
      }
    }
  }

  function refreshSlots() {
    document.querySelectorAll(".sb-slot").forEach((el) => {
      const id = el.dataset.slot;
      const cid = placed[id];
      el.classList.toggle("filled", !!cid);
      el.classList.toggle("required", ["compressor", "condenser", "metering", "evaporator"].includes(id));
      if (cid) {
        const def = COMPONENTS.find((c) => c.id === cid);
        el.innerHTML = `${partThumb(def)}<strong>${def.name}</strong><button class="rm" data-rm="${id}">×</button>`;
      } else {
        const slot = SLOTS.find((s) => s.id === id);
        el.innerHTML = `<span class="empty">Drop ${slot.label}</span>`;
      }
    });
    document.querySelectorAll(".rm").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        delete placed[b.dataset.rm];
        refreshSlots();
        if (!requiredComplete()) running = false;
      };
    });
    paintCoils();
  }

  function resetLeak() {
    leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
    paintLeak();
  }

  function leakLocated() {
    return !!(leak.visual || leak.soap || leak.sniffer);
  }

  function leakReadyToCharge() {
    return leakLocated() && leak.nitrogen && leak.repair && leak.vac;
  }

  function paintLeak() {
    const ol = document.getElementById("sb-leak-steps");
    if (!ol) return;
    const done = {
      visual: leak.visual,
      soap: leak.soap,
      sniffer: leak.sniffer,
      nitrogen: leak.nitrogen,
      repair: leak.repair,
      vac: leak.vac,
      charge: leakReadyToCharge() && chargePct >= 94 && chargePct <= 108 && fault === "none",
    };
    ol.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("done", !!done[li.dataset.k]);
    });
  }

  function layoutSlots() {
    const wrap = document.getElementById("sb-slots");
    wrap.innerHTML = "";
    SLOTS.forEach((s) => {
      const el = document.createElement("div");
      el.className = "sb-slot";
      el.dataset.slot = s.id;
      el.style.left = s.x * 100 + "%";
      el.style.top = s.y * 100 + "%";
      el.addEventListener("dragover", (e) => {
        e.preventDefault();
        el.classList.add("over");
      });
      el.addEventListener("dragleave", () => el.classList.remove("over"));
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        el.classList.remove("over");
        const id = e.dataTransfer.getData("text/plain");
        const def = COMPONENTS.find((c) => c.id === id);
        if (def && def.slot === s.id) place(s.id, id);
      });
      wrap.appendChild(el);
    });
    refreshSlots();
  }

  function paintDefrostDiagram(sim) {
    const root = document.getElementById("sb-defrost-d");
    if (!root) return;
    const on = (id, live) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle("live", !!live);
    };
    const set = (id, t) => {
      const el = document.getElementById(id);
      if (el) el.textContent = t;
    };
    const run = !!(sim && sim.running);
    const df = !!(sim && sim.defrosting);
    const heat = !!(sim && sim.hpMode === "heat" && !df);
    const cool = !!(sim && sim.hpMode === "cool" && !df);
    const fail = fault === "defrost_fail";
    on("df-r", run);
    on("df-stat", run);
    on("df-board", run);
    on("df-coil", run && (heat || df || fail));
    on("df-amb", run && outdoorF < 42);
    on("df-rv", run && (cool || df));
    on("df-fan", run && !df);
    on("df-cc", run);
    on("df-aux", run && (df || frost > 70));
    set("df-board-mode", !run ? "OFF" : df ? "DEFROST" : heat ? "HEAT" : "COOL");
    set("df-board-led", !run ? "LED off" : fail ? "NO DEFROST FAULT" : df ? "LED ON · fan off" : "standby");
    set("df-rv-st", run && (cool || df) ? "ENERGIZED (O)" : "de-energized");
    set("df-fan-st", !run ? "off" : df ? "OFF for defrost" : "ON");
    set("df-cc-st", run ? "Y pulled in" : "open");
    set("df-aux-st", run && (df || frost > 70) ? "W ON" : "off");
  }

  function updateGauges(sim) {
    const fmt = (n, d = 0) => (sim.running ? n.toFixed(d) : "—");
    document.getElementById("g-plow").textContent = fmt(sim.pLow, 1);
    document.getElementById("g-phigh").textContent = fmt(sim.pHigh, 1);
    document.getElementById("g-tsatl").textContent = sim.running ? "sat " + sim.tSatLow.toFixed(0) + " °F" : "sat — °F";
    document.getElementById("g-tsath").textContent = sim.running ? "sat " + sim.tSatHigh.toFixed(0) + " °F" : "sat — °F";
    document.getElementById("g-tsuc").textContent = sim.running ? sim.tSuction.toFixed(0) + " °F" : "—";
    document.getElementById("g-tliq").textContent = sim.running ? sim.tLiquid.toFixed(0) + " °F" : "—";
    document.getElementById("g-sh").textContent = sim.running ? sim.sh.toFixed(0) + " °F" : "—";
    document.getElementById("g-sc").textContent = sim.running ? sim.sc.toFixed(0) + " °F" : "—";
    const shEl = document.getElementById("g-sh");
    const scEl = document.getElementById("g-sc");
    if (shEl) shEl.classList.toggle("out", !!(sim.running && sim.shOk === false));
    if (shEl) shEl.classList.toggle("in", !!(sim.running && sim.shOk));
    if (scEl) scEl.classList.toggle("out", !!(sim.running && sim.scOk === false));
    if (scEl) scEl.classList.toggle("in", !!(sim.running && sim.scOk));
    const tgt = document.getElementById("g-tgt");
    const dt = document.getElementById("g-dt");
    const gl = document.getElementById("g-glass");
    const fp = document.getElementById("sb-fp");
    if (tgt) tgt.textContent = sim.running ? sim.tgtSH + " / " + sim.tgtSC + " °F" : "—";
    if (dt) dt.textContent = sim.running ? sim.deltaT.toFixed(0) + " °F" : "—";
    if (gl) gl.textContent = sim.running ? sim.glass : "—";
    if (fp) fp.textContent = sim.running ? sim.fp : "HUB: close the loop, start the compressor, then read SH and SC together.";
    paintDefrostDiagram(sim);
    const cap = document.getElementById("g-cap");
    const cop = document.getElementById("g-cop");
    const amps = document.getElementById("g-amps");
    if (cap) cap.textContent = sim.running ? sim.tons.toFixed(1) + " t · " + sim.btuh.toLocaleString() + " Btuh" : "—";
    if (cop) cop.textContent = sim.running ? sim.cop.toFixed(2) : "—";
    if (amps) amps.textContent = sim.running ? sim.amps.toFixed(1) + " A" : "—";
    document.getElementById("sb-status").textContent = sim.status;
    document.getElementById("man-low").textContent = sim.running ? Math.round(sim.pLow) : "0";
    document.getElementById("man-high").textContent = sim.running ? Math.round(sim.pHigh) : "0";
    document.getElementById("sb-run").textContent = running ? "Stop compressor" : "Start compressor";
    updateDmm(sim);
    drawPH(sim);
    updateBom();
  }

  function updateBom() {
    const ul = document.getElementById("sb-bom");
    if (!ul) return;
    const ids = Object.values(placed);
    if (!ids.length) {
      ul.innerHTML = "<li>Empty board</li>";
      return;
    }
    ul.innerHTML = ids
      .map((id) => {
        const c = COMPONENTS.find((x) => x.id === id);
        return "<li>" + (c ? c.name : id) + (c && c.desc ? " <small>" + c.desc + "</small>" : "") + "</li>";
      })
      .join("");
  }

  function drawPH(sim) {
    const c = document.getElementById("sb-ph");
    if (!c) return;
    const g = c.getContext("2d");
    const w = c.width;
    const h = c.height;
    g.clearRect(0, 0, w, h);
    g.fillStyle = "#0c141c";
    g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(255,255,255,0.12)";
    g.strokeRect(0.5, 0.5, w - 1, h - 1);
    // dome
    g.beginPath();
    g.strokeStyle = "rgba(255,213,74,0.55)";
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      const x = 24 + t * (w - 48);
      const y = h - 18 - Math.sin(t * Math.PI) * (h * 0.62);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.fillStyle = "rgba(242,245,248,0.45)";
    g.font = "9px sans-serif";
    g.fillText("h →", w - 28, h - 6);
    g.save();
    g.translate(10, h / 2);
    g.rotate(-Math.PI / 2);
    g.fillText("P", 0, 0);
    g.restore();
    if (!sim.running) {
      g.fillStyle = "#8b98a5";
      g.fillText("Start compressor to plot 1-2-3-4", 40, h / 2);
      return;
    }
    const pMin = 0;
    const pMax = Math.max(400, sim.pHigh * 1.15);
    const yP = (p) => h - 16 - ((p - pMin) / (pMax - pMin)) * (h - 32);
    const xH = (n) => 28 + n * (w - 56); // 0-1 enthalpy param
    // 1 suction vapor, 2 discharge, 3 liquid, 4 after TXV
    const pts = [
      { n: 1, x: 0.62, p: sim.pLow },
      { n: 2, x: 0.88, p: sim.pHigh },
      { n: 3, x: 0.28, p: sim.pHigh },
      { n: 4, x: 0.32, p: sim.pLow },
    ];
    g.strokeStyle = "#CE0034";
    g.lineWidth = 2;
    g.beginPath();
    pts.concat([pts[0]]).forEach((pt, i) => {
      const x = xH(pt.x);
      const y = yP(pt.p);
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.stroke();
    pts.forEach((pt) => {
      const x = xH(pt.x);
      const y = yP(pt.p);
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(x, y, 4, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = "#ffd54a";
      g.fillText(String(pt.n), x + 6, y - 6);
    });
  }

  function elecReady() {
    return !!(placed.disconnect && placed.contactor && placed.capacitor && placed.transformer && placed.thermostat);
  }

  function updateDmm(sim) {
    const valEl = document.getElementById("dmm-val");
    const unitEl = document.getElementById("dmm-unit");
    const noteEl = document.getElementById("dmm-note");
    if (!valEl) return;
    const has = (id) => !!placed[id];
    const live = sim.running && has("disconnect") && has("contactor") && has("thermostat") && has("transformer");
    let val = "OL";
    let unit = "VAC";
    let note = "Drop electrical parts on the left column, then probe.";
    const mode = dmmMode;
    const probe = dmmProbe;

    if (mode === "vac") {
      unit = "VAC";
      if (probe === "l1l2") {
        val = has("disconnect") ? "240.2" : "240.2";
        note = has("disconnect") ? "Line voltage present at disconnect." : "You can still read line ahead of a missing disconnect — install one before load.";
      } else if (probe === "load") {
        val = has("disconnect") ? "239.8" : "0.00";
        note = has("disconnect") ? "Load side hot." : "No disconnect — load is dead. Do not jump it.";
      } else if (probe === "coil") {
        val = live ? "26.4" : has("transformer") && has("thermostat") ? "0.12" : "0.00";
        note = live ? "Y is calling. Coil pulled in." : "No 24V call — check R/C, stat, and transformer.";
      } else if (probe === "ob") {
        const energized = (hpMode === "cool"); // training: O energized in cool (most brands)
        val = live && has("revvalve") ? (energized ? "26.1" : "0.08") : live ? "0.00" : "0.00";
        note = !has("revvalve")
          ? "No reversing valve on the board — drop a 4-way for a heat pump."
          : fault === "rv_stuck_heat" && hpMode === "cool"
            ? "24V at the coil, slider didn't move. That's a stuck valve, not a dead solenoid."
            : energized
              ? "O energized (most brands shift in COOL). Listen for the click. Rheem/Ruud often use B in heat."
              : "O/B de-energized. Call the other mode and watch pressures swap.";
      } else if (probe === "rc") {
        val = has("transformer") ? "27.1" : "0.00";
        note = has("transformer") ? "Control transformer healthy." : "No transformer — C and R are dead.";
      } else {
        val = "—";
        note = "Switch function to AAC for compressor amps, OHMS for windings/cap.";
      }
    } else if (mode === "aac") {
      unit = "A";
      if (probe === "comp") {
        if (!has("capacitor") && live) {
          val = "0.0";
          note = "Open/weak cap — compressor will not start. Hum, no amps.";
        } else if (live) {
          val = "13.6";
          note = "Running load amps in range for a 3-ton. Clamp one leg only.";
        } else {
          val = "0.00";
          note = "Compressor not running. Get a Y call first.";
        }
      } else {
        val = "0.00";
        note = "Clamp the compressor lead (black) — not both L1 and L2.";
      }
    } else if (mode === "ohm") {
      unit = "Ω";
      if (sim.running) {
        val = "OL";
        note = "Never ohm a live circuit. Stop the compressor and lock it out.";
      } else if (probe === "cap") {
        val = has("capacitor") ? (capBad ? "8.1" : "35.4") : "OL";
        note = !has("capacitor")
          ? "No capacitor in the circuit."
          : capBad
            ? "µF is low vs nameplate. Replace the cap. Lock out first."
            : "HERM–C in the training band. Still confirm the can vs OEM.";
      } else if (probe === "wind") {
        val = has("compressor") ? "1.8" : "OL";
        note = has("compressor") ? "Common–run winding in spec. Compare C-S and C-R." : "No compressor to meg.";
      } else {
        val = "OL";
        note = "Use windings or capacitor probe in ohms. Lockout first.";
      }
    } else {
      unit = "CONT";
      if (probe === "coil") {
        val = has("contactor") ? "BEEP" : "OL";
        note = has("contactor") ? "Coil circuit closed." : "No contactor — open.";
      } else if (probe === "wind") {
        val = has("compressor") ? "BEEP" : "OL";
        note = has("compressor") ? "Winding continuity good. Still check to ground." : "Nothing to ring out.";
      } else {
        val = "OL";
        note = "Continuity is for coils and windings with power OFF.";
      }
    }
    valEl.textContent = val;
    unitEl.textContent = unit;
    noteEl.textContent = note;
    if (!elecReady() && sim.running) {
      const st = document.getElementById("sb-status");
      if (st && requiredComplete()) st.textContent = "Running on refrigerant loop — finish electrical (disconnect, contactor, cap, 24V, stat) for a legal start.";
    }
  }

  function draw() {
    if (!canvas) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (canvas.width !== Math.floor(w * dpr) || canvas.height !== Math.floor(h * dpr)) {
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // board background
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0e1620");
    g.addColorStop(1, "#121c28");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // grid
    ctx.strokeStyle = "rgba(45,212,191,0.05)";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // pipe loop
    ctx.lineWidth = 14;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#2a3644";
    ctx.beginPath();
    FLOW_PATH.forEach((p, i) => {
      const x = p[0] * w;
      const y = p[1] * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();

    // colored phase pipes when running
    if (requiredComplete()) {
      const segs = FLOW_PATH.length;
      for (let i = 0; i < segs; i++) {
        const t0 = i / segs;
        const a = FLOW_PATH[i];
        const b = FLOW_PATH[(i + 1) % segs];
        ctx.beginPath();
        ctx.moveTo(a[0] * w, a[1] * h);
        ctx.lineTo(b[0] * w, b[1] * h);
        ctx.strokeStyle = running ? PHASE_COLOR[phaseAt(t0)] : "#3a4a5c";
        ctx.lineWidth = 8;
        ctx.globalAlpha = running ? 0.85 : 0.4;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // direction arrows
    if (running) {
      for (let i = 0; i < FLOW_PATH.length; i += 2) {
        const a = FLOW_PATH[i];
        const b = FLOW_PATH[(i + 1) % FLOW_PATH.length];
        const mx = ((a[0] + b[0]) / 2) * w;
        const my = ((a[1] + b[1]) / 2) * h;
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(ang);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // particles
    for (const p of particles) {
      const [nx, ny] = lerpPath(p.t);
      const x = nx * w;
      const y = ny * h;
      ctx.beginPath();
      ctx.fillStyle = PHASE_COLOR[phaseAt(p.t)];
      ctx.globalAlpha = 0.9;
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
      // glow
      ctx.globalAlpha = 0.25;
      ctx.arc(x, y, p.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // title
    ctx.fillStyle = "rgba(139,154,171,0.7)";
    ctx.font = "12px IBM Plex Sans, sans-serif";
    ctx.fillText("Vapor-compression cycle · refrigerant flow", 16, 22);
  }

  function tick(now) {
    animT = now;
    const sim = simulate();
    updateGauges(sim);

    if (running && requiredComplete()) {
      if (hpMode === "heat" && outdoorF < 42 && !defrosting && fault !== "stuck_defrost") {
        const rate = fault === "defrost_fail" ? 0.55 : 0.22;
        frost = Math.min(100, frost + rate);
      }
      if (defrosting && fault !== "stuck_defrost") {
        frost = Math.max(0, frost - 1.1);
        if (frost <= 4) {
          defrosting = false;
          hpMode = "heat";
          const m = document.getElementById("sb-mode");
          if (m) m.value = "heat";
        }
      }
      if (fault === "stuck_defrost") {
        defrosting = true;
        frost = Math.max(0, frost - 0.4);
      }
      if (fault === "defrost_fail") defrosting = false;
      // spawn particles
      if (particles.length < 28 && Math.random() < 0.4) {
        particles.push({ t: Math.random(), r: 3 + Math.random() * 2.5, speed: 0.08 + Math.random() * 0.06 });
      }
      const dt = 0.016;
      for (const p of particles) {
        p.t += p.speed * dt;
        if (p.t >= 1) p.t -= 1;
      }
    } else {
      particles = [];
    }
    paintCoils();
    draw();
    raf = requestAnimationFrame(tick);
  }

  function wire() {
    document.querySelectorAll(".sb-tab").forEach((tab) => {
      tab.onclick = () => {
        document.querySelectorAll(".sb-tab").forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        renderPalette(tab.dataset.tab);
      };
    });
    renderPalette("parts");
    layoutSlots();
    updateSysBanner();

    document.getElementById("sb-ref").onchange = (e) => {
      refrigerant = e.target.value;
    };
    document.getElementById("sb-out").oninput = (e) => {
      outdoorF = +e.target.value;
      document.getElementById("sb-out-v").textContent = outdoorF;
    };
    document.getElementById("sb-in").oninput = (e) => {
      indoorF = +e.target.value;
      document.getElementById("sb-in-v").textContent = indoorF;
    };
    document.getElementById("sb-charge").oninput = (e) => {
      chargePct = +e.target.value;
      document.getElementById("sb-charge-v").textContent = chargePct;
    };
    document.getElementById("sb-fault").onchange = (e) => {
      fault = e.target.value;
    };
    const modeEl = document.getElementById("sb-mode");
    if (modeEl) {
      modeEl.onchange = (e) => {
        const v = e.target.value;
        if (v === "defrost") {
          defrosting = true;
          hpMode = "heat";
        } else {
          defrosting = false;
          hpMode = v;
        }
      };
    }
    const txvEl = document.getElementById("sb-txv");
    if (txvEl) {
      txvEl.oninput = (e) => {
        txvTarget = +e.target.value;
        document.getElementById("sb-txv-v").textContent = txvTarget;
      };
    }
    document.getElementById("sb-run").onclick = () => {
      if (!requiredComplete()) {
        document.getElementById("sb-status").textContent = "Need compressor, condenser, metering device, and evaporator.";
        return;
      }
      running = !running;
      if (running && onXp) onXp(15);
      updateDmm(simulate());
    };
    const dmmModeEl = document.getElementById("dmm-mode");
    const dmmProbeEl = document.getElementById("dmm-probe");
    if (dmmModeEl) dmmModeEl.onchange = (e) => { dmmMode = e.target.value; updateDmm(simulate()); };
    if (dmmProbeEl) dmmProbeEl.onchange = (e) => { dmmProbe = e.target.value; updateDmm(simulate()); };
    document.getElementById("sb-dmm").classList.add("on");
    document.querySelectorAll("#sb-repairs [data-fix]").forEach((b) => {
      b.onclick = () => applyRepair(b.dataset.fix);
    });
    document.getElementById("sb-clear").onclick = () => {
      placed = {};
      running = false;
      particles = [];
      gaugesEquipped = false;
      activeSystem = null;
      coilCond = "clean";
      coilEvap = "clean";
      jobMode = null;
      activeJob = null;
      const faultEl = document.getElementById("sb-fault");
      if (faultEl) faultEl.disabled = false;
      document.getElementById("sb-manifold").classList.remove("on");
      delete host.dataset.loopXp;
      refreshSlots();
      updateSysBanner();
    };
  }

  function start(root, opts) {
    host = root;
    onXp = opts && opts.onXp;
    placed = {};
    running = false;
    particles = [];
    refrigerant = "R-410A";
    outdoorF = 95;
    indoorF = 75;
    chargePct = 100;
    fault = "none";
    coilCond = "clean";
    coilEvap = "clean";
    jobMode = null;
    activeJob = null;
    jobSolved = false;
    leak = { visual: false, soap: false, sniffer: false, nitrogen: false, repair: false, vac: false };
    capBad = false;
    hpMode = "cool";
    frost = 0;
    defrosting = false;
    gaugesEquipped = false;
    activeSystem = null;
    buildUI(root);
    canvas = document.getElementById("sb-canvas");
    ctx = canvas.getContext("2d");
    wire();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
    return {
      stop() {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        if (challengeTimer) clearInterval(challengeTimer);
        challengeTimer = 0;
      },
      getHubBtn() {
        return document.getElementById("sb-hub");
      },
      getSnapshot() {
        return {
          placed: { ...placed },
          refrigerant,
          outdoorF,
          indoorF,
          chargePct,
          fault,
          activeSystem,
        };
      },
      loadSnapshot(snap) {
        if (!snap || typeof snap !== "object") return;
        placed = snap.placed && typeof snap.placed === "object" ? { ...snap.placed } : {};
        if (snap.refrigerant) refrigerant = snap.refrigerant;
        if (typeof snap.outdoorF === "number") outdoorF = snap.outdoorF;
        if (typeof snap.indoorF === "number") indoorF = snap.indoorF;
        if (typeof snap.chargePct === "number") chargePct = snap.chargePct;
        if (snap.fault) fault = snap.fault;
        activeSystem = snap.activeSystem || null;
        const refEl = document.getElementById("sb-ref");
        const outEl = document.getElementById("sb-out");
        const inEl = document.getElementById("sb-in");
        const chEl = document.getElementById("sb-charge");
        const fEl = document.getElementById("sb-fault");
        if (refEl) refEl.value = refrigerant;
        if (outEl) outEl.value = String(outdoorF);
        if (inEl) inEl.value = String(indoorF);
        if (chEl) chEl.value = String(chargePct);
        if (fEl) fEl.value = fault;
        const ov = document.getElementById("sb-out-v");
        const iv = document.getElementById("sb-in-v");
        const cv = document.getElementById("sb-charge-v");
        if (ov) ov.textContent = String(outdoorF);
        if (iv) iv.textContent = String(indoorF);
        if (cv) cv.textContent = String(chargePct);
        refreshSlots();
        updateSysBanner();
      },
    };
  }

  global.HVACSandbox = { start };
})(window);
