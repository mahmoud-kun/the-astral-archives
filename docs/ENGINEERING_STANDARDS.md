# The Astral Archives — Modern Engineering Standard

Last updated: 2026-10-30

Status: Reviewed technical guidance. **The React + strict TypeScript + Vite foundation is approved (A01–A03, 2026-10-29)**; exact dependency versions, optional tooling and simulation schemas remain unapproved.

## Current official evidence (verified 2026-10-29)

- React: https://react.dev/reference/rules ; https://react.dev/learn/you-might-not-need-an-effect ; https://react.dev/learn/react-compiler
- TypeScript strict/type-safety: https://www.typescriptlang.org/tsconfig/
- Vite: https://vite.dev/guide/ (includes React+TS templates and Node compatibility notes)
- ESLint Flat Config: https://eslint.org/docs/latest/use/configure/configuration-files
- Vitest: https://vitest.dev/guide/
- Zod 4: https://zod.dev/basics
- npm clean/reproducible installation: https://docs.npmjs.com/cli/commands/npm-ci/

Do **not** hard-code a `latest` version into docs or write an unverified lockfile. At authorized scaffold time, check official peer dependencies/engines/releases, install compatible stable versions, lock them and record the actual tested versions in `package.json`/lockfile and the implementation handoff.

**V11 naming boundary (2026-10-30):** Ship UI and app metadata under the title **The Astral Archives**. `case404` remains the repository/legacy identifier and is not a reason to rename stable IDs. No production logo has been supplied.

## React architecture

- Function components, pure rendering, props and state treated as immutable, hooks at top level. Follow React Hook lint rules.
- Use a state machine/explicit phase enum or discriminated union where UI flows are nontrivial; don't model all game progress as unrelated booleans.
- Derived values computed from existing state; no `useEffect` chains just to synchronize two React values. Use effects only for external resources/subscriptions when needed, with cleanup.
- Component boundaries follow features. Avoid giant god components and component-per-trivial-element overfragmentation.
- Avoid speculative memoization and React Compiler installation until demonstrated benefit and compatibility are verified. React Compiler is supported, not compulsory.

## TypeScript/domain quality

- `strict` from day one; prefer `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` and enforce full typecheck in CI.
- Typed data at boundaries; validate JSON with runtime schema; `unknown` before parsing; use tagged unions and narrowing.
- Prefer self-documenting immutable domain models and explicit error/result contracts. Keep scoring/rules deterministic and independent of rendering.
- No `any`/unsafe assertions unless a clearly justified bridge with tests. No `eval`, dynamic function loading, or code snippets embedded in mission data.
- Design stable IDs, unique constraints and cross-reference checks before writing detailed case content.

## Dependencies, formatting and tests

- Minimal npm dependencies. ESLint Flat Config + TypeScript + React Hooks recommended rules, formatting tool agreed once, consistent CI validation.
- Use `npm ci` in CI after committing an actual generated `package-lock.json`; do not commit `node_modules`.
- Test pure simulation with Vitest and table-driven cases: boundaries, units, missing resources, wrong/partial evidence, infeasible plan, reproducibility, and hidden results until final.
- Use browser/component tests when UI exists: mobile portrait widths, interaction hotspots, safe areas, focus/keyboard behavior, image loading failures and no dead ends.
- Prefer purpose-specific mocks/fakes over real external requests; never claim full behavior validated from mocked tests alone.

## Senior review gate

For each batch provide: requirement and expected behavior, narrowly scoped diff, changed contracts, reproducible tests/run outputs, performance/accessibility implications as relevant, and open limitations. Require a reviewer to understand every file; AI-generated complexity is not a quality signal.
