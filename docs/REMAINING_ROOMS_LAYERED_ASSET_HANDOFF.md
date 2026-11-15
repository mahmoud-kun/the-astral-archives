# Remaining rooms layered asset handoff

**Branch:** `experiment/remaining-rooms-layered-assets-v1-2026-11-14`

**Based on approved gameplay commit:** `8305ece8c3d5236798af29712304c61c2f618172`

**Final branch commit:** run `git rev-parse HEAD` on this branch; the exact pushed SHA is also in the delivery message. A commit cannot contain its own SHA.
**Status:** seven source-traced asset packs and validation evidence; **clean-plate art is provisional and needs designer cleanup**. No gameplay integration or designer acceptance is claimed.

## Source to output map

| Room | Immutable source | Layer folder | Native size |
| --- | --- | --- | --- |
| Archive | `public/assets/rooms/Archive_Original_REFERENCE.png` | `public/assets/rooms/archive/layers/original/` | 1672×941 |
| Signal | `public/assets/rooms/Signal_Original_REFERENCE.png` | `public/assets/rooms/signal/layers/original/` | 1672×941 |
| Recordings | `public/assets/rooms/Recordings_Original_REFERENCE.png` | `public/assets/rooms/recordings/layers/original/` | 1672×941 |
| Manufacturing & Materials | `public/assets/rooms/past/sources/01_Manufacturing_Materials_1080x1920.png` | `public/assets/rooms/past/manufacturing/layers/portrait/` | 1080×1920 |
| Mission Target | `public/assets/rooms/past/sources/02_Mission_Target_1080x1920.png` | `public/assets/rooms/past/mission_target/layers/portrait/` | 1080×1920 |
| Data Analysis & File Review | `public/assets/rooms/past/sources/03_Data_Analysis_File_Review_1080x1920.png` | `public/assets/rooms/past/data_analysis/layers/portrait/` | 1080×1920 |
| Resources Review | `public/assets/rooms/past/sources/04_Resources_Review_1080x1920.png` | `public/assets/rooms/past/resources_review/layers/portrait/` | 1080×1920 |

