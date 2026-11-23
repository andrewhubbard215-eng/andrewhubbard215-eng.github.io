/* Allstars sandbox shop sounds — contactor, compressor hum, OD fan, TXV hiss. No music. */
(function () {
  "use strict";
  var ctx = null;
  var unlocked = false;
  var muted = true;
  var nodes = { hum: null, fan: null };
  var wanted = false;

  function ac() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }
  function unlock() {
    var c = ac();
    if (!c) return;
    if (c.state === "suspended") c.resume();
    unlocked = true;
  }
  function click() {
    var c = ac();
    if (!c || muted || !wanted) return;
    unlock();
    var o = c.createOscillator();
    var g = c.createGain();
    o.type = "square";
    o.frequency.value = 180;
    g.gain.value = 0.0001;
    o.connect(g);
    g.connect(c.destination);
    var t = c.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(60, t + 0.06);
    o.start(t);
    o.stop(t + 0.08);
  }
  function hiss() {
    var c = ac();
    if (!c || muted || !wanted) return;
    unlock();
    var n = c.createBufferSource();
    var buf = c.createBuffer(1, c.sampleRate * 0.22, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.35));
    n.buffer = buf;
    var bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2400;
    bp.Q.value = 0.7;
    var g = c.createGain();
    g.gain.value = 0.12;
    n.connect(bp);
    bp.connect(g);
    g.connect(c.destination);
    n.start();
  }
  function stopLoop(key) {
    if (nodes[key]) {
      try {
        nodes[key].stop();
      } catch (e) {}
      nodes[key] = null;
    }
  }
  function humOn() {
    var c = ac();
    if (!c || muted || !wanted) return;
    unlock();
    stopLoop("hum");
    var o = c.createOscillator();
    var o2 = c.createOscillator();
    var g = c.createGain();
    o.type = "sawtooth";
    o2.type = "sine";
    o.frequency.value = 55;
    o2.frequency.value = 110;
    g.gain.value = 0.04;
    o.connect(g);
    o2.connect(g);
    g.connect(c.destination);
    o.start();
    o2.start();
    nodes.hum = {
      stop: function () {
        try {
          o.stop();
          o2.stop();
        } catch (e) {}
      }
    };
  }
  function fanOn() {
    var c = ac();
    if (!c || muted || !wanted) return;
    unlock();
    stopLoop("fan");
    var n = c.createBufferSource();
    var buf = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    var d = buf.getChannelData(0);
    for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    n.buffer = buf;
    n.loop = true;
    var bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 0.4;
    var g = c.createGain();
    g.gain.value = 0.035;
    n.connect(bp);
    bp.connect(g);
    g.connect(c.destination);
    n.start();
    nodes.fan = n;
  }
  function allOff() {
    stopLoop("hum");
    stopLoop("fan");
  }
  function ensureMuteBtn() {
    var root = document.getElementById("sandbox-root");
    if (!root || document.getElementById("sb-sound-mute")) return;
    var b = document.createElement("button");
    b.type = "button";
    b.id = "sb-sound-mute";
    b.className = "btn sb-sound-mute";
    b.textContent = "Sound off";
    b.title = "Shop sounds — contactor, compressor, OD fan, TXV hiss";
    b.addEventListener("click", function (ev) {
      ev.preventDefault();
      unlock();
      muted = !muted;
      wanted = true;
      b.textContent = muted ? "Sound off" : "Sound on";
      b.classList.toggle("primary", !muted);
      if (muted) allOff();
      else if (running()) {
        click();
        humOn();
        fanOn();
      }
    });
    var toolbar = root.querySelector(".sb-toolbar") || root.querySelector(".sb-main") || root;
    toolbar.appendChild(b);
  }
  function running() {
    var run = document.getElementById("sb-run");
    return !!(run && /stop/i.test(run.textContent || ""));
  }
  function onFirstGesture() {
    wanted = true;
    unlock();
  }
  document.addEventListener(
    "pointerdown",
    function (ev) {
      if (!ev.target || !ev.target.closest) return;
      if (!ev.target.closest("#sandbox-root")) return;
      onFirstGesture();
      ensureMuteBtn();
    },
    true
  );
  document.addEventListener(
    "click",
    function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (!t.closest("#sandbox-root")) return;
      ensureMuteBtn();
      var run = t.closest("#sb-run");
      if (run) {
        onFirstGesture();
        setTimeout(function () {
          if (running()) {
            if (!muted) {
              click();
              setTimeout(hiss, 90);
              humOn();
              fanOn();
            }
          } else allOff();
        }, 40);
        return;
      }
      if (t.closest('[data-part="metering"], .sb-pack')) {
        onFirstGesture();
        if (!muted && wanted) setTimeout(hiss, 30);
      }
      if (t.closest('[data-field="contactor"]')) {
        onFirstGesture();
        if (!muted && wanted) click();
      }
    },
    true
  );
  setInterval(function () {
    ensureMuteBtn();
    if (!running()) allOff();
  }, 800);
})();
