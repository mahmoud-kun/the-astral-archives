# Work Order A — Cases, Assets, Rooms and Integration

**Role:** The Astral Archives — Cases/Assets Integration Lead  
**Authority:** [5-hour parallel sprint](PARALLEL_RELEASE_PLAN_2026-11-15.md) (must read first)  
**Working branch:** `experiment/room-case-library-layout-fix-2026-11-14` (re-fetch HEAD immediately). Do not create branches/reset/merge to main.

## Mission
Turn the *actually delivered* designer/Codex case and room media into a coherent playable four-room investigation, and reconcile all five cases with their correct source/room IDs. Integrate only verified visually acceptable assets; original artwork is immutable. Own case data integration without modifying the puzzle engine or audio.

## Sources to inspect before editing
1. `EXPERIMENT.md`, `docs/studio-pilot/NADIR_INVESTIGATION_VERTICAL_SLICE_V1.md`, `docs/studio-pilot/INVESTIGATION_LAYERED_INTEGRATION_V4.md`.
2. `docs/REMAINING_ROOMS_LAYERED_ASSET_HANDOFF.md` from **existing external asset branch** `experiment/remaining-rooms-layered-assets-v1-2026-11-14` at or after commit `48213bd67be242cdb961cd4682b331543941aba4`.
3. Current asset manifest/source folder(s) in Google Drive: NASA designer library and the user-supplied Production Bible, live content files `src/archive/evidenceRecords.ts`.
4. Existing `src/InvestigationLayeredScene.tsx`, `src/InvestigationDesignerScene.tsx`, `src/gameplay/StationRoom.tsx`, related CSS/QA.

## Exclusive write scope
- `public/assets/rooms/**` (add/versioned outputs; preserve immutable originals)
- `public/assets/optimized/room-*.webp` (new/versioned only)
- `src/gameplay/StationRoom.tsx`, `src/gameplay/stationRoom.css`
- `src/InvestigationLayeredScene.tsx`, `src/investigationLayeredScene.css`
- `src/archive/evidenceRecords.ts` **content only with stable record IDs**
- `docs/production/handoffs/CASES_ASSETS.md`

No edits to `src/main.tsx`, Home, audio, Nadir puzzle/rescue engine, archive save. Propose changes for Main/C rather than crossing ownership.

## Required execution
1. Establish 5-case truth table: case code/name; story/verified-vs-fictional source; evidence quantity & location; playable/preview/not implemented; missing designer/mission files. Do not invent missing evidence or label prototype gameplay finished.
2. Produce asset map for four present rooms and four Past packs: source file, dimensions/orientation, layered objects, mask/alpha/clean-plate status, expected interaction. Verify all paths, no source overwrite; compare reconstruction clean plates against actual artwork.
3. Integrate approved **present** Archive/Signal/Recordings object overlays, masks and glows into real gameplay; never sacrifice existing Nadir evidence hotspots or room navigation. If hidden clean plates are still visually wrong, use intact source plate as fallback and disclose the limitation.
4. Independently confirm keyboard focus, mouse hover, touch hotspots and clickable target coordinates. 1366x768 and 915x412 landscape first, then 800x360. Keep first-person stationary camera and approved Investigation room untouched in visual direction.
5. Past 1080x1920 artwork cannot be resized to 16:9 by stretching/cropping significant stations. List newly received landscape assets or block production past integration pending designer. Coordinate cinematic media with B; no independent camera redesign.
6. Coordinate scientific validity with C by sending evidence IDs, hypotheses, units, proposed content changes; C audits, A owns source data edit after accepted feedback.
7. Run relevant room/layer/unit tests, build and browser visual QA where tool access permits; distinguish tests run from tests not run.

## Fast checkpoints
- **T+60:** case/asset inventory + critical missing designer assets + exact integration map to Main.
- **T+150:** scene integration with screenshots or explicit blockers.
- **No later than T+195:** final handoff (or accurately marked partial) ready for Main review; do not modify shared files after freeze.

## Handoff format (send to Main and save in own handoff path)
Status DONE/PARTIAL/BLOCKED; exact commit SHA(s); original assets retained; every file changed; case-by-case status; integrated rooms/hotspots and their target IDs; source-vs-simulation claims; QA commands/results; screenshots/URLs; mobile device status; outstanding art defects/cross-owner changes; steps to independently verify. No "five cases ready" without all five playable and inspected.
