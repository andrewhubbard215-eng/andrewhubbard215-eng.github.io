/* Phone HVAC testers — magnetometer solenoid, level, sound.
   Training / field aid. Not a listed meter. Don't probe live terminals. */
(function (global) {
  "use strict";

  let root = null;
  let hooks = {};
  let tab = "solenoid";
  let mag = null;
  let orientOn = false;
  let soundOn = false;
  let audioCtx = null;
  let micStream = null;
  let raf = 0;
  let baseline = 0;
  let lastB = 0;
  let magX = 0;
  let magY = 0;
  let magZ = 0;
  let magBuf = [];
  let magSrc = "off";
  let headingBuf = [];
  let levelBeta = 0;
  let levelGamma = 0;
  let rms = 0;

  function hypot3(x, y, z) {
    return Math.sqrt(x * x + y * y + z * z);
  }

  function stopSensors() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    if (mag) {
      try {
        mag.stop();
      } catch (_) {}
      mag = null;
    }
    if (orientOn) {
      window.removeEventListener("deviceorientation", onOrient);
      orientOn = false;
    }
    if (micStream) {
      micStream.getTracks().forEach((t) => t.stop());
      micStream = null;
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (_) {}
      audioCtx = null;
    }
    soundOn = false;
  }

  function onOrient(e) {
    const h = e.webkitCompassHeading != null ? e.webkitCompassHeading : e.alpha;
    if (h != null && !isNaN(h)) {
      headingBuf.push(h);
      if (headingBuf.length > 20) headingBuf.shift();
      let v = 0;
      for (let i = 1; i < headingBuf.length; i++) {
        let d = Math.abs(headingBuf[i] - headingBuf[i - 1]);
        if (d > 180) d = 360 - d;
        v += d;
      }
      lastB = headingBuf.length > 2 ? v : lastB;
      magSrc = magSrc === "magnetometer" ? magSrc : "compass";
    }
    if (e.beta != null) levelBeta = e.beta;
    if (e.gamma != null) levelGamma = e.gamma;
  }

  async function askOrient() {
    try {
      if (typeof DeviceOrientationEvent !== "undefined" && DeviceOrientationEvent.requestPermission) {
        const p = await DeviceOrientationEvent.requestPermission();
        if (p !== "granted") return false;
      }
    } catch (_) {}
    if (!orientOn) {
      window.addEventListener("deviceorientation", onOrient, true);
      orientOn = true;
    }
    return true;
  }

  async function startMag() {
    await askOrient();
    if (typeof Magnetometer === "undefined") {
      return "compass";
    }
    try {
      mag = new Magnetometer({ frequency: 20 });
      mag.addEventListener("reading", () => {
        magX = mag.x;
        magY = mag.y;
        magZ = mag.z;
        lastB = hypot3(mag.x, mag.y, mag.z);
        magBuf.push(lastB);
        if (magBuf.length > 40) magBuf.shift();
        magSrc = "magnetometer";
      });
      mag.addEventListener("error", () => {});
      mag.start();
      return "magnetometer";
    } catch (_) {
      return "compass";
    }
  }

  async function startMic() {
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaStreamSource(micStream);
      const an = audioCtx.createAnalyser();
      an.fftSize = 1024;
      src.connect(an);
      const buf = new Uint8Array(an.fftSize);
      soundOn = true;
      function tick() {
        if (!soundOn) return;
        an.getByteTimeDomainData(buf);
        let s = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          s += v * v;
        }
        rms = Math.sqrt(s / buf.length);
        raf = requestAnimationFrame(tick);
        paintSound();
      }
      tick();
      return true;
    } catch (err) {
      return false;
    }
  }

  function coilStatus() {
    const delta = Math.abs(lastB - baseline);
    const magMode = !!mag;
    if (magMode) {
      if (delta > 80) return { t: "COIL LIVE", cls: "live", d: "Strong field vs zero. 24V coil is almost certainly energized. Confirm with a meter on the terminals if you need voltage." };
      if (delta > 25) return { t: "FIELD UP", cls: "maybe", d: "Field rose. Get the back of the phone on the coil body — not the screws." };
      return { t: "NO FIELD", cls: "dead", d: "Looks like residual earth field. Coil open, bad board, or you're too far." };
    }
    if (delta > 40) return { t: "COMPASS JUMPING", cls: "live", d: "Heading is thrashing — typical of an AC coil. Confirm with a meter." };
    if (delta > 12) return { t: "UNSTEADY", cls: "maybe", d: "Some motion. Hold still on the coil, then compare to zero." };
    return { t: "STEADY", cls: "dead", d: "Compass is quiet. Coil may be dead — or iOS hasn't granted motion." };
  }

  function paintSolenoid() {
    const st = coilStatus();
    const val = root.querySelector("#ptool-b");
    const lab = root.querySelector("#ptool-st");
    const why = root.querySelector("#ptool-why");
    const bar = root.querySelector("#ptool-bar > i");
    if (val) val.textContent = mag ? lastB.toFixed(0) + " µT" : lastB.toFixed(0) + " jitter";
    if (lab) {
      lab.textContent = st.t;
      lab.className = "ptool-st " + st.cls;
    }
    if (why) why.textContent = st.d;
    const xyz = root.querySelector("#ptool-xyz");
    if (xyz) {
      let ripple = 0;
      if (magBuf.length > 4) {
        const mean = magBuf.reduce((a, b) => a + b, 0) / magBuf.length;
        ripple = Math.sqrt(magBuf.reduce((a, b) => a + (b - mean) * (b - mean), 0) / magBuf.length);
      }
      xyz.innerHTML = mag
        ? "<span>X " + magX.toFixed(1) + "</span><span>Y " + magY.toFixed(1) + "</span><span>Z " + magZ.toFixed(1) + "</span><span>|B| " +
          lastB.toFixed(1) + " µT</span><span>Δ " + Math.abs(lastB - baseline).toFixed(1) + "</span><span>ripple " +
          ripple.toFixed(1) + "</span>"
        : "<span>compass jitter " + lastB.toFixed(1) + "</span><span>Δ " + Math.abs(lastB - baseline).toFixed(1) + "</span><span>Earth ~25–65 µT</span>";
    }
    if (bar) {
      const pct = mag ? Math.min(100, (Math.abs(lastB - baseline) / 200) * 100) : Math.min(100, lastB);
      bar.style.width = pct + "%";
      bar.className = st.cls;
    }
  }

  function paintLevel() {
    const pitch = root.querySelector("#ptool-pitch");
    const roll = root.querySelector("#ptool-roll");
    const bubble = root.querySelector("#ptool-bubble");
    const slope = root.querySelector("#ptool-slope");
    if (pitch) pitch.textContent = levelBeta.toFixed(1) + "°";
    if (roll) roll.textContent = levelGamma.toFixed(1) + "°";
    if (bubble) {
      const x = Math.max(-40, Math.min(40, levelGamma * 1.4));
      const y = Math.max(-40, Math.min(40, levelBeta * 1.4));
      bubble.style.transform = "translate(" + x + "px," + y + "px)";
    }
    if (slope) {
      const g = Math.abs(levelBeta);
      const ok = g >= 1.0 && g <= 3.5;
      slope.textContent = ok
        ? "Drain slope looks like ~¼\" per foot. Confirm with a real level."
        : g < 1
          ? "Almost flat — condensate may sit. Mini-split wants slope out."
          : "Steep. Check the unit isn't racked.";
    }
  }

  function paintSound() {
    const el = root.querySelector("#ptool-db");
    const lab = root.querySelector("#ptool-snd");
    if (!el) return;
    const approx = Math.max(0, Math.round(20 * Math.log10(rms + 0.0001) + 70));
    el.textContent = approx + " (rel)";
    if (lab) {
      lab.textContent = rms < 0.02 ? "Quiet — compressor likely off" : rms < 0.08 ? "Running / airflow" : "Loud — don't use this as a tach";
    }
    const bar = root.querySelector("#ptool-sbar > i");
    if (bar) bar.style.width = Math.min(100, rms * 400) + "%";
  }

  function loop() {
    if (tab === "solenoid") paintSolenoid();
    if (tab === "level") paintLevel();
    raf = requestAnimationFrame(loop);
  }

  function render() {
    if (!root) return;
    root.innerHTML =
      '<div class="ptool-shell">' +
      '<header class="ptool-head"><div><p class="eyebrow">Phone testers</p><h2>Field sensors</h2></div>' +
      '<button class="btn" id="ptool-hub">Shop floor</button></header>' +
      '<p class="ptool-warn">Not a listed meter. Do not put the phone on live terminals, capacitors, or inside a disconnect. Coil body / cabinet only. Confirm voltage with a DMM.</p>' +
      '<div class="ptool-tabs">' +
      '<button class="btn' + (tab === "solenoid" ? " primary" : "") + '" data-t="solenoid">Solenoid / coil</button>' +
      '<button class="btn' + (tab === "level" ? " primary" : "") + '" data-t="level">Level / drain</button>' +
      '<button class="btn' + (tab === "sound" ? " primary" : "") + '" data-t="sound">Running?</button>' +
      '<button class="btn' + (tab === "ideas" ? " primary" : "") + '" data-t="ideas">What else</button>' +
      "</div>" +
      '<div id="ptool-body"></div></div>';
    root.querySelector("#ptool-hub").onclick = () => {
      stopSensors();
      if (hooks.onHub) hooks.onHub();
    };
    root.querySelectorAll("[data-t]").forEach((b) => {
      b.onclick = () => {
        tab = b.getAttribute("data-t");
        render();
      };
    });
    const body = root.querySelector("#ptool-body");
    if (tab === "solenoid") {
      body.innerHTML =
        "<h3>Solenoid / contactor coil</h3>" +
        "<p>Zero away from the unit. Hold the <strong>back of the phone on the coil plastic</strong> (reversing valve, liquid line solenoid, contactor coil). A live 24V coil makes a magnetic field. Dead coil doesn't.</p>" +
        '<p class="ptool-st dead" id="ptool-st">ZERO FIRST</p>' +
        '<p class="pt-sat" id="ptool-b">—</p>' +
        '<div class="ptool-meter" id="ptool-bar"><i></i></div>' +
        '<p class="ptool-xyz" id="ptool-xyz">X — Y — Z — |B| —</p>' +
        '<p id="ptool-why" class="pt-note"></p>' +
        '<div class="row"><button class="btn primary" id="ptool-zero">Zero here</button>' +
        '<button class="btn" id="ptool-go">Enable sensors</button></div>' +
        "<p class='pt-note'>Chrome/Android magnetometer is best. iPhone uses compass jitter — still works next to a pulled-in coil.</p>";
      body.querySelector("#ptool-zero").onclick = () => {
        baseline = lastB;
        paintSolenoid();
      };
      body.querySelector("#ptool-go").onclick = async () => {
        const kind = await startMag();
        const st = root.querySelector("#ptool-why");
        if (st) st.textContent = kind === "magnetometer" ? "Magnetometer live. Zero, then kiss the coil." : "Compass fallback. Zero, then hold still on the coil.";
        if (!raf) loop();
      };
      if (!raf) loop();
    } else if (tab === "level") {
      body.innerHTML =
        "<h3>IDU / drain slope</h3>" +
        "<p>Lay the phone on the indoor chassis or along the drain. Mini-split heads want <strong>level left-right</strong> and a little pitch toward the drain (~¼″ per foot ≈ 1.2°).</p>" +
        '<div class="ptool-level"><span id="ptool-bubble"></span></div>' +
        '<p>Pitch <strong id="ptool-pitch">0°</strong> · Roll <strong id="ptool-roll">0°</strong></p>' +
        '<p id="ptool-slope" class="pt-note"></p>' +
        '<button class="btn primary" id="ptool-lv">Enable level</button>';
      body.querySelector("#ptool-lv").onclick = async () => {
        await askOrient();
        if (!raf) loop();
      };
      askOrient().then(() => {
        if (!raf) loop();
      });
    } else if (tab === "sound") {
      body.innerHTML =
        "<h3>Is it running?</h3>" +
        "<p>Mic as a cheap 'is the compressor / indoor fan making noise' check. Relative only — not dB(A), not a bearing diagnosis.</p>" +
        '<p class="pt-sat" id="ptool-db">—</p>' +
        '<div class="ptool-meter" id="ptool-sbar"><i></i></div>' +
        '<p id="ptool-snd" class="pt-note">Mic off</p>' +
        '<button class="btn primary" id="ptool-mic">Enable mic</button>';
      body.querySelector("#ptool-mic").onclick = () => startMic();
    } else {
      body.innerHTML =
        "<h3>What a phone can (and can't) test</h3>" +
        "<ul class='ptool-ideas'>" +
        "<li><strong>Solenoid / contactor coil</strong> — magnetometer. That's this tab. 24V coil field, not voltage.</li>" +
        "<li><strong>Level / drain slope</strong> — gyro. Mini-split head, furnace, condensate.</li>" +
        "<li><strong>Running / quiet</strong> — mic. Compressor or blower making noise.</li>" +
        "<li><strong>Flashlight + camera</strong> — dirty coil, oil stain (leak), clogged filter. Use your eyes, not an app.</li>" +
        "<li><strong>Compass near a transformer</strong> — same mag trick as the coil.</li>" +
        "<li><strong>Job GPS / notes / photo of the nameplate</strong> — MCA, MOP, charge. Commandment 7.</li>" +
        "</ul>" +
        "<p class='ptool-warn'>A phone is <em>not</em>: a voltmeter, clamp-on amp, micron gauge, refrigerant identifier, or IR thermometer (battery temp ≠ air). Don't fake those. Use the DMM and manifold in the sim — and real tools on the job.</p>";
    }
  }

  function start(host, opts) {
    stopSensors();
    root = host;
    hooks = opts || {};
    tab = "solenoid";
    baseline = 0;
    lastB = 0;
    render();
    return {
      stop() {
        stopSensors();
      },
    };
  }

  global.PhoneTools = { start };
})(window);
