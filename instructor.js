/* Professor HUB — Deadpool-energy instructor
   Fourth-wall breaks, roasts, HVAC chaos. Voice of the shop. */
(function (global) {
  "use strict";

  const HUB = {
    name: "Professor Andrew Hubbard",
    title: "America's HVAC Instructor · Merc with a Manifold",
    avatar: "🦸",

    // Random one-liners for hub / idle
    hubLines: [
      "Professor Andrew Hubbard in the building. Try not to vent the planet today.",
      "Grok built the sim. I built the standards. You bring the hustle.",
      "Best HVAC classroom in the country — and yes, I said it.",
      "I'm the instructor. You're the plot armor. Let's go.",
      "This isn't Interplay. We have jokes *and* microns.",
      "Clock in. Clock violence on bad superheat.",
      "If HVAC Jesus shows up, act surprised. He likes that. Then recover anyway.",
      "The Gauges of God still need a leak found. Magic manifold, mortal work.",
      "Your callsign is showing. Wear it like a cape.",
      "Sandbox is therapy. Service calls are character development.",
      "I break the fourth wall so you don't break the compressor.",
    ],

    // Curriculum unit openers keyed loosely by id
    unitOpen: {
      hcr101:
        "HCR101. Heat moves. Copper bends. You will too. Let's pretend this is a montage.",
      hcr102:
        "Electricity. It bites. Multimeters don't lie — people do. Especially DIY Dave.",
      hcr105:
        "Refrigeration cycle. Four components, infinite ways to mess it up. Charming.",
      hcr117:
        "Air conditioning. Making rich air for people who set it to 68 in February.",
      hcr108:
        "Design class. Numbers on paper. In the field those numbers become tears.",
      hcr109:
        "Commercial refrigeration. Walk-ins: where food and your patience go to die.",
      hcr110:
        "Troubleshooting. Systematic. Unlike your sleep schedule.",
      epa608:
        "EPA 608. Venting is illegal. So is my patience for people who still do it.",
      piping:
        "Flares and torches. Slide the nut on first or I will narrate your failure in slow motion.",
      default:
        "Pick a unit. Practice here. Fail here. Succeed in lab. That's the deal.",
    },

    // After correct / wrong service answers
    serviceOk: [
      "Correct. I'd high-five you but I'm holding imaginary gauges.",
      "Look at you — diagnosing like somebody who reads the book.",
      "Nailed it. Customer keeps their cool. You keep your stars.",
      "Yes. That's the one. Frame it. Or don't. I'm not your mom.",
      "Textbook answer. Gross. Effective. I respect the hustle.",
    ],
    serviceBad: [
      "Nope. That answer just joined a pyramid scheme.",
      "Wrong. The compressor filed a restraining order.",
      "That's a callback with extra steps. Try again next life.",
      "Bold choice. Incorrect. Iconic combination.",
      "You just selected chaos. Chaos selected you back.",
    ],

    // Mini-split step flavor
    install: {
      "mount-idu": "Level the plate or the head sits crooked forever. Like my posture.",
      penetration: "Slope the hole out. Water is not your coworker.",
      "set-odu": "Give the outdoor unit personal space. It's not a subway.",
      flare: "Nut on first. Then cut. Then deburr. Then flare. In that order or I haunt you.",
      torque: "Torque wrench. Not 'good and tight,' Kevin.",
      nitrogen: "Dry nitrogen only. Oxygen is for lungs, not leak tests.",
      vacuum: "Microns or it didn't happen. Compound gauges are cosplay.",
      decay: "If it rises forever, you have a leak. Or feelings. Check the leak first.",
      valves: "Open liquid, then suction. Factory charge does a little dance into the lines.",
      electrical: "Comms wires swapped = no cool + existential crisis.",
      commission: "ΔT, drain, no error codes. Then you get paid. Capitalism, baby.",
    },

    // Pay / end of route
    paid: [
      "Money landed. Don't spend it all on manifold gauges you already own.",
      "Payroll hits different when you didn't explode the unit.",
      "Bank it. Future you needs tools and slightly better decisions.",
    ],

    roastRank(title) {
      const map = {
        Helper: "Helper rank. Adorable. Like training wheels with a death wish.",
        Apprentice: "Apprentice. You're dangerous in a promising way.",
        Journeyman: "Journeyman. People might trust you. Terrifying.",
        "Master Tech": "Master Tech. Bow lightly. Ego stays in the truck.",
        "All-Star": "All-Star. HVAC Jesus is checking his calendar.",
      };
      return map[title] || "Keep grinding. Rank is a state of mind and also XP.";
    },
  };

  function pick(arr) {
    return arr[(Math.random() * arr.length) | 0];
  }

  function lineForUnit(id) {
    return HUB.unitOpen[id] || HUB.unitOpen.default;
  }

  function banter(kind, ctx) {
    switch (kind) {
      case "hub":
        return pick(HUB.hubLines);
      case "service-ok":
        return pick(HUB.serviceOk);
      case "service-bad":
        return pick(HUB.serviceBad);
      case "paid":
        return pick(HUB.paid);
      case "unit":
        return lineForUnit(ctx && ctx.unit);
      case "install":
        return (HUB.install && HUB.install[ctx && ctx.step]) || "Do it right. I'm watching. Metaphorically.";
      case "rank":
        return HUB.roastRank(ctx && ctx.title);
      default:
        return pick(HUB.hubLines);
    }
  }

  /** Small floating instructor chip */
  function mountChip(parent, text) {
    if (!parent) return null;
    let chip = parent.querySelector(".hub-chip");
    if (!chip) {
      chip = document.createElement("div");
      chip.className = "hub-chip";
      parent.appendChild(chip);
    }
    chip.innerHTML =
      '<img src="hub-portrait.jpg" alt="" class="hub-chip-av photo" /><div><strong>' +
      HUB.name +
      "</strong><p>" +
      text +
      "</p></div>";
    return chip;
  }

  global.ProfessorHUB = { HUB, banter, mountChip, pick };
})(window);
