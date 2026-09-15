/* Daily Training Aid — streak, today's plan, practice log */
(function (global) {
  "use strict";

  const KEY = "lt-hvac-daily-v1";

  const DRILLS = [
    {
      id: "minisplit",
      mode: "minisplit",
      title: "Mini-split install",
      minutes: 12,
      skill: "install",
      why: "Flare · torque · N₂ · vacuum · valves · commission",
      tip: "Flare, torque, N₂ pressure test, pull vacuum, then open service valves last. Don't commission a wet line.",
    },
    {
      id: "sandbox",
      mode: "sandbox",
      title: "Cycle sandbox",
      minutes: 8,
      skill: "cycle",
      why: "Pressures, SH/SC, refrigerant flow on real brand templates",
      tip: "Four parts LEFT, then gauges. Read SH/SC before you add gas. High SH + high SC is restriction, not low charge.",
    },
    {
      id: "electrical",
      mode: "electrical",
      title: "Follow the call",
      minutes: 10,
      skill: "electrical",
      why: "Walk the 24V string · G/blower before HPC · no indoor air ices the coil",
      tip: "Y with no indoor air ices the coil. Confirm G/blower before you chase gas or HPC.",
    },
    {
      id: "defusal",
      mode: "defusal",
      title: "Saturday callback",
      minutes: 8,
      skill: "electrical",
      why: "Timed no-cool · meter the open · don't jump the float",
      tip: "Saturday callback: meter the open. Don't jump the float or you own the next flood.",
    },
    {
      id: "service",
      mode: "service",
      title: "Service calls",
      minutes: 10,
      skill: "diagnose",
      why: "Customer talk + fault diagnosis under pressure",
      tip: "Talk first, then gauges. Write the no-cool sheet before you guess the part.",
    },
    {
      id: "quiz",
      mode: "quiz",
      title: "Shop quiz bench",
      minutes: 8,
      skill: "theory",
      why: "EPA 608 · OSHA · P/T · shop curriculum",
      tip: "P/T chart first. If you can't name sat temp from the gauge, you are not ready to charge.",
    },
    {
      id: "epa608",
      mode: "epa608",
      title: "EPA 608 tutor",
      minutes: 10,
      skill: "theory",
      why: "Core · Type I/II/III · recovery vacuum table",
      tip: "Stamp the section, then sit the exam. Recovery vacuum table is not optional.",
    },
    {
      id: "curriculum",
      mode: "curriculum",
      title: "Curriculum unit",
      minutes: 10,
      skill: "study",
      why: "HCR-style course units mapped to sims",
      tip: "Finish the unit, then hit the matching lab. Reading without gauges is homework, not shop.",
    },
  ];

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

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

  function get() {
    const data = load();
    if (!data.skills) data.skills = {};
    if (!data.log) data.log = [];
    if (typeof data.streak !== "number") data.streak = 0;
    if (!data.lastDay) data.lastDay = "";
    if (!data.todayDone) data.todayDone = [];
    return data;
  }

  function touchLogin() {
    const data = get();
    const t = todayKey();
    if (data.lastDay === t) {
      return data;
    }
    if (data.lastDay === yesterdayKey()) {
      data.streak = (data.streak || 0) + 1;
    } else if (data.lastDay) {
      data.streak = 1;
    } else {
      data.streak = 1;
    }
    data.lastDay = t;
    data.todayDone = [];
    save(data);
    return data;
  }

  function recordPractice(drillId, meta) {
    const data = get();
    const t = todayKey();
    if (data.lastDay !== t) touchLogin();
    const d2 = get();
    if (!d2.todayDone.includes(drillId)) d2.todayDone.push(drillId);
    const skill = (DRILLS.find((d) => d.id === drillId) || {}).skill || drillId;
    d2.skills[skill] = (d2.skills[skill] || 0) + 1;
    d2.log.unshift({
      day: t,
      drill: drillId,
      at: Date.now(),
      meta: meta || null,
    });
    d2.log = d2.log.slice(0, 60);
    save(d2);
    return d2;
  }

  function goalMet(data) {
    data = data || get();
    return (data.todayDone || []).length >= 1;
  }

  function recommend() {
    const data = get();
    const counts = data.skills || {};
    const skillOrder = ["install", "cycle", "electrical", "diagnose", "theory", "study"];
    const ranked = DRILLS.slice().sort((a, b) => {
      const ca = counts[a.skill] || 0;
      const cb = counts[b.skill] || 0;
      const ia = skillOrder.indexOf(a.skill);
      const ib = skillOrder.indexOf(b.skill);
      if (ca !== cb) return ca - cb;
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    const done = data.todayDone || [];
    const pick = ranked.find((d) => !done.includes(d.id)) || ranked[0];
    const second = ranked.find((d) => d.id !== pick.id && !done.includes(d.id));
    return { primary: pick, secondary: second || null, data };
  }

  function streakBonus(streak) {
    if (streak >= 14) return { xp: 40, cash: 25 };
    if (streak >= 7) return { xp: 25, cash: 15 };
    if (streak >= 3) return { xp: 15, cash: 10 };
    if (streak >= 1) return { xp: 8, cash: 5 };
    return { xp: 0, cash: 0 };
  }

  function tipFor(drill) {
    if (drill && drill.tip) return drill.tip;
    return "Y with no indoor air ices the coil. Confirm G/blower before you chase gas or HPC.";
  }

  function renderPanel(host, opts) {
    if (!host) return;
    const onStart = (opts && opts.onStart) || function () {};
    const data = touchLogin();
    const rec = recommend();
    const primary = rec.primary;
    const secondary = rec.secondary;
    const met = goalMet(data);
    const bonus = streakBonus(data.streak);

    host.innerHTML = `
      <div class="daily-panel">
        <div class="daily-top">
          <div>
            <p class="eyebrow">Daily training aid</p>
            <h3>${met ? "Goal hit — keep going" : "Today's practice"}</h3>
            <p class="daily-sub">${data.streak} day streak${bonus.xp ? " · login bonus +" + bonus.xp + " XP" : ""}</p>
          </div>
          <div class="daily-streak-badge" title="Consecutive days practiced">
            <span>${data.streak}</span>
            <small>day streak</small>
          </div>
        </div>
        <div class="daily-goal ${met ? "met" : ""}">
          <strong>${met ? "✓ Daily goal complete" : "Daily goal"}</strong>
          <span>${met ? "You practiced today. Optional: stack another drill." : "Complete 1 drill (8–12 min). Read SH/SC before you add gas."}</span>
        </div>
        <div class="daily-drills">
          <button type="button" class="daily-drill primary" data-mode="${primary.mode}" data-drill="${primary.id}">
            <div>
              <strong>${primary.title}</strong>
              <span>${primary.why}</span>
            </div>
            <em>~${primary.minutes} min</em>
          </button>
          ${
            secondary
              ? `<button type="button" class="daily-drill" data-mode="${secondary.mode}" data-drill="${secondary.id}">
            <div>
              <strong>${secondary.title}</strong>
              <span>${secondary.why}</span>
            </div>
            <em>~${secondary.minutes} min</em>
          </button>`
              : ""
          }
        </div>
        <p class="daily-tip">Tip: ${tipFor(primary)}</p>
      </div>
    `;

    host.querySelectorAll(".daily-drill").forEach((btn) => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-mode");
        const drill = btn.getAttribute("data-drill");
        recordPractice(drill, { source: "daily-tap" });
        onStart(mode, drill);
      };
    });
  }

  global.DailyTrain = {
    DRILLS,
    touchLogin,
    recordPractice,
    recommend,
    goalMet,
    streakBonus,
    get,
    renderPanel,
    todayKey,
  };
})(window);
