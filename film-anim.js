/* Component film — real part photos + live flow. */
(function (global) {
  "use strict";
  var PHOTO = {
    cycle: "parts/gauges.png",
    compressor: "parts/compressor.png",
    scroll: "parts/compressor.png",
    condenser: "parts/condenser.png",
    evaporator: "parts/evaporator.png",
    txv: "parts/metering.png",
    piston: "parts/metering.png",
    reversing: "parts/condenser.png",
    furnace: "allstars/eq/gas.jpg",
    contactor: "parts/contactor.png",
    blower: "parts/fanmotor.png",
    thermostat: "parts/thermostat.png",
    oil: "allstars/eq/oil.jpg",
    gas: "allstars/eq/gas.jpg",
    hydronic: "allstars/eq/hydronic.jpg"
  };
  var NOTE = {
    cycle: "Blue suction. Red liquid. Follow the state on the real gauges.",
    compressor: "Suction in the big stub. Discharge out the small stub. Shell vibrates on vapor only.",
    scroll: "Same black shell. Inside, the orbiting scroll walks pockets to the center. Vapor only.",
    condenser: "Hot vapor in the top. Liquid out the bottom. Fan across the fins.",
    evaporator: "Metered mix in. Superheated vapor out. Air across the slab is half the capacity.",
    txv: "Real TXV. Bulb on suction. Needle hunts superheat. Charge by subcool.",
    piston: "Same body family. Fixed hole — it does not hunt. Charge by superheat.",
    reversing: "Slide lives in the outdoor chassis. Cool vs heat is one shift, same four boxes.",
    furnace: "Real gas train. Prove draft, light, sense µA, then blow.",
    contactor: "24 V coil pulls. Line pads cross. Cap is on HERM and FAN.",
    blower: "Wheel in the housing. Static first. Airflow is capacity.",
    thermostat: "R C Y G W on the real stat. Door sticker is law.",
    oil: "Real gun. Cad cell looks at the fire. Pump ~140 PSI. Not a gas valve.",
    gas: "Real burners. Manometer the valve. CO is the fail.",
    hydronic: "Real water plant. Circ moves heat. Purge before you blame the pump."
  };
  var FLOW = { compressor:"suction", scroll:"suction", condenser:"hot", evaporator:"cold", txv:"hunt", piston:"flash", oil:"spray", gas:"fire", furnace:"fire", blower:"spin", contactor:"pull", hydronic:"loop", reversing:"slide", thermostat:"call", cycle:"loop" };
  var CSS_ID = "lt-film-real-css";
  var CSS = ".film-cutaway{margin:12px;max-width:820px}.film-real{position:relative;background:#070b10;border-radius:10px;overflow:hidden;min-height:220px}.film-real img{display:block;width:100%;max-height:360px;object-fit:contain;background:#070b10}.film-real .film-fx{position:absolute;inset:0;pointer-events:none}.film-tag{position:absolute;font:700 11px/1.2 sans-serif;color:#f8fafc;background:rgba(11,18,32,.82);padding:4px 7px;border-radius:4px;border:1px solid rgba(94,234,212,.4)}.film-bead{position:absolute;width:10px;height:10px;border-radius:50%;box-shadow:0 0 10px currentColor}.film-bead.hot{background:#f87171;color:#f87171}.film-bead.cold{background:#38bdf8;color:#38bdf8}@keyframes fr-up{0%{transform:translate(-50%,8px);opacity:0}30%{opacity:1}100%{transform:translate(-50%,-70px);opacity:0}}@keyframes fr-dn{0%{transform:translate(-50%,-8px);opacity:0}30%{opacity:1}100%{transform:translate(-50%,70px);opacity:0}}@keyframes fr-spin{to{transform:rotate(360deg)}}@keyframes fr-pulse{0%,100%{opacity:.25}50%{opacity:1}}@keyframes fr-spray{0%{transform:scale(.4);opacity:.15}70%{transform:scale(1.15);opacity:.7}100%{opacity:0}}.film-fx .up{animation:fr-up 1.4s linear infinite}.film-fx .dn{animation:fr-dn 1.4s linear infinite}.film-fx .spin{position:absolute;border:3px dashed #5eead4;border-radius:50%;animation:fr-spin 1.6s linear infinite}.film-fx .glow{position:absolute;border-radius:50%;background:radial-gradient(circle,#f59e0b,transparent 70%);animation:fr-pulse 1s ease-in-out infinite}.film-fx .mist{position:absolute;width:90px;height:90px;border-radius:50%;background:radial-gradient(circle,#38bdf8aa,transparent 70%);animation:fr-spray .9s ease-out infinite}";
  function css(){ if(document.getElementById(CSS_ID)) return; var s=document.createElement("style"); s.id=CSS_ID; s.textContent=CSS; document.head.appendChild(s); }
  function beads(kind){
    if(kind==="suction") return '<span class="film-tag" style="left:8%;top:18%">SUCTION · vapor in</span><span class="film-tag" style="right:8%;top:10%">DISCHARGE · hot out</span><i class="film-bead cold up" style="left:22%;top:28%"></i><i class="film-bead hot dn" style="left:78%;top:16%"></i>';
    if(kind==="hot") return '<span class="film-tag" style="left:8%;top:10%">hot vapor in</span><span class="film-tag" style="left:8%;bottom:12%">subcooled liquid out</span><i class="film-bead hot dn" style="left:50%;top:18%"></i><span class="spin" style="right:8%;top:18%;width:54px;height:54px"></span>';
    if(kind==="cold") return '<span class="film-tag" style="left:8%;top:10%">two-phase in</span><span class="film-tag" style="right:8%;top:10%">vapor out + SH</span><span class="spin" style="right:10%;bottom:16%;width:48px;height:48px"></span>';
    if(kind==="hunt") return '<span class="film-tag" style="left:8%;top:10%">BULB hunts SH</span><span class="film-tag" style="right:8%;bottom:12%">flash to evap</span>';
    if(kind==="flash") return '<span class="film-tag" style="left:8%;top:12%">fixed hole · no hunt</span><span class="mist" style="right:16%;top:28%"></span>';
    if(kind==="spray") return '<span class="film-tag" style="left:8%;top:10%">cad cell must see light</span><span class="glow" style="left:62%;top:38%;width:70px;height:70px"></span>';
    if(kind==="fire") return '<span class="film-tag" style="left:8%;top:10%">prove draft · then fire</span><span class="glow" style="left:42%;bottom:22%;width:120px;height:80px"></span>';
    if(kind==="spin") return '<span class="film-tag" style="left:8%;top:10%">measure static</span><span class="spin" style="left:42%;top:28%;width:90px;height:90px"></span>';
    if(kind==="pull") return '<span class="film-tag" style="left:8%;top:10%">24V coil</span><span class="film-tag" style="right:8%;top:10%">L1/L2 cross</span>';
    if(kind==="loop") return '<span class="film-tag" style="left:8%;top:10%">water moves heat</span><i class="film-bead hot up" style="left:30%;top:40%"></i>';
    if(kind==="slide") return '<span class="film-tag" style="left:8%;top:10%">slide · cool / heat</span>';
    if(kind==="call") return '<span class="film-tag" style="left:8%;top:12%">R C Y G W</span>';
    return "";
  }
  function panel(id){
    return '<p class="eyebrow">Real part · live flow</p><div class="film-real"><img src="'+(PHOTO[id]||PHOTO.cycle)+'" alt=""><div class="film-fx">'+beads(FLOW[id]||"loop")+'</div></div><p class="film-cutaway-note">'+(NOTE[id]||NOTE.cycle)+'</p>';
  }
  function inject(root,id){
    if(!root) return;
    css();
    if(root.querySelector("[data-film-anim]")) return;
    var box=document.createElement("div");
    box.className="panel film-cutaway";
    box.setAttribute("data-film-anim", id||"cycle");
    box.innerHTML=panel(id||"cycle");
    root.appendChild(box);
  }
  global.LtFilmAnim={inject:inject,mount:inject,panel:panel,NOTE:NOTE};
})(window);
