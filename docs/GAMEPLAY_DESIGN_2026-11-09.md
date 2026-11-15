# The Astral Archives — Gameplay & UX Decisions (2026-11-09)

> **Newer UX/navigation status (2026-11-13):** Read [current checkpoint](CHECKPOINT_2026-11-13_INTERACTIVE_INVESTIGATION.md). First-person **bounded 2.5D**, no 3D/360/free roam. Camera V2 exists but was **rejected in player testing**; V3 is planned/not built. This note changes camera/asset/prototype status ONLY; this document's **Nov 9 evidence and Rescue rules remain authoritative**, not October collective-only rules.

**Status:** Nov 9 designer-confirmed gameplay contract. The game is not fully implemented, but a partial browser prototype and preview art now exist on the experimental branch; see 2026-11-13 checkpoint. Its first-person 'fixed-view' means no free-roam avatar, not a prohibition on testing limited mouse-look.

**Scope:** Present investigation, evidence filing, rescue unlock, alternate-history past engineering, user interface, story presentation, outcomes, and asset-production constraints.

**Precedence:** The explicit decisions below supersede conflicting 2026-10-30 decisions for the same behavior. Retain the earlier records as history, not as simultaneous implementation requirements. Items not addressed here remain unchanged or OPEN; conflicts requiring a further owner decision are recorded near the end. The original historical source brief is not rewritten.

## 1. Core flow

1. Start in the **present-day Investigation Room** in a first-person, fixed-view, point-and-click station.
2. Browse the four shared rooms, inspect mission records/signals, collect evidence, and manually file evidence into any of five concurrent mission dossiers.
3. Each mission has independent visible investigation progress, expressed as both a fraction of **correctly filed required evidence** and a percentage.
4. A specific mission's **Rescue Mission** entry unlocks once all of its required evidence is correctly filed. No deduction quiz/hypothesis test is required to unlock it.
5. The player chooses any ready mission, watches a fade-to-black / cinematic transition, and enters its **fictional, changeable alternate-history past**.
6. Use first-person point-and-click navigation between reusable engineering locations and case-specific locations. Review a read-only **Evidence Notebook** of evidence gathered in the present.
7. Speak to context-triggered team members and directly configure engineering equipment/settings. Engineering decisions may be simple or specification-rich depending on case.
8. Directly impacted engineering indicators update during preparation; effects not inferable from those displayed indicators may be revealed only on **Execute Mission**. Players can revise all planned changes before execution. There is **no separate pre-execution test/simulation action**.
9. Confirm **Execute Mission**: this consumes the mission's sole attempt, shows a cinematic success/failure outcome and then an engineering explanation/report. The player explicitly chooses **Return to Station**.
10. Missions remain open in any order; after all five attempts are resolved, show a final cinematic plus a consolidated mission/engineering report.

> **Historical accuracy boundary:** NASA historical mission records and data must be verified, attributed and differentiated from fictional alternative interventions, simulated outcomes, invented characters/dialogue and placeholder values. The motor examples below are illustrative, never actual NASA specifications.

## 2. Present timeline — exactly four core rooms

| Room | Content and interaction |
|---|---|
| **Investigation Room** (starting hub) | Mission objectives/briefings, the five mission files and filed evidence review/organization, and each mission's Rescue Mission console/entry. These are diegetic room hotspots, rather than separate permanently open HUD panels. |
| **Archive Room** | Mission file/feed data: launch timing, personnel, hardware/motors/equipment, power, datasets, mission objectives and other operational metadata. |
| **Recordings Room** | Audio and video records derived from mission research / aggregated source data. Do not invent archival media. |
| **Signal Room** | Approved as a distinct fourth room; specific signal/telemetry tools and exact evidence content still depend on case authoring. |

- Player navigation is first-person point-and-click, not full-body walking. A room may use a carefully composed static/semi-animated scene with clickable hotspots.
- Character full-body walking/idling/emotion sprite production is **not required**; Henda may appear in portraits, dialogue and key story moments.
- Reuse core room scenes across the five dossiers, swapping content rather than requiring five separate room sets.
- The **Mission Objective** lives in Investigation Room. Mission files and Rescue controls also live there; do not maintain a permanent five-folder HUD bar.
- Persistent minimal HUD: room navigation, **investigation progress**, and a small robot assistant button. A context action **Add to Mission** appears when relevant evidence is inspected. No standalone toast/notification system is requested.

## 3. Evidence filing — approved game rules

