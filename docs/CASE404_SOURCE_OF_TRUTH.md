# CASE:404 — Project Source of Truth

**Document type:** Living product / game-design master brief  
**Version:** 0.1 — consolidated discussion record  
**Last consolidated:** 2026-10-29  
**Status:** Pre-production / brainstorming; not an implementation specification approved in full  
**Project:** NASA Space Apps Challenge 2026 — *Space Mission Design Game*  
**Language:** Arabic planning text; technical terms and UI concepts in English

> **How to use this document:** This is the canonical record of **what the team discussed**, not a claim that every proposal is approved or implemented. Read the **Decision Register**, **Unresolved Questions**, and **Contradictions** before implementation. Any new change should update the document's version and decision register. Facts from historical NASA missions must be kept separate from fictional alternate-history game events.

## 0. Status legend

- **CONFIRMED:** Explicitly selected/approved by the user in the discussion.
- **DIRECTION:** Intent strongly expressed, but detailed mechanics still need approval.
- **PROPOSED:** Suggested by the assistant, not approved as a final decision.
- **OPEN:** Not yet decided, or conflict requires resolution.
- **SUPERSEDED:** Earlier direction replaced by a later one. Keep for traceability, **do not implement**.

## 1. Executive summary

**CASE:404** is a stylized 2D sci-fi mystery/investigation and space-mission engineering simulation game. The player portrays a fixed, approximately 25-year-old male aerospace engineer and investigator. The fantasy is to investigate spacecraft crises, reconstruct past events from clues, diagnose the technical fault and mission phase, and use engineering choices to plan a rescue or corrective intervention. It is inspired by the *investigative presentation* of *An Elmwood Trail* (messages, files, hidden clues, deductions), not intended as a copy of that game's story or artwork.

The game includes **five cases associated with five actual NASA missions**, presented as **alternate-history simulations**. Their evidence is mixed across multiple rooms of a common station. Players discover clues hidden in documents, rocket markings, images, recorded video and other objects; assign evidence to the correct mission file; inspect visual reconstructions; and submit one **Rescue Mission** plan per file. **Success/failure outcomes are revealed once, together, at the final evaluation, not after each submission.**

**Central educational intent:** players should experience mission-design tradeoffs (objectives, vehicle and instrument choices, launch vehicle, budget, power, mass, communications, trajectory/orbit constraints) and see how engineering reasoning changes mission outcomes. A quiz-only game will not fully address the challenge.

**Working title:** **CASE:404** (selected, not yet name/trademark-availability cleared). Earlier names *THE LAST SIGNAL* and *CASA:404* are **SUPERSEDED**. The alternate draft tagline **“Every Error Leaves a Trace”** is only **PROPOSED**.

## 2. NASA challenge problem and response

### 2.1 User-provided official challenge statement

> Designing a space mission requires careful consideration of competing demands, including mission objectives, spacecraft design, scientific instruments, launch vehicles, budgets, power, mass, communications, and orbital constraints. For students who rarely get to experiment with an entire mission from concept to operation, these trade-offs often remain abstract. Your challenge is to create an interactive game that allows participants to design, manage, and simulate a complete space mission while making engineering decisions, managing limited resources, and evaluating how each choice shapes the success of their mission.

- **Event:** NASA Space Apps Challenge 2026.
- **Challenge:** Space Mission Design Game.
- **Difficulty labels supplied:** Intermediate; Beginner/Youth.
- **Subject:** Games.
- **Problem:** Whole-mission tradeoffs are abstract for learners who cannot experiment with a complete mission.
- **Required outcome:** Interactive game enabling design, management and simulation of a whole space mission, with meaningful choices and resource constraints.
- **Official challenge description located:** https://www.spaceappschallenge.org/2026/find-a-team/hack-space/ (also repeated on other registered team pages; see Sources).

### 2.2 CASE:404 response

- **Mystery hooks the player:** investigate scattered evidence and recognize causes rather than read a textbook.
- **Engineering is consequential:** decisions about hardware, mission constraints, maneuvering, power, etc. must be evaluated in a simulation.
- **Alternate history allows counterfactual learning:** what could have changed if the cause was detected and a feasible corrective decision was made **before the point of no return**?
- **Historical comparison closes the loop:** final report distinguishes the user's alternate result from what actually happened.

**Gap to explicitly resolve before claiming full challenge compliance:** The current case-based investigation structure alone does **not yet specify a complete end-to-end mission-design loop** for each case. It needs explicit decisions about objectives, spacecraft/instruments, launch vehicle where relevant, resource allocation, operations and simulation. Avoid reducing the game to “pick fault + pick solution.”

## 3. Audience, genre and player fantasy

