/* Condenser Lair — shop-floor build. Same move-or-die call. */
const BEATS = [
  {
    id: "pad-dive",
    room: "pad",
    roomNo: 1,
    roomName: "The Pad",
    image: "art/r1.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "The neighbor comes through the hedge wrong. The gauges can wait.",
    call: "DIVE",
    move: "left",
    success: "The condenser takes the hit. The fan guard folds like a ticket.",
    death: "You stayed for the subcool. It stayed for you.",
    windup: 2.5,
    window: 1.65,
    tutorial: true,
  },
  {
    id: "rotor-slam",
    room: "rotor",
    roomNo: 2,
    roomName: "Locked Rotor",
    image: "art/r2.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "It climbs the cabinet. The manifold is the only thing in your hand.",
    call: "SLAM",
    move: "action",
    success: "Brass meets teeth. That was not in the quote.",
    death: "The manifold was not rated for teeth.",
    windup: 2.05,
    window: 1.4,
  },
  {
    id: "rotor-up",
    room: "rotor",
    roomNo: 2,
    roomName: "Locked Rotor",
    image: "art/r2.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Disconnect's humming on the wall. Whip's still hot.",
    call: "REACH",
    move: "up",
    success: "The whip drops. Two-forty goes looking for someone else.",
    death: "You pull the whip too late. The arc finds a path.",
    windup: 1.7,
    window: 1.28,
  },
  {
    id: "gate-right",
    room: "gate",
    roomNo: 3,
    roomName: "Side Gate",
    image: "art/r3.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Latch gives. Two more through. Driveway past the fence is clear.",
    call: "SPRINT",
    move: "right",
    success: "Gravel in your boots. The dog buys you four seconds.",
    death: "The gate was painted shut. So were you.",
    windup: 1.95,
    window: 1.32,
  },
  {
    id: "gate-down",
    room: "gate",
    roomNo: 3,
    roomName: "Side Gate",
    image: "art/r3.jpg",
    deathImage: "art/death-deck.jpg",
    blurb: "The deck boards are coming at your teeth.",
    call: "SLIDE",
    move: "down",
    success: "Splinters. Breath. You still have the ticket book.",
    death: "Deck joist. Forehead. Ticket closed.",
    windup: 1.5,
    window: 1.22,
  },
  {
    id: "slider",
    room: "slider",
    roomNo: 4,
    roomName: "The Slider",
    image: "art/r4.jpg",
    deathImage: "art/death-deck.jpg",
    blurb: "Apron and spatula. Mrs. Pellman is outside, and the slider never bit.",
    call: "SLAM",
    move: "action",
    success: "The slider leaves the track. The apron stays with the balloons.",
    death: "Locked from the inside. Mrs. Pellman is not sorry.",
    windup: 1.9,
    window: 1.32,
  },
  {
    id: "island-duck",
    room: "island",
    roomNo: 5,
    roomName: "The Island",
    image: "art/r5.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "His arm comes across the island at hat height.",
    call: "DUCK",
    move: "down",
    success: "The pendant light pops where your hat was.",
    death: "You duck into the drawer pulls.",
    windup: 1.75,
    window: 1.24,
  },
  {
    id: "island-grab",
    room: "island",
    roomNo: 5,
    roomName: "The Island",
    image: "art/r5.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "Keys and the recovery tank, still on the counter. He's turned.",
    call: "GRAB",
    move: "action",
    success: "Keys in the fist. Tank on the shoulder.",
    death: "You got the keys. It got a handful of shirt.",
    windup: 1.4,
    window: 1.16,
  },
  {
    id: "nitro",
    room: "nitro",
    roomNo: 6,
    roomName: "Nitrogen",
    image: "art/r6.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Hall closet. Forty-pound bottle. The doorway is full.",
    call: "BLAST",
    move: "action",
    success: "The regulator screams. The hall empties.",
    death: "Regulator wide open. Into your own face.",
    windup: 1.85,
    window: 1.26,
  },
  {
    id: "nitro-up",
    room: "nitro",
    roomNo: 6,
    roomName: "Nitrogen",
    image: "art/r6.jpg",
    deathImage: "art/death-deck.jpg",
    blurb: "The bottle tips across the runner. The floor is a bad address.",
    call: "VAULT",
    move: "up",
    success: "Boots clear the steel. You hit the runner running.",
    death: "Tripped on your own bottle. Your students will hear about it.",
    windup: 1.4,
    window: 1.14,
  },
  {
    id: "van-left",
    room: "van",
    roomNo: 7,
    roomName: "The Van",
    image: "art/r7.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "They're thickest by the mailbox. The driver door is the gap.",
    call: "JUKES",
    move: "left",
    success: "Shoulder past the box. A hand takes the clipboard and nothing else.",
    death: "The van was unlocked. You were still introducing yourself.",
    windup: 1.75,
    window: 1.16,
  },
  {
    id: "van-right",
    room: "van",
    roomNo: 7,
    roomName: "The Van",
    image: "art/r7.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The mower sits in the lane. Open grass past the passenger mirror.",
    call: "JUKES",
    move: "right",
    success: "The deck clips a knee that isn't yours. Door is two steps.",
    death: "You argue with a riding mower. The mower wins.",
    windup: 1.32,
    window: 1.1,
  },
  {
    id: "van-slam",
    room: "van",
    roomNo: 7,
    roomName: "The Van",
    image: "art/r7.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "They stack on the driver door. The cylinder's still on your shoulder.",
    call: "SLAM",
    move: "action",
    success: "The door pops. The tank rides in the footwell.",
    death: "You hugged the tank. They hugged you.",
    windup: 1.3,
    window: 1.08,
  },
  {
    id: "lair-down",
    room: "lair",
    roomNo: 8,
    roomName: "The Lair",
    image: "art/r8.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "Pellman swings at hat height.",
    call: "DUCK",
    move: "down",
    success: "A hand like a condenser lid misses the hat.",
    death: "The condenser was the treasure. He kept it. And you.",
    windup: 2.15,
    window: 1.22,
  },
  {
    id: "lair-slam",
    room: "lair",
    roomNo: 8,
    roomName: "The Lair",
    image: "art/r8.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "The disconnect is arcing anyway. The gauges are the brass you've got.",
    call: "SLAM",
    move: "action",
    success: "Brass bridges the contactor. The arc climbs him like a ladder.",
    death: "You check the contactor with your hands. It checks back.",
    windup: 1.4,
    window: 1.08,
  },
  {
    id: "lair-up",
    room: "lair",
    roomNo: 8,
    roomName: "The Lair",
    image: "art/r8.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "He owns the pad. The top panel is the spot that isn't him.",
    call: "VAULT",
    move: "up",
    success: "Boots on the top panel. The fan is a rumor under your soles.",
    death: "You stay on the pad. The pad is his.",
    windup: 1.28,
    window: 1.05,
  },
  {
    id: "lair-right",
    room: "lair",
    roomNo: 8,
    roomName: "The Lair",
    image: "art/r8.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The van door hangs open on the driveway side.",
    call: "DIVE",
    move: "right",
    success: "Vinyl seat, keys, and no mirror check until Maple is gone.",
    death: "One hand on the door. The rest of you stays in the yard.",
    windup: 1.28,
    window: 1.05,
  },
  {
    id: "cap-brake",
    room: "cap",
    roomNo: 9,
    roomName: "LoBuono",
    image: "art/r9.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Dave LoBuono. Skinny, backwards cap, hands already talking. He is in the road.",
    call: "BRAKE",
    move: "action",
    success: "He's in the seat before the sentence ends, meter in hand and no plan.",
    death: "You wave back. The van doesn't stop. Neither do they.",
    windup: 2.1,
    window: 1.35,
  },
  {
    id: "engal-door",
    room: "engal",
    roomNo: 10,
    roomName: "Engal",
    image: "art/r10.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "David Engal. Glasses. Still ranking seats. Something already has him from behind. The driver-side latch still moves.",
    call: "SHUT",
    move: "left",
    success: "You had his wrist. The thing behind him had the rest. The door had to shut.",
    death: "You hold the lecture. It holds you.",
    windup: 2.0,
    window: 1.28,
  },
  {
    id: "starr-go",
    room: "starr",
    roomNo: 11,
    roomName: "Starr",
    image: "art/r11.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Matt Starr. You grew up with him. Dry. He points past the passenger mirror like you're late for lab.",
    call: "GO",
    move: "right",
    success: "He doesn't believe in anything he can't test. This one tests fine.",
    death: "You stayed to argue the theory. Starr was done arguing.",
    windup: 2.05,
    window: 1.26,
  },
  {
    id: "starr-dog",
    room: "starr",
    roomNo: 11,
    roomName: "Starr",
    image: "art/r11.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "The Malinois is still at his knee. Starr already decided.",
    call: "CALL",
    move: "action",
    success: "The Malinois clears the step. Starr stays in the door and debunks nothing else.",
    death: "You go back for him. He told you not to.",
    windup: 1.55,
    window: 1.18,
  },
  {
    id: "bus-plate",
    room: "bus",
    roomNo: 12,
    roomName: "The Bus",
    image: "art/r12.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Matt Lucas. Bald, stocky, Air Force. The plate is on the asphalt. He's got one end.",
    call: "LIFT",
    move: "up",
    success: "He doesn't do panic. You take the other end.",
    death: "The plate comes down without you under it. Almost.",
    windup: 2.0,
    window: 1.28,
  },
  {
    id: "bus-weld",
    room: "bus",
    roomNo: 12,
    roomName: "The Bus",
    image: "art/r12.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "The windows are still glass. Lucas has the rod and the ground clamp.",
    call: "WELD",
    move: "action",
    success: "The bead holds. One nod is the whole compliment.",
    death: "You watch the arc. The arc watches back.",
    windup: 1.45,
    window: 1.16,
  },
  {
    id: "ruso-line",
    room: "ruso",
    roomNo: 13,
    roomName: "Ruso",
    image: "art/r15.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Mike Ruso. Campus president. Shorter, salt-and-pepper, still in shape. He already walked the students out of a worse lot. They are on his shoulder.",
    call: "FALL IN",
    move: "right",
    success: "He doesn't retell it. The line moves because he already did this.",
    death: "You step out of his line. The line was the whole plan.",
    windup: 2.15,
    window: 1.32,
  },
  {
    id: "ruso-rear",
    room: "ruso",
    roomNo: 13,
    roomName: "Ruso",
    image: "art/r15.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Mike stays at the front. The last students are still off the wall.",
    call: "COVER",
    move: "action",
    success: "You take the back. He takes the front. Everybody he brought is still walking.",
    death: "You go up front with him. The back of the line is empty.",
    windup: 1.6,
    window: 1.18,
  },
  {
    id: "manifest-door",
    room: "manifest",
    roomNo: 14,
    roomName: "Manifest",
    image: "art/r13.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Stefany has Hope's carrier. Johnny's in. Mike has the students on the step. LoBuono finished the count. The dog is under a seat.",
    call: "SHUT",
    move: "action",
    success: "Lucas takes the wheel. The door takes the rest.",
    death: "You hold the door for one more. There isn't one more.",
    windup: 2.15,
    window: 1.3,
  },
  {
    id: "wire-left",
    room: "wire",
    roomNo: 15,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "A few miles out. A wreck takes the lane. The driver-side shoulder is open.",
    call: "JUKES",
    move: "left",
    success: "The bumper does the grading. Johnny and Hope stay down.",
    death: "You give the street the lane. The street takes the bus.",
    windup: 1.85,
    window: 1.18,
  },
  {
    id: "wire-right",
    room: "wire",
    roomNo: 15,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Floodlights ahead. The driver side is a wall of them. The passenger shoulder is open.",
    call: "JUKES",
    move: "right",
    success: "Lucas calls the gate like he still has a radio net. Maybe he does.",
    death: "You drift wide. A few miles was the whole plan.",
    windup: 1.4,
    window: 1.1,
  },
  {
    id: "wire-gate",
    room: "wire",
    roomNo: 15,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The gate is opening. Do not stop to explain the condenser.",
    call: "GO",
    move: "up",
    success: "Inside the wire. The school is on the bus.",
    death: "You brake for the sentry. The street doesn't.",
    windup: 1.45,
    window: 1.12,
  },
];

