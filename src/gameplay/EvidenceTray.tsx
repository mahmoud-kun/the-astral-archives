import { useEffect, useState } from 'react'
import { EVIDENCE_RECORDS, CASE_META } from '../archive/evidenceRecords'
import { navigateGame } from '../gameNavigation'
import { stationLabel, type StationId } from './nadirEngine'
import { useArchiveSave } from './gameSave'
import EvidenceGlyph from './EvidenceGlyph'
import './evidenceTray.css'

export default function EvidenceTray({room}:{room:StationId}){
 const archive=useArchiveSave()
 const [open,setOpen]=useState(false)
 const [tab,setTab]=useState<'unfiled'|'collected'>('unfiled')
 const [review,setReview]=useState<string|null>(null)
 useEffect(()=>{setOpen(false);setReview(null)},[room])
 useEffect(()=>{
  if(!open)return
  const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);setReview(null)}}
  window.addEventListener('keydown',escape)
  return ()=>window.removeEventListener('keydown',escape)
 },[open])
 const collected=EVIDENCE_RECORDS.filter(e=>archive.discovered.includes(e.id))
 const unfiled=collected.filter(e=>!archive.filed[e.id])
 const showing=tab==='unfiled'?unfiled:collected
 const selected=collected.find(e=>e.id===review)
 function openFolders(){
  setOpen(false)
  navigateGame('/?folder-lab=1&return='+encodeURIComponent(room))
 }
 return <>
  <button className={'et-trigger'+(room==='investigation'?' et-trigger--investigation':'')} type="button" data-sfx={open?'panelClose':'panelOpen'} onClick={()=>setOpen(!open)} aria-label={'Open evidence tray, '+unfiled.length+' unfiled'} aria-expanded={open} title="Quick Evidence Tray">
   <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="6" width="18" height="14" rx="1"/><path d="M3 10h18M8 6V4h8v2M9 14h6"/></svg>
   <span>{unfiled.length}</span>
  </button>
  {open&&<div className="et-scrim" role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target){setOpen(false);setReview(null)}}}>
   <aside className="et-panel" aria-label="Quick Evidence Tray">
    <header className="et-header"><div><small>THE ASTRAL ARCHIVES / FIELD KIT</small><strong>QUICK EVIDENCE TRAY</strong></div><button onClick={()=>setOpen(false)} aria-label="Close evidence tray" data-sfx="panelClose">×</button></header>
    <p className="et-context">LOCATION: {stationLabel(room).toUpperCase()} ROOM · Records stay with you across the station.</p>
    <div className="et-tabs" role="group" aria-label="Evidence filters">
     <button className={tab==='unfiled'?'active':''} onClick={()=>{setTab('unfiled');setReview(null)}}>UNFILED <b>{unfiled.length}</b></button>
     <button className={tab==='collected'?'active':''} onClick={()=>{setTab('collected');setReview(null)}}>ALL COLLECTED <b>{collected.length}</b></button>
    </div>
    <div className="et-list">
     {!showing.length&&<div className="et-empty"><strong>{tab==='unfiled'?'NO UNFILED EVIDENCE':'NO EVIDENCE COLLECTED'}</strong><p>Inspect a room object, read the record and collect the evidence directly. Any six collected records from one mission unlock its Rescue.</p></div>}
     {showing.map(record=><button className={'et-record '+(review===record.id?'active':'')} key={record.id} onClick={()=>setReview(record.id)}>
       <EvidenceGlyph kind={record.kind}/>
       <span className="et-record-copy"><small>{record.id} · {record.room.toUpperCase()}</small><strong>{record.title}</strong><em>{archive.filed[record.id]?'FILED · '+CASE_META[archive.filed[record.id]].name.toUpperCase():'UNFILED'}</em></span>
      </button>)}
    </div>
    {selected&&<div className="et-preview">
      <div className="et-preview-title"><EvidenceGlyph kind={selected.kind}/><div><small>COLLECTED RECORD / {selected.id}</small><strong>{selected.title}</strong><span>{selected.kind.toUpperCase()} · FICTIONAL SIMULATION</span></div></div>
      <details><summary>EXAMINE SOURCE RECORD</summary><p>{selected.content}</p></details>
     </div>}
    <footer className="et-footer"><p>File evidence in the physical Mission Folders. An incorrect filing is saved without a warning.</p>
     <button data-sfx="doorOpen" onClick={openFolders}>OPEN MISSION FOLDERS</button>
    </footer>
   </aside>
  </div>}
 </>
}