- **Genre:** Space Mystery + Engineering Simulation + Detective Investigation + narrative adventure.
- **Tone:** Suspense, intellectual curiosity, technical urgency, cinematic risk; suitable for learners, with approachable interaction and real tradeoffs.
- **Player:** Fixed protagonist, space engineer + investigator, capable of designing/planning a rescue or intervention.
- **Original dramatic premise:** a crewed spacecraft loses contact in space; the protagonist must deduce what happened and launch rescue equipment/vehicle. If correct, both return; if wrong, the protagonist may become lost as well.
- **Updated selected premise:** five real NASA missions with alternate-history interventions. **OPEN:** most candidate missions are uncrewed and some failed at launch/re-entry; the literal “rescue crew on every case / player lost with them” cannot accurately apply to all five. Preserve it as the initial dramatic fantasy, not a universal historical fact or finalized mechanic.
- **Player promise:** “Investigate the evidence. Find the underlying engineering failure. Change the mission outcome.”

## 4. Team and handoff responsibilities — CONFIRMED

**Team size: 3.**

| Role | Owner / output | Not responsible for |
| --- | --- | --- |
| Content Writer | Think through/write complete game flow details, define the five missions, stories, scene progression, clues, hidden marks/codes, evidence links, narrative beats, dialogue, audio scripts, deductions and case outcomes; research authoritative NASA facts | Creating all visuals or implementing the app |
| Designer (user) | Overall art direction; all visuals; scene/character/background assets; visual reconstructions; motion/cinematics; voice-over and auditory presentation | Writing the full case logic or coding the app |
| Engineer | Turn approved content, assets and mechanics into a playable app; rooms, hotspot interactions, evidence database, sorting, mission files, choice/simulation engine, state tracking, deferred outcomes, testing | Independently inventing unapproved story/design decisions |

**Delivery instruction from engineer:** after creative/asset decisions are finalized and material produced, consolidate assets and a `.md` handoff specifying every asset, filename, use and reference. **This master file is being requested now**, but production assets and asset manifest are **NOT YET CREATED/APPROVED**.

**Process:** content and designer define the experience with the engineer's feasibility feedback. Engineer should not be handed an ambiguous choice as though approved. A shared game-data schema is recommended before five cases are authored.

## 5. Decision register (chronological summary)

| ID | Decision | Status |
| --- | --- | --- |
| D01 | Five total cases/missions | **CONFIRMED** |
| D02 | Player is simultaneously aerospace engineer and investigator | **CONFIRMED** |
| D03 | Evidence includes mission files, historical messages, recordings, telemetry, photos etc. | **CONFIRMED** |
| D04 | Clue can open visual recreation of what happened at that time (*Mission Reconstruction*) | **CONFIRMED** |
| D05 | Each case's principal failure is associated with a particular mission phase | **CONFIRMED** |
| D06 | Fixed main character, young man ~25, strong, competent, observant, smart, practical | **CONFIRMED** |
| D07 | 10-second fast cinematic montage through rocket shot, then slow station-director call | **CONFIRMED** |
| D08 | Three environment categories: Past cream/yellow, Station navy/orange, Space purple | **CONFIRMED** |
| D09 | Main character full geometric stylization, geometric face option B, dramatic cinematic shading option C | **CONFIRMED** |
| D10 | Character sleek long mullet; dark hair; angular glass-forward fantasy/sci-fi glasses | **CONFIRMED** |
| D11 | Character outfit blue/white + silver/gray; no orange; no wrist computer; no data tablet; no replacement gadget | **CONFIRMED** |
| D12 | Full body + closeups in cinematic opening; portrait in gameplay; observer-only during Reconstruction | **CONFIRMED** |
| D13 | Hybrid investigation: several rooms in one station, with clickable objects | **CONFIRMED** |
| D14 | Room-to-room point-and-click via doors (B), not free walking | **CONFIRMED** |
| D15 | Same rooms across five cases; the evidence/content changes | **CONFIRMED** |
| D16 | Evidence of five missions is intermingled; player sorts which clue belongs to which mission file | **CONFIRMED** |
| D17 | Each mission file has a **Rescue Mission** button to diagnose issue and choose response | **CONFIRMED** |
| D18 | All five outcomes shown once at the end, no immediate win/loss after individual plan | **CONFIRMED** |
| D19 | Cases based on **real NASA missions**, with explicitly **alternate-history simulations** | **CONFIRMED** |
| D20 | Specific historical list MCO / OCO / MPL / Genesis / Apollo 13 | **PROPOSED**, not individually approved |
| D21 | Exactly five specific rooms and diagrammatic station layout | **PROPOSED**, not finalized |
| D22 | Whether doors/rooms/evidence unlock progressively, or freely | **OPEN** |
| D23 | Exact mission resource simulation / numbers / rescue vehicle mechanics | **OPEN** |
| D24 | Final results single reveal; whether individual cinematic results are played sequentially in that reveal | **OPEN** |
| D25 | Opening video is an optional near-term production task; no final production asset approved | **DIRECTION** |

## 6. Complete player experience / gameplay loop

### 6.1 Intro and onboarding

1. **0:00–0:10 — cinematic montage** (details in §10): lost craft in purple space -> panic in navy/orange station -> fixed protagonist enters -> inspecting papers/photos/evidence -> rocket shot as final visual transition.
2. Transition into the **playable station UI**. The rocket shot is a *teaser/transition*, **not evidence that the player has already launched the actual rescue**.
3. **Station Director incoming call**. Unlike montage, it is paced slowly: explains emergency, role, basic objective, and first interaction. Exact script, duration, speaker appearance/voice and how five historical cases are framed are **OPEN**.
4. Player starts investigation.

