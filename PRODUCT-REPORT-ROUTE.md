# HVAC Allstars — shop pass (2026-09-29 Lane A playtest)

## Live
- floor v3.5.216
- SW `lt-allstars-v452`
- Clock In → shop floor. Dual SKU intact (Lincoln marks campus only).

## PLAYED
- Clock-in / floor: pass (fills the monitor)
- System sandbox: pass (needles + center digital, LEFT parts, start locked until 4 seated)
- Voltmeter school: fail then fixed (thin 720px strip, black void under the bay)
- Service calls / HUB: not crashed; HUB chip sits off the gauges

## BROKE
Voltmeter school on a PC monitor was a skinny column with empty black below. Probe bar was not sticky.

## FIXED
Dropped the 720px cap. Bay is 100% width / min-height 100vh. BLACK→COM / RED→VΩ bar pinned at the top.

## STILL OPEN
1. Voltmeter school is still choice-based (not probe-on-lugs)
2. Service CALLS list vs sandbox TICKETS still two tables
3. Hook gauges on the rail does not yet park the live sandbox in the bay

## TOMORROW
True probe board — Black→COM, Red→VΩ, tap lugs, read the string.
