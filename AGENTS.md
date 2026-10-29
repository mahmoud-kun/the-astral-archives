# CASE:404 — Agent Instructions

Last updated: 2026-10-29

## Read-first order

Before planning or changing anything, read: `README.md`, `docs/DECISIONS.md`, `docs/OPEN_QUESTIONS.md`, `docs/ARCHITECTURE.md`, `docs/ENGINEERING_STANDARDS.md`, and the current chat bootstrap. Read the designer's `docs/CASE404_SOURCE_OF_TRUTH.md` when product detail or origin is relevant. Read relevant content/asset contracts before making changes to those areas.

## Decision authority and source-of-truth rules

- `docs/DECISIONS.md` is the approved working baseline. `docs/CASE404_SOURCE_OF_TRUTH.md` is the original designer handoff, preserved as supplied; its PROPOSED/OPEN/SUPERSEDED sections are **not implementation authorization**.
- Explicit user/team corrections override outdated ownership labels in the original. When product/technical choices are not ratified, label them **PROPOSED** or **OPEN**, do not silently approve them.
- Main project chat owns product/architecture changes; technical chat implements an approved bounded batch. No unilateral feature additions or architecture pivots.
- Update the smallest relevant decision/specification document when a decision is actually approved; include rationale, date and status. After modifications, **reread the entire changed file** for correctness and contradictions.

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
