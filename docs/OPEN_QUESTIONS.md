# CASE:404 — Open Decisions and Conflicts

Last updated: 2026-10-29

This is a decision backlog, **not** a checklist of auto-approved features. Main chat resolves; Technical chat documents engineering consequences.

## Blockers to implementing the real game

1. **Competition rules/timing and reuse:** obtain definitive guidance from the relevant NASA Space Apps organizers about permissible pre-event work, developer prototypes, asset creation, licensing and submission. Do not assume prep work can automatically be submitted.
2. **Delivery/platform details:** React + strict TypeScript + Vite portrait-first Web foundation is APPROVED (A01–A03); supported browser targets, hosting/deployment, offline behavior and optional PWA requirements remain OPEN.
3. **Engineering design loop details:** E01–E06 APPROVED: player-configured Guided Engineering Sandbox, case-specific resources and plausible nonessential equipment, **one fictional Global Budget shared across five revisable plans**, plus a **Hybrid Simulation Engine** (testable physical resource calculations + mission-specific rules) with one collective Final Evaluation. Still decide budget scale/units/costs, how unfinished drafts reserve funds, over-budget handling, component catalogue, scientifically justified formulas/ranges, exact case rules, difficulty, scoring, preview details and replay. Do not imply historical NASA cross-era pooled financing, invent fake resources/telemetry, reveal early outcomes, or force physical rescue spacecraft into every case.
4. **Five missions:** approve mission list and distinguish verified NASA facts from fictional alternate-history content; source brief's Mars Climate Orbiter, OCO, Mars Polar Lander, Genesis, Apollo 13 are **candidates only**.
5. **Narrative continuity:** decide how NASA missions from different historical eras coexist in one station. T06 confirms that a stranded crew/reestablishing communication is merely one possible case premise; crewed and uncrewed mission incidents need different appropriate interventions. The initial five cases are a demo and may be extended later (T07).
6. **First vertical slice:** agree exact playable demonstration scope, acceptance criteria, test cases, representative data and visual placeholder requirements.

## Investigation mechanic decisions

- **I01 CONFIRMED (2026-10-30):** Hybrid Deduction — free exploration and evidence assignment, followed by active clue connections and hypothesis testing with bounded guidance rather than automatic solutions.
- **I02 CONFIRMED (2026-10-30):** functional Evidence Board — player arranges multiple clue cards and makes editable links that participate in hypothesis/deduction state, not merely visual decoration.
- **OPEN:** Evidence Board gestures/layout for portrait, semantics of links/groups, hypothesis testing and wrong-link feedback, hints, flashback/reconstruction triggers, communication restoration as a case-specific mechanic, and authoring schema. Avoid exposing the definitive root cause or mission result through a single clue.

**I03 CONFIRMED (2026-10-30):** Contextual feedback uses the investigator's self-talk on testing hypotheses; no instant right/wrong on linked evidence. Details of triggers, scripts, voice/text and hint timing remain OPEN.

## Decisions that can be deferred

- Exact number/arrangement of rooms and hotspot gating; original source suggests five but does not approve them.
- Evidence auto-collect vs explicit collect; wrong sorting correction policy and feedback.
- The **revise-before-final behavior is approved (E05)**; simulation projection/feasibility preview details vs no outcome leakage and post-evaluation replay remain open.
- Mission reconstruction presentation, counts, durations and labeling.
- Exact station UI screen sizes, portrait scaling, input/accessibility targets.
- Color hex palette and final assets/resolutions, animation toolkit and voice scripts.
- Scoring and replayability; final reveal format and outcome grades.
- Save persistence strategy and data migrations; data size/media hosting.
- Repository public/private status, open-source license, NASA/third-party asset licensing, attribution.

## Known tensions

- **Resolved clarification (T06):** the original stranded-astronaut narrative is an example, not a requirement for every case. Content Owner chooses crewed or uncrewed incidents and the appropriate investigation/intervention for each mission; actual mission selection and story continuity remain open.
- NASA challenge focuses on complete mission design/management; investigation-only mechanics do not satisfy that by themselves.
- 10-second intro montage (source current baseline) vs earlier longer Opportunity cinematic concept: use the source baseline until team revises it. Do not silently produce a 30–40 second intro.
- Designer source describes the designer as the user; newer team correction establishes user as engineering owner.