### 6.2 Investigation loop across all five missions

1. Navigate connected station rooms using **fixed-camera point-and-click**.
2. Click a door to move to the neighboring room; click an object/hotspot to inspect it.
3. View documents, engineering reports, computer screens, messages, voice logs, video, launch photos, telemetry and mission diagrams.
4. Find a clue in *the details*, e.g. mission symbol/letter on the paper, marking on a rocket, specific timestamp, tiny detail hidden in a video or photo, code printed on an item. These symbols are **identification hints**, **not unlock codes required to access a case**.
5. Choose which of **five mission folders** the evidence belongs to; ideally allow corrections before final commit.
6. Some evidence unlocks a **Mission Reconstruction**: a visual reenactment of the event that happened; player watches as observer, without protagonist inserted into past scenes. Reconstructions must be **evidence-bounded**: do not expose the complete answer from a single fragment.
7. Cross-reference mission evidence, systems and timeline; infer cause, failed phase and intervention strategy.
8. Repeat freely across rooms/missions until ready.

### 6.3 Mission-file loop

Each of five persistent *mission dossiers* should have:

- Mission identity/name or identifying marks;
- Short objective / context;
- Evidence cards that player assigned;
- Inspection/replay links;
- Timeline/reconstruction links where justified;
- Diagnosis and engineering analysis view;
- **Rescue Mission** button;
- Progress state (e.g. investigation ongoing, plan prepared, submitted) with **no success/failure leakage**.

**Rescue Mission button** opens a per-file action flow:

1. Identify what went wrong (root cause, not only symptom).
2. Identify the relevant mission phase.
3. Choose or assemble the engineering intervention / rescue solution and, where needed, plan equipment/vehicle/resources.
4. Review constraints and commit **one plan for that file**. Exact editing/re-submission policy **OPEN**.
5. Return to investigation without seeing success/failure. A neutral acknowledgment (e.g. **Plan Submitted**) is acceptable.

### 6.4 Single final reveal

- Once all five plans are submitted, player invokes **Final Evaluation / Transmit All Rescue Plans / Run Final Simulation** (final text **OPEN**).
- Run mission-state evaluation for each plan; show all five mission outcomes in **one final reveal**, not immediate feedback per file.
- Proposed useful breakdown: correct/incorrect evidence classification, diagnosed cause, phase, intervention feasibility, resource impact, mission success/partial/failure; combined score across five.
- Reveal what **actually** happened historically (with NASA source and uncertainty) vs fictional simulation outcome.
- The **mechanic of “one display”** is confirmed; the exact scoring, failure grades, number of endings and animation format are **PROPOSED/OPEN**.

### 6.5 Important clarifications / superseded models

- **SUPERSEDED:** five missions unlocked sequentially (finish Case 1 to access Case 2).
- **SUPERSEDED:** five independent case access codes to open missions.
- **ACTUAL:** five mixed-evidence missions simultaneously active; mission symbols/codes can be hidden on evidence so player **sorts** it.
- **SUPERSEDED:** immediate pass/fail each time player clicks Rescue Mission.
- **ACTUAL:** player submits plan, outcome deferred to single collective ending.
- **SUPERSEDED:** one investigation room with tabs as the entire environment.
- **ACTUAL:** several connected rooms with fixed camera and click navigation.

## 7. Station design and navigational model

### 7.1 CONFIRMED core principles

- **Multi-room mission-control station** is the recurring hub.
- **Same physical rooms / backgrounds** serve the five cases; new evidence and interactions reflect the mission.
- Point-and-click exploration: room view -> click hotspots -> closer evidence UI -> close -> same room; clicking door moves to adjacent room.
- Main character appears as **portrait** during dialogue/reactions (not a full-time walking avatar).
- A common global mission-file/evidence sorting system is needed.

### 7.2 Room list — PROPOSED, not yet approved as final count

| Proposed room | Possible purpose and clue classes |
| --- | --- |
| Mission Control | Last transmissions, live/saved telemetry, warning logs, comms, mission status |
| Mission Archives | Old plans, risk reports, designs, documents, engineer messages, launch records |
| Engineering Lab | Subsystem schematics, tests, fault hypotheses, power/fuel/thermal/navigation models |
| Investigation Office | Evidence wall, classification, chronologies, cross-case deductions |
| Rescue Bay | Rescue options, vehicle and equipment configuration, budget/mass/power checks |
| Hallway / connectors | Visual navigation between doors; not necessarily a sixth puzzle room |

**OPEN:** actual number of rooms, exact objects/hotspots, connectivity/door map, gating, clues by room and cross-case visibility. Previous assistant mock station map was **illustrative**, not approved physical architecture.

### 7.3 Evidence mechanics

