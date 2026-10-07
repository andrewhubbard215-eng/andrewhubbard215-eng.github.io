/* Shop-floor no-cool law on the ladder. Loads after electrical.js */
(function () {
  var proved = {};
  var painting = false;

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
      return " Glass: " + (s.gas || "gas") + " blue " + s.low + " / red " + s.high + " · SH " + s.sh + "° · SC " + s.sc + "°. Call the meter and the glass, not the nameplate.";
    }
    if (diamondSeated()) {
      var blue = numFrom("sb-g-low") || numFrom("g-plow") || "—";
      var red = numFrom("sb-g-high") || numFrom("g-phigh") || "—";
      if (!dxRunning()) {
        return " Seated glass, standing: blue " + blue + " / red " + red + " psig, equalized. No SH/SC until the compressor runs. Do not call a charge fault off standing P. The open is the dark 0.0 V box.";
      }
      var sh = numFrom("g-sh") || numFrom("sb-sh") || "—";
      var sc = numFrom("g-sc") || numFrom("sb-sc") || "—";
      return " Seated glass, running: blue " + blue + " / red " + red + " psig · SH " + sh + "° · SC " + sc + "°. Cite the glass. The open is still the 0.0 V box — do not shotgun the compressor.";
    }
    return " Hoses off. Sheet is nameplate only — seat the diamond and hook blue and red before you call a charge fault. The open is on the meter.";
  }

  function isReplaceBtn(b) {
    if (!b || b.tagName !== "BUTTON") return false;
    if (b.id === "el-replace") return true;
    var label = (b.textContent || "").replace(/\s+/g, " ").trim();
    return /^Replace /i.test(label);
  }

  function setText(el, text) {
    if (!el || el.textContent === text) return;
    el.textContent = text;
  }

  function partName(box) {
    if (!box) return "";
    var raw = (box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || "");
    if (!raw) {
      var clone = box.cloneNode(true);
      var small = clone.querySelector("small");
      if (small) small.remove();
      raw = clone.textContent || "";
    }
    raw = raw.replace(/0\.0\s*V/gi, "").replace(/OPEN/gi, "").replace(/\s+/g, " ").trim();
    return raw.slice(0, 42);
  }

  function maskOpenGiveaway() {
    var nodes = document.querySelectorAll(
      "#electrical-root button, #electrical-root [data-node], .el-box, .el-node, .el-string button, .el-string [class*='box']"
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset && (el.dataset.openMasked === "1" || el.dataset.provedOpen === "1")) continue;
      var raw = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (!/OPEN/i.test(raw) || !/0\.0/.test(raw)) continue;
      var spaced = raw.replace(/([A-Za-z0-9])OPEN/gi, "$1 OPEN");
      el.dataset.openPlain = spaced;
      el.textContent = spaced.replace(/OPEN\s*[·•:\-]\s*/i, " · ");
      el.dataset.openMasked = "1";
      el.title = "Meter this box. Dark after gold is the open.";
    }
    var brow = document.querySelector("#electrical-root .eyebrow, .el-rail .eyebrow, p.eyebrow");
    if (brow && /tray on the ladder/i.test(brow.textContent || "")) {
      setText(brow, "Walk Y with the meter. Dark after gold is the open.");
    }
  }

  function landOpen() {
    var rails = document.querySelectorAll("#el-ladder [data-rail]");
    for (var r = 0; r < rails.length; r++) {
      var nodes = rails[r].querySelectorAll("button.el-node");
      var seenLive = false;
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var small = n.querySelector("small");
        var volts = small ? small.textContent : "";
        var live = /\blive\b/.test(n.className || "") && !/0\.0/.test(volts);
        if (live) { seenLive = true; continue; }
        if (!seenLive || !/0\.0/.test(volts) || !/\bdead\b/.test(n.className || "")) continue;
        n.dataset.openLand = "1";
        n.dataset.openMasked = "1";
        if (small && small.textContent !== "0.0 V") small.textContent = "0.0 V";
        if (n.title !== "Dark after gold. Meter this box. That is the open.") {
          n.title = "Dark after gold. Meter this box. That is the open.";
        }
        break;
      }
    }
  }

  function onLadderClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box, .el-node") : ev.target;
    var txt = ((box && (box.dataset && box.dataset.openPlain || box.textContent)) || "").replace(/\s+/g, " ");
    var landed = box && box.dataset && (box.dataset.openLand === "1" || box.dataset.openMasked === "1");
    if ((/OPEN/i.test(txt) && /0\.0/.test(txt)) || landed) {
      var k = ticketKey();
      if (k !== "pending") proved[k] = true;
      if (box && box.dataset && box.dataset.openPlain) {
        box.textContent = box.dataset.openPlain;
        box.dataset.provedOpen = "1";
        box.dataset.openMasked = "1";
      }
      var who = partName(box);
      lockReplace();
      yell("Open proven" + (who ? " — " + who : "") + ". Cut that part." + glassCite());
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
    setText(n, msg);
  }

  function lockReplace() {
    var key = ticketKey();
    var ok = key !== "pending" && !!proved[key];
    var btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (!isReplaceBtn(b)) continue;
      if (ok) {
        if (b.disabled) b.disabled = false;
        b.removeAttribute("title");
        b.style.opacity = "";
        b.style.pointerEvents = "";
        b.style.filter = "";
        b.style.display = "";
        if (b.dataset.plainLabel && /Meter the 0/.test(b.textContent || "")) setText(b, b.dataset.plainLabel);
      } else {
        if (!b.disabled) b.disabled = true;
        if (b.title !== "Meter the 0.0 V box first. Shotgun is a callback.") {
          b.title = "Meter the 0.0 V box first. Shotgun is a callback.";
        }
        b.style.setProperty("opacity", "0.4", "important");
        b.style.setProperty("pointer-events", "none", "important");
        b.style.setProperty("filter", "grayscale(0.6)", "important");
        b.style.removeProperty("display");
        if (!b.dataset.plainLabel) b.dataset.plainLabel = (b.textContent || "").trim();
        setText(b, "Meter the 0.0 V open");
      }
    }
  }

  function paint() {
    if (painting) return;
    painting = true;
    try {
      maskOpenGiveaway();
      landOpen();
      var key = ticketKey();
      var openProved = key !== "pending" && !!proved[key];
      var k = document.querySelector(".el-ladder-kicker");
      if (k && k.id !== "el-ts-note") {
        var next;
        if (openProved) {
          next = "Open is metered." + glassCite();
        } else if (/3A|Hum, no start|Heat pump/i.test(key)) {
          next = "LOCK OUT first. Isolate the short or the open cap before you slap a 3A or a winding. Meter 0.0 V, then replace.";
        } else if (/No-cool at 4:58/i.test(key)) {
          next = "No-cool at 4:58. Prove path: call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. Dark after gold is the open." + glassCite();
        } else {
          next = "Meter first. Top rail is 240. Bottom is the 24V cool string. Don't slap a cap until T1 is hot. Don't jump the float.";
        }
        setText(k, next);
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
        setText(noteEl, openProved
          ? "No-cool sheet: open proven." + glassCite()
          : "No-cool sheet: tap the dark 0.0 V box before Replace lights up. Shotgun is a callback.");
      }
      lockReplace();
    } finally {
      painting = false;
    }
  }

  function boot() {
    var root = document.getElementById("electrical-root") || document.body;
    if (root && !root.dataset.sheetObs) {
      root.dataset.sheetObs = "1";
      new MutationObserver(function () {
        if (painting) return;
        paint();
      }).observe(root, { childList: true, subtree: true });
      root.addEventListener("click", onLadderClick, true);
    }
    paint();
    setInterval(function () {
      if (!painting) paint();
    }, 900);
  }
  window.LtNoCoolSheet = true;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
