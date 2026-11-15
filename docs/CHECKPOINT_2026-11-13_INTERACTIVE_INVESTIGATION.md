# The Astral Archives — Checkpoint / Next Chat Handoff — 2026-11-13

**Status:** Documentation checkpoint. Camera V2 is deployed but **REJECTED BY PLAYER**. Camera V3 has **not** been implemented.
**Working repository:** `mahmoud-kun/case404` (private). Official player-facing name: **The Astral Archives**.
**Working branch:** `experiment/interactive-investigation-v2-2026-11-13`.
**Gameplay commit before documentation:** `5ec662fec0b1a50cdb2137dd490a50da7c7e3fb3`.
**Unchanged original branch:** `experiment/cinematic-opening-2026-11-12` at `2a6b5781b3af1261fa82ac09336856d894796eaa`.
**Unchanged main, when last verified:** `a54102dd4ddc57d08f22a34f38c077c0987a94f9`.
**Important authority:** This checkpoint updates the current *camera/visual/character/prototype* status only. The [2026-11-09 gameplay decisions](GAMEPLAY_DESIGN_2026-11-09.md) supersede conflicting 2026-10-30 rules for evidence filing, Rescue unlocking and results. Historic source text is retained for provenance.

## A. Game identity / stable gameplay rules

**Genre:** stylized cinematic sci-fi investigation with real NASA mission records, grounded evidence reasoning and fictional counterfactual engineering interventions. No unsourced NASA numerical facts, fake archival footage or fictional outcomes presented as actual history.

**Present station:** exactly 4 shared rooms:
1. **Investigation Room** = start, objectives/briefings, five mission files, evidence review/filing, Rescue console.
2. **Archive Room** = mission metadata, timelines, instruments/hardware, power and reports.
3. **Recordings Room** = authentic research-sourced recordings; detailed content pending.
4. **Signal Room** = signal/telemetry exploration; authored mechanics still pending.

**Missions and evidence:** five concurrent mission dossiers, not sequential levels. Evidence can be filed into ANY one mission, correctly or incorrectly. Wrong filing stays saved with no explicit error, but never earns progress. Player can move evidence between folders freely with no penalty. Progress for each mission equals correctly filed required unique evidence N/M and %. **Rescue for that mission unlocks only at 100%**, without a mandatory deduction quiz or a mandatory evidence-link board. Linking/inference can be tested later only as optional gameplay. Do not silently reinstate older October mandatory hypothesis gating.

**Past:** distinct modes: (1) observer-only Historical Investigation Flashback with bounded inspections, no changing history; (2) explicitly fictional **Rescue Mission** past, where player talks to relevant engineers and configures/chooses interventions. Nov 9 design allows **one per-mission Execute attempt with immediate per-mission outcome and Return to Station**. Older October documents discuss a cross-era Global Budget, editable plans and collective-only Final Evaluation; they conflict and **must be reconciled explicitly before implementing any Rescue simulation**, not combined automatically.

**Henda:** approved female aerospace engineer/investigator (~25), not the male character in obsolete historical files. Controlled, intelligent, observant, revealing identity organically in dialogs/cinematics. She does NOT need a moving player avatar; portraits/contextual commentary suffice. A quiet hint after ~60 seconds can reframe a question without pinpointing a UI target. Current demo portrait/hint is not yet a fully reactive companion system. Do not add generic tutorial spam.

**Art identity:** fully geometric stylized **2D**, not anime, pixel art or a realistic 3D game. Present = navy/steel blue/orange/cyan; past = cream/yellow/gold; space = purple/indigo/cyan. Approved cinematic library/archive main-menu direction should be preserved. No music/SFX/audio implementation until expressly requested.

**Latest explicit decision (Nov 13):** **FIRST-PERSON, LIMITED-RANGE 2.5D**, **NO 3D room/game engine**, **NO 360° turning**, **NO free-roaming/walking protagonist**. The player can examine authored directions in a room; mobile/portrait experience is important. Neither Pointer Lock nor 2D parallax constitutes approval to use 3D.