- Evidence can be documents, photographs, mission emblems, numbers/codes, video-frame details, voice phrases, engineering notes, telemetry anomalies, or spacecraft/rocket markings.
- The **symbol/code is a forensic mark** helping attribute a clue to one mission, not necessarily a secret password.
- Mission files can show wrong clues if the player assigns them incorrectly; suggested: no instantaneous green/red correctness feedback (otherwise the sorting puzzle becomes trial-and-error). **PROPOSED**.
- Preserve provenance: source room, inspected artifact, time, mission assignment, and replay reference.
- Sorting should allow undo/correction before final submission (**PROPOSED**, needs decision).
- Risk: repeated fixed rooms for all cases can become visually stale. Different documents, active displays, hotspot states, light cues, and discoveries should update without fully redesigning the station.

## 8. Mission Reconstructions

**CONFIRMED idea:** when a player sees important evidence they can view a **visual rendering of what occurred at that moment**.

- Possible label: **Mission Reconstruction** (preferred wording from discussion; **PROPOSED** as final UI label).
- Historical memory/flashback/reconstruction category: warm cream/yellow.
- Triggered by clues; uses video, animated panels or reconstructed scenes.
- **Observer mode:** protagonist is not physically in the archived event.
- Show event state, system changes, participants/equipment, consequences *as far as evidence supports*.
- Later clue discoveries may enrich the same reconstruction with additional layers or reveal an alternate angle (**PROPOSED**).
- Do not portray a hypothesized past scene as an authenticated NASA recording. Label **archival / reconstructed / alternate-history** clearly.
- No final asset format, length, count or storyboard is approved yet.

## 9. Art direction — confirmed visual language

### 9.1 General illustration style

- Base: **Stylized 2D Sci-Fi** matching the illustrated environment reference supplied in chat.
- Current character harmonization choice: **Full Geometric Stylization**.
- Character face: **B — simplified geometric features with clear, readable eyes and expressions**.
- Shading: **C — geometric color planes with stronger cinematic lighting**.
- Clear silhouettes, simple geometric shape language, consistent ambient illumination; avoid character being dramatically more detailed or anime-realistic than backgrounds.
- Character may use nuanced lighting to sit in scenes, but core clothing colors **do not change** by category.
- **Sources of truth for visual references:** two user-shared style/character reference images and several generated concept iterations in the conversation. They are conceptual references; asset IDs / paths for engineering delivery are not yet assigned in this document.

### 9.2 Three visual environment categories (CONFIRMED)

| Category | Color identity | Mood | Scene uses | Suggested palette — PROPOSED swatches |
| --- | --- | --- | --- | --- |
| **Past** | Yellow + Cream | Warm, faded, mysterious, nostalgic / archival | Historical moments, recordings, evidence reconstructions | `#FFF1CE`, `#EFC96B`, `#DDA548`, `#AD865C`, `#675348` |
| **Station** | Navy + Orange | Technical, tense, analytical, controlled | Main rooms, investigator UI, Mission Control, briefings | `#0B1734`, `#182A4A`, `#F18A38`, `#FFBF69`, `#E5ECF4` |
| **Space** | Purple / Violet | Vast, unknown, mysterious, isolated, cinematic | Exterior spacecraft, launch-rescue teaser, orbital visualizations, rescue scenes | `#170B38`, `#422076`, `#7950B5`, `#B58CE5`, `#E1B5F1` |

**IMPORTANT:** Category colors are agreed. Exact hex codes and any 60/25/10/5 distribution were **assistant proposals**, **not approved final color tokens**.

### 9.3 Cross-environment character rendering

- **Station:** cool navy ambience with orange screen/alert reflected light only (NO orange garment accents).
- **Past:** cream/gold ambient light over the same character or reconstructed participants; soft archival feeling.
- **Space:** purple/lavender rim lighting and deep blue shadows.
- Keep silhouette, face and outfit identifiable under all three lighting schemes.

## 10. Cinematic opening — CONFIRMED sequence and timing

**Duration targeted: 10 seconds total up to and including rocket shot.** Not 10 seconds plus the investigation montage. **Director call happens afterward, slowly.**

Ordered shots (timing per shot OPEN):

1. **Space:** lost/disconnected spacecraft in purple cosmic isolation, possible signal glitches/distress texture.
2. **Station:** panic, alerts, people responding in navy/orange mission control.
3. **Protagonist enters:** strong presence; full-body shot reveals outline/coat; closeups may show eyes/glasses and hair.
4. **Investigation montage:** quickly examines mission papers, old photos, files, evidence wall; purposeful fast cuts.
5. **Rocket shot:** concluding transition into initial game interface, **symbolic/foreshadowing** rather than proof a rescue launched before diagnosis.
6. **AFTER the 10 seconds:** UI starts; **Station Director call** explains crisis, goals, investigation role and first task at a relaxed pace.

Audio design ideas (not final assets): fragment of distress transmission, comm static, alarms, dramatic transition, then calmer dialogue / director voice-over. No script or speaking language selected yet.

## 11. Main protagonist — character design record

**CONFIRMED profile:**

