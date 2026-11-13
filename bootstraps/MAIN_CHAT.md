# The Astral Archives — Main Chat Bootstrap

> **Current 2026-11-13 handoff:** [Camera V2 rejected / Camera V3 next](../docs/CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md). Bounded first-person 2.5D **without 3D, 360° or free roam**. V3 not coded. Current Nov 9 evidence/Rescue approvals supersede incompatible older rules; use experiment branch only, not main.

Last updated: 2026-10-30

You are coordinating **The Astral Archives** (former working title CASE:404) with Mahmoud (Software Engineer/Technical Owner), one Designer and one Data Analyst/Content Owner.

1. Read root `AGENTS.md`, `README.md`, `docs/DECISIONS.md`, `docs/OPEN_QUESTIONS.md`, `docs/ARCHITECTURE.md`, and original `docs/CASE404_SOURCE_OF_TRUTH.md`.
2. **Latest approved team decisions, including 2026-11-09 evidence/Rescue rules and 2026-11-13 camera/UX amendments V12–V17, override conflicting older source or OPEN text.** Maintain compatible T/A/I/E/X/P decisions and use the reconciled `OPEN_QUESTIONS.md`. Keep the original designer source unchanged for provenance. **V11 fixes the player-facing title The Astral Archives;** preserve `case404` as repository identifier only. The final logo has not been delivered.
3. Main chat decides product and architecture and records approved changes **in this repository**, not just in chat. Preserve original designer file as received.
4. Preserve the four present core station rooms (V09), **observer-only Investigation Flashbacks** versus separate fictional **changeable Rescue Mission time travel** (V01), short cinematic + point-and-click past scenes/team dialogue + player-composed Mission Builder (V08), hybrid past locations (V10), five concurrent dossiers; the 2026-11-09 per-mission Execute/outcome flow replaces incompatible older collective-only prescriptions.
5. Work with a lightweight Main/Technical chat split: define one small bounded batch at a time, not SYNTRA-scale processes.
6. Before code/submission decisions, check current NASA event rules and existing asset/content availability. Do not claim assets or code exist if absent.

**Historical October agenda (superseded for present task):** Continue independent NASA eligibility, science, content and artwork verification. The current experimental implementation work is limited to Camera V3, as specified below; the Nov 9 evidence/Rescue decisions take precedence over older drafts.

## Immediate agenda — overrides older "no code" / final-evaluation assumptions
A React/TS prototype exists on `experiment/interactive-investigation-v2-2026-11-13` at code commit `5ec662fe`; Camera V2 was *not* accepted by the player. First read the checkpoint. **Camera V3 mouse-look is the ONLY next feature**: verify browser Pointer Lock explicit gesture, Esc and modal re-entry, keyboard, bounded movement and mobile touch fallback. Publish preview, take player feedback before any 2D art layering/drawer/evidence feature. Keep main unchanged.
