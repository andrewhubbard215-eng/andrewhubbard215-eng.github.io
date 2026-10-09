/* Open safety chip. LPC, HPC, float, high-limit, rollout, and pressure-switch inlet/outlet are separate probe points. Gas valve coil is metered, never jumped. Made heat call: switch closed, coil open. Wet trap: inducer running, switch open — hose and trap before the switch. */
(function () {
  function partName(box) {
    if (!box) return "";
    return String(box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || box.textContent || "").replace(/\s+/g, " ").trim();
  }
  function kindOf(who) {
    if (/lpc|low-pressure/i.test(who)) return "LPC";
    if (/hpc|high-pressure/i.test(who)) return "HPC";
    if (/float/i.test(who)) return "Float";
    if (/rollout/i.test(who)) return "Rollout";
    if (/pressure switch|presssw|pressure sw/i.test(who)) return "PS";
    if (/high-limit|\blimit\b/i.test(who)) return "Limit";
    return null;
  }
  function leadOf(el) {
    return el ? String(el.textContent || "") : "";
  }
  function valveOn() {
    return window.__gvCoil === 1;
  }
  function hoseOn() {
    return window.__hoseTrap === 1;
  }
  function hoseVac(red, com) {
    var a = red.toLowerCase();
    var b = com.toLowerCase();
    var hose = function (s) { return s.indexOf("inducer hose") !== -1; };
    var trap = function (s) { return s.indexOf("trap") !== -1 && s.indexOf("ps ") === -1; };
    if ((hose(a) && trap(b)) || (trap(a) && hose(b))) return "0.0";
    return null;
  }
  function valveVac(red, com) {
    var a = red.toLowerCase();
    var b = com.toLowerCase();
    var inlet = function (s) { return s.indexOf("ps inlet") !== -1; };
    var outlet = function (s) { return s.indexOf("ps outlet") !== -1; };
    var common = function (s) { return s.indexOf("c (24v") !== -1 || s === "c"; };
    var call = function (s) { return s.indexOf("w (heat") !== -1; };
    var gvHot = function (s) { return s.indexOf("gv hot") !== -1; };
    var gvCoil = function (s) { return s.indexOf("gv coil") !== -1; };
    if ((inlet(a) && outlet(b)) || (outlet(a) && inlet(b))) return "0.0";
    if ((inlet(a) && common(b)) || (common(a) && inlet(b))) return "27.2";
    if ((outlet(a) && common(b)) || (common(a) && outlet(b))) return "27.2";
    if ((gvHot(a) && gvCoil(b)) || (gvCoil(a) && gvHot(b))) return "27.2";
    if ((gvHot(a) && common(b)) || (common(a) && gvHot(b))) return "27.2";
    if ((gvCoil(a) && common(b)) || (common(a) && gvCoil(b))) return "0.0";
    if ((gvHot(a) && outlet(b)) || (outlet(a) && gvHot(b))) return "0.0";
    if ((gvHot(a) && inlet(b)) || (inlet(a) && gvHot(b))) return "0.0";
    if ((inlet(a) && call(b)) || (call(a) && inlet(b))) return "0.0";
    if ((outlet(a) && call(b)) || (call(a) && outlet(b))) return "0.0";
    return null;
  }
  function vacAcross(red, com) {
    if (hoseOn()) {
      var hv = hoseVac(red, com);
      if (hv != null) return hv;
    }
    if (valveOn()) return valveVac(red, com);
    var a = red.toLowerCase();
    var b = com.toLowerCase();
    var tag = null;
    if (a.indexOf("lpc ") !== -1 || b.indexOf("lpc ") !== -1) tag = "lpc";
    else if (a.indexOf("hpc ") !== -1 || b.indexOf("hpc ") !== -1) tag = "hpc";
    else if (a.indexOf("float ") !== -1 || b.indexOf("float ") !== -1) tag = "float";
    else if (a.indexOf("rollout ") !== -1 || b.indexOf("rollout ") !== -1) tag = "rollout";
    else if (a.indexOf("ps ") !== -1 || b.indexOf("ps ") !== -1) tag = "ps";
    else if (a.indexOf("limit ") !== -1 || b.indexOf("limit ") !== -1) tag = "limit";
    if (!tag) return null;
    var inlet = function (s) { return s.indexOf(tag + " inlet") !== -1; };
    var outlet = function (s) { return s.indexOf(tag + " outlet") !== -1; };
    var common = function (s) { return s.indexOf("c (24v") !== -1 || s === "c"; };
    var call = function (s) {
      return tag === "limit" || tag === "rollout" || tag === "ps" ? s.indexOf("w (heat") !== -1 : s.indexOf("y (cool") !== -1;
    };
    if ((inlet(a) && outlet(b)) || (outlet(a) && inlet(b))) return "27.2";
    if ((inlet(a) && common(b)) || (common(a) && inlet(b))) return "27.2";
    if ((outlet(a) && common(b)) || (common(a) && outlet(b))) return "0.0";
    if ((inlet(a) && call(b)) || (call(a) && inlet(b))) return "0.0";
    if ((outlet(a) && call(b)) || (call(a) && outlet(b))) return "27.2";
    if (tag === "ps") {
      var gvHot = function (s) { return s.indexOf("gv hot") !== -1; };
      var gvCoil = function (s) { return s.indexOf("gv coil") !== -1; };
      if ((gvHot(a) && gvCoil(b)) || (gvCoil(a) && gvHot(b))) return "0.0";
      if ((gvHot(a) && common(b)) || (common(a) && gvHot(b))) return "0.0";
      if ((gvCoil(a) && common(b)) || (common(a) && gvCoil(b))) return "0.0";
      if ((gvHot(a) && outlet(b)) || (outlet(a) && gvHot(b))) return "0.0";
      if ((gvHot(a) && inlet(b)) || (inlet(a) && gvHot(b))) return "27.2";
    }
    return null;
  }
  function paintMeter() {
    var lcd = document.getElementById("el-lcd");
    if (!lcd) return;
    var v = vacAcross(leadOf(document.getElementById("el-redn")), leadOf(document.getElementById("el-blkn")));
    if (v == null) return;
    lcd.textContent = v;
    var unit = document.getElementById("el-unit");
    var hosePair = hoseOn() && hoseVac(leadOf(document.getElementById("el-redn")), leadOf(document.getElementById("el-blkn"))) != null;
    if (unit) unit.textContent = hosePair ? "in.wc" : "VAC";
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
    if (valveOn()) return null;
    var stamped = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    if (stamped && kindOf(partName(stamped))) return stamped;
    var marked = document.querySelectorAll("#el-ladder button.el-node.open");
    for (var i = 0; i < marked.length; i++) {
      if (kindOf(partName(marked[i]))) return marked[i];
    }
    return stamped;
  }
  function addLead(split, name, title) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "el-probe el-lpc-lead";
    b.textContent = name;
    b.setAttribute("data-split-lead", name);
    b.title = title;
    b.addEventListener("click", onLead, true);
    split.appendChild(b);
  }
  function splitOpen() {
    var host = document.getElementById("el-probes");
    if (!host) return;
    var open = openBox();
    var kind = valveOn() ? "GV" : (open ? kindOf(partName(open)) : null);
    var buttons = host.querySelectorAll("button");
    var lump = null;
    var lumpName = kind === "LPC" ? "LPC switch" : kind === "HPC" ? "HPC switch" : kind === "Float" ? "Float switch" : kind === "Limit" ? "High-limit" : kind === "Rollout" ? "Rollout" : (kind === "PS" || kind === "GV") ? "Pressure switch" : "";
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
    var splitKey = (kind === "PS" && hoseOn()) ? "PSH" : kind;
    if (split && split.getAttribute("data-safety-split") === splitKey) return;
    if (split && split.parentNode) split.parentNode.removeChild(split);
    split = document.createElement("span");
    split.setAttribute("data-safety-split", splitKey);
    if (kind === "GV") {
      addLead(split, "PS inlet", "Line side of a closed pressure switch. Across to outlet is 0.0. Call is made.");
      addLead(split, "PS outlet", "Load side of a closed pressure switch. Same voltage as inlet. Do not cut the switch.");
      addLead(split, "GV hot", "Line side of the gas valve coil. 27.2 to C. Switch already closed.");
      addLead(split, "GV coil", "Other side of the gas valve coil, landed on C. 27.2 across the coil means the coil is open. Do not jump the valve.");
    } else {
      [kind + " inlet", kind + " outlet"].forEach(function (name) {
        addLead(split, name, name.indexOf("inlet") !== -1
          ? "Line side of the open " + kind + ". Click sets RED. Shift-click sets COM."
          : "Load side of the open " + kind + ". To C is 0.0. Across to inlet is 27.2.");
      });
      if (kind === "PS") {
        addLead(split, "GV hot", "Line side of the gas valve coil. Call died at the pressure switch, so this is 0.0 to C. Do not jump the switch.");
        addLead(split, "GV coil", "Other side of the gas valve coil, landed on C. 24 V across the coil only after the switch closes.");
        if (hoseOn()) {
          addLead(split, "Inducer hose", "Draft hose off the inducer barb. Click sets RED. Shift-click the trap. Wet hose kills vacuum.");
          addLead(split, "Trap", "Condensate trap on the inducer hose. Full of water. 0.0 in. w.c. to the hose. Dump it before you call the switch.");
        }
      }
    }
    if (lump && lump.nextSibling) host.insertBefore(split, lump.nextSibling);
    else host.appendChild(split);
  }
  function armValve(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    window.__gvCoil = 1;
    window.__hoseTrap = 0;
    var cards = document.querySelectorAll(".el-job-card");
    for (var i = 0; i < cards.length; i++) cards[i].classList.remove("on");
    ev.currentTarget.classList.add("on");
    var red = document.getElementById("el-redn");
    var blk = document.getElementById("el-blkn");
    if (red) red.textContent = "GV hot";
    if (blk) blk.textContent = "GV coil";
    paintMeter();
  }
  function plantTicket() {
    var jobs = document.querySelector(".el-jobs");
    if (!jobs || jobs.querySelector("[data-job='gvcoil']")) return;
    var card = document.createElement("button");
    card.type = "button";
    card.className = "el-job-card";
    card.setAttribute("data-job", "gvcoil");
    card.innerHTML = "<span class=\"el-job-time\">80s</span><strong>Valve never opens</strong><small>Gas furnace + A/C</small><p>W is calling. Inducer ran. Pressure switch closed. 24 V is across the gas valve coil and the valve stays shut. Coil is open. Do not jump the valve.</p>";
    card.addEventListener("click", armValve, true);
    var ps = jobs.querySelector("[data-job='ps']");
    if (ps && ps.nextSibling) jobs.insertBefore(card, ps.nextSibling);
    else jobs.appendChild(card);
    plantHose(jobs);
  }
  function armHose(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    window.__hoseTrap = 1;
    window.__gvCoil = 0;
    var cards = document.querySelectorAll(".el-job-card");
    for (var i = 0; i < cards.length; i++) cards[i].classList.remove("on");
    ev.currentTarget.classList.add("on");
    var red = document.getElementById("el-redn");
    var blk = document.getElementById("el-blkn");
    if (red) red.textContent = "Inducer hose";
    if (blk) blk.textContent = "Trap";
    paintMeter();
  }
  function plantHose(jobs) {
    if (!jobs || jobs.querySelector("[data-job='hosetrap']")) return;
    var card = document.createElement("button");
    card.type = "button";
    card.className = "el-job-card";
    card.setAttribute("data-job", "hosetrap");
    card.innerHTML = "<span class=\"el-job-time\">80s</span><strong>Inducer ran, switch open</strong><small>Gas furnace + A/C</small><p>W is calling. Inducer is spinning. Pressure switch stays open. Pull the hose and dump the trap before you call the switch.</p>";
    card.addEventListener("click", armHose, true);
    var ps = jobs.querySelector("[data-job='ps']");
    if (ps && ps.nextSibling) jobs.insertBefore(card, ps.nextSibling);
    else jobs.appendChild(card);
  }
  function watchJobs() {
    var cards = document.querySelectorAll(".el-job-card");
    for (var i = 0; i < cards.length; i++) {
      var job = cards[i].getAttribute("data-job");
      if (job === "gvcoil" || job === "hosetrap" || cards[i].getAttribute("data-gv-clear")) continue;
      cards[i].setAttribute("data-gv-clear", "1");
      cards[i].addEventListener("click", function () { window.__gvCoil = 0; window.__hoseTrap = 0; }, true);
    }
    plantTicket();
  }
  function stamp() {
    watchJobs();
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
    var onSwitch = /lpc|hpc|float|rollout|limit|\bps\b|pressure/i.test(redName);
    var across = kind && new RegExp(kind + " inlet", "i").test(redName) && reading === 27.2;
    var show = !!(kind && onSwitch && reading === 0 && !new RegExp(kind + " inlet", "i").test(redName));
    if (!note && lcd && lcd.parentNode) {
      note = document.createElement("p");
      note.id = "el-across-meter";
      note.className = "el-ladder-kicker";
      lcd.parentNode.appendChild(note);
    }
    if (note) {
      var onValve = /gv hot|gv coil/i.test(redName);
      var made = valveOn() && /ps inlet|ps outlet/i.test(redName) && reading === 0;
      var hosePair = hoseOn() && /inducer hose|trap/i.test(redName);
      var hoseFirst = hoseOn() && across && kind === "PS";
      note.textContent = hosePair
        ? "0.0 in. w.c. Hose is wet. Trap is full. Vacuum never reaches the switch. Dump the trap and blow the hose before you call the switch."
        : (hoseFirst
          ? "27.2 VAC across an open switch. Inducer is running. Do not call the switch. Pull the hose and dump the trap first."
          : (valveOn() && onValve
            ? "27.2 VAC across the gas valve coil. Pressure switch is closed. Coil is open. Do not jump the valve."
            : (made
              ? "0.0 VAC across the pressure switch. Contacts are closed. Call is made. Meter GV hot to GV coil."
              : (onValve
                ? "0.0 VAC at the gas valve. Call died at the pressure switch. 24 V across the coil only after the switch closes. Do not jump it to prove the valve."
                : (across
                  ? "27.2 VAC is inlet to outlet. " + kind + " contacts are open. Do not jump it."
                  : (show
                    ? "0.0 VAC is outlet to C. Probe " + kind + " inlet to " + kind + " outlet for 27.2. Do not call the contacts closed."
                    : ""))))));
      note.style.display = (show || across || onValve || made || hosePair || hoseFirst) ? "" : "none";
    }
  }
  setInterval(stamp, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
