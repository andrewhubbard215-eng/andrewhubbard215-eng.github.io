/* Route floor overlay — ticket → hook gauges → live SH/SC. */
(function () {
  "use strict";

  function css() {
    if (document.getElementById("route-floor-css")) return;
    var s = document.createElement("style");
    s.id = "route-floor-css";
    s.textContent =
      ".sb-dispatch{position:relative;z-index:2;margin:0 0 8px;padding:8px 10px;background:rgba(16,18,22,.92);border:1px solid #3a2f22;border-radius:8px}" +
      ".sb-dispatch-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}" +
      ".sb-radio{font-weight:600;color:#f0c9a0}" +
      ".sb-streak{margin-left:auto;font-size:12px;color:#e8c450}" +
      ".sb-quote{margin:6px 0 2px;font-size:13px;color:#f7f3ea}" +
      ".sb-live{margin:0;font-size:12px;letter-spacing:.04em;color:#7ec8ff}" +
      "#sb-next-ticket,#svc-hook,#svc-next-ticket{margin:6px 6px 6px 0}" +
      "@media (max-width:820px){.sb-dispatch{position:sticky;top:0;max-height:28vh;overflow:auto}#sandbox-root .sb-palette{left:0;right:auto;z-index:5}}";
    document.head.appendChild(s);
  }

  function jobs() {
    return (window.HVACSandbox && window.HVACSandbox.FIELD_JOBS) || [];
  }

  function paintBar(job) {
    var gauges = document.querySelector(".sb-gauges") || document.getElementById("sandbox-root");
    if (!gauges) return;
    var bar = document.getElementById("sb-dispatch");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "sb-dispatch";
      bar.className = "sb-dispatch";
      gauges.insertBefore(bar, gauges.firstChild);
    }
    var name = (job && job.name) || "Open ticket";
    var q = (job && job.complaint) || "Hook gauges. Read the fingerprint.";
    bar.innerHTML =
      '<div class="sb-dispatch-row"><span class="sb-radio">📡 ' +
      name +
      '</span><span class="sb-streak">streak ' +
      (window._ltStreak || 0) +
      '</span><button type="button" class="btn tiny" id="sb-next-ticket">Next random ticket</button></div>' +
      '<p class="sb-quote">' +
      q +
      '</p><p class="sb-live" id="sb-live-radio">Blue — · Red — · SH — · SC —</p>';
    var nxt = document.getElementById("sb-next-ticket");
    if (nxt) nxt.onclick = function () { nextTicket(job && job.id); };
  }

  function hookLive() {
    var el = document.getElementById("sb-live-radio");
    if (!el) return;
    var sh = document.getElementById("g-sh");
    var sc = document.getElementById("g-sc");
    var lo = document.getElementById("g-plow");
    var hi = document.getElementById("g-phigh");
    el.textContent =
      "Blue " + ((lo && lo.textContent) || "—") +
      " · Red " + ((hi && hi.textContent) || "—") +
      " · SH " + ((sh && sh.textContent) || "—") +
      " · SC " + ((sc && sc.textContent) || "—");
  }

  function loadTicket(id) {
    var sb = window.HVACSandbox;
    if (sb && sb.loadRouteTicket) {
      var job = sb.loadRouteTicket(id);
      paintBar(job);
      return job;
    }
    var list = jobs();
    var job = list.filter(function (j) { return j.id === id; })[0] || list[0];
    if (sb && sb.startMystery && job) sb.startMystery(job);
    paintBar(job);
    return job;
  }

  function nextTicket(exceptId) {
    var sb = window.HVACSandbox;
    if (sb && sb.nextRandomTicket) {
      var job = sb.nextRandomTicket(exceptId);
      paintBar(job);
      return job;
    }
    var list = jobs().filter(function (j) { return j.id !== exceptId; });
    var job = list[Math.floor(Math.random() * list.length)] || jobs()[0];
    return loadTicket(job && job.id);
  }

  function goSandboxThen(id) {
    if (typeof window.ltPlay === "function") {
      try { window.ltPlay("sandbox"); } catch (e) {}
    }
    setTimeout(function () { loadTicket(id); }, 80);
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
    var hookBtn2 = host.querySelector("#svc-hook");
    var nxtBtn = host.querySelector("#svc-next-ticket");
    function currentJobId() {
      var name = (host.querySelector("#svc-name") || {}).textContent || "";
      if (/Delgado/i.test(name) || /Jess/i.test(name)) return "leak";
      if (/Ken/i.test(name)) return "dirty-idu";
      if (/Priya/i.test(name)) return "drier";
      if (/Ray/i.test(name)) return "dirty-odu";
      if (/Dave/i.test(name)) return "air";
      return null;
    }
    if (hookBtn2) hookBtn2.onclick = function () {
      try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) {}
      goSandboxThen(currentJobId());
    };
    if (nxtBtn) nxtBtn.onclick = function () {
      var skip = currentJobId();
      var pool = ["leak", "dirty-idu", "drier", "dirty-odu", "air", "overcharge", "txv-bulb", "od-fan"].filter(function (x) { return x !== skip; });
      var id = pool[Math.floor(Math.random() * pool.length)];
      try { if (navigator.vibrate) navigator.vibrate(12); } catch (e) {}
      goSandboxThen(id);
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
