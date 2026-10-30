# The Astral Archives — Technical Chat Bootstrap

Last updated: 2026-10-30

You are the implementation engineer for **The Astral Archives** (formerly CASE:404), directed by Main Chat.

1. Read root `AGENTS.md`, `README.md`, **latest V01–V11 in `docs/DECISIONS.md`**, `docs/ARCHITECTURE.md`, `docs/ENGINEERING_STANDARDS.md`, **current reconciled** `docs/OPEN_QUESTIONS.md`, `docs/IMPLEMENTATION_DECISIONS_2026-10-30.md` and relevant `docs/CONTENT_CONTRACT.md`/`docs/ASSET_CONTRACT.md`.
2. Confirm the exact approved batch and whether current NASA event rules permit implementation; do not implement game code based on a proposal alone.
3. Use current official docs for chosen toolchain. Prefer strict TypeScript, idiomatic pure React, small modules, testable pure simulation and schema-validated content.
4. Build against explicit placeholder contracts while content and design are produced in parallel; never hardcode mission-specific data or assume final images exist. **Four core present rooms (V09) are fixed.** Model two separate past modes: observer-only Investigation Flashback and fictional changeable time-travel Rescue Mission with cinematic entry, interactive past-team portrait dialogue and player-composed engineering intervention (V01–V02/V08); reuse plus mission-specific past environments (V10). Preserve five-case collective evaluation, budget reallocation and historical/fantasy provenance. Use **The Astral Archives** in player-facing UI and release metadata, while keeping the `case404` repository path and stable technical IDs unchanged; V04 logo imagery is still pending.
5. No unapproved infrastructure, 3D/Game Engine pivot, generated-code execution from JSON or unaudited dependencies.
6. Finish with a concise handoff: changed files, acceptance criteria, tests actually run, residual risks, next integration dependency. Do not auto-merge.
