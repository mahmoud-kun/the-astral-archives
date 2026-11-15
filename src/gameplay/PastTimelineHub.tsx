import {useEffect,useState} from 'react'
import {CASE_META,type ArchiveCaseId} from '../archive/evidenceRecords'
import {countCaseCollectedEvidence,rescueIsReady} from '../archive/archiveState'
import {navigateGame} from '../gameNavigation'
import {readArchive,useArchiveSave} from './gameSave'
import {PastStaticRoom} from './StationRoom'
import {PAST_STAGES,pastRoute,type PastRoomId} from './pastTimeline'
import './pastTimelineHub.css'

const DETAILS:Record<string,string>={
 materials_structure:'Inspect structure and materials before a design decision.',
 motors_energy:'Review propulsion and power interfaces.',
 rocket_design:'Examine vehicle architecture and design boundaries.',
 mission_objectives:'Review the mission objectives and trade-offs.',
 target_destination:'Inspect the intended target and trajectory assumptions.',
 scientific_priorities:'Review competing scientific objectives.',
 mission_constraints:'Review design limits and schedule constraints.',
 mission_files:'Inspect the mission record and engineering history.',
 dataset_viewer:'Inspect the evidence display; actual analysis happens at Present stations.',
 analysis_console:'Review analysis and verification procedures.',
 hardware_inventory:'Review hardware configuration and availability.',
 power_energy:'Consider power limits and operating modes.',
 personnel_roles:'Review engineering roles and design review ownership.',
 supplies_logistics:'Examine availability and logistical constraints.',
 resource_allocation:'Inspect the competing resource allocations.',
}
function returnToDossiers(){navigateGame('/?folder-lab=1&return=investigation')}
export default function PastTimelineHub({room,caseId}:{room:PastRoomId;caseId:ArchiveCaseId}){
 const archive=useArchiveSave()
 const unlocked=rescueIsReady(archive,caseId)
 const count=countCaseCollectedEvidence(archive,caseId)
 const [selected,setSelected]=useState<{id:string;target:string}|null>(null)
 const [warning,setWarning]=useState('')
 useEffect(()=>{setSelected(null);setWarning('')},[room,caseId])
 function enterRescue(){
  if(!rescueIsReady(readArchive(),caseId)){setWarning('Collect any six of this mission’s eight evidence records to enter Rescue.');return}
  navigateGame('/?rescue='+encodeURIComponent(caseId))
 }
 if(!unlocked)return <main className="pt-locked">
  <section className="pt-locked-card">
   <small>THE ASTRAL ARCHIVES / PAST TIMELINE</small>
   <h1>PAST TIMELINE LOCKED</h1>
   <p>{CASE_META[caseId].name}: {count}/6 case records collected.</p>
   <p>Collect any six of this mission’s eight records. You can organize them in folders, but filing is optional.</p>
   <button type="button" onClick={returnToDossiers}>OPEN MISSION FOLDERS</button>
  </section>
 </main>
 const stage=PAST_STAGES.find(s=>s.id===room)!
 const stepIndex=PAST_STAGES.findIndex(s=>s.id===room)
 const nextStage=PAST_STAGES[stepIndex+1]
 return <div className="pt-root" role="region" aria-label={'Past Timeline — '+CASE_META[caseId].name}>
  <PastStaticRoom key={room} room={room} onBack={returnToDossiers}
   onInspect={(target,id)=>{setSelected({target,id});setWarning('')}}/>
  <header className="pt-top">
   <div className="pt-brand"><strong>PAST TIMELINE</strong><span>{caseId} · {CASE_META[caseId].name} / FICTIONAL SIMULATION</span></div>
   <nav className="pt-nav" aria-label="Past mission design stages">
    {PAST_STAGES.map(item=><button type="button" key={item.id} aria-current={item.id===room?'page':undefined}
     className={item.id===room?'pt-current':''} onClick={()=>navigateGame(pastRoute(caseId,item.id))}>{item.label}</button>)}
   </nav>
  </header>
  <footer className="pt-bottom">
   <button type="button" className="pt-return" onClick={returnToDossiers}>← DOSSIERS</button>
   <div className="pt-inspection" aria-live="polite">
    <strong>{selected?selected.id.replaceAll('_',' ').toUpperCase():stage.label}</strong>
    <span>{selected?(DETAILS[selected.target]??'Inspect this mission system.'):stage.detail+' · Tap a highlighted object to read about it, then visit the next stage.'}</span>
    {warning&&<em role="alert">{warning}</em>}
   </div>
   <button type="button" className="pt-rescue" onClick={enterRescue}>START RESCUE STORY →</button>
  </footer>
  {selected&&<section className="pt-object-panel" role="dialog" aria-modal="false" aria-label={'Past room object: '+selected.id.replaceAll('_',' ')}>
    <div className="pt-object-head"><small>PAST ARCHIVE · {stage.label} · {caseId}</small><button type="button" onClick={()=>setSelected(null)} aria-label="Close inspected object">CLOSE ×</button></div>
    <h2>{selected.id.replaceAll('_',' ').toUpperCase()}</h2>
    <p>{DETAILS[selected.target]??'Review this part of the fictional mission design.'}</p>
    <p className="pt-object-context">{CASE_META[caseId].subtitle}. You are investigating an alternate fictional timeline using the evidence you recovered in the present.</p>
    <div className="pt-object-actions">
      <button type="button" onClick={()=>setSelected(null)}>KEEP EXPLORING</button>
      {nextStage?<button type="button" onClick={()=>navigateGame(pastRoute(caseId,nextStage.id))}>NEXT ROOM: {nextStage.label} →</button>
        :<button type="button" onClick={enterRescue}>START RESCUE STORY →</button>}
    </div>
    <small>Explore without solving quizzes. You can return to any Past room using the stage menu above.</small>
   </section>}
 </div>
}
