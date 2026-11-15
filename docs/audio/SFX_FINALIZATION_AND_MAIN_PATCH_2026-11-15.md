# Chat B — Sound Effects Finalization & Integration Contract

**2026-11-15** • Working branch: `experiment/room-case-library-layout-fix-2026-11-14` • Owned by Chat B • No Main branch merge.

## Scope and final file inventory

- **11 untouched designer WAV SFX** under `public/assets/audio/sfx/`. These originals were never overwritten or edited.
- **8 untouched Kenney CC0 M4A SFX** under `public/assets/audio/kenney/`. See [source and license](AUDIO_SOURCES_AND_INTEGRATION_V1.md).
- **1 brand-new, original, procedurally synthesized success cue** `public/assets/audio/sfx/rescue_completed_original_v1.wav`, *not* a remix/derivative of the user or Kenney originals. Git blob SHA-1 `eb2b01e5b755f35d9fc2a5aedbf7c0c8965ae0d3`; exact original bytes **60,020**. 22,050 Hz, 16-bit, mono, 1.360 s, uncompressed PCM; measured peak approx 0.68 full scale. The source preserves low-bandwidth optional audio behavior and requires no third-party license. **Mix aesthetics require listening before user release.**
- **20 distinct registered playable one-shot effects total**, composed of the original 19 plus `rescueComplete`; the Sound Lab keeps the 19 historical source rows intact and previews the one new original cue in a separate section. Six procedural ambient *profiles* remain, not separate binary sound files.
- Full inventory: 842,128 bytes for the 20 SFX files. Aural recording tracks and all 17 MP4 cinematic tracks are separate and were not changed.

## Implemented behavior in audio-owner files

1. **All five known Rescue routes** — `?rescue=KES`, `?rescue=NAD`, `?rescue=LUM`, `?rescue=ORI`, `?rescue=AST` now select the same quiet `rescue` room ambience, not `home`. Unrecognized `rescue` URL values do *not* activate Rescue ambience. Audio selection is **not** a gameplay authorization.
2. **Unlock and verified success now sound different with no shared-owner changes**:
    - Existing `ArchiveFolderLab.file()` plays `playGameSound('rescue')` only when correct required evidence advances the case from locked to unlocked. This is still the original `rescue_unlocked.wav` on `?folder-lab=1`. False filing never emits a distinct error/success sound.
    - Existing `NadirRescue.tryRerun()` and `CaseRescue.signDecision()` play `playGameSound('rescue')` *only after authoritative verification* when on a recognized `?rescue=<case>` route. The owned audio engine maps that sound to new `rescue_completed_original_v1.wav` for verified outcomes. This changes **sound only**, never authorizes a rescue.
    - `/?audio-lab=1&rescue=NAD` still previews the genuine original `rescue` source, not the new outcome cue.
3. **Signal Room telemetry hotspot cue**: existing `StationRoom.tsx` renders `data-evidence-id` + `data-sfx='scanner'` on genuine hotspot buttons. The owned delegated click listener now selects `signal_alert.wav` when the player actively inspects an existing case-ID hotspot in `?station=signal`; all other rooms/equipment retain scanner. A room visit or hovering does **not** trigger a signal, and playback never automatically collects or validates evidence. Stage clicks that bypass the explicit hotspot button keep the default scanner; do not claim all gesture paths are covered before phone QA.
4. **All sound controls intact**: no effect autoload before actual interaction, independent SFX/ambience toggles, live master volume, effect cooldowns, muted/reduced-motion cinematic focus, lazy M4A/WAV asset access and 8-effect concurrency cap.
5. The **Source SFX Sound Lab** continues to display precisely 11 designer + 8 Kenney source rows to preserve existing Visual QA contract; new original `Rescue Complete` preview is visible in its own labelled section, with no dependency on media autoplay.

## Main Chat: precise outstanding integration — NO OTHER-OWNER FILES MODIFIED