## B. Current code / assets — what actually exists
- React 19 + TypeScript + Vite browser experiment.
- `src/App.tsx`: menu, opening, station navigation, Henda dialog, current placeholder inspection overlays.
- `src/Investigation25D.tsx`, `src/investigation25d.css`: layered still-image “camera”, bounded horizontal pan, synthetic parallax, hotspot buttons: mission files, evidence board, desk terminal, archive door. NOT a 180° real panoramic or 3D environment.
- `src/styles.css`: app/menu/dialog styling.
- Preview optimized image assets exist: `public/assets/optimized/investigation-panorama-hq.webp`, `investigation-close-hq.webp`, and other menu/room WebPs. Henda transparent assets: `henda-portrait-alpha.webp`, `henda-full-alpha.webp`. Their alpha transparency was reviewed, but artist approval of final silhouette/clean cutout/visual style is NOT confirmed.
- **Camera V2 changes completed** on new experiment branch: removed bottom arrow/look-position bar and unwanted edge auto-pan; added desktop click+drag and touch swipe, keyboard arrows/A/D/Home, full-width artwork traversal and touch tapping fix. The original click hotspots and inspection modal remain. The scene uses CSS transforms and zoom ~1.29–1.45 and an alternate close-angle still; the overlay opens after ~780ms.
- Last code commit `5ec662fec0b1a50cdb2137dd490a50da7c7e3fb3`. Vercel deployment `dpl_HKZ2PgH9ZUb4jnHFrXYnYjmVeByt` was **READY** at https://astral-archives-qs0aogf5e-mahmooud-kun.vercel.app . READY proves successful deployment/build, not usability or actual FPS performance.
- **NOT IMPLEMENTED:** Camera V3, Pointer Lock, real layered room props, dedicated authored object closeups, tactile drawer, file turning, evidence linking or full folder progress, real sourced NASA case content, reactive Henda, signal/recording puzzle, playable historical Rescue simulator.
- No Three.js/R3F/3D dependency was added to this camera code.

## C. ACTUAL player acceptance results, which override build-green
**Camera V2 FAILED user acceptance.** Player feedback from laptop:
1. Still must hold/click mouse to pan; this feels like dragging an image, not looking around in a game.
2. Wanted normal *mouse motion* to move first-person gaze left/right, ideally no ordinary mouse cursor during gameplay.
3. Approaching/zooming onto objects feels awkward, delayed or stuttery. There is no instrumented FPS/latency diagnosis; the present CSS zoom, transition image and delayed modal could plausibly cause the perceived discontinuity, but do not claim that is scientifically proven.
4. Flat static whole-background images, uneven quality/stretching and obvious swaps create insufficient depth. Separately authored 2D objects/components might feel much better.

**Do not report V2 as an accepted gameplay improvement.** It is a preserved failed prototype and an input to the next experiment.

## D. Game research: ideas, not orders
The user supplied a comprehensive Deep Research report in chat (not committed verbatim to this repo). Comparisons included *Outer Wilds* (knowledge progression), *The Room* (tactile object agency), *Tacoma* (recordings and spatial context), *Myst/Riven* (authored viewpoints), *Return of the Obra Dinn*, *The Case of the Golden Idol* and *Roottrees* (deduction), *Her Story* (player-formulated search), *Observation / The Operator* (technical tools), *Firewatch* (context-aware companion), plus *Nancy Drew* and *Agent A* on camera and room composition. Main reasoning concept: **Observed → Understood → Connected**. Free-roam 3D is **rejected for this game** even though it was one of the broad research alternatives. Do not claim the team personally played every cited title or adopted the whole ~60-idea research library.

