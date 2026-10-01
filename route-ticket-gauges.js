/* Shop floor: Hook gauges seats the ticket fingerprint on the manifold.
   Needles + SH/SC follow the call. Next ticket must change the fault.
   Dispatch stays above the drop — it does not cover hoses. Palette stays left. */
(function () {
  "use strict";
  if (window.__ltTicketGauges) return;
  window.__ltTicketGauges = 1;

  var lastKey = "";
  var seated = false;

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

  function fingerprint(c) {
    var blob = ((c.vitals || "") + " " + (c.job || "") + " " + (c.plate || "")).toLowerCase();
    var sh = num(c.vitals, /sh\s*~?\s*(-?\d+)/i, null);
    var sc = num(c.vitals, /sc\s*(?:about\s*)?~?\s*(-?\d+)/i, null);
    var blue = 118;
    var red = 340;
    var id = "normal";
    if (/open to atmosphere|lines cut|system opened|oil smell/.test(blob)) {
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
    if (sh == null) sh = 12;
    if (sc == null) sc = 10;
    return { id: id, blue: blue, red: red, sh: sh, sc: sc, key: id + ":" + blue + ":" + red + ":" + sh + ":" + sc };
  }

  function drawFace(canvas, psig, max, face, needle) {
    if (!canvas) return;
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2 + 8;
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
    ctx.lineTo(cx + Math.cos(ang) * (r - 10), cy + Math.sin(ang) * (r - 10));
    ctx.strokeStyle = needle;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#f4e7c8";
    ctx.fill();
    ctx.fillStyle = "#f4e7c8";
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(String(psig), cx, cy + r * 0.55);
  }

  function quoteOf(c) {
    var q = c.quote || {};
    var roast = 0;
    var slider = document.getElementById("svc-roast");
    if (slider) roast = Number(slider.value) || 0;
    if (roast >= 3 && q.extra) return q.extra;
    if (roast >= 2 && q.spicy) return q.spicy;
    return q.pro || (document.getElementById("svc-quote") || {}).textContent || "";
  }

  function streak() {
    var el = document.getElementById("svc-rating");
    return (el && el.textContent.trim()) || "★★★★★";
  }

  function pay(c) {
    var base = { open: 140, airflow: 86, restriction: 110, "dirty-cond": 95, "undercharge-lineset": 125, undercharge: 118 };
    var id = typeof c === "string" ? c : (c && (c.id || c._fp));
    return base[id] || 90;
  }

  function ensureBay() {
    var host = document.getElementById("svc-system-host");
    if (!host) return null;
    var bay = document.getElementById("lt-ticket-bay");
    if (bay && bay.parentNode === host) return bay;
    bay = document.createElement("div");
    bay.id = "lt-ticket-bay";
    bay.innerHTML =
      '<div id="lt-dispatch" class="lt-dispatch">' +
      '<span id="lt-radio">Dispatch</span>' +
      '<span id="lt-streak"></span>' +
      '<span id="lt-quote"></span>' +
      '<span id="lt-stub"></span>' +
      "</div>" +
      '<div id="lt-preview" class="lt-preview">Blue — · Red — · SH — · SC —</div>' +
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
      "</div>" +
      '<p id="lt-fault" class="lt-fault"></p>' +
      "</div></div>";
    host.insertBefore(bay, host.firstChild);
    bay.querySelectorAll(".lt-hose").forEach(function (btn) {
      btn.addEventListener("dragstart", function (ev) {
        ev.dataTransfer.setData("text/plain", btn.getAttribute("data-hose"));
      });
    });
    bay.querySelectorAll(".lt-port").forEach(function (port) {
      port.addEventListener("dragover", function (ev) { ev.preventDefault(); });
      port.addEventListener("drop", function (ev) {
        ev.preventDefault();
        var hose = ev.dataTransfer.getData("text/plain");
        port.textContent = hose + " seated";
        port.classList.add("seated");
        var both = bay.querySelectorAll(".lt-port.seated").length >= 2;
        if (both) seat(call());
      });
      port.addEventListener("click", function () {
        port.classList.add("seated");
        if (bay.querySelectorAll(".lt-port.seated").length >= 2) seat(call());
      });
    });
    return bay;
  }

  function paint(fp, c) {
    drawFace(document.getElementById("lt-g-low"), fp.blue, 250, "#1d4e89", "#7eb6ff");
    drawFace(document.getElementById("lt-g-high"), fp.red, 500, "#8a1d2b", "#ff8b8b");
    var preview = document.getElementById("lt-preview");
    if (preview) preview.textContent = "Blue " + fp.blue + " · Red " + fp.red + " · SH " + fp.sh + "° · SC " + fp.sc + "°";
    var radio = document.getElementById("lt-radio");
    var score = (document.getElementById("svc-score") || {}).textContent || "";
    if (radio) radio.textContent = "Dispatch · " + (score || "on site") + " · " + (c.name || "tech");
    var st = document.getElementById("lt-streak");
    if (st) st.textContent = streak();
    var q = document.getElementById("lt-quote");
    if (q) q.textContent = "“" + quoteOf(c) + "”";
    var stub = document.getElementById("lt-stub");
    if (stub) stub.textContent = "Stub $" + pay(fp.id) + " · " + fp.id;
    var fault = document.getElementById("lt-fault");
    if (fault) fault.textContent = fp.id + " · " + (c.vitals || c.job || "");
    window.LTSandbox = { lpc: fp.blue, hpc: fp.red, low: fp.blue, high: fp.red, sh: fp.sh, sc: fp.sc, fault: fp.id };
    var plow = document.getElementById("g-plow");
    var phigh = document.getElementById("g-phigh");
    if (plow) plow.textContent = String(fp.blue);
    if (phigh) phigh.textContent = String(fp.red);
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
    if (hook && hook.dataset.ltHook !== "1") {
      hook.dataset.ltHook = "1";
      hook.addEventListener("click", function () {
        ensureBay();
        var ports = document.querySelectorAll("#lt-ticket-bay .lt-port");
        ports.forEach(function (p) { p.classList.add("seated"); });
        seat(call());
      });
    }
    var next = document.getElementById("svc-next-ticket");
    if (next && next.dataset.ltNext !== "1") {
      next.dataset.ltNext = "1";
      next.addEventListener("click", function () {
        var prev = fingerprint(call());
        var changed = null;
        if (window.ServiceCalls && window.ServiceCalls.nextTicket) changed = window.ServiceCalls.nextTicket();
        setTimeout(function () {
          var c = call();
          var fp = seat(c);
          var tag = document.getElementById("lt-fault");
          var did = changed ? changed.changed : fp.key !== prev.key;
          if (tag) tag.textContent = (did ? "FAULT CHANGED · " : "SAME FAULT · ") + fp.id + " · " + (c.vitals || c.job || "");
        }, 40);
      });
    }
  }

  var css = document.createElement("style");
  css.id = "lt-ticket-gauges-css";
  css.textContent =
    "#lt-ticket-bay{display:flex;flex-direction:column;min-height:220px;background:#0b1218;color:#f4e7c8}" +
    "#lt-dispatch{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;padding:6px 10px;background:#14110c;border-bottom:2px solid #CE0034;font-size:12px}" +
    "#lt-preview{position:sticky;top:0;z-index:3;padding:4px 10px;background:#102033;font-size:13px;letter-spacing:.02em}" +
    ".lt-floor{display:grid;grid-template-columns:108px minmax(0,1fr);gap:8px;padding:8px;align-items:start}" +
    ".lt-palette{display:flex;flex-direction:column;gap:6px}" +
    ".lt-hose,.lt-port{font:13px/1.2 sans-serif;padding:8px;border:1px solid #8a7344;background:#1c1812;color:#f4e7c8;text-align:left}" +
    ".lt-glass{display:grid;grid-template-columns:1fr 1fr;gap:6px}" +
    ".lt-ports{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:6px}" +
    ".lt-port.seated{border-color:#7eb6ff}" +
    ".lt-fault{grid-column:1/-1;margin:4px 0 12px;font-size:12px;opacity:.9}" +
    "@media(max-width:480px){#lt-dispatch{position:relative!important;bottom:auto!important}#svc-system-host{padding-bottom:12px}.lt-floor{grid-template-columns:108px minmax(0,1fr)!important}.lt-palette{position:relative!important;left:0!important;z-index:4}}";
  document.head.appendChild(css);
  bind();
  setInterval(function () {
    bind();
    var svc = document.getElementById("screen-service");
    if (!seated || !svc || !svc.classList.contains("active")) return;
    if (!document.getElementById("lt-ticket-bay")) {
      ensureBay();
      var c = call();
      paint(fingerprint(c), c);
    }
  }, 500);
  window.ltTicketFingerprint = function () {
    var c = call();
    return fingerprint(c);
  };
})();
