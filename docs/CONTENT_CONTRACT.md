# CASE:404 — Content Handoff Contract (DRAFT)

Last updated: 2026-10-29

**Status: INTERFACE PROPOSAL ONLY.** E01–E06 confirm a player-composed Guided Engineering Sandbox with case-specific resources, plausible non-essential equipment, one fictional shared Global Budget and a Hybrid Simulation Engine combining consistent engineering calculations with mission-specific rules. No exact case list, schema, numerical budget amounts, formulas or historical sample values have been approved.

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
- Engineering decisions available to the player, case-specific resource constraints and units, a plausible selectable catalogue that may include non-essential options, explainable option costs against the **fictional shared program budget**, feasible/failed branches and educational rationale. Specify which shared physical calculations and which case-specific rule conditions apply; record sources or mark modeled quantities as illustrative. Keep budget allocations distinguishable from case-local physical resources; do not identify the optimal subset to players upfront or invent fake resource types to trick them.
- Explicit labels for **historical facts** versus **fictional documents/reconstruction and simulated outcomes**.
- Post-game educational comparison with verified original NASA outcome.

## Approved investigation direction (I01); content interface remains DRAFT

- Authors should distinguish inspectable clues, the source object/room, their mission attribution, meaningful relationships to other clues, and any supported hypothesis or contradiction.
- Specify evidence-bounded flashback/reconstruction beats (including relevant mission-design history where appropriate), rather than exposing the entire cause on first inspection.
- Supply data for **Hybrid Deduction** and the approved functional **Evidence Board (I02)**: player-driven multi-clue relationships and hypothesis reasoning with bounded guidance. Relationships must reference stable evidence IDs, not image geometry or card placement. Exact graph semantics, required clue count, hint policy and wrong-hypothesis handling are **OPEN** until separately approved.
- Any communications-restoration steps are mission-specific narrative/engineering content, **not** universal to crewed and uncrewed cases.

**I03 approved:** Content Writer supplies optional investigator internal-monologue responses after hypothesis testing: uncertainty, contradiction, or missing evidence, grounded in clues already available to the player. No immediate link correctness or unearned solutions. Exact script, feedback thresholds and text/voice delivery remain OPEN.

**I04 approved:** Author limited flashbacks on key clue discovery, with deeper segments triggered by deductions. Keep mission-design historical scenes distinct from simulated interpretations. Exact conditions and presentation are OPEN.

## Validation requirements

- Every reference resolves; IDs are unique and stable; no unbounded random strings masquerading as parameters.
- No unsupported invented NASA numerical parameters represented as authentic telemetry.
- No mission-specific imperative code or executable expressions in JSON. Domain rules remain in reviewed engine code.
- Author can supply and revise data independently once schema is approved; files must pass schema/reference tests before merge.

## Pending

Exact JSON/Zod schema, file layout, validation command, content authoring examples and all five case assets are OPEN until Main Chat approves the engineering model and case list.
