# CASE:404 — Content Handoff Contract (DRAFT)

Last updated: 2026-10-29

**Status: INTERFACE PROPOSAL ONLY.** E01 confirms a player-composed mission-specific engineering planner (systems/equipment selection plus resource allocation), but no exact case list, data schema, numerical rules or sample historical values have been approved.

## Shared object model — identifiers to agree first

- `missionId`: stable opaque ID, independent of mission display name.
- `evidenceId`: stable ID of a document/recording/clue.
- `roomId`: stable ID of the discovery location, not a screen label.
- `assetId`: stable reference to the asset manifest, not a filename.
- `reconstructionId`: optional stable reference to a segment/storyboard.

## Minimum content authoring questions per case

- Actual NASA mission name, objective, year, authoritative URL, historical facts and confidence/uncertainty.
- Alternate-history framing, diagnosis/symptom, stage of mission, possible intervention windows and deadlines.
- Evidence record with source location, player-facing text, media reference, provenance and responsible mission.
- Plausible wrong hypotheses and why evidence rules them out; avoid giving complete answer on one clue.
- Engineering decisions available to the player, resource constraints, units, feasible/failed branches and rationale.
- Explicit labels for **historical facts** versus **fictional documents/reconstruction and simulated outcomes**.
- Post-game educational comparison with verified original NASA outcome.

## Validation requirements

- Every reference resolves; IDs are unique and stable; no unbounded random strings masquerading as parameters.
- No unsupported invented NASA numerical parameters represented as authentic telemetry.
- No mission-specific imperative code or executable expressions in JSON. Domain rules remain in reviewed engine code.
- Author can supply and revise data independently once schema is approved; files must pass schema/reference tests before merge.

## Pending

Exact JSON/Zod schema, file layout, validation command, content authoring examples and all five case assets are OPEN until Main Chat approves the engineering model and case list.
