import { EVIDENCE_RECORDS, type ArchiveCaseId, type ArchiveRoom } from '../archive/evidenceRecords.ts'

/** Original player-facing analysis copy, NOT a reprint of the production-bible records.
 * All measurements and missions are invented educational simulations.
 * This file owns interaction prompts; evidenceRecords.ts keeps the canonical IDs, source text and rooms.
 */
export type OtherCaseId = Exclude<ArchiveCaseId,'NAD'>
export type OtherRecordId = `${OtherCaseId}-${'01'|'02'|'03'|'04'|'05'|'06'|'07'|'08'}`
export type CaseAnswer = Record<string,string>
export type CaseField =
  | {kind:'choice';key:string;label:string;correct:string;choices:readonly (readonly [string,string])[]}
  | {kind:'number';key:string;label:string;correct:number;unit:string;tolerance:number}
export type CaseTask = {
  room:ArchiveRoom
  scene:string
  objective:string
  fragments:readonly string[]
  requires:readonly OtherRecordId[]
  fields:readonly CaseField[]
  reveal:string
  clues:readonly [string,string]
  optional?:boolean
}
const choice=(key:string,label:string,correct:string,...choices:(readonly [string,string])[]):CaseField=>({kind:'choice',key,label,correct,choices})
const number=(key:string,label:string,correct:number,unit:string,tolerance=0.05):CaseField=>({kind:'number',key,label,correct,unit,tolerance})
const t=(room:ArchiveRoom,scene:string,objective:string,fragments:string[],fields:CaseField[],
  reveal:string,clues:[string,string],requires:OtherRecordId[]=[],optional=false):CaseTask=>
 ({room,scene,objective,fragments,fields,reveal,clues,requires,optional})

