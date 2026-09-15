/* Route floor overlay — ticket → hook gauges → live SH/SC. */
(function () {
  "use strict";
  var FAULTS = {
    leak: { tab: "Slow leak", fault: "undercharge" },
    "dirty-idu": { tab: "Iced evaporator", fault: "none" },
    drier: { tab: "Restriction after drier", fault: "restricted" },
    "dirty-odu": { tab: "Rooftop high head", fault: "none" },
    air: { tab: "Air in the circuit", fault: "noncondensables" },
    overcharge: { tab: "Someone dumped a jug", fault: "overcharge" },
    "txv-bulb": { tab: "TXV lost its mind", fault: "txv_closed" },
    "od-fan": { tab: "Condenser fan dead", fault: "od_fan" }
  };
  function css() {
    if (document.getElementById("route-floor-css")) return;
    var s = document.createElement("style");
    s.id = "route-floor-css";
    s.textContent = ".sb-dispatch{position:relative;z-index:2;margin:0 0 8px;padding:8px 10px;background:rgba(16,18,22,.92);border:1px solid #3a2f22;border-radius:8px}.sb-dispatch-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.sb-radio{font-weight:600;color:#f0c9a0}.sb-streak{margin-left:auto;font-size:12px;color:#e8c450}.sb-quote{margin:6px 0 2px;font-size:13px}.sb-live{margin:0;font-size:12px;color:#7ec8ff}@media (max-width:820px){.sb-dispatch{position:sticky;top:0;max-height:28vh;overflow:auto}#sandbox-root .sb-palette{left:0;right:auto;z-index:5}}";
    document.head.appendChild(s);
  }
  function paintBar(title, quote) {
    var gauges = document.querySelector(".sb-gauges") || document.getElementById("sandbox-root");
    if (!gauges) return;
    var bar = document.getElementById("sb-dispatch");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sb-dispatch";
      bar.className = "sb-dispatch";
      gauges.insertBefore(bar, gauges.firstChild);
    }
    bar.innerHTML = '<div class="sb-dispatch-row"><span class="sb-radio">📡 ' + (title || "Ticket") + '</span><span class="sb-streak">streak ' + (window._ltStreak || 0) + '</span><button type="button" class="btn tiny" id="sb-next-ticket">Next random ticket</button></div><p class="sb-quote">' + (quote || "Read Blue / Red / SH / SC.") + '</p><p class="sb-live" id="sb-live-radio">Blue —</p>';
    var nxt = document.getElementById("sb-next-ticket");
    if (nxt) nxt.onclick = function () { nextTicket(window._ltTicketId); };
  }
  function hookLive() {
    var el = document.getElementById("sb-live-radio");
    if (!el) return;
    function t(id) { var n = document.getElementById(id); return (n && n.textContent) || "—"; }
    el.textContent = "Blue " + t("g-plow") + " · Red " + t("g-phigh") + " · SH " + t("g-sh") + " · SC " + t("g-sc");
  }
  function clickField(name) {
    var tab = document.querySelector('.sb-tab[data-tab="field"]');
    if (tab) tab.click();
    var items = document.querySelectorAll("#sandbox-root .sb-item, .sb-palette .sb-item");
    for (var i = 0; i < items.length; i++) {
      var strong = items[i].querySelector("strong");
      if (strong && name && strong.textContent.indexOf(name) >= 0) {
        items[i].click();
        return true;
      }
    }
    var fl = document.getElementById("sb-fault");
    if (fl && FAULTS[window._ltTicketId]) {
      fl.disabled = false;
      fl.value = FAULTS[window._ltTicketId].fault;
      fl.dispatchEvent(new Event("change", { bubbles: true }));
    }
    return false;
  }
  function loadTicket(id) {
    window._ltTicketId = id;
    var meta = FAULTS[id] || FAULTS.leak;
    if (window.HVACSandbox && window.HVACSandbox.loadRouteTicket) {
      var job = window.HVACSandbox.loadRouteTicket(id);
      paintBar(job && job.name, job && job.complaint);
      return job;
    }
    paintBar(meta.tab, "Fault changed. Hooked manifold — read the fingerprint.");
    clickField(meta.tab);
    var g = document.querySelector('.sb-item[data-equip="gauges"], .sb-item');
    return meta;
  }
  function nextTicket(exceptId) {
    var keys = Object.keys(FAULTS).filter(function (k) { return k !== exceptId; });
    var id = keys[Math.floor(Math.random() * keys.length)];
    return loadTicket(id);
  }
  function goSandboxThen(id) {
    if (typeof window.ltPlay === "function") {
      try { window.ltPlay("sandbox"); } catch (e) {}
    }
    setTimeout(function () { loadTicket(id); }, 120);
  }
  function wireService() {
    var host = document.getElementById("screen-service");
    if (!host) return;
    var card = host.querySelector(".svc-card") || host;
    if (!host.querySelector("#svc-hook")) {
      var hookBtn = document.createElement("button");
      hookBtn.id = "svc-hook";
      hookBtn.className = "btn primary";
      hookBtn.type = "button";
      hookBtn.textContent = "Hook gauges";
      card.insertBefore(hookBtn, card.querySelector("#svc-choices") || null);
      var nxt = document.createElement("button");
      nxt.id = "svc-next-ticket";
      nxt.className = "btn";
      nxt.type = "button";
      nxt.textContent = "Next random ticket";
      hookBtn.after(nxt);
    }
    function currentJobId() {
      var name = ((host.querySelector("#svc-name") || {}).textContent) || "";
      if (/Delgado|Jess/i.test(name)) return "leak";
      if (/Ken/i.test(name)) return "dirty-idu";
      if (/Priya/i.test(name)) return "drier";
      if (/Ray/i.test(name)) return "dirty-odu";
      if (/Dave/i.test(name)) return "air";
      return "leak";
    }
    host.querySelector("#svc-hook").onclick = function () {
      try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}
      goSandboxThen(currentJobId());
    };
    host.querySelector("#svc-next-ticket").onclick = function () {
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      nextTicket(currentJobId());
      goSandboxThen(window._ltTicketId);
    };
  }
  function boot() {
    css();
    wireService();
    setInterval(function () { wireService(); hookLive(); }, 400);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