The Present originals are the exact repository images on the approved gameplay branch. The four Past PNGs were downloaded as raw files from the supplied [Past background folder](https://drive.google.com/drive/folders/1F2W_ZJFNpQN-aYCJLqcr75eKs2YZwvD4), with byte counts 2,599,236; 2,677,645; 1,889,243; and 2,137,791 respectively. The original bytes are retained under `past/sources/`. The [prototype manifest](https://drive.google.com/drive/folders/1XH1ujJ6aoXhMPVvh6TjauCdU3h0i5UAA) is retained at `public/assets/rooms/past/prototype/asset_manifest.json`; its hotspot rectangles are explicitly marked as initial estimates in that file. The 13 raw [prototype close-ups](https://drive.google.com/drive/folders/12FobEUas8BKAmvsyVBL8uHNPYWNvPDIB) are retained unchanged under `public/assets/rooms/past/closeups/`. They are source crops with background extension, not independent redraws.

Past source SHA-256 hashes, in the order above: `BCD0404CBCE74AC5137AA00395ED1119844FE28D091B7578553B7FC243A767BB`, `F6F5A90DC73C5690C515EC444E2ED9C4B080C8115FEE4F50104066C2AFB335EE`, `0384FCDDEED42C7D9F00A39B746FEDDE29AE5BC2D3E414009C400111B605D58D`, `7D10ACD8D7F9EC3B93AFF3ECDB9C17785F7AAC1B7E28CB1D2CF304F841CBABBE`.

## Object inventory and interaction contract

Every row has a native `position`, `zIndex`, base/glow/mask and the exact `interaction.target` in its room manifest. A `screen` column means a source-pixel screen PNG exists at the **same crop size and position** as its base. All manifests carry `idle`, `hover`, `focus`, and `touch` states. `archive_shelving` is an interaction overlay over existing architecture; its base is transparent and must not be rendered as a furniture replacement.

| Room | Object ID | Target | Screen | Extraction mode |
| --- | --- | --- | --- | --- |
| Archive | `archive_main_terminal` | `archive` | yes | fully_layered, plate cleanup needed |
| Archive | `archive_filing_drawers` | `physical_records` | no | fully_layered, plate cleanup needed |
| Archive | `archive_processing_desk` | `document_review` | no | fully_layered, plate cleanup needed |
| Archive | `archive_shelving` | `archive_shelves` | no | overlay_only |
| Signal | `main_signal_display` | `signal_analysis` | yes | fully_layered, plate cleanup needed |
| Signal | `telemetry_console_left` | `telemetry_left` | yes | fully_layered, plate cleanup needed |
| Signal | `telemetry_console_right` | `telemetry_right` | yes | fully_layered, plate cleanup needed |
| Signal | `receiver_rack` | `signal_tuning` | no | fully_layered, plate cleanup needed |
| Recordings | `main_video_display` | `video_recordings` | yes | fully_layered, plate cleanup needed |
| Recordings | `video_playback_console` | `video_controls` | no | fully_layered, plate cleanup needed |
| Recordings | `audio_analysis_terminal` | `audio_analysis` | yes | fully_layered, plate cleanup needed |
| Recordings | `recording_equipment_rack` | `recording_archive` | no | fully_layered, plate cleanup needed |
| Recordings | `headphones_dock` | `headphones` | no | fully_layered, plate cleanup needed |
| Manufacturing | `materials_structure` | `materials_structure` | yes | fully_layered, plate cleanup needed |
| Manufacturing | `motors_energy` | `motors_energy` | yes | fully_layered, plate cleanup needed |
| Manufacturing | `rocket_design` | `rocket_design` | yes | fully_layered, plate cleanup needed |
| Mission Target | `mission_objectives` | `mission_objectives` | yes | fully_layered, plate cleanup needed |
| Mission Target | `target_destination` | `target_destination` | yes | fully_layered, plate cleanup needed |
| Mission Target | `scientific_priorities` | `scientific_priorities` | yes | fully_layered, plate cleanup needed |
| Mission Target | `mission_constraints` | `mission_constraints` | yes | fully_layered, plate cleanup needed |
| Data Analysis | `mission_files` | `mission_files` | yes | fully_layered, plate cleanup needed |
| Data Analysis | `dataset_viewer` | `dataset_viewer` | yes | fully_layered, plate cleanup needed |
| Data Analysis | `analysis_console` | `analysis_console` | yes | fully_layered, plate cleanup needed |
| Resources Review | `hardware_inventory` | `hardware_inventory` | yes | fully_layered, plate cleanup needed |
| Resources Review | `power_energy` | `power_energy` | yes | fully_layered, plate cleanup needed |
| Resources Review | `personnel_roles` | `personnel_roles` | yes | fully_layered, plate cleanup needed |
| Resources Review | `supplies_logistics` | `supplies_logistics` | yes | fully_layered, plate cleanup needed |
| Resources Review | `resource_allocation` | `resource_allocation` | yes | fully_layered, plate cleanup needed |

For **each** layer folder above, exact asset paths follow this fixed pattern:

```text
manifest.json
background/room_bg_clean.png
<object_id>/<object_id>_base.png
<object_id>/<object_id>_glow.png
<object_id>/<object_id>_mask.png
<object_id>/<object_id>_screen.png  # only where the table says yes
```

`tools/build_remaining_room_layers.py` records the traced native polygons, targets and labels. The script is reproducible from checked-in source images and the seven checked-in image-guided donor plates in `tools/remaining_reconstruction/`. The visible cutout RGB pixels are **exactly from the source images**. The donor art is used only under extracted masks in `background/room_bg_clean.png`. It is AI-assisted reconstruction, not a designer-authored or recovered original layer. The background outside extracted silhouettes remains byte-for-byte equal at pixel level to the corresponding source. No new artwork is used for screens or devices.

## Quality and unresolved art work

The idle-state composite is exact at pixel level because every extracted source pixel is restored at its native coordinate. That result verifies alignment and omission, **not** the plausibility of the hidden clean plate. Every `fully_layered` object has `cleanPlateExtractionComplete: false` and `designerCleanupRequired: true` in its manifest. The hidden plates have visible hard-edge seams where the donor composition differs from the original architecture; Archive desk/shelf and right terminal/floor, Signal display/window and workstations, Recordings left equipment and right display, and the Past wall/floor behind removed stations all need an artist pass. Do not present hidden-object states as finished art. The source illustrations are flat; obscured geometry and shadows cannot be recovered from their pixels alone.

The Archive shelves are too continuous with the wall and adjacent racks for a credible separate replacement. They remain `overlay_only`, with a real polygon click mask and glow. The Recordings headphones are a traced but small, partially occluded cluster; inspect their edge against the desk at full resolution before use as a detachable sprite. The Data Analysis `mission_files` and `dataset_viewer` share one screen housing. Their two screen regions are split with native shared-edge alignment; do not animate their housing separately or add a gap. Present room chairs, plants, boxes, external dishes, signage and absent doors were not extracted. The optional Manufacturing foreground blueprint/tablet remains in the source composition. No fictional telemetry, mission numbers or NASA assertions were created.

Resources Review has five distinct native screen/table regions. The prototype has only three close-ups. `personnel_roles` and `supplies_logistics` therefore have source-resolution screen cutouts **without approved high-resolution close-ups**; ask the designer for those if zoom views are needed.

## Landscape adaptation assessment

All four Past sources are 1080×1920 portrait. A `contain` presentation preserves the complete puzzle without cropping, but at 1920×1080 the scene is only 608 px wide; at 1366×768 it is 432 px; at 800×360 it is 203 px; and at 915×412 it is 232 px. Text and controls become too small for the approved landscape game. A `cover` crop at 16:9 discards most of the upper/lower composition and multiple puzzle stations. None of the four can be safely reframed into an approved landscape composition with the supplied art. **All four require new designer-authored landscape artwork** for production landscape play. The portrait packs remain useful for faithful source-aligned development and close-up references; they are not mislabeled as landscape art.

## Verification and review files

Run from the repository root:

```powershell
py -3.12 tools/build_remaining_room_layers.py
py -3.12 tools/verify_investigation_layers.py
py -3.12 tools/render_remaining_room_reviews.py
git diff --exit-code -- public/assets/rooms/Archive_Original_REFERENCE.png public/assets/rooms/Signal_Original_REFERENCE.png public/assets/rooms/Recordings_Original_REFERENCE.png
```

The validator checks manifest paths, dimensions, bounds, states, mask values, alpha, source-pixel fidelity, non-overlapping visible parts, clean-plate preservation outside cutouts, and idle recomposition. The generated `docs/visual-validation/remaining-rooms/<room>/` folders (Past room names use underscores) contain `original.png`, `recomposed.png`, `side_by_side.png`, `difference_x8.png`, and `clean_plate.png`. Inspect **both** `side_by_side.png` and `clean_plate.png` at full size; an exact recomposition can conceal a poor clean plate. There is no gameplay renderer edit in this asset branch, so desktop/mobile browser interaction, hover, touch, focus, FPS and physical-device checks were not run here.

Fresh validation on this branch: Investigation V3 wide and original passed their existing checks; all seven new rooms passed manifest/file/bounds/alpha/mask/source-pixel checks; idle recomposition mean absolute RGB error was **0.0000** for each new room. The three checked-in Present originals have no diff. These results establish asset contract and idle alignment, while the plate-quality limitations above remain open.

`docs/visual-validation/remaining-rooms/clean_plate_review_contact.png` shows source/clean-plate pairs for all seven scenes. Each room folder also has static `contain_1920x1080.png`, `contain_1366x768.png`, `contain_800x360.png`, and `contain_915x412.png` previews. These are **static orientation assessments**, not playable screenshots or proof of interaction quality.

## Import into InvestigationLayeredScene

Use `src/InvestigationLayeredScene.tsx` and `src/investigationLayeredScene.css` as the existing renderer contract. Select the room's manifest; size the background at its `coordinateSystem`, then position every visible object with the manifest's native `position` converted to percentages, in `zIndex` order. Render `base`, then optional `screen`, then optional `foreground`; bind `glow` and `interaction.mask` to the same crop. The `screen` is independently replaceable **without editing the background** for fully layered objects. Route `interaction.target` through future gameplay code; this delivery does not implement those routes. For `archive_shelving`, keep the original architecture visible and use only mask/glow hit testing. Keep the Past packs in portrait coordinates until new landscape compositions are approved.
