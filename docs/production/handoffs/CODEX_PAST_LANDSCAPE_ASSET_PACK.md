# Codex Past landscape asset pack — review checkpoint

**Status: FAIL for integration.** This branch contains inspectable draft assets and validation evidence, not a production-ready package. Keep the existing gameplay backgrounds and manifests active. The Cases & Assets Integration specialist should review these files but must not switch runtime loading to them yet.

## Provenance and branch

- Delivery branch: `experiment/past-landscape-art-production-v1`.
- Base gameplay branch: `experiment/room-case-library-layout-fix-2026-11-14`, initially checked out at `8111b2d8aee9659c221b7e16cf6e06a6afc6528b`; latest fetched head before checkpoint: `69120e82c551d7c443ccefc7ab3ef6ba04beed30`.
- Original Past packs and reusable extraction tools: `experiment/remaining-rooms-layered-assets-v1-2026-11-14` at `48213bd67be242cdb961cd4682b331543941aba4`.
- Final commit: see `git rev-parse experiment/past-landscape-art-production-v1` after the final push. A commit cannot record its own SHA.
- Pull Request: pending creation after checkpoint push.

| Original source | SHA-256 |
| --- | --- |
| `public/assets/rooms/past/sources/01_Manufacturing_Materials_1080x1920.png` | `BCD0404CBCE74AC5137AA00395ED1119844FE28D091B7578553B7FC243A767BB` |
| `public/assets/rooms/past/sources/02_Mission_Target_1080x1920.png` | `F6F5A90DC73C5690C515EC444E2ED9C4B080C8115FEE4F50104066C2AFB335EE` |
| `public/assets/rooms/past/sources/03_Data_Analysis_File_Review_1080x1920.png` | `0384FCDDEED42C7D9F00A39B746FEDDE29AE5BC2D3E414009C400111B605D58D` |
| `public/assets/rooms/past/sources/04_Resources_Review_1080x1920.png` | `7D10ACD8D7F9EC3B93AFF3ECDB9C17785F7AAC1B7E28CB1D2CF304F841CBABBE` |

## Four Past rooms

All visible landscape masters are 1920×1080. They were generated from the actual verified portrait binaries using the built-in reference-guided image editor. Two candidates per room were reviewed: A rebuilt the 16:9 room layout around the required stations; B conservatively reframed and extended the portrait. A was selected for every room because the stations are larger and more identifiable at 915×412 and 800×360. Candidate review images are in `docs/visual-validation/past-landscape-v1/<room>/candidate_a.webp` and `candidate_b.webp`. Exact generation prompts and source mappings will be appended to this handoff before final review.

| Room | Manifest | Required object IDs | Art status |
| --- | --- | --- | --- |
| Manufacturing & Materials | `public/assets/rooms/past/manufacturing/layers/landscape-v1/manifest.json` | `materials_structure`, `motors_energy`, `rocket_design` | FAIL: clean plate seams/remnants and broad cutouts |
| Mission Target | `public/assets/rooms/past/mission_target/layers/landscape-v1/manifest.json` | `mission_objectives`, `target_destination`, `scientific_priorities`, `mission_constraints` | FAIL: broad cutouts; clean plate geometry needs refinement |
| Data Analysis & File Review | `public/assets/rooms/past/data_analysis/layers/landscape-v1/manifest.json` | `mission_files`, `dataset_viewer`, `analysis_console` | FAIL: desk cutout includes floor; shared housing split needs edge review |
| Resources Review | `public/assets/rooms/past/resources_review/layers/landscape-v1/manifest.json` | `hardware_inventory`, `power_energy`, `personnel_roles`, `supplies_logistics`, `resource_allocation` | FAIL: broad masks, central table remnant in plate |

Each object directory contains lossless `base`, grayscale `mask`, subtle `glow`, and `screen` PNGs. The `screen` is presently a source-aligned crop and may include non-screen pixels; it requires an art pass before replacement or animation. The two new Resources Review closeups are in `closeups/personnel_roles.png` and `closeups/supplies_logistics.png`, referenced by optional `assets.closeup` extensions in that manifest. The renderer does not yet consume this extension.

Each room has `background/room_visible.png`, optimized `background/room_visible.webp`, and `background/room_bg_clean.png`. The latter is an object-mask donor patch, which gives exact idle recomposition but visibly poor hidden-object art. All `cleanPlateExtractionComplete` flags are correctly false and `designerCleanupRequired` true. Do not use the clean background for removal animation.

## Present cleanup alternatives

`public/assets/rooms/{archive,signal,recordings}/layers/clean-v2/` contains versioned clean-plate candidates and manifests that retain existing object IDs and positions. The current `layers/original/` packs and source-art runtime fallback are untouched. The clean-v2 candidates visually reconstruct broad hidden architecture, but exact idle recomposition with the existing source-traced object layers **FAILS**: mean absolute RGB errors are Archive 14.62197, Signal 12.85913, Recordings 18.56786. These remain review alternatives, not runtime assets. Before/after sheets are under `docs/visual-validation/past-landscape-v1/present-cleanup/`.

## Validation actually run

With Pillow 11.3.0 in a local Python 3.12 environment:

```powershell
python tools/produce_past_landscape_v1.py
python tools/review_present_clean_v2.py
python tools/validate_past_landscape_v1.py
```

The validator checks original SHA-256, file decoding, dimensions, asset URL resolution, 15 stable IDs, target/label presence, state lists, crop bounds, alpha versus hit-mask equality, preview dimensions, and pixel difference of the idle composite. Machine report: `docs/visual-validation/past-landscape-v1/qa_report.json`.

| Gate | Result |
| --- | --- |
| Four source SHA-256 hashes and 1080×1920 dimensions | PASS |
| Four 1920×1080 masters, clean plates, WebP files and manifest paths | PASS |
| Fifteen Past object files, coordinates, masks, states and targets | PASS structurally |
| Four Past idle recompositions | PASS, MAE 0.0 |
| Past clean plates viewed alone | FAIL: seams/remnants |
| Past object silhouettes at full resolution | FAIL: masks include architecture |
| Present clean-v2 exact recomposition | FAIL |
| Hover/focus/touch runtime behavior and physical-device legibility | NOT VERIFIED |
| Designer art acceptance | NOT VERIFIED |

Review artifacts include original/landscape comparison, four-room final art contact sheet, per-room mask overlay, object-isolation sheet, final composite, and contain-mode previews at 1920×1080, 1366×768, 915×412, and 800×360. These previews are derived from the actual deliverable images, not unrelated concepts.

## Integration specialist steps after repair

1. Wait for a later handoff that changes each room's clean-plate and mask quality status to PASS based on visual inspection, and rerun `tools/validate_past_landscape_v1.py`.
2. Load the selected `landscape-v1/manifest.json` at its 1920×1080 coordinate system. Keep object IDs and `interaction.target` values as delivered; do not reuse portrait positions.
3. Render the clean background and source-aligned object bases in `zIndex` order. Use each grayscale `interaction.mask` for hit detection and `glow` for hover/focus/touch. `assets.closeup` is an optional extension for the two new resource panels.
4. Retain the current intact source-art fallback until browser, keyboard, touch, responsive and visual review pass. Do not modify gameplay mechanics or save data as part of this asset pack.
