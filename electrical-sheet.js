/* Shop-floor no-cool law on the ladder. Loads after electrical.js */
(function () {
  var proved = {};

  var NAMES = /No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Heat pump, 3A/i;

  function ticketKey() {
    var slip = document.getElementById("el-callback-slip");
    var title = document.querySelector(".el-job-title, #el-job-title, .el-call-title");
    var blob = ((slip && slip.textContent) || "") + " " + ((title && title.textContent) || "");
    var m = blob.match(NAMES);
    if (m) return m[0];
    var armed = document.body && document.body.innerText ? document.body.innerText : "";
    m = armed.match(NAMES);
    return (m && m[0]) || "pending";
  }

  function isReplaceBtn(b) {
    if (!b || b.tagName !== "BUTTON") return false;
    if (b.id === "el-replace") return true;
    var label = (b.textContent || "").replace(/\s+/g, " ").trim();
    return /^Replace /i.test(label);
  }

  function onLadderClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box, .el-node") : ev.target;
    var txt = ((box && box.textContent) || "").replace(/\s+/g, " ");
    if (/OPEN/i.test(txt) && /0\.0/.test(txt)) {
      var k = ticketKey();
      if (k !== "pending") proved[k] = true;
      lockReplace();
      yell("Open proven. Now you can cut that part.");
      return;
    }
    var btn = box && box.closest ? box.closest("button") || box : box;
    if (isReplaceBtn(btn) && !proved[ticketKey()]) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      lockReplace();
      yell("Meter the OPEN box first. Shotgun is a callback.");
    }
  }

  function yell(msg) {
    var n = document.getElementById("el-sheet-yell");
    if (!n) {
      n = document.createElement("p");
      n.id = "el-sheet-yell";
      n.style.cssText = "margin:8px 12px;color:#f5c542;font:600 13px/1.3 sans-serif";
      var host = document.querySelector("#el-replace") && document.querySelector("#el-replace").parentNode;
      if (host) host.appendChild(n);
      else {
        var root = document.getElementById("electrical-root");
        if (root) root.appendChild(n);
      }
    }
    n.textContent = msg;
  }

  function lockReplace() {
    var key = ticketKey();
    var ok = key !== "pending" && !!proved[key];
    var btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!isReplaceBtn(b)) continue;
      if (ok) {
        b.disabled = false;
        b.removeAttribute("title");
        b.style.opacity = "";
        b.style.pointerEvents = "";
        b.style.display = "";
      } else {
        b.disabled = true;
        b.title = "Meter the OPEN box first. Shotgun is a callback.";
        b.style.opacity = "0.35";
        b.style.pointerEvents = "none";
        b.style.display = "none";
      }
    }
  }

  function paint() {
    var k = document.querySelector(".el-ladder-kicker");
    if (k && k.id !== "el-ts-note") {
      k.textContent =
        "Meter first. Top rail is 240. Bottom is the 24V cool string. Don't slap a cap until T1 is hot. Don't jump the float.";
    }
    var ol = document.getElementById("el-ts");
    if (ol && !document.getElementById("el-ts-note")) {
      var note = document.createElement("p");
      note.id = "el-ts-note";
      note.className = "el-ladder-kicker";
      note.textContent =
        "No-cool sheet: tap the dark OPEN box (0.0 V) before Replace lights up. Shotgun is a callback.";
      ol.parentNode.insertBefore(note, ol);
    }
    lockReplace();
  }

  function boot() {
    var root = document.getElementById("electrical-root") || document.body;
    if (root && !root.dataset.sheetObs) {
      root.dataset.sheetObs = "1";
      new MutationObserver(paint).observe(root, { childList: true, subtree: true });
      root.addEventListener("click", onLadderClick, true);
    }
    paint();
    setInterval(paint, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
