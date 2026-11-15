# Clean-plate donor provenance

These seven PNGs were produced with the built-in image generation edit tool from the exact sources named in `tools/build_remaining_room_layers.py`. They are reconstruction donors, not approved designer layers. The builder copies donor pixels only under traced extracted masks. The Past donors were generated at 941×1672 and resized to the 1080×1920 source canvas with Lanczos sampling; the Present donors were generated at 1672×941.

| Donor | Edit instruction |
| --- | --- |
| `archive_clean_donor.png` | Remove the Mission Archive display and physical console, central document desk and lamp, and lower-left filing cabinet; extend visible shelves, wall and floor while preserving the same composition and camera. |
| `signal_clean_donor.png` | Remove the central radar/waveform display, receiver rack, and left and right telemetry workstations; continue existing windows, wall and floor. |
| `recordings_clean_donor.png` | Remove the video display and playback console, left waveform terminal, recording devices and headphones; continue existing shelves, wall, window and floor. |
| `manufacturing_clean_donor.png` | Remove the three materials, motor/energy and rocket-design stations; continue metallic wall, pillars and floor while keeping header, ceiling and foreground blueprint desk. |
| `mission_target_clean_donor.png` | Remove the objectives, target/destination, scientific-priorities and constraints stations; continue wall, pillars and floor while keeping ceiling, header and foreground desk. |
| `data_analysis_clean_donor.png` | Remove the main mission-file/dataset display and lower analysis console; continue the wall and floor while preserving ceiling, header and foreground furnishings. |
| `resources_review_clean_donor.png` | Remove the four labeled side display panels and central holographic rover table; continue the existing wall supports and floor while preserving ceiling, header and foreground desks. |

All prompts explicitly forbade new doors, screens, machines, mission data, text, props and characters. Human review is required for seams and hidden geometry before these plates are accepted as final art.
