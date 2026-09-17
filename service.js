/* Lincoln Tech HVAC Allstars — Service Calls */
(function (global) {
  "use strict";
  const CALLS = [
    { name: "Mrs. Delgado", avatar: "🏠", job: "Row home · AC blowing warm", vitals: "SH 28° · SC 4° · Suction low · Head low",
      quote: { pro: "It's been blowing warm since yesterday.", spicy: "Get me cold air before I melt.", extra: "Fix the charge. Don't top off a leaker." },
      prompt: "High SH + low SC. Best fix path?",
      choices: [
        { t: "Hunt undercharge / leak → recover, repair, evacuate, charge", ok: true },
        { t: "Add two pounds and leave", ok: false },
        { t: "Condemn compressor, sell a full system", ok: false },
        { t: "Set thermostat to 60° and hope", ok: false }
      ],
      why: { ok: "High SH + low SC is the undercharge fingerprint. Find the leak — don't just top off.", bad: "Topping off a leaker is a guaranteed callback." },
      reply: { pro: { ok: "Thank you.", bad: "Another guy said that last summer…" }, spicy: { ok: "Bless you.", bad: "Don't top off and bounce." }, extra: { ok: "Air's dropping.", bad: "That's a callback." } }
    },
    { name: "Ken · Barbershop", avatar: "🪜", job: "Storefront · suction iced", vitals: "SH ~0° · SC normal · Filter black · Low airflow",
      quote: { pro: "The pipe in the closet is a popsicle.", spicy: "Copper's frozen. Fix airflow first.", extra: "Don't add gas. Un-ice it." },
      prompt: "Iced suction + low SH. First move?",
      choices: [
        { t: "Power down, thaw, new filter, check blower & coil, recheck SH", ok: true },
        { t: "Add refrigerant because low pressure = low charge", ok: false },
        { t: "Front-seat liquid line and leave in pump-down", ok: false },
        { t: "Chip ice off with a screwdriver", ok: false }
      ],
      why: { ok: "Ice + low SH is usually airflow — not add gas.", bad: "Adding gas to an airflow problem builds a bigger ice sculpture." },
      reply: { pro: { ok: "Shop stays open.", bad: "We already had no-shows." }, spicy: { ok: "MVP.", bad: "Coil's still plugged." }, extra: { ok: "Hero.", bad: "You added gas to ice." } }
    },
    { name: "Priya · Office", avatar: "🏢", job: "One zone dead", vitals: "That zone SH 35° · SC 14° · Liquid cold at evaporator",
      quote: { pro: "Conference room is unbearable.", spicy: "Boss is melting.", extra: "Starved zone. Pitch in two hours." },
      prompt: "High SH, healthy SC on one zone — best theory?",
      choices: [
        { t: "Liquid-line restriction or stuck/closed TXV on that zone", ok: true },
        { t: "Whole-system undercharge", ok: false },
        { t: "Bad condenser fan only", ok: false },
        { t: "Thermostat batteries", ok: false }
      ],
      why: { ok: "Good SC means liquid is there; high SH means that evaporator is starved.", bad: "Whole-system undercharge usually pulls SC down too." },
      reply: { pro: { ok: "Pitch is saved.", bad: "They're in the lobby." }, spicy: { ok: "Bagels later.", bad: "Still hot." }, extra: { ok: "Saved.", bad: "Lobby." } }
    },
    { name: "Uncle Ray", avatar: "🏡", job: "Ranch · condenser in junipers", vitals: "High head · High SC · High amps · Coil matted",
      quote: { pro: "It runs all day and never catches up. Bushes grew into the box.", spicy: "Hedge ate the coil.", extra: "Wash the coil. Don't steal charge." },
      prompt: "High head + dirty outdoor coil. Best action?",
      choices: [
        { t: "Shut down, clean condenser, fix clearances, recheck pressures", ok: true },
        { t: "Recover half the charge to lower head", ok: false },
        { t: "Install a bigger breaker", ok: false },
        { t: "Hose it while running and leave", ok: false }
      ],
      why: { ok: "Dirty condenser can't reject heat. Clean it — don't pull charge.", bad: "Pulling charge treats the symptom and leaves an undercharge later." },
      reply: { pro: { ok: "Cooler already.", bad: "Bill still scary." }, spicy: { ok: "Coil brush saved the bill.", bad: "Don't touch the charge." }, extra: { ok: "Coil's naked.", bad: "You pulled charge instead of weeds." } }
    },
    { name: "DIY Dave", avatar: "🔧", job: "Garage · system opened", vitals: "Open to atmosphere · oil smell · no recovery gear",
      quote: { pro: "I took the valve apart. Can you just recharge it?", spicy: "I YouTubed it. It went psshh.", extra: "Venting is a federal problem." },
      prompt: "Opened without recovery. Correct path?",
      choices: [
        { t: "Explain EPA 608, recover if possible, repair, evacuate, charge by weight", ok: true },
        { t: "Hand him a can and a hose", ok: false },
        { t: "Ignore it — small amount doesn't count", ok: false },
        { t: "Light a match to check for gas", ok: false }
      ],
      why: { ok: "Venting is illegal. Educate, recover if you can, evacuate, charge right.", bad: "Helping someone vent can cost your cert." },
      reply: { pro: { ok: "Show me the right way.", bad: "My cousin tops it off." }, spicy: { ok: "Teach me.", bad: "Atmosphere says no." }, extra: { ok: "I'll recover.", bad: "You handed Dave a can." } }
    },
    { name: "Jess & Marcus", avatar: "🌙", job: "Apartment · 11pm · no cool after install", vitals: "SH 22° · SC 2° · Long lineset · Bubble in glass",
      quote: { pro: "It worked two days then quit.", spicy: "Don't say give it time.", extra: "Long lineset. Weigh it in." },
      prompt: "Low SC after a long-lineset install. Likely issue?",
      choices: [
        { t: "Weigh in additional charge per lineset chart, verify SC", ok: true },
        { t: "Replace the compressor tonight", ok: false },
        { t: "Blame outdoor humidity", ok: false },
        { t: "Close liquid valve halfway to raise pressure", ok: false }
      ],
      why: { ok: "Factory charge covers a rated lineset only. Long runs need weighed-in additional charge.", bad: "Guessing without the chart is how you get 2 a.m. callbacks." },
      reply: { pro: { ok: "Couch is retired. Thank you.", bad: "We'll be up all night." }, spicy: { ok: "Fan can shut up.", bad: "Mom's couch again." }, extra: { ok: "Done.", bad: "Guessed the charge." } }
    }
  ];
  let root = null, callI = 0, callRight = 0, locked = false, stars = 5, spicy = false, extraSpicy = false, hooks = {}, deck = [];
  function heat() { return extraSpicy ? 2 : spicy ? 1 : 0; }
  function quoteOf(c) { if (heat() >= 2 && c.quote.extra) return c.quote.extra; if (heat() >= 1 && c.quote.spicy) return c.quote.spicy; return c.quote.pro; }
  function replyOf(c, ok) { const k = ok ? "ok" : "bad"; if (heat() >= 2 && c.reply.extra) return c.reply.extra[k]; if (heat() >= 1 && c.reply.spicy) return c.reply.spicy[k]; return c.reply.pro[k]; }
  function starsStr(n) { const full = Math.max(0, Math.min(5, Math.round(n))); return "★".repeat(full) + "☆".repeat(5 - full); }
  function shuffle(arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; }
  function mixChoices(choices) { let a = shuffle(choices); let n = 0; while (a[0] && a[0].ok && a.length > 1 && n++ < 12) a = shuffle(choices); if (a[0] && a[0].ok && a.length > 1) { const j = 1 + ((Math.random() * (a.length - 1)) | 0); const tmp = a[0]; a[0] = a[j]; a[j] = tmp; } return a; }
  function render() {
    const fb = root.querySelector("#svc-feedback");
    fb.textContent = ""; fb.className = "svc-feedback";
    root.querySelector("#svc-score").textContent = "Call " + Math.min(callI + 1, deck.length || CALLS.length) + " / " + (deck.length || CALLS.length);
    root.querySelector("#svc-rating").textContent = starsStr(stars);
    if (callI >= deck.length) {
      root.querySelector("#svc-title").textContent = "Route complete";
      root.querySelector("#svc-name").textContent = "Dispatch";
      root.querySelector("#svc-job").textContent = "Back to the shop";
      root.querySelector("#svc-quote").textContent = callRight >= deck.length - 1 ? "Solid day. Customers didn't eat you alive." : "Rough route — review the misses and run it again.";
      root.querySelector("#svc-vitals").textContent = "";
      root.querySelector("#svc-prompt").textContent = "";
      root.querySelector("#svc-choices").innerHTML = "";
      root.querySelector("#svc-avatar").textContent = "📋";
      if (hooks.onComplete) hooks.onComplete({ right: callRight, total: deck.length, stars });
      return;
    }
    const c = deck[callI];
    root.querySelector("#svc-eyebrow").textContent = extraSpicy ? "Service call · Extra spicy" : spicy ? "Service call · Spicy" : "Service call";
    root.querySelector("#svc-title").textContent = "On site";
    root.querySelector("#svc-avatar").textContent = c.avatar;
    root.querySelector("#svc-name").textContent = c.name;
    root.querySelector("#svc-job").textContent = c.job;
    root.querySelector("#svc-quote").textContent = "\u201c" + quoteOf(c) + "\u201d";
    var vit = root.querySelector("#svc-vitals");
    vit.textContent = "";
    vit.innerHTML = "<strong>NO-COOL SHEET</strong> · " + c.vitals + " · Run 15 min. TXV: charge by SC (~8–12°) — SH is the valve. Piston: charge by SH (WB/DB chart) — SC is a check. Don't add gas until the fingerprint matches.";
    root.querySelector("#svc-prompt").textContent = "Hook gauges. Read Blue / Red / SH / SC. Don't pick a part from a list.";
    const box = root.querySelector("#svc-choices");
    box.innerHTML = "";
    var note = document.createElement("p");
    note.className = "svc-floor-note";
    note.style.cssText = "margin:8px 0;font-size:13px;opacity:.9";
    note.textContent = "Dispatch gave you a complaint and a no-cool sheet. Hook gauges. Read SH/SC. Do not add gas until the fingerprint matches. Answer is on the manifold, not this card.";
    box.appendChild(note);
    fb.textContent = "";
    fb.className = "svc-feedback";
  }
  function start(host, opts) {
    root = host; hooks = opts || {}; callI = 0; callRight = 0; locked = false; stars = 5;
    extraSpicy = !!(opts && (opts.extraSpicy || opts.roastLevel >= 3));
    spicy = extraSpicy || !!(opts && opts.spicy) || (opts && opts.roastLevel >= 2);
    if (typeof (opts && opts.roastLevel) === "number") { extraSpicy = opts.roastLevel >= 3; spicy = opts.roastLevel >= 2; }
    deck = shuffle(CALLS);
    var roastEl = document.getElementById("svc-roast");
    if (roastEl) {
      roastEl.value = String(heat());
      roastEl.oninput = function () {
        var v = +roastEl.value; extraSpicy = v >= 3; spicy = v >= 2;
        if (hooks.onRoast) hooks.onRoast(v);
        if (hooks.onSpicy) hooks.onSpicy(spicy);
        if (hooks.onExtra) hooks.onExtra(extraSpicy);
        render();
      };
    }
    var hub = document.getElementById("btn-svc-hub");
    if (hub) hub.onclick = function () { hooks.onHub && hooks.onHub(); };
    render();
    return { stop: function () {}, setSpicy: function (v) { spicy = !!v; extraSpicy = extraSpicy && spicy; render(); } };
  }
  global.ServiceCalls = { start: start, CALLS: CALLS };
})(window);
