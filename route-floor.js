/* Route floor overlay — ticket → hook gauges → live SH/SC. */
(function () {
  "use strict";
  var NAME_MAP = [
    { re: /Delgado/i, id: "leak" },
    { re: /Ken/i, id: "dirty-idu" },
    { re: /Priya/i, id: "drier" },
    { re: /Ray/i, id: "dirty-odu" },
    { re: /Dave/i, id: "air" },
    { re: /Jess|Marcus/i, id: "leak" }
  ];
  var ORDER = ["leak", "dirty-idu", "drier", "dirty-odu", "air", "overcharge", "txv-bulb", "od-fan"];
  function css() {
    if (document.getElementById("route-floor-css")) return;
    var s = document.createElement("style");
    s.id = "route-floor-css";
    s.textContent =
      ".sb-dispatch{position:relative;z-index:2;margin:0 0 8px;padding:8px 10px;background:rgba(16,18,22,.92);border:1px solid #3a2f22;border-radius:8px}" +
      ".sb-dispatch-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
      ".sb-radio{font-weight:600;color:#f0c9a0}.sb-streak{margin-left:auto;font-size:12px;color:#e8c450}" +
      ".sb-quote{margin:6px 0 2px;font-size:13px}.sb-live{margin:0;font-size:12px;color:#7ec8ff}" +
      ".svc-route-btns{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}" +
      "@media (max-width:820px){.sb-dispatch{position:relative;max-height:22vh;overflow:auto;z-index:2}" +
      "#sandbox-root .sb-palette{left:0;right:auto;z-index:6;pointer-events:auto}" +
      "#sandbox-root .sb-gauges{z-index:3}}";
    document.head.appendChild(s);
  }
  function roast(job) {
    var lines = [
      "HUB: Needles first. Don't sell a compressor off a warm vent.",
      "HUB: High SH + low SC is a leak smell, not a TXV story.",
      "Pay stub reminder: $18.40/hr only prints if you close the ticket right.",
      "HUB: Read Blue and Red together. One gauge is a rumor."
    ];
    return lines[(job && job.id ? job.id.length : 0) % lines.length];
  }
  function paintBar(title, quote, job) {
    var host = document.querySelector("#sandbox-root .sb-gauges") || document.getElementById("sandbox-root");
    if (!host) return;
    var bar = document.getElementById("sb-dispatch");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sb-dispatch";
      bar.className = "sb-dispatch";
      host.insertBefore(bar, host.firstChild);
    }
    window._ltStreak = (window._ltStreak || 0);
    bar.innerHTML =
      '<div class="sb-dispatch-row"><span class="sb-radio">📡 ' +
      (title || "Ticket") +
      '</span><span class="sb-streak">streak ' +
      window._ltStreak +
      '</span><button type="button" class="btn tiny" id="sb-next-ticket">Next random ticket</button></div>' +
      '<p class="sb-quote">' +
      (quote || "Read Blue / Red / SH / SC.") +
      "</p>" +
      '<p class="sb-pay" style="margin:2px 0;font-size:12px;color:#c9b48a">' +
      roast(job) +
      "</p>" +
      '<p class="sb-live" id="sb-live-radio">Blue —</p>';
    var nxt = document.getElementById("sb-next-ticket");
    if (nxt) nxt.onclick = function () { nextTicket(window._ltTicketId); };
  }
  function hookLive() {
    var el = document.getElementById("sb-live-radio");
    if (!el) return;
    function t(id) {
      var n = document.getElementById(id);
      return (n && n.textContent) || "—";
    }
    el.textContent = "Blue " + t("g-plow") + " · Red " + t("g-phigh") + " · SH " + t("g-sh") + " · SC " + t("g-sc");
  }
  function clickField(name) {
    var tab = document.querySelector('.sb-tab[data-tab="field"]');
    if (tab) tab.click();
    var items = document.querySelectorAll("#sandbox-root .sb-item");
    for (var i = 0; i < items.length; i++) {
      var strong = items[i].querySelector("strong");
      if (strong && name && strong.textContent.indexOf(name) >= 0) {
        items[i].click();
        break;
      }
    }
    var g = document.querySelector('#sb-bin [data-id="gauges"], .sb-item[data-id="gauges"]');
    if (g) g.click();
  }
  var TITLES = {
    leak: "Slow leak",
    "dirty-idu": "Iced evaporator",
    drier: "Restriction after drier",
    "dirty-odu": "Rooftop high head",
    air: "Air in the circuit",
    overcharge: "Someone dumped a jug",
    "txv-bulb": "TXV lost its mind",
    "od-fan": "Condenser fan dead"
  };
  function loadTicket(id) {
    window._ltTicketId = id;
    var job = null;
    if (window.HVACSandbox && typeof window.HVACSandbox.loadRouteTicket === "function") {
      job = window.HVACSandbox.loadRouteTicket(id);
    } else {
      clickField(TITLES[id] || "Slow leak");
      job = { id: id, name: TITLES[id] || id, complaint: "Fault changed. Hooked manifold — read the fingerprint." };
    }
    paintBar(job && job.name, job && job.complaint, job);
    hookLive();
    return job;
  }
  function nextTicket(exceptId) {
    var keys = ORDER.filter(function (k) { return k !== exceptId; });
    var id = keys[Math.floor(Math.random() * keys.length)] || "leak";
    return loadTicket(id);
  }
  function goSandboxThen(id) {
    if (typeof window.ltStartSandbox === "function") {
      try { window.ltStartSandbox(); } catch (e) {}
    } else if (typeof window.ltPlay === "function") {
      try { window.ltPlay("sandbox"); } catch (e) {}
    } else if (typeof window.ltGo === "function") {
      window.ltGo("sandbox");
    }
    var n = 0;
    var t = setInterval(function () {
      n++;
      if ((window.HVACSandbox && document.getElementById("sb-fault")) || n > 20) {
        clearInterval(t);
        loadTicket(id);
      }
    }, 80);
  }
  function currentJobId() {
    var name = ((document.getElementById("svc-name") || {}).textContent) || "";
    for (var i = 0; i < NAME_MAP.length; i++) {
      if (NAME_MAP[i].re.test(name)) return NAME_MAP[i].id;
    }
    return window._ltTicketId || "leak";
  }
  function wireService() {
    var host = document.getElementById("screen-service");
    if (!host) return;
    var hookBtn = document.getElementById("svc-hook");
    var nxt = document.getElementById("svc-next-ticket");
    if (!hookBtn) {
      var card = host.querySelector(".svc-card") || host;
      hookBtn = document.createElement("button");
      hookBtn.id = "svc-hook";
      hookBtn.className = "btn primary";
      hookBtn.type = "button";
      hookBtn.textContent = "Hook gauges";
      card.insertBefore(hookBtn, card.querySelector("#svc-choices") || null);
    }
    if (!nxt) {
      nxt = document.createElement("button");
      nxt.id = "svc-next-ticket";
      nxt.className = "btn";
      nxt.type = "button";
      nxt.textContent = "Next random ticket";
      hookBtn.after(nxt);
    }
    if (hookBtn.dataset.wired) return;
    hookBtn.dataset.wired = "1";
    nxt.dataset.wired = "1";
    hookBtn.onclick = function () {
      try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}
      window._ltStreak = (window._ltStreak || 0) + 1;
      var pay = document.getElementById("svc-pay");
      if (pay) pay.textContent = "Pay stub $18.40/hr · streak " + window._ltStreak + " · HUB: hook the ports.";
      goSandboxThen(currentJobId());
    };
    nxt.onclick = function () {
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      var id = ORDER.filter(function (k) { return k !== currentJobId(); });
      window._ltTicketId = id[Math.floor(Math.random() * id.length)] || "air";
      goSandboxThen(window._ltTicketId);
    };
  }
  function boot() {
    css();
    wireService();
    setInterval(function () {
      wireService();
      hookLive();
    }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
