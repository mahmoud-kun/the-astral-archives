# The Astral Archives — Work Order A: Cases and Assets Handoff

**Status: PARTIAL — present-room integration committed; NOT approved by Main Chat.**
**Date:** 2026-11-15
**Working branch:** experiment/room-case-library-layout-fix-2026-11-14
**Authoritative plan:** docs/production/PARALLEL_RELEASE_PLAN_2026-11-15.md
**Owner:** Specialist A, Cases & Assets
**Integration commits:** 5843ba14e6438aabf14982b50b51dd5334179818 and 5aa87974335ae55c2541d6b05f58ac7e7058bb6e.
**Review decision:** MAIN PENDING; user art review PENDING; do not merge into historical main.

## Five-case source of truth

Read the Google Drive Cases Evidence Production Bible v2.docx (2026-11-14), designer asset library, existing src/archive/evidenceRecords.ts and current production documentation. All **40 of 40 IDs and titles** matched Bible v2; no duplicates. Every evidence record has source FICTIONAL_SIMULATION; the mission stories and telemetry are fictional educational simulations, not actual NASA telemetry. NASA historical engineering references must not be conflated with game records. No source-content edit was warranted.

| Case | Evidence and station distribution | Source/story state | Actual gameplay |
| --- | --- | --- | --- |
| KES / Kestrel | 8 total: 6 required, 2 optional; Archive 5, Recordings 2, Investigation 1 | Fictional launcher/mission architecture trade | Folder and evidence previews; full normal-room puzzle→collection→Rescue NOT VERIFIED |
| NAD / Nadir | 8 total: 6 required, 2 optional; Signal 2, Archive 3, Recordings 2, Investigation 1 | Fictional impulse-units / interface contract failure | Existing vertical slice and Nadir Rescue, eight linked evidence IDs; newly integrated art interactions still require visual and device QA |
| LUM / Lumen | 8 total: 6 required, 2 optional; Archive 3, Signal 3, Investigation 1, Recordings 1 | Fictional optics/metrology calibration | Preview only; no proven playable normal-room rescue |
| ORI / Oriole | 8 total: 6 required, 2 optional; Signal 3, Archive 2, Investigation 1, Recordings 2 | Fictional transient touchdown detection | Preview only; no proven playable normal-room rescue |
| AST / Asterion | 8 total: 6 required, 2 optional; Archive 3, Signal 2, Investigation 1, Recordings 2 | Fictional thermal power and audit revisions | Preview only; no proven playable normal-room rescue |

The approved Nadir gate is six correctly filed required records; causal diagnosis and two-vector test are **inside** Rescue. The older Bible text requiring a diagnosis before unlocking is superseded.

## Asset ledger / original-art protection

The external Codex source branch experiment/remaining-rooms-layered-assets-v1-2026-11-14 was verified to equal the handoff commit 48213bd67be242cdb961cd4682b331543941aba4 exactly. All 45/45 referenced object asset paths in the three Present manifests were found in that Git tree (Archive 13, Signal 15, Recordings 17). The imported Present subtree contains **51 source-traced files**, including base images, screens, mask PNGs, glow PNGs, untouched manifest JSON, and reconstructed plates. Original designer PNG blobs were equal across source and active branch and were not modified. Existing optimized art outputs were not overwritten.

