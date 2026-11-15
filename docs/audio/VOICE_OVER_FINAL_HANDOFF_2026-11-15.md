# The Astral Archives — Chat B Final Voice, SFX & Cinematic Handoff

**Date:** 2026-11-15  
**Owner:** Chat B — Audio, Voice, Cinematics  
**Working branch:** `experiment/room-case-library-layout-fix-2026-11-14`  
**Policy:** No `main` merge, no Main-owned gameplay/room/case/puzzle edits, no silent modification of approved science, no invented transcriptions or evidence.

## Decision

**Chat B-owned media preparation and repository work is complete.**
- **5/5 delivered designer Voice Over files physically uploaded source-exact** (1 KES previously + 4 new NAD/LUM/ORI/AST).
- **20/20 SFX loaded from real files** (11 unmodified designer WAV, 8 unmodified Kenney CC0 M4A, 1 new original synthesized completion WAV).
- **17/17 already approved playable cinematic MP4s remain available** in the repository, with five-case intro/outcome catalog and five authentic evidence-context videos; Asterion's incorrect 472 W outcome remains an enforced scientific HOLD.
- Code: `src/audio/evidenceVoiceManifest.ts` registers all five voice recordings; `src/audio/EvidenceVoicePlayer.tsx` implements per-record playback, non-overlap, focus and settings; `src/audio/AudioReviewLab.tsx` previews five voices separately from **19 original SFX** and the original new Rescue Complete variant.
- **Main scene integration, approved captions, physical-device audition, final video story wiring and scientific approval** are outstanding and **are not falsely classified as done**.

## 1. Voice source authenticity and target mapping

All five recording IDs already exist in `src/archive/evidenceRecords.ts` with `kind='recording'` and `room='Recordings'`. **No new evidence record, puzzle, save key, collection action or rescue permission** was created.

| Case / evidence | GitHub path (under `public/assets/audio/voice/`) | Source Google Drive ID | Bytes | Duration | SHA256 |
|---|---|---|---:|---:|---|
| KES-05 — Analyst Audio Transcript | `designer-kes-05-analyst-review-v1.mp3` | `1VwTSpTqpfOUPcEDt4Z8VA3MHel6B_5pa` | 314,523 | 18.599 s | `371cc159f1d5216eac22cefcb0a792e1fa3625187312a46950c332f4a074bfd5` |
| NAD-07 — Engineer Review Memory | `designer-nad-07-engineer-review-v1.mp3` | `1KrpnUK0dPE2UuWFiliXHowGnLBlkSFIk` | 277,325 | 16.274 s | `9092ea7105bab1672e521609fc0571b345efc54a328eaeb2bbdff9932e62eb2e` |
| LUM-07 — Technician Memory Clip | `designer-lum-07-technician-memory-v1.mp3` | `1NWCCbTU3RpM6WqZmMOTS-fgunN13AtE5` | 299,059 | 17.633 s | `e45d14befef10e76e93612e9a0592c8e9d1a8c17de02d0885b0d393f3627a56a` |
| ORI-07 — Flight Director Audio | `designer-ori-07-flight-director-v1.mp3` | `1k8QAuX-hwFN7acL-uKqTzRHLWH5_vF3k` | 395,190 | 23.641 s | `a9b87db1f5f2927a8bc0a0f0ec6b48440fd5d12634b8d8c43ca2a08690d1c1b5` |
| AST-07 — Review Board Recording | `designer-ast-07-review-board-v1.mp3` | `1P8uRNZqSnYC1WwrOh3PxvUPGFz1h3aDH` | 556,522 | 33.724 s | `5c40cca743730520066d1f7e6c81c4b549d5534eb2914bc880f007e50dc5f028` |

