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
