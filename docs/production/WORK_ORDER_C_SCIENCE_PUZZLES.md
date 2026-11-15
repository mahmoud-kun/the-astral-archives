# Work Order C — Scientific Accuracy, Puzzles and Rescue Logic

**Role:** The Astral Archives — Science & Puzzle Verification Lead  
**Authority:** [5-hour parallel sprint](PARALLEL_RELEASE_PLAN_2026-11-15.md). Read first.  
**Working branch:** `experiment/room-case-library-layout-fix-2026-11-14`; re-fetch HEAD; no new branches or merges without user consent.

## Mission
Independently verify and, within owned modules, repair the scientific, mathematical, causal and game-state logic across the **five cases**. Actual playable investigation-to-rescue functionality is the gate, not a static registry of mission cards. Provide evidence-backed severity and realistic scope for missing implementation.

## Required sources
- Real user-supplied `Cases Evidence Production Bible v2`, `The Astral Archives - Cases Game Design v1.1 Production Addendum` and relevant NASA engineering source references; identify unverified/fabricated facts.
- `docs/studio-pilot/NADIR_INVESTIGATION_VERTICAL_SLICE_V1.md`, `docs/GAMEPLAY_DESIGN_2026-11-09.md`, `EXPERIMENT.md`.
- `src/gameplay/nadirEngine.ts`, `NadirPuzzle.tsx`, `NadirRescue.tsx`, `gameSave.ts`, `src/archive/archiveState.ts`, `src/archive/evidenceRecords.ts`, tests and UI flows.
- Latest asset/case IDs from Chat A; don't silently rename or duplicate evidence.

## Exclusive write scope
- `src/gameplay/nadirEngine.ts`, `src/gameplay/NadirPuzzle.tsx`, `src/gameplay/NadirRescue.tsx`, `src/gameplay/EvidenceMachine.tsx`, `src/gameplay/gameSave.ts`, `src/archive/archiveState.ts`
- Tests accompanying the owned puzzle/engine modules.
- `docs/production/handoffs/SCIENCE_PUZZLES.md`.

**No direct changes** to `src/archive/evidenceRecords.ts` (A owns the case data), room visuals, audio, Home, `src/main.tsx` or shared routing. Send exact proposed record change + source to A, routing/implementation request to Main.

## Mandatory independent checklist
1. Inventory all 5 codes/names and separate currently playable, text-only, incomplete rescue, missing source/content. Proactively alert Main if "all five fully playable" is impossible in time without fabricating material.
2. For *every* mission, map source fact -> simulated assumption -> evidence clue -> data/units -> intended reasoning -> wrong plausible hypotheses -> validation -> manual collect -> correct folder progress -> rescue gate -> decisions/outcome. Missing stages are P0 blockers, not silently skipped.
3. Audit physics, dimensional analysis, lbf·s/N·s conversion, numerical tolerances, condition ordering, physical possibility and semantics of NASA mission development phases; cite exact references for authenticity claims. Do not add source-free numerical facts.
4. Preserve Nadir Analyzer visuals/animation and challenge depth; no trivial recall-only replacement. Test required NAD-01..06 and optional NAD-07..08, cross-room prerequisites, hints at two/four misses, accurate scientific error feedback, saving on retry/reload, no automatic collection.
5. Test incorrect filing saved silently, zero progress on wrong case, refile without penalty, 6/6 only when correctly filed, Rescue diagnosis *inside* rescue, causal evidence support, independent two-vector test and defeat of obvious shortcut answers.
6. Test edge cases: stale/corrupt localStorage, duplicate collect, wrong order, missing content, empty evidence, changing folder after unlock, route return, fullscreen-safe navigation, baseline compatibility, accessible focus/input and mobile viewport.
7. Implement the smallest safe approved repairs in owned modules with tests. For other four cases, produce immediate structured gap report; request A content/asset and Main route/feature coordination, don't claim unimplemented paths were fixed.

## Checkpoints / handoff
- **T+60:** full five-case coverage matrix and critical scientific/implementation defects to Main.
- **T+150:** repaired logic/test commits and playable case proofs where possible.
- **T+195:** final scientific handoff. Save `docs/production/handoffs/SCIENCE_PUZZLES.md` and send Main: DONE/PARTIAL/BLOCKED, exact commits/changed paths, factual citations, per-case puzzle/rescue acceptance table, test commands/results, remaining P0/P1 issues, required changes from A or Main and steps to reproduce. Nothing self-certified as final release.