const LIVES = 6;
const ROOM_COUNT = 15;
const CARD = 1.05, HIT = 0.82, DEATH_HOLD = 1.35, BUFFER = 0.16, ESCAPE_BONUS = 5000;
const SKIN = new URLSearchParams(location.search).get("skin") === "legends" ? "legends" : "allstars";
const SHOP = SKIN === "legends" ? "../legends/" : "../";
const KEY = "condenser-lair-" + SKIN;
const WHO = SKIN === "legends"
  ? "You are Andrew Hubbard. HVAC instructor, side work on your day off. Then you go back for the school."
  : "You are Andrew Hubbard. Lincoln Tech instructor, side work on your day off. Then you go back for the school.";

const motionOk = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pad = (n) => String(n).padStart(6, "0");
const clock = (t) => { const s = Math.floor(t); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function loadBest() { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } }
function writeBest(n) { try { localStorage.setItem(KEY, String(n)); } catch (e) {} }
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

let ac = null, master = null, musicBus = null, sfxBus = null, noiseBuf = null;
let droneA = null, droneB = null, droneGain = null, fanGain = null, isMuted = false;
function unlock() {
  if (!ac) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    ac = new Ctx();
    master = ac.createGain(); musicBus = ac.createGain(); sfxBus = ac.createGain();
    musicBus.gain.value = 0.9; sfxBus.gain.value = 0.85; master.gain.value = isMuted ? 0 : 1;
    musicBus.connect(master); sfxBus.connect(master); master.connect(ac.destination);
    noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    droneGain = ac.createGain(); droneGain.gain.value = 0.08; droneGain.connect(musicBus);
    droneA = ac.createOscillator(); droneB = ac.createOscillator();
    droneA.type = "sine"; droneB.type = "triangle"; droneA.frequency.value = 55; droneB.frequency.value = 82.5;
    const a = ac.createGain(), b = ac.createGain(); a.gain.value = 0.45; b.gain.value = 0.18;
    droneA.connect(a); a.connect(droneGain); droneB.connect(b); b.connect(droneGain); droneA.start(); droneB.start();
    fanGain = ac.createGain(); fanGain.gain.value = 0.03;
    const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = 380; filter.Q.value = 0.7;
    const fan = ac.createBufferSource(); fan.buffer = noiseBuf; fan.loop = true;
    fan.connect(filter); filter.connect(fanGain); fanGain.connect(musicBus); fan.start();
  }
  if (ac.state === "suspended") ac.resume();
}
function toggleMute() {
  isMuted = !isMuted;
  if (ac && master) master.gain.setTargetAtTime(isMuted ? 0 : 1, ac.currentTime, 0.03);
  return isMuted;
}
function bed(mode) {
  if (!ac || !droneGain) return;
  const now = ac.currentTime;
  droneGain.gain.setTargetAtTime(mode === "play" ? 0.2 : mode === "win" ? 0.12 : mode === "dead" ? 0.04 : 0.09, now, 0.08);
  fanGain.gain.setTargetAtTime(mode === "play" ? 0.055 : mode === "dead" ? 0.012 : 0.03, now, 0.1);
  const fa = mode === "win" ? 73 : mode === "dead" ? 40 : 55;
  const fb = mode === "win" ? 110 : mode === "dead" ? 60 : 82.5;
  droneA.frequency.setTargetAtTime(fa, now, 0.25);
  droneB.frequency.setTargetAtTime(fb, now, 0.25);
}
function tone(freq, dur, type, peak, when, slideTo) {
  if (!ac || !sfxBus) return;
  const t = ac.currentTime + (when || 0);
  const osc = ac.createOscillator(), g = ac.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g); g.connect(sfxBus); osc.start(t); osc.stop(t + dur + 0.02);
}
function burst(dur, peak, band) {
  if (!ac || !sfxBus || !noiseBuf) return;
  const src = ac.createBufferSource(); src.buffer = noiseBuf;
  const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = band; filter.Q.value = 0.6;
  const g = ac.createGain(), t = ac.currentTime;
  g.gain.setValueAtTime(Math.max(0.0002, peak), t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter); filter.connect(g); g.connect(sfxBus); src.start(); src.stop(t + dur);
}
const sfx = {
  stingerStart() { tone(220, 0.12, "square", 0.06); tone(330, 0.16, "square", 0.05, 0.08); tone(440, 0.22, "square", 0.05, 0.16); },
  tick(hot) { if (hot) tone(1480, 0.02, "square", 0.05); else tone(240, 0.055, "square", 0.022); },
  prompt() { tone(880, 0.08, "square", 0.08); tone(1320, 0.11, "square", 0.05, 0.04); },
  nope() { tone(140, 0.09, "square", 0.05, 0, 90); },
  success(action) { tone(523, 0.06, "square", 0.065); tone(659, 0.06, "square", 0.055, 0.045); tone(784, 0.08, "square", 0.05, 0.09); burst(action ? 0.09 : 0.05, action ? 0.16 : 0.06, action ? 680 : 1600); },
  death() { tone(311, 0.32, "sawtooth", 0.08, 0, 42); burst(0.16, 0.2, 120); },
  victory() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, "square", 0.06, i * 0.09)); },
  room() { tone(494, 0.08, "triangle", 0.04); tone(740, 0.12, "triangle", 0.035, 0.07); },
  bed
};

