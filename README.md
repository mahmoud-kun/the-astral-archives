# The Astral Archives

> **CURRENT V2.2 / 2026-11-13 (latest; overrides historical preview status below):** Mahmoud requested a designer-reference-faithful, **separately authored 2D reconstruction**. V2.1 raster/background and cutout rendering was explicitly rejected and is **not active**. The current experiment uses **20 independent SVG scene assets** in `public/assets/experiments/investigation-room-v2-2/`, with **zero direct reference-image rendering** in `Investigation25D.tsx`. Camera V3 control feel was user-accepted and behavior is preserved; player/designer validation of V2.2 visuals, real browser/mobile tests and measured performance remain **pending**. Report: [V2.2 designer-faithful layered scene](docs/DESIGNER_FAITHFUL_LAYERED_V2_2_2026-11-13.md). This status applies only to `experiment/interactive-investigation-v2-2026-11-13`; no merge to main or original asset replacement is authorized.


> **CURRENT EXPERIMENT / 2026-11-13 — supersedes older status statements below:** Camera V3 mouse-look was positively accepted by the player for control feel. Its independent browser/device/FPS testing remains open. The first layered Mission Files corner was also positively assessed for depth, but the remaining flat room was rejected. **Layered Investigation Room V2** has now been implemented as a *nine-layer, full-room, artist-replaceable SVG experiment* on `experiment/interactive-investigation-v2-2026-11-13`; its Vercel build is READY and **player visual approval is pending**. See [Layered Room V2 verification](docs/LAYERED_ROOM_V2_2026-11-13.md). This is not approval of production artwork, new gameplay, 3D, audio or changes to `main`.


> **2026-11-13 status and handoff:** [Camera V2 player-rejected / Camera V3 next](docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md). Current game direction: first-person bounded **2.5D** only (**no 3D, no 360°, no free roam**). Camera V3 is **not implemented**. Evidence/Rescue rules follow the 2026-11-09 decisions, not conflicting October prose.

> **2026-11-09 gameplay update:** See [Gameplay & UX Decisions (2026-11-09)](docs/GAMEPLAY_DESIGN_2026-11-09.md) for the newer designer-approved first-person investigation, folder-based evidence progress, contextual robot assistance, past engineering interaction, and per-mission outcomes. It **supersedes conflicting older gameplay directions**, especially mandatory deduction-board gating and collective-only result reveal. Shared Global Budget, observer-only flashbacks, historical content and responsive orientation have unresolved reconciliation points; do not treat old conflicting prescriptions as simultaneous requirements. Documentation update only; no gameplay implementation.


Last updated: 2026-10-30

**The Astral Archives** (formerly **CASE:404**) is a **portrait-first stylized 2D forensic space-mission investigation and engineering game** planned for NASA Space Apps Challenge 2026. The player investigates five concurrent NASA-inspired mission dossiers in a four-room station, learns from real historical failure evidence, then enters **distinctly fictional alternate-history Rescue Missions** to interact with past mission teams, build engineering interventions and simulate counterfactual results. Under the later 2026-11-09 gameplay decision, each ready mission has its own fictional Execute Mission outcome and Return to Station; the old collective-only Final Evaluation model remains a historical, conflicting design that requires reconciliation before implementation.

**Current status (2026-11-13):** A React/TypeScript/Vite experimental browser app, menu, four preview rooms and optimized artwork **do exist on experimental branches**. Camera V2 deployed but was rejected in player testing. Camera V3, approved production assets, verified full NASA case data, evidence/rescue engine and full simulation **do not exist**. Official competition/licensing verification is still needed.

**Official game title: The Astral Archives.** The legacy identifier `case404` is historical; the GitHub repository rename to `the-astral-archives` has been requested but must be completed in GitHub repository Settings. Preserve past historical source filenames for traceability. The original source brief preserves older title references for provenance. The logo visual concept is still temporary pending final artwork and approval.

## Where truth lives

0. [**Current 2026-11-13 checkpoint and next-chat handoff**](docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md): real branch/state, failed player playtest, confirmed camera constraints, next one-feature task.

1. [`docs/DECISIONS.md`](docs/DECISIONS.md): current team working baseline and explicitly accepted decisions, including later corrections.
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): approved architecture/gameplay constraints **plus clearly labeled proposed technical details**; not every sentence is separately ratified.
3. [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md): current **unresolved details only**, reconciled against latest team decisions; never infer approval.
4. [`docs/CASE404_SOURCE_OF_TRUTH.md`](docs/CASE404_SOURCE_OF_TRUTH.md): original designer-supplied discussion record, preserved verbatim for provenance; not every idea inside it is an approved implementation requirement.
5. [`AGENTS.md`](AGENTS.md): mandatory operating instructions for Codex and other engineering agents.

