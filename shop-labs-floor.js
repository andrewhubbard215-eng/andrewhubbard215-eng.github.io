/* Shop lab packets locker. Lincoln catalog stays on campus SKU. Filler is the 90-min bay. */
(function (global) {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function courseCode(code) {
    if (global.LtBrand && global.LtBrand.course) return global.LtBrand.course(code);
    return code;
  }

  function isStore() {
    return !!(global.LtBrand && global.LtBrand.isStore);
  }

  function remap(text) {
    if (global.LtBrand && global.LtBrand.remapHcr) return global.LtBrand.remapHcr(String(text || ""));
    return String(text || "");
  }

  function listOf(arr) {
    return (arr || [])
      .map(function (s) {
        return "<li>" + esc(remap(s)) + "</li>";
      })
      .join("");
  }

  function packetHtml(lab, instructor) {
    var holds = lab.holds || [];
    var proc = (lab.procedure || [])
      .map(function (s, i) {
        var hold = holds.filter(function (h) {
          return h.step === i + 1;
        })[0];
        return (
          "<li>" +
          esc(remap(s)) +
          (hold
            ? '<p class="lab-hold">Hold — instructor. ' + esc(remap(hold.lookFor)) + "</p>"
            : "") +
          "</li>"
        );
      })
      .join("");
    var cols = lab.dataColumns || [];
    var head = cols.map(function (c) {
      return "<th>" + esc(c) + "</th>";
    }).join("");
    var rows = "";
    for (var r = 0; r < (lab.dataRows || 6); r++) {
      rows += "<tr>" + cols.map(function () { return "<td></td>"; }).join("") + "</tr>";
    }
    var instructorBits = "";
    if (instructor) {
      if (lab.openScript) {
        instructorBits +=
          '<section class="lab-inst"><h3>Say this at the door</h3><p>' +
          esc(remap(lab.openScript)) +
          "</p></section>";
      }
      if (lab.setup && lab.setup.length) {
        instructorBits +=
          '<section class="lab-inst"><h3>Setup</h3><ol>' + listOf(lab.setup) + "</ol></section>";
      }
      if (lab.instructorRun && lab.instructorRun.length) {
        instructorBits +=
          '<section class="lab-inst"><h3>How you run the bay</h3><ol>' +
          listOf(lab.instructorRun) +
          "</ol></section>";
      }
      if (lab.plantFaults && lab.plantFaults.length) {
        instructorBits +=
          '<section class="lab-inst"><h3>Faults to plant</h3><ul>' +
          listOf(lab.plantFaults) +
          "</ul></section>";
      }
      if (lab.failLooksLike && lab.failLooksLike.length) {
        instructorBits +=
          '<section class="lab-inst"><h3>What a fail looks like</h3><ul>' +
          listOf(lab.failLooksLike) +
          "</ul></section>";
      }
    }
    var comps = (lab.competencies || [])
      .map(function (c) {
        return "<tr><td>" + esc(c.label) + "</td><td>☐</td><td></td></tr>";
      })
      .join("");
    var tag =
      lab.source === "lincoln"
        ? "Lincoln catalog packet"
        : lab.series === "plywood"
          ? "Plywood electrical wall · HVAC parts"
          : "Shop filler · 90-minute bay";
    return (
      '<article class="lab-sheet">' +
      '<p class="eyebrow">' +
      esc(tag) +
      " · " +
      esc(courseCode(lab.courseCode)) +
      "</p>" +
      "<h2>" +
      esc(remap(lab.title)) +
      "</h2>" +
      "<p>" +
      lab.durationMin +
      " min · " +
      esc(lab.groupSize) +
      "</p>" +
      (lab.why ? "<p>" + esc(remap(lab.why)) + "</p>" : "") +
      instructorBits +
      "<h3>Objectives</h3><ul>" +
      listOf(lab.objectives) +
      "</ul>" +
      "<h3>Safety</h3><ul>" +
      listOf(lab.safety) +
      "</ul>" +
      "<h3>Procedure</h3><ol>" +
      proc +
      "</ol>" +
      "<h3>Data</h3><table><thead><tr>" +
      head +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      (lab.passLine ? "<h3>Pass line</h3><p>" + esc(remap(lab.passLine)) + "</p>" : "") +
      "<h3>Sign-off</h3><table><thead><tr><th>Skill</th><th>Pass</th><th>Instructor</th></tr></thead><tbody>" +
      comps +
      "</tbody></table>" +
      "<p class='muted'>Practice lab. Instructor-created. Not official school curriculum.</p>" +
      "</article>"
    );
  }

  function start(root) {
    if (!root) return;
    if (!document.getElementById("shop-labs-css")) {
      var css = document.createElement("style");
      css.id = "shop-labs-css";
      css.textContent =
        ".lab-sheet{background:#f4efe4;color:#1a1714;padding:20px;border-radius:8px}" +
        ".lab-sheet h2,.lab-sheet h3{font-family:Oswald,Impact,sans-serif;letter-spacing:.04em}" +
        ".lab-sheet table{width:100%;border-collapse:collapse;font-size:13px}" +
        ".lab-sheet th,.lab-sheet td{border:1px solid #c9c0b0;padding:6px}" +
        ".lab-hold{margin:6px 0 0;padding-left:8px;border-left:2px solid #444;font-size:12px;text-transform:uppercase}" +
        ".lab-inst{border:2px solid #1a1714;padding:12px;margin:12px 0;background:#efe8d8}" +
        "@media print{.no-print{display:none!important}body{background:#fff}#app .screen{display:none}#screen-shoplabs{display:block!important}}";
      document.head.appendChild(css);
    }
    var filler = global.SHOP_LABS || [];
    var lincoln = isStore() ? [] : global.LINCOLN_CATALOG_LABS || [];
    var wall = global.WALL_LABS || [];
    var showing = null;
    var instructor = true;

    function paintList() {
      showing = null;
      var wallCards = wall
        .map(function (l) {
          return (
            '<button type="button" class="mode-card" data-lab="' +
            esc(l.id) +
            '"><p class="eyebrow">Plywood wall · ' +
            l.durationMin +
            " min</p><h3>" +
            esc(remap(l.title)) +
            "</h3><p>" +
            esc(courseCode(l.courseCode)) +
            " · HVAC parts</p></button>"
          );
        })
        .join("");
      var lincolnCards = lincoln
        .map(function (l) {
          return (
            '<button type="button" class="mode-card" data-lab="' +
            esc(l.id) +
            '"><p class="eyebrow">Lincoln catalog</p><h3>' +
            esc(remap(l.title)) +
            "</h3><p>" +
            esc(courseCode(l.courseCode)) +
            " · " +
            l.durationMin +
            " min</p></button>"
          );
        })
        .join("");
      var fillerCards = filler
        .map(function (l) {
          return (
            '<button type="button" class="mode-card" data-lab="' +
            esc(l.id) +
            '"><p class="eyebrow">Shop filler · 90 min</p><h3>' +
            esc(remap(l.title)) +
            "</h3><p>" +
            esc(courseCode(l.courseCode)) +
            " · instructor card</p></button>"
          );
        })
        .join("");
      root.innerHTML =
        '<header class="hub-head"><h2>Lab packets</h2><button type="button" class="btn" id="labs-hub">Shop floor</button></header>' +
        '<div class="panel" style="margin:12px;max-width:920px">' +
        '<p><a class="btn primary" href="labs-print.html?wall=1">Print hang list + instructor map</a></p>' +
        (isStore()
          ? "<p>90-minute shop bays plus the plywood electrical wall. HVAC parts. Easy hops.</p>"
          : "<p>Lincoln catalog stays as assigned. Plywood wall is the electrical class. Shop filler is the 90-minute instructor run.</p>") +
        (wallCards
          ? '<p class="eyebrow">Plywood electrical wall</p><div class="hub-grid">' + wallCards + "</div>"
          : "") +
        (lincolnCards
          ? '<p class="eyebrow">Lincoln catalog</p><div class="hub-grid">' + lincolnCards + "</div>"
          : "") +
        '<p class="eyebrow" style="margin-top:16px">Shop filler</p><div class="hub-grid">' +
        fillerCards +
        "</div></div>";
      var hub = document.getElementById("labs-hub");
      if (hub) hub.onclick = function () {
        if (global.ltPlay) global.ltPlay("hub");
      };
      root.querySelectorAll("[data-lab]").forEach(function (btn) {
        btn.onclick = function () {
          paintOne(btn.getAttribute("data-lab"));
        };
      });
    }

    function find(id) {
      var all = lincoln.concat(filler, wall);
      for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
      return null;
    }

    function paintOne(id) {
      var lab = find(id);
      if (!lab) return paintList();
      showing = lab;
      root.innerHTML =
        '<header class="hub-head no-print"><button type="button" class="btn" id="labs-back">All packets</button>' +
        '<a class="btn primary" href="labs-print.html?id=' +
        encodeURIComponent(lab.id) +
        '">Print with instructor</a>' +
        '<a class="btn" href="labs-print.html?id=' +
        encodeURIComponent(lab.id) +
        '&student=1">Student only</a></header>' +
        '<div id="labs-print-root" style="margin:12px;max-width:720px">' +
        packetHtml(lab, true) +
        "</div>";
      document.getElementById("labs-back").onclick = paintList;
    }

    paintList();
  }

  global.ShopLabs = { start: start };
})(window);
