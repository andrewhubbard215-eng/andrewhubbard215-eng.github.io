/* HVAC Allstars teaching locks — scrub wrong SH/SC / dirty-condenser fingerprints on the floor. Allstars only. */
(function () {
  "use strict";
  if (window.LtBrand && window.LtBrand.isLegends) return;
  var PAIRS = [
    [/Superheat = suction line temperature at the evaporator outlet[^"]{0,200}/gi,
     "Superheat = suction line T minus dew point (from the PT chart at suction pressure)."],
    [/Subcooling = saturated liquid temp from PT chart[^"]{0,200}/gi,
     "Subcooling = start of boiling minus liquid line T (from the PT chart at liquid-line pressure)."],
    [/High SH \+ low SC → undercharge\/leak\. High SH \+ high\/normal SC[^"]{0,400}/gi,
     "High SH + low SC → undercharge/leak — find the leak, do not top off, do not turn the TXV. High SH + high SC → restriction / plugged drier — cold at drier outlet, do not add gas. Low SH + high SC → overcharge — recover to nameplate. High head + SC about normal + high amps → dirty condenser — wash the coil, do not pull gas. High head AND high SC → air/noncondensables — recover, evacuate, weigh back. SH near zero with ice → airflow first, do not add gas. Always pair SH with SC. One number is a coin flip."],
    [/High SH with healthy\/high SC — liquid is in the condenser[^"]{0,250}/gi,
     "High SH and high SC — restriction / plugged drier. Cold at drier outlet. Do not add gas. TXV flash is at the seat, not the power head; stem in clockwise raises SH. Check drier delta-T, bulb strap, inlet screen. Replace drier anytime you open a burned-out or dirty system."],
    [/Brown\/dark texture dominance — outdoor or indoor coil likely fouled\. High head, high SC[^"]{0,150}/gi,
     "Brown/dark texture dominance — outdoor or indoor coil likely fouled. High head, SC about normal, sad capacity. Wash the coil; do not pull gas to mask head pressure."],

    [/SH = suction temp\s*[−\-]\s*evap sat\.?\s*SC = cond sat\s*[−\-]\s*liquid temp\.?/gi,
     "SH = suction line T − dew point. SC = start of boiling − liquid line T."],
    [/SH = suction T\s*[−\-]\s*evap sat\.?\s*SC = cond sat\s*[−\-]\s*liquid T\.?/gi,
     "SH = suction line T − dew point. SC = start of boiling − liquid line T."],
    [/SH = suction line\s*[−\-]\s*sat \(low(?: side)?\)\s*[-–—]\s*SC = sat \(high(?: side)?\)\s*[−\-]\s*liquid line/gi,
     "SH = suction line T − dew point  -  SC = start of boiling − liquid line T"],
    [/SH = suction line\s*[−\-]\s*SST/gi, "SH = suction line T − dew point"],
    [/SC = SCT\s*[−\-]\s*liquid line/gi, "SC = start of boiling − liquid line T"],
    [/SH = suction T\s*(?:\u2212|−|-)\s*evap sat \(SST\)/gi, "SH = suction line T − dew point"],
    [/SC = cond sat \(SCT\)\s*(?:\u2212|−|-)\s*liquid T/gi, "SC = start of boiling − liquid line T"],
    [/High head\s*-\s*high SC\s*-\s*dirty ODU/gi, "High head  -  SC about normal  -  dirty condenser"],
    [/High head,\s*high SC,\s*high amps/gi, "High head, SC about normal, high amps"],
    [/High head \+ high SC = overcharge or restriction\. High head \+ low-to-normal SC = condenser air\./gi,
     "High SH + high SC = restriction. Low SH + high SC = overcharge. High head + SC about normal = dirty condenser. High head + high SC = air/noncondensables."],
    [/High head - High SC - High amps - Coil matted/gi, "High head - SC about normal - High amps - Coil matted"],
    [/Outdoor fan and coil — high head \/ low SC is air, not gas\./gi,
     "Outdoor fan and coil — high head / SC about normal is dirty condenser; high head AND high SC is air/noncondensables."],
    [/High SH \+ low SC = leak\. High SH \+ high SC = restriction\. High head \+ low SC = condenser or non-condensables\./gi,
     "High SH + low SC = leak. High SH + high SC = restriction. High head + SC about normal = dirty condenser. High head + high SC = air/noncondensables."],
    [/Lincoln Tech: SH = suction temp minus evap sat\. SC = cond sat minus liquid temp\./gi,
     "Lincoln Tech: SH = suction line T minus dew point. SC = start of boiling minus liquid line T."],
    [/SH = suction temp − evap sat; SC = cond sat − liquid temp/gi,
     "SH = suction line T − dew point; SC = start of boiling − liquid line T"]
  ];
  function scrub(s) {
    if (!s || s.length > 8000) return s;
    var out = s;
    for (var i = 0; i < PAIRS.length; i++) out = out.replace(PAIRS[i][0], PAIRS[i][1]);
    return out;
  }
  function walk(n) {
    if (!n) return;
    if (n.nodeType === 3) {
      var t = scrub(n.nodeValue);
      if (t !== n.nodeValue) n.nodeValue = t;
      return;
    }
    if (n.nodeType !== 1) return;
    var tag = n.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "TEXTAREA") return;
    for (var c = n.firstChild; c; c = c.nextSibling) walk(c);
  }
  function tick() { if (document.body) walk(document.body); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", tick);
  else tick();
  setInterval(tick, 900);

  function scrubHubKB() {
    try {
      var H = window.HubAI || window.LtHubAI || window.hubAI;
      if (!H) return;
      var kb = H.KB || H.knowledge || H.answers || H.topics || null;
      if (Array.isArray(kb)) {
        kb.forEach(function (item) {
          if (!item) return;
          if (typeof item.answer === "string") item.answer = scrub(item.answer);
          if (typeof item.detail === "string") item.detail = scrub(item.detail);
          if (Array.isArray(item.tips)) item.tips = item.tips.map(scrub);
        });
      }
      ["lincoln", "LINCOLN", "tips", "TIPS", "curriculum"].forEach(function (k) {
        if (Array.isArray(H[k])) H[k] = H[k].map(function (x) {
          return typeof x === "string" ? scrub(x) : x;
        });
      });
      if (H.CURRICULUM && typeof H.CURRICULUM === "object") {
        Object.keys(H.CURRICULUM).forEach(function (k) {
          var arr = H.CURRICULUM[k];
          if (Array.isArray(arr)) H.CURRICULUM[k] = arr.map(function (x) {
            return typeof x === "string" ? scrub(x) : x;
          });
        });
      }
    } catch (e) {}
  }
  scrubHubKB();
  setInterval(scrubHubKB, 2000);

})();