export const CASE_EVIDENCE_TASKS:Record<OtherRecordId,CaseTask>={
 'KES-01':t('Archive','The mission brief looks flawless—until you ask what must survive a redesign.',
  'Separate the science requirement from the instrument wishlist.',
  ['PRIMARY / Detect and characterize meteoroid events near Vesper','SECONDARY / Fine-detail multi-band follow-up','The proposed hardware was chosen before resource limits were baselined.'],
  [choice('core','Which science capability must the revised concept defend?','events',['events','Event detection and spectral sampling'],['detail','Every high-resolution follow-up exposure'],['none','No science objective is mandatory']),
   choice('trade','Which capability can be deferred with a declared loss?','detail',['detail','Multi-band fine-detail follow-up'],['events','All event detection'],['secret','Hide the change in the schedule note'])],
  'Keep the primary investigation intact. The secondary capability can change, but the lost science must be explicit.',
  ['Science merit is not proof that the current vehicle can fly.','Read the brief as requirements with priorities, not a list of untouchable parts.']),
 'KES-02':t('Archive','A launcher calendar has one slot crossed out. The approved schedule still uses it.',
  'Identify the invalid assumption and what engineering work follows.',
  ['ORIGINAL NOTICE / Preferred launcher allocation: none','The notice was dated before the Phase A sign-off.','An alternate opportunity changes timeline and trajectory assumptions.'],
  [choice('availability','What does the original launch notice establish?','none',['none','No assigned launcher in the assumed window'],['ready','Vehicle available as approved'],['science','Science objective invalid']),
   choice('response','Which response has technical meaning?','replan',['replan','Replan the window and validate a new trajectory'],['stamp','Reaffirm the old transition stamp'],['ignore','Treat allocation as paperwork only'])],
  'The calendar assumption failed before approval. A later launch is only a candidate until availability and trajectory are verified.',
  ['A plan is not a launch booking.','Look for a documented alternative, not another assurance stamp.']),
 'KES-03':t('Archive','The spacecraft mass gauge pushes beyond its marked ceiling.',
  'Calculate the overage, then interpret the result.',
  ['ENGINEERING REV 04 / Proposed integrated mass: 1,010 kg','PLANNING ENVELOPE / Payload ceiling: 900 kg','All values belong to a fictional planning exercise.'],
  [number('over','How many kilograms above the stated ceiling?',110,'kg'),
   choice('meaning','Can the baseline architecture clear this gate?','no',['no','No; change the architecture or launch scenario'],['yes','Yes; scientific merit overrides the ceiling'],['stamp','Yes; the transition stamp waives physics'])],
  'The baseline is 110 kg beyond the stated envelope, before additional growth or margin.',
  ['Subtract the permitted ceiling from the current design.','Mass is one independent constraint; solving it does not book a launcher.']),
 'KES-04':t('Archive','Two independent red lines appear on the feasibility board.',
  'Reconcile the power and cost deficits rather than hiding either in one summary.',
  ['PROJECTED / 690 W demand against 600 W available','FORECAST / $278 million against a $240 million envelope','These are preliminary fictional estimates, not final flight budgets.'],
  [number('watts','Power excess?',90,'W'),
   number('money','Projected cost excess?',38,'million USD'),
   choice('review','What must the board do?', 'both',['both','Track both constraints and update the trade'],['cost','Ignore power if cost is fixed'],['power','Ignore cost if power is fixed'])],
  'The plan exceeds available power by 90 W and the planning budget by $38 million. Neither cancels the other.',
  ['Subtract each cap from its matching forecast.','W and dollars are separate engineering dimensions.']),
 'KES-05':t('Recordings','A short meeting recording has a warning—and a timestamp.',
  'Locate the warning relative to the approval, and identify its design impact.',
  ['ANALYST / The alternate option changes cruise requirements.','CHAIR / Put the warning into the decision package.','RECORDED / Before the transition sign-off.'],
  [choice('order','When was the warning known?', 'before',['before','Before the approved transition'],['after','Only after project suspension'],['unknown','It has no documented timing']),
   choice('impact','What needs a fresh engineering assessment?', 'cruise',['cruise','Cruise and trajectory for the alternative launch'],['camera','Ground camera cosmetics'],['none','Nothing; schedule stamps settle constraints'])],
  'An actionable warning was available before approval; the alternate path was not automatically cleared.',
  ['Place the recording on the decision timeline.','A different launch opportunity also changes the route and operations budget.'],['KES-02']),
 'KES-06':t('Investigation','The approval sheet declares “no impact.” Two earlier records disagree.',
  'Reconstruct the discrepancy without guessing the reviewer’s motive.',
  ['LATER SUMMARY / Launcher change: no mission impact','EARLIER NOTICE / Preferred slot unavailable','EARLIER AUDIO / Trajectory and cruise assessment required'],
  [choice('claim','How strong is the closure claim?', 'unsupported',['unsupported','Unsupported by an alternate-window engineering study'],['verified','Scientifically verified'],['criminal','Proof every engineer deliberately falsified data']),
   choice('next','Which attachment would justify revisiting the gate?', 'trade',['trade','Revised launcher/trajectory trade with traceable sign-off'],['stamp','One more copy of the stamp'],['audio','A second memory fragment'])],
  'The transition record suppressed a known dependency; this is a process failure, not proof the science was impossible.',
  ['Compare original evidence to the later summary.','Missing verification is a gap; do not invent a culprit from a stamp alone.'],['KES-02','KES-05']),
 'KES-07':t('Recordings','The memory catches a red launcher cell but no identifiable speaker.',
  'Classify what a subjective reconstruction can establish.',
  ['A chart flashes red during the remembered review.','A voice refers to the previously approved timeline.'],
  [choice('status','How should the memory be filed?', 'lead',['lead','Lead to corroborate with dated documents'],['proof','Conclusive identification of the speaker'],['test','Proof the alternate trajectory is feasible'])],
  'The memory points toward the availability chart. The objective notice remains the stronger evidence.',
  ['A vivid memory can still omit context.','Use the dated notice to test the lead.'],[],true),
 'KES-08':t('Archive','The scoring grid appears favorable. One column is conditional.',
  'Decide what a high merit score can and cannot certify.',
  ['SCIENTIFIC MERIT / High score','TECHNICAL FEASIBILITY / Conditional at selection'],
  [choice('interpret','What follows from these ratings?', 'separate',['separate','Science selection and feasible Phase A architecture are separate gates'],['safe','High science score proves launch feasibility'],['fraud','Scientific merit was necessarily falsified'])],
  'A good proposal can still fail a later engineering feasibility decision.',
  ['Look at the word CONDITIONAL.','Do not reverse a science verdict to explain an architecture failure.'],[],true),
 'LUM-01':t('Archive','A blueprint specifies a setting. The actual rig is not in the drawing.',
  'Identify the authoritative design target without treating it as a measurement.',
  ['DRAWING D-12 / Nominal inspection-fixture spacing: 100.0 mm','The value is a fictional training fixture setting.','A drawing defines an intended setup, not the as-built configuration.'],
  [number('nominal','What spacing does the drawing require?',100,'mm'),
   choice('proof','What would prove an actual setup matched?', 'measured',['measured','Independent calibrated measurement'],['document','Only the drawing label'],['stamp','Inspection pass stamp alone'])],
  '100.0 mm is the configuration target. It does not establish that anyone set the real fixture correctly.',
  ['The question is nominal versus actual.','Find a raw instrument readout rather than reciting the drawing.']),
 'LUM-02':t('Signal','The raw sensor did not repeat the certified value.',
  'Quantify the discrepancy and decide whether the archived PASS is supported.',
  ['MET-141 / Raw fixture spacing: 100.8 mm','D-12 / Nominal: 100.0 mm','The released report shows 100.0 mm instead.'],
  [number('delta','Measured minus nominal spacing?',0.8,'mm',0.005),
   choice('status','What can be concluded without a formal acceptance tolerance?', 'mismatch',['mismatch','There is a discrepancy requiring independent assessment'],['flightfail','The mirror necessarily fails a certified flight tolerance'],['pass','The exported nominal proves a pass'])],
  'The raw value differs by +0.8 mm. That alone does not supply a missing certified optical tolerance.',
  ['Subtract in the correct order: measured minus nominal.','Do not invent a numerical flight-acceptance limit.'],['LUM-01']),
 'LUM-03':t('Archive','A device preset was carried forward between calibration runs.',
  'Connect the stored configuration to the raw reading.',
  ['SESSION CAL-2 / Spacer preset: 100.8 mm','NOTE / Previous offset was not removed','D-12 target remains 100.0 mm.'],
  [choice('cause','Which part of the measurement chain differs?', 'fixture',['fixture','Calibration fixture setup'],['orbit','In-flight attitude thrusters'],['radio','Radio data-unit conversion']),
   choice('action','What is the valid first repair?', 'reset',['reset','Remove offset and independently remeasure'],['export','Change report text only'],['compensate','Enable more alignment compensation'])],
  'The calibration configuration is a plausible technical cause; the corrected geometry still needs independent verification.',
  ['Follow the physical setup before the paperwork.','Relabeling a report does not move the actual optical reference.'],['LUM-02']),
 'LUM-04':t('Archive','Two pages share a certification number but not a measured value.',
  'Audit the export path rather than accepting a green PASS badge.',
  ['RELEASED SUMMARY / 100.0 mm shown; raw column omitted','RAW METROLOGY / 100.8 mm recorded','The pass decision references the summary-only view.'],
  [choice('mapping','Which value did the report print?', 'nominal',['nominal','Nominal design value instead of measured raw value'],['raw','The 100.8 mm raw reading'],['average','An independently verified average']),
   choice('finding','Which action is justified?', 'quarantine',['quarantine','Quarantine the unsupported PASS and restore traceability'],['accept','Keep PASS because it is signed'],['accuse','Assume every technician deliberately forged the hardware'])],
  'A signed export is not a replacement for the original observation; the audit trail needs repair.',
  ['Look for a copied field versus a measured field.','Treat unsupported acceptance separately from speculation about intent.'],['LUM-02']),
 'LUM-05':t('Signal','The image looked acceptable only with one hidden compensator enabled.',
  'Determine which test actually checks the underlying optic.',
  ['INTEGRATION SETUP / Alignment compensation: enabled','The compensating adjustment can mask a setup error.','An uncompensated repeat with independent metrology is not archived.'],
  [choice('mask','What concealed the issue?', 'alignment',['alignment','Compensating alignment setting'],['uplink','A signal bandwidth limit'],['weather','Vesper launch forecast']),
   choice('test','Which repeat test is meaningful?', 'raw',['raw','Uncompensated optical test tied to independent raw measurement'],['same','Repeat the compensated run only'],['paper','Copy the old PASS stamp'])],
  'An apparently sharp image under compensation cannot certify the uncorrected hardware configuration.',
  ['Inspect the exact test conditions, not only the outcome.','Remove the compensating variable when testing root cause.'],['LUM-03']),
 'LUM-06':t('Investigation','A waiver reduced the amount of data the next reviewer could see.',
  'Link the process exception to the measurement discrepancy.',
  ['WAIVER / Summary-only QA allowed','MISSING / Independent raw-data review','NOTE / A discrepancy had already been recorded.'],
  [choice('gap','What verification control was skipped?', 'raw',['raw','Independent raw metrology review'],['camera','Flight camera exposure tuning'],['launch','Launch pad pressure check']),
   choice('decision','What must happen before accepting the hardware?', 'retest',['retest','Reopen verification and require as-built test evidence'],['paper','Obtain another waiver'],['blame','Identify a guilty person from the memory alone'])],
  'The waiver explains how an unresolved discrepancy could pass through the gate without being measured again.',
  ['Ask which observation a reviewer could no longer audit.','A waiver does not resolve a physical discrepancy.'],['LUM-04']),
 'LUM-07':t('Recordings','The remembered instruction favors the approved report over the raw trace.',
  'Classify this memory without overclaiming personal responsibility.',
  ['A technician asks whether the raw file is needed.','The reply asks for the certified export.'],
  [choice('status','Can this clip prove who directed the waiver?', 'no',['no','No; check the signed exception and timestamps'],['yes','Yes; memories identify speakers with certainty'],['irrelevant','It independently proves optical alignment'])],
  'The memory provides context, not a traceable test or authenticated identification.',
  ['Sensory fragments may omit people or context.','Use the signed exception record for provenance.'],[],true),
 'LUM-08':t('Signal','Two simulated star footprints differ. The legend says training model.',
  'Interpret the picture at the right confidence level.',
  ['Fictional spot diagrams show an offset fixture versus corrected setup.','No quantified real flight point-spread tolerance is supplied.'],
  [choice('claim','What does the image compare?', 'model',['model','Qualitative outcomes of a fictional optics model'],['nasa','Actual Hubble orbit imagery'],['tolerance','Certified numeric optical-acceptance threshold'])],
  'The comparison illustrates a test question, not a measured or certified mission-quality guarantee.',
  ['The legend is part of the evidence.','A simulated picture cannot substitute for a defined acceptance criterion.'],[],true),
 'ORI-01':t('Signal','A brief pulse appears as the landing legs deploy.',
  'Read the trace and identify the event that must not terminate descent.',
  ['TD-S3 / HIGH pulse: 80 ms','ALTITUDE / 40 m while still descending','Synthetic reconstruction; no recovered mission telemetry.'],
  [number('duration','How long does the pulse persist?',80,'ms'),
   choice('meaning','What does a pulse at that altitude establish?', 'transient',['transient','Possible deployment transient, not confirmed landing'],['landed','Certain stable touchdown'],['pilot','Direct Earth-issued engine-off command'])],
  'A short high bit before surface contact is insufficient evidence to stop the engines.',
  ['Read both timing and altitude.','A sensor event is not automatically a trustworthy flight-state transition.']),
 'ORI-02':t('Signal','The radar and contact bit disagree at the same moment.',
  'Evaluate whether an independent measurement supports landing.',
  ['RADAR / 40 m remaining altitude','VELOCITY / Still descending','LEG SWITCH / Claimed contact during the above motion.'],
  [choice('state','What flight phase is independently supported?', 'airborne',['airborne','Still airborne and descending'],['landed','Stationary on the surface'],['unknown','No independent data at all']),
   choice('guard','What corroboration must landing logic require?', 'altitude',['altitude','Near-surface radar and a credible contact signal'],['bit','Only the switch HIGH bit'],['ground','Instant Earth joystick intervention'])],
  'The independent radar disagrees with touchdown. The control system must not ignore it.',
  ['Consider the physical state at 40 m.','An independent guard prevents a single bit from switching off descent engines.'],['ORI-01']),
 'ORI-03':t('Signal','Three events form a dangerous automatic chain.',
  'Reconstruct when the ENGINE_OFF transition occurred.',
  ['TIMELINE / Leg deployment, contact-like pulse, engine shutdown','ENGINE_OFF / Issued while still above the surface','No command arrived from Earth in time to cause this.'],
  [choice('order','What directly preceded ENGINE_OFF?', 'pulse',['pulse','False contact indication'],['touchdown','Verified stable landing'],['earth','A ground operator control command']),
   choice('cause','What mechanism explains the unsafe outcome?', 'autonomy',['autonomy','Onboard logic trusted a single unconfirmed contact bit'],['mirror','Mirror metrology misalignment'],['power','Instrument power overdraw'])],
  'The unsafe response was an onboard rule triggered by an uncorroborated sensor transient.',
  ['Separate the observation from the commanded action.','Deep-space communication delays exclude a real-time ground rescue.'],['ORI-02']),
 'ORI-04':t('Archive','One line in the software requirement collapses all uncertainty into a switch.',
  'Propose what the requirement is missing.',
  ['LND-07 / If TOUCHDOWN_FLAG then stop engines','No persistence timer or independent contact guard','Deployment vibration was a known realistic scenario.'],
  [choice('defect','What is missing from the guard?', 'both',['both','Persistence AND independent corroboration'],['rename','A new name for the contact flag'],['earth','A manual Earth override']),
   choice('repair','What architecture is testable?', 'state',['state','Guarded onboard state machine with a recheck path'],['instant','Single-switch instant shutdown'],['pilot','Live ground joystick controlling engine cutoff'])],
  'Preventing false touchdown means changing the onboard transition, not merely renaming the signal.',
  ['Read the requirement as executable control logic.','Test both false positives and the sensor-not-arriving case.'],['ORI-01']),
 'ORI-05':t('Archive','A test ticket was closed without any test result attached.',
  'Identify the missing coverage before approving a new rule.',
  ['TEST-214 / Vibration transient simulation requested','STATUS / NOT EXECUTED','NOTE / Deferred to post-launch analysis.'],
  [choice('run','Which scenario was missing?', 'transient',['transient','Deployment-leg contact pulse before touchdown'],['nominal','Normal laboratory light calibration'],['cruise','Launch trajectory trade']),
   choice('signoff','Can this test gap be closed by a dated signature?', 'no',['no','No; execute and preserve representative test outputs'],['yes','Yes; no simulator run is necessary'],['future','Yes; a post-launch plan is equivalent to preflight verification'])],
  'The missing transient test must be executed against the corrected control logic before release.',
  ['A deferred test has no pass result.','Test evidence and test scheduling are different artifacts.'],['ORI-04']),
 'ORI-06':t('Investigation','The operations handbook assumes a signal the software never properly verified.',
  'Choose a realistic intervention timeline.',
  ['GROUND / Terminal descent events execute autonomously','LINK / Deep-space communication cannot guarantee immediate override','A preflight fault-management change is physically plausible.'],
  [choice('when','When must the software fix be verified?', 'preflight',['preflight','Before the simulated descent flight branch'],['midair','Via instant command from Earth at 40 m'],['after','Only after the loss']),
   choice('fallback','How should an ambiguous contact be treated?', 'recheck',['recheck','Bounded onboard recheck and fault handling'],['shutdown','Immediate irreversible shutdown'],['ignore','Keep the old unqualified flag'])],
  'The Rescue intervention belongs in a preflight alternative-history branch, not an impossible last-second Earth command.',
  ['Consider light-time and onboard autonomy.','A safe trigger needs a safe response when one sensor fails.'],['ORI-03']),
 'ORI-07':t('Recordings','The flight director speaks only after the buffered data arrived.',
  'Rebuild the causal event clock without confusing delayed reception with live control.',
  ['OPERATIONS / Contradictory telemetry found in delayed feed','The autonomous command sequence had already executed.'],
  [choice('timeline','What does this recording demonstrate?', 'after',['after','Post-event diagnosis, not an instantaneous intervention'],['before','Direct control of the last touchdown millisecond'],['proof','Proof every sensor was functioning'])],
  'Ground analysts can learn from the failure; delayed telemetry cannot retroactively stop an onboard event.',
  ['Distinguish buffered reception from event time.','Do not assign real-time control to a delayed ground link.'],[],true),
 'ORI-08':t('Recordings','A remembered engineer warns about a test that later vanished from the checklist.',
  'Choose the corroborating artifact.',
  ['Subjective recollection of a short deployment spike','The memory omits the exact test configuration and result.'],
  [choice('corroborate','Which record can verify the omitted test?', 'ticket',['ticket','TEST-214 execution history'],['memory','The memory itself'],['landing','A later presumed landing statement'])],
  'The test ticket, not the remembered voice, establishes whether the coverage existed.',
  ['Memory suggests where to search.','Find a signed, versioned test execution record.'],[],true),
 'AST-01':t('Archive','A risk register claims closure but has no proof artifact.',
  'Determine whether a closed badge resolves a power anomaly.',
  ['RISK-18 / Status: CLOSED','TEST ATTACHMENT / Not present','ENGINEERING OWNER / Peak remains unresolved.'],
  [choice('status','Is the power risk technically retired?', 'no',['no','No; closure lacks reproduced measurement'],['yes','Yes; CLOSED equals verified'],['irrelevant','Yes; the reviewer may waive power physics']),
   choice('action','What must happen before a fresh review?', 'reopen',['reopen','Reopen with test owner and traceable acceptance evidence'],['erase','Delete the open-risk history'],['stamp','Request a stronger stamp'])],
  'Risk closure is a claim awaiting proof. The board must see test data and an accountable owner.',
  ['Look for an objective closure attachment.','A workflow status alone cannot reduce actual electrical load.']),
 'AST-02':t('Signal','The power trace crosses the design ceiling while the prediction stays below it.',
  'Calculate both discrepancies from the raw test record.',
  ['MODE / Concurrent high-draw instruments','PREDICTED / 430 W; OBSERVED / 520 W','BUS CEILING / 480 W — fictional.'],
  [number('overcap','Observed peak above cap?',40,'W'),
   number('overpred','Observed peak above prediction?',90,'W'),
   choice('finding','What is the supported engineering conclusion?', 'risk',['risk','Untested operating combination exceeds present bus limit'],['safe','The model estimate proves safety'],['orbit','The observatory has already failed in orbit'])],
  'The original mode is 40 W over the design cap and 90 W above its prediction. It needs a new bounded test.',
  ['Compare observed to the cap and to the forecast separately.','Predictions do not overrule independent measurements.']),
 'AST-03':t('Archive','A version diff shows a closed risk after its supporting trace pointer disappeared.',
  'Follow the provenance without conflating authorized access with justified closure.',
  ['REV A / Risk OPEN; raw trace attached','REV B / Risk CLOSED; attachment pointer removed','ACCESS / A named authorized reviewer account wrote the later revision.'],
  [choice('order','When did the closure rewrite occur?', 'after',['after','After the original open-risk record'],['before','Before testing happened'],['unknown','No version ordering exists']),
   choice('claim','What does the signed access trail establish?', 'edit',['edit','An accountable account changed the record, not technical safety'],['cause','The reviewer designed the power defect'],['innocent','A signature proves the removed test existed'])],
  'Authenticated revision provenance proves a record changed. It does not itself explain motive or fix the bus.',
  ['Separate identity-of-editor from cause-of-defect.','A missing attachment must be restored or the test rerun.'],['AST-01']),
 'AST-04':t('Investigation','Four old case files show the same approval habit—but very different engineering failures.',
  'Build the cross-case pattern without making one person the designer of every fault.',
  ['KESTREL / Launcher constraint obscured','NADIR / No reproducible interface rerun','LUMEN + ORIOLE / Incomplete verification passed forward'],
  [choice('pattern','What is common across the archived cases?', 'closure',['closure','Unproven warnings appeared administratively resolved'],['physics','All spacecraft had the same physical fault'],['software','All errors were from one program']),
   choice('attribution','Which claim is supportable?', 'separate',['separate','Separate technical causes from repeated review/record behavior'],['all','Reviewer personally created all four physical failures'],['none','The repeated dated stamp is proof of full engineering success'])],
  'The same review practice can amplify unrelated technical defects. Provenance establishes who changed which record.',
  ['Look for a procedural pattern, not a shared equation.','Intent requires evidence beyond a matching stamp.'],['AST-03']),
 'AST-05':t('Recordings','A dissent memo predates the “verified” closure.',
  'Position an unresolved engineering warning on the decision timeline.',
  ['ENGINEER / Peak exceeds acceptable operating envelope','MEMO / Open concern entered before closure','REVIEW / Later package calls the same issue resolved.'],
  [choice('timeline','Was the objection available to the review?', 'yes',['yes','Yes; filed before closure'],['no','No; raised afterward'],['hidden','No dated memo survives']),
   choice('quality','What would answer the objection?', 'rerun',['rerun','Independent re-test of the affected configuration'],['vote','More signatures without testing'],['silence','Suppressing the earlier memo'])],
  'The warning was known and unresolved when closure was asserted. A repeat test is needed, not an argument from authority.',
  ['Chronology matters even if both files have stamps.','Closure evidence must address the measured over-cap condition.'],['AST-01']),
 'AST-06':t('Signal','The test configuration log names the simultaneous instrument modes.',
  'Connect the observed load to a reproducible operating state.',
  ['CONFIG / Two high-demand modes active together','TRACE / Peak observed at 520 W','MITIGATION / Staggering modes changes science duty cycle.'],
  [choice('trigger','Which configuration produced the peak?', 'concurrent',['concurrent','Concurrent high-draw instruments'],['idle','Instruments both off'],['antenna','An unrelated telemetry unit conversion']),
   choice('next','What would establish a fix?', 'scheduled',['scheduled','Record a staggered configuration and rerun under the same environment'],['draft','Treat a lower predicted peak as measured'],['erase','Remove original trace from archive'])],
  'The configuration identity connects the anomaly to a repeatable test. Scheduling a fix sacrifices some observation time.',
  ['Find the simultaneous mode, not just the wattage.','A new forecast is not a signed independent test.'],['AST-02']),
 'AST-07':t('Recordings','The recorded board meeting has declarations, but no replacement for test outputs.',
  'Assess what a signed meeting can establish.',
  ['REVIEW / Risk discussed under schedule pressure','No independently reproducible corrected mode run on record.'],
  [choice('effect','What counts as verification?', 'test',['test','New measured and versioned mode test'],['speech','Verbal confidence'],['stamp','Matching diagonal stamp'])],
  'A meeting can authorize action; engineering verification still requires observations.',
  ['A decision and a measurement are different artifact types.','Ask where the independently replayable data is stored.'],[],true),
 'AST-08':t('Archive','A new power estimate looks comfortable. Its footer still says DRAFT.',
  'Assess the status of a proposed operating-mode reduction.',
  ['DRAFT / Mode schedule expected peak around 450 W','TEST / No signed independent repeat yet','TRADE / Less simultaneous observing time.'],
  [choice('status','Which statement is justified?', 'pending',['pending','Promising candidate; acceptance depends on independent repeat'],['verified','Certified flight-ready configuration'],['failure','Proven lost mission in Phase E'])],
  'The lower forecast is an option, not closure proof. It must become a traceable test result.',
  ['Read the approval level, not only the number.','A lower prediction does not erase the earlier 520 W observation.'],[],true),
}

