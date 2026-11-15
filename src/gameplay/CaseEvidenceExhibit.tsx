import { useState } from 'react'
import type { OtherRecordId, CaseAnswer } from './caseEvidenceEngine'
import CaseInstrument from './CaseInstrument'

/** Evidence is a scene action, not a dump of the primary production-bible copy.
 * Interpretations still require the independent solver in caseEvidenceEngine.ts.
 */
type ExhibitPair={left:string;right:string;leftValue:string;rightValue:string}
const comparisons:Partial<Record<OtherRecordId,ExhibitPair>>={
 'KES-06':{left:'ORIGINAL LAUNCH NOTICE',leftValue:'PREFERRED SLOT UNAVAILABLE',right:'SIGNED TRANSITION COPY',rightValue:'NO MISSION IMPACT'},
 'LUM-04':{left:'RAW METROLOGY · MET-141',leftValue:'100.8 mm MEASURED',right:'RELEASED REPORT',rightValue:'100.0 mm PRINTED'},
 'LUM-06':{left:'RAW CHECK STATUS',leftValue:'INDEPENDENT REVIEW MISSING',right:'EXCEPTION WAIVER',rightValue:'SUMMARY-ONLY ACCEPTED'},
 'AST-01':{left:'ENGINEERING OWNER NOTE',leftValue:'POWER PEAK UNRESOLVED',right:'RISK REGISTER',rightValue:'CLOSED / NO ATTACHMENT'},
 'AST-03':{left:'PRE-REVIEW REVISION',leftValue:'OPEN / TRACE LINK PRESENT',right:'POST-REVIEW REVISION',rightValue:'CLOSED / TRACE LINK REMOVED'},
 'AST-04':{left:'FOUR DISTINCT TECHNICAL INCIDENTS',leftValue:'LAUNCH / UNITS / OPTICS / LANDING',right:'COMMON PROCESS PATTERN',rightValue:'WARNINGS MARKED AS CLOSED'},
}
const audio:Partial<Record<OtherRecordId,{who:string;before:string;after:string}>>={
 'KES-05':{who:'LAUNCH ANALYST / REVIEW AUDIO TRANSCRIPT',before:'WARNING: ALTERNATE CRUISE STUDY NEEDED',after:'LATER: TRANSITION STAMP APPROVED'},
 'KES-07':{who:'SUBJECTIVE LAUNCH-CHART MEMORY',before:'RED AVAILABILITY CELL REMEMBERED',after:'SPEAKER ID UNVERIFIED'},
 'LUM-07':{who:'SUBJECTIVE LAB MEMORY',before:'RAW FILE REQUESTED',after:'UNVERIFIED VOICE: USE CERTIFIED EXPORT'},
 'ORI-07':{who:'BUFFERED OPERATIONS TRANSCRIPT',before:'ONBOARD DESCENT SEQUENCE COMPLETED',after:'GROUND RECEIVES CONTRADICTORY DATA'},
 'ORI-08':{who:'SUBJECTIVE TEST-LAB MEMORY',before:'DEPLOYMENT PULSE DISCUSSED',after:'ACTUAL TEST RESULT NOT SHOWN'},
 'AST-05':{who:'ENGINEERING DISSENT RECORD',before:'POWER PEAK WARNING RAISED',after:'CLOSURE CLAIM ENTERED LATER'},
 'AST-07':{who:'REVIEW BOARD RECORDING SUMMARY',before:'RISK DISCUSSION RECORDED',after:'INDEPENDENT RUN PROOF ABSENT'},
}
const logicIds:readonly OtherRecordId[]=['ORI-03','ORI-04','ORI-05','ORI-06']
const opticalIds:readonly OtherRecordId[]=['LUM-05','LUM-08']
const launchIds:readonly OtherRecordId[]=['KES-02']
const scienceIds:readonly OtherRecordId[]=['KES-01','KES-08']

