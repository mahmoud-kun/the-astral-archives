# The Astral Archives — Agent Instructions

> **OFFICIAL TITLE AND REPOSITORY NAME — 2026-11-13:** The game's official and only current title is **The Astral Archives** (not CASE:404). The intended GitHub repository slug is **`the-astral-archives`**. The GitHub remote rename is **pending an administrator action in repository Settings**; do not claim it has happened just because the package name changed. Historical source files and older branch/commit references containing `CASE404` or `case404` are provenance, not the current title. Keep existing game behavior unchanged.


> **CODEX FULL-GAME STUDIO PILOT — 2026-11-13; branch-specific and highest priority on `experiment/codex-game-studios-fullgame-2026-11-13` only:** Mahmoud authorized a **separate experimental branch using the full-game Claude Code Game Studios methodology adapted to Codex**, not an art-only task. Start by reading `docs/CODEX_GAME_STUDIO_PILOT_2026-11-13.md` and the `astral-game-studio` Codex Skill. The entire current React/Vite/Three.js game is cloned from checkpoint `45e8f679`; neither `main` nor the original 360 experiment is to be edited. No Claude hooks/subagents are running and no upstream framework is installed by this branch. First audit all systems, then implement scoped vertical slices, validate, and request no merge without explicit approval. The newer 360 camera acceptance overrides 2.5D-only historical notes, while `docs/GAMEPLAY_DESIGN_2026-11-09.md` remains authority for evidence and Rescue mechanics.


> **LATEST 360° USER APPROVAL / 2026-11-13 (supersedes older camera and 2D-only status below):** Mahmoud authorized a **fixed seated first-person 360° look camera**, including optional lightweight 3D, for a separate Investigation Room experiment. The currently active experiment uses Three.js procedural geometry and preserves the previous 2.5D as a comparison fallback. No free-roam or movement. This does not approve final art, modify NASA mission/evidence rules, or authorize merge to `main`. See [Seated 360° experimental checkpoint](docs/SEATED_360_PROTOTYPE_2026-11-13.md). Player/browser/mobile/FPS validation remains pending.


> **CURRENT V2.2 / 2026-11-13 (latest; overrides historical preview status below):** Mahmoud requested a designer-reference-faithful, **separately authored 2D reconstruction**. V2.1 raster/background and cutout rendering was explicitly rejected and is **not active**. The current experiment uses **20 independent SVG scene assets** in `public/assets/experiments/investigation-room-v2-2/`, with **zero direct reference-image rendering** in `Investigation25D.tsx`. Camera V3 control feel was user-accepted and behavior is preserved; player/designer validation of V2.2 visuals, real browser/mobile tests and measured performance remain **pending**. Report: [V2.2 designer-faithful layered scene](docs/DESIGNER_FAITHFUL_LAYERED_V2_2_2026-11-13.md). This status applies only to `experiment/interactive-investigation-v2-2026-11-13`; no merge to main or original asset replacement is authorized.


> **CURRENT EXPERIMENT / 2026-11-13 — supersedes older status statements below:** Camera V3 mouse-look was positively accepted by the player for control feel. Its independent browser/device/FPS testing remains open. The first layered Mission Files corner was also positively assessed for depth, but the remaining flat room was rejected. **Layered Investigation Room V2** has now been implemented as a *nine-layer, full-room, artist-replaceable SVG experiment* on `experiment/interactive-investigation-v2-2026-11-13`; its Vercel build is READY and **player visual approval is pending**. See [Layered Room V2 verification](docs/LAYERED_ROOM_V2_2026-11-13.md). This is not approval of production artwork, new gameplay, 3D, audio or changes to `main`.


> **2026-11-13 status and handoff:** [Camera V2 player-rejected / Camera V3 next](docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md). Current game direction: first-person bounded **2.5D** only (**no 3D, no 360°, no free roam**). Camera V3 is **not implemented**. Evidence/Rescue rules follow the 2026-11-09 decisions, not conflicting October prose.

