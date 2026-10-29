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
| T06 | Astronauts stranded aboard a failed spacecraft and restoring communications with them are **illustrative case scenarios, not mandatory conditions for every mission**. CASE:404 supports crewed and uncrewed crises, with case-specific investigation, appropriate contact/diagnosis steps and rescue or corrective intervention. | CONFIRMED CORRECTION | Technical Owner clarified on 2026-10-29 that the trapped crew was only an example; this overrides any assumption that all five must involve astronaut rescue. |
| T07 | The initial **five cases form the demo scope**, with the game/content architecture allowing additional cases later without redesigning the core investigative and simulation mechanics. | CONFIRMED | Technical Owner explicitly described the five cases as a demo that can be expanded in the 2026-10-29 discussion. |

## Architecture decisions — approved foundation on 2026-10-29

| ID | Decision | Status |
|---|---|---|
| A01 | Portrait-first static Web game for mobile and desktop browsers, using React + strict TypeScript + Vite. | CONFIRMED |
| A02 | For the initial single-player game, no backend; separate a pure, deterministic TypeScript domain/simulation engine from React and use validated, data-driven JSON scene/mission content. | CONFIRMED architectural direction; exact simulation rules remain OPEN |
| A03 | Use stable mission/evidence/room/asset IDs, manifest-driven media, explicit placeholders, and content/reference validation to support parallel engineering, design and content work. | CONFIRMED architectural direction; exact content/asset schemas remain OPEN |
| A04 | Prefer Zod for runtime content validation; Vitest, ESLint Flat Config and any optional state library are tooling proposals subject to compatible-version verification when implementation is authorized. | PROPOSED tooling; no additional dependency approval |

**Approval / rationale (2026-10-29):** The Technical Owner explicitly approved the concise Web-first architecture recommendation in Main Chat. It fits the confirmed portrait, point-and-click, evidence/planner UI and enables independent content/asset delivery without an unnecessary backend or full game engine. This **does not** approve numeric simulation rules, final schemas, browser/deployment specifics, dependency versions, or implementation timing.

## Investigation gameplay decisions — 2026-10-30

| ID | Decision | Status | Rationale |
|---|---|---|---|
| I01 | Use **Hybrid Deduction**: the player freely explores the shared station, collects and assigns mixed evidence across mission dossiers, then actively connects evidence and tests hypotheses when sufficient clues are available. Offer bounded, context-sensitive guidance rather than always revealing the correct answer or reducing deduction to a passive quiz. | CONFIRMED | Technical Owner explicitly approved Hybrid Deduction in Main Chat on 2026-10-30 to preserve investigative agency without leaving novice players directionless. |

| I02 | Provide an interactive **Evidence Board** where players place multiple collected evidence items, draw/edit connections between them and use those connections in the actual hypothesis/deduction mechanics; it is not merely a decorative corkboard or a fixed two-item pairing screen. | CONFIRMED | Technical Owner selected the multi-evidence Evidence Board option in Main Chat on 2026-10-30 to make investigation visual and active. |

**I01 scope:** Deduction must reflect the player's evidence/hypothesis interactions and fit the existing case-mixed investigation, clue-triggered flashbacks/reconstructions, root-cause analysis and eventual engineering plans. A single clue must not automatically disclose the entire solution. Distinguish interim evidence/consistency feedback from correctness of the final diagnosis and rescue outcome, which must remain hidden until the collective Final Evaluation.

## Clarifications from Technical Owner — 2026-10-30

- **I07 CONFIRMED — Case-as-dossier:** Cases are concurrent evidence folders, not sequential levels; evidence from different incidents coexists in the station. This reiterates D13–D16, not a new sequential-unlock model.
- **I08 CONFIRMED — Knowledge-led investigation:** The player personally infers hypotheses from evidence, rather than a system composing the conclusion for them. The Evidence Board and contextual inner monologue support reasoning, not automated solving. Exact free-text versus structured entry remains OPEN.
- **I09 CONFIRMED — Clue-to-clue depth:** All station rooms are navigable; access to deeper interactions, sub-areas and clues can depend on discoveries and deductions. Do not gate the five mission files sequentially. Exact gating conditions are content-authored and OPEN.
- **I10 CONFIRMED — Investigation informs intervention:** Discovered facts, credible hypotheses and engineering requirements provide knowledge for building the case's rescue/correction plan; optional investigator self-talk may help players reason without generating the plan for them.
- **P01 CONFIRMED — Resume and mobile input:** The game must preserve progress and support continued play with functional portrait/mobile controls. Save strategy, implementation and specific accessibility design remain OPEN.

