/* Shop-floor copy override v76 — good seat: confirm filter/airflow. Do not chase numbers or move gas. */
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
  function appVer() {
    var m = document.querySelector('meta[name="lt-app-ver"]');
    return (m && m.content) || window.LT_APP_VER || "v3.5.468";
  }
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
    strip.textContent = "HVAC Allstars - " + appVer() + " - " + bay;
  }
  function partsLeftCompressorBtn() {}
  function lockChargeUntilSeated() {}
  function standingNotDiagnosis() {
    document.querySelectorAll("#sb-status, .sb-status, [id*=status]").forEach(function (el) {
      var t = el.textContent || "";
      if (/Standing pressures/i.test(t) || (/Standing P/i.test(t) && /seat/i.test(t)) || /not a diagnosis/i.test(t) || /not a charge ticket/i.test(t)) {
        el.textContent = "Standing P is not a charge ticket. Refrigerant migrates to the colder coil. Seat the four LEFT, start the compressor, wait for stable SH/SC before you weigh or recover any gas.";
      }
    });
  }
  function killEqualizedWhileRunning() {
    document.querySelectorAll("#sb-status, .sb-status").forEach(function (el) {
      var t = el.textContent || "";
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t)) {
        var btn = document.getElementById("sb-run");
        if (btn && /Stop compressor/i.test(btn.textContent || "")) {
          el.textContent = "Running. Read SH/SC after stable. Do not recover on equalized numbers.";
        }
      }
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t) && t.length < 160) {
        /* leave standing note */
      }
    });
  }
  function scrapeDeg(label) {
    var el = document.getElementById(label === "SH" ? "sb-sh" : "sb-sc");
    if (!el) return null;
    var m = (el.textContent || "").match(/([\d.]+)/);
    return m ? m[1] : null;
  }
  function meteringKind() {
    var mk = String(window.LtMeteringKind || "").toLowerCase();
    if (mk === "piston" || mk === "eev" || mk === "txv") return mk;
    var seat = document.querySelector('#sandbox-root [data-part="metering"]');
    if (seat && seat.textContent) {
      var st = seat.textContent.toLowerCase();
      if (/piston|orifice/.test(st)) return "piston";
      if (/eev|electronic/.test(st)) return "eev";
      if (/txv/.test(st)) return "txv";
    }
    var t = (document.body.innerText || "").toLowerCase();
    if (/piston|orifice|fixed/.test(t)) return "piston";
    if (/eev|electronic/.test(t)) return "eev";
    return "txv";
  }
  function pistonTarget() { return "10"; }
  function lerp(a,b,t){return a+(b-a)*t;}
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
    var fEl = document.getElementById("sb-fault");
    var fk = fEl && window.LtFaultKind ? window.LtFaultKind(fEl.textContent || "") : "";
    var FL = fk && window.LtFaultLabels ? window.LtFaultLabels[fk] : null;
    if (FL) {
      if (st.textContent !== FL.status) st.textContent = FL.status;
      return;
    }
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
      if (shn >= 8 && shn <= 14 && scn >= 8 && scn <= 14) {
        line += " Good seat. Confirm filter, indoor coil, outdoor coil, and airflow. Do not chase the numbers. Do not add or recover gas.";
        paintSeat("sb-sh", "good seat");
        paintSeat("sb-sc", "good seat");
      } else if (shn > 14 && scn < 8) {
        line += " High blue SH, low red SC \u2014 undercharge. Confirm airflow, find the leak, then weigh in. Do not top off.";
        paintSeat("sb-sh", "high \u2014 undercharge");
        paintSeat("sb-sc", "low");
      } else if (shn >= 8 && shn <= 14 && scn >= 16) {
        line += " High red SC, blue SH in seat \u2014 dirty outdoor coil. Wash. Do not recover.";
        paintSeat("sb-sc", "high \u2014 wash OD");
      } else if (shn > 14 && scn > 14) {
        line += " High blue SH, high red SC \u2014 restriction. Check filter-drier, TXV, or line set. Do not add gas.";
        paintSeat("sb-sh", "high \u2014 restriction");
        paintSeat("sb-sc", "high \u2014 liquid stacked");
      } else if (shn < 8 && scn > 14) {
        line += " Low blue SH, high red SC \u2014 overcharge. Recover to seat. Do not vent.";
        paintSeat("sb-sh", "low \u2014 overcharge");
        paintSeat("sb-sc", "high");
      }
    }
    if (st.textContent !== line) st.textContent = line;
  }
  function loopClosedConfirm() {
    var need = ["compressor", "condenser", "metering", "evaporator"];
    var seated = need.filter(function (id) {
      var part = document.querySelector('#sandbox-root [data-part="' + id + '"]');
      var slot = document.querySelector('#sb-slots .sb-slot[data-slot="' + id + '"]');
      return (part && (part.classList.contains("primary") || part.getAttribute("aria-pressed") === "true")) ||
             (slot && (slot.classList.contains("filled") || slot.classList.contains("has") || slot.querySelector("img, strong")));
    });
    if (seated.length !== 4) return;
    var run = document.getElementById("sb-run");
    if (run && /Stop compressor/i.test(run.textContent || "")) return; // running
    var st = document.getElementById("sb-status");
    if (!st) return;
    var t = st.textContent || "";
    if (/LOOP OPEN|seat LEFT|Don't jump|Standing P/i.test(t) || t.length < 40) {
      st.textContent = "Loop closed. Four LEFT seated. Start the compressor. Wait for stable SH/SC before you charge or recover.";
    }
  }

  function scrub() {
    loopClosedConfirm();

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
  }
  setInterval(scrub, 800);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
})();
