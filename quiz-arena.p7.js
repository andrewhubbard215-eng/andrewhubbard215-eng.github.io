window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[7]=(
  " Live circuits bite.\",\n      },\n      {\n        q: \"HVAC Commandment 8 \u2014 superheat is:\",\n        choices: [\"Cond sat min" +
  "us liquid temp\", \"Suction temp minus evaporator sat\", \"Head pressure minus suction\", \"Whatever the analog gauges say\"],\n" +
  "        a: 1,\n        why: \"SH = suction temp \u2212 evap sat. SC = cond sat \u2212 liquid temp.\",\n      },\n      {\n        q: \"HV" +
  "AC Commandment 9 \u2014 iced suction and near-zero SH is usually:\",\n        choices: [\"Low charge \u2014 add gas\", \"Airflow (filte" +
  "r, blower, coil) \u2014 don't add gas yet\", \"A good TXV\", \"Normal on R-410A\"],\n        a: 1,\n        why: \"Airflow before cha" +
  "rge.\",\n      },\n    ],\n  };\n\n  function shuffleQuestion(q) {\n    const n = (q.choices || []).length;\n    if (n < 2) retu" +
  "rn Object.assign({}, q);\n    const order = [];\n    for (let i = 0; i < n; i++) order.push(i);\n    for (let i = n - 1; i " +
  "> 0; i--) {\n      const j = (Math.random() * (i + 1)) | 0;\n      const t = order[i];\n      order[i] = order[j];\n      or" +
  "der[j] = t;\n    }\n    const choices = order.map((i) => q.choices[i]);\n    const a = order.indexOf(q.a);\n    if (a === 0 " +
  "&& n > 1) {\n      const j = 1 + ((Math.random() * (n - 1)) | 0);\n      const tmpC = choices[0];\n      choices[0] = choic" +
  "es[j];\n      choices[j] = tmpC;\n      const tmpI = order[0];\n      order[0] = order[j];\n      order[j] = tmpI;\n    }\n   " +
  " const correct = order.indexOf(q.a);\n    let wrong = q.wrong;\n    if (wrong && typeof wrong === \"object\") {\n      const " +
  "nw = {};\n      order.forEach((oldI, newI) => {\n        if (wrong[oldI] != null) nw[newI] = wrong[oldI];\n      });\n      " +
  "wrong = nw;\n    }\n    return Object.assign({}, q, { choices: choices, a: correct, wrong: wrong });\n  }\n\n  function mixBa" +
  "nks(keys) {\n    let all = [];\n    keys.forEach((k) => {\n      (BANK[k] || []).forEach((q) => all.push(shuffleQuestion(Ob" +
  "ject.assign({ pack: k }, q))));\n    });\n    for (let i = all.length - 1; i > 0; i--) {\n      const j = (Math.random() * " +
  "(i + 1)) | 0;\n      [all[i], all[j]] = [all[j], all[i]];\n    }\n    return all;\n  }\n\n  const PACKS = [\n    { id: \"epa608\"" +
  ", name: \"EPA 608\", blurb: \"Recovery, vacuum, cylinders, Type I / II / III / Universal\" },\n    { id: \"osha30\", name: \"OSH" +
  "A 30\", blurb: \"Falls, LOTO, PPE, electrical, heat, SDS\" },\n    { id: \"curriculum\", name: (window.LtBrand && window.LtBra" +
  "nd.isStore) ? \"Shop curriculum\" : \"Lincoln Tech Curriculum\", blurb: \"Cycle, SH/SC, gauges, DMM, mini-split, airflow\" },\n" +
  "    { id: \"mixed\", name: \"Quiz Game mix\", blurb: (window.LtBrand && window.LtBrand.isStore) ? \"EPA 608 + OSHA 30 + shop\"" +
  " : \"EPA 608 + OSHA 30 + Lincoln Tech only\" },\n  ];\n\n  const LETTERS = [\"A\", \"B\", \"C\", \"D\"];\n\n  let root = null;\n  let ho" +
  "oks = {};\n  let mode = \"lobby\"; // lobby | host | play | results\n  let role = \"solo\"; // solo | host | player\n  let pack" +
  "Id = \"mixed\";\n  let questions = [];\n  let qi = 0;\n  let scores = {}; // name -> score\n  let nickname = \"Tech\";\n  let roo" +
  "mPin = \"\";\n  let channel = null;\n  let selected = null;\n  let locked = false;\n  let timer = 0;\n  let timerMax = 20;\n  le" +
  "t timerId = 0;\n  let lastAward = 0;\n  let players = [];\n  let pollId = 0;\n  let net = \"local\"; // local BroadcastChannel" +
  " | server PIN rooms\n  let extraSpicy = false;\n  let roastLevel = 1;\n\n  function "
);
