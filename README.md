# CASE:404

Last updated: 2026-10-29

CASE:404 is a **portrait-first, stylized 2D space-mission investigation and engineering game** being planned for NASA Space Apps Challenge 2026. It combines investigation of evidence from five real NASA missions with clearly labeled alternate-history interventions and a final collective outcome reveal.

**Status:** Pre-production documentation. **No game code, production assets, verified content dataset, or completed simulation is present in this repository yet.** The team must verify competition eligibility/timing before implementing a submission.

## Where truth lives

1. [`docs/DECISIONS.md`](docs/DECISIONS.md): current team working baseline and explicitly accepted decisions, including later corrections.
2. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): engineering direction; **proposal until adopted** by the main project chat.
3. [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md): unapproved details and unresolved conflicts; never infer approval.
4. [`docs/CASE404_SOURCE_OF_TRUTH.md`](docs/CASE404_SOURCE_OF_TRUTH.md): original designer-supplied discussion record, preserved verbatim for provenance; not every idea inside it is an approved implementation requirement.
5. [`AGENTS.md`](AGENTS.md): mandatory operating instructions for Codex and other engineering agents.

If two files disagree, record the conflict and ask the project main chat to decide; then update the appropriate canonical decision/specification file. The older designer brief remains unchanged as historical input.

## Team

- **Software Engineer / Technical Owner:** architecture, game/simulation logic, implementation, integration, tests.
- **Designer:** UX/art direction, scenes, sprites, animations, visuals and audio asset delivery.
- **Data Analyst / Content Owner:** NASA research, historical validation, mission narratives, evidence design, scenario datasets.

## Working model

- **Main chat:** product decisions, tradeoffs, scope approval, integration ownership and release acceptance.
- **Technical chat:** one bounded implementation batch at a time; review source, implement, validate, send concise handoff; no autonomous product decisions.
- Both chats read `AGENTS.md` and the relevant bootstrap in [`bootstraps/`](bootstraps/).
- Design and content may progress **in parallel** with engineering, through stable content and asset contracts. Placeholders are permitted; missing final assets must be validated and reported rather than silently invented.

## Current technology position

**Proposed, not yet ratified:** React + TypeScript + Vite; data-driven static web app; a pure deterministic TypeScript simulation engine; JSON content with runtime validation; no backend or online AI required for v1. See `docs/ARCHITECTURE.md` and `docs/ENGINEERING_STANDARDS.md`.

**Confirmed experience constraint:** mobile-style **portrait orientation**, even when opened on desktop.

## Next decisions

Confirm the platform/stack, NASA contest timing/compliance, mission selection, mission-engineering loop and data contracts; then initialize development only when permitted. See [`docs/OPEN_QUESTIONS.md`](docs/OPEN_QUESTIONS.md).

## Development

This is currently **documentation only**. Do not run `npm install` or pretend a working app exists yet. The first authorized technical batch should scaffold from official tooling, generate and commit a lockfile, and pass a basic build/typecheck/test baseline.

## License and attribution

No final public license is selected. Decide the applicable NASA Space Apps submission/open-source requirements, third-party media rights and NASA asset attribution before publishing or submitting. Do not commit secrets, unlicensed assets, or sensitive data.