# The Astral Archives — Verified Designer Video Ledger (2026-11-15)

**Owner:** Chat B / Sound Effects & Cinematics. **Authority:** docs/production/WORK_ORDER_B_AUDIO_CINEMATICS.md. **Working branch:** experiment/room-case-library-layout-fix-2026-11-14.

## Source and fidelity

Inspected the **actual four** videos in the [NASA Drive videos folder](https://drive.google.com/drive/folders/1LIRtkA0Re_yJ-VpIU0PAIc2Whlm80-sX). These assets are user/designer supplied; their footage/music/dialogue rights **have not been independently cleared**. This ledger does **not** assert that any media has been staged in GitHub, endorsed by NASA, or approved artistically. No unrelated clips should be invented or substituted.

ffprobe and ffmpeg were run on all four fetched originals. All contain **1920 × 1080** H.264 **High** profile video + **AAC-LC**, **48 kHz stereo** audio in MP4, with regular frame rates. Measured RMS mean/peak figures below are from ffmpeg volumedetect on full audio tracks, **not** EBU R128 loudness.

| Clip key | Actual designer filename | Expected versioned path under public | Size bytes | Duration | FPS | Mean / peak dBFS |
| --- | --- | --- | ---: | ---: | ---: | --- |
| opening | game opening.mp4 | assets/video/designer-game-opening-v1.mp4 | 12,567,554 | 10.005 s | 30 | -26.8 / -8.4 |
| case1Intro | case 1 intro .mp4 | assets/video/designer-case-1-intro-v1.mp4 | 6,436,608 | 7.125 s | 24 | -20.0 / -4.0 |
| portalPast | time travel to the past .mp4 | assets/video/designer-time-travel-past-v1.mp4 | 10,181,404 | 8.000 s | 30 | -15.0 / -0.7 |
| case1Outcome | case 1 outcome.mp4 | assets/video/designer-case-1-outcome-v1.mp4 | 4,375,281 | 5.970 s | 24 | -23.2 / -4.9 |

**Total originals:** 33,560,847 bytes. All four opened successfully in ffprobe and frame sampling; visual identity/art direction and subjective listening remain Main/user signoffs. Portal footage presents a stylization that may differ from the approved geometric Henda reference; ask user/Designer to approve before claiming release readiness. No measured clipping above 0 dBFS, but portal's -0.7 dBFS peak needs quiet playback.

### Provenance and source-exact deployment hashes

| Local target filename | Original Google Drive file ID | SHA-256 (verified original and duplicate copy) |
| --- | --- | --- |
| designer-game-opening-v1.mp4 | 1v78asR91IGBbnAWqenY4v2aZfTTN_u0m | d9901146f958577c2bc1aaea065f5fab42c04d5c8f1903a1d67bd038a2604a7d |
| designer-case-1-intro-v1.mp4 | 1UO5sYEbzf2UFFupybPieoa_2I4gjii2z | 104f1d20ec8a414a25dc415528d08cf7befe88b005ce7359a4331541aa5003dc |
| designer-time-travel-past-v1.mp4 | 1tugUeTk3RcMtVrWfEAta6C6iOt35R0Xh | 32533832d425eb2d7f3d3029bf0c0a47ee306c87a518c933fcfd8d419b70adab |
| designer-case-1-outcome-v1.mp4 | 1vjDCZCYOquFkJhRb63ND_Lddied3OyTp | ff1ad0a5ca82b135e4a308fc9b6a1569858850ec73eb5213d33b8369313f7b7f |

All deployment copies in astral_cinematics_upload_v1.zip preserve the original MP4 bytes with versioned filenames. No transcoding/normalization has been performed. The archive itself is **not** committed to GitHub.

### Cinematic audio mix (runtime only)

cinematicVolume() in src/media/cinematicManifest.ts multiplies the saved 0–100 master volume by per-clip attenuation: opening 0.90; case1Intro 0.70; portalPast 0.30 (source is loudest); case1Outcome 0.80.

An explicit ENABLE VIDEO SOUND button is needed; cinematic auto-play (if permitted) is muted, inline and optional. Disabling Sound Effects or setting master volume zero prevents video audio. Existing ambient station sound and active one-shots are quieted using an idempotent audio-focus lease and restored after closing the player. This protects against layering peaks without altering original audio.

### Expected cue points (not yet root-integrated)

| Clip key | Trigger / authority | Finish behavior |
| --- | --- | --- |
| opening | Home Start/Continue; Main chooses whether only first visit | completed / skipped may navigate to Investigation; returned stays on Home |
| case1Intro | Main verifies which case is Case 1 and invokes from case briefing | Original case state unchanged; do not auto-collect or auto-solve |
| portalPast | Only after gate-approved portal/rescue entry, Main controls route | Skip never bypasses required evidence or engineering rescue |
| case1Outcome | Only after **actual** engineering rescue verification of the matching case | May proceed to saved outcome/return view; never claim all five cases completed |

Video-player outcomes are completed, skipped, returned, or unavailable. The layer emits events but never changes save keys, navigation or case eligibility. Individual video names are not evidence of which case ID is officially Case 1.

### Missing and verification blockers

1. **Binary repository upload:** GitHub currently has no public/assets/video/ directory. Connected create_blob failed uploading the smallest 4.38 MB MP4 with an HTTP/2 body transport error; no binary commit was published. Main should install original bytes from Drive or from the verified source-exact ZIP into expected versioned paths, then SHA-256 check all four.
2. **No separate return-to-present film or case 2–5 clips** found in this inspected Drive video folder. Do not invent these. An alternate approved fade/transition requires Main/user signoff.
3. **Case mapping and rights:** Confirm Case 1 identity, Henda styling, embedded audio/music license and subtitles/captions requirement. No captions delivered in the inspected folder.
4. **Browser & device:** H.264/AAC is a reasonable broad browser target, but Android Brave, iOS Safari, headphones, screen-reader captions, latency, fullscreen and actual audio levels are **NOT VERIFIED** by a real-device test. Fullscreen is only attempted by explicit user action and can be denied by browsers.
5. **Performance:** Delivered files total ~33.6 MB. Lazy video preload metadata avoids loading every video on Home, but no real mobile bandwidth profile is proven until the actual assets and devices are checked.
