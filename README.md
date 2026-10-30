# CASE:404

Last updated: 2026-10-30

CASE:404 is a **portrait-first stylized 2D forensic space-mission investigation and engineering game** planned for NASA Space Apps Challenge 2026. The player investigates five concurrent NASA-inspired mission dossiers in a four-room station, learns from real historical failure evidence, then enters **distinctly fictional alternate-history Rescue Missions** to interact with past mission teams, build engineering interventions and simulate counterfactual results. The five outcomes are disclosed together at Final Evaluation, not after each case.

**Status:** Pre-production documentation. **No game code, production assets, verified content dataset, or completed simulation is present in this repository yet.** The team must verify competition eligibility/timing before implementing a submission.

## Where truth lives

1. [`docs/DECISIONS.md`](docs/DECISIONS.md): current team working baseline and explicitly accepted decisions, including later corrections.
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): approved architecture/gameplay constraints **plus clearly labeled proposed technical details**; not every sentence is separately ratified.
3. [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md): current **unresolved details only**, reconciled against latest team decisions; never infer approval.
4. [`docs/CASE404_SOURCE_OF_TRUTH.md`](docs/CASE404_SOURCE_OF_TRUTH.md): original designer-supplied discussion record, preserved verbatim for provenance; not every idea inside it is an approved implementation requirement.
5. [`AGENTS.md`](AGENTS.md): mandatory operating instructions for Codex and other engineering agents.

**Precedence:** the explicit latest team decisions **V01–V10** in `DECISIONS.md` supersede inconsistent older proposals/open statements; compatible older confirmed decisions remain valid. `CASE404_SOURCE_OF_TRUTH.md` remains an unchanged historical input, **not a competing live specification**. For a new conflict not covered by a confirmed decision, ask Main Chat and reconcile it in the relevant current file. See [`docs/CONTENT_CONTRACT.md`](docs/CONTENT_CONTRACT.md), [`docs/ASSET_CONTRACT.md`](docs/ASSET_CONTRACT.md) and [`docs/IMPLEMENTATION_DECISIONS_2026-10-30.md`](docs/IMPLEMENTATION_DECISIONS_2026-10-30.md) for owner handoffs and approved defaults.

## Team

- **Software Engineer / Technical Owner:** architecture, game/simulation logic, implementation, integration, tests.
- **Designer:** UX/art direction, scenes, sprites, animations, visuals and audio asset delivery.
- **Data Analyst / Content Owner:** NASA research, historical validation, mission narratives, evidence design, scenario datasets.

## Working model

- **Main chat:** product decisions, tradeoffs, scope approval, integration ownership and release acceptance.
- **Technical chat:** one bounded implementation batch at a time; review source, implement, validate, send concise handoff; no autonomous product decisions.
- Both chats read `AGENTS.md` and the relevant bootstrap in [`bootstraps/`](bootstraps/).
- Design and content may progress **in parallel** with engineering, through stable content and asset contracts. Placeholders are permitted; missing final assets must be validated and reported rather than silently invented.

## Latest approved team game flow (V01–V10; 2026-10-30)

- **Four core present-day rooms (V09):** Investigation Office (**starting hub** with Evidence Board, five case folders and Rescue Mission entry), File Archives, Recordings Room and Signal Room. Point-and-click navigation; all four accessible, with deeper clues/interactions discovered gradually.
- **Investigation Flashbacks (V01):** interactive, replayable historical inspection in which the protagonist **observes** and cannot change historical events.
- **Rescue Mission time travel (V01–V02/V08):** explicitly fictional and **changeable** alternate-history past. After a short cinematic, players use 2D point-and-click past environments and portrait dialogue with mission teams, then personally configure an engineering intervention in the Guided Mission Builder.
- **Past settings (V10):** a hybrid of reusable location types and distinct mission-specific environments; exact scene count remains with Content/Designer owners.
- **Logo and opening (V04–V06):** temporary protagonist-free three-world emblem **concept**, not a delivered logo asset; ~10-second opening montage followed by slower director briefing; geometric stylized 2D and approved world palettes.
- **Five plans remain editable** under the fictional shared Global Budget until **one collective Final Evaluation**. No individual mission success/failure is revealed during investigation or plan submission.

## Current technology position

**Approved architectural foundation (A01–A03, 2026-10-29):** portrait-first static Web app using React + strict TypeScript + Vite; pure deterministic TypeScript simulation engine separated from React; validated JSON mission/scene data; manifest-driven placeholder assets; no backend for v1. Exact simulation rules, schemas, deployment specifics and optional tooling remain open. See `docs/DECISIONS.md`, `docs/ARCHITECTURE.md` and `docs/ENGINEERING_STANDARDS.md`.

**Confirmed experience constraint:** mobile-style **portrait orientation**, even when opened on desktop.

## Next decisions

Verify NASA contest timing/compliance; Content Owner selects and sources the five missions; Designer and Content Owner define past-team scenes and four-room assets; finish exact engineering scenario parameters, schemas and deployment details. The fundamental investigation-to-player-built Mission Design loop is **already approved**; do not reopen it as an undecided feature. Begin coding only after competition eligibility clearance. See [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md).

## Development

This is currently **documentation only**. Do not run `npm install` or pretend a working app exists yet. The first authorized technical batch should scaffold from official tooling, generate and commit a lockfile, and pass a basic build/typecheck/test baseline.

## License and attribution

No final public license is selected. Decide the applicable NASA Space Apps submission/open-source requirements, third-party media rights and NASA asset attribution before publishing or submitting. Do not commit secrets, unlicensed assets, or sensitive data.
