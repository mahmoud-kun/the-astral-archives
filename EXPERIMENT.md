# Active working branch — The Astral Archives

**Branch:** `experiment/room-case-library-layout-fix-2026-11-14`  
**Status:** Active integration and visual-playtest branch. This is the branch the user selected for continued work.

## Branch discipline

- All future approved changes continue on this exact branch.
- **Do not create a new branch** for follow-up changes unless the user explicitly asks.
- Do not merge to `main`, rename the repository, or rewrite unrelated history without explicit approval.
- Inspect the latest branch state before each edit; preserve work already present.
- Implement one bounded, reviewable change at a time and report the exact commit and verification status.

## Entry routes

- `/` — Home Screen.
- `/?room=1` — Investigation Room.
- `/?folder-lab=1` — Living Evidence Folder / Case Library preview.
- `/?workbench=1` — existing Rescue Workbench comparison.
- `/?legacy=1` — previous application comparison.
- `/?old-room=1` — earlier fixed-room comparison.

## Mobile landscape requirement — 2026-11-14 (latest user approval)

The user explicitly requested that the **entire game be horizontal on phones, matching the laptop composition**, after seeing the mobile portrait Home Screen with duplicated typography baked into the portrait art.

- In portrait phone viewports (up to 900 px wide), show a full-screen rotate-device gate instead of stacking UI over the background art.
- Include a user-initiated **TRY LANDSCAPE FULLSCREEN** action which attempts fullscreen plus the Screen Orientation API only when supported, with honest manual Auto-rotate fallback.
- Do not claim browsers can forcibly change the device orientation on page load.
- On landscape phones up to 1000 px wide and 600 px high, Home Screen uses artwork on the **left** and compact interactive menu on the **right**, preserving the four existing menu actions.
- The Home Screen now uses `menu-approved-landscape.png` consistently instead of selecting the portrait mockup that contains baked-in UI lettering.
- The first Investigation Room keeps its full fixed scene and direct object hotspots; top controls and closeups scale down at phone landscape heights.
- The Living Evidence Folder stays a three-column archive in phone landscape with scrollable drawers and a height-fitted folder.
- Landscape CSS and orientation gate are isolated in `src/homeScreen.css`, `src/investigationDesignerScene.css`, `src/archive/archiveFolderLab.css`, `src/LandscapeGuard.tsx` and `src/landscapeGuard.css`.
- Real-device QA remains required at landscape 800×360 and 915×412, plus desktop 1366×768, especially because UI screenshots cannot be inspected through the connected browser in this session.

## Mobile icon and fullscreen continuity — 2026-11-14 (latest feedback)

- The user approved the landscape-first mobile experience but requested a **higher-quality rotation icon** and reported that fullscreen exited when navigating from Home Screen into the game.
- The rotation illustration now uses the scalable production SVG `public/assets/ui/rotate-landscape.svg`, displayed by `src/LandscapeGuard.tsx` and scaled without distortion in `src/landscapeGuard.css`. It replaces the earlier inline placeholder illustration.
- Root cause of fullscreen loss: internal navigation previously used `window.location.assign()` and ordinary document-loading anchors, destroying the current HTML document and its fullscreen state.
- `src/gameNavigation.ts` now performs same-origin client navigation with the History API and dispatches `astral:route-change`.
- `src/main.tsx` listens to the route-change event and browser `popstate`, rendering Home, Investigation Room, Case Library, Rescue workbench, and legacy preview routes under one persistent document. `LandscapeGuard` remains mounted.
- Home → Investigation → Case Library → Station → Home links, plus preview route links, now use the shared navigation helper. Standard modifier-key and middle-click link behavior is preserved.
- Fullscreen is requested on `document.documentElement`, so internal route changes no longer unmount the fullscreen element. Native fullscreen may still be denied or exited by the browser, OS, or switching apps; automated rotation is best effort.
- `src/gameNavigation.test.mjs` and `npm run test:navigation` cover no-document-reload navigation, back link behavior, and modified clicks.
- Latest Vercel preview: `https://astral-archives-5k69wkttv-mahmooud-kun.vercel.app` — build completed (TypeScript + Vite) and deployment status READY.
- Navigation unit tests: **3/3 PASS** using Node 22 with `--experimental-strip-types` against local copies whose lengths and FNV-1a checksums exactly matched the two GitHub source files (`gameNavigation.ts` and `gameNavigation.test.mjs`). This tests route logic, not actual mobile fullscreen behavior. The regression command is `npm run test:navigation`; full `test:studio` was not run. On-device fullscreen preservation in Brave still needs confirmation.

