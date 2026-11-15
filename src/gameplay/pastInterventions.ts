import type {ArchiveCaseId} from '../archive/evidenceRecords'
import {PAST_STAGES,type PastRoomId} from './pastTimeline'
import {ALTERNATE_PLANS} from './pastInterventionAlternatives'

/** Fictional engineering interventions, learned from the cases, not inventory items.
 * No quiz, numerical input, or dependence on any particular evidence document.
 * One real system intervention per Past room; reconfigure it as often as desired.
 */
export type InterventionOption={
 id:string; action:string; consequence:string; readout:string; restores:boolean
}
export type InterventionStage={
 system:string; objectId:string; condition:string; tradeoff:string;
 options:readonly InterventionOption[]
}
export const INTERVENTIONS:Record<ArchiveCaseId,Record<PastRoomId,InterventionStage>>={
 KES:{
  manufacturing:{system:'Spacecraft architecture',objectId:'materials_structure',
   condition:'Original concept: 1,010 kg against a 900 kg planning limit; 690 W against 600 W. Proposed cost $278m vs $240m envelope.',
   tradeoff:'Reducing secondary instrumentation and selecting a flight-qualified, lower-cost structure preserves the primary detection science but sacrifices follow-up detail. Final mass and supplier cost require review.',
   options:[
    {id:'retain',action:'Retain the full science package while trimming structural margin',consequence:'The spacecraft still exceeds the documented mass, power and cost limits. The launcher cannot accept this plan.',readout:'MASS / POWER / COST: OVER LIMIT',restores:false},
    {id:'descope',action:'Remove secondary imager; select lower-cost qualified structure',consequence:'The revised concept protects primary science and reduces resource pressure. Qualification and refreshed cost/mass estimates remain part of the review.',readout:'CONFIGURATION: REVISED · DESIGN GATE OPEN',restores:true},
   ]},
  mission_target:{system:'Science priorities',objectId:'scientific_priorities',
   condition:'Primary science is event detection and spectra. High-resolution multiband follow-up is a secondary goal.',
   tradeoff:'A reduced payload gives up optional image detail. The core science priority must stay intact.',
   options:[
    {id:'full',action:'Maintain maximum imaging capability using reduced operations time',consequence:'The full science wishlist restores the same size and power problems. The rescue concept loses feasibility.',readout:'SCIENCE SCOPE: UNREALISTIC',restores:false},
    {id:'priority',action:'Protect event detection; defer high-resolution follow-up',consequence:'The core mission objective survives. The lost secondary capability is recorded transparently.',readout:'SCIENCE: PRIMARY GOALS PROTECTED',restores:true},
   ]},
  data_analysis:{system:'Feasibility review',objectId:'analysis_console',
   condition:'The prior transition stamp had no credible full resource or alternate-window analysis attached.',
   tradeoff:'A genuine systems review takes time and can halt a preferred schedule.',
   options:[
    {id:'stamp',action:'Fast-track the design review using the previous resource analysis',consequence:'A signature does not reduce mass, power or cost and cannot verify a new launcher window.',readout:'VERIFICATION: MISSING',restores:false},
    {id:'rebaseline',action:'Recalculate mass, power and budget against revised design',consequence:'The simulated plan now has an auditable conditional feasibility review. No invented exact new supplier quote is treated as final.',readout:'VERIFICATION: CONDITIONAL REVIEW',restores:true},
   ]},
  resources_review:{system:'Procurement and launch plan',objectId:'resource_allocation',
   condition:'The preferred launcher slot is unavailable and the old $278m estimate exceeds the $240m fictional envelope.',
   tradeoff:'A qualified cheaper structure and a new launch study can reduce pressure, but cause rescheduling and a new review.',
   options:[
    {id:'oldslot',action:'Negotiate an extension of the preferred launch allocation',consequence:'No launch allocation exists. An approval stamp cannot create one or make the budget feasible.',readout:'LAUNCH: NO ALLOCATION',restores:false},
    {id:'replan',action:'Request qualified lower-cost procurement and new launch allocation',consequence:'The design is replanned against a different fictional window and procurement baseline; schedule and final quoted costs remain conditional.',readout:'PLAN: REBASELINED · CONDITIONAL',restores:true},
   ]},
 },
 NAD:{
  manufacturing:{system:'Impulse export adapter',objectId:'motors_energy',
   condition:'The attitude-control producer exports 12 lbf·s while the navigation parser assumes the same numeral is 12 N·s.',
   tradeoff:'Changing the interface requires a controlled software revision and retesting both ends.',
   options:[
    {id:'raw',action:'Correct the navigation display label without changing the interface packet',consequence:'The consumer still uses the wrong physical impulse. The two predicted trajectories remain inconsistent.',readout:'INTERFACE: UNIT MISMATCH',restores:false},
    {id:'convert',action:'Convert at producer to N·s and tag the units',consequence:'The consumer receives approximately 53 N·s with explicit metadata. The numerical mismatch is removed in the fictional interface.',readout:'INTERFACE: UNITS CONSISTENT',restores:true},
   ]},
  mission_target:{system:'Interface agreement',objectId:'mission_constraints',
   condition:'The interface document omits the canonical unit and conversion owner.',
   tradeoff:'Owning an interface conversion adds documentation but prevents two systems from silently interpreting different units.',
   options:[
    {id:'assume',action:'Document the conversion agreement only in team meeting notes',consequence:'The ambiguity can recur even if this one value is corrected.',readout:'CONFIGURATION: AMBIGUOUS',restores:false},
    {id:'document',action:'Revise the contract with units, owner and version',consequence:'Both teams now share a versioned N·s convention and an accountable converter.',readout:'INTERFACE CONTROL: REVISION LOGGED',restores:true},
   ]},
  data_analysis:{system:'Navigation simulator',objectId:'analysis_console',
   condition:'The anomaly was closed before any independently reproduced trajectory rerun.',
   tradeoff:'The team must spend time rerunning the model rather than accepting a meeting explanation.',
   options:[
    {id:'reuse',action:'Replot the saved trajectory with a revised unit annotation',consequence:'The trajectory discrepancy remains unresolved; a meeting stamp is not simulation evidence.',readout:'TRAJECTORIES: DIVERGE',restores:false},
    {id:'rerun',action:'Rerun navigation with corrected impulse interface',consequence:'Independent fictional trajectories converge under the revised units and configuration.',readout:'TRAJECTORIES: RECONCILED',restores:true},
   ]},
  resources_review:{system:'Engineering release',objectId:'personnel_roles',
   condition:'Ticket NAV-042 was closed with no evidence attachment or reproduced simulation.',
   tradeoff:'Independent review delays closure but gives the mission a defensible engineering decision.',
   options:[
    {id:'verbal',action:'Sign off after a joint technical briefing without a new rerun',consequence:'The original weak process repeats; no independently reproducible evidence is attached.',readout:'RELEASE: UNSUPPORTED',restores:false},
    {id:'sign',action:'Attach the rerun and require independent sign-off',consequence:'The corrected interface and fresh trajectory record accompany a reviewed fictional release.',readout:'RELEASE: CHECKED AND TRACEABLE',restores:true},
   ]},
 },
 LUM:{
  manufacturing:{system:'Optical fixture',objectId:'materials_structure',
   condition:'The as-built calibration fixture is set to 100.8 mm; its fictional approved reference is 100.0 mm.',
   tradeoff:'Resetting and recalibrating the fixture takes time but prevents a mechanical offset being hidden in software.',
   options:[
    {id:'offset',action:'Use software calibration to compensate for the existing fixture',consequence:'The physical mismatch remains and will distort the unmasked optical test.',readout:'FIXTURE: OFFSET PRESENT',restores:false},
    {id:'reset',action:'Restore 100.0 mm reference and recalibrate',consequence:'The test fixture matches the approved fictional drawing before independent inspection.',readout:'FIXTURE: CALIBRATED',restores:true},
   ]},
  mission_target:{system:'Optical acceptance policy',objectId:'mission_constraints',
   condition:'The inspection was stamped PASS using a nominal export, not the observed raw measurement.',
   tradeoff:'Rejecting the convenient nominal PASS can delay the mission, but protects credible science.',
   options:[
    {id:'nominal',action:'Issue preliminary optical acceptance from compensated measurements',consequence:'The masked configuration can conceal the underlying optical error.',readout:'ACCEPTANCE: MASKED',restores:false},
    {id:'raw',action:'Require raw metrology and turn off compensation',consequence:'The acceptance decision is tied to the actual corrected setup, not the old compensated number.',readout:'ACCEPTANCE: RAW TRACE REQUIRED',restores:true},
   ]},
  data_analysis:{system:'Optical star-test replay',objectId:'analysis_console',
   condition:'No independent uncorrected optical end-to-end test was archived.',
   tradeoff:'A full retest uses more laboratory time; no unprovided real flight tolerance can be invented.',
   options:[
    {id:'export',action:'Average several compensated optical images to improve the report',consequence:'The simulated blur is still hidden and independent image-quality evidence is missing.',readout:'OPTICS: UNVERIFIED',restores:false},
    {id:'repeat',action:'Run a fresh unmasked optical comparison',consequence:'The corrected fixture yields a tighter fictional star image. Flight qualification remains conditional on defined tolerance.',readout:'OPTICS: RETEST RECORDED',restores:true},
   ]},
  resources_review:{system:'Quality-release record',objectId:'personnel_roles',
   condition:'An exception waived raw-data inspection and no independent metrology review was attached.',
   tradeoff:'Documenting the raw measurement and qualifications creates honest, conditional release boundaries.',
   options:[
    {id:'waive',action:'Grant conditional QA release using the earlier inspection summary',consequence:'An unsupported PASS continues to misrepresent the optical risk.',readout:'QA: WAIVER UNRESOLVED',restores:false},
    {id:'review',action:'Reopen QA; attach raw checks and conditional review',consequence:'An independent reviewer records both the corrected fixture and the outstanding certification boundary.',readout:'QA: TRACEABLE / CONDITIONAL',restores:true},
   ]},
 },
 ORI:{
  manufacturing:{system:'Touchdown signal input',objectId:'motors_energy',
   condition:'An 80 ms leg-deployment pulse at 40 m altitude was mistaken for stable surface contact.',
   tradeoff:'Filtering and corroboration must not suppress a legitimate touchdown signal.',
   options:[
    {id:'single',action:'Increase contact debounce while retaining single-sensor cutoff',consequence:'The same short deployment transient can stop the descent engine in midair.',readout:'ENGINE CUTOFF: UNSAFE',restores:false},
    {id:'filter',action:'Require sustained contact plus independent confirmation',consequence:'The short simulated pulse no longer directly commands engine shutdown.',readout:'CONTACT INPUT: FILTERED',restores:true},
   ]},
  mission_target:{system:'Descent autonomy',objectId:'mission_constraints',
   condition:'The current code trusts a single flag; Earth cannot intervene instantly during a distant landing.',
   tradeoff:'An onboard fallback is required if one sensor disagrees or fails.',
   options:[
    {id:'ground',action:'Ask ground control to confirm each final touchdown indication',consequence:'The communication delay means the decision arrives too late to safely manage terminal descent.',readout:'AUTONOMY: DELAY EXCEEDED',restores:false},
    {id:'onboard',action:'Combine radar, velocity and contact checks onboard',consequence:'The autonomous guard can postpone cutoff until independent readings agree.',readout:'AUTONOMY: CORROBORATED',restores:true},
   ]},
  data_analysis:{system:'Landing event replay',objectId:'dataset_viewer',
   condition:'The 80 ms transient and a valid touchdown were not jointly covered by the original test.',
   tradeoff:'A valid design must reject spurious signals while still completing the real landing.',
   options:[
    {id:'nominal',action:'Extend nominal descent replay with general sensor noise',consequence:'The edge case that caused the failure has still never been exercised.',readout:'TEST COVERAGE: INCOMPLETE',restores:false},
    {id:'both',action:'Replay leg pulse, actual contact and missing-sensor cases',consequence:'The fictional replay keeps engines on during the early pulse and validates bounded fault handling.',readout:'REPLAY: SAFER DESCENT',restores:true},
   ]},
  resources_review:{system:'Onboard flight review',objectId:'personnel_roles',
   condition:'The transient test ticket was deferred and the launch-ready status hid missing coverage.',
   tradeoff:'Reopening a test extends the schedule but prevents an untested autonomy rule from shipping.',
   options:[
    {id:'defer',action:'Approve the software simulation and defer physical fault tests',consequence:'The unsafe transition can return in flight.',readout:'FLIGHT GATE: UNVERIFIED',restores:false},
    {id:'approve',action:'Run independent onboard test and document the fallback',consequence:'The fictional landing logic has an auditable conditional safety review before the descent.',readout:'FLIGHT GATE: CONDITIONAL CLEARANCE',restores:true},
   ]},
 },
 AST:{
  manufacturing:{system:'Instrument power scheduling',objectId:'motors_energy',
   condition:'Simultaneous high-draw instruments and a heater produced a fictional 520 W peak above the 480 W cap.',
   tradeoff:'Staggering instrument modes reduces concurrent science observations, but protects the power bus.',
   options:[
    {id:'parallel',action:'Reschedule heater duty while retaining overlapping instrument peaks',consequence:'The measured fictional peak remains 520 W and exceeds the design cap.',readout:'POWER BUS: 520 W / OVER CAP',restores:false},
    {id:'stagger',action:'Stagger heater and high-draw instrument duty cycles',consequence:'The revised simulated schedule targets 450 W, with a documented reduction in parallel observation time.',readout:'POWER PLAN: 450 W / MODEL TARGET',restores:true},
   ]},
  mission_target:{system:'Science operations trade',objectId:'mission_constraints',
   condition:'The science baseline promised simultaneous operation that the available power cannot sustain.',
   tradeoff:'Accepting reduced simultaneous observations preserves system margin while reducing science duty.',
   options:[
    {id:'unchanged',action:'Preserve full science concurrency but shorten the observation windows',consequence:'The original high power spike returns and the program review remains unresolved.',readout:'MISSION PLAN: EXCEEDS CAP',restores:false},
    {id:'rephase',action:'Revise observation plan to support scheduled modes',consequence:'The fictional concept reflects the reduced exposure cadence instead of concealing the trade.',readout:'SCIENCE BASELINE: REVISED',restores:true},
   ]},
  data_analysis:{system:'Thermal-vac power replay',objectId:'analysis_console',
   condition:'Original prediction 430 W underestimated the measured 520 W peak. The revised design targets 450 W.',
   tradeoff:'Only an independent test of the exact revised mode can support a new power claim.',
   options:[
    {id:'forecast',action:'Recalculate the power forecast with revised assumptions alone',consequence:'The measured anomaly is ignored; the unsupported PASS stamp would be repeated.',readout:'POWER REVIEW: NOT REPRODUCED',restores:false},
    {id:'test',action:'Repeat the staged-mode power trace independently',consequence:'The fictional retest records 450 W, under the 460 W review target; this is not flight telemetry.',readout:'POWER RETEST: 450 W / CONDITIONAL',restores:true},
   ]},
  resources_review:{system:'Power risk and audit trail',objectId:'resource_allocation',
   condition:'The risk register was edited after review; its original attached raw trace was removed.',
   tradeoff:'The launch plan cannot hide a previous anomaly even after design correction.',
   options:[
    {id:'erase',action:'Replace the missing raw trace with a signed risk summary',consequence:'There is still no trustworthy chain from the old failure to the corrected operating mode.',readout:'AUDIT: BROKEN',restores:false},
    {id:'reopen',action:'Restore the version trail and require conditional sign-off',consequence:'The raw anomaly, independent 450 W retest and reduced-duty plan are all documented.',readout:'AUDIT: RESTORED · CONDITIONALLY CLEARED',restores:true},
   ]},
 },
}
export type InterventionChoices=Partial<Record<PastRoomId,string>>
export type PlanIssue={room:PastRoomId;message:string}
export function interventionFor(caseId:ArchiveCaseId,room:PastRoomId):InterventionStage{
 const base=INTERVENTIONS[caseId][room]
 return {...base,options:[...base.options,...ALTERNATE_PLANS[caseId][room]]}
}
export function isStageStable(caseId:ArchiveCaseId,room:PastRoomId,optionId:string|undefined):boolean{
 const found=interventionFor(caseId,room).options.find(x=>x.id===optionId)
 return found?.restores===true
}
export function countConfiguredStages(choices:InterventionChoices):number{
 return PAST_STAGES.filter(stage=>typeof choices[stage.id]==='string').length
}
/** Assess the entire mission instead of marking choices right/wrong as they are
 * clicked. Two or more approaches can work in each system. Plans can also be
 * incompatible across rooms, e.g., documenting the wrong conversion owner.
 */
export function evaluateRepairPlan(caseId:ArchiveCaseId,choices:InterventionChoices):PlanIssue[]{
 const issues:PlanIssue[]=[]
 for(const stage of PAST_STAGES){
  if(!choices[stage.id])issues.push({room:stage.id,message:'This system has not been configured yet.'})
  else if(!isStageStable(caseId,stage.id,choices[stage.id])){
   issues.push({room:stage.id,message:'The current configuration still leaves a documented engineering risk unresolved.'})
  }
 }
 if(caseId==='NAD'&&choices.manufacturing==='receiver'&&choices.mission_target==='document'){
  issues.push({room:'mission_target',message:'The contract assigns conversion to the producer, but the installed adapter converts at the receiver. Align ownership and schema before release.'})
 }
 return issues
}
export function allStagesStable(caseId:ArchiveCaseId,choices:InterventionChoices):boolean{
 return evaluateRepairPlan(caseId,choices).length===0
}
export function stableStageCount(caseId:ArchiveCaseId,choices:InterventionChoices):number{
 return PAST_STAGES.filter(s=>isStageStable(caseId,s.id,choices[s.id])).length
}
