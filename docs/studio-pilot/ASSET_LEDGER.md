# Asset and content ledger

Audit date 2026-11-14. Inventory is repository evidence, not a license or approval claim.

| Asset/content group | Present | Use / status | Provenance, gap, validation |
|---|---|---|---|
| Four room scene art | `public/assets/optimized/room-{investigation,archive,recordings,signal}*.webp`; `public/assets/rooms/*REFERENCE.png`; `Investigation_Wide_Artwork.png` | UI references optimized scenes in `App.tsx`; original references retained | Designer intent/approval per asset not independently validated in this pass; mobile/browser rendering NOT ASSESSED. |
| Investigation 360° procedural room | `src/investigation360/buildRoom.ts`, `qualityPass.ts`; `Investigation360.tsx` | Procedural Three.js geometry/material/light path | Experimental, not final art. No final external model pack found in inventory. Visual/browser/device checks NOT ASSESSED. |
| Layered investigation experiments | SVGs under `public/assets/experiments/investigation-corner`, `investigation-room-v2`, `investigation-room-v2-2`; layer registries in `src/investigation*Layers.ts` | Experiment assets and code references | Do not confuse independent 2D experiment assets with production 360 room art or designer-approved final assets. |
| Evidence UI illustrations | PNG and SVG card/icon/viewer families under `public/assets/evidence/` plus typography guide | Generic document/audio/hardware/image/telemetry visual categories | Does not establish actual evidence content or NASA provenance. Individual licensing/approval NOT ASSESSED. |
| Henda | `public/assets/henda-portrait-prototype.svg`, `optimized/henda-*`; referenced portrait in `App.tsx` | Prototype portrait/dialogue presentation | Final character approval/provenance NOT ASSESSED. |
| NASA mission and evidence data | No mission dataset surfaced in inspected `src`/asset inventory; `App.tsx` uses five placeholder dossier IDs | Required content absent | Blocked: authoritative citations, metadata, approved evidence mapping and permissions need authored package. |
| Recordings/audio | No audio files or playback system surfaced in inventory/source scan | Placeholder room copy only | Missing approved recordings/transcripts and rights. |
| Rescue mission assets/content | No past-scene asset/data flow found in app | Not implemented | Needs approved case-specific fictional intervention rules and historical/fiction labels. |

Before integration, record stable asset/content IDs, file, creator/source, license/permission evidence, intended use, approval state, dimensions/format and fallback. Do not generate filler assets to satisfy this ledger.
