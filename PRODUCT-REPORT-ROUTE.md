# HVAC Allstars — shop pass (2026-09-27 playtest)

## Live
- floor v3.5.188
- SW `lt-allstars-v418`
- Clock In → shop floor

## PLAYED
- Clock-in / floor: pass (fills PC)
- Sandbox: pass (seat LEFT, start blocked until loop, needles + digital)
- Meter school: fail (quiz strip, empty black, not live board)
- Service calls: fail then fix (ticket body was blank)
- HUB: pass (no cover on gauges after hook)

## BROKE
ServiceCalls.start bound to `#svc-choices`. `d()` looks up `#svc-feedback` inside that node, throws, ticket stays empty.

## FIXED
clock-in-floor.js v44 — start() host is `#screen-service`. SW v418.

## STILL OPEN
1. Voltmeter school is still a quiz, not the live board
2. Service CALLS list vs sandbox TICKETS still two tables
3. Service landing is a fat card, not a slim rail over the system

## TOMORROW
Meter school live board — Black→COM, Red→VΩ, Equip ground tray chip, red bar pinned top.
