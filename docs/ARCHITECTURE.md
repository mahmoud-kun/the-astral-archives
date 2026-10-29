# CASE:404 — Architecture Decision Draft

Last updated: 2026-10-29

**STATUS: PROPOSED — NOT APPROVED.** The Main chat should ratify this before project-specific implementation. Confirm contest timing before writing submission code.

## Primary goal

Create a polished portrait-first point-and-click mystery/engineering game whose code and logic can be written independently of content and art. Five missions share scene navigation, evidence mechanics, planning and deferred final evaluation.

## Recommended foundation

- **React + TypeScript + Vite** for static client-side application, not a conventional website layout.
- **Pure TypeScript domain engine** for evidence attribution, resources, feasibility and evaluation; no React imports, DOM APIs, or network calls in engine.
- **JSON case data** validated at load/build time (prefer a schema library such as Zod after baseline review). Do not execute JS or arbitrary expressions from JSON.
- **Asset manifest** maps stable `assetId` to file path/media metadata; placeholders implement the same IDs and are replaced without changes to gameplay logic.
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

## State/data contract principles

- Stable `missionId`, `evidenceId`, `roomId`, `assetId`; explicit version field for persisted saves.
- Event flow: inspect -> collect -> assign -> diagnose -> plan -> submit -> final evaluate.
- **Separate submitted plan from outcome visibility**. Do not calculate/disclose per-case win/loss through UI before collective reveal.
- Mission plan includes case-specific intervention, timing, constraints and resource budgets. Exact fields, units, and rules require content/design approval.
- Historical NASA facts and game reconstruction/fiction are explicitly labeled with provenance and uncertainty.
- Invalid content blocks a development build with useful diagnostics; do not silently substitute fabricated mission facts/assets.

## Acceptance approach

- First authorized implementation is a **one-room/one-case vertical slice** using fictional, labeled placeholder content; scale to five confirmed cases once contracts are validated.
- Verify stable replacement of image/audio/text data without modifying domain logic.
- Write tests for cross-reference validity, pure simulation constraints, no early result reveal and portrait navigation/back behavior.
- No backend/database server, queues, Unity/Godot switch, heavy state abstraction or AI API without a new decision record.
