# HVAC Allstars — shop pass (2026-10-06)

## DATE
2026-10-06

## LIVE PLAY
- Strip v3.5.371 before this ship. After ship: v3.5.372, gauges ?v=14, phone-rail ?v=3, svc-rail ?v=3, SW lt-allstars-v614.
- Clock in: pass. Shop floor, not a quiz.
- Service calls: Priya / Office / one zone dead. Hook gauges then blue+red. LTSandbox restriction, R-410A, low 74 / high 286 / sat 26/93 / SH 35 / SC 14. Preview matched. Both canvases painted.
- Next random ticket: Uncle Ray / junipers / R-22. Fault changed to dirty-cond. After hook: Blue 76 / Red 368 / sat 45/147 / SH 9 / SC 16. Streak 1 to 2. Quote, stub, HUB roast stayed up.

## BROKE
- Phone 390px: dispatch and preview covered the answer sheet (elementFromPoint hit #lt-dispatch / #lt-preview, not the choice).
- Hose palette collapsed to 0 height after chips seated. Drop column gone.
- Hard refresh still required for the version strip (service worker).

## FIXED
- Phone: ticket rail scrolls (32vh, z-index 8). Choices stay above the dispatch bar.
- Dispatch stays in the gauge column, not over the sheet. Preview sticky. Palette left, min-height 148px, hose chips 44px.
- Store listing already had no Lincoln marks. Did not add any.

## STILL SUCKS
- Voltmeter school is still choices, not probe-on-lugs.
- Yellow chip can vanish with the seated hoses, so the left column looks empty until next ticket.
- Manifold school is still the service-call bay, not its own walk.
- Gauges of God stays off the main floor.

## SHIPPED
- route-ticket-gauges.js phone stack
- phone-rail.css, svc-rail.css
- index.html stamp v3.5.372 / gauges v=14
- sw.js lt-allstars-v614
