# The Astral Archives — Fixed Room Point-and-Click V1

> **Active-branch interaction update — 2026-11-14:** The user explicitly requested removal of the persistent bottom `CASE LIBRARY` and `INTERACT` controls. The Mission Files wall monitor remains a clickable in-scene hotspot and opens the full Living Evidence Folder preview. Desktop hover/keyboard focus illuminates the object outline; touch users tap it. The generic object-picker menu and its fallback are removed. The top Home and Help controls remain. This supersedes the V1 persistent-action-button fallback described below. Continue work on `experiment/room-case-library-layout-fix-2026-11-14` only; do not create a new branch unless asked.

**Branch:** experiment/fixed-room-point-click-v1-2026-11-14
**Scope:** first isolated visual/playability milestone; no merge to main.
**Supersedes earlier 360° camera direction for this experiment, per player decision November 14.**

## Implemented
- Start Investigation opens a complete on-screen, static Investigation Room at `/?room=1`, with no mouse look, panning, free roaming, or pointer lock.
- The pre-existing 20 independently authored geometric SVG room art layers compose at their original 1920×824 coordinates without parallax motion; artwork is a provisional reconstruction, not approved final artist output.
- Five recognizable hotspots: Mission Files, Evidence Board, Desk Terminal, Rescue Console, Station Doors. Direct touch/keyboard quick actions supplement small visual hotspots.
- Close-ups are dedicated, accessible views, not generic description-only modals.
- Evidence Board: interact with a signal frequency scanner to locate a synthetic trace, then collect evidence.
- Desk Terminal: switch between overview and diagnostic log, then collect a second synthetic record.
- Mission Files: five selectable dossiers, collect/file/move evidence, wrong folder saved with no correctness warning, correct required filing contributes 1/2 or 2/2; progress falls when a correct record is moved.
- Rescue Console: unlocks only when both demo clues belong to the first dossier; opens the existing interactive engineering workbench; return link goes back to the fixed room.
- Save evidence state in a versioned browser localStorage key. No real NASA data is presented.
- Other three present-day rooms offer visual previews/navigation only. Their gameplay is NOT claimed implemented.

## Manual playtest
1. Open `/?room=1` or start from menu > Start Investigation.
2. Click Evidence Board, move frequency scanner into the highlighted anomaly band, collect signal trace.
3. Click Desk Terminal, switch to Diagnostic Log, collect engineering record.
4. Click Mission Files. Assign both evidence records to Echo Relay, verify progress is 2/2; move one to a different dossier, verify progress falls to 1/2.
5. Restore the evidence to Echo Relay; open Rescue Console, enter Blueprint, change parts, power and protocol, execute and view result.
6. Return to station. Use Escape to close a close-up.
7. Check mobile portrait layout: all room artwork remains visible; the four persistent action buttons are the fallback when scene hotspots are small.

## Unverified / deferred
- Browser click-through, screenshots and FPS are not verified by the build step.
- Designer art approval, image quality, touch testing, accessibility audit and final original close-up illustrations are pending.
- Archive, Recordings and Signal room-specific gameplay to follow only after this room is visually and interactively accepted.
