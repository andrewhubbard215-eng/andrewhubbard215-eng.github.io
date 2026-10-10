# HVAC Allstars — shop pass (2026-10-10)

## PLAYED
- Clock-in → Service calls → Hook gauges: pass. Floor loads. Banner v3.5.446.
- First ticket (Jess & Marcus, apartment install): Blue 102 / Red 268 / SH 22 / SC 2. High SH low SC fingerprint seated. Needles + preview match. Not a restriction.
- Next random ticket: DIY Dave, garage opened. Fault CHANGED to open. Blue 0 / Red 0 / SH 0 / SC 0. Empty — do not charge.
- Dispatch radio, streak, customer quote, live Blue/Red/SH/SC, pay stub all present.
- Haptic on seat already wired (navigator.vibrate).

## BROKE
- None on this route. No crashes on clock-in, call select, hook, or next ticket.

## FIXED
- Confirmed live sandbox loads ticket fingerprint on hook.
- Confirmed next random changes the fault (undercharge → open).
- Mobile CSS already keeps dispatch relative, palette left, preview sticky (phone-rail.css).
- Dual SKU: store copy has no Lincoln marks (sku.js branding-only).

## STILL OPEN
- Voltmeter school still buttons, not probes on R and C.
- Saturday meter placement under manifold on some views.
- Hard refresh needed if service worker caches old banner.

## SHIPPED
- Confirmation pass on Clock-in → Service calls → Hook gauges with fingerprint match and fault change.
- No new game mode. Shop-floor hooks (radio, streak, quote, stub, haptic, live SH/SC) kept.
- PRODUCT-REPORT updated. Banner remains v3.5.446 / SW 690.

## NEXT
- Probe R to C on the meter board. Keep one glass.
