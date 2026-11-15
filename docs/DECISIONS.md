# The Astral Archives — Decision Register

> **NEW CONFIRMED PRODUCTION DECISION — 2026-11-15 (P-2026-11-15-01):** The owner approved a strict **300-minute parallel finalization sprint**, with three independently working specialist chats (A Cases/Assets, B Sound/Cinematics, C Scientific/Puzzle Logic), **Main Chat as sole final reviewer, integrator, release/QA lead and pitch/presentation owner**. Scope, exclusive file ownership, T+60/T+150/T+195 gates, handoff criteria and final release definition are authoritative in [PARALLEL_RELEASE_PLAN_2026-11-15.md](production/PARALLEL_RELEASE_PLAN_2026-11-15.md). Each specialist must return a tested handoff before acceptance, and independent checks/failed tests may not be represented as success. Existing `experiment/room-case-library-layout-fix-2026-11-14` remains the canonical *working* branch, not GitHub default `main`. **Newer approved design precedence:** landscape-first, stationary first-person point-and-click, Nadir's actual manual collection / physical folder sorting / 6-of-6 unlock and causal work inside Rescue, four present rooms, no NASA-data fabrication; conflicting legacy portrait, 2-chat, collective-only verdict, mandatory deduction-board gate, and outdated protagonist directions below are historical, not simultaneous requirements.


> **2026-11-09 gameplay update:** See [Gameplay & UX Decisions (2026-11-09)](GAMEPLAY_DESIGN_2026-11-09.md) for the newer designer-approved first-person investigation, folder-based evidence progress, contextual robot assistance, past engineering interaction, and per-mission outcomes. It **supersedes conflicting older gameplay directions**, especially mandatory deduction-board gating and collective-only result reveal. Shared Global Budget, observer-only flashbacks, historical content and responsive orientation have unresolved reconciliation points; do not treat old conflicting prescriptions as simultaneous requirements. Documentation update only; no gameplay implementation.


Last updated: 2026-10-30

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
| T06 | Astronauts stranded aboard a failed spacecraft and restoring communications with them are **illustrative case scenarios, not mandatory conditions for every mission**. The Astral Archives supports crewed and uncrewed crises, with case-specific investigation, appropriate contact/diagnosis steps and rescue or corrective intervention. | CONFIRMED CORRECTION | Technical Owner clarified on 2026-10-29 that the trapped crew was only an example; this overrides any assumption that all five must involve astronaut rescue. |
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
- **I10 CONFIRMED — Investigation is the learning phase of mission design (clarified 2026-10-30):** The player actively studies what went wrong in a real NASA-inspired mission by inspecting failures, past engineering decisions, missing capabilities and actual conditions. This learning informs a **player-composed** rescue/corrective mission: choosing and configuring relevant mission elements and resources in the approved Guided Engineering Sandbox (E01–E07), then testing its consequences in simulation. Investigation is not a detached minigame or a substitute for design; it prepares and motivates the design. Preserve the player's own inference and choice, and avoid reducing the intervention to a multiple-choice answer. Optional self-talk may help the player reason without creating the plan or revealing the answer. Which mission elements apply remains case-specific to the Content Owner.
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

## Delegated implementation decisions — 2026-10-30

| ID | Confirmed choice | Rationale |
|---|---|---|
| X01 | Portrait Evidence Board with dossier filtering, tap-to-link, pan/zoom, accessible drag alternatives. | Keep deduction interactive and mobile-usable. |
| X02 | Hypothesis-triggered contextual investigator self-talk plus optional graduated authored hints. | Preserve player agency without dead ends. |
| X03 | Pause/inspect/zoom interactive 2D flashbacks with clear and subtle hotspots and accessible inspection. | Achievable production scope while supporting observation. |
| X04 | Fictional shared USD-equivalent budget with sum of five current plans; draft previews; final over-budget gate. | Explainable, reversible resource tradeoffs. |
| X05 | Authentic beginner-friendly mass, power, energy and resource arithmetic; advanced formulas only after case-specific scientific validation. | Scientific correctness and age accessibility. |
| X06 | Single frozen five-case final report with separate historical/fictional comparisons and explicit replay/new-session behavior. | No early answer leakage and educational closure. |
| X07 | Stable versioned JSON/domain contracts, local-first autosave/resume, and a narrow one-case test slice only after competition clearance. | Three-person delivery, reliability and growth beyond five cases. |

**Authority:** Technical Owner explicitly delegated research, selection and approval of these seven implementation approaches to Main Chat on 2026-10-30. **Full normative details, exclusions and references:** [IMPLEMENTATION_DECISIONS_2026-10-30.md](IMPLEMENTATION_DECISIONS_2026-10-30.md). These are approved **design contracts**, not evidence of implemented or tested code. Specific content, numeric game costs, mission formulas, final scoring weights, selected package versions and contest eligibility remain OPEN.

