import {useEffect,useState} from 'react'
import {CASE_META,type ArchiveCaseId} from '../archive/evidenceRecords'
import {countCaseCollectedEvidence,rescueIsReady} from '../archive/archiveState'
import {navigateGame} from '../gameNavigation'
import {playGameSound} from '../audio/gameAudio'
import {isVerifiedOutcomeFilmAvailable,playVerifiedRescueOutcome} from '../integration/gameMediaActions'
import {useArchiveSave} from './gameSave'
import {completeStoryRescue,isStoryRescueComplete} from './storyRescueState'
import {PAST_STAGES,pastRoute} from './pastTimeline'
import {allStagesStable,interventionFor,isStageStable,stableStageCount} from './pastInterventions'
import {readPastChoices} from './pastInterventionSave'
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

/** Completion is a consequence of four real engineering interventions in the Past rooms,
 * not of clicking through a scripted sequence or using individual evidence items.
 */
export default function StoryRescue({caseId}:{caseId:ArchiveCaseId}){
 const archive=useArchiveSave()
 const ready=rescueIsReady(archive,caseId)
 const count=countCaseCollectedEvidence(archive,caseId)
 const story=STORIES[caseId]
 const [finished,setFinished]=useState(()=>isStoryRescueComplete(caseId))
 const [warning,setWarning]=useState('')
 const choices=readPastChoices(caseId)
 const stable=stableStageCount(caseId,choices)
 const prepared=allStagesStable(caseId,choices)
 useEffect(()=>{setFinished(isStoryRescueComplete(caseId));setWarning('')},[caseId])
 function finalize(){
  if(!ready){setWarning('Recover any six of this mission’s eight records first.');return}
  if(!allStagesStable(caseId,readPastChoices(caseId))){
   setWarning('The mission is still at risk. Reconfigure all four systems in the Past rooms before finalizing.')
   return
  }
  if(completeStoryRescue(caseId)){
   setFinished(true)
   setWarning('')
   playGameSound('rescueComplete')
   if(isVerifiedOutcomeFilmAvailable(caseId))playVerifiedRescueOutcome(caseId)
  }else setWarning('The engineering changes could not be verified. Review the Past systems.')
 }
 return <main className="nr-root story-rescue">
  <header className="nr-top"><div><small>THE ASTRAL ARCHIVES / PAST TIMELINE · FICTIONAL RESCUE</small>
   <h1>{CASE_META[caseId].name.toUpperCase()} · {story.title}</h1></div>
   <button type="button" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>← MISSION FOLDERS</button>
  </header>
  <div className="nr-content">
   <section className="nr-summary">
    <small>MISSION {caseId} / YOUR ENGINEERING MISSION</small>
    <h2>CHANGE THE MISSION'S FUTURE</h2><p>{story.opening}</p>
    <div className="nr-progress"><span>STABILIZED SYSTEMS</span><strong>{stable}/4</strong>
     <div><i style={{width:stable/4*100+'%'}}/></div></div>
    <p className="nr-note">You already learned the science from the recovered records. Now repair real systems inside the four Past rooms. Every decision changes the simulation. No quizzes or calculations.</p>
    <p className="nr-note">Archive records recovered: {Math.min(count,6)}/6 to enter the past.</p>
   </section>
   {!ready?<section className="nr-work"><h2>PAST TIMELINE LOCKED</h2>
    <p>Collect any six of this mission’s eight evidence sheets to unlock its history. Evidence sorting is optional.</p>
    <button className="nr-action" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO THE ARCHIVES</button>
   </section>:finished?
   <section className="nr-work story-outcome" role="status">
    <div className="nr-label"><span>ALTERNATE TIMELINE</span><strong>RESCUE COMPLETE</strong><em>FICTIONAL OUTCOME</em></div>
    <h2>THE MISSION HAS A NEW PATH</h2><p>{story.result}</p><p className="nr-note">{story.boundary}</p>
    <div className="story-actions">
     {isVerifiedOutcomeFilmAvailable(caseId)&&<button type="button" className="nr-action" data-sfx="none" onClick={()=>playVerifiedRescueOutcome(caseId)}>WATCH MISSION OUTCOME</button>}
     <button type="button" className="nr-action" onClick={()=>navigateGame(pastRoute(caseId,'manufacturing'))}>REVIEW YOUR REPAIRS</button>
     <button type="button" className="nr-action" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO THE ARCHIVES</button>
    </div>
   </section>:
   <section className="nr-work story-mission-stage">
    <div className="nr-label"><span>MISSION REPAIR STATUS</span><strong>{prepared?'ALL SYSTEMS STABLE':'INTERVENTIONS REQUIRED'}</strong><em>{stable}/4</em></div>
    <h2>{prepared?'YOUR REPAIR PLAN IS READY':'OPERATE THE PAST SYSTEMS'}</h2>
    <p>{prepared?'You have corrected the four interdependent fictional systems. Finalize the engineering intervention to see the mission outcome.':'Choose each Past room and modify its real systems. If a configuration causes problems, change it and observe the consequences. Your decisions are saved automatically.'}</p>
    <div className="story-repair-list">
     {PAST_STAGES.map(stage=>{
      const fixed=isStageStable(caseId,stage.id,choices[stage.id])
      const system=interventionFor(caseId,stage.id)
      return <button type="button" key={stage.id} className={'story-repair-link '+(fixed?'story-repaired':'')}
       onClick={()=>navigateGame(pastRoute(caseId,stage.id))}>
        <span>{fixed?'✓':'○'} {stage.label}</span><strong>{system.system}</strong><small>{fixed?'STABILIZED · VIEW OR CHANGE':'OPEN ENGINEERING CONTROLS →'}</small>
      </button>
     })}
    </div>
    <div className="story-actions">
     {prepared?<button type="button" className="nr-action" onClick={finalize}>FINALIZE RESCUE →</button>
      :<button type="button" className="nr-action" onClick={()=>navigateGame(pastRoute(caseId,PAST_STAGES.find(stage=>!isStageStable(caseId,stage.id,choices[stage.id]))?.id??'manufacturing'))}>CONTINUE ENGINEERING REPAIRS →</button>}
    </div>
    {warning&&<p className="nr-message" role="alert">{warning}</p>}
   </section>}
   <footer className="nr-foot">FICTIONAL ALTERNATE-HISTORY DESIGN SIMULATION · NASA FLIGHT RECORDS ARE NOT MODIFIED</footer>
  </div>
 </main>
}
