/* Saturday callback — tap the ticket slip, stay on the bay, arm the sheet. */
(function () {
  var MAP = [
    { id: "hpc", re: /No-cool at 4:58/i },
    { id: "cap", re: /Hum, no start/i },
    { id: "fuse", re: /3A keeps popping/i },
    { id: "stat", re: /Stat wired drunk/i },
    { id: "coil", re: /Contactor never pulls/i },
    { id: "pan", re: /Pan is a lake/i },
    { id: "ice", re: /Iced solid/i },
    { id: "dead", re: /Dead set/i },
    { id: "limit", re: /Furnace limit/i },
    { id: "hp3", re: /Heat pump, 3A/i }
  ];

  function lab() {
    return window.ElectricalLab || window.LtElectrical || null;
  }

  function jobIdFromText(txt) {
    var L = lab();
    var list = (L && L.JOBS) || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].name && txt.indexOf(list[i].name) !== -1) return list[i].id;
    }
    for (var j = 0; j < MAP.length; j++) {
      if (MAP[j].re.test(txt)) return MAP[j].id;
    }
    return null;
  }

  function onBay() {
    var root = document.getElementById("electrical-root");
    if (!root) return false;
    return /SATURDAY CALLBACK|No-cool at 4:58|Hum, no start/i.test(root.innerText || "");
  }

  function stampCards() {
    if (!onBay()) return;
    var root = document.getElementById("electrical-root");
    var nodes = root.querySelectorAll("div, article, button, section");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.dataset && el.dataset.satArmed === "1") continue;
      var t = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (t.length > 420) continue;
      var id = jobIdFromText(t);
      if (!id) continue;
      if (!/Straight-cool|Heat pump|Gas furnace/i.test(t)) continue;
      el.classList.add("el-job-card");
      el.dataset.job = id;
      el.dataset.satArmed = "1";
      el.style.cursor = "pointer";
    }
  }

  function onClick(ev) {
    if (!onBay()) return;
    var card = ev.target && ev.target.closest ? ev.target.closest(".el-job-card, [data-job]") : null;
    if (!card) return;
    if (ev.target.closest && ev.target.closest("#el-hub, .shop-floor, [data-mode='home']")) return;
    var id = card.dataset.job || jobIdFromText(card.textContent || "");
    if (!id) return;
    ev.preventDefault();
    ev.stopPropagation();
    var L = lab();
    if (L && typeof L.startJob === "function") {
      try {
        L.startJob(id);
      } catch (e) {}
    }
  }

  function boot() {
    if (document.body && document.body.dataset.satArm === "1") return;
    if (document.body) document.body.dataset.satArm = "1";
    document.addEventListener("click", onClick, true);
    setInterval(stampCards, 400);
    stampCards();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
