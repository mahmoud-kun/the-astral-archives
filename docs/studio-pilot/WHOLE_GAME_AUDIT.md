# Whole-game audit — 2026-11-14

Branch: `experiment/codex-game-studios-fullgame-2026-11-13`. Evidence: `src/App.tsx`, `src/Investigation360.tsx`, `src/investigation360/buildRoom.ts`, `docs/GAMEPLAY_DESIGN_2026-11-09.md`, `docs/CODEX_GAME_STUDIO_PILOT_2026-11-13.md`, asset inventory. Status terms describe implemented code, not design promises.

## Summary

**Overall: Partially Implemented.** A navigable station shell, introductory dialogue, room imagery, menus, and an experimental seated 360° Investigation Room exist. The core game loop—verified case content, collecting/filing evidence, per-case progress, Rescue unlock, engineering decisions and outcomes—is not implemented. Presently the interface explicitly labels the five dossiers unassigned and awaits verified records. No merge or production readiness implied.

| Area | Status | Repository evidence / gap |
|---|---|---|
| Core gameplay and journey | Partially Implemented | `App.tsx`: menu → opening → station, room navigation, inspection panels and dialogue. Evidence-to-outcome game loop absent; see empty dossier states. |
| Five NASA mission cases | Blocked or Missing Required Assets/Data | `MISSION_IDS` in `App.tsx` renders five `UNASSIGNED DOSSIER` cards. Verified mission datasets and evidence mappings absent from inspected app. |
| Investigation Room | Partially Implemented | `Investigation360.tsx` plus `investigation360/buildRoom.ts` implement fixed seated view, look controls and raycast targets; hotspots open descriptive placeholder panels, not gameplay. Procedural art experimental. |
| Recordings Room | Partially Implemented | Room scene and `recording-console` inspection exist in `App.tsx`; text says recordings and transcripts not integrated; no audio assets in current build. |
| Archive Room | Partially Implemented | Room scene and archive console placeholder exist; source-backed records not integrated. |
| Signal Room | Partially Implemented | Room scene and signal console placeholder exist; detailed datasets absent. |
| Evidence collection and mission folders | Not Implemented | Five dossier display cards are unassigned; no collection state, move/re-file behavior, correctness mapping or progress state found in `App.tsx`. Evidence icon/card/viewer art exists but is not a content system. |
| Rescue mission / time travel | Not Implemented | No mission readiness, past scene, engineering preparation, execute state or per-mission outcomes found in current application flow. |
| Character and dialogue | Partially Implemented | Henda portrait asset and timed intro/hint/support dialogue exist in `App.tsx`; contextual authored Q&A, mission cast and narrative system are absent. |
| 3D environments, assets, materials, lighting | Partially Implemented | `buildRoom.ts` creates procedural geometry/materials/lights; 360 canvas lazy-loads. Pilot/V1 docs identify experimental placeholder art and need for significant quality work. Asset provenance/licensing of final art not established. |
| UI/UX and accessibility | Partially Implemented | Semantic buttons, labels, room/settings/inspection overlays, portrait layout styles and keyboard Escape handling exist. Full keyboard-only/touch/browser/mobile accessibility and usability remain NOT ASSESSED. |
| Sound effects and audio | Not Implemented | `App.tsx` settings copy says production handled separately; recording copy says no sound assets. No audio player or SFX system found in inspected source. |
| Performance and optimization | Partially Implemented | Lazy 360 import, capped pixel ratio and only-entered-scene loading in `App.tsx` exist. Prior visual-quality report records 564.63 kB 3D chunk and Vite >500 kB warning. Real FPS/device performance NOT ASSESSED. |
| Testing and deployment | Partially Implemented | Build script exists and production build passes (see VERIFICATION). No test/lint/browser scripts in package.json. Deployment/browser behavior NOT ASSESSED. |

## Decisions and boundaries

Retain the four present rooms and five simultaneous mission dossiers. Evidence sorting must allow saved wrong filing without warning/progress, allow correction, and unlock only the corresponding Rescue at complete correct evidence; these are requirements, not implemented features. NASA facts need source provenance and distinct labeling from fictional alternate-history events. 360 look remains seated with no translation. Pointer lock is gesture initiated and Escape/browser release respected; near-persistence is NOT ASSESSED in browser. The current UI is a shell and must not be mistaken for playable investigation/rescue.

## Codex adaptation of Game Studios

Portable: discipline ownership, design/content gates, asset provenance ledger, small cross-disciplinary vertical slices, build/QA/performance checklists, release evidence. Organize work as Game Design; Gameplay Programming; Technical Art; Level and Environment Design; NASA Data and Narrative; UI/UX; QA and Performance; Production and Release. This uses the local Codex skill and written workstreams. Claude role definitions, slash commands and lifecycle hooks are Claude-specific; none were installed or executed. Use sequential reviews unless a future task explicitly calls for independent read-only delegation.
