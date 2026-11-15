import {useEffect,useState} from 'react'
import {CASE_META,type ArchiveCaseId} from '../archive/evidenceRecords'
import {countCaseCollectedEvidence,rescueIsReady} from '../archive/archiveState'
import {navigateGame} from '../gameNavigation'
import {playGameSound} from '../audio/gameAudio'
import {readArchive,useArchiveSave} from './gameSave'
import {PastStaticRoom} from './StationRoom'
import {PAST_STAGES,pastRoute,type PastRoomId} from './pastTimeline'
import {allStagesStable,countConfiguredStages,evaluateRepairPlan,interventionFor} from './pastInterventions'
import {readPastChoices,savePastChoice} from './pastInterventionSave'
import './pastTimelineHub.css'

const DETAILS:Record<string,string>={
 materials_structure:'Examine the build materials and structural limits.',
 motors_energy:'Inspect the propulsion, sensors and electrical interfaces.',
 rocket_design:'Review the launch vehicle and spacecraft concept.',
 mission_objectives:'Protect the mission’s scientific purpose.',
 target_destination:'Consider target, navigation and travel assumptions.',
 scientific_priorities:'Balance primary and secondary science capabilities.',
 mission_constraints:'Inspect mission boundaries and system limits.',
 mission_files:'Read the engineering history before changing a system.',
 dataset_viewer:'See what changed in the fictional test data.',
 analysis_console:'Operate the test and simulation tools.',
 hardware_inventory:'Review qualified hardware choices and availability.',
 power_energy:'Review power use across the mission.',
 personnel_roles:'Inspect responsibility for engineering verification.',
 supplies_logistics:'Review procurement and logistical constraints.',
 resource_allocation:'Make practical resource and operating trade-offs.',
}
function returnToDossiers(){navigateGame('/?folder-lab=1&return=investigation')}
export default function PastTimelineHub({room,caseId}:{room:PastRoomId;caseId:ArchiveCaseId}){
 const archive=useArchiveSave()
 const unlocked=rescueIsReady(archive,caseId)
 const count=countCaseCollectedEvidence(archive,caseId)
 const [choices,setChoices]=useState(()=>readPastChoices(caseId))
 const [selected,setSelected]=useState<{id:string;target:string}|null>(null)
 const [controlsOpen,setControlsOpen]=useState(false)
 const [reviewOpen,setReviewOpen]=useState(false)
 const [warning,setWarning]=useState('')
 useEffect(()=>{
  setChoices(readPastChoices(caseId));setSelected(null)
  setControlsOpen(false);setReviewOpen(false);setWarning('')
 },[room,caseId])
 const stage=PAST_STAGES.find(s=>s.id===room)!
 const stageIndex=PAST_STAGES.findIndex(s=>s.id===room)
 const nextStage=PAST_STAGES[(stageIndex+1)%PAST_STAGES.length]
 const intervention=interventionFor(caseId,room)
 const chosen=intervention.options.find(o=>o.id===choices[room])
 const configured=countConfiguredStages(choices)
 const issues=evaluateRepairPlan(caseId,choices)
 const readyToComplete=allStagesStable(caseId,choices)
 function openEquipment(){
  setSelected({id:intervention.objectId,target:intervention.objectId})
  setControlsOpen(true);setReviewOpen(false);setWarning('')
 }
 function applyChoice(id:string){
  if(!rescueIsReady(readArchive(),caseId)){setWarning('Collect six of the mission’s eight records first.');return}
  setChoices(savePastChoice(caseId,room,id))
  setReviewOpen(false);setWarning('')
  playGameSound('terminal')
 }
 function reviewMission(){
  setSelected(null);setControlsOpen(false);setWarning('')
  setChoices(readPastChoices(caseId));setReviewOpen(true)
 }
 function enterRescue(){
  if(!rescueIsReady(readArchive(),caseId)){
   setWarning('Collect any six of eight case records to enter the Past.');return
  }
  if(!allStagesStable(caseId,readPastChoices(caseId))){
   setWarning('The combined plan still contains engineering risks. Review your four systems.')
   reviewMission();return
  }
  navigateGame('/?rescue='+encodeURIComponent(caseId))
 }
 if(!unlocked)return <main className="pt-locked">
  <section className="pt-locked-card">
   <small>THE ASTRAL ARCHIVES / PAST TIMELINE</small>
   <h1>PAST TIMELINE LOCKED</h1>
   <p>{CASE_META[caseId].name}: {count}/6 case records collected.</p>
   <p>Collect any six of eight. Your evidence and folder progress remain saved.</p>
   <button type="button" onClick={returnToDossiers}>OPEN MISSION FOLDERS</button>
  </section>
 </main>
 return <div className="pt-root" role="region" aria-label={'Past Timeline — '+CASE_META[caseId].name}>
  <PastStaticRoom key={room} room={room} onBack={returnToDossiers}
   onInspect={(target,id)=>{setSelected({target,id});setControlsOpen(id===intervention.objectId);setReviewOpen(false);setWarning('')}}/>
  <header className="pt-top">
   <div className="pt-brand"><strong>PAST TIMELINE</strong><span>{caseId} · {CASE_META[caseId].name} / FICTIONAL SIMULATION</span></div>
   <nav className="pt-nav" aria-label="Past mission engineering stages">
    {PAST_STAGES.map(item=><button type="button" key={item.id}
     aria-current={item.id===room?'page':undefined}
     className={(item.id===room?'pt-current ':'')+(choices[item.id]?'pt-stage-configured':'')}
     onClick={()=>navigateGame(pastRoute(caseId,item.id))}>
     {choices[item.id]?'• ':''}{item.label}
    </button>)}
   </nav>
  </header>
  <footer className="pt-bottom">
   <button type="button" className="pt-return" onClick={returnToDossiers}>← ARCHIVES</button>
   <div className="pt-inspection" aria-live="polite">
    <strong>{configured}/4 CONFIGURATIONS APPLIED · {stage.label}</strong>
    <span>{chosen?.readout??'Operate '+intervention.system+' and compare the outcomes.'}</span>
    {warning&&<em role="alert">{warning}</em>}
   </div>
   <button type="button" className="pt-rescue" onClick={reviewMission}>REVIEW MISSION PLAN →</button>
  </footer>
  {selected&&<section className="pt-object-panel pt-intervention-panel" role="dialog" aria-modal="false"
    aria-label={'Past room equipment: '+selected.id.replaceAll('_',' ')}>
    <div className="pt-object-head">
     <small>PAST · {stage.label} / {caseId}</small>
     <button type="button" onClick={()=>{setSelected(null);setControlsOpen(false)}} aria-label="Close inspected object">CLOSE ×</button>
    </div>
    <h2>{selected.id.replaceAll('_',' ').toUpperCase()}</h2>
    <p>{DETAILS[selected.target]??'Inspect the fictional mission system.'}</p>
    {!controlsOpen?<div className="pt-object-context">
      <strong>Engineering controls</strong>
      <p>This room contains a configurable system. Consider the design trade-off before applying a change.</p>
      <button type="button" onClick={openEquipment}>OPERATE {intervention.system.toUpperCase()} →</button>
    </div>:<div className="pt-engineering">
      <div className="pt-system-status"><small>LIVE SYSTEM</small><strong>{intervention.system.toUpperCase()}</strong>
       <p>{intervention.condition}</p>
      </div>
      <div className={'pt-repair-choices pt-choices-'+intervention.options.length} aria-label="Engineering configuration choices">
       {intervention.options.map((option,i)=><button key={option.id} type="button"
         aria-pressed={chosen?.id===option.id}
         className={(chosen?.id===option.id?'pt-option-selected ':'')+'pt-repair-option'}
         onClick={()=>applyChoice(option.id)}>
         <small>CONFIGURATION {String(i+1).padStart(2,'0')}</small>
         <span>{option.action}</span>
         <small>{chosen?.id===option.id?'CURRENT PLAN':'APPLY THIS CONFIGURATION'}</small>
       </button>)}
      </div>
      {chosen&&<div className="pt-decision-effect" role="status">
        <small>SIMULATED SYSTEM RESPONSE · CONFIGURATION RECORDED</small>
        <strong>{chosen.readout}</strong>
        <p>{chosen.consequence}</p>
      </div>}
      <p className="pt-tradeoff"><strong>Engineering trade-off:</strong> {intervention.tradeoff}</p>
      <div className="pt-object-actions">
       <button type="button" onClick={()=>{setSelected(null);setControlsOpen(false)}}>BACK TO ROOM</button>
       <button type="button" onClick={()=>navigateGame(pastRoute(caseId,nextStage.id))}>NEXT ROOM · {nextStage.label} →</button>
       <button type="button" onClick={reviewMission}>REVIEW COMBINED PLAN →</button>
      </div>
    </div>}
    <small>You can revise any choice later. Some approaches work differently, and the overall result depends on your complete design.</small>
  </section>}
  {reviewOpen&&<section className="pt-object-panel pt-review-panel" role="dialog" aria-modal="false" aria-label="Mission engineering review">
    <div className="pt-object-head"><small>{caseId} · ALTERNATE HISTORY DESIGN REVIEW</small>
      <button type="button" onClick={()=>setReviewOpen(false)} aria-label="Close mission review">CLOSE ×</button>
    </div>
    <h2>ENGINEERING REVIEW · {configured}/4 CONFIGURED</h2>
    <p>{readyToComplete?'The four system changes form a consistent fictional rescue plan. Review the trade-offs and finalize the alternate outcome.':'The combined mission plan still needs attention. Review the systems below, change configurations, and compare their consequences. More than one technical approach may work.'}</p>
    <div className="pt-review-list">
      {PAST_STAGES.map(item=>{
        const current=choices[item.id]
        const issue=issues.find(x=>x.room===item.id)
        const plan=interventionFor(caseId,item.id)
        const applied=plan.options.find(x=>x.id===current)
        return <div key={item.id} className="pt-review-line">
          <strong>{item.label} · {plan.system}</strong>
          <p>{applied?applied.readout:'No configuration selected yet'}</p>
          {issue&&<small>{issue.message}</small>}
          <button type="button" onClick={()=>navigateGame(pastRoute(caseId,item.id))}>{issue?'REVISIT SYSTEM':'REVIEW CONFIGURATION'} →</button>
        </div>
      })}
    </div>
    <div className="pt-object-actions">
     <button type="button" onClick={()=>setReviewOpen(false)}>CONTINUE EXPLORING</button>
     {readyToComplete&&<button type="button" onClick={enterRescue}>FINALIZE RESCUE →</button>}
    </div>
    <small>All parameters and results are fictional design simulations, not authentic flight data.</small>
  </section>}
  {!selected&&!reviewOpen&&<button type="button" className="pt-floating-system" onClick={openEquipment}>
    {chosen?'CHANGE '+intervention.system.toUpperCase():'OPERATE '+intervention.system.toUpperCase()}
  </button>}
 </div>
}
