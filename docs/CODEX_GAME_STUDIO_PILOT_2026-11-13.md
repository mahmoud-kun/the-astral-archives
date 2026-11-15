# The Astral Archives — Codex × Claude Code Game Studios: Full-Game Pilot

**Created:** 2026-11-13  
**Experiment branch:** `experiment/codex-game-studios-fullgame-2026-11-13`  
**Exact source commit:** `45e8f67923bd07d896444b2c965e23c312a8b2b8`  
**Status:** Codex-native skill and isolated branch prepared. **Codex has not been launched or independently validated**, and no Claude Code hook/agent has run.

## Intent

Mahmoud approved evaluating **the entire game**, not just the quality of the Investigation Room's desk. We should use the **workflow and division of responsibilities** of [Donchitos/Claude-Code-Game-Studios](https://github.com/Donchitos/Claude-Code-Game-Studios) across all of The Astral Archives — architecture, multi-mission gameplay, content evidence, art and characters, interface, sound workflow, test automation and deployment.

Upstream version pinned for study: `v1.3.0`, upstream SHA `abc0de79d6ceb0b5d7aa693945849b3937afbe6a` (MIT License: copyright 2026 Donchitos, original repository retains its rights and license). The upstream source is **not installed or vendored into this game**; only derived, original Codex-native operating guidance is tracked on the experiment branch.

## Compatibility decision

Claude Code Game Studios is a **Claude Code project template**, not a standalone game engine or a pack of 3D models. It includes 49 Claude role definitions, circa 75 Claude skill commands and lifecycle Shell hooks. Merely checking out that repository does not give Codex 49 working Claude subagents or automatically register Claude's slash commands. Port portable workflows into Codex Skills (`.agents/skills/.../SKILL.md`) and root `AGENTS.md`, and explicitly map tools; **do not execute unknown hooks, installer scripts, or shell commands solely because they exist in upstream content**. Agent paths and permission models differ.

A full copy of upstream is NOT needed to assess which methods to use. For later deeper integration, review it in a separate untracked read-only checkout pinned at the above SHA, preserve MIT attribution, and selectively migrate skill procedures with tests. Never overwrite project `AGENTS.md` wholesale with upstream `CLAUDE.md` or `.claude/settings.json`.

## Protected project status

- Production `main` unchanged; pre-existing `experiment/interactive-investigation-v2-2026-11-13` remains user-reviewed 360°/visual-quality experiment; checkpoint branch remains intact.
- Game tech: React + TypeScript + Vite + Three.js, browser delivery and isolated Vercel previews.
- Current **experimental** 360° Investigation Room: seated fixed camera with yaw/pitch and no free roam; user liked immersion, but **art/detail, saturation and lighting still require major improvement**. User requested near-continuous Mouse Lock, subject to the browser's explicit gesture and Escape safety rules.
- Current 3D art is **procedural placeholder meshes**. No Quaternius, Kenney or designer's pending archive has been imported yet. Do not invent GLB files or claim the original designer gave final approval.
- Gameplay authority: `docs/GAMEPLAY_DESIGN_2026-11-09.md` for evidence filing/rescue, plus newer 360 experiment checkpoint for camera; archived 2.5D-only notes are **superseded within this pilot**.
- 4 present rooms: Investigation, Recordings, Archive, Signal. 5 mission dossiers (only real NASA content explicitly provided/verified). Evidence wrongly filed remains saved and movable, with no wrong-folder warning/progress. Rescue unlocks when all required evidence is correctly filed. Flashback remains view-only; fictional alternate-history Rescue contains choices.
- Responsive portrait UI and keyboard interactions remain required. No ungrounded additions to game canon, no new sound/music or voice generation without review.

## Whole-game workstreams

1. **Creative director & system design:** top-to-bottom game journey and 5 mission structure, sorting/recovery state machine, endings, two timelines, in-room investigation.
2. **NASA research & content:** source records/datasets, screenshots and permissions, real scientific evidence vs alt-history clearly marked, content provenance and exact missing evidence.
3. **Art direction & technical art:** Henda (dialogue/cinematics, no mandatory walking avatar), sci-fi station, four rooms and past, 3D asset source pipeline, licensed materials, animation, shaders, lights, color, performance budgets.
4. **Engineering & level interactions:** React/Vite/Three, input and pointer lock, raycasting, scene lifecycle, asset loading, accessibility and touch behavior.
5. **UX, audio and player feedback:** responsive rooms, evidence folders, cues, dialogue/helper, screen readability, audio implementation only once scoped and assets licensed.
6. **Quality, security and performance:** tests for evidence state, static analysis, browser screenshots, visual comparisons, mobile measurements, performance metrics and trusted asset sources.
7. **Producer/release:** prioritized game-wide plan, milestones, review checkpoints, branch/Preview integrity and source-of-truth docs.

## First Codex run — objective and acceptance

Start with a **read-only full-game audit**, not a total rewrite:

- Confirm the branch; inventory current code/assets/docs/build scripts and preexisting 360 Prototype.
- Cross-check what exists in each of the 7 workstreams and each of the 4 present rooms / 5 dossier slots. Mark actual vs partial vs only planned.
- Evaluate the pinned upstream framework and identify portable vs Claude-specific parts, safety and dependency concerns.
- Run baseline `npm run build` and any available tests; only assert a screenshot/interaction/FPS result if actually measured.
- Create `docs/studio-pilot/WHOLE_GAME_AUDIT.md`, `ROADMAP.md`, `ASSET_LEDGER.md`, `VERIFICATION.md`.
- Select one **end-to-end vertical slice** crossing gameplay, art, NASA evidence handling, UI and QA; keep the photographer/pending designer bundle as an unresolved external input.
- Keep source unchanged until a bounded task has an evidence-supported plan. Then implement in separate commits within this pilot branch, validate and review diff before preview deployment.

Stop and report blockers rather than fabricating NASA data, tool results or missing assets. A successful build is not proof of immersive lighting quality or device performance. No merge into `main` without separate authorization.

## Running this in Codex

Open the existing `mahmoud-kun/case404` repository **on this pilot branch**, not a newly generated project. Codex should read root `AGENTS.md` and the project-native Skill `.agents/skills/astral-game-studio/SKILL.md`. Start with:

```text
Use $astral-game-studio to evaluate and pilot the Claude Code Game Studios v1.3.0 workflow across the ENTIRE existing The Astral Archives game on this branch. Read the pilot brief and project source-of-truth docs. Do not start a new game or overwrite existing assets. First produce a source-backed full-game audit, cross-discipline role mapping, prioritized roadmap and one vertical slice covering gameplay, NASA data, 3D art, UX and QA. Run the existing build and tests; document any missing browser/FPS test as NOT ASSESSED. Commit only on this branch, with clear rollback checkpoints. Do not merge to main. After the audit, propose the first scoped implementation and state exactly what will change.
```

Important: `CLAUDE.md`/.claude plugins are *not* installed in Codex in this setup. If Codex cannot find `$astral-game-studio`, read its `SKILL.md` directly as project instructions; do not pretend an unavailable skill or agent ran.

## Exit criteria

The pilot is worthwhile if it produces a credible game-wide gap map, clear dependencies and tested improvements across multiple disciplines, without altering approved gameplay, losing source materials or corrupting branch history. Reject any generated claims of "49 agents ran", asset license clearance, exact NASA evidence, screenshots, completed game systems or performance measurements that aren't independently supported.
