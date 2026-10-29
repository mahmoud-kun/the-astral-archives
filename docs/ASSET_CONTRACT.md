# CASE:404 — Asset Handoff Contract (DRAFT)

Last updated: 2026-10-29

**Status: INTERFACE PROPOSAL ONLY.** Exact resolutions, color tokens, image format choices and file list are not final.

## Design principle

Gameplay logic references **stable `assetId`s**, never final filenames. A placeholder file/manifest entry with the same ID permits engineering and design to work in parallel; integration replaces paths and metadata, not UI logic.

## Each approved asset entry will contain

- `assetId`, purpose, `roomId` or `missionId` if relevant, variant/state.
- kind: image, animation, video, audio, sprite, or document art.
- relative path, dimensions/aspect ratio, transparency, FPS/duration for video, audio looping and trigger rules.
- approval state, version, attribution/source license and historical-versus-fictional label where relevant.
- hotspot coordinate system for scene backgrounds, using normalized values and correct scaling after aspect-fit/cropping.

## Visual experience baseline

- Portrait-first; consistent visual languages: Past yellow/cream, Station navy/orange, Space purple.
- Geometrically stylized protagonist; scene interaction by point-and-click/tap with accessible hit targets.
- Avoid forcing designer to produce whole 3D rig or physics sprites for a UI-led game unless a new decision is made.
- Failure/missing-file states should use a visibly labeled placeholder while developing, never a wrong asset silently.

## Pending

Asset file list, final visual formats/resolutions, naming conventions, UI safe area, scene hotspot overlays, accessibility/touch targets, voice-over spec, cinematic timing and license clearance will be finalized with the Designer and Technical Owner.