**Precedence:** Latest explicit decisions (Nov 13 camera/UX and Nov 9 evidence/Rescue) supersede inconsistent October proposals; compatible older confirmed decisions remain valid. `CASE404_SOURCE_OF_TRUTH.md` remains an unchanged historical input, **not a competing live specification**. For a new conflict not covered by a confirmed decision, ask Main Chat and reconcile it in the relevant current file. See [`docs/CONTENT_CONTRACT.md`](docs/CONTENT_CONTRACT.md), [`docs/ASSET_CONTRACT.md`](docs/ASSET_CONTRACT.md) and [`docs/IMPLEMENTATION_DECISIONS_2026-10-30.md`](docs/IMPLEMENTATION_DECISIONS_2026-10-30.md) for owner handoffs and approved defaults.

## Team

- **Software Engineer / Technical Owner:** architecture, game/simulation logic, implementation, integration, tests.
- **Designer:** UX/art direction, scenes, sprites, animations, visuals and audio asset delivery.
- **Data Analyst / Content Owner:** NASA research, historical validation, mission narratives, evidence design, scenario datasets.

## Working model

- **Main chat:** product decisions, tradeoffs, scope approval, integration ownership and release acceptance.
- **Technical chat:** one bounded implementation batch at a time; review source, implement, validate, send concise handoff; no autonomous product decisions.
- Both chats read `AGENTS.md` and the relevant bootstrap in [`bootstraps/`](bootstraps/).
- Design and content may progress **in parallel** with engineering, through stable content and asset contracts. Placeholders are permitted; missing final assets must be validated and reported rather than silently invented.

## Historical game flow (V01–V11, 2026-10-30; superseded where contradictory to Nov 9 / Nov 13)

- **Four core present-day rooms (V09):** Investigation Office (**starting hub** with Evidence Board, five case folders and Rescue Mission entry), File Archives, Recordings Room and Signal Room. Point-and-click navigation; all four accessible, with deeper clues/interactions discovered gradually.
- **Investigation Flashbacks (V01):** interactive, replayable historical inspection in which the protagonist **observes** and cannot change historical events.
- **Rescue Mission time travel (V01–V02/V08):** explicitly fictional and **changeable** alternate-history past. After a short cinematic, players use 2D point-and-click past environments and portrait dialogue with mission teams, then personally configure an engineering intervention in the Guided Mission Builder.
- **Past settings (V10):** a hybrid of reusable location types and distinct mission-specific environments; exact scene count remains with Content/Designer owners.
- **Logo and opening (V04–V06):** official **The Astral Archives** title (V11); temporary protagonist-free three-world emblem **concept**, not a delivered logo asset; ~10-second opening montage followed by slower director briefing; geometric stylized 2D and approved world palettes.
- **Five plans remain editable** under the fictional shared Global Budget until **one collective Final Evaluation**. No individual mission success/failure is revealed during investigation or plan submission.

## Current technology position

**Approved architectural foundation (A01–A03, 2026-10-29):** portrait-first static Web app using React + strict TypeScript + Vite; pure deterministic TypeScript simulation engine separated from React; validated JSON mission/scene data; manifest-driven placeholder assets; no backend for v1. Exact simulation rules, schemas, deployment specifics and optional tooling remain open. See `docs/DECISIONS.md`, `docs/ARCHITECTURE.md` and `docs/ENGINEERING_STANDARDS.md`.

**Confirmed experience constraint:** mobile-style **portrait orientation**, even when opened on desktop.

## Next decisions

Verify NASA contest timing/compliance; Content Owner selects and sources the five missions; Designer and Content Owner define past-team scenes and four-room assets; finish exact engineering scenario parameters, schemas and deployment details. The fundamental investigation-to-player-built Mission Design loop is **already approved**; do not reopen it as an undecided feature. Begin coding only after competition eligibility clearance. See [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md).

## Development

An experimental **React 19 + TypeScript + Vite** app is already committed. For local Windows PowerShell, after installing dependencies, use `npm.cmd run dev` or `npm.cmd run build`. These are commands, not claims of execution in the documentation checkpoint. The V2 Vercel build is READY; the player did not accept the resulting UX. See checkpoint for exact code and preview.

## License and attribution

No final public license is selected. Decide the applicable NASA Space Apps submission/open-source requirements, third-party media rights and NASA asset attribution before publishing or submitting. Do not commit secrets, unlicensed assets, or sensitive data.
