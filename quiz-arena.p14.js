window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[14]=(
  " lobby</p><h2>PIN ${roomPin}</h2></div>\n            <button class=\"btn\" id=\"qa-hub\">Shop floor</button>\n          </head" +
  "er>\n          <div class=\"qa-lobby\">\n            <p class=\"qa-lede\">Players join with this PIN on the same game site. Pa" +
  "ck: <strong>${PACKS.find((p) => p.id === packId)?.name || packId}</strong></p>\n            <div class=\"qa-pin-big\">${roo" +
  "mPin}</div>\n            <h3>Players</h3>\n            ${leaderboardHtml()}\n            ${\n              role === \"host\"\n " +
  "               ? '<button class=\"btn primary\" id=\"qa-begin\">Start quiz</button>'\n                : '<p class=\"qa-muted\">" +
  "Waiting for host to start\u2026</p>'\n            }\n          </div>\n        </div>`;\n      root.querySelector(\"#qa-hub\").oncl" +
  "ick = () => hooks.onHub && hooks.onHub();\n      const b = root.querySelector(\"#qa-begin\");\n      if (b) b.onclick = host" +
  "Begin;\n      return;\n    }\n\n    if (mode === \"results\") {\n      const list = Object.entries(scores).sort((a, b) => b[1] " +
  "- a[1]);\n      root.innerHTML = `\n        <div class=\"qa-shell\">\n          <header class=\"qa-head\">\n            <div><p " +
  "class=\"eyebrow\">Final podium</p><h2>Quiz complete</h2></div>\n            <button class=\"btn\" id=\"qa-hub\">Shop floor</but" +
  "ton>\n          </header>\n          <div class=\"qa-lobby\">\n            ${leaderboardHtml()}\n            <p class=\"qa-feed" +
  "back good\">${list[0] ? \"\ud83c\udfc6 \" + list[0][0] + \" leads with \" + list[0][1] + \" pts.\" : \"\"} ${hubLine(\"ok\")}</p>\n            " +
  "<button class=\"btn primary\" id=\"qa-again\">Play again</button>\n          </div>\n        </div>`;\n      root.querySelector" +
  "(\"#qa-hub\").onclick = () => hooks.onHub && hooks.onHub();\n      root.querySelector(\"#qa-again\").onclick = () => {\n      " +
  "  mode = \"lobby\";\n        render();\n      };\n      return;\n    }\n\n    // play\n    const item = questions[qi];\n    if (!i" +
  "tem) {\n      mode = \"results\";\n      render();\n      return;\n    }\n    root.innerHTML = `\n      <div class=\"qa-exam\">\n  " +
  "      <div class=\"qa-exam-body\">\n        <header class=\"qa-exam-top\">\n          <span class=\"qa-exam-pack\">${(item.pack " +
  "|| packId || \"\").replace(\"curriculum\", (window.LtBrand && window.LtBrand.packCurriculum) || \"Lincoln Tech\").replace(\"epa" +
  "608\",\"EPA 608\").replace(\"osha30\",\"OSHA 30\")}</span>\n          <span class=\"qa-exam-qnum\">Item ${qi + 1} / ${questions.le" +
  "ngth}</span>\n          <span class=\"qa-timer-text qa-exam-time\">${Math.ceil(timer)}s</span>\n          <span class=\"qa-ex" +
  "am-score\">${scores[nickname] || 0} pts</span>\n          <button class=\"btn\" id=\"qa-hub\">Shop floor</button>\n        </he" +
  "ader>\n        <div class=\"qa-timer-bar qa-exam-bar\"><i style=\"width:${(timer / timerMax) * 100}%\"></i></div>\n        <h2" +
  " class=\"qa-exam-question\">${item.q}</h2>\n        <div class=\"qa-exam-grid\">\n          ${(item.choices || [])\n           " +
  " .map(\n              (c, i) =>\n                `<button class=\"qa-k-btn qa-exam-btn\" data-i=\"${i}\"><span class=\"qa-exam-" +
  "letter\">${LETTERS[i]}</span><span class=\"qa-k-txt\">${c}</span></button>`\n            )\n            .join(\"\")}\n        </" +
  "div>\n        <p class=\"qa-feedback\"></p>\n        </div>\n        <div class=\"qa-exam-foot\">\n          <button class=\"btn " +
  "primary qa-next hidden\">Next item</button>\n        </div>\n      </div>`;\n    roo"
);
