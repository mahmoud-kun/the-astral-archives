import {useEffect,useState} from 'react'
import {CASE_META,EVIDENCE_RECORDS,type ArchiveCaseId} from '../archive/evidenceRecords'
import {countCaseCollectedEvidence,rescueIsReady} from '../archive/archiveState'
import {navigateGame} from '../gameNavigation'
import {playGameSound} from '../audio/gameAudio'
import {isVerifiedOutcomeFilmAvailable,playVerifiedRescueOutcome} from '../integration/gameMediaActions'
import {useArchiveSave} from './gameSave'
import {completeStoryRescue,isStoryRescueComplete} from './storyRescueState'
import './nadirRescue.css'
import './storyRescue.css'

type Scene={heading:string;detail:string;action:string}
type Story={title:string;opening:string;steps:readonly Scene[];result:string;boundary:string}
const STORIES:Record<ArchiveCaseId,Story>={
 KES:{
  title:'REBUILD THE FLIGHT PLAN',
  opening:'The mission concept has promising science, but the original launcher slot and resource budget do not support the proposed spacecraft.',
  steps:[
   {heading:'THE PLAN DOES NOT FIT',detail:'The design calls for 1,010 kg and 690 W. The fictional planning limits are 900 kg and 600 W, and the original launch allocation is unavailable.',action:'REOPEN THE MISSION PLAN'},
   {heading:'PROTECT THE CORE SCIENCE',detail:'Defer the secondary high-detail follow-up instrument while keeping the primary event science. Record the loss openly rather than hiding it.',action:'REBASELINE THE SPACECRAFT'},
   {heading:'REPLAN THE LAUNCH',detail:'The smaller fictional concept can use a new simulated allocation and revised cruise study. Its review remains conditional, not a certified launch.',action:'RESCUE THE MISSION'},
  ],
  result:'An alternative Kestrel concept can continue conditionally with smaller mass, lower power and a transparent science trade.',
  boundary:'The new launcher slot and trajectory are fictional proposals, not confirmed real-world flight opportunities.',
 },
 NAD:{
  title:'REPAIR THE NAVIGATION INTERFACE',
  opening:'Two engineering teams read the same impulse packet in different units. A review ticket was marked closed before a trustworthy rerun.',
  steps:[
   {heading:'TWO UNITS, ONE SIGNAL',detail:'The export reports 12 pound-force seconds, but the receiving navigation parser interpreted 12 newton-seconds. The true equivalent is about 53 N·s.',action:'REOPEN THE INTERFACE RECORD'},
   {heading:'REPAIR THE CONTRACT',detail:'Both systems now share a clearly named impulse unit. The producing adapter owns the conversion, and the ambiguous old field is replaced.',action:'RESTORE CONSISTENT UNITS'},
   {heading:'RECHECK THE FLIGHT MODEL',detail:'A fictional independent rerun with the corrected unit contract removes the simulated trajectory discrepancy. The missing verification is recorded before closure.',action:'RESCUE THE MISSION'},
  ],
  result:'The fictional navigation interface is consistent again, and the independent rerun supports the alternate outcome.',
  boundary:'This is a fictional engineering exercise, not an actual NASA mission rerun.',
 },
 LUM:{
  title:'RESTORE THE OPTICAL RECORD',
  opening:'An optical assembly was marked nominal although the raw measurement and the accepted configuration were different.',
  steps:[
   {heading:'THE RAW MEASUREMENT',detail:'The fictional as-built fixture reads 100.8 mm, not the planned 100.0 mm. The summary hides that difference.',action:'RECOVER THE RAW RECORD'},
   {heading:'REMOVE THE MASKING COMPENSATION',detail:'The team restores the calibrated fixture and exposes the original uncorrected optical test conditions.',action:'RECALIBRATE THE TEST'},
   {heading:'RETEST BEFORE FLIGHT',detail:'An independent simulated optical repeat is documented. The formal flight optical tolerance is still unknown, so qualification remains on hold.',action:'RESCUE THE MISSION'},
  ],
  result:'The measurement chain is corrected and retested in the alternate story; formal optical flight qualification is not asserted.',
  boundary:'All setup numbers and retest outcomes are fictional training values.',
 },
 ORI:{
  title:'REBUILD THE LANDING GUARD',
  opening:'A short landing-leg pulse was mistaken for confirmed touchdown while the vehicle was still descending.',
  steps:[
   {heading:'THE FALSE TOUCHDOWN',detail:'An 80 ms contact pulse occurred while the fictional lander was still about 40 m above the surface.',action:'TRACE THE SENSOR SIGNAL'},
   {heading:'CROSS-CHECK THE SENSORS',detail:'The control logic uses independent contact confirmation together with radar and descent state, not a single contact bit.',action:'RESTORE SENSOR AGREEMENT'},
   {heading:'REPLAY THE DESCENT',detail:'A fictional onboard guard rejects the spurious pulse and handles missing sensors without relying on real-time commands from Earth.',action:'RESCUE THE MISSION'},
  ],
  result:'The simulated landing sequence continues until credible touchdown and uses bounded onboard fault handling.',
  boundary:'The example debounce timing is fictional, not NASA-certified flight software.',
 },
 AST:{
  title:'REOPEN THE POWER REVIEW',
  opening:'A development-stage mission was signed off despite a failed power test and an incomplete audit trail.',
  steps:[
   {heading:'THE UNSUPPORTED STAMP',detail:'The fictional model predicted 430 W; the measured setup reached 520 W against a 480 W cap. A signature cannot change the power draw.',action:'REOPEN THE REVIEW'},
   {heading:'REBUILD THE OPERATING MODE',detail:'The team staggers high-draw instruments, preserves the revision history and records the reduced observation duty.',action:'RESTORE THE AUDIT TRAIL'},
   {heading:'INDEPENDENT POWER REPLAY',detail:'The corrected fictional sequence reaches 450 W in an independently documented design retest, below its 460 W review target.',action:'RESCUE THE MISSION'},
  ],
  result:'The alternative Phase B design review records a simulated 450 W result and a conditional reduced-duty operating plan.',
  boundary:'This is a fictional development-stage review, not authentic NASA flight telemetry; the incompatible 472 W movie is not used.',
 },
}