**Delegated decisions:** Content Owner determines individual case mysteries, clues, communication-recovery circumstances and scripts. Technical Owner delegated specific layout, hint patterns, assessment details, cost model and age-appropriate science formula proposals for research/technical recommendation, not automatic approval. Scientific equations must be genuine, with assumptions and units; avoid impossible calculations for younger players.

**I06 CONFIRMED (2026-10-30): Hybrid Flashback Hotspots.** Interactive reconstructions mix visually discoverable inspection targets with unmarked details requiring careful observation. Inspection reveals limited evidence, never the entire solution. The investigator remains an observer. Exact indicators, difficulty, accessibility and controls remain OPEN. Technical Owner approved option C.

**I05 CONFIRMED (2026-10-30): Interactive Flashbacks (option B).** The player can pause and inspect selected objects, documents, displays or engineering details within a reconstruction. This is an investigative inspection of the past, not time travel or an ability to change historical events. Findings can contribute clues to the ongoing investigation. Exact interactions, controls and scene scope remain OPEN. Approved by Technical Owner.

**I04 CONFIRMED (2026-10-30): Hybrid Flashbacks.** Key clues can unlock limited flashbacks upon discovery; further scenes unlock from meaningful evidence links and deductions. Reconstructed events may show mission design and preparation, with investigator as observer. No scene may give away a full diagnosis. Detailed conditions and format remain OPEN. Approved by Technical Owner.

**I03 — CONFIRMED (2026-10-30): Contextual Feedback via investigator inner monologue.** Creating evidence links gives no immediate right/wrong grade. When testing a hypothesis, the protagonist reflects on contradictions, missing evidence or uncertainty without giving away the true answer. Approved explicitly by the Technical Owner. This supports suspense and avoids trial-and-error correctness indicators. Exact feedback triggers, scripts, voice/text presentation and hint thresholds remain OPEN.

**I02 scope:** The board supports several pieces of evidence per investigation and meaningful editable relationships; a linked group may support a hypothesis, but a drawn line alone is not proof or an automatic correct deduction. Board links must persist as part of the investigation state and integrate with evidence attribution and hypothesis testing. Visual presentation must remain usable in portrait mode.

**Still OPEN for investigation:** board layout and mobile gestures/accessibility, line/link semantics, group thresholds, correctness/feedback of links, incorrect hypothesis handling, hints, flashback unlock conditions, deductions affecting communications, replay, and exact content schema. The Content Owner authors case-specific puzzles and evidence; engineering builds reusable mechanics.

## Engineering gameplay decisions — 2026-10-29

