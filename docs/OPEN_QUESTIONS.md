# CASE:404 — Open Decisions and Conflicts

Last updated: 2026-10-29

This is a decision backlog, **not** a checklist of auto-approved features. Main chat resolves; Technical chat documents engineering consequences.

## Blockers to implementing the real game

1. **Competition rules/timing and reuse:** obtain definitive guidance from the relevant NASA Space Apps organizers about permissible pre-event work, developer prototypes, asset creation, licensing and submission. Do not assume prep work can automatically be submitted.
2. **Tech stack ratification:** accept or revise proposed React/TypeScript/Vite portrait-first web architecture; specify browser/platform support and deployment strategy.
3. **Engineering design loop:** specify complete design, management, and simulation choices beyond selecting fault/solution; agree reusable resource model and per-case rules.
4. **Five missions:** approve mission list and distinguish verified NASA facts from fictional alternate-history content; source brief's Mars Climate Orbiter, OCO, Mars Polar Lander, Genesis, Apollo 13 are **candidates only**.
5. **Narrative continuity:** decide how missions from different historical eras coexist in one station; do not imply every case has a crew to physically rescue.
6. **First vertical slice:** agree exact playable demonstration scope, acceptance criteria, test cases, representative data and visual placeholder requirements.

## Decisions that can be deferred

- Exact number/arrangement of rooms and hotspot gating; original source suggests five but does not approve them.
- Evidence auto-collect vs explicit collect; wrong sorting correction policy and feedback.
- Single submission vs revise-before-final behavior; simulation previews vs no outcome leakage.
- Mission reconstruction presentation, counts, durations and labeling.
- Exact station UI screen sizes, portrait scaling, input/accessibility targets.
- Color hex palette and final assets/resolutions, animation toolkit and voice scripts.
- Scoring and replayability; final reveal format and outcome grades.
- Save persistence strategy and data migrations; data size/media hosting.
- Repository public/private status, open-source license, NASA/third-party asset licensing, attribution.

## Known tensions

- Original dramatic crewed-spacecraft rescue premise conflicts with the five historical uncrewed candidates. Keep player fantasy but adapt intervention timing/meaning to each mission only after Main chat approves.
- NASA challenge focuses on complete mission design/management; investigation-only mechanics do not satisfy that by themselves.
- 10-second intro montage (source current baseline) vs earlier longer Opportunity cinematic concept: use the source baseline until team revises it. Do not silently produce a 30–40 second intro.
- Designer source describes the designer as the user; newer team correction establishes user as engineering owner.
