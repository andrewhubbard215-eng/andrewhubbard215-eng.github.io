/* Condenser Lair — shop-floor build. Same move-or-die call. */
const BEATS = [
  {
    id: "pad-dive",
    room: "pad",
    roomNo: 1,
    roomName: "The Pad",
    image: "art/r1.jpg",
    deathImage: "art/death-bite.jpg",
    blurb: "Saturday. You're on the gravel by the condenser. He's already on the fence, on your right.",
    call: "DIVE",
    move: "left",
    success: "You crab off the pad. The chain link holds him.",
    death: "You stayed for the subcool. They loved the bit. It loved it more.",
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
    blurb: "He's up on the condenser. The gauges are in your hands. The box on the wall is already throwing sparks.",
    call: "SLAM",
    move: "action",
    success: "Brass first. The gauges buy you the box.",
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
    blurb: "The disconnect is sparking over his head. Kill it.",
    call: "REACH",
    move: "up",
    success: "The whip drops. The sparks die with it.",
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
    blurb: "The gate latch is in his hands. The shop door is on your left.",
    call: "SPRINT",
    move: "left",
    success: "You take the door. He keeps the gate.",
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
    blurb: "The dock plate is under your boots. Don't go down with it.",
    call: "SLIDE",
    move: "down",
    success: "Boots clear the plate. You're in the doorway.",
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
    blurb: "Shoulder the slider. He's still holding the coffee on the other side of the glass.",
    call: "SLAM",
    move: "action",
    success: "The slider leaves the track. The coffee stays in the lobby.",
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
    blurb: "The torch is live. An arm comes across the bench over the kid in the beanie.",
    call: "DUCK",
    move: "down",
    success: "You drop. The torch stays in his hands. The arm misses.",
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
    blurb: "The green bottle is on the right. He's still across the bench. Shut the torch down.",
    call: "GRAB",
    move: "action",
    success: "You kill the torch. The kid comes with you.",
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
    blurb: "Hallway. You've got the cylinder. He's in the lit doorway with both hands up.",
    call: "BLAST",
    move: "action",
    success: "The valve screams. The doorway clears.",
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
    blurb: "He's down. The lit door is past him. Get up and take it.",
    call: "VAULT",
    move: "up",
    success: "You clear the bottle and the doorway.",
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
    blurb: "Staff lot. The van door is open on your left. They're on the monument and the cart.",
    call: "JUKES",
    move: "left",
    success: "You take the open door. The monument keeps the rest.",
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
    blurb: "One is in the foreground, under your hands. The cart is full behind him.",
    call: "DUCK",
    move: "down",
    success: "You drop behind the monument. He takes the cart, not you.",
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
    blurb: "The driver door is still open. Get in and shut it.",
    call: "SLAM",
    move: "action",
    success: "The door shuts. You're in the van.",
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
    blurb: "The custodian swings at your face. The van door is open behind him.",
    call: "DUCK",
    move: "down",
    success: "The hand misses the hat. You stay low.",
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
    blurb: "The disconnect is hanging open and throwing sparks. Put him on it.",
    call: "SLAM",
    move: "action",
    success: "He takes the arc. You keep the open van.",
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
    blurb: "He's got the gravel. The fan housing is the only thing above him.",
    call: "VAULT",
    move: "up",
    success: "You go up the cabinet. He keeps the ground.",
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
    blurb: "The van door is open behind him. That is the way off the pad.",
    call: "VAN",
    move: "left",
    success: "You take the seat. The school pad is behind you.",
    death: "One hand on the door. The rest of you stays in the yard.",
    windup: 1.28,
    window: 1.05,
  },
  {
    id: "cap-brake",
    room: "cap",
    roomNo: 9,
    roomName: "Sidekick",
    image: "art/r9.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Dave's in the road, both hands already talking. The van is on your right. They're in the headlights.",
    call: "BRAKE",
    move: "action",
    success: "He's in before the sentence ends. You don't wait for the plan.",
    death: "You wave at your sidekick. The van doesn't stop. Neither do they.",
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
    blurb: "Engal's still making his point. Something's got him from behind. The door is on your left.",
    call: "SHUT",
    move: "left",
    success: "You had the wrist. He was still talking. The door took the rest.",
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
    blurb: "Starr points out the door. The hall behind him is already full. The dog is looking with him.",
    call: "GO",
    move: "right",
    success: "You take the door he pointed at. He wasn't guessing.",
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
    blurb: "The Malinois is in the doorway. Starr stays on the hall.",
    call: "CALL",
    move: "action",
    success: "The dog clears the step. Starr stays. That's the last argument.",
    death: "You go back for him. He told you not to.",
    windup: 1.55,
    window: 1.18,
  },
  {
    id: "joe-wall",
    room: "joe",
    roomNo: 12,
    roomName: "Joe",
    image: "art/r16.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Joe never left the bay. One hand on the tank, beard in the bands. He will not jog.",
    call: "SLIDE",
    move: "left",
    success: "You slip the doorway. He says he'll catch up, and sits on the tank to mean it.",
    death: "You wait in the doorway with him. The doorway does not have that kind of time.",
    windup: 2.1,
    window: 1.3,
  },
  {
    id: "joe-slow",
    room: "joe",
    roomNo: 12,
    roomName: "Joe",
    image: "art/r16.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "He lifts the tank like that's the plan. The lot is not waiting.",
    call: "LEAVE",
    move: "action",
    success: "Joe explains the gauges on the way back in. The lot takes the lecture. The bands hold.",
    death: "You wait for the decimal. He never gets there, and neither do you.",
    windup: 1.55,
    window: 1.16,
  },
  {
    id: "frank-know",
    room: "frank",
    roomNo: 13,
    roomName: "Ramono",
    image: "art/r24.jpg?v=frank",
    deathImage: "art/death-crowd.jpg",
    blurb: "You're still yelling. Frank already has the bag. He's nodding before you finish.",
    call: "WITH",
    move: "action",
    success: "\"I know,\" he says, and he is already walking.",
    death: "You finish the sentence. He already knew. The hall knew faster.",
    windup: 2.05,
    window: 1.3,
  },
  {
    id: "frank-bottle",
    room: "frank",
    roomNo: 13,
    roomName: "Ramono",
    image: "art/r24.jpg?v=frank",
    deathImage: "art/death-crowd.jpg",
    blurb: "The van door is open on your right. He's still yelling. Frank is not.",
    call: "VAN",
    move: "right",
    success: "Frank gets in. The bag comes with him. He knew.",
    death: "You go back for the bottle. Frank says he knew you would.",
    windup: 1.55,
    window: 1.16,
  },
  {
    id: "alisha-roll",
    room: "alisha",
    roomNo: 14,
    roomName: "Alisha",
    image: "art/r25.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Alisha's got the roster. She's pointing at the door, and she is not impressed.",
    call: "ROLL",
    move: "action",
    success: "She reads the names like they owe her. Then she points. That's the whole speech.",
    death: "You talk back. She was not taking questions, and neither was the lobby.",
    windup: 2.05,
    window: 1.3,
  },
  {
    id: "alisha-door",
    room: "alisha",
    roomNo: 14,
    roomName: "Alisha",
    image: "art/r25.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The door is on her right. The van is outside it. She will not say it twice.",
    call: "DOOR",
    move: "right",
    success: "Clipboard, keys, and one look. She is through the door first.",
    death: "You go back for the files. She told you the files are not people.",
    windup: 1.55,
    window: 1.16,
  },
  {
    id: "bus-plate",
    room: "bus",
    roomNo: 15,
    roomName: "The Bus",
    image: "art/r12.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Lucas has the plate up on the bus window. You're the other hand.",
    call: "LIFT",
    move: "up",
    success: "You take the top. He keeps the stinger.",
    death: "The plate comes down without you under it. Almost.",
    windup: 2.0,
    window: 1.28,
  },
  {
    id: "bus-weld",
    room: "bus",
    roomNo: 15,
    roomName: "The Bus",
    image: "art/r12.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "The window is still glass. He's already got the arc on the plate.",
    call: "WELD",
    move: "action",
    success: "The bead grabs. One nod. That's the grade.",
    death: "You watch the arc. The arc watches back.",
    windup: 1.45,
    window: 1.16,
  },
  {
    id: "james-brace",
    room: "bus",
    roomNo: 15,
    roomName: "The Bus",
    image: "art/r17.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "James has the top of the plate. Pebo's on the stinger. Lucas has the other corner.",
    call: "BRACE",
    move: "down",
    success: "He doesn't raise his voice. The plate doesn't either.",
    death: "You let go to hear the rest of the sentence.",
    windup: 1.7,
    window: 1.2,
  },
  {
    id: "pebo-bead",
    room: "bus",
    roomNo: 15,
    roomName: "The Bus",
    image: "art/r17.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Pebo wants the bead. You hold the plate. He burns.",
    call: "CLAMP",
    move: "action",
    success: "The sparks walk the seam. Lucas watches it like a grade. It holds.",
    death: "You grab the stinger. Pebo already had a plan.",
    windup: 1.5,
    window: 1.14,
  },
  {
    id: "chewy-leg",
    room: "electric",
    roomNo: 16,
    roomName: "Electric",
    image: "art/r18.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Chewy's on the meter, pointing at the panel. Miller's already on the leads.",
    call: "PANEL",
    move: "right",
    success: "You stay off the hot side. Chewy kills it without a speech.",
    death: "You grab the hot leg to help. Chewy was not asking for help.",
    windup: 1.85,
    window: 1.22,
  },
  {
    id: "miller-meter",
    room: "electric",
    roomNo: 16,
    roomName: "Electric",
    image: "art/r18.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "Miller's got the leads on the board. The meter is in Chewy's hand.",
    call: "HOLD",
    move: "action",
    success: "Miller calls the solenoid good. Chewy doesn't argue. That means it's good.",
    death: "You take the meter to see for yourself. The door doesn't wait.",
    windup: 1.6,
    window: 1.16,
  },
  {
    id: "ruso-line",
    room: "ruso",
    roomNo: 17,
    roomName: "Ruso",
    image: "art/r15.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Mike's hand is up. The students are walking to the bus. Stay on his shoulder.",
    call: "FALL IN",
    move: "right",
    success: "The line moves because he already pointed.",
    death: "You step out of his line. The line was the whole plan.",
    windup: 2.15,
    window: 1.32,
  },
  {
    id: "ruso-rear",
    room: "ruso",
    roomNo: 17,
    roomName: "Ruso",
    image: "art/r15.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "He's at the front of the line. The last ones are still off the wall.",
    call: "COVER",
    move: "action",
    success: "You take the back. He takes the front. Everybody he brought is still walking.",
    death: "You go up front with him. The back of the line is empty.",
    windup: 1.6,
    window: 1.18,
  },
  {
    id: "falcon-home",
    room: "falcon",
    roomNo: 18,
    roomName: "Falcon",
    image: "art/r21.jpg?v=toon",
    deathImage: "art/death-crowd.jpg",
    blurb: "Home. Daytime. Stefany has Hope on the hood, both in the red dots. They don't know yet.",
    call: "GRAB",
    move: "action",
    success: "Hope comes off the hood. Stefany is with you.",
    death: "You stay with the bus. The house doesn't know.",
    windup: 2.05,
    window: 1.28,
  },
  {
    id: "falcon-wife",
    room: "falcon",
    roomNo: 18,
    roomName: "Falcon",
    image: "art/r19.jpg?v=toon",
    deathImage: "art/death-crowd.jpg",
    blurb: "Night. Stefany takes the wheel. Johnny's in the red shirt. Hope's in the back. The school gate is ahead.",
    call: "GATE",
    move: "up",
    success: "You point her at the gate. She already had it.",
    death: "You go for the keys first. She was the stop.",
    windup: 1.85,
    window: 1.24,
  },
  {
    id: "falcon-door",
    room: "falcon",
    roomNo: 18,
    roomName: "Falcon",
    image: "art/r19.jpg?v=toon",
    deathImage: "art/death-crowd.jpg",
    blurb: "Rain on the stripe. The arch is right there. Hold her lane.",
    call: "LANE",
    move: "left",
    success: "The Falcon takes the school gate. Family stays in.",
    death: "You explain the condenser in the driveway. The driveway fills up.",
    windup: 1.7,
    window: 1.2,
  },
  {
    id: "bench-tower",
    room: "bench",
    roomNo: 19,
    roomName: "The Bench",
    image: "art/r22.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Back in the bay. Three of them never left the block tower. Bucket hat, the girl, the hoodie.",
    call: "OUT",
    move: "left",
    success: "The block stays. They don't. That's why they show up.",
    death: "You take a turn. The tower takes the room.",
    windup: 1.9,
    window: 1.22,
  },
  {
    id: "bench-run",
    room: "bench",
    roomNo: 19,
    roomName: "The Bench",
    image: "art/r23.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The tower comes apart behind them. They're already running clear of it.",
    call: "RUN",
    move: "left",
    success: "They clear it. The blocks take the bay, not them.",
    death: "You stay to watch it fall. It doesn't fall alone.",
    windup: 1.45,
    window: 1.12,
  },
  {
    id: "manifest-door",
    room: "manifest",
    roomNo: 20,
    roomName: "Manifest",
    image: "art/r13.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The red car is in the lot. People are on the bus step. The dog is going up. The roster is on the door.",
    call: "SHUT",
    move: "action",
    success: "The dog clears the step. You shut the door on the rest of the lot.",
    death: "You hold the door for one more. There isn't one more.",
    windup: 2.15,
    window: 1.3,
  },
  {
    id: "wire-left",
    room: "wire",
    roomNo: 21,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "A flipped truck takes the lane. The red car can still go left of it. The bus is on the right.",
    call: "JUKES",
    move: "left",
    success: "The car clears the left side. The bus stays on your mirror.",
    death: "You give the street the lane. The street takes the bus.",
    windup: 1.85,
    window: 1.18,
  },
  {
    id: "wire-right",
    room: "wire",
    roomNo: 21,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The bus takes the right side of the truck. Don't drift into the wreck.",
    call: "JUKES",
    move: "right",
    success: "The bus comes through on the right. Everybody you loaded is still in it.",
    death: "You drift wide. A few miles was the whole plan.",
    windup: 1.4,
    window: 1.1,
  },
  {
    id: "wire-gate",
    room: "wire",
    roomNo: 21,
    roomName: "The Wire",
    image: "art/r14.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "Past the truck the street is open. Do not stop to explain it.",
    call: "GO",
    move: "up",
    success: "You go through. The bus follows. Family, instructors, students.",

    death: "You brake for the sentry. The street doesn't.",
    windup: 1.45,
    window: 1.12,
  },
  {
    id: "fort-weld",
    room: "fort",
    roomNo: 22,
    roomName: "The Fort",
    image: "art/r26.jpg",
    deathImage: "art/death-zap.jpg",
    blurb: "The fort is the school. Lucas has the arc on the fence plate. The bus is in the yard.",
    call: "WELD",
    move: "action",
    success: "The bead closes the fence. He does not look up until it holds.",
    death: "You watch the arc. The street comes through the gap.",
    windup: 2.05,
    window: 1.28,
  },
  {
    id: "fort-tower",
    room: "fort",
    roomNo: 22,
    roomName: "The Fort",
    image: "art/r26.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The watchtower light is on. The ladder is the only high ground.",
    call: "CLIMB",
    move: "up",
    success: "Somebody's already on the light. The lot stays outside the fence.",
    death: "You stay on the gravel. The tower was the only high ground.",
    windup: 1.6,
    window: 1.16,
  },
  {
    id: "fort-brace",
    room: "fort",
    roomNo: 22,
    roomName: "The Fort",
    image: "art/r26.jpg",
    deathImage: "art/death-crowd.jpg",
    blurb: "The plate is low on the fence. Family is at the bus door. Put a hand on the plate.",
    call: "BRACE",
    move: "down",
    success: "Low end. The fence stays a fence. The school holds.",
    death: "You let the plate walk. The fort walks with it.",
    windup: 1.5,
    window: 1.14,
  },
];

