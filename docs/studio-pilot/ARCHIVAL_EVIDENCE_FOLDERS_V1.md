# The Astral Archives — Living Evidence Folder V1

**Status:** Active experimental playable preview on the user's selected working branch. Not merged to `main`.

**Active working branch:** `experiment/room-case-library-layout-fix-2026-11-14`  
**Preview route:** `/?folder-lab=1`

**Working-branch rule:** All follow-up changes continue on this same branch. Do not create a new branch unless the user explicitly requests it.

**Current integration:** The Investigation Room's wall-mounted `MISSION FILES` hotspot opens this full archive. The generic bottom `CASE LIBRARY` and `INTERACT` action buttons have been removed; discovery is intended to happen through scene objects. The Home Screen uses the approved landscape/portrait Mars artwork and right-side menu.

## Approved art/gameplay goal

An aged physical manila/kraft folder inspired by the player's reference: closed case folders, clip and stamped archival document surfaces, paper records stacked as independent DOM layers, visual folder accumulation as more evidence is filed, and individually inspectable sheets. This implementation is a functional *first-pass* built with reusable SVG foundations, CSS, and live text; it is not a pixel-perfect rendering of the approved cinematic concept.

## What is implemented

- Five cases KES/NAD/LUM/ORI/AST with 40 fictional evidence records from `Cases Evidence Production Bible v2`: 6 required and 2 optional per case.
- Each evidence record has a stable ID, destination room, format, investigative text and fictional-data provenance label.
- Isolated localStorage save key `astral-archive-folder-v1` (does not affect previous prototypes).
- Collect-once, unrestricted filing/misfiling/moving/unfiling, progress of correctly filed required evidence only.
- A three-part diagnosis: technical cause, process failure, consequence, each citing appropriately supporting case evidence. Rescue readiness requires 6/6 plus valid submitted diagnosis.
- Physical closed folders, open folder, single independent paper sheet components per visible document, click-to-inspect, archival document viewer, responsive CSS, keyboard-usable buttons, reduced-motion support.
- A standalone *development* intake drawer to simulate discovering records without the rest of the station. Files beyond the seven visible stacked layers can still be accessed in the indexed intake.
- `npm run test:archive` added to `npm run test:studio`.

## Entry and usage

- From the Investigation Room, clicking the left-wall **MISSION FILES** screen or the bottom **CASE LIBRARY** button opens this complete archive route directly. The station's other room interactions and the Home Screen remain unchanged.
- The archive now owns a viewport-height scroll container; folder scale responds to viewport height, and the desk no longer clips the dossier. At short desktop heights the dossier scales down; on narrow screens the five folders, workspace and status stack vertically and scroll naturally.

1. Open `/?folder-lab=1` on this branch's Vercel preview.
2. Select one of five folders from the drawer.
3. Open the **Evidence Intake** drawer to discover case records from their designated room, in lieu of not-yet-integrated room hotspots.
4. Inspect a record, select **COLLECT EVIDENCE**, and then choose a mission folder from its viewer.
5. Each successfully filed record becomes a separate paper layer in that folder; reopen the folder to see it accumulated.
6. Click a visible sheet, or select any filed record from the intake index, to inspect or move it.
7. File all six required records in their actual case folder and submit a supported 3-part diagnosis.
8. Only then is that case Rescue entry marked UNLOCKED. No rescue attempt is consumed by this preview.

**Important:** The required-evidence progress count is an actual derived counter; a wrong folder saves the sheet without revealing the correct folder and does not credit either case. Optional items do not count toward six.

## Assets / source

- `public/assets/archive/folder-closed.svg`
- `public/assets/archive/folder-open.svg`
- `public/assets/archive/sheet-paper.svg`
- `src/archive/evidenceRecords.ts` (40 fictional story records)
- `src/archive/archiveState.ts` (pure persistence/filing/diagnosis logic)
- `src/archive/ArchiveFolderLab.tsx` (visual standalone viewer)
- `src/archive/archiveFolderLab.css` (responsive tactile art)
- `src/archive/archiveState.test.mjs` (domain regression tests)

## Boundaries / not done yet

- Production artist-authored paper/material sprites and pixel-accurate final visual signoff are pending.
- Mouse/keyboard accessible document controls exist, but independent browser/real device screen-reader and touch testing are pending.
- Vercel TypeScript+Vite build status is verified via deployment; targeted Node test suite execution is not verified by the Vercel build unless separately run.
- The main room, Archive/Recordings/Signal room discovery hotspots, and Rescue engine are **not linked** to this prototype. The UI marks discovery as development-only.
- The preview has only a synthetic stationery texture and generic document visualization; authentic NASA imagery is deliberately not presented as the fictional mission's original records.
- Paper layer positions are deterministic by stack order, and up to seven sheets are visible at a time; all sheets remain accessible from the intake index. No custom drag-and-drop sheet positioning or audio/motion polish is claimed.
- No Global Budget calculation is implemented here. Budget semantics and cost tables belong to the engineering stage.
- Do not show a completed historical Rescue result or change actual history. Rescue operates on a fictional alternate engineering outcome.

## Integration contract with the active working branch

The Investigation Room's wall-mounted Mission Files hotspot now routes to this standalone archive preview. The next integration step is to replace the development intake drawer with room-based evidence discovery. Preserve stable IDs, misfile semantics, diagnosis gate and source/provenance fields. Keep `main` untouched until explicit visual and QA approval. Continue all future work on `experiment/room-case-library-layout-fix-2026-11-14`; do not create another branch unless the user asks.

## Latest active-branch preview

- Branch: `experiment/room-case-library-layout-fix-2026-11-14`.
- Latest deployment commit: `ec5379c3b58cf6c3f51e7c36774e3c65db66afff`.
- Preview: `https://astral-archives-2raqtvldm-mahmooud-kun.vercel.app`.
- Vercel status: **READY**; `tsc -b && vite build` completed successfully.
- The pre-existing `Investigation360` chunk-size warning remains; it is not a build failure.
- Automated Node suites and real-browser/device visual QA have not been run for this latest update.

## Validation

The GitHub branch stores the full source and reusable SVG artwork. The Vercel deployment for the room/library integration reached **READY** and its build log shows `tsc -b && vite build` completed successfully. The standalone Node test suite (`npm run test:archive`) and the combined `npm run test:studio` are configured but were not executed in this change. The Vercel preview could not be opened through the available browser inspection channel, so exact visual fit at 1920×1080, 1366×768 and real-device touch behavior still need human confirmation. The layout changes specifically address the fixed-height body overflow and folder scaling that caused the screenshot's lower content to be cut off.
