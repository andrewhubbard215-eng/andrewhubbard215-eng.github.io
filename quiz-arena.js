/* All-Star Quiz Arena — Kahoot-style
   EPA 608 · OSHA 30 · Lincoln Tech HVAC curriculum
   Solo + Classroom party (PIN lobby via BroadcastChannel on same origin) */
(function (global) {
  "use strict";

  // ---------- Question banks ----------
  const BANK = {
    epa608: [
      {
        q: "Before opening a system that contains refrigerant, you must:",
        choices: ["Vent to atmosphere carefully", "Recover the refrigerant", "Add nitrogen until empty", "Run the compressor in pump-down only"],
        a: 1,
        why: "EPA Section 608 requires recovery before opening. Venting is illegal.",
      },
      {
        q: "Which device measures deep vacuum most accurately for evacuation?",
        choices: ["Compound manifold gauge", "Digital micron gauge", "Pocket thermometer", "Amp clamp"],
        a: 1,
        why: "Microns measure absolute pressure. Compound gauges are not precise enough for deep vacuum.",
      },
      {
        q: "A common deep-vacuum target before opening service valves on a new install is:",
        choices: ["30 psig", "0 psig on the compound gauge only", "500 microns or less", "29 inHg for 30 seconds"],
        a: 2,
        why: "≤500 microns with a holding/decay test is industry standard practice.",
      },
      {
        q: "Recovered refrigerant should be stored in:",
        choices: ["Any empty paint can", "DOT-approved recovery cylinders", "Plastic jugs", "Open buckets outdoors"],
        a: 1,
        why: "Only approved refillable recovery cylinders, used within fill limits.",
      },
      {
        q: "Mixing different refrigerants in a recovery cylinder is:",
        choices: ["Fine if pressures are similar", "Recommended for capacity", "Not allowed / creates hazardous mixtures", "Required for Type III"],
        a: 2,
        why: "Never mix refrigerants in recovery tanks.",
      },
      {
        q: "Type II certification primarily covers:",
        choices: ["Small appliances only", "High-pressure and very high-pressure appliances (excluding small appliances & MVAC)", "Motor vehicle AC only", "Only chillers using low-pressure refrigerants"],
        a: 1,
        why: "Type II is for high-pressure equipment excluding small appliances and MVAC.",
      },
      {
        q: "Ozone depletion is associated most with which older refrigerant class?",
        choices: ["HFCs only", "CFCs and HCFCs", "Hydrocarbons only", "CO₂ (R-744)"],
        a: 1,
        why: "CFCs/HCFCs contain chlorine that depletes ozone; HFCs are greenhouse gases but not ODP in the same way.",
      },
      {
        q: "The sale of CFC and HCFC refrigerants is restricted to:",
        choices: ["Anyone over 18", "Certified technicians", "Homeowners only", "Only EPA employees"],
        a: 1,
        why: "Technician certification is required to purchase restricted refrigerants.",
      },
      {
        q: "When using nitrogen to leak-test, you should:",
        choices: ["Use pure oxygen for better detection", "Pressurize with dry nitrogen and never oxygen", "Mix nitrogen with refrigerant vapor freely", "Skip gauges and listen only"],
        a: 1,
        why: "Dry nitrogen only. Oxygen + oil is a serious hazard.",
      },
      {
        q: "A system with a known leak should be:",
        choices: ["Topped off weekly forever", "Repaired before charging (with proper recovery/evac)", "Charged hotter to hide the leak", "Abandoned without recovery"],
        a: 1,
        why: "Find and repair leaks; recover, repair, evacuate, charge correctly.",
      },
      {
        q: "Self-contained recovery equipment:",
        choices: ["Has its own means to remove refrigerant", "Always requires the system compressor", "Is illegal after 2010", "Only works on R-22"],
        a: 0,
        why: "Self-contained recovery has its own pump/compressor to pull refrigerant.",
      },
      {
        q: "Filling a recovery cylinder beyond safe limits is dangerous because:",
        choices: ["The paint scratches", "Liquid expansion with temperature can rupture the cylinder", "EPA requires 100% full tanks", "It makes recovery faster"],
        a: 1,
        why: "Never overfill; leave vapor headspace. Use a scale.",
      },
      {
        q: "Under AIM leak repair rules (2026+), a covered comfort-cooling appliance exceeds its threshold when the calculated leak rate is above:",
        choices: ["5%", "10%", "20%", "30%"],
        a: 1,
        why: "Comfort cooling, refrigerated transport, and other covered appliances use a 10% leak-rate threshold. Commercial refrigeration is 20%; industrial process refrigeration is 30%.",
      },
      {
        q: "A 100 lb full-charge comfort system had 8 lb of HFC added 73 days after the last addition. Using annualizing: (8/100)×(365/73)×100% ≈ 40%. What does that mean?",
        choices: [
          "Below all AIM thresholds — no repair duty",
          "Above the 10% comfort-cooling threshold — repair obligations are triggered",
          "Only Section 609 MVAC rules apply",
          "It automatically voids EPA 608 certification"
        ],
        a: 1,
        why: "≈40% annualized is above the 10% comfort-cooling threshold. Owners/operators must identify and repair on EPA timelines (often 30 days). This is training math — use official methods and records on real jobs.",
      },
      {
        q: "AIM Act leak-repair provisions generally apply to appliances with a full charge of at least:",
        choices: ["5 pounds", "15 pounds", "50 pounds", "1,500 pounds"],
        a: 1,
        why: "15 pounds or more of a refrigerant containing an HFC (or certain high-GWP substitutes). 1,500 lb is related to some automatic leak detection (ALD) triggers, not the basic 15 lb leak-repair scope.",
      },
      {
        q: "Type I certification covers:",
        choices: ["All comfort cooling", "Small appliances with 5 lb or less of refrigerant", "Low-pressure chillers only", "MVAC on cars"],
        a: 1,
        why: "Type I is small appliances (typically 5 lb or less).",
      },
      {
        q: "Type III certification covers:",
        choices: ["Window units only", "Low-pressure appliances such as many centrifugal chillers", "Domestic refrigerators only", "MVAC recovery"],
        a: 1,
        why: "Type III is low-pressure appliances.",
      },
      {
        q: "Universal 608 certification means you passed:",
        choices: ["Core only", "Core plus Types I, II, and III", "OSHA 30 only", "A manufacturer class"],
        a: 1,
        why: "Universal = Core + I + II + III.",
      },
      {
        q: "A recovery cylinder should be filled to no more than about:",
        choices: ["100% liquid", "80% of its capacity by weight (leave headspace)", "Until the relief valve dumps", "Whatever fits"],
        a: 1,
        why: "Leave vapor headspace. Weigh it. Never fill solid liquid.",
      },
      {
        q: "Disposable cylinders (like some virgin refrigerant jugs) should be:",
        choices: ["Reused as recovery tanks", "Used as designed, then properly recycled — not used for recovery", "Heated with a torch to empty", "Vent-purged into the alley"],
        a: 1,
        why: "Don't recover into disposable cylinders.",
      },
    ],
    osha30: [
      {
        q: "Before working on electrical equipment, the safest practice is:",
        choices: ["Wear extra rings for grounding", "Lockout/tagout and verify de-energized", "Work one-handed only", "Hold the conduit for stability"],
        a: 1,
        why: "LOTO and verify with a meter. Jewelry is a hazard, not PPE.",
      },
      {
        q: "A common leading cause of construction fatalities is:",
        choices: ["Paper cuts", "Falls", "Loud music", "Too much training"],
        a: 1,
        why: "Falls are a top cause of construction deaths — ladders, roofs, lifts.",
      },
      {
        q: "Extension ladders should extend above the landing at least:",
        choices: ["6 inches", "1 foot", "3 feet", "6 feet"],
        a: 2,
        why: "Typically 3 feet above the landing surface for safe transition.",
      },
      {
        q: "GFCI protection is especially important when:",
        choices: ["Using electrical tools outdoors or in wet areas", "Reading a manual indoors", "Driving the work truck", "Sorting copper scraps"],
        a: 0,
        why: "GFCIs reduce shock risk in wet/outdoor conditions.",
      },
      {
        q: "SDS (Safety Data Sheets) provide information about:",
        choices: ["Customer credit scores", "Chemical hazards and safe handling", "Union dues", "Compressor SEER ratings only"],
        a: 1,
        why: "Hazard communication: SDS explains chemical risks and protections.",
      },
      {
        q: "Hard hats, safety glasses, and gloves are examples of:",
        choices: ["Optional fashion", "PPE (personal protective equipment)", "Tools of the trade only", "EPA 608 recovery gear"],
        a: 1,
        why: "PPE reduces exposure to hazards when engineering controls aren't enough.",
      },
      {
        q: "Heat illness prevention includes:",
        choices: ["Ignoring breaks to finish faster", "Water, rest, shade, and recognizing symptoms", "Working in black hoodies at noon", "Salt tablets only with no water"],
        a: 1,
        why: "Hydration, rest, shade, and early recognition of heat stress save lives.",
      },
      {
        q: "When lifting heavy equipment you should:",
        choices: ["Twist at the waist with a full load", "Lift with your back rounded", "Plan the path, lift with legs, get help for heavy loads", "Hold your breath and jerk upward"],
        a: 2,
        why: "Proper lifting mechanics and teamwork prevent injuries.",
      },
      {
        q: "A confined space may require:",
        choices: ["No special precautions", "Atmospheric testing, permits, and attendant procedures as applicable", "Only a stronger flashlight", "Playing music louder"],
        a: 1,
        why: "Confined spaces can have oxygen deficiency or toxic atmospheres.",
      },
      {
        q: "Damaged power cords on tools should be:",
        choices: ["Taped with electrical tape forever", "Removed from service and repaired/replaced properly", "Ignored if the tool still runs", "Used only on rainy days"],
        a: 1,
        why: "Damaged cords are shock/fire hazards — tag out and fix properly.",
      },
      {
        q: "Eye protection is required when:",
        choices: ["Only on formal inspections", "Cutting, grinding, brazing, chemical handling, and similar hazards", "Never outdoors", "Only if the customer is watching"],
        a: 1,
        why: "Protect eyes whenever flying particles, UV, or chemicals are risks.",
      },
      {
        q: "The hierarchy of controls prioritizes first:",
        choices: ["PPE only", "Eliminating the hazard when feasible", "Warning signs only", "Worker attitude"],
        a: 1,
        why: "Eliminate/substitute before relying on PPE as last line.",
      },
      {
        q: "On a roof, fall protection is generally required when working how high (construction, typical OSHA)?",
        choices: ["Any height", "6 feet or more when exposed to a fall hazard", "Only above 30 feet", "Never if you feel confident"],
        a: 1,
        why: "Construction fall protection commonly triggers at 6 feet. Use guardrails, PFAS, or covers.",
      },
      {
        q: "Lockout devices should be removed by:",
        choices: ["Anyone in a hurry", "The authorized worker who applied them (or following employer procedure)", "The customer", "Whoever has pliers"],
        a: 1,
        why: "Don't pull someone else's lock. Follow the LOTO program.",
      },
      {
        q: "A fire extinguisher class for energized electrical equipment is typically:",
        choices: ["Class A water only", "Class C (or multi-class rated for energized electrical)", "Class K kitchen only", "Dirt from the truck"],
        a: 1,
        why: "Class C is electrical. Don't throw water on live gear.",
      },
      {
        q: "Scaffolding should be inspected:",
        choices: ["Never — it's always fine", "Before use / by a competent person as required", "Only after a collapse", "Once a year in January"],
        a: 1,
        why: "Inspect before use. Don't climb damaged scaffold.",
      },
    ],
    curriculum: [
      {
        q: "High superheat AND low subcooling most often indicates:",
        choices: ["Overcharge", "Dirty condenser only", "Undercharge / leak", "Failed blower only"],
        a: 2,
        why: "Starved evaporator (high SH) + thin condenser liquid (low SC) = undercharge fingerprint.",
      },
      {
        q: "On many TXV systems, preferred charging method includes:",
        choices: ["Superheat only always", "Subcooling and/or weigh-in per OEM", "Sight glass until clear only", "Match suction pressure to outdoor dry bulb only"],
        a: 1,
        why: "TXV holds SH; charge often by SC and nameplate weight.",
      },
      {
        q: "Before opening mini-split service valves on a new install, you should:",
        choices: ["Skip straight to charging", "Pressure test with N₂ and pull a deep vacuum with decay", "Open valves then vacuum", "Use oxygen to push moisture out"],
        a: 1,
        why: "N₂ test → vacuum ≤500 µm → decay → then open valves.",
      },
      {
        q: "A dirty condenser typically shows:",
        choices: ["Low head pressure", "High head pressure and reduced capacity", "Zero compressor amps", "High superheat only with low head"],
        a: 1,
        why: "Can't reject heat → head rises, capacity drops, amps often rise.",
      },
      {
        q: "Flare nut goes on the copper tubing:",
        choices: ["After flaring", "Before cutting/flaring", "Never on mini-splits", "Only on the suction line"],
        a: 1,
        why: "Nut on first — classic mistake to flare then realize the nut is missing.",
      },
      {
        q: "Ice on the suction line with near-zero superheat often points first to:",
        choices: ["Need more refrigerant immediately", "Low airflow or overcharge issues — diagnose before adding gas", "Failed crankcase heater only", "Wrong thermostat color wires"],
        a: 1,
        why: "Fix airflow (filter/blower/coil) before pouring in refrigerant.",
      },
      {
        q: "MCA on a nameplate is used primarily to:",
        choices: ["Set the thermostat schedule", "Size wire/circuit ampacity minimum", "Choose refrigerant type", "Measure superheat"],
        a: 1,
        why: "Minimum Circuit Ampacity guides conductor sizing; MOP guides max OCPD.",
      },
      {
        q: "Factory charge on a mini-split covers:",
        choices: ["Any lineset length worldwide", "The rated lineset length; longer runs need weighed-in additional charge", "Only the indoor unit", "Only winter operation"],
        a: 1,
        why: "Longer linesets need additional charge per OEM chart.",
      },
      {
        q: "Communication wires swapped on a ductless system often cause:",
        choices: ["Perfect cooling", "No operation / error codes / no cool", "Higher SEER automatically", "Free refrigerant upgrades"],
        a: 1,
        why: "Comms polarity/order matters — classic no-cool after install.",
      },
      {
        q: "Non-condensables left in a system tend to:",
        choices: ["Lower head pressure usefully", "Raise head pressure and hurt efficiency", "Replace the need for oil", "Improve vacuum readings forever"],
        a: 1,
        why: "Air/nitrogen in the circuit raises head and reduces capacity.",
      },
      {
        q: "A liquid-line restriction / stuck TXV often shows:",
        choices: ["Low SH and low SC", "High SH with normal/high SC", "High suction and low head only", "No change in any reading"],
        a: 1,
        why: "Condenser still has liquid (SC) but evaporator is starved (high SH).",
      },
      {
        q: "POE oil is:",
        choices: ["Hydrophobic and ignores moisture", "Hygroscopic — absorbs moisture; keep containers capped", "Identical to mineral oil for R-22 top-offs always", "Optional on all compressors"],
        a: 1,
        why: "POE + moisture is trouble. Cap the oil.",
      },
      {
        q: "Lincoln Tech shop standard: after brazing a copper joint you should:",
        choices: ["Charge immediately while it's hot", "N₂ purge while brazing, then pressure test and vacuum", "Skip the vacuum if it looks pretty", "Use R-22 leftover to push moisture"],
        a: 1,
        why: "Purge with nitrogen while brazing, then test and evacuate.",
      },
      {
        q: "On a voltmeter, to check 24V control you typically measure:",
        choices: ["Across the run capacitor only", "Between the 24V transformer secondary (R to C) with the right scale", "L1 to ground on the 480V tap", "The crankcase heater in amps mode"],
        a: 1,
        why: "R to C on the transformer / control circuit. Right scale. Don't put the meter in amps across voltage.",
      },
      {
        q: "Manifold gauges: the blue hose is typically:",
        choices: ["Liquid / high side", "Suction / low side", "The vacuum pump exhaust", "The condensate drain"],
        a: 1,
        why: "Blue = low/suction. Red = high/liquid. Yellow = utility.",
      },
      {
        q: "Target superheat on a fixed-orifice system is mainly a function of:",
        choices: ["Indoor wet-bulb and outdoor dry-bulb (OEM chart)", "Whatever 20°F you like", "Head pressure only", "The color of the paint"],
        a: 0,
        why: "Use the OEM / P-T target SH chart for piston systems.",
      },
      {
        q: "A contactor that chatters on a call for cool often has:",
        choices: ["Perfect 24V", "Low control voltage, pitted points, or a failing coil", "Too much superheat only", "A happy condenser"],
        a: 1,
        why: "Measure 24V at the coil. Clean/replace the contactor. Don't keep it chattering.",
      },
    ],
    commandments: [
      {
        q: "HVAC Commandment 1 — before opening a charged system you must:",
        choices: ["Vent carefully outdoors", "Recover into an approved cylinder", "Run it in pump-down forever", "Add a pound and hope"],
        a: 1,
        why: "Recover first. Venting is illegal.",
      },
      {
        q: "HVAC Commandment 2 — the flare nut goes on:",
        choices: ["After the flare is made", "The tube first, then cut / deburr / flare", "Only on the outdoor unit", "Never — compression fittings only"],
        a: 1,
        why: "Nut on first. Forever.",
      },
      {
        q: "HVAC Commandment 3 — leak-test pressure comes from:",
        choices: ["Shop compressed air", "Pure oxygen for a hotter test", "Dry nitrogen only", "The system's own refrigerant"],
        a: 2,
        why: "Dry N₂ only. Oxygen + oil is a bomb.",
      },
      {
        q: "HVAC Commandment 4 — prove a deep vacuum with:",
        choices: ["Compound gauge at 29 inHg", "A micron gauge on the system", "How the pump sounds", "Five minutes on a kitchen timer"],
        a: 1,
        why: "Microns at the system. Compound gauges are cosplay.",
      },
      {
        q: "HVAC Commandment 5 — high SH and low SC means:",
        choices: ["Top it off and leave", "Undercharge / leak — recover, repair, evacuate, weigh in", "Dirty condenser only", "Overcharge — recover a little"],
        a: 1,
        why: "Don't top off a leaker.",
      },
      {
        q: "HVAC Commandment 6 — ohms or µF on a capacitor require:",
        choices: ["Power on so you see real values", "Lockout, verify dead, discharge the cap", "A jumper across L1–L2", "The thermostat set to Cool"],
        a: 1,
        why: "Lock it out. Live circuits bite.",
      },
      {
        q: "HVAC Commandment 8 — superheat is:",
        choices: ["Cond sat minus liquid temp", "Suction temp minus evaporator sat", "Head pressure minus suction", "Whatever the analog gauges say"],
        a: 1,
        why: "SH = suction temp − evap sat. SC = cond sat − liquid temp.",
      },
      {
        q: "HVAC Commandment 9 — iced suction and near-zero SH is usually:",
        choices: ["Low charge — add gas", "Airflow (filter, blower, coil) — don't add gas yet", "A good TXV", "Normal on R-410A"],
        a: 1,
        why: "Airflow before charge.",
      },
    ],
  };

  function mixBanks(keys) {
    let all = [];
    keys.forEach((k) => {
      (BANK[k] || []).forEach((q) => all.push(Object.assign({ pack: k }, q)));
    });
    // shuffle
    for (let i = all.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [all[i], all[j]] = [all[j], all[i]];
    }
    return all;
  }

  const PACKS = [
    { id: "epa608", name: "EPA 608", blurb: "Recovery, vacuum, cylinders, Type I / II / III / Universal" },
    { id: "osha30", name: "OSHA 30", blurb: "Falls, LOTO, PPE, electrical, heat, SDS" },
    { id: "curriculum", name: "Lincoln Tech Curriculum", blurb: "Cycle, SH/SC, gauges, DMM, mini-split, airflow" },
    { id: "mixed", name: "Quiz Game mix", blurb: "EPA 608 + OSHA 30 + Lincoln Tech only" },
  ];

  const COLORS = ["#e21b70", "#1368ce", "#d89e00", "#26890c"];
  const SHAPES = ["▲", "◆", "●", "■"];

  let root = null;
  let hooks = {};
  let mode = "lobby"; // lobby | host | play | results
  let role = "solo"; // solo | host | player
  let packId = "mixed";
  let questions = [];
  let qi = 0;
  let scores = {}; // name -> score
  let nickname = "Tech";
  let roomPin = "";
  let channel = null;
  let selected = null;
  let locked = false;
  let timer = 0;
  let timerMax = 20;
  let timerId = 0;
  let lastAward = 0;
  let players = [];
  let pollId = 0;
  let net = "local"; // local BroadcastChannel | server PIN rooms

  function pinGen() {
    return String((Math.random() * 900000 + 100000) | 0);
  }

  async function roomPost(body) {
    const r = await fetch("/api/quiz-room", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Room error");
    return data;
  }

  async function roomGet(pin) {
    const r = await fetch("/api/quiz-room?pin=" + encodeURIComponent(pin), { credentials: "include" });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || "Room error");
    return data;
  }

  function stopPoll() {
    if (pollId) {
      clearInterval(pollId);
      pollId = 0;
    }
  }

  function applyServerSnap(snap) {
    if (!snap) return;
    const st = snap.state || {};
    if (st.players) players = st.players;
    if (st.scores) scores = st.scores;
    if (st.questions && st.questions.length) questions = st.questions;
    if (typeof snap.qi === "number") qi = snap.qi;
    packId = snap.packId || packId;
    if (snap.status === "play" && mode !== "play" && mode !== "results") {
      mode = "play";
      selected = null;
      locked = false;
      startTimer();
    }
    if (snap.status === "done") {
      mode = "results";
      stopTimer();
    }
    render();
  }

  function startPoll() {
    stopPoll();
    pollId = setInterval(async () => {
      if (!roomPin || role === "solo") return;
      try {
        const snap = await roomGet(roomPin);
        if (role === "player") applyServerSnap(snap);
        else if (role === "host" && snap.state && snap.state.answers) {
          window.__answers = Object.assign({}, window.__answers, snap.state.answers);
          if (snap.state.players) {
            players = snap.state.players;
            if (mode === "host") render();
          }
        }
      } catch (_) {}
    }, 1200);
  }

  function hubLine(kind) {
    if (!global.ProfessorHUB) return "";
    if (kind === "ok") return " " + global.ProfessorHUB.banter("service-ok");
    if (kind === "bad") return " " + global.ProfessorHUB.banter("service-bad");
    return " " + global.ProfessorHUB.banter("hub");
  }

  function broadcast(msg) {
    if (channel) channel.postMessage(msg);
  }

  function ensureChannel(pin) {
    if (channel) try { channel.close(); } catch (_) {}
    channel = new BroadcastChannel("lt-quiz-" + pin);
    channel.onmessage = (ev) => onNet(ev.data);
  }

  function onNet(msg) {
    if (!msg || !msg.type) return;
    if (role === "host") {
      if (msg.type === "join") {
        if (!scores[msg.name]) scores[msg.name] = 0;
        if (!players.includes(msg.name)) players.push(msg.name);
        broadcast({ type: "lobby", players: players.slice(), scores: { ...scores }, packId, host: nickname });
        render();
      }
      if (msg.type === "answer" && !locked) {
        // host authoritative scoring happens on host timer end; store early answers
        if (!window.__answers) window.__answers = {};
        window.__answers[msg.name] = { i: msg.i, t: msg.t };
      }
    }
    if (role === "player") {
      if (msg.type === "lobby") {
        players = msg.players || [];
        scores = msg.scores || scores;
        render();
      }
      if (msg.type === "question") {
        questions = msg.questions;
        qi = msg.qi;
        timerMax = msg.timerMax || 20;
        selected = null;
        locked = false;
        mode = "play";
        startTimer();
        render();
      }
      if (msg.type === "reveal") {
        locked = true;
        scores = msg.scores || scores;
        lastAward = msg.awards && msg.awards[nickname] ? msg.awards[nickname] : 0;
        stopTimer();
        renderReveal(msg.correct, msg.why);
      }
      if (msg.type === "results") {
        scores = msg.scores || scores;
        mode = "results";
        stopTimer();
        render();
      }
    }
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = 0;
  }

  function startTimer() {
    stopTimer();
    timer = timerMax;
    timerId = setInterval(() => {
      timer -= 0.1;
      const el = root.querySelector(".qa-timer-bar > i");
      if (el) el.style.width = Math.max(0, (timer / timerMax) * 100) + "%";
      const tx = root.querySelector(".qa-timer-text");
      if (tx) tx.textContent = Math.max(0, Math.ceil(timer)) + "s";
      if (timer <= 0) {
        stopTimer();
        if (role === "solo" || role === "host") finishQuestion();
        else if (role === "player" && !locked) {
          locked = true;
          // wait for host reveal
        }
      }
    }, 100);
  }

  function pointsForSpeed() {
    // max 1000, decays with time
    const frac = Math.max(0, timer / timerMax);
    return Math.round(500 + 500 * frac);
  }

  function finishQuestion() {
    locked = true;
    stopTimer();
    const item = questions[qi];
    if (!item) return;
    const awards = {};
    if (role === "solo") {
      const ok = selected === item.a;
      const got = ok ? pointsForSpeed() : 0;
      awards[nickname] = got;
      scores[nickname] = (scores[nickname] || 0) + got;
      lastAward = got;
      renderReveal(item.a, item.why);
      return;
    }
    if (role === "host") {
      const ans = window.__answers || {};
      // host's own answer
      if (selected != null) ans[nickname] = { i: selected, t: timer };
      Object.keys(ans).forEach((name) => {
        const ok = ans[name].i === item.a;
        const frac = Math.max(0, (ans[name].t || 0) / timerMax);
        const got = ok ? Math.round(500 + 500 * frac) : 0;
        awards[name] = got;
        scores[name] = (scores[name] || 0) + got;
      });
      window.__answers = {};
      if (net === "server") {
        roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi,
          state: { questions, players, scores, answers: {} },
        }).catch(() => {});
      } else {
        broadcast({
          type: "reveal",
          correct: item.a,
          why: item.why,
          scores: { ...scores },
          awards,
        });
      }
      lastAward = awards[nickname] || 0;
      renderReveal(item.a, item.why);
    }
  }

  function nextQuestion() {
    qi++;
    selected = null;
    locked = false;
    window.__answers = {};
    if (qi >= questions.length) {
      mode = "results";
      stopTimer();
      if (role === "host") {
        if (net === "server") {
          roomPost({
            action: "sync",
            pin: roomPin,
            status: "done",
            qi,
            state: { questions, players, scores, answers: {} },
          }).catch(() => {});
        } else {
          broadcast({ type: "results", scores: { ...scores } });
        }
      }
      render();
      if (hooks.onComplete) {
        const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        hooks.onComplete({ scores, winner: list[0], total: questions.length, packId });
      }
      return;
    }
    if (role === "host") {
      if (net === "server") {
        roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi,
          state: { questions, players, scores, answers: {} },
        }).catch(() => {});
      } else {
        broadcast({ type: "question", questions, qi, timerMax });
      }
    }
    startTimer();
    render();
  }

  function renderReveal(correct, why) {
    const item = questions[qi];
    if (!item) return;
    root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((btn, i) => {
      btn.classList.add("locked");
      if (i === correct) btn.classList.add("correct");
      if (selected === i && i !== correct) btn.classList.add("wrong");
    });
    const letter = "ABCD"[correct];
    const correctText = item.choices[correct] || "";
    const ok = selected === correct;
    const explain = why || item.why || "Review this topic in your EPA / OSHA / curriculum notes.";
    const fb = root.querySelector(".qa-feedback");
    if (fb) {
      fb.innerHTML =
        '<div class="qa-explain-card">' +
        '<p class="qa-explain-result">' +
        (ok
          ? "✅ Correct · +" + lastAward + " pts"
          : "❌ Not quite · +0 pts") +
        "</p>" +
        '<p class="qa-explain-answer"><strong>Correct answer:</strong> ' +
        letter +
        " — " +
        correctText +
        "</p>" +
        '<p class="qa-explain-why"><strong>Why:</strong> ' +
        explain +
        "</p>" +
        '<p class="qa-explain-hub">HUB: ' +
        (ok ? hubLine("ok") : hubLine("bad")).trim() +
        "</p>" +
        "</div>";
      fb.className = "qa-feedback " + (ok ? "good" : "bad");
    }
    const next = root.querySelector(".qa-next");
    if (next) {
      next.classList.remove("hidden");
      next.textContent = qi + 1 >= questions.length ? "See final scores" : "Next question";
      next.onclick = () => nextQuestion();
    }
  }

  function startSolo() {
    role = "solo";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Tech";
    packId = (root.querySelector("#qa-pack") && root.querySelector("#qa-pack").value) || "mixed";
    const keys = packId === "mixed" ? ["epa608", "osha30", "curriculum"] : [packId];
    questions = mixBanks(keys).slice(0, 12);
    qi = 0;
    scores = {};
    scores[nickname] = 0;
    players = [nickname];
    mode = "play";
    selected = null;
    locked = false;
    startTimer();
    render();
  }

  async function startHost() {
    role = "host";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Host";
    packId = (root.querySelector("#qa-pack") && root.querySelector("#qa-pack").value) || "mixed";
    scores = {};
    scores[nickname] = 0;
    players = [nickname];
    try {
      const created = await roomPost({ action: "create", host: nickname, packId });
      roomPin = created.pin;
      net = "server";
      startPoll();
    } catch (_) {
      roomPin = pinGen();
      net = "local";
      ensureChannel(roomPin);
    }
    mode = "host";
    render();
  }

  async function hostBegin() {
    const keys = packId === "mixed" ? ["epa608", "osha30", "curriculum"] : [packId];
    questions = mixBanks(keys).slice(0, 12);
    qi = 0;
    mode = "play";
    selected = null;
    locked = false;
    window.__answers = {};
    if (net === "server") {
      try {
        await roomPost({
          action: "sync",
          pin: roomPin,
          status: "play",
          qi: 0,
          state: { questions, players, scores, answers: {} },
        });
      } catch (_) {}
    } else {
      broadcast({ type: "question", questions, qi, timerMax });
    }
    startTimer();
    render();
  }

  async function joinRoom() {
    role = "player";
    nickname = (root.querySelector("#qa-nick") && root.querySelector("#qa-nick").value.trim()) || "Player";
    roomPin = (root.querySelector("#qa-pin") && root.querySelector("#qa-pin").value.trim()) || "";
    if (!/^\d{6}$/.test(roomPin)) {
      alert("Enter the 6-digit room PIN from the host.");
      return;
    }
    scores = {};
    scores[nickname] = 0;
    try {
      const snap = await roomPost({ action: "join", pin: roomPin, callsign: nickname });
      net = "server";
      applyServerSnap(snap);
      startPoll();
    } catch (_) {
      net = "local";
      ensureChannel(roomPin);
      broadcast({ type: "join", name: nickname });
    }
    mode = "host";
    render();
  }

  function pick(i) {
    if (locked || mode !== "play") return;
    selected = i;
    locked = true;
    if (role === "player") {
      if (net === "server") {
        roomPost({ action: "answer", pin: roomPin, callsign: nickname, i, t: timer }).catch(() => {});
      } else {
        broadcast({ type: "answer", name: nickname, i, t: timer });
      }
      const fb = root.querySelector(".qa-feedback");
      if (fb) {
        fb.textContent = "Answer locked in. Waiting for timer…";
        fb.className = "qa-feedback";
      }
      root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((b, idx) => {
        b.classList.add("locked");
        if (idx === i) b.classList.add("picked");
      });
    } else if (role === "solo") {
      // solo waits for timer OR allow instant resolve for snappy feel
      finishQuestion();
    } else if (role === "host") {
      root.querySelectorAll(".qa-choice, .qa-k-btn").forEach((b, idx) => {
        b.classList.add("locked");
        if (idx === i) b.classList.add("picked");
      });
      // host waits for timer to score everyone
    }
  }

  function leaderboardHtml() {
    const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (!list.length) return "<p class='qa-muted'>No scores yet</p>";
    return (
      '<ol class="qa-lb">' +
      list
        .map(
          ([n, s], i) =>
            "<li" +
            (n === nickname ? ' class="me"' : "") +
            "><span>" +
            (i + 1) +
            ". " +
            n +
            "</span><strong>" +
            s +
            "</strong></li>"
        )
        .join("") +
      "</ol>"
    );
  }

  function render() {
    if (!root) return;
    if (mode === "lobby") {
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div class="brand-bar" style="justify-content:flex-start">
              <div class="brand-mark" style="width:28px;height:28px;font-size:14px">LT</div>
              <div class="brand-word"><strong style="font-size:15px">QUIZ GAME</strong><span>Kahoot clone · EPA 608 · OSHA 30 · Lincoln Tech curriculum</span></div>
            </div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            <p class="qa-lede">Kahoot-style. Four colors. Speed + accuracy. Pick a pack or mix them.</p>
            <div class="qa-pack-row" id="qa-pack-row">
              <button type="button" class="qa-pack-btn" data-pack="epa608">EPA 608</button>
              <button type="button" class="qa-pack-btn" data-pack="osha30">OSHA 30</button>
              <button type="button" class="qa-pack-btn" data-pack="curriculum">Lincoln Tech</button>
              <button type="button" class="qa-pack-btn" data-pack="mixed">Mix all</button>
            </div>
            <label>Nickname<input id="qa-nick" maxlength="14" value="${nickname}" placeholder="Your name"/></label>
            <label>Question pack
              <select id="qa-pack">
                ${PACKS.map((p) => `<option value="${p.id}">${p.name} — ${p.blurb}</option>`).join("")}
              </select>
            </label>
            <div class="qa-actions">
              <button class="btn primary" id="qa-solo">Solo game</button>
              <button class="btn" id="qa-host">Host classroom</button>
            </div>
            <div class="qa-join-box">
              <p class="eyebrow">Join a room</p>
              <label>Room PIN<input id="qa-pin" maxlength="6" placeholder="6-digit PIN"/></label>
              <button class="btn primary" id="qa-join">Join</button>
              <p class="qa-muted">Online classroom: host a room, share the 6-digit PIN. Students join from any phone or laptop. Signed-in scores hit the All-Star board.</p>
            </div>
          </div>
        </div>`;
      root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub();
      root.querySelector("#qa-solo").onclick = startSolo;
      root.querySelector("#qa-host").onclick = startHost;
      root.querySelector("#qa-join").onclick = joinRoom;
      const packSel = root.querySelector("#qa-pack");
      root.querySelectorAll(".qa-pack-btn").forEach((b) => {
        b.onclick = () => {
          if (packSel) packSel.value = b.dataset.pack;
          root.querySelectorAll(".qa-pack-btn").forEach((x) => x.classList.toggle("on", x === b));
        };
      });
      return;
    }

    if (mode === "host" && role !== "solo") {
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div><p class="eyebrow">Room lobby</p><h2>PIN ${roomPin}</h2></div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            <p class="qa-lede">Players join with this PIN on the same game site. Pack: <strong>${PACKS.find((p) => p.id === packId)?.name || packId}</strong></p>
            <div class="qa-pin-big">${roomPin}</div>
            <h3>Players</h3>
            ${leaderboardHtml()}
            ${
              role === "host"
                ? '<button class="btn primary" id="qa-begin">Start quiz</button>'
                : '<p class="qa-muted">Waiting for host to start…</p>'
            }
          </div>
        </div>`;
      root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub();
      const b = root.querySelector("#qa-begin");
      if (b) b.onclick = hostBegin;
      return;
    }

    if (mode === "results") {
      const list = Object.entries(scores).sort((a, b) => b[1] - a[1]);
      root.innerHTML = `
        <div class="qa-shell">
          <header class="qa-head">
            <div><p class="eyebrow">Final podium</p><h2>Quiz complete</h2></div>
            <button class="btn" id="qa-hub">Shop floor</button>
          </header>
          <div class="qa-lobby">
            ${leaderboardHtml()}
            <p class="qa-feedback good">${list[0] ? "🏆 " + list[0][0] + " leads with " + list[0][1] + " pts." : ""} ${hubLine("ok")}</p>
            <button class="btn primary" id="qa-again">Play again</button>
          </div>
        </div>`;
      root.querySelector("#qa-hub").onclick = () => hooks.onHub && hooks.onHub();
      root.querySelector("#qa-again").onclick = () => {
        mode = "lobby";
        render();
      };
      return;
    }

    // play
    const item = questions[qi];
    if (!item) {
      mode = "results";
      render();
      return;
    }
    root.innerHTML = `
      <div class="qa-kahoot">
        <header class="qa-k-top">
          <span class="qa-k-pack">${(item.pack || packId || "").replace("curriculum","Lincoln Tech").replace("epa608","EPA 608").replace("osha30","OSHA 30")}</span>
          <span class="qa-k-q">Q ${qi + 1} / ${questions.length}</span>
          <span class="qa-k-time">${Math.ceil(timer)}</span>
          <span class="qa-k-score">${scores[nickname] || 0}</span>
          <button class="btn" id="qa-hub">Shop floor</button>
        </header>
        <div class="qa-k-bar"><i style="width:${(timer / timerMax) * 100}%"></i></div>
        <h2 class="qa-k-question">${item.q}</h2>
        <div class="qa-k-grid">
          ${item.choices
            .map(
              (c, i) =>
                `<button class="qa-k-btn" data-i="${i}" style="background:${COLORS[i]}"><span class="qa-k-shape">${SHAPES[i]}</span><span class="qa-k-txt">${c}</span></button>`
            )
            .join("")}
        </div>
        <p class="qa-feedback"></p>
        <button class="btn primary qa-next hidden">Next</button>
      </div>`;
    root.querySelectorAll(".qa-k-btn").forEach((btn) => {
      btn.onclick = () => pick(+btn.dataset.i);
    });
    const hubBtn = root.querySelector("#qa-hub");
    if (hubBtn) hubBtn.onclick = () => {
      stopTimer();
      if (hooks.onHub) hooks.onHub();
    };
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    mode = "lobby";
    role = "solo";
    nickname = (opts && opts.nickname) || "Tech";
    scores = {};
    players = [];
    stopTimer();
    function onKey(e) {
      if (e.key === "Escape" && !/input|textarea|select/i.test(e.target.tagName || "")) {
        stopTimer();
        if (hooks.onHub) hooks.onHub();
      }
    }
    document.addEventListener("keydown", onKey);
    render();
    return {
      stop() {
        stopTimer();
        stopPoll();
        document.removeEventListener("keydown", onKey);
        if (channel) try { channel.close(); } catch (_) {}
      },
    };
  }

  global.QuizArena = { start, BANK, PACKS };
})(window);