| Target | Trigger | Best existing source | Required Main action |
|---|---|---|---|
| `src/InvestigationDesignerScene.tsx` / future timeline interface | Genuine click on enabled time portal (after existing unlock gate) | `energy` to charge; `portal` transition, or *prefer video-owned soundtrack* if `portalPast` is playing | Add `data-sfx='energy'` on the real portal activation button, or call `playGameSound('energy')` on charge. Trigger `requestCinematicFlow('portalPast')` only from existing authoritative past-travel authorization. **Never layer portal SFX over film audio without audition**. |
| `src/gameplay/CaseRescue.tsx` | Engineering *test actually starts*, preferably at a visible simulation-running state | `engine` for Kestrel/Oriole, `metal` for Lumen fixture, `energy` for Asterion power study | At an actual simulation start, invoke `playGameSound(`engine`|`metal`|`energy`)`. Currently the test calculation is **synchronous** and already emits immediate `terminal` or `error`: avoid adding overlapping sounds without an explicit running state. |
| `src/gameplay/NadirRescue.tsx` | Authorized navigation impulse test start | `thruster` | Add optional `playGameSound('thruster')` only when showing a genuine sim/action state. Do not autoplay propulsion noise before test click. |
| `src/gameplay/StationRoom.tsx` | Non-button touch/canvas hit path for Signal Room evidence | `signal` | If Main wants complete touch parity, pass identified evidence ID via existing objectAt() into a shared `soundForInteraction('scanner',window.location.search,id)` selector before playing. Current hotspot buttons already work. |
| `src/audio/EvidenceVoicePlayer.tsx` (Chat B owns; content pending) | Voice evidence start/stop | Existing `scanner` subtle UI response, if approved, or no cue | **Do not overlay noisy beeps on evidence testimony**. Wait for completed recordings and voice mix before changing, as selected source may already contain communication effects. |
| Main's root / CinematicOverlay integration | Scene intro/outcome/portal cutscene | Video soundtrack + audio focus | Main mounts overlay once, then uses video cue triggers. Cinematic audio focus prevents double atmosphere/SFX. Asterion false-success outcome remains **scientifically blocked** (472 W source vs <=460 W target). |

**Event API:** existing `playGameSound(cue)`, `soundForInteraction(cue,search,evidenceId?)`, `SOUND_PATHS`, and `requestCinematicFlow(...)`. Main may also set `data-sfx` on *actual* buttons; a sound does not grant progress or manipulate saves. Do not add generic sound via text matching or infer success from animation.

### Explicitly not required as new binaries

- `simulationRunning`: optional short bed can be composed from existing low engine sound only if a real simulation-running state exists; not technically necessary for synchronous test.
- `recordingStartStop`: voice evidence audio currently uses native controls and cinema audio focus, so avoid a distracting second cue without Voice Over approval.
- `portalReturn`: current portal cue is reusable; additional file only if a distinct authored return scene requests one.
- Extra ambient loops/music: six subtle built-in interior presets already suffice. Do not simulate sound transmission in vacuum.

## Acceptance status

**SOURCE & CODE:** new original WAV committed and 19 existing source files unchanged; fully registered in `src/audio/gameAudio.ts`; test of WAV size/header/PCM Git SHA; five-case route mapping and record-specific signal tests; source-exact audio test; live runtime audio focus/volume/mute test. **CI validation is logged in this document after run completes**.

**REMAINING NOT CLAIMED:** Main-owned complete engineering/portal event hooks, case-specific video flow integration, listening on actual Android/desktop speakers, mobile gesture/mute/no-overlap behavior, final voiceover mix and captions. User can audition new cue at `/?audio-lab=1`. No merge to main.

## Final independent GitHub Actions verification

[Final SFX + all production suites + Visual QA run #43688210176](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43688210176) **SUCCESS** on commit `4ee44fc292e30f685448ba28529d3e79bb0210e3`, including all 20 real SFX and the new Sound Lab view. CI logs confirm:

- **Audio and Cinematics unit suite:** **28/28 PASS**, including actual physical WAV 60,020 bytes and Git blob SHA check, five known-case Rescue soundscapes, unlocked-vs-verified complete cue distinction, Signal Room event route and preservation of wrong-file neutrality, all 17 MP4 source hashes and the KES-05 MP3.
- **Other studio unit suites:** PASS; **TypeScript / Vite production build:** PASS (Vite bundled in 3.64 seconds).
- **Automated browser Visual QA:** **52 screenshots**, **0 broken**, **0 clipped**, **0 scenario errors**, **0 console errors**; Sound Lab still exposes 19 original `.al-cue` sources and new success sound as a separate non-counted row.
- Independent post-CI GitHub recursive tree verifies **11 original designer cues + 8 original Kenney cues unchanged + 1 new original PCM WAV**, 842,128 total SFX bytes. No Main-owned source files were touched. CI added visual-report artifact on a subsequent `[skip ci]` commit.

Physical human audio audition on Android/desktop, subjective loudness balance with upcoming voiceovers and Main-owned portal/test event triggers remain NOT VERIFIED. This is a specialist completion, not release approval.
