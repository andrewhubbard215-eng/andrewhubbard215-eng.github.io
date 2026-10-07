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

  function numFrom(id) {
    var el = document.getElementById(id);
    if (!el) return null;
    var raw = (el.dataset && el.dataset.psig) || el.textContent || "";
    var m = String(raw).match(/-?\d+(\.\d+)?/);
    return m ? m[0] : null;
  }

  function diamondSeated() {
    var ids = ["compressor", "condenser", "metering", "evaporator"];
    for (var i = 0; i < ids.length; i++) {
      var seat = document.querySelector('#sb-seats .sb-seat[data-part="' + ids[i] + '"], #sb-seats .sb-seat[data-seat="' + ids[i] + '"]');
      if (!seat || !/\bon\b/.test(seat.className || "")) return false;
    }
    return true;
  }

  function dxRunning() {
    var b = document.getElementById("sb-run");
    return !!(b && /stop/i.test(b.textContent || ""));
  }

  function glassCite() {
    var s = window.LTSandbox;
    if (s && s.hoses === "on" && s.sh != null) {
      return " Glass: " + (s.gas || "gas") + " blue " + s.low + " / red " + s.high + " \u00b7 SH " + s.sh + "\u00b0 \u00b7 SC " + s.sc + "\u00b0. Call the meter and the glass, not the nameplate.";
    }
    if (diamondSeated()) {
      var blue = numFrom("sb-g-low") || numFrom("g-plow") || "\u2014";
      var red = numFrom("sb-g-high") || numFrom("g-phigh") || "\u2014";
      if (!dxRunning()) {
        return " Seated glass, standing: blue " + blue + " / red " + red + " psig, equalized. No SH/SC until the compressor runs. Do not call a charge fault off standing P. The open is the dark 0.0 V box.";
      }
      var sh = numFrom("g-sh") || numFrom("sb-sh") || "\u2014";
      var sc = numFrom("g-sc") || numFrom("sb-sc") || "\u2014";
      return " Seated glass, running: blue " + blue + " / red " + red + " psig \u00b7 SH " + sh + "\u00b0 \u00b7 SC " + sc + "\u00b0. Cite the glass. The open is still the 0.0 V box \u2014 do not shotgun the compressor.";
    }
    return " Hoses off. Sheet is nameplate only \u2014 seat the diamond and hook blue and red before you call a charge fault. The open is on the meter.";
  }

  function isReplaceBtn(b) {
    if (!b || b.tagName !== "BUTTON") return false;
    if (b.id === "el-replace") return true;
    var label = (b.textContent || "").replace(/\s+/g, " ").trim();
    return /^Replace /i.test(label);
  }

  function maskOpenGiveaway() {
    var nodes = document.querySelectorAll(
      "#electrical-root button, #electrical-root [data-node], .el-box, .el-node, .el-string button, .el-string [class*='box']"
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset && el.dataset.openMasked === "1") continue;
      var raw = el.textContent || "";
      if (!/OPEN/i.test(raw) || !/0\.0/.test(raw)) continue;
      el.dataset.openPlain = raw;
      el.innerHTML = raw.replace(/OPEN\s*[·•:\-]\s*/i, "");
      el.dataset.openMasked = "1";
      el.title = "Meter this box. Dark after gold is the open.";
    }
    var brow = document.querySelector("#electrical-root .eyebrow, .el-rail .eyebrow, p.eyebrow");
    if (brow && /tray on the ladder/i.test(brow.textContent || "")) {
      brow.textContent = "Walk Y with the meter. Dark after gold is the open.";
    }
  }

  function onLadderClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box, .el-node") : ev.target;
    var txt = ((box && (box.dataset && box.dataset.openPlain || box.textContent)) || "").replace(/\s+/g, " ");
    if ((/OPEN/i.test(txt) && /0\.0/.test(txt)) || (box && box.dataset && box.dataset.openMasked === "1")) {
      var k = ticketKey();
      if (k !== "pending") proved[k] = true;
      if (box && box.dataset && box.dataset.openPlain) {
        box.textContent = box.dataset.openPlain;
        box.dataset.openMasked = "0";
      }
      lockReplace();
      yell("Open proven. Cut that part." + glassCite());
      paint();
      return;
    }
    var btn = box && box.closest ? box.closest("button") || box : box;
    if (isReplaceBtn(btn) && !proved[ticketKey()]) {
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      lockReplace();
      yell("Meter the 0.0 V box first. Shotgun is a callback.");
    }
  }

  function yell(msg) {
    var n = document.getElementById("el-sheet-yell");
    if (!n) {
      n = document.createElement("p");
      n.id = "el-sheet-yell";
      n.style.cssText = "margin:8px 12px;color:#f5c542;font:600 13px/1.35 sans-serif";
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
        b.title = "Meter the 0.0 V box first. Shotgun is a callback.";
        b.style.setProperty("opacity", "0.35", "important");
        b.style.setProperty("pointer-events", "none", "important");
        b.style.setProperty("display", "none", "important");
      }
    }
  }

  function paint() {
    maskOpenGiveaway();
    var key = ticketKey();
    var openProved = key !== "pending" && !!proved[key];
    var k = document.querySelector(".el-ladder-kicker");
    if (k && k.id !== "el-ts-note") {
      if (openProved) {
        k.textContent = "Open is metered." + glassCite();
      } else if (/3A|Hum, no start|Heat pump/i.test(key)) {
        k.textContent =
          "LOCK OUT first. Isolate the short or the open cap before you slap a 3A or a winding. Meter 0.0 V, then replace.";
      } else if (/No-cool at 4:58/i.test(key)) {
        k.textContent =
          "No-cool at 4:58. Prove path: call \u2192 240 \u2192 disconnect \u2192 R\u2013C \u2192 Y \u2192 HPC \u2192 LPC \u2192 float \u2192 coil \u2192 T1 \u2192 compressor. Dark after gold is the open." + glassCite();
      } else {
        k.textContent =
          "Meter first. Top rail is 240. Bottom is the 24V cool string. Don't slap a cap until T1 is hot. Don't jump the float.";
      }
    }
    var ol = document.getElementById("el-ts");
    if (ol && !document.getElementById("el-ts-note")) {
      var note = document.createElement("p");
      note.id = "el-ts-note";
      note.className = "el-ladder-kicker";
      ol.parentNode.insertBefore(note, ol);
    }
    var noteEl = document.getElementById("el-ts-note");
    if (noteEl) {
      noteEl.textContent = openProved
        ? "No-cool sheet: open proven." + glassCite()
        : "No-cool sheet: tap the dark 0.0 V box before Replace lights up. Shotgun is a callback.";
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
