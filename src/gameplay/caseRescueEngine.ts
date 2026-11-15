import { countRequiredEvidence, diagnosisIsSupported, type ArchiveState } from '../archive/archiveState.ts'
import { CASE_EVIDENCE_TASKS, REQUIRED_OTHER_IDS, type OtherCaseId, type OtherProgress } from './caseEvidenceEngine.ts'

/** Deterministic, explicitly FICTIONAL engineering training simulators.
 * Real-world launcher slots, flight tolerances, optical quality, and Vesper dynamics
 * are NOT inferred from the synthetic numbers below.
 */
export type RescueInputs=Record<string,string>
export type RescueInputField={
 key:string;label:string;kind:'select'|'number';options?:readonly (readonly [string,string])[]
 unit?:string
}
export type RescueReport={name:string;pass:boolean;detail:string}
export type RescueEvaluation={pass:boolean;reports:RescueReport[];outcome:string;artifactId:string}
export const CASE_RESCUE_COPY:Record<OtherCaseId,{
 title:string;scene:string;lead:string;phase:string;fields:readonly RescueInputField[]
 completion:string;limitations:string
}>={
 KES:{
  title:'REBUILD THE FLIGHT PLAN',scene:'ARCHITECTURE TRADE LAB',phase:'PRE-PHASE A / PHASE A',
  lead:'Do not fix the schedule on paper. Reassemble a mission that fits the available resources, then confront the science you lose.',
  fields:[
   {key:'architecture',label:'Spacecraft architecture',kind:'select',options:[['','Choose a configuration'],['original','Original / full instrument set'],['descope','Defer multi-band high-detail follow-up'],['heavy','Later heavy-launch / original payload']]},
   {key:'window',label:'Launcher and schedule card',kind:'select',options:[['','Choose a window'],['old','Keep the unavailable slot'],['replanned','Replanned window in the fictional scenario']]},
   {key:'slotEvidence',label:'Launch opportunity verification',kind:'select',options:[['','Review allocation'],['missing','Assume a slot from the old memo'],['verified','Attach new simulated allocation evidence']]},
   {key:'trajectory',label:'Alternative cruise path',kind:'select',options:[['','Review trajectory'],['unchecked','Reuse the old trajectory untested'],['recalculated','Run and archive a revised synthetic trajectory trade']]},
   {key:'science',label:'Science return',kind:'select',options:[['','Declare impact'],['hidden','Preserve full-science claim in brochure'],['acknowledged','Document loss of high-detail follow-up']]},
   {key:'decision',label:'Review board recommendation',kind:'select',options:[['','Choose a gate'],['proceed','Proceed as if nothing changed'],['conditional','Proceed with explicit new baseline and conditions'],['stop','Stop with no evaluated alternative']]},
  ],
  completion:'A smaller Kestrel concept can proceed conditionally in this alternate simulation—not under the original schedule. Primary event science remains; the reduced follow-up and replanned window are recorded.',
  limitations:'The simulated launcher allocation and cruise study are hypothetical artifacts. Flight certification and real-world launch availability have NOT been established.',
 },
 LUM:{
  title:'REBUILD THE MEASUREMENT CHAIN',scene:'OPTICAL CALIBRATION BENCH',phase:'PHASE C / D · PREFLIGHT BRANCH',
  lead:'Recreate the optical acceptance from raw measurements, not the signed nominal summary. Test without a compensating setup.',
  fields:[
   {key:'fixture',label:'Corrected calibration fixture (mm)',kind:'number',unit:'mm'},
   {key:'reference',label:'Reference instrument',kind:'select',options:[['','Choose metrology'],['old','Use previous CAL-2 offset'],['independent','Independent calibrated measurement and config snapshot']]},
   {key:'report',label:'Released test record',kind:'select',options:[['','Choose evidence'],['nominal','Copy drawing value as measured'],['raw','Attach actual as-built raw result and revision']]},
   {key:'compensation',label:'Optical test alignment compensation',kind:'select',options:[['','Choose test mode'],['enabled','Keep masking compensation enabled'],['disabled','Disable compensation and test uncorrected configuration']]},
   {key:'opticalTest',label:'End-to-end repeat',kind:'select',options:[['','Choose acceptance action'],['old','Reuse the earlier compensated PASS'],['independent','Execute an independent preflight optical repeat']]},
   {key:'decision',label:'Engineering disposition',kind:'select',options:[['','Choose a gate'],['flight','Declare certified flight-optical PASS'],['rework','Rework/retest; hold formal optical qualification until tolerance evidence exists'],['ignore','Leave inaccurate report in force']]},
  ],
  completion:'The training apparatus is remeasured at nominal and an uncompensated repeat is documented. Preflight rework is accepted; formal flight optical qualification is still OPEN.',
  limitations:'100.0 mm is a fictional setup target, not a full tolerance specification or proof of image quality. No numerical flight-level PSF threshold was supplied.',
 },
 ORI:{
  title:'REWRITE TOUCHDOWN AUTONOMY',scene:'DESCENT STATE MACHINE',phase:'PHASE D / E · PREFLIGHT ALTERNATIVE',
  lead:'Keep the engine running through spurious contact. Shut it down only at credible landing and handle a missing sensor without pretending Earth can intervene instantly.',
  fields:[
   {key:'debounce',label:'Persistence threshold (ms; synthetic tune)',kind:'number',unit:'ms'},
   {key:'contact',label:'Contact corroboration',kind:'select',options:[['','Select sensor logic'],['single','One leg-switch bit only'],['independent','Separate independent contact confirmation']]},
   {key:'altitude',label:'Radar altitude state',kind:'select',options:[['','Select state guard'],['none','Ignore independent altitude'],['near','Require near-surface compatible radar and descent state']]},
   {key:'fallback',label:'Late contact-sensor fault',kind:'select',options:[['','Select recovery'],['off','Stop descent engines immediately'],['forever','Run engines forever without a safety limit'],['recheck','Bounded onboard recheck and fault-management escalation']]},
   {key:'decision',label:'Flight-rule gate',kind:'select',options:[['','Choose a decision'],['old','Fly untested original logic'],['conditional','Use tested guarded software in preflight branch'],['earth','Depend on real-time ground joystick']]},
  ],
  completion:'The fictional touchdown guard rejects the 80 ms deployment pulse and the noisy switch, recognizes nominal landing, and routes a missing-sensor scenario into bounded onboard fault handling.',
  limitations:'300 ms is a fictional training candidate, not NASA flight software. Actual mission tuning needs sensor dynamics, velocity, thrust, and certified hazard analysis.',
 },
 AST:{
  title:'REOPEN THE POWER REVIEW',scene:'POWER & PROVENANCE BOARD',phase:'CURRENT PHASE B DEVELOPMENT / PDR',
  lead:'A signature cannot lower electrical load. Separate the original 520 W test from a genuinely repeated reduced-duty operating schedule.',
  fields:[
   {key:'mode',label:'Instrument duty cycle',kind:'select',options:[['','Choose power topology'],['parallel','Keep both high-draw modes concurrent'],['stagger','Stagger high-draw modes / reduced observation duty']]},
   {key:'retest',label:'Repeat test origin',kind:'select',options:[['','Select proof'],['draft','Use unsigned 450 W forecast'],['independent','Execute independent synthetic thermal-vac replay with configuration ID']]},
   {key:'risk',label:'Risk register correction',kind:'select',options:[['','Choose workflow'],['closed','Leave old unsupported CLOSED entry'],['reopened','Restore OPEN risk and original trace before new verification']]},
   {key:'audit',label:'Provenance control',kind:'select',options:[['','Choose audit standard'],['stamp','Use a diagonal stamp as proof'],['versioned','Preserve authenticated before/after version diff and reviewer access trail']]},
   {key:'baseline',label:'Program baseline',kind:'select',options:[['','Choose trade documentation'],['old','Retain former full-duty science plan'],['revised','Record reduced duty cycle, schedule impact, review owner']]},
   {key:'decision',label:'Review board gate',kind:'select',options:[['','Choose board disposition'],['unconditional','Proceed on the old stamp alone'],['conditional','Approve a conditioned and independently retested development baseline'],['accuse','Blame reviewer for every unrelated engineering defect']]},
  ],
  completion:'The current development project receives a reproducible ≤460 W simulated operating mode and a versioned review package. Reduced concurrent observing time is visible; past technical failures remain distinct from record tampering.',
  limitations:'Asterion approaches preliminary design review; it is NOT an operating observatory. The 450 W replay is a fictional test vector, not real spacecraft telemetry or flight signoff.',
 },
}

