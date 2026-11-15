# Game Studios disciplines adapted for Codex

Upstream source: [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios), release v1.3.0, SHA `abc0de79d6ceb0b5d7aa693945849b3937afbe6a`. This role map is original guidance for **The Astral Archives**; it is not a drop-in copy of Claude Code orchestration or hooks.

| Codex workstream | Upstream concepts | Responsible findings and deliverables |
| --- | --- | --- |
| Creative and systems | creative-director, game-designer, systems-designer, level-designer | Approved player journey, 4 present rooms, 5 dossiers, evidence progress, rescue choices, transition rules; implementation gap audit |
| Space science & narrative | writer, narrative-director, world-builder | NASA source ledger, mission metadata provenance, science vs fictional past clearly separated, content placeholders explicitly labeled |
| Technical art & environment | art-director, technical-artist, asset-spec, asset-audit | Asset catalog and ownership, visual style conformity, calibrated desk/monitor/window/portal, glTF mesh/texture budgets, license checks |
| Game/web engineering | technical-director, engine-programmer, gameplay-programmer, tools-programmer | Existing Vite/React/TS/Three scene integration, pointer-lock constraints, raycast interactions, exact testable state transitions |
| UX and accessibility | ux-designer, ui-programmer, accessibility-specialist | Mobile portrait responsive input, keyboard navigation, first-person accessibility, dialogue/overlay policies and clear feedback |
| QA, profiling & security | qa-tester, performance-analyst, security-engineer | Deterministic progression tests, browser smoke/visual tests, FPS/draw-call/texture metrics or NOT ASSESSED, asset-chain safety |
| Production and delivery | producer, release-manager, devops-engineer | Bounded slice plan, branch isolation, release checklists, measurable acceptance, separate preview and rollback |

## Shared deliverables

- `docs/studio-pilot/WHOLE_GAME_AUDIT.md` — state of every subsystem with evidence and confidence
- `docs/studio-pilot/ROADMAP.md` — ordered milestones for the *whole* game and first vertical slice
- `docs/studio-pilot/ASSET_LEDGER.md` — existing originals, placeholders, pending designer exports, candidate CC0 libraries and license status
- `docs/studio-pilot/VERIFICATION.md` — commands executed, results, browser/visual/performance status

Do **not** fill reports with fictional test outcomes, assumed asset downloads, unconfirmed mission files, or assertions that AI subagents ran. For each domain, give read-only findings before writing feature code.
