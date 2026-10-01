# HVAC Allstars — shop pass (2026-10-01 route)

## Live
- floor v3.5.280
- Clock In → Service calls → Hook gauges

## PLAYED
- Clock-in: pass (shop floor, v3.5.279 before this ship)
- Service calls: ticket rail + customer quote + stars present
- Hook gauges before this ship: button said "Hook meter leads"; Saturday meter stayed on Ken's iced coil and did not follow the open-system ticket
- Next random ticket before this ship: quiz ticket swapped; manifold fingerprint did not

## SHIPPED
- `route-ticket-gauges.js` parks the manifold in `#svc-system-host`
- Hook gauges seats Blue/Red needles + SH/SC from the ticket fingerprint (open, airflow, restriction, dirty condenser, lineset, undercharge)
- Next random ticket calls `ServiceCalls.nextTicket` and repaints; fault key must change
- Dispatch radio, streak, customer quote, pay stub, haptic on seat
- Dispatch is not fixed over the hose drop; palette stays left; preview stays sticky
- Store listing not touched — no campus marks added

## STILL SUCKS
- Service quiz table and sandbox ticket table are still two lists
- Voltmeter school is still choices, not probe-on-lugs
- Analog faces in the call bay are a seated manifold, not the full four-part glass, until the sandbox root is actually mounted
- Play Console still needs a human upload
