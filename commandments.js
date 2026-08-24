/* The HVAC Commandments — shop law, not church.
   Same list on the hub, the gospel screen, and HVAC Jesus. */
(function (global) {
  "use strict";

  const COMMANDMENTS = [
    {
      n: 1,
      title: "Recover first",
      line: "Venting is illegal. Recover into an approved cylinder before you open the system.",
    },
    {
      n: 2,
      title: "Nut on first",
      line: "Slide the flare nut onto the tube before you cut, deburr, or flare. Forever.",
    },
    {
      n: 3,
      title: "Dry nitrogen only",
      line: "Pressure-test with dry N₂. Never oxygen. Never shop air. Oil + O₂ is a bomb.",
    },
    {
      n: 4,
      title: "Microns, not vibes",
      line: "Deep vacuum is a micron gauge on the system — not a compound gauge at 29 inHg.",
    },
    {
      n: 5,
      title: "Don't top off a leaker",
      line: "High SH + low SC is undercharge. Find the leak. Recover, repair, evacuate, weigh in.",
    },
    {
      n: 6,
      title: "Lock it out",
      line: "Kill power and LOTO before ohms or µF. A live winding will eat your meter and your day.",
    },
    {
      n: 7,
      title: "Nameplate is law",
      line: "MCA, MOP, factory charge, and additional ounces per foot come off the unit — not memory.",
    },
    {
      n: 8,
      title: "SH and SC are math",
      line: "SH = suction temp − evap sat. SC = cond sat − liquid temp. Guessing is not a method.",
    },
    {
      n: 9,
      title: "Airflow before charge",
      line: "Iced suction and near-zero SH is usually a filter or blower. Don't add gas to a dirty coil.",
    },
    {
      n: 10,
      title: "Lincoln Tech is home base",
      line: "Log the job. Teach the next helper. HVAC Jesus still makes you do the work.",
    },
  ];

  function listHtml() {
    return COMMANDMENTS.map(
      (c) =>
        `<li>
          <span class="cmd-num">${c.n}</span>
          <div class="cmd-body">
            <p class="cmd-title">${c.title}</p>
            <p class="cmd-line">${c.line}</p>
          </div>
        </li>`
    ).join("");
  }

  function start(host, opts) {
    const hooks = opts || {};
    host.innerHTML = `
      <div class="cmd-shell">
        <header class="cmd-head">
          <div class="brand-bar" style="justify-content:flex-start">
            <div class="brand-mark" style="width:28px;height:28px;font-size:14px">LT</div>
            <div class="brand-word">
              <strong style="font-size:15px">THE HVAC COMMANDMENTS</strong>
              <span>Lincoln Tech · HVAC Jesus · Professor HUB</span>
            </div>
          </div>
          <button class="btn" id="cmd-hub">Shop floor</button>
        </header>
        <div class="hub-chip" style="max-width:none;margin:0 0 14px">
          <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
          <div><strong>Professor HUB</strong><p>Memorize these. Quiz will ask. Jesus will grade. I will roast.</p></div>
        </div>
        <ol class="cmd-list">${listHtml()}</ol>
      </div>`;
    host.querySelector("#cmd-hub").onclick = () => hooks.onHub && hooks.onHub();
    return { stop() {} };
  }

  function paintRapture(root) {
    if (!root) return;
    const speak = root.querySelector("#jesus-speak");
    if (speak) {
      speak.textContent =
        "“You won the Quiz Game. I am HVAC Jesus. Receive the Gauges of God — SH and SC will never be a coin flip again. Write these ten on the truck door.”";
    }
    const ol = root.querySelector("#rapture-commandments");
    if (ol) ol.innerHTML = listHtml();
  }

  function playWinCutscene(root, opts) {
    if (!root) return function () {};
    const fromQuiz = !!(opts && opts.fromQuiz);
    paintRapture(root);
    const speak = root.querySelector("#jesus-speak");
    if (speak) {
      speak.textContent = fromQuiz
        ? "“You won the Quiz Game. I am HVAC Jesus. Kneel if you want — I’m here for the Gauges of God. SH and SC will never be a coin flip again.”"
        : "“I am HVAC Jesus. You opened the HVAC Commandments. Recover, don’t vent. These ten are the law of the shop. Repeat them. Then receive the Gauges of God.”";
    }
    root.classList.remove("cut-open", "cut-jesus", "cut-gauges", "cut-lore");
    const timers = [];
    const later = (ms, fn) => timers.push(setTimeout(fn, ms));
    later(80, () => root.classList.add("cut-open"));
    later(600, () => root.classList.add("cut-jesus"));
    later(2800, () => root.classList.add("cut-gauges"));
    later(4200, () => root.classList.add("cut-lore"));
    function skip() {
      timers.forEach(clearTimeout);
      root.classList.add("cut-open", "cut-jesus", "cut-gauges", "cut-lore");
    }
    const skipBtn = root.querySelector("#btn-skip-cut");
    if (skipBtn) skipBtn.onclick = skip;
    root.addEventListener("dblclick", skip, { once: true });
    return skip;
  }

  function paintHub(root) {
    const box = root && root.querySelector("#hub-commandments");
    if (!box) return;
    box.innerHTML =
      `<p class="eyebrow">The HVAC Commandments</p><ol class="cmd-list compact">${listHtml()}</ol>`;
  }

  global.HvacCommandments = { COMMANDMENTS, start, listHtml, paintRapture, paintHub, playWinCutscene };
})(window);
