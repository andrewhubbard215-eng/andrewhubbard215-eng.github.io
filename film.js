/* Component film locker — Rex voice, host clip, real metal + live cutaway. */
(function (global) {
  "use strict";

  var FILM = [
    { id: "cycle", title: "Refrigeration cycle", short: "Four boxes. Follow the state, not the picture.", video: "allstars/video/cycle.mp4", audio: "allstars/audio/cycle.mp3", poster: "hub-portrait.jpg" },
    { id: "compressor", title: "Reciprocating compressor", short: "Suction in, discharge out. Never liquid.", video: "allstars/video/compressor.mp4", audio: "allstars/audio/compressor.mp3", poster: "parts/compressor.png" },
    { id: "scroll", title: "Scroll compressor", short: "Host first. Orbiting scroll. Pockets walk to the center. Vapor only.", video: "allstars/video/scroll.mp4", audio: "allstars/audio/scroll.mp3", poster: "parts/compressor.png", noloop: true },
    { id: "condenser", title: "Condenser", short: "Reject heat. Leave as a subcooled liquid.", video: "allstars/video/outdoor.mp4", audio: "allstars/audio/condenser.mp3", poster: "parts/condenser.png" },
    { id: "evaporator", title: "Evaporator", short: "Absorb heat. Leave with superheat.", video: "allstars/video/class.mp4", audio: "allstars/audio/evaporator.mp3", poster: "parts/evaporator.png" },
    { id: "txv", title: "Thermostatic expansion valve", short: "Three forces. It hunts superheat.", video: "allstars/video/talk.mp4", audio: "allstars/audio/txv.mp3", poster: "parts/metering.png" },
    { id: "piston", title: "Fixed orifice / piston", short: "It does not modulate. Charge by superheat.", video: "allstars/video/talk.mp4", audio: "allstars/audio/piston.mp3", poster: "parts/metering.png" },
    { id: "reversing", title: "Reversing valve", short: "Heat pump. Same four boxes, one slide.", video: "allstars/video/outdoor.mp4", audio: "allstars/audio/reversing.mp3", poster: "parts/condenser.png" },
    { id: "furnace", title: "Gas furnace sequence", short: "Call. Prove. Fire. Blow. Learn it cold.", video: "allstars/video/furnace.mp4", audio: "allstars/audio/furnace.mp3", poster: "allstars/eq/gas.jpg" },
    { id: "contactor", title: "Contactor and capacitor", short: "24 volts pulls. Line voltage crosses.", video: "allstars/video/talk.mp4", audio: "allstars/audio/contactor.mp3", poster: "parts/contactor.png" },
    { id: "blower", title: "Blower and airflow", short: "Airflow is capacity. Measure static.", video: "allstars/video/class.mp4", audio: "allstars/audio/blower.mp3", poster: "parts/fanmotor.png" },
    { id: "thermostat", title: "Thermostat landing", short: "R C Y G W. Door sticker is law.", video: "allstars/video/talk.mp4", audio: "allstars/audio/thermostat.mp3", poster: "parts/thermostat.png" },
    { id: "oil", title: "Oil burner", short: "Primary. Cad cell. 140 PSI. Not a gas valve.", video: "allstars/video/oil.mp4", audio: "allstars/audio/oil.mp3", poster: "allstars/eq/oil.jpg" },
    { id: "gas", title: "Gas-fired heat", short: "80% or 90%. Manometer. CO is the fail.", video: "allstars/video/gas.mp4", audio: "allstars/audio/gas.mp3", poster: "allstars/eq/gas.jpg" },
    { id: "hydronic", title: "Hydronic heat", short: "Host first, then internals. Purge before you blame the pump.", video: "allstars/video/hydronic.mp4", audio: "allstars/audio/hydronic.mp3", poster: "allstars/eq/hydronic.jpg", noloop: true },
  ];

  function byId(id) {
    for (var i = 0; i < FILM.length; i++) if (FILM[i].id === id) return FILM[i];
    return FILM[0];
  }

  function bootAnim(id, mount) {
    if (!document.getElementById("film-anim-css")) {
      var link = document.createElement("link");
      link.id = "film-anim-css";
      link.rel = "stylesheet";
      link.href = "film-anim.css?v=2";
      document.head.appendChild(link);
    }
    function run() {
      if (global.LtFilmAnim && typeof global.LtFilmAnim.inject === "function") {
        global.LtFilmAnim.inject(mount, id);
      }
    }
    if (global.LtFilmAnim) {
      run();
      return;
    }
    var s = document.createElement("script");
    s.src = "film-anim.js?v=2";
    s.onload = run;
    document.body.appendChild(s);
  }

  function start(root) {
    if (!root) return;
    var current = FILM[0];
    var audioEl = null;

    function stopVoice() {
      if (audioEl) {
        try {
          audioEl.pause();
          audioEl.currentTime = 0;
        } catch (_) {}
      }
    }

    function paintList() {
      stopVoice();
      var cards = FILM.map(function (f) {
        return (
          '<button type="button" class="mode-card film-card" data-film="' +
          f.id +
          '"><h3>' +
          f.title +
          "</h3><p>" +
          f.short +
          "</p></button>"
        );
      }).join("");
      root.innerHTML =
        '<header class="hub-head">' +
        "<h2>Component film</h2>" +
        '<button type="button" class="btn" data-lt-close-hub>Shop floor</button>' +
        "</header>" +
        '<div class="panel" style="margin:12px;max-width:720px">' +
        "<p class=\"eyebrow\">Professor HUB · Rex</p>" +
        "<p>Fifteen boxes. Real metal plus live cutaway — watch how the part actually moves.</p>" +
        "</div>" +
        '<div class="hub-grid hub-nav" style="padding:8px 12px 24px">' +
        cards +
        "</div>";
      root.querySelectorAll("[data-film]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          paintPlayer(byId(btn.getAttribute("data-film")));
        });
      });
    }

    function paintPlayer(film) {
      stopVoice();
      current = film;
      root.innerHTML =
        '<header class="hub-head">' +
        '<button type="button" class="btn" id="film-back">Library</button>' +
        "<h2>" +
        film.title +
        "</h2>" +
        '<button type="button" class="btn" data-lt-close-hub>Shop floor</button>' +
        "</header>" +
        '<div class="panel" style="margin:12px;max-width:820px">' +
        "<p class=\"eyebrow\">HUB voice · Rex</p>" +
        "<p>" +
        film.short +
        "</p>" +
        '<video id="film-host" playsinline muted poster="' +
        film.poster +
        '" style="width:100%;max-height:240px;background:#111;border-radius:8px"' +
        (film.noloop ? "" : " loop") +
        ">" +
        '<source src="' +
        film.video +
        '" type="video/mp4" />' +
        "</video>" +
        '<div style="display:flex;gap:8px;flex-wrap:wrap;margin:10px 0">' +
        '<button type="button" class="btn primary" id="film-play">Play clip</button>' +
        '<button type="button" class="btn" id="film-voice">HUB voice</button>' +
        "</div>" +
        '<audio id="film-audio" src="' +
        film.audio +
        '" preload="none"></audio>' +
        "</div>";
      var vid = root.querySelector("#film-host");
      audioEl = root.querySelector("#film-audio");
      var back = root.querySelector("#film-back");
      if (back) back.onclick = paintList;
      var play = root.querySelector("#film-play");
      if (play)
        play.onclick = function () {
          if (!vid) return;
          if (vid.paused) {
            vid.play().catch(function () {});
            play.textContent = "Pause clip";
          } else {
            vid.pause();
            play.textContent = "Play clip";
          }
        };
      var voice = root.querySelector("#film-voice");
      if (voice)
        voice.onclick = function () {
          if (!audioEl) return;
          if (audioEl.paused) {
            if (vid) vid.play().catch(function () {});
            audioEl.play().catch(function () {});
            voice.textContent = "HUB talking";
          } else {
            audioEl.pause();
            voice.textContent = "HUB voice";
          }
        };

      bootAnim(film.id, root);

      if (film.id === "hydronic") {
        var box = document.createElement("div");
        box.className = "panel";
        box.style.margin = "12px";
        box.style.maxWidth = "820px";
        box.innerHTML =
          "<p class='eyebrow'>Host first · then internals</p>" +
          "<p>Host, then boiler cutaway, circulator, zone valve, expansion tank. Water, not air.</p>" +
          "<p><b>Parts:</b> boiler makes heat. Circulator moves it. Zone valve or zone pump opens a loop. Expansion tank takes the swell. Relief typically 30 PSI. Cold fill typically 12 PSI.</p>" +
          "<p><b>Prove:</b> cold fill. Tank air side matches. Purge last zone hot. Delta T. Then you may talk bad pump.</p>" +
          "<p><b>Do not:</b> fire dry. Jump the LWCO. Swap a circulator before you purge.</p>";
        root.appendChild(box);
      }

      if (film.id === "scroll") {
        var sbox = document.createElement("div");
        sbox.className = "panel";
        sbox.style.margin = "12px";
        sbox.style.maxWidth = "820px";
        sbox.innerHTML =
          "<p class='eyebrow'>Host first · then internals</p>" +
          "<p>Host unit first. Then orbiting scroll, fixed scroll, pockets walking to center. Vapor only.</p>" +
          "<p><b>Parts:</b> orbiting scroll. Fixed scroll. Suction at the rim. Discharge at the center. Check valve on many scrolls.</p>" +
          "<p><b>Prove:</b> suction and discharge pressures make sense. Amp draw. Superheat. Liquid in the shell kills a scroll.</p>" +
          "<p><b>Do not:</b> flood it. Run it backwards. Blame the scroll before you prove airflow and charge.</p>";
        root.appendChild(sbox);
      }

      if (audioEl)
        audioEl.onended = function () {
          if (voice) voice.textContent = "HUB voice";
        };
    }

    paintList();
  }

  global.LtFilm = { start: start, FILM: FILM };
})(window);
