# CASE:404 — Decision Register

Last updated: 2026-10-29

## Decision status policy

- **CONFIRMED BASELINE:** the designer brief labels the item confirmed and Mahmoud has clarified that the team's agreed decisions are substantially represented there. Use these as the current working baseline unless a newer explicit team correction exists.
- **CONFIRMED CORRECTION:** explicit newer team clarification (overrides an outdated brief detail).
- **PROPOSED:** technical or creative recommendation not yet accepted.
- **OPEN:** decision pending. An agent must not convert an OPEN item to a feature requirement by inference.
- **SUPERSEDED:** historical idea, not implementable unless explicitly revived.

## Current confirmed product baseline (from original designer brief)

| IDs | Agreed working baseline |
|---|---|
| D01–D05 | Five real-mission cases; engineer/investigator protagonist; mission evidence; clue-triggered visual reconstructions; analyze phase/root cause. |
| D06–D12 | Fixed stylized male protagonist (~25); brief 10-second intro montage then calmer director call; Past cream/yellow, Station navy/orange, Space purple; full geometric character design, long mullet, blue/white/silver outfit, no orange clothing/wrist computer/tablet; protagonist observer-only in reconstructed past. |
| D13–D16 | Shared multi-room space station, point-and-click door navigation (not free walking); evidence from all five cases mixed; player assigns it to mission folders. |
| D17–D19 | One Rescue Mission submission per dossier; success/failure withheld until a single collective final evaluation; real NASA missions with explicitly fictional alternate-history interventions. |

For exact per-ID descriptions and nuances, consult `docs/CASE404_SOURCE_OF_TRUTH.md` §5. The original's D20–D25 are **not confirmed**.

## Newer corrections confirmed in the main discussion

| ID | Decision | Status | Reason |
|---|---|---|---|
| T01 | Three-person team: Mahmoud = Software Engineer/Technical Owner; another member = Designer; another = Data Analyst/Content Owner. | CONFIRMED CORRECTION | Overrides the designer-source table that labeled the user as designer. |
| T02 | Primary playing orientation is **portrait**, inspired by the pacing/layout of Elmwood Trail; desktop-like immersive visual quality still desired. | CONFIRMED | Direct user statement. |
| T03 | Create a dedicated `case404` repository and a simple **Main chat + Technical chat** collaboration model; deliberately lighter than SYNTRA. | CONFIRMED | Direct user statement. |
| T04 | Maintain stable interfaces so engineering, content research, and art assets can proceed **in parallel** with minimal integration changes. | CONFIRMED | Direct user statement. |
| T05 | Original designer brief must be kept as provenance; new decisions must be versioned in the project repo rather than held only in ChatGPT memory. | CONFIRMED | Direct user statement. |

## Architecture decisions — approved foundation on 2026-10-29

| ID | Decision | Status |
|---|---|---|
| A01 | Portrait-first static Web game for mobile and desktop browsers, using React + strict TypeScript + Vite. | CONFIRMED |
| A02 | For the initial single-player game, no backend; separate a pure, deterministic TypeScript domain/simulation engine from React and use validated, data-driven JSON scene/mission content. | CONFIRMED architectural direction; exact simulation rules remain OPEN |
| A03 | Use stable mission/evidence/room/asset IDs, manifest-driven media, explicit placeholders, and content/reference validation to support parallel engineering, design and content work. | CONFIRMED architectural direction; exact content/asset schemas remain OPEN |
| A04 | Prefer Zod for runtime content validation; Vitest, ESLint Flat Config and any optional state library are tooling proposals subject to compatible-version verification when implementation is authorized. | PROPOSED tooling; no additional dependency approval |

**Approval / rationale (2026-10-29):** The Technical Owner explicitly approved the concise Web-first architecture recommendation in Main Chat. It fits the confirmed portrait, point-and-click, evidence/planner UI and enables independent content/asset delivery without an unnecessary backend or full game engine. This **does not** approve numeric simulation rules, final schemas, browser/deployment specifics, dependency versions, or implementation timing.

## Engineering gameplay decisions — 2026-10-29

