import {useEffect,useState} from 'react'
import {CASE_META,type ArchiveCaseId} from '../archive/evidenceRecords'
import {countCaseCollectedEvidence,rescueIsReady} from '../archive/archiveState'
import {navigateGame} from '../gameNavigation'
import {playGameSound} from '../audio/gameAudio'
import {readArchive,useArchiveSave} from './gameSave'
import {PastStaticRoom} from './StationRoom'
import {PAST_STAGES,pastRoute,type PastRoomId} from './pastTimeline'
import {allStagesStable,interventionFor,isStageStable,stableStageCount} from './pastInterventions'
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
 const [warning,setWarning]=useState('')
 useEffect(()=>{setChoices(readPastChoices(caseId));setSelected(null);setControlsOpen(false);setWarning('')},[room,caseId])
 const stage=PAST_STAGES.find(s=>s.id===room)!
 const intervention=interventionFor(caseId,room)
 const chosen=intervention.options.find(o=>o.id===choices[room])
 const isStable=isStageStable(caseId,room,choices[room])
 const stableCount=stableStageCount(caseId,choices)
 const readyToComplete=allStagesStable(caseId,choices)
 const nextUnstable=PAST_STAGES.find(s=>!isStageStable(caseId,s.id,choices[s.id]))
 function openEquipment(){
  setSelected({id:intervention.objectId,target:intervention.objectId})
  setControlsOpen(true)
  setWarning('')
 }
 function applyChoice(id:string){
  if(!rescueIsReady(readArchive(),caseId)){setWarning('Collect six of the mission’s eight records first.');return}
  setChoices(savePastChoice(caseId,room,id))
  setWarning('')
  playGameSound('terminal')
 }
 function enterRescue(){
  if(!rescueIsReady(readArchive(),caseId)){setWarning('Collect any six of eight case records to travel into the past.');return}
  if(!allStagesStable(caseId,readPastChoices(caseId))){
   const missing=PAST_STAGES.find(s=>!isStageStable(caseId,s.id,readPastChoices(caseId)[s.id]))
   setWarning('Stabilize all four mission systems before the rescue can succeed.'+(missing?' Next: '+missing.label+'.':''))
   if(missing&&missing.id!==room)navigateGame(pastRoute(caseId,missing.id))
   else openEquipment()
   return
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
   onInspect={(target,id)=>{setSelected({target,id});setControlsOpen(id===intervention.objectId);setWarning('')}}/>
  <header className="pt-top">
   <div className="pt-brand"><strong>PAST TIMELINE</strong><span>{caseId} · {CASE_META[caseId].name} / FICTIONAL SIMULATION</span></div>
   <nav className="pt-nav" aria-label="Past mission engineering stages">
    {PAST_STAGES.map(item=><button type="button" key={item.id}
     aria-current={item.id===room?'page':undefined}
     className={(item.id===room?'pt-current ':'')+(isStageStable(caseId,item.id,choices[item.id])?'pt-stage-cleared':'')}
     onClick={()=>navigateGame(pastRoute(caseId,item.id))}>
     {isStageStable(caseId,item.id,choices[item.id])?'✓ ':''}{item.label}
    </button>)}
   </nav>
  </header>
  <footer className="pt-bottom">
   <button type="button" className="pt-return" onClick={returnToDossiers}>← ARCHIVES</button>
   <div className="pt-inspection" aria-live="polite">
    <strong>{stableCount}/4 SYSTEMS STABILIZED · {stage.label}</strong>
    <span>{isStable?chosen?.readout:'Operate '+intervention.system+' to change the mission.'}</span>
    {warning&&<em role="alert">{warning}</em>}
   </div>
   <button type="button" className="pt-rescue" onClick={readyToComplete?enterRescue:openEquipment}>
    {readyToComplete?'FINALIZE RESCUE →':isStable?'REVIEW SYSTEM ✓':'OPERATE SYSTEM →'}
   </button>
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
      <p>This room contains a repairable system. Use what you learned during the investigation to modify its configuration.</p>
      <button type="button" onClick={openEquipment}>OPERATE {intervention.system.toUpperCase()} →</button>
    </div>:<div className="pt-engineering">
      <div className="pt-system-status"><small>LIVE SYSTEM</small><strong>{intervention.system.toUpperCase()}</strong>
        <p>{intervention.condition}</p>
      </div>
      <div className="pt-repair-choices" aria-label="Engineering configuration changes">
       {intervention.options.map(option=><button key={option.id} type="button"
         aria-pressed={chosen?.id===option.id}
         className={(chosen?.id===option.id?'pt-option-selected ':'')+'pt-repair-option'}
         onClick={()=>applyChoice(option.id)}>
          <span>{option.action}</span>
          <small>{chosen?.id===option.id?'CURRENT CONFIGURATION':'APPLY CHANGE'}</small>
       </button>)}
      </div>
      {chosen&&<div className={'pt-decision-effect '+(chosen.restores?'pt-decision-good':'pt-decision-risk')} role="status">
        <small>{chosen.restores?'SYSTEM STABILIZED · VERIFIED FICTIONAL RESULT':'SYSTEM STILL AT RISK · ADJUST THE CONFIGURATION'}</small>
        <strong>{chosen.readout}</strong>
        <p>{chosen.consequence}</p>
      </div>}
      <p className="pt-tradeoff"><strong>Engineering trade-off:</strong> {intervention.tradeoff}</p>
      <div className="pt-object-actions">
       <button type="button" onClick={()=>{setSelected(null);setControlsOpen(false)}}>BACK TO ROOM</button>
       {isStable&&nextUnstable&&<button type="button" onClick={()=>navigateGame(pastRoute(caseId,nextUnstable.id))}>
         NEXT REPAIR · {nextUnstable.label} →
       </button>}
       {readyToComplete&&<button type="button" onClick={enterRescue}>FINALIZE RESCUE →</button>}
      </div>
    </div>}
    <small>Change your decision at any time. No quiz, penalty, or numerical answer is required.</small>
  </section>}
  {!selected&&<button type="button" className="pt-floating-system" onClick={openEquipment}>
    {isStable?'✓ SYSTEM STABILIZED · REVIEW':'OPERATE '+intervention.system.toUpperCase()}
  </button>}
 </div>
}
