# Main Character — Approved Art Register

Updated: 2026-10-31
Game: The Astral Archives (historical repository: case404)
Designer approval source: character art conversation, 2026-10-31.

## Approved visual direction
- Female playable investigator/engineer.
- Hybrid 2D stylized anime, gameplay top-down 3/4.
- Preserve proportions as shown in **Actions & Interactions** poses (~six-head-tall adult stylization); do not squash or convert to chibi in animation.
- Fixed cropped lavender jacket; fitted deep-plum shorts/suit; long futuristic silver/lavender boots; black fingerless gloves; two-tone ash-brown/auburn straight high ponytail; transparent glasses; sage-green eyes; teal details.
- The player **moves the character herself within rooms**, rather than room navigation being exclusively point-and-click. This supersedes the conflicting older non-free-walking description for character movement; the precise navigation, hotspots, controls, collision and mobile UX require technical reconciliation before gameplay implementation.
- Eight directional views are the approved animation planning target; technical export dimensions/frame counts are **not independently validated**.

## Approved visual reference — Walk Front-Right 3/4
- Status: **APPROVED AS VISUAL REFERENCE**, not as verified runtime animation.
- Source artifact filename in the design conversation: `astral_archives_walk_cycle_sheet.png`.
- Eight conceptual positions labeled F1–F8; latest image explicitly approved by designer.
- Prior rejected iterations had inaccurate arm/hand movements; do not reuse them.
- The image file itself is **NOT PRESENT IN THIS GIT BRANCH**. Do not mark this as delivered artwork until the binary has been committed and checked. No fake relative asset path or URL is assigned.
- This board has labels and surrounding layout, and should not be treated as actual transparent 256x256 production frames.
- Production follow-up: obtain the approved source PNG; export separate actual transparent frames with consistent arm/leg counter-swing, proportions, root/pivot, alignment and looping; verify visually in motion; pack atlas and manifest under stable asset IDs.

## Asset pipeline discipline
1. Only designer-approved versions become canonical references.
2. Keep rejected drafts outside shipping assets.
3. Record approval date/version and source provenance.
4. Store large presentation sheets in reference art; store runtime sprites/atlases separately.
5. Never label a concept illustration as engine-ready without transparency, dimensions and playback validation.

## Integration hold
Existing repo documentation describes portrait-first static point-and-click. The newly approved freely moving top-down 3/4 heroine requires a bounded gameplay/navigation decision reconciliation and engineering feasibility review. Avoid silently replacing all existing hotspot and scene navigation contracts.
