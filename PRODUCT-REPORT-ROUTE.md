# HVAC Allstars — shop pass (2026-10-09)

## PLAYED
- Clock-in: pass. Floor loads. Banner was v3.5.427.
- Service calls: Uncle Ray, ranch, condenser in junipers, R-22 TXV. Hook gauges seated dirty-cond fingerprint: Blue 76 / Red 368 / SH 9 / SC 16. Low canvas blue face, high canvas red face, number ink on both dials. LTSandbox matched the glass.
- Next random ticket: fault changed. Jess & Marcus, long lineset. Blue 102 / Red 268 / SH 22 / SC 2, undercharge-lineset, R-410A. Not the juniper print.
- Dispatch radio, streak stars, customer quote, stub, HUB roast, live Blue/Red/SH/SC stayed on the bay.
- Phone 390x844: palette left, hoses did not overlap dispatch, but the sheet was uncapped so preview and hose drop sat below the fold.

## BROKE
- phone-rail.css @720px set the service sheet to max-height none, which overrode the phone cap. Dispatch landed at the bottom of the first screen. Gauges and ports were off the glass.

## FIXED
- Phone sheet capped at 26vh and scrolls, so the four fixes stay tappable and the manifold stays up. Dispatch collapsed to one line (52px) so it cannot cover the hose drop. Palette stays left. Preview stays sticky.
- Voltmeter school (still a quiz) got a shop strip: dispatch line, streak, stub, HUB roast, haptic on the pick. Not a new mode.
- Banner v3.5.428. SW lt-allstars-v672. route-ticket-gauges.js?v=20. voltmeter-school.js?v=10. sku.js and store/ not touched.

## STILL OPEN
- Voltmeter school is still two buttons, not probes on R and C.
- Saturday meter still sits under the manifold.
- Hard refresh once so the worker drops v671.

## TOMORROW
- Probe R to C on the meter board. One glass only.