function fresh() {
  return { phase: "title", mode: "guide", beat: 0, lives: LIVES, score: 0, best: loadBest(), bestFlag: false, streak: 0, deaths: 0, t: 0, elapsed: 0, metronome: 0, hitStop: 0, shake: 0, flash: 0, flashKind: "good", reason: "", nudge: "", nudgeT: 0, popup: "", announce: "Condenser Lair." };
}
const sim = fresh();
function arrowsOn() { const b = BEATS[sim.beat]; if (!b) return sim.mode === "guide"; return sim.mode === "guide" || !!b.tutorial; }
function clearedRooms() { if (sim.phase === "victory") return ROOM_COUNT; return Math.max(0, (BEATS[sim.beat] && BEATS[sim.beat].roomNo || 1) - 1); }
function moveWord(m) { return m === "action" ? "slam" : m; }
function enterWindup() {
  sim.phase = "windup"; sim.t = 0; sim.metronome = 0; sim.popup = "";
  sim.announce = BEATS[sim.beat].blurb;
}
function bankBest() {
  if (sim.score > sim.best) { sim.best = sim.score; sim.bestFlag = true; writeBest(sim.score); }
  else sim.bestFlag = false;
}
function succeed(beat) {
  const left = sim.phase === "window" ? Math.max(0, beat.window - sim.t) : BUFFER;
  const gained = 1000 + Math.round(left * 850) + sim.streak * 150;
  sim.score += gained; sim.streak += 1; sim.popup = "+" + gained;
  sim.phase = "hit"; sim.t = 0; sim.hitStop = motionOk() ? 0.06 : 0; sim.shake = motionOk() ? 0.55 : 0;
  sim.flash += 1; sim.flashKind = "good"; sim.reason = beat.success; sim.nudge = ""; sim.announce = beat.success;
  sfx.success(beat.move === "action"); buzz(14);
}
function fail(why) {
  const beat = BEATS[sim.beat];
  sim.lives -= 1; sim.deaths += 1; sim.streak = 0; sim.phase = "death"; sim.t = 0; sim.reason = why; sim.nudge = ""; sim.popup = "";
  sim.shake = motionOk() ? 1 : 0; sim.flash += 1; sim.flashKind = "bad";
  sim.announce = "Hub dies. " + why + " " + (beat ? beat.death : "");
  sfx.death(); buzz([22, 34, 70]);
}
function goNext() {
  const current = BEATS[sim.beat];
  const nextIndex = sim.beat + 1;
  if (nextIndex >= BEATS.length) {
    sim.score += ESCAPE_BONUS; sim.phase = "victory"; sim.popup = ""; bankBest();
    sim.announce = "Inside the wire. The bus is in."; sfx.victory(); sfx.bed("win"); buzz([12, 28, 12, 28, 40]); return;
  }
  const next = BEATS[nextIndex];
  sim.beat = nextIndex; sim.t = 0; sim.popup = "";
  if (next.room !== current.room) { sim.phase = "card"; sim.announce = next.roomName + ". " + next.blurb; sfx.room(); }
  else enterWindup();
}
function acknowledge() {
  if (sim.phase !== "death") return;
  if (sim.lives <= 0) { sim.phase = "gameover"; bankBest(); sim.announce = "Game over."; sfx.bed("dead"); return; }
  const room = BEATS[sim.beat] && BEATS[sim.beat].room;
  let index = sim.beat;
  while (index > 0 && BEATS[index - 1].room === room) index -= 1;
  sim.beat = index; sim.phase = "card"; sim.t = 0; sim.reason = "";
  sim.announce = BEATS[index].roomName + ". Get up."; sfx.bed("play");
}
function startRun(mode) {
  unlock();
  sim.phase = "card"; sim.mode = mode; sim.beat = 0; sim.lives = LIVES; sim.score = 0; sim.streak = 0; sim.deaths = 0;
  sim.t = 0; sim.elapsed = 0; sim.metronome = 0; sim.hitStop = 0; sim.shake = 0; sim.reason = ""; sim.nudge = ""; sim.nudgeT = 0; sim.popup = ""; sim.bestFlag = false;
  sim.announce = BEATS[0].roomName + ". " + BEATS[0].blurb;
  sfx.bed("play"); sfx.stingerStart();
}
function toTitle() { sim.phase = "title"; sim.t = 0; sim.popup = ""; sim.nudge = ""; sim.announce = "Condenser Lair."; sfx.bed("title"); }
function applyInput(move) {
  if (sim.phase === "death") { acknowledge(); return; }
  if (sim.phase === "hit") { if (sim.t > 0.28) goNext(); return; }
  if (sim.phase !== "windup" && sim.phase !== "window") return;
  const beat = BEATS[sim.beat];
  if (!beat) return;
  if (sim.phase === "windup") {
    const remain = beat.windup - sim.t;
    if (remain <= BUFFER && move === beat.move) { succeed(beat); return; }
    if (beat.tutorial) { sim.nudge = "Not yet. Wait for the flash."; sim.nudgeT = 0.9; sim.announce = sim.nudge; sfx.nope(); return; }
    fail("Too soon."); return;
  }
  if (move === beat.move) succeed(beat); else fail("Wrong way.");
}
function advance(dt) {
  if (sim.shake > 0) sim.shake = Math.max(0, sim.shake - dt * 2.3);
  if (sim.nudgeT > 0) { sim.nudgeT -= dt; if (sim.nudgeT <= 0) sim.nudge = ""; }
  if (sim.phase === "title" || sim.phase === "gameover" || sim.phase === "victory") return;
  if (document.hidden) return;
  if (sim.hitStop > 0) { sim.hitStop = Math.max(0, sim.hitStop - dt); return; }
  sim.elapsed += dt; sim.t += dt;
  if (sim.phase === "card") { if (sim.t >= CARD) enterWindup(); return; }
  if (sim.phase === "hit") { if (sim.t >= HIT) goNext(); return; }
  if (sim.phase === "death") { if (sim.t >= DEATH_HOLD) acknowledge(); return; }
  const beat = BEATS[sim.beat]; if (!beat) return;
  if (sim.phase === "windup" || sim.phase === "window") {
    const interval = sim.phase === "windup" ? 0.52 : 0.16;
    sim.metronome += dt;
    if (sim.metronome >= interval) { sim.metronome -= interval; sfx.tick(sim.phase === "window"); }
  }
  if (sim.phase === "windup" && sim.t >= beat.windup) {
    sim.phase = "window"; sim.t = 0; sim.metronome = 0;
    sim.announce = arrowsOn() ? beat.call + ". " + moveWord(beat.move) + "." : "Move now.";
    sfx.prompt();
  } else if (sim.phase === "window" && sim.t >= beat.window) fail("Too late.");
}

