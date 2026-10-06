# HVAC Allstars — shop pass (2026-10-06 evening)

## DATE
2026-10-06 evening

## LIVE PLAY
- Strip before ship: v3.5.387 / SW lt-allstars-v629. After ship: v3.5.388, sandbox-hook ?v=19, sandbox-layout ?v=44, SW lt-allstars-v630.
- Boot shell was still writing hook ?v=18 and layout ?v=43 while CORE already had 19 and 44. Cache bust now matches the files on main.
- Desktop clock-in: check after ship.
- Phone 390: prior pass. Service call Ken / barbershop / suction iced. Hook gauges, blue+red seated. Glass: Blue 62 / Red 300 / sat 25/96 / SH 0 / SC 10. Airflow-before-charge ticket.
- Both canvases painted. No crash.

## BROKE
- Phone: four fixes lived under a 32vh rail. Choice rects started at y=466 while the card ended at y=393. Tap on the thaw fix hit #lt-g-low, not the button.
- Boot document requested older hook and layout query strings than CORE, so Pages could keep the previous bytes.

## FIXED
- Phone sheet max-height none, overflow visible. Choices stay in flow above the manifold.
- Gauge canvases pointer-events none, max-height 96px, so glass does not eat the sheet.
- Store listing still has no Lincoln marks.
- index.html patch writes sandbox-hook.js?v=19 and sandbox-layout.css?v=44. SW lt-allstars-v630. Strip v3.5.388.

## STILL SUCKS
- Voltmeter school is still choices, not probe-on-lugs.
- Manifold school is still the service-call bay.
- Gauges of God stays off the main floor.
- Hard refresh still required once for the service worker.

## SHIPPED
- index.html stamp v3.5.388
- sw.js lt-allstars-v630
- sandbox-hook.js?v=19 and sandbox-layout.css?v=44 aligned to CORE
