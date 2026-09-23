# HVAC Allstars — shop pass (2026-09-23)

## What a tech can play
Clock In → Service calls → Hook gauges. Live box seats the four LEFT parts and **starts the compressor**. Blue / Red / SH / SC follow the ticket fingerprint (leak = high SH low SC from 72% charge; ice / drier / dirty ODU / dead fan have their own multipliers). Dispatch radio, streak, customer quote, HUB roast / pay stub stay on the bar. Next random ticket changes `_ltTicketId` and reloads `loadRouteTicket` so the fault actually changes.

## What still sucks
- TXV-bulb and “air in circuit” fingerprints are thinner than leak/ice.
- Mobile 480 path still flashes “Opening system bay…” then rebuilds.
- Service.js tickets and sandbox TICKETS are two lists; name-map can miss a new customer.
- Gauges of God still parked. Good.

## What shipped
- `sandbox.js` `setTicket` + auto Start compressor on route load (`?v=156`)
- `route-floor.js` Next ticket reloads live fault (`?v=9`)
- SW `lt-allstars-v344`
- No Lincoln marks on store copy this pass. Palette stays LEFT. Dispatch is in the gauges column, not over parts.