- Fixed **male**, around **25**.
- Aerospace engineer, investigator, potentially mission/rescue lead.
- Strong, professional, smart, practical, highly observant; composed and competent (not exaggerated military fighter or superhero).
- Lean/slim-athletic body; confident upright posture; strong structured/recognizable silhouette.
- Angular/defined face and focused gaze retained from successful earlier concept.
- **Dark hair**, sleek **long mullet**, less wavy, longer at back with organized large geometric hair sections.
- **Fantasy/futuristic angular glasses**, more pronounced/transparent glass lenses, thin or minimal frame, eyes remain legible.
- **Long structured coat/jacket** with recognizable collar/tail, layered technical inner clothing, practical cargo-style pants, boots and gloves; outfit shapes retained from concept revision.
- **Blue + White + Silver/Gray** clothing palette; **remove all orange garment accents**. Orange may be reflected from station environment only.
- **Remove wrist computer entirely. Remove data tablet entirely. No substitute large gadget/accessory.**
- Mission emblem/patch retained from prior concept (specific vector form/placement not finalized).
- Same medium overall level of design detail, adapted to geometric simplification and more cinematic light.
- **More and clearer facial expressions**. Candidate range: neutral, focused, thoughtful, suspicious, concerned, alarmed, determined, realization, frustrated, shocked, relieved; exact sprite count OPEN.

**Appearance by usage (CONFIRMED):**

1. **Opening:** full-body shots with face/eyeglass closeups.
2. **Gameplay/dialogue:** portrait during interactions, not a continuously controlled walking character.
3. **Reconstruction:** observer-only; reconstructed past does not put protagonist into historic events.

**Evolution of designs:**
- Early navy/gray/orange, wrist computer and tablet = **SUPERSEDED**.
- Intermediate wolf cut = **SUPERSEDED** by sleek **long mullet**.
- Character-sheet-heavy anime-like detail = **SUPERSEDED** by full geometric stylization.
- Multiple AI-generated character concept images exist in conversation; latest one was liked, but **full geometric redraw has not been produced/approved**. Do not claim current image fully matches new style.

## 12. Game UI/UX and views

- Persistent world: click-to-investigate station room backgrounds.
- Detail overlay/view: document reader, intercepted message threads, audio player/transcript, inspection of rocket/mission photos, telemetry graph/engineering model.
- Mission assignment interaction (file shelf or evidence board with five folders).
- Mission dossier view with evidence, reconstruction links and Rescue Mission.
- Diagnosis controls to choose **root cause + phase**.
- Rescue planner with choices and constraints, not only quiz buttons.
- Submitted plans should display a **neutral, non-result state**.
- Final mission report reveals all outcomes collectively and educational historical comparison.
- Minimal confusion/back navigation: click to inspect; close to previous room; click door to navigate. Design hot spots for mobile usability.
- User originally mentioned a mobile-app-like experience inspired by Elmwood Trail; **actual platforms / screen orientation / resolution / accessibility specifications are OPEN**.

## 13. Five historical candidate missions — PROPOSED lineup (not final selection)

> The user **confirmed the concept of five real NASA missions with alternate history**, NOT this exact list. The five below were suggested as candidates. Keep authoritative historic facts separate from invented documents/voice lines/rescue paths. Exact “failed phase” label can differ from “root cause originating phase”; content writer must specify both.

### 13.1 Mars Climate Orbiter (1999) — candidate

- **Actual:** Navigation error tied to English-versus-metric units in spacecraft/ground navigation data led to a wrongly calculated Mars arrival trajectory and spacecraft loss. NASA JPL: https://www.jpl.nasa.gov/missions/mars-climate-orbiter/ . NASA report discussion: https://swehb.nasa.gov/spaces/7150/pages/16449723/SWE-017%2B-%2BProject%2Band%2BSoftware%2BTraining .
- **Teaching point:** interfaces, unit consistency, validation, trajectory/orbital calculations, quality controls.
- **Candidate failure phase:** ground software/interface design & verification; exposed in cruise/navigation/Mars orbital approach. Distinguish cause origin from observed failure.
- **Evidence possibilities — FICTIONAL GAME CONTENT until sourced:** mismatched unit annotations, navigation report, trajectory adjustment records, engineering correspondence, telemetry.
- **Alternate-history intervention — FICTIONAL:** detect unit mismatch and re-run trajectory computation / correct planned maneuver **early enough** with feasible fuel and time; no miraculous rescue after destruction.

### 13.2 Orbiting Carbon Observatory (OCO, 2009) — candidate

- **Actual:** Taurus XL payload fairing failed to separate in launch, excess mass prevented achieving required orbit and the mission was lost. NASA JPL: https://www.jpl.nasa.gov/news/nasa-releases-orbiting-carbon-observatory-accident-summary/ . NASA lessons learned: https://llis.nasa.gov/lesson/2257 .
- **Important uncertainty:** launch investigation cited **potential causes** of fairing failure; do **not** assert one specific mechanism as definitively proved on the basis of this summary.
- **Teaching point:** launch vehicle constraints, payload mass, fairing separation, system verification and contingency feasibility.
- **Candidate phase:** launch; potential underlying design/manufacture/verification problems.
- **Evidence possibilities — FICTIONAL until sourced:** separation event sequence, mass calculations, component inspections, pre-launch warnings.
- **Alternate-history intervention:** discover/repair fairing separation risk **before launch**, or postpone/replace hardware; don't portray a simple recovery of a non-orbiting destroyed satellite after the fact.