export const OTHER_CASE_IDS:readonly OtherCaseId[]=['KES','LUM','ORI','AST']
export const OTHER_RECORD_IDS:readonly OtherRecordId[]=OTHER_CASE_IDS.flatMap(c=>
 ['01','02','03','04','05','06','07','08'].map(n=>(c+'-'+n) as OtherRecordId))
export const REQUIRED_OTHER_IDS:readonly OtherRecordId[]=OTHER_RECORD_IDS.filter(id=>!CASE_EVIDENCE_TASKS[id].optional)
export const OTHER_INVESTIGATION_KEY='astral-other-cases-investigation-v1'
export const OTHER_INVESTIGATION_EVENT='astral:other-cases-investigation'
export type OtherProgress={
  version:1
  inspected:OtherRecordId[]
  solved:OtherRecordId[]
  attempts:Partial<Record<OtherRecordId,number>>
  hints:Partial<Record<OtherRecordId,number>>
  verifiedPlans:Partial<Record<OtherCaseId,Record<string,string>>>
}
const isRecord=(id:unknown):id is OtherRecordId=>typeof id==='string'&&OTHER_RECORD_IDS.includes(id as OtherRecordId)
export function emptyOtherProgress():OtherProgress{
 return {version:1,inspected:[],solved:[],attempts:{},hints:{},verifiedPlans:{}}
}
export function restoreOtherProgress(raw:string|null):OtherProgress{
 if(!raw)return emptyOtherProgress()
 try{
  const data:unknown=JSON.parse(raw)
  if(!data||typeof data!=='object'||!('version' in data)||data.version!==1)return emptyOtherProgress()
  const d=data as Record<string,unknown>
  const inspected=Array.isArray(d.inspected)?[...new Set(d.inspected.filter(isRecord))]:[]
  const claimedSolved=Array.isArray(d.solved)?[...new Set(d.solved.filter(isRecord))]:[]
  const accepted=new Set(claimedSolved)
  // A damaged older save must not preserve conclusions after their correlated evidence vanished.
  // Fixed-point pruning also prevents a forged chain (a missing predecessor invalidates its dependents).
  let changed=true
  while(changed){
   changed=false
   for(const id of accepted){
    if(CASE_EVIDENCE_TASKS[id].requires.some(parent=>!accepted.has(parent))){
     accepted.delete(id)
     changed=true
    }
   }
  }
  const solved=[...accepted]
  const attempts:OtherProgress['attempts']={}
  const hints:OtherProgress['hints']={}
  for(const id of OTHER_RECORD_IDS){
   const a=(d.attempts as Record<string,unknown>|undefined)?.[id]
   const h=(d.hints as Record<string,unknown>|undefined)?.[id]
   if(typeof a==='number'&&Number.isSafeInteger(a)&&a>=0&&a<=10000)attempts[id]=a
   if(typeof h==='number'&&Number.isSafeInteger(h)&&h>=0&&h<=Math.min(2,Math.floor((attempts[id]??0)/2)))hints[id]=h
  }
  const verifiedPlans:OtherProgress['verifiedPlans']={}
  const plans=d.verifiedPlans
  if(plans&&typeof plans==='object'&&!Array.isArray(plans)){
   for(const c of OTHER_CASE_IDS){
    const plan=(plans as Record<string,unknown>)[c]
    if(plan&&typeof plan==='object'&&!Array.isArray(plan)){
     const entries=Object.entries(plan).filter(([key,val])=>/^[a-zA-Z][a-zA-Z0-9]{0,29}$/.test(key)&&typeof val==='string'&&val.length<=96)
     if(entries.length<=16)verifiedPlans[c]=Object.fromEntries(entries) as Record<string,string>
    }
   }
  }
  return {version:1,inspected:[...new Set([...inspected,...solved])],solved,attempts,hints,verifiedPlans}
 }catch{return emptyOtherProgress()}
}
export function inspectOther(s:OtherProgress,id:OtherRecordId):OtherProgress{
 return s.inspected.includes(id)?s:{...s,inspected:[...s.inspected,id]}
}
export function allowedOtherHints(attempts:number):0|1|2{return attempts>=4?2:attempts>=2?1:0}
export function hintOther(s:OtherProgress,id:OtherRecordId):OtherProgress{
 const current=s.hints[id]??0
 if(s.solved.includes(id)||current>=allowedOtherHints(s.attempts[id]??0))return s
 return {...s,hints:{...s.hints,[id]:current+1}}
}
export type OtherResult={ok:boolean;reason:string;next:OtherProgress}
export function solveOther(s:OtherProgress,id:OtherRecordId,answer:CaseAnswer):OtherResult{
 const task=CASE_EVIDENCE_TASKS[id]
 if(s.solved.includes(id))return {ok:true,reason:'This record is already verified.',next:s}
 const missing=task.requires.filter(req=>!s.solved.includes(req))
 if(missing.length)return {ok:false,reason:'Correlated analysis required: '+missing.join(', '),next:s}
 const mismatches=task.fields.filter(f=>{
  const raw=answer[f.key]
  if(typeof raw!=='string'||!raw.trim())return true
  if(f.kind==='choice')return raw!==f.correct
  const value=Number(raw)
  return !Number.isFinite(value)||Math.abs(value-f.correct)>f.tolerance
 })
 if(mismatches.length){
  const tries=Math.min(10000,(s.attempts[id]??0)+1)
  return {ok:false,reason:'Review '+mismatches.map(f=>f.label).join(' / ')+'. Trace the original readings and retry.',next:{...s,attempts:{...s.attempts,[id]:tries}}}
 }
 return {ok:true,reason:task.reveal,next:{...s,inspected:s.inspected.includes(id)?s.inspected:[...s.inspected,id],solved:[...s.solved,id]}}
}
export function caseTaskIntegrity():string[]{
 const errors:string[]=[]
 const source=new Map(EVIDENCE_RECORDS.map(r=>[r.id,r]))
 for(const id of OTHER_RECORD_IDS){
  const task=CASE_EVIDENCE_TASKS[id]
  const record=source.get(id)
  if(!record||!task){errors.push(id+' missing');continue}
  if(record.room!==task.room||record.required===Boolean(task.optional))errors.push(id+' source mismatch')
  if(task.fields.length<(task.optional?1:2))errors.push(id+' lacks causal interaction')
  if(new Set(task.fields.map(f=>f.key)).size!==task.fields.length)errors.push(id+' duplicate answer field')
  for(const req of task.requires)if(req.slice(0,3)!==id.slice(0,3)||req===id)errors.push(id+' invalid prerequisite '+req)
 }
 return errors
}
