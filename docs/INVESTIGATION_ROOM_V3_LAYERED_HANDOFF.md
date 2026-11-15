# Investigation Room V3 — layered art handoff

**Branch:** `experiment/investigation-room-layered-interactions-v1-2026-11-14`

**Base:** `38d3f3932c814d4babe4181c966c0b9c5d507695`
**Status:** experimental integration. Designer acceptance remains open.

## Source and reconstruction

The immutable designer images are `public/assets/rooms/Investigation_Wide_Artwork.png` (1916×821, desktop) and `public/assets/rooms/Investigation_Original_REFERENCE.png` (1752×897, portrait viewport alternative). They differ: the wide illustration has a desk tablet but no large floating Mission Briefing display. The original reference has the large display. The wide variant therefore exposes its desk control surface as the screen layer; no missing computer was invented.

The Drive folder could not be opened through this session's connected Drive tool or web reader. No PSD/Krita/XCF layered source was available in the local project files. Object pixels are cut directly from the repository designer images using traced polygon masks. **Pixels behind removed objects are image-guided reconstructions**, not recovered source layers. The two generated donor plates are checked in under `tools/investigation_reconstruction/`, so rebuilding the production cutouts does not depend on a temporary generation URL. The donor files and clean plates need designer review for precise architecture, floor reflections, and silhouette edges.

## Production paths and contract

Each variant has its own `manifest.json`, shared scene coordinates, and five object IDs:

- `public/assets/rooms/investigation/layers/wide/manifest.json`
- `public/assets/rooms/investigation/layers/original/manifest.json`
- `public/assets/rooms/investigation/layers/{wide|original}/background/investigation_room_bg_clean.png`
- `public/assets/rooms/investigation/layers/{wide|original}/mission_files/mission_files_{base,glow,mask}.png`
- `public/assets/rooms/investigation/layers/{wide|original}/evidence_board/evidence_board_{base,glow,mask}.png`
- `public/assets/rooms/investigation/layers/{wide|original}/center_terminal/center_terminal_{base,glow,mask}.png`
- `public/assets/rooms/investigation/layers/{wide|original}/center_terminal/center_terminal_screen.png`
- `public/assets/rooms/investigation/layers/{wide|original}/center_terminal/center_terminal_foreground.png`
- `public/assets/rooms/investigation/layers/{wide|original}/station_door/station_door_{base,glow,mask}.png`
- `public/assets/rooms/investigation/layers/{wide|original}/right_console/right_console_{base,glow,mask}.png`

The manifest records unique ID, source art, native `x/y/width/height`, z-index, base/glow/mask paths, interaction target, and states. All cutouts are RGBA PNGs with actual transparent pixels. `center_terminal_screen.png` and `center_terminal_foreground.png` share the terminal crop coordinates, so the screen and chair can be changed independently. The `RoomVariant` renderer uses percentages from the native coordinates; the background and layers scale together. Pointer checks sample the actual mask PNG alpha in a canvas; glow is an image mask plus alpha-shaped CSS shadow. Pointer movement changes a DOM class without React state updates.

To replace the center terminal, export artwork with transparent pixels at the current crop size and update the `center_terminal` manifest paths. Replace `center_terminal_screen.png` independently for a screen animation or new display content. If the housing silhouette changes, regenerate its mask and glow, and update its bounds in the manifest. The clean background need not change unless the object's new footprint reveals pixels outside the reconstructed area.

Additional possible future puzzle layers: the desk lamp, chair, left wall lamp, shelf binders, and floor cases. They remain decorative or bundled with the terminal for this scope.

## Visual evidence

`docs/visual-validation/{wide|original}/` contains `original.png`, `recomposed.png`, `overlay_50pct.png`, `side_by_side.png`, and `difference_x8.png`. Browser viewport captures are `room-1920x1080.png`, `room-1366x768.png`, `room-390x844.png`, and `room-360x800.png`, plus `room-hover-files.png` and `room-object-hidden.png`.

The recomposed images **are not pixel-identical** to the originals because the source images have no authentic clean layer and the image-guided backgrounds also altered surrounding scenery. Mean absolute RGB channel difference is 8.48/255 (wide) and 9.56/255 (original). The difference images make this visible. The source-colored cutout pixels themselves are unchanged. The default scene reads as the original composition, but slight seams around the cabinet, desk lamp/desk underside, and door remain visible at full resolution. The clean plates are visually plausible when objects are hidden but are reconstructed estimates; designer-authored clean plates and refined alpha silhouettes are the remaining production-art corrections. The 9:16 viewport displays the entire landscape source in a narrow central band; a genuine portrait designer composition is needed for a large, legible mobile room.

## Verification executed

- `npm.cmd install`: completed, 0 reported vulnerabilities.
- `py -3.12 tools/build_investigation_layers.py`: generated both variants and comparisons.
- `py -3.12 tools/verify_investigation_layers.py`: five objects per variant; RGB backgrounds; transparent RGBA cutouts with source-colored pixels; masks and manifest paths validated.
- `git diff --exit-code -- public/assets/rooms/Investigation_Wide_Artwork.png public/assets/rooms/Investigation_Original_REFERENCE.png`: clean.
- `npm.cmd run build`: passed; Vite emitted its existing >500 kB chunk advisory.
- `npm.cmd run test:studio`: 13/13 passed.
- `npm.cmd run dev -- --host 127.0.0.1`: served successfully.
- `playwright-cli.cmd run-code --filename tools/browser_verification.js`: at 1920×1080, 1366×768, 390×844, and 360×800, all five object panels opened by keyboard; no visible broken images, floating INTERACT/CASE FILES button, or browser console errors. Mouse hover illuminated and click opened Mission Files; its five case tabs were present. Tracking Lumen survived a reload. A touch-enabled 390×844 browser context opened all five panels with one tap. The root and four requested query routes loaded. One object was hidden independently and captured. This is browser emulation, not physical-device acceptance.

## Scope preserved and remaining checks

The Home Screen and comparison routes were not edited. The existing five cases, tracking storage, and panel content remain in the same component. No NASA evidence or gameplay progress was added. Screen-reader announcements were not retested in this batch. Physical phone touch accuracy and designer approval are outstanding. No Vercel deployment was created.
