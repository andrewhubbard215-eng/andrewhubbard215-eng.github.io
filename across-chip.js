/* Open safety chip. LPC, HPC, float, and high-limit inlet/outlet are separate probe points. */
(function () {
  function partName(box) {
    if (!box) return "";
    return String(box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || box.textContent || "").replace(/\s+/g, " ").trim();
  }
  function isSafety(who) {
    return /float|hpc|lpc|high-pressure|low-pressure|high-limit|\blimit\b/i.test(who);
  }
  function kindOf(who) {
    if (/lpc|low-pressure/i.test(who)) return "LPC";
    if (/hpc|high-pressure/i.test(who)) return "HPC";
    if (/float/i.test(who)) return "Float";
    if (/high-limit|\blimit\b/i.test(who)) return "Limit";
    return null;
  }
  function leadOf(el) {
    return el ? String(el.textContent || "") : "";
  }
  function vacAcross(red, com) {
    var a = red.toLowerCase();
    var b = com.toLowerCase();
    var tag = null;
    if (a.indexOf("lpc ") !== -1 || b.indexOf("lpc ") !== -1) tag = "lpc";
    else if (a.indexOf("hpc ") !== -1 || b.indexOf("hpc ") !== -1) tag = "hpc";
    else if (a.indexOf("float ") !== -1 || b.indexOf("float ") !== -1) tag = "float";
    else if (a.indexOf("limit ") !== -1 || b.indexOf("limit ") !== -1) tag = "limit";
    if (!tag) return null;
    var inlet = function (s) { return s.indexOf(tag + " inlet") !== -1; };
    var outlet = function (s) { return s.indexOf(tag + " outlet") !== -1; };
    var common = function (s) { return s.indexOf("c (24v") !== -1 || s === "c"; };
    var call = function (s) {
      return tag === "limit" ? s.indexOf("w (heat") !== -1 : s.indexOf("y (cool") !== -1;
    };
    if ((inlet(a) && outlet(b)) || (outlet(a) && inlet(b))) return "27.2";
    if ((inlet(a) && common(b)) || (common(a) && inlet(b))) return "27.2";
    if ((outlet(a) && common(b)) || (common(a) && outlet(b))) return "0.0";
    if ((inlet(a) && call(b)) || (call(a) && inlet(b))) return "0.0";
    if ((outlet(a) && call(b)) || (call(a) && outlet(b))) return "27.2";
    return null;
  }
  function paintMeter() {
    var lcd = document.getElementById("el-lcd");
    if (!lcd) return;
    var v = vacAcross(leadOf(document.getElementById("el-redn")), leadOf(document.getElementById("el-blkn")));
    if (v == null) return;
    lcd.textContent = v;
    var unit = document.getElementById("el-unit");
    if (unit) unit.textContent = "VAC";
  }
  function onLead(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();
    var name = ev.currentTarget.getAttribute("data-split-lead");
    var slot = ev.shiftKey ? document.getElementById("el-blkn") : document.getElementById("el-redn");
    if (slot) slot.textContent = name;
    paintMeter();
  }
  function openBox() {
    var stamped = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    if (stamped && kindOf(partName(stamped))) return stamped;
    var marked = document.querySelectorAll("#el-ladder button.el-node.open");
    for (var i = 0; i < marked.length; i++) {
      if (kindOf(partName(marked[i]))) return marked[i];
    }
    return stamped;
  }
  function splitOpen() {
    var host = document.getElementById("el-probes");
    if (!host) return;
    var open = openBox();
    var kind = open ? kindOf(partName(open)) : null;
    var buttons = host.querySelectorAll("button");
    var lump = null;
    var lumpName = kind === "LPC" ? "LPC switch" : kind === "HPC" ? "HPC switch" : kind === "Float" ? "Float switch" : kind === "Limit" ? "High-limit" : "";
    for (var i = 0; i < buttons.length; i++) {
      var label = (buttons[i].textContent || "").replace(/\s+/g, " ").trim();
      if (label === lumpName || (kind === "Float" && label === "Float")) lump = buttons[i];
      if (!buttons[i].getAttribute("data-split-lead")) buttons[i].style.display = "";
    }
    var split = host.querySelector("[data-safety-split]");
    if (!kind) {
      if (split && split.parentNode) split.parentNode.removeChild(split);
      return;
    }
    if (lump) lump.style.display = "none";
    if (split && split.getAttribute("data-safety-split") === kind) return;
    if (split && split.parentNode) split.parentNode.removeChild(split);
    split = document.createElement("span");
    split.setAttribute("data-safety-split", kind);
    [kind + " inlet", kind + " outlet"].forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "el-probe el-lpc-lead";
      b.textContent = name;
      b.setAttribute("data-split-lead", name);
      b.title = name.indexOf("inlet") !== -1
        ? "Line side of the open " + kind + ". Click sets RED. Shift-click sets COM."
        : "Load side of the open " + kind + ". To C is 0.0. Across to inlet is 27.2.";
      b.addEventListener("click", onLead, true);
      split.appendChild(b);
    });
    if (lump && lump.nextSibling) host.insertBefore(split, lump.nextSibling);
    else host.appendChild(split);
  }
  function stamp() {
    var n = openBox();
    var chips = document.querySelectorAll(".el-across-chip");
    for (var i = 0; i < chips.length; i++) {
      if (!n || chips[i].parentNode !== n) chips[i].parentNode.removeChild(chips[i]);
    }
    var kind = n ? kindOf(partName(n)) : null;
    if (n && kind && !n.querySelector(".el-across-chip")) {
      var chip = document.createElement("small");
      chip.className = "el-across-chip";
      chip.textContent = "~27 V across";
      chip.title = "RED on the inlet, COM on the outlet. Outlet to C is 0.0 V. 0 V across means the contacts are closed.";
      n.appendChild(chip);
    }
    splitOpen();
    var lcd = document.getElementById("el-lcd");
    var red = document.getElementById("el-redn");
    var note = document.getElementById("el-across-meter");
    var redName = red ? red.textContent : "";
    var reading = lcd ? parseFloat(lcd.textContent) : NaN;
    var onSwitch = /lpc|hpc|float|limit|pressure/i.test(redName);
    var across = kind && new RegExp(kind + " inlet", "i").test(redName) && reading === 27.2;
    var show = !!(kind && onSwitch && reading === 0 && !new RegExp(kind + " inlet", "i").test(redName));
    if (!note && lcd && lcd.parentNode) {
      note = document.createElement("p");
      note.id = "el-across-meter";
      note.className = "el-ladder-kicker";
      lcd.parentNode.appendChild(note);
    }
    if (note) {
      note.textContent = across
        ? "27.2 VAC is inlet to outlet. " + kind + " contacts are open. Do not jump it."
        : (show
          ? "0.0 VAC is outlet to C. Probe " + kind + " inlet to " + kind + " outlet for 27.2. Do not call the contacts closed."
          : "");
      note.style.display = (show || across) ? "" : "none";
    }
  }
  setInterval(stamp, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
