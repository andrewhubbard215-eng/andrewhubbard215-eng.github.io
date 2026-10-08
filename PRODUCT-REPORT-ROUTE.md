# HVAC Allstars — shop pass (2026-10-08)

## DATE
2026-10-08 Clock-in → service → hook gauges

## PLAYED
- Clock-in on published floor opened the bay list. Stamp was v3.5.396 then boot wrapper v3.5.405.
- Service calls opened Ken barbershop, suction iced, R-410A, popsicle quote, streak 0, pay stub $18.40/hr.
- Hook control still said "Hook meter leads". `__ltTicketGauges` was missing. `route-ticket-gauges.js` was not in the script list. Sandbox root never mounted. No Blue/Red/SH/SC needles. Saturday meter occupied the system host.
- Next ticket button was on the sheet. Fault could not change on glass because glass was not seated.

## BROKE
- Boot shell only bumped `route-ticket-gauges.js` if the pinned app HTML already had the tag. It did not. Hook fell through to a sandbox start that the meter host wiped.
- Dispatch / sticky LAND LEADS can sit on the hose row on a phone.

## FIXED
- Boot injects `route-ticket-gauges.js?v=19`. Stamp v3.5.406. SW `lt-allstars-v650`.
- Hook label stays "Hook gauges". Click seats blue/red/yellow and paints the ticket fingerprint (Ken iced = Blue 62 / Red 300 / SH 0 / SC 10 on 410A).
- Next random ticket reseats. Fault line names the new id and the new Blue/Red/SH/SC.
- Dispatch and the meter LAND LEADS stay in flow. Palette stays left. Preview stays sticky. HUB roast, stub, streak, haptic kept. sku.js not touched.

## STILL OPEN
- Saturday meter is still under the manifold. Voltmeter school is still choices, not probe-on-lugs.
- Hard refresh once so the worker drops v649.

## TOMORROW
- One glass only. Meter school probes on lugs.