> **2026-11-09 gameplay update:** See [Gameplay & UX Decisions (2026-11-09)](docs/GAMEPLAY_DESIGN_2026-11-09.md) for the newer designer-approved first-person investigation, folder-based evidence progress, contextual robot assistance, past engineering interaction, and per-mission outcomes. It **supersedes conflicting older gameplay directions**, especially mandatory deduction-board gating and collective-only result reveal. Shared Global Budget, observer-only flashbacks, historical content and responsive orientation have unresolved reconciliation points; do not treat old conflicting prescriptions as simultaneous requirements. Documentation update only; no gameplay implementation.


Last updated: 2026-10-30

## Read-first order

Before planning or changing anything, read: `docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md`, `docs/GAMEPLAY_DESIGN_2026-11-09.md`, `README.md`, `docs/DECISIONS.md` (**especially V01–V10**), `docs/OPEN_QUESTIONS.md`, `docs/ARCHITECTURE.md`, `docs/ENGINEERING_STANDARDS.md`, and the current chat bootstrap. Read the designer's `docs/CASE404_SOURCE_OF_TRUTH.md` when product detail or origin is relevant. Read relevant content/asset contracts before making changes to those areas.

## Decision authority and source-of-truth rules

- `docs/DECISIONS.md` is the approved working baseline. `docs/CASE404_SOURCE_OF_TRUTH.md` is the original designer handoff, preserved as supplied; its PROPOSED/OPEN/SUPERSEDED sections are **not implementation authorization**.
- **Newest explicit decisions (Nov 9 evidence/Rescue and Nov 13 camera/UX) prevail** if older approved/proposed/open prose disagrees. Preserve otherwise compatible T/A/I/E/X/P decisions. V09 fixes **four present-day core rooms**; V01 separates observer-only investigation Flashbacks from fictional changeable Rescue Mission time travel; V08 fixes cinematic + 2D point-and-click + portrait dialogue + player-built Mission Builder; V10 chooses shared plus mission-specific past environments. **V11 fixes the public game title _The Astral Archives_**, superseding CASE:404 as a player-facing name. The GitHub repo `case404` and historical designer source stay unchanged. **The logo is only a temporary V04 concept** until a final asset is supplied and approved. `docs/OPEN_QUESTIONS.md` tracks only still-unresolved details.
- Explicit user/team corrections override outdated ownership labels in the original. When product/technical choices are not ratified, label them **PROPOSED** or **OPEN**, do not silently approve them.
- Main project chat owns product/architecture changes; technical chat implements an approved bounded batch. No unilateral feature additions or architecture pivots.
- Update the smallest relevant decision/specification document when a decision is actually approved; include rationale, date and status. **Also reconcile any older conflicting text in dependent active docs in the same approved batch**; a new note appended to one file is not enough to leave other active instructions misleading. After modifications, **reread the entire changed file** for correctness and contradictions.

## Senior-engineering standard (current, not fashion-driven)

