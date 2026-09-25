# HVAC Allstars — shop pass (2026-09-24 night)

## What a tech can play
Clock In → System sandbox. Parts LEFT. Start when the loop is seated. Service calls: hook gauges then pick the path. Next ticket must change the fault.

## What shipped
- v3.5.152 · SW `lt-allstars-v376`
- sku.js loaded once (head only) — branding applies before paint, no second inject
- index `style.css?v=146` and `route-floor.js?v=9` now match SW CORE
- sku.js stays branding-only. sandbox-hook stays v18.

## What still sucks
- service.js CALLS and sandbox tickets are still two lists
- Hard-refresh once after this SW bump or Pages will serve the old strip
