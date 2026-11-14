# The Astral Archives — Investigation Room V2 art-first visual milestone

**Status:** isolated Preview, player/designer visual approval and browser QA pending.
**Branch:** `experiment/investigation-room-designer-scene-v2-2026-11-14`

## Player's explicit direction
- The Home Screen is **approved** and must stay unchanged.
- Room is a *single full-screen game scene*, not a scrollable webpage.
- First-person fixed-room point-and-click: no mouse look, no pan, no pointer lock, no free roam, no scrolling.
- Environment quality must come first. Gameplay puzzles and detailed evidence will be developed one at a time later.

## Art review and selection
Connected Drive: `Nasa/الضيظاينر/The_Astral_Archives_COMPLETE_Asset_Library_V1/01_PRESENT/rooms`.
- Main artwork: **Investigation_Wide_Artwork.png**, verified 1916×821 and available in the repository at `public/assets/rooms/Investigation_Wide_Artwork.png`.
- Portrait alternative: **Investigation_Original_REFERENCE.png**, verified 1752×897 at `public/assets/rooms/Investigation_Original_REFERENCE.png`. For mobile only, this is closer to a square composition while keeping all items in view; it remains a landscape reference and is *not* production-grade portrait art.
- Both are original **designer source artworks already present in the repository**, not generated geometric SVG stand-ins.
- Evidence Cards / Viewers, icons and separate Past backgrounds exist in the designer Drive library but are not used in this first-room visual stage; those visuals are templates/placeholders, not true NASA documents.
- Colors/font families follow `05_DESIGN_SYSTEM/design_tokens.json`: navy, cyan, orange, cream; Orbitron, IBM Plex Sans, IBM Plex Mono.

## Interaction layout
- Whole room shown via CSS contain inside a permanent, fullscreen viewport. Decorative background simply fills letterbox areas, never obscures room content.
- Hotspots aligned to actual illustration: Mission Files cabinet on left, Evidence Board and Mission Briefing desk center, Archive Door and Rescue Console to the right.
- A tiny hover/focus diamond and labels convey interactive objects; visually intrusive icon stacks have been removed.
- Each hotspot opens a focus interface. Case Files panel uses the five genuine fictional case titles/abstracts from `Cases Evidence Production Bible v2` with stable codes KES, NAD, LUM, ORI, AST; intentionally spoiler-light.
- The player can choose and persist the currently tracked case (only). Mission Briefing explains the gameplay premise; Evidence Board and Rescue Console are shown without invented progress data. Door lists the four allowed rooms without fake completed navigation.
- `/?room=1` is new room scene. `/?old-room=1` keeps the previous full evidence Demo unchanged for comparison and rollback. `/?workbench=1` and `/?legacy=1` preserved. The approved Home Screen is still the default `/`.

## Validation / known limitations
- Build and 13 targeted tests should pass; this does not certify visual behavior.
- **No real-game evidence, animation rig, mature case logic or Rescue puzzles are added.** Case selection state alone persists locally.
- Source artworks are landscape. On portrait phones the full room will necessarily occupy a reduced central area to guarantee *all of it* is visible; a bespoke 9:16 designer composition is needed for large legible 9:16 visual hotspots. The INTERACT object list is available as an accessible fallback.
- Browser/device visual approval, keyboard/screen-reader QA and designer signoff remain pending.
- Do not merge into main until player approves.
