/* Shop-floor copy override v28 — locker card, WB once, callback talks meter */
(function () {
  function vocationalTiles() {
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/^W\s/.test(t.trim()) && /inducer/i.test(t) && /blower/i.test(t)) {
        el.textContent = "Call on W \u00b7 inducer \u00b7 PS \u00b7 ignitor \u00b7 valve \u00b7 \u00b5A \u00b7 blower \u00b7 limit";
      }
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
  function bayStrip() {
    var strip = document.querySelector(".version-strip");
    if (!strip) return;
    var bay = "shop floor";
    if (screenOn("screen-sandbox")) bay = "sandbox";
    else if (screenOn("screen-electrical")) bay = "ladder";
    else if (screenOn("screen-quiz")) bay = "exam";
    else if (screenOn("screen-minisplit")) bay = "mini-split";
    else if (screenOn("screen-service")) bay = "service calls";
    else if (screenOn("screen-truck-pouch")) bay = "on the job";
    else if (screenOn("screen-film")) bay = "component film";
    else if (screenOn("screen-epa608")) bay = "epa 608";
    else if (screenOn("screen-shoplabs")) bay = "lab packets";
    else if (screenOn("screen-commandments")) bay = "commandments";
    else if (screenOn("screen-rapture")) bay = "hvac jesus";
    strip.textContent = "HVAC Allstars - v3.5.187 - " + bay;
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
  function partsLeftCompressorBtn() {
    var btn = document.getElementById("sb-run");
    if (!btn) return;
    var t = btn.textContent || "";
    if (/Stop compressor/i.test(t)) return;
    var left = partsStillOnBench();
    if (left) {
      if (!/Seat parts first/i.test(t)) btn.textContent = "Seat parts first";
    } else if (/Seat parts first/i.test(t) || !/Start compressor/i.test(t)) {
      btn.textContent = "Start compressor";
    }
  }
  function standingNotDiagnosis() {
    var btn = document.getElementById("sb-run");
    var st = document.getElementById("sb-status");
    if (!btn || !st) return;
    var running = /Stop compressor/i.test(btn.textContent || "");
    var title = (document.getElementById("sb-ph-title") || {}).textContent || "";
    var standing = /Standing/i.test(title);
    if (!running && standing) {
      if (!/standing pressure is not a diagnosis/i.test(st.textContent || "")) {
        st.textContent = "Standing pressure is not a diagnosis. Start compressor, then read live SH/SC.";
      }
    }
  }
  function scrub() {
    vocationalTiles();
    lockerCard();
    bayStrip();
    partsLeftCompressorBtn();
    standingNotDiagnosis();
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