### 13.3 Mars Polar Lander (1999) — candidate

- **Actual:** Lost on December 3, 1999. NASA states a **most likely explanation**, not a confirmed conclusively observed cause: false landed-indication may have shut descent engines prematurely. NASA: https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/ .
- **Teaching point:** sensor interpretation, software fault detection, timing of descent, risk in autonomy and EDL.
- **Candidate phase:** landing / entry-descent-landing; possible test & verification root origin.
- **Evidence possibilities — FICTIONAL until sourced:** sensor event sequence, leg-deployment log, auto-shutdown logic, descent control tests.
- **Alternate-history intervention:** validate software logic before encounter, prevent premature shutdown using appropriate evidence and constraints.

### 13.4 Genesis (2004) — candidate

- **Actual:** Sample return capsule parachute deployment failed; the capsule struck the ground. Investigation connected this to design that permitted incorrect assembly orientation of gravity-switch components. Some science samples were still recovered, so **not a total scientific loss**. NASA: https://science.nasa.gov/mission/genesis/ .
- **Teaching point:** design for assembly, orientation/verification, redundancy, sample recovery.
- **Candidate phase:** return/re-entry/recovery; design/assembly origin.
- **Evidence possibilities — FICTIONAL until sourced:** assembly diagrams, sensor orientation, parachute sequence, recovery test.
- **Alternate-history intervention:** detect faulty assembly/verification before capsule return and fix in feasible timeline, or plan recovery of samples if event cannot be prevented.

### 13.5 Apollo 13 (1970) — candidate

- **Actual:** Oxygen tank explosion seriously compromised spacecraft systems; Apollo 13 did **NOT** fail as a crew rescue: the **lunar landing objective was aborted, but all three crew returned safely**. NASA: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/ .
- **Teaching point:** power, oxygen, life-support, water, communication, trajectory, resource preservation and emergency operations.
- **Candidate phase:** in-flight operations/emergency; antecedents in design/ground handling.
- **Evidence possibilities — source first:** public mission logs, flight timelines, constraints, procedures. Invented dialogue must be labeled fictional.
- **Alternate-history intervention:** alternate decisions under the same crisis; show viable/failed pathways and **compare with the successful historical rescue**. Don't falsely imply the real crew was lost.

### 13.6 Proposed case-to-phase coverage

| Candidate | Core teaching emphasis | When problem manifests | Where root causes may originate |
| --- | --- | --- | --- |
| Mars Climate Orbiter | Unit validation, navigation | Orbital approach | Software interface, V&V, operations |
| OCO | Fairing, launch-mass tradeoff | Launch | Hardware subsystem/design/verification |
| Mars Polar Lander | Landing logic, sensors | EDL / landing | Software/hardware and validation |
| Genesis | Recovery systems and orientation | Return/re-entry | Design / assembly verification |
| Apollo 13 | Emergency resource decisions | Cruise / in-flight ops | Hardware plus operational response |

**OPEN:** final assignment of five different phase labels; these candidates don't automatically form one case for each canonical phase. Phase taxonomy needs content writer and engineering review.

## 14. Simulation engine requirements (concepts vs approval)

### 14.1 CONFIRMED design intent

- Engineering decisions, not just reading and guessing.
- Rescue/intervention per mission; engineering diagnosis, phase selection and solution.
- Tradeoffs and limited resources affect outcome.
- Player should have to choose mission-rescue tools, equipment and/or vehicle configuration **when fitting the case**.
- Result evaluation deferred until final reveal for all five.

### 14.2 PROPOSED structure, not final game rules

**Example state variables:** budget, mass, power generation/storage/use, fuel/delta-v, time remaining, communication, thermal state, orbit/trajectory, life support (for crewed), science value, mission integrity. Not all apply to every real mission.

**Suggested simulation mechanism:** rule-based, deterministic or documented probabilistic rules with visible resource costs and scientific rationale. Use real/mathematically consistent units and verified ranges; invented illustrative numbers should never be represented as NASA telemetry.

**Per-case plan evaluation:**

1. Evidence assignment quality and completeness;
2. Root-cause and failed-phase reasoning;
3. Validity/feasibility of chosen corrective action;
4. Resource feasibility and safety constraints;
5. Timing relative to irreversible failure;
6. Mission objectives vs crew/samples/instruments saved;
7. Result (success/partial/failure) retained privately until final batch reveal.

**No universal “correct diagnosis = automatic win.”** A correct cause with insufficient fuel, power, launch capability, money or time can still fail. Likewise wrong case assignment can lead to an invalid rescue plan. The exact algorithm remains **OPEN**.

