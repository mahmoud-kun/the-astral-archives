# CASE:404 — Architecture Decision — Approved Foundation

Last updated: 2026-10-29

**STATUS: FOUNDATION APPROVED (A01–A03, 2026-10-29).** Main Chat approved the Web-first stack, separation of pure simulation from UI, JSON-driven content, and manifest-based placeholder assets. Detailed simulation rules, data schemas and deployment specifics remain OPEN. Approval is **not** permission to begin competition implementation before official timing/eligibility is cleared.

## Primary goal

Create a polished portrait-first point-and-click mystery/engineering game whose code and logic can be written independently of content and art. Five missions share scene navigation, evidence mechanics, planning and deferred final evaluation.

## Approved foundation (A01–A03)

- **React + strict TypeScript + Vite** for a static, portrait-first Web game accessed from mobile and desktop browsers, not a conventional website layout.
- **Pure, deterministic TypeScript domain/simulation engine** for evidence attribution, resources, feasibility and evaluation; no React imports, DOM APIs, or network calls in the engine.
- **Validated, data-driven JSON scene/mission content** with stable identifiers; no executable JS or arbitrary expressions in mission JSON. Exact schemas and validator dependency versions remain OPEN.
- **Manifest-driven assets**: stable `assetId` maps to media path and metadata; approved placeholders keep IDs unchanged until designer delivery. Validate missing references before integration.
- **No backend or mandatory online service for v1** without a new approval.

## Proposed implementation details (not yet individually ratified)

- **Client-only save** with explicit save schema version/migration once persistence needs are agreed. No mandatory backend, login or cloud service.
- Use CSS/HTML with accessible hotspots and overlays on scene artwork; scene hotspot coordinates should be relative to intrinsic art dimensions, not raw device pixels. Preserve aspect ratio and accurate hit regions at narrow portrait widths.
- Use light animations/appropriate video files from the designer. Evaluate Phaser or other engine only if a validated gameplay feature requires canvas scene handling, sprites/physics or complex timelines.
- Use a small state store only if prop threading and cross-screen persistence become meaningful; Zustand is a candidate, not a requirement.

## Module boundaries (future, not generated code)

```
src/
  app/           # screen flow, bootstrapping, routing
  game/
    domain/      # mission/evidence/plan types and pure rules
    simulation/  # deterministic feasibility and scoring functions
    content/     # schema validation and reference checking
    state/       # game session and save/load adapter
  scenes/        # room/hotspot and reconstruction views
  ui/            # reusable accessible display controls
content/
  missions/      # authored case data
  rooms/         # authored hotspot/room data
  assets.json    # manifest mapping stable IDs to media
public/assets/   # approved assets; placeholders until delivered
tests/           # domain + integration + layout tests
```

This layout is a **target after scaffolding**, not evidence that these directories/files already exist.

## Approved engineering gameplay direction (E01 — 2026-10-29)

- The Rescue Mission planner is **player-composed**: the player selects/configures appropriate spacecraft subsystems or intervention equipment and manages constrained resources, **not** simply a preset mission-design choice or diagnosis quiz.
- The shared pure TypeScript domain engine must support data-driven, mission-specific design/feasibility rules; some cases involve spacecraft/vehicle design while others require pre-launch correction or operations/intervention planning. Do not force a physical rescue craft into every historical case.
- Exact resource dimensions, component catalogues, equations, units, validation limits, tradeoff UI, scoring, and outcome logic are still **OPEN**; they are not implied by approving E01.
- Existing confirmed flow remains: five concurrent investigation dossiers, a separately submitted plan per dossier and **one collective final reveal** without early outcome leakage.

## Approved sandbox gameplay (E02 — 2026-10-29)

- Implement the engineering experience as a **Guided Engineering Sandbox**, not a fixed-design picker and not an unrestricted physics simulator.
- Players configure relevant systems/equipment and adjust meaningful resource/engineering parameters. The planner gives understandable *feasibility/tradeoff* feedback so the player can learn through iteration.
- Feasibility diagnostics (e.g., resource over-budget) are separate from mission outcome; continue to hide per-mission success/failure until the one collective final evaluation.
- Different NASA missions may expose different engineering parameters and intervention types; keep the shared engine and mission-specific content/data distinct.
- **OPEN:** exact components, parameter ranges/units, numerical equations, feedback thresholds/UI and scoring. An illustrative sandbox interaction is **not** an approved scientific model.

## Approved mission-specific resources and plausible distractors (E03 — 2026-10-29)

- Keep one shared deterministic engine; each case supplies its own relevant resource constraints, engineering context and allowable equipment/operation choices.
- Offer a broader catalogue of plausible systems/equipment. Some items may be unnecessary for a particular case; **do not label the useful subset in advance**. Evidence and engineering reasoning should help players distinguish valuable from unnecessary choices.
- Avoid meaningless fake resource counters or arbitrary gotchas: options must have understandable real costs (when selected, e.g. mass, power, time or budget) and consistent evaluation effects. An irrelevant option need not be harmful by itself, but it can consume finite resources.
- The player can receive neutral feasibility diagnostics without disclosing whether the intervention will succeed before the combined final reveal.
- **OPEN:** the precise equipment catalogue, which constraints apply per case, quantitative costs, penalty/score rules, difficulty balancing and schema.

## Approved cross-mission Global Budget (E04 — 2026-10-29)