- Five mission dossiers are all available from the beginning; none are sequentially locked.
- A discovered evidence item can be assigned to **any** mission folder, including an incorrect one.
- Incorrectly assigned evidence **stays saved** in the chosen folder; do not immediately display a 'wrong folder' warning or reveal its true mission.
- Only evidence required by, and currently filed in, its **correct** mission folder contributes to that mission's progress. Misfiled evidence grants progress to neither the wrong folder nor the correct one.
- Players may move evidence between folders freely, without penalty. Moving a correctly filed item out must reverse its progress contribution.
- Display progress as **N / M required evidence + percent** for the relevant mission; separate values for each dossier. Percentage = correctly filed required items / total required items, not arbitrary milestones. Count each unique evidence ID once.
- Unlock the individual **Rescue Mission** button at 100%; do not unlock on discovery alone or on filing unrelated items. Present a confirmation before consuming the one attempt.
- Required evidence sets/counts and provenance are **content-owner inputs still unavailable**. Use explicitly labeled placeholders in mocks, not purported real NASA evidence.
- UI must make filing and moving evidence understandable without giving away whether a chosen folder is correct. No extra notification workflow; saved state and progress affordances suffice.

**Prior conflict:** This intentionally replaces the previously mandated multi-evidence drawing/link board plus hypothesis-testing gate (I01/I02) as **required core rescue-unlock mechanics**. Those older features are not in the newly scoped minimum. Their potential optional future role is OPEN, not silently claimed removed from all future builds. Clue-driven observer-only flashbacks remain separately unresolved (see §9).

## 4. Assistant — fixed contextual help, not generative AI

- One small stylized robot identity, accessed consistently from the UI in all present rooms; not a separate fully animated NPC standing in every room.
- Uses **prewritten question/answer options**, chosen contextually for current evidence, file or room.
- Helps explain source documents, technical terms and how to interpret content. May offer bounded guidance without automatically sorting evidence or revealing the solution.
- No live AI-chat/API/back-end dependency is required. Help text must be authored and scientifically checked with the relevant case data.
- Robot visual motion is lightweight. Keep only necessary portrait/icon/UI assets.

## 5. Alternate-history past — engineering rescue gameplay

- **POV/navigation:** first-person, room-to-room point-and-click like the present. Enter via lights fading to black, cinematic time-travel motion, then a past room reveal.
- **Locations:** a **hybrid set** of reusable shared engineering room types plus case-specific rooms/areas where justified. Exact past room list and counts are not yet approved.
- **Core interaction:** clickable objects/equipment within the environment open clear, mission-specific engineering interfaces. Players choose/adjust components/settings themselves, with real engineering tradeoffs where data permits.
- **Dialogue:** relevant engineers/team characters appear contextually at decisions, not constantly occupying each room. They may advise, question, object or warn; their reaction is not an automatic correctness check. Dialogue may offer 'Replace / Keep' or similar choices tied to the actual system state.
- **Decision types:** mixed simple and specification-based challenges (e.g., component mass/power tradeoffs or unit-system/configuration problems) determined by the actual historical case and carefully designed fictional intervention.
- **Engineering Status:** a persistent button opens a **collapsible panel** for mission-relevant resource indicators (e.g. mass in kg, power in W); it can be closed to see the room.
- **Feedback:** if an action mathematically changes a displayed measurable resource, update that value immediately and consistently. A change with no directly visible resource consequence may produce its true mission consequence only at execution. Unit conversions must be treated with physically correct dimensions, not assumed harmless.
- **Evidence Notebook:** a persistent, convenient **read-only** panel for reviewing evidence already collected in the present; no new filing/sorting in the past.
- **No pre-launch testing:** no trial runs, dry-run simulation, or 'test your rescue' action during preparation. Visible resource calculations are allowed and do **not** equal success prediction.
- **Free revisions:** prior to final execution, a player can revise component and configuration decisions arbitrarily. Single attempt is consumed only on final confirmed **Execute Mission**.
- **Results:** execute → per-mission cinematic outcome → engineering report explaining decision effects/limitations → explicit Return to Station. Mark mission Rescued/Failed and prevent replay of that attempt in the current run. Final all-five ending additionally gives a cinematic and global report.
- **Technical model:** the existing pure deterministic, validated, data-driven engineering engine remains a useful architectural direction; numeric formulas, scenario rules and feasibility boundaries are still unprovided.

**Prior conflict:** Per-mission immediate reveal and irreversible execution **supersede** the earlier D17–D19/E04–E05/V08 single collective-only Final Evaluation policy, as well as free editing of already submitted mission plans until that collective evaluation. A final collective *summary* still exists, but it is not the first point at which individual outcomes are revealed.

## 6. UI placement