| ID | Decision | Status | Rationale |
|---|---|---|---|
| E01 | The Rescue Mission planner must let the player **construct/configure a mission-specific engineering solution** by selecting spacecraft systems and/or intervention equipment and allocating or adjusting limited resources, rather than merely selecting one of several ready-made designs or a correct-answer quiz. | CONFIRMED | Explicit Main Chat approval of the first, player-designed option. Engineering tradeoffs are central to the mission-design-game challenge. |
| E02 | Use a **Guided Engineering Sandbox**: player-selectable/configurable systems and equipment plus meaningful adjustments to engineering parameters and limited resources, with observable feasibility/resource tradeoffs while designing. Provide guidance and bounded options instead of an unrestricted free-physics sandbox. | CONFIRMED | Technical Owner agreed in Main Chat on 2026-10-29. Preserves the hands-on engineering learning of a flexible sandbox while containing complexity for a three-person, portrait-first game. |
| E03 | Use **mission-specific active constraints and a broader, plausible pool of resource-consuming systems/equipment**; do not explicitly flag every item as relevant or irrelevant to the player's current mission. Some options may provide no useful benefit to that mission, so the player must infer their value from collected evidence and engineering tradeoffs. | CONFIRMED | Technical Owner approved mission-specific resource relevance (option B) with additional non-useful options to avoid an obvious or trivial solution on 2026-10-29. |
| E04 | Use a **single shared Global Budget** across all five alternate-history mission plans; allocating/spending budget on one mission reduces the amount available for other mission plans, making cross-mission prioritization consequential. Mission-specific engineering constraints and other resources remain distinct unless separately approved. | CONFIRMED | Technical Owner explicitly selected the shared-budget option in Main Chat on 2026-10-29. |
| E05 | Plans and Global Budget allocations remain **editable/reallocatable until the player starts Final Evaluation**. Starting the collective final evaluation locks all five plans and allocations together, then reveals their outcomes collectively; submitting an individual plan does not permanently lock its budget. | CONFIRMED | Technical Owner approved the revise-until-final option in Main Chat on 2026-10-29, enabling evidence-driven engineering iteration without premature commitment. |
| E06 | Use a **Hybrid Simulation Engine**: mathematically consistent, testable engineering/resource calculations (e.g., mass, power, fuel where applicable) combined with data-driven, mission-specific intervention/feasibility rules. Do not require a full orbital/physics simulator; correct diagnosis alone must not imply success. | CONFIRMED | Technical Owner explicitly approved Hybrid Simulation in Main Chat on 2026-10-29 to balance genuine engineering learning with achievable scope. |
| E07 | Present and calculate engineering quantities in **real, dimensionally consistent units** (e.g. kg, W, seconds, m/s when relevant), rather than arbitrary Game Points for physical parameters. The shared fictional budget may use a clearly labeled real-world currency unit; this does not imply historically accurate NASA costs. | CONFIRMED | Technical Owner explicitly agreed in Main Chat on 2026-10-29; educational engineering fidelity is a core gameplay requirement. |

**E01 scope:** Keep the existing five simultaneous dossiers, one separate plan submission per case and one collective final outcome reveal. The required solution can be a spacecraft/vehicle configuration **where appropriate**, or a case-specific correction, equipment or operations plan for other historical missions; this decision does not claim that all five require launching a physical rescue spacecraft.

**E03 fairness constraint:** Choices must be engineering-plausible and subject to consistent mass/power/budget/time constraints where applicable; no fabricated resource type purely to mislead, no hidden arbitrary penalty, and no automatic labeling of the optimal option. Educational debrief can explain why a selected component was useful or unnecessary after the collective reveal. The case-specific resource system must remain data-driven within one shared engine.

**E04 framing:** The shared pool is a fictional in-game program/operations budget linking the five counterfactual simulations, **not** a historical claim that NASA pooled these real missions' funding across different years. Do not silently make mission-local mass, fuel, power, time or communications inventories globally transferable.

**E05 semantics:** Each dossier retains one *current* Rescue Mission plan; resubmission replaces/revises that plan before final evaluation rather than creating additional counted mission plans. Recalculate the shared budget view whenever a plan or allocation changes. Treat the start of Final Evaluation as one irreversible lock of the five current plans and budget allocations for that evaluation. Do not reveal individual success/failure before that point.

**E06 scope:** Engineering quantities require documented units, assumptions and tested boundaries; apply only the calculations relevant to each case. Content-defined scenario parameters must be sourced or explicitly labeled illustrative/alternate-history, never passed off as genuine NASA telemetry. The shared pure TypeScript engine combines reusable calculations with reviewed mission-specific conditions. Keep live feasibility diagnostics distinct from the hidden final mission outcomes.

**Still OPEN:** global budget amount/currency, costs and balancing; draft-versus-submitted accounting/presentation details, over-budget handling, exact component inventory, adjustable parameters and safe ranges, specific physical formulas, units/conversions by case and assumptions, per-mission engineering rules/equations, feedback, scoring, data schemas, replay behavior and implementation. E01–E07 approve gameplay direction only; they do **not** authorize coding before competition clearance. Live feasibility feedback must not reveal mission success/failure ahead of the confirmed collective final evaluation.

**Competition gate:** Verify NASA Space Apps 2026 pre-event implementation rules and licensing with official organizers before coding a competition submission. See `docs/COMPETITION_NOTES.md` and `docs/OPEN_QUESTIONS.md`.