## E. Confirmed iterative workflow
- **Only ONE feature at a time.** Before editing: inspect relevant branch, player complaint, artifacts, existing behavior. Define acceptance/failure cases and preserve unrelated features/assets.
- After editing: source review; real TypeScript/build and browser UI, keyboard, portrait-mobile, reduced-motion checks where possible; report tests honestly (a READY Vercel build is necessary but insufficient). Seek user's direct playtest approval.
- If user rejects a feature, correct/retest the same feature before adding another one. Small reversible commits; never touch or merge `main`, previous experiment branch, or designer-owned files without approval.
- Existing evidence/Rescue decisions and scientific facts remain owned by the appropriate team roles, not inferred from experimental UI.

## F. NEXT FEATURE ONLY: Camera V3 — PLANNED, NOT CODED
**Objective:** on laptop the user moves the mouse naturally and **gaze follows without holding a mouse button**, with no ordinary cursor in gameplay; still a bounded 2.5D first-person scene with no 360 or free movement.
- Test browser **Pointer Lock / relative-mouse input**, which requires a **real activation gesture**; cannot rely on an asynchronous entry sequence to retain browser user activation. An explicit Start/Enter/Resume capture action may be necessary.
- Define look sensitivity, bounded horizontal range, subtle focus/reticle if useful; `Esc` releases, clear way to re-enter, overlays/menus/inspection/Henda dialogs never trap pointer; keyboard accessibility remains.
- Mobile uses an independent swipe/tap fallback, not assumed Pointer Lock. Preserve portrait art/hotspot locations and accessible controls.
- Diagnose awkward zoom/approach **only insofar as necessary to evaluate Camera V3**, comparing perceived image discontinuity and actual measured frame pacing. No invented FPS improvements.
- **Do not in this batch:** rework four rooms, change images into layers, add drawer/evidence/signal/recordings mechanics, produce SFX, install 3D libraries.
- Acceptance: new user can look around in seconds without mouse-button hold, select an object, return and resume, escape/reacquire camera, no cursor trap, bounded motion, usable mobile/keyboard. Publish separate preview and obtain player verdict.

## G. Later separately gated feature proposals — not all approved
1. **One Investigation Room corner as layered 2D art**: separately designed architecture, furniture, objects, foreground and controlled lighting/parallax; needs Designer approval. Do not scale one low-resolution background to mimic depth.
2. **Dedicated object close-up / coherent transition**, not zoom/stretch/crossfade unrelated full-room raster.
3. **Interactive file drawer**: handle open, select actual file.
4. **Physical file inspection**: flip pages, examine diagram/data.
5. **Evidence collection/filing** under latest Nov 9 rules.
6. **Optional evidence comparison/connection**; never a mandatory Rescue gate unless explicitly reapproved.
7. **Context-sensitive Henda** with restrained hints/expressions.
8. **Signal interpretation mechanics** supported by real data.
9. **Recordings / historical flashbacks / world reaction** as authored and validated.

After **each** step, preview/playtest/accept before next. No simultaneous all-feature build.

## H. Outstanding truth/risks
- Five verified NASA missions/evidence datasets, event timelines, authoritative attributions, actual recorded media, engineering values, alternate-history simulation content and author approvals are not presently verified complete in this experiment. Do not fabricate them.
- The older October collective outcome/Global Budget rules are historically documented but conflict with 2026-11-09 rules. Reconcile with owner before doing rescue implementation.
- Production Henda face, cleaned transparency, complete room art, interaction assets, final camera move, mobile real-device playtest, measured FPS and licensing still require review.
- Code checkpoint preserves current behavior; this documentation does not implement anything new.

## I. Next chat read-first
Read `AGENTS.md`, this checkpoint, `docs/GAMEPLAY_DESIGN_2026-11-09.md`, `docs/DECISIONS.md`, `docs/OPEN_QUESTIONS.md`, `docs/ASSET_CONTRACT.md`. Read `src/Investigation25D.tsx`, `src/investigation25d.css`, `src/App.tsx`. Verify actual GitHub SHA and Vercel preview; continue from `experiment/interactive-investigation-v2-2026-11-13`. **Implement Camera V3 only**, test it and solicit user approval. Nothing else until accepted.
