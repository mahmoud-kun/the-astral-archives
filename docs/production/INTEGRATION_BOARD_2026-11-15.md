# The Astral Archives — Main Chat Integration & Release Board

**Date:** 2026-11-15 | **Sprint budget:** T+0 to T+300 (clock begins at real kickoff only)  
**Governance:** [Parallel release plan](PARALLEL_RELEASE_PLAN_2026-11-15.md) | **Current accepted gameplay branch:** `experiment/room-case-library-layout-fix-2026-11-14`.

> This document is a **live acceptance log to be updated by Main Chat**, not a list of already completed deliverables. A specialist's claim of done means *awaiting* independent Main acceptance.

## Owner handoff registry

| Stream | Owner | Start | Last handoff commit | Main verdict | P0 blocker |
| --- | --- | --- | --- | --- | --- |
| A — Case/Assets/Rooms | Specialist Chat A | PARTIAL HANDOFF received | `5843ba14`, `5aa87974` | HOLD (Main integration incomplete) | New four-case source index not yet wired into supporting present-room props; clean plates/past landscape need designer approval |
| B — Audio/Voice/SFX/Cinematics | Specialist Chat B | OWNED ASSETS + CODE COMPLETE | 5 source-exact MP3 + 20 SFX + 17 designer MP4; CI #43693601655 | **ACCEPT in specialist scope / game media QA HOLD** | 5 voices/cinematics awaiting Main browser + actual mobile listening, caption/script approval, KES art hold, AST 472W inconsistency |
| C — Science/Puzzles | Specialist Chat C | SCOPED CODE COMPLETE | `a43ea2b` CI #85 | **ACCEPT in scope / Game HOLD** | 4 case modules implemented and scientifically audited; mounted gameplay and fresh full-case E2E are still pending |
| Main — Integration/QA | Main Chat | Media integration wired, end-to-end audit in progress | `1fe67d2`–`36538da`, plus Main visual QA additions | NOT YET RELEASED | Browser media integration run pending, all-five-case complete E2E and real-device listening, landscape Past art, content rights and final presentation still pending |

## Five-case truth / proof matrix

| Case ID | Name | Registration in UI | Confirmed interactive puzzles | Confirmed playable Rescue | Science signoff | Main acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| KES | Kestrel | yes | 8 C-coded; Investigation source index mounted | Rescue route mounted; full normal-room path NOT VERIFIED | SCOPED C ACCEPT | HOLD |
| NAD | Nadir | yes | Nadir vertical slice exists | Nadir rescue exists | PENDING INDEPENDENT AUDIT | HOLD |
| LUM | Lumen | yes | 8 C-coded; Investigation source index mounted | Rescue route mounted; full normal-room path NOT VERIFIED | SCOPED C ACCEPT; optical tolerance open | HOLD |
| ORI | Oriole | yes | 8 C-coded; Investigation source index mounted | Rescue route mounted; full normal-room path NOT VERIFIED | SCOPED C ACCEPT | HOLD |
| AST | Asterion | yes | 8 C-coded; Investigation source index mounted | Rescue route mounted; full normal-room path NOT VERIFIED | SCOPED C ACCEPT; Phase B label corrected by Main | HOLD |

**Proof requirement:** a case is PLAYABLE only if a clean save can navigate, inspect evidence, solve independent analysis, explicitly collect, move file, correctly unlock rescue, make engineering decisions, receive a case outcome and return — with no developer/debug bypass. Current case text/registry is not such proof.

## Baseline evidence (verified before sprint kickoff)