## Current visual direction

### Home Screen

- Use `public/assets/menu-approved-landscape.png` for landscape and `public/assets/menu-approved-portrait.png` for portrait.
- Preserve the approved cinematic Mars-surface / rover composition: environment visible on the left, menu and title on the right for landscape; mobile uses the authored portrait alternative.
- Warm dusty atmospheric treatment, restrained slow image drift, and the approved navy / cyan / orange / cream interface palette.
- Keep the existing Start Investigation, Mission Archives, Settings and About actions and their behavior.
- The archive-save check reads the current `astral-archive-folder-v1` state as well as the earlier evidence-demo key.

### Investigation Room

- Single fixed first-person point-and-click room; no walking, mouse-look, panning or pointer lock in this scene.
- Use the designer's `Investigation_Wide_Artwork.png` and the portrait alternative `Investigation_Original_REFERENCE.png`.
- The player discovers objects directly in the scene. The bottom `CASE LIBRARY` and `INTERACT` controls and their generic object picker are removed.
- The wall-mounted `MISSION FILES` monitor is a real hotspot that opens `/?folder-lab=1`.
- Desktop hover and keyboard focus reveal a cyan illuminated outline on the actual object bounds; touch users tap the object directly.
- The top Home and Help controls remain. The bottom strip contains only station identification and a non-interactive control hint.
- Evidence Board, Desk Terminal, Rescue Console and Station Door remain separate contextual hotspots; their detailed gameplay is not claimed complete.

### Living Evidence Folder

- The standalone archive preview contains five concurrent folders and 40 explicitly fictional records.
- Collection, unrestricted filing/misfiling/moving, correct-placement progress, document inspection, and the current diagnosis/rescue preview gate are implemented in `src/archive/`.
- `OPEN EVIDENCE INTAKE` is a development-only stand-in for discovering evidence in room hotspots; it is not the final in-world discovery flow.
- Archive save key: `astral-archive-folder-v1`.
- Return to Station navigates back to `/?room=1`.

## Current implementation files

- `src/HomeScreen.tsx`, `src/homeScreen.css`
- `src/InvestigationDesignerScene.tsx`, `src/investigationDesignerScene.css`
- `src/archive/ArchiveFolderLab.tsx`, `src/archive/archiveFolderLab.css`
- `src/archive/archiveState.ts`, `src/archive/evidenceRecords.ts`
- `public/assets/menu-approved-landscape.png`, `public/assets/menu-approved-portrait.png`
- `public/assets/rooms/Investigation_Wide_Artwork.png`, `Investigation_Original_REFERENCE.png`
- `docs/studio-pilot/ARCHIVAL_EVIDENCE_FOLDERS_V1.md`

## Latest preview and verification

- Active branch: `experiment/room-case-library-layout-fix-2026-11-14`.
- Latest deployed commit: `ec5379c3b58cf6c3f51e7c36774e3c65db66afff`.
- Vercel preview: `https://astral-archives-8igs468df-mahmooud-kun.vercel.app`.
- Vercel status: **READY**. Build ran `tsc -b && vite build` successfully.
- Existing Vite warning: the separate `Investigation360` chunk is 564.63 kB minified; it did not fail this build.
- `npm run test:studio` / focused Node suites were not run in this session.
- Browser visual verification and real-device interaction checks remain pending; the available browser inspection could not open the Vercel preview.

## Validation and limitations

- Vercel build is the current typecheck/build verification gate; it does not verify visual layout, pointer/touch behavior, accessibility, or device performance.
- Re-run the available focused test suites and `npm run build` after source changes. Do not report unexecuted tests as PASS.
- Browser screenshot and real-device checks at 1920×1080, 1366×768 and portrait mobile remain required before visual signoff.
- The five case records in the folder preview are fictional development content, not authentic NASA telemetry. The archive intake is not yet connected to discovery hotspots in the four station rooms.
- The room artwork remains designer-supplied scene art; hotspot alignment and the hover glow require player review on the deployed preview.

## Local commands

```bash
npm install
npm.cmd run build
npm.cmd run dev
```