**Competition gate:** Verify NASA Space Apps 2026 pre-event implementation rules and licensing with official organizers before coding a competition submission. See `docs/COMPETITION_NOTES.md` and `docs/OPEN_QUESTIONS.md`.

**Team reconciliation rule (2026-10-30):** V01–V10 are the latest explicit team-approved product decisions. Where an earlier D/I/E/X proposal or OPEN statement conflicts with V01–V10, the specific newer V decision prevails. Non-conflicting A01–A03, I01–I10, E01–E07, X01–X07 and T01–T07 remain in force. `CASE404_SOURCE_OF_TRUTH.md` remains an unchanged historical designer record; do not implement its superseded alternatives. In particular, interactive **observer-only Investigation Flashbacks** are not the **changeable alternate-history Rescue Mission**; the present-day core is **four rooms**, and individual mission outcomes remain hidden until collective evaluation.

## Designer-confirmed product clarifications — 2026-10-30

These decisions clarify the prior D-series baseline and supersede contradictory earlier suggestions, without changing A01–A03, I01–I10, E01–E07 or X01–X07.

- **V01 CONFIRMED — Distinct historical modes:** **Investigation Flashback** is an evidence-bounded, interactive replay in which the protagonist observes and inspects historical events but cannot change them (I04–I06/X03 remain intact). **Rescue Mission** is a separate fictional **alternate-history time-travel phase** in which the protagonist can intervene before failure and change the historical mission's design and decisions. Neither mode presents simulated events as actual NASA history.
- **V02 CONFIRMED — Hybrid past intervention:** Rescue Mission combines authored interactions with the historical mission team **and** a player-controlled Guided Engineering Mission Builder. Team interactions provide narrative/context, but do not replace player configuration, resource tradeoffs, or the approved simulation engine. Final success/failure remains hidden until the one collective five-case evaluation; plans and global budget remain editable until that evaluation.
- **V03 CONFIRMED (room types; earlier room-count uncertainty SUPERSEDED by V09):** File Archives, Recordings Room and Signal Room are distinct present-day evidence-discovery spaces. **V09 subsequently confirms exactly four core present-day rooms**, adding Investigation Office as the starting hub; their precise layout/hotspots and any separately approved optional extra spaces remain OPEN. Past Rescue Mission settings are distinct from present-day station rooms. Five cases does not mean five rooms.
- **V04 CONFIRMED — Temporary logo concept:** The most recent designer-approved *concept direction* (an emblem without protagonist, visually blending the three worlds) remains the **temporary logo direction**. The game title is now fixed by V11, but the final logo artwork, title lockup, production-quality simplification, final filename, rights verification and app icon remain pending. Do not claim a committed raster/vector asset or trademark clearance.
- **V05 RECONFIRMED — Introduction:** Brief ~10-second montage through the rocket transition, followed by a slower station-director briefing. An older 30–40s Opportunity concept is not the adopted game intro.
- **V06 RECONFIRMED — Art direction:** Geometric stylized 2D; Past cream/yellow, Station navy/orange, Space purple. Exact HEX tokens open; protagonist retains agreed geometric character specification.
- **V07 RECONFIRMED — Ownership and content:** Three-person ownership per T01; Content/Data Owner selects the final five historical missions. Evidence Board, interactive observer-only Flashbacks and collective results continue per approved I/X decisions.

**Narrative boundary:** A fictional time-travel device/story mechanism is now approved for the Rescue Mission narrative. Implementation must remain an achievable portrait-first, data-driven guided design game; whether past-team scenes use portraits, static room frames or another presentation remains open. Historical source events and speculative alternate-history outcomes must be visibly distinguishable.

## Designer-approved past interaction presentation — 2026-10-30

- **V08 CONFIRMED — Cinematic + Interactive Hybrid (option C):** Each Rescue Mission past-entry uses a short cinematic transition, followed by a stylized 2D point-and-click past environment. Players select historical-team characters and inspect contextual objects/hotspots; character interactions use portrait dialogue and bounded player choices. The player then accesses the mission-specific Guided Engineering Mission Builder to configure the alternate-history intervention. Return to present does not reveal success/failure before collective Final Evaluation.
- **Scope:** Reuse portrait dialogue UI, interaction affordances and Mission Builder across cases. This is not a requirement for full-body animation, continuous cutscenes, free-roaming 3D, or a cinematic for every conversation. Cinematic duration, exact dialogue choices, per-case number of environments, and scene-by-scene storyboarding remain OPEN to Designer/Content Owner agreement.

## Approved station hub and hybrid past environments — 2026-10-30

