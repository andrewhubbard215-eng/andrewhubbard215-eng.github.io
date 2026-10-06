# HVAC Allstars — shop pass (2026-10-06 evening)

## DATE
2026-10-06 evening

## LIVE PLAY
- Strip before ship: v3.5.386 / SW lt-allstars-v628. After ship: v3.5.387, phone-rail ?v=3, gauges ?v=16, SW lt-allstars-v629.
- Desktop clock-in: pass. Shop floor list.
- Phone 390: clock-in pass. Service call Ken / barbershop / suction iced. Hook gauges, blue+red seated. Glass: Blue 62 / Red 300 / sat 25/96 / SH 0 / SC 10. Airflow-before-charge ticket.
- Both canvases painted. No crash.

## BROKE
- Phone: four fixes lived under a 32vh rail. Choice rects started at y=466 while the card ended at y=393. Tap on the thaw fix hit #lt-g-low, not the button.

## FIXED
- Phone sheet max-height none, overflow visible. Choices stay in flow above the manifold.
- Gauge canvases pointer-events none, max-height 96px, so glass does not eat the sheet.
- Store listing still has no Lincoln marks.

## STILL SUCKS
- Voltmeter school is still choices, not probe-on-lugs.
- Manifold school is still the service-call bay.
- Gauges of God stays off the main floor.
- Hard refresh still required once for the service worker.

## SHIPPED
- phone-rail.css
- route-ticket-gauges.js phone stack
- index.html stamp v3.5.387
- sw.js lt-allstars-v629