| Element | Placement / behavior |
|---|---|
| Room navigation | Minimal, persistent present/past room navigation |
| Investigation progress | **Always visible** during present investigation; per-mission fraction and percentage, with current mission context understandable; accessible mission progress overview if needed |
| Mission brief/objective | Investigation Room hotspot |
| Mission files/evidence organizer | Investigation Room hotspot, five concurrently available folders |
| Evidence inspection | Contextual viewer when a clue/document/recording is opened |
| Add to Mission | Contextual filing action from evidence viewer, with five-folder selection |
| Rescue Mission | Investigation Room, per-dossier unlock at required-correct-evidence completion |
| Robot assistant | Persistent help affordance, contextual fixed Q&A |
| Engineering Status | Collapsible button/panel in past |
| Evidence Notebook | Read-only panel in past |
| Outcome/engineering report | After confirmed Execute Mission; Return to Station action |
| Extra notifications | **Do not build** a separate pop-up/toast notification system |

The visible **Investigation Progress** remains present in the HUD even though Mission Files, Objective and Rescue Console are diegetic Investigation Room interactions.

## 7. Story and art-production direction

- **Hybrid Storytelling:** environmental records, investigation clues, relevant character dialogue and selectively cinematic key moments.
- **Look:** polished 2D *geometric stylization*, **not anime or pixel art**; station navy/orange, past cream/yellow, space purple remain established direction.
- Optimize for quality and small demo scope rather than many expensive character animations.
- Present minimum art planning: four room backgrounds; clickable mission brief / evidence filing / rescue control props; research-specific media presentation; robot icon/portrait; reusable evidence/file/recording UI; Henda portrait when narratively useful. Past: shared backgrounds plus case-specific views, clickable equipment, a few contextual dialogue portraits, Engineering Status/Notebook panels and transitions.
- **Do not assume** exact asset counts, dimensions, canvas orientation, camera crop, content, actual original illustration delivery or any completed media. Legacy portrait-first technical constraint remains in the repository; check final panorama/portrait responsive treatment before asset production.
- 3D rigs, walk cycles, large emotion sprite sets and heavy cinematic character animation are explicitly outside the current visual plan.

## 8. Data and engineering implications (not an implementation spec)

- Use stable IDs for missions, evidence, folders, rooms, assets, decisions, components and content-triggered dialogue.
- Evidence stores discovered state and **single current folder assignment** (or unfiled); progress derives from validated evidence-to-required-mission references and can decrease when evidence is moved.
- Rescue availability derives from required evidence completion; it must be enforced in domain logic, not only by a disabled button.
- Engineering configuration supports editable draft, deterministic derived resource indicators, single final execution state, persisted immutable per-mission outcome and return-to-present step.
- Historical source data and fictional intervention state require distinct labels and provenance.
- This is a direction/behavioral contract, **not** authorization to implement unverified NASA datasets, formulas, a new backend, or automatic AI answers.

## 9. Remaining OPEN / content dependencies

1. Final five mission identities, timelines, objectives, evidence lists and correct folder mappings (Content Owner).
2. Archive/Recordings/Signal room detailed hotspots and media content; specific NASA research/rights/provenance (Content Owner + Designer).
3. Past room inventory, case-specific components, engineering scenarios, decision parameters, valid dimensional equations, success thresholds and actual narrative dialogues.
4. Mission-specific fixed assistant Q&A and scientific fact-checking.
5. Responsive/canvas layout, room compositions, camera framing, accessibility interactions, exact asset files/formats and transitions.
6. **Previously approved shared fictional Global Budget (E04)** is not mentioned or explicitly reversed in the new design discussion; decide whether to retain, simplify or remove it in the new per-mission immediate-execution model before implementation. Do not implement incompatible old end-of-run budget locking as if still confirmed.
7. **Previously approved observer-only investigation flashbacks (I04–I06)** were not revisited in the 18 questions. Their status, priority and any effect on unlock conditions require confirmation; do not confuse these with changeable Rescue Mission past.
8. Prior 2026-10-30 docs describe fixed portrait-first gameplay; the newer panoramic/first-person presentation needs a responsive layout decision, but first-person does not by itself mean landscape orientation.
9. Decide if the final ending is triggered once all five attempts are resolved even when some evidence dossiers remain impossible to complete, and how save/reset/replay and post-failure exploration work.
10. Progress fraction can reveal required evidence totals; this is intentional, while incorrect assignment must not reveal the true target. Confirm per-mission progress UI placement for five simultaneous dossiers on narrow screens.

## 10. Implementation boundary

This change records **design decisions, not completed game code**. Update older active specs, schemas, and tests in a separately reviewed engineering integration batch. Do not silently preserve contradictory enforcement of collective-only outcome, mandatory link-board gating or pre-execution testing. Newer explicit approvals should be reconciled by product/technical owners before code integration.

**Current camera supplement (2026-11-13):** Henda is female, not the older male draft. Mouse-look without hold, art-layer decomposition, and tactile drawer are NOT implemented by this document and do not alter the five-folder progress/Rescue unlock contract.
