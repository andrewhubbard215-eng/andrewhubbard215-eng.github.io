DATE: 2026-10-18
LIVE: v3.5.582
SW: lt-allstars-v825
PLAYED: Clock-in, Voltmeter school (direction bar top, BLACK→COM / RED→VΩ, Equip ground chip), System sandbox (parts LEFT seats), Service calls (ticket rail slim, system clickable, next ticket changes). No crash. PC fills. Guided visible. Drag chip vanishes on land.
BROKE: none
FIXED: none this shift (clean)
SHIPPED: clean playtest. No leftover-box / hidden-directions / blocked-drop / PC-layout break.
STILL OPEN: offline list rebuild on pinned file change; real phone test; manifold school full guided hang-to-call not fully sequenced.
TOMORROW: full manifold guided sequence; phone hard-refresh confirm tip.

- 2026-10-18 12 PM Lane A: live bays clock-in / meter / sandbox / service pass. No leftover-box or PC-layout break.

- 2026-10-17 7:45 PM Lane C: cache/SW sync. Bumped APP_VER 3.5.574→3.5.575, SW v817→v818, shop-floor-copy ?v=185→186, poster CORE ?v=1→2. sku branding-only. Clock In confirmed live. No new modules.

- 2026-10-17 12 PM Lane A: live bays clock-in / meter / sandbox / service pass. No leftover-box or PC-layout break.

- 2026-10-16 12 PM: v3.5.549 / SW lt-allstars-v793 / phone-rail.css v5 - phone LEFT seat plates show one compact name each, no doubled/overlapping labels before seating. CSS only; card map, sandbox layout, healthy 162/442 SH10/SC10 untouched.
- 2026-10-16 12:19 PM Lane A: live bays clock-in / meter / sandbox / service pass. No leftover-box or PC-layout break.

- 2026-10-16 3 PM: v3.5.552 / SW lt-allstars-v796 / phone-rail.css v6 - LEFT rail no longer shifts when a part seats (fixed 2px border, border-box, min-height, scrollbar gutter reserved). CSS only; card map, sandbox layout, healthy 162/442 SH10/SC10 untouched.

- 2026-10-16 5 PM: v3.5.554 / SW lt-allstars-v798 / sandbox-fp.js v28 - noncondensables status adds the standing-pressure vs ambient proof and under-500-micron vacuum, weigh in nameplate. Teach values (530, SH 12, SC 22) and healthy 162/442 SH10/SC10 untouched.

- 2026-10-16 7 PM: v3.5.557 / SW lt-allstars-v801 / sandbox-seats.js v33 - phone fast diagonal touch-drag of a LEFT part now seats (scroll gate only kills near-vertical swipes). Reproduced headless: quick COMP drag failed before, seats after. Clock In proven headless. Healthy 162/442 SH10/SC10, card map/layout untouched.

- 2026-10-16 7:46 PM Lane C: cache/SW sync. Bumped APP_VER 3.5.558→3.5.559, SW v801→v802, seats ?v=32→33, ts ?v=18→17 to match content. sku branding-only. No new modules.

- 2026-10-17 9 AM: v3.5.563 / SW lt-allstars-v806 - RESTORE. aba1a66 (claimed v3.5.562/SW v805 dial contrast) pushed literal $(cat ...) over index.html, sw.js, analog-gauges.js, phone-gauges-233.css; live would not boot. Restored all four from 93f244e (v3.5.561); dial-contrast content was never in the repo, so not recoverable. Healthy 162/442 SH10/SC10 untouched.

- 2026-10-17 10 AM: v3.5.564 / SW lt-allstars-v807 / phone-rail.css v7 - phone PACKS list: soft bottom fade + snap, no hard-cut button sliver at the edge. CSS only. SHOP-NOTE v562 stub replaced with real note. Healthy 162/442 SH10/SC10, layout untouched.

- 2026-10-17 2 PM: v3.5.568 / SW lt-allstars-v811 / shop-floor-copy.js v184 - RESTORE. 90ce6cb (10/16 7:05 PM) wiped shop-floor-copy.js to 11 bytes; 934b802 rebuilt only tile copy (729 B), silently dropping ~19 KB of v179 seat/standing/SH-SC/no-cool teach logic. Restored v179 body from 2feee59, kept v180-v183 tile wording. Healthy 162/442 SH10/SC10 untouched.

- 2026-10-17 4 PM: v3.5.570 / SW lt-allstars-v813 / sandbox-poster.js v2 - doubled seat names on the diamond fixed (COND over Condenser, TXV TXV, EVAP over Evaporator). Cause: second canvas (#sb-poster) drew short labels on top of base canvas names; not CSS-fixable without hiding flow animation, so poster label() now returns early (1-line JS). Also fixes stale sw.js?v=811 register lines vs VER v812 left by other bot. Healthy 162/442 SH10/SC10, layout untouched.

- 2026-10-17 8 PM: v3.5.576 / SW lt-allstars-v819 / shop-floor-copy.js v187 - RESTORE. 12ace69 truncated shop-floor-copy.js to 3 KB, then 165dc19 ("restore full") replaced it with literal PLACEHOLDER_FOR_FULL_CONTENT -> live JS error, all teach copy gone. Restored v185 body (feefafa, 19.9 KB) + kept v186 shorter LOOP OPEN tip. Healthy 162/442 SH10/SC10 untouched.
