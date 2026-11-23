/* All-Star Exam — EPA 608 section runner (merged from Instructor Desk bank).
   Depends on window.EPA_BANK (epa-exam-bank.js). Mounts into #quiz-root when
   All-Star Exam opens. Classroom practice — not the live EPA exam. */
(function (global) {
  "use strict";

  const PASS = 18; // of 25 per section (70%)
  const PER = 25;
  const BEST_KEY = "allstars-epa608-best";
  const PREF_KEY = "allstars-epa608-prefs";

  const HUB_PASS = [
    "That is a pass. Do it again tomorrow cold and it is yours.",
    "Over the line. Same habits on test day: read all four, pick the rule.",
    "Pass. Now go over your misses anyway. The real one will not be this friendly.",
  ];
  const HUB_FAIL = [
    "Not yet. Every miss below is a rule you owe me. Run the misses, then a fresh 25.",
    "Under the line. Nobody passes by guessing. Read the whys, then go again.",
    "Short of 18. Slow down, read every choice, and hit Retry missed only.",
  ];

  let ctx = null; // { pin, escapeHtml, openPinModal, isActive }
  let root = null;
  let G = { view: "picker", sectionId: "core", session: null, flash: "" };

  function B() {
    return global.EPA_BANK;
  }
  function esc(s) {
    if (ctx && ctx.escapeHtml) return ctx.escapeHtml(s == null ? "" : s);
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }
  function secName(id) {
    if (id === "universal") return "Universal";
    const s = B().SECTIONS.find((x) => x.id === id);
    return s ? s.name : id;
  }
  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  function shuffle(a) {
    const r = a.slice();
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }

  function loadJson(key, dflt) {
    try {
      const v = JSON.parse(localStorage.getItem(key) || "null");
      return v && typeof v === "object" ? v : dflt;
    } catch {
      return dflt;
    }
  }
  function saveJson(key, v) {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage off: game still works, just no memory */
    }
  }
  function prefs() {
    const p = loadJson(PREF_KEY, {});
    return { mode: p.mode === "test" ? "test" : "instant" };
  }
  function setPref(k, v) {
    const p = prefs();
    p[k] = v;
    saveJson(PREF_KEY, p);
  }

  /* ---------- session ---------- */

  function prepItem(secId, it) {
    // shuffle choices once; keep reason attached to each choice
    const order = shuffle([0, 1, 2, 3]);
    return {
      sec: secId,
      q: it.q,
      choices: order.map((o) => it.c[o]),
      reasons: order.map((o) => (o === it.a ? null : it.wrong[o])),
      a: order.indexOf(it.a),
      why: it.why,
      src: it,
    };
  }

  function startSession(sectionId, items, isRetry) {
    const p = prefs();
    let list;
    if (items) {
      list = shuffle(items).map((x) => prepItem(x.sec, x.src));
    } else {
      const secs = sectionId === "universal" ? B().SECTIONS.map((s) => s.id) : [sectionId];
      list = [];
      secs.forEach((id) => {
        shuffle(B().BANK[id]).slice(0, PER).forEach((it) => list.push(prepItem(id, it)));
      });
    }
    G.session = {
      sectionId,
      isRetry: !!isRetry,
      items: list,
      answers: list.map(() => null),
      idx: 0,
      mode: p.mode,
      streak: 0,
      bestStreak: 0,
      finished: false,
    };
    G.view = "play";
    draw();
  }

  function correctCount(s, secId) {
    let n = 0;
    s.items.forEach((it, i) => {
      if ((!secId || it.sec === secId) && s.answers[i] === it.a) n++;
    });
    return n;
  }

  function choose(i) {
    const s = G.session;
    if (!s || s.finished || G.view !== "play") return;
    if (s.mode === "instant" && s.answers[s.idx] !== null) return; // locked after tap
    s.answers[s.idx] = i;
    if (s.mode === "instant") {
      if (i === s.items[s.idx].a) {
        s.streak++;
        s.bestStreak = Math.max(s.bestStreak, s.streak);
      } else s.streak = 0;
    }
    draw();
  }

  function next() {
    const s = G.session;
    if (!s || G.view !== "play") return;
    if (s.answers[s.idx] === null) return;
    if (s.idx < s.items.length - 1) {
      s.idx++;
      draw();
    } else finish();
  }

  function back() {
    const s = G.session;
    if (!s || s.mode !== "test" || s.idx === 0) return;
    s.idx--;
    draw();
  }

  function finish() {
    const s = G.session;
    if (!s || s.finished) return;
    s.finished = true;
    if (!s.isRetry) saveBest(s);
    G.view = "end";
    draw();
  }

  function sectionsIn(s) {
    const ids = [];
    s.items.forEach((it) => {
      if (!ids.includes(it.sec)) ids.push(it.sec);
    });
    return ids;
  }

  function saveBest(s) {
    const best = loadJson(BEST_KEY, {});
    sectionsIn(s).forEach((id) => {
      const n = correctCount(s, id);
      if (!(best[id] >= n)) best[id] = n;
    });
    if (s.sectionId === "universal") {
      const t = correctCount(s);
      if (!(best.universal >= t)) best.universal = t;
    }
    saveJson(BEST_KEY, best);
  }

  /* ---------- views ---------- */

  function draw() {
    if (!root || !document.body.contains(root)) return;
    if (G.view === "play" && G.session) root.innerHTML = playHtml();
    else if (G.view === "end" && G.session) root.innerHTML = endHtml();
    else root.innerHTML = pickerHtml();
    bind();
  }

  function pickerHtml() {
    const best = loadJson(BEST_KEY, {});
    const p = prefs();
    const cards = B()
      .SECTIONS.map((s) => ({ id: s.id, name: s.name, n: PER, pool: B().BANK[s.id].length }))
      .concat([{ id: "universal", name: "Universal", n: PER * 4, pool: null }])
      .map((s) => {
        const b = best[s.id];
        const bestTxt =
          b == null ? "No score yet" : "Best " + b + "/" + s.n + (s.id !== "universal" ? (b >= PASS ? " · pass" : " · not yet") : "");
        return (
          '<button type="button" class="epa-sec-btn' +
          (G.sectionId === s.id ? " active" : "") +
          '" data-sec="' +
          s.id +
          '"><span class="epa-sec-name">' +
          esc(s.name) +
          '</span><span class="epa-sec-meta">' +
          s.n +
          " questions" +
          (s.id === "universal" ? " · 25 per section" : "") +
          '</span><span class="epa-sec-best">' +
          esc(bestTxt) +
          "</span></button>"
        );
      })
      .join("");
    return (
      '<div class="epa-game no-print">' +
      '<div class="epa-label">' +
      esc(B().LABEL) +
      "</div>" +
      "<h3 class=\"epa-h\">All-Star Exam · Pick your section</h3>" +
      '<p class="epa-note">Pass line is ' +
      PASS +
      "/" +
      PER +
      " (70%) per section. Universal scores each section on its own. You need Core plus a type to be certified.</p>" +
      '<div class="epa-sec-grid">' +
      cards +
      "</div>" +
      '<div class="epa-opts">' +
      '<div class="epa-seg" role="group" aria-label="Feedback mode">' +
      '<button type="button" data-mode="instant" class="' +
      (p.mode === "instant" ? "on" : "") +
      '">Instant feedback</button>' +
      '<button type="button" data-mode="test" class="' +
      (p.mode === "test" ? "on" : "") +
      '">Test mode</button></div>' +
      "</div>" +
      '<p class="epa-note">' +
      (p.mode === "instant"
        ? "Instant feedback: after each tap you see the right answer, why it is right, and why your pick was wrong."
        : "Test mode: no feedback until the end, like the real sitting. You can go back and change answers.") +
      " Keys: 1-4 to answer, Enter for next.</p>" +
      '<button type="button" class="btn primary epa-start" id="epa-start">Start ' +
      esc(secName(G.sectionId)) +
      "</button>" +
      '<button type="button" class="btn" id="epa-other-packs">Other packs (OSHA / curriculum / Quiz Game)</button>' +
      '<p class="epa-note" style="margin-top:10px">Fingerprint bay locks stay on the shop floor. This exam is UNTIMED — pass line 18/25 per section.</p>' +
      "</div>"
    );
  }

  function playHtml() {
    const s = G.session;
    const it = s.items[s.idx];
    const picked = s.answers[s.idx];
    const answered = picked !== null;
    const instant = s.mode === "instant";
    const reveal = instant && answered;
    const secItems = s.items.filter((x) => x.sec === it.sec);
    const secPos = secItems.indexOf(it) + 1;
    const secTotal = secItems.length;
    const answeredCount = s.answers.filter((x) => x !== null).length;

    const choices = it.choices
      .map((c, i) => {
        let cls = "epa-choice";
        if (reveal) {
          if (i === it.a) cls += " right";
          else if (i === picked) cls += " wrong";
          else cls += " dim";
        } else if (picked === i) cls += " picked";
        return (
          '<button type="button" class="' +
          cls +
          '" data-choice="' +
          i +
          '"' +
          (reveal ? " disabled" : "") +
          '><span class="epa-key">' +
          (i + 1) +
          '</span><span class="epa-ctext">' +
          esc(c) +
          "</span></button>"
        );
      })
      .join("");

    let fb = "";
    if (reveal) {
      const ok = picked === it.a;
      fb =
        '<div class="epa-feedback ' +
        (ok ? "ok" : "bad") +
        '" role="status">' +
        "<strong>" +
        (ok ? "Right." : "Not that one.") +
        "</strong>" +
        (ok
          ? ""
          : '<p class="epa-why-wrong"><span>Your pick:</span> ' +
            esc(it.choices[picked]) +
            "<br/><span>Why it is wrong:</span> " +
            esc(it.reasons[picked]) +
            "</p>") +
        '<p class="epa-why-right"><span>Right answer:</span> ' +
        esc(it.choices[it.a]) +
        "<br/><span>Why:</span> " +
        esc(it.why) +
        "</p></div>";
    }

    const scoreBit = instant
      ? '<span class="epa-stat"><b>' +
        correctCount(s, it.sec) +
        "/" +
        secTotal +
        "</b> " +
        (s.isRetry ? "right" : "· pass " + PASS) +
        "</span>" +
        '<span class="epa-stat">Streak <b>' +
        s.streak +
        "</b> · best " +
        s.bestStreak +
        "</span>"
      : '<span class="epa-stat">Answered <b>' + answeredCount + "/" + s.items.length + "</b></span>";

    const last = s.idx === s.items.length - 1;
    return (
      '<div class="epa-game epa-play no-print">' +
      '<div class="epa-hud">' +
      '<span class="epa-stat epa-secname">' +
      esc(s.isRetry ? "Missed-only drill" : secName(s.sectionId)) +
      (s.sectionId === "universal" && !s.isRetry ? " · " + esc(secName(it.sec)) : "") +
      "</span>" +
      '<span class="epa-stat">Q <b>' +
      secPos +
      "</b>/" +
      secTotal +
      "</span>" +
      scoreBit +
      "</div>" +
      '<div class="epa-progress"><span style="width:' +
      Math.round(((s.idx + (answered ? 1 : 0)) / s.items.length) * 100) +
      '%"></span></div>' +
      '<p class="epa-q">' +
      esc(it.q) +
      "</p>" +
      '<div class="epa-choices">' +
      choices +
      "</div>" +
      fb +
      '<div class="epa-nav">' +
      '<button type="button" class="btn" id="epa-quit">Quit</button>' +
      (s.mode === "test" && s.idx > 0 ? '<button type="button" class="btn" id="epa-back">Back</button>' : "") +
      '<button type="button" class="btn primary epa-next" id="epa-next"' +
      (answered ? "" : " disabled") +
      ">" +
      (last ? "Finish" : "Next") +
      "</button>" +
      "</div>" +
      '<div class="epa-label small">' +
      esc(B().LABEL) +
      "</div>" +
      "</div>"
    );
  }

  function endHtml() {
    const s = G.session;
    const ids = sectionsIn(s);
    const rows = ids
      .map((id) => {
        const tot = s.items.filter((x) => x.sec === id).length;
        const n = correctCount(s, id);
        const full = !s.isRetry && tot === PER;
        const passed = full ? n >= PASS : null;
        return (
          '<div class="epa-res-row ' +
          (passed === null ? "" : passed ? "pass" : "fail") +
          '"><span class="epa-res-name">' +
          esc(secName(id)) +
          '</span><span class="epa-res-score">' +
          n +
          "/" +
          tot +
          '</span><span class="epa-res-tag">' +
          (passed === null ? "drill" : passed ? "PASS" : "NOT YET") +
          "</span></div>"
        );
      })
      .join("");

    const allPass = !s.isRetry && ids.every((id) => correctCount(s, id) >= PASS);
    const line = s.isRetry
      ? correctCount(s) === s.items.length
        ? "Clean sweep on your misses. Now take a fresh full section."
        : "Still some misses. Read the whys out loud, then run them again."
      : allPass
        ? pick(HUB_PASS)
        : pick(HUB_FAIL);

    const missedIdx = [];
    s.items.forEach((it, i) => {
      if (s.answers[i] !== it.a) missedIdx.push(i);
    });

    const review = missedIdx
      .map((i) => {
        const it = s.items[i];
        const p = s.answers[i];
        return (
          '<div class="epa-miss"><div class="epa-miss-tag">' +
          esc(secName(it.sec)) +
          "</div><p class=\"epa-miss-q\">" +
          esc(it.q) +
          "</p>" +
          '<p class="epa-why-wrong"><span>Your pick:</span> ' +
          esc(it.choices[p]) +
          "<br/><span>Why it is wrong:</span> " +
          esc(it.reasons[p]) +
          "</p>" +
          '<p class="epa-why-right"><span>Right answer:</span> ' +
          esc(it.choices[it.a]) +
          "<br/><span>Why:</span> " +
          esc(it.why) +
          "</p></div>"
        );
      })
      .join("");

    return (
      '<div class="epa-game epa-end no-print">' +
      '<div class="epa-label">' +
      esc(B().LABEL) +
      "</div>" +
      "<h3 class=\"epa-h\">" +
      esc(s.isRetry ? "Missed-only drill" : secName(s.sectionId)) +
      " results</h3>" +
      '<div class="epa-total">' +
      correctCount(s) +
      "/" +
      s.items.length +
      (s.mode === "instant" ? ' <small>best streak ' + s.bestStreak + "</small>" : "") +
      "</div>" +
      '<div class="epa-res">' +
      rows +
      "</div>" +
      (s.isRetry ? "" : '<p class="epa-note">Pass line ' + PASS + "/" + PER + " per section.</p>") +
      '<p class="epa-hub"><b>Professor HUB:</b> ' +
      esc(line) +
      "</p>" +
      '<div class="epa-nav">' +
      (missedIdx.length
        ? '<button type="button" class="btn primary" id="epa-retry-missed">Retry missed only (' + missedIdx.length + ")</button>"
        : "") +
      '<button type="button" class="btn" id="epa-again">New ' +
      esc(secName(s.sectionId)) +
      " run</button>" +
      '<button type="button" class="btn" id="epa-picker">Pick another section</button>' +
      "</div>" +
      (missedIdx.length
        ? '<h3 class="epa-h">Missed questions</h3>' + review
        : '<p class="epa-note">No misses. Nice work.</p>') +
      "</div>"
    );
  }

  /* ---------- events ---------- */

  function on(id, fn) {
    const b = document.getElementById(id);
    if (b) b.onclick = fn;
  }

  function bind() {
    root.querySelectorAll("[data-sec]").forEach((b) => {
      b.onclick = () => {
        G.sectionId = b.dataset.sec;
        G.flash = "";
        draw();
      };
    });
    root.querySelectorAll("[data-mode]").forEach((b) => {
      b.onclick = () => {
        setPref("mode", b.dataset.mode);
        draw();
      };
    });
    on("epa-start", () => {
      G.flash = "";
      startSession(G.sectionId, null, false);
    });
    on("epa-other-packs", () => {
      if (typeof openClassicPacks === "function") openClassicPacks();
    });
    root.querySelectorAll("[data-choice]").forEach((b) => {
      b.onclick = () => choose(Number(b.dataset.choice));
    });
    on("epa-next", next);
    on("epa-back", back);
    on("epa-quit", () => {
      if (global.confirm("Quit this run? Answers so far will be lost.")) {
        G.session = null;
        G.view = "picker";
        draw();
      }
    });
    on("epa-retry-missed", () => {
      const s = G.session;
      const missed = s.items.filter((it, i) => s.answers[i] !== it.a);
      startSession(s.sectionId, missed, true);
    });
    on("epa-again", () => startSession(G.session.sectionId, null, false));
    on("epa-picker", () => {
      G.view = "picker";
      G.sectionId = G.session ? G.session.sectionId : G.sectionId;
      draw();
    });
    const nb = document.getElementById("epa-next");
    if (nb && !nb.disabled && G.view === "play") nb.focus({ preventScroll: true });
  }

  document.addEventListener("keydown", (ev) => {
    if (!root || !document.body.contains(root)) return;
    if (ctx && typeof ctx.isActive === "function" && !ctx.isActive()) {
      var sc = document.getElementById("screen-quiz");
      if (!(sc && (sc.classList.contains("active") || sc.style.display === "block"))) return;
    }
    if (G.view !== "play") return;
    const tag = (ev.target && ev.target.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
    if (/^[1-4]$/.test(ev.key)) {
      ev.preventDefault();
      choose(Number(ev.key) - 1);
    } else if (ev.key === "Enter") {
      ev.preventDefault();
      next();
    }
  });

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;");
  }

  function defaultCtx() {
    return {
      escapeHtml: escapeHtml,
      pin: { isUnlocked: function () { return false; } },
      openPinModal: function () {},
      isActive: function () {
        var sc = document.getElementById("screen-quiz");
        return !!(sc && sc.classList.contains("active"));
      },
    };
  }

  var classicStart = null;
  var classicHost = null;

  function openClassicPacks() {
    if (!classicStart || !classicHost) return;
    classicStart.call(global.QuizArena || {}, classicHost, { untimed: true, timerMax: 0, hideTimer: true });
  }

  function syncArenaBank() {
    var qa = global.QuizArena;
    if (!qa || !qa.BANK || !B()) return;
    var flat = [];
    B().SECTIONS.forEach(function (s) {
      (B().BANK[s.id] || []).forEach(function (it) {
        flat.push({
          q: it.q,
          choices: it.c.slice(),
          a: it.a,
          why: it.why,
          wrong: it.wrong,
          sec: s.id,
        });
      });
    });
    var prev = qa.BANK.epa608;
    var extras = [];
    if (Array.isArray(prev)) {
      prev.forEach(function (it) {
        if (!it || !it.q) return;
        // Keep bay fingerprint / cutout injects only — drop the thin legacy epa608 drills
        var isFp = !!(it._bayFingerprint || it.whyWrong || (it.why && /HPC|LPC|pressure-switch|float switch/i.test(it.q + " " + it.why)));
        if (!isFp) return;
        var dup = flat.some(function (x) { return x.q === it.q; });
        if (dup) return;
        if (B().BANK.core && B().BANK.core.some(function (x) { return x.q === it.q; })) return;
        extras.push({
          q: it.q,
          choices: (it.choices || it.c || []).slice(),
          a: it.a,
          why: it.why,
          wrong: it.wrong || null,
          whyWrong: it.whyWrong || null,
          sec: "core",
          _bayFingerprint: true,
        });
      });
    }
    // Map whyWrong-only cutouts into wrong[] shape for reveal
    extras.forEach(function (it) {
      if (!it.wrong && it.whyWrong) {
        it.wrong = [0, 1, 2, 3].map(function (i) {
          return i === it.a ? null : it.whyWrong;
        });
      }
    });
    if (extras.length && B().BANK.core && !B().BANK.core._fingerprintsMerged) {
      extras.forEach(function (it) {
        B().BANK.core.push({
          q: it.q,
          c: it.choices.slice(),
          a: it.a,
          why: it.why,
          wrong: it.wrong,
        });
      });
      B().BANK.core._fingerprintsMerged = true;
    }
    // Rebuild flat after optional core merge
    flat = [];
    B().SECTIONS.forEach(function (s) {
      (B().BANK[s.id] || []).forEach(function (it) {
        flat.push({
          q: it.q,
          choices: it.c.slice(),
          a: it.a,
          why: it.why,
          wrong: it.wrong,
          sec: s.id,
        });
      });
    });
    qa.BANK.epa608 = flat;
    qa.BANK.epa608._epaExamSynced = true;
  }

  function mount(container, context) {
    ctx = context || defaultCtx();
    root = container;
    function go() {
      if (!B()) {
        root.innerHTML = '<p class="empty">Loading EPA question bank…</p>';
        setTimeout(go, 100);
        return;
      }
      syncArenaBank();
      G.view = "picker";
      G.session = null;
      draw();
    }
    go();
  }

  global.EpaExam = {
    mount: mount,
    syncArenaBank: syncArenaBank,
    _state: function () { return G; },
  };

  function wrapQuizArena() {
    var qa = global.QuizArena;
    if (!qa || typeof qa.start !== "function" || qa._epaExamWrapped) return !!qa;
    classicStart = qa.start;
    qa.start = function (host, opts) {
      classicHost = host;
      opts = opts || {};
      // All-Star Exam entry → EPA section runner (111-Q bank)
      if (opts.classicPacks) {
        return classicStart.call(this, host, opts);
      }
      mount(host, defaultCtx());
      return {
        stop: function () {
          G.session = null;
          G.view = "picker";
          if (root) root.innerHTML = "";
        },
      };
    };
    qa._epaExamWrapped = true;
    syncArenaBank();
    return true;
  }

  var n = 0;
  var t = setInterval(function () {
    if (wrapQuizArena() || ++n > 80) clearInterval(t);
  }, 250);
  document.addEventListener("DOMContentLoaded", wrapQuizArena);
  // Cutout inject is async — re-sync so bay fingerprint items land in Core pool
  setTimeout(function () { try { syncArenaBank(); } catch (_) {} }, 1500);
  setTimeout(function () { try { syncArenaBank(); } catch (_) {} }, 4000);
})(window);
