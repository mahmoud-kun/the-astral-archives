# CASE:404 — Approved implementation choices (2026-10-30)

**Status: CONFIRMED — delegated technical/product defaults.** Technical Owner asked Main Chat to research, choose and approve practical implementations for seven unresolved systems on 2026-10-30. These choices refine the existing I01–I10, E01–E07 and P01 direction. They do not approve story facts, specific mission datasets, art assets, NASA eligibility, package versions or writing game code before contest clearance.

## X01 — Portrait Evidence Board

- One navigable graph board, with a per-dossier filter and an All Evidence view. All five dossiers remain concurrent, not level-by-level.
- Tap clue card to focus/read, tap **Link** then another clue card to create a relationship; optional drag to rearrange cards. Pan/zoom supported; **dragging is never the only way** to link or reposition. Provide tap actions and keyboard/focus equivalents.
- Keep manual links and any grouping separate from system-authored relationships. Player hypotheses remain player-authored, never auto-completed by the board. Graph layout positions are UI data, not puzzle correctness.
- Start with a lightweight HTML/SVG board, responsive to portrait, without a mandatory third-party canvas/graph editor. Case sorting can be changed until final evaluation; no instant right/wrong marker on reassignment.
- Acceptance: links can be created, removed, edited and reviewed at mobile portrait width with tap-only and keyboard controls; cross-case filter preserves all links.

## X02 — Graduated, optional investigator self-talk hints

- After testing a hypothesis, display one context-sensitive internal reflection about a contradiction, uncertainty or missing support. Do not classify individual links right/wrong.
- Separate optional **Need a Hint** action: level 1 directs attention to a source type/room; level 2 to an already-reachable object or relationship; level 3 identifies a next reasoning action, never the final diagnosis. Hints may only refer to available/accessible facts.
- No timed nagging, unlimited penalty, automatic answer reveal or generative AI required. Author hints with stable IDs in case content; no repeated unsolicited voice lines.
- Acceptance: no leak of hidden mission outcome or unseen evidence; player can progress without opening hints. Content Writer writes actual protagonist lines.

## X03 — Flashback inspection

- Interactive 2D reconstructed scene or illustrated sequence with authored hotspot overlays. Player can pause, inspect, zoom and return; replay available from evidence records.
- Mix marked and subtly unmarked inspectable details per I06. Never require a precision pixel hunt: offer **Inspect Mode** that magnifies/focuses regions, and accessible sequential hotspot navigation, including subtly hidden targets without labeling which ones are important.
- Inspector is an observer; inspecting cannot alter past events. Every discovery has stable evidence, flashback and asset IDs. Historical/reconstructed/alternate-history scenes must be labeled.
- Acceptance: touch, keyboard and mouse inspection; replay and no one-clue full-answer leakage. Avoid full free-roaming 3D or pre-rendered interactive video requirements.

## X04 — Shared program budget: rule model

- Fictional **USD-equivalent program budget** across five dossiers, expressly a game-wide alternate-history resource, not historical NASA program spending.
- Every configured component/action has a nonnegative case-authored cost; session computes **sum of the five current plan costs** and remaining global budget. Never double-count an edited/replaced plan.
- Draft previews show projected total and projected remaining. A saved plan replaces previous plan allocation; edits and redistribution remain unrestricted until Final Evaluation starts (E05).
- Over-budget plans may be explored as drafts with visible warning, but **Final Evaluation is blocked** until all five submitted plans fit the global cap and other hard input validity checks. Do not imply a plan will succeed merely because it fits budget.
- Exact total, cost table and balancing are **pending content/engineering scenario review**; do not invent NASA-backed prices.
- Acceptance: aggregation, plan edits, negative remainder warnings, final gate and deterministic cost calculations tested.

## X05 — Real engineering calculations, youth-friendly UI

- Use genuine dimensional arithmetic for relevant contexts, chiefly **total mass = sum of selected component masses**, **power margin = supply W - demand W**, **energy needed Wh = load W × duration h**, and **resource/cost totals**. Fuel/propulsion/trajectory calculations only where justified and scientifically checked for an actual selected case; never invent arbitrary 'real' rocket formula inputs.
- Display units, margins and plain-language consequences. The player configures/selects parts and interprets tradeoffs; engine automatically calculates arithmetic, with optional expandable explanation for learners.
- Three educational steps: observe a warning, change one component/parameter, inspect the updated calculation. Avoid requiring manual advanced algebra, orbital mechanics or hidden physics from elementary/middle-school players.
- Case-specific numeric values must be verified with sources or labeled as illustrative alternate-history examples; physical units must remain authentic.
- Acceptance: unit and boundary tests, traceable assumptions, impossible configurations flagged as feasibility rather than automatic mission outcome.

