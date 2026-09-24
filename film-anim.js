/* Component film cutaways — how the part actually moves. */
(function (global) {
  "use strict";

  var NOTE = {
    cycle: "Vapor leaves the evap. Compressor raises pressure. Condenser rejects heat to liquid. Metering drops pressure. Repeat.",
    compressor: "Downstroke opens suction reed. Upstroke opens discharge reed. Liquid in the bore bends valves.",
    scroll: "Orbiting scroll does not spin. Pockets walk from the rim to the discharge port at the center.",
    condenser: "Reject heat. Leave as a subcooled liquid. Fan moves outdoor air across the coil.",
    evaporator: "Absorb heat. Leave with superheat. Indoor blower is half the capacity story.",
    txv: "Three forces: bulb/eq tube opens, spring closes, liquid inlet helps close. It hunts superheat.",
    piston: "Fixed hole. It does not modulate. Flash after the restriction. Charge by superheat.",
    reversing: "Same four boxes. Slide moves. Discharge always to the outdoor or indoor coil — never into the suction line.",
    furnace: "W → inducer → pressure switch → ignitor → gas valve → flame sense µA → blower. Learn it cold.",
    contactor: "24V coil pulls the armature. Line voltage crosses L1/L2. Cap sits on HERM and FAN.",
    blower: "Wheel moves air. Capacity follows airflow. Measure static before you blame the box.",
    thermostat: "R is hot. C is common. Y calls cool. G calls fan. W calls heat. Door sticker is law.",
    oil: "Primary control. Cad cell sees light. Pump ~140 PSI. This is not a gas valve.",
    gas: "Prove draft. Light burners. Heat exchanger carries the fire. CO is the fail.",
    hydronic: "Boiler makes heat. Circulator moves it. Zone valve opens a loop. Tank takes the swell. Purge before you blame the pump."
  };

  function svgCycle() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-box" x="200" y="16" width="120" height="44" rx="4"/>' +
      '<text x="260" y="34" text-anchor="middle">CONDENSER</text>' +
      '<text class="film-muted" x="260" y="50" text-anchor="middle">high · liquid</text>' +
      '<rect class="film-box" x="390" y="88" width="110" height="44" rx="4"/>' +
      '<text x="445" y="106" text-anchor="middle">TXV / piston</text>' +
      '<text class="film-muted" x="445" y="122" text-anchor="middle">pressure drop</text>' +
      '<rect class="film-box" x="200" y="160" width="120" height="44" rx="4"/>' +
      '<text x="260" y="178" text-anchor="middle">EVAPORATOR</text>' +
      '<text class="film-muted" x="260" y="194" text-anchor="middle">low · vapor</text>' +
      '<rect class="film-box" x="20" y="88" width="120" height="44" rx="4"/>' +
      '<text x="80" y="106" text-anchor="middle">COMPRESSOR</text>' +
      '<text class="film-muted" x="80" y="122" text-anchor="middle">raises pressure</text>' +
      '<path class="film-line-hot" d="M140 100 H200 M320 38 H400 V88"/>' +
      '<path class="film-line-cold" d="M400 132 V182 H320 M200 182 H140 V132"/>' +
      '<circle class="film-hot film-dot-a" r="6" cx="0" cy="0"/>' +
      '<circle class="film-hot film-dot-b" r="6" cx="0" cy="0"/>' +
      '<circle class="film-cold film-dot-c" r="6" cx="0" cy="0"/>' +
      "</svg>"
    );
  }

  function svgCompressor() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="170" y="28" width="180" height="164" rx="6"/>' +
      '<rect class="film-box" x="200" y="48" width="120" height="110"/>' +
      '<rect class="film-amber film-move-piston" x="208" y="58" width="104" height="36" rx="2"/>' +
      '<rect fill="#2a333b" x="248" y="94" width="24" height="70" class="film-move-piston"/>' +
      '<rect class="film-cold film-reed-suct" x="176" y="70" width="24" height="8" rx="1"/>' +
      '<rect class="film-hot film-reed-dis" x="320" y="70" width="24" height="8" rx="1"/>' +
      '<text class="film-cold" x="80" y="76">SUCTION</text>' +
      '<text class="film-muted" x="80" y="92">reed opens on down</text>' +
      '<text class="film-hot" x="370" y="76">DISCHARGE</text>' +
      '<text class="film-muted" x="370" y="92">reed opens on up</text>' +
      '<text class="film-muted" x="260" y="200" text-anchor="middle">Never liquid. Valves live on vapor.</text>' +
      "</svg>"
    );
  }

  function svgScroll() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<circle class="film-shell" cx="260" cy="110" r="88"/>' +
      '<path class="film-line" d="M260 40 C300 48 318 78 318 110 C318 150 286 178 260 178 C228 178 202 150 202 110 C202 78 228 52 260 52 C284 52 300 72 300 110 C300 138 284 154 260 154 C240 154 228 138 228 110"/>' +
      '<g class="film-orbit">' +
      '<path class="film-line-hot" d="M260 48 C292 56 308 82 308 110 C308 146 282 170 260 170 C232 170 212 146 212 110 C212 82 232 60 260 60 C280 60 294 78 294 110 C294 134 280 148 260 148"/>' +
      '<circle class="film-hot" cx="260" cy="110" r="7"/>' +
      "</g>" +
      '<circle class="film-amber" cx="260" cy="110" r="4"/>' +
      '<text class="film-muted" x="70" y="50">SUCTION at rim</text>' +
      '<text class="film-muted" x="360" y="50">DISCHARGE at center</text>' +
      '<text class="film-muted" x="260" y="212" text-anchor="middle">Orbit. Do not spin. Vapor only.</text>' +
      "</svg>"
    );
  }

  function svgCondenser() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="70" y="40" width="240" height="140" rx="4"/>' +
      '<path class="film-line-hot" d="M90 60 H290 M90 80 H290 M90 100 H290 M90 120 H290 M90 140 H290 M90 160 H290"/>' +
      '<g class="film-spin" transform="translate(400 110)">' +
      '<circle class="film-box" cx="0" cy="0" r="48"/>' +
      '<rect fill="#8a949c" x="-4" y="-44" width="8" height="88"/>' +
      '<rect fill="#8a949c" x="-44" y="-4" width="88" height="8"/>' +
      "</g>" +
      '<text class="film-hot" x="190" y="30" text-anchor="middle">vapor in → liquid out</text>' +
      '<text class="film-muted" x="400" y="178" text-anchor="middle">OD fan</text>' +
      "</svg>"
    );
  }

  function svgEvaporator() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="70" y="40" width="240" height="140" rx="4"/>' +
      '<path class="film-line-cold" d="M90 60 H290 M90 80 H290 M90 100 H290 M90 120 H290 M90 140 H290 M90 160 H290"/>' +
      '<g class="film-spin-slow" transform="translate(400 110)">' +
      '<ellipse class="film-box" cx="0" cy="0" rx="52" ry="40"/>' +
      '<rect fill="#6e7b84" x="-6" y="-36" width="12" height="72"/>' +
      '<rect fill="#6e7b84" x="-36" y="-6" width="72" height="12"/>' +
      "</g>" +
      '<text class="film-cold" x="190" y="30" text-anchor="middle">liquid / two-phase in → vapor out</text>' +
      '<text class="film-muted" x="400" y="178" text-anchor="middle">blower</text>' +
      "</svg>"
    );
  }

  function svgTxv() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="180" y="70" width="160" height="90" rx="6"/>' +
      '<circle class="film-amber" cx="260" cy="46" r="18"/>' +
      '<text x="260" y="50" text-anchor="middle" fill="#12181e" font-size="10">BULB</text>' +
      '<path class="film-line" d="M260 64 V70"/>' +
      '<rect class="film-hot film-needle" x="252" y="100" width="16" height="40" rx="2"/>' +
      '<path class="film-line-hot" d="M180 130 H80"/>' +
      '<path class="film-line-cold" d="M340 130 H440"/>' +
      '<text class="film-muted" x="80" y="120">liquid in</text>' +
      '<text class="film-muted" x="360" y="120">to distributor</text>' +
      '<text class="film-amber" x="40" y="36">P bulb opens</text>' +
      '<text class="film-muted" x="40" y="52">P spring closes</text>' +
      '<text class="film-muted" x="40" y="68">P liquid helps close</text>' +
      '<text class="film-muted" x="260" y="210" text-anchor="middle">Needle hunts. Superheat is the target.</text>' +
      "</svg>"
    );
  }

  function svgPiston() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="160" y="80" width="200" height="60" rx="4"/>' +
      '<rect fill="#12181e" x="248" y="92" width="24" height="36"/>' +
      '<text class="film-hot" x="200" y="70" text-anchor="middle">high liquid</text>' +
      '<text class="film-cold" x="330" y="70" text-anchor="middle">flash / two-phase</text>' +
      '<circle class="film-cold film-pulse" cx="360" cy="110" r="8"/>' +
      '<circle class="film-cold film-pulse" cx="380" cy="100" r="5"/>' +
      '<circle class="film-cold film-pulse" cx="380" cy="120" r="5"/>' +
      '<text class="film-muted" x="260" y="180" text-anchor="middle">Hole does not move. Charge by superheat.</text>' +
      "</svg>"
    );
  }

  function svgReversing() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="160" y="60" width="200" height="100" rx="6"/>' +
      '<rect class="film-amber film-slide" x="176" y="78" width="70" height="64" rx="3"/>' +
      '<text class="film-hot" x="260" y="44" text-anchor="middle">D discharge</text>' +
      '<text class="film-cold" x="260" y="184" text-anchor="middle">S suction</text>' +
      '<text class="film-muted" x="120" y="116" text-anchor="end">E evap</text>' +
      '<text class="film-muted" x="400" y="116">C cond</text>' +
      '<text class="film-muted" x="260" y="210" text-anchor="middle">Slide left cool · slide right heat</text>' +
      "</svg>"
    );
  }

  function svgFurnace() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-box film-soo-1" x="16" y="80" width="64" height="44" rx="4"/>' +
      '<text x="48" y="106" text-anchor="middle">W</text>' +
      '<rect class="film-box film-soo-2" x="88" y="80" width="64" height="44" rx="4"/>' +
      '<text x="120" y="106" text-anchor="middle">inducer</text>' +
      '<rect class="film-box film-soo-3" x="160" y="80" width="64" height="44" rx="4"/>' +
      '<text x="192" y="106" text-anchor="middle">PS</text>' +
      '<rect class="film-box film-soo-4" x="232" y="80" width="64" height="44" rx="4"/>' +
      '<text x="264" y="106" text-anchor="middle">ignitor</text>' +
      '<rect class="film-box film-soo-5" x="304" y="80" width="64" height="44" rx="4"/>' +
      '<text x="336" y="106" text-anchor="middle">valve</text>' +
      '<rect class="film-box film-soo-6" x="376" y="80" width="64" height="44" rx="4"/>' +
      '<text x="408" y="106" text-anchor="middle">µA</text>' +
      '<rect class="film-box film-soo-7" x="448" y="80" width="64" height="44" rx="4"/>' +
      '<text x="480" y="106" text-anchor="middle">blow</text>' +
      '<text class="film-muted" x="260" y="170" text-anchor="middle">Call. Prove. Fire. Sense. Then blow.</text>' +
      "</svg>"
    );
  }

  function svgContactor() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="150" y="50" width="220" height="120" rx="6"/>' +
      '<rect class="film-amber film-needle" x="170" y="120" width="80" height="28" rx="2"/>' +
      '<text class="film-muted" x="210" y="110" text-anchor="middle">24V coil</text>' +
      '<rect class="film-hot" x="280" y="70" width="70" height="10"/>' +
      '<rect class="film-hot film-needle" x="280" y="88" width="70" height="10"/>' +
      '<text class="film-muted" x="400" y="80">L1 → HERM</text>' +
      '<text class="film-muted" x="400" y="102">L2 → HERM</text>' +
      '<text class="film-muted" x="260" y="200" text-anchor="middle">Coil pulls. Line crosses. Cap is not a fuse.</text>' +
      "</svg>"
    );
  }

  function svgBlower() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<ellipse class="film-shell" cx="260" cy="110" rx="90" ry="70"/>' +
      '<g class="film-spin" transform="translate(260 110)">' +
      '<rect fill="#8a949c" x="-6" y="-54" width="12" height="108"/>' +
      '<rect fill="#8a949c" x="-54" y="-6" width="108" height="12"/>' +
      '<rect fill="#6e7b84" x="-40" y="-40" width="12" height="80" transform="rotate(45)"/>' +
      "</g>" +
      '<text class="film-muted" x="380" y="70">supply</text>' +
      '<text class="film-muted" x="70" y="150">return</text>' +
      '<text class="film-muted" x="260" y="204" text-anchor="middle">Airflow is capacity. Measure static.</text>' +
      "</svg>"
    );
  }

  function svgThermostat() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="80" y="50" width="360" height="110" rx="8"/>' +
      '<circle class="film-hot film-pulse" cx="130" cy="105" r="16"/>' +
      '<text x="130" y="109" text-anchor="middle" fill="#12181e">R</text>' +
      '<circle class="film-box" cx="190" cy="105" r="16"/>' +
      '<text x="190" y="109" text-anchor="middle">C</text>' +
      '<circle class="film-cold film-pulse" cx="250" cy="105" r="16"/>' +
      '<text x="250" y="109" text-anchor="middle" fill="#12181e">Y</text>' +
      '<circle class="film-amber film-pulse" cx="310" cy="105" r="16"/>' +
      '<text x="310" y="109" text-anchor="middle" fill="#12181e">G</text>' +
      '<circle class="film-box" cx="370" cy="105" r="16"/>' +
      '<text x="370" y="109" text-anchor="middle">W</text>' +
      '<text class="film-muted" x="260" y="190" text-anchor="middle">Landing follows the door sticker.</text>' +
      "</svg>"
    );
  }

  function svgOil() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="150" y="40" width="160" height="50" rx="4"/>' +
      '<text x="230" y="70" text-anchor="middle">primary / cad cell</text>' +
      '<rect class="film-box" x="200" y="90" width="60" height="24"/>' +
      '<polygon class="film-amber film-spray" points="230,114 200,190 260,190"/>' +
      '<text class="film-muted" x="340" y="80">~140 PSI</text>' +
      '<text class="film-muted" x="340" y="100">cad cell must see light</text>' +
      '<text class="film-muted" x="260" y="212" text-anchor="middle">Not a gas valve. Prove the eye.</text>' +
      "</svg>"
    );
  }

  function svgGas() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-box film-soo-2" x="40" y="80" width="80" height="50" rx="4"/>' +
      '<text x="80" y="110" text-anchor="middle">inducer</text>' +
      '<rect class="film-shell" x="150" y="60" width="220" height="100" rx="4"/>' +
      '<rect class="film-amber film-pulse" x="170" y="130" width="40" height="16"/>' +
      '<rect class="film-amber film-pulse" x="230" y="130" width="40" height="16"/>' +
      '<rect class="film-amber film-pulse" x="290" y="130" width="40" height="16"/>' +
      '<text x="260" y="90" text-anchor="middle">heat exchanger</text>' +
      '<text class="film-muted" x="400" y="110">CO is the fail</text>' +
      '<text class="film-muted" x="260" y="200" text-anchor="middle">80% or 90%. Manometer the valve.</text>' +
      "</svg>"
    );
  }

  function svgHydronic() {
    return (
      '<svg class="film-svg" viewBox="0 0 520 220" xmlns="http://www.w3.org/2000/svg">' +
      '<rect class="film-shell" x="40" y="80" width="90" height="60" rx="4"/>' +
      '<text x="85" y="114" text-anchor="middle">boiler</text>' +
      '<circle class="film-shell" cx="210" cy="110" r="28"/>' +
      '<g class="film-impeller" transform="translate(210 110)">' +
      '<rect fill="#e0b050" x="-3" y="-20" width="6" height="40"/>' +
      '<rect fill="#e0b050" x="-20" y="-3" width="40" height="6"/>' +
      "</g>" +
      '<rect class="film-box film-pulse" x="300" y="90" width="70" height="40" rx="4"/>' +
      '<text x="335" y="114" text-anchor="middle">zone</text>' +
      '<circle class="film-box" cx="430" cy="110" r="24"/>' +
      '<text x="430" y="114" text-anchor="middle" font-size="10">tank</text>' +
      '<circle class="film-hot film-hy-dot" r="5" cx="0" cy="0"/>' +
      '<circle class="film-hot film-hy-dot2" r="5" cx="0" cy="0"/>' +
      '<text class="film-muted" x="210" y="160" text-anchor="middle">circ</text>' +
      '<text class="film-muted" x="260" y="204" text-anchor="middle">Fill 12 PSI. Relief 30. Purge last.</text>' +
      "</svg>"
    );
  }

  var DRAW = {
    cycle: svgCycle,
    compressor: svgCompressor,
    scroll: svgScroll,
    condenser: svgCondenser,
    evaporator: svgEvaporator,
    txv: svgTxv,
    piston: svgPiston,
    reversing: svgReversing,
    furnace: svgFurnace,
    contactor: svgContactor,
    blower: svgBlower,
    thermostat: svgThermostat,
    oil: svgOil,
    gas: svgGas,
    hydronic: svgHydronic
  };

  function panel(id) {
    var draw = DRAW[id] || DRAW.cycle;
    var note = NOTE[id] || NOTE.cycle;
    return (
      '<p class="eyebrow">Cutaway · live motion</p>' +
      '<p class="film-cutaway-note">' +
      note +
      "</p>" +
      '<div class="film-cutaway-stage">' +
      draw() +
      "</div>"
    );
  }

  function inject(root, id) {
    if (!root) return;
    var box = document.createElement("div");
    box.className = "panel film-cutaway";
    box.innerHTML = panel(id);
    root.appendChild(box);
  }

  global.LtFilmAnim = { panel: panel, inject: inject, NOTE: NOTE };
})(window);
