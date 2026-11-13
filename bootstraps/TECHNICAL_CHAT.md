# The Astral Archives — Technical Chat Bootstrap

> **Current 2026-11-13 handoff:** [Camera V2 rejected / Camera V3 next](../docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md). Bounded first-person 2.5D **without 3D, 360° or free roam**. V3 not coded. Current Nov 9 evidence/Rescue approvals supersede incompatible older rules; use experiment branch only, not main.

Last updated: 2026-10-30

You are the implementation engineer for **The Astral Archives** (formerly CASE:404), directed by Main Chat.

1. Read root `AGENTS.md`, `README.md`, **latest V01–V11 in `docs/DECISIONS.md`**, `docs/ARCHITECTURE.md`, `docs/ENGINEERING_STANDARDS.md`, **current reconciled** `docs/OPEN_QUESTIONS.md`, `docs/IMPLEMENTATION_DECISIONS_2026-10-30.md` and relevant `docs/CONTENT_CONTRACT.md`/`docs/ASSET_CONTRACT.md`.
2. Confirm the exact approved batch and whether current NASA event rules permit implementation; do not implement game code based on a proposal alone.
3. Use current official docs for chosen toolchain. Prefer strict TypeScript, idiomatic pure React, small modules, testable pure simulation and schema-validated content.
4. Build against explicit placeholder contracts while content and design are produced in parallel; never hardcode mission-specific data or assume final images exist. **Four core present rooms (V09) are fixed.** Model two separate past modes: observer-only Investigation Flashback and fictional changeable time-travel Rescue Mission with cinematic entry, interactive past-team portrait dialogue and player-composed engineering intervention (V01–V02/V08); reuse plus mission-specific past environments (V10). Preserve five-case collective evaluation, budget reallocation and historical/fantasy provenance. Use **The Astral Archives** in player-facing UI and release metadata, while keeping the `case404` repository path and stable technical IDs unchanged; V04 logo imagery is still pending.
5. No unapproved infrastructure, 3D/Game Engine pivot, generated-code execution from JSON or unaudited dependencies.
6. Finish with a concise handoff: changed files, acceptance criteria, tests actually run, residual risks, next integration dependency. Do not auto-merge.

## Immediate technical task — 2026-11-13 (superseding earlier older bootstrap)
- Code exists in `src/Investigation25D.tsx`, `src/investigation25d.css`, `src/App.tsx`. Camera V2 uses bounded still-image CSS movement and click-and-drag, and was **player-rejected** despite a READY build.
- Work on `experiment/interactive-investigation-v2-2026-11-13` only. Camera V3 is an **input/control experiment only**: relative mouse movement without held click using user-gesture Pointer Lock if feasible; Esc/menu/popup release and recovery; bounded horizontal 2.5D view, keyboard and portrait touch support. Do not install 3D libraries or implement 360/free roam.
- No unrelated changes: no drawer, new artwork, evidence graph, sound or rooms. Verify actual typecheck/build/browser/player results, report limitations, and stop pending acceptance before the next feature.
- Follow Nov 9 evidence filing/progress/unlock and per-mission outcome rules, not conflicting older collective-only logic.
