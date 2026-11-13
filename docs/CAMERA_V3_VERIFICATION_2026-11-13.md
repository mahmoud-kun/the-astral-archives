# The Astral Archives — Camera V3 experiment / verification (2026-11-13)

**Status:** Implemented on experiment branch and built successfully; **player acceptance and real browser input tests still PENDING**. This is not a production approval.

## Authority and scope

- Immutable starting checkpoint: `checkpoint/2026-11-13-before-camera-v3` at `65b7ffe7168f697a6c86de6937030bfde73227e9`.
- Working branch: `experiment/interactive-investigation-v2-2026-11-13`.
- Camera V3 code head: `54ca6a7db6482c358c492eb60d37e7ff51bff12d` (three small commits; documentation appended afterward).
- No changes to `main`, checkpoint branch, NASA case data, audio, designer images, menus, or Rescue mechanics. GitHub comparison from the checkpoint showed only three source files modified.
- Files: `src/Investigation25D.tsx`, `src/investigation25d.css` and one `disabled` expression in `src/App.tsx`.

## Changed camera behavior

1. Explicit **Enable Mouse Look** button calls `requestPointerLock()` synchronously during the user's click; not after an asynchronous opening or hidden auto-lock. `pointerlockchange` / `pointerlockerror` keep UI in sync.
2. While locked, `movementX/movementY` drive bounded horizontal view movement and an in-game aiming reticle, which can select an existing object hotspot with left-click. The ordinary browser cursor is hidden by Pointer Lock.
3. `Escape` and `Tab` release capture. Entering an object/room, opening a panel, or showing Henda dialogue releases capture; re-entry is always explicit.
4. Pointer-Lock-disabled browsers retain no-drag cursor-driven pan; touch retains swipe/tap; keyboard retains ArrowLeft/ArrowRight, A/D, Home, tab-accessible buttons. No 360° rotation, locomotion or 3D engine.
5. Camera focus uses the same authored room still for the approach. Removed the abrupt alternate full-room close-angle image swap, limited zoom to roughly 1.07–1.12, and tuned camera interpolation. Dedicated authored inspection artwork is **not** in this batch.

## Validation actually performed

- GitHub branch HEAD and immutable checkpoint refs checked before changes and after source changes; `main` remained at `a54102dd4ddc57d08f22a34f38c077c0987a94f9` when checked.
- GitHub compare `65b7ffe...54ca6a7`: ahead by 3 commits, 0 behind, only the three listed files modified. All three changed source files were fetched back for source-level review; presence of key code paths was checked.
- **Vercel deployment** `dpl_92wi6whmCAUVS71zkcAineyQHft3` deployed **READY** at https://astral-archives-2w7382w7p-mahmooud-kun.vercel.app from commit `54ca6a7db6482c358c492eb60d37e7ff51bff12d`.
- Actual remote build log confirms `npm install`, then `npm run build` executing `tsc -b && vite build`, then deployment completed successfully (Vite 7.3.8; 31 modules; 1.57-second bundle step). There were npm environment/install-script **warnings**, not build failures.
- Project `package.json` exposes `typecheck` and `build`; no dedicated `test` or `lint` command was available. The TypeScript check was executed **within the successful build**, not as a separate command.

## NOT verified — do not report as PASS

- Actual Pointer Lock activation/capture/error UI in Chrome/Brave/Firefox/Safari or when Vercel Preview is opened inside a sandboxed iframe.
- Mouse targeting of all four existing hotspots, visual feel, click-to-inspection-to-return flow, Escape/Tab capture release, Henda timing, or keyboard/touch interactions by a human or browser automation.
- Portrait-phone responsive usability; actual screen-reader behavior; reduced-motion browser verification.
- Frame pacing, FPS, CPU/GPU load, perceived motion smoothness and camera latency. **No instrumented performance numbers exist**. A successful TypeScript/Vite/Vercel build does not prove these outcomes.

## Player acceptance checklist (required before proceeding)

1. Desktop: enter Investigation Room, dismiss/finish Henda intro and click **Enable Mouse Look**. Verify the cursor disappears and moving the mouse alone moves the view.
2. Move hard left/right: horizontal movement remains bounded and the image does not rotate through 360°.
3. Point the reticle at each of the four visible hotspots and left-click. Check selection accuracy and the approach, inspection, return and re-enter mouse-look sequence.
4. Press `Escape` and `Tab`: pointer is restored for the station room menu, helper and other normal UI, with no trap.
5. Test normal overlays, Henda caption, A/D and arrow/Home keyboard controls.
6. Mobile portrait: swipe, tap hotspots, open/close inspection, verify no desktop-only Pointer Lock requirement.
7. Compare normal and reduced-motion preferences; assess look responsiveness and visual approach and measure frame times if lag is reported.

**Decision gate:** Camera V3 is still **experimental**. Only after actual player acceptance should separate 2D-layer art or other next-feature experiments begin.
