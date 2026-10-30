# CASE:404 — Content Handoff Contract (DRAFT)

Last updated: 2026-10-30

**Status: DRAFT CONTENT SCHEMA, APPROVED GAMEPLAY RULES.** E01–E07 and X01–X07 approve the player-built Guided Engineering Sandbox, case-specific real-unit constraints and a fictional shared Global Budget, with outcomes disclosed only in the collective Final Evaluation. **Latest team decisions V01–V10 supersede inconsistent older content assumptions:** four core present-day rooms; historical observer-only Investigation Flashbacks separate from fictional, changeable Rescue Mission time travel; hybrid cinematic/interactive past presentation; reusable plus mission-specific past locations. No final case list, JSON schema, cost values, equations or authored historical sample data is approved.

## Shared object model — identifiers to agree first

- `missionId`: stable opaque ID, independent of mission display name.
- `evidenceId`: stable ID of a document/recording/clue.
- `roomId`: stable ID of the discovery location, not a screen label.
- `assetId`: stable reference to the asset manifest, not a filename.
- `reconstructionId`: optional stable reference to an **observer-only Investigation Flashback** segment/storyboard.
- A stable past rescue scene reference and explicit **historical-observation vs fictional-intervention mode** are required conceptually (V01/V08); exact field names and schema remain OPEN.

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

**I04/X03 approved:** Author bounded historical **observer-only** Flashbacks on key clue discovery and deeper scenes on supported deductions. Their 2D interactive inspect/zoom/replay approach is approved; exact triggers, scripts, scene counts and art remain OPEN. Flashbacks never permit historical alteration.

**I05/I06 approved:** Content Writer identifies inspectable historical-scene hotspots and the limited evidence or design details they reveal. Mark some readily discoverable and some subtle, with accessible inspection. The player pauses and inspects a reconstruction, but never changes the historical event; exact hotspot assets and scripts remain OPEN.

## Team-approved narrative/room authoring contract — V01–V10 (2026-10-30)

- **Present-day station has four core rooms (V09):** `Investigation Office` is the starting hub and contains five concurrent case dossiers, Evidence Board and Rescue Mission access; `File Archives`, `Recordings Room`, `Signal Room` host their corresponding evidence categories. These are **room types**, not fixed final `roomId` strings. All are enterable; discoveries unlock deeper clues/interactions rather than sequential missions. Authoring must not invent a fifth core room.
- **Historical Investigation Flashback (V01/I04–I06/X03):** authored evidence-bounded observer-mode scenes with provenance, inspectable hotspots, replay links and **no action that changes actual NASA history**.
- **Rescue Mission alternate-history (V01/V02/V08):** distinctly labeled **fictional past intervention**. Content Writer specifies a short entry transition; 2D point-and-click team/object interactions with portrait-based dialogue and limited player choices; and when/how the approved **player-controlled Guided Engineering Mission Builder** can be used. Characters and dialogue give context, not an automatic correct plan. Return to the present reveals **no individual mission verdict**.
- **V10 past environments:** reuse shared setting types with historical-era variations, plus case-specific places when story/science requires them. The number, identity and scene transitions remain case-authored and Designer-approved.
- **For each case, distinguish:** historical NASA fact with source; reconstructed historical observation/uncertainty; fictional changeable past-team interaction; player-chosen design variables; simulated counterfactual consequence; and final historical-versus-simulated educational comparison.
- **Temporary logo V04** belongs to visual assets, not case data; its conceptual direction is approved but no production file delivered. Opening sequence **V05** is ~10 seconds then a slower director call, not the older 30–40s Opportunity opening.
- **Owner boundary:** Content Owner supplies story/verified science/scene requirements; Designer supplies exact artwork, cinematic, portraits and asset variants; Engineer supplies ID/schema validation and shared logic. No new narrative requirement becomes engine code solely because it appears in historical source notes.

## Validation requirements

- Every reference resolves; IDs are unique and stable; no unbounded random strings masquerading as parameters.
- No unsupported invented NASA numerical parameters represented as authentic telemetry.
- No mission-specific imperative code or executable expressions in JSON. Domain rules remain in reviewed engine code.
- Author can supply and revise data independently once schema is approved; files must pass schema/reference tests before merge.

## Pending

Exact JSON/Zod schema, file layout, validation command, content authoring examples and all five case assets are OPEN until Main Chat approves the engineering model and case list.
