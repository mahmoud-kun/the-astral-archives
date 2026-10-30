# CASE:404 — Asset Handoff Contract (DRAFT)

Last updated: 2026-10-29

**Status: INTERFACE PROPOSAL ONLY.** Exact resolutions, color tokens, image format choices and file list are not final.

## Design principle

Gameplay logic references **stable `assetId`s**, never final filenames. A placeholder file/manifest entry with the same ID permits engineering and design to work in parallel; integration replaces paths and metadata, not UI logic.

## Each approved asset entry will contain

- `assetId`, purpose, `roomId` or `missionId` if relevant, variant/state.
- kind: image, animation, video, audio, sprite, or document art.
- relative path, dimensions/aspect ratio, transparency, FPS/duration for video, audio looping and trigger rules.
- approval state, version, attribution/source license and historical-versus-fictional label where relevant.
- hotspot coordinate system for scene backgrounds, using normalized values and correct scaling after aspect-fit/cropping.

## Visual experience baseline

- Portrait-first; consistent visual languages: Past yellow/cream, Station navy/orange, Space purple.
- Geometrically stylized protagonist; scene interaction by point-and-click/tap with accessible hit targets.
- Avoid forcing designer to produce whole 3D rig or physics sprites for a UI-led game unless a new decision is made.
- Failure/missing-file states should use a visibly labeled placeholder while developing, never a wrong asset silently.

## Pending

Asset file list, final visual formats/resolutions, naming conventions, UI safe area, scene hotspot overlays, accessibility/touch targets, voice-over spec, cinematic timing and license clearance will be finalized with the Designer and Technical Owner.

## Designer-confirmed visual scope — 2026-10-30

- **Temporary logo:** use the most recent approved conceptual emblem direction **without the protagonist**, blending Past, Station and Space as one composition. This is the game's temporary logo direction, not an already-delivered production file. A final title lockup, optimized small icon and validated asset/rights information remain pending.
- **Required present station scenes:** File Archives, Recordings Room and Signal Room, all under the Station navy/orange language with shared geometric 2D art direction. Total room count, additional present rooms and layout are not final.
- **Distinct past content types:** (1) evidence-driven interactive **Flashbacks**: protagonist observes, player pauses/zooms/inspects marked and subtle hotspots; (2) fictional **Rescue Mission past**: player interacts with historical mission-team characters and then configures decisions in the Guided Engineering Mission Builder. Keep historical vs fictional alternate-history labels and separate asset IDs.
- **Cinematic:** 10-second opening montage ends at a rocket transition, then a separately paced director call; do not use 30–40 seconds as the approved intro length.
- **Visual language:** Past cream/yellow, Station navy/orange, Space purple, matching geometric 2D artwork. Final HEX tokens, export targets, files and timings beyond the montage remain pending.

## Rescue Mission visual presentation — confirmed 2026-10-30

- Approved **Cinematic + Interactive Hybrid (V08)** for alternate-history past interactions: short arrival transition; stylized 2D point-and-click background(s) with character/object hotspots; portrait dialogue panels and expressions; reusable Mission Builder presentation; return transition without early outcome reveal.
- Assets should be separable and replaceable by manifest ID: transition media, past environment backgrounds, interactive object states, character portraits/expressions, dialogue UI and engineering UI art. Do not assume continuous character animation or a fully animated cutscene for every conversation.
- Exact shot count, timing, portraits per case, object inventory and exports are not yet final; coordinate with Content Owner and Engineer before producing full case-specific sets.

## Confirmed room art scope — 2026-10-30 (V09–V10)

- Prepare visual concepts and eventually individually addressable background/hotspot assets for four **core present station rooms**: (1) Investigation Office — main starting hub, all five dossier stories, evidence sorting/board and Rescue Mission entry; (2) File Archives; (3) Recordings Room; (4) Signal Room. Fixed-view portrait-first point-and-click presentation applies; specific counts of views, objects and animations are pending.
- **Alternate-history past scenes use a hybrid environment set:** reusable shared location types and distinctive mission-specific locations with historical-era variations. Scene count and case-specific deliverables depend on Content Owner's finalized missions. Flashback assets are distinct observer-only reconstructions.
