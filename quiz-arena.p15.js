window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[15]=(
  "t.querySelectorAll(\".qa-k-btn\").forEach((btn) => {\n      btn.onclick = () => pick(+btn.dataset.i);\n    });\n    const hub" +
  "Btn = root.querySelector(\"#qa-hub\");\n    if (hubBtn) hubBtn.onclick = () => {\n      stopTimer();\n      if (hooks.onHub) " +
  "hooks.onHub();\n    };\n  }\n\n  function start(host, opts) {\n    root = host;\n    hooks = opts || {};\n    if (hooks.untimed" +
  " || hooks.timerMax === 0) timerMax = 1e9;\n    else if (typeof hooks.timerMax === \"number\" && hooks.timerMax > 0) timerMa" +
  "x = hooks.timerMax;\n    mode = \"lobby\";\n    role = \"solo\";\n    nickname = (opts && opts.nickname) || \"Tech\";\n    extraSp" +
  "icy = !!(opts && (opts.extraSpicy || opts.roastLevel >= 3));\n    roastLevel = typeof (opts && opts.roastLevel) === \"numb" +
  "er\" ? opts.roastLevel : extraSpicy ? 3 : 1;\n    scores = {};\n    players = [];\n    stopTimer();\n    function onKey(e) {\n" +
  "      if (e.key === \"Escape\" && !/input|textarea|select/i.test(e.target.tagName || \"\")) {\n        stopTimer();\n        i" +
  "f (hooks.onHub) hooks.onHub();\n      }\n    }\n    document.addEventListener(\"keydown\", onKey);\n    render();\n    return {" +
  "\n      stop() {\n        stopTimer();\n        stopPoll();\n        document.removeEventListener(\"keydown\", onKey);\n       " +
  " if (channel) try { channel.close(); } catch (_) {}\n      },\n    };\n  }\n\n  global.QuizArena = { start, BANK, PACKS };\n})" +
  "(window);\n"
);
