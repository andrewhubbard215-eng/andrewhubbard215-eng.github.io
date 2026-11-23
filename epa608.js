/* EPA Section 608 tutor — shop law, not a dump of the question bank.
   Training aid. Official exam is an EPA-approved proctor. CFR / door card wins. */
(function (global) {
  "use strict";

  const KEY = "lt-e608-tutor-v1";

  const SECTIONS = [
    { id: "core", n: "0", name: "Core", blurb: "Ozone, venting, three R's, cylinders. Required for every card." },
    { id: "type1", n: "I", name: "Type I", blurb: "Factory-sealed, ≤5 lb. Windows, PTAC, fridge." },
    { id: "type2", n: "II", name: "Type II", blurb: "Splits, RTUs, racks. The HVAC card. 0\" or 10\" Hg." },
    { id: "type3", n: "III", name: "Type III", blurb: "Low-pressure chillers. 25 mm Hg absolute." },
  ];

  const LESSONS = {
    core: [
      {
        title: "The four cards + Core",
        hub: "Core is the law paper. Fail Core, you fail the cert. Core alone does not let you open a box.",
        body: `
          <p>608 is the <strong>appliance</strong>, not the jug. Same R-410A in a window unit is Type I. In a split it is Type II.</p>
          <table class="e608-table">
            <tr><th>Cert</th><th>What you can open</th></tr>
            <tr><td>Core</td><td>Nothing by itself</td></tr>
            <tr><td>Type I</td><td>Small appliances</td></tr>
            <tr><td>Type II</td><td>High / very-high pressure (splits, racks)</td></tr>
            <tr><td>Type III</td><td>Low-pressure chillers</td></tr>
            <tr><td>Universal</td><td>Core + I + II + III</td></tr>
          </table>
          <p><strong>609</strong> is cars. Different law. 608 does not expire. Universal Core must be <strong>proctored</strong> — open-book Core does not stack.</p>
          <p>Typical paper: 25 questions a section, 18/25 (72%) proctored.</p>`,
      },
      {
        title: "Ozone and the families",
        hub: "Chlorine eats ozone. HFCs do not. HFCs still heat the planet. Memorize the pattern, not the formula.",
        body: `
          <table class="e608-table">
            <tr><th>Family</th><th>Cl?</th><th>ODP</th><th>Shop gas</th></tr>
            <tr><td>CFC</td><td>Yes</td><td>Highest</td><td>R-12, R-11, R-502</td></tr>
            <tr><td>HCFC</td><td>Yes</td><td>Lower</td><td><strong>R-22</strong>, R-123</td></tr>
            <tr><td>HFC</td><td>No</td><td>Zero</td><td>R-134a, R-410A, R-32</td></tr>
            <tr><td>HFO</td><td>No</td><td>Zero</td><td>R-1234yf / ze</td></tr>
          </table>
          <p>One chlorine atom can knock out on the order of <strong>100,000</strong> ozone molecules. Montreal Protocol (1987) is the treaty. Clean Air Act <strong>Section 608</strong> is you, the tech.</p>`,
      },
      {
        title: "Don't vent. Dates. Penalty. Sales.",
        hub: "De minimis is a good-faith recovery with certified gear — not opening a system and walking away.",
        body: `
          <table class="e608-table">
            <tr><th>Date</th><th>Rule</th></tr>
            <tr><td><strong>July 1, 1992</strong></td><td>Illegal to vent CFC and HCFC</td></tr>
            <tr><td><strong>Nov 15, 1995</strong></td><td>Illegal to vent HFC / non-exempt substitutes</td></tr>
          </table>
          <p>Civil penalty indexes — on the order of <strong>$44,500+ per day per violation</strong>. Don't quote a 2010 number.</p>
          <p>To <strong>buy</strong> regulated refrigerant you need the 608 card. Wholesaler can ask.</p>
          <p>Exempt examples (listed uses): CO₂, nitrogen. That is not an excuse to blow 410A.</p>`,
      },
      {
        title: "The three R's",
        hub: "Recovered gas goes back in that system or another box the same owner has. Different customer = reclaim.",
        body: `
          <table class="e608-table">
            <tr><th>Word</th><th>What it is</th><th>Sell to a new owner?</th></tr>
            <tr><td><strong>Recover</strong></td><td>Take it out into a cylinder</td><td>No</td></tr>
            <tr><td><strong>Recycle</strong></td><td>Clean on the truck (oil sep + filter-drier)</td><td>No — same owner</td></tr>
            <tr><td><strong>Reclaim</strong></td><td>Off-site plant, <strong>AHRI 700</strong></td><td>Yes</td></tr>
          </table>
          <p><strong>Self-contained</strong> recovery has its own compressor. <strong>System-dependent (passive)</strong> uses the appliance compressor — <em>Type I only</em>.</p>`,
      },
      {
        title: "Cylinders, 80%, oils",
        hub: "Gray body, yellow top. Weigh it. Never refill a disposable. There is no drop-in.",
        body: `
          <ul class="e608-ul">
            <li>Recovery bottle: <strong>gray with yellow top</strong>, DOT refillable.</li>
            <li>Fill to <strong>80% by weight</strong> — vapor space so it doesn't hydro-lock in a hot truck.</li>
            <li>Disposable (DOT 39): recover the heel, kill the valve, scrap. Never recover into it.</li>
            <li>Hydrotest refillables typically <strong>every 5 years</strong>.</li>
            <li>Never mix refrigerants in one recovery bottle.</li>
          </ul>
          <p>HFC (R-134a / 410A) typically wants <strong>POE</strong>. CFC mineral oil does not drop in. Blends <strong>fractionate</strong> — you can't top off forever.</p>
          <p>Leak test with <strong>dry nitrogen</strong>. Never oxygen. Never shop air. Oil + O₂ is a bomb.</p>`,
      },
    ],
    type1: [
      {
        title: "The 5-pound rule",
        hub: "Both must be true: factory hermetic AND manufactured charge ≤ 5 lb. Nameplate, not what some animal stuffed in later.",
        body: `
          <p><strong>In:</strong> household fridge/freezer, window AC, PTAC, dehumidifier, vending, water cooler.</p>
          <p><strong>Out:</strong> any split, any 3-ton package, any walk-in. Those are Type II even at 6 lb.</p>
          <p>A 3 lb window box overcharged to 6 lb in the field is still Type I.</p>`,
      },
      {
        title: "90 / 80 or 4 inches",
        hub: "A running compressor helps push gas out, so the bar is higher. Dead compressor, they cut you slack — still not 'vent it.'",
        body: `
          <p>Post–Nov 15, 1993 recovery machine:</p>
          <table class="e608-table">
            <tr><th>Compressor</th><th>Recover at least</th></tr>
            <tr><td>Running</td><td><strong>90%</strong> of the charge <em>or</em> <strong>4" Hg</strong></td></tr>
            <tr><td>Dead</td><td><strong>80%</strong> <em>or</em> <strong>4" Hg</strong></td></tr>
          </table>
          <p>Passive (system-dependent) recovery is <strong>Type I only</strong>. Don't ride a split's compressor to empty it.</p>
          <p>Piercing valve is a Type I tool. Don't leave it on as a permanent port.</p>`,
      },
    ],
    type2: [
      {
        title: "This is the HVAC card",
        hub: "House splits, heat pumps, RTUs, racks. Not a window box. Not an R-123 chiller.",
        body: `
          <p>EPA buckets by <strong>liquid sat pressure at 104°F</strong>, not by 'it feels high.'</p>
          <table class="e608-table">
            <tr><th>Bucket</th><th>Shop gas</th></tr>
            <tr><td>Very high</td><td>R-13, R-23, R-503</td></tr>
            <tr><td><strong>High</strong></td><td><strong>R-22, R-407C, R-410A, R-502</strong></td></tr>
            <tr><td>Medium</td><td>R-12, R-134a, R-500</td></tr>
            <tr><td>Low (Type III)</td><td>R-11, R-123</td></tr>
          </table>
          <p>R-410A is <strong>high-pressure</strong> on that cut, not very-high.</p>`,
      },
      {
        title: "Recovery vacuum table",
        hub: "This is 608 recovery — how empty before you open. It is NOT the 500-micron dehydration pull after you braze.",
        body: `
          <p>Inches of Hg vacuum. Date is the <strong>recovery machine</strong>, not the condensing unit. Today's truck is post-1993.</p>
          <table class="e608-table">
            <tr><th>Appliance</th><th>Charge</th><th>Pre-1993</th><th>Post-1993</th></tr>
            <tr><td>Very high</td><td>any</td><td>0"</td><td>0"</td></tr>
            <tr><td>High</td><td>< 200 lb</td><td>0"</td><td><strong>0"</strong></td></tr>
            <tr><td>High</td><td>≥ 200 lb</td><td>4"</td><td><strong>10"</strong></td></tr>
            <tr><td>Medium</td><td>< 200 lb</td><td>4"</td><td>10"</td></tr>
            <tr><td>Medium</td><td>≥ 200 lb</td><td>4"</td><td><strong>15"</strong></td></tr>
          </table>
          <p><strong>0" vacuum = 0 psig = atmospheric.</strong> You did not pull a vacuum. That is the #1 trick.</p>
          <div class="e608-calc" id="e608-vac">
            <p class="eyebrow">Run the table</p>
            <label>Appliance
              <select id="vac-kind">
                <option value="vh">Very high-pressure</option>
                <option value="hi" selected>High-pressure (R-22 / 410A)</option>
                <option value="med">Medium-pressure (R-134a)</option>
              </select>
            </label>
            <label>Full charge
              <select id="vac-lbs">
                <option value="under" selected>Less than 200 lb</option>
                <option value="over">200 lb or more</option>
              </select>
            </label>
            <label>Recovery machine
              <select id="vac-year">
                <option value="post" selected>On/after Nov 15, 1993</option>
                <option value="pre">Before Nov 15, 1993</option>
              </select>
            </label>
            <p class="e608-vac-out" id="vac-out">0" Hg (0 psig)</p>
          </div>
          <p>House 3-ton 410A, modern machine: <strong>0 psig</strong>. 250 lb R-22 rack, modern machine: <strong>10" Hg</strong>. 300 lb R-134a: <strong>15"</strong> — 15" is medium, not 'the big high-pressure one.'</p>`,
      },
      {
        title: "Leaks, isolation, exceptions",
        hub: "The inches are measured on the system after the machine is off and the needle settles. Not while it's still sucking.",
        body: `
          <ul class="e608-ul">
            <li>You may recover an <strong>isolated component</strong> if you can valve it off. Charge size is then that piece.</li>
            <li>Leaking so bad you cannot hit the number: recover what you can and <strong>document</strong> why you stopped. Not 'I got bored.'</li>
            <li>Non-major repair that will not open to atmosphere: medium/high/very-high only need <strong>0 psig</strong>.</li>
            <li>AIM leak-repair (owner's duty) generally starts at <strong>15 lb</strong> HFC charge. Comfort cooling threshold <strong>10%</strong>, commercial refrigeration <strong>20%</strong>, IPR <strong>30%</strong>.</li>
          </ul>
          <p>Hitting 0 psig on a 2-ton <strong>satisfies 608</strong>. It does not dry the system. Microns are a different pump.</p>`,
      },
    ],
    type3: [
      {
        title: "Low-pressure chillers",
        hub: "The evaporator often sits in a vacuum. Air leaks in. That's why old CFC/HCFC machines have a purge.",
        body: `
          <p>Type III: centrifugal / low-pressure. R-11, R-123, R-1233zd class. Most residential shops never need this. Universal covers you if a plant calls.</p>
          <p><strong>Recovery: 25 mm Hg absolute</strong> — about 29" of vacuum. Not 25 inches Hg. Units matter.</p>
          <ul class="e608-ul">
            <li>Leak check with <strong>dry nitrogen</strong>. Never oxygen.</li>
            <li>Rupture disc on the vessel, typically around 15 psig.</li>
            <li>Pressurize for leak check with controlled heat / warm water — not a nitrogen blast you'll purge with refrigerant.</li>
          </ul>`,
      },
    ],
  };

  const DRILLS = {
    core: [
      { q: "Before opening a system that contains refrigerant you must:", choices: ["Vent carefully", "Recover the refrigerant", "Add nitrogen until empty", "Pump down and walk away"], a: 1, why: "608 requires recovery before opening. Venting is illegal." },
      { q: "R-22 is which family?", choices: ["CFC", "HCFC", "HFC", "HFO"], a: 1, why: "R-22 is an HCFC. R-12 is CFC. R-134a / 410A are HFC." },
      { q: "Venting CFCs and HCFCs became illegal on:", choices: ["Jan 1, 1987", "July 1, 1992", "Nov 15, 1995", "Jan 1, 2010"], a: 1, why: "July 1, 1992 for CFC/HCFC. Nov 15, 1995 added HFC/substitutes." },
      { q: "Recovered refrigerant can be sold to a new owner only after:", choices: ["Recycling on the truck", "Reclaim to AHRI 700", "Sitting 30 days", "Mixing with virgin"], a: 1, why: "Reclaim off-site to AHRI 700. Recycle stays with the same owner." },
      { q: "A recovery cylinder is filled to no more than about:", choices: ["100% liquid", "80% by weight", "Until the relief dumps", "Whatever fits"], a: 1, why: "80% by weight leaves vapor headspace. Weigh it." },
    ],
    type1: [
      { q: "Type I covers appliances that are:", choices: ["Any unit under 5 tons", "Factory hermetic with manufactured charge ≤ 5 lb", "Any split under 5 lb remaining", "MVAC on cars"], a: 1, why: "Both: factory sealed AND nameplate ≤ 5 lb. Remaining charge doesn't reclassify it." },
      { q: "A residential split with 6 lb of 410A is:", choices: ["Type I", "Type II", "Type III", "609"], a: 1, why: "Splits are Type II. Type I is factory-sealed small appliances." },
      { q: "Compressor running on a small appliance, post-1993 machine. Recover at least:", choices: ["50%", "80%", "90% or 4\" Hg", "10\" Hg"], a: 2, why: "90% if the compressor runs, or 4 inches Hg. 80% if the compressor is dead." },
      { q: "System-dependent (passive) recovery is legal on:", choices: ["Type I only", "Type II splits", "Type III chillers", "Any 608 appliance"], a: 0, why: "Passive uses the appliance compressor. Type I only." },
    ],
    type2: [
      { q: "House 3-ton 410A, modern recovery machine. Required recovery level:", choices: ["10\" Hg", "15\" Hg", "0\" (0 psig)", "25 mm Hg abs"], a: 2, why: "High-pressure, under 200 lb, post-1993 = 0 inches vacuum = 0 psig." },
      { q: "250 lb R-22 rack, recovery machine made in 2020. Pull to:", choices: ["0\"", "4\"", "10\" Hg", "15\" Hg"], a: 2, why: "High-pressure ≥ 200 lb, post-1993 = 10 inches Hg. 15\" is medium-pressure ≥ 200 lb." },
      { q: "0 inches of mercury vacuum means:", choices: ["Deep vacuum / 500 microns", "0 psig (atmospheric)", "29.9\" on the compound gauge", "25 mm Hg absolute"], a: 1, why: "0\" vacuum is atmospheric — 0 psig. Not a dehydration pull." },
      { q: "R-410A on the 104°F EPA cut is:", choices: ["Low-pressure", "Medium-pressure", "High-pressure", "Type I always"], a: 2, why: "R-410A is high-pressure. Very-high is R-13 / R-23 class." },
      { q: "AIM leak-repair for comfort cooling generally uses a threshold of:", choices: ["5%", "10%", "20%", "30%"], a: 1, why: "Comfort cooling 10%. Commercial refrigeration 20%. IPR 30%. Scope typically 15 lb+." },
    ],
    type3: [
      { q: "Type III recovery target is:", choices: ["0 psig", "10\" Hg", "15\" Hg", "25 mm Hg absolute"], a: 3, why: "Low-pressure appliances: 25 mm Hg absolute, not 25 inches." },
      { q: "Type III equipment is typically:", choices: ["Window AC", "Residential 410A splits", "Low-pressure centrifugal chillers", "Car AC"], a: 2, why: "Chillers. R-11 / R-123 class. Splits are Type II." },
      { q: "Leak-test a low-pressure chiller with:", choices: ["Oxygen", "Shop air", "Dry nitrogen", "More refrigerant until it hisses"], a: 2, why: "Dry nitrogen. Oxygen + oil is a bomb." },
    ],
  };

  function load() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "{}");
    } catch (_) {
      return {};
    }
  }
  function save(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (_) {}
  }
  function prog() {
    const p = load();
    SECTIONS.forEach((s) => {
      if (!p[s.id]) p[s.id] = { lesson: 0, drillBest: 0, stamped: false };
    });
    return p;
  }

  function vacLevel(kind, lbs, year) {
    if (kind === "vh") return { n: 0, say: "0\" Hg (0 psig) — very-high never needs a deep 608 pull." };
    const over = lbs === "over";
    const post = year === "post";
    if (kind === "hi") {
      if (!over) return { n: 0, say: "0\" Hg (0 psig) — high-pressure under 200 lb." };
      return post
        ? { n: 10, say: "10\" Hg — high-pressure, 200 lb or more, modern machine." }
        : { n: 4, say: "4\" Hg — high-pressure, 200 lb or more, pre-1993 machine." };
    }
    if (!over) {
      return post
        ? { n: 10, say: "10\" Hg — medium-pressure under 200 lb, modern machine." }
        : { n: 4, say: "4\" Hg — medium-pressure, pre-1993 machine." };
    }
    return post
      ? { n: 15, say: "15\" Hg — medium-pressure, 200 lb or more. Not the high-pressure trap." }
      : { n: 4, say: "4\" Hg — medium-pressure, 200 lb or more, pre-1993 machine." };
  }

  function wireVac(host) {
    const box = host.querySelector("#e608-vac");
    if (!box) return;
    const out = host.querySelector("#vac-out");
    function paint() {
      const k = host.querySelector("#vac-kind").value;
      const l = host.querySelector("#vac-lbs").value;
      const y = host.querySelector("#vac-year").value;
      const r = vacLevel(k, l, y);
      out.textContent = r.say;
    }
    box.querySelectorAll("select").forEach((el) => {
      el.onchange = paint;
    });
    paint();
  }

  function start(host, opts) {
    const hooks = opts || {};
    let view = "home";
    let sec = "core";
    let li = 0;
    let drillI = 0;
    let drillScore = 0;
    let answered = false;

    function goHub() {
      if (hooks.onHub) hooks.onHub();
    }
    function goExam() {
      if (hooks.onExam) hooks.onExam();
      else goHub();
    }

    function paint() {
      if (view === "home") paintHome();
      else if (view === "lesson") paintLesson();
      else if (view === "drill") paintDrill();
      else if (view === "result") paintResult();
    }

    function paintHome() {
      const p = prog();
      const stamps = SECTIONS.filter((s) => p[s.id].stamped).length;
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div class="brand-bar" style="justify-content:flex-start">
              <div class="brand-mark" style="width:28px;height:28px;font-size:13px">608</div>
              <div class="brand-word">
                <strong style="font-size:15px">EPA 608 TUTOR</strong>
                <span>Professor HUB · shop law · not the official exam</span>
              </div>
            </div>
            <button class="btn" id="e608-hub">Shop floor</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 14px">
            <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
            <div>
              <strong>Professor HUB</strong>
              <p>608 is the appliance, not the jug. Walk Core, then the type you work. Stamp a section at 80%. Then sit the All-Star Exam.</p>
            </div>
          </div>
          <p class="e608-progress">${stamps} / 4 sections stamped${stamps === 4 ? " · Universal track complete" : ""}</p>
          <div class="e608-secs">
            ${SECTIONS.map((s) => {
              const st = p[s.id];
              return `<button type="button" class="e608-sec${st.stamped ? " stamped" : ""}" data-sec="${s.id}">
                <b>Type ${s.n}</b>
                <strong>${s.name}</strong>
                <span>${s.blurb}</span>
                <em>${st.stamped ? "STAMPED " + st.drillBest + "%" : st.lesson ? "Lesson " + st.lesson : "Not started"}</em>
              </button>`;
            }).join("")}
          </div>
          <div class="e608-actions">
            <button class="btn primary" id="e608-exam">All-Star Exam · 608 pack</button>
          </div>
          <p class="e608-fine">Training aid from EPA test topics and 40 CFR 82. Not a substitute for an EPA-approved certifying organization. Penalty amounts index. Door card / CFR wins.</p>
        </div>`;
      host.querySelector("#e608-hub").onclick = goHub;
      host.querySelector("#e608-exam").onclick = goExam;
      host.querySelectorAll(".e608-sec").forEach((btn) => {
        btn.onclick = () => {
          sec = btn.getAttribute("data-sec");
          const st = prog()[sec];
          li = Math.min(st.lesson || 0, (LESSONS[sec] || []).length - 1);
          view = "lesson";
          paint();
        };
      });
    }

    function paintLesson() {
      const list = LESSONS[sec] || [];
      const L = list[li] || list[0];
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} · ${li + 1} / ${list.length}</p>
              <h2>${L.title}</h2>
            </div>
            <button class="btn" id="e608-back">Sections</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 12px">
            <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
            <div><strong>HUB</strong><p>${L.hub}</p></div>
          </div>
          <div class="e608-body">${L.body}</div>
          <div class="e608-actions">
            <button class="btn" id="e608-prev" ${li === 0 ? "disabled" : ""}>Back</button>
            <button class="btn primary" id="e608-next">${li < list.length - 1 ? "Next lesson" : "Drill this section"}</button>
          </div>
        </div>`;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      const prev = host.querySelector("#e608-prev");
      if (prev) {
        prev.onclick = () => {
          if (li > 0) {
            li -= 1;
            paint();
          }
        };
      }
      host.querySelector("#e608-next").onclick = () => {
        const p = prog();
        p[sec].lesson = Math.max(p[sec].lesson || 0, li + 1);
        save(p);
        if (li < list.length - 1) {
          li += 1;
          paint();
        } else {
          drillI = 0;
          drillScore = 0;
          answered = false;
          view = "drill";
          paint();
        }
      };
      wireVac(host);
    }

    function paintDrill() {
      const bank = DRILLS[sec] || [];
      const item = bank[drillI];
      if (!item) {
        view = "result";
        paint();
        return;
      }
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} drill · ${drillI + 1} / ${bank.length}</p>
              <h2>${item.q}</h2>
            </div>
            <button class="btn" id="e608-back">Sections</button>
          </header>
          <div class="e608-choices" id="e608-choices">
            ${item.choices
              .map(
                (c, i) =>
                  `<button type="button" class="e608-choice" data-i="${i}"><span>${"ABCD"[i]}</span>${c}</button>`
              )
              .join("")}
          </div>
          <p class="e608-why hidden" id="e608-why"></p>
          <div class="e608-actions">
            <button class="btn primary hidden" id="e608-dnext">Next</button>
          </div>
        </div>`;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      const why = host.querySelector("#e608-why");
      const next = host.querySelector("#e608-dnext");
      host.querySelectorAll(".e608-choice").forEach((btn) => {
        btn.onclick = () => {
          if (answered) return;
          answered = true;
          const i = +btn.getAttribute("data-i");
          const ok = i === item.a;
          if (ok) drillScore += 1;
          btn.classList.add(ok ? "ok" : "bad");
          host.querySelectorAll(".e608-choice").forEach((b) => {
            if (+b.getAttribute("data-i") === item.a) b.classList.add("ok");
            b.disabled = true;
          });
          why.textContent = (ok ? "Why it's right: " : "Why it's wrong: ") + item.why;
          why.classList.remove("hidden");
          next.classList.remove("hidden");
        };
      });
      next.onclick = () => {
        answered = false;
        drillI += 1;
        if (drillI >= bank.length) view = "result";
        paint();
      };
    }

    function paintResult() {
      const bank = DRILLS[sec] || [];
      const pct = bank.length ? Math.round((drillScore / bank.length) * 100) : 0;
      const pass = pct >= 80;
      const p = prog();
      p[sec].drillBest = Math.max(p[sec].drillBest || 0, pct);
      if (pass) p[sec].stamped = true;
      save(p);
      if (pass && hooks.onStamp) hooks.onStamp();
      if (pass && global.Badges && global.Badges.unlock) {
        global.Badges.unlock("epa_tutor");
        const all = SECTIONS.every((s) => prog()[s.id].stamped);
        if (all) global.Badges.unlock("epa_universal");
      }
      const sdef = SECTIONS.find((s) => s.id === sec) || SECTIONS[0];
      host.innerHTML = `
        <div class="e608-shell">
          <header class="e608-head">
            <div>
              <p class="eyebrow">${sdef.name} drill</p>
              <h2>${drillScore} / ${bank.length} · ${pct}%</h2>
            </div>
            <button class="btn" id="e608-hub">Shop floor</button>
          </header>
          <div class="hub-chip" style="max-width:none;margin:0 0 12px">
            <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
            <div>
              <strong>HUB</strong>
              <p>${pass
                ? "Stamped. That's a prove path, not a lucky guess. Sit the exam when you're ready."
                : "Under 80%. Read the why, run the lessons again. The test does not grade effort."}</p>
            </div>
          </div>
          <div class="e608-actions">
            <button class="btn" id="e608-retry">Retry drill</button>
            <button class="btn" id="e608-back">Sections</button>
            <button class="btn primary" id="e608-exam">All-Star Exam</button>
          </div>
        </div>`;
      host.querySelector("#e608-hub").onclick = goHub;
      host.querySelector("#e608-back").onclick = () => {
        view = "home";
        paint();
      };
      host.querySelector("#e608-exam").onclick = goExam;
      host.querySelector("#e608-retry").onclick = () => {
        drillI = 0;
        drillScore = 0;
        answered = false;
        view = "drill";
        paint();
      };
    }

    paint();
    return { stop() {} };
  }

  global.Epa608Tutor = { start, SECTIONS };
})(window);
