import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CASE_META, EVIDENCE_RECORDS, type ArchiveRoom } from '../archive/evidenceRecords'
import { countRequiredEvidence } from '../archive/archiveState'
import { navigateGame } from '../gameNavigation'
import { useArchiveSave } from './gameSave'
import { CASE_EVIDENCE_TASKS, OTHER_CASE_IDS, type OtherCaseId, type OtherRecordId } from './caseEvidenceEngine'
import { useOtherProgress } from './caseSave'
import CasePuzzle from './CasePuzzle'
import './caseWork.css'

/** A source browser attaches to one physical in-room instrument, not 32 new floating hotspots.
 * Chat A/Main mount this on existing non-Nadir supporting objects while Nadir stays unchanged.
 */
export default function CaseStationDesk({station,onClose,initialCase='KES'}:{
 station:'investigation'|'archive'|'signal'|'recordings';onClose:()=>void;initialCase?:OtherCaseId
}){
 const [caseId,setCaseId]=useState<OtherCaseId>(initialCase)
 const [selected,setSelected]=useState<OtherRecordId|null>(null)
 const progress=useOtherProgress()
 const archive=useArchiveSave()
 const closer=useRef<HTMLButtonElement>(null)
 const onCloseRef=useRef(onClose)
 onCloseRef.current=onClose
 useEffect(()=>{
  const old=document.activeElement instanceof HTMLElement?document.activeElement:null
  closer.current?.focus()
  const escape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'&&!selected){event.preventDefault();onCloseRef.current()}
  }
  window.addEventListener('keydown',escape)
  return ()=>{window.removeEventListener('keydown',escape);old?.focus()}
 },[selected])
 const room=(station[0].toUpperCase()+station.slice(1)) as ArchiveRoom
 const items=EVIDENCE_RECORDS.filter(record=>
  record.room===room&&record.caseId===caseId).sort((a,b)=>Number(b.required)-Number(a.required))
 function openFolders(){
  navigateGame('/?folder-lab=1&return='+station)
  onClose()
 }
 return createPortal(<div className="cw-desk-shade" role="presentation">
  <section className="cw-desk" role="dialog" aria-modal="true" aria-labelledby="cw-desk-heading">
   <header className="cw-desk-head">
    <div><small>THE ASTRAL ARCHIVES / PHYSICAL STATION TERMINAL / {room.toUpperCase()}</small>
     <h2 id="cw-desk-heading">SOURCE INDEX · {CASE_META[caseId].name.toUpperCase()}</h2></div>
    <button ref={closer} type="button" onClick={onClose}>RETURN TO ROOM ×</button>
   </header>
   <div className="cw-desk-body">
    <nav className="cw-case-tabs" aria-label="Select investigated mission">
     {OTHER_CASE_IDS.map(c=><button key={c} type="button" aria-current={c===caseId?'page':undefined} onClick={()=>setCaseId(c)}>
      <b>{c}</b><span>{CASE_META[c].name}</span></button>)}
    </nav>
    <p className="cw-desk-story">Select an original source from this physical room. Each record has a distinct analysis instrument. Only a verified reconstruction may be collected, and collection does not automatically file anything.</p>
    <div className="cw-desk-progress"><span>REQUIRED RECORDS CORRECTLY FILED</span>
     <strong>{countRequiredEvidence(archive,caseId)} / 6</strong><button type="button" onClick={openFolders}>OPEN MISSION FOLDERS</button></div>
    <div className="cw-desk-records">
     {items.map(record=>{
      const task=CASE_EVIDENCE_TASKS[record.id as OtherRecordId]
      const solved=progress.solved.includes(record.id as OtherRecordId)
      const collected=archive.discovered.includes(record.id)
      return <button type="button" className="cw-desk-record" key={record.id} onClick={()=>setSelected(record.id as OtherRecordId)}>
       <div className="cw-desk-record-top"><span>{record.id} / {record.kind.toUpperCase()}</span><b>{record.required?'REQUIRED':'OPTIONAL'}</b></div>
       <strong>{task.scene}</strong>
       <p>{task.objective}</p>
       <small>{collected?'COLLECTED · FILING IS PLAYER-CONTROLLED':solved?'ANALYZED · READY TO COLLECT':'UNVERIFIED SOURCE / INSPECT'}</small>
      </button>
     })}
     {!items.length&&<p className="cw-desk-empty">No {caseId} records were authored for this room. Open another physical station or select a different case.</p>}
    </div>
    <p className="cw-desk-disclaimer">ALL CASES AND MEASUREMENTS ARE FICTIONAL SIMULATIONS. NASA REFERENCE MISSIONS ARE NOT RECREATED AS TELEMETRY.</p>
   </div>
  </section>
  {selected&&<CasePuzzle key={selected} id={selected} onClose={()=>setSelected(null)}/>}
 </div>,document.body)
}