const LIVES = 6;
const ROOM_COUNT = 22;
const CARD = 2.4, HIT = 2.8, DEATH_HOLD = 3.1, BUFFER = 0.16, ESCAPE_BONUS = 5000, READ = 2.75;
function windupOf(beat) { return beat.windup + READ; }
const SKIN = new URLSearchParams(location.search).get("skin") === "legends" ? "legends" : "allstars";
const SHOP = SKIN === "legends" ? "../legends/" : "../";
const KEY = "condenser-lair-" + SKIN;
const WHO = SKIN === "legends"
  ? "You are Professor Hub. The side job was the condenser. Then the lot went wrong. Get Stefany, Johnny, and Hope. Drive the Falcon back. Hold the school."
  : "You are Professor Hub. The side job was the condenser. Then the lot went wrong. Get Stefany, Johnny, and Hope. Drive the Falcon back. Hold the school.";

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
function burst(dur, peak, band, when) {
  if (!ac || !sfxBus || !noiseBuf) return;
  const src = ac.createBufferSource(); src.buffer = noiseBuf;
  const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.frequency.value = band; filter.Q.value = 0.7;
  const g = ac.createGain(), t = ac.currentTime + (when || 0);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter); filter.connect(g); g.connect(sfxBus); src.start(t); src.stop(t + dur + 0.02);
}
function air(dur, peak, from, to) {
  if (!ac || !sfxBus || !noiseBuf) return;
  const src = ac.createBufferSource(); src.buffer = noiseBuf;
  const filter = ac.createBiquadFilter(); filter.type = "bandpass"; filter.Q.value = 0.85;
  const g = ac.createGain(), t = ac.currentTime;
  filter.frequency.setValueAtTime(from, t);
  filter.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + dur * 0.3);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(filter); filter.connect(g); g.connect(sfxBus); src.start(t); src.stop(t + dur + 0.02);
}
function clang() { tone(210, 0.09, "square", 0.09, 0, 70); tone(880, 0.14, "triangle", 0.07, 0.01, 220); burst(0.08, 0.2, 1800); }
function whoosh() { air(0.18, 0.16, 400, 1800); }
function weld() { for (let i = 0; i < 6; i++) { tone(1600 + (i % 3) * 380, 0.025, "square", 0.04, i * 0.045, 320); burst(0.03, 0.08, 2400 + i * 200, i * 0.045); } }
function engine() { tone(62, 0.34, "sawtooth", 0.07, 0, 130); burst(0.22, 0.1, 180); tone(196, 0.08, "square", 0.03, 0.05); }
function bark() { tone(210, 0.07, "square", 0.09, 0, 80); burst(0.05, 0.12, 700); tone(240, 0.06, "square", 0.08, 0.11, 90); burst(0.04, 0.1, 900, 0.11); }
function zap() { tone(2200, 0.06, "square", 0.06, 0, 180); burst(0.09, 0.14, 3200); tone(90, 0.1, "sawtooth", 0.04, 0.02); }
function latch() { burst(0.05, 0.16, 350); tone(140, 0.07, "square", 0.06); tone(420, 0.05, "triangle", 0.04, 0.04); }
function clink() { tone(1560, 0.08, "sine", 0.06, 0, 900); tone(2100, 0.1, "sine", 0.04, 0.03); }
function skid() { air(0.22, 0.14, 900, 220); tone(90, 0.16, "sawtooth", 0.05, 0, 50); }
function torch() { air(0.2, 0.1, 600, 2200); tone(180, 0.16, "sawtooth", 0.03); }
function fanSpin() { air(0.24, 0.1, 200, 700); tone(95, 0.2, "sawtooth", 0.035, 0, 70); }
function playKind(id) {
  if (/weld|bead/.test(id)) weld();
  else if (id.indexOf("falcon") === 0) engine();
  else if (id.indexOf("dog") >= 0) bark();
  else if (/chewy|miller/.test(id)) zap();
  else if (/bottle/.test(id)) clink();
  else if (/slam|nitro|plate|brace/.test(id)) clang();
  else if (/brake/.test(id)) skid();
  else if (/island|torch/.test(id)) torch();
  else if (/pad|rotor/.test(id)) fanSpin();
  else if (/door|gate|slider/.test(id)) latch();
  else whoosh();
}
const sfx = {
  stingerStart() { tone(220, 0.12, "square", 0.06); tone(330, 0.16, "square", 0.05, 0.08); tone(440, 0.22, "square", 0.05, 0.16); },
  tick(hot) { if (hot) tone(1480, 0.02, "square", 0.05); else tone(240, 0.055, "square", 0.022); },
  prompt() { whoosh(); tone(880, 0.08, "square", 0.09); tone(1320, 0.11, "square", 0.06, 0.04); },
  nope() { tone(140, 0.09, "square", 0.05, 0, 90); },
  success(id) { playKind(id); tone(784, 0.07, "square", 0.045, 0.02); },
  death() { tone(150, 0.42, "sawtooth", 0.08, 0, 48); burst(0.18, 0.22, 140); tone(90, 0.28, "triangle", 0.06, 0.08); burst(0.06, 0.16, 500, 0.12); },
  victory() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, "square", 0.06, i * 0.09)); clang(); },
  room() { tone(494, 0.08, "triangle", 0.04); tone(740, 0.12, "triangle", 0.035, 0.07); },
  scene(id) { sfx.room(); playKind(id); },
  bed
};

