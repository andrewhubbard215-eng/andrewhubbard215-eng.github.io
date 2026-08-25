/* Lincoln Tech HVAC Allstars — Electrical sim + DMM */
(function (global) {
  "use strict";

  const PARTS = [
    { id: "breaker", name: "2-pole breaker", group: "line", img: null, icon: "⬛", slot: "breaker", desc: "L1 / L2 feed · 240 VAC" },
    { id: "disconnect", name: "Fused disconnect", group: "line", img: "parts/disconnect.png", icon: "🔌", slot: "disconnect", desc: "Outdoor disconnect" },
    { id: "ground", name: "Equipment ground", group: "line", img: null, icon: "⏚", slot: "ground", desc: "Green / bare to chassis" },
    { id: "contactor", name: "2-pole contactor", group: "line", img: "parts/contactor.png", icon: "🧲", slot: "contactor", desc: "24V coil · T1/T2 to loads" },
    { id: "capacitor", name: "Dual run capacitor", group: "line", img: "parts/capacitor.png", icon: "🔋", slot: "capacitor", desc: "HERM / FAN / C" },
    { id: "hardstart", name: "Hard-start kit", group: "line", img: null, icon: "⚡", slot: "hardstart", desc: "Start cap + potential relay" },
    { id: "transformer", name: "24V transformer", group: "control", img: "parts/transformer.png", icon: "🔁", slot: "transformer", desc: "Primary 240 · secondary R/C" },
    { id: "fuse", name: "3A control fuse", group: "control", img: "parts/fuse.png", icon: "🧯", slot: "fuse", desc: "R leg protection" },
    { id: "thermostat", name: "Thermostat", group: "control", img: "parts/thermostat.png", icon: "🌡️", slot: "thermostat", desc: "R Y G W C" },
    { id: "hpc", name: "High-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬆️", slot: "hpc", desc: "Opens on high head" },
    { id: "lpc", name: "Low-pressure switch", group: "control", img: "parts/pressuresw.png", icon: "⬇️", slot: "lpc", desc: "Opens on low suction" },
    { id: "float", name: "Condensate float", group: "control", img: null, icon: "💧", slot: "float", desc: "Breaks Y or R on high water" },
    { id: "relay", name: "Blower relay", group: "control", img: "parts/relay.png", icon: "📦", slot: "relay", desc: "G call · indoor fan" },
    { id: "solenoid", name: "Reversing valve solenoid", group: "control", img: null, icon: "🧲", slot: "solenoid", desc: "Heat-pump O/B" },
    { id: "compressor", name: "Compressor (C/R/S)", group: "loads", img: "parts/compressor.png", icon: "🌀", slot: "compressor", desc: "Common / run / start" },
    { id: "fan", name: "Condenser fan motor", group: "loads", img: "parts/fanmotor.png", icon: "🌬️", slot: "fan", desc: "PSC outdoor fan" },
    { id: "heater", name: "Crankcase heater", group: "loads", img: null, icon: "🔥", slot: "heater", desc: "Off-cycle heat" },
    { id: "dmm", name: "Digital multimeter", group: "tools", img: "parts/dmm.png", icon: "📟", slot: null, desc: "Click terminals to probe" },
  ];

  const SLOTS = [
    { id: "breaker", x: 6, y: 8, w: 18, label: "Breaker" },
    { id: "disconnect", x: 28, y: 8, w: 18, label: "Disconnect" },
    { id: "ground", x: 50, y: 8, w: 14, label: "Ground" },
    { id: "transformer", x: 68, y: 8, w: 26, label: "24V transformer" },
    { id: "contactor", x: 6, y: 38, w: 22, label: "Contactor" },
    { id: "capacitor", x: 32, y: 38, w: 20, label: "Run cap" },
    { id: "hardstart", x: 56, y: 38, w: 16, label: "Hard start" },
    { id: "fuse", x: 76, y: 38, w: 18, label: "3A fuse" },
    { id: "compressor", x: 6, y: 68, w: 22, label: "Compressor" },
    { id: "fan", x: 32, y: 68, w: 20, label: "OD fan" },
    { id: "heater", x: 56, y: 68, w: 16, label: "CCH" },
    { id: "thermostat", x: 76, y: 68, w: 18, label: "Stat" },
    { id: "hpc", x: 6, y: 90, w: 18, label: "HPC" },
    { id: "lpc", x: 28, y: 90, w: 18, label: "LPC" },
    { id: "float", x: 50, y: 90, w: 18, label: "Float" },
    { id: "relay", x: 70, y: 90, w: 12, label: "Relay" },
    { id: "solenoid", x: 84, y: 90, w: 12, label: "RV" },
  ];

  const PROBES = [
    { id: "l1", label: "L1 (line)", group: "line" },
    { id: "l2", label: "L2 (line)", group: "line" },
    { id: "gnd", label: "Ground", group: "line" },
    { id: "load1", label: "Disconnect load L1", group: "line" },
    { id: "load2", label: "Disconnect load L2", group: "line" },
    { id: "t1", label: "Contactor T1", group: "line" },
    { id: "t2", label: "Contactor T2", group: "line" },
    { id: "compc", label: "Compressor C", group: "comp" },
    { id: "compr", label: "Compressor R (run)", group: "comp" },
    { id: "comps", label: "Compressor S (start)", group: "comp" },
    { id: "caph", label: "Cap HERM", group: "cap" },
    { id: "capf", label: "Cap FAN", group: "cap" },
    { id: "capc", label: "Cap C", group: "cap" },
    { id: "r", label: "R (24V hot)", group: "24" },
    { id: "c24", label: "C (24V common)", group: "24" },
    { id: "y", label: "Y (cool call)", group: "24" },
    { id: "g", label: "G (fan call)", group: "24" },
    { id: "coil", label: "Contactor coil", group: "24" },
    { id: "hpc", label: "HPC switch", group: "24" },
    { id: "fanlead", label: "OD fan lead", group: "line" },
  ];

  let host, onXp;
  let placed = {};
  let callCool = false;
  let callFan = false;
  let fault = "none";
  let mode = "vac";
  let red = "l1";
  let black = "l2";
  let fusedBlown = false;

  function has(id) { return !!placed[id]; }

  function circuit() {
    const disc = has("disconnect") && fault !== "open_disc";
    const brk = has("breaker");
    const line = brk;
    const loadHot = line && disc;
    const xfmr = loadHot && has("transformer") && fault !== "no_xfmr";
    const fuseOk = has("fuse") && !fusedBlown && fault !== "blown_fuse";
    const rHot = xfmr && fuseOk;
    const y = rHot && has("thermostat") && callCool;
    const g = rHot && has("thermostat") && callFan;
    const hpc = has("hpc") && fault !== "open_hpc";
    const lpc = has("lpc") && fault !== "open_lpc";
    const flt = has("float") && fault !== "float_open";
    const path = y && hpc && lpc && flt;
    const coil = path && has("contactor") && fault !== "open_coil";
    const pulled = coil;
    const cap = has("capacitor") && fault !== "open_cap";
    const grounded = fault === "grounded";
    const compPower = pulled && loadHot && has("compressor") && !grounded;
    const compRun = compPower && cap;
    const fanRun = pulled && loadHot && has("fan") && cap;
    const heater = has("heater") && loadHot && !pulled;
    const rla = compRun ? 13.4 : 0;
    const lraAttempt = compPower && !cap ? 0.2 : 0;
    return {
      line, disc, loadHot, xfmr, rHot, y, g, hpc, lpc, flt, path, coil, pulled,
      cap, grounded, compPower, compRun, fanRun, heater, rla, lraAttempt, fuseOk,
    };
  }

  function vacBetween(a, b, c) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("l1", "l2") && c.line) return 241.0;
    if ((pair("l1", "gnd") || pair("l2", "gnd")) && c.line) return 120.6;
    if (pair("load1", "load2")) return c.loadHot ? 240.4 : 0;
    if (pair("t1", "t2")) return c.pulled && c.loadHot ? 239.8 : 0;
    if (pair("r", "c24")) return c.rHot ? 27.2 : 0;
    if (pair("y", "c24")) return c.y ? 26.8 : 0;
    if (pair("g", "c24")) return c.g ? 26.9 : 0;
    if (pair("coil", "c24")) return c.coil ? 26.4 : 0;
    if (pair("hpc", "c24")) return c.y && c.hpc ? 26.5 : 0;
    if (pair("compr", "compc") || pair("t1", "compc")) return c.compPower ? 239.2 : 0;
    if (pair("fanlead", "t2")) return c.fanRun ? 238.5 : 0;
    if (pair("load1", "l1")) return c.disc ? 0.04 : (c.line ? 240.2 : 0);
    return 0;
  }

  function ohmsBetween(a, b, c) {
    if (c.loadHot || c.rHot) return null; // live — refuse
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (pair("compr", "compc") && has("compressor")) return c.grounded ? 0.2 : 1.8;
    if (pair("comps", "compc") && has("compressor")) return c.grounded ? 0.2 : 2.6;
    if (pair("compr", "comps") && has("compressor")) return 4.3;
    if (pair("compc", "gnd") && has("compressor")) return c.grounded ? 0.4 : 9999;
    if (pair("caph", "capc") && has("capacitor")) return fault === "open_cap" ? 9999 : 0.8;
    if (pair("capf", "capc") && has("capacitor")) return 2.1;
    if (pair("coil", "c24") && has("contactor")) return fault === "open_coil" ? 9999 : 18.4;
    if (pair("hpc", "y") && has("hpc")) return fault === "open_hpc" ? 9999 : 0.3;
    return 9999;
  }

  function capBetween(a, b) {
    const pair = (x, y) => (a === x && b === y) || (a === y && b === x);
    if (!has("capacitor") || fault === "open_cap") return 0;
    if (pair("caph", "capc")) return 35.2;
    if (pair("capf", "capc")) return 5.1;
    if (pair("caph", "capf")) return 40.0;
    return 0;
  }

  function ampAt(probe, c) {
    if (probe === "compr" || probe === "t1" || probe === "compc") {
      if (c.compRun) return 13.4;
      if (c.compPower && !c.cap) return 0.3;
      return 0;
    }
    if (probe === "fanlead") return c.fanRun ? 1.1 : 0;
    if (probe === "l1" || probe === "load1") return (c.compRun ? 13.4 : 0) + (c.fanRun ? 1.1 : 0);
    return 0;
  }

  function readMeter() {
    const c = circuit();
    const note = [];
    if (mode === "ohm" || mode === "cont" || mode === "cap") {
      if (c.loadHot || c.rHot) {
        fusedBlown = true;
        return { val: "OL", unit: "LIVE", note: "You just ohmed a live circuit. Control fuse is toast. Kill power, replace the 3A, try again." };
      }
    }
    if (mode === "vac") {
      const v = vacBetween(red, black, c);
      return { val: v.toFixed(1), unit: "VAC", note: v > 200 ? "Line voltage." : v > 20 ? "Control voltage." : "Dead — check disconnect, fuse, transformer, or call." };
    }
    if (mode === "aac") {
      const a = ampAt(red, c);
      return { val: a.toFixed(1), unit: "A", note: a > 10 ? "RLA in range for a 3-ton." : a > 0.2 && !c.cap ? "Hum, no start — suspect run cap." : "Clamp one hot leg only." };
    }
    if (mode === "ohm") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "Ω", note: "Lock it out first." };
      if (r >= 9999) return { val: "OL", unit: "Ω", note: "Open circuit." };
      if (r < 1 && fault === "grounded") return { val: r.toFixed(1), unit: "Ω", note: "Winding to ground — bad compressor." };
      return { val: r.toFixed(1), unit: "Ω", note: "Power off reading." };
    }
    if (mode === "cont") {
      const r = ohmsBetween(red, black, c);
      if (r == null) return { val: "OL", unit: "CONT", note: "Lockout first." };
      return { val: r < 50 ? "BEEP" : "OL", unit: "CONT", note: r < 50 ? "Path closed." : "Open." };
    }
    if (mode === "cap") {
      const u = capBetween(red, black);
      return { val: u ? u.toFixed(1) : "OL", unit: "µF", note: u ? "Discharge the cap, then read HERM–C or FAN–C." : "No cap in circuit or open." };
    }
    return { val: "—. —", unit: "", note: "" };
  }

  function statusLine(c) {
    if (!has("breaker")) return "Drop the 2-pole breaker — nothing is live yet.";
    if (!has("disconnect")) return "Line is at the disconnect. Drop and close it before load.";
    if (!has("transformer")) return "No 24V. Drop the control transformer.";
    if (!has("fuse") || fusedBlown) return "Control fuse missing or blown. Replace the 3A on R.";
    if (!has("thermostat")) return "24V is up. Drop a thermostat and call Y.";
    if (!callCool) return "Stat is in. Turn on COOL (Y) to pull the contactor in.";
    if (!has("hpc") || !has("lpc") || !has("float")) return "Y is calling. Series safety: HPC, LPC, and float must be in.";
    if (!has("contactor")) return "Safeties closed. Drop the contactor.";
    if (!has("capacitor")) return "Contactor will pull in, compressor will hum. Drop the dual run cap.";
    if (!has("compressor")) return "Power path is ready. Drop the compressor.";
    if (c.compRun) return "Legal start — compressor and OD fan running. Probe RLA and 24V to prove it.";
    if (c.grounded) return "Shorted winding — meter C to ground. Bad compressor, not a charge problem.";
    if (c.compPower && !c.cap) return "Hum, no start. Contactor is in — discharge the cap and read µF HERM–C.";
    if (fault === "open_coil") return "Y is through the safeties but the coil is open. Contactor never pulls in.";
    if (c.y && !c.path) return "Y is calling but a safety is open (HPC / LPC / float). Meter the 24V path.";
    if (c.pulled && !c.loadHot) return "Coil in, no 240 on T1/T2. Check disconnect and breaker.";
    if (c.rHot && !c.y) return "24V is up. Turn on Y — Cool call to pull the contactor in.";
    return "Circuit incomplete — finish line, control, and loads.";
  }

  function thumb(p) {
    if (p.img) return '<img class="part-img" src="' + p.img + '" alt="" draggable="false" />';
    return '<span class="ico">' + p.icon + "</span>";
  }

  function renderPalette(tab) {
    const box = host.querySelector("#el-items");
    if (!box) return;
    box.innerHTML = "";
    PARTS.filter((p) => p.group === tab).forEach((p) => {
      const el = document.createElement("div");
      el.className = "sb-item";
      el.draggable = !!p.slot;
      el.dataset.id = p.id;
      el.innerHTML = thumb(p) + "<div><strong>" + p.name + "</strong><small>" + p.desc + "</small></div>";
      el.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", p.id);
        e.dataTransfer.effectAllowed = "copy";
        if (window.LtDrag && window.LtDrag.setHtml5Image) {
          window.LtDrag.setHtml5Image(e, { html: thumb(p), label: p.name });
        }
      });
      if (window.LtDrag && p.slot) {
        window.LtDrag.bindSource(el, {
          id: p.id,
          html: thumb(p) + "<strong>" + p.name + "</strong>",
          slotSelector: "#el-board .el-slot",
          onDrop(slotId, id) {
            place(slotId, id);
          },
        });
      }
      el.onclick = () => {
        if (p.slot && !placed[p.slot]) place(p.slot, p.id);
      };
      box.appendChild(el);
    });
  }

  function place(slot, id) {
    const def = PARTS.find((p) => p.id === id);
    if (!def || def.slot !== slot) return;
    placed[slot] = id;
    refreshSlots();
    paintMeter();
    if (onXp && Object.keys(placed).length === 8) onXp(20);
  }

  function refreshSlots() {
    host.querySelectorAll(".el-slot").forEach((el) => {
      const id = el.dataset.slot;
      const cid = placed[id];
      el.classList.toggle("filled", !!cid);
      if (cid) {
        const def = PARTS.find((p) => p.id === cid);
        el.innerHTML = thumb(def) + "<strong>" + def.name + "</strong><button class='rm' data-rm='" + id + "'>×</button>";
      } else {
        const s = SLOTS.find((x) => x.id === id);
        el.innerHTML = "<span class='empty'>Drop " + s.label + "</span>";
      }
    });
    host.querySelectorAll(".rm").forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        delete placed[b.dataset.rm];
        refreshSlots();
        paintMeter();
      };
    });
  }

  function paintMeter() {
    const c = circuit();
    const r = readMeter();
    host.querySelector("#el-lcd").textContent = r.val;
    host.querySelector("#el-unit").textContent = r.unit;
    host.querySelector("#el-note").textContent = r.note;
    host.querySelector("#el-status").textContent = statusLine(c);
    host.querySelector("#el-run").classList.toggle("on", c.compRun);
    host.querySelector("#el-24").classList.toggle("on", c.rHot);
    host.querySelector("#el-coil").classList.toggle("on", c.pulled);
    host.querySelector("#el-y").classList.toggle("on", c.y);
    const chips = [];
    chips.push(c.loadHot ? "240 VAC load" : "load dead");
    chips.push(c.rHot ? "27 VAC R–C" : "no 24V");
    chips.push(c.pulled ? "contactor IN" : "contactor OUT");
    chips.push(c.compRun ? "comp RUN " + c.rla.toFixed(1) + " A" : "comp OFF");
    host.querySelector("#el-chips").textContent = chips.join(" · ");
    host.querySelector("#el-redn").textContent = PROBES.find((p) => p.id === red).label;
    host.querySelector("#el-blkn").textContent = PROBES.find((p) => p.id === black).label;
  }

  function build() {
    host.innerHTML = `
      <div class="el-layout">
        <aside class="sb-palette">
          <div class="brand-bar" style="justify-content:flex-start;margin-bottom:8px">
            <div class="brand-mark" style="width:28px;height:28px;font-size:13px">LT</div>
            <div class="brand-word"><strong style="font-size:13px">LINCOLN TECH</strong><span>Electrical sim · Professor HUB</span></div>
          </div>
          <p class="eyebrow">Component tray</p>
          <div class="sb-tabs">
            <button class="sb-tab active" data-tab="line">Line 240</button>
            <button class="sb-tab" data-tab="control">Control 24</button>
            <button class="sb-tab" data-tab="loads">Loads</button>
            <button class="sb-tab" data-tab="tools">Tools</button>
          </div>
          <div id="el-items" class="sb-items"></div>
          <p class="sb-hint">Drag every device onto the schematic. Probe with the DMM. Never ohm a live circuit.</p>
          <div class="hub-chip" style="margin-top:10px;max-width:none">
            <img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" />
            <div><strong>Professor HUB</strong><p>L1–L2 first. Then R–C. Then Y through the safeties. Then clamp amps.</p></div>
          </div>
        </aside>
        <main class="el-main">
          <header class="sb-toolbar">
            <label>Fault
              <select id="el-fault">
                <option value="none">Healthy circuit</option>
                <option value="open_cap">Open run capacitor</option>
                <option value="open_coil">Open contactor coil</option>
                <option value="open_hpc">Open high-pressure switch</option>
                <option value="open_lpc">Open low-pressure switch</option>
                <option value="float_open">Float switch open (full pan)</option>
                <option value="open_disc">Disconnect open</option>
                <option value="no_xfmr">Open transformer</option>
                <option value="blown_fuse">Blown 3A fuse</option>
                <option value="grounded">Compressor winding to ground</option>
              </select>
            </label>
            <label class="el-tog"><input type="checkbox" id="el-cool" /> Y — Cool call</label>
            <label class="el-tog"><input type="checkbox" id="el-fan" /> G — Indoor fan</label>
            <button class="btn" id="el-kit">Load split-AC kit</button>
            <button class="btn" id="el-clear">Clear</button>
            <button class="btn" id="el-hub">Shop floor</button>
          </header>
          <div class="el-board" id="el-board"></div>
          <p class="el-status" id="el-status"></p>
          <p class="el-chips" id="el-chips"></p>
        </main>
        <aside class="el-meter">
          <p class="eyebrow">Digital multimeter</p>
          <img src="parts/dmm.png" alt="DMM" class="el-dmm-img" />
          <div class="dmm-lcd el-lcd"><span id="el-lcd">241.0</span><small id="el-unit">VAC</small></div>
          <div class="el-leads">
            <div><i class="red"></i> RED <b id="el-redn">L1 (line)</b></div>
            <div><i class="blk"></i> COM <b id="el-blkn">L2 (line)</b></div>
          </div>
          <label>Function
            <select id="el-mode">
              <option value="vac">VAC</option>
              <option value="aac">AAC (clamp)</option>
              <option value="ohm">OHMS (lockout)</option>
              <option value="cont">Continuity</option>
              <option value="cap">CAPACITANCE µF</option>
            </select>
          </label>
          <p class="eyebrow" style="margin-top:10px">Probe points — click sets RED, shift-click sets COM</p>
          <div id="el-probes" class="el-probes"></div>
          <p class="dmm-note" id="el-note"></p>
          <div class="el-lamps">
            <span id="el-24">24V</span>
            <span id="el-y">Y</span>
            <span id="el-coil">COIL</span>
            <span id="el-run">COMP</span>
          </div>
        </aside>
      </div>`;
    const board = host.querySelector("#el-board");
    SLOTS.forEach((s) => {
      const el = document.createElement("div");
      el.className = "el-slot";
      el.dataset.slot = s.id;
      el.style.left = s.x + "%";
      el.style.top = s.y + "%";
      el.style.width = s.w + "%";
      el.addEventListener("dragover", (e) => { e.preventDefault(); el.classList.add("over"); });
      el.addEventListener("dragleave", () => el.classList.remove("over"));
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        el.classList.remove("over");
        place(s.id, e.dataTransfer.getData("text/plain"));
      });
      board.appendChild(el);
    });
    const pb = host.querySelector("#el-probes");
    PROBES.forEach((p) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "el-probe";
      b.textContent = p.label;
      b.onclick = (e) => {
        if (e.shiftKey) black = p.id;
        else red = p.id;
        paintMeter();
      };
      pb.appendChild(b);
    });
    refreshSlots();
    renderPalette("line");
    paintMeter();
  }

  function wire() {
    host.querySelectorAll(".sb-tab").forEach((t) => {
      t.onclick = () => {
        host.querySelectorAll(".sb-tab").forEach((x) => x.classList.remove("active"));
        t.classList.add("active");
        renderPalette(t.dataset.tab);
      };
    });
    host.querySelector("#el-mode").onchange = (e) => { mode = e.target.value; paintMeter(); };
    host.querySelector("#el-fault").onchange = (e) => { fault = e.target.value; fusedBlown = fault === "blown_fuse"; paintMeter(); };
    host.querySelector("#el-cool").onchange = (e) => { callCool = e.target.checked; paintMeter(); };
    host.querySelector("#el-fan").onchange = (e) => { callFan = e.target.checked; paintMeter(); };
    host.querySelector("#el-clear").onclick = () => {
      placed = {}; callCool = false; callFan = false; fusedBlown = false; fault = "none";
      host.querySelector("#el-cool").checked = false;
      host.querySelector("#el-fan").checked = false;
      host.querySelector("#el-fault").value = "none";
      refreshSlots(); paintMeter();
    };
    host.querySelector("#el-kit").onclick = () => {
      ["breaker","disconnect","ground","transformer","fuse","contactor","capacitor","compressor","fan","thermostat","hpc","lpc","float"].forEach((id) => {
        placed[id] = id;
      });
      refreshSlots();
      paintMeter();
      if (onXp) onXp(15);
    };
  }

  function start(root, opts) {
    host = root;
    onXp = opts && opts.onXp;
    placed = {};
    callCool = false;
    callFan = false;
    fault = "none";
    fusedBlown = false;
    mode = "vac";
    red = "l1";
    black = "l2";
    build();
    wire();
    return {
      stop() {},
      getHubBtn() { return host.querySelector("#el-hub"); },
    };
  }

  global.ElectricalLab = { start };
})(window);
