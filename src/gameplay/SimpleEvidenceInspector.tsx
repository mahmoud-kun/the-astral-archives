import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'
import {discoverEvidence} from '../archive/archiveState'
import {findEvidence} from '../archive/evidenceRecords'
import EvidenceMediaPanel from '../integration/EvidenceMediaPanel'
import EvidenceStoryThread from './EvidenceStoryThread'
import {playGameSound} from '../audio/gameAudio'
import {updateArchive,useArchiveSave} from './gameSave'
import './nadirPuzzle.css'
import './simpleEvidence.css'

/** Evidence is a recovered record, not an exam. No answers, prereqs or verification.
 * Collecting never chooses a folder: player files it themselves in Mission Folders.
 */
export default function SimpleEvidenceInspector({id,scene,fragments,onClose}:{
 id:string; scene?:string; fragments:readonly string[]; onClose:()=>void
}){
 const archive=useArchiveSave()
 const collected=archive.discovered.includes(id)
 const record=findEvidence(id)
 const closeRef=useRef<HTMLButtonElement>(null)
 const latest=useRef(onClose)
 latest.current=onClose
 const [justCollected,setJustCollected]=useState(false)
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null
  closeRef.current?.focus()
  const escape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'&&!document.querySelector('.cm-backdrop')){
    event.preventDefault();event.stopPropagation();latest.current()
   }
  }
  window.addEventListener('keydown',escape,true)
  return ()=>{window.removeEventListener('keydown',escape,true);previous?.focus()}
 },[])
 if(!record)return null
 function collect(){
  if(collected)return
  updateArchive(current=>discoverEvidence(current,id))
  playGameSound('evidence')
  setJustCollected(true)
 }
 return createPortal(<div className="np-backdrop se-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="np-dialog se-dialog" role="dialog" aria-modal="true" aria-label={'Evidence '+id}>
   <header className="np-head">
    <div><small>THE ASTRAL ARCHIVES / RECOVERED EVIDENCE</small><strong>{id} · {record.title}</strong></div>
    <button ref={closeRef} data-sfx="panelClose" type="button" onClick={onClose} aria-label="Close evidence analyzer">BACK TO ROOM ×</button>
   </header>
   <div className="se-scroll">
    <div className="np-meta"><span>{record.room.toUpperCase()} / {record.caseId}</span><span>{record.required?'REQUIRED EVIDENCE':'OPTIONAL EVIDENCE'} · FICTIONAL CASE RECORD</span></div>
    <h2>{record.title}</h2>
    {scene&&<p className="se-scene">{scene}</p>}
    <div className="se-paper">
     <small>RECOVERED ARCHIVE DOCUMENT · {record.id}</small>
     <p>{record.content}</p>
     {fragments.length>0&&<div className="se-fragments">
       {fragments.map((line,i)=><p key={i}><b>{String(i+1).padStart(2,'0')}</b> {line}</p>)}
     </div>}
    </div>
    <EvidenceStoryThread caseId={record.caseId} discovered={archive.discovered} focusId={justCollected?id:undefined}/>
    <EvidenceMediaPanel evidenceId={id}/>
    <p className="se-guidance">Listen or watch the attached source media if available. Collect this record directly, then decide which Mission Folder it belongs to. No questions or calculations are required.</p>
    {justCollected&&<p role="status" className="np-success"><strong>EVIDENCE COLLECTED</strong> Your case thread has been updated. This record is saved in the Unfiled Evidence Tray; you can sort it whenever you want.</p>}
   </div>
   <footer className="np-foot se-foot">
    <span>{collected?'COLLECTED · READY FOR FILING':'READY TO COLLECT'}</span>
    {!collected?<button className="np-primary" type="button" data-sfx="none" onClick={collect}>COLLECT EVIDENCE · {id}</button>:<strong>✓ EVIDENCE COLLECTED</strong>}
    <button className="np-secondary" type="button" onClick={onClose}>RETURN TO ROOM</button>
   </footer>
  </section>
 </div>,document.body)
}
