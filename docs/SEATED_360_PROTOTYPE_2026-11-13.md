# The Astral Archives — Experimental Seated 360° Investigation Room — 2026-11-13

**Status: Implemented on experiment branch; browser/device playtest and designer approval pending.** The latest user direction supersedes the earlier *bounded 2.5D only / no 3D* restrictions **for this isolated experiment only**. Mahmoud specifically authorized a 360-degree, stationary seated viewpoint, including lightweight 3D if helpful. No production decision, main-branch merge or designer acceptance is implied.

## Goal and source

- Place camera at seated investigator eye position in the center of Investigation Room, not outside looking at a stage.
- Rotate **360° yaw** and vertically within ±1.32 radians; **no camera translation, walking, navigation controls or free roam**.
- Maintain identifiable designer-reference composition ahead (left observation window and Mission Files; center evidence board, overhead ring, research desk; right octagonal Archive portal, consoles and shelves) and add coherent rear/side walls so looking around works.
- Scene assets: **procedural low-poly original geometry using Three.js**, not final Quaternius/Kenney downloaded models. Public CC0 kits were researched and shortlisted, but **not imported, optimized, verified on device or represented as installed**. Designer's pending bundle is not yet integrated.
- Existing 2.5D scene remains as a toggleable fallback/comparison; no original assets or evidence data changed.

## Implementation

- New `src/investigation360/buildRoom.ts`: stationary enclosing 3D room and individually constructed equipment using small meshes, canvas-generated display textures, simple metal/teal/orange materials and low-complexity lighting. Four transparent raycasting targets: `mission-files`, `evidence-board`, `desk-terminal`, `door`.
- New `src/Investigation360.tsx`: WebGL lifecycle, fixed camera at `(0,1.63,2.45)`, Pointer Lock activated only by button, Esc release, full rotation and vertical clamp, touch drag and tap, A/D/W/S and arrows, Home to center, raycast selection; keyboard shortcuts 1–4 and HTML shortcut buttons for accessibility. React cleanup disposes renderer, textures, geometry, event listeners and pointer lock. WebGL-unavailable fallback lets user return to 2.5D.
- New `src/investigation360.css`: camera UI, target reticle, help, responsive shortcuts and overlays.
- `src/App.tsx`: experimental 360°/2.5D toggle, existing inspect/exits routed to the same game callbacks, **lazy-loading** Three.js behind React Suspense to keep 3D code out of menu's initial bundle.
- `src/styles.css`: isolated compare toggle and loading indicator.
- `package.json`: `three@0.187.0` and `@types/three@0.187.0`. No lockfile was synthesized; repository did not have one at the time of authoring.

## Scope/provenance

Branch: `experiment/interactive-investigation-v2-2026-11-13`.
- Before 360 experiment: `b1ffab17f8fe1323738a205cccae5c0af0311cf1`
- Scene geometry/dependencies: `8b84963630616646d3d935c4d9a54e72f4043ce9`
- App renderer/interaction: `693215e9f2a88446e831d920f0734e0ff54c482d`
- Lazy loading: `dc642a86cb3a674c47f6e7bf0bb7cba9d7496d4f`
- `main` and `checkpoint/2026-11-13-before-camera-v3` were not modified by these writes.

## Verification and limits

Initial Vercel build of the non-lazy commit **passed** `tsc -b && vite build` with 37 transformed modules and was **READY**; it warned that the one JS chunk (~800kB pre-gzip) was oversized. This prompted a separate lazy-loading change, requiring a second build verification.
Source inspection confirms the camera position is assigned once, no code translates it after initialization, target IDs match existing game callbacks, and the mode toggle is non-destructive. No gameplay data or NASA evidence was changed.

**Not performed:** live WebGL/Pointer Lock interaction through a real browser or portrait device, screenshot visual quality validation, measured FPS/CPU/GPU usage, automated raycast hit verification, full responsive/accessibility test. Treat this as a technical prototype for player evaluation, not artist-quality final room. Current authored geometry does NOT incorporate the actual downloaded modular CC0 models yet; that is a future asset integration task after evaluating the prototype and the designer's bundle.

## Player acceptance test

1. Start Investigation Room and activate 360° Mouse Look (first intro dialogue may block input briefly).
2. Turn left and right fully, then look up at the ceiling and down at the desk/floor; camera must stay seated.
3. Aim and click Mission Files, Evidence Board, Desk or Archive Door; each should call the existing game action.
4. Press Esc, reopen menus, and test touch/keyboard; compare against 2.5D using the toggle.
5. Note room likeness and the feeling of immersion. Designer bundle and visual fidelity improvements are explicitly pending.

Do not merge to main until the player accepts the experiential direction and technical browser tests are complete.
