# The Astral Archives — Living Evidence Folder V1

**Status:** Isolated experimental playable preview. Not merged to `main`; no changes to approved Home Screen or Codex room-layer experiment.

**Branch:** `experiment/archival-evidence-folders-v1-2026-11-14`  
**Preview route:** `/?folder-lab=1`

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

## Integration contract with Codex's layered-room work

**Avoid editing room assets and `src/InvestigationDesignerScene.tsx` in parallel.** Once the independent room is approved, import the archive viewer/engine as reusable components and route an in-world Mission Files object to it. Swap the development intake drawer for room-based evidence discovery. Preserve stable IDs, misfile semantics, diagnosis gate and source/provenance fields. Keep `main` untouched until explicit visual and QA approval.

## Validation

The GitHub branch stores the full source and reusable SVG artwork. Vercel build compiles TypeScript and Vite. `npm run test:archive` and `npm run test:studio` are configured but require separate execution to claim PASS. Real-device visual parity with the approved image is NOT CERTIFIED.
