window.__QA_PARTS=window.__QA_PARTS||[];
window.__QA_PARTS[13]=(
  "     <span id=\"qa-roast-lab\"></span>\n            </label>\n            <div class=\"qa-pack-row\" id=\"qa-pack-row\">\n       " +
  "       <button type=\"button\" class=\"qa-pack-btn\" data-pack=\"epa608\">EPA 608</button>\n              <button type=\"button\"" +
  " class=\"qa-pack-btn\" data-pack=\"osha30\">OSHA 30</button>\n              <button type=\"button\" class=\"qa-pack-btn${window." +
  "LtBrand && window.LtBrand.isStore ? \" lincoln-only\" : \"\"}\" data-pack=\"curriculum\">${(window.LtBrand && window.LtBrand.pa" +
  "ckCurriculum) || \"Lincoln Tech\"}</button>\n              <button type=\"button\" class=\"qa-pack-btn\" data-pack=\"mixed\">Mix " +
  "all</button>\n            </div>\n            <label>Nickname<input id=\"qa-nick\" maxlength=\"14\" value=\"${nickname}\" placeh" +
  "older=\"Your name\"/></label>\n            <label>Question pack\n              <select id=\"qa-pack\">\n                ${PACKS" +
  ".map((p) => `<option value=\"${p.id}\">${p.name} \u2014 ${p.blurb}</option>`).join(\"\")}\n              </select>\n            </l" +
  "abel>\n            <div class=\"qa-actions\">\n              <button class=\"btn primary\" id=\"qa-solo\">Solo game</button>\n   " +
  "           <button class=\"btn\" id=\"qa-host\">Host classroom</button>\n            </div>\n            <div class=\"qa-join-b" +
  "ox\">\n              <p class=\"eyebrow\">Join a room</p>\n              <label>Room PIN<input id=\"qa-pin\" maxlength=\"6\" plac" +
  "eholder=\"6-digit PIN\"/></label>\n              <button class=\"btn primary\" id=\"qa-join\">Join</button>\n              <p cl" +
  "ass=\"qa-muted\">Online classroom: host a room, share the 6-digit PIN. Students join from any phone or laptop. Signed-in s" +
  "cores hit the All-Star board.</p>\n            </div>\n          </div>\n        </div>`;\n      root.querySelector(\"#qa-hub" +
  "\") && (root.querySelector(\"#qa-hub\").onclick = () => hooks.onHub && hooks.onHub());\n      root.querySelector(\"#qa-solo\")" +
  " && (root.querySelector(\"#qa-solo\").onclick = startSolo);\n      root.querySelector(\"#qa-host\") && (root.querySelector(\"#" +
  "qa-host\").onclick = startHost);\n      root.querySelector(\"#qa-join\") && (root.querySelector(\"#qa-join\").onclick = joinRo" +
  "om);\n      const roastEl = root.querySelector(\"#qa-roast\");\n      const roastLab = root.querySelector(\"#qa-roast-lab\");\n" +
  "      const labs = [\"Classroom\", \"Mild\", \"Spicy\", \"Extra\"];\n      function paintRoast() {\n        if (roastLab) roastLab" +
  ".textContent = labs[roastLevel] || \"Mild\";\n      }\n      paintRoast();\n      if (roastEl) {\n        roastEl.value = Stri" +
  "ng(roastLevel);\n        roastEl.oninput = () => {\n          roastLevel = +roastEl.value;\n          extraSpicy = roastLev" +
  "el >= 3;\n          paintRoast();\n          if (hooks.onRoast) hooks.onRoast(roastLevel);\n          if (hooks.onExtra) ho" +
  "oks.onExtra(extraSpicy);\n        };\n      }\n      const packSel = root.querySelector(\"#qa-pack\");\n      root.querySelect" +
  "orAll(\".qa-pack-btn\").forEach((b) => {\n        b.onclick = () => {\n          if (packSel) packSel.value = b.dataset.pack" +
  ";\n          root.querySelectorAll(\".qa-pack-btn\").forEach((x) => x.classList.toggle(\"on\", x === b));\n        };\n      })" +
  ";\n      return;\n    }\n\n    if (mode === \"host\" && role !== \"solo\") {\n      root.innerHTML = `\n        <div class=\"qa-she" +
  "ll\">\n          <header class=\"qa-head\">\n            <div><p class=\"eyebrow\">Room"
);
