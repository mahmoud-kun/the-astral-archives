# The Astral Archives — Main Chat Integration & Release Board

**Date:** 2026-11-15 | **Sprint budget:** T+0 to T+300 (clock begins at real kickoff only)  
**Governance:** [Parallel release plan](PARALLEL_RELEASE_PLAN_2026-11-15.md) | **Current accepted gameplay branch:** `experiment/room-case-library-layout-fix-2026-11-14`.

> This document is a **live acceptance log to be updated by Main Chat**, not a list of already completed deliverables. A specialist's claim of done means *awaiting* independent Main acceptance.

## Owner handoff registry

| Stream | Owner | Start | Last handoff commit | Main verdict | P0 blocker |
| --- | --- | --- | --- | --- | --- |
| A — Case/Assets/Rooms | Specialist Chat A | **FINAL HANDOFF ACCEPTED IN SCOPE** | `14beba8` code/art + `b466e717` docs; [CI #150](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43699268899) | **ACCEPT asset/route integration; public release HOLD** | Physical Android touch, designer signoff and cleanup of unused public legacy NASA-mark image; broken clean plates/masks excluded, NOT required |
| B — Audio/Voice/SFX/Cinematics | Specialist Chat B | OWNED ASSETS + CODE COMPLETE | 5 source-exact MP3 + 20 SFX + 17 designer MP4; CI #43693601655 | **ACCEPT in specialist scope / game media QA HOLD** | 5 voices/cinematics awaiting Main browser + actual mobile listening, caption/script approval, KES art hold, AST 472W inconsistency |
| C — Science/Puzzles | Specialist Chat C | CODE COMPLETE + NORMAL UI END-TO-END | `a43ea2b` + [CI #145](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43697949431) | **ACCEPT 4/4 integrated case paths / release HOLD** | Four Cases playable via original physical UI with no debug; Nadir fifth E2E and actual mobile/device approval outstanding |
| Main — Integration/QA | Main Chat | ALL FIVE browser gameplay paths PASS, 69 media screen PASS | [CI #147](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43698641507) | **5/5 PLAYABILITY PASS / RELEASE STILL HOLD** | Device listening/touch, art sign-off, KES/AST footage mismatches, rights, up-to-date deployment and pitch still pending |

## Five-case truth / proof matrix

| Case ID | Name | Registration in UI | Confirmed interactive puzzles | Confirmed playable Rescue | Science signoff | Main acceptance |
| --- | --- | --- | --- | --- | --- | --- |
| KES | Kestrel | yes | 6 required analyzed/collected through real Archive/Recordings/Investigation UI | 6/6 → Past → diagnosis → engineering sign → reload **PASS** CI #145 | SCOPED C ACCEPT | ENGINEERING PASS / KES INTRO & OUTCOME ART HOLD |
| NAD | Nadir | yes | 6 distinct physical Nadir puzzles incl. NAV-042, timeline, two-run trajectory, interface chips | 6/6 → Past → causal review → two independent unit vectors → verified outcome film → reload **PASS CI #147** | SCIENCE ACCEPT | GAMEPLAY PASS / DEVICE HOLD |
| LUM | Lumen | yes | 6 required analyzed/collected through real UI | 6/6 → Past → diagnosis → engineering sign → outcome film → reload **PASS** CI #145 | SCOPED C ACCEPT; no invented flight tolerance | GAMEPLAY PASS / DEVICE HOLD |
| ORI | Oriole | yes | 6 required analyzed/collected through real UI | 6/6 → Past → diagnosis → sensor filter → engineering sign → outcome film → reload **PASS** CI #145 | SCOPED C ACCEPT | GAMEPLAY PASS / DEVICE HOLD |
| AST | Asterion | yes | 6 required analyzed/collected through real UI | 6/6 → Past → diagnosis → power replay → signed success → reload **PASS** CI #145 | SCOPED C ACCEPT; current Phase B | GAMEPLAY PASS / 472 W VIDEO CONTENT HOLD |

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

**Acceptance still pending:** subjective audio audition and real mobile touch on Android/desktop, captions/speakers, NASA/third-party rights, Kestrel visual/story alignment, incorrect Asterion 472 W outcome, optional Return-to-Present/Closing, artist-approved Past/clean plates, presentation and up-to-date Vercel preview. **All five actual case UIs now PASS on branded Chrome**, independently of unverified artistic/release sign-off. A subsequent Escape/overlay edge-case fix remains subject to its own fresh CI.

## Verified release evidence — full four-case browser acceptance

- [Chrome 69-scenario integrated media QA #144](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43697185560) SUCCESS, 69 screenshots, 0 console errors/missing captures/broken images/clipping/overflow, H.264 opening decoded in branded Chrome; source tests and Vite build PASS.
- [No-debug gameplay QA #145](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43697949431) SUCCESS; [exact machine report](../../visual-qa/four-case-e2e-report.json). **KES, LUM, ORI, AST each PASS** complete browser journey: physical-source inspections in canonical rooms → authentic six analyzed → six explicit user collect → wrong folder and correction → 6/6 persisted over reload → portal video → four-stage Past Timeline → evidence-cited causal diagnosis → specialized verified engineering simulation → signed rescue → reload. LUM/ORI approved outcome videos also tested. **Not a bypass using pre-seeded localStorage or debug flags.**
- [Fifth-case Nadir browser acceptance #147](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43698641507) **SUCCESS** at source SHA `0ed40b01c0bed3affcca344e3bf2077669a11e57`; [exact Nadir E2E report](../../visual-qa/nadir-e2e-report.json) status PASS. Six physical puzzles include NAV-042 ticket, manual causal timeline, two-run trajectory replay, producer/parser chips; then wrong filing/correction, 6/6, portal, gated Past, diagnosis, two independent unit-check engineering reruns, save/reload and approved Nadir result movie. **No debug or injected save state.** Screenshot QA in the same run: 69/69 screenshots, 0 errors/console/broken/clipping/overflows.
- **DO NOT merge to historical `main` or claim deployed release yet.** Vercel last checked READY deployment targets an older SHA, not this accepted integration. Full content/audio/art/release acceptance remains gated.

## Verified deployment preview / five-case regression (2026-11-15)

- [GitHub Actions #150](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43699268899) **SUCCESS** at source SHA `14beba8fca90235986f09f3047b3c25c6761a13a`; Chrome screenshot report now **71/71 scenarios, 0 browser/page errors, 0 broken images, 0 clipping, 0 overflows, 0 console faults**. Both mandatory [four-case](../../visual-qa/four-case-e2e-report.json) and [Nadir](../../visual-qa/nadir-e2e-report.json) physical GUI E2E checks passed in the same run, no `debug=1`.
- Vercel **Preview READY** deployment `dpl_Fw96PzmM4GzKen2dxdHsK9DwsPx1`, exact source SHA `14beba8f`, URL: https://astral-archives-ixu0h5ll8-mahmooud-kun.vercel.app . Framework Vite; explicit preview deployment, **NOT** production/main promotion. Vercel API confirmed READY; public anonymous browser access and every streamed video range request have **not** been independently validated from an external device. A web inspection attempt could not reach the preview URL, which may reflect deployment protection or web-tool access.
- Chat A's Mission Target `static-v2` 1920×1080 art replaces the earlier generated NASA logo with neutral geometric mark and is in tested runtime. Static first-person Past stage and touch/mask interactions are sampled in automated browser emulation; full visual/rights/user approval still separate. The erroneous clean plate candidates in Draft PR #7 remain **excluded and unmerged**.
- `src/gameplay/StationRoom.tsx` prevents Escape on a cinematic from dismissing its underlying evidence inspector; QA now checks Escape playback return. Run #150 includes this fix.
- **Release HOLD remains:** real mobile hardware playback/touch/audio mixing, exact VO captions/speaker labels, content/rights/endorsement checklist, Kestrel Phase-A footage mismatch, Asterion 472 W outcome vs 450 W accepted rescue, designer visual sign-off, pitch/demo/closing assets as approved. Do not treat READY preview as final release approval.

## Main verdict on Chat A final handoff — 2026-11-15

**ACCEPT specialist scope (not full release).** Independently read [final Chat A report](handoffs/CASES_ASSETS_FINAL_2026-11-15.md) and checked source SHA `14beba8fca90235986f09f3047b3c25c6761a13a`, [CI #150](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43699268899) SUCCESS, 71/71 screenshots with 0 errors and **5/5 no-debug full case E2E PASS**. Live Past scenes use corrected `mission_target/static-v2`, neutral fictional emblem, four rooms and fifteen hotspots. No clean-v2 / broken masks are in runtime; Draft PR #7 must remain unmerged.

**Residuals:** (1) genuine Android touch and speaker/headphone audition, (2) independent designer art approval, (3) old unused `public/assets/rooms/past/mission_target/layers/static-v1/room_visible.webp` contains obsolete generated NASA logo and remains copyable in public build, so remove from deploy bundle or relocate to non-public provenance before public promotion, (4) content/media final gates are separate: KES Phase-A clip mismatch, AST 472 W vs verified 450 W, VO captions/speakers and footage rights, (5) final eight-slide presentation, pitch, demo walkthrough and release checklist are not delivered as final artifacts. Do not treat code acceptance as final public release acceptance.

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