function fresh() {
  return { phase: "title", mode: "guide", beat: 0, lives: LIVES, score: 0, best: loadBest(), bestFlag: false, streak: 0, deaths: 0, t: 0, elapsed: 0, metronome: 0, hitStop: 0, shake: 0, flash: 0, flashKind: "good", reason: "", nudge: "", nudgeT: 0, popup: "", announce: "Professor Hubbard. Move or die." };
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
  sfx.success(beat.id); buzz(14);
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
    sim.announce = "The school holds. This is the fort."; sfx.victory(); sfx.bed("win"); buzz([12, 28, 12, 28, 40]); return;
  }
  const next = BEATS[nextIndex];
  sim.beat = nextIndex; sim.t = 0; sim.popup = "";
  if (next.room !== current.room) { sim.phase = "card"; sim.announce = next.roomName + ". " + next.blurb; sfx.scene(next.id); }
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
function toTitle() { sim.phase = "title"; sim.t = 0; sim.popup = ""; sim.nudge = ""; sim.announce = "Super Heat."; sfx.bed("title"); }
function applyInput(move) {
  if (sim.phase === "death") { acknowledge(); return; }
  if (sim.phase === "hit") { if (sim.t > 0.28) goNext(); return; }
  if (sim.phase !== "windup" && sim.phase !== "window") return;
  const beat = BEATS[sim.beat];
  if (!beat) return;
  if (sim.phase === "windup") {
    const remain = windupOf(beat) - sim.t;
    if (remain <= BUFFER && move === beat.move) { succeed(beat); return; }
    if (beat.tutorial) { sim.nudge = "Not yet. Even I wait for the flash."; sim.nudgeT = 0.9; sim.announce = sim.nudge; sfx.nope(); return; }
    fail("Too soon. I was still talking."); return;
  }
  if (move === beat.move) succeed(beat); else fail("Wrong way. They saw that.");
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
  if (sim.phase === "windup" && sim.t >= windupOf(beat)) {
    sim.phase = "window"; sim.t = 0; sim.metronome = 0;
    sim.announce = arrowsOn() ? beat.call + ". " + moveWord(beat.move) + "." : "Move now.";
    sfx.prompt();
  } else if (sim.phase === "window" && sim.t >= beat.window) fail("Too late. Quote me anyway.");
}

