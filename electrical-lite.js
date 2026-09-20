/* HVAC Allstars — electrical-lite (phone ≤480px). Lug chips + land targets only.
   No portraits, SVG schematics, canvas, intervals, or HUB dock. */
(function (global) {
  "use strict";
  var CHIPS = [
    { id: "R", label: "R", title: "R - 24V hot", color: "#ce0034" },
    { id: "C", label: "C", title: "C - common", color: "#2a2a2a" },
    { id: "Y", label: "Y", title: "Y - cool", color: "#e6b800" },
    { id: "G", label: "G", title: "G - fan", color: "#2f9e44" },
    { id: "W", label: "W", title: "W - heat", color: "#f7f3ea" }
  ];
  var LANDS = [
    { id: "hot", label: "Hot - black", need: "R", bg: "#111", fg: "#f7f3ea" },
    { id: "neu", label: "Neutral - off-white", need: "C", bg: "#e8e0d0", fg: "#111" },
    { id: "gnd", label: "Ground - green", need: "G", bg: "#1b7a32", fg: "#fff" }
  ];
  var CSS =
    "#electrical-root.el-lite{padding:12px;max-width:480px;margin:0 auto;font:15px/1.35 system-ui,sans-serif;color:#f7f3ea;background:#0b1220;min-height:70vh}" +
    "#electrical-root.el-lite .el-lite-head{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px}" +
    "#electrical-root.el-lite h2{margin:0;font-size:1.15rem}" +
    "#electrical-root.el-lite .el-lite-chips,#electrical-root.el-lite .el-lite-lands{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0}" +
    "#electrical-root.el-lite .el-lug{min-width:48px;min-height:48px;border-radius:10px;border:2px solid #445;font-weight:700;touch-action:manipulation}" +
    "#electrical-root.el-lite .el-lug.pending{outline:3px solid #4cc9f0;outline-offset:2px}" +
    "#electrical-root.el-lite .el-lug.landed{opacity:.55}" +
    "#electrical-root.el-lite .el-lite-msg{min-height:2.4em;margin:8px 0;color:#d8cbb0;font-size:13px}" +
    "#electrical-root.el-lite .el-lite-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}" +
    "#electrical-root.el-lite .btn{min-height:44px;padding:10px 14px;border-radius:10px;border:1px solid #556;background:#1a2438;color:#f7f3ea;font-weight:600}" +
    "#electrical-root.el-lite .btn.primary{background:#CE0034;border-color:#CE0034}" +
    "#electrical-root.el-lite .el-nocool{margin:8px 0 12px;padding:10px 12px;border-radius:12px;border:1px solid #3d4f6a;background:#121a2a}" +
    "#electrical-root.el-lite .el-nocool h3{margin:0 0 6px;font-size:14px;color:#5eead4}" +
    "#electrical-root.el-lite .el-nocool ol{margin:0;padding-left:18px;font-size:13px;line-height:1.45}" +
    "#electrical-root.el-lite .el-nocool li{margin:4px 0}" +
    "#electrical-root.el-lite .el-nocool .el-check{display:flex;flex-direction:column;gap:6px;margin-top:8px}" +
    "#electrical-root.el-lite .el-nocool label{display:flex;align-items:flex-start;gap:8px;min-height:40px;padding:6px 8px;border-radius:8px;background:#0b1220;border:1px solid #2a3548;font-size:13px;touch-action:manipulation}" +
    "#electrical-root.el-lite .el-nocool input{width:18px;height:18px;margin-top:2px;flex:0 0 auto}#electrical-root.el-lite .el-locked{opacity:.55;filter:grayscale(.35);cursor:not-allowed}";

  function injectCss() {
    if (document.getElementById("el-lite-css")) return;
    var s = document.createElement("style");
    s.id = "el-lite-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function start(root, opts) {
    if (!root) return { stop: function () {}, getHubBtn: function () { return null; } };
    injectCss();
    opts = opts || {};
    var pending = null;
    var landed = {};
    var step = 0;
    var guide = !!opts.guide;
    var defuse = !!opts.defuse;
    var ncChecked = {
      call: false, v240: false, disc: false, rc: false, y: false,
      hpc: false, lpc: false, float: false, coil: false, t1: false, comp: false
    };
    var NC_NEED = 11;
    var title = defuse ? "Saturday callback - lite" : guide ? "Land lugs - lite" : "Follow the call - lite";

    function sheetReady() {
      if (!defuse) return true;
      var n = 0;
      for (var key in ncChecked) if (ncChecked[key]) n++;
      return n >= NC_NEED;
    }

    function msg(t) {
      var m = root.querySelector("#el-lite-msg");
      if (m) m.textContent = t;
    }

    function paint() {
      root.className = (root.className || "").replace(/\bel-lite\b/g, "").trim() + " el-lite";
      var chips = CHIPS.map(function (c) {
        var cls = "el-lug el-wire-btn" + (pending === c.id ? " pending" : "") + (defuse && !sheetReady() ? " el-locked" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-lug="chip.' +
          c.id +
          '" data-chip="' +
          c.id +
          '" title="' +
          c.title +
          '" style="background:' +
          c.color +
          ";color:" +
          (c.id === "W" || c.id === "Y" ? "#111" : "#fff") +
          '">' +
          c.label +
          "</button>"
        );
      }).join("");
      var lands = LANDS.map(function (l) {
        var done = !!landed[l.id];
        var cls = "el-lug el-mode-btn" + (done ? " landed" : "") + (defuse && !sheetReady() ? " el-locked" : "");
        return (
          '<button type="button" class="' +
          cls +
          '" data-lug="land.' +
          l.id +
          '" data-land="' +
          l.id +
          '" data-need="' +
          l.need +
          '" title="' +
          l.label +
          '" style="background:' +
          l.bg +
          ";color:" +
          l.fg +
          '">' +
          (done ? "✓ " : "") +
          l.label +
          "</button>"
        );
      }).join("");
      var sheet = "";
      if (defuse) {
        sheet =
          '<div class="el-nocool" id="el-nocool">' +
          "<h3>No-cool prove path - meter before parts</h3>" +
          "<ol>" +
          "<li>Call — tstat asking for Y?</li>" +
          "<li>240 at the unit / disconnect</li>" +
          "<li>Disconnect pulled — prove safe</li>" +
          "<li>R–C ~24V</li>" +
          "<li>Y under call</li>" +
          "<li>HPC closed / proved</li>" +
          "<li>LPC closed / proved</li>" +
          "<li>Float closed</li>" +
          "<li>Contactor coil</li>" +
          "<li>T1 out of contactor</li>" +
          "<li>Compressor last — not first</li>" +
          "</ol>" +
          '<div class="el-check">' +
          '<label><input type="checkbox" data-nc="call" /> Call / Y present</label>' +
          '<label><input type="checkbox" data-nc="v240" /> 240 at disconnect</label>' +
          '<label><input type="checkbox" data-nc="disc" /> Disconnect safe</label>' +
          '<label><input type="checkbox" data-nc="rc" /> R–C ~24V</label>' +
          '<label><input type="checkbox" data-nc="y" /> Y hot under call</label>' +
          '<label><input type="checkbox" data-nc="hpc" /> HPC proved</label>' +
          '<label><input type="checkbox" data-nc="lpc" /> LPC proved</label>' +
          '<label><input type="checkbox" data-nc="float" /> Float closed</label>' +
          '<label><input type="checkbox" data-nc="coil" /> Coil ohms / 24V</label>' +
          '<label><input type="checkbox" data-nc="t1" /> T1 out checked</label>' +
          '<label><input type="checkbox" data-nc="comp" /> Compressor last</label>' +
          "</div></div>";
      }
      root.innerHTML =
        '<div class="panel el-lite-panel" style="padding:12px">' +
        '<div class="el-lite-head"><h2>' +
        title +
        "</h2></div>" +
        sheet +
        '<p class="eyebrow" style="margin:0;opacity:.85">' +
        (defuse
          ? (sheetReady()
              ? "Sheet clear - land the path - R C Y G W → screws"
              : "Prove path first (11/11) — chips stay locked until then")
          : "Phone path - R C Y G W chips → land targets") +
        "</p>" +
        '<div id="el-lugs-wrap" class="el-lite-chips">' +
        chips +
        "</div>" +
        '<div id="el-wires" class="el-lite-lands">' +
        lands +
        "</div>" +
        '<p id="el-lite-msg" class="el-lite-msg"></p>' +
        '<div class="el-lite-actions">' +
        '<button type="button" class="btn primary" id="el-lite-next">Next</button>' +
        '<button type="button" class="btn" id="el-hub" data-lt-close-hub>Shop floor</button>' +
        "</div>" +
        '<p style="font-size:12px;opacity:.7;margin-top:10px">No portraits - no SVG - no canvas - full ladder on wider screens.</p>' +
        "</div>";
      bind();
      if (defuse) {
        root.querySelectorAll("[data-nc]").forEach(function (inp) {
          var k = inp.getAttribute("data-nc");
          inp.checked = !!ncChecked[k];
          inp.onchange = function () {
            ncChecked[k] = !!inp.checked;
            var n = 0;
            for (var key in ncChecked) if (ncChecked[key]) n++;
            if (n >= NC_NEED) {
              pending = null;
              paint();
              msg("Prove path clear — now land R/C/Y. You earned the screws; compressor was last.");
            } else {
              pending = null;
              paint();
              msg("No-cool prove " + n + "/" + NC_NEED + " — stay on the path before parts.");
            }
          };
        });
      }
      msg(
        pending
          ? "Holding " + pending + " — tap a land target (black / off-white / green)."
          : defuse
            ? "Saturday callback: tick the no-cool sheet, then land the path."
            : "Tap a color chip (R C Y G W), then a land screw."
      );
    }

    function bind() {
      root.querySelectorAll("[data-chip]").forEach(function (b) {
        b.onclick = function () {
          if (defuse && !sheetReady()) {
            msg("Prove path first — tick all 11 checks. Chips stay locked until 11/11.");
            var sheet = root.querySelector("#el-nocool");
            if (sheet) {
              sheet.style.outline = "3px solid #f59e0b";
              setTimeout(function () { sheet.style.outline = ""; }, 900);
            }
            return;
          }
          pending = b.getAttribute("data-chip");
          paint();
        };
      });
      root.querySelectorAll("[data-land]").forEach(function (b) {
        b.onclick = function () {
          var need = b.getAttribute("data-need");
          var id = b.getAttribute("data-land");
          if (defuse && !sheetReady()) {
            msg("Prove path first — 11/11 before you land a lug.");
            var sheet2 = root.querySelector("#el-nocool");
            if (sheet2) {
              sheet2.style.outline = "3px solid #f59e0b";
              setTimeout(function () { sheet2.style.outline = ""; }, 900);
            }
            return;
          }
          if (!pending) {
            msg("Pick a chip first (R C Y G W).");
            return;
          }
          if (pending !== need) {
            msg(pending + " does not land on " + b.textContent.trim() + " — need " + need + ".");
            return;
          }
          landed[id] = pending;
          msg("Landed " + pending + " on " + b.getAttribute("title") + ".");
          pending = null;
          paint();
        };
      });
      var next = root.querySelector("#el-lite-next");
      if (next) {
        next.onclick = function () {
          step++;
          var tips = defuse
            ? [
                "Prove path: call → 240 → disconnect → R–C → Y → HPC → LPC → float → coil → T1 → compressor last.",
                "240 at the disconnect before you chase 24V. No line voltage = stop there.",
                "R–C dead with a call means transformer/fuse/path — not a bad compressor yet.",
                "HPC/LPC/float are series. An open there kills Y before the coil ever sees 24V.",
                "Coil and T1 before you condemn the compressor. Parts last, prove first."
              ]
            : [
                "Follow the call: meter R to C for 24V before you chase Y.",
                "Land lugs: color to screw — R hot, C common, Y cool, G fan, W heat.",
                "Black = hot land, off-white = neutral, green = ground.",
                "Phone lite stays light so Chrome does not discard the tab."
              ];
          msg(tips[step % tips.length]);
        };
      }
      var hub = root.querySelector("#el-hub");
      if (hub) {
        hub.onclick = function (e) {
          if (e) e.preventDefault();
          if (typeof global.ltGo === "function") global.ltGo("hub");
          else {
            document.querySelectorAll(".screen").forEach(function (s) {
              s.classList.remove("active");
            });
            var h = document.getElementById("screen-hub");
            if (h) h.classList.add("active");
          }
        };
      }
    }

    paint();
    if (defuse) {
      try {
        if (global.LtDrip && typeof global.LtDrip.nudge === "function") global.LtDrip.nudge("meter_open");
      } catch (_) {}
    }
    return {
      stop: function () {
        pending = null;
      },
      getHubBtn: function () {
        return root.querySelector("#el-hub");
      },
      startJob: function () {},
      getState: function () {
        return { lite: true, pending: pending, landed: Object.assign({}, landed), step: step };
      }
    };
  }

  var API = { start: start, lite: true, JOBS: [], KITS: {}, PARTS: {}, WIRE: {} };
  global.ElectricalLab = API;
  global.HVACElectrical = API;
  global.LtElectrical = API;
  global.LtElectricalLite = API;
})(typeof window !== "undefined" ? window : this);