**Suggested case interface/data fields:** `mission_id`, `historical_source_urls`, `era`, `case_phase`, `root_cause`, `observed_symptoms`, `evidence`, `reconstruction_segments`, `available_interventions`, `resource_constraints`, `plan`, `simulation_rules`, `outcome`, `historical_comparison`. This is a **schema proposal** only.

### 14.3 Specific unresolved integration tension

The challenge asks for **complete mission design and management**, but real-event scenarios vary widely: launch failures, spacecraft loss, lander crashes, sample capsule returns, and one crewed emergency. The original notion of **personally launching a rescue craft** is not feasible for all historical cases. A safe and coherent resolution is **case-specific alternate-history engineering interventions** within a shared mission-design simulator, plus potentially one fully playable crewed physical rescue scenario. This is **PROPOSED**, not an authorized change to the user's preferred fantasy. Needs explicit team decision.

## 15. Outcomes, narrative and replay

**CONFIRMED:** only one final outcome reveal for all five submitted plans.

**PROPOSED:** individual missions have outcome success / partial / failure and final report shows five verdicts, aggregate result, what went wrong, which resources were wasted or saved, historical NASA outcome, and what the player learned.

**OPEN:**

- Whether user can preview simulation projections before submitting, without leaking final outcome;
- Whether re-submit is permitted;
- Whether to show intermediate **resource feasibility** warnings vs suppressing all feedback;
- Whether there is time/turn pressure, and how it is balanced for youth;
- Whether the protagonist can canonically become lost in space (original premise) or is a ground-control alternate-history engineer;
- Whether a failed final evaluation restarts one mission or the entire set.

## 16. Production assets — future inventory, NOT yet produced

**All design-production work was intentionally postponed during initial brainstorming.** The following is a candidate inventory for later.

### Visuals

- Three environment style boards and final color tokens;
- Protagonist turnaround/reference sheet in **Full Geometric Stylization** (last generated sheet preceded this final stylization choice);
- Portrait expression set; full-body cinematic shots;
- Station environment master room backgrounds (once count agreed), door and hotspot variants;
- Mission dossier UI, evidence document templates, evidence board, status widgets;
- NASA mission identifiers and historic-photo treatments subject to proper attribution;
- Case-specific props, photos/rocket/spacecraft evidence marks;
- Reconstruction scenes/animations (historically grounded vs conjectural labels);
- Rescue engineering UI/flight visuals;
- Space environment and spacecraft/rocket visuals;
- Final evaluation UI and corresponding cinematic outcomes.

### Audio

- Ten-second montage audio: alarms, signal/static, cinematic transitions, optional distress snippet;
- Station Director voice-over after opening;
- Mission logs / crew audio where appropriate (scripted alternates clearly labeled vs authentic historical audio);
- UI sounds, alert signals, ambient station/space audio;
- Ending narration/feedback if needed.

### Asset handoff later (NOT DONE)

For each approved asset, record: `asset_id`, descriptive name, case/room, purpose, visual category, variant/state, actual file path, resolution/aspect ratio, transparency/layers, duration/fps (video), audio sample rate, loop/trigger conditions, copyright/attribution, version, approval state. Engineer requested `.md` inventory when assets are ready. This current master document is **not a claim those files exist**.

## 17. MVP / scope discussion

**Early proposal (before final five-case investigation design):** one complete end-to-end case, 5–7 files, 8–12 messages, 2–3 audio logs, telemetry, evidence board, 3–5 rescue actions and a few endings. **PROPOSED / OUTDATED IN DETAIL** after the user selected a five-mission combined structure.

**Current fixed commitment in creative direction:** five missions, one shared set of rooms, all five evidence files and a combined final evaluation.

**Realistic production caution:** a three-person team has only one app engineer. Prefer a shared case-data engine and reusable UI/assets. A minimum viable submission may need one case fully simulated and other cases thinner, but that compromises the current five-case intent and would need explicit user/team approval. No such scope reduction is approved.

**Possible stack mentioned but never approved:** React / TypeScript / data-driven JSON, or an equivalent app framework. Specific platform, deployment, codebase, budget and time estimate **OPEN**.

## 18. Today's planning agenda (last discussed)

1. **Name:** CASE:404 selected; uniqueness/availability not checked.
2. **Gameplay flow:** majority of user-facing rules decided, especially mixed clues and deferred evaluation; remaining case-specific choices and constraints not finalized.
3. **Content Writer handoff:** needs enough precise rules that writer can author each mission and clues; this master brief is input, **not yet a finalized content specification**.
4. **Optional:** produce the ten-second opening cinematic if design/flow permits; no video generated under this project record.

## 19. Unresolved questions — priority order

### Critical: story and logic

1. **Which five exact NASA missions?** Proposed list only; confirm each, possibly replace Apollo 13 for “five missions that failed” since its crew rescue succeeded.
2. **What exactly is “alternate-history rescue”?** Prevent failure before point of no return, reverse disaster when feasible, recover scientific data, physical rescue, or varying by case?
3. **How does one protagonist operate across historically different years?** Fictional archive simulation, alternate-timeline agency, reconstructed historical interventions, or other framing. Without this, all five real events in one contemporaneous station can confuse players.
4. **Must each mission have a unique principal phase?** Decide full phase taxonomy and distinction between root origin and visible accident phase.
5. **How to satisfy complete mission design** instead of only diagnosis/rescue selection: explicit design choices, launch vehicle/instruments, constraints and ops in playable loop.