const GLYPH = {
  up: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 8 L52 36 H40 V56 H24 V36 H12 Z" fill="currentColor"/></svg>',
  down: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 56 L12 28 H24 V8 H40 V28 H52 Z" fill="currentColor"/></svg>',
  left: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 32 L36 12 V24 H56 V40 H36 V52 Z" fill="currentColor"/></svg>',
  right: '<svg class="glyph" viewBox="0 0 64 64" aria-hidden="true"><path d="M56 32 L28 52 V40 H8 V24 H28 V12 Z" fill="currentColor"/></svg>'
};
const pic = document.getElementById("pic");
const vid = document.getElementById("clip");
const CLIPS = new Set(["title","base","r1","r2","r3","r4","r5","r6","r7","r8","r9","r10","r11","r12","r13","r14","r15","r16","r17","r18","r19","r21","r22","r23","r24","r25","r26"]);
function clipFor(src) {
  const m = String(src).match(/([a-z0-9]+)\.jpg/i);
  return m && CLIPS.has(m[1]) ? "art/" + m[1] + ".mp4?v=act" : "";
}
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
  if (sim.phase === "gameover") return "Class dismissed. The ticket never got written.";
  if (sim.phase === "victory") return "Stefany, Johnny, Hope, Mike Ruso and the students, Lucas, James, Pebo, Chewy, Andrew Miller, sidekick LoBuono, Frank Ramono, Alisha Baker Jones, the Malinois. Lincoln Tech is the fort. Starr, Engal, and Joe are not on the wall. Joe was still on the subcool.";
  return beat.blurb;
}
function meterOf() {
  const beat = BEATS[sim.beat];
  if (!beat || (sim.phase !== "windup" && sim.phase !== "window")) return null;
  if (sim.phase === "windup") return { kind: "hold", value: Math.min(1, sim.t / windupOf(beat)) };
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
  if (sim.phase === "victory") html += '<div class="endcard"><span class="kicker">THE FORT</span><h2>SCHOOL HOLDS</h2><p class="stat">' + pad(sim.score) + '</p><p class="stat-sub">' + sim.deaths + " deaths · " + clock(sim.elapsed) + " · fort +" + ESCAPE_BONUS + "</p>" + (sim.bestFlag ? '<p class="hi">NEW HIGH</p>' : "") + "</div>";
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
  const clip = clipFor(src);
  const beat = BEATS[sim.beat] || BEATS[0];
  if (clip) {
    pic.style.visibility = "hidden";
    vid.hidden = false;
    if (vid.getAttribute("src") !== clip) {
      vid.poster = src;
      vid.src = clip;
      const play = vid.play();
      if (play && play.catch) play.catch(function () {});
    }
  } else {
    vid.hidden = true;
    if (vid.getAttribute("src")) { vid.removeAttribute("src"); vid.load(); }
    pic.style.visibility = "";
    if (src !== lastSrc) { pic.src = src; lastSrc = src; }
    const alive = sim.phase !== "death" && sim.phase !== "gameover";
    pic.className = "pic" + (alive ? " is-alive move-" + (beat.roomNo % 4) : "");
  }
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
      caption.innerHTML = '<div class="who"><img class="medal" src="art/hank.jpg?v=fam" alt=""><p>' + WHO + '</p></div><ol><li><span>01</span>Watch. The bar fills. Do not move yet.</li><li><span>02</span>When it flashes, hit that direction or SLAM.</li><li><span>03</span>Too soon, wrong way, too late — Hub dies.</li></ol>';
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