- All five mission plans share one **fictional program budget pool**. A budget allocation or expense for any one mission decreases the amount available for the other four; the planner must account for the aggregate rather than assessing each mission's money independently.
- Preserve **mission-specific** equipment/engineering constraints (such as spacecraft mass, power, fuel, timing and communications) unless another explicit decision introduces shared inventory. The common budget must not be presented as historically real NASA cross-era financing.
- Model the budget in shared game/session state, with plan-level allocations and a deterministic budget feasibility calculation independent of React; retain the existing delayed collective outcome reveal.
- **E05 APPROVED:** submitted and draft plans may be revised, and their shared-budget allocations redistributed, up until starting Final Evaluation. One current plan per mission dossier; submitting a new revision replaces the previous active plan, not a new simultaneous expense. Recompute aggregate budget usage from current plan allocations.
- **Final Evaluation boundary:** on the player's final-evaluation action, freeze a consistent snapshot of all five current plans and allocations at once; calculate/reveal outcomes only in the collective final report. Individual submission remains a neutral acknowledgement, not a final budget lock or outcome.
- **OPEN:** exact budget amount and units, cost table, whether/how unfinished drafts count toward the displayed reserved budget, handling over-budget submissions, post-evaluation replay, and difficulty tuning.

## Approved hybrid simulation model (E06 — 2026-10-29)

- Use a **Hybrid Simulation Engine** built from (1) reusable pure TypeScript resource/engineering calculations and (2) validated, mission-specific intervention and feasibility rules supplied through data and interpreted by reviewed domain code.
- **E07 APPROVED:** calculate and display relevant physical constraints using dimensionally consistent real-world units (such as kg, W, s and m/s), not arbitrary physical Game Points. Define conversions and validate dimensional consistency; not every case needs every measurement. Fictional budget currency is clearly distinguished from historical NASA costs. Record all assumptions and deterministic boundary behavior.
- A mission intervention is evaluated against both physical feasibility and case-specific root cause, timing and operating conditions. A correct diagnosis alone does not guarantee mission success.
- Avoid implementing a full orbital/physics sandbox without a separately demonstrated need and approval; don't present illustrative numbers or alternate-history parameters as authentic NASA readings.
- Neutral design-time feasibility feedback remains allowed; **success, partial-success and failure verdicts must remain hidden** until the collective Final Evaluation.
- **OPEN:** specific formulas, numeric ranges, fidelity levels, case-specific rule semantics, calculation inputs, content schemas, scoring weights and scientific review tests.

## Approved hybrid investigation/deduction model (I01 — 2026-10-30)

- Investigation remains freeform across the same connected station rooms and five mixed mission dossiers. Player actions collect/inspect evidence and assign it to mission files.
- A **Hybrid Deduction** layer lets players deliberately connect gathered evidence, formulate or select contextual hypotheses, and test their relationships; provide bounded guidance when a relevant set of clues exists rather than a fully guided quiz or automatically solved mystery.
- Maintain explicit evidence, assignment, link and hypothesis states. Content supplies evidence relationships and reconstruction triggers via validated data; reviewed engine code evaluates actions deterministically without executable case scripts.
- No single clue should expose the entire cause. A reconstruction/flashback reveals only bounded information consistent with acquired evidence, including relevant mission-design history when authored.
- No premature final correctness or rescue outcome reveal; any hint/consistency feedback must respect the established collective Final Evaluation.
- **OPEN:** UI interaction method, link cardinality, clue thresholds, hypothesis validation and wrong-answer policy, hints, reconstruction unlocking details and case-specific authoring schema.

## Approved multi-evidence board (I02 — 2026-10-30)

- The investigation has a functional **Evidence Board**: the player places and rearranges multiple discovered clues and creates/removes visible relationships between them.
- Player-created relationships feed the underlying Hybrid Deduction and hypothesis systems; rendering lines or proximity alone must never auto-solve a case.
- Treat board composition and link state as explicit, stable-ID-backed investigation state; keep graph validity/meaning separate from visual drag/drop details and screen coordinates.
- Must be feasible on mobile portrait, with accessible non-drag alternatives to be designed. Case content supplies evidence relationship logic through validated data, not imperative scripts.
- **OPEN:** exact drawing/interaction model, graph semantics, auto-layout vs manual pin positions, incorrect-link feedback, hint thresholds and reconstruction triggers.

## State/data contract principles

- Stable `missionId`, `evidenceId`, `roomId`, `assetId`; explicit version field for persisted saves.
- Event flow: inspect -> collect -> assign -> diagnose -> plan -> submit -> final evaluate.
- **Separate submitted plan from outcome visibility**. Do not calculate/disclose per-case win/loss through UI before collective reveal.
- Mission plan includes case-specific intervention, timing, constraints and resource budgets. Exact fields, units, and rules require content/design approval.
- Historical NASA facts and game reconstruction/fiction are explicitly labeled with provenance and uncertainty.
- Invalid content blocks a development build with useful diagnostics; do not silently substitute fabricated mission facts/assets.

## Proposed acceptance approach (after competition clearance)

- Suggested first authorized implementation is a **one-room/one-case vertical slice** using fictional, labeled placeholder content; scale to five confirmed cases once contracts are validated.
- Verify stable replacement of image/audio/text data without modifying domain logic.
- Write tests for cross-reference validity, pure simulation constraints, no early result reveal and portrait navigation/back behavior.
- No backend/database server, queues, Unity/Godot switch, heavy state abstraction or AI API without a new decision record.
