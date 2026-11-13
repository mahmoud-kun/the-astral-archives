---
name: astral-game-studio
description: Coordinate end-to-end game development for The Astral Archives on the isolated Codex pilot branch. Use for multi-discipline game design, NASA research/content, environment art, UI, gameplay, QA, performance, and release planning, adapted from Claude Code Game Studios v1.3.0.
---

# The Astral Archives — Codex Game Studio pilot

This is a **Codex-native experimental workflow** informed by [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios), pinned to v1.3.0 / `abc0de79d6ceb0b5d7aa693945849b3937afbe6a` (MIT). It is not a claim that Claude Code hooks, slash commands, or 49 Claude subagents execute inside Codex.

Read `docs/CODEX_GAME_STUDIO_PILOT_2026-11-13.md` **first**. Follow root `AGENTS.md`, prefer current authority over historical headings, then inspect the code and documentation directly.

## Studio rules

- Work **only on** `experiment/codex-game-studios-fullgame-2026-11-13` unless explicitly instructed otherwise. Never merge or push to `main`, alter older experiments, overwrite the designer's source, or delete evidence data.
- `main`, the existing 360° experiment and the camera checkpoint are protected references, not work targets.
- Use *studio disciplines* as workstreams, not fake separately running agents: **creative/game design**, **science/data and narrative**, **technical art**, **Web/Three.js engineering**, **UX/accessibility**, **QA/performance**, **release/production**.
- If multi-agent execution exists in the current Codex environment, delegate clearly independent read-only reviews; otherwise run the disciplines sequentially. Do not claim roles have reviewed a task unless they actually did.
- Understand the current build before changing it. Inspect source, asset provenance, dependencies, scripts, branch state, and documented user decisions. Start with a project-wide audit, then choose a vertical slice that improves several disciplines together.
- Persist a **measured** state ledger with PASS / FAIL / NOT ASSESSED and evidence paths. Never invent browser screenshots, model files, NASA citations, gameplay coverage, or measured FPS.
- Preserve investigation camera seated viewpoint, 360° yaw and vertical look without free roam. The player requested a near-persistent mouse lock: respect browser gesture/ESC constraints, avoid coercive or impossible lock behavior.
- Preserve evidence sorting across five mission folders: wrong filing saved without an explicit wrong warning or progress, reversible; correct required evidence advances only its real mission, Rescue unlock only at full required evidence. Do not invent scientific evidence or alternate outcomes as NASA facts.
- Preserve exactly four shared present-day rooms: Investigation, Recordings, Archive, Signal. Other planned past locations are not extra present-day rooms.
- The game's artwork must preserve designer intent; the pending designer package is NOT in the repository. A procedurally improved placeholder cannot be labeled artist-approved.
- Do not silently replace Vite/React/TypeScript/Three.js, introduce a new 3D engine, import large asset packs, or add audio without an explicit scoped decision.
- Check model/texture licensing before bundling third-party art. The upstream Game Studios template does not contain production-ready art assets.
- Build `npm run build`; test existing scripts and run browser screenshot/interaction tests *if actually available*. In PowerShell the launch command is `npm.cmd run dev`.
- After each bounded change: review diff, run validation, report exactly what passed/failed/not assessed and the rollback commit. Preview deployment requires a successful build and confirmed deployment state.

## Pilot mission (first Codex session)

1. Confirm the isolated branch and SHA. Review `package.json`, `src/`, `public/assets/`, `docs/GAMEPLAY_DESIGN_2026-11-09.md`, `docs/SEATED_360_PROTOTYPE_2026-11-13.md`, and `docs/VISUAL_QUALITY_PASS_V1_2026-11-13.md`. Spot conflicting archival notes and use dated precedence.
2. Examine the upstream pinned CCGS framework **as read-only reference** (not an executable installation). Compare the studio's proposed roles, workflows, hooks, and QA with this repo. Explicitly record what is portable to Codex and what is Claude-only.
3. Produce a cross-functional, evidence-backed gap audit covering all four present rooms, all five mission slots, evidence filing, rescue flow, station UI, NASA provenance, designer/3D art, SFX, performance, accessibility, tests, and deploy. Identify current vs planned vs blocked.
4. Produce a prioritized whole-game roadmap and concrete first **vertical slice** that exercises user journey end-to-end, not just a desk art pass. Recommend how to address mouse lock and hero-area detail without disrupting the larger game plan.
5. Do not assert completion of unimplemented systems. Avoid large rewrites until the audit identifies an acceptable slice. Commit audit/roadmap documents on this branch and report verification.

Skill references: `references/studio-workstreams.md` and `docs/CODEX_GAME_STUDIO_PILOT_2026-11-13.md`.
