/* Shop floor: Hook gauges seats the ticket fingerprint on the manifold.
   Needles + large center psig. Yellow caps on its own port and the chip goes away.
   Dispatch stays above the drop — it does not cover hoses. Palette stays left.
   Nameplate picks the P/T. R-22 glass is not a 410A chart. */
(function () {
  "use strict";
  if (window.__ltTicketGauges) return;
  window.__ltTicketGauges = 12;

  var lastKey = "";
  var seated = false;
  var PT22 = [40,25, 49,30, 55,32, 62,35, 69,40, 76,45, 84,50, 93,55, 102,60, 111,65, 121,70, 132,75, 144,80, 156,85, 168,90, 182,95, 196,100, 211,105, 226,110, 243,115, 260,120, 278,125, 297,130, 317,135, 337,140, 359,145, 382,150];
  var PT410 = [70,25, 92,32, 118,40, 130,45, 143,50, 157,55, 171,60, 187,65, 202,70, 218,75, 236,80, 254,85, 274,90, 295,95, 317,100, 340,105, 365,110, 391,115, 418,120, 446,125, 476,130, 508,135, 541,140];

  function call() {
    var list = (window.ServiceCalls && window.ServiceCalls.CALLS) || [];
    var tag = document.querySelector(".svc-fault-tag");
    var job = tag ? tag.textContent.replace(/^Ticket:\s*/, "") : "";
    var name = (document.getElementById("svc-name") || {}).textContent || "";
    var i;
    for (i = 0; i < list.length; i++) {
      if (job && (list[i].job === job || job.indexOf(list[i].job) >= 0)) return list[i];
      if (name && list[i].name === name) return list[i];
    }
    return list[0] || { name: name || "Call", job: job || "no-cool", vitals: "", quote: { pro: "" } };
  }

  function num(text, re, fallback) {
    var m = String(text || "").match(re);
    return m ? Number(m[1]) : fallback;
  }

  function sheetText() {
    var tag = document.querySelector(".svc-fault-tag");
    var sheet = document.getElementById("svc-sheet") || document.querySelector(".svc-sheet");
    return (((tag && tag.textContent) || "") + " " + ((sheet && sheet.textContent) || "")).toLowerCase();
  }

  function is22(c) {
    var blob = ((c.plate || "") + " " + (c.job || "") + " " + (c.vitals || "") + " " + (c.name || "")).toLowerCase();
    return /r-?\s*22|hcfc-?\s*22/.test(blob) && !/410/.test(blob);
  }

  function satOf(psig, table) {
    if (psig <= 1) return null;
    if (psig < table[0]) {
      var span = table[2] - table[0] || 1;
      var slope = (table[3] - table[1]) / span;
      return table[1] + (psig - table[0]) * slope;
    }
    var i;
    for (i = 0; i < table.length - 2; i += 2) {
      if (psig <= table[i + 2]) {
        var span = table[i + 2] - table[i] || 1;
        var t = (psig - table[i]) / span;
        return table[i + 1] + t * (table[i + 3] - table[i + 1]);
      }
    }
    return table[table.length - 1];
  }

  function fingerprint(c) {
    var blob = ((c.vitals || "") + " " + (c.job || "") + " " + (c.plate || "")).toLowerCase();
    var sh = num(c.vitals, /sh\s*~?\s*(-?\d+)/i, null);
    var sc = num(c.vitals, /sc\s*(?:about\s*)?~?\s*(-?\d+)/i, null);
    var blue = 118;
    var red = 340;
    var id = "normal";
    var gas = is22(c) ? "R-22" : "R-410A";
    var sheet = sheetText();
    var routeId = window._ltTicketId || "";
    var routeGlass = {
      leak: ["undercharge", 92, 248, 28, 4],
      "dirty-idu": ["airflow", 62, 300, 0, 10],
      drier: ["restriction", 74, 286, 35, 14],
      "dirty-odu": ["dirty-cond", 128, 455, 9, 11],
      air: ["air", 132, 478, 8, 22],
      overcharge: ["overcharge", 140, 490, 4, 20],
      lineset: ["undercharge-lineset", 102, 268, 22, 2],
      "od-fan": ["dirty-cond", 118, 430, 10, 16]
    };
    if (/open to atmosphere|lines cut|system opened|oil smell|valve apart/.test(blob)) {
      id = "open"; blue = 0; red = 0; sh = 0; sc = 0;
    } else if (/air in the circuit|noncondensables|high head - high sc/.test(sheet) && !/pay stub|streak/.test(sheet)) {
      id = "air"; blue = 132; red = 478; sh = 8; sc = 22;
    } else if (routeGlass[routeId]) {
      id = routeGlass[routeId][0]; blue = routeGlass[routeId][1]; red = routeGlass[routeId][2]; sh = routeGlass[routeId][3]; sc = routeGlass[routeId][4];
    } else if (/open to atmosphere|lines cut|system opened|oil smell/.test(blob) && !/air in the circuit|noncondens/.test(sheet)) {
      id = "open"; blue = 0; red = 0; sh = 0; sc = 0;
    } else if (/filter black|low airflow|iced|popsicle|~0/.test(blob)) {
      id = "airflow"; blue = 62; red = 300; sh = sh == null ? 0 : sh; sc = sc == null ? 10 : sc;
    } else if (/liquid cold|zone dead|restriction/.test(blob)) {
      id = "restriction"; blue = 74; red = 286; sh = sh == null ? 35 : sh; sc = sc == null ? 14 : sc;
    } else if (/juniper|matted|high head|high amps/.test(blob)) {
      id = "dirty-cond"; blue = 128; red = 455; sh = sh == null ? 9 : sh; sc = sc == null ? 11 : sc;
    } else if (/bubble|long lineset|sc 2/.test(blob)) {
      id = "undercharge-lineset"; blue = 102; red = 268; sh = sh == null ? 22 : sh; sc = sc == null ? 2 : sc;
    } else if (/suction low|head low|undercharge|sh 28|sc 4/.test(blob)) {
      id = "undercharge"; blue = 92; red = 248; sh = sh == null ? 28 : sh; sc = sc == null ? 4 : sc;
    } else {
      if (sh != null && sh >= 20) blue = 96;
      if (sc != null && sc <= 5) red = 260;
    }
    if (gas === "R-22" && id !== "open" && id !== "air" && id !== "overcharge") {
      if (id === "dirty-cond") {
        blue = 76; red = 368; sh = sh == null ? 9 : sh; sc = 16;
      } else if (id === "airflow") {
        blue = 48; red = 176;
      } else if (id === "restriction") {
        blue = 42; red = 188;
      } else if (id === "undercharge") {
        blue = 55; red = 158;
      } else if (id === "undercharge-lineset") {
        blue = 60; red = 172;
      } else {
        blue = 70; red = 260;
      }
    }
    if (sh == null) sh = 12;
    if (sc == null) sc = 10;
    return { id: id, gas: gas, blue: blue, red: red, sh: sh, sc: sc, key: gas + ":" + id + ":" + blue + ":" + red + ":" + sh + ":" + sc };
  }

  function drawFace(canvas, psig, max, face, needle) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2 + 6;
    var r = Math.min(w, h) * 0.42;
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
    ctx.fillStyle = "#1a140c";
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = face;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, r, Math.PI * 0.75, Math.PI * 2.25);
    ctx.strokeStyle = "#3a3226";
    ctx.lineWidth = 6;
    ctx.stroke();
    var frac = Math.max(0, Math.min(1, psig / max));
    var ang = Math.PI * 0.75 + frac * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(ang) * (r - 14), cy + Math.sin(ang) * (r - 14));
    ctx.strokeStyle = needle;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f4e7c8";
    ctx.fill();
    ctx.fillStyle = "#0e0c09";
    ctx.fillRect(cx - 52, cy + 16, 104, 40);
    ctx.fillStyle = "#f4e7c8";
    ctx.textAlign = "center";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(String(psig), cx, cy + 40);
    ctx.font = "12px sans-serif";
    ctx.fillText("psig", cx, cy + 52);
  }

  function quoteOf(c) {
    var q = c.quote || {};
    var roast = 0;
    var slider = document.getElementById("lt-roast") || document.getElementById("svc-roast");
    if (slider) roast = Number(slider.value) || 0;
    if (roast >= 3 && q.extra) return q.extra;
    if (roast >= 2 && q.spicy) return q.spicy;
    return q.pro || (document.getElementById("svc-quote") || {}).textContent || "";
  }

  function streak() {
    var el = document.getElementById("svc-rating");
    return (el && el.textContent.trim()) || "\u2605\u2605\u2605\u2605\u2605";
  }

  function pay(c) {
    var base = { open: 140, airflow: 86, restriction: 110, "dirty-cond": 95, "undercharge-lineset": 125, undercharge: 118 };
    var id = typeof c === "string" ? c : (c && (c.id || c._fp));
    return base[id] || 90;
  }

  function hoseFits(port, hose) {
    var want = port.getAttribute("data-port");
    if (want === "suction") return hose === "blue";
    if (want === "liquid") return hose === "red";
    if (want === "cap") return hose === "yellow";
    return false;
  }

  function land(bay, port, hose) {
    if (!hoseFits(port, hose)) return;
    try { if (navigator.vibrate) navigator.vibrate(hose === "yellow" ? 12 : 20); } catch (e) {}
    port.textContent = hose === "yellow" ? "Yellow capped" : hose + " seated";
    port.classList.add("seated");
    var chip = bay.querySelector('.lt-hose[data-hose="' + hose + '"]');
    if (chip) chip.remove();
    if (bay.querySelector("#lt-port-suction.seated") && bay.querySelector("#lt-port-liquid.seated")) seat(call());
  }


  function wireHose(bay, btn) {
    if (btn.dataset.ltWired === "1") return;
    btn.dataset.ltWired = "1";
    btn.addEventListener("dragstart", function (ev) {
      ev.dataTransfer.setData("text/plain", btn.getAttribute("data-hose"));
    });
    btn.addEventListener("click", function () {
      var hose = btn.getAttribute("data-hose");
      var portId = hose === "blue" ? "lt-port-suction" : hose === "red" ? "lt-port-liquid" : "lt-port-cap";
      var port = document.getElementById(portId);
      if (port) land(bay, port, hose);
    });
  }

  function ensureBay() {
    var host = document.getElementById("svc-system-host");
    if (!host) return null;
    var bay = document.getElementById("lt-ticket-bay");
    if (bay && bay.parentNode === host && bay.querySelector("#lt-port-cap")) return bay;
    if (bay) bay.remove();
    bay = document.createElement("div");
    bay.id = "lt-ticket-bay";
    bay.innerHTML =
      '<div id="lt-dispatch" class="lt-dispatch">' +
      '<span id="lt-radio">Dispatch</span>' +
      '<span id="lt-streak"></span>' +
      '<span id="lt-quote"></span>' +
      '<span id="lt-stub"></span>' +
      '<label class="lt-roast">HUB roast <input id="lt-roast" type="range" min="0" max="3" value="0" /></label>' +
      "</div>" +
      '<div id="lt-preview" class="lt-preview">Blue \u2014 \u00b7 Red \u2014 \u00b7 SH \u2014 \u00b7 SC \u2014</div>' +
      '<div class="lt-floor">' +
      '<aside class="lt-palette" aria-label="Hose palette">' +
      '<button type="button" class="lt-hose" draggable="true" data-hose="blue">Blue hose</button>' +
      '<button type="button" class="lt-hose" draggable="true" data-hose="red">Red hose</button>' +
      '<button type="button" class="lt-hose" draggable="true" data-hose="yellow">Yellow hose</button>' +
      "</aside>" +
      '<div class="lt-glass">' +
      '<canvas id="lt-g-low" width="220" height="200" aria-label="Low side"></canvas>' +
      '<canvas id="lt-g-high" width="220" height="200" aria-label="High side"></canvas>' +
      '<div class="lt-ports">' +
      '<div class="lt-port" data-port="suction" id="lt-port-suction">Suction port</div>' +
      '<div class="lt-port" data-port="liquid" id="lt-port-liquid">Liquid port</div>' +
      '<div class="lt-port" data-port="cap" id="lt-port-cap">Yellow cap</div>' +
      "</div>" +
      '<p id="lt-fault" class="lt-fault"></p>' +
      "</div></div>";
    host.insertBefore(bay, host.firstChild);
    bay.querySelectorAll(".lt-hose").forEach(function (btn) { wireHose(bay, btn); });
    bay.querySelectorAll(".lt-port").forEach(function (port) {
      port.addEventListener("dragover", function (ev) { ev.preventDefault(); });
      port.addEventListener("drop", function (ev) {
        ev.preventDefault();
        land(bay, port, ev.dataTransfer.getData("text/plain"));
      });
      port.addEventListener("click", function () {
        var hose = port.getAttribute("data-port") === "suction" ? "blue" : port.getAttribute("data-port") === "liquid" ? "red" : "yellow";
        land(bay, port, hose);
      });
    });
    return bay;
  }

  function resetHoses() {
    var bay = document.getElementById("lt-ticket-bay");
    if (!bay) return;
    var labels = { suction: "Suction port", liquid: "Liquid port", cap: "Yellow cap" };
    ["suction", "liquid", "cap"].forEach(function (id) {
      var port = bay.querySelector("#lt-port-" + id);
      if (!port) return;
      port.classList.remove("seated");
      port.textContent = labels[id];
    });
    var pal = bay.querySelector(".lt-palette");
    if (!pal) return;
    ["blue", "red", "yellow"].forEach(function (hose) {
      if (pal.querySelector('.lt-hose[data-hose="' + hose + '"]')) return;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "lt-hose";
      btn.draggable = true;
      btn.setAttribute("data-hose", hose);
      btn.textContent = hose.charAt(0).toUpperCase() + hose.slice(1) + " hose";
      pal.appendChild(btn);
      wireHose(bay, btn);
    });
  }

  function paint(fp, c) {
    drawFace(document.getElementById("lt-g-low"), fp.blue, fp.gas === "R-22" ? 200 : 250, "#1d4e89", "#7eb6ff");
    drawFace(document.getElementById("lt-g-high"), fp.red, 500, "#8a1d2b", "#ff8b8b");
    var preview = document.getElementById("lt-preview");
    var table = fp.gas === "R-22" ? PT22 : PT410;
    var rawL = satOf(fp.blue, table);
    var rawH = satOf(fp.red, table);
    var satL = rawL == null ? "off" : Math.round(rawL) + "\u00b0";
    var satH = rawH == null ? "off" : Math.round(rawH) + "\u00b0";
    var empty = fp.id === "open" ? " \u00b7 empty — do not charge" : "";
    if (preview) preview.textContent = fp.gas + " chart \u00b7 Blue " + fp.blue + " \u00b7 Red " + fp.red + " \u00b7 sat " + satL + "/" + satH + " \u00b7 SH " + fp.sh + "\u00b0 \u00b7 SC " + fp.sc + "\u00b0" + empty;
    var radio = document.getElementById("lt-radio");
    var score = (document.getElementById("svc-score") || {}).textContent || "";
    if (radio) radio.textContent = "Dispatch \u00b7 " + (score || "on site") + " \u00b7 " + (c.name || "tech");
    var st = document.getElementById("lt-streak");
    if (st) st.textContent = streak();
    var q = document.getElementById("lt-quote");
    if (q) q.textContent = "\u201c" + quoteOf(c) + "\u201d";
    var stub = document.getElementById("lt-stub");
    if (stub) stub.textContent = "Stub $" + pay(fp.id) + " \u00b7 read the manifold";
    var fault = document.getElementById("lt-fault");
    if (fault) fault.textContent = fp.id === "undercharge-lineset"
      ? "Glass: SH " + fp.sh + " high · SC " + fp.sc + " low · not a restriction (that one is high SH and high SC)."
      : "Numbers on the glass. Name the fault on the sheet — not here.";
    window.LTSandbox = { lpc: fp.blue, hpc: fp.red, low: fp.blue, high: fp.red, sh: fp.sh, sc: fp.sc, fault: fp.id, gas: fp.gas, satSuction: satL, satLiquid: satH, hoses: "on" };
  }

  function hold(fp, c) {
    drawFace(document.getElementById("lt-g-low"), 0, fp.gas === "R-22" ? 200 : 250, "#1d4e89", "#7eb6ff");
    drawFace(document.getElementById("lt-g-high"), 0, 500, "#8a1d2b", "#ff8b8b");
    var preview = document.getElementById("lt-preview");
    if (preview) preview.textContent = fp.gas + " chart \u00b7 hook blue and red \u00b7 SH \u2014 \u00b7 SC \u2014";
    var radio = document.getElementById("lt-radio");
    var score = (document.getElementById("svc-score") || {}).textContent || "";
    if (radio) radio.textContent = "Dispatch \u00b7 " + (score || "on site") + " \u00b7 " + (c.name || "tech");
    var st = document.getElementById("lt-streak");
    if (st) st.textContent = streak();
    var q = document.getElementById("lt-quote");
    if (q) q.textContent = "\u201c" + quoteOf(c) + "\u201d";
    var stub = document.getElementById("lt-stub");
    if (stub) stub.textContent = "Stub $" + pay(fp.id) + " \u00b7 hook before you read";
    var fault = document.getElementById("lt-fault");
    if (fault) fault.textContent = "Hoses not seated. Blank glass. Hook blue and red before you name the fault.";
    var plow = document.getElementById("g-plow");
    var phigh = document.getElementById("g-phigh");
    var gsh = document.getElementById("g-sh");
    var gsc = document.getElementById("g-sc");
    if (plow) plow.textContent = "\u2014";
    if (phigh) phigh.textContent = "\u2014";
    if (gsh) gsh.textContent = "\u2014";
    if (gsc) gsc.textContent = "\u2014";
    var table = fp.gas === "R-22" ? PT22 : PT410;
    var rawL = satOf(fp.blue, table);
    var rawH = satOf(fp.red, table);
    window.LTSandbox = { lpc: null, hpc: null, low: null, high: null, sh: null, sc: null, fault: fp.id, gas: fp.gas, satSuction: rawL == null ? null : Math.round(rawL), satLiquid: rawH == null ? null : Math.round(rawH), hoses: "off" };
  }

  function seat(c) {
    var fp = fingerprint(c);
    c._fp = fp.id;
    seated = true;
    lastKey = fp.key;
    ensureBay();
    paint(fp, c);
    try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}
    return fp;
  }

  function bind() {
    var hook = document.getElementById("svc-hook");
    if (hook) hook.textContent = "Hook gauges";
    if (hook && hook.dataset.ltHook !== "4") {
      hook.dataset.ltHook = "4";
      var arm = function (ev) {
        if (ev && ev.type === "pointerdown") ev.preventDefault();
        var bay = ensureBay();
        if (!bay) return;
        land(bay, bay.querySelector("#lt-port-suction"), "blue");
        land(bay, bay.querySelector("#lt-port-liquid"), "red");
        land(bay, bay.querySelector("#lt-port-cap"), "yellow");
        seat(call());
        setTimeout(function () { seat(call()); }, 80);
      };
      hook.addEventListener("pointerdown", arm);
      hook.addEventListener("click", arm);
    }
    var roast = document.getElementById("lt-roast");
    if (roast && roast.dataset.ltRoast !== "1") {
      roast.dataset.ltRoast = "1";
      roast.addEventListener("input", function () {
        try { if (navigator.vibrate) navigator.vibrate(8); } catch (e) {}
        var c = call();
        var fp = fingerprint(c);
        if (seated) paint(fp, c);
        else hold(fp, c);
      });
    }
    var next = document.getElementById("svc-next-ticket");
    if (next && next.dataset.ltNext !== "1") {
      next.dataset.ltNext = "1";
      next.addEventListener("click", function () {
        var prevName = ((document.getElementById("svc-name") || {}).textContent) || "";
        setTimeout(function () {
          var c = call();
          var fp = fingerprint(c);
          var name = ((document.getElementById("svc-name") || {}).textContent) || "";
          var did = name !== prevName || fp.key !== lastKey;
          lastKey = fp.key;
          seated = true;
          ensureBay();
          land(document.getElementById("lt-ticket-bay"), document.getElementById("lt-port-suction"), "blue");
          land(document.getElementById("lt-ticket-bay"), document.getElementById("lt-port-liquid"), "red");
          seat(c);
          var tag = document.getElementById("lt-fault");
          if (tag) tag.textContent = did
            ? "Next ticket. Fault changed to " + fp.id + ". Blue " + fp.blue + " / Red " + fp.red + " / SH " + fp.sh + " / SC " + fp.sc + "."
            : "Same fault. Hit next again.";
        }, 60);
      });
    }
  }

  var css = document.createElement("style");
  css.id = "lt-ticket-gauges-css";
  css.textContent =
    "#lt-ticket-bay{display:flex;flex-direction:column;min-height:220px;background:#0b1218;color:#f4e7c8}" +
    "#lt-ticket-bay{position:relative;z-index:4}" +
    "#lt-dispatch,#sb-dispatch{position:relative!important;top:auto!important;bottom:auto!important;z-index:2;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;padding:6px 10px;background:#14110c;border-bottom:2px solid #CE0034;font-size:12px;pointer-events:auto;max-height:18vh;overflow:auto}" +
    "#screen-service .sm-next{position:static!important}" +
    "#lt-preview{position:sticky;top:0;z-index:3;padding:6px 10px;background:#102033;font-size:18px;font-weight:700;letter-spacing:.02em}" +
    ".lt-floor{display:grid;grid-template-columns:108px minmax(0,1fr);gap:8px;padding:8px;align-items:start}" +
    ".lt-palette{display:flex;flex-direction:column;gap:6px}" +
    ".lt-hose,.lt-port{font:13px/1.2 sans-serif;padding:8px;border:1px solid #8a7344;background:#1c1812;color:#f4e7c8;text-align:left}" +
    ".lt-glass{display:grid;grid-template-columns:1fr 1fr;gap:6px}" +
    ".lt-ports{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px}" +
    ".lt-port.seated{border-color:#7eb6ff}" +
    "#lt-port-cap.seated{border-color:#e2c15a}" +
    ".lt-fault{grid-column:1/-1;margin:4px 0 12px;font-size:13px;line-height:1.35;min-height:2.6em;opacity:.95}" +
    "#lt-g-low,#lt-g-high{width:100%;height:auto;max-height:min(200px,26vh)}" +
    "@media(max-height:820px){#lt-g-low,#lt-g-high{max-height:132px}#lt-ticket-bay{min-height:0}#screen-service{overflow:auto!important;padding-bottom:12px}.lt-floor{align-items:start}}" +
    "@media(max-width:480px){#lt-dispatch,#sb-dispatch{position:relative!important;bottom:auto!important;top:auto!important;max-height:22vh;overflow:auto;width:auto!important}#svc-system-host{padding-bottom:96px}.version-strip{pointer-events:none}.lt-roast{display:flex;align-items:center;gap:6px;font-size:11px}.lt-floor{grid-template-columns:92px minmax(0,1fr)!important}.lt-palette{position:relative!important;left:0!important;z-index:6;pointer-events:auto}#lt-preview{position:sticky;top:0;z-index:5}#screen-service #sb-gauge-run{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;width:100%!important;max-width:100%!important;z-index:1!important;pointer-events:none}#lt-g-low,#lt-g-high{pointer-events:none;max-height:96px}#screen-service .svc-rail,#screen-service .svc-card{max-height:none!important;overflow:visible!important}#lt-port-suction,#lt-port-liquid,#lt-port-cap,.lt-hose{pointer-events:auto;position:relative;z-index:7}}";
  document.head.appendChild(css);
  bind();
  setInterval(function () {
    bind();
    var svc = document.getElementById("screen-service");
    if (!svc || !svc.classList.contains("active")) return;
    if (!document.getElementById("lt-ticket-bay")) ensureBay();
    var c = call();
    var fp = fingerprint(c);
    var preview = document.getElementById("lt-preview");
    var blank = preview && /SH\s*[\u2014-]/.test(preview.textContent || "");
    if (fp.key !== lastKey) {
      lastKey = fp.key;
      seated = false;
      resetHoses();
      hold(fp, c);
    } else if (seated && blank) {
      seat(c);
    } else if (!seated && preview && !/SH\s*[\u2014-]/.test(preview.textContent || "")) {
      hold(fp, c);
    }
  }, 500);
  window.ltTicketFingerprint = function () {
    var c = call();
    return fingerprint(c);
  };
  window.ltHookTicketGauges = function () {
    ensureBay();
    var c = call();
    var fp = fingerprint(c);
    lastKey = fp.key;
    seated = true;
    paint(fp, c);
    return fp;
  };
})();