const row=(name:string,pass:boolean,detail:string):RescueReport=>({name,pass,detail})
const eq=(x:string|undefined,correct:string)=>x===correct
const finite=(x:string|undefined)=>typeof x==='string'&&x.trim().length>0&&Number.isFinite(Number(x))?Number(x):null

/** Test the actual engineering choice, not whether a player clicked a single success button. */
export function verifyOtherRescue(caseId:OtherCaseId,form:RescueInputs):RescueEvaluation{
 let reports:RescueReport[]=[]
 if(caseId==='KES'){
  const config=form.architecture==='descope'?{mass:890,power:590,cost:239,loss:true}:
   form.architecture==='heavy'?{mass:1010,power:690,cost:316,loss:false}:{mass:1010,power:690,cost:278,loss:false}
  reports=[
   row('PAYLOAD LIMIT',config.mass<=900,config.mass+' kg / 900 kg permitted'),
   row('POWER LIMIT',config.power<=600,config.power+' W / 600 W supplied'),
   row('COST ENVELOPE',config.cost<=240,'$'+config.cost+'m / $240m planning envelope'),
   row('LAUNCH AND CRUISE',eq(form.window,'replanned')&&eq(form.slotEvidence,'verified')&&eq(form.trajectory,'recalculated'),'Original slot unavailable; require a new simulated allocation AND trajectory trade'),
   row('DECLARED SCIENCE TRADE',config.loss&&eq(form.science,'acknowledged'),'Deferring secondary high-detail science must be disclosed; primary event science retained'),
   row('GATE RECOMMENDATION',eq(form.decision,'conditional'),'New baseline and launch studies require explicit conditional review'),
  ]
 }else if(caseId==='LUM'){
  const fixture=finite(form.fixture)
  reports=[
   row('BASELINE DISCREPANCY OBSERVED',true,'Original raw 100.8 mm − nominal 100.0 mm = +0.8 mm; earlier summary PASS unsupported'),
   row('CORRECTED CALIBRATION',fixture!==null&&Math.abs(fixture-100)<0.00001,'Corrected fictional fixture target 100.0 mm; independent reading needed'),
   row('INDEPENDENT METROLOGY',eq(form.reference,'independent'),'No reuse of the faulty CAL-2 offset; preserve independent sensor/config ID'),
   row('RAW REPORT TRACEABILITY',eq(form.report,'raw'),'Measured value, not nominal drawing, must populate the released report'),
   row('UNMASKED OPTICS TEST',eq(form.compensation,'disabled')&&eq(form.opticalTest,'independent'),'Repeat end-to-end preflight optical test without compensating alignment'),
   row('QUALIFICATION BOUNDARY',eq(form.decision,'rework'),'Do not declare flight PASS without a defined optical tolerance or measured image-quality criterion'),
  ]
 }else if(caseId==='ORI'){
  const debounce=finite(form.debounce)
  const independence=eq(form.contact,'independent')
  const altitudeGuard=eq(form.altitude,'near')
  const fallback=eq(form.fallback,'recheck')
  const simulate=(height:number,pulse:number,contact:boolean):'OFF'|'ON'|'RECHECK'=>{
   if(debounce===null||!Number.isFinite(debounce))return 'ON'
   if(height===0&&independence&&altitudeGuard&&contact&&pulse>=debounce)return 'OFF'
   if(height===0&&contact&&fallback)return 'RECHECK'
   return 'ON'
  }
  const v=[
   {name:'LEG DEPLOY / 40 m / 80 ms',got:simulate(40,80,false),want:'ON'},
   {name:'NOMINAL TOUCHDOWN / 0 m / 450 ms',got:simulate(0,450,true),want:'OFF'},
   {name:'NOISY LEG SWITCH / 25 m / 140 ms',got:simulate(25,140,false),want:'ON'},
   {name:'LATE SENSOR FAULT / 0 m / 0 ms',got:simulate(0,0,true),want:'RECHECK'},
  ] as const
  reports=[
   row('PROVISIONAL PERSISTENCE',debounce!==null&&debounce>=300&&debounce<=450,'Synthetic design candidate 300–450 ms; not a certified flight threshold'),
   row('INDEPENDENT CONTACT + RADAR',independence&&altitudeGuard,'Touchdown is not one raw HIGH bit; corroboration is mandatory'),
   row('FAULT MANAGEMENT',fallback,'Missing late contact -> bounded onboard RECHECK; no unbounded engine hold'),
   ...v.map(s=>row(s.name,s.got===s.want,'Simulated: '+s.got+' / required: '+s.want)),
   row('PRE-FLIGHT VERIFICATION',eq(form.decision,'conditional'),'No instantaneous remote intervention during distant terminal descent'),
  ]
 }else{
  const actual=form.mode==='stagger'?450:520
  reports=[
   row('ORIGINAL ANOMALY RECONCILED',true,'Old observed 520 W / 480 W cap = +40 W; old prediction 430 W was 90 W low'),
   row('CONTROLLED OPERATING MODE',eq(form.mode,'stagger'),'Fictional simulation replay: '+actual+' W; target ≤460 W, cap 480 W'),
   row('SIGNED INDEPENDENT REPLAY',eq(form.mode,'stagger')&&eq(form.retest,'independent')&&actual<=460,'Test record binds mode schedule and measured replay to a versioned config'),
   row('REOPEN UNSUPPORTED CLOSURE',eq(form.risk,'reopened'),'Prior CLOSED stamp lacks independent proof and must not be trusted'),
   row('SIGNED VERSION PROVENANCE',eq(form.audit,'versioned'),'Record manipulation proven separately from the engineering cause'),
   row('SCIENCE + SCHEDULE TRADE',eq(form.baseline,'revised'),'Reduced parallel observation duty and review owner acknowledged'),
   row('PHASE B GATE',eq(form.decision,'conditional'),'Current design program, NOT in-orbit Phase E operations'),
  ]
 }
 return {pass:reports.every(r=>r.pass),reports,outcome:CASE_RESCUE_COPY[caseId].completion,artifactId:caseId+'-ALT-SIM-R01'}
}
/** A restored plan is not a bypass: it must pass fresh engineering verification, all evidence
 * investigations, correct filing, and an evidence-cited submitted diagnosis.
 */
export function otherRescueCompleted(archive:ArchiveState,progress:OtherProgress,caseId:OtherCaseId):boolean{
 const plan=progress.verifiedPlans[caseId]
 return countRequiredEvidence(archive,caseId)===6&&diagnosisIsSupported(archive,caseId)&&
  REQUIRED_OTHER_IDS.filter(id=>id.startsWith(caseId+'-')).every(id=>progress.solved.includes(id))&&
  !!plan&&verifyOtherRescue(caseId,plan).pass
}
export function recordVerifiedRescue(progress:OtherProgress,caseId:OtherCaseId,plan:RescueInputs):OtherProgress{
 if(!verifyOtherRescue(caseId,plan).pass)return progress
 return {...progress,verifiedPlans:{...progress.verifiedPlans,[caseId]:{...plan}}}
}
