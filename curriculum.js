/* Lincoln Tech HVAC Allstars — Curriculum Training Mode
   Maps program-style course units to in-game simulators so students
   can rehearse before physical lab. Course codes mirror common LT HVAC
   diploma structure (HCR / HV series) for study planning — not an
   official catalog replacement. */
(function (global) {
  "use strict";

  const UNITS = [
    {
      id: "hcr101",
      code: "HCR101",
      title: "Introduction to Climate Control",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Heat transfer & energy",
        "Temperature / pressure relationships",
        "Copper cut, bend, flare, swage",
        "Safety & PPE",
      ],
      labGoal: "Identify cycle parts and practice flaring before shop copper work.",
      practice: [
        { mode: "sandbox", label: "Build a basic cycle in sandbox" },
        { mode: "minisplit", label: "Mini-split install · flare & torque steps" },
      ],
    },
    {
      id: "hcr102",
      code: "HCR102",
      title: "Electricity",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Ohm’s law & circuits",
        "Motors & capacitors",
        "Multimeter use",
        "Control circuits & schematics",
      ],
      labGoal: "Read voltage/amps mentally; wire power & comms on a mini-split.",
      practice: [
        { mode: "minisplit", label: "Electrical & communication step" },
        { mode: "service", label: "Diagnose electrical faults quiz" },
      ],
    },
    {
      id: "hcr105",
      code: "HCR105",
      title: "Basic Refrigeration Systems",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Refrigeration cycle",
        "Compressors, TXV, capillary",
        "Evacuation & charging",
        "P/T chart & SH/SC",
      ],
      labGoal: "Assemble a cycle, watch refrigerant flow, read live pressures.",
      practice: [
        { mode: "sandbox", label: "Sandbox · pressures + flow particles" },
        { mode: "service", label: "SH/SC fault diagnosis" },
      ],
    },
    {
      id: "hcr117",
      code: "HCR117",
      title: "Air Conditioning Systems",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Split & package units",
        "Ductless mini-splits",
        "Heat pumps",
        "Start-up & commissioning",
      ],
      labGoal: "Run a full mini-split install sequence before lab day.",
      practice: [
        { mode: "minisplit", label: "Full 11-step mini-split install" },
        { mode: "sandbox", label: "Load Daikin / Carrier / Goodman templates" },
      ],
    },
    {
      id: "hcr108",
      code: "HCR108",
      title: "A/C Design & Energy Conservation",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Load concepts",
        "Equipment selection",
        "Air distribution basics",
        "Efficiency & SEER ideas",
      ],
      labGoal: "Compare brand systems in sandbox and note operating bands.",
      practice: [
        { mode: "sandbox", label: "Compare brand system templates" },
      ],
    },
    {
      id: "hcr109",
      code: "HCR109",
      title: "Commercial Refrigeration",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Walk-ins & reach-ins",
        "Parallel racks concepts",
        "Defrost strategies",
        "Commercial troubleshooting",
      ],
      labGoal: "Practice commercial fault thinking with diagnose quizzes.",
      practice: [
        { mode: "service", label: "Commercial-leaning fault quiz" },
        { mode: "sandbox", label: "Build high-side / low-side scenarios" },
      ],
    },
    {
      id: "hcr110",
      code: "HCR110",
      title: "Troubleshooting",
      hours: "60 lec / 60 lab",
      credits: "5.0",
      topics: [
        "Systematic diagnosis",
        "Superheat / subcooling",
        "Electrical vs mechanical",
        "Customer communication",
      ],
      labGoal: "Close service tickets; get paid for correct diagnoses.",
      practice: [
        { mode: "service", label: "Service ticket quiz (paid)" },
      ],
    },
    {
      id: "epa608",
      code: "EPA 608",
      title: "Refrigerant Standards & Certification",
      hours: "Prep module",
      credits: "Cert track",
      topics: [
        "Clean Air Act Section 608",
        "Recovery / recycle / reclaim",
        "Cylinder handling",
        "Core + Type I/II/III ideas",
      ],
      labGoal: "Respect recovery rules; never vent. Practice vacuum discipline.",
      practice: [
        { mode: "minisplit", label: "Nitrogen test + deep vacuum steps" },
        { mode: "sandbox", label: "Evacuation mindset in cycle sim" },
      ],
    },
    {
      id: "piping",
      code: "SHOP LAB",
      title: "Brazing, Soldering & Piping",
      hours: "Lab intensive",
      credits: "Shop",
      topics: [
        "Cut, deburr, flare",
        "Nitrogen purge while brazing",
        "Joint inspection",
        "Torque specs",
      ],
      labGoal: "Nail flare quality and torque in sim before torch time.",
      practice: [
        { mode: "minisplit", label: "Flare · torque · N₂ pressure test" },
      ],
    },
  ];


  const AI_COACH = {
    hcr101: {
      focus: ["heat transfer", "flare steps", "safety PPE", "copper cut deburr"],
      open: "I'm on HCR101 — walk me through heat transfer and a perfect flare before lab.",
      drills: ["Flare steps", "Install checklist", "Tools I need"],
    },
    hcr102: {
      focus: ["multimeter", "capacitor", "contactor", "thermostat wiring"],
      open: "HCR102 electricity — how do I test a dual run capacitor and read R-C on a thermostat?",
      drills: ["Capacitor testing", "Electrical", "Diagnostic order"],
    },
    hcr105: {
      focus: ["superheat", "subcooling", "undercharge", "vacuum"],
      open: "HCR105 refrigeration — explain high SH low SC and how to pull a vacuum to 500 microns.",
      drills: ["High SH and low SC means?", "How do I pull a vacuum?", "Pressure fingerprints"],
    },
    hcr117: {
      focus: ["mini-split install", "additional charge", "commissioning", "comms wires"],
      open: "HCR117 air conditioning — full mini-split install order and additional charge for long linesets.",
      drills: ["Mini-split install order", "Additional charge", "Commissioning"],
    },
    hcr108: {
      focus: ["load concepts", "SEER", "equipment selection", "brand systems"],
      open: "HCR108 design — how do brand charge charts and SEER ideas show up on a real job?",
      drills: ["Brand systems", "Nameplate help", "Install checklist"],
    },
    hcr109: {
      focus: ["commercial refrigeration", "defrost", "restriction", "recovery"],
      open: "HCR109 commercial — restriction vs undercharge fingerprints and recovery rules.",
      drills: ["Restriction / TXV", "EPA recovery rules", "Diagnostic order"],
    },
    hcr110: {
      focus: ["troubleshooting order", "short cycling", "customer talk", "no cool"],
      open: "HCR110 troubleshooting — give me the diagnostic order for a no-cool call.",
      drills: ["Diagnostic order", "No cooling", "Short cycling"],
    },
    epa608: {
      focus: ["recovery", "venting", "cylinders", "vacuum"],
      open: "EPA 608 prep — recovery rules, cylinder fill limits, and why we never vent.",
      drills: ["EPA recovery rules", "How do I pull a vacuum?", "Nitrogen pressure test"],
    },
    piping: {
      focus: ["flare", "torque", "nitrogen purge braze", "leak test"],
      open: "Shop piping lab — flare, torque, and nitrogen while brazing. Don't let me skip the nut.",
      drills: ["Flare steps", "Torque", "Brazing"],
    },
  };

  let root = null;
  let progress = {};
  let onLaunch = null;
  let onBack = null;
  let onAskHub = null;

  function loadProgress() {
    try {
      progress = JSON.parse(localStorage.getItem("lt-curriculum-progress") || "{}");
    } catch {
      progress = {};
    }
  }

  function saveProgress() {
    localStorage.setItem("lt-curriculum-progress", JSON.stringify(progress));
  }

  function mark(id) {
    progress[id] = true;
    saveProgress();
    const n = Object.keys(progress).filter((k) => progress[k]).length;
    if (n >= 3 && global.Badges) global.Badges.unlock("curriculum_3");
  }

  function el(html) {
    const d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstChild;
  }

  function render() {
    const doneCount = UNITS.filter((u) => progress[u.id]).length;
    const pct = Math.round((doneCount / UNITS.length) * 100);

    root.innerHTML = `
      <div class="cu-layout">
        <header class="cu-head">
          <div>
            <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
              <div class="brand-mark" style="width:28px;height:28px;font-size:14px">LT</div>
              <div class="brand-word">
                <strong style="font-size:15px">LINCOLN TECH</strong>
                <span>Curriculum · Training mode</span>
              </div>
            </div>
            <h2>Plan practice before lab</h2>
            <p class="cu-sub">Course-style units mapped to simulators. Rehearse flares, vacuum, pressures, and diagnosis before you hit the physical shop.</p>
            <div id="cu-hub-banter" class="hub-chip"></div>
          </div>
          <div class="cu-progress">
            <div class="ms-bar"><i style="width:${pct}%"></i></div>
            <span>${doneCount} / ${UNITS.length} units practiced</span>
            <button class="btn" id="cu-back">Shop floor</button>
          </div>
        </header>
        ${(() => {
          const n = UNITS.find((u) => !progress[u.id]);
          if (!n) return '<div class="cu-recommend">All units practiced — run Quiz Arena EPA/OSHA or Ask HUB for drills.</div>';
          return '<div class="cu-recommend"><strong>AI recommends next:</strong> ' + n.code + ' · ' + n.title +
            ' <button type="button" class="btn cu-ask-hub" data-unit="' + n.id + '">Study with HUB</button></div>';
        })()}
        <div class="cu-note">
          <strong>Study planner.</strong> Codes follow common Lincoln Tech HVAC diploma patterns (HCR series).
          Use this to line up game practice with what your instructor covers that week — then try it here before lab.
        </div>
        <div class="cu-grid">
          ${UNITS.map((u) => {
            const done = !!progress[u.id];
            return `
              <article class="cu-card ${done ? "done" : ""}" data-id="${u.id}">
                <header>
                  <span class="cu-code">${u.code}</span>
                  ${done ? '<span class="cu-badge">Practiced</span>' : ""}
                </header>
                <h3>${u.title}</h3>
                <p class="cu-meta">${u.hours} · ${u.credits}</p>
                <ul class="cu-topics">
                  ${u.topics.map((t) => `<li>${t}</li>`).join("")}
                </ul>
                <p class="cu-goal"><strong>Before lab:</strong> ${u.labGoal}</p>
                <div class="cu-actions">
                  ${u.practice
                    .map(
                      (p) =>
                        `<button class="btn primary cu-launch" data-mode="${p.mode}" data-unit="${u.id}">${p.label}</button>`
                    )
                    .join("")}
                  <button class="btn cu-ask-hub" data-unit="${u.id}">🦸 Ask HUB about this unit</button>
                  <button class="btn cu-mark" data-unit="${u.id}">${done ? "Practiced ✓" : "Mark practiced"}</button>
                </div>
              </article>
            `;
          }).join("")}
        </div>
        <p class="cu-foot">Unofficial study aid for Lincoln Tech HVAC Allstars students. Always follow your campus catalog, instructor, and lab safety rules.</p>
      </div>
    `;

    const banterEl = root.querySelector("#cu-hub-banter");
    if (banterEl && window.ProfessorHUB) {
      const line = window.ProfessorHUB.banter("hub");
      banterEl.innerHTML = '<img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" /><div><strong>Professor Andrew Hubbard</strong><p>' + line + '</p></div>';
    }

    root.querySelector("#cu-back").onclick = () => {
      if (onBack) onBack();
    };

    root.querySelectorAll(".cu-launch").forEach((btn) => {
      btn.onclick = () => {
        const unit = btn.dataset.unit;
        const mode = btn.dataset.mode;
        mark(unit);
        if (onLaunch) onLaunch(mode, unit);
      };
    });

    root.querySelectorAll(".cu-mark").forEach((btn) => {
      btn.onclick = () => {
        mark(btn.dataset.unit);
        render();
      };
    });

    root.querySelectorAll(".cu-ask-hub").forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.unit;
        if (onAskHub) onAskHub(id, AI_COACH[id] || null);
      };
    });
  }

  function nextRecommended() {
    for (const u of UNITS) {
      if (!progress[u.id]) return u;
    }
    return null;
  }


  function start(host, opts) {
    root = host;
    onLaunch = opts && opts.onLaunch;
    onBack = opts && opts.onBack;
    onAskHub = opts && opts.onAskHub;
    loadProgress();
    render();
    return {
      stop() {},
      refresh: render,
      nextRecommended,
      AI_COACH,
    };
  }

  global.CurriculumTrain = { start, UNITS, AI_COACH, nextRecommended };
})(window);
