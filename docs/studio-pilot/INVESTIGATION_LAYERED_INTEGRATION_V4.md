# Investigation Room — Codex V3 Integration (Active Working Branch)

**Date:** 2026-11-14  
**Active working branch:** `experiment/room-case-library-layout-fix-2026-11-14`  
**Source-art branch:** `experiment/investigation-room-layered-interactions-v1-2026-11-14`  
**Source-art commit:** `118e8d8eff1c87eef6abb35835db0449c394ea75`  
**Integration merge commit:** `58c875459ad75c9c1cb4c42654d86942054dacd5`

## User-approved direction preserved

- Continue all future edits on the active working branch; do not create new branches without explicit user instruction.
- The Home Screen uses the user-approved clean archival image `public/assets/menu-archive-clean.webp`. The dark right gradient has been softened to reveal more art while retaining readable, live menu controls.
- First-person fixed camera, all scene art visible. No walking, camera movement, generic bottom `CASE LIBRARY` or `INTERACT` buttons.
- The on-wall **MISSION FILES** object opens the physical evidence folders at `/?folder-lab=1` via the existing single-document navigation; fullscreen is not intentionally exited.
- The four other interactive objects open their existing brief panels. They are not falsely presented as completed evidence pickup or rescue puzzles.
- Landscape mobile and portrait rotate-device guard are preserved.

## What came from Codex

The following paths are imported from the Codex branch as original Git blobs (not recreated or estimated in this merge):

- `public/assets/rooms/investigation/layers/wide/` and `original/`: genuine independent object sprites, screens, foreground overlays, masks, glow images, and reconstructed clean backgrounds.
- Both `manifest.json` variants: native coordinates, z-index, interaction targets, asset paths and states.
- `tools/build_investigation_layers.py`, `tools/verify_investigation_layers.py`, `tools/browser_verification.js`, and `tools/investigation_reconstruction/`.
- `docs/INVESTIGATION_ROOM_V3_LAYERED_HANDOFF.md` and `docs/visual-validation/`: source handoff, image comparisons, browser-emulation captures.

The original, unedited designer artwork is still checked in alongside the generated clean backgrounds. The Codex captures validate **its own original V3 branch**, not the final merged Home Screen, fullscreen routing or active-branch page.

## The integration implementation

- `src/InvestigationLayeredScene.tsx` reads both manifests and places the **real separate PNG objects** on the clean plate using the manifest's logical coordinate system.
- `src/investigationLayeredScene.css` handles sprite alignment, silhouette glow on hover/focus/press and viewport variant selection.
- `src/InvestigationDesignerScene.tsx` keeps the active-branch top controls, briefing/evidence/door/rescue/help panels and contextual texts, while replacing the old flat background/hotspot rectangles with `<InvestigationLayeredScene onOpen={openObject}/>`.
- The `mission_files` target dispatches `navigateGame('/?folder-lab=1')`, not Codex's older self-contained case modal. Other targets preserve the approved brief panels.
- This composition keeps the Case Library, evidence persistence/diagnosis gate, home art and fullscreen-safe navigation intact.
- Grayscale mask images have RGB/luminance values, not alpha; pointer hit-testing reads red-channel brightness. This avoids treating their full rectangular bounds as clickable.
- Focus remains keyboard accessible; mouse/pointer hover triggers silhouette-shaped glows. Mobile click activation is supported, subject to real-device validation.

## Verification

- A real Vercel deployment ran `npm run build`, now gated by `npm run test:studio`; all suites passed, including archive, navigation, original game systems and new layered-asset checks, followed by TypeScript/Vite compilation.
- `src/investigationLayers.test.mjs` verifies 5 objects in each manifest, asset existence, source PNG dimensions, appropriate image color types, destinations, and the current in-app routing contract.
- New explicit TypeScript import extension in `src/archive/archiveState.ts` resolves Node ESM test loading; no archive game logic was changed.
- Preview: `https://astral-archives-bdb1bwv7q-mahmooud-kun.vercel.app/` (Vercel READY on integrated implementation with full test gate).

## Remaining work / caveats

- **Not yet designer-art final:** inferred clean-plate pixels remain reconstructed; visible seams around some cabinet, desk and doorway edges can occur, as documented by Codex.
- Wide scene has a desk tablet, not the large separate display in the alternate artwork; do not invent a screen to fill that difference. Screen images remain separately replaceable within the supported crops.
- The user should inspect final merged appearance on laptop and mobile landscape; no physical-device screenshots or direct browser visual checks of this specific new deployment have been completed here.
- The `Archive`, `Signal`, and `Recordings` room implementations and complete Rescue execution remain future gameplay work. Archive intake is a temporary standalone case discovery mechanism.
- Existing developer capture scripts may assume Codex's older standalone case modal; their exact scripts need updating before treating them as passing regression tests for this integration.

## How to continue

1. Review the above preview on laptop and phone landscape; identify any reconstruction seams, hotspot alignment errors, or glow intensity issues.
2. Replace production sprites or masks in the same per-variant folders with art-approved files and update manifests when bounds change.
3. Continue connecting actual evidence discovery to the corresponding three other station rooms.
4. Keep all future commits on `experiment/room-case-library-layout-fix-2026-11-14`, never merge to `main` without explicit approval.
