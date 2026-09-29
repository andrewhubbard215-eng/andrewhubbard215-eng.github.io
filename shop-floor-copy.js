/* Shop-floor copy override v45 — locker card, WB once, strip names live bay, running kills EQUALIZED, charge locked until LEFT seated */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/inducer/i.test(t) && /blower/i.test(t) && /ignitor/i.test(t)) {
        el.textContent = "W \u00b7 inducer \u00b7 PS \u00b7 ignitor \u00b7 valve \u00b7 flame \u00b7 blower";
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
  var TIP_VER = (function () {
    var s = document.querySelector(".version-strip");
    var m = s && (s.textContent || "").match(/v\d+\.\d+\.\d+/);
    return m ? m[0] : "v3.5.223";
  })();
  function bayStrip() {
    var strip = document.querySelector(".version-strip");
    if (!strip) return;
    var bay = "shop floor";
    var tabSat = document.querySelector(".el-tab.active, .sat-tab.active, [data-el-tab].active");
    var tabTxt = ((tabSat && tabSat.textContent) || "").toLowerCase();
    if (screenOn("screen-electrical")) {
      if (/saturday|callback/.test(tabTxt) || document.querySelector(".sat-sheet, #sat-root, [data-mode='defusal'].active"))
        bay = "saturday callback";
      else if (/lug|land/.test(tabTxt)) bay = "land lugs";
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
    return false;
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
      var t = el.textContent || "";
      if (/EQUALIZED/i.test(t) && /unit off/i.test(t) && t.length < 160) {
        el.textContent = "RUNNING \u2014 split P. Read SH and SC together. Standing sat is off the table.";
      }
    });
  }
  function scrapeDeg(kind) {
    var re = new RegExp("(-?\\d+(?:\\.\\d+)?)\\s*°?\\s*F?\\s*" + kind + "\\b", "i");
    var nodes = document.querySelectorAll("#screen-sandbox *");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.children && el.children.length) continue;
      var m = (el.textContent || "").match(re);
      if (m) return m[1] + "° " + kind;
    }
    return "";
  }
  function liveShScRail() {
    var btn = document.getElementById("sb-run");
    var st = document.getElementById("sb-status");
    if (!btn || !st) return;
    if (!/Stop compressor/i.test(btn.textContent || "")) return;
    var sh = scrapeDeg("SH");
    var sc = scrapeDeg("SC");
    if (!sh || !sc) return;
    var line = "Running \u2014 " + sh + " / " + sc + " (TXV seats 8–14 both). Charge by SC, SH is the check.";
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scrub);
  else scrub();
  setInterval(scrub, 800);
})();
