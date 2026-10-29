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

**I04 CONFIRMED (2026-10-30):** Hybrid Flashbacks: short scenes from finding important clues, deeper scenes from successful evidence deductions. Detailed triggers and presentation OPEN.

**I05 CONFIRMED (2026-10-30):** Interactive Flashbacks (B). Players pause and inspect details in reconstructions; they cannot alter the past. Open: hotspot gestures, pause controls, evidence discoveries and scene formats.

## Remaining explicit decisions — deduplicated against original source and current approvals (2026-10-30)

The topics below are **OPEN**, not new approvals. Do **not** re-decide baseline D01–D19, I01–I06, E01–E07 or T01–T07. Original source sections 6–8, 14, 18–20 already mention many topics as PROPOSED/OPEN; the questions below identify the specific **unresolved choice**, not a new gameplay concept.

### Investigation — priority order

1. **Evidence sorting correction:** can players freely reassign evidence to another dossier, and does a wrong assignment block deductions or merely affect final evaluation? Source §6.2/§7.3 proposes undo but never confirms it.
2. **Hypothesis test contract:** what constitutes a testable claim, whether players choose from contextual theories or compose them using evidence, and how multi-link board groups contribute? Hybrid Deduction I01 / Board I02 establish direction only.
3. **Board usability on portrait:** linking/positioning and non-drag accessible input; how several cases' clues are separated without hiding cross-case relationships.
4. **Monologue and hints:** on-demand vs automatic insight, repetition handling and what evidence inconsistency may be described; I03 fixes contextual self-talk but not frequency.
5. **Flashback discovery behavior:** I06 confirms visible + hidden details. Decide tap/zoom/inspect feedback, how to distinguish evidence-bearing from decorative objects without pixel hunting, and replay/bookmarking. I04/I05 already settle trigger families and interactive inspection; do not re-ask them.
6. **Gating:** whether station rooms and evidence remain freely available or open via narrative conditions; five cases are simultaneous regardless (D13–D16), so never propose sequential missions.
7. **Communication recovery:** when a particular case has a reachable spacecraft/crew, decide player interaction (signal analysis/configuration vs scripted story beat), constraints and consequences; not mandatory for all cases (T06).

### Integration / engineering — still OPEN

8. **Investigation-to-planning interface:** which supported deductions, identified phase and discovered requirements transfer into a case's Rescue Mission design; can the player design amid uncertainty?
9. **Global Budget accounting:** numerical scale/currency, costs, what draft allocations reserve and over-budget submission behavior; pre-final reallocation is already settled by E05.
10. **Simulation fidelity per case:** reviewed formulas, assumptions, units and thresholds, component catalogue and scenario rule encoding; hybrid engine and real units are already approved (E06–E07).
11. **End evaluation detail:** readiness gate, final scoring/partial outcomes, reveal presentation and replay/reset; collective reveal itself is already approved (D18/E05).
12. **Save/accessibility/performance:** local persistence/resume and replay, portrait targets, input alternatives, media fallback and offline expectations, without adding an unapproved backend.
13. **Implementation handoff:** finalize stable content schema, reference/validation requirements, one-case vertical slice and tests; verify NASA competition timing/eligibility before coding.

### Delegated rather than owner-decided narrative/visual content

- **Content Owner:** propose and source exact five historical missions; case-specific incidents, evidence, hypothesis graph, flashback scripts/locations, communication circumstances and historical-vs-fiction labeling. Main Chat reviews consistency, but Technical Owner need not invent the stories.
- **Designer:** room art, visible scene hotspots, flashback presentation/voice assets, layouts, visual language and deliverable files using approved asset IDs. Existing character and palette decisions stand.
- Exact room count and map are not confirmed; source §7.2 names *proposed* rooms only.

**I06 CONFIRMED (2026-10-30):** Hybrid Flashback Hotspots — mix discoverable inspection targets and subtle hidden details inside interactive reconstructions; avoid making every meaningful object obvious. Exact accessibility and indicators remain OPEN.

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
