# The Astral Archives — Current Open Questions (after team reconciliation)

Last updated: 2026-10-30
**Status:** Unresolved details ONLY. This file is not permission to implement or replace an approved decision.

## Canonical decision precedence

1. **Most recent team approvals V01–V11 in [DECISIONS.md](DECISIONS.md)** control any conflicting older proposals or OPEN labels.
2. Existing **D/T/A/I/E/X/P decisions remain approved** where compatible with V01–V10. See [Implementation Decisions](IMPLEMENTATION_DECISIONS_2026-10-30.md) for approved X01–X07 design defaults.
3. [CASE404_SOURCE_OF_TRUTH.md](CASE404_SOURCE_OF_TRUTH.md) is the **unchanged original historical designer record**, NOT the present implementation specification. Its proposed five-room maps, source-era ownership labels and other superseded text must not override newer team decisions.

## Settled — never treat as OPEN again

- **Official game title (V11): _The Astral Archives_** (replaces old working title CASE:404). The final production logo artwork/lockup is still pending; logo rights/trademark checks are separate from title approval. The `case404` repository path remains unchanged.

- **Five simultaneous mission dossiers**, not five sequential levels. Five cases are current demo scope (T07); exact NASA mission selection belongs to Content Owner.
- **Four core present-day station rooms (V09):** Investigation Office (start, case dossiers, Evidence Board, Rescue Mission access), File Archives, Recordings Room and Signal Room. Room-to-room point-and-click; base rooms are accessible, while deeper evidence/sub-interactions may unlock progressively (I09). **No fifth core room is approved.**
- **Two different past modes (V01–V02, V08):**
  - **Investigation Flashbacks:** interactive, replayable, evidence-bounded observation/inspection of history; the protagonist **cannot change** events (I04–I06/X03).
  - **Rescue Mission alternate-history time travel:** fictional changeable past, with **short arrival cinematic**, 2D point-and-click mission-team/object interaction, portrait dialogue and player-built engineering mission design; choices affect **counterfactual simulation**, never NASA's real history.
- **Past environments (V10):** reuse shared location types with historical-era variants and add distinctive mission-specific places where required. Their exact number is NOT approved.
- **Temporary logo (V04):** concept without protagonist blending Past/Station/Space; **not** an exported final asset, final title lockup or shipped app icon.
- **Opening V05:** ~10-second montage through rocket transition, then slower director briefing; earlier 30–40-second Opportunity opening is not the adopted intro.
- **Art V06:** geometric stylized 2D, Past cream/yellow, Station navy/orange, Space purple; character choices retained.
- **Investigation I01–I10:** player infers hypotheses; Evidence Board with editable links; contextual self-talk; discoveries unlock deeper clues/Flashbacks; investigation teaches the player what they need to compose a corrective/rescue mission.
- **Engineering E01–E07/X04–X05:** player-configured Guided Engineering Sandbox, case-relevant options, correct unit-based calculations, one fictional shared Global Budget across **five editable plans** until final action, deterministic hybrid simulation. Do **not** replace by preset rescue answer, universal crewed rescue, historical cross-era NASA funding, or full physics simulator without approval.
- **Outcome E05/X06:** one **collective Final Evaluation** after all five case plans, no per-case outcome revealed on submission; explanatory report and separate replay/reset.
- **Technology A01–A03/X01–X03/X07/P01:** React + strict TypeScript + Vite; pure TypeScript simulation, validated data and stable asset IDs, no backend required for v1, portrait/mobile evidence interactions, local-first save/resume, accessible inspection and hints.
- **Ownership T01:** Software Engineer/Technical Owner, Designer, Data Analyst/Content Owner (team of three). The Content Owner selects historical missions; the Designer produces visual assets.

## Must resolve before production implementation