function ArtifactCompare({item}:{item:ExhibitPair}){
 const [view,setView]=useState<'original'|'approved'>('original')
 return <div className="cw-artifact" aria-label="Two independently inspectable revision views">
  <div className="cw-artifact-head"><strong>ARCHIVE REVISION COMPARATOR</strong><span>SWITCH THE SOURCE</span></div>
  <div className="cw-artifact-actions">
   <button type="button" aria-pressed={view==='original'} onClick={()=>setView('original')}>ORIGINAL / RAW</button>
   <button type="button" aria-pressed={view==='approved'} onClick={()=>setView('approved')}>APPROVED / LATER</button>
  </div>
  <div className={'cw-artifact-sheet '+(view==='approved'?'cw-suspicious':'')}>
   <small>{view==='original'?item.left:item.right}</small><strong>{view==='original'?item.leftValue:item.rightValue}</strong>
   <span>{view==='original'?'EARLIER OR DIRECT RECORD':'LATER CLAIM OR SUMMARY'}</span>
  </div>
  <p>Compare the two sources and explain whether the later interpretation is supported by the earlier measurement.</p>
 </div>
}
function Transcript({item}:{item:{who:string;before:string;after:string}}){
 const [view,setView]=useState<'first'|'second'>('first')
 return <div className="cw-artifact" aria-label="Recording time-order investigation, transcript only">
  <div className="cw-artifact-head"><strong>{item.who}</strong><span>TRANSCRIPT / MEMORY</span></div>
  <div className="cw-artifact-wave" aria-hidden="true">{Array.from({length:39},(_,i)=>
   <i key={i} style={{height:(9+Math.abs(Math.sin(i*1.33)*34))+'px'}}/>)}</div>
  <div className="cw-artifact-actions">
   <button type="button" aria-pressed={view==='first'} onClick={()=>setView('first')}>EARLIER CLUE</button>
   <button type="button" aria-pressed={view==='second'} onClick={()=>setView('second')}>LATER / LIMITATION</button>
  </div>
  <strong className="cw-artifact-caption">{view==='first'?item.before:item.after}</strong>
  <p>Written reconstruction only. No independently verified audio media or speaker identification is implied.</p>
 </div>
}
function OpticalPreview(){
 const [unmasked,setUnmasked]=useState(false)
 return <div className="cw-artifact" aria-label="Fictional qualitative optical comparison">
  <div className="cw-artifact-head"><strong>OPTICAL-REPLAY VIEWFINDER</strong><span>QUALITATIVE SIMULATION</span></div>
  <div className="cw-artifact-actions"><button type="button" aria-pressed={!unmasked} onClick={()=>setUnmasked(false)}>COMPENSATED VIEW</button>
   <button type="button" aria-pressed={unmasked} onClick={()=>setUnmasked(true)}>REMOVE COMPENSATION</button></div>
  <div className={'cw-optical-preview '+(unmasked?'cw-optical-unmasked':'')} role="img" aria-label={unmasked?'Fictional uncorrected optics show a broad spot':'Fictional compensated optics give a deceptively concentrated spot'}>
   <span className="cw-optical-spot"/><i/><b/>
  </div>
  <p>{unmasked?'Compensation removed: the underlying mismatch becomes visible. A formal optical pass criterion is still missing.':'Compensation can make an acceptance picture look acceptable while masking a faulty setup.'}</p>
 </div>
}
function FlightLogic({id,answer}:{id:OtherRecordId;answer:CaseAnswer}){
 const [alternate,setAlternate]=useState(false)
 const guarded=alternate||answer.repair==='state'||answer.fallback==='recheck'
 return <div className="cw-artifact" aria-label="Onboard descent software transition diagram">
  <div className="cw-artifact-head"><strong>{id==='ORI-05'?'MISSING SYSTEM TEST':'AUTONOMOUS STATE MACHINE'}</strong><span>EVENT SEQUENCE / SIMULATED</span></div>
  <div className="cw-artifact-actions">
   <button type="button" aria-pressed={!alternate} onClick={()=>setAlternate(false)}>ORIGINAL RULE</button>
   <button type="button" aria-pressed={alternate} onClick={()=>setAlternate(true)}>PROPOSED GUARD</button>
  </div>
  <div className="cw-state-flow"><span>LEG SIGNAL</span><b>→</b><span>{guarded?'RADAR + PERSISTENCE':'RAW BIT'}</span><b>→</b>
   <strong>{guarded?'VERIFY / RECHECK':'ENGINE OFF'}</strong></div>
  <p>{guarded?'A protected transition needs test coverage for normal contact, deployment, noise and missing sensor.':'The old rule treats any brief contact pulse as landing—even above the surface.'}</p>
 </div>
}
function LaunchCard(){
 const [future,setFuture]=useState(false)
 return <div className="cw-artifact" aria-label="Launch opportunity planning board">
  <div className="cw-artifact-head"><strong>LAUNCH CALENDAR BOARD</strong><span>PHASE A CONSTRAINT</span></div>
  <div className="cw-artifact-actions">
   <button type="button" aria-pressed={!future} onClick={()=>setFuture(false)}>ORIGINAL WINDOW</button>
   <button type="button" aria-pressed={future} onClick={()=>setFuture(true)}>ALTERNATE WINDOW</button>
  </div>
  <div className="cw-launch-card"><small>{future?'ALTERNATE OPTION':'APPROVED PLANNING SLOT'}</small>
   <strong>{future?'TRAJECTORY + AVAILABILITY NOT BASELINED':'LAUNCHER ALLOCATION UNAVAILABLE'}</strong>
   <span>{future?'REQUIRES ENGINEERING STUDY':'ORIGINAL NOTICE PREDATES APPROVAL'}</span></div>
  <p>A proposed calendar date is not proof of a vehicle allocation or a feasible transfer.</p>
 </div>
}
function SciencePriorities({id}:{id:OtherRecordId}){
 return <div className="cw-artifact" aria-label="Science objective and engineering maturity distinction">
  <div className="cw-artifact-head"><strong>{id==='KES-01'?'MISSION OBJECTIVES':'SELECTION REVIEW'}</strong><span>SCIENCE ≠ FEASIBILITY</span></div>
  <div className="cw-science-tiles">
   <div><small>{id==='KES-01'?'PRIMARY SCIENCE':'SCIENTIFIC MERIT'}</small><strong>{id==='KES-01'?'METEOR EVENT + SPECTRAL SAMPLING':'HIGH SCIENCE VALUE'}</strong></div>
   <div><small>{id==='KES-01'?'SECONDARY SCIENCE':'TECHNICAL FEASIBILITY'}</small><strong>{id==='KES-01'?'MULTI-BAND FOLLOW-UP':'CONDITIONAL / NOT VERIFIED'}</strong></div>
  </div>
  <p>What must be preserved in the trade, and what still needs a separate feasibility gate?</p>
 </div>
}
export default function CaseEvidenceExhibit({id,answer}:{id:OtherRecordId;answer:CaseAnswer}){
 const comparison=comparisons[id],transcript=audio[id]
 if(comparison)return <ArtifactCompare item={comparison}/>
 if(transcript)return <Transcript item={transcript}/>
 if(opticalIds.includes(id))return <OpticalPreview/>
 if(logicIds.includes(id))return <FlightLogic id={id} answer={answer}/>
 if(launchIds.includes(id))return <LaunchCard/>
 if(scienceIds.includes(id))return <SciencePriorities id={id}/>
 return <CaseInstrument caseId={id.slice(0,3) as 'KES'|'LUM'|'ORI'|'AST'} plan={answer}/>
}
