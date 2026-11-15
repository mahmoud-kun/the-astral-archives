# Final Designer Cinematics — Oriole (Case 04) + Asterion (Case 05)

**Chat B / 2026-11-15 — verified final five uploads**. Prior source ledger: [new Cases 01–03 + voice](NEW_MEDIA_DELIVERY_AUDIT_2026-11-15.md). The only authorized source for evidence numbering is `Cases Evidence Production Bible v2.docx`; all fictional cases are stylized training scenarios, not actual NASA telemetry. The authorized branch is `experiment/room-case-library-layout-fix-2026-11-14`; **no main merge**.

## Final Drive inventory

[Designer Drive / videos](https://drive.google.com/drive/folders/1LIRtkA0Re_yJ-VpIU0PAIc2Whlm80-sX) has **17 MP4 files**: the original 12 already audited plus these **five new** clips. New footage was fetched as complete original media bytes, checked via `ffprobe`, full `ffmpeg -xerror` decode (**5/5 PASS**), SHA-256, and representative frames. All five are **1920×1080, 24 fps H.264, 48 kHz AAC stereo**. Decoders returned 0 errors. `volumedetect` peak/mean in dBFS is not perceptual loudness and not LUFS.

| Manifest key | Drive original | Source Drive ID | Bytes | Duration | SHA-256 | Approx mean/peak | Master mix gain |
| --- | --- | --- | ---: | ---: | --- | --- | ---: |
| `case4Intro` | `case 4 intro.mp4` | `1m26-oAVSeoUcjjHdQl5yGs8eiIRByaJF` | 2,690,338 | 5.970 s | `b99b015b271bf83aa57977d607a753324708f9e2dcab160528140afb4ffc3c91` | -12.9 / -0.5 dBFS | 0.35 |
| `case4TestingEvidence` | `case 4 testing evidence.mp4` | `1vRnALp59GC4dmjy6M_J8E-UOiMU_KaCZ` | 5,860,199 | 6.083 s | `681e2e5765ececff5ce2c38b7d68977445d8f0aa2e974ed361ccaa9f5db60bd9` | -28.8 / -14.5 dBFS | 0.8 |
| `case4Outcome` | `case 4 outcome.mp4` | `1EwYPPQ3krHm9qAV26jwt57-8xBoy0OXX` | 3,792,082 | 5.970 s | `3f3e1349d064a1ff2dcc39f7d5ff492e5a81a8f4664eba746e9060064a5fbd1c` | -17.0 / -0.1 dBFS | 0.3 |
| `case5Intro` | `case 5 intro .mp4` | `1MbdBmI2Xd2nZBNDiUh0u6dO07EYTwt5r` | 5,027,110 | 7.930 s | `685921ef1bda6bd544e62e2769b87160b24e2aaa816782068b22e9aadef00a78` | -24.9 / -9.4 dBFS | 0.8 |
| `case5Outcome` | `case 5 outcome.mp4` | `1nRPdau6afLiszCLV43HqYN3GSj0-MF09` | 5,404,764 | 7.930 s | `2682925c5f46cb878143363d7c6b40e306073e0f9326a14840c52d5b9198b27f` | -26.9 / -12.5 dBFS | 0.8 |

**Total five new bytes: 22,774,493. Total current on GitHub: 17 original MP4s = 96,202,124 bytes, plus one unchanged KES-05 MP3 = 314,523 bytes.**

## Exact target paths, and real gameplay use

| Case | Cinematic ID -> target file | Main event and condition |
| --- | --- | --- |
| 04 ORI | `case4Intro` -> `/assets/video/designer-case-4-intro-v1.mp4` | Show only on player-selected Oriole Mission Briefing; Skip/Return do not count as evidence |
| 04 ORI | `case4TestingEvidence` -> `/assets/video/designer-case-4-testing-evidence-v1.mp4` | Optional contextual animation **inside `ORI-05` Missed System Test Ticket**, Archive Room. The source shows a *postponed touchdown-logic test* with a transient spike; do not treat it as executed or passed. Inspection alone never completes `ORI-05`. Do not introduce a separate new evidence ID |
| 04 ORI | `case4Outcome` -> `/assets/video/designer-case-4-outcome-v1.mp4` | Only after independent `otherRescueCompleted(archive,progress,'ORI')` confirms the landing sensor filter, safe engine logic and system test; do not autoplay on a click or after just 6/6 filing |
| 05 AST | `case5Intro` -> `/assets/video/designer-case-5-intro-v1.mp4` | Only on player-selected Asterion Mission Briefing; depicts power-risk register closed despite unresolved anomaly |
| 05 AST | `case5Outcome` -> `/assets/video/designer-case-5-outcome-v1.mp4` | **SCIENTIFIC HOLD — KEEP IN REVIEW LAB ONLY.** The delivered film calls **472 W** `VERIFIED` under a **480 W** cap, while the actual approved Asterion rescue engine requires independent simulated **450 W** successful replay and target **<=460 W**. This does NOT pass the stated 460 W target; never show it as the game's official rescue success without correcting the scene to 450 W / target <=460 W or an explicitly approved amendment to the canonical story (do not silently change rescue logic). |

**Scientific source of the AST hold:** `src/gameplay/caseRescueEngine.ts`, Asterion block around lines 60–72 and 129–133. It explicitly distinguishes the old 520 W overload vs 480 W cap, and the independent verified 450 W simulation result. The supplied video depicts 472 W labelled verified. Hard-coded `CASE_OUTCOME_REVIEW_HOLDS.AST` prevents Main's new `verifiedCaseOutcomeCinematic('AST')` selection from returning this media ID; the film remains previewable in `src/audio/AudioReviewLab.tsx`.

**Brand/rights caveat:** Oriole test visual contains NASA insignia on fictional characters and a fictional ORIOLE test screen. Before public release, make a clear fictional/non-endorsement distinction and have the designer confirm applicable logo/trademark use rights, or replace NASA marks. Do **not** present these fictional characters or fabricated traces as original NASA records. This is not a statement that NASA endorses the game.

## GitHub upload & validation

- The 5 new MP4s are physically committed on the authorized branch by [GitHub Actions run #43684530377](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43684530377), status **SUCCESS**. Source SHA-256 and exact byte lengths were checked before staging any binary; run had no reported decoder/source-hash errors.
- Source-exact 5-file commit: [`b6b88be`](https://github.com/mahmoud-kun/the-astral-archives/commit/b6b88be7c9c7a430f1e571cc97a320f3a28dfae6). Independent post-push fetch of the GitHub recursive tree verified **5/5 exact expected Git blob SHA-1 and byte lengths**, along with **17/17 registered MP4s** and the unchanged voice MP3.
- The uploader is a *temporary* `.github/workflows/chat-b-last-five-once.yml`; it must be removed when upload verification and documentation are complete. No GitHub force push, no main merge.
- `src/media/cinematicManifest.ts` registers all **17** actual delivered videos; `src/media/caseCinematicCatalog.ts` maps **five** case-specific intro/outcome pairs and **five** source-evidence visuals. `src/media/cinematicManifest.test.mjs` checks exact original hashes/bytes, and `src/media/caseCinematicCatalog.test.mjs` checks all existing case/evidence IDs and blocks unapproved AST outcome. `src/audio/AudioReviewLab.tsx` stages all 17 videos for independent review.
- **Remaining integration controlled by Main**: root mount of `CinematicOverlay`, briefing/record inspector hooks, verified rescue outcome events, source captions, explicit media consent, physical-device playback. Registration and repository upload do not prove live trigger wiring.

## Real-media playback acceptance still required

On a running build, verify successful HTTP 200/206 for MP4s, first-use tap/gesture and iOS/Android browser playback, 16:9 responsive presentation, sound toggle/mute and no double audio, optional clip lazy load and fallback, manual Skip/Replay/Return, no changes to saved evidence from playback, six-required-evidence rescue gates, opening only on a new Start, and science-signoff for the held Asterion outcome.

**Status:** SOURCE INVENTORY / UPLOAD / MANIFEST / PREVIEW — DONE; ACTUAL GAME ENTRY POINTS / LICENSE / CAPTIONS / MOBILE REAL-PLAYBACK — MAIN QA PENDING; AST outcome — SCIENTIFIC HOLD.


## Final source-populated independent CI verification

[Visual QA + complete build run #43685165238](https://github.com/mahmoud-kun/the-astral-archives/actions/runs/43685165238) **SUCCESS** on commit `96b521acff9c4deef5b39ddb1d0798d12965a0b8`, which includes all new 17 source paths, the central `CINEMATIC_LIVE_HOLDS.case5Outcome` API/flow/overlay guard, explicit review-only alert and the final tests:

- `npm run test:audio`: **24/24 PASS**; in particular **all 17 uploaded MP4 exact source SHA256/size checks PASS**, five-case intro/outcome catalog tests PASS, five authentic evidence-context IDs PASS, held AST outcome both catalog and direct-event/flow tests PASS.
- `npm run build`: **PASS**, TypeScript/Vite production build (3.89 sec Vite bundle in CI), all other test suites PASS.
- Visual QA: **52 screenshots, 0 broken, 0 clipped, 0 scenario errors, 0 console errors** at desktop/mobile sizes. This is automated UI/route QA, **NOT actual playback audition**.
- `case5Outcome` is blocked at all game presentation entry points (`requestCinematic`, `requestCinematicFlow`, `CinematicOverlay` event handler and approved outcome selector). **The Audio Lab may still preview the original 472 W footage for a designer correction.**
- The physical source video files were separately checked by GitHub recursive tree (17/17 videos with expected sizes plus the one MP3); temporary import workflow removed.

**No remaining binary upload blocker; only Main-owned live event wiring, captions/rights review, mobile browser media playback, and scientifically corrected AST outcome require completion.**
