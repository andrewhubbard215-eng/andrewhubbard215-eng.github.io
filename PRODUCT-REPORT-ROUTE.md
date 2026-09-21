# HVAC Allstars — shop pass (2026-09-21)

## What a tech can play
- Clock In → Service Calls (no-cool sheet + customer quote).
- Next random ticket swaps the complaint / fingerprint.
- Hook gauges is supposed to open System Sandbox with that ticket’s fault on Blue/Red/SH/SC.
- Dispatch radio, streak, pay-stub line, HUB roast stay on the box.
- Palette LEFT. Preview stays up. Store SKU: no Lincoln on copy we touched.

## What still sucks
- Live Pages (before this ship): Hook gauges did **not** open the sandbox. `ltPlay("sandbox")` is a stub. HVACSandbox never loaded. Clicking Hook gauges only shuffled the paper ticket.
- Needles + SH/SC fingerprint cannot be proven on the public host until this cache-bust lands.
- DirtyBird desktop was offline — Hub PC copy not synced.
- Gauges of God still parked. Not the floor.

## What I shipped
- `route-floor.js` v8: Hook gauges calls `ltStartSandbox()` (loads `sandbox.js`), waits for the box, then `loadRouteTicket(id)` + fault chip.
- Hook click no longer treated as Next ticket.
- Product report this file.

Hard-refresh `?play=1` after Pages builds.
