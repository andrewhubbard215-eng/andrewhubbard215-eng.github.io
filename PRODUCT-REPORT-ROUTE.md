# HVAC Allstars — shop pass (2026-10-04 lane A playtest)

## Live
- floor v3.5.344
- SW lt-allstars-v582
- register sw.js?v=582
- route-floor.js?v=19 — ticket tag stays the dispatch job
- sku.js?v=17 branding-only. sandbox-ts.js?v=14 (no hook inject).

## PLAYED
- Clock-in pass. Shop floor fills 1440×900.
- Service calls: ticket is a 300px left rail. System stays on the right.
- Hook gauges was renaming the ticket (Row home → Slow leak, Dave → Air in the circuit) while the choices stayed on the original call. FAIL before the fix.
- Voltmeter school: sticky probe line at top (BLACK → COM / RED → VΩ). Still a quiz, not probe-on-lugs. Fills the monitor.
- Sandbox: parts LEFT, packs, seat steps. Opens. Drag not re-walked after the ticket fix.
- HUB chip did not cover the COM jack on this pass.

## SHIPPED
- Hook gauges no longer overwrites Ticket: with the sandbox fingerprint. Job name stays. Fingerprint moves to the pay line.
- Cache register bumped to sw.js?v=582 so v581 does not stick.

## STILL OPEN
- Voltmeter school is still choices, not probe-on-lugs
- Manifold school is not its own bay — gauges live on the service call
- Direction bar is sticky gray, not a red pin

## TOMORROW
- Walk meter school leads (COM / VΩ / equip ground) and sandbox compressor drop for a leftover box.
