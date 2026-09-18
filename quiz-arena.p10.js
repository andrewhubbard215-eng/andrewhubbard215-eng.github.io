window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[10]=(
  "   }).catch(() => {});\n      } else {\n        broadcast({\n          type: \"reveal\",\n          correct: item.a,\n         " +
  " why: item.why,\n          scores: { ...scores },\n          awards,\n        });\n      }\n      lastAward = awards[nickname" +
  "] || 0;\n      renderReveal(item.a, item.why);\n    }\n  }\n\n  function nextQuestion() {\n    qi++;\n    selected = null;\n    " +
  "locked = false;\n    window.__answers = {};\n    if (qi >= questions.length) {\n      mode = \"results\";\n      stopTimer();\n" +
  "      if (role === \"host\") {\n        if (net === \"server\") {\n          roomPost({\n            action: \"sync\",\n          " +
  "  pin: roomPin,\n            status: \"done\",\n            qi,\n            state: { questions, players, scores, answers: {}" +
  " },\n          }).catch(() => {});\n        } else {\n          broadcast({ type: \"results\", scores: { ...scores } });\n    " +
  "    }\n      }\n      render();\n      if (hooks.onComplete) {\n        try {\n          const list = Object.entries(scores)." +
  "sort((a, b) => b[1] - a[1]);\n          hooks.onComplete({ scores, winner: list[0], total: questions.length, packId });\n " +
  "       } catch (err) {\n          console.warn(\"quiz complete\", err);\n        }\n      }\n      return;\n    }\n    if (role " +
  "=== \"host\") {\n      if (net === \"server\") {\n        roomPost({\n          action: \"sync\",\n          pin: roomPin,\n       " +
  "   status: \"play\",\n          qi,\n          state: { questions, players, scores, answers: {} },\n        }).catch(() => {}" +
  ");\n      } else {\n        broadcast({ type: \"question\", questions, qi, timerMax });\n      }\n    }\n    startTimer();\n    " +
  "render();\n  }\n\n  function renderReveal(correct, why) {\n    const item = questions[qi];\n    if (!item) return;\n    root.q" +
  "uerySelectorAll(\".qa-choice, .qa-k-btn\").forEach((btn, i) => {\n      btn.classList.add(\"locked\");\n      if (i === correc" +
  "t) btn.classList.add(\"correct\");\n      else btn.classList.add(\"wrong\");\n      if (selected === i) btn.classList.add(\"pic" +
  "ked\");\n    });\n    const explain = why || item.why || ((window.LtBrand && window.LtBrand.isStore)\n      ? \"Review this i" +
  "n EPA 608 / OSHA 30 notes.\"\n      : \"Review this in EPA 608 / OSHA 30 / Lincoln Tech notes.\");\n    const ok = selected =" +
  "== correct;\n    if (window.LtSfx) {\n      try {\n        if (ok && window.LtSfx.correct) window.LtSfx.correct();\n        " +
  "else if (!ok && window.LtSfx.wrong) window.LtSfx.wrong();\n      } catch (_) {}\n    }\n    const rows = item.choices\n     " +
  " .map((c, i) => {\n        const letter = LETTERS[i] || String(i + 1);\n        if (i === correct) {\n          return (\n  " +
  "          '<li class=\"qa-break right\"><strong>' +\n            letter +\n            \" RIGHT</strong> \u2014 \" +\n            c " +
  "+\n            \"<br><em>Why it's right:</em> \" +\n            explain +\n            \"</li>\"\n          );\n        }\n       " +
  " const miss =\n          (item.wrong && item.wrong[i]) ||\n          \"Why it's wrong: this is not the shop answer. \" + exp" +
  "lain;\n        return (\n          '<li class=\"qa-break miss\"><strong>' +\n          letter +\n          \" WRONG</strong> \u2014 " +
  "\" +\n          c +\n          \"<br><em>\" +\n          miss +\n          \"</em></li>\"\n        );\n      })\n      .join(\"\");\n  " +
  "  const fb = root.querySelector(\".qa-feedback\");\n    if (fb) {\n      fb.innerHTM"
);
