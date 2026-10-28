window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[9]=(
  " authoritative scoring happens on host timer end; store early answers\n        if (!window.__answers) window.__answers = " +
  "{};\n        window.__answers[msg.name] = { i: msg.i, t: msg.t };\n      }\n    }\n    if (role === \"player\") {\n      if (ms" +
  "g.type === \"lobby\") {\n        players = msg.players || [];\n        scores = msg.scores || scores;\n        render();\n    " +
  "  }\n      if (msg.type === \"question\") {\n        questions = msg.questions;\n        qi = msg.qi;\n        timerMax = msg." +
  "timerMax || 20;\n        selected = null;\n        locked = false;\n        mode = \"play\";\n        startTimer();\n        re" +
  "nder();\n      }\n      if (msg.type === \"reveal\") {\n        locked = true;\n        scores = msg.scores || scores;\n       " +
  " lastAward = msg.awards && msg.awards[nickname] ? msg.awards[nickname] : 0;\n        stopTimer();\n        renderReveal(ms" +
  "g.correct, msg.why);\n      }\n      if (msg.type === \"results\") {\n        scores = msg.scores || scores;\n        mode = \"" +
  "results\";\n        stopTimer();\n        render();\n      }\n    }\n  }\n\n  function stopTimer() {\n    if (timerId) clearInter" +
  "val(timerId);\n    timerId = 0;\n  }\n\n  function startTimer() {\n    stopTimer();\n    if (hooks && (hooks.untimed || hooks." +
  "timerMax === 0)) {\n      timer = timerMax = 1e9;\n      return;\n    }\n    timer = timerMax;\n    timerId = setInterval(() " +
  "=> {\n      if (!root) {\n        stopTimer();\n        return;\n      }\n      timer -= 0.1;\n      const el = root.querySele" +
  "ctor(\".qa-timer-bar > i\");\n      if (el) el.style.width = Math.max(0, (timer / timerMax) * 100) + \"%\";\n      const tx = " +
  "root.querySelector(\".qa-timer-text\");\n      if (tx) tx.textContent = Math.max(0, Math.ceil(timer)) + \"s\";\n      if (time" +
  "r <= 0) {\n        stopTimer();\n        if (role === \"solo\" || role === \"host\") finishQuestion();\n        else if (role =" +
  "== \"player\" && !locked) {\n          locked = true;\n          // wait for host reveal\n        }\n      }\n    }, 100);\n  }\n" +
  "\n  function pointsForSpeed() {\n    // max 1000, decays with time\n    const frac = Math.max(0, timer / timerMax);\n    ret" +
  "urn Math.round(500 + 500 * frac);\n  }\n\n  function finishQuestion() {\n    locked = true;\n    stopTimer();\n    const item " +
  "= questions[qi];\n    if (!item) return;\n    const awards = {};\n    if (role === \"solo\") {\n      const ok = selected === " +
  "item.a;\n      const got = ok ? pointsForSpeed() : 0;\n      awards[nickname] = got;\n      scores[nickname] = (scores[nick" +
  "name] || 0) + got;\n      lastAward = got;\n      renderReveal(item.a, item.why);\n      return;\n    }\n    if (role === \"ho" +
  "st\") {\n      const ans = window.__answers || {};\n      // host's own answer\n      if (selected != null) ans[nickname] = " +
  "{ i: selected, t: timer };\n      Object.keys(ans).forEach((name) => {\n        const ok = ans[name].i === item.a;\n       " +
  " const frac = Math.max(0, (ans[name].t || 0) / timerMax);\n        const got = ok ? Math.round(500 + 500 * frac) : 0;\n   " +
  "     awards[name] = got;\n        scores[name] = (scores[name] || 0) + got;\n      });\n      window.__answers = {};\n      " +
  "if (net === \"server\") {\n        roomPost({\n          action: \"sync\",\n          pin: roomPin,\n          status: \"play\",\n " +
  "         qi,\n          state: { questions, players, scores, answers: {} },\n     "
);
