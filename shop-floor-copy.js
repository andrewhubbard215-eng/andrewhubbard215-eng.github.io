/* Shop-floor copy override v62 — piston charges by target SH, TXV by SC */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W \u00b7 inducer \u00b7 PS \u00b7 ignitor \u00b7 valve \u00b7 flame \u00b7 blower";
      }
      if (/Plywood/i.test(t) && /catalog/i.test(t) && /filer/i.test(t)) {
        el.textContent = "Plywood wall \u00b7 shop catalog \u00b7 90-min filler";
      }
    });
  }
  function faultChipFit() {
    document.querySelectorAll("#screen-sandbox button, .sb-fault-chip, [data-fault]").forEach(function (el) {
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^TXV bulb$/i.test(t)) el.textContent = "TXV strap";
      if (/^Air in system$/i.test(t)) el.textContent = "Noncondensable";
    });
  }
  function lockerCard() {
    var cash = document.getElementById("hub-cash");
    var jobs = document.getElementById("hub-jobs");
    var xp = document.getElementById("hub-xp");
    if (cash) {
      var raw = cash.textContent || "";
      if (/\$/.test(raw) || /coin|cash/i.test(raw)) {
        var n = raw.replace(/[^0-9]/g, "") || "0";
        cash.textContent = n + " sheets";
      }
    }
    if (jobs && /jobs/i.test(jobs.textContent || "")) {
      jobs.textContent = (jobs.textContent || "").replace(/jobs/ig, "calls");
    }
    if (xp) {
      var xt = xp.textContent || "";
      if (/XP/i.test(xt)) xt = xt.replace(/XP/ig, "hours");
      var m = xt.match(/(\d+)\s*hours?/i);
      if (m) {
        var n = parseInt(m[1], 10);
        xt = n + (n === 1 ? " hour" : " hours");
      }
      xp.textContent = xt;
    }
  }
  function screenOn(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    if (el.classList.contains("active") || el.classList.contains("screen-on")) return true;
    if (el.offsetParent) return true;
    return false;
  }
  var TIP_VER = "v3.5.396";
  function bayStrip() {
    var strip = document.querySelector(".version-strip");
    if (!strip) return;
    var bay = "shop floor";
    var tabSat = document.querySelector(".el-tab.active, .sat-tab.active, [data-el-tab].active");
    var tabTxt = ((tabSat && tabSat.textContent) || "").toLowerCase();
    var lite = document.querySelector(".el-lite-head, .el-lite-panel h2");
    var liteTxt = ((lite && lite.textContent) || "").toLowerCase();
    var root = document.getElementById("electrical-root");
    var lines = ((root && root.innerText) || "").split("\n").map(function (s) { return s.trim().toLowerCase(); }).filter(Boolean);
    var title = "";
    for (var i = 0; i < lines.length && i < 8; i++) {
      if (/saturday|callback|no-cool|land lugs|l1 line|follow the call|ladder/.test(lines[i])) { title = lines[i]; break; }
    }
    if (screenOn("screen-electrical")) {
      if (/saturday|callback|no-cool/.test(title) || /saturday|callback/.test(tabTxt) || /saturday|callback|no-cool/.test(liteTxt) || document.querySelector(".sat-sheet, #sat-root, [data-mode='defusal'].active"))
        bay = "saturday callback";
      else if (/land lugs|l1 line/.test(title) || /lug|land/.test(tabTxt) || /land lugs|l1 line/.test(liteTxt)) bay = "land lugs";
      else bay = "ladder";
    } else if (screenOn("screen-sandbox")) bay = "sandbox";
    else if (screenOn("screen-quiz")) bay = "exam";
    else if (screenOn("screen-minisplit")) bay = "mini-split";
    else if (screenOn("screen-service")) bay = "service calls";
    else if (screenOn("screen-truck-pouch")) bay = "on the job";
    else if (screenOn("screen-film")) bay = "component film";
    else if (screenOn("screen-epa608")) bay = "epa 608";
    else if (screenOn("screen-shoplabs")) bay = "lab packets";
    else if (screenOn("screen-commandments")) bay = "commandments";
    else if (screenOn("screen-rapture")) bay = "hvac jesus";
    else if (document.getElementById("sb-run") && screenOn("screen-sandbox")) bay = "sandbox";
    strip.textContent = "HVAC Allstars - " + TIP_VER + " - " + bay;
  }
  function partsStillOnBench() {
    var yell = document.getElementById("sb-parts-yell");
    if (yell && yell.parentNode && /Compressor stays off/i.test(yell.textContent || "")) return true;
    var need = ["compressor", "condenser", "metering", "evaporator"];
    var slots = document.querySelectorAll("#sb-slots .sb-slot[data-slot]");
    if (slots.length) {
      return need.some(function (id) {
        var sl = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
        return !sl || !(sl.classList.contains("filled") || sl.querySelector("img, strong, .rm"));
      });
    }
    /* No #sb-slots (diamond pads): the rail part buttons carry the seated state. */
    return need.some(function (id) {
      var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
      return !!part && !(part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true");
    });
  }
  function lockChargeUntilSeated() {
    var chg = document.getElementById("sb-charge");
    if (!chg) return;
    var left = partsStillOnBench();
    if (left) {
      chg.disabled = true;
      chg.setAttribute("title", "Loop open. Seat 4 LEFT before you weigh charge.");
      var cap = document.getElementById("sb-chg-v-cap");
      if (cap && !/SEAT FIRST/i.test(cap.textContent || "")) cap.textContent = "Charge (seat first)";
    } else {
      chg.disabled = false;
      chg.removeAttribute("title");
      var cap2 = document.getElementById("sb-chg-v-cap");
      if (cap2 && /seat first/i.test(cap2.textContent || "")) cap2.textContent = "Charge";
    }
  }
  function partsLeftCompressorBtn() {
    var btn = document.getElementById("sb-run");
    if (!btn) return;
    var t = btn.textContent || "";
    if (/Stop compressor/i.test(t)) return;
    if (/Contactor open/i.test(t)) return;
    var left = partsStillOnBench();
    if (left) {
      if (!/Seat parts first/i.test(t) && !/Seat 4 LEFT/i.test(t)) btn.textContent = "Seat 4 LEFT first";
    } else if (/Seat parts first/i.test(t) || /Seat 4 LEFT/i.test(t) || !/Start compressor/i.test(t)) {
      if (!/Start compressor/i.test(t)) btn.textContent = "Start compressor";
    }
  }
  function compressorRunning() {
    var btn = document.getElementById("sb-run");
    return !!(btn && /Stop compressor/i.test(btn.textContent || ""));
  }
  function standingNotDiagnosis() {
    var line = "Standing P is equalized \u2014 not a diagnosis. Seat LEFT, start compressor, then read live SH/SC.";
    if (compressorRunning()) return;
    document.querySelectorAll("#sb-status, #sb-ph-title, #sb-stand, .sb-live, .sb-status, #screen-sandbox p").forEach(function (el) {
      if (el.children && el.children.length) return;
      var t = el.textContent || "";
      if (/Standing pressures/i.test(t) || (/Standing P/i.test(t) && /seat/i.test(t))) {
        if (t !== line) el.textContent = line;
      }
    });
  }
  function killEqualizedWhileRunning() {
    if (!compressorRunning()) return;
    document.querySelectorAll("#sb-stand, .sb-live, .sb-eq, #sb-eq, [id*='stand'], [class*='equal']").forEach(function (el) {
      var t = el.textContent || "";
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t)) {
        el.textContent = "RUNNING \u2014 split P. Read SH and SC together. Standing sat is off the table.";
      }
    });
    document.querySelectorAll("*").forEach(function (el) {
      if (el.children && el.children.length) return;
      if (el.closest && el.closest("#sb-ts")) return;
      var t = el.textContent || "";
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t) && t.length < 160) {
        el.textContent = "RUNNING \u2014 split P. Read SH and SC together. Standing sat is off the table.";
      }
    });
  }
  function scrapeDeg(kind) {
    var re = new RegExp("(-?\\d+(?:\\.\\d+)?)\\s*°?\\s*F?\\s*" + kind + "\\b", "i");
    var nodes = document.querySelectorAll("#sb-sh, #sb-sc");
    for (var i = 0; i < nodes.length; i++) {
      var m = (nodes[i].textContent || "").match(re);
      if (m && new RegExp(kind, "i").test(nodes[i].textContent || "")) return m[1] + "° " + kind;
    }
    return "";
  }
  function meteringKind() {
    var banner = document.getElementById("sb-sysbanner");
    var btxt = (banner && banner.textContent) || "";
    if (/PISTON/i.test(btxt)) return "piston";
    if (/\bEEV\b/i.test(btxt)) return "eev";
    if (window.LtActivePack && window.LtActivePack.metering) {
      var pm = String(window.LtActivePack.metering);
      if (pm === "piston" || pm === "orifice") return "piston";
      if (pm === "eev") return "eev";
      if (pm === "txv") return "txv";
    }
    if (window.LtMeteringKind === "piston" || window.LtMeteringKind === "orifice") return "piston";
    if (window.LtMeteringKind === "eev") return "eev";
    if (window.LtMeteringKind === "txv") return "txv";
    var pressed = document.querySelector('#sandbox-root [data-part="metering"].primary, button.primary[data-part="metering"]');
    var label = (pressed && pressed.textContent) || "";
    if (/piston|orifice/i.test(label)) return "piston";
    if (/eev/i.test(label)) return "eev";
    return "txv";
  }
  function pistonTarget() {
    var method = document.getElementById("sb-method");
    var m = method && (method.textContent || "").match(/SH\s+(\d+)/);
    if (m) return m[1];
    var od = Number((document.getElementById("sb-out") || {}).value || 95);
    var wb = Number((document.getElementById("sb-wb") || {}).value || 63);
    if (!isFinite(od)) od = 95;
    if (!isFinite(wb)) wb = 63;
    return String(Math.max(6, Math.min(18, Math.round(20 - 0.08 * (od - 82) - 0.55 * (wb - 63)))));
  }
  function paintSeat(id, note) {
    var el = document.getElementById(id);
    if (!el) return;
    var t = el.textContent || "";
    if (!/\d/.test(t) || /off \(no/i.test(t)) return;
    var next = /\(/.test(t) ? t.replace(/\([^)]*\)/, "(" + note + ")") : t + "  (" + note + ")";
    if (next !== t) el.textContent = next;
  }
  function liveShScRail() {
    var btn = document.getElementById("sb-run");
    var st = document.getElementById("sb-status");
    if (!btn || !st) return;
    if (!/Stop compressor/i.test(btn.textContent || "")) return;
    var sh = scrapeDeg("SH");
    var sc = scrapeDeg("SC");
    if (!sh || !sc) return;
    var kind = meteringKind();
    var line;
    if (kind === "piston") {
      var tgt = pistonTarget();
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC (piston target SH " + tgt + "\u00b0). Charge by blue SH. Red SC is the check.";
      paintSeat("sb-sh", "target " + tgt + "\u00b0 SH");
      paintSeat("sb-sc", "check only");
    } else if (kind === "eev") {
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC. EEV: weigh-in. Hoses are checks.";
      paintSeat("sb-sh", "check only");
      paintSeat("sb-sc", "check only");
    } else {
      line = "Blue hose " + sh + " SH \u00b7 Red hose " + sc + " SC (TXV seats 8\u201314). Charge by red SC. Blue SH is the check.";
      paintSeat("sb-sh", "seat 8\u201314");
      paintSeat("sb-sc", "seat 8\u201314");
      var shn = Number(sh), scn = Number(sc);
      if (shn >= 8 && shn <= 14 && scn >= 16) {
        line += " High red SC, blue SH in seat \u2014 dirty outdoor coil. Wash. Do not recover.";
        paintSeat("sb-sc", "high \u2014 wash OD");
      }
    }
    if (st.textContent !== line) st.textContent = line;
  }
  function scrub() {
    vocationalTiles();
    faultChipFit();
    lockerCard();
    bayStrip();
    partsLeftCompressorBtn();
    lockChargeUntilSeated();
    standingNotDiagnosis();
    killEqualizedWhileRunning();
    liveShScRail();
    document.querySelectorAll(".mode-card p, #rapture-copy").forEach(function (el) {
      var t = el.textContent || "";
      if (/not a shooter/i.test(t)) el.textContent = "Work clothes \u00b7 roof racks \u00b7 recovery tank";
    });
    var st = document.getElementById("el-status");
    if (st) {
      var t = st.textContent || "";
      if (/Defused/i.test(t)) t = t.replace(/Defused\.?/i, "No-cool closed.");
      if (/Gauges of God/i.test(t)) t = "No-cool closed. Safety string proved. HVAC Jesus on the roof in work clothes.";
      if (t !== st.textContent) st.textContent = t;
    }
    var win = document.getElementById("el-win");
    if (win) {
      var h = win.querySelector("h2");
      if (h && /Gauges of God/i.test(h.textContent || "")) h.textContent = "NO-COOL CLOSED";
    }
  }

  function blockJumpStart(ev) {
    var btn = document.getElementById("sb-run");
    if (!btn) return;
    var hit = ev.target;
    if (hit !== btn && !(btn.contains && btn.contains(hit))) return;
    if (/Stop compressor/i.test(btn.textContent || "")) return;
    if (!partsStillOnBench()) return;
    ev.preventDefault();
    ev.stopPropagation();
    var st = document.getElementById("sb-status");
    if (st) st.textContent = "Don't jump the compressor. Seat COMP \u00b7 COND \u00b7 TXV \u00b7 EVAP on the LEFT rail. Standing P only.";
  }
  document.addEventListener("pointerdown", blockJumpStart, true);
  document.addEventListener("click", blockJumpStart, true);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  setInterval(scrub, 800);
})();
