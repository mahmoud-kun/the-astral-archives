# Work Order B — Sound Effects, Cinematics, Media Integration

**Role:** The Astral Archives — Audio & Cinematic Integration Lead  
**Authority:** [5-hour parallel sprint](PARALLEL_RELEASE_PLAN_2026-11-15.md). Read first.  
**Working branch:** `experiment/room-case-library-layout-fix-2026-11-14`; re-fetch HEAD; do not create new branches or merge to main.

## Mission
Finish and independently QA all existing sound cues and supplied designer cinematic videos, connecting them to the current playable experience **without changing** the approved first-person point-and-click camera, the puzzle engine or the case/asset layouts. Deliver polished low-latency, optional audio and skippable cinematic playback.

## Required sources
- `docs/audio/AUDIO_SOURCES_AND_INTEGRATION_V1.md`
- `src/audio/gameAudio.ts`, `src/audio/AudioReviewLab.tsx`, `src/audio/gameAudio.test.mjs`
- `public/assets/audio/sfx` (11 original designer WAV, immutable)
- `public/assets/audio/kenney` (8 Kenney CC0 M4A)
- Designer-delivered video files in NASA Drive/approved folder and any current production video references. List actual files, don't guess.
- `src/gameNavigation.ts`, Home/room/rescue views: **read-only contracts**, not shared-file editing rights.

## Exclusive write scope
- `src/audio/**`, `public/assets/audio/**` (new/versioned, never overwrite originals)
- `public/assets/video/**` (new/versioned approved clips only)
- `src/media/**` (new isolated cinematic components/helpers)
- `docs/audio/**` and `docs/production/handoffs/AUDIO_CINEMATICS.md`

**Cross-owner restriction:** Need to edit `src/main.tsx`, `HomeScreen.tsx`, `StationRoom.tsx`, `NadirRescue.tsx` or puzzle files? Submit to Main an exact minimal integration patch/route/event contract; don't edit them.

## Work plan
1. Verify every original cue's existence, format, licensing, latency and game-event mapping; classify existing vs missing. Keep the 19 approved cue identities and muted/low-bandwidth semantics. Do not claim designer SFX are CC0.
2. Audit on-demand browser gesture unlock, iOS/Android AAC compatibility risk, overlapping playback, rate-limits, audio focus, tab background, 0–100 master volume, independent ambience/SFX toggles, persistence and in-game test sound.
3. Map every relevant trigger: UI hover/click, modal open/close, folder move/file, evidence collect, soft failure, signal detection, portal enter/exit, rescue unlock/verification, scene navigation; **no success leak for incorrect folder filing**.
4. Inspect actual video sources: aspect, quality, length, codec/browser support, subtitles/captions needs, orientation, audio and rights. Support 16:9 responsive contain/fit, muted/reduced-motion policy, Skip/Replay/Return, failed-video fallback, preserving saved evidence and fullscreen where browsers permit.
5. Implement independent playable video/media components in owned files. Coordinate trigger integration with Main via exact props, public API and minimal patches. No invented cinematic if designer's promised clip is not yet received. No forced autoplay audio.
6. Run `npm run test:audio`, `npm run build` and relevant browser route checks; perform actual physical-device listening where available, otherwise mark NOT VERIFIED. Test lost connectivity/audio disabled/accessibility and skip-resume.

## Time constraints
- **T+60:** numbered audio cue/event ledger and videos delivered/missing, dependencies to Main.
- **T+150:** implemented independent media component and audio fixes, integration patch requested to Main.
- **T+195:** final handoff and no new media features.

## Handoff
Write `docs/production/handoffs/AUDIO_CINEMATICS.md` with DONE/PARTIAL/BLOCKED; changed paths, commit SHA(s), exact audio/video sources and rights, measured formats and file sizes, signal/cue trigger mapping, integration patch instructions, tests actually run/results, previews and browser/device audition status, remaining designer files, limitations and independent test procedure.