| Timeline/room | Native dimensions | Source/pack | Objects | Runtime status |
| --- | --- | --- | --- | --- |
| Present Investigation | 1916 × 821 wide manifest | public/assets/rooms/investigation/layers/wide and Investigation_Wide_Artwork.png | 5 | Already integrated; deliberately kept unchanged by A |
| Present Archive | 1672 × 941 | Archive_Original_REFERENCE.png and public/assets/rooms/archive/layers/original | 4 | Mask/glow/screen overlays integrated; intact original-art WebP or PNG fallback |
| Present Signal | 1672 × 941 | Signal_Original_REFERENCE.png and public/assets/rooms/signal/layers/original | 4 | Mask/glow/screen overlays integrated; intact source fallback |
| Present Recordings | 1672 × 941 | Recordings_Original_REFERENCE.png and public/assets/rooms/recordings/layers/original | 5 | Mask/glow/screen overlays integrated; intact source fallback |
| Past Manufacturing & Materials | 1080 × 1920 portrait | past/sources/01_Manufacturing_Materials_1080x1920.png, manufacturing/layers/portrait on Codex branch | 3 | Inventoried only; blocked from landscape production |
| Past Mission Target | 1080 × 1920 portrait | past/sources/02_Mission_Target_1080x1920.png, mission_target/layers/portrait on Codex branch | 4 | Inventoried only; blocked from landscape production |
| Past Data Analysis & File Review | 1080 × 1920 portrait | past/sources/03_Data_Analysis_File_Review_1080x1920.png, data_analysis/layers/portrait on Codex branch | 3 | Inventoried only; blocked; two screen regions share one housing |
| Past Resources Review | 1080 × 1920 portrait | past/sources/04_Resources_Review_1080x1920.png, resources_review/layers/portrait on Codex branch | 5 | Inventoried only; blocked; two independent high-res closeups missing |

All seven Codex packs have provisional clean-plate reconstruction requiring designer cleanup. Matching idle source pixels is not evidence of visually acceptable hidden plates. Runtime uses original visible Present artwork as the fallback behind masks/glows; no object-removal animation or cleaned wall geometry is claimed. Cropping/stretching portrait Past packs into 16:9 was rejected because it would remove essential stations. At 1366×768 contain gives about 432px-wide Past imagery, 915×412 about 232px and 800×360 about 203px; not production-legible. Four genuine approved landscape compositions are outstanding.

## Present physical object to evidence/action mapping

| Room | Codex object ID | Authored target / current action |
| --- | --- | --- |
| Investigation | evidence_board | Existing NAD-06 — preserved |
| Investigation | mission_files, station_door, center_terminal, right_console | Existing folder/navigation/briefing/Rescue actions — preserved |
| Archive | archive_main_terminal | NAD-03 |
| Archive | archive_processing_desk | NAD-04 |
| Archive | archive_filing_drawers | NAD-08, optional |
| Archive | archive_shelving | Supporting prop with Mission Folders link; no independent evidence |
| Signal | main_signal_display | NAD-01 |
| Signal | receiver_rack | NAD-02 |
| Signal | telemetry_console_left, telemetry_console_right | Supporting inspection only; no invented evidence |
| Recordings | main_video_display | NAD-05, authored anomaly-email/chronology puzzle, NOT a newly delivered CCTV clip |
| Recordings | recording_equipment_rack | NAD-07, optional |
| Recordings | audio_analysis_terminal, video_playback_console, headphones_dock | Supporting inspection only; no invented independent audio/video |

The renderer uses the manifest positions and source masks. Native grayscale mask luminance decides overlap/clicks; image crops are scaled to the actual displayed scene. Each object also has a keyboard-accessible direct anchor button to support focus, Enter/Space, touch and existing browser test selectors. Evidence DOM order remains evidence-first so Signal's second direct evidence hotspot resolves to NAD-02 as the existing QA expects. No puzzle solver, save migration, case engine, audio source, or global routing contract was changed.

## Changed files and commits

