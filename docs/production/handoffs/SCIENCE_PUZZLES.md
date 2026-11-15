# Chat C — Scientific Accuracy, Puzzles & Rescue Logic — Handoff

**Date:** 2026-11-15  
**Stream:** Scientific Accuracy, Puzzles & Rescue Logic  
**Status:** **SCOPED CASE IMPLEMENTATION COMPLETE / MAIN INTEGRATION HOLD**. 32 investigations and four Rescue workbenches are coded in new modules, but not yet mounted in production room hotspots or root routing. No E2E/release approval implied.  
**Branch:** `experiment/room-case-library-layout-fix-2026-11-14` — no branch created, merge, reset or force push.  
**Main escalation:** [Issue #2](https://github.com/mahmoud-kun/the-astral-archives/issues/2) (includes cross-owner changes and production `debug=1` bypass).  
**Input authority:** [Work Order C](../WORK_ORDER_C_SCIENCE_PUZZLES.md), [Parallel Plan](../PARALLEL_RELEASE_PLAN_2026-11-15.md), [Nadir Vertical Slice](../../studio-pilot/NADIR_INVESTIGATION_VERTICAL_SLICE_V1.md).

## Authoritative content reviewed

1. [Cases Evidence Production Bible v2.docx](https://docs.google.com/document/d/1lGpnlCkWYZowYNge9Fcd14wGeZH3FdWr/edit) — user-supplied 14 Nov 2026 content registry, 40 authored records.
2. [The Astral Archives — Cases Game Design v1.1 Production Addendum.docx](https://docs.google.com/document/d/1MOD_HXwcs_LdmIiaRCrnssABdNGe7xR7/edit) — five engineering workbenches, simulated constraints, NASA-vs-fiction boundaries.
3. `src/archive/evidenceRecords.ts`, `src/archive/archiveState.ts`, `src/gameplay/nadirEngine.ts`, `NadirPuzzle.tsx`, `NadirRescue.tsx`, `EvidenceMachine.tsx`, `StationRoom.tsx`, `src/main.tsx`, current tests and `tools/visual-qa.mjs`.
4. NIST SI conversion table, NASA Systems Engineering life cycle, Mars Climate Orbiter mishap findings, Hubble mirror flaw, and Mars Polar Lander lessons (source URLs below).

**Authority resolution:** Original Bible says “six records plus diagnosis” unlock Rescue; **newer approved Nadir slice and sprint plan override it**: six correctly filed *required* records unlock Rescue, with causal diagnosis and engineering validation **inside** Rescue. No optional memory gates.

## Five-case content-to-gameplay acceptance

| Case | Authored evidence / reasoning | Simulated data and alternative | Source-level implementation and rescue | Result |
| --- | --- | --- | --- | --- |
| **KES / Kestrel** | KES-01..06 required; -07/-08 optional; original launcher warning + mass, power, cost trade + falsely reassuring Phase A summary. Reject “science was intrinsically impossible” hypothesis. | 1010 kg vs 900 kg (+110); 690 W vs 600 W (+90); $278m vs $240m (+$38m). Addendum option A yields 890 kg, 590 W, $239m but discloses reduced science return and does **not** by itself resolve launch availability. | 32-task engine includes eight KES investigations and architecture simulator; React components unmounted until Main/A wires physical hotspot and Rescue route. | **P0 NOT PLAYABLE** |
| **NAD / Nadir** | NAD-06 audit → NAD-05 chronology; NAD-02 conversion → NAD-01 tracks; NAD-04 producer/consumer → NAD-03 ICD. NAD-07 memory and NAD-08 glossary optional. Deliberate collect → file into NAD → 6/6 → rescue causal chain and two-vector engineering test. Reject tampering, thruster-failure and verbal closure shortcuts. | 12 lbf·s × 4.448221615 N/lbf = 53.37865938 N·s; second independent synthetic 0.8 lbf·s = 3.558577292 N·s; numeric acceptance ±0.02 N·s. | Case-specific puzzles, user-controlled replay/timeline/interface chips, manual collect, folder sorting and NAD Rescue route exist. State-machine sequence regression added. A full clean-save browser journey into completed Rescue and return is **not yet demonstrated**. | **PARTIAL / ENGINE TESTABLE** |
| **LUM / Lumen** | LUM-01..06 required; -07/-08 optional. Raw metrology vs nominal export, misconfigured fixture, compensation-masked test, raw-check waiver. Reject unsupported “inspection PASS” conclusion. | 100.8−100.0=+0.8 mm, fictional. **Formal acceptance tolerance is missing from available record contents**, as is a quantified optics response test; do not assert a numerical optical pass/fail beyond mismatch without approved criteria. | Eight LUM investigations, compensated/raw exhibit and preflight rework simulator implemented in unmounted components. Formal optical flight qualification remains unverified. | **P0 NOT PLAYABLE / P1 SCIENCE CRITERION** |
| **ORI / Oriole** | ORI-01..06 required; -07/-08 optional. 80 ms false leg pulse while radar shows 40 m and continued descent; unsafe ENGINE_OFF before contact; requirement/test omission. Reject Earth real-time joystick rescue. | 80 ms and 40 m are **fictional trace values**; addendum proposes ≥300 ms persistence plus independent sensor and altitude guard, **provisional engineering setting**, not a universal NASA flight rule. Need nominal, deployment transient, noisy-sensor and late-fault cases. | Eight ORI investigation tasks, state-machine exhibit, four synthetic touchdown vectors and onboard fault-handling Rescue implemented; production route/hotspots unmounted. | **P0 NOT PLAYABLE** |
| **AST / Asterion** | AST-01..06 required; -07/-08 optional. Raw power test + model + risk register + version/access log + dissent + mode schedule; distinguish physical fault from deliberate record alteration. | Predicted 430 W, observed 520 W, cap 480 W: **40 W above cap**, 90 W above prediction. Alternate ≤460 W is only a forecast pending independently identified rerun, leaving ≥20 W target margin. | Eight AST investigations, revision comparator, power duty-cycle decisions, independent synthetic rerun, risk review and conditional PDR outcome implemented; no live route. Still a Phase B development project, not an orbital observatory. | **P0 NOT PLAYABLE / P1 STORY PHASE** |

Per case, 8 authored records = **6 required + 2 optional**; 5 cases = **40**. The evidence registry is fictional training content, **not original NASA telemetry**. The source facts are educational analogues; numbers, personnel, tampering, spacecraft and outcomes are invented.

## Nadir verification and changes

1. **No automatic collection:** `solveNadir` marks analysis solved; `discoverEvidence` is a separate explicit collection action. `fileEvidence` is a separate assignment; wrong folders persist without progress; duplicate target assignments are now idempotent.
2. **Prerequisite chain:** NAD-01 is blocked until NAD-02; NAD-03 until NAD-04; NAD-05 until NAD-06. Optional NAD-07/08 never gate six required.
3. **Hints:** engine **and save restoration** now enforce zero hints before two failures, one after two, two after four. No unearned hint restored from malformed `localStorage`; solved records cannot reveal new hints.
4. **Diagnosis:** a persisted/reconstructed diagnosis is not VERIFIED unless **all six** required evidence records remain correctly filed, even if the moved record is not one of the cited three. Correct supported citations and explicit submission remain mandatory.
5. **Rescue completion:** Nadir's accepted UI, CSS, animation and analyzer depth unchanged. Completion now requires submitted and passed engineering rerun plus still-unlocked and supported diagnosis. Inputs test canonical N·s, single conversion owner, consumer-side verification and both independent test vectors.
6. **Saved state:** `restoreNadir` and `restoreArchiveState` retain valid v1 progress; invalid IDs and invalid/unearned hints are rejected. No save deletion or migration reset.
7. **No premature full-browser certification:** unit tests exercise the state journey; the current Chromium visual QA covers selected views and an NAD-02 collect/file path, not all six puzzles, a complete Rescue completion and return.

### Commits and modified paths

- [7f01b3c](https://github.com/mahmoud-kun/the-astral-archives/commit/7f01b3c98fcf10a14c85bb278fc643e83d7f2786) — engine/save-science corrections and tests:
  - `src/gameplay/nadirEngine.ts`
  - `src/gameplay/NadirRescue.tsx`
  - `src/archive/archiveState.ts`
  - `src/gameplay/nadirEngine.test.mjs`
  - `src/archive/archiveState.test.mjs`
- [4a7dbe3](https://github.com/mahmoud-kun/the-astral-archives/commit/4a7dbe399e72a45e293058ef6947cb3d85a24276) — update legacy test fixture to reject unearned hints.
- [2a3f3e9](https://github.com/mahmoud-kun/the-astral-archives/commit/2a3f3e9e31ec304de3ebc9875f2a5dbc179fec4d) — new coherent six-record analyze→collect→wrong-file→refile→save/reload→diagnose→engineering vectors→relock/regain test in `src/gameplay/nadirAcceptance.test.mjs`.
- Handoff document (this path) is an independent documentation-only commit.

### Test execution evidence

- Actual GitHub Actions runs on the shared branch execute `npm run build`, which runs `npm run test:studio`, then TypeScript build and Vite bundle, then desktop/mobile Chromium visual tests when compilation passes.
- [Run #43673780381](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43673780381) **FAILED** at `test:nadir` 13/14, due to one legacy assertion expecting two unearned hints on restore. The assertion was corrected in commit `4a7dbe3` rather than weakening the new invariant.
- [Run #43673995391](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43673995391) on state-journey commit `2a3f3e9` — **CANCELLED** by a concurrent newer push, no final QA result.
- [Run #43674140140](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674140140) at `13e19b4` (includes all three Chat C code commits) — **43/43 unit tests PASS** across 8 test suites: investigation 3, fixed room 4, rescue 6, archive 6, navigation 3, layers 3, Nadir 15, audio 3. TypeScript and Vite build **PASS**. Its Chromium visual QA was **CANCELLED** after a subsequent concurrent branch push, so the full run did not pass.
- [Run #43674281572](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674281572) on further audio/media changes was **IN PROGRESS** at this documentation update. Main must review latest HEAD and the final uncancelled full run, not reuse old screenshots as proof.
- New physical-device QA, complete Nadir browser E2E, all-four remaining case rescues, 1366×768 / 915×412 per-case screenshot captures and actual designer media playback: **NOT VERIFIED by Chat C**.

### Concurrent audio/media CI note (2026-11-15)

- [Run #43674281572](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43674281572), commit `66730eadb`: **47/47 unit tests PASS, TypeScript BUILD FAIL** with `TS2345` at `src/media/CinematicOverlay.tsx:116` due to narrow inferred `duration` literal union. Chromium visual QA not executed on that run.
- Chat B concurrently committed [6cb2a8a](https://github.com/mahmoud-kun/the-astral-archives/commit/6cb2a8a898b022dfb54c8dfe93377c9e991c8e53), making the duration state `useState<number>(clip.duration)`. Verified source is present on shared branch, **but succeeding full CI/visual QA had not yet been verified at this checkpoint**.
- This correction was performed by the media owner, not Chat C. Keep science/test status separated from unrelated media integration compilation status and require Main to check the final release head.

## Blockers, exact requests, and reproduction

**P0 / Main + Chat A — four case modules CODED BUT NOT CONNECTED TO THE RUNNING GAME.** `src/gameplay/StationRoom.tsx` has only NAD hotspots; `src/main.tsx` routes only `?rescue=NAD`; `src/archive/ArchiveFolderLab.tsx` shows “Future mission: rescue execution is not yet integrated” for KES/LUM/ORI/AST. No one should convert six-file presence or folder READY status into a claim of playable Rescue. Need case-specific room hotspot puzzle interactions, simulation validators, actual rescue routes, outcomes, return and automated E2E proof. **Main owns root routing; Chat A owns station room and evidence IDs; coordinate written contracts, do not rewrite these paths from Chat C.**

**P0 / Main + ArchiveFolderLab owner — production debug shortcut.** Open `/?folder-lab=1&return=investigation&debug=1` on a production build; `debug` currently depends on user-controlled URL parameter alone. Unseen records are exposed, and their viewer can directly `discoverEvidence` before an analyzer is solved. Repeat NAD-01..06 and file into NAD to bypass the designed six investigations and enter rescue. Proposed minimal patch in non-owned `src/archive/ArchiveFolderLab.tsx`: `const debug = import.meta.env.DEV && locationParam.get('debug') === '1'`, plus production smoke-test. Link: [Issue #2](https://github.com/mahmoud-kun/the-astral-archives/issues/2).

**P1 / Chat A evidenceRecords owner:** Change outdated `NAD-06.inspectAction` wording `Demand rerun attachment before rescue gate` to e.g. `Identify absent rerun proof; engineering verification is performed inside Rescue` (approved 6/6-only unlock). Keep evidence ID unchanged. Also supply explicit fictional Lumen acceptance tolerance or nonnumeric test criterion with independent optical-response evidence before final signoff. No source-free numbers.

**P1 / Main story text + Chat A meta:** `src/investigationCases.ts` calls Asterion an “active observatory mission” while design says approaching preliminary design review. Specify `an active observatory project in development, approaching PDR`, clarify `AST` phase `PHASE B / CROSS-PHASE REVIEW` rather than implying on-orbit Phase E.

**P1 / Main UI:** Non-NAD cases currently offer `OPEN DIAGNOSIS PREVIEW` in folder lab before an actual Rescue workstation, conflicting with the newer in-Rescue diagnosis contract. Keep it explicitly labeled developmental and disabled in production until a playable rescue is wired.

**P1 / content and engineering:** KES option A science-return and launcher-window acceptance; LUM tolerances and optical remeasurement; ORI false-positive AND false-negative scenarios, autonomous guard and no Earth instant override; AST waveform/config/rerun ID, actual verified ≤cap and separate provenance accusation require complete validated simulations. Do not fabricate findings, numerical tolerances, or NASA attribution to fill gaps.

## How Main can independently reproduce the verified Nadir state sequence

From a **new** normal save (back up any existing save first), inspect NAD-06 in Investigation; resolve missing closure proof. In Recordings, solve NAD-05 timeline after NAD-06. In Signal, solve NAD-02 using lbf·s → N·s and `53.37865938`, run baseline/corrected NAD-01 tracks. In Archive, trace NAD-04 exporter/parser mismatch then patch NAD-03 ICD to N·s with producer-owned conversion and automated test. For each: click **COLLECT EVIDENCE** explicitly and then from Quick Tray open physical Mission Folders to file it in **NAD**. At 5/6 ensure Rescue locked; 6/6 unlocks. In Rescue cite NAD-02 (technical), NAD-06 (process) and NAD-01 (consequence), choose proper engineering owner/guard and two independent numeric results `53.37865938` and `3.558577292`. Verify failure on wrong second vector. Refile an uncited required record to another folder; confirm Rescue relocks, then refile back without penalty. Repeat after reload. These are **manual acceptance instructions**, not a claim the whole route was already browser-tested.

## Scientific references and guardrails

- [NIST SP 811 — SI conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9): 1 lbf = 4.4482216152605 N (exact defined factor; game truncates at 4.448221615).
- [NASA Mars Climate Orbiter mishap, Phase II report](https://discovery.larc.nasa.gov/discovery/PDF_FILES/mars_climate_orbiter_phaseII.pdf): real AMD file **was required by the SIS to be metric** but English units were supplied. The game's **blank fictional ICD is not historical MCO documentation**.
- [NASA SE Handbook 3.0 — project life cycle](https://www.nasa.gov/reference/3-0-nasa-program-project-life-cycle/): Phase A concepts, B preliminary design, C fabrication, D integration/test/launch, E operations, F closeout.
- [NASA Hubble mirror flaw](https://science.nasa.gov/mission/hubble/observatory/design/optics/hubbles-mirror-flaw/): actual null-corrector lens-spacing error **1.3 mm**; game's **0.8 mm** belongs exclusively to fictional Lumen.
- [NASA JPL Lessons Learned: probable Mars Polar Lander loss](https://llis.nasa.gov/lesson/938): spurious leg-deployment touchdown signals and incomplete transient immunity testing; actual failure **probable, not definitively observed in transmitted flight telemetry**. Oriole's full trace and 80 ms test values are fiction.
- [NASA Systems Engineering — Verification and Validation](https://www.nasa.gov/reference/system-engineering-handbook-appendix/): formal test evidence and its acceptance criteria must be traceable. Administrative stamps cannot substitute for verified engineering measurements.

**Overall scientific verdict:** Nadir's numerical conversion and intended root-cause reasoning are supported as a fictional teaching simulation; scoped engine invariants have been strengthened. The other four cases are **not playable end-to-end** and lack executable, independently validated rescue simulations. **Main must keep release on HOLD** until missing content, production debug bypass and final E2E/CI acceptance are resolved.

---

## 15 Nov 2026 — user-authorized gameplay/copy expansion

**Scope:** User requested that all case and evidence content be **re-authored as gameplay**, not copied from the source Bible. Chat C added these modules under previously unowned src/gameplay paths; did not overwrite Chat A's evidence registry, room renderer, Chat B's media, Main's root router, or Nadir's approved visuals.

### Committed implementation inventory

- caseEvidenceEngine.ts: **32 rewritten source-specific evidence investigations** across KES/LUM/ORI/AST. Every ID has an observation hook, selective source fragments, one-to-three tests (numbers, correlated evidence and plausible alternative hypotheses), optional vs required status, earned hints, a short reveal, and source-room match. Required dependent chains enforce earlier evidence. Raw evidence is retained in evidenceRecords.ts for archival review only.
- CaseEvidenceExhibit.tsx: source-diff document comparator, written timestamp/transcript toggles, simulated compensated/uncompensated optics, autonomous landing-state diagrams, launcher-calendar cards, science priority tiles and schematic engineering readouts. No invented authentic recordings or NASA telemetry.
- CasePuzzle.tsx: source-first full-screen visual analysis with actual primary-record opening required before submitting, optional correlated prerequisites, correct/incorrect reasoning feedback, keyboard focus handling, a deliberate separate COLLECT action and no automatic filing.
- CaseStationDesk.tsx: case-aware source terminal, filtered to evidence physically located in the chosen existing station room. It is **an overlay on equipment, not a fifth room**, and remains unmounted until Chat A/Main attaches hotspots.
- caseRescueEngine.ts, CaseRescue.tsx, CaseRescueControl.tsx, CaseInstrument.tsx: four independent engineering Rescue simulators. A correctly filed 6/6 unlocks the Rescue **screen**; three source-cited cause/process/consequence claims and a repeatable engineering test take place **inside** Rescue before the review decision. Wrong engineering settings fail individual tests, not a single answer badge. Components are currently **not routed**.
- caseSave.ts and caseWork.css: separate persisted state key astral-other-cases-investigation-v1, responsive visual-first instruments, keyboard/touch support. Restored progress prunes impossible prerequisite chains, unknown IDs and unearned hints.
- otherCaseAcceptance.test.mjs: registry, science, source consistency, wrong-answer, hints, save, full case state, Rescue multi-vector and refile/relock tests. Imported from the already-owned nadirAcceptance.test.mjs to use the existing test:nadir CI command. No package/workflow edits.

### Evidence-to-action storyboards

| Case | What player does — not a text dump | Science/Rescue decision |
| --- | --- | --- |
| Kestrel | Inspects primary-vs-secondary science tiles; flips an unavailable launcher calendar; computes mass +110 kg, power +90 W, cost +$38m; contrasts earlier analyst transcript with later stamped memo. | Physically selects instrument de-scope card (890 kg/590 W/$239m), tests a fictional replanned slot and cruise study, discloses lost secondary science, proposes **conditional** approval. Source-free real launcher availability is NOT assumed. |
| Lumen | Compares 100.0 mm drawing against 100.8 mm raw metrology (+0.8 mm), inherited CAL-2 configuration and falsely nominal export; toggles optical alignment compensation to reveal the masked problem. | Adjusts an interactive 0.1 mm fixture micrometer, corrects as-built reporting, commissions calibrated independent preflight remeasurement and unmasked test; **rework/hold formal optical certification** because no source-defined flight tolerance is provided. |
| Oriole | Reads 80 ms contact pulse at 40 m while radar still descends; examines automated ENGINE_OFF, one-bit requirement, deferred TEST-214 and delayed ground communications. | Tunes a **provisional fictional 300–450 ms** debounce, adds independent contact/radar guard and bounded onboard recheck; reruns nominal 450 ms, leg-deploy 80 ms, noisy 140 ms and late sensor-fault scenarios. Not a real-time Earth joystick or certified NASA threshold. |
| Asterion | Reconciles 430 W predicted / 520 W observed / 480 W cap, contrasts signed revision history and erased trace pointer, investigates earlier dissent and simultaneous high-draw modes. | Selects staggered duty, reruns **fictional 450 W** mode with independently signed test context, reopens unsupported CLOSED risk, preserves version provenance and reduced science duty; conditional **Phase B PDR** gate. Reviewer record alteration is not the cause of all hardware faults. |

Six required and two optional records remain for each mission. Optional memories and reference fragments never claim independently verified speaker identity, never establish guilt and never gate the Rescue screen. Historical NASA events are **inspiration**, all case assets/numbers are explicitly **FICTIONAL_SIMULATION**. Outcomes are counterfactual/alternate training branches, not rewritten real history.

### Concrete integration contract for Main / A (not done by Chat C)

1. **Chat A, StationRoom.tsx:** Keep all eight Nadir evidence-to-hotspot assignments and the approved source artwork. Attach the new CaseStationDesk overlay to an existing *supporting* physical object: Signal telemetry_console_left, Recordings audio_analysis_terminal, Archive archive_shelving. Archive shelving must **retain** its current Mission Folders button alongside a new OPEN CASE SOURCE INDEX action. Use station={station} and an explicit onClose callback. Do not create extra floating hotspots or turn case files into a wall of text.
2. **Main, Investigation physical scene:** Attach CaseStationDesk with station="investigation" on the existing mission-files/case-files terminal, preserving Nadir NAD-06 and all established scene actions.
3. **Main, src/main.tsx:** Whitelist only KES/LUM/ORI/AST for the new lazy-loaded CaseRescue component with key=caseId; keep NAD on NadirRescue. Reuse same-document navigateGame route, with query values rescue=KES / LUM / ORI / AST.
4. **Main, ArchiveFolderLab.tsx:** Replace the non-NAD "Future mission" message with ENTER [CASE] RESCUE when its folder is truly 6/6. Move three-link non-NAD diagnosis from premature folder preview to **inside** CaseRescue. Preserve silent wrong filing, unlimited refile, optional exclusion. **P0 debug shortcut** remains: production debug=1 URL must be gated by import.meta.env.DEV and smoke-tested. Do not award progress from unseen documents.
5. **Chat A, evidenceRecords.ts and narrative metadata:** Preserve original 40 stable IDs, provenance and detailed source texts as archival artifacts, but use CASE_EVIDENCE_TASKS scene/fragments/objective for the *front-line interaction*. Change misleading NAD-06 inspectAction "rerun before rescue gate" to "missing proof identified; rerun inside Rescue." Correct Asterion "active observatory" to current development project approaching PDR. Keep Lumen formal tolerance explicitly open until approved.
6. **Main independent QA:** Fresh-save user journey for each of KES/LUM/ORI/AST: physical room entry, primary fragment actually opened, six correct evidence analysis outcomes, manual COLLECT, one wrong folder (zero progress + no revealing feedback), reversible refiling, 6/6 Rescue unlock, three evidence-cited causal nodes **inside Rescue**, at least one engineering fail and corrected rerun, signed conditional outcome, save/reload, moving an uncited required file away to relock. Check desktop 1366×768 and mobile landscape 915×412, 800×360 and 740×360, keyboard Tab/Escape and orientation guard. New-component screenshot proof REQUIRED; the existing baseline Visual QA does not see these modules.

### Verification and current limits

- [GitHub Actions SUCCESS, run 43676665105](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43676665105), commit e0a26813: **59/59 tests PASS**, TypeScript/Vite Build PASS, 44 original route Chromium screenshots, all zero logged broken images/clipping/overflow/console errors. This run **does not** certify new case UI screenshots because those components were not mounted.
- Later separate commits add source-open gate, corrupt-save prerequisite pruning + regression, dynamic case-route reset and accessible focus within case source terminal. Require a fresh uncancelled CI after these changes. Existing Nadir, Room and Audio flows were not modified by this expansion.
- Still blocked: new modules not called by A's hotspot mappings or Main's root router; production debug=1 shortcut outside this stream; user-art review, full fresh-save five-case browser QA, physical-device playback; Lumen formal optical acceptance tolerance remains unknown. No final release acceptance or merge by Chat C.


### Latest complete verification after all Chat C code changes

- [GitHub Actions **SUCCESS** #43677155809](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43677155809) on **49e2d156**, after source-first evidence gate, save-chain repair, case-route reset, keyboard focus, control styling and additional test.
- **60/60 automated tests PASS**, across 8 suites: investigation 3, fixed-room 4, legacy rescue 6, archive 6, navigation 3, layers 3, **Nadir and four-case science 22**, audio 13. **TypeScript/Vite production build PASS**.
- **44/44 Chromium screenshots PASS** for the existing approved routes, with zero broken images, UI clipping, overflow or browser console errors **on those routes**. **New KES/LUM/ORI/AST CaseStationDesk, CasePuzzle and CaseRescue are unmounted, so their rendered UX is NOT visually tested by the 44 screenshots**.
- No subsequent Chat C gameplay-code change was made after commit 49e2d156 before this documentation checkpoint; the documentation-only updates do not alter the tested application bundle. Main/A route/hotspot integration will require a separate full run and fresh new-screen E2E.


### Cross-chat cinematic/evidence accuracy guardrails — Chat B / designer

These are **content handoff instructions, not claims that a video or audio clip was produced, connected, or approved**. Chat B's four verified videos are still separately tracked in its own official handoff and asset ledger. Never silently match a filename called "case1" to a case ID without Main/designer approval.

- **NAD-05 / two-team unit-conflict scene:** Two *fictional engineers* with visibly different backgrounds may discuss an interface between their teams. Engineer A: “The export says twelve pound-force seconds.” Engineer B: “The navigation parser treated that twelve as newton-seconds.” Engineer A: “Then we need a units cross-check and a rerun before closure.” The character contrast should illustrate two professional interface conventions, **not suggest that a person's nationality inherently causes a unit error**. Do **not** show the computed 53.37865938 N·s value before the player solves NAD-02, a NASA seal, invented real historical dates/names/email addresses, or a closed ticket inside the earlier open-anomaly email. NAD-06 independently supplies the closure evidence. This is a proposed micro-script awaiting designer/media owner approval.
- **KES-05:** Present a dated-before-approval engineering warning about unavailable launch slot and changed cruise requirements. Avoid a heroic “we can launch immediately anyway” conclusion; an alternative window needs a recorded new vehicle allocation and trajectory study.
- **LUM-07:** Treat technician memory as a subjective fragment; let a later raw-vs-export visual resolve the discrepancy. Do not label the fictional +0.8 mm training value as Hubble's real fabrication setup error or display real Hubble optical imagery as Lumen's output.
- **ORI-07:** Ground hears buffered/desynchronized descent data **after** onboard terminal sequence, never pilots the lander with instant real-time controls. The 80 ms / 40 m trace is a clearly fictional reconstruction, not recovered NASA Mars Polar Lander telemetry.
- **AST-05/07:** Dissent and the post-review revision supply the character/provenance twist. Asterion is a **current development program approaching PDR**, not an operational telescope in orbit. The reviewer can be tied to altered records, not blamed for the physical causes of all archived engineering failures.
- **Audio semantics:** Correct vs incorrect Mission Folder placement must have the exact same folder SFX and no correctness-revealing voice line. Failed engineer simulations may use an error cue *inside* the workbench. Optional memories never provide conclusive identification or a hidden mandatory clue.

**Updated room-selection UX:** the selected KES/LUM/ORI/AST case now persists across room terminals with a separate, presentation-only localStorage key astral-active-mission-v1; explicit Main-provided initialCase overrides it. An empty current-room source index tells the player which actual physical rooms contain that case's authored records. This change needs final latest-code CI and new mounted browser QA.

