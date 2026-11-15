# The Astral Archives — Investigation Room Visual Quality Pass V1 (2026-11-13)

**Status:** Isolated visual-quality experiment deployed, Vercel TypeScript/Vite Build PASS and READY. **Real browser visual acceptance, mobile GPU performance, FPS, game interactions, and designer approval remain unverified.**

## Authority and baseline
Mahmoud accepted the seated 360° investigation room's experiential improvement, but described its original prototype assets as low-quality; he explicitly authorized a narrow pass for model detailing, materials, colors, lighting and shadows **without altering camera/navigation/evidence mechanics**.

- Branch: `experiment/interactive-investigation-v2-2026-11-13`
- Pre-V1 commit: `c75da85f3c887830394060d519fc5bfe4f238857`
- Quality passes: `5596356bf58788629126eca66fe49e3fb3bd4d47`, `7d6456b455134df734a9cbf20128700d74a87402`, `e9f82cbb3354dd6f20fdc55dc2b156107b11832a`
- Vercel deployment `dpl_CyQELtkWgKLpMoVe5kAoq8yLE2qV` at https://astral-archives-8gpcnvds1-mahmooud-kun.vercel.app, verified READY.
- `main` and immutable camera checkpoint not touched.

## Actual changes

Only `src/investigation360/qualityPass.ts`, `src/investigation360/buildRoom.ts` and `src/Investigation360.tsx` changed in source code:
- Added original 3D supplementary geometry and individually authored **PBR materials** for navy anodized alloys, machined rims, ceramic, graphite, paper, smoked glass and brushed metal.
- Rounded/precision details for desk, keyboard (45 instanced keys), monitor bezel, document tabs, mug, articulated lamp, Mission Files cabinet, Evidence Board frame, Archive portal's octagonal metal ribs, ceiling ring, case-file trims and room hardware.
- Added texture-generated subtle metal/floor roughness, generated contact shadow planes around desk/shelves/portal and a 1024² directional shadow key light.
- Enabled `PCFSoftShadowMap`, tweaked exposure and reduced excessive uniform ambient/glow intensities; supplemented with modest warm desk pool and cool window light.
- Generated the instrument display canvases at 1024×512 with 512×256 design coordinates and a restrained micro-grid for sharper labels.
- Added a local `RoomEnvironment` / `PMREMGenerator` reflection environment for physically based materials, with a graceful try/catch fallback and explicit disposal.
- No imported third-party pack models: shortlisted public CC0 kits and unfinished designer art have **not yet been downloaded or integrated**. Existing 3D placeholder geometry still underlies the improved detail pass; do not call this final designer-approved asset quality.
- Seated camera position, 360° yaw, pitch bounds, pointer lock, touch/keyboard, four existing raycast target IDs and existing game callbacks were kept.

## Verification performed

- GitHub source commits were successfully applied with branch compare-and-swap, and subsequent Vercel build cloned the exact source commit `e9f82cbb3354dd6f20fdc55dc2b156107b11832a`.
- `npm run build` uses `tsc -b && vite build`: 41 modules transformed, successful output and deployment READY; npm reports 0 audited vulnerabilities in 29 packages, with warnings about environment/script config.
- Lazy loading is still active. Main JS remained ~256.36 kB uncompressed, and the 3D room chunk is ~564.63 kB pre-gzip (~144.18 kB gzip); Vite warns that this secondary chunk exceeds the 500 kB default. No synthetic lockfile was added.
- The changed source references the same camera/raycast API, but **no live gameplay test was run**.

## Important limitations and next gate

- The true final visual quality is **not measured or visually checked in a rendered browser**; build success does not establish lighting quality, shader driver support, exact object placement, reflection artifacts, mobile FPS or click accuracy.
- One 1024² shadow map plus many small meshes increases GPU and draw-call cost. Real budget and possible low-quality mobile preset must be based on measurement, not claims.
- Real Quaternius/Kenney glTF model imports and designer export replacement are still incomplete, not silently claimed.
- Browser acceptance: test full 360 yaw/pitch, inspect all four hotspots, open/close menus, return from inspection, compare 2.5D and inspect clarity of desk, files terminal and Archive portal. Measure FPS and visual defects before approving the pass.
