# The Astral Archives — 5-Hour Parallel Production & Release Authority

**Approved by user / Main Chat:** 2026-11-15  
**Status:** AUTHORITATIVE SPRINT PLAN (documentation; not a claim that implementation is complete)  
**Repository:** \`mahmoud-kun/the-astral-archives\` (private)  
**Canonical working branch:** \`experiment/room-case-library-layout-fix-2026-11-14\` (GitHub default \`main\` is historical and must NOT be merged/reset/renamed)  
**Sprint budget:** 300 minutes measured from the actual kickoff; no automatic assumption the clock has started  
**Lead/acceptance authority:** Main Chat, with the user retaining final artistic/product decisions

## 0. Executive decision (P-2026-11-15-01)

The user selected **three genuinely parallel specialist chats** rather than sequential stages:
1. **Cases + Layered Assets + Scene Integration**: verify case inventory and the designer/Codex media; integrate faithful playable rooms and case-specific content.
2. **Sound Effects + Cinematics/Media Integration**: own the audio and the supplied opening, mission, portal, rescue, return cinematics/transitions. "Camera" here refers to production cinematics/transitions; do not silently change the approved first-person gameplay camera.
3. **Puzzle/Science/Logic Audit + Repairs**: independently audit all five cases' puzzles, data semantics, physical units, reasoning, save/gates and rescue outcomes; implement safe repairs in its owned files.

The **Main Chat** is integration/review owner, release manager, documentation & pitch/presentation owner, risk triage, and the only final ACCEPT/HOLD gate. Specialists provide a complete, tested handoff before Main reviews. Once accepted, Main runs final integrated end-to-end QA, presentation/demo and release approval.

### Precedence and preservation
- Newer approved decisions in this plan, \`EXPERIMENT.md\`, \`docs/studio-pilot/NADIR_INVESTIGATION_VERTICAL_SLICE_V1.md\` and \`docs/GAMEPLAY_DESIGN_2026-11-09.md\` supersede contradictory Oct 2026 draft material in \`docs/DECISIONS.md\`, \`docs/CONTENT_CONTRACT.md\`, \`docs/TEAM_WORKFLOW.md\`, and historical CASE:404 descriptions.
- Game title: **The Astral Archives**; Henda is the investigator. Landscape-first on desktop and phones; portrait phone displays orientation guard. Four **present** station rooms: Investigation, Archive, Signal, Recordings. Fixed first-person point-and-click with direct object hotspots; no walking, panning, mouse-look or pointer lock in the approved Investigation room.
- Preserve user-approved Home art and layout, fullscreen navigation, inventory location, Nadir Analyzer artwork/interactions/motion, evidence sorting behavior and persistent saves. Do not reset players' saves to make tests pass.
- Keep real NASA-source facts distinct from fictional NASA-inspired missions and **simulated** telemetry. Do not invent citations, equations, metrics or screenshots.
- Preserve all raw designer/Codex source art/audio; no overwriting or re-encoding originals without explicit permission. No unapproved external music/video/art. NASA endorsement must not be implied.

## 1. Verified starting point (not a completion declaration)

- Canonical branch last reviewed: \`89f7869fa4268e910964c11b0de7ee71b548f5ec\` (snapshot only; specialists must re-fetch HEAD).
- GitHub Actions **Visual QA Run #46**, at \`c262b4fa18dcb603d3bce6217b6ddbeeca9e868a\`, passed Build/Unit/Chromium/contacts. Published review report records **44 screenshots, 0 scenario errors, 0 missing captures, 0 broken images, 0 clipped controls, 0 overflows, 0 browser console errors**. This is not proof of physical-device playback or of five complete cases.
- Current 19 audio cues: 11 original designer WAV + 8 licensed Kenney CC0 M4A; on-demand SFX, ambient synthesis, saved settings and an Audio Lab are implemented. Physical listening, scene balance, cinematic transitions remain unverified.
- Nadir: working advanced investigation vertical slice, six required plus two optional records, multi-step puzzles, manual COLLECT, Quick Evidence Tray, folders/filing, 6/6 rescue unlock and causal+two-vector technical rescue. Preserve these core mechanics.
- The four other case folders/previews are **NOT** confirmed full playable rescue implementations. The sprint must not claim all five playable unless independently verified.
- Codex final asset handoff branch: \`experiment/remaining-rooms-layered-assets-v1-2026-11-14\`, handoff commit \`48213bd67be242cdb961cd4682b331543941aba4\`. Seven raster-manifest packs / 28 source-traced objects: Present Archive(4), Signal(4), Recordings(5); Past Manufacturing(3), Mission Target(4), Data Analysis(3), Resources Review(5). Structural validation passed, but **all seven clean plates remain designer-cleanup-required**; idle recomposition is not proof of clean hidden backgrounds.
- All four available past scenes are **1080x1920 portrait**; simple cover or stretch is NOT acceptable in the required landscape product. New approved landscape compositions or a clearly justified, user-approved non-stretch presentation are needed. Present original images stay available as fallback.
- User/designer is delivering further images and videos. Do not assume their receipt until inspected and recorded in the asset ledger.

## 2. File ownership / concurrency contract

| Owner | Writes allowed without cross-chat approval | Reads / coordinates with | Must NOT modify autonomously |
| --- | --- | --- | --- |
| Chat A — Cases & Assets | \`public/assets/rooms/**\` (new/versioned; originals immutable), \`public/assets/optimized/room-*.webp\` (new names/versioned), \`src/gameplay/StationRoom.tsx\`, \`src/gameplay/stationRoom.css\`, \`src/InvestigationLayeredScene.tsx\`, \`src/investigationLayeredScene.css\`, \`src/archive/evidenceRecords.ts\` (data only, stable IDs), \`docs/production/handoffs/CASES_ASSETS.md\` | Codex Handoff, content bible, existing \`NadirPuzzle\` and saves | \`src/audio/**\`, \`src/gameplay/nadirEngine.ts\`, \`src/gameplay/NadirPuzzle.tsx\`, \`src/gameplay/NadirRescue.tsx\`, \`src/main.tsx\`, Home layout |
| Chat B — Audio & Cinematics | \`src/audio/**\`, \`public/assets/audio/**\` (originals immutable), \`public/assets/video/**\` (versioned new assets), \`src/media/**\` (new feature files), \`docs/audio/**\`, \`docs/production/handoffs/AUDIO_CINEMATICS.md\` | Game routes and designer clips, audio license/source ledger, Chat A's room map | Scene, gameplay, puzzle, archive save and root routing files; no soundtrack/autoplay substitution |
| Chat C — Science & Puzzles | \`src/gameplay/nadirEngine.ts\`, \`src/gameplay/NadirPuzzle.tsx\`, \`src/gameplay/NadirRescue.tsx\`, \`src/gameplay/EvidenceMachine.tsx\`, \`src/gameplay/gameSave.ts\`, \`src/archive/archiveState.ts\`, test files co-located with owned modules, \`docs/production/handoffs/SCIENCE_PUZZLES.md\` | \`src/archive/evidenceRecords.ts\` and official source documents, Case A's IDs and available art | \`src/archive/evidenceRecords.ts\` edits, \`src/audio/**\`, room visuals, \`src/main.tsx\` or globally shared styles |
| Main Chat — Integration | \`src/main.tsx\`, \`src/HomeScreen.tsx\`, root navigation and shared UX, \`docs/production/**\` authority, final README/credits, presentation/demo docs, final QA/CI/release | All three specialist handoffs and designer approvals | Do not overwrite specialist-owned in-flight files without a documented coordination decision |

File lists above define **exclusive write ownership during the sprint**, not permanent architecture ownership. If a specialist needs a cross-owned file, it submits a \`CHANGE REQUEST\` with path, proposed patch/contract, reason, tests and owner response. Main arbitrates within the same sprint. No unilateral editing shared root files or the same file from two chats.

**Git discipline:** User's earlier direction prohibits creating additional branches without explicit approval. This sprint authorizes parallel chats, **not** automatic branch creation or main-branch merge. Therefore use the approved canonical working branch with strictly disjoint file paths and atomic, current-SHA guarded commits. Re-fetch HEAD and individual target blob SHA immediately before each write; refresh/reconcile if the branch has moved. Never force push, reset, delete, or overwrite unreviewed work. Each chat may propose a topic branch, but must obtain explicit approval before creating it. Codex's existing asset branch is a **source**, not an integration destination. Main alone accepts cross-chat integration and authorizes final release.

## 3. Working contracts and P0 vertical path

### A — Case/asset contract
- Inventory all **five cases** by ID/name/story state and all designer-delivered media; compare to Production Bible. Identify what is playable, prototype-only, missing or awaiting designer.
- Validate file existence, IDs, bounds, mask alpha, source fidelity and native orientation. Do not call "idle pixel perfect" the same as "clean plate finished".
- Present three remaining-room layered packs may be integrated *selectively*. If clean backgrounds have visible seams, preserve intact original plate behind hotspot/mask/glow and only use separated on-top elements when visually sound; mark this **visual fallback**, not a completed layered hidden-object animation.
- Do not distort portrait past scenes. Record dependency on landscape art and provide a compatible non-distorting temporary view only if Main explicitly approves the compromise.
- Wire accessible keyboard/hover/touch hit areas and route signals without changing puzzle result logic or evidence IDs. Any new five-case evidence records must have provenance, labels, stable folder/room mappings and science audit requests to C.
- End with an inventory table per case and scene, definitive list of incorporated vs outstanding assets, browser screenshots, tests and exact commits.

### B — Audio/media contract
- Audit all 19 cue file paths, SFX events, rights, lazy loading, mobile audio unlock, mute/volume persistence, clipping/rate limits, layering and ambient transitions. Do not "fix" sound by silently replacing originals.
- Review designer-supplied cinematic assets for authenticity, aspect 16:9 landscape, duration, dimensions, size and audio licensing. Opening, case intro, portal/flashback, rescue outcome and return should have named integration points.
- Build optional/reduced-motion and skip/replay/return functionality for cinematic views, preserving game state and fullscreen without replacing the document; coordinate root routing requirements with Main, do not edit \`src/main.tsx\` directly.
- Sound must not reveal incorrectly filed evidence; wrong folder and correct folder share same feedback. Distinguish synthetic ambient station sound from vacuum.
- Finish with complete cue-to-event table and scene/video trigger table, file list, licensing, playback/browser evidence, listening QA status and exact commits.

### C — Logic/science contract
- Check each case against its provided production source docs and primary NASA engineering references, verify facts vs simulated numbers, dimensional analysis, units, result tolerance, physically possible interventions and causal links.
- For each case build \`case -> evidence -> puzzle -> validation -> collect -> folder -> 6/6 unlock -> rescue -> outcome\` acceptance matrix. Prove route can actually complete, not just a card in a registry.
- Preserve Nadir's accepted interactive look and interaction style; avoid downgrading to trivia multiple-choice, auto-collection, free answer leakage, or a diagnosis gate outside rescue.
- Check hints, two-vector validations, solution-independent tests, wrong answers, save migration/backward compatibility, reload, missing data, case-crossfiling, partial completion and locking rules.
- For missing rescue implementation in the other four cases, identify the exact missing content/engine functionality early, notify Main as P0 blocker and provide testable least-risk repairs rather than invented shortcuts.
- Finish with per-case scientific evidence/accuracy audit, executable tests and every unresolved fact clearly labeled.

### Main integration contract
- Keep the single player journey playable: Home -> Investigation -> Present rooms -> inspect/analyze -> manual collect -> Quick Tray -> physical Mission Folders -> correctly filed evidence -> Rescue -> alternate-history/past transition -> outcome/report -> return.
- Maintain accessibility (keyboard/touch, legible labels), landscape responsiveness, genuine asset loading and safe fallback states. Do not bypass gate conditions or mark fictional material NASA-authentic.
- Main reviews specialist submissions independently against approved art, content, code and tests, then commits any root integration. Merely seeing a successful CI does not mean user visual acceptance.
- User-approved cinematics, media source and screenshots must be used without guesswork. If an original is late, report the missing file and apply a visible approved fallback only.

## 4. Five-hour clock / gates

| Time since kickoff | Parallel activities and decision gate |
| --- | --- |
| T+00–15 | Main publishes authority; chats A/B/C read this doc + sources, claim file ownership, produce inventories and list P0 missing data. Main starts pitch deck content and credits mapping immediately. |
| T+15–60 | All three specialists build/review independently. First checkpoints: A asset-case map, B cue/clip map, C five-case science/gameplay coverage. Main reviews blockers and designer needs at T+60. |
| T+60–150 | Specialists implement independent scoped changes and tests; Main prepares actual demo narrative, screenshots and slide script in parallel. Case and asset availability risks escalated immediately. |
| T+150–195 | Receive final specialist handoffs, Main conducts per-stream acceptance and only necessary shared-root integration. T+195 is **feature freeze**: no new creative features after this gate. |
| T+195–255 | Full regression and 5-case user-journey QA, sound/media checks, device landscape/fullscreen, CI, fix P0/P1. Preserve backups/reproducible deployment. |
| T+255–300 | Release freeze; final Vercel deploy and smoke test, fallback/offline demo, presentation exported/visually checked, credits + NASA sources, demo rehearsal, final release handoff. |

A chat finishing early reports immediately; Main reviews it while other chats continue. Never wait to collect all handoffs. **Do not give an unverified claim of 'five cases complete'.** If the remaining four cases cannot be truly playable in 300 minutes, report the exact coverage and obtain user release-scope decision; don't silently change the acceptance goal.

## 5. Specialist completion = a verifiable handoff, not 'done'

Each specialist must submit and preferably save to its **exclusive handoff file**:
1. \`DONE / PARTIAL / BLOCKED\`, audited case/scene/cue scope, owned changes and exact commit SHA(s).
2. Source assets and provenances, output paths/IDs, what has not been integrated, and any original/dependency awaited.
3. Commands **actually run**, environment, pass/fail counts, 1366x768 and 915x412 screenshots or why unavailable, physical audio/device check status.
4. Route-by-route human steps to verify; correctness edge cases; no claims based on visual speculation.
5. Cross-owner changes requested with exact patch location; no silent implementation outside ownership.
6. Explicit remaining P0 blockers and risks; exact points needing Main/user approval.

Main assigns one result: **ACCEPT**, **CHANGES REQUIRED** (with exact reproducible defects), or **HOLD**. No chat self-certifies the whole game. Main acceptance audit logs commit, test evidence, design signoff and integration outcome.

## 6. Release/competition package definition

- Working 16:9 landscape web release link, current commit/hash, successful build + test report, screenshots and real smoke test.
- Story and learning objective per case, five-case coverage matrix, source-vs-simulation labels, NASA/third-party rights and credits.
- Audio control and cinematic playback/skip/reduced-motion state explicitly tested; no nonexistent output claims.
- Presentation (problem, solution, NASA/source methodology, design-engineering process, five cases, demo, impact, team/credits), pitch script and offline fallback demo.
- Known issues/limitations and any substitute scene transparently disclosed; backup of last verified stable release.
- User's final artistic approval remains necessary for material visual changes.

## 7. Links to start the three specialist chats

- \`docs/production/WORK_ORDER_A_CASES_ASSETS.md\`
- \`docs/production/WORK_ORDER_B_AUDIO_CINEMATICS.md\`
- \`docs/production/WORK_ORDER_C_SCIENCE_PUZZLES.md\`

**First message in every specialist chat:** "Read the sprint authority and your specific work order directly from the approved GitHub working branch, re-fetch HEAD, then work independently within the owned files. Do not assume Main or the other chats can see your intermediate conversation. Deliver the required handoff only after meaningful tests."
