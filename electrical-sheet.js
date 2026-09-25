/* Shop-floor no-cool law on the ladder. Loads after electrical.js */
(function () {
  var proved = {};

  function ticketKey() {
    var t = document.querySelector(".el-job-title, #el-job-title, .el-call-title");
    var slip = document.getElementById("el-callback-slip");
    var armed = document.querySelector("[class*='armed'], .el-timer-title, .el-defuse-title");
    var bits = [
      (t && t.textContent) || "",
      (slip && slip.textContent) || "",
      (armed && armed.textContent) || "",
      (document.body && document.body.innerText && /ARMED/.test(document.body.innerText)
        ? (document.body.innerText.match(/No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Heat pump, 3A/i) || [""])[0]
        : "")
    ].join(" | ");
    var m = bits.match(/No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Heat pump, 3A/i);
    return (m && m[0]) || bits.slice(0, 48) || "open";
  }

  function isReplaceBtn(b) {
    if (!b || b.tagName !== "BUTTON") return false;
    if (b.id === "el-replace") return true;
    var label = (b.textContent || "").replace(/\s+/g, " ").trim();
    return /^Replace /i.test(label);
  }

  function onLadderClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box, .el-node") : null;
    if (!box) box = ev.target;
    var txt = ((box && box.textContent) || "").replace(/\s+/g, " ");
    if (/OPEN/i.test(txt) && /0\.0/.test(txt)) {
      proved[ticketKey()] = true;
      lockReplace();
      return;
    }
    if (isReplaceBtn(box.closest ? box.closest("button") || box : box) && !proved[ticketKey()]) {
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
      else document.getElementById("electrical-root").appendChild(n);
    }
    n.textContent = msg;
  }

  function lockReplace() {
    var key = ticketKey();
    var ok = !!proved[key];
    var btns = document.querySelectorAll("button, #el-replace");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!isReplaceBtn(b)) continue;
      if (ok) {
        b.disabled = false;
        b.removeAttribute("title");
        b.style.opacity = "";
        b.style.pointerEvents = "";
      } else {
        b.disabled = true;
        b.title = "Meter the OPEN box first. Shotgun is a callback.";
        b.style.opacity = "0.45";
        b.style.pointerEvents = "none";
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
        "No-cool sheet: write the open before you guess the part. Isolate it. Parts stay LEFT on the bench.";
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
