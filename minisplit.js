/* Lincoln Tech HVAC Allstars — Mini-Split Install Lab
   Steps based on common OEM practice (Daikin / Mitsubishi / industry guides):
   mount IDU → wall penetration → ODU set → flare & torque → N2 test →
   deep vacuum + decay → open service valves → electrical → commission */
(function (global) {
  "use strict";

  const STEPS = [
    {
      id: "mount-idu",
      title: "1 · Mount indoor head",
      tip: "Level the mounting plate on an exterior wall ~7 ft up. Leave clearance above/beside the head.",
      detail:
        "Mark studs, fasten the plate level, and hang the indoor unit. Never mount on a hollow soft wall without backing.",
      check: "Plate is level and secured to structure",
      tools: ["Level", "Mounting plate", "Drill"],
      action: "Mount plate & hang IDU",
      metric: null,
    },
    {
      id: "penetration",
      title: "2 · Wall penetration",
      tip: "Drill ~2.5–3 in hole, sloping slightly downward to the outside so water drains out.",
      detail:
        "Sleeve the hole. Bundle liquid line, suction line, condensate drain, and control cable. Protect insulation from abrasion.",
      check: "Hole slopes out · drain starts downhill",
      tools: ["Hole saw", "PVC sleeve"],
      action: "Drill & sleeve wall",
      metric: null,
    },
    {
      id: "set-odu",
      title: "3 · Set outdoor unit",
      tip: "Level pad or wall bracket. Clearances for airflow and service. Disconnect within sight of the ODU.",
      detail:
        "Keep the unit out of direct restriction. Vibration pads reduce noise transfer. Do not block the coil face.",
      check: "ODU level · clearance OK · disconnect in sight",
      tools: ["Pad / bracket", "Disconnect"],
      action: "Place ODU",
      metric: null,
    },
    {
      id: "flare",
      title: "4 · Cut, deburr, flare",
      tip: "Slide flare nut on FIRST. Square cut → deburr → eccentric 45° flare. Inspect for cracks or ovality.",
      detail:
        "A bad flare is the #1 leak source on mini-splits. Use a quality flaring tool. Light film of POE/Nylog on the flare face helps seat.",
      check: "Flares clean · nuts on tube · no cracks",
      tools: ["Tube cutter", "Deburr", "Flaring tool"],
      action: "Make flares",
      metric: { key: "flareQuality", label: "Flare quality", min: 80, unit: "%" },
    },
    {
      id: "torque",
      title: "5 · Torque flare nuts",
      tip: "Hand-start, then torque wrench to OEM spec. Backup wrench on the body — never twist the valve.",
      detail:
        "Typical training targets (confirm OEM manual): ~12–13 ft-lb on 1/4″ liquid, higher on larger suction. Under-torque leaks; over-torque cracks the flare.",
      check: "Both ends torqued to spec",
      tools: ["Torque wrench", "Backup wrench"],
      action: "Torque connections",
      metric: { key: "torque", label: "Torque applied", min: 12, max: 14, unit: "ft-lb", target: 13 },
    },
    {
      id: "nitrogen",
      title: "6 · Nitrogen pressure test",
      tip: "Dry nitrogen only — never oxygen or compressed air. Pressurize lineset + IDU (service valves still CLOSED).",
      detail:
        "Many OEMs call 450–550 psig (or staged 150 → 300 → 500). Soap every flare. Hold and watch for drop. Fix leaks before vacuum.",
      check: "Pressure holds · no bubble leaks",
      tools: ["N₂ tank + regulator", "Soap solution"],
      action: "Pressurize with N₂",
      metric: { key: "n2", label: "N₂ pressure", min: 450, max: 550, unit: "psig", target: 500 },
    },
    {
      id: "vacuum",
      title: "7 · Deep vacuum",
      tip: "Micron gauge at the system — not at the pump. Target ≤500 microns. Valve-core tools speed the pull.",
      detail:
        "Pro best practice: triple evacuation with dry-N₂ breaks. Final pull ≤500 microns. Moisture left behind forms acid and kills compressors.",
      check: "≤500 microns reached",
      tools: ["Vacuum pump", "Micron gauge", "Core tools"],
      action: "Pull vacuum",
      metric: { key: "microns", label: "Microns", max: 500, unit: "µm", target: 350 },
    },
    {
      id: "decay",
      title: "8 · Standing decay test",
      tip: "Isolate the pump. Watch 10–15 min. Rise then level high = moisture. Continuous rise = leak.",
      detail:
        "Hold below ~1000 microns after isolation. If it climbs without bound, find the leak. Do not open service valves until the decay test passes.",
      check: "Vacuum holds (decay pass)",
      tools: ["Micron gauge"],
      action: "Isolate & watch decay",
      metric: { key: "decay", label: "Microns after hold", max: 1000, unit: "µm", target: 500 },
    },
    {
      id: "valves",
      title: "9 · Open service valves",
      tip: "Hex/Allen key. Open liquid first, then suction. Factory charge flows into the lineset + IDU.",
      detail:
        "ODU ships precharged for a rated lineset length. Longer runs need weighed-in additional charge per the nameplate chart.",
      check: "Both valves fully open · caps back on",
      tools: ["Allen / hex key"],
      action: "Open service valves",
      metric: null,
    },
    {
      id: "electrical",
      title: "10 · Electrical & communication",
      tip: "Dedicated breaker, outdoor disconnect, correct polarity on power and stranded communication cable.",
      detail:
        "Most single-zone units are 208/230V. Follow the wiring diagram — swapped communication wires are a common no-cool callback.",
      check: "Power, ground, and comms landed correctly",
      tools: ["Multimeter", "Wire strippers"],
      action: "Land power & comms",
      metric: null,
    },
    {
      id: "commission",
      title: "11 · Commission",
      tip: "Power up, run cool and heat. Check delta-T at the head, drain flow, and error codes on the remote/board.",
      detail:
        "Log model/serial, lineset length, additional charge, and operating pressures if ports allow. Seal the wall penetration.",
      check: "Cooling ΔT good · no error codes · drain flows",
      tools: ["Thermometer", "Remote"],
      action: "Run & verify",
      metric: { key: "deltaT", label: "Supply ΔT", min: 15, unit: "°F", target: 20 },
    },
  ];

  let root = null;
  let step = 0;
  let done = {};
  let values = { flareQuality: 50, torque: 10, n2: 200, microns: 2500, decay: 2500, deltaT: 8 };
  let onXp = null;
  let onDone = null;
  let systemName = "Daikin Aurora Mini-Split";
  let finished = false;

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function render() {
    const s = STEPS[step];
    const completed = Object.keys(done).length;
    const pct = Math.round((completed / STEPS.length) * 100);
    root.innerHTML = `
      <div class="ms-layout">
        <header class="ms-head">
          <div>
            <div class="brand-bar" style="justify-content:flex-start;margin-bottom:6px">
              <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
              <div class="brand-word">
                <strong style="font-size:13px">LINCOLN TECH</strong>
                <span>Mini-split lab · Professor Andrew Hubbard</span>
              </div>
            </div>
            <p class="eyebrow">Mini-split install lab</p>
            <h2>${systemName}</h2>
            <p class="ms-sub">OEM-style sequence · flares · N₂ · microns · service valves · commission</p>
          </div>
          <div class="ms-progress">
            <div class="ms-bar"><i style="width:${pct}%"></i></div>
            <span>${completed} / ${STEPS.length} steps</span>
          </div>
        </header>
        <div class="ms-body">
          <aside class="ms-steps">
            ${STEPS.map((st, i) => {
              const cls = done[st.id] ? "done" : i === step ? "active" : i < step ? "past" : "";
              return `<button class="ms-step ${cls}" data-i="${i}"><span>${i + 1}</span>${st.title.replace(/^\d+\s·\s/, "")}</button>`;
            }).join("")}
          </aside>
          <main class="ms-card">
            <p class="eyebrow">Step ${step + 1} of ${STEPS.length}</p>
            <h3>${s.title}</h3>
            <p class="ms-tip">${s.tip}</p>
            ${window.ProfessorHUB ? '<div class="hub-chip" style="margin:10px 0"><img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" /><div><strong>Professor Andrew Hubbard</strong><p>' + (window.ProfessorHUB.banter("install", { step: s.id })) + '</p></div></div>' : ''}
            <p class="ms-detail">${s.detail}</p>
            <div class="ms-tools">
              ${s.tools.map((t) => `<span>${t}</span>`).join("")}
            </div>
            <p class="ms-check">✓ Success criteria: <strong>${s.check}</strong></p>
            ${
              s.metric
                ? `<div class="ms-metric">
              <label>${s.metric.label}
                <input type="range" id="ms-range"
                  min="${s.metric.min !== undefined ? Math.min(s.metric.min - 20, s.metric.target || s.metric.min) : 0}"
                  max="${s.metric.max !== undefined ? s.metric.max + (s.metric.key === "microns" || s.metric.key === "decay" ? 2500 : 50) : 100}"
                  value="${values[s.metric.key]}" />
                <output id="ms-out">${values[s.metric.key]} ${s.metric.unit}</output>
              </label>
              <p class="ms-target">${targetText(s.metric)}</p>
            </div>`
                : ""
            }
            <div class="ms-actions">
              <button class="btn primary" id="ms-do">${s.action}</button>
              <button class="btn" id="ms-ask">Ask HUB AI</button>
              <button class="btn" id="ms-back" ${step === 0 ? "disabled" : ""}>Back</button>
              <button class="btn" id="ms-hub">Shop floor</button>
            </div>
            <p class="ms-feedback" id="ms-feedback"></p>
          </main>
          <aside class="ms-ref">
            <p class="eyebrow">Quick reference</p>
            <ul>
              <li><strong>Flare nut on first</strong> — then cut, deburr, flare</li>
              <li><strong>Torque wrench</strong> — never “good and tight”</li>
              <li><strong>Dry nitrogen</strong> pressure test before vacuum</li>
              <li><strong>≤500 microns</strong> on a micron gauge</li>
              <li><strong>Decay test</strong> before opening service valves</li>
              <li><strong>Factory charge</strong> covers rated lineset length only</li>
              <li><strong>Additional charge</strong> by weight for long linesets</li>
            </ul>
            <div class="ms-diagram">
              <div class="ms-node">IDU</div>
              <div class="ms-line"></div>
              <div class="ms-node">Flares</div>
              <div class="ms-line"></div>
              <div class="ms-node">ODU</div>
            </div>
          </aside>
        </div>
      </div>
    `;

    root.querySelectorAll(".ms-step").forEach((b) => {
      b.onclick = () => {
        const i = +b.dataset.i;
        if (i <= step || done[STEPS[i].id]) {
          step = i;
          render();
        }
      };
    });

    const range = root.querySelector("#ms-range");
    if (range) {
      range.oninput = () => {
        values[s.metric.key] = +range.value;
        root.querySelector("#ms-out").textContent = values[s.metric.key] + " " + s.metric.unit;
      };
    }

    root.querySelector("#ms-do").onclick = () => attempt(s);
    root.querySelector("#ms-ask").onclick = () => {
      if (window.HubAI) {
        window.HubAI.open();
        window.HubAI.ask(
          s.id + " " + s.title + " " + s.tip + " — walk me through this mini-split install step"
        );
      }
    };
    root.querySelector("#ms-back").onclick = () => {
      if (step > 0) {
        step--;
        render();
      }
    };
    root.querySelector("#ms-hub").onclick = () => {
      if (onDone) onDone(false);
    };
  }

  function targetText(m) {
    if (m.key === "microns" || m.key === "decay") return `Target: ≤ ${m.max} ${m.unit} (aim ~${m.target})`;
    if (m.key === "torque") return `Target: ${m.min}–${m.max} ${m.unit}`;
    if (m.key === "n2") return `Target: ${m.min}–${m.max} ${m.unit}`;
    if (m.key === "flareQuality") return `Target: ≥ ${m.min}${m.unit}`;
    if (m.key === "deltaT") return `Target: ≥ ${m.min} ${m.unit} supply drop in cool`;
    return "";
  }

  function attempt(s) {
    const fb = root.querySelector("#ms-feedback");
    if (s.metric) {
      const v = values[s.metric.key];
      const m = s.metric;
      let ok = true;
      let why = "";
      if (m.key === "flareQuality" && v < m.min) {
        ok = false;
        why = "Flare is rough or incomplete — recut, deburr, and re-flare.";
      }
      if (m.key === "torque" && (v < m.min || v > m.max)) {
        ok = false;
        why = v < m.min ? "Under-torqued — likely leak path." : "Over-torqued — risk of cracked flare.";
      }
      if (m.key === "n2" && (v < m.min || v > m.max + 50)) {
        ok = false;
        why = "Bring dry nitrogen into the OEM test band (~450–550 psig).";
      }
      if (m.key === "microns" && v > m.max) {
        ok = false;
        why = "Still above 500 microns — keep pumping or check for restriction/leaks.";
      }
      if (m.key === "decay" && v > m.max) {
        ok = false;
        why = "Decay failed — continuous rise means a leak; high plateau means moisture.";
      }
      if (m.key === "deltaT" && v < m.min) {
        ok = false;
        why = "Low ΔT — verify valves open, airflow, and mode.";
      }
      if (!ok) {
        fb.textContent = why;
        fb.className = "ms-feedback bad";
        return;
      }
    }

    if (finished) return;
    done[s.id] = true;
    fb.textContent = "Step complete.";
    fb.className = "ms-feedback good";
    if (onXp) onXp(12);

    if (step >= STEPS.length - 1) {
      if (finished) return;
      finished = true;
      fb.textContent = "Install complete — mini-split commissioned. Awaiting payroll…";
      if (onXp) onXp(40);
      setTimeout(() => {
        if (onDone) onDone(true);
      }, 900);
      return;
    }
    setTimeout(() => {
      step++;
      render();
    }, 550);
  }

  function start(host, opts) {
    root = host;
    onXp = opts && opts.onXp;
    onDone = opts && opts.onDone;
    systemName = (opts && opts.systemName) || "Daikin Aurora Mini-Split";
    step = 0;
    done = {};
    finished = false;
    values = { flareQuality: 50, torque: 10, n2: 200, microns: 2500, decay: 2500, deltaT: 8 };
    render();
    return {
      stop() {},
    };
  }

  global.MiniSplitInstall = { start, STEPS };
})(window);