**Total: 1,842,619 bytes**, 5 mono MP3 files, 44,100 Hz. Each existing file retains its exact original byte stream; no new transcoding, gain mutation, or normalization of files. The four new recordings were imported by Git blob and committed in source-exact upload commit [`95d266d`](https://github.com/mahmoud-kun/the-astral-archives/commit/95d266d1d47abfdd716234de0df9a254dfc4116b). Independent post-upload repository tree readback verified all five paths, byte lengths and blob hashes.

**Not source voice:** `KES-07` and `ORI-08` remain canonical *optional* recording-kind evidence **without any delivered MP3**. Main should present them as textual/visual memories until the designer chooses to produce their audio; do not fabricate narration or block case rescue on optional audio absence.

## 2. Voice playback and mix

- Player loads each MP3 on demand, exposes native Play/Pause/Seek, respects player-controlled master volume and SFX mute, participates in exclusive `claimCinematicAudioFocus` to lower station SFX/ambience, pauses another spoken recording on start and is interrupted by a new cinematic.
- Evidence remains available as source text even when recording cannot load or when audio is muted.
- Voice clips are **never auto-played** on entering Recordings Room and can never automatically collect or solve evidence.
- Preview mix coefficients from measured source loudness: **KES .30 / NAD .36 / LUM .37 / ORI .37 / AST .34** at 100% master, scaled to user's `0–100` master volume. The `measuredInputLufs` values in manifest are approximate loudness measurements. This preview seeks roughly aligned low-level speech; it is **not** a perceived-quality guarantee or a master render.
- Real Android/Windows headset/speaker listening and audiobook-style word-by-word transcript/speaker verification **NOT VERIFIED**. Do not represent `src/archive/evidenceRecords.ts` text as a verbatim transcript of supplied narration. Proper accessible captions require final written spoken script or approved ASR with manual review. See `transcriptStatus` per clip.

## 3. Exact Main integration patch — must be made by Main owner

In the **existing verified Recordings Room evidence inspector** (e.g. `src/gameplay/StationRoom.tsx`, `src/gameplay/CasePuzzle.tsx`, or whichever single inspector Main authoritatively chooses), import:

```tsx
import EvidenceVoicePlayer from '../audio/EvidenceVoicePlayer'
import { isEvidenceVoiceId } from '../audio/evidenceVoiceManifest'
```

When the currently inspected canonical evidence record is accessible and `record.room === 'Recordings'`, render **inside that record's existing inspector**:

```tsx
{record.room === 'Recordings' && isEvidenceVoiceId(record.id) && (
  <EvidenceVoicePlayer key={record.id} id={record.id} />
)}
```

This is a **presentation-only** binding. It must not change `discoverEvidence`, `collectEvidence`, `submit`, `fileEvidence`, required folder counts, `rescueIsReady`, diagnoses, or `otherRescueCompleted`. Preserve the user-approved inspect → analyze → manually collect → file flow. Do not create a second inspector/audio copy in another room. Main owns the final placement and accessible dialog semantics.

After Main integrates, verify with real interactions: select each five cases, enter Recordings, inspect proper record, start/pause/seek, leave/return/close, switch from one recording to another without overlap, mute/unmute and slider updates, switch to cinematic while voice is playing, navigate without orphan audio, temporarily block MP3 network to test text fallback, confirm no evidence auto-collected, and confirm bad/misfiled evidence remains neutral.

### Video integration still Main-owned

Main must mount one `<CinematicOverlay/>` and only play intros on explicit briefing, outcomes after independent verified rescue, and evidence-context videos in their mapped record. Asterion outcome **still blocked** until corrected successful **450 W** retest meeting **≤460 W** target. Existing portal and engineering-machine SFX already supplied; Main must connect to actual permitted actions and avoid overdubbing video soundtrack.

## 4. Sound effects status

**20 files / 842,128 bytes.** All 19 source effects remain untouched, plus `rescue_completed_original_v1.wav` (60,020 bytes) with separate completion vs rescue-unlocked feedback. All KES/NAD/LUM/ORI/AST rescue ambience routing fixed. Signal room genuine evidence hotspots produce signal sound. Other portal/engine/metal/energy/thruster triggers require Main-owned event hooks. Full source and patch: [SFX Finalization](SFX_FINALIZATION_AND_MAIN_PATCH_2026-11-15.md).

## 5. Cinematic folder updated inventory and handling

Google Drive `NASA/videos` currently contains **18 MP4s**, not 17: a newly observed `game demo.mp4` (Drive ID `1ey02GwYNkDjuVDHsekKId8JlIH3j_D0p`, 7,606,016 bytes, H.264/AAC 1920×1080 24 FPS, 8.04 s) is present in addition to the 17 registered game films. This clip is a **demo/mood-scene of Henda standing at a mission briefing desk**, not an identified case intro/outcome/evidence/portal/closing, and its character art appears more anime-styled than the previously approved geometric art direction. It has therefore **not** been silently added to `CINEMATICS` or game progression. The source can be reviewed as an optional demo reference by Main; it needs explicit art/content approval before promotion to a production clip. **No distinct Return to Present or Closing Scene** file has yet been identified in this folder.

17 published source MP4s remain present on the working branch with their prior SHA-256-backed tests. The fictional Asterion `case5Outcome` film depicts **472 W VERIFIED**, while approved rescue requires an independent **450 W** successful retest with target **≤460 W**. Code guards prevent false scientific approval; no media correction was invented. Fictional NASA insignia/endorsement treatment still needs final publication review.

## 6. Delivery/testing and exact status

- **DONE:** five original MP3s source-exact pushed; five-case manifest; volume gain mapping; on-demand audio player; exclusive playback and cinematic audio focus; 5-player previews in Sound Lab; source SHA256/Git SHA1 tests; 20 SFX; 17 catalogued cinematics; scientific hold.
- **CHECK CI:** final user-readable pass must be based on a completed GitHub Actions run at or after this implementation (not merely a successful earlier binary-only upload).
- **MAIN-OWNED:** single inspector integration; root cinematic player & story triggers; authorized portal/equipment sound triggers; physical device test and final app end-to-end QA.
- **DESIGNER / CONTENT:** final word-for-word Voice Over transcripts & speaker labels (for captions), optional `KES-07`/`ORI-08` if audio desired, 450 W AST outcome correction, distinct Return/Closing files if approved, Henda style consistency, rights/non-endorsement sign-off.
- **NO MAIN MERGE**, no changes to owned gameplay, puzzle engine, case data, or user originals.

**Current status:** Chat B prepared source assets and code are ready for Main integration; final release **not yet approved**.
