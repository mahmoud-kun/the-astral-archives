# The Astral Archives — Chat B Final Handoff: Sound Effects & Cinematics

**Report date:** 2026-11-15  
**Owner:** Chat B — Sound Effects, Cinematics & Media Integration  
**Authority:** [Work Order B](../WORK_ORDER_B_AUDIO_CINEMATICS.md) and [parallel sprint plan](../PARALLEL_RELEASE_PLAN_2026-11-15.md)  
**Approved branch:** `experiment/room-case-library-layout-fix-2026-11-14` (no new branch, no merge to main)  
**Delivery verdict: PARTIAL — audio code and independent cinematic interface implemented; binary films, shared-root triggers and physical audition remain BLOCKED / NOT VERIFIED.** Main Chat is the acceptance authority; this is not a release approval.

## 1. Completed owned work

- Inspected GitHub's **19 original source cues** (11 project designer WAV + 8 Kenney CC0 M4A), their registered paths, sizes, upstream rights documentation, in-game trigger locations, and the existing audio controls. **No designer or Kenney binary was changed.** Total 19 source files: **782,108 bytes** (388,562 designer WAV + 393,546 Kenney M4A).
- Fixed `src/audio/gameAudio.ts`: bounded 8 concurrent one-shots (hover suppressed at 6), added cooldown for repeated folder/door clicks, applied saved master-volume changes immediately to already-playing SFX, stopped SFX when effects disabled / volume zero / tab hidden / unmounted, gesture-unlocked ambience with pointer and keyboard activation, and exposed idempotent `claimCinematicAudioFocus()` to duck station ambience and stop one-shots during a cinematic.
- Built `src/media/cinematicManifest.ts` for **exactly four delivered clips**, including actual Drive IDs, measured source sizes, durations, versioned local path targets and per-clip video mix gains. Added explicit `requestCinematic(id)` and `CINEMATIC_FINISHED_EVENT` contract, without changing gameplay state.
- Built `src/media/CinematicOverlay.tsx` + CSS: responsive 16:9 contain (not stretched), no forced audio on autoplay, Play/Pause/Skip/Replay/Return, reduced-motion no-autoplay, keyboard Escape, metadata progress, a safe unavailable-video state, user-gesture fullscreen (may be refused), tab-background pause, independent audio focus and master volume. The overlay **does not file evidence, change saves, unlock rescue, or navigate**.
- Added a cinematic-source preview section to existing `/?audio-lab=1` with distinct `.al-cinema-cue` rows; preserved precisely 19 `.al-cue` source-audio rows.
- Added `src/audio/audioRuntime.test.mjs` (mocked live volume/mute/background/audio focus), `src/media/cinematicManifest.test.mjs` (four real keys, paths, gain bounds), and extended `src/audio/gameAudio.test.mjs` to run them.
- Audited the **actual four** MP4 files from the approved NASA Drive `videos` folder using ffprobe/ffmpeg and visual frame sampling. Preserved exact source bytes, made an offline zip of versioned names and SHA-256 hashes for Main. No originals were altered. The **MP4 bytes were not successfully pushed to GitHub**; the connector returned an HTTP/2 upload body error on a 4.38 MB blob. See the issue below.
- Published source-ledger documentation at `docs/audio/VIDEO_ASSET_LEDGER_2026-11-15.md`.

### GitHub owned commits (chronological)

| Commit | Owned change |
| --- | --- |
| [13e19b4](https://github.com/mahmoud-kun/the-astral-archives/commit/13e19b430b0f7848f7a6c0cab24c685e99303020) | Playback concurrency, live settings, focus and gesture handling |
| [85b6c64](https://github.com/mahmoud-kun/the-astral-archives/commit/85b6c645c1447be23b2162e89d90d791a9df75fa) | Four-source cinematic manifest and event API |
| [66730ea](https://github.com/mahmoud-kun/the-astral-archives/commit/66730eadbc63c13626381aca37cd16a0d3a3208f) | Isolated video overlay, styles, Lab previews and tests |
| [6cb2a8a](https://github.com/mahmoud-kun/the-astral-archives/commit/6cb2a8a898b022dfb54c8dfe93377c9e991c8e53) | Fix TypeScript media duration inference |
| [6eea7fc](https://github.com/mahmoud-kun/the-astral-archives/commit/6eea7fc949f733f0b9995d09e437af5497c94a7b) | Runtime unit tests for mute, persistence, focus and tab state |
| [7c33ff8](https://github.com/mahmoud-kun/the-astral-archives/commit/7c33ff814abdec49be616232a7a02d56144260db) | Verified MP4 provenance, AV-format and SHA ledger |
| [98df1bc](https://github.com/mahmoud-kun/the-astral-archives/commit/98df1bc373790de05f1c8cb00b0f415e76069b34) | Separate video rows from the 19 SFX rows in Visual QA |

**Owned changed files:** `src/audio/gameAudio.ts`, `src/audio/AudioReviewLab.tsx`, `src/audio/audioReviewLab.css`, `src/audio/gameAudio.test.mjs`, `src/audio/audioRuntime.test.mjs`, `src/media/cinematicManifest.ts`, `src/media/cinematicManifest.test.mjs`, `src/media/CinematicOverlay.tsx`, `src/media/cinematicOverlay.css`, `docs/audio/VIDEO_ASSET_LEDGER_2026-11-15.md`, and this handoff. No other owner's source file was edited by B.

## 2. Detailed 19-cue and event ledger

### Original 11 designer WAV (project library; **NOT** asserted CC0)

| Game cue | Registered file under `public/assets/audio/sfx/` | Bytes | Present game event / limitation |
| --- | --- | ---: | --- |
| `hover` | ui_hover.wav | 8,864 | Delegated mouse/pen hover over active controls; rate-limited |
| `click` | ui_click.wav | 12,392 | Delegated click on active UI controls |
| `panelOpen` | panel_open.wav | 26,504 | Home panel, briefing/library and evidence tray open |
| `panelClose` | panel_close.wav | 21,212 | Close inspector and Home panel |
| `folderMove` | folder_move.wav | 30,032 | Unfile / move evidence in folder UI |
| `file` | folder_file.wav | 29,150 | Both correct and incorrect folder filing play the **same cue** (no answer leak) |
| `evidence` | evidence_collected.wav | 23,856 | Manual evidence COLLECT after analysis |
| `error` | error_soft.wav | 45,908 | Failed technical analysis/rejected rescue verification |
| `signal` | signal_alert.wav | 35,324 | Staged; signal event needs dedicated event dispatch integration, not falsely auto-wired |
| `portal` | portal_transition.wav | 79,424 | Staged; portal cutscene trigger is pending Main |
| `rescue` | rescue_unlocked.wav | 75,896 | Six correctly filed required records unlock; rescue rerun success |

### Supplemental 8 Kenney CC0 M4A

Publisher: [Kenney Sci-fi Sounds](https://kenney.nl/assets/sci-fi-sounds), asset license **CC0**. Source mirror and full license explanation in `docs/audio/AUDIO_SOURCES_AND_INTEGRATION_V1.md`. M4A AAC codec compatibility should be auditioned on target devices.

| Game cue | Registered file under `public/assets/audio/kenney/` | Bytes | Present game event / limitation |
| --- | --- | ---: | --- |
| `scanner` | computer-noise-002.m4a | 86,314 | Station hotspot/tool inspection |
| `terminal` | computer-noise-000.m4a | 86,731 | Correct analysis / verified diagnosis |
| `doorOpen` | door-open-000.m4a | 9,477 | Home enter and room navigation |
| `doorClose` | door-close-000.m4a | 9,463 | Station return / exit |
| `engine` | space-engine-low-000.m4a | 81,356 | Reserved for engineering scene; not connected to an authorized gameplay event |
| `energy` | force-field-000.m4a | 15,996 | Reserved for time-travel device; not connected |
| `metal` | impact-metal-000.m4a | 11,128 | Reserved for material inspection; not connected |
| `thruster` | thruster-fire-000.m4a | 93,081 | Reserved for engineering simulation; not connected |

**Ambient sound:** Synthesized, not sampled, quiet interior mechanical equipment across home, investigation, archive, signal, recordings and rescue scenes. `SFX` and `Ambience` toggles are independent. Settings use stable `astral-audio-settings-v1` localStorage key (defaults SFX on, Ambience on, 40/100). Persistence parser tolerates corrupt/private storage. Main must audibly evaluate final mix; no physical listening claimed.

## 3. Actual delivered designer film inventory

[Source folder](https://drive.google.com/drive/folders/1LIRtkA0Re_yJ-VpIU0PAIc2Whlm80-sX), exact hashes, technical measurement details and browser notes: [Video Asset Ledger](https://github.com/mahmoud-kun/the-astral-archives/blob/experiment/room-case-library-layout-fix-2026-11-14/docs/audio/VIDEO_ASSET_LEDGER_2026-11-15.md).

| Clip key / intended phase | Actual filename | Measured dimensions and codecs | Duration | Bytes | Runtime gain at full master |
| --- | --- | --- | ---: | ---: | ---: |
| `opening` / Game intro | game opening.mp4 | 1920×1080 H.264 High/AAC-LC stereo 48 kHz | 10.005 s | 12,567,554 | 0.90 |
| `case1Intro` / Case 1 briefing | case 1 intro .mp4 | 1920×1080 H.264 High/AAC-LC stereo 48 kHz | 7.125 s | 6,436,608 | 0.70 |
| `portalPast` / Travel to past | time travel to the past .mp4 | 1920×1080 H.264 High/AAC-LC stereo 48 kHz | 8.000 s | 10,181,404 | 0.30 |
| `case1Outcome` / Outcome | case 1 outcome.mp4 | 1920×1080 H.264 High/AAC-LC stereo 48 kHz | 5.970 s | 4,375,281 | 0.80 |

**Total 33,560,847 bytes** of genuine designer-delivered video. Runtime volume values are attenuation coefficients * master volume, not loudness-normalized file edits. Portal is loudest source (ffmpeg mean -15.0 dBFS / peak -0.7 dBFS), so gain is lowered. Frame sampling and ffprobe passed; subjective audio/video artistic review is outstanding. Opening footage has approximately 2.97 s dark/black frames at the start; confirm artistic intent. Three clips have `moov` atom after `mdat`, which may slow startup on weak mobile networks; original-byte preservation takes precedence until a versioned remux is approved.

**No video subtitles/captions file received, no independent third-party music/footage rights clearance, no NASA endorsement asserted.** This Drive folder contains no verified separate return-to-present clip or four additional case cinematic sets. The case number in a filename does not establish its case ID; Main/content must approve.

### Video staging truth

The `CINEMATICS` manifest intentionally references:
- `public/assets/video/designer-game-opening-v1.mp4`
- `public/assets/video/designer-case-1-intro-v1.mp4`
- `public/assets/video/designer-time-travel-past-v1.mp4`
- `public/assets/video/designer-case-1-outcome-v1.mp4`

**These binary files are NOT in GitHub as of this handoff.** Upload through connected GitHub create_blob failed with `h2 protocol error: error reading a body from connection`. Exact-byte copies, hashes and a ready-to-upload ZIP were prepared locally for Main/user; a ZIP in this chat does not itself integrate with the deployed web app. Until binaries are staged, the player deliberately shows `VIDEO UNAVAILABLE` and offers Continue Without Video without state changes. Only a verified post-upload browser smoke can move video availability to DONE.

## 4. Shared-owner Integration Request (do not implement in Chat B)

**Main tracking:** [GitHub Issue #4 — Chat B Integration Request](https://github.com/mahmoud-kun/the-astral-archives/issues/4) (includes exact shared-file contract; published early).

1. **Mount only in Main-owned `src/main.tsx`**: import default `CinematicOverlay` from `./media/CinematicOverlay`; render one `<CinematicOverlay />` inside the existing persistent app root. Do not replace document on route change; fullscreen document persists.
2. **Trigger only from authorized events** by importing `requestCinematic` from `src/media/cinematicManifest.ts`. Keys: `opening`, `case1Intro`, `portalPast`, `case1Outcome`. Main chooses Home start timing and case-1 mapping. Portal can be requested only after the existing save/unlock gate, case1Outcome only after a real completed engineering rescue; no clip itself grants progression.
3. **Outcome event:** listen to `CINEMATIC_FINISHED_EVENT` = `astral:cinematic-finished`, detail `{id,outcome}`. Outcomes: `completed`, `skipped`, `returned`, `unavailable`. Main handles routes and case state; `returned` does not advance; `skipped` skips presentation only and must **not** bypass evidence, puzzle, diagnosis or rescue requirements.
4. **Upload exact originals as separately versioned MP4s**, with SHA-256 comparison to `docs/audio/VIDEO_ASSET_LEDGER_2026-11-15.md`. Preserve Drive originals. Then verify HTTP 200/206, MIME, byte ranges, codec browser playback, audio mute, 16:9 sizing, skip, replay, resume and error handling on actual served assets.
5. **Before release** obtain user/designer approval of portal Henda style, intro black frames, rights/caption treatment, missing case clips/return transitions and any proposed new source. Don't manufacture new clips.

## 5. Testing performed and outcomes

| Evidence / command | Exact environment and result |
| --- | --- |
| Source files/signatures | GitHub directory entries: 11 WAV + 8 M4A, unique paths, sizes; automated test checks RIFF/WAVE and ftyp signatures |
| Source MP4s | Drive originals fetched, ffprobe/ffmpeg codecs/dimensions/duration/audio-volume inspected, representative frames sampled, SHA-256 computed; 4/4 decodable |
| `node --experimental-strip-types --test src/media/cinematicManifest.test.mjs` | Local source-equivalent pure test: **3/3 PASS** |
| [GitHub Actions #53](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674281572) | Sound source/manifest **7/7 PASS**; Build **FAILED** at TS2345 (`useState` duration literal type); fixed by commit `6cb2a8a` |
| [GitHub Actions #54](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674525154) | `npm run build` **PASS**, including `npm run test:studio`, `npm run test:audio`, TypeScript and Vite build. Visual QA **FAILED** at Sound Lab count 23 vs 19, since four video preview rows shared SFX class; fixed in commit `98df1bc`. Other screenshot scenarios displayed broken=0, clipped=0, overflow=0, console=0. |
| [GitHub Actions #55](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674791473) | **PASS** at code commit `98df1bc373790de05f1c8cb00b0f415e76069b34`: `npm run build` PASS (studio suites, TypeScript, Vite); `npm run test:audio` **8/8 PASS**; Visual QA **44 screenshots, 0 broken images, 0 clipped controls, 0 scenario errors, 0 console errors**. The CI did not play the four uncommitted videos. |
| Physical speaker/headphone audition, iOS Safari and Android Brave | **NOT VERIFIED** — no physical device available to Chat B |
| Actual MP4 transport/playback, Skip/Replay/Return on deployed URLs, offline fallback | **NOT VERIFIED end-to-end** — video binaries absent from GitHub and root cinematic event integration belongs to Main. Programmatic manifest/settings tests do not substitute for live browser playback. |
| 1366×768 and 915×412 UI capture | Prior Visual QA #54 exercised 43 scenarios with 0 broken images/clipped/overflow/console; 1 selector-count assertion failed as noted. #55 subsequently established successful existing-route Visual QA at its exact commit, but did not exercise the unmounted cinematic overlay. Cinematic overlay itself is not currently exercised by that route-level QA. |

**Run #55 is verified successful; the media-runtime proof gap remains OPEN.**

### Manual/QA procedure for Main once files and root wiring land

1. Fresh browser session and saved session; open Home. Check first user gesture activation and that no music/video plays with audio before explicit permission. Open Settings, set master 0, disable SFX, disable ambience separately; visit room and verify no audio. Reload to verify persisted settings and 40% default for fresh session.
2. Open `/?audio-lab=1`. Count 19 sound rows; play WAV and M4A one by one, check no overlap clipping and low volume; test rapid hover and repeated scanner. Change volume *while a longer SFX plays*; verify live gain.
3. After approved upload, preview each of the four real files in Sound Lab; test muted startup, explicit Enable Video Sound, Pause/Play, Replay after ended, Skip, Return, browser back/forward, keyboard Escape, 16:9 contain at 1366×768 and 915×412, reduced-motion, fullscreen or graceful refusal, tab hide/show, video load-error and connectivity loss.
4. In actual gameplay, start a verified case and confirm cinematic outcome event is routed by Main. File evidence to an intentionally wrong folder and ensure no audio reveals correctness; refile correctly to advance. Skip the portal clip before evidence gate and prove it does not unlock rescue. Complete real engineering rescue before outcome clip; repeat from saved state without losing evidence.
5. Check physical Android Brave and iOS Safari with headphones and speaker, including AAC playback, mobile unlock latency, saved Mute and full controls; obtain user artistic approval and captions/rights decision.

## 6. Explicit remaining issues / acceptance blockers

**P0 — GitHub media not staged:** Four MP4 originals (33.6 MB total) remain only in Drive/verified ZIP; GitHub blob upload failed. Main must stage exact-byte originals and verify integrity.

**P0 — Root events not integrated:** `CinematicOverlay` and four keys are callable independently, but no gameplay trigger has been added to Main-owned `src/main.tsx`, Home or rescue/room owner paths. Main must implement Issue #4 or delegate exact approved patch.

**P0 / product — Actual event/case correspondence:** Case 1 identity, rescue completion ownership and cinematic acceptance need verified mapping before showing outcome. Cinematic Skip never substitutes for rescue. Four other cases' end-to-end playability is owned by A/C/Main and cannot be declared complete from audio tests.

**P1 — User/Designer approvals and rights:** Portal heroine look, intro dark lead-in, soundtrack/footage rights, accessibility captions, missing return/case clips, and optional faststart remux approval.

**P1 — Physical media QA:** No actual device listening, video URL playback or disabled-network Skip/Replay tested; browser media support and real timing remain unknown.

**Final recommendation:** Main may review audio/playback **code** and manifest as a candidate; do **not** mark cinematic feature/release ACCEPTED until exact binaries, shared integration, browser + physical-device QA, and artistic/rights approvals are verified.


## 7. User-approved continuation: four available clips only (2026-11-15)

The user explicitly approved a **staged integration plan now**, with video-binary upload handled later and missing clips added only when designer delivery actually occurs. The new detailed, exact per-view Main patch/handoff is:

**[Cinematic Placement & Main Patch V1](../../audio/CINEMATIC_PLACEMENT_AND_MAIN_PATCH_V1.md)**

- `src/media/cinematicFlow.ts` — gated one-shot request + outcome listener bridge; no save changes/navigation, no duplicate pending requests, Return separate from video completion. `src/media/cinematicFlow.test.mjs` covers blocked gates, concurrent requests, wrong-ID events, Skip, Return, unavailable fallback and listener cancellation. These tests were added to the existing `test:audio` entrypoint.
- Home first Start -> `opening` -> Investigation. Saved Continue should skip cinematic by default.
- Investigation Rescue Console and Case Folder alternate NAD entry -> `portalPast` -> `/?rescue=NAD`, with **fresh 6/6 evidence authorization check both before launch and before route advance**.
- `case1Intro` is staged for KES (Case 1) dossier on explicit view-only request, **but hold canonical binding** pending visual/source alignment signoff; the 7-second video shows hardware in assembly, while KES is a pre-Phase-A/Phase-A observatory concept. Video content is not evidence.
- `case1Outcome` **must not** play on NAD, after just 6/6 or simply on clicking Rescue. Intended only for KES's verified alternate outcome, after actual integrated KES rescue UI and `otherRescueCompleted(...,'KES')` pass, and confirmation that its industrial hangar visuals fit source narrative.
- Four original clip binaries are **still not in GitHub**. This document adds no invented footage and is not Main acceptance. New designer clips will be audited/versioned when delivered.

## 8. Authoritative case order — user-confirmed after direct Evidence file review (2026-11-15)

Source: [Cases Evidence Production Bible v2.docx](https://docs.google.com/document/d/1lGpnlCkWYZowYNge9Fcd14wGeZH3FdWr/edit) from the approved NASA Drive. The explicit order is **01 KES / Kestrel → 02 NAD / Nadir → 03 LUM / Lumen → 04 ORI / Oriole → 05 AST / Asterion**. This matches the source's five section headings and `CASE_CODES` in `src/archive/evidenceRecords.ts`, `INVESTIGATION_CASES`, and Home previews.

**Decided:** `case1Intro` / `case1Outcome` are definitively **Case 01 = KES**, not Nadir. Updated `src/media/cinematicManifest.ts` titles with explicit `caseId:'KES'`; `src/media/cinematicManifest.test.mjs` asserts the five-code order and both clips' association. The separate concern about whether supplied industrial spacecraft footage accurately depicts the pre-Phase-A Kestrel concept **remains subject to artistic/story approval**, but must not trigger re-numbering or silent video remapping.

During same review, Main/Chat C had advanced the shared game: `src/gameplay/CaseRescue.tsx` and routing `/?rescue=KES|LUM|ORI|AST` now exist. Our old handoff sentence saying KES Rescue was not exposed in UI is superseded. **Only Main** wires the KES-success cinematic based on `otherRescueCompleted(...,'KES')`. `ArchiveFolderLab` restores the active case and otherwise defaults to NAD, but **visible dossier order is correct**. Refer to updated [Cinematic Placement & Main Patch V1](../../audio/CINEMATIC_PLACEMENT_AND_MAIN_PATCH_V1.md).

The four MP4s remain subject to separate upload and eventual physical playback QA. New case video deliveries will be reviewed and registered independently, following this fixed case order.


## 9. New delivered media: 8 MP4 clips + one Kestrel voice (2026-11-15)

The user uploaded new files into NASA Drive while existing first-four video binary delivery remains pending. Full technical details, source hashes, all 9 new source identities and **per-Evidence-ID gameplay patch** are in:

**[New Media Delivery Audit — 2026-11-15](../../audio/NEW_MEDIA_DELIVERY_AUDIT_2026-11-15.md)**.

- **8 new 1080p H.264/AAC MP4 videos decoded end-to-end 8/8**, from Cases 01–03: `case1Evidence`, `case2Intro`, `case2EmailEvidence`, `case2UnitsMismatchEvidence`, `case2Outcome`, `case3Intro`, `case3ApprovalEvidence`, `case3Outcome`. `CINEMATICS` now registers **12 delivered clips** total. 4 are evidence-context visuals mapped to existing registered records KES-02, NAD-05, NAD-02 and LUM-05; **no new evidence or auto-success** was created. Their manifest entries remain staged, not physically deployed.
- **New KES-05 spoken audio** (314,523-byte ElevenLabs Morgan MP3, 18.599 sec, 44.1 kHz mono, -15.2 mean / -0.3 dBFS peak) corresponds closely to the **existing required KES-05 Analyst Audio Transcript**. `src/audio/evidenceVoiceManifest.ts` and `src/audio/EvidenceVoicePlayer.tsx` stage a lower-volume, explicitly controlled player; Sound Lab previews it in its own section without inflating the original **19 SFX**. Source was actually transcribed via Descript. Human verification of two dialogue speakers, an ASR-vs-spoken possible "crew/cruise" terminology issue, captions and distribution license is pending.
- The 8 source MP4 + 1 MP3 binary copies and SHA manifest have been packed into a **verified local delta ZIP** for the user and Main. This ZIP is not in GitHub. Source files and previous four MP4s remain immutable. **No production playback of these nine new files is possible until the source-exact binaries are installed on their manifest paths.**
- New audio/video tests are included in `npm run test:audio`. Main must root-wire individual footage using [New Media Delivery Audit](../../audio/NEW_MEDIA_DELIVERY_AUDIT_2026-11-15.md) and run independent build, browser and mobile QA. Main owns all shared component edits; no cross-owner file changed.

**Acceptance verdict remains PARTIAL:** audio/video source inventory, source-derived manifest, preview and QA plan prepared; physical binaries, game trigger integration, caption/rights review and real-device playback not yet complete.

### Verified post-delivery code CI

[GitHub Actions run #43680990923](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43680990923) **SUCCESS** at `952146971fc875a05a235ce139856398f1f39dae`: `npm run build` passes unit suites + TypeScript + Vite; `npm run test:audio` **17/17 PASS**; Visual QA **52 screenshots, 0 broken, 0 clipped, 0 scenario errors, 0 console errors**. This includes code and Sound Lab previews for all 12 media keys and KES-05 voice, **not media playback** (MP4/MP3 binaries are absent from GitHub). The 8 new designer MP4 source originals separately passed full ffmpeg decoding **8/8**; Source-exact ZIP integrity verified locally. Pending Main's root/event mounting, online media file availability, human art/speech review, real-browser playback and physical-device audition.
