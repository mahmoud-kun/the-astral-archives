import { EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'

export type NadirRecord = 'NAD-01'|'NAD-02'|'NAD-03'|'NAD-04'|'NAD-05'|'NAD-06'|'NAD-07'|'NAD-08'
export type StationId = 'investigation'|'signal'|'archive'|'recordings'
export const NADIR_SAVE_KEY = 'astral-nadir-investigation-v1'
export const NADIR_PROGRESS_EVENT = 'astral:nadir-save-change'
export const ARCHIVE_PROGRESS_EVENT = 'astral:archive-save-change'

export interface NadirProgress {
  version: 1
  inspected: NadirRecord[]
  solved: NadirRecord[]
  attempts: Partial<Record<NadirRecord,number>>
  hints: Partial<Record<NadirRecord,number>>
  rescue: {submitted:boolean; rerunPassed:boolean}
}
export const NADIR_IDS: readonly NadirRecord[] = ['NAD-01','NAD-02','NAD-03','NAD-04','NAD-05','NAD-06','NAD-07','NAD-08']
export const REQUIRED_NADIR: readonly NadirRecord[] = ['NAD-01','NAD-02','NAD-03','NAD-04','NAD-05','NAD-06']
export const NADIR_ROOM: Record<NadirRecord,StationId> = {
  'NAD-01':'signal','NAD-02':'signal','NAD-03':'archive','NAD-04':'archive',
  'NAD-05':'recordings','NAD-06':'investigation','NAD-07':'recordings','NAD-08':'archive',
}
export type NadirAnswer = Record<string,string>
export type NadirChallenge = {
  id:NadirRecord
  discipline:string
  objective:string
  fragments: readonly string[]
  fields: readonly {key:string;label:string;type:'select'|'number';choices?:readonly {value:string;label:string}[];placeholder?:string}[]
  clues: readonly [string,string]
  requires: readonly NadirRecord[]
}
const options = (items:readonly [string,string][]) => items.map(([value,label])=>({value,label}))
export const NADIR_CHALLENGES: Record<NadirRecord,NadirChallenge> = {
 'NAD-06': {
    id:'NAD-06',discipline:'AUDIT / INVESTIGATION ROOM',
    objective:'Audit the closed NAV-042 ticket. Identify BOTH conditions that make its verification claim unsupported.',
    fragments:['Ticket NAV-042 / State: CLOSED / Resolution: verbally verified at meeting','Rerun attachment count: 0 / Reproduced navigation simulation: NO','A transition stamp nevertheless reads VERIFICATION COMPLETE.'],
    requires:[],clues:['A closed status is a workflow state, not a scientific measurement.','Look for the evidence required to reproduce the closure claim.'],
    fields:[
      {key:'proof',label:'Which proof is missing?',type:'select',choices:options([['','Inspect record'],['rerun','A documented rerun and its output'],['signature','An additional handwritten signature'],['photo','A photograph of the meeting']])},
      {key:'risk',label:'What does the stamp establish?',type:'select',choices:options([['','Select inference'],['verified','The discrepancy was independently reproduced and cleared'],['administrative','Only an administrative closure; the technical discrepancy remains open'],['hardware','A physical thruster failure was confirmed']])},
    ],
 },
 'NAD-02': {
    id:'NAD-02',discipline:'IMPULSE CONVERSION / SIGNAL ROOM',
    objective:'Reconstruct the units at the interface, then calculate the correct SI impulse BEFORE comparing the trajectories.',
    fragments:['Export 0038: source_value = 12; source_unit = lbf·s','Navigation parser: consumer_value = 12; assumed_unit = N·s','Reference: 1 pound-force = 4.448221615 newtons. Impulse = force × time.'],
    requires:[],clues:['Convert the force unit, leaving the time unit unchanged.','Multiply the source numeral by 4.448221615, then keep the impulse dimension.'],
    fields:[
      {key:'source',label:'Producer unit',type:'select',choices:options([['','Select source'],['lbfs','lbf·s'],['ns','N·s'],['n','N']])},
      {key:'target',label:'Canonical consumer unit',type:'select',choices:options([['','Select target'],['lbfs','lbf·s'],['ns','N·s'],['n','N']])},
      {key:'converted',label:'Correct conversion (N·s; ±0.02 tolerance)',type:'number',placeholder:'e.g. 0.00'},
    ],
 },
 'NAD-01': {
    id:'NAD-01',discipline:'TRAJECTORY RECONCILIATION / SIGNAL ROOM',
    objective:'Overlay both simulated navigation tracks and determine why they diverged. Submit a corrected impulse model.',
    fragments:['Ground model A and spacecraft model B receive the same numeric impulse, but disagree about its unit.','The mismatch persists until the interface is reconciled and the models are rerun.','The following track sketch is schematic, not real mission telemetry.'],
    requires:['NAD-02'],clues:['The same numeral can represent different physical quantities when units differ.','Use the corrected SI value from Export 0038, not the unconverted numeral.'],
    fields:[
      {key:'hypothesis',label:'Strongest explanation for the divergence',type:'select',choices:options([['','Form a hypothesis'],['units','Producer/consumer impulse-unit mismatch'],['thruster','Confirmed mechanical thruster failure'],['tampering','Edited raw source values']])},
      {key:'rerun',label:'Impulse supplied to corrected model (N·s)',type:'number',placeholder:'Recomputed impulse'},
      {key:'comparison',label:'What makes this a valid comparison?',type:'select',choices:options([['','Select verification'],['same','Both models use the same physically converted impulse'],['timestamp','Only the launch timestamp was changed'],['original','Both models receive the number 12 unchanged']])},
    ],
 },
 'NAD-04': {
    id:'NAD-04',discipline:'SOFTWARE TRACE / ARCHIVE ROOM',
    objective:'Trace the producer → interface → consumer chain. Identify which boundary violates the contract.',
    fragments:['Producer V3 emits attitude impulse values in lbf·s.','Navigation parser V2 assumes incoming values are N·s.','The source export log contains no evidence that its input values were altered.'],
    requires:[],clues:['Do not mistake a conversion failure for deliberate data tampering.','The mismatch is at the interface boundary, not the spacecraft thruster.'],
    fields:[
      {key:'producer',label:'Actual producer units',type:'select',choices:options([['','Read source log'],['lbfs','lbf·s'],['ns','N·s']])},
      {key:'consumer',label:'Consumer parser expectation',type:'select',choices:options([['','Read parser note'],['lbfs','lbf·s'],['ns','N·s']])},
      {key:'failure',label:'Root failure category',type:'select',choices:options([['','Choose category'],['contract','Unspecified interface conversion contract'],['tamper','Evidence of input falsification'],['fuel','Insufficient propellant']])},
    ],
 },
 'NAD-03': {
    id:'NAD-03',discipline:'INTERFACE CONTROL / ARCHIVE ROOM',
    objective:'Repair ICD-07 revision B: specify a canonical unit, assign conversion ownership and an independent acceptance test.',
    fragments:['ICD-07 Rev B / attitude_impulse / UNIT_CONVENTION: [blank]','CONVERSION_OWNER: [blank] / No documented conversion acceptance test','The exporter and parser must agree on a unit contract before navigation release.'],
    requires:['NAD-04'],clues:['Avoid an undocumented conversion on both sides; name a single owner.','Use SI at the navigation interface, require the producer to convert and include a parser-level rerun check.'],
    fields:[
      {key:'canonical',label:'Unit specified in ICD-07',type:'select',choices:options([['','Define interface'],['ns','N·s'],['n','N'],['lbfs','lbf·s']])},
      {key:'owner',label:'Who converts before transmission?',type:'select',choices:options([['','Assign owner'],['producer','Producer/export adapter'],['both','Both teams independently on every message'],['none','No owner; numerical values are unitless']])},
      {key:'verification',label:'Release verification procedure',type:'select',choices:options([['','Specify test'],['rerun','Automated unit check and corrected navigation rerun'],['meeting','Verbal confirmation at meeting'],['skip','Approve without another test']])},
    ],
 },
 'NAD-05': {
    id:'NAD-05',discipline:'REVIEW CHRONOLOGY / RECORDINGS ROOM',
    objective:'Use the escalation email and ticket evidence to reconstruct the causal order. Do not confuse recorded warnings with later approval.',
    fragments:['An engineering discrepancy was observed in navigation results.','A navigation engineer requested a units cross-check and rerun BEFORE the closure approval.','NAV-042 was then closed as verbally verified, with zero rerun attachments.'],
    requires:['NAD-06'],clues:['Escalation is not the same as a completed verification.','Export → observed residual → cross-check request → administrative closure.'],
    fields:[
      {key:'first',label:'Event 1',type:'select',choices:options([['','Reconstruct event'],['export','Producer impulse export'],['residual','Navigation residual observed'],['email','Cross-check requested'],['closure','Ticket marked closed']])},
      {key:'second',label:'Event 2',type:'select',choices:options([['','Reconstruct event'],['export','Producer impulse export'],['residual','Navigation residual observed'],['email','Cross-check requested'],['closure','Ticket marked closed']])},
      {key:'third',label:'Event 3',type:'select',choices:options([['','Reconstruct event'],['export','Producer impulse export'],['residual','Navigation residual observed'],['email','Cross-check requested'],['closure','Ticket marked closed']])},
      {key:'fourth',label:'Event 4',type:'select',choices:options([['','Reconstruct event'],['export','Producer impulse export'],['residual','Navigation residual observed'],['email','Cross-check requested'],['closure','Ticket marked closed']])},
    ],
 },
 'NAD-07': {
   id:'NAD-07',discipline:'SUBJECTIVE MEMORY / RECORDINGS ROOM',
   objective:'Review a memory fragment; separate witness impression from verified technical evidence.',
   fragments:['An unidentified voice says the discrepancy can be explained later.','The clip does not establish the speaker identity, intent, or a completed rerun.'],
   requires:[],clues:['A memory is not an auditable test artifact.','Treat uncorroborated recollections as leads, not proof.'],
   fields:[{key:'status',label:'Evidentiary status',type:'select',choices:options([['','Assess reliability'],['lead','Investigative lead; requires independent corroboration'],['proof','Verified proof of sabotage'],['test','Independent navigation rerun artifact']])}],
 },
 'NAD-08': {
   id:'NAD-08',discipline:'UNITS REFERENCE / ARCHIVE ROOM',
   objective:'Inspect the dimensional reference and connect it to the impulse field used by navigation.',
   fragments:['1 pound-force = 4.448221615 N.','Impulse = force × time.','Coordinate frames and epoch conventions are additional independent interface controls.'],
   requires:[],clues:['Impulse is not just force.','The time factor is seconds, producing N·s.'],
   fields:[{key:'dimension',label:'Impulse unit dimension',type:'select',choices:options([['','Classify quantity'],['ns','N·s'],['n','N'],['mps','m/s']])}],
 },
}
export function emptyNadir():NadirProgress {
 return {version:1,inspected:[],solved:[],attempts:{},hints:{},rescue:{submitted:false,rerunPassed:false}}
}
export function restoreNadir(raw:string|null):NadirProgress {
 if(!raw)return emptyNadir()
 try{
  const v:unknown=JSON.parse(raw)
  if(!v||typeof v!=='object'||!('version' in v)||v.version!==1)return emptyNadir()
  const d=v as Record<string,unknown>
  const isId=(x:unknown):x is NadirRecord=>typeof x==='string'&&NADIR_IDS.some(id=>id===x)
  const inspected=Array.isArray(d.inspected)?[...new Set(d.inspected.filter(isId))]:[]
  const solved=Array.isArray(d.solved)?[...new Set(d.solved.filter(isId))]:[]
  const attempts: NadirProgress['attempts']={}
  const hints: NadirProgress['hints']={}
  for(const k of NADIR_IDS){
   const a=(d.attempts as Record<string,unknown>|undefined)?.[k]
   const h=(d.hints as Record<string,unknown>|undefined)?.[k]
   if(typeof a==='number'&&Number.isInteger(a)&&a>=0&&a<=10000)attempts[k]=a
   if(typeof h==='number'&&Number.isInteger(h)&&h>=0&&h<=2)hints[k]=h
  }
  const rawRescue=d.rescue as Record<string,unknown>|undefined
  return {version:1,inspected:[...new Set([...inspected,...solved])],solved,attempts,hints,
   rescue:{submitted:rawRescue?.submitted===true,rerunPassed:rawRescue?.rerunPassed===true}}
 }catch{return emptyNadir()}
}
export function inspectNadir(s:NadirProgress,id:NadirRecord):NadirProgress {
 return s.inspected.includes(id)?s:{...s,inspected:[...s.inspected,id]}
}
export function hintNadir(s:NadirProgress,id:NadirRecord):NadirProgress {
 return {...s,hints:{...s.hints,[id]:Math.min(2,(s.hints[id]??0)+1)}}
}
export function solveNadir(s:NadirProgress,id:NadirRecord,answer:NadirAnswer):{next:NadirProgress;ok:boolean;reason:string}{
 if(s.solved.includes(id))return {next:s,ok:true,reason:'Already analyzed. You can manually collect the record.'}
 if(!NADIR_CHALLENGES[id].requires.every(required=>s.solved.includes(required)))
  return {next:s,ok:false,reason:'Missing correlated evidence. Analyze the linked record before validating this hypothesis.'}
 const next={...s,attempts:{...s.attempts,[id]:(s.attempts[id]??0)+1}}
 const amount=(str:string)=>str.trim()===''?NaN:Number(str.replace(',','.'))
 const near=(str:string)=>Number.isFinite(amount(str))&&Math.abs(amount(str)-53.37865938)<=0.02
 const a=answer
 let valid=false
 switch(id){
 case 'NAD-06':valid=a.proof==='rerun'&&a.risk==='administrative';break
 case 'NAD-02':valid=a.source==='lbfs'&&a.target==='ns'&&near(a.converted??'');break
 case 'NAD-01':valid=a.hypothesis==='units'&&near(a.rerun??'')&&a.comparison==='same';break
 case 'NAD-04':valid=a.producer==='lbfs'&&a.consumer==='ns'&&a.failure==='contract';break
 case 'NAD-03':valid=a.canonical==='ns'&&a.owner==='producer'&&a.verification==='rerun';break
 case 'NAD-05':valid=a.first==='export'&&a.second==='residual'&&a.third==='email'&&a.fourth==='closure';break
 case 'NAD-07':valid=a.status==='lead';break
 case 'NAD-08':valid=a.dimension==='ns';break
 }
 return valid
 ? {next:{...next,inspected:[...new Set([...next.inspected,id])],solved:[...next.solved,id]},ok:true,reason:'Analysis verified. Evidence is now available for manual collection.'}
 : {next,ok:false,reason:'The chain does not reconcile with the available records. Review the units, sequence or verification requirement and try again.'}
}
export function isNadirRecord(id:string):id is NadirRecord{
 return NADIR_IDS.some(item=>item===id)&&EVIDENCE_RECORDS.some(e=>e.id===id)
}
export function stationRoute(station:StationId):string {
 return station==='investigation'?'/?room=1':'/?station='+station
}
export function stationLabel(station:StationId):string {
 return {investigation:'Investigation',archive:'Archive',signal:'Signal',recordings:'Recordings'}[station]
}
