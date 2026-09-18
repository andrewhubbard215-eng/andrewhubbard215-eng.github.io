/* Manifold-on-ports gate + piston SH chart from indoor WB / outdoor DB. */
(function () {
  "use strict";
  if (!document.getElementById("sb-tabs-css")) {
    var l = document.createElement("link");
    l.id = "sb-tabs-css";
    l.rel = "stylesheet";
    l.href = "sb-tabs.css?v=2";
    document.head.appendChild(l);
  }
  function gaugesOn() {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="gauges"]');
    if (!slot) return false;
    if (slot.querySelector("img")) return true;
    if (/\b(on|filled|has)\b/.test(slot.className)) return true;
    var t = (slot.textContent || "").replace(/\s+/g, " ").trim();
    return /manifold|gauge/i.test(t) && t.length > 8;
  }
  function coreFilled(id) {
    var el = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
    if (!el) return false;
    if (el.classList.contains("filled")) return true;
    return !!el.querySelector("img, strong, .rm");
  }
  function missingCore() {
    /* Phone-safe bay has no #sb-slots — LEFT buttons in sandbox.js own placement. */
    if (!document.getElementById("sb-slots")) return [];
    return ["compressor", "condenser", "metering", "evaporator"].filter(function (s) {
      return !coreFilled(s);
    });
  }
  function loadHealthy() {
    var healthy = document.getElementById("sb-healthy");
    if (healthy) {
      healthy.click();
      return true;
    }
    return false;
  }
  function dropGauges() {
    if (gaugesOn()) return true;
    var card = document.querySelector('#sb-bin [data-id="gauges"], .sb-part[data-id="gauges"], [data-part="gauges"]');
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="gauges"]');
    if (card && slot) {
      slot.classList.add("filled", "has");
      if (!slot.querySelector("img") && card.querySelector("img")) {
        slot.appendChild(card.querySelector("img").cloneNode(true));
      }
      slot.dataset.has = "gauges";
      return true;
    }
    var tab = document.getElementById("sb-tab-tools") || document.querySelector('[data-tab="tools"]');
    if (tab) tab.click();
    return gaugesOn();
  }
  function callOutOpenLoop() {
    var miss = missingCore();
    if (!miss.length) {
      dropGauges();
      return false;
    }
    if (loadHealthy()) {
      dropGauges();
      var st = document.getElementById("sb-status");
      if (st) st.textContent = "Four on the glass + manifold seated. Compressor can run. Read SH/SC on the strip.";
      var hint = document.getElementById("sb-hint");
      if (hint) hint.textContent = "Healthy example + gauges — loop closed.";
      return true;
    }
    var line = "Loop open — still need " + miss.join(", ") + ". Drop them LEFT, then Start compressor.";
    var st = document.getElementById("sb-status");
    if (st) st.textContent = line;
    return true;
  }
  function armRunBtn() {
    var btn = document.getElementById("sb-run");
    if (!btn || btn.dataset.openLoopArmed) return;
    btn.dataset.openLoopArmed = "1";
    btn.addEventListener(
      "click",
      function (e) {
        var howto = document.getElementById("sb-howto");
        if (howto && !howto.classList.contains("hidden")) {
          howto.classList.add("hidden");
          try { localStorage.setItem("lt-sb-howto", "1"); } catch (_) {}
        }
        if (missingCore().length) {
          e.stopImmediatePropagation();
          callOutOpenLoop();
          return;
        }
        if (!gaugesOn()) dropGauges();
      },
      true
    );
  }
  function pistonChartSH(odb, wb) {
    var sh = 20 - 0.08 * (odb - 82) - 0.55 * (wb - 63);
    return Math.max(6, Math.min(18, Math.round(sh)));
  }
  function num(id, fallback) {
    var el = document.getElementById(id);
    var n = el ? +el.value : fallback;
    return isFinite(n) ? n : fallback;
  }
  function meteringText() {
    var slot = document.querySelector('#sb-slots .sb-slot[data-slot="metering"]');
    var t = slot ? (slot.textContent || "") + " " + (slot.dataset.has || "") : "";
    var bin = document.querySelector('#sb-bin [data-id="piston"], #sb-bin [data-id="txv"], #sb-bin [data-id="eev"]');
    return t + " " + ((bin && bin.textContent) || "");
  }
  function ensureWbSlider() {
    if (document.getElementById("sb-wb")) return;
    var inLab = document.getElementById("sb-in");
    if (!inLab || !inLab.parentNode || !inLab.parentNode.parentNode) return;
    var lab = document.createElement("label");
    lab.innerHTML = 'Indoor WB °F <input id="sb-wb" type="range" min="54" max="76" value="63" /><span id="sb-wb-v">63</span>';
    inLab.parentNode.parentNode.insertBefore(lab, inLab.parentNode.nextSibling);
    var sl = document.getElementById("sb-wb");
    sl.oninput = function () {
      document.getElementById("sb-wb-v").textContent = sl.value;
    };
  }
  function ensureFormula() {
    if (document.getElementById("sb-shsc-formula")) return;
    var tgt = document.getElementById("g-tgt");
    var host = (tgt && tgt.parentNode && tgt.parentNode.parentNode) || document.getElementById("sb-status");
    if (!host || !host.parentNode) return;
    var p = document.createElement("p");
    p.id = "sb-shsc-formula";
    p.style.cssText = "margin:6px 0 0;font-size:12px;letter-spacing:.02em;opacity:.92";
    p.textContent = "SH = suction line − sat (low side) · SC = sat (high side) − liquid line. Parts stay LEFT.";
    if (tgt && tgt.parentNode && tgt.parentNode.parentNode) {
      tgt.parentNode.parentNode.appendChild(p);
    } else {
      host.parentNode.insertBefore(p, host.nextSibling);
    }
  }
  function apply() {
    armRunBtn();
    ensureWbSlider();
    ensureFormula();
    var fp = document.getElementById("sb-fp");
    var low = document.getElementById("g-plow");
    if (!fp || !low) return;
    var odb = num("sb-out", 95);
    var wb = num("sb-wb", 63);
    var chart = pistonChartSH(odb, wb);
    var tgt = document.getElementById("g-tgt");
    var sysSel = document.getElementById("sb-system");
    var opt = sysSel && sysSel.options[sysSel.selectedIndex];
    var banner =
      ((document.getElementById("sb-sysbanner") || {}).textContent || "") +
      " " +
      ((document.getElementById("sb-sys") || {}).textContent || "") +
      " " +
      ((document.getElementById("sb-sysinfo") || {}).textContent || "") +
      " " +
      ((document.getElementById("sb-status") || {}).textContent || "") +
      " " +
      meteringText();
    var label = ((opt && opt.textContent) || "") + " " + banner;
    var kind = window.LtMeteringKind;
    var piston = kind === "orifice" || /piston|orifice|cap-?tube|fixed/i.test(label);
    var eev = kind === "eev" || /eev|inverter|greenspeed|communicating/i.test(label);
    if (tgt && piston) {
      tgt.textContent = "SH tgt " + chart + "° · SC check · WB " + wb + " / ODB " + odb;
    } else if (tgt) {
      var cur = (tgt.textContent || "").trim();
      if (!cur || cur === "—" || cur === "-") tgt.textContent = "SC tgt 10° · SH check";
    }
    var method = document.getElementById("g-method");
    if (!method && tgt && tgt.parentNode && tgt.parentNode.parentNode) {
      var row = document.createElement("div");
      row.innerHTML = "<span>Charge method</span><b id=\"g-method\">—</b>";
      tgt.parentNode.parentNode.insertBefore(row, tgt.parentNode.nextSibling);
      method = row.querySelector("#g-method");
    }
    if (method) {
      method.textContent = eev
        ? "EEV · weigh-in, SH is a check"
        : piston
          ? "Piston · charge by SH · chart " + chart + "° (hotter ODB / wetter WB = lower SH)"
          : "TXV · charge by SC · SH is a check";
    }
    if (gaugesOn()) return;
    if (low.textContent === "—" || low.textContent === "NO SET") {
      low.textContent = "NO SET";
    }
    var hi = document.getElementById("g-phigh");
    if (hi && (hi.textContent === "—" || hi.textContent === "NO SET")) hi.textContent = "NO SET";
    fp.textContent =
      "HUB: no manifold, no numbers. Blue on suction, red on liquid. Drop the gauge set LEFT onto Gauges — then the glass reads.";
  }
  setInterval(apply, 350);
})();
