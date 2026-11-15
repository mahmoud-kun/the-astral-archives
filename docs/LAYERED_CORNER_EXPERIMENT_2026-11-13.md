# The Astral Archives — Layered 2D Mission Files Corner — Experimental V1 (2026-11-13)

**Status:** Code + original temporary SVG layers deployed for user playtest. **NOT art-approved or browser-playtest-verified.**
**User approval gate:** Camera V3 received positive player feedback and approval to start a *single-corner* layered 2D experiment. This does not constitute blanket approval for a complete room redesign.

## Branch, preview, and immutable baselines

- Work performed only on `experiment/interactive-investigation-v2-2026-11-13`.
- Base before this batch: `cb2aafe4dac7a0397f31de339359b4d5fc832c38`.
- Layer-code commit: `8ffb6a23e27f62d2b133926c8a7d6baa39823d28`.
- New preview: https://astral-archives-qk27xjvw4-mahmooud-kun.vercel.app
- Vercel deployment: `dpl_AGVE5Wpcmb4Ys4WnNvfsUE1MphKX`, verified **READY** from the above code commit.
- Checkpoint `checkpoint/2026-11-13-before-camera-v3` and `main` were not modified.

## Exact bounded experiment

A single visual corner containing the **Mission Files** cabinet has five individual, original, experimental SVG image assets. They are separate author-replaceable files, not five cropped portions of the old still:
1. `investigation.corner.architecture.v1` — angular station wall / architectural alcove, with a softened right-edge blend.
2. `investigation.corner.cabinet.v1` — stand-alone depth-styled file cabinet / shelves.
3. `investigation.corner.files.v1` — five independent placeholder file illustrations inside the cabinet (numbered only; no NASA claims).
4. `investigation.corner.lighting.v1` — translucent cyan/amber accents.
5. `investigation.corner.foreground.v1` — near structural post and desk edge.

Paths: `public/assets/experiments/investigation-corner/*.svg`; stable references: `src/investigationCornerLayers.ts`; composition: `src/Investigation25D.tsx`, `src/investigation25d.css`.

The **existing static scene remains underneath**, outside this single corner. The near, mid and far elements are positioned independently and displaced with the current bounded camera's existing CSS motion variables. No additional navigation, evidence, drawer, Rescue mechanic, game engine, animation sound or NASA record was added. The **Mission Files** hotspot retains its original position and action. No original optimized image or designer-owned asset was overwritten.

**Ownership and limitation:** All five SVGs are newly generated placeholder art for this controlled experiment, **not approved designer exports**. Their proportions, edge blend, spatial registration and overall style must be reviewed by the Designer and player. The remaining three investigation hotspots, the other station rooms, and their artwork were not rebuilt. No new dedicated object close-up was added.

## What was actually checked

- Fetched all eight changed/new files back from GitHub; all five SVGs contain expected SVG root/end markers. This is **a basic source-level check, not a full XML renderer or visual screenshot check**.
- Verified all manifest paths map to existing files, and existing Pointer Lock, keyboard and touch input code remained present. Kept the original Mission Files hotspot CSS coordinates.
- GitHub comparison to the pre-corner base showed **one commit**, **eight files**: five new SVGs, one new TS manifest, and the two existing camera files; no unrelated files changed.
- Vercel build log: `npm install`, then `npm run build` running `tsc -b && vite build`; 32 modules transformed; successful production output and deployment READY. npm displayed environment/script-policy warnings, not a build failure.
- No test or lint scripts are present in `package.json`, and neither was claimed to run.

## PENDING verification before acceptance

- Actual visual output: inspect desktop and portrait screenshots; ensure the new architecture blends cleanly into the old static room and does not look pasted on.
- Real-browser Pointer Lock / mouse aiming for **Mission Files**, pointer release, inspection return and keyboard focus. Static code preservation is not proof of runtime usability.
- Phone portrait swipe/tap, reduced-motion behavior and hotspot registration.
- Measured FPS/frame pacing and layer compositing cost on target device. **No FPS measurements were made.**
- Designer review of exact composition and readiness for replacement with artist-authored production files.

**User decision gate:** Ask the user whether this *single* corner's visual depth and overall style work. If not, revise this art experiment before any other feature. Do **not** start dedicated close-ups or an interactive drawer in this batch.