- **V09 CONFIRMED — Four present-day core rooms:** The shared investigation station has four core rooms: **Investigation Office**, **File Archives**, **Recordings Room**, and **Signal Room**. The Investigation Office is the player's **main starting hub**, where all five case stories/dossiers are presented, evidence is sorted and connected via the approved Evidence Board, and the player can access each dossier's Rescue Mission flow. Archives focuses on files/reports, Recordings on audio/video records, and Signal on communications/telemetry. Navigation retains fixed-view room-to-room point-and-click; all five cases coexist rather than unlocking as linear levels. Exact room map and hotspots remain to be designed. This four-room decision replaces the earlier open total for the **core present station**; optional additional spaces are not approved by inference.
- **V10 CONFIRMED — Hybrid past environments (option C):** Alternate-history Rescue Mission scenes reuse **shared location types** (for example, briefing/engineering spaces) across cases with mission-era-specific visual treatment, plus **distinct mission-specific environments** when the case demands them (for example, a launch or test site). No exact number of past rooms/locations is approved; the Content Owner and Designer will determine requirements per case. Investigation Flashbacks remain observer-only historical reconstructions, separate from changeable Rescue Mission past environments (V01–V02, V08).

## Approved final game title — 2026-10-30

- **V11 CONFIRMED — Official player-facing title: _The Astral Archives_.** This replaces the former working title **CASE:404** (SUPERSEDED as the public game name). Use exactly **The Astral Archives** for the application title, presentation, submission-form description, new designer deliverables and other player-facing references. Prior working titles remain historical provenance only.
- **Technical migration boundary:** the private GitHub repository remains `mahmoud-kun/case404`, and existing filenames, document links and any stable IDs are **not renamed** simply because the display name changed. Use **CASE:404** only as a clearly labeled historical/technical codename when referring to prior records, not as an alternative official game title.
- **Logo status:** V04's temporary three-world, protagonist-free emblem direction is unchanged; actual final logo/title artwork **has not been supplied or approved in the repository**. Await the Designer's image/asset for versioned approval. Title approval is not a claim of trademark availability or cleared logo rights.


## V12–V17 — Current 2026-11-13 interaction decisions and acceptance

This update covers camera/UX/character and experimental work only. For evidence filing, Rescue unlock and results, the explicit **2026-11-09 Gameplay & UX Decisions** prevail over contradictory October collective-only/hypothesis-gate designs.

- **V12 CONFIRMED — Camera format:** First-person bounded **2.5D / stylized 2D**, NO 3D environment/engine, NO 360° rotation, NO full free-roam or walking avatar. Camera movement stays within an authored limited viewpoint and supports mobile/portrait use.
- **V13 CONFIRMED — Incremental execution:** One feature at a time, evidence-based checks before and after, distinct preview, actual player playtest and acceptance. Successful build is not sufficient to call UX accepted. Stop and fix a rejected feature before adding the next.
- **V14 CONFIRMED USER FEEDBACK — Camera V2 REJECTED:** Branch `experiment/interactive-investigation-v2-2026-11-13` currently has V2 (last code commit `5ec662fe`), no bottom arrows, click-drag/touch swipe, READY Vercel preview. Player disliked click-hold laptop control, stiff/awkward focus transition, static/mismatched/blurry backgrounds. Not a production-approved interaction. FPS issue remains unmeasured.
- **V15 CONFIRMED EXPERIENCE GOAL / PROPOSED NEXT IMPLEMENTATION:** Laptop free mouse movement should pan *gaze* without mouse-button hold or visible normal cursor; **Pointer Lock, small reticle, capture/release on Esc** are implementation experiments, NOT yet built or finally adopted. Bounded view; preserve click/tap to inspect, keyboard accessibility, mobile touch fallback.
- **V16 CONFIRMED PAIN / PROPOSED ART DIRECTION:** Static single image and zoom-to-closeup are unsatisfactory. Test separately authored **2D layers (architecture, furniture, interactive prop, foreground/light) in one corner**, then dedicated item closeups, after Camera V3 acceptance. Art production/export details remain pending Designer approval; not 3D.
- **V17 CONFIRMED CHARACTER/ATMOSPHERE:** **Henda is female**, ~25 aerospace engineer/investigator, present through portraits/cinematics not a walking character. Name/identity unfold naturally. Contextual reactions/hints are later proposals, not already implemented. No music or SFX production until user requests it.

**Research ideas, not implementation approvals:** tactile drawer/file, evidence comparison/linking, signal analysis, replayable recordings, deeper Henda state. Evidence-link hypotheses CANNOT become a mandatory Rescue unlocking gate unless the Nov 9 game contract is explicitly changed. See [handoff checkpoint](CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md) for exact branch SHA, preview, failed UX and next step.
