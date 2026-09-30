# HVAC Allstars — shop pass (2026-09-30 Lane A)

## Live
- floor v3.5.240
- SW `lt-allstars-v478`
- Clock In → shop floor. Dual SKU intact.

## PLAYED
- Clock-in / floor: pass
- System sandbox: pass (LEFT parts, standing P, analog + digital)
- Voltmeter school: fail (still multiple-choice, not probe-on-lugs)
- Service calls: fail — Hook gauges jumped to full sandbox, ticket rail gone, empty bay before hook

## FIXED
Hook gauges keeps the live sandbox parked in `#svc-system-host`. Sandbox screen cannot steal the call. Ticket rail stays slim. Needles stay on the ticket.

## STILL OPEN
1. Voltmeter school still choice-based (not probe-on-lugs)
2. Service CALLS list vs sandbox TICKETS still two tables
3. True probe board — Black→COM, Red→VΩ

## NEXT
Probe board. Then one ticket table.
