# HVAC Allstars — shop pass (2026-10-05 playtest lane)

## DATE
2026-10-05

## PLAYED
- Clock in: pass. Shop floor fills the monitor. v3.5.359 strip until hard-refresh; script now v13.
- Service calls: pass after fix. Uncle Ray junipers (R-22 nameplate) then next ticket. Hook gauges seats blue/red/yellow. Needles paint. Center psig sits under the hub so the needle does not cover it.
- Next ticket: was a crash. Now blank glass, hoses come back wired, click seats blue and the chip goes away.
- Voltmeter school: pass as a choice bay. Direction line is on the sheet. Not probe-on-lugs.
- Sandbox / HUB: not the broken path this shift. HUB strip did not cover the hose palette.

## BROKE
- Next random ticket threw `satL is not defined` in hold(). LTSandbox never got the sats.
- Hose chips rebuilt after next ticket had no click/drag. Blocked drop.

## FIXED
- hold() computes sat before it writes LTSandbox.
- New hose chips get wireHose. Blue click seats and the chip leaves.
- Digital psig drawn under the hub with a dark backing.
- Cache: route-ticket-gauges.js?v=13, floor stamp v3.5.360, sw.js lt-allstars-v601.

## STILL OPEN
- Voltmeter school is still choices, not probe-on-lugs.
- Manifold school is the service-call bay, not its own guided walk.
- Version strip can stay on 359 until a hard refresh (service worker).

## TOMORROW
Hard-refresh, then meter school: land black on COM, red on VΩ, equip ground on GND, probe R to C for 24 VAC.
