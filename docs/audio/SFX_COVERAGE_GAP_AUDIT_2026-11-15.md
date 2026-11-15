# The Astral Archives — Sound Effects Coverage & Gap Audit

**Date:** 2026-11-15. **Scope:** Existing 19 source SFX only; no voice-over or cinematic source production. **Audit only:** no production code changes or audio remixes. Approved working branch: `experiment/room-case-library-layout-fix-2026-11-14`.

## Verdict

**The 19 original + CC0 effect cues are sufficient for the current core playable investigation prototype. Additional SFX files are not a blocker.** However, not all available cues are connected to unique game events; 2–4 distinct narrative cues/variants would improve final cinematic polish *after* existing event wiring and on-device listening. Avoid creating a large redundant pack or sound on every control interaction.

**Source inventory inspected:** `public/assets/audio/sfx/` has 11 original project WAV; `public/assets/audio/kenney/` has 8 supplementary licensed CC0 M4A. The project Drive audio/SFX folder contains the same 11 user-owned filenames and byte lengths. All 19 physical repo files were checked by the project's existing `src/audio/gameAudio.test.mjs` (GitHub Actions `#43685165238` PASS); source sizes total 782,108 bytes. `src/audio/gameAudio.ts` synthesizes 6 quiet, room-specific *interior machinery* ambience profiles with user mute/volume controls; that is not 6 standalone sound files. Subjective quality and real phone audio playback **not** verified.

## Cue-by-cue implementation audit

| Registered cue | Current runtime purpose and verified anchor | Status |
|---|---|---|
| `hover`, `click` | `src/audio/gameAudio.ts`: global delegated hover/click handlers for enabled buttons/links | WIRED |
| `panelOpen`, `panelClose` | Home panels, Investigation Room modal, Evidence Tray; explicit `data-sfx` and calls | WIRED |
| `folderMove`, `file` | `src/archive/ArchiveFolderLab.tsx` `file()`: same neutral `file` sound whether filing is correct or incorrect, preventing accidental gameplay hint leakage | WIRED |
| `evidence` | `src/gameplay/CasePuzzle.tsx` and `NadirPuzzle.tsx`: manual collection after solved analysis | WIRED |
| `error` | Case/Nadir puzzle wrong attempt and rescue test/review rejection | WIRED |
| `terminal` | Case/Nadir analysis confirmation, rescue test vector PASS and evidence-backed diagnosis | WIRED |
| `scanner` | `src/gameplay/StationRoom.tsx`: object/hotspot inspection | WIRED |
| `doorOpen`, `doorClose` | Home entry and station nav/back buttons via `data-sfx` | WIRED |
| `rescue` | Archive 6/6 required-evidence unlock; Case/Nadir verified rescue successes | WIRED, BUT SAME CUE SERVES TWO SEMANTICALLY DIFFERENT REWARDS |
| `signal` | `signal_alert.wav` registered, Signal Room detection trigger not evidenced in gameplay | STAGED / WIRING GAP |
| `portal` | `portal_transition.wav` registered; actual time travel portal event not yet connected by Main | STAGED / WIRING GAP |
| `engine`, `energy`, `metal`, `thruster` | Four Kenney sci-fi effects available for machine simulation, field energy, engineering material interaction and thruster replay; no approved active event mapping yet | RESERVED / WIRING GAP |

**Counts:** 13 registered cues have confirmed use in core runtime; 6 are staged/reserved. This is an event/code coverage classification, not proof of human auditory mix quality.

### Existing ambience bug / fix request to Main or owner

`sceneFromSearch()` in `src/audio/gameAudio.ts` currently recognizes `?rescue=NAD` only. The `?rescue=KES/LUM/ORI/AST` routes may inherit the `home` ambience profile instead of `rescue`. Use the authoritative route parser/known case IDs for **all** rescue cases. Preserve case-specific permissions, avoid triggering a rescue scene by arbitrary unrecognized strings. No changes made in this audit.

### Remaining priorities — prefer event wiring before adding binary media

**P0 (required integration, no new source files):**
1. Wire `signal` to *genuine* user-triggered detection/telemetry only (not background loops or false progress).
2. Wire `portal` and, optionally, `energy` to explicitly approved past-transition state; never play portal SFX during unrelated room navigation. Film audio focus already suppresses competing SFX; avoid duplicate portal hits over video soundtrack.
3. Use `engine`/`thruster` for actual relevant simulated machinery, not generic menu changes, and `metal` only for applicable tactile engineering scenes.
4. Fix rescue ambience case selection, run actual Android/desktop listening, and test hover/click bursts, mute, low volume, mobile audio-unlock, Media Audio Focus, and zero-latency perception.

**P1 (recommended distinctive variants; one per meaningful purpose, not a new pack):**
- **`rescueComplete`**: a distinct, short, restrained success/reveal cue *after verified rescue*, separate from `rescueUnlocked` when the six required documents are filed. Current `rescue` serves both, risking confusion. Can create via existing CC0 material/processing if approved.
- **`simulationRunning`**: quiet 1–3s computer/engine process bed for an *actual* test/replay sequence; can reuse/layer existing `engine` and `terminal`, or create one original cue. Never block interactions or imply success before test result.
- **`recordingStartStop`**: subtle radio/audio archive cue when starting/stopping a voice evidence file, not a loud sound over spoken testimony; an existing scanner cue variant may suffice.

**P2 (optional based on cinematics decisions):**
- Dedicated `portalReturn` reverse/transient sound if a distinct Return to Present scene is delivered; can use a shortened existing `portal` sound variant.
- Gentle room ambient textures by station; current low-volume synthesis is enough for prototype and shouldn't overpower voiceover.

**Specific caution:** avoid adding simulated air/engine sounds as though audible in outer space. All non-cinematic SFX are experienced via station interfaces/interior simulations; the game must not claim fabricated NASA telemetry or audio as authentic NASA recordings. Optional audio and visual accessibility should remain preserved.

## Work remaining and acceptance

**No essential new downloadable SFX asset is missing for current prototype.** For the polished release, prioritize one distinct rescue completion cue and optionally the two interaction variants above *after* owner agrees. User/designer need not create them immediately; the remaining six already-sourced cues should be wired first.

**Not verified:** actual first-gesture playback on the user's Android/Brave or Chrome device, final subjective loudness mix with the incoming voice-over, immersive spatial quality, and every Main-owned trigger in the final integrated game. Do not treat CI 19/19 source verification as subjective audio-quality approval.


## Post-audit SFX implementation update (2026-11-15)

The above 19-cue inventory/13-used/6-staged numbers refer to **the pre-fix baseline**. After the user's authorization, Chat B implemented the sound system changes on the same working branch: the **19 original WAV/M4A cues remain immutable**, and **one original 60,020-byte PCM WAV `rescue_completed_original_v1.wav` was added**. The engine now registers **20** playable one-shot cues.

- **DONE:** all five recognized Rescue routes select `rescue` ambient scene rather than falling back to Home; verified Rescue success uses original `rescueComplete` chime while Archive 6/6 unlocking keeps the exact legacy `rescue` cue. This uses only the existing, authoritative gameplay sound calls: no save/diagnosis/unlock modifications.
- **DONE (explicit hotspot buttons):** `signal` now replaces default scanner for a real existing case evidence hotspot in Signal Room; plain room entry, wrong folder filing and non-evidence equipment do not receive an alert.
- **DONE:** sound audit and QA add source-exact Git blob SHA check, 20 binary signatures, action/context regression cases, and separate Sound Lab preview.
- **Still staged / Main-owned:** the real-time portal initiation, mechanical/energy/metal/thruster one-shots, and first-party cinematic root/event hooks need exact Main event triggers; no filename-only or all-click inference is allowed.
- **Not objectively approved:** subjective headphone/mobile listening or Voice Over balance.

The authoritative final instructions, WAV provenance and minimal Main integration contract are in [SFX Finalization and Main Patch](SFX_FINALIZATION_AND_MAIN_PATCH_2026-11-15.md). Do not read the earlier recommendation “no new files” as an unfulfilled gap: the requested distinct Rescue completion is now produced and pushed.
