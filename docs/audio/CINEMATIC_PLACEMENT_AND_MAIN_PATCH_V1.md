# The Astral Archives — Current Four Cinematics: Placement & Main Integration Patch (V1)

**Owner:** Chat B, Audio/Cinematics; **date:** 2026-11-15.
**Branch:** `experiment/room-case-library-layout-fix-2026-11-14`.
**Status:** CODE/PATCH READY; **NOT live-wired or film-deployed**, awaiting Main's shared-file edits, video upload and artistic footage approval. **Case identities/sequence are already settled by Evidence Bible v2.** This document is the definitive *placement request* for the four actually delivered clips only. Future footage will get its own versioned additions.

## Authoritative case numbering (verified directly from designer's Evidence file)

Source: [Cases Evidence Production Bible v2.docx](https://docs.google.com/document/d/1lGpnlCkWYZowYNge9Fcd14wGeZH3FdWr/edit) in NASA Drive, section sequence `KES · Kestrel`, `NAD · Nadir`, `LUM · Lumen`, `ORI · Oriole`, `AST · Asterion`. This also matches `CASE_CODES` in `src/archive/evidenceRecords.ts`, `INVESTIGATION_CASES`, and `HomeScreen` previews.

| Official # | Case | Code |
| --- | --- | --- |
| **01** | Kestrel — The Mission That Outgrew Its Plan | **KES** |
| **02** | Nadir — Two Numbers for One Interface | **NAD** |
| **03** | Lumen — The Telescope That Passed | **LUM** |
| **04** | Oriole — The Landing Signal | **ORI** |
| **05** | Asterion — The Stamp in the Archive | **AST** |

This order is **LOCKED by the user** for cinematic IDs, evidence grouping, case folders, UI, and future video delivery. `case1Intro` and `case1Outcome` map **only to KES**, never NAD. Audio manifest now includes `caseId:'KES'` for these clips. Source/story accuracy remains a separate approval step, not a reason to renumber cases.

## 1. Verified game topology — important before wiring

- `/` — `src/HomeScreen.tsx`: START INVESTIGATION / CONTINUE INVESTIGATION currently call `enterInvestigation()` -> `navigateGame('/?room=1')`.
- `/?room=1` — `src/InvestigationDesignerScene.tsx`: Investigation Room; Mission Briefing, Evidence Board, Room Door, Rescue Console. Briefing opens mission folders at `/?folder-lab=1&return=investigation`.
- `/?folder-lab=1&return=investigation` — `src/archive/ArchiveFolderLab.tsx`: five dossier tabs are ordered **KES, NAD, LUM, ORI, AST**. The current view restores the saved active case if present, otherwise falls back to **NAD**; this initial selection is a UI default, **not** a change in case numbering. Main may set a new-save default to KES without renumbering any files.
- `/?station=recordings` — `src/gameplay/StationRoom.tsx`: physical Recordings Room with `main_video_display` currently bound to **NAD-05** and `recording_equipment_rack` to **NAD-07**. Neither is a generic KES cinematics hook; do not overwrite their evidence or pretend a designer movie verifies a fictional analysis.
- `/?rescue=NAD` — `src/gameplay/NadirRescue.tsx`: functioning Nadir engineering rescue. Enter access is guarded by `rescueIsReady(archive,'NAD')`, six correctly filed records; within rescue, diagnosis and rerun remain mandatory.
- KES/LUM/ORI/AST rescue execution **has since been integrated** through `src/gameplay/CaseRescue.tsx` and `/?rescue=KES|LUM|ORI|AST` routing. This supersedes the prior pre-integration note. Do not show success merely because the route is open: the game must pass `otherRescueCompleted` and video content signoff.

## 2. Asset-by-asset placement (these are source clips, NOT playable URLs yet)

| Manifest ID / original Drive video | Intended physical presentation | Authorized trigger & actual game location | On completed / skipped / user-acknowledged unavailable | On Return | Status |
| --- | --- | --- | --- | --- | --- |
| `opening` — `game opening.mp4` (10.005 s) | Full-screen cinematic overlay on Home, after Start click; signal/mission montage before station entry | `src/HomeScreen.tsx` `enterInvestigation()`. **Fresh Start only**; Continue on existing investigation save should navigate directly by default. Never autoplay on Home load. | Navigate `/?room=1`. This is presentation only: no save flags/evidence added. | Remain on Home. | Placement confirmed; media file missing on GitHub |
| `case1Intro` — `case 1 intro .mp4` (7.125 s) | Optional **PLAY CASE RECORDING** / introductory footage on **KES** mission dossier or KES briefing with Case 01 identity fixed as KES by Evidence Bible v2; visual-content approval remains separate. Do **not** replace NAD-05 evidence. | `src/archive/ArchiveFolderLab.tsx` while selected `caseId==='KES'`, only upon explicit user click; alternatively KES-specific briefing in Investigation, once added. Don't trigger merely when opening the folder view; it restores the selected case or defaults to NAD. | Remain on KES briefing/dossier; don't auto-collect evidence, mark puzzles solved, or change timeline. | Remain in current dossier. | **CONTENT HOLD**: video shows lander-like hardware undergoing testing, whereas KES is an early-stage observatory proposal; do not bind as canonical KES footage without approval |
| `portalPast` — `time travel to the past .mp4` (8.000 s) | Entering time portal from **Rescue Console** in Investigation Room | `src/InvestigationDesignerScene.tsx` Rescue button, after re-reading `rescueIsReady(readArchive(),'NAD')` and only when the player actually chooses ENTRY. Any other case may use same generic portal later after its authorized gate. **Do not trigger at 6/6 evidence completion itself.** | Navigate to already-authorized `/?rescue=NAD` (or the exact future case-specific past route). Skip never makes a locked rescue available. | Remain at Rescue Console; no travel. | Placement confirmed; **visual approval needed** for the portal/Henda style; binary absent |
| `case1Outcome` — `case 1 outcome.mp4` (5.970 s) | KES Rescue result/alternate-history visual; footage appears to depict reactivation/unveiling of built craft | Only AFTER the player has completed the already-integrated KES Rescue **and** `otherRescueCompleted(archive, progress, 'KES')===true`. Invoke once per successful user-requested outcome view, with replay option; not on opening Rescue and not for NAD. | Continue to KES's verified result/return-to-present screen (route must be specified by Main); no additional success mutation from cinema. | Stay on result page; don't reverse verified rescue. | **BLOCKED ON KES VISUAL CONTENT APPROVAL AND FINAL EVENT WIRING**: KES production phase may not justify the built hardware footage; no success trigger exists in current UI |

**Case 01 identity is NOT ambiguous:** `Cases Evidence Production Bible v2.docx` explicitly begins with **KES / Kestrel** and places NAD, LUM, ORI, AST after it. Thus the existing `case1Intro` and `case1Outcome` are registered to **KES** by number, not to NAD. **Separate artistic caveat:** Designer footage depicts craft on an industrial assembly stand (the outcome includes "PROJECT REACTIVATED") whereas KES is a pre-Phase-A/Phase-A observatory concept. The footage's story fit requires designer/content signoff before publication; do not relabel Case 01 or silently remap the clip to another case to avoid the mismatch.

## 3. Files and existing callable API

Four clip IDs and paths are already registered in `src/media/cinematicManifest.ts`:

- `opening` -> `/assets/video/designer-game-opening-v1.mp4`
- `case1Intro` -> `/assets/video/designer-case-1-intro-v1.mp4`
- `portalPast` -> `/assets/video/designer-time-travel-past-v1.mp4`
- `case1Outcome` -> `/assets/video/designer-case-1-outcome-v1.mp4`

`src/media/CinematicOverlay.tsx` is the existing finished media UI (keyboard Escape, Play/Pause, Skip, Replay, Return, volume, focus). `src/media/cinematicFlow.ts` is the **new Main-ready one-shot continuation adapter**. It protects against concurrent requests, checks a Main-supplied live authorization predicate, listens to the matching `astral:cinematic-finished` result, separates Return from completed/skipped/unavailable, and **never** edits save or navigation itself.

```ts
import { requestCinematicFlow } from './media/cinematicFlow'
// requestCinematicFlow(id, {
//   canStart: () => freshAuthoritativeGuard,
//   onAdvance: (outcome) => { /* Main decides navigation */ },
//   onReturn: () => { /* keep current screen */ },
// })
```

**Crucial:** The `onAdvance` callback must be safe for `outcome === 'skipped'` and `outcome === 'unavailable'`. The guard is evaluated BEFORE the video; no "completed" video automatically becomes scientific proof.

### Main Patch A — persistent root, 2 source lines (`src/main.tsx`)

Add one import alongside existing imports:

```tsx
import CinematicOverlay from './media/CinematicOverlay'
```

Inside `AstralArchives`' existing `return <>`, mount **exactly once**, after `</Suspense>` and before the fragment close:

```tsx
<CinematicOverlay />
```

Do not mount under a route-controlled conditional; this preserves fullscreen/document state during navigation. It is isolated and invisible until requested.

### Main Patch B — Home Start (`src/HomeScreen.tsx`)

Import `requestCinematicFlow` and modify only the existing `enterInvestigation()`:

```tsx
function enterInvestigation() {
  if (hasSave) { // CONTINUE goes directly; don't replay the opening
    navigateGame('/?room=1')
    return
  }
  requestCinematicFlow('opening', {
    canStart: () => true, // only reachable from the visible Start action
    onAdvance: () => navigateGame('/?room=1'),
    onReturn: () => {}, // remain on Home
  })
}
```

Do not hide the Home or navigate before cinema finishes; the overlay is above the Home. Main may add a separate user-invoked Replay Opening button later.

### Main Patch C — NAD portal button (`src/InvestigationDesignerScene.tsx`)

Current branch uses the `nadirReady` guard for rendering the `ENTER NADIR RESCUE` button. Preserve that. Import `readArchive` from `./gameplay/gameSave`, `rescueIsReady` is already imported, and import `requestCinematicFlow`.

Replace only the button's current `onClick={()=>navigateGame('/?rescue=NAD')}` with:

```tsx
onClick={() => {
  requestCinematicFlow('portalPast', {
    canStart: () => rescueIsReady(readArchive(), 'NAD'),
    onAdvance: () => {
      if (rescueIsReady(readArchive(), 'NAD')) navigateGame('/?rescue=NAD')
    },
    onReturn: () => {}, // stay on rescue console
  })
}}
```

The second recheck is deliberate: wrong-folder refiling or a save update during video can re-lock eligibility. The existing Rescue remains fully playable and the actual causal+engineering challenges occur **after** this transition.

**Keep entry points consistent:** `src/archive/ArchiveFolderLab.tsx` currently has a **second** `ENTER NADIR RESCUE` button. Apply the same gated portal entry there, or centralize that action in Main. Otherwise one path bypasses the cinematic (though not the puzzle guard). Only Main may edit the shared view.

### Main Patch D — KES briefing video (hold before binding)

With the KES case mapping **already established**, once the depicted footage is approved for the KES Phase A story, offer an opt-in `PLAY CASE 1 INTRO` in the **KES-specific** briefing/dossier action. Use:

```tsx
requestCinematicFlow('case1Intro', {
  canStart: () => /* selected case is KES AND source approved for KES */,
  onAdvance: () => {}, // purely explanatory footage; remain in current dossier
  onReturn: () => {},
})
```

Do **not** set the guard to true today solely because of the filename. This footage is not an Evidence ID, does not replace NAD-05, and does not grant puzzle progress. Designer approval must be written as an explicit change in the content authority before enabling.

### Main Patch E — KES outcome (hold until verified rescue)

The KES Rescue UI is now implemented in `src/gameplay/CaseRescue.tsx`. Upon its actual verified success (and footage signoff), use the authority function from `src/gameplay/caseRescueEngine.ts`:

```tsx
import { otherRescueCompleted } from './gameplay/caseRescueEngine'
// call from a KES rescue/result component, using fresh archive/progress state:
requestCinematicFlow('case1Outcome', {
  canStart: () => /* footage approved AND otherRescueCompleted(freshArchive, freshOtherProgress, 'KES') */,
  onAdvance: () => { /* Main-controlled KES result/return route */ },
  onReturn: () => {}, // remain on verified KES result
})
```

This is a contract sketch, **not** copy-paste compilable until Main wires `CaseRescue.tsx` to fresh case progress and an approved post-success result route. The KES outcome must not run on Nadir's `/?rescue=NAD` or after only `rescueIsReady`/6-of-6 evidence.

## 4. Exact end-of-video contract and controls

`CINEMATIC_FINISHED_EVENT = 'astral:cinematic-finished'` with detail `{id, outcome}`.

| Outcome | What Chat B guarantees | Main must do |
| --- | --- | --- |
| `completed` | Playback ended and user presses Continue | Advance only to already-authorized route/stage |
| `skipped` | User chooses Skip, Escape or Skip & Continue | Same presentation continuation; **never** solve evidence/diagnosis/rescue |
| `returned` | User chooses Return | **No progression/navigation**; remain in current screen |
| `unavailable` | Media failed and user presses Continue Without Video | Same authorized continuation; log as media issue, not a gameplay failure |

Player auto-plays **muted only** when browser allows, does not auto-play for reduced motion, and only enables sound by explicit user click. Persistent settings and no forced volume increase. Do not make the recording non-skippable or require watching to unlock a mission. Pre-load lazy metadata only, no Drive iframe, no forced bandwidth download on Home.

## 5. Waiting on upload and newly delivered designer files

Current staging: 4/4 clip **metadata/code present**; **0/4 playable MP4 binaries checked into GitHub**. Main can upload the verified exact-byte ZIP from Chat B into `public/assets/video/` as individual files. Checksums in `docs/audio/VIDEO_ASSET_LEDGER_2026-11-15.md`. A ZIP in the chat is **not** a deployment. Until exact paths are available, do not enable production triggers without explicit graceful unavailable-video acceptance.

**Not received** in the inspected videos folder: standalone return-to-present, cases 2–5 introductions, outcomes and evidence video clips. Nothing is synthesized, borrowed from another mission, or wired as an invented stand-in. When each file arrives, Chat B will separately audit real content, approve source ID, add versioned manifest entry and placement contract, without rewriting these four clips.

## 6. Main integration acceptance checklist

1. **Case 01 = KES is confirmed by Evidence Bible v2**; obtain designer/content confirmation that the KES introduction and outcome footage visually fit the approved Phase A storyline before enabling the clips.
2. Merge the small patches above in **Main-owned shared files**; verify each route remains accessible by normal clicks.
3. Upload and hash-check all 4 MP4 binaries, verify HTTP 200/206, media types, byte ranges, 16:9 contain and loading/error paths.
4. Test **fresh Start -> opening -> Investigation**, **saved Continue -> Investigation without forced replay**.
5. Test NAD **5/6 -> no portal**, **6/6 correctly filed -> portal -> Rescue**, **Return -> no route**, **Skip -> only authorized route**, and independently verify diagnosis + unit rerun still required after skip.
6. KES Rescue UI and route now exist; test a real authorized KES rescue through `otherRescueCompleted`, but do NOT enable `case1Outcome` for release until matching visual footage is approved and the actual result event is wired.
7. Test mute/volume, reduced motion, slow network, file missing, Escape, mobile landscape, Android Brave/iOS Safari and actual speakers/headphones. No actual physical-device playback is claimed yet.
8. Main remains sole final signoff authority; specialist and CI proof must not be confused with release approval.

**Companion handoff:** `docs/production/handoffs/AUDIO_CINEMATICS.md`. **Tracking:** [Issue #4](https://github.com/mahmoud-kun/the-astral-archives/issues/4).


## Final binary upload resolution — VERIFIED on GitHub (15 November 2026)

**This section supersedes all earlier "MP4/MP3 not deployed to GitHub" warnings in this historical audit.** User authorized another upload attempt. The initial direct `create_blob` upload repeatedly failed with HTTP/2 on multi-MB MP4s. We successfully uploaded the 314,523-byte exact KES-05 MP3 via the Git Data API ([commit 6fe5482](https://github.com/mahmoud-kun/the-astral-archives/commit/6fe5482491143b4d48d2b2298b871248f2106a72)). A temporary, branch-scoped GitHub Actions uploader then downloaded all 12 original MP4 files **from the supplied public Drive IDs**; each full binary passed an independently configured exact SHA-256 check before commit.

- **GitHub Actions run #43682242118:** SUCCESS. https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43682242118
- **All-12 MP4 commit:** `b3bb9b4f2e0681a1f6d6c67c8561ffd0609d6c08`, message `assets(video): upload twelve SHA-verified original designer films`, with exactly 12 files added under `public/assets/video/`.
- **One MP3 commit:** `6fe5482491143b4d48d2b2298b871248f2106a72` at `public/assets/audio/voice/designer-kes-05-analyst-review-v1.mp3`.
- **Post-push remote readback:** GitHub's recursive tree lists all **13/13 exact paths** with **13/13 Git Blob SHA-1 and byte lengths matching the original local source bytes**, total **73,742,154 bytes**. These are repository objects now, not just remote jobs, download links or staging ZIPs.
- **No new case IDs/evidence/rescue progress introduced. No main merge.** Branch remains `experiment/room-case-library-layout-fix-2026-11-14`. The temporary upload workflow is intended for removal once verification/handoff is complete.
- **Still pending:** Main trigger/scene wiring, story approval for Kestrel industrial visuals, verified subtitles and rights, post-upload application build and browser/device playback QA. Physical bytes on GitHub do **not** prove that all cinematic events are wired or rendered in the playable experience.
