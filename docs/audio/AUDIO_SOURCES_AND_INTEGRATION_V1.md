# The Astral Archives — Audio Library, Provenance & Production V1
**Baseline:** `experiment/room-case-library-layout-fix-2026-11-14`
**Date:** 2026-11-15
**Scope:** SFX and discreet station ambience only; the approved visual puzzle design is untouched.

## Ownership / licensing

### Designer's existing audio — 11 original WAV files
Source: the user's Google Drive `NASA / الضيظاينر / The_Astral_Archives_COMPLETE_Asset_Library_V1 / 06_AUDIO / sfx`, manually inspected as actual raw bytes. These files remain byte-for-byte intact under `public/assets/audio/sfx/`; no modified source is written back to Drive.

Names: `ui_hover.wav`, `ui_click.wav`, `panel_open.wav`, `panel_close.wav`, `folder_move.wav`, `folder_file.wav`, `evidence_collected.wav`, `error_soft.wav`, `signal_alert.wav`, `portal_transition.wav`, `rescue_unlocked.wav`.

Technical inspection (local WAV decoding): all are mono 16-bit/44.1kHz, ~0.10–0.90s and peak near -3.7 dBFS without sample clipping. No source files have been rewritten. The sound engine applies quiet per-cue gains to avoid overwhelming the game. Actual subjective final mix still requires headphones/device listening. These designer files are not asserted to be CC0; their rights originate from the user's project library.

### Supplemental external sounds — Kenney Sci-fi Sounds CC0
Publisher/license: `https://kenney.nl/assets/sci-fi-sounds` — Creative Commons CC0 (70 original sound files, no mandatory credit). Kenney's support page confirms commercial use. Upstream OGG files were repackaged as M4A by open community mirror `novincode/atomcut-library`; the exact binary assets were obtained from its repository `packs/kenney-sci-fi-sounds/audio/` using the GitHub connector and copied without byte modification into `public/assets/audio/kenney/`.

Mirrored assets incorporated (exact names):

| File | Gameplay proposal |
|---|---|
| `computer-noise-000.m4a` | Successful technical validation / terminal response |
| `computer-noise-002.m4a` | Signal or archive equipment scan |
| `door-open-000.m4a` | Moving to a station room |
| `door-close-000.m4a` | Leaving station room |
| `space-engine-low-000.m4a` | Reserved for rescue/engineering machine scenes |
| `force-field-000.m4a` | Reserved for time-travel power interface |
| `impact-metal-000.m4a` | Reserved for material/engineering interaction |
| `thruster-fire-000.m4a` | Reserved for engineering thruster simulations |

License source: `https://kenney.nl/assets/sci-fi-sounds`. Mirror source: `https://github.com/novincode/atomcut-library/tree/main/packs/kenney-sci-fi-sounds`. The CC0 designation applies to Kenney's asset designs; don't imply all user-supplied audio is CC0. Credit Kenney voluntarily in project credits before final publishing.

### Other libraries researched, not imported
- **Mixkit SFX:** `https://mixkit.co/license/modal/sfxFree/`. Video game use permitted; no mandatory credit, but redistributing original audio alone is restricted. Avoiding ambiguity for an open GitHub source repository, no Mixkit sounds were copied.
- **OpenGameArt:** `https://opengameart.org/content/sci-fi-sounds`. This is Kenney's CC0 pack redistributed by its own publisher. No duplicate copies imported.

## Playback / design contract
Engine: `src/audio/gameAudio.ts`. Registry: `SOUND_PATHS`.
- Default: SFX on, ambience on, master level 40%; persistent `astral-audio-settings-v1`. Settings can mute **Sound Effects** and **Station Ambience** independently or set 0–100 volume.
- All SFX are **on-demand** via new `Audio(url)` with `preload='none'`; initial Home load never downloads the whole SFX pack. UI mouse-only hover is rate-limited and kept very quiet; touch does not produce hover beeps.
- Browser gesture rules honored: Web Audio station ambience starts only after a real click, never through autoplay.
- Quiet ambient station hum uses original synthesis (oscillators and filtered low-level seeded noise) with unique variants for home, investigation, archive, signal, recordings and rescue. This is **interior mechanical atmosphere**, not an implication of sound travelling through vacuum. No copyrighted music is synthesized/borrowed.
- Ambient transitions fade smoothly and are suppressed when the tab is hidden or muted.
- Failure/mistaken case filing: the same `folder_file` confirmation sound as correct filing, so incorrect filing remains silent as to correctness (no answer leak).
- Wrong analytical hypothesis: restrained `error_soft`; terminal verification: Kenney computer-noise; manual evidence collection: designer `evidence_collected`; case unlock: designer `rescue_unlocked`.
- Portal cue is staged but not a final cinematic portal sound; the past timeline transition is not implemented yet. No new library sound is falsely claimed to fill that gap.

## Verification and unresolved work
- `src/audio/gameAudio.test.mjs`: check file signature, nonempty size and low-bandwidth total of all 19 binaries; settings persistence parser and scene route mapping. Run via `npm run test:audio`, included in `npm run build`.
- Verify in Chromium with an actual first click, settings test-sound, mute, persistence, and direct `audio/...` asset fetch.
- Kenney M4A relies on AAC support of the user's target browser (Android Brave/Chrome). Physical mobile audition and browser device matrix remain outstanding.
- No full cinematic portal, dedicated room speech, character dialogue, or long-form 3D/immersive spatial music in this phase.
- Final perceived musicality, stereo balance, and volume mix must still be listened to on the user's device; spectral metrics are not a substitute for listening.

**Do not remove, overwrite, or re-encode originals without sound-owner approval.**
