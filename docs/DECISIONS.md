# CASE:404 — Decision Register

Last updated: 2026-10-29

## Decision status policy

- **CONFIRMED BASELINE:** the designer brief labels the item confirmed and Mahmoud has clarified that the team's agreed decisions are substantially represented there. Use these as the current working baseline unless a newer explicit team correction exists.
- **CONFIRMED CORRECTION:** explicit newer team clarification (overrides an outdated brief detail).
- **PROPOSED:** technical or creative recommendation not yet accepted.
- **OPEN:** decision pending. An agent must not convert an OPEN item to a feature requirement by inference.
- **SUPERSEDED:** historical idea, not implementable unless explicitly revived.

## Current confirmed product baseline (from original designer brief)

| IDs | Agreed working baseline |
|---|---|
| D01–D05 | Five real-mission cases; engineer/investigator protagonist; mission evidence; clue-triggered visual reconstructions; analyze phase/root cause. |
| D06–D12 | Fixed stylized male protagonist (~25); brief 10-second intro montage then calmer director call; Past cream/yellow, Station navy/orange, Space purple; full geometric character design, long mullet, blue/white/silver outfit, no orange clothing/wrist computer/tablet; protagonist observer-only in reconstructed past. |
| D13–D16 | Shared multi-room space station, point-and-click door navigation (not free walking); evidence from all five cases mixed; player assigns it to mission folders. |
| D17–D19 | One Rescue Mission submission per dossier; success/failure withheld until a single collective final evaluation; real NASA missions with explicitly fictional alternate-history interventions. |

For exact per-ID descriptions and nuances, consult `docs/CASE404_SOURCE_OF_TRUTH.md` §5. The original's D20–D25 are **not confirmed**.

## Newer corrections confirmed in the main discussion

| ID | Decision | Status | Reason |
|---|---|---|---|
| T01 | Three-person team: Mahmoud = Software Engineer/Technical Owner; another member = Designer; another = Data Analyst/Content Owner. | CONFIRMED CORRECTION | Overrides the designer-source table that labeled the user as designer. |
| T02 | Primary playing orientation is **portrait**, inspired by the pacing/layout of Elmwood Trail; desktop-like immersive visual quality still desired. | CONFIRMED | Direct user statement. |
| T03 | Create a dedicated `case404` repository and a simple **Main chat + Technical chat** collaboration model; deliberately lighter than SYNTRA. | CONFIRMED | Direct user statement. |
| T04 | Maintain stable interfaces so engineering, content research, and art assets can proceed **in parallel** with minimal integration changes. | CONFIRMED | Direct user statement. |
| T05 | Original designer brief must be kept as provenance; new decisions must be versioned in the project repo rather than held only in ChatGPT memory. | CONFIRMED | Direct user statement. |

## Technical proposal — NOT ratified

| ID | Proposed direction | Status |
|---|---|---|
| A01 | Portrait-first static Web game using React + TypeScript + Vite. | PROPOSED; favored by technical discussion |
| A02 | No backend for initial single-player experience; JSON schemas, data-driven scene/mission content, pure TypeScript simulation engine. | PROPOSED |
| A03 | Content schemas with stable IDs and manifest-driven assets, placeholder support, validation before integration. | PROPOSED architecture; parallel-work principle itself confirmed |
| A04 | Vitest, Zod, ESLint Flat Config and minimal state library only if needed. | PROPOSED tooling |

Before changing these statuses, have Main chat explicitly accept the relevant proposal and update `docs/ARCHITECTURE.md` accordingly.