/* Open safety chip. LPC inlet and outlet are separate probe points. */
(function () {
  function partName(box) {
    if (!box) return "";
    return String(box.getAttribute("aria-label") || box.dataset.part || box.dataset.node || "").replace(/\s+/g, " ").trim();
  }
  function isSafety(who) {
    return /float|hpc|lpc|high-pressure|low-pressure|high-limit|\blimit\b/i.test(who);
  }
  function isLpc(who) {
    return /lpc|low-pressure/i.test(who);
  }
  function leadOf(el) {
    return el ? String(el.textContent || "") : "";
  }
  function vacAcross(red, com) {
    var a = red.toLowerCase();
    var b = com.toLowerCase();
    var inlet = function (s) { return s.indexOf("lpc inlet") !== -1; };
    var outlet = function (s) { return s.indexOf("lpc outlet") !== -1; };
    var common = function (s) { return s.indexOf("c (24v") !== -1 || s === "c"; };
    var y = function (s) { return s.indexOf("y (cool") !== -1; };
    if ((inlet(a) && outlet(b)) || (outlet(a) && inlet(b))) return "27.2";
    if ((inlet(a) && common(b)) || (common(a) && inlet(b))) return "27.2";
    if ((outlet(a) && common(b)) || (common(a) && outlet(b))) return "0.0";
    if ((inlet(a) && y(b)) || (y(a) && inlet(b))) return "0.0";
    if ((outlet(a) && y(b)) || (y(a) && outlet(b))) return "27.2";
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
    var name = ev.currentTarget.getAttribute("data-lpc-lead");
    var slot = ev.shiftKey ? document.getElementById("el-blkn") : document.getElementById("el-redn");
    if (slot) slot.textContent = name;
    paintMeter();
  }
  function splitLpc() {
    var host = document.getElementById("el-probes");
    if (!host) return;
    var open = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    var lpcOpen = !!(open && isLpc(partName(open)));
    var buttons = host.querySelectorAll("button");
    var lump = null;
    for (var i = 0; i < buttons.length; i++) {
      if ((buttons[i].textContent || "").replace(/\s+/g, " ").trim() === "LPC switch") lump = buttons[i];
    }
    var split = host.querySelector("[data-lpc-split]");
    if (!lpcOpen) {
      if (split && split.parentNode) split.parentNode.removeChild(split);
      if (lump) lump.style.display = "";
      return;
    }
    if (lump) lump.style.display = "none";
    if (split) return;
    split = document.createElement("span");
    split.setAttribute("data-lpc-split", "1");
    ["LPC inlet", "LPC outlet"].forEach(function (name) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "el-probe el-lpc-lead";
      b.textContent = name;
      b.setAttribute("data-lpc-lead", name);
      b.title = name === "LPC inlet"
        ? "Y side of the open LPC. Click sets RED. Shift-click sets COM."
        : "Outlet of the open LPC. To C is 0.0. Across to inlet is 27.2.";
      b.addEventListener("click", onLead, true);
      split.appendChild(b);
    });
    if (lump && lump.nextSibling) host.insertBefore(split, lump.nextSibling);
    else host.appendChild(split);
  }
  function stamp() {
    var n = document.querySelector("#el-ladder button.el-node[data-open-land='1']");
    var chips = document.querySelectorAll(".el-across-chip");
    for (var i = 0; i < chips.length; i++) {
      if (!n || chips[i].parentNode !== n) chips[i].parentNode.removeChild(chips[i]);
    }
    if (n) {
      var who = partName(n);
      if (isSafety(who) && !n.querySelector(".el-across-chip")) {
        var chip = document.createElement("small");
        chip.className = "el-across-chip";
        chip.textContent = "~27 V across";
        chip.title = "RED on the inlet, COM on the outlet. Outlet to C is 0.0 V. 0 V across means the contacts are closed.";
        n.appendChild(chip);
      }
    }
    splitLpc();
    var lcd = document.getElementById("el-lcd");
    var red = document.getElementById("el-redn");
    var note = document.getElementById("el-across-meter");
    var redName = red ? red.textContent : "";
    var reading = lcd ? parseFloat(lcd.textContent) : NaN;
    var onSwitch = /lpc|hpc|float|limit|pressure/i.test(redName);
    var across = /lpc inlet/i.test(redName) && reading === 27.2;
    var show = !!(n && onSwitch && reading === 0 && !/lpc inlet/i.test(redName));
    if (!note && lcd && lcd.parentNode) {
      note = document.createElement("p");
      note.id = "el-across-meter";
      note.className = "el-ladder-kicker";
      lcd.parentNode.appendChild(note);
    }
    if (note) {
      note.textContent = across
        ? "27.2 VAC is inlet to outlet. LPC contacts are open. Do not add gas on a frozen coil."
        : (show
          ? "0.0 VAC is outlet to C. Probe LPC inlet to LPC outlet for 27.2. Do not call the contacts closed."
          : "");
      note.style.display = (show || across) ? "" : "none";
    }
  }
  setInterval(stamp, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", stamp);
  else stamp();
})();
