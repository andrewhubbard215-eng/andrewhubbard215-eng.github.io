# HVAC Allstars — shop pass (2026-10-06)

## DATE
2026-10-06

## PLAYED
- Clock in: pass. Shop floor, strip was v3.5.377 before this ship.
- Service calls: pass. Priya / Office / one zone dead. Slim ticket rail. System host stayed up. Blue / red / yellow chips on the palette. Hook gauges left directions blank (lt-fault empty).
- Meter school: fail. Still a choice sheet. Direction bar is at the top (BLACK → COM · RED → VΩ). No probe-on-lugs, no equip-ground chip, no R-to-C 24 VAC.
- Sandbox: fail on the way in from a service call. screen-sandbox was an empty 1440×900. #sandbox-root gone.
- HUB: pass. Roast slider stayed on the dispatch strip, did not cover the hose chips.

## BROKE
- After a service call, #sandbox-root is gone. Shop floor → System sandbox paints a blank bay. restoreBayHome bailed because the node was missing.

## FIXED
- bay-restore.js rebuilds #sandbox-root and calls HVACSandbox.start once. Verified in the live session: parts LEFT, COMP / COND / TXV / EVAP, Start compressor, restriction fault line came back.
- Stamp v3.5.378, bay-restore.js?v=2, SW lt-allstars-v620.

## STILL OPEN
- Voltmeter school is still choices, not probe-on-lugs.
- Manifold school is still the service-call bay, not its own walk.
- Hard refresh still required for the version strip (service worker).

## TOMORROW
- Walk manifold as its own guided bay: hang, seat, blue, red, cap yellow, purge, read. Needles plus center digital.
