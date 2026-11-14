# The Astral Archives — Nadir Evidence Investigation Vertical Slice V1

**Approved:** 2026-11-14  
**Work branch:** `experiment/room-case-library-layout-fix-2026-11-14`  
**Asset extraction branch (separate Codex task):** `experiment/remaining-rooms-layered-assets-v1-2026-11-14` (pending external work; never merge blindly)

## User-approved design contract

- **Manual Evidence Collection:** inspection and solving an analytical interaction never collect evidence automatically. The player explicitly clicks `COLLECT EVIDENCE`. Collection is idempotent.
- **Quick Evidence Tray:** mounted persistently in all four present-timeline rooms. Displays unfiled count, collected records, and provides `OPEN MISSION FOLDERS` from any room. The Mission Folders return to the source room after closing; navigation is client-side, preserving fullscreen in supported browsers.
- **Physical evidence filing only:** the tray does not silently auto-file. The player opens Mission Folders, chooses evidence, selects one of five case folders (or unfiled), then explicitly clicks `FILE HERE`.
- Wrong filing is retained silently and produces **zero required-progress** for the wrong case. Evidence moves without penalty; moving required evidence away subtracts its progress.
- **Rescue access unlocks at 6/6 correctly filed required records** for each mission, regardless of diagnosis. Nadir's three-part causal review and engineering repair test occur inside Rescue and are not prerequisite unlocks.
- No timer, arbitrary damage, punitive retries or microtransaction gates; challenging analysis comes from reading primary records, tracing dependencies, reconciling simulated measurements and validating hypotheses.
- Hints unlock after two failed attempts (level 1) and four failed attempts (level 2), remain optional, and never directly mark a puzzle complete.
- All case data is fictional; source materials are from `src/archive/evidenceRecords.ts` / Cases Evidence Production Bible v2. The training simulation must not be represented as NASA telemetry.

## Nadir — eight original authored evidence IDs

| Record | Room and physical scene object | Challenge | Dependency |
|---|---|---|---|
| NAD-06 | Investigation / Evidence Board | Audit NAV-042: administrative closure lacks rerun proof | None |
| NAD-02 | Signal / receiver rack | Convert 12 lbf·s into N·s numerically, with correct source/target units | None |
| NAD-01 | Signal / main central radar display | Reconcile two simulated tracks after unit conversion | NAD-02 |
| NAD-04 | Archive / center processing desk | Trace producer V3 in lbf·s → consumer parser V2 in N·s; rule out tampering | None |
| NAD-03 | Archive / right Mission Archive console | Repair ICD-07 unit/ownership/test contract | NAD-04 |
| NAD-05 | Recordings / large right-side video review | Reconstruct export → residual → cross-check request → premature ticket closure | NAD-06 |
| NAD-07 (optional) | Recordings / recording rack | Classify subjective review memory as uncorroborated lead | None |
| NAD-08 (optional) | Archive / left file drawer | Review force–time dimension of impulse | None |

Sources: `public/assets/rooms/Signal_Original_REFERENCE.png`, `Archive_Original_REFERENCE.png`, `Recordings_Original_REFERENCE.png`; these are **flat source plates**, not yet integrated Codex layer packs. Their interactive areas are provisional percentages recorded in `src/gameplay/StationRoom.tsx`. Do not present them as final mask precision; replace with actual Codex object layers when available and verify boundaries on physical devices.

The existing layered Investigation Room is preserved untouched except for wiring the evidence board to `NAD-06`, activating station-door navigation, and linking the rescue console to evidence progress.

## Player loop

1. Home → Investigation Room, click Evidence Board and open NAV-042.
2. Inspect source content; submit analytical reconstruction; if incorrect, retry or use progressive hints.
3. On success, explicitly collect the evidence. Its ID is added to `astral-archive-folder-v1.discovered` but remains `UNFILED`.
4. Travel via the Station Door to other three rooms; complete cross-room puzzle dependencies.
5. Open Quick Evidence Tray in any room, inspect newly collected cards, then open Mission Folders with a return-to-room flag.
6. Select a physical sheet, pick one of five mission folders, and click `FILE HERE`. Refile/Unfile freely.
7. At six correctly filed required Nadir records, Rescue activates regardless of prior diagnosis status.
8. In `/?rescue=NAD`, construct a technical/process/consequence causal chain supported by separate filed records. An unsupported citation fails without exposing answers.
9. Define a repaired interface (canonical N·s, conversion owned by producer, consumer validation) and calculate two independent synthetic input vectors (12 and 0.8 lbf·s). Run the acceptance test. The simulated repair must pass all five checks.
10. Completion is recorded in `astral-nadir-investigation-v1.rescue`. This is a verified **fictional engineering training simulation**, not a claim that a historical NASA mission was altered.

## Implementation map

- `src/gameplay/nadirEngine.ts` — source-specific challenge definitions, dependencies, numeric validators, hint/attempt state and test vectors
- `src/gameplay/NadirPuzzle.tsx` + `nadirPuzzle.css` — case investigation view, raw fragments, reconstructed schematic, answer submission, hints and manual collection
- `src/gameplay/StationRoom.tsx` + `stationRoom.css` — present-timeline Archive / Signal / Recordings scenes, temporary hotspots, responsive layout
- `src/gameplay/EvidenceTray.tsx` + `evidenceTray.css` — portable inventory and direct Mission Folders entry
- `src/gameplay/gameSave.ts` — persisted archive and Nadir research state and same-tab state notifications
- `src/gameplay/NadirRescue.tsx` + `nadirRescue.css` — causal review plus two-vector engineering verification
- `src/InvestigationDesignerScene.tsx` — preserves Codex V4 physical layer interaction scene, activates evidence board, room directory and rescue console
- `src/archive/ArchiveFolderLab.tsx` — select-and-file, source-room return path, hides uncollected development evidence except with explicit `?debug=1`; leaves older other-case previews intact
- `src/archive/archiveState.ts` — rescue access now requires correct filing only, not diagnosis

## Persistence and compatibility

The original `astral-archive-folder-v1` schema remains version 1; no unrelated case saves are deleted or migrated. Nadir-specific challenges use a separate `astral-nadir-investigation-v1` key. Both states are synchronized across station route remounts. No previous save is automatically reset.

The existing archive diagnostic MCQ preview remains available for other cases as prototype content. Nadir's diagnostic review is in Rescue. Other mission rescue execution is **not** implemented; a filed 6/6 for those missions does not imply a playable rescue yet.

## Verification

- `npm run test:studio` runs the existing investigation, fixed room, rescue, archive, navigation and layered-asset suites plus `test:nadir`.
- `src/gameplay/nadirEngine.test.mjs` covers all eight IDs, cross-room mapping, hint/inspection independence, impulse conversion, scenario dependencies, chronology, independent rerun, invalid save inputs and persistence shape.
- Vercel build runs all suites before TypeScript and Vite. Deployment readiness should be confirmed after the final commit.
- Outstanding QA: no physical Android Brave fullscreen/landscape screenshots for this new gameplay flow; no end-to-end browser automation of actual clicks/keyboard/touch was executed in this task. The station hotspots are provisional flattened-art regions until Codex supplies per-object layers.
- Future: integrate Codex's Archive/Signal/Recordings layer packs without overwriting the puzzle state engine, replace placeholder composition, connect time-travel transition and full Past interactive rooms, and build the other four cases in order.
