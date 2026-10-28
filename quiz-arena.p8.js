window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[8]=(
  "pinGen() {\n    return String((Math.random() * 900000 + 100000) | 0);\n  }\n\n  async function roomPost(body) {\n    const r " +
  "= await fetch(\"/api/quiz-room\", {\n      method: \"POST\",\n      headers: { \"content-type\": \"application/json\" },\n      cre" +
  "dentials: \"include\",\n      body: JSON.stringify(body),\n    });\n    const data = await r.json().catch(() => ({}));\n    if" +
  " (!r.ok) throw new Error(data.error || \"Room error\");\n    return data;\n  }\n\n  async function roomGet(pin) {\n    const r " +
  "= await fetch(\"/api/quiz-room?pin=\" + encodeURIComponent(pin), { credentials: \"include\" });\n    const data = await r.jso" +
  "n().catch(() => ({}));\n    if (!r.ok) throw new Error(data.error || \"Room error\");\n    return data;\n  }\n\n  function stop" +
  "Poll() {\n    if (pollId) {\n      clearInterval(pollId);\n      pollId = 0;\n    }\n  }\n\n  function applyServerSnap(snap) {\n" +
  "    if (!snap) return;\n    const st = snap.state || {};\n    if (st.players) players = st.players;\n    if (st.scores) sco" +
  "res = st.scores;\n    if (st.questions && st.questions.length) questions = st.questions;\n    if (typeof snap.qi === \"numb" +
  "er\") qi = snap.qi;\n    packId = snap.packId || packId;\n    if (snap.status === \"play\" && mode !== \"play\" && mode !== \"re" +
  "sults\") {\n      mode = \"play\";\n      selected = null;\n      locked = false;\n      startTimer();\n    }\n    if (snap.statu" +
  "s === \"done\") {\n      mode = \"results\";\n      stopTimer();\n    }\n    render();\n  }\n\n  function startPoll() {\n    stopPol" +
  "l();\n    pollId = setInterval(async () => {\n      if (!roomPin || role === \"solo\") return;\n      try {\n        const sna" +
  "p = await roomGet(roomPin);\n        if (role === \"player\") applyServerSnap(snap);\n        else if (role === \"host\" && sn" +
  "ap.state && snap.state.answers) {\n          window.__answers = Object.assign({}, window.__answers, snap.state.answers);\n" +
  "          if (snap.state.players) {\n            players = snap.state.players;\n            if (mode === \"host\") render();" +
  "\n          }\n        }\n      } catch (_) {}\n    }, 1200);\n  }\n\n  function hubLine(kind) {\n    if (!global.ProfessorHUB) " +
  "return \"\";\n    const ctx = { extra: extraSpicy || roastLevel >= 3, level: roastLevel };\n    if (kind === \"ok\") return \" " +
  "\" + global.ProfessorHUB.banter(\"service-ok\", ctx);\n    if (kind === \"bad\") return \" \" + global.ProfessorHUB.banter(\"serv" +
  "ice-bad\", ctx);\n    return \" \" + global.ProfessorHUB.banter(\"hub\", ctx);\n  }\n\n  function broadcast(msg) {\n    if (channe" +
  "l) channel.postMessage(msg);\n  }\n\n  function ensureChannel(pin) {\n    if (channel) try { channel.close(); } catch (_) {}" +
  "\n    channel = null;\n    if (typeof BroadcastChannel === \"undefined\") return;\n    try {\n      channel = new BroadcastCha" +
  "nnel(\"lt-quiz-\" + pin);\n      channel.onmessage = (ev) => onNet(ev.data);\n    } catch (_) {\n      channel = null;\n    }\n" +
  "  }\n\n  function onNet(msg) {\n    if (!msg || !msg.type) return;\n    if (role === \"host\") {\n      if (msg.type === \"join\"" +
  ") {\n        if (!scores[msg.name]) scores[msg.name] = 0;\n        if (!players.includes(msg.name)) players.push(msg.name)" +
  ";\n        broadcast({ type: \"lobby\", players: players.slice(), scores: { ...scores }, packId, host: nickname });\n       " +
  " render();\n      }\n      if (msg.type === \"answer\" && !locked) {\n        // host"
);
