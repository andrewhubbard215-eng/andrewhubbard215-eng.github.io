/* Ohm arcade tickets — Easy→Spicy HVAC. */
(function (g) {
  "use strict";
  g.OhmsArcadeTickets = [
    {diff:"Easy",label:"Shorted contactor coil",ask:"24V control. Spec ~40Ω. Meter ~2Ω. Amp draw + what happens?",good:"I=V/R≈24/2=12A — blows fuse / overloads xfmr. Replace coil, then fuse.",bad:"I=V×R=48A — xfmr fine, weak tstat wire.",whyWrong:"I=V/R not V×R. Near-short eats fuse.",hub:"Shorted coil = fuse candy. Prove ohms after lockout."},
    {diff:"Easy",label:"Open run winding",ask:"Compressor run winding OL. Healthy LRA is high. What does OL mean?",good:"Open=∞R → I≈0. Won't start/run. Replace compressor after lockout prove-dead.",bad:"OL = low R — overload amps + hot compressor.",whyWrong:"OL is open: no path, no current.",hub:"OL = open. Zero amps through that winding."},
    {diff:"Spicy",label:"Locked-rotor amps",ask:"Compressor hums, won't start. Clamp ~LRA. Run ohms OK. Call?",good:"Rotor locked or start path dead. Kill power — don't hold LRA.",bad:"Normal RLA — leave running until free.",whyWrong:"LRA is stall. Holding burns motor.",hub:"LRA stall cooks windings. Kill power, find start path."},
    {diff:"Spicy",label:"Weak 24V under load",ask:"R–C open 27V. With Y in, sags to 16V, coil chatters. Likely?",good:"Weak/undersized xfmr or overloaded 24V. Fix load or upsize xfmr.",bad:"Normal — open 27V means healthy under any load.",whyWrong:"Open volts lie. Healthy 24V holds ~22–28V loaded.",hub:"Loaded volts tell the truth."}
  ];
})(window);