### Experience/UX

6. Final room count and connected door layout (five suggested, not final).
7. Are all rooms open immediately? Can some files/hotspots be locked by discovery?
8. Does opening a clue automatically add it to inventory or must player collect it? How are wrong assignments handled?
9. Are all five mission folder names visible at start? Could historical names give away causes?
10. Is diagnosis mandatory before activating Rescue Mission? Must evidence completeness be checked?
11. Can plans be revised after submission, and before final reveal?
12. One reveal screen versus one final cinematic with five verdicts, and replay/continue options.
13. UI app platform (Android/iOS/web/desktop), orientation, target device and accessibility.

### Design/production

14. Final exact palettes/hex codes, station architecture, room hotspots, character reference redraw and expression count.
15. Exact opening shot durations, art/motion technique, voice language/actor and Director call script.
16. Source licensing, NASA insignia use and attribution rules; ensure project isn't misrepresented as NASA-endorsed.
17. Numeric simulation model, verified resource parameters, deterministic scoring and scientific evidence.
18. MVP cut strategy for a three-person team and whether 5 complete cases can be produced during hackathon.
19. Export/asset naming spec and final engineer handoff structure.

## 20. Explicit non-decisions / avoid silently assuming

- **DO NOT** switch to THE LAST SIGNAL or CASA:404.
- **DO NOT** assume access codes gate five separate cases.
- **DO NOT** sequence the five cases as five unlockable levels.
- **DO NOT** display success/failure immediately after each Rescue Mission submission.
- **DO NOT** turn every evidence marker into a password puzzle; it's chiefly a mission-identification clue.
- **DO NOT** force free walking/joystick or one-room-only UI.
- **DO NOT** restore orange garment details, wrist computers, tablets, or wolf-cut hair.
- **DO NOT** portray the five candidates as definitively approved without user confirmation.
- **DO NOT** present Apollo 13 as a historically failed crew rescue, or every unmanned historical mission as having a crew.
- **DO NOT** claim a reconstructed scene is an authentic archival NASA video if authored for the game.
- **DO NOT** claim simulation parameters or asset formats are finalized before engineering review.

## 21. Authoritative research links (retrieved 2026-10-29)

1. NASA Space Apps Challenge 2026 — challenge description: https://www.spaceappschallenge.org/2026/find-a-team/hack-space/
2. NASA/JPL Mars Climate Orbiter: https://www.jpl.nasa.gov/missions/mars-climate-orbiter/
3. NASA Software Engineering Handbook discussion of MCO: https://swehb.nasa.gov/spaces/7150/pages/16449723/SWE-017%2B-%2BProject%2Band%2BSoftware%2BTraining
4. NASA Mars Polar Lander / Deep Space 2: https://science.nasa.gov/mission/mars-polar-lander-deep-space-2/
5. NASA/JPL OCO mishap summary: https://www.jpl.nasa.gov/news/nasa-releases-orbiting-carbon-observatory-accident-summary/
6. NASA Lessons Learned OCO: https://llis.nasa.gov/lesson/2257
7. NASA Genesis mission history: https://science.nasa.gov/mission/genesis/
8. NASA Apollo 13 mission details: https://www.nasa.gov/missions/apollo/apollo-13-mission-details/
9. NASA Apollo 13 detailed chronology: https://www.nasa.gov/history/detailed-chronology-of-events-surrounding-the-apollo-13-accident/

These references substantiate **historical facts**, not invented in-game lines, exact UI choices, rescue outcomes or design assets. Some detailed mishap findings are uncertain; reference the underlying report and its confidence when writing clue/solution logic.

## 22. Next working-session sequence

1. Resolve five mission selections and historic/alternate framing, including crew-versus-uncrewed consistency.
2. Determine the complete playable engineering loop and simulation outcome rules.
3. Finalize rooms/hotspots, clue classification, reconstruction unlocks and plan commitment behavior.
4. Write a dedicated **Content Writer production brief** per case (`mission fact sheet + clues + room location + reconstruction + hypotheses + interventions + outcome rules`), rooted in this master.
5. Designer finishes/approves art references and then creates assets/video/voice-over; record real filenames in separate asset manifest.
6. Engineer builds shared system, integrates cases and validates with real playthrough tests, including all five mission outcome paths.
7. Update this source of truth whenever a new decision is made, with date, rationale and affected sections.

---

**Bottom line:** The confirmed game is **CASE:404**, a five-mission **mixed-evidence, shared-station, room-to-room detective/engineering game** using **real NASA missions in clearly marked alternate-history simulations**, with **per-mission Rescue Mission submissions and a single final collective outcome reveal**, presented in **geometric stylized 2D** across **Past (yellow/cream), Station (navy/orange), Space (purple)**. The exact five historical missions, engineering model, room inventory and detailed production assets remain unapproved.
