# The Astral Archives — Main Chat Integration & Release Board

**Date:** 2026-11-15 | **Sprint budget:** T+0 to T+300 (clock begins at real kickoff only)  
**Governance:** [Parallel release plan](PARALLEL_RELEASE_PLAN_2026-11-15.md) | **Current accepted gameplay branch:** `experiment/room-case-library-layout-fix-2026-11-14`.

> This document is a **live acceptance log to be updated by Main Chat**, not a list of already completed deliverables. A specialist's claim of done means *awaiting* independent Main acceptance.

## Owner handoff registry

| Stream | Owner | Start | Last handoff commit | Main verdict | P0 blocker |
| --- | --- | --- | --- | --- | --- |
| A — Case/Assets/Rooms | Specialist Chat A | NOT STARTED / unreported | — | PENDING | Layer clean plates and four past-landscape scenes need designer signoff |
| B — Audio/Cinematics | Specialist Chat B | NOT STARTED / unreported | — | PENDING | Actual designer video inventory and device audition unverified |
| C — Science/Puzzles | Specialist Chat C | NOT STARTED / unreported | — | PENDING | Four non-Nadir cases' real puzzle-to-rescue loops unconfirmed |
| Main — Integration/QA | Main Chat | Docs initialized | — | NOT YET RELEASED | Final integration, full QA, presentation and demo outstanding |

## Five-case truth / proof matrix

| Case ID | Name | Registration in UI | Confirmed interactive puzzles | Confirmed playable Rescue | Science signoff | Main acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| KES | Kestrel | yes | NOT VERIFIED | NOT VERIFIED | PENDING | HOLD |
| NAD | Nadir | yes | Nadir vertical slice exists | Nadir rescue exists | PENDING INDEPENDENT AUDIT | HOLD |
| LUM | Lumen | yes | NOT VERIFIED | NOT VERIFIED | PENDING | HOLD |
| ORI | Oriole | yes | NOT VERIFIED | NOT VERIFIED | PENDING | HOLD |
| AST | Asterion | yes | NOT VERIFIED | NOT VERIFIED | PENDING | HOLD |

**Proof requirement:** a case is PLAYABLE only if a clean save can navigate, inspect evidence, solve independent analysis, explicitly collect, move file, correctly unlock rescue, make engineering decisions, receive a case outcome and return — with no developer/debug bypass. Current case text/registry is not such proof.

## Baseline evidence (verified before sprint kickoff)

- [GitHub Visual QA run #46](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43671815584): completed SUCCESS; 44 screenshots / 0 browser-visible issues, on its checked commit. Does **not** certify later edits, actual mobile listening or completion of five cases.
- [Codex assets handoff branch](https://github.com/mahmoud-kun/the-astral-archives/tree/experiment/remaining-rooms-layered-assets-v1-2026-11-14): seven layered packs and 28 interactive items exist. Clean background plates need designer cleanup; original sources preserved.
- [Audio source documentation](../audio/AUDIO_SOURCES_AND_INTEGRATION_V1.md): 19 source cues, with device listening and final cinematic transitions still outstanding.

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