- [GitHub Visual QA run #46](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43671815584): completed SUCCESS; 44 screenshots / 0 browser-visible issues, on its checked commit. Does **not** certify later edits, actual mobile listening or completion of five cases.
- [Codex assets handoff branch](https://github.com/mahmoud-kun/the-astral-archives/tree/experiment/remaining-rooms-layered-assets-v1-2026-11-14): seven layered packs and 28 interactive items exist. Clean background plates need designer cleanup; original sources preserved.
- [Audio source documentation](../audio/AUDIO_SOURCES_AND_INTEGRATION_V1.md): 19 source cues, with device listening and final cinematic transitions still outstanding.

## Main integration log — 2026-11-15

- `dc9b01a` — `src/main.tsx`: four allowlisted Rescue workbenches; Nadir remains separate.
- `29f17d6` — `src/archive/ArchiveFolderLab.tsx`: 6/6 rescue buttons, case preference, diagnosis within Rescue, `import.meta.env.DEV` production debug gate.
- `34f4fdd` — `src/InvestigationDesignerScene.tsx`: secondary physical source index for the four cases while retaining Nadir and Mission Folders.
- `fece39b`, `5356089` — Visual QA includes new Investigation source/puzzle, all four locked rescue routes and production debug guard, with separate case-integration screenshot contact sheet.
- [Issue #2 Main coordination comment](https://github.com/mahmoud-kun/the-astral-archives/issues/2#issuecomment-6889445734): directed Chat A to connect three existing supporting room props without touching Main-owned files.
- **First integrated root QA:** [GitHub Actions Run #90](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43679019455) **SUCCESS** at SHA `5356089cec250f8440144ea11c102c03cbbcc162`; `npm run build` (including test suites, TypeScript and Vite) + browser checks + contact sheets passed. The published `docs/visual-qa/latest-report.json` shows **52 screenshots**, 0 errors/missing captures/broken images/clipped controls/overflows/browser console errors. New tests covered Investigation Case Source Index (desktop/mobile), a four-case sample puzzle, all four **locked** Rescue URLs, and the `?debug=1` production-intake guard. These are **smoke/layout/gating tests, not four complete case journeys or successful Rescue outcomes**. Asterion story metadata changed after this run (`1762e64`), so do not label the later HEAD itself fully reverified. No five-case completed journey accepted yet.

## 2026-11-15 — Chat B handoff reviewed by Main

**Independent confirmed baseline:** [Audio+Media CI run #43693601655](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43693601655) SUCCESS at its source SHA; 28/28 tests, 52 pre-integration screenshot scenarios, production build. Recursive GitHub tree confirms 5/5 original designer MP3s under `public/assets/audio/voice/`, 17/17 MP4s under `public/assets/video/`, and 20 registered SFX (11 designer, 8 Kenney CC0, 1 original completion chime). The new `game demo.mp4` in Drive is an 18th reference file, **not an approved gameplay clip**.

**Main integration now committed** to canonical working branch:
- Mounted one persistent `CinematicOverlay` at the root; fresh Start -> optional Opening, saved Continue direct -> Investigation; no automatic browser audio or evidence change.
- Added `src/integration/gameMediaActions.ts`: live read-back of 6/6 unlock on *both sides* of the portal movie, outcomes from the authoritative real Rescue state (NAD rerun or four-case signed tests), explicit no-progress visual completion. Preserves hard Asterion `case5Outcome` scientific hold (film 472 W vs verified 450 W) and Main-imposed Kestrel introduction/outcome content hold pending pre-Phase-A art review. No unapproved NASA claim.
- Bound five original voice records and the five available evidence-context movies **inside the pre-existing Nadir/Four-Case evidence analyzers**, as optional `EvidenceMediaPanel`; no auto-solving, filing, collecting, playlist/voice overlaps or substitute for source analysis. KES-07, ORI-08 still text-only and optional.
- Connected `CaseStationDesk` to physical Archive shelving, Signal telemetry console left and Recordings audio terminal, preserving Nadir's established hotspots and manual Mission Folders.
- Mounted explicit playable non-KES mission intros in case dossiers, gated portal transition from both Investigation NAD Rescue Console and all five dossier Rescue buttons, and verified-only outcome film replay actions in existing Rescue workbenches; Return/Skip never alters save.
- Established new browser QA media scenarios and contact sheet in `tools/visual-qa.mjs` and `tools/visual-contact-sheet.py`; final integrated run still must be reviewed at its exact SHA before PASS is recorded.
- A concurrent Chat A edit reintroduced a JS string apostrophe Syntax Error, now fixed narrowly on the latest shared file SHA at `36538da`; collaboration documented in [Issue #2](https://github.com/mahmoud-kun/the-astral-archives/issues/2#issuecomment-6891818060). Continue to respect active Chat A file ownership/reconcile changes.

**Acceptance still pending:** actual desktop/mobile media playback, subtitles and speaker labels, NASA/third-party footage/music rights, Kestrel visual/story fit, incorrect Asterion outcome, optional Return-to-Present/Closing, four complete other-case E2E successes/reload/cross-filing, all new Past landscape art and designer clean plates, and presentation/deployment. Historical Sound Lab/CI proof is not an integrated playable-case acceptance.

## Main Chat review checkpoints

| Gate | Required review output | Decision |
| --- | --- | --- |
| T+60 | Receive A full case+asset inventory, B actual SFX/video inventory, C scientific/case gap matrix | PENDING |
| T+150 | Review real playable scenes, audio/media integration API, scientific repair/tests | PENDING |
| T+195 (FEATURE FREEZE) | Accept/return each independent specialist handoff; integrate only approved patches | PENDING |
| T+255 | Full QA verdict: build, unit, 5-case E2E, desktop/mobile landscape, sound and cinematics | PENDING |
| T+300 | Deployment, presentation, credits, pitch, demo and known limitations | PENDING |

## Release acceptance ledger (must have evidence links/commit hashes)

- [ ] Four present rooms connected to correct media and still accessible after route changes
- [ ] All five cases audited; exactly which are playable truthfully disclosed
- [ ] Correct evidence collection, save/reload, reversible wrong filing and 6/6 rescue gates
- [ ] Rescue engineering logic and outcomes per actually playable case
- [ ] Sound effects and ambience correct, mute/volume saved, visual media/video skip works
- [ ] Landscape desktop/phone UI and real-device sampling; no clipped controls
- [ ] `npm run build` + relevant tests + final visual QA PASS at the actual **release** commit
- [ ] Source/asset licenses, simulated-vs-NASA facts and credits accurate
- [ ] Presentation (8-slide target), pitch script, live demo route and fallback prepared
- [ ] Stable release URL, backup, screenshot evidence, user visual signoff and known-issues list

## Review rule

Main evaluates a handoff as **ACCEPT**, **CHANGES REQUIRED** with reproducible failures, or **HOLD** for missing content/unsafe/untested work. Update this board **only with proven results**; preserve old SHA and evidence links. Never backfill a PASS from a CI run on a different commit or a hypothetical designer delivery.
