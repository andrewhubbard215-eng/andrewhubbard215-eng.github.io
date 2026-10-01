# HVAC Allstars — shop pass (2026-10-01 lane A)

## Live
- floor v3.5.290
- SW lt-allstars-v526
- Clock In → Service calls → Hook gauges

## PLAYED
- Clock-in: pass (shop floor fills the window, v3.5.289 before this ship)
- Service calls: ticket rail + customer quote + stars present. Hook gauges seats dirty-cond Blue 128 / Red 455 / SH 9 / SC 11
- Yellow hose had no cap port — drop did not land. Gauge digits were 16px under the needle, not a center window
- Meter school / sandbox / HUB not re-walked this pass (service bay owned the screen)

## SHIPPED
- `route-ticket-gauges.js` yellow cap port. Blue only on suction, red only on liquid, yellow only on the cap. Landed chip is removed
- Analog faces keep the needle. Center digital is 32px psig. Preview line is 18px
- Cache bump: script v=2, floor v3.5.290, SW v526

## STILL OPEN
- Voltmeter school is still choices, not probe-on-lugs
- Service quiz table and sandbox ticket table are still two lists
- Uncle Ray nameplate still says R-22 TXV
