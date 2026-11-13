# The Astral Archives — Designer Fidelity Pass / Layered Room V2.1 — 2026-11-13

**Status:** Experiment authored for designer and player visual review; not a final artist-approved production scene.

## Why the V2 art was revised

The player liked the spatial effect of full-room layering but pointed out a critical regression: the newly illustrated geometric cabinet, evidence board, desk, and door **did not resemble the actual designer's Investigation Room art**. Design fidelity takes precedence over adding art invented by engineering.

The official reference used for comparison is the existing optimized preview of the original designer room:
`public/assets/optimized/investigation-panorama-hq.webp`, sourced in the experiment's existing `src/Investigation25D.tsx`, with original PNG fallback `public/assets/rooms/Investigation_Wide_Artwork.png`.

Key landmarks confirmed visually: central circular ceiling light, room-wide cyan/orange architectural lighting, left panoramic window, left Mission Files console, center Evidence Board, central desk, and arched Archive doorway toward the right. The previous V2 SVG designs materially changed these landmarks.

## This narrow correction

- Render the **actual designer's room still** as the visual foundation in its original coordinate space.
- Remove the generated full-room SVG stack from rendering. Its files remain committed for rollback / provenance; they are not referenced by V2.1.
- Remove the synthetic near-side metal struts that were not present as illustrated objects.
- Add six masked **visual cutout layers sourced from precisely the same designer image**, rather than redesigning architecture. Regions: Mission Files console, Evidence Board, center desk, Archive portal, and two foreground edges. Relative-motion scale is deliberately restrained (5/10/15px at full look).
- Keep existing 2.5D bounded camera, input, target positions, point-and-click/inspection, UI and other room behavior unchanged.
- No sound, new assets from generative models, altered NASA content, game mechanics or additional rooms.

**Caveat:** CSS-clipped duplicates of one raster original are an engineering prototype, not clean manually separated transparent production layers. Slight duplication/edge artifacts can remain during parallax. For true layered depth the Designer should export separate transparent object layers plus clean architecture plates; this is a precise asset requirement, not license to invent replacements.

## Verification / acceptance

Branch only: `experiment/interactive-investigation-v2-2026-11-13`; main and immutable checkpoints must remain unchanged. Run TypeScript/Vite production build; inspect deployment logs, review all changed paths. Browser-based pointer/keyboard/touch and responsive visual tests must be reported as *unverified* unless actually performed.

Player acceptance must separately answer: (1) does room composition match the designer? (2) does the view still feel spatial when moving? (3) any double edges, cropped seams or artifacts around masked props? No approval can be inferred from build success.
