# Whole-game roadmap

Priorities are dependencies, not authorization to implement in this audit.

1. **Content and system contract (Game Design + NASA Data/Narrative):** settle the five case identities, authoritative NASA sources, evidence IDs, required mappings, fact/fiction labels, and unresolved ending/save rules. No fabricated data.
2. **Investigation vertical slice (Gameplay Programming + UI/UX + QA):** one source-verified case, one room evidence item, inspect → collect → file → move/correct → progress → Rescue readiness gate; test wrong filing secrecy and recovery. Use existing station shell and approved evidence assets.
3. **Seated camera and room interaction (Gameplay Programming + Level/Environment Design):** validate 360 yaw/pitch, four existing target interactions, lock request from explicit click, Escape release and safe reacquisition. Browser restrictions preclude guaranteed persistent lock; define understandable re-entry affordance.
4. **Four-room content completion (Level Design + NASA Data/Narrative + Technical Art):** connect Archive, Recordings, Signal to verified evidence and authored viewers; inventory final room-art inputs and provenance before replacement.
5. **Five-case investigation coverage (Game Design + Gameplay + Content):** scale tested evidence/progress contract across five dossiers; verify independent progress and unlock isolation.
6. **Rescue slice then full missions (Gameplay + Narrative + QA):** one bounded fictional intervention with authored constraints, deterministic outcome explanation and explicit historical-vs-simulated distinction; only extend when NASA sources and engineering rules exist.
7. **Character/dialogue and accessibility (UI/UX + Narrative):** contextual fixed Q&A, dialogue behavior, keyboard/touch alternatives, responsive layout and assistive technology review.
8. **Technical art/audio/performance (Technical Art + QA):** resolve art direction and licensed asset provenance, lighting/material quality; scope audio only with approved assets; measure real devices before budgets or optimization claims.
9. **Release readiness (QA + Production):** automated domain tests, browser interaction/screenshot evidence, device checks, build, deployment preview verification and explicit release approval.

## First recommended playable vertical slice

One NASA case with approved authoritative source records, one evidence item discovered in its intended room, and the complete safe filing path: inspect, collect, file correctly or incorrectly without revealing correctness, refile, derive progress, and enable Rescue only when all required evidence is correctly filed. The slice exercises narrative provenance, room interaction, UI, state rules and QA before adding alternate-history engineering. Its case identity and source pack are prerequisites; currently blocked by missing repository content.

## Production workflow

Each milestone names a discipline owner, scope, acceptance evidence, content/asset dependencies, rollback point, and PASS/FAIL/NOT ASSESSED checks. Reviews are cross-functional but roles are workstreams, not claims of running Claude agents. No third-party hooks or framework installation.
