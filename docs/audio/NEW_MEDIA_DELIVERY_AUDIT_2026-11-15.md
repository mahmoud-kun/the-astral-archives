# The Astral Archives — Second Designer Media Delivery Audit (8 MP4 + KES-05 Voice)

**Chat B • 2026-11-15 • Original Drive sources verified.** This report supplements (does not replace) `VIDEO_ASSET_LEDGER_2026-11-15.md` and the four original clips. It is not a Main signoff, not a gameplay rewrite, and it does not authorize new evidence records.

## 1. Evidence Bible order is authoritative

From the actual Google Drive `Cases Evidence Production Bible v2.docx`: **Case 01 KES/Kestrel → Case 02 NAD/Nadir → Case 03 LUM/Lumen → Case 04 ORI/Oriole → Case 05 AST/Asterion**. All filenames numbered 1–3 refer to exactly these case codes, never to Nadir as Case 01. Clip appearance does not change the numbering.

## 2. Verified 8 new source video clips

Source: [NASA Drive / videos](https://drive.google.com/drive/folders/1LIRtkA0Re_yJ-VpIU0PAIc2Whlm80-sX). All eight original MP4s were fetched independently. `ffprobe` confirmed **1920×1080, H.264 video, AAC stereo at 48 kHz and 24 FPS** for each; `ffmpeg -xerror` full-stream video+audio decoding returned exit code 0 on **8/8**. SHA-256 below was calculated from full source bytes, and unchanged copies were placed in a user-downloadable delta ZIP. Mean/peak volumes are `volumedetect` dBFS, not LUFS. No third-party soundtrack/visual rights clearance claimed.

| Key / Drive source file | Bytes | Duration | Mean / peak dBFS | Full source SHA-256 |
| --- | ---: | ---: | --- | --- |
| `case1Evidence` — case 1 evidence.mp4 | 6,481,903 | 10.000 s | -25.2 / -5.7 | `4c02130808babb45ad16e5f02369553e830194c263ed8fdc7ed22b0820476269` |
| `case2Intro` — case 2 intro.mp4 | 4,228,560 | 7.000 s | -17.4 / -1.3 | `864fdd346b545fc099be5c3d8c0559197cdaceabd8024cbcc3f5833e4468066d` |
| `case2EmailEvidence` — case 2 email evidence .mp4 | 4,092,994 | 7.000 s | -29.3 / -7.7 | `dc4202ad7cc263c284e085384d2162c7cd7e91c7f77c44dc202dd979e1f59b90` |
| `case2UnitsMismatchEvidence` — case 2 units mismatch evidence.mp4 | 5,971,124 | 10.000 s | -22.3 / -3.4 | `9e055432f899d4fa05dc036e2f1526a3c1f5cfc657080d87ba5caa2560d3ce6f` |
| `case2Outcome` — case 2 outcome.mp4 | 4,886,242 | 5.250 s | -21.3 / -8.7 | `a7b17c577be210382572536ff3cf3788480ffd1b9af5a5a741751ca686b34a85` |
| `case3Intro` — case 3 intro.mp4 | 3,323,996 | 7.000 s | -23.8 / -10.9 | `a6d90fbe74e441e78c53c5bc2824a96b4b642eef522ff5f34c1b74def42f07c1` |
| `case3ApprovalEvidence` — case 3 approval evidence.mp4 | 5,720,883 | 6.250 s | -27.2 / -8.7 | `fc096e2d5fa1776505c9802641e2fe91d70fa627220853bcfa0cee2e837b6a64` |
| `case3Outcome` — case 3 outcome.mp4 | 5,161,082 | 7.000 s | -27.5 / -13.3 | `40f68475ec9f61f7c08dbf963cc4afcd63b2e11ed54f7e4d422dc2cc83141881` |

**Total NEW video bytes:** 39,866,784. Existing first four originals: 33,560,847. Total twelve originals: **73,427,631 bytes**. Lazy load these files one-by-one; do NOT preload 73 MB at startup. `case2Intro` is the hottest new clip (peak -1.3 dBFS); manifest gain .35 reduces concurrent mix. The originals are unchanged, without transcoding. Captions are not provided with the media, so user/designer must approve subtitles/silent accessibility treatment.

### Versioned local-target filenames — staged, NOT committed as binaries

All full local paths are `public/assets/video/...` in the source tree, served by Vite as `/assets/video/...`:

| Manifest key | Repository path (when Main uploads) | Original Drive file ID |
| --- | --- | --- |
| `case1Evidence` | `public/assets/video/designer-case-1-evidence-v1.mp4` | `1aeFKVcvfglWRYOQf3u_DgaxJOtYUyfU6` |
| `case2Intro` | `public/assets/video/designer-case-2-intro-v1.mp4` | `14GhVxCpyjSiclmxe6GAo-rK2sieSUNTz` |
| `case2EmailEvidence` | `public/assets/video/designer-case-2-email-evidence-v1.mp4` | `15oDkj50S1dYHeZ1M92wDvo8LAHfhADWE` |
| `case2UnitsMismatchEvidence` | `public/assets/video/designer-case-2-units-mismatch-evidence-v1.mp4` | `1XVpZaqmhtGtO5R-ZXBUAurl5BAtFwjmP` |
| `case2Outcome` | `public/assets/video/designer-case-2-outcome-v1.mp4` | `1BVg5wPA2_2fIjrpgoGi7YGRgRskqT5nA` |
| `case3Intro` | `public/assets/video/designer-case-3-intro-v1.mp4` | `1u-ZP3m3W5YUW2nm9J_fHxK4DIJNRleCm` |
| `case3ApprovalEvidence` | `public/assets/video/designer-case-3-approval-evidence-v1.mp4` | `1VdFCysk4vb09q4tdRmFcGla0mQNB1D1_` |
| `case3Outcome` | `public/assets/video/designer-case-3-outcome-v1.mp4` | `1e2P5Sy-VbuVVciKvIR06IEw8qIhBnWaT` |

## 3. Main's precise gameplay mapping — no fabricated evidence!

The `CINEMATICS` manifest now contains **12 delivered clips** (4 prior + 8 new). Four new visual clips are tagged `mediaRole:'evidence-context'` with `recordContext` pointing to an already authored, required Production Bible ID. **They are contextual animated illustrations of existing evidence, not separate collectible records**. Use `requestCinematicFlow` or display the MP4 embedded *inside* the evidence detail as the scene dictates, with explicit Play and no auto-progression.

| New media | Where Main should expose it | On finish / skip |
| --- | --- | --- |
| `case1Evidence` (KES / Kestrel) | Archive **KES-02 Launch Window Memo — Original**, after player opens the authentic record: animation of Kestrel launch schedule / unavailable slot. This is a visual contextual overlay, NOT new evidence or a verified dated memo itself. | Stay in KES-02 inspector, do NOT auto-solve, file or collect |
| `case2Intro` (NAD / Nadir) | Case 02/NAD Mission Briefing action | Return to NAD briefing, no evidence gain |
| `case2EmailEvidence` (NAD / Nadir) | **NAD-05 Open Anomaly Email** in Recordings Room (`main_video_display` is already NAD-05). The video explicitly depicts that email; open after the existing record inspection. | Return to same NAD-05 analysis; the actual order/closure puzzle remains obligatory |
| `case2UnitsMismatchEvidence` (NAD / Nadir) | **NAD-02 Raw Impulse Data Fragment** in Signal Room: two visual representations labeled `12 N·s` vs `12 lbf·s`. Supplement, do not replace the conversion analysis. | Return to NAD-02; do not fill 53.37865938 N·s for the player |
| `case2Outcome` (NAD / Nadir) | ONLY after authoritative `rescueIsReady(readArchive(),'NAD')`, supported diagnosis, and `readNadir().rescue.submitted && readNadir().rescue.rerunPassed` verify true, and rescue success view/route is confirmed by Main. | Return to the verified outcome; a video by itself never changes `rescue` save |
| `case3Intro` (LUM / Lumen) | Case 03/LUM Mission Briefing | Return to LUM briefing |
| `case3ApprovalEvidence` (LUM / Lumen) | **LUM-05 Integration Test Setup** in Signal Room: clip shows optical integration test with compensation enabled and PASS. It demonstrates *why* a nominal approval can conceal an optical misconfiguration; **do not mis-file as LUM-06 Waived Raw Data Check** on its name alone. | Return to LUM-05 analysis, where the player tests the configuration |
| `case3Outcome` (LUM / Lumen) | ONLY when `otherRescueCompleted(readArchive(),readOtherProgress(),'LUM')===true` and the user has invoked their verified alternate-branch result | Return to completed LUM outcome, no silent unlock |

`recordContext` in the manifest documents the suggested **inspection source** and is backed by 2026-11-14 Evidence Bible records. Main is responsible for the final physical hotspot hook in shared views. No standalone collectible called "case 1 evidence" or "approval evidence" is introduced. Main should preserve manual collection, wrong-folder persistence, six-required gates, analysis and engineering rerun.

**Important:** In the finished `CinematicOverlay`, `completed` means playback ended AND user selects Continue; `skipped` skips *presentation only*; `returned` keeps current inspector/scene; `unavailable` offers continue without media. None of these certify scientific success.

## 4. New Kestrel spoken recording — assessment and placement

Source: [Voic oveer / kestrel folder](https://drive.google.com/drive/folders/1oAFESzhpNy-Rc7O6CcS2r00ZrUT0Njjo). File:

`ElevenLabs_2026-11-15T05_06_46_Morgan - Deep, Powerful, and Confident_pvc_s50_v3.mp3`
- Drive ID: `1VwTSpTqpfOUPcEDt4Z8VA3MHel6B_5pa`
- `ffprobe`: **MP3, 18.599 seconds, mono, 44.1 kHz, 314,523 bytes**.
- `ffmpeg volumedetect`: mean **-15.2 dBFS**, peak **-0.3 dBFS**. This is substantially hotter than the softer evidence/video tracks. Use `mixGain:.30` × 0–100 master, with audio focus reducing ambience when playing; do not auto-start, especially on headphones.
- SHA-256 of exact original: `371cc159f1d5216eac22cefcb0a792e1fa3625187312a46950c332f4a074bfd5`
- Target: `public/assets/audio/voice/designer-kes-05-analyst-review-v1.mp3`
- Code: `src/audio/evidenceVoiceManifest.ts` and `src/audio/EvidenceVoicePlayer.tsx`.

**Verdict: USE, as existing REQUIRED `KES-05 Analyst Audio Transcript` in the Recordings Room — NOT as generic background narration.** A transcript was obtained by processing the real source MP3 in Descript [audit composition](https://web.descript.com/b8a62512-2c29-4df0-911d-6abaecc5c306/3e0e3): a launch engineer warns that the primary launcher is unavailable, a different option affects the trajectory/timing, and a response calls for an updated analysis before signing. This is directly aligned with the actual KES-05 role in Evidence Bible v2: an analyst warning before the approval stamp.

**Art/scientific wording QA pending:** The source file identifies one generated speaker preset (Morgan), while the script reads like two people in a meeting. If designer intended two characters, request a second distinct voice or clear transcript speaker labeling. ASR produced a potentially inconsistent phrase ("crew's trajectory") whereas this unmanned spacecraft case is about **cruise trajectory/requirements**; have designer check actual spoken word and correct/re-render if necessary. Do not publish an unverified ASR transcript as canonical KES-05 source text. Keep original approved Evidence Bible KES-05 transcript visible for accessibility; create verbatim SRT only after confirming actual words and roles. Because user-generated ElevenLabs speech rights are source-account/license-specific, obtain permission confirmation before public distribution.

The voice does **NOT** add a new evidence ID or change required count 6, and is separate from the existing **19 SFX**. The audio review page displays a new independent voice section without increasing the SFX list.

## 5. Offline staging and residual issues

- `astral_new_video_voice_delta_v2.zip` (prepared locally for user) contains **exact unchanged bytes** of 8 new videos + 1 KES-05 MP3 at versioned paths, `media-sha256.json` and README. ZIP was integrity-checked with Python `ZipFile.testzip()`. The original four clips remain in the older separate bundle; don't overwrite them.
- **New 8 MP4 / MP3 binaries have not been committed to GitHub**. Source metadata, versions, paths, 12-clip manifest and KES voice player are tracked in code. Local ZIP does not make media playable on deployed game until Main uploads. No Google Drive hotlink in production.
- The source clips for Case 04/Oriole and Case 05/Asterion, a return-to-present sequence, an independently approved source subtitle set, and rights approval remain outstanding. No invented media or evidence is to be substituted.
- **Physical Android/iOS playback not verified** and no independent Main acceptance. Existing original 11 designer WAV + 8 Kenney M4A remain untouched.

**Mandatory verification after Main uploads:** SHA match, HTTP 200/206, 16:9 sizing, explicit play on slow network, autoplay muted/reduced-motion, full-screen consent, audio/captions, 1-case matching, wrong-folder/rescue gating, fallback, audio focus, mobile landscape, and preservation of local saved investigation progress.

**Integration handoff:** update Main via Issue #4; only Main modifies shared route/evidence/rescue screens. Use the above `CINEMATICS` keys and `EvidenceVoicePlayer id='KES-05'` under authorized existing record inspector; do not change source IDs.


## Final binary upload resolution — VERIFIED on GitHub (15 November 2026)

**This section supersedes all earlier "MP4/MP3 not deployed to GitHub" warnings in this historical audit.** User authorized another upload attempt. The initial direct `create_blob` upload repeatedly failed with HTTP/2 on multi-MB MP4s. We successfully uploaded the 314,523-byte exact KES-05 MP3 via the Git Data API ([commit 6fe5482](https://github.com/mahmoud-kun/the-astral-archives/commit/6fe5482491143b4d48d2b2298b871248f2106a72)). A temporary, branch-scoped GitHub Actions uploader then downloaded all 12 original MP4 files **from the supplied public Drive IDs**; each full binary passed an independently configured exact SHA-256 check before commit.

- **GitHub Actions run #43682242118:** SUCCESS. https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43682242118
- **All-12 MP4 commit:** `b3bb9b4f2e0681a1f6d6c67c8561ffd0609d6c08`, message `assets(video): upload twelve SHA-verified original designer films`, with exactly 12 files added under `public/assets/video/`.
- **One MP3 commit:** `6fe5482491143b4d48d2b2298b871248f2106a72` at `public/assets/audio/voice/designer-kes-05-analyst-review-v1.mp3`.
- **Post-push remote readback:** GitHub's recursive tree lists all **13/13 exact paths** with **13/13 Git Blob SHA-1 and byte lengths matching the original local source bytes**, total **73,742,154 bytes**. These are repository objects now, not just remote jobs, download links or staging ZIPs.
- **No new case IDs/evidence/rescue progress introduced. No main merge.** Branch remains `experiment/room-case-library-layout-fix-2026-11-14`. The temporary upload workflow is intended for removal once verification/handoff is complete.
- **Still pending:** Main trigger/scene wiring, story approval for Kestrel industrial visuals, verified subtitles and rights, post-upload application build and browser/device playback QA. Physical bytes on GitHub do **not** prove that all cinematic events are wired or rendered in the playable experience.
