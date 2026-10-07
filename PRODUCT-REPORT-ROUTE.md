# HVAC Allstars — shop pass (2026-10-07)

## DATE
2026-10-07 Lane A playtest (afternoon)

## PLAYED
- Shop floor clock-in: pass. Stamp was v3.5.391. PC fills 1440x900. No black strip.
- Service calls: Ken barbershop iced. Hook gauges. Needles up. Digital Blue 62 / Red 300 / SH 0 / SC 10. FAIL on glass: sat off/96. Next ticket changed to Jess & Marcus. Hoses blanked. Pass on ticket change.
- Voltmeter school: direction bar pinned at top. Still multiple choice, not probe-on-lugs. HUB drip bottom-right, did not cover COM. Dismissed.
- Sandbox: loop already seated, start available, standing 295 equalized. No leftover drag box on screen.
- HUB: drip did not cover gauges.

## BROKE
- Iced / low-airflow glass printed suction sat as off at 62 psig. Morning empty-system guard treated every pressure under the chart floor (70 psig) as off. SH 0 on a popsicle with sat off is a lie.

## FIXED
- sat off only at 0–1 psig (empty — do not charge). 62 psig extrapolates the 410A slope (70 psig = 25°F, 92 = 32°F) to about 22°F. Empty stays off.
- route-ticket-gauges.js guard 11, boot query v18, index stamp v3.5.396, sw.js lt-allstars-v639.
- sku.js not touched.

## STILL OPEN
- Voltmeter school is still choices, not Black-COM / Red-VΩ / equip-ground chip.
- Manifold school is still the service-call bay, not a separate guided walk.
- Hard refresh once so the service worker drops v638.

## TOMORROW
- Probe-on-lugs in meter school. Direction bar stays pinned.
