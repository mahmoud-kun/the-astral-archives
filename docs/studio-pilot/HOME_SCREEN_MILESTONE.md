# The Astral Archives — Home Screen V1

> **2026-11-14 Latest approved Home artwork:** Replace the baked-in interface background with the clean archive interior image at `public/assets/menu-archive-clean.webp` (optimized from the generated `futuristic_archive_under_alien_skies.png`). The user selected this exact visual; it supersedes earlier Mars-surface and `menu-approved-landscape.png` notes for the Home Screen. Menu typography/buttons remain live React UI, aligned to the right, while the archive shelving and planetary window remain visible on the left. The mobile experience remains horizontal. Do not switch to another background without explicit user approval.

> **Active-branch update — 2026-11-14:** The user requested a targeted Home Screen adjustment on `experiment/room-case-library-layout-fix-2026-11-14`. The menu now uses the approved `menu-approved-landscape.png` and `menu-approved-portrait.png` art, with the rover/Mars environment kept on the left and the menu aligned to the right on landscape. This supersedes the V1 background-path/layout note below; it does not change the approved menu actions or case-preview content. All further work stays on the active branch unless the user explicitly requests a new one.

**Branch:** `experiment/home-screen-fixed-room-v1-2026-11-14`  
**Scope:** Home Screen only. Isolated experiment. No merge to main.

## Source-grounded design
- Room backdrop uses the existing `public/assets/optimized/menu-archive.webp` derived from the designer's `Archive_Original_REFERENCE.png` in Google Drive `Nasa/الضيظاينر/The_Astral_Archives_COMPLETE_Asset_Library_V1/01_PRESENT/rooms`.
- Palette and typography align with `05_DESIGN_SYSTEM/design_tokens.json`: navy `#081B2B`, cyan `#2EC4C3`, orange `#F4A261`, cream `#F2E8D2`; Orbitron display with IBM Plex Sans and Mono.
- Five spoiler-light case summaries reference `Cases Evidence Production Bible v2.docx` and `Cases Game Design v1.1 Production Addendum.docx`, both in `Nasa`; fictional cases Kestrel, Nadir, Lumen, Oriole, Asterion.
- The home does not present any invented evidence values as NASA telemetry. It does not disclose the linked-case culprit.

## Behavior
- Default `/` is the new home.
- **Start Investigation** opens the existing fixed-room prototype `/?room=1`. Saved evidence state continues if the player has already collected evidence.
- **Mission Archives** opens a five-item preview with real draft case names and initial stakes, no diagnosis spoilers; **Enter Investigation** opens the room.
- **Settings** has a persistent reduced-motion toggle and a working fullscreen action; disabled audio controls were intentionally not added.
- **About** describes the fictional educational setting and includes a NASA non-endorsement clarification.
- Escape, Close and backdrop-click dismiss a panel.
- `/?legacy=1` remains a comparison route to the previous menu; `/?workbench=1` preserves the existing Rescue Workbench.
- Responsive desktop and phone views are styled. Full-room redesign, actual five-case evidence integration and Archive/Signal/Recordings room functionality are explicitly outside this milestone.

## Checks / review
- Build should run `tsc -b && vite build`, plus existing fixed room and rescue tests.
- Manual playtest: open root; Start Investigation; back to home; Mission Archives switching; About and Settings; mobile portrait 360px; desktop 1366×768; Escape, fullscreen and reduced-motion.
- The original approved artist scene is included as an illustration, not a certified game-ready menu layout. Visual signoff and real-device usability remain pending.
