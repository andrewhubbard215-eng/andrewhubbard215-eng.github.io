window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[12]=(
  "ocal\";\n      ensureChannel(roomPin);\n      broadcast({ type: \"join\", name: nickname });\n    }\n    mode = \"host\";\n    ren" +
  "der();\n  }\n\n  function pick(i) {\n    if (locked || mode !== \"play\") return;\n    selected = i;\n    locked = true;\n    if " +
  "(role === \"player\") {\n      if (net === \"server\") {\n        roomPost({ action: \"answer\", pin: roomPin, callsign: nicknam" +
  "e, i, t: timer }).catch(() => {});\n      } else {\n        broadcast({ type: \"answer\", name: nickname, i, t: timer });\n  " +
  "    }\n      const fb = root.querySelector(\".qa-feedback\");\n      if (fb) {\n        fb.textContent = \"Answer locked in. W" +
  "aiting for timer\u2026\";\n        fb.className = \"qa-feedback\";\n      }\n      root.querySelectorAll(\".qa-choice, .qa-k-btn\").f" +
  "orEach((b, idx) => {\n        b.classList.add(\"locked\");\n        if (idx === i) b.classList.add(\"picked\");\n      });\n    " +
  "} else if (role === \"solo\") {\n      // solo waits for timer OR allow instant resolve for snappy feel\n      finishQuestio" +
  "n();\n    } else if (role === \"host\") {\n      root.querySelectorAll(\".qa-choice, .qa-k-btn\").forEach((b, idx) => {\n      " +
  "  b.classList.add(\"locked\");\n        if (idx === i) b.classList.add(\"picked\");\n      });\n      // host waits for timer t" +
  "o score everyone\n    }\n  }\n\n  function leaderboardHtml() {\n    const list = Object.entries(scores).sort((a, b) => b[1] -" +
  " a[1]);\n    if (!list.length) return \"<p class='qa-muted'>No scores yet</p>\";\n    return (\n      '<ol class=\"qa-lb\">' +\n" +
  "      list\n        .map(\n          ([n, s], i) =>\n            \"<li\" +\n            (n === nickname ? ' class=\"me\"' : \"\") " +
  "+\n            \"><span>\" +\n            (i + 1) +\n            \". \" +\n            n +\n            \"</span><strong>\" +\n     " +
  "       s +\n            \"</strong></li>\"\n        )\n        .join(\"\") +\n      \"</ol>\"\n    );\n  }\n\n  function render() {\n  " +
  "  if (!root) return;\n    try {\n      paint();\n    } catch (err) {\n      console.warn(\"quiz render\", err);\n      try {\n  " +
  "      root.innerHTML =\n          '<div class=\"qa-shell\"><p class=\"qa-lede\">Exam hit a snag. Hit Shop floor and run it ag" +
  "ain.</p>' +\n          '<button class=\"btn primary\" id=\"qa-hub\">Shop floor</button></div>';\n        const b = root.queryS" +
  "elector(\"#qa-hub\");\n        if (b) b.onclick = () => hooks.onHub && hooks.onHub();\n      } catch (_) {}\n    }\n  }\n\n  fun" +
  "ction paint() {\n    if (mode === \"lobby\") {\n      root.innerHTML = `\n        <div class=\"qa-shell\">\n          <header cl" +
  "ass=\"qa-head\">\n            <div class=\"brand-bar\" style=\"justify-content:flex-start\">\n              <div class=\"brand-ma" +
  "rk\" style=\"width:28px;height:28px;font-size:14px\">LT</div>\n              <div class=\"brand-word\"><strong style=\"font-siz" +
  "e:15px\">ALL-STAR EXAM</strong><span>${(window.LtBrand && window.LtBrand.exam) || \"EPA 608 \u00b7 OSHA 30 \u00b7 Lincoln Tech\"} \u00b7 t" +
  "imed shop quiz</span></div>\n            </div>\n            <button class=\"btn\" id=\"qa-hub\">Shop floor</button>\n         " +
  " </header>\n          <div class=\"qa-lobby\">\n            <p class=\"qa-lede\">Timed exam board. Pick a pack. Speed still pa" +
  "ys \u2014 wrong answers still cost.</p>\n            <label class=\"spicy-toggle qa-heat\">HUB roast\n              <input type=\"" +
  "range\" id=\"qa-roast\" min=\"0\" max=\"3\" step=\"1\" value=\"${roastLevel}\" />\n         "
);