export default function StoryRescue({caseId}:{caseId:ArchiveCaseId}){
 const archive=useArchiveSave()
 const ready=rescueIsReady(archive,caseId)
 const count=countCaseCollectedEvidence(archive,caseId)
 const story=STORIES[caseId]
 const [index,setIndex]=useState(0)
 const [finished,setFinished]=useState(()=>isStoryRescueComplete(caseId))
 const [warning,setWarning]=useState('')
 useEffect(()=>{setIndex(0);setFinished(isStoryRescueComplete(caseId));setWarning('')},[caseId])
 const sources=EVIDENCE_RECORDS.filter(r=>r.caseId===caseId&&archive.discovered.includes(r.id))
 function advance(){
  if(!rescueIsReady(archive,caseId)){setWarning('Collect any six of this mission’s eight records to continue the rescue.');return}
  if(index<story.steps.length-1){setIndex(n=>n+1);playGameSound('terminal');return}
  if(completeStoryRescue(caseId)){
   setFinished(true)
   playGameSound('rescueComplete')
   if(isVerifiedOutcomeFilmAvailable(caseId))playVerifiedRescueOutcome(caseId)
  }
 }
 return <main className="nr-root story-rescue">
  <header className="nr-top"><div><small>THE ASTRAL ARCHIVES / PAST TIMELINE · FICTIONAL RESCUE</small><h1>{CASE_META[caseId].name.toUpperCase()} · {story.title}</h1></div>
   <button type="button" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>← MISSION FOLDERS</button>
  </header>
  <div className="nr-content">
   <section className="nr-summary">
    <small>MISSION {caseId} / YOUR EVIDENCE</small><h2>CHANGE THE MISSION'S FUTURE</h2>
    <p>{story.opening}</p>
    <div className="nr-progress"><span>CASE RECORDS COLLECTED</span><strong>{Math.min(count,6)}/6</strong><div><i style={{width:Math.min(count,6)/6*100+'%'}}/></div></div>
    <p className="nr-note">The records you collected guide this fictional rescue. No quizzes, calculations or engineering forms are required.</p>
    {ready&&<details className="story-evidence-list"><summary>VIEW YOUR {sources.length} RECOVERED RECORDS</summary>
     <div>{sources.map(source=><p key={source.id}><b>{source.id}</b> · {source.title}</p>)}</div>
    </details>}
   </section>
   {!ready?<section className="nr-work"><h2>RESCUE NOT YET UNLOCKED</h2>
     <p>Collect any six different evidence records from this mission. Mission Folders remain available, but sorting is not a requirement for Rescue.</p>
     <button type="button" className="nr-action" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>OPEN MISSION FOLDERS</button>
    </section>:finished?
    <section className="nr-work story-outcome" role="status">
     <div className="nr-label"><span>ALTERNATE TIMELINE</span><strong>RESCUE COMPLETE</strong><em>FICTIONAL RESULT</em></div>
     <h2>THE MISSION HAS A NEW PATH</h2><p>{story.result}</p><p className="nr-note">{story.boundary}</p>
     <div className="story-actions">
      {isVerifiedOutcomeFilmAvailable(caseId)&&<button type="button" className="nr-action" data-sfx="none" onClick={()=>playVerifiedRescueOutcome(caseId)}>WATCH MISSION OUTCOME</button>}
      <button type="button" className="nr-action" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO THE ARCHIVES</button>
     </div>
    </section>:
    <section className="nr-work story-mission-stage">
     <div className="nr-label"><span>RESCUE SEQUENCE {index+1} / {story.steps.length}</span><strong>ALTERNATE HISTORY</strong><em>STORY MODE</em></div>
     <div className="story-step-indicator">{story.steps.map((_,i)=><span key={i} className={i<=index?'current':''}/>)}</div>
     <h2>{story.steps[index].heading}</h2>
     <p>{story.steps[index].detail}</p>
     <div className="story-actions"><button type="button" className="nr-action" onClick={advance}>{story.steps[index].action} →</button></div>
     {warning&&<p className="nr-message" role="alert">{warning}</p>}
    </section>}
   <footer className="nr-foot">FICTIONAL ALTERNATE-HISTORY SIMULATION · NO NASA MISSION RECORDS ARE CHANGED</footer>
  </div>
 </main>
}
