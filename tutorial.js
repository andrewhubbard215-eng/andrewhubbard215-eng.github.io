/* Professor HUB site tutorial — walks a student through the shop */
(function (global) {
  "use strict";

  const STEPS = [
    {
      id: "welcome",
      title: "Welcome to the floor",
      say: "I'm Professor Hubbard — HUB. This is Lincoln Tech HVAC Allstars. You clock in, you train, you get paid in XP. I'll walk you through every door. Don't skip the quiz. Don't vent. Let's go.",
      highlight: null,
    },
    {
      id: "locker",
      title: "Your locker",
      say: "Top right: Locker. Put your name, campus, and a photo. That's how the exam board and the shop know you. Callsign HUB if you want the Rapture unlocked like an instructor.",
      highlight: "#hub-locker",
    },
    {
      id: "quiz",
      title: "All-Star Exam",
      say: "First card. EPA 608, OSHA 30, and Lincoln Tech curriculum. Four colors, timer, points for speed. Host a class with a 6-digit PIN — students join on their phones. Solo works too. This is how you prove 608 recovery, LOTO, and SH/SC.",
      highlight: '[data-mode="quiz"]',
      launch: "quiz",
    },
    {
      id: "sandbox",
      title: "System sandbox",
      say: "Drag-and-drop the cycle like CoolGame. Compressor, condenser, metering, evaporator. Hit Start and I'll roast your superheat and subcooling. Watch refrigerant flow in the pipes. This is the sim.",
      highlight: '[data-mode="sandbox"]',
      launch: "sandbox",
    },
    {
      id: "electrical",
      title: "Electrical sim",
      say: "240 and 24 volt. Contactor, cap, safeties. Put the DMM on it — volts, amps, microfarads. Lock it out in your head before you probe. Live circuits bite.",
      highlight: '[data-mode="electrical"]',
      launch: "electrical",
    },
    {
      id: "ai",
      title: "Ask HUB / AI helper",
      say: "AI Install & Troubleshoot is the step-by-step. The floating Ask HUB button is me, on every screen. Flare, vacuum, recovery tanks, push-pull, fill percent — ask. I'll talk like the shop, not a textbook.",
      highlight: '[data-mode="aihelper"]',
      launch: "aihelper",
    },
    {
      id: "laws",
      title: "Commandments",
      say: "Ten shop laws. Recover first. Nut on the tube before the flare. Dry nitrogen only. Microns, not a compound gauge. HVAC Jesus will list them if you make All-Star. Live them before you preach them.",
      highlight: '[data-mode="commandments"]',
      launch: "commandments",
    },
    {
      id: "jobs",
      title: "Labs and service",
      say: "Mini-split install is an 11-step lab — flare, N₂, vacuum, commission, get paid. Service calls are broken systems and customers. Spicy mode if you want rude ones. Curriculum is HCR units before you hit the floor.",
      highlight: '[data-mode="minisplit"]',
    },
    {
      id: "class",
      title: "Class compete",
      say: "Online All-Star Arena: PIN exams, shop chat, leaderboard. You host. They join. Same site. Class vs class on phones.",
      highlight: '[data-mode="compete"]',
      launch: "compete",
    },
    {
      id: "done",
      title: "You're on the clock",
      say: "That's the site. All-Star Exam first if you're studying 608. Sandbox if you want pressures. Ask me anything with Ask HUB. Recover, don't vent. Now get to work.",
      highlight: null,
    },
  ];

  let root, hooks, i = 0;

  function clearHi() {
    document.querySelectorAll(".tut-hi").forEach((el) => el.classList.remove("tut-hi"));
  }

  function render() {
    if (!root) return;
    const s = STEPS[i];
    const last = i >= STEPS.length - 1;
    const first = i <= 0;
    clearHi();
    if (s.highlight) {
      const el = document.querySelector("#screen-hub " + s.highlight) || document.querySelector(s.highlight);
      if (el) {
        el.classList.add("tut-hi");
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
    root.classList.remove("hidden");
    root.innerHTML =
      '<div class="tut-card">' +
      '<img src="hub-portrait.jpg" alt="Professor HUB" class="tut-face" />' +
      '<div class="tut-body">' +
      '<p class="eyebrow">Professor HUB · tutorial ' + (i + 1) + "/" + STEPS.length + "</p>" +
      "<h3>" + s.title + "</h3>" +
      "<p class=\"tut-say\">“" + s.say + "”</p>" +
      '<div class="tut-row">' +
      '<button type="button" class="btn" id="tut-back"' + (first ? " disabled" : "") + ">Back</button>" +
      (s.launch ? '<button type="button" class="btn" id="tut-try">Open it</button>' : "") +
      '<button type="button" class="btn primary" id="tut-next">' + (last ? "Got it · shop floor" : "Next") + "</button>" +
      '<button type="button" class="btn" id="tut-skip">Skip tour</button>' +
      "</div></div></div>";
    root.querySelector("#tut-back").onclick = () => {
      if (i > 0) {
        i -= 1;
        render();
      }
    };
    root.querySelector("#tut-next").onclick = () => {
      if (last) finish();
      else {
        i += 1;
        render();
      }
    };
    root.querySelector("#tut-skip").onclick = finish;
    const t = root.querySelector("#tut-try");
    if (t && s.launch) {
      t.onclick = () => {
        finish();
        if (hooks.onLaunch) hooks.onLaunch(s.launch);
      };
    }
  }

  function finish() {
    clearHi();
    if (root) {
      root.classList.add("hidden");
      root.innerHTML = "";
    }
    if (hooks.onDone) hooks.onDone();
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    i = 0;
    render();
    return { stop: finish };
  }

  global.HubTutorial = { start, STEPS };
})(window);
