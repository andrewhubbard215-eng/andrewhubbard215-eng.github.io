/* Standalone lab print — instructor copy by default. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }

  function courseCode(code) {
    if (window.LtBrand && window.LtBrand.course) return window.LtBrand.course(code);
    return code;
  }

  function remap(text) {
    if (window.LtBrand && window.LtBrand.remapHcr) return window.LtBrand.remapHcr(String(text || ""));
    return String(text || "");
  }

  function list(arr, tag) {
    tag = tag || "ul";
    var inner = (arr || [])
      .map(function (s) {
        return "<li>" + esc(remap(s)) + "</li>";
      })
      .join("");
    return "<" + tag + ">" + inner + "</" + tag + ">";
  }

  function allLabs() {
    var store = window.LtBrand && window.LtBrand.isStore;
    var out = [];
    if (window.WALL_LABS) out = out.concat(window.WALL_LABS);
    if (!store && window.LINCOLN_CATALOG_LABS) out = out.concat(window.LINCOLN_CATALOG_LABS);
    if (window.SHOP_LABS) out = out.concat(window.SHOP_LABS);
    return out;
  }

  function find(id) {
    var all = allLabs();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  function instBlock(title, html) {
    return '<section class="lab-inst"><h3>' + esc(title) + "</h3>" + html + "</section>";
  }

  function packet(lab, instructor) {
    var holds = lab.holds || [];
    var proc = (lab.procedure || [])
      .map(function (s, i) {
        var hold = null;
        for (var h = 0; h < holds.length; h++) if (holds[h].step === i + 1) hold = holds[h];
        return (
          "<li>" +
          esc(remap(s)) +
          (hold ? '<p class="lab-hold">Hold — instructor. ' + esc(remap(hold.lookFor)) + "</p>" : "") +
          "</li>"
        );
      })
      .join("");
    var cols = lab.dataColumns || [];
    var head = cols
      .map(function (c) {
        return "<th>" + esc(c) + "</th>";
      })
      .join("");
    var rows = "";
    for (var r = 0; r < (lab.dataRows || 6); r++) {
      rows +=
        "<tr>" +
        cols
          .map(function () {
            return "<td></td>";
          })
          .join("") +
        "</tr>";
    }
    var inst = "";
    if (instructor) {
      inst +=
        '<p class="copy-banner">Instructor copy — door script, setup, holds, faults. Keep off the student stack.</p>';
      if (lab.openScript) inst += instBlock("Say this at the door", "<p>" + esc(remap(lab.openScript)) + "</p>");
      if (lab.timebox) inst += instBlock("Clock", "<p>" + esc(remap(lab.timebox)) + "</p>");
      if (lab.setup && lab.setup.length) inst += instBlock("Setup", list(lab.setup, "ol"));
      if (lab.instructorRun && lab.instructorRun.length)
        inst += instBlock("How you run the bay", list(lab.instructorRun, "ol"));
      if (lab.plantFaults && lab.plantFaults.length) inst += instBlock("Faults to plant", list(lab.plantFaults));
      if (lab.failLooksLike && lab.failLooksLike.length)
        inst += instBlock("What a fail looks like", list(lab.failLooksLike));
    } else {
      inst += '<p class="copy-banner">Student copy — procedure and data only.</p>';
    }
    var analysis = (lab.analysis || [])
      .map(function (q, i) {
        return (
          "<li><p>" +
          esc(remap(q.prompt)) +
          ' <span class="muted">(' +
          (q.points || "") +
          " pts)</span></p><div class='blank'></div><div class='blank'></div></li>"
        );
      })
      .join("");
    var comps = (lab.competencies || [])
      .map(function (c) {
        return "<tr><td>" + esc(c.label) + "</td><td>☐</td><td></td></tr>";
      })
      .join("");
    var tag =
      lab.series === "plywood"
        ? "Plywood electrical wall"
        : lab.source === "lincoln"
          ? "Lincoln catalog packet"
          : "Shop filler · 90-minute bay";
    return (
      '<article class="lab-sheet">' +
      '<p class="eyebrow">' +
      esc(tag) +
      " · " +
      esc(courseCode(lab.courseCode)) +
      "</p>" +
      "<h1>" +
      esc(remap(lab.title)) +
      "</h1>" +
      "<p>" +
      lab.durationMin +
      " min · " +
      esc(lab.groupSize) +
      "</p>" +
      (lab.why ? "<p>" + esc(remap(lab.why)) + "</p>" : "") +
      inst +
      "<h2>Objectives</h2>" +
      list(lab.objectives) +
      "<div class='two'><div><h2>Safety</h2>" +
      list(lab.safety) +
      "</div><div><h2>PPE</h2>" +
      list(lab.ppe) +
      "</div></div>" +
      "<div class='two'><div><h2>Tools</h2>" +
      list(lab.tools) +
      "</div><div><h2>Materials</h2>" +
      list(lab.materials) +
      "</div></div>" +
      "<h2>Procedure</h2><ol>" +
      proc +
      "</ol>" +
      "<h2>Data</h2><table><thead><tr>" +
      head +
      "</tr></thead><tbody>" +
      rows +
      "</tbody></table>" +
      (analysis ? "<h2>Analysis</h2><ol>" + analysis + "</ol>" : "") +
      (lab.passLine ? "<h2>Pass line</h2><p>" + esc(remap(lab.passLine)) + "</p>" : "") +
      "<h2>Sign-off</h2><table><thead><tr><th>Skill</th><th>Pass</th><th>Instructor</th></tr></thead><tbody>" +
      comps +
      "</tbody></table>" +
      "<p class='muted'>Practice lab. Instructor-created. Not official school curriculum. Analysis answers stay on the desk key.</p>" +
      "</article>"
    );
  }

  function wallSheet() {
    var meta = window.WALL_META || { hang: [], bom: [], map: [], wire: [] };
    var map = (meta.map || [])
      .map(function (row) {
        return (
          '<div class="map-row">' +
          row
            .map(function (c) {
              return '<div class="map-cell">' + esc(remap(c)) + "</div>";
            })
            .join("") +
          "</div>"
        );
      })
      .join("");
    var wire = (meta.wire || [])
      .map(function (w) {
        return (
          "<tr><td>" +
          esc(w.color) +
          "</td><td>" +
          esc(w.land) +
          "</td><td>" +
          esc(remap(w.job)) +
          "</td></tr>"
        );
      })
      .join("");
    var labs = (window.WALL_LABS || [])
      .map(function (l) {
        return "<li>" + esc(remap(l.title)) + " (" + l.durationMin + " min)</li>";
      })
      .join("");
    return (
      '<article class="lab-sheet">' +
      '<p class="copy-banner">Instructor copy — hang list. Tape to the side of the wall.</p>' +
      "<h1>Plywood electrical wall</h1>" +
      "<h2>How you hang it</h2>" +
      list(meta.hang, "ol") +
      "<h2>Parts</h2>" +
      list(meta.bom) +
      "<h2>Student-facing map</h2>" +
      '<div class="map">' +
      map +
      "</div>" +
      "<table><thead><tr><th>Color</th><th>Land</th><th>Job</th></tr></thead><tbody>" +
      wire +
      "</tbody></table>" +
      "<h2>Run order</h2><ol>" +
      labs +
      "</ol></article>"
    );
  }

  var params = new URLSearchParams(location.search);
  var student = params.get("student") === "1";
  var wall = params.get("wall") === "1";
  var id = params.get("id") || "";
  var root = document.getElementById("sheet");
  var bar = document.getElementById("bar");
  if (!root) return;

  if (wall) {
    root.innerHTML = wallSheet();
    document.title = "Plywood wall hang list";
  } else {
    var lab = find(id) || allLabs()[0];
    if (!lab) {
      root.innerHTML = "<p>No lab.</p>";
      return;
    }
    root.innerHTML = packet(lab, !student);
    document.title = lab.title;
    id = lab.id;
  }

  if (bar) {
    var back = "index.html";
    bar.innerHTML =
      '<a class="btn" href="' +
      back +
      '">Shop floor</a>' +
      (wall
        ? ""
        : student
          ? '<a class="btn" href="labs-print.html?id=' + encodeURIComponent(id) + '">Instructor copy</a>'
          : '<a class="btn" href="labs-print.html?id=' +
            encodeURIComponent(id) +
            '&student=1">Student only</a>') +
      (wall ? "" : '<a class="btn" href="labs-print.html?wall=1">Hang list</a>') +
      '<button type="button" class="btn primary" id="do-print">Print</button>';
    var btn = document.getElementById("do-print");
    if (btn) btn.onclick = function () {
      window.print();
    };
  }

  if (params.get("print") === "1") {
    setTimeout(function () {
      window.print();
    }, 300);
  }
})();
