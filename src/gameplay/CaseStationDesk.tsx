import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { CASE_META, EVIDENCE_RECORDS } from '../archive/evidenceRecords'
import { recordsAtObject, type EvidenceStation } from './evidencePlacement'
import { countCaseCollectedEvidence } from '../archive/archiveState'
import { navigateGame } from '../gameNavigation'
import { useArchiveSave } from './gameSave'
import { OTHER_CASE_IDS, type OtherCaseId, type OtherRecordId } from './caseEvidenceEngine'
import { readActiveCase, setActiveCase } from './caseContext'
import CasePuzzle from './CasePuzzle'
import './caseWork.css'

function initialSelection(station:'investigation'|'archive'|'signal'|'recordings',explicit?:OtherCaseId):OtherCaseId{
 if(explicit)return explicit
 return readActiveCase()??(station==='signal'?'LUM':'KES')
}
/** Each physical instrument exposes only its own assigned case documents.
 * Sorting, case ownership, ID-based saves and collection behavior are unchanged.
 */
export default function CaseStationDesk({station,onClose,initialCase,sourceObjectId}:{
 station:EvidenceStation;onClose:()=>void;initialCase?:OtherCaseId;sourceObjectId?:string
}){
 const [caseId,setCaseId]=useState<OtherCaseId>(()=>initialSelection(station,initialCase))
 const [selected,setSelected]=useState<OtherRecordId|null>(null)
 useEffect(()=>{if(initialCase){setCaseId(initialCase);setActiveCase(initialCase)}},[initialCase])
 const archive=useArchiveSave()
 const closer=useRef<HTMLButtonElement>(null)
 const deskRef=useRef<HTMLElement>(null)
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
 function trapTab(event:ReactKeyboardEvent<HTMLElement>){
  if(selected||event.key!=='Tab')return
  const focusables=[...(deskRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href]')??[])]
   .filter(el=>el.getClientRects().length>0)
  if(!focusables.length)return
  const first=focusables[0],last=focusables[focusables.length-1]
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
 const room=station[0].toUpperCase()+station.slice(1)
 const availableIds=sourceObjectId?new Set<string>(recordsAtObject(station,sourceObjectId)):null
 const items=EVIDENCE_RECORDS.filter(record=>record.caseId===caseId && record.room===room && (!availableIds||availableIds.has(record.id)))
  .sort((a,b)=>Number(b.required)-Number(a.required))
 function chooseCase(next:OtherCaseId){
  setCaseId(next)
  setSelected(null)
  setActiveCase(next)
 }
 function openFolders(){
  navigateGame('/?folder-lab=1&return='+station)
  onClose()
 }
 return createPortal(<div className="cw-desk-shade" role="presentation">
  <section className="cw-desk" ref={deskRef} role="dialog" aria-modal="true" aria-labelledby="cw-desk-heading" onKeyDown={trapTab}>
   <header className="cw-desk-head">
    <div><small>THE ASTRAL ARCHIVES / PHYSICAL STATION TERMINAL / {room.toUpperCase()}</small>
     <h2 id="cw-desk-heading">RECOVERED FILES · {CASE_META[caseId].name.toUpperCase()}</h2></div>
    <button ref={closer} type="button" onClick={onClose}>RETURN TO ROOM ×</button>
   </header>
   <div className="cw-desk-body">
    <nav className="cw-case-tabs" aria-label="Select investigated mission">
     {OTHER_CASE_IDS.map(c=><button key={c} type="button" aria-current={c===caseId?'page':undefined} onClick={()=>chooseCase(c)}>
      <b>{c}</b><span>{CASE_META[c].name}</span></button>)}
    </nav>
    <p className="cw-desk-story">This equipment contains its own recovered records. Explore other objects and rooms to discover the remaining sources. Read, watch or listen, and press COLLECT EVIDENCE directly. Mission Folders and the six-of-eight Rescue rule are unchanged.</p>
    <div className="cw-desk-progress"><span>RESCUE UNLOCKS AFTER ANY SIX RECORDS COLLECTED</span>
     <strong>{Math.min(countCaseCollectedEvidence(archive,caseId),6)} / 6</strong><button type="button" onClick={openFolders}>OPEN MISSION FOLDERS</button></div>
    <div className="cw-desk-records">
     {items.map(record=>{
      const collected=archive.discovered.includes(record.id)
      return <button type="button" className="cw-desk-record" key={record.id} onClick={()=>setSelected(record.id as OtherRecordId)}>
       <div className="cw-desk-record-top"><span>{record.id} / {record.kind.toUpperCase()}</span><b>{record.required?'REQUIRED':'OPTIONAL'}</b></div>
       <strong>{record.title}</strong>
       <p>{record.content}</p>
       <small>{collected?'COLLECTED · FILING IS PLAYER-CONTROLLED':'OPEN EVIDENCE · READ & COLLECT'}</small>
      </button>
     })}
     {!items.length&&<p className="cw-desk-empty">No {CASE_META[caseId].name} records are stored at this particular instrument. Explore other equipment to discover more sources.</p>}
    </div>
    <p className="cw-desk-disclaimer">ALL CASES AND MEASUREMENTS ARE FICTIONAL SIMULATIONS. NASA REFERENCE MISSIONS ARE NOT RECREATED AS TELEMETRY.</p>
   </div>
  </section>
  {selected&&<CasePuzzle key={selected} id={selected} onClose={()=>setSelected(null)}/>}
 </div>,document.body)
}
