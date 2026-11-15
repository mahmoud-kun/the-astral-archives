# The Astral Archives — FINAL HANDOFF / Specialist A: Assets & Past Integration

**Date:** 2026-11-15
**Verdict:** **ASSET INTEGRATION PASS (automated)** — awaiting independent Main Chat release acceptance.
**Canonical working branch:** `experiment/room-case-library-layout-fix-2026-11-14`
**Exact green gameplay/art commit:** `14beba8fca90235986f09f3047b3c25c6761a13a`
**Full end-to-end CI:** [Run #43699268899](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43699268899) — **SUCCESS**
**Published screenshot report:** [latest-report.json](https://github.com/mahmoud-kun/the-astral-archives/blob/experiment/room-case-library-layout-fix-2026-11-14/docs/visual-qa/latest-report.json)
**PR #7:** Draft, NOT merged. Its defective clean-plate/object-mask layers remain excluded from runtime.

## What was integrated and verified

1. Four 1920×1080 **static Past rooms** (Manufacturing, Mission Target, Data Analysis, Resources Review), with all **15 fixed ID interactive hotspots** and separate versioned manifests.
2. Existing Present Archive/Signal/Recordings/Investigation art and in-room evidence interfaces preserved; no defective clean-plate replacement.
3. User-authorized Past route and hub: the existing **6/6 required, correctly filed evidence** guard enables Portal cinematic → Manufacturing; player can switch Past stages, inspect physical objects, return to dossiers or enter the existing Rescue workbench. Direct Past URLs and the Past → Rescue button both recheck authoritative filing state. No clue, puzzle, case outcome, sound or save-format logic was altered by the art integration.
4. Corrected visible **Mission Target** in [art commit `14beba8`](https://github.com/mahmoud-kun/the-astral-archives/commit/14beba8fca90235986f09f3047b3c25c6761a13a): replaced the previously unapproved NASA logo with a neutral fictional compass emblem. The other architecture, screen positions, 16:9 dimensions and four hotspot coordinates are preserved. Current runtime now imports:
   - `public/assets/rooms/past/mission_target/layers/static-v2/manifest.json`
   - `public/assets/rooms/past/mission_target/layers/static-v2/room_visible.webp`
   - corrected image Git blob: `a905614db4b230744eab23bb21ffeabc43be1197`
   - source and reproducible patch: `tools/patch-mission-target-art.py`, `docs/visual-qa/mission-target-logo-patch.json`
   - [before/after artwork](https://github.com/mahmoud-kun/the-astral-archives/blob/experiment/room-case-library-layout-fix-2026-11-14/docs/visual-qa/mission-target-logo-before-after.webp)
   - original unmodified `static-v1` artwork retained for provenance; **no AI-generated NASA logo is shown by the active Past room.** The old source artwork remains in the repository and public asset tree; Main must decide whether to exclude archival, unused images from public packaging.
5. Added a dedicated **emulated touch** test in Chrome mobile context and a keyboard Enter/focus test, alongside pre-existing past-route, portal and phone-landscape checks. These are browser emulation, **not** a claim of real Android hardware certification.

## Exact machine verification / release evidence

At `14beba8fca90235986f09f3047b3c25c6761a13a`, GitHub Actions #43699268899:

| Verification | Result |
|---|---|
| npm run build (unit suites, TS, Vite) | **PASS** |
| Browser Visual QA (Chrome, desktop + landscape-phone) | **PASS** |
| Screenshots captured | **71** |
| Console errors | **0** |
| Browser scenario errors | **0** |
| Broken images | **0** |
| Clipped controls | **0** |
| Overflows | **0** |
| Missing screenshots | **0** |
| Four-case no-debug E2E (KES, LUM, ORI, AST) | **4/4 PASS** |
| Nadir full physical puzzle → filing → portal → Past → Rescue → video E2E | **PASS** |
| New touch-emulation and keyboard-focus scenarios | **PASS** |
| Real physical phone / real-person art review | **NOT VERIFIED** |

The [four-case E2E report](https://github.com/mahmoud-kun/the-astral-archives/blob/experiment/room-case-library-layout-fix-2026-11-14/docs/visual-qa/four-case-e2e-report.json) verifies for each case: physical room inspection, analysis, explicit collection, wrong filing and relocation, 6/6, reload, Portal, Past, diagnosis, independent engineering tests, verified outcome and reload. CI job logs additionally verify the full Nadir E2E progression. Browser success does not independently establish film licensing, audio listening quality, or artist approval.

## Changed-file ownership and commits

- Initial Present layered asset/station mapping: `5843ba14`, `5aa87974`.
- Four Past static visible artworks, 15 manifest targets and non-destructive preview renderer: [`0a6a6df`](https://github.com/mahmoud-kun/the-astral-archives/commit/0a6a6df976ef1e8a294cbadad569df7f713b1817).
- Main-approved Past navigation, existing Portal-to-Past handoff and fresh 6/6 check: [`911e999`](https://github.com/mahmoud-kun/the-astral-archives/commit/911e999a781ff3910a366cac2003c017e433b838).
- Browser static Past visual QA: [`8cc21f9`](https://github.com/mahmoud-kun/the-astral-archives/commit/8cc21f9d6d572108c6eb46781b12a0f449827f3a).
- Review-only art correction generator: [`0ed40b0`](https://github.com/mahmoud-kun/the-astral-archives/commit/0ed40b01c0bed3affcca344e3bf2077669a11e57).
- Final logo-free art runtime + explicit mobile tap/keyboard checks: [`14beba8`](https://github.com/mahmoud-kun/the-astral-archives/commit/14beba8fca90235986f09f3047b3c25c6761a13a).
- Generated screenshot/QA data is published under `docs/visual-qa/`.

## Remaining items — do not mislabel as completed

**Release P1: physical mobile touch QA not performed.** The Main Chat / team must open the actual deployed build on the intended Android device in landscape, tap a hotspot in each of four Past rooms, switch rooms, enter and return from Rescue, and check any clipped HUD. Audio listening on physical device belongs to Chat B/Main.

**Release P1: external Designer / content-rights acceptance pending.** I visually checked the generated logo-free before/after and the scene composition. The designer has not independently signed it off. Do not infer permission to represent NASA or assume footage/music licensing from this asset QA. The corrected active image is neutral, while the unused original remains source-controlled.

**Non-blocking for static-scene gameplay:** PR #7 full clean plates/masks are still marked FAIL, have *not* been merged, and are not used at runtime. Only revisit for future detachable object animations or object removal.

**Main Chat decision:** accept the **specialist A asset/code integration**, review the above two release P1 sign-offs and unrelated content/media release holds, then independently approve/deploy. Do not merge draft PR #7 wholesale or remove the valid static scene fallback.

**Final specialist scope:** **COMPLETE / automated integration PASS**. **Final public release sign-off remains Main-owned.**