const GLYPH = {
  up: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8 L52 36 H40 V56 H24 V36 H12 Z" fill="currentColor"/></svg>',
  down: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 56 L12 28 H24 V8 H40 V28 H52 Z" fill="currentColor"/></svg>',
  left: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 32 L36 12 V24 H56 V40 H36 V52 Z" fill="currentColor"/></svg>',
  right: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M56 32 L28 52 V40 H8 V24 H28 V12 Z" fill="currentColor"/></svg>'
};
const pic = document.getElementById("pic");
const overlay = document.getElementById("overlay");
const wash = document.getElementById("wash");
const meter = document.getElementById("meter");
const meterBar = meter.querySelector("span");
const caption = document.getElementById("caption");
const deck = document.getElementById("deck");
const hud = document.getElementById("hud");
const live = document.getElementById("live");
const cab = document.getElementById("cab");
document.getElementById("shop").href = SHOP;
let lastFlash = 0, lastOverlay = "", lastDeck = "", lastHud = "", lastCaption = "", lastSrc = "";

function frame() {
  if (sim.phase === "victory") return "art/base.jpg";
  if (sim.phase === "title") return "art/title.jpg";
  const beat = BEATS[sim.beat];
  if (!beat) return "art/title.jpg";
  if (sim.phase === "death" || sim.phase === "gameover") return beat.deathImage;
  return beat.image;
}
function captionText() {
  const beat = BEATS[sim.beat];
  if (sim.nudge) return sim.nudge;
  if (!beat) return "";
  if (sim.phase === "hit") return beat.success;
  if (sim.phase === "death") return beat.death;
  if (sim.phase === "gameover") return "The ticket never got written.";
  if (sim.phase === "victory") return "Stefany, Johnny, Hope, Mike Ruso and the students, Lucas, LoBuono, the Malinois. Starr and Engal are not on the manifest.";
  return beat.blurb;
}
function meterOf() {
  const beat = BEATS[sim.beat];
  if (!beat || (sim.phase !== "windup" && sim.phase !== "window")) return null;
  if (sim.phase === "windup") return { kind: "hold", value: Math.min(1, sim.t / beat.windup) };
  const left = 1 - Math.min(1, sim.t / beat.window);
  return { kind: left > 0.34 ? "now" : "hot", value: left };
}
function overlayHtml() {
  const beat = BEATS[sim.beat];
  const showMove = beat && sim.phase === "window" && arrowsOn();
  let html = "";
  if (sim.streak > 1 && sim.phase !== "title" && sim.phase !== "gameover" && sim.phase !== "victory") html += '<div class="streak">' + sim.streak + " HIT</div>";
  if (sim.popup) html += '<div class="popup">' + sim.popup + "</div>";
  if (sim.phase === "card" && beat) html += '<div class="cardslam"><span class="kicker">SCENE ' + String(beat.roomNo).padStart(2,"0") + '</span><h2>' + beat.roomName + '</h2></div>';
  if (showMove) html += '<div class="moveplate">' + (beat.move === "action" ? "" : GLYPH[beat.move]) + "<span>" + beat.call + "</span></div>";
  if (sim.phase === "death") html += '<div class="endcard"><h2 class="stamp">HUB DIES</h2><p class="why">' + sim.reason + '</p></div>';
  if (sim.phase === "gameover") html += '<div class="endcard"><span class="kicker">NO CALLBACK</span><h2 class="danger-title">GAME OVER</h2><p class="stat">' + pad(sim.score) + '</p><p class="stat-sub">' + clearedRooms() + " / " + ROOM_COUNT + " scenes · " + sim.deaths + " deaths · " + clock(sim.elapsed) + "</p>" + (sim.bestFlag ? '<p class="hi">NEW HIGH</p>' : "") + '<p class="stat-sub">BEST ' + pad(sim.best) + "</p></div>";
  if (sim.phase === "victory") html += '<div class="endcard"><span class="kicker">INSIDE THE WIRE</span><h2>BUS IS IN</h2><p class="stat">' + pad(sim.score) + '</p><p class="stat-sub">' + sim.deaths + " deaths · " + clock(sim.elapsed) + " · wire +" + ESCAPE_BONUS + "</p>" + (sim.bestFlag ? '<p class="hi">NEW HIGH</p>' : "") + "</div>";
  return html;
}
function deckHtml() {
  if (sim.phase === "title") {
    return '<div class="choices"><button class="start" data-act="guide">GUIDE</button><button class="ghost" data-act="arcade">NO ARROWS</button><p class="fine">Arrows, WASD, or SLAM. Best ' + pad(sim.best) + "</p></div>";
  }
  if (sim.phase === "gameover" || sim.phase === "victory") {
    return '<div class="choices"><button class="start" data-act="guide">AGAIN</button><button class="ghost" data-act="title">TITLE</button></div>';
  }
  const beat = BEATS[sim.beat];
  const hot = beat && sim.phase === "window" && arrowsOn() ? beat.move : "";
  const btn = (dir, label) => '<button class="padbtn ' + dir + (hot === dir ? " hot" : "") + '" data-move="' + dir + '" aria-label="' + label + '">' + GLYPH[dir].replace('class="glyph"', 'class="glyph"') + "</button>";
  return '<div class="deck"><div class="pad">' + btn("up","Up") + btn("left","Left") + '<span class="nub"></span>' + btn("right","Right") + btn("down","Down") + '</div><div class="deck-side"><button class="slam' + (hot === "action" ? " hot" : "") + '" data-move="action">SLAM</button><p class="legend">' + sim.lives + " lives</p></div></div>";
}
function hudHtml() {
  if (sim.phase === "title") return '<div class="title-hud hud"><span class="free">FREE PLAY</span><span class="best">BEST ' + pad(sim.best) + '</span><button class="iconbtn" id="mute" type="button" aria-label="Mute">' + (isMuted ? "MUTE" : "SND") + "</button></div>";
  const beat = BEATS[sim.beat];
  const room = beat ? '<span class="room"><small>SCENE ' + String(beat.roomNo).padStart(2,"0") + " / " + String(ROOM_COUNT).padStart(2,"0") + "</small>" + beat.roomName + "</span>" : "<span></span>";
  let pips = "";
  for (let i = 0; i < LIVES; i++) pips += '<i class="pip' + (i < sim.lives ? " on" : "") + '"></i>';
  return '<div class="hud"><span class="score">' + pad(sim.score) + "</span>" + room + '<span class="pips">' + pips + '</span><button class="iconbtn" id="mute" type="button" aria-label="Mute">' + (isMuted ? "MUTE" : "SND") + "</button></div>";
}
function paint() {
  const src = frame();
  if (src !== lastSrc) { pic.src = src; lastSrc = src; }
  pic.classList.toggle("is-drifting", sim.phase !== "death" && sim.phase !== "gameover");
  const ov = overlayHtml();
  if (ov !== lastOverlay) { overlay.innerHTML = ov; lastOverlay = ov; }
  if (sim.flash !== lastFlash) {
    lastFlash = sim.flash;
    wash.className = "wash is-" + sim.flashKind;
    void wash.offsetWidth;
    wash.style.animation = "none";
    void wash.offsetWidth;
    wash.style.animation = "";
  }
  const m = meterOf();
  meter.hidden = !m;
  if (m) { meter.className = "meter is-" + m.kind; meterBar.style.transform = "scaleX(" + m.value + ")"; }
  const cap = sim.phase === "title"
    ? ""
    : captionText();
  if (sim.phase === "title") {
    if (caption.dataset.mode !== "title") {
      caption.className = "brief";
      caption.innerHTML = '<div class="who"><img class="medal" src="art/hank.jpg" alt=""><p>' + WHO + '</p></div><ol><li><span>01</span>Watch. The bar fills. Do not move yet.</li><li><span>02</span>When it flashes, hit that direction or SLAM.</li><li><span>03</span>Too soon, wrong way, too late — Hub dies.</li></ol>';
      caption.dataset.mode = "title";
      lastCaption = "title";
    }
  } else if (cap !== lastCaption || caption.dataset.mode === "title") {
    caption.className = "caption";
    caption.textContent = cap;
    caption.dataset.mode = "play";
    lastCaption = cap;
  }
  const d = deckHtml();
  if (d !== lastDeck) { deck.innerHTML = d; lastDeck = d; }
  const h = hudHtml();
  if (h !== lastHud) { hud.innerHTML = h; lastHud = h; }
  const amp = Math.min(8, sim.shake * 7);
  cab.style.transform = amp ? "translate(" + ((Math.random() - 0.5) * amp) + "px," + ((Math.random() - 0.5) * amp) + "px)" : "";
  if (live.textContent !== sim.announce) live.textContent = sim.announce;
}
function press(move) { unlock(); applyInput(move); paint(); }
deck.addEventListener("pointerdown", function (e) {
  const btn = e.target.closest("[data-move],[data-act]");
  if (!btn) return;
  e.preventDefault();
  unlock();
  if (btn.dataset.act === "guide" || btn.dataset.act === "arcade") startRun(btn.dataset.act);
  else if (btn.dataset.act === "title") toTitle();
  else if (btn.dataset.move) applyInput(btn.dataset.move);
  lastDeck = ""; lastHud = "";
  paint();
});
document.getElementById("cab").addEventListener("click", function (e) {
  if (e.target.id === "mute" || e.target.closest("#mute")) { toggleMute(); lastHud = ""; paint(); }
});
const KEYS = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", a: "left", s: "down", d: "right", W: "up", A: "left", S: "down", D: "right", " ": "action" };
window.addEventListener("keydown", function (e) {
  if (e.repeat) return;
  const move = KEYS[e.key];
  if (!move) return;
  e.preventDefault();
  press(move);
});
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  advance(dt);
  paint();
  requestAnimationFrame(loop);
}
document.getElementById("who-slot");
paint();
requestAnimationFrame(loop);
window.__lair = { dump() { const b = BEATS[sim.beat]; return { phase: sim.phase, id: b && b.id, move: b && b.move, lives: sim.lives, score: sim.score }; }, press, start: startRun };