**Commit 5843ba14e6438aabf14982b50b51dd5334179818**
- Added public/assets/rooms/archive/**, public/assets/rooms/signal/**, public/assets/rooms/recordings/** (51 source-traced files).
- Modified src/gameplay/StationRoom.tsx and src/gameplay/stationRoom.css.

**Commit 5aa87974335ae55c2541d6b05f58ac7e7058bb6e**
- Modified src/gameplay/StationRoom.tsx and src/gameplay/stationRoom.css to preserve QA-targetable DOM buttons with pixel-mask scene interaction.

**This handoff** is saved only in docs/production/handoffs/CASES_ASSETS.md on the canonical branch. Check Git history for its own commit SHA.

No modifications to source evidenceRecords.ts (40/40 already aligned), src/InvestigationLayeredScene.tsx, Investigation artwork, Home, main.tsx, puzzle engine, save system, src/audio/**, src/media/** or historical main. No original asset was overwritten.

## Verification: executed vs pending

**Executed source checks**
1. Codex source branch SHA matched 48213bd67be242cdb961cd4682b331543941aba4; Present original source PNG blob SHAs equal the canonical branch.
2. All 45 object asset paths plus three manifests/backgrounds verified present in Codex Git tree.
3. All 40 Bible evidence IDs/titles matched active authored data; IDs unique, 6 required+2 optional per case, all fictional.
4. Earlier post-A GitHub Actions run 43674281572 on 66730eadbc63c13626381aca37cd16a0d3a3208f: pre-compile Node suites reported 0 failures, but TypeScript stopped on an **out-of-scope Chat B** error src/media/CinematicOverlay.tsx:116 TS2345 (number vs numeric literal union). Playwright capture skipped. Issue #5 notifies owner.
5. Later run 43674525154 on 6eea7fc949f733f0b9995d09e437af5497c94a7b (contains both A commits) **completed npm run build and started Playwright** as inspected at report authoring time. Final browser result, screenshot count and layout defect report still require checking at the actual final run status; do not mark these PASS without verification.

**Not executed / not verified**
- Physical Android Brave landscape/fullscreen/touch or real device performance.
- Independently inspected after-A screenshots at 1366×768, 915×412 and 800×360 and real pixel-aligned pointer edge/mask overlap on those layouts.
- Each supporting prop's touch hit box, keyboard tab/Enter/Space through all 13 targets, pixel-perfect art approval.
- Past production landscape gameplay, other four cases' full puzzles/rescue, cinematic source clips.

**Verification commands on a checked-out canonical branch**
- npm install
- npm run test:studio
- npm run typecheck
- npm run build
- npm run preview -- --host 127.0.0.1
- VISUAL_QA_URL=http://127.0.0.1:4173 node tools/visual-qa.mjs

Then follow Home → Investigation → Archive/Signal/Recordings. Test each authored object title, Nadir prerequisites, explicit COLLECT EVIDENCE, Quick Tray and Mission Folders return, incorrect filing saved without progress, reversible move, 6/6 unlock, Rescue rerun and same-document navigation. Inspect 1366×768 and phone landscapes 915×412 / 800×360 screenshots; verify real phone touch and keyboard interactions separately. Do not infer from Vite build success that real device or visual design is approved.

## Blockers / cross-owner coordination

- **P0** Four landscape Past sources missing; designer must deliver and approve. All clean plates need cleanup; see issue #3: https://github.com/mahmoud-kun/the-astral-archives/issues/3
- **P0** Kestrel/Lumen/Oriole/Asterion lack normal no-debug complete case rescue journeys. Main owns routing; C owns puzzle/science engine and audits; see issue #2: https://github.com/mahmoud-kun/the-astral-archives/issues/2
- **P0/P1** Shared build on prior run failed in Chat B media file (not A-owned); newer run may supersede it. See issue #5: https://github.com/mahmoud-kun/the-astral-archives/issues/5
- **Science review requested from Chat C** (posted to issue #2): validate fictional Nadir conversion 12 lbf·s × 4.448221615 = 53.37865938 N·s; KES trade constraints; LUM 100.8 vs 100.0 mm; ORI 80ms transient at simulated 40 m; AST 430/520/480W comparisons and provenance. A owns any accepted evidence source data edit later, not C.
- **Main/Chat B** must integrate cinematic files and root transition route separately; there is no new real case surveillance video in A's implementation.
- **Main** must review final CI screenshot report, artist feedback, normal-room route/click QA and physical Android before accepting this stream.

**Submission verdict: PARTIAL / awaiting Main Chat ACCEPT, CHANGES REQUIRED or HOLD.** Neither a green unit test nor the asset inventory establishes full five-case gameplay or designer-approved visuals.
