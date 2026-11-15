/** Authored fictional records from Cases Evidence Production Bible v2, 14 Nov 2026.
 * These are invented training incidents inspired by public NASA lessons; never label
 * records as original NASA telemetry. Keep their provenance visible in the player UI.
 */
export type ArchiveCaseId = 'KES' | 'NAD' | 'LUM' | 'ORI' | 'AST'
export type ArchiveRoom = 'Investigation' | 'Recordings' | 'Archive' | 'Signal'
export type ArchiveEvidenceKind = 'document' | 'telemetry' | 'blueprint' | 'recording'
export interface ArchiveEvidence {
  id: string
  caseId: ArchiveCaseId
  title: string
  room: ArchiveRoom
  required: boolean
  kind: ArchiveEvidenceKind
  content: string
  inspectAction: string
  source: 'FICTIONAL_SIMULATION'
}
export const EVIDENCE_RECORDS: readonly ArchiveEvidence[] = [
  {
    "id": "KES-01",
    "caseId": "KES",
    "title": "Science Objective Brief",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "Primary science objective: characterize unusual meteoroid activity near Vesper. — Priority A: event detection and spectral sampling; Priority B: high-resolution multi-band follow-up; Instrument set was designed before launch constraints were frozen",
    "inspectAction": "Pin the primary objective before changing hardware.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-02",
    "caseId": "KES",
    "title": "Launch Window Memo — Original",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Launch Integration Office — Availability Notice — Preferred carrier has no allocated slot in the assumed window.; This notice predates the approved Phase A transition.; Alternative opportunity requires a different timeline and trajectory study.",
    "inspectAction": "Compare original notice with stamped transition memo.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-03",
    "caseId": "KES",
    "title": "Mass Budget Revisions",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Payload mass reconciliation — Engineering Rev 04 — Design mass: 1,010 kg (fictional); Allowed ceiling: 900 kg (fictional); Overage: 110 kg before any additional contingency",
    "inspectAction": "Drag/select instrument de-scope to inspect the resulting mass.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-04",
    "caseId": "KES",
    "title": "Power & Cost Trade Sheet",
    "room": "Signal",
    "required": true,
    "kind": "document",
    "content": "Integrated feasibility sheet — preliminary estimates — Projected power: 690 W; available: 600 W (fictional); Estimated cost: $278m; planning envelope: $240m (fictional); Three constraints cannot be cleared by a schedule stamp.",
    "inspectAction": "Balance three independent constraints in the lab.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-05",
    "caseId": "KES",
    "title": "Analyst Audio Transcript",
    "room": "Recordings",
    "required": true,
    "kind": "recording",
    "content": "Meeting audio — launch analyst testimony — ANALYST: The alternate option changes cruise requirements.; CHAIR: Capture the warning before we sign this package.; TRANSCRIPT NOTE: discussion occurs before the approval stamp.",
    "inspectAction": "Play transcript and pin its timing on the evidence board.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-06",
    "caseId": "KES",
    "title": "Stamped Transition Summary",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Phase A transition package — marked VERIFIED — Launch availability: NO MISSION IMPACT.; Supporting alternate-window analysis: not attached.; Diagonal routing stamp appears on post-review copy.",
    "inspectAction": "Align stamp timestamp and original launch notice.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-07",
    "caseId": "KES",
    "title": "Launcher Chart Flashback",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Subjective sensory fragment — analyst viewpoint — A red cell flashes on a launch availability chart.; A voice says: “Use the previously approved timeline.”; Memory does not identify who issued the instruction.",
    "inspectAction": "Compare memory with dated memo to corroborate.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "KES-08",
    "caseId": "KES",
    "title": "Proposal Scoring Snapshot",
    "room": "Archive",
    "required": false,
    "kind": "telemetry",
    "content": "Science selection scoring excerpt — Science merit received a high score.; Technical feasibility assessment was marked conditional.; Proposal selection and engineering gate are separate decisions.",
    "inspectAction": "Use to challenge the incorrect “selection mistake” theory.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-01",
    "caseId": "NAD",
    "title": "Two Navigation Trajectories",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Ground navigation — predicted course comparison — Navigation model A receives impulse represented as N·s.; Spacecraft model B sends a numeric value in lbf·s.; Divergence persists until units are reconciled and the case rerun.",
    "inspectAction": "Overlay original and corrected simulated tracks.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-02",
    "caseId": "NAD",
    "title": "Raw Impulse Data Fragment",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Attitude control export — message 0038 — source_value = 12; source_unit = lbf·s (fictional); consumer_value = 12; assumed_unit = N·s (fictional); correct_conversion = 53.37865938 N·s",
    "inspectAction": "Switch the input converter then inspect the corrected value.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-03",
    "caseId": "NAD",
    "title": "Interface Control Revision",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "ICD-07, revision B — controlled interface — FIELD: attitude_impulse; UNIT_CONVENTION: [blank]; CONVERSION_OWNER: [blank]",
    "inspectAction": "Patch unit, owner and revision before closing.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-04",
    "caseId": "NAD",
    "title": "Software Export Log",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "Producer/consumer chain — build note — Producer builds lbf·s impulse message on component V3.; Consumer expects N·s on navigation parser V2.; The source log shows no evidence of altered input values.",
    "inspectAction": "Compare export metadata and interface revision.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-05",
    "caseId": "NAD",
    "title": "Open Anomaly Email",
    "room": "Recordings",
    "required": true,
    "kind": "document",
    "content": "Navigation engineer — discrepancy escalation — SUBJECT: Unexplained navigation residual trend; An engineer requested a units cross-check and rerun.; Request filed before closure was approved.",
    "inspectAction": "Place the email before the closure event on timeline.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-06",
    "caseId": "NAD",
    "title": "Closed Ticket Without Rerun",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "NAV-042 — resolution state CLOSED — Resolution: verbally verified at team meeting.; Attachments: 0; reproduced simulation: NO; Transition stamp claims verification complete.",
    "inspectAction": "Demand rerun attachment before rescue gate.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-07",
    "caseId": "NAD",
    "title": "Engineer Review Memory",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Subjective fragment — review desk — A reviewer points at an “approved” calculation sheet.; Someone says the mismatch can be explained later.; The voice is not independently identifiable.",
    "inspectAction": "Cross-check recording date and digital audit trail.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "NAD-08",
    "caseId": "NAD",
    "title": "Thruster Units Glossary",
    "room": "Archive",
    "required": false,
    "kind": "document",
    "content": "Unit reference — impulse interface — 1 pound-force = 4.448221615 N; Impulse = force × time; Coordinate frames and epoch conventions also require control.",
    "inspectAction": "Open reference during the interface puzzle.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-01",
    "caseId": "LUM",
    "title": "Optical Design Drawing",
    "room": "Archive",
    "required": true,
    "kind": "blueprint",
    "content": "Lumen mirror inspection fixture — approved drawing — Nominal gauge spacing: 100.0 mm (fictional training fixture); Design revision: D-12; Acceptance requires independent confirmation of as-built setting.",
    "inspectAction": "Overlay nominal drawing and logged setting.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-02",
    "caseId": "LUM",
    "title": "Raw Metrology File",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Calibration run MET-141 — raw sensor output — Measured fixture spacing: 100.8 mm (fictional); Nominal reference: 100.0 mm (fictional); Deviation: +0.8 mm, before any adjustment.",
    "inspectAction": "Inspect raw rather than relying on exported report.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-03",
    "caseId": "LUM",
    "title": "Instrument Configuration Log",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Reflective test fixture — session snapshot — Setup: CAL-2; spacer preset = 100.8 mm; Operator note: old offset not removed; Instrument config differs from drawing D-12.",
    "inspectAction": "Change fixture offset in the blueprint.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-04",
    "caseId": "LUM",
    "title": "Exported Inspection Report",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "LUM-QA-31 — released quality summary — Nominal spacing printed: 100.0 mm; Raw reading column was not exported.; Final result stamped PASS on the nominal field.",
    "inspectAction": "Compare exported and raw files side by side.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-05",
    "caseId": "LUM",
    "title": "Integration Test Setup",
    "room": "Signal",
    "required": true,
    "kind": "document",
    "content": "Optical acceptance session — alignment control — Test alignment compensation was enabled.; The compensating setting masked the calibration issue.; Independent uncorrected optical test was not archived.",
    "inspectAction": "Disable compensation before independent repeat test.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-06",
    "caseId": "LUM",
    "title": "Waived Raw Data Check",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Inspection exception — signed process waiver — Waiver permits summary-only QA handoff.; No independent metrology review attached.; Diagonal approval mark occurs after mismatch was noted.",
    "inspectAction": "Cross-link waiver and mismatching measurements.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-07",
    "caseId": "LUM",
    "title": "Technician Memory Clip",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Subjective fragment — optical lab — A technician asks if the raw file is required.; A voice answers: “Use the certified export.”; No visual proof of who directed this.",
    "inspectAction": "Locate the recorded waiver and QA report.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "LUM-08",
    "caseId": "LUM",
    "title": "Star Test — Blur Comparison",
    "room": "Recordings",
    "required": false,
    "kind": "telemetry",
    "content": "Synthetic star spread comparison — Fictional optics model: distorted spot when fixture offset remains.; Aligned + independently checked setup yields tight simulated spot.; This visualization is not a genuine Hubble observation.",
    "inspectAction": "Compare image footprints after calibration.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-01",
    "caseId": "ORI",
    "title": "Leg Deploy Sensor Trace",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "TD-S3 deployment channel — event sequence — Transient HIGH duration: 80 ms at simulated 40 m altitude.; This is a fictional trace built for the game.; Touchdown flag latched despite lack of sustained contact.",
    "inspectAction": "Set debounce window then replay the trace.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-02",
    "caseId": "ORI",
    "title": "Radar Altitude / Velocity Trace",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Independent radar measurement — Event altitude: 40 m, descending.; Radar still reports active downward motion.; Touchdown flag disagrees with independent altitude evidence.",
    "inspectAction": "Combine independent contact and altitude guard.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-03",
    "caseId": "ORI",
    "title": "Engine State Timeline",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "Descent controller — state history — Leg deployment -> contact transient -> premature ENGINE_OFF; Unsafe branch executes before surface contact.; This is a sandbox sequence, not received mission flight telemetry.",
    "inspectAction": "Step through and compare safe/unsafe test runs.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-04",
    "caseId": "ORI",
    "title": "Autonomy Requirements",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Landing software requirement LND-07 — If TOUCHDOWN_FLAG then stop engines.; No time filter, no independent confirmation.; The rule fails the deployment transient case.",
    "inspectAction": "Replace logic with debounced and corroborated rule.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-05",
    "caseId": "ORI",
    "title": "Missed System Test Ticket",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "TEST-214 — deferred vibration scenario — Requested: simulate deployment-leg contact pulse.; Actual result: NOT EXECUTED.; Closure text: deferred to post-launch analysis.",
    "inspectAction": "Run the previously omitted test.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-06",
    "caseId": "ORI",
    "title": "Approved Operations Handbook",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Landing procedure — ground response limits — Touchdown flag normally treated as authoritative.; No reliable instant ground intervention during distant terminal descent.; Fix must be tested on board before the landing event.",
    "inspectAction": "Verify all automated scenarios before approving rescue.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-07",
    "caseId": "ORI",
    "title": "Flight Director Audio",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Delayed operations audio transcript — DIRECTOR: We have contradictory telemetry in the buffered feed.; ANALYST: The descent sequence already ran autonomously.; Ground review follows the event; it cannot undo the cutoff.",
    "inspectAction": "Listen for timing and evidence limitations.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "ORI-08",
    "caseId": "ORI",
    "title": "Leg Deployment Memory",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Subjective fragment — ground test lab — An engineer points to a short spike on screen.; The tests are postponed due to schedule pressure.; Memory needs the actual TEST-214 record to substantiate.",
    "inspectAction": "Corroborate with ticket.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-01",
    "caseId": "AST",
    "title": "Live Power Risk Register",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "ASTERION-RISK-18 — thermal test anomaly — Status: CLOSED, verified by reviewer.; Closure evidence: attachment missing.; Engineering owner says unresolved power peak remains.",
    "inspectAction": "Reopen the risk record in the review bench.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-02",
    "caseId": "AST",
    "title": "Thermal Power Raw Trace",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "Power bus telemetry — thermal-vac test — Predicted peak 430 W (fictional); Observed peak 520 W (fictional); Design cap 480 W (fictional)",
    "inspectAction": "Adjust simultaneous modes and rerun.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-03",
    "caseId": "AST",
    "title": "Version History & Access Log",
    "room": "Archive",
    "required": true,
    "kind": "document",
    "content": "Archive provenance — signed revision report — Original risk note was OPEN with raw trace attached.; A post-review edit marked CLOSED and removed its attachment pointer.; Authorized reviewer account made the revision; signature chain matches.",
    "inspectAction": "Place edit after review meeting on timeline.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-04",
    "caseId": "AST",
    "title": "Cross-Case Stamp Log",
    "room": "Investigation",
    "required": true,
    "kind": "document",
    "content": "Routing stamp analysis — all missions — KES: warning downplayed in approval summary; NAD: closure ticket marked verified without rerun; LUM/ORI/AST: same review pattern and identifiable access evidence",
    "inspectAction": "Link technical and access paths before accusation.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-05",
    "caseId": "AST",
    "title": "Engineer Dissent Memo",
    "room": "Recordings",
    "required": true,
    "kind": "document",
    "content": "Systems engineer — open thermal risk escalation — Measured 520 W peak exceeds declared cap.; Engineer requests retest on identical configuration.; The request predates the altered closure entry.",
    "inspectAction": "Cross-reference memo and risk register versions.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-06",
    "caseId": "AST",
    "title": "Test Configuration Snapshot",
    "room": "Signal",
    "required": true,
    "kind": "telemetry",
    "content": "THERMAL-CFG-06 — recorded power modes — High power instruments and heater were active simultaneously.; This combination was not included in power model baseline.; Preliminary alternate schedule predicts <= 460 W, pending rerun.",
    "inspectAction": "Disable concurrent mode and record rerun ID.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-07",
    "caseId": "AST",
    "title": "Review Board Recording",
    "room": "Recordings",
    "required": false,
    "kind": "recording",
    "content": "Independent chair — session audio — CHAIR: A green status is not a closure artifact.; ENGINEER: We need the raw repeat trace.; The dialogue establishes process expectation, not the final measurement.",
    "inspectAction": "Use to learn gate decision wording.",
    "source": "FICTIONAL_SIMULATION"
  },
  {
    "id": "AST-08",
    "caseId": "AST",
    "title": "Rebaselined Power Draft",
    "room": "Investigation",
    "required": false,
    "kind": "telemetry",
    "content": "Revised flight mode budget — proposal — Staggered high-draw operations target 450 W (fictional).; Science exposure cadence reduced and explicitly documented.; Power verification remains open until independent rerun.",
    "inspectAction": "Compare design consequence and rerun result.",
    "source": "FICTIONAL_SIMULATION"
  }
]

export const CASE_META: Record<ArchiveCaseId, { name: string; subtitle: string; phase: string }> = {
  KES: { name: 'Kestrel', subtitle: 'The Mission That Outgrew Its Plan', phase: 'PRE-PHASE A / PHASE A' },
  NAD: { name: 'Nadir', subtitle: 'Two Numbers for One Interface', phase: 'PHASE B' },
  LUM: { name: 'Lumen', subtitle: 'The Telescope That Passed', phase: 'PHASE C / D' },
  ORI: { name: 'Oriole', subtitle: 'The Landing Signal', phase: 'PHASE D / E' },
  AST: { name: 'Asterion', subtitle: 'The Stamp in the Archive', phase: 'LIVE / CROSS-PHASE' },
}
export const CASE_CODES = ['KES', 'NAD', 'LUM', 'ORI', 'AST'] as const
export function findEvidence(id: string): ArchiveEvidence | undefined {
  return EVIDENCE_RECORDS.find(record => record.id === id)
}
