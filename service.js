/* Lincoln Tech HVAC Allstars — Service Calls
   Real job scenarios + optional Spicy customer dialogue.
   Designed to feel less clunky than dry quiz trainers. */
(function (global) {
  "use strict";

  const CALLS = [
    {
      name: "Mrs. Delgado",
      avatar: "🏠",
      job: "Row home · “AC blowing warm”",
      vitals: "SH 28° · SC 4° · Suction low · Head low",
      quote: {
        pro: "It's been blowing warm since yesterday and the baby's room is a sauna. Can you fix it today?",
        spicy:
          "If this house gets any hotter I'm walking around in nothing but a thermostat. Get me cold air before I melt into the hardwood.",
        extra:
          "It's so hot I could fry an egg on this tstat and I am not wearing enough clothes for your leak search. Fix the charge before I file a noise complaint about my own AC.",
      },
      prompt: "High SH + low SC. Best fix path?",
      choices: [
        { t: "Hunt undercharge / leak → recover, repair, evacuate, charge", ok: true },
        { t: "Add two pounds and leave", ok: false },
        { t: "Condemn compressor, sell a full system", ok: false },
        { t: "Set thermostat to 60° and hope", ok: false },
      ],
      why: {
        ok: "High SH + low SC is the undercharge fingerprint. Find the leak — don't just top off.",
        bad: "Topping off a leaker is a guaranteed callback.",
      },
      reply: {
        pro: { ok: "Thank you — I'll open windows until you're done.", bad: "Another guy said that last summer…" },
        spicy: {
          ok: "Bless you. Pants go back on when the supply air drops.",
          bad: "Top it off and bounce and I will review you like a Yelp demon.",
        },
        extra: {
          ok: "Air's dropping. I might even put pants back on. Might.",
          bad: "You top off a leaker and I will write a review that makes your manifold blush.",
        },
      },
    },
    {
      name: "Ken · Barbershop",
      avatar: "💈",
      job: "Storefront · suction line iced solid",
      vitals: "SH ~0° · SC normal · Filter black · Low airflow",
      quote: {
        pro: "The pipe in the closet is a popsicle and the shop smells musty.",
        spicy:
          "Copper's frozen like a gas-station Otter Pop and my barber chair is sweating. Fix it before the fade clients revolt.",
        extra:
          "That suction line is an Otter Pop and my last customer left because the shop smells like a wet gym sock. Don't add gas. Un-ice my life.",
      },
      prompt: "Iced suction + low SH. First move?",
      choices: [
        { t: "Power down, thaw, new filter, check blower & coil, recheck SH", ok: true },
        { t: "Add refrigerant because low pressure = low charge", ok: false },
        { t: "Front-seat liquid line and leave in pump-down", ok: false },
        { t: "Chip ice off with a screwdriver", ok: false },
      ],
      why: {
        ok: "Ice + low SH is usually airflow (or overcharge) — not 'add gas.' Fix air first.",
        bad: "Adding gas to an airflow problem builds a bigger ice sculpture.",
      },
      reply: {
        pro: { ok: "Shop stays open. Appreciate it.", bad: "We already had three no-shows…" },
        spicy: {
          ok: "MVP. Free fade if you want that helmet hair sorted.",
          bad: "My clippers got more airflow than this coil, man.",
        },
        extra: {
          ok: "You're a hero. Fade's on me. Keep the helmet hair jokes to yourself.",
          bad: "You added gas to an ice sculpture. Bold. Stupid. Kind of hot in the worst way.",
        },
      },
    },
    {
      name: "Priya · Office manager",
      avatar: "🏢",
      job: "Small office · one zone dead",
      vitals: "That zone SH 35° · SC 14° · Liquid cold at evaporator",
      quote: {
        pro: "Conference room is unbearable. Client pitch in two hours.",
        spicy:
          "If my boss melts in there I will rate you one star and a crayon drawing of a sad compressor.",
        extra:
          "If that conference room stays a sauna I will describe your TXV skills in the company Slack with GIFs. Fix the starved zone. I have a pitch and a migraine.",
      },
      prompt: "High SH, healthy SC on one zone — best theory?",
      choices: [
        { t: "Liquid-line restriction or stuck/closed TXV on that zone", ok: true },
        { t: "Whole-system undercharge", ok: false },
        { t: "Bad condenser fan only", ok: false },
        { t: "Thermostat batteries", ok: false },
      ],
      why: {
        ok: "Good SC means liquid is there; high SH means the evaporator is starved → restriction/TXV.",
        bad: "Whole-system undercharge usually pulls SC down too.",
      },
      reply: {
        pro: { ok: "Pitch is saved. Invoice accounting.", bad: "They're already in the lobby…" },
        spicy: {
          ok: "Bagels and residual panic sweat await you at the debrief.",
          bad: "I can hear the PowerPoint of doom from here.",
        },
        extra: {
          ok: "Pitch saved. There's leftover bagels and shame in the break room.",
          bad: "They're in the lobby. I am one wrong TXV away from becoming a LinkedIn story.",
        },
      },
    },
    {
      name: "Uncle Ray",
      avatar: "🏡",
      job: "Ranch house · condenser in junipers",
      vitals: "High head · High SC · High amps · Coil matted",
      quote: {
        pro: "It runs all day and never catches up. Bushes grew into the box.",
        spicy:
          "That condenser lost a fight with a hedge and my electric bill is dating a loan shark.",
        extra:
          "The bushes ate my condenser and the power company is texting me like an ex. Wash the coil. Don't steal my charge. Ray didn't survive '78 to get robbed by junipers.",
      },
      prompt: "High head + dirty outdoor coil. Best action?",
      choices: [
        { t: "Shut down, clean condenser, fix clearances, recheck pressures", ok: true },
        { t: "Recover half the charge to lower head", ok: false },
        { t: "Install a bigger breaker", ok: false },
        { t: "Hose it while running and leave", ok: false },
      ],
      why: {
        ok: "Dirty condenser can't reject heat. Clean it — don't remove charge to 'fix' head pressure.",
        bad: "Pulling charge treats the symptom and leaves an undercharge later.",
      },
      reply: {
        pro: { ok: "Cooler already. I'll trim the bushes.", bad: "Bill still looks scary…" },
        spicy: {
          ok: "You and a coil brush just saved my marriage to the power company.",
          bad: "Touch that charge without cleaning and Ray will haunt your manifold.",
        },
        extra: {
          ok: "Coil's naked again. Electric bill can sleep in the guest room.",
          bad: "You pulled charge instead of weeds. Ray's ghost just grabbed a manifold.",
        },
      },
    },
    {
      name: "DIY Dave",
      avatar: "🔧",
      job: "Garage · system already opened",
      vitals: "Open to atmosphere · oil smell · no recovery gear",
      quote: {
        pro: "I took the valve apart to see if it was clogged. Can you just recharge it?",
        spicy:
          "I YouTubed it. Refrigerant went psshh into the sky. You got a can of 410 I can borrow?",
        extra:
          "I vented it like a soda can and now I want you to make it rain 410A. Extra spicy news, Dave: that's a federal vibe and also dumb.",
      },
      prompt: "Opened without recovery. Correct path?",
      choices: [
        { t: "Explain EPA 608, recover if possible, repair, evacuate, charge by weight", ok: true },
        { t: "Hand him a can and a hose", ok: false },
        { t: "Ignore it — small amount doesn't count", ok: false },
        { t: "Light a match to check for gas", ok: false },
      ],
      why: {
        ok: "Venting is illegal. Educate, recover if you can, evacuate, charge right.",
        bad: "Helping someone vent can cost your cert — and their wallet.",
      },
      reply: {
        pro: { ok: "Okay… show me the right way once.", bad: "My cousin always tops it off…" },
        spicy: {
          ok: "Teach me like I'm five and slightly radioactive.",
          bad: "The atmosphere says thanks for nothing, Dave.",
        },
        extra: {
          ok: "Okay I'll recover like a grown-up. Don't tell OSHA I had feelings.",
          bad: "You handed Dave a can. The atmosphere and your cert just unswiped you.",
        },
      },
    },
    {
      name: "Jess & Marcus",
      avatar: "🌙",
      job: "Apartment · 11pm · no cool after install",
      vitals: "SH 22° · SC 2° · Long lineset · Bubble in glass",
      quote: {
        pro: "It worked two days then quit. We're on her mom's couch. Please.",
        spicy:
          "One more tech says 'give it time' and you're getting a one-star review in all caps.",
        extra:
          "We're on her mom's couch, the lineset is long, and nobody's getting lucky until this SC comes up. Weigh it in. I'm begging in two languages.",
      },
      prompt: "Low SC after a long-lineset install. Likely issue?",
      choices: [
        { t: "Weigh in additional charge per lineset chart, verify SC", ok: true },
        { t: "Replace the compressor tonight", ok: false },
        { t: "Blame outdoor humidity", ok: false },
        { t: "Close liquid valve halfway to raise pressure", ok: false },
      ],
      why: {
        ok: "Factory charge covers a rated lineset only. Long runs need weighed-in additional charge.",
        bad: "Guessing without the chart is how you get 2 a.m. callbacks.",
      },
      reply: {
        pro: { ok: "Mom's couch is hereby retired. Thank you.", bad: "We'll be up all night…" },
        spicy: {
          ok: "You saved a relationship and a very loud floor fan.",
          bad: "Her mom's couch has springs with names. Don't make us go back.",
        },
        extra: {
          ok: "Mom's couch is retired. The floor fan can finally shut up. Thank you.",
          bad: "Guess without the chart again and you're sleeping on that couch with us.",
        },
      },
    },
  ];

  let root = null;
  let callI = 0;
  let callRight = 0;
  let locked = false;
  let stars = 5;
  let spicy = false;
  let extraSpicy = false;
  let hooks = {};
  let deck = [];

  function heat() {
    return extraSpicy ? 2 : spicy ? 1 : 0;
  }
  function quoteOf(c) {
    if (heat() >= 2 && c.quote.extra) return c.quote.extra;
    if (heat() >= 1 && c.quote.spicy) return c.quote.spicy;
    return c.quote.pro;
  }
  function replyOf(c, ok) {
    const k = ok ? "ok" : "bad";
    if (heat() >= 2 && c.reply.extra) return c.reply.extra[k];
    if (heat() >= 1 && c.reply.spicy) return c.reply.spicy[k];
    return c.reply.pro[k];
  }

  function starsStr(n) {
    const full = Math.max(0, Math.min(5, Math.round(n)));
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function mixChoices(choices) {
    let a = shuffle(choices);
    let n = 0;
    while (a[0] && a[0].ok && a.length > 1 && n++ < 12) a = shuffle(choices);
    if (a[0] && a[0].ok && a.length > 1) {
      const j = 1 + ((Math.random() * (a.length - 1)) | 0);
      const tmp = a[0];
      a[0] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function render() {
    const fb = root.querySelector("#svc-feedback");
    fb.textContent = "";
    fb.className = "svc-feedback";
    root.querySelector("#svc-score").textContent =
      "Call " + Math.min(callI + 1, deck.length || CALLS.length) + " / " + (deck.length || CALLS.length);
    root.querySelector("#svc-rating").textContent = starsStr(stars);

    if (callI >= deck.length) {
      root.querySelector("#svc-title").textContent = "Route complete";
      root.querySelector("#svc-name").textContent = "Dispatch";
      root.querySelector("#svc-job").textContent = "Back to the shop";
      root.querySelector("#svc-quote").textContent =
        callRight >= deck.length - 1
          ? "Solid day. Customers didn't eat you alive."
          : "Rough route — review the misses and run it again.";
      root.querySelector("#svc-vitals").textContent = "";
      root.querySelector("#svc-prompt").textContent = "";
      root.querySelector("#svc-choices").innerHTML = "";
      root.querySelector("#svc-avatar").textContent = "📋";
      if (hooks.onComplete) hooks.onComplete({ right: callRight, total: deck.length, stars });
      return;
    }

    const c = deck[callI];
    root.querySelector("#svc-eyebrow").textContent =
      extraSpicy ? "Service call · 🌶️ Extra spicy" : spicy ? "Service call · 🌶️ Spicy" : "Service call";
    root.querySelector("#svc-title").textContent = "On site";
    root.querySelector("#svc-avatar").textContent = c.avatar;
    root.querySelector("#svc-name").textContent = c.name;
    root.querySelector("#svc-job").textContent = c.job;
    root.querySelector("#svc-quote").textContent = "“" + quoteOf(c) + "”";
    root.querySelector("#svc-vitals").textContent = c.vitals;
    root.querySelector("#svc-prompt").textContent = c.prompt;

    const box = root.querySelector("#svc-choices");
    box.innerHTML = "";
    mixChoices(c.choices).forEach((ch) => {
      const b = document.createElement("button");
      b.className = "svc-choice";
      b.textContent = ch.t;
      b.onclick = () => {
        if (locked) return;
        locked = true;
        if (ch.ok) {
          callRight++;
          b.classList.add("correct");
          let hub = "";
          if (window.ProfessorHUB) hub = " HUB: " + window.ProfessorHUB.banter("service-ok", { extra: extraSpicy });
          fb.innerHTML =
            "<strong>Correct.</strong> " + c.why.ok +
            "<br/><em>" + replyOf(c, true) + "</em>" +
            (hub ? "<br/><span class='svc-hub-line'>" + hub + "</span>" : "");
          fb.className = "svc-feedback good";
          if (hooks.onSfx) hooks.onSfx("win");
        } else {
          stars = Math.max(1, stars - 1);
          b.classList.add("wrong");
          let hub = "";
          if (window.ProfessorHUB) hub = " HUB: " + window.ProfessorHUB.banter("service-bad", { extra: extraSpicy });
          const right = (c.choices || []).find(function(x){ return x.ok; });
          fb.innerHTML =
            "<strong>Not the best call.</strong> " + c.why.bad +
            (right ? "<br/><strong>Better:</strong> " + (right.t || right.label) : "") +
            "<br/><em>" + replyOf(c, false) + "</em>" +
            (hub ? "<br/><span class='svc-hub-line'>" + hub + "</span>" : "");
          fb.className = "svc-feedback bad";
          root.querySelector("#svc-rating").textContent = starsStr(stars);
          if (hooks.onSfx) hooks.onSfx("miss");
        }
        setTimeout(() => {
          callI++;
          locked = false;
          render();
        }, 1500);
      };
      box.appendChild(b);
    });
  }

  function start(host, opts) {
    root = host;
    hooks = opts || {};
    callI = 0;
    callRight = 0;
    locked = false;
    stars = 5;
    extraSpicy = !!(opts && (opts.extraSpicy || opts.roastLevel >= 3));
    spicy = extraSpicy || !!(opts && opts.spicy) || (opts && opts.roastLevel >= 2);
    if (typeof (opts && opts.roastLevel) === "number") {
      extraSpicy = opts.roastLevel >= 3;
      spicy = opts.roastLevel >= 2;
    }
    deck = shuffle(CALLS);

    // ensure structure exists (in case host is empty root)
    if (!root.querySelector("#svc-choices")) {
      root.innerHTML = host.innerHTML; // keep screen content
    }

    const roastEl = document.getElementById("svc-roast");
    if (roastEl) {
      roastEl.value = String(heat());
      roastEl.oninput = () => {
        const v = +roastEl.value;
        extraSpicy = v >= 3;
        spicy = v >= 2;
        if (hooks.onRoast) hooks.onRoast(v);
        if (hooks.onSpicy) hooks.onSpicy(spicy);
        if (hooks.onExtra) hooks.onExtra(extraSpicy);
        render();
      };
    }

    const hub = document.getElementById("btn-svc-hub");
    if (hub) hub.onclick = () => hooks.onHub && hooks.onHub();

    render();
    return {
      stop() {},
      setSpicy(v) {
        spicy = !!v;
        if (spicyEl) spicyEl.checked = spicy;
        render();
      },
    };
  }

  global.ServiceCalls = { start, CALLS };
})(window);
