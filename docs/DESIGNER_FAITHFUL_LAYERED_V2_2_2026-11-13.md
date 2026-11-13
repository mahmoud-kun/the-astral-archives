# The Astral Archives — Investigation Room designer-faithful layered rebuild V2.2 (2026-11-13)

**Status:** Implemented on an isolated branch; player and original designer visual signoff PENDING.

## Explicit user correction and scope

Mahmoud clarified he is the project collaborator coordinating CASE:404, **not the designer**. The previous V2.1 change was rejected because it simply rendered the artist's original flattened reference. V2.2 restores **independently authored, separated 2D elements** while using the artist scene solely as a **layout and visual style reference**. No one should misrepresent V2.2 engineering art as approved original designer exports.

## Reference composition — faithfully reconstructed, not reused

Reference retained in repository for review only: `public/assets/optimized/investigation-panorama-hq.webp`. The V2.2 Investigation scene **does not contain a URL or code path for this image** and does not composite its pixels.

Room concept, authoring and placement are deliberately anchored to the reference (1920×824 scene coordinates):
- Left panoramic observation window showing planet and stars; left tabletop; Mission Files console and drawers; plants.
- Central Evidence Board; narrow hanging mission emblem/banner; high ceiling ring with cyan/amber; research shelves.
- Central freestanding desk, task lamp, folders, mug and investigator's office chair; floor rug.
- Right octagonal Archive portal; freestanding access console; right bookshelves, monitor and workstation.
- Far ceiling/architectural beams, tiled reflective floor, detailed neon lighting; near foreground technical cases.

**All objects are original authored SVG files** with transparent surroundings, except `architecture.svg` which intentionally provides the base station architecture. No original image, sprite crop, CSS-masked duplicate, or image-as-background is visible.

## Engineering breakdown

- Art directory: `public/assets/experiments/investigation-room-v2-2/`.
- Layers: 20 separately addressable SVG files; 1920×824 registration, matching the pan/zoom world. Controlled stacking order in `src/investigationFaithfulLayers.ts`.
- Classes: back/far/mid/near/front/light. Parallax generated from current camera V3 `look` with bounded relative motion: far 6px, mid -13px, near -28px, foreground -42px at maximum look. Existing world pan and zoom are unchanged.
- Only render composition in `src/Investigation25D.tsx` and art-layer styling in `src/investigation25d.css` have changed; no interactions or gameplay files were edited.
- Preserve all four clickable hotspot IDs and positions; evidence sorting, room navigation, past vs Rescue and station architecture unchanged.
- V1 corner, V2 geometry art, V2.1 designer-image cutout code/assets remain in repository history for rollback but **are not rendered** by V2.2.
- No new audio, 3D engine, 360 camera, designer PNG overwrites, NASA data or mission mechanics.

## Verification limitations and acceptance

Verify source/diff and a real Vercel `tsc -b && vite build`. Browser interaction, actual visual fidelity, mobile portrait clipping/hotspot registration and frame rate are **not verified** unless separately reported with evidence. The designer's actual approval is not inferred from Mahmoud's opinion. This is a prototype reference-following redraw; hand-refined production geometry may require more iteration.

Success gate for Mahmoud: approve that (a) no old full-frame still is visible, (b) elements really move on independent planes, (c) left/center/right composition is recognizably the same room as the designer reference and not an unrelated room. No other gameplay feature should be started until accepted.
