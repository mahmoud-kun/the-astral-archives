# The Astral Archives — Layered Investigation Room V2 (2026-11-13)

**Status: DEPLOYED EXPERIMENT; player visual review PENDING.** This report describes *one feature only*: expanding the accepted corner's 2D layer approach to the full Investigation Room. It does not claim runtime usability, production-quality assets, or measured performance.

## Player feedback and acceptance scope

- Camera V3 mouse-look received positive player acceptance for **perceived control feel**. Do not change pointer lock, keyboard/touch handling or bounded pan while validating art.
- The previous one-corner experiment felt spatially convincing, while the remaining room still felt like an unmoving image.
- Player explicitly authorized extending the visual treatment to the whole room. The new room has not yet been accepted; the next batch remains gated by the user's playtest.

## Repository and production restrictions

- Repository: `mahmoud-kun/case404`, only the working branch `experiment/interactive-investigation-v2-2026-11-13`.
- Pre-V2 branch checkpoint: `31309a61e73e9730f11e926a8ecf174a015d1dbb`.
- Code commits: `7bd6be384393063b9666e7f126fdbc5733a2fb98`, `ca0277cef2685b0444c97b2453ca5fe31c4a6ef5`.
- No edits to `main`, immutable 2026-11-13-before-camera-v3 branch, design-owned media, mission data or audio.
- Previous V1 corner SVGs and manifest remain in Git for provenance, but are not rendered by V2.
- No 3D, 360° view, character locomotion, extra room, new gameplay, drawer, dedicated close-up, sound or NASA data.

## V2 layered visual architecture

Nine separate original **1920 × 824 SVG artwork layers** reside in `public/assets/experiments/investigation-room-v2/`, referenced via stable `assetId` entries in `src/investigationRoomLayers.ts`.

| File | Purpose | Plane |
| --- | --- | --- |
| `environment.svg` | continuous opaque station walls, ceiling and floor | far / non-shifting background |
| `structure.svg` | reusable beams and architectural trim | far |
| `cabinet.svg` | Mission Files cabinet / housing | middle |
| `folders.svg` | five visibly separate generic file folders | near |
| `evidence-board.svg` | geometric Evidence Board | middle |
| `desk-terminal.svg` | independent desk, monitor and fittings | near |
| `archive-door.svg` | Archive Room access door and frame | middle |
| `foreground.svg` | room edges and near desk lip | foreground |
| `lighting.svg` | restrained cyan/gold light washes | lighting |

One coherent authored coordinate system replaces the previous mixture of **one separated corner + exposed flat bitmap in the rest**. The original bitmap remains only as a behind-the-art fallback: the opaque environment layer covers the entire world, and it no longer shifts off the edges. Layers use existing camera CSS variables plus a small new mid-depth parallax variable; camera sensitivity, bounded look, focus timing, Pointer Lock and four clickable hotspot coordinates/actions stay unchanged. All labels/data are explicitly fictional placeholders, not NASA records.

**Visual art status:** SVGs are engineering-produced experiment placeholders, **not Designer-approved art**. Production art replacement must retain the stable IDs, coordinate space, ownership and provenance through the asset contract.

## Checks actually performed

- All 12 new/modified source paths fetched back from GitHub (nine SVG files, new manifest, existing camera TSX and CSS); SVGs passed basic opening/closing-root sanity only, **not full browser rendering validation**.
- Verified manifest paths correspond to available repository files; new plane mapping appears in component; old V1 stack is no longer referenced; Pointer Lock implementation, touch code and hotspot action IDs remain.
- GitHub compare to pre-V2 checkpoint: two source commits, 12 paths changed. Nothing else in code was changed by this batch.
- Vercel preview deployment `dpl_7vaH1sHXQXr3SmYsLVepP1WNvxqj` from code SHA `ca0277cef2685b0444c97b2453ca5fe31c4a6ef5` reached **READY**:
  https://astral-archives-cp7qhmcux-mahmooud-kun.vercel.app
- Actual Vercel build logs show `npm install`; `npm run build` executing `tsc -b && vite build`; Vite 7.3.8 built 32 modules. The log contains npm environment/install-script warnings but no build failure.
- There are no project `lint` or `test` scripts, so neither is claimed as executed.

## Important NOT-verified limitations

- We did not obtain a real rendered browser screenshot or direct interactive Browser/Playwright test of this deployed preview. Neither static SVG source checks nor a build are proof that the room looks cohesive on the player's laptop.
- No actual automated XML/SVG render validation was performed, beyond structural markers in the source.
- No confirmed on-device mouse targeting, Escape, Tab, modal/inspection, responsive portrait swipe or reduced-motion test. The camera code is preserved, but browser regression remains unverified.
- No measured FPS, frame pacing or CPU/GPU power impact. Art parallax may still need tuning after feedback.
- Exact artist approval, graphic quality, alignment, readability and hotspot registration at each supported viewport remain pending.

## Player review acceptance gate

Test full left-to-right mouse-look sweep, not just the old left corner. In particular, compare how cabinet/folders, Evidence Board, desk-terminal and Archive Door move relative to the wall; check that the wall and floor stay continuous with no bitmap patches or conspicuous seams. Inspect one object and return; try keyboard and phone portrait if available. Ask whether the rest of the room now feels as spatial as the old successful corner. If not, iterate V2 art first. **Do not start Close-ups, interactive drawers, evidence mechanics or other features until V2 is accepted.**
