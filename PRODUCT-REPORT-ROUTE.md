# HVAC Allstars — shop pass (2026-09-17)

## What a tech can play
- Clock In → shop floor (no crash).
- Service Calls → **Hook gauges** opens the live sandbox with that ticket's fingerprint.
- **Next random ticket** swaps the fault (needles + SH/SC change).
- Dispatch radio, streak, customer quote, live Blue/Red/SH/SC stay on the gauges column.
- Shop hook: pay stub + HUB roast on the ticket.
- Parts palette stays LEFT. Dispatch is not sticky over hose/parts drop.

## What still sucks
- Service Calls still has a multiple-choice closer under the hook. Route is live; the quiz is leftover.
- Mystery mode locks the fault dropdown (correct) but the first paint can lag one tick before needles settle.
- Dual SKU store copy is clean on files touched; campus title still says Lincoln Tech on the clock-in hero (campus SKU).

## Shipped
- `HVACSandbox.loadRouteTicket(id)` applies FIELD_JOBS + seats the manifold.
- `route-floor.js` v2 wired to Clock In path.
- Cache `lt-allstars-v218`. Gauges of God still parked. No combat.