| ID | Decision | Status | Rationale |
|---|---|---|---|
| E01 | The Rescue Mission planner must let the player **construct/configure a mission-specific engineering solution** by selecting spacecraft systems and/or intervention equipment and allocating or adjusting limited resources, rather than merely selecting one of several ready-made designs or a correct-answer quiz. | CONFIRMED | Explicit Main Chat approval of the first, player-designed option. Engineering tradeoffs are central to the mission-design-game challenge. |
| E02 | Use a **Guided Engineering Sandbox**: player-selectable/configurable systems and equipment plus meaningful adjustments to engineering parameters and limited resources, with observable feasibility/resource tradeoffs while designing. Provide guidance and bounded options instead of an unrestricted free-physics sandbox. | CONFIRMED | Technical Owner agreed in Main Chat on 2026-10-29. Preserves the hands-on engineering learning of a flexible sandbox while containing complexity for a three-person, portrait-first game. |
| E03 | Use **mission-specific active constraints and a broader, plausible pool of resource-consuming systems/equipment**; do not explicitly flag every item as relevant or irrelevant to the player's current mission. Some options may provide no useful benefit to that mission, so the player must infer their value from collected evidence and engineering tradeoffs. | CONFIRMED | Technical Owner approved mission-specific resource relevance (option B) with additional non-useful options to avoid an obvious or trivial solution on 2026-10-29. |
| E04 | Use a **single shared Global Budget** across all five alternate-history mission plans; allocating/spending budget on one mission reduces the amount available for other mission plans, making cross-mission prioritization consequential. Mission-specific engineering constraints and other resources remain distinct unless separately approved. | CONFIRMED | Technical Owner explicitly selected the shared-budget option in Main Chat on 2026-10-29. |
| E05 | Plans and Global Budget allocations remain **editable/reallocatable until the player starts Final Evaluation**. Starting the collective final evaluation locks all five plans and allocations together, then reveals their outcomes collectively; submitting an individual plan does not permanently lock its budget. | CONFIRMED | Technical Owner approved the revise-until-final option in Main Chat on 2026-10-29, enabling evidence-driven engineering iteration without premature commitment. |

**E01 scope:** Keep the existing five simultaneous dossiers, one separate plan submission per case and one collective final outcome reveal. The required solution can be a spacecraft/vehicle configuration **where appropriate**, or a case-specific correction, equipment or operations plan for other historical missions; this decision does not claim that all five require launching a physical rescue spacecraft.

**E03 fairness constraint:** Choices must be engineering-plausible and subject to consistent mass/power/budget/time constraints where applicable; no fabricated resource type purely to mislead, no hidden arbitrary penalty, and no automatic labeling of the optimal option. Educational debrief can explain why a selected component was useful or unnecessary after the collective reveal. The case-specific resource system must remain data-driven within one shared engine.

**E04 framing:** The shared pool is a fictional in-game program/operations budget linking the five counterfactual simulations, **not** a historical claim that NASA pooled these real missions' funding across different years. Do not silently make mission-local mass, fuel, power, time or communications inventories globally transferable.

**E05 semantics:** Each dossier retains one *current* Rescue Mission plan; resubmission replaces/revises that plan before final evaluation rather than creating additional counted mission plans. Recalculate the shared budget view whenever a plan or allocation changes. Treat the start of Final Evaluation as one irreversible lock of the five current plans and budget allocations for that evaluation. Do not reveal individual success/failure before that point.

**Still OPEN:** global budget amount/units, costs and balancing; draft-versus-submitted accounting/presentation details, over-budget handling, exact component inventory, adjustable parameters and safe ranges, per-mission engineering rules/equations, feedback, scoring, data schemas, replay behavior and implementation. E01–E05 approve gameplay direction only; they do **not** authorize coding before competition clearance. Live feasibility feedback must not reveal mission success/failure ahead of the confirmed collective final evaluation.

**Competition gate:** Verify NASA Space Apps 2026 pre-event implementation rules and licensing with official organizers before coding a competition submission. See `docs/COMPETITION_NOTES.md` and `docs/OPEN_QUESTIONS.md`.