1. **NASA 2026 rules:** verify official eligibility, pre-event prep/code/asset permissions, event and submission timing, licensing, original versus third-party asset requirements; no game coding solely on the authority of planning documents. See [COMPETITION_NOTES.md](COMPETITION_NOTES.md).
2. **Case content and historical provenance:** final five mission identities, sourced failure analyses, historical timelines, factual vs fictional boundaries and educational learning objectives. Content Owner owns initial proposals.
3. **Cross-era narrative / time-travel rules:** how the present-day station encounters missions from different years, what the fictional travel permits, how the return is represented, and how to avoid suggesting altered NASA history is fact. V01 approves the **premise**, not physical time-travel realism or mission-specific scripts.
4. **Mission design and operations per case:** actual player-adjustable components/parameters, scenarios and mission phases, authenticated or clearly illustrative parameter values, feasibility and operating rules, formulas/units, test evidence and assumptions. E01–E07 approve **approach**, not case data.
5. **Content/asset schemas and vertical slice:** exact JSON/Zod structures, stable cross-reference checks, acceptance fixture, named asset manifests and accessibility tests before any authorized build.

## Remaining design/content specifications — approved approach, unfinalized details

### Present investigation and flashbacks
- V09 room connectivity/map, object and hotspot inventories, per-case evidence placement and progressive sub-interaction gates. **Core room count is fixed at four.**
- Evidence attribution: incorrect assignments/reassignment already permitted by X01; define case rules for how evidence links and invalid classifications influence deductions and the final report without instant right/wrong leaks.
- Evidence Board link semantics, hypothesis representation/validation, cross-case links, input details, mobile fallback and usability balancing; X01's tap-to-link/pan-zoom and I08's own-inference requirement stand.
- Author hint/monologue lines, which learned facts trigger each optional hint level, replay behavior and avoidance of early answers (I03/X02).
- Flashback storyboard, triggers, bounded discoveries, target visibility proportions, accessible inspection interactions, pauses/zoom, number of scenes, art formats. **Observer-only mode is fixed; do not interpret it as Rescue Mission time travel.**

### Alternate-history Rescue Mission
- Case-specific historical-team characters and dialogue branches, which past objects are inspectable, transition timing and mission-era scene details within V08's **cinematic + interactive** presentation.
- Location reuse plan vs mission-specific past settings (V10); count, topology and export list remain with Content Owner + Designer.
- When the Guided Engineering Mission Builder becomes accessible in each narrative, what insights/requirements from the investigation feed it, exact feedback/UI and permitted intervention windows.
- Appropriate contact-restoration mechanics **only in missions that need them**; not all selected missions need a trapped crew or a new rescue spacecraft.

### Engineering, final report and technical integration
- Fictional Global Budget numeric amount and cost table, provisional draft accounting and feedback, case-specific feasibility and balance; X04 fixes aggregate behavior and final over-budget gate.
- Physics inputs, real-world/alternate-history parameter sources, simulation fidelity and unit tests by case; X05 fixes youth-friendly mass/power/energy basics, not detailed per-case formulas.
- Final evaluation criteria, partial outcomes, score weights, report copy and case-specific education comparisons; one collective reveal is fixed by X06.
- Save schema/migration/export/reset UX; production browser targets, deployment/offline/PWA, performance, accessibility and media fallbacks. IndexedDB approach is an approved default, not a deployed save.
- Optional runtime dependency choices and pinned versions; React Flow/Phaser are **not** automatically approved.
- Temp logo export, final logo/title lockup, branding/trademark/asset rights, palette HEX, room/background dimensions and final audio/animation asset lists.
- License, NASA/third-party asset provenance and repo-publication requirements.

## Ownership and handoff

- **Content Owner:** case selection, verified facts, clues/hypothesis graph, flashback/reconstruction beats, actual time-travel team dialogue, mission-specific systems/operations/rules, labels and sources.
- **Designer:** four core station room arts, temporary logo production iteration, past scene styles/shared and mission-specific environments, character portraits/expressions, transitions, UI, audio and hotspot visualization; assets referenced by stable IDs.
- **Engineer:** typed engine/content/asset contracts, accessible portrait UI, deterministic simulation, aggregate state/evaluation, save/restore and tests — only once the competition implementation gate is cleared.
- **Main Chat:** approve new or changed decisions, review Content/Designer handoffs for contradictions, record updates. **Do not silently expand story or engineering scope.**

## Superseded wording removed from the live backlog

Earlier notes calling the core room count open, treating interactive Flashbacks as the only past mode, treating all past locations as undefined, calling the approved logo concept an unchosen proposal, or describing X01–X07 methods as undecided are **historical, not current requirements**. For their original context, consult the preserved designer brief and Git history; do not copy those older states into new work.
