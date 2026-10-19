/* Shop-floor no-cool law on the ladder. Loads after electrical.js. v24 */
(function () {
  var proved = {};
  var painting = false;

  var NAMES = /No-cool at 4:58|Hum, no start|3A keeps popping|Stat wired drunk|Contactor never pulls|Pan is a lake|Iced solid|Dead set|Furnace limit|Rollout tripped|Pressure switch open|Heat pump, 3A/i;

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
      if (!seat || seat.dataset.seated !== "1") return false;
    }
    return true;
  }

  function glassCite() {
    if (!diamondSeated()) return "";
    var low = numFrom("sb-low");
    var high = numFrom("sb-high");
    if (low == null || high == null) return "";
    var sh = numFrom("sb-sh");
    var sc = numFrom("sb-sc");
    var gas = document.getElementById("sb-gas");
    var g = gas ? (gas.dataset.gas || gas.textContent || "").replace(/\s+/g, " ").trim() : "";
    return " Glass: " + (g || "gas") + " blue " + low + " / red " + high + " · SH " + sh + "° · SC " + sc + "°. Call the meter and the glass, not the nameplate.";
  }

  function setText(el, text) {
    if (!el) return;
    if (el.textContent !== text) el.textContent = text;
  }

  function maskOpenGiveaway() {
    var nodes = document.querySelectorAll("#el-ladder button.el-node, #el-ladder .el-box");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var raw = el.textContent || "";
      if (!/OPEN/i.test(raw) || !/0\.0/.test(raw)) continue;
      if (el.dataset.sheetMasked === "1") continue;
      el.dataset.openPlain = raw;
      el.textContent = raw.replace(/OPEN\s*[·•:\-]\s*/i, "");
      el.dataset.sheetMasked = "1";
      el.title = "Meter this box. Dark after gold is the open.";
    }
  }

  function landOpen() {
    var openNode = document.querySelector("#el-ladder button.el-node[data-series-open='1']");
    if (!openNode) return;
    if (openNode.dataset.landed === "1") return;
    openNode.dataset.landed = "1";
    var brow = document.querySelector(".el-ladder-kicker, #el-ts-note");
    if (brow && !/Dark after gold/.test(brow.textContent || "")) {
      setText(brow, "Walk Y with the meter. Dark after gold is the open.");
    }
  }

  function sinkDownstream() {
    var openNode = document.querySelector("#el-ladder button.el-node[data-series-open='1']");
    if (!openNode) return;
    var after = false;
    var nodes = document.querySelectorAll("#el-ladder button.el-node");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n === openNode) { after = true; continue; }
      if (!after) continue;
      if (!n.dataset.sinkNote) {
        n.dataset.sinkNote = "1";
        n.title = (n.title || "") + " Downstream of the open. Dark is expected. Do not cut this.";
      }
    }
  }

  function walkToOpen() {
    var openNode = document.querySelector("#el-ladder button.el-node[data-series-open='1']");
    if (!openNode) return;
    var prev = document.querySelectorAll("#el-ladder button.el-node.ts-now");
    for (var j = 0; j < prev.length; j++) {
      if (prev[j] !== openNode) prev[j].className = prev[j].className.replace(/\bts-now\b/g, "").replace(/\s+/g, " ").trim();
    }
    if (!/\bts-now\b/.test(openNode.className || "")) openNode.className = (openNode.className + " ts-now").trim();
  }

  function openLeadLine() {
    var key = ticketKey();
    if (/3A|Hum, no start|Heat pump/i.test(key)) return "LOCK OUT first. Isolate the short or the open cap before you slap a 3A or a winding. Meter 0.0 V, then replace.";
    if (/No-cool at 4:58/i.test(key)) return "No-cool at 4:58. Prove path: call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. Dark after gold is the open. C stays at transformer voltage.";
    return "Meter first. Top rail is 240. Bottom is the 24V cool string. Don't slap a cap until T1 is hot. Don't jump the float.";
  }

  function paint() {
    if (painting) return;
    painting = true;
    try {
      maskOpenGiveaway();
      landOpen();
      sinkDownstream();
      walkToOpen();
      var key = ticketKey();
      var openProved = key !== "pending" && !!proved[key];
      var k = document.querySelector(".el-ladder-kicker");
      if (k && k.id !== "el-ts-note") {
        var next;
        if (openProved) {
          next = "Open proven. Replace that part only. LOTO stays on. Do not shotgun." + glassCite();
        } else if (/3A|Hum, no start|Heat pump/i.test(key)) {
          next = "LOCK OUT first. Isolate the short or the open cap before you slap a 3A or a winding. Meter 0.0 V, then replace.";
        } else if (/No-cool at 4:58/i.test(key)) {
          next = "No-cool at 4:58. Prove path: call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor. Dark after gold is the open. C stays at transformer voltage.";
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
          ? "Sheet: open proven — cut that part. Do not jump the float." + glassCite()
          : "No-cool sheet: " + openLeadLine());
      }
      lockReplace();
      coachAcross();
    } finally {
      setTimeout(function () { painting = false; }, 0);
    }
  }

  function lockReplace() {
    var b = document.getElementById("el-replace");
    if (!b) return;
    var key = ticketKey();
    var openProved = key !== "pending" && !!proved[key];
    if (!b.dataset.plainLabel) b.dataset.plainLabel = (b.textContent || "").trim();
    if (openProved) {
      b.disabled = false;
      if (b.dataset.plainLabel && /Meter the 0/.test(b.textContent || "")) setText(b, b.dataset.plainLabel);
      b.style.removeProperty("opacity");
      b.style.removeProperty("pointer-events");
      b.style.removeProperty("filter");
      b.removeAttribute("title");
      return;
    }
    b.disabled = true;
    setText(b, document.querySelector("#el-ladder button.el-node[data-series-open='1']") ? "Meter the ~27 V across" : "Meter the 0.0 V open");
    b.title = "Meter the 0.0 V box first. Shotgun is a callback.";
    b.style.setProperty("opacity", "0.55", "important");
    b.style.setProperty("pointer-events", "none", "important");
    b.style.setProperty("filter", "grayscale(0.35)", "important");
  }

  function coachAcross() {
    var openNode = document.querySelector("#el-ladder button.el-node[data-series-open='1']");
    if (!openNode) return;
    var who = (openNode.textContent || "").replace(/\s+/g, " ").trim();
    if (/HPC/i.test(who)) {
      yell("Meter law: open HPC is ~27 V across (Y-side to outlet). Outlet to C is 0.0 V. 0 V across the switch means it is closed. Do not stab T1.");
    } else if (/LPC/i.test(who)) {
      yell("Meter law: open LPC is ~27 V across (inlet to outlet). Outlet to C is 0.0 V. 0 V across means the contacts are closed. Do not add gas on a frozen coil.");
    } else if (/float|Float/i.test(who)) {
      yell("Meter law: open float is ~27 V across (inlet to outlet). Outlet to C is 0.0 V. 0 V across means the pan is dry. Do not jump the float.");
    }
  }

  function yell(msg) {
    var hub = document.getElementById("el-hub");
    if (!hub) return;
    var line = hub.querySelector(".el-hub-line, p");
    if (line && !/Meter law/.test(line.textContent || "")) {
      line.textContent = msg;
    }
  }

  function onClick(ev) {
    var box = ev.target && ev.target.closest ? ev.target.closest("button, [data-node], .el-box") : ev.target;
    if (!box || box.id === "el-replace") return;
    var txt = ((box.dataset && box.dataset.openPlain) || box.textContent || "").replace(/\s+/g, " ");
    if ((/OPEN/i.test(txt) && /0\.0/.test(txt)) || (box.dataset && box.dataset.sheetMasked === "1")) {
      var key = ticketKey();
      if (key !== "pending") proved[key] = true;
      if (box.dataset && box.dataset.openPlain) box.textContent = box.dataset.openPlain;
      paint();
    }
  }

  function boot() {
    if (document.body && document.body.dataset.sheetBoot === "1") return;
    if (document.body) document.body.dataset.sheetBoot = "1";
    document.addEventListener("click", onClick, true);
    setInterval(paint, 350);
    paint();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
