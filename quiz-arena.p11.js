window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[11]=(
  "L =\n        '<div class=\"qa-explain-card qa-explain-dark\">' +\n        '<p class=\"qa-explain-result\">' +\n        (ok ? \"\u2705" +
  " You got it \u00b7 +\" + lastAward + \" pts\" : \"\u274c Missed it \u00b7 +0 pts\") +\n        \"</p>\" +\n        \"<ol class=\\\"qa-break-list\\\">" +
  "\" +\n        rows +\n        \"</ol>\" +\n        '<p class=\"qa-explain-hub\">HUB: ' +\n        (ok ? hubLine(\"ok\") : hubLine(\"" +
  "bad\")).trim() +\n        \"</p>\" +\n        \"</div>\";\n      fb.className = \"qa-feedback \" + (ok ? \"good\" : \"bad\");\n    }\n  " +
  "  const next = root.querySelector(\".qa-next\");\n    if (next) {\n      next.classList.remove(\"hidden\");\n      next.textCon" +
  "tent = qi + 1 >= questions.length ? \"See final scores\" : \"Next question\";\n      next.onclick = () => nextQuestion();\n   " +
  "   try { next.focus(); } catch (_) {}\n    }\n  }\n\n  function startSolo() {\n    role = \"solo\";\n    nickname = (root.queryS" +
  "elector(\"#qa-nick\") && root.querySelector(\"#qa-nick\").value.trim()) || \"Tech\";\n    packId = (root.querySelector(\"#qa-pac" +
  "k\") && root.querySelector(\"#qa-pack\").value) || \"mixed\";\n    const keys = packId === \"mixed\" ? [\"epa608\", \"osha30\", \"cur" +
  "riculum\"] : [packId];\n    questions = mixBanks(keys).slice(0, 12);\n    qi = 0;\n    scores = {};\n    scores[nickname] = 0" +
  ";\n    players = [nickname];\n    mode = \"play\";\n    selected = null;\n    locked = false;\n    startTimer();\n    render();\n" +
  "  }\n\n  async function startHost() {\n    role = \"host\";\n    nickname = (root.querySelector(\"#qa-nick\") && root.querySelec" +
  "tor(\"#qa-nick\").value.trim()) || \"Host\";\n    packId = (root.querySelector(\"#qa-pack\") && root.querySelector(\"#qa-pack\")." +
  "value) || \"mixed\";\n    scores = {};\n    scores[nickname] = 0;\n    players = [nickname];\n    try {\n      const created = " +
  "await roomPost({ action: \"create\", host: nickname, packId });\n      roomPin = created.pin;\n      net = \"server\";\n      s" +
  "tartPoll();\n    } catch (_) {\n      roomPin = pinGen();\n      net = \"local\";\n      ensureChannel(roomPin);\n    }\n    mod" +
  "e = \"host\";\n    render();\n  }\n\n  async function hostBegin() {\n    const keys = packId === \"mixed\" ? [\"epa608\", \"osha30\"," +
  " \"curriculum\"] : [packId];\n    questions = mixBanks(keys).slice(0, 12);\n    qi = 0;\n    mode = \"play\";\n    selected = nu" +
  "ll;\n    locked = false;\n    window.__answers = {};\n    if (net === \"server\") {\n      try {\n        await roomPost({\n    " +
  "      action: \"sync\",\n          pin: roomPin,\n          status: \"play\",\n          qi: 0,\n          state: { questions, p" +
  "layers, scores, answers: {} },\n        });\n      } catch (_) {}\n    } else {\n      broadcast({ type: \"question\", questio" +
  "ns, qi, timerMax });\n    }\n    startTimer();\n    render();\n  }\n\n  async function joinRoom() {\n    role = \"player\";\n    n" +
  "ickname = (root.querySelector(\"#qa-nick\") && root.querySelector(\"#qa-nick\").value.trim()) || \"Player\";\n    roomPin = (ro" +
  "ot.querySelector(\"#qa-pin\") && root.querySelector(\"#qa-pin\").value.trim()) || \"\";\n    if (!/^\\d{6}$/.test(roomPin)) {\n  " +
  "    alert(\"Enter the 6-digit room PIN from the host.\");\n      return;\n    }\n    scores = {};\n    scores[nickname] = 0;\n " +
  "   try {\n      const snap = await roomPost({ action: \"join\", pin: roomPin, callsign: nickname });\n      net = \"server\";\n" +
  "      applyServerSnap(snap);\n      startPoll();\n    } catch (_) {\n      net = \"l"
);
