/* Shop-floor copy override — callback talks meter and sheet, not bombs */
(function () {
  function chargeByHint() {
    var tgt = document.getElementById("g-tgt");
    if (!tgt) return;
    var label = tgt.previousElementSibling;
    if (label && label.tagName === "SPAN" && !/charge/i.test(label.textContent || "")) {
      label.textContent = "Target \u00b7 charge method";
    }
    var t = tgt.textContent || "";
    if (!t || t === "\u2014" || /charge by/i.test(t)) return;
    var orifice = false;
    try {
      if (window.HVACSandbox && typeof window.HVACSandbox.meteringKind === "function") {
        orifice = window.HVACSandbox.meteringKind() === "orifice";
      }
    } catch (e) {}
    var sysText = ((document.getElementById("sb-sysbanner") || {}).textContent || "") +
      ((document.getElementById("sb-sysinfo") || {}).textContent || "");
    if (/piston|orifice|capillary|fixed/i.test(sysText)) orifice = true;
    if (/\bTXV\b|\bEEV\b/i.test(sysText) && !/piston|orifice|capillary/i.test(sysText)) orifice = false;
    var by = orifice ? "piston/cap \u00b7 charge by SH" : "TXV \u00b7 charge by SC";
    tgt.textContent = t.replace(/\s*\u00b0F?\s*$/, "") + " \u00b7 " + by;
  }
  function gaugeFormulas() {
    var sh = document.getElementById("g-sh");
    var sc = document.getElementById("g-sc");
    if (sh && sh.previousElementSibling && sh.previousElementSibling.tagName === "SPAN") {
      sh.previousElementSibling.textContent = "Superheat \u00b7 suction T \u2212 evap sat \u00b7 piston ~8\u201312\u00b0";
    }
    if (sc && sc.previousElementSibling && sc.previousElementSibling.tagName === "SPAN") {
      sc.previousElementSibling.textContent = "Subcooling \u00b7 cond sat \u2212 liquid T \u00b7 TXV ~8\u201312\u00b0";
    }
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
    var rail = document.querySelectorAll('#sandbox-root [data-part]');
    if (!rail.length) return false;
    return need.some(function (id) {
      var el = document.querySelector('#sandbox-root [data-part="' + id + '"]');
      return el && !el.classList.contains("primary") && el.getAttribute("aria-pressed") !== "true";
    });
  }
  function partsLeftCompressorBtn() {
    var btn = document.getElementById("sb-run");
    if (!btn) return;
    var t = btn.textContent || "";
    if (/Stop compressor/i.test(t)) return;
    if (/Seat parts first/i.test(t)) {
      btn.textContent = t.replace(/Seat parts first/i, "Start compressor");
    } else if (!/Start compressor/i.test(t)) {
      btn.textContent = "Start compressor";
    }
    var st = document.getElementById("sb-status");
    if (st && partsStillOnBench() && !/Stop compressor/i.test(btn.textContent || "")) {
      var cur = st.textContent || "";
      if (!cur || /Seat parts first/i.test(cur)) {
        st.textContent = "Parts LEFT — tap compressor, condenser, TXV, evaporator, then Start compressor.";
      }
    }
  }
  function standingNotDiagnosis() {
    var btn = document.getElementById("sb-run");
    var st = document.getElementById("sb-status");
    if (!btn || !st) return;
    var running = /Stop compressor/i.test(btn.textContent || "");
    var title = (document.getElementById("sb-ph-title") || {}).textContent || "";
    var standing = /Standing/i.test(title) || /off \(no SH\)/i.test((document.getElementById("sb-sst") || {}).textContent || "");
    var faultOn = document.querySelector("#sandbox-root button.primary, #sandbox-root [aria-pressed='true']");
    var faultName = faultOn ? (faultOn.textContent || "").trim() : "";
    if (!running && standing && faultName && !/Healthy|Shop floor|Compressor|Condenser|TXV|Evaporator|Seat/i.test(faultName)) {
      if (!/standing pressure is not a diagnosis/i.test(st.textContent || "")) {
        st.textContent = "Standing pressure is not a diagnosis. Start compressor, then read live SH/SC.";
      }
    }
  }
  function vocationalTiles() {
    document.querySelectorAll("h2, h3, .mode-card h3, .tile h3, .card h3").forEach(function (el) {
      var t = el.textContent || "";
      if (/OHM'?S LAW ARCADE/i.test(t) && !el.querySelector("h3, p")) {
        el.textContent = t.replace(/OHM'?S LAW ARCADE/i, "OHM'S LAW TICKETS");
      }
    });
    document.querySelectorAll(".mode-card[data-mode='ohms-law']").forEach(function (card) {
      if (!card.querySelector("h3")) {
        card.innerHTML = "<h3>Ohm's Law tickets</h3><p>Twist V/I/R \u00b7 meter the ticket \u00b7 Easy to Spicy</p>";
      } else {
        var h = card.querySelector("h3");
        if (h && /ARCADE/i.test(h.textContent || "")) h.textContent = "Ohm's Law tickets";
      }
    });
    document.querySelectorAll(".mode-card p, .tile p, .card p").forEach(function (el) {
      var t = el.textContent || "";
      if (/Easy -- Spicy tickets|Easy \u2192 Spicy/i.test(t) || /smoke meter/i.test(t)) {
        el.textContent = "Twist V/I/R \u00b7 meter the ticket \u00b7 Easy to Spicy";
      }
    });
  }
  function scrub() {
    vocationalTiles();
    partsLeftCompressorBtn();
    standingNotDiagnosis();
    var title = document.getElementById("arena-title");
    if (title && /arena/i.test(title.textContent || "")) {
      title.textContent = (title.textContent || "").replace(/\s*arena/i, " \u2014 shop truck");
    }
    document.querySelectorAll(".mode-card p, #rapture-copy").forEach(function (el) {
      var t = el.textContent || "";
      if (/not a shooter/i.test(t)) el.textContent = "Work clothes \u00b7 roof racks \u00b7 recovery tank";
    });
    document.querySelectorAll("#arena-copy, .arena-copy, [data-arena-copy]").forEach(function (el) {
      var t = el.textContent || "";
      if (/combat|twisted yard/i.test(t)) {
        el.textContent = /falcon/i.test(t)
          ? "Shop truck \u00b7 gauges on the seat, not the yard \u00b7 parts LEFT"
          : "HVAC service van \u00b7 roof racks \u00b7 recovery tank \u00b7 parts LEFT";
      }
    });
    var st = document.getElementById("el-status");
    if (st) {
      var t = st.textContent || "";
      if (/Defused/i.test(t)) t = t.replace(/Defused\.?/i, "No-cool closed.");
      if (/Gauges of God/i.test(t)) t = "No-cool closed. Safety string proved. HVAC Jesus on the roof in work clothes.";
      if (/callback is still armed/i.test(t)) {
        t = t.replace(/callback is still armed\. Cut the open, not the live\./i, "callback is still open. Isolate the open, not the live.");
      }
      if (/You cut the live or ran out of time/i.test(t)) {
        t = "No-cool still open. You jumped live or burned the clock.";
      }
      if (t !== st.textContent) st.textContent = t;
    }
    var win = document.getElementById("el-win");
    if (win) {
      var brow = win.querySelector(".eyebrow");
      if (brow && /Defused/i.test(brow.textContent || "")) brow.textContent = "No-cool closed";
      var h = win.querySelector("h2");
      if (h && /GAUGES OF GOD|Gauges of God/i.test(h.textContent || "")) h.textContent = "NO-COOL CLOSED";
      var msg = win.querySelector(".el-overlay-msg");
      if (msg && /Gauges of God/i.test(msg.textContent || "")) {
        msg.textContent = "You found the open with the meter. Prove it, write the sheet, parts stay LEFT.";
      }
    }
    chargeByHint();
    gaugeFormulas();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scrub);
  } else {
    scrub();
  }
  setInterval(scrub, 800);
})();