## X06 — Final Evaluation and replay

- **One collective Final Evaluation** after five submitted plans and valid budget. Freeze current plans together. No win/loss displayed earlier.
- A single combined report with a card for each case: historical NASA outcome vs alternate-history simulation result, explanation of clue interpretation, the chosen intervention and relevant resource tradeoffs. Show understandable outcome status, not just a raw number.
- Prefer explanation-led assessment: categories for investigation quality, intervention suitability and engineering/resource feasibility. Detailed numeric score/weights are deferred until five cases and measurable criteria are authored; do not fabricate a 0–100 formula now.
- Replay offers (a) inspection of report/evidence and (b) **New Simulation** from a clearly separate fresh session; do not silently overwrite the completed snapshot. Design a new-round reset flow, not five independent per-case early outcomes.
- Acceptance: deterministic final report, one lock event, no early disclosure, full historical-vs-fiction attribution and explicit restart.

## X07 — Data contracts, saving and vertical slice

- Data-driven schema versioned JSON for mission, room, clue, hypothesis/relationship, flashback, equipment/parameters, rule descriptors and asset manifest. Every cross-reference is stable-ID-backed and validated. Use TypeScript discriminated union models and runtime validation; exact validator package remains pending current-version verification.
- Maintain player session separately: room, discovered/assigned clues, board links/layout, hypothesis tests, unlocked flashbacks, current five plans, budget and frozen evaluation snapshot.
- **Local-first resume**: persist compact versioned progress in browser storage, autosave at meaningful transitions, read/validate/migrate on start, handle quota/disabled storage errors without falsely reporting success. Prefer IndexedDB for scalable saves; use a small adapter so backend/cloud is not needed. Browser data is not guaranteed permanent; user-visible local-save limitations and reset/export policy need final UX.
- First technical vertical slice **after NASA eligibility clearance**: one station room, two inspectable clues, board link and hypothesis reflection, one interactive flashback, one case-specific basic engineering calculation, save/resume and simulated final evaluation in a test fixture. **Do not treat one-case mock final as approval to change the five-case final reveal in the real game.**
- Tests: schema/reference validity, touch/tap/keyboard, save/resume, graph state, science units, shared-budget edits, final snapshot and no early outcome. Minimum usable accessibility target WCAG 2.2 AA; aim for 44 CSS px targets where practical, with 24 px AA minimum/spacing exceptions.

## Still delegated / gated

- Content Owner chooses actual cases, factual sources, authored puzzle conditions, feedback/monologue text, hotspot discoveries, case-specific rule requirements, real versus illustrative measurements, NASA attribution.
- Designer chooses visual appearance, art/animation, portrait layout styling and interaction affordances within touch/accessibility constraints.
- Main/technical review must approve **specific** mission calculations, cost balancing, final scoring weights, story data and any change in core game mechanics after content arrives.
- NASA Space Apps 2026 pre-event implementation eligibility and media licensing are an explicit **implementation gate**; this document alone is not permission to start coding.
- These choices intentionally avoid a large graph/canvas framework, generative AI hints, 3D flashbacks, costly server/cloud, faux-real scientific telemetry and fixed five-case story assumptions.

## Research basis (consulted 2026-10-30)

- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/ (drag alternative 2.5.7, target sizes 2.5.8).
- NASA JPL Marsbound!: https://www.jpl.nasa.gov/edu/resources/lesson-plan/marsbound-mission-to-the-red-planet/ (mass, power, budget tradeoffs for educational missions).
- Return of the Obra Dinn developer explanation of grouped validation: https://steamcommunity.com/app/653530/discussions/0/1732090362049101021/ (avoid per-clue instant verdict; use as inspiration, not identical lock policy).
- Outer Wilds ship-log connection pattern (secondary reference): https://nh.outerwildsmods.com/guides/ship-log/
- MDN browser local storage: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API and https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