1. **Correctness > reliability > user experience > maintainability > simplicity > speed.** Keep the system small; never add backend, microservices, databases, AI APIs, game engines or dependency stacks without justified need.
2. On the approved Web-first stack (A01–A03), use **modern React function components + TypeScript**; follow React's official Rules of React (pure render, no mutation of props/state, Hooks only at top level of React functions). Prefer deriving display values during render; use `useEffect` for synchronization with external systems, not for computing ordinary derived state.
3. TypeScript: enable `strict`; strongly consider `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noFallthroughCasesInSwitch` and `noImplicitReturns` in the eventual tsconfig. Prefer discriminated unions and explicit domain types; `unknown` at trust boundaries; safe narrowing/validation. No casual `any`, `@ts-ignore`, non-null assertion (`!`), or broad `as` casts to bypass errors. If a justified exception is necessary, explain it locally and test it.
4. Use **ES modules**, type-only imports where appropriate, modern `async/await` with explicit loading/error/cancellation handling. Never ignore promise rejections. Avoid needless wrappers/classes and abstraction layers; use straightforward functional modules for the engine.
5. Separate **UI / state / content / assets / deterministic simulation logic**. Simulation must be testable without React, browser DOM or external services; same state + plan + rules => same outcome. No executable scripts embedded in case JSON. Do not invent scientific values or portray game data as actual NASA telemetry.
6. Stable IDs and manifest-driven assets: content refers to `missionId`, `evidenceId`, `roomId`, `assetId`; never bind logic to filenames, display labels or array order. Start with valid placeholder assets, then replace through the manifest. Validate unique IDs, cross-references and missing files before integration.
7. Before adding dependencies, consult **official current docs**, compatibility/maintenance/security notes and project need. Install only required packages, record versions/lockfile, and explain new library choices. Prefer ESLint **Flat Config** and recommended React Hooks/TypeScript linting. Use an opinionated formatter consistently; do not hand-format entire files inconsistently.
8. React Compiler is supported in modern React, but **not mandated**. Do not sprinkle speculative `useMemo`, `useCallback` or `memo`; measure first, and adopt compiler only if verified with the chosen toolchain.
9. Use accessible semantic controls (buttons, dialogs, labels), keyboard/focus behavior, touch-friendly hit targets, mobile portrait scaling, safe areas and robust loading/error states. Never use a CSS-only desktop page as proof the game works on mobile.
10. Unit-test domain rules, boundaries, resource feasibility, evidence association, persistence/migration, and **no early success/failure leak**. Use targeted test runs for changed code. An approved batch must pass relevant typecheck, lint, focused tests and build when those scripts exist. Do not claim a test passed if it wasn't run.
11. Protect data and repository: no credentials, tokens or private data in commits or console logs; `.env` local only. Review external packages, downloads, generated shell commands, network/upload actions and destructive operations before execution. Never run remote `curl | bash` installers merely for convenience.
12. Keep code readable to a human senior reviewer: meaningful names, small cohesive modules, no overengineering, no opaque AI-generated boilerplate, no copy/paste duplication, concise comments explaining **why**, not narrating obvious syntax.

## Execution workflow

- Before coding: identify requested behavior, evidence, bounded file scope, acceptance criteria, and existing test coverage; check contest timing/eligibility restrictions.
- Work in a small issue/branch or scoped batch. Do not combine unrelated changes, rewrite entire modules needlessly, or merge to default branch without main-chat approval.
- Verify in the narrowest useful way first; re-run broader checks only when interface/behavior risks justify them.
- Final handoff: changed files, decision/spec alignment, tests actually run/results, remaining risks, and next action. Do not claim implementation from documentation alone.
- Never reset or discard other people's work or change authored designer/content assets without ownership approval.

## Latest official reference points (reviewed 2026-10-29)

- React rules: https://react.dev/reference/rules
- React effects: https://react.dev/learn/you-might-not-need-an-effect
- React Compiler: https://react.dev/learn/react-compiler
- TypeScript strict options: https://www.typescriptlang.org/tsconfig/
- Vite project setup/compatibility: https://vite.dev/guide/
- ESLint flat configuration: https://eslint.org/docs/latest/use/configure/configuration-files
- Vitest: https://vitest.dev/guide/
- Zod: https://zod.dev/basics
- npm reproducible installs: https://docs.npmjs.com/cli/commands/npm-ci/

**Recheck release notes and install compatibility at implementation time**. This file sets durable engineering principles, not a frozen claim that today's dependency versions will remain latest.

**2026-11-13 navigation execution gate:** Current Camera V2 is built but player-rejected. Camera V3 must be the only next feature, on experiment branch, with browser + player acceptance before art layering/drawer/other additions. Do not alter `main`; no 3D/free-roam. See checkpoint.
