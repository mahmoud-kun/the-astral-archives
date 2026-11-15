# Chat C — Scientific Accuracy, Puzzles & Rescue Logic — Handoff

**Date:** 2026-11-15  
**Stream:** Scientific Accuracy, Puzzles & Rescue Logic  
**Status:** **PARTIAL / HOLD FOR MAIN REVIEW**. Nadir logic repaired and regression tests committed; other four end-to-end cases are not implemented. No release approval implied.  
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
| **KES / Kestrel** | KES-01..06 required; -07/-08 optional; original launcher warning + mass, power, cost trade + falsely reassuring Phase A summary. Reject “science was intrinsically impossible” hypothesis. | 1010 kg vs 900 kg (+110); 690 W vs 600 W (+90); $278m vs $240m (+$38m). Addendum option A yields 890 kg, 590 W, $239m but discloses reduced science return and does **not** by itself resolve launch availability. | Registry and diagnosis preview only. No case-specific hotspot analysis, architecture tile/recompute test, engineering rescue route, outcome/return. | **P0 NOT PLAYABLE** |
| **NAD / Nadir** | NAD-06 audit → NAD-05 chronology; NAD-02 conversion → NAD-01 tracks; NAD-04 producer/consumer → NAD-03 ICD. NAD-07 memory and NAD-08 glossary optional. Deliberate collect → file into NAD → 6/6 → rescue causal chain and two-vector engineering test. Reject tampering, thruster-failure and verbal closure shortcuts. | 12 lbf·s × 4.448221615 N/lbf = 53.37865938 N·s; second independent synthetic 0.8 lbf·s = 3.558577292 N·s; numeric acceptance ±0.02 N·s. | Case-specific puzzles, user-controlled replay/timeline/interface chips, manual collect, folder sorting and NAD Rescue route exist. State-machine sequence regression added. A full clean-save browser journey into completed Rescue and return is **not yet demonstrated**. | **PARTIAL / ENGINE TESTABLE** |
| **LUM / Lumen** | LUM-01..06 required; -07/-08 optional. Raw metrology vs nominal export, misconfigured fixture, compensation-masked test, raw-check waiver. Reject unsupported “inspection PASS” conclusion. | 100.8−100.0=+0.8 mm, fictional. **Formal acceptance tolerance is missing from available record contents**, as is a quantified optics response test; do not assert a numerical optical pass/fail beyond mismatch without approved criteria. | Record texts and diagnosis preview only. No metrology/calibration puzzle, independent optical test, preflight rework rescue or case outcome. | **P0 NOT PLAYABLE / P1 SCIENCE CRITERION** |
| **ORI / Oriole** | ORI-01..06 required; -07/-08 optional. 80 ms false leg pulse while radar shows 40 m and continued descent; unsafe ENGINE_OFF before contact; requirement/test omission. Reject Earth real-time joystick rescue. | 80 ms and 40 m are **fictional trace values**; addendum proposes ≥300 ms persistence plus independent sensor and altitude guard, **provisional engineering setting**, not a universal NASA flight rule. Need nominal, deployment transient, noisy-sensor and late-fault cases. | No timeline logic designer, independent-guard simulation, suite of test vectors, case Rescue, outcome/return. | **P0 NOT PLAYABLE** |
| **AST / Asterion** | AST-01..06 required; -07/-08 optional. Raw power test + model + risk register + version/access log + dissent + mode schedule; distinguish physical fault from deliberate record alteration. | Predicted 430 W, observed 520 W, cap 480 W: **40 W above cap**, 90 W above prediction. Alternate ≤460 W is only a forecast pending independently identified rerun, leaving ≥20 W target margin. | No signed review package, tested power-mode decision system, mission-specific Rescue/outcome. “Active/live” should mean current **development program approaching PDR**, not an observatory already operating in Phase E. | **P0 NOT PLAYABLE / P1 STORY PHASE** |

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

**P0 / Main + Chat A — four case rescue loops absent.** `src/gameplay/StationRoom.tsx` has only NAD hotspots; `src/main.tsx` routes only `?rescue=NAD`; `src/archive/ArchiveFolderLab.tsx` shows “Future mission: rescue execution is not yet integrated” for KES/LUM/ORI/AST. No one should convert six-file presence or folder READY status into a claim of playable Rescue. Need case-specific room hotspot puzzle interactions, simulation validators, actual rescue routes, outcomes, return and automated E2E proof. **Main owns root routing; Chat A owns station room and evidence IDs; coordinate written contracts, do not rewrite these paths from Chat C.**

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
