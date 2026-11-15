import {useEffect,useRef,useState} from 'react'
import {createPortal} from 'react-dom'
import {CASE_META,EVIDENCE_RECORDS,type ArchiveCaseId} from '../archive/evidenceRecords'
import {rescueIsReady} from '../archive/archiveState'
import {useArchiveSave} from './gameSave'
import {CASE_KNOWLEDGE} from './rescueKnowledge'
import {CASE_STORY_ARCS,getRevealedConnections} from './caseStoryThreads'
import './rescueRecap.css'

type Tab='findings'|'application'|'records'
/** A short, interactive synthesis of the evidence the player already recovered.
 * No quiz, success flag or direct source/room location spoilers.
 * The underlying any-six-of-eight gate is always rechecked on Continue.
 */
export default function RescueRecap({caseId,onClose,onBegin}:{
 caseId:ArchiveCaseId;onClose:()=>void;onBegin:()=>boolean
}){
 const archive=useArchiveSave()
 const knowledge=CASE_KNOWLEDGE[caseId]
 const story=CASE_STORY_ARCS[caseId]
 const recovered=EVIDENCE_RECORDS.filter(record=>record.caseId===caseId&&archive.discovered.includes(record.id))
 const findings=knowledge.sections.filter(item=>item.sourceIds.some(id=>archive.discovered.includes(id)))
 const connections=getRevealedConnections(caseId,archive.discovered)
 const [tab,setTab]=useState<Tab>('findings')
 const [active,setActive]=useState(0)
 const [visited,setVisited]=useState<readonly number[]>([])
 const [error,setError]=useState('')
 const closeRef=useRef<HTMLButtonElement>(null)
 const latest=useRef(onClose)
 latest.current=onClose
 const item=findings[Math.min(active,Math.max(findings.length-1,0))]
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null
  closeRef.current?.focus()
  const escape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'&&!document.querySelector('.cm-backdrop')){
    event.preventDefault();event.stopPropagation();latest.current()
   }
  }
  document.addEventListener('keydown',escape,true)
  return ()=>{document.removeEventListener('keydown',escape,true);previous?.focus()}
 },[])
 function select(index:number){
  setActive(index)
  setVisited(previous=>previous.includes(index)?previous:[...previous,index])
 }
 function begin(){
  if(!rescueIsReady(archive,caseId)){
   setError('Collect six different mission records before travelling to the past. Your existing evidence remains saved.')
   return
  }
  if(!onBegin())setError('The time portal is currently busy. Close any other cinematic and try again.')
 }
 return createPortal(<div className="rr-shade" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="rr-modal" role="dialog" aria-modal="true" aria-labelledby="rr-title">
   <header className="rr-head">
    <div><small>THE ASTRAL ARCHIVES / INVESTIGATOR'S PRE-RESCUE REPORT</small>
     <h2 id="rr-title">{CASE_META[caseId].name.toUpperCase()} · WHAT YOU UNCOVERED</h2></div>
    <button ref={closeRef} type="button" onClick={onClose} aria-label="Close case recap">CLOSE ×</button>
   </header>
   <div className="rr-intro">
    <p><strong>{story.title}</strong> {story.opening} <span className="rr-story-count">{connections.length} connections reconstructed</span></p>
    <div className="rr-progress"><strong>{recovered.length}/8</strong><span>EVIDENCE RECOVERED</span></div>
   </div>
   <nav className="rr-tabs" aria-label="Explore your investigation conclusions">
    <button type="button" aria-current={tab==='findings'?'page':undefined} onClick={()=>setTab('findings')}>YOUR FINDINGS</button>
    <button type="button" aria-current={tab==='application'?'page':undefined} onClick={()=>setTab('application')}>WHAT YOU CAN CHANGE</button>
    <button type="button" aria-current={tab==='records'?'page':undefined} onClick={()=>setTab('records')}>COLLECTED RECORDS ({recovered.length})</button>
   </nav>
   <div className="rr-content">
    {tab!=='records'?
     <div className="rr-lesson-layout">
      <div className="rr-topic-list" aria-label="Case investigation themes">
       {findings.map((finding,index)=><button type="button" key={finding.title} aria-pressed={active===index}
        className={active===index?'rr-selected':''} onClick={()=>select(index)}>
         <small>INSIGHT {String(index+1).padStart(2,'0')}{visited.includes(index)?' · VIEWED':''}</small>
         <strong>{finding.title}</strong>
        </button>)}
      </div>
      {item?<article className="rr-lesson" key={item.title}>
       <small>{tab==='findings'?'WHAT YOUR EVIDENCE SUGGESTS':'BRING YOUR KNOWLEDGE INTO THE PAST'}</small>
       <h3>{item.title}</h3>
       {tab==='findings'?<>
        <p className="rr-main-point">{item.takeaway}</p>
        <p>{item.reasoning}</p>
        <span className="rr-source-tag">BACKED BY {item.sourceIds.filter(id=>archive.discovered.includes(id)).join(' · ')}</span>
       </>:<>
        <p className="rr-main-point">{item.pastApplication}</p>
        <p>The next stage lets you operate real fictional mission systems, weigh alternatives and observe the consequences. Your evidence is knowledge, not a consumable tool.</p>
       </>}
       <div className="rr-lesson-actions">
        <button type="button" onClick={()=>select((active+1)%findings.length)}>NEXT INSIGHT →</button>
        <button type="button" onClick={()=>setTab(tab==='findings'?'application':'findings')}>{tab==='findings'?'HOW COULD I APPLY THIS?':'REVIEW THE EVIDENCE'}</button>
       </div>
      </article>:<p>Your collected records are ready to review. No answers are required.</p>}
     </div>:
     <div className="rr-records" aria-label="Only evidence you already collected">
      {recovered.map(record=><div key={record.id}>
       <small>{record.id} · {record.kind.toUpperCase()}</small>
       <strong>{record.title}</strong>
       <span>{archive.filed[record.id]?'FILED UNDER '+archive.filed[record.id]:'UNFILED · STILL COUNTS TOWARD RESCUE'}</span>
      </div>)}
     </div>}
   </div>
   <footer className="rr-foot">
    <div><small>YOUR RESCUE OBJECTIVE</small><strong>{knowledge.goal}</strong></div>
    <div className="rr-foot-actions">
     <button type="button" className="rr-secondary" onClick={onClose}>RETURN TO FOLDER</button>
     <button type="button" className="rr-start" onClick={begin} disabled={!rescueIsReady(archive,caseId)}>I'M READY · ENTER THE PAST →</button>
    </div>
    {error&&<p className="rr-error" role="alert">{error}</p>}
    <small className="rr-disclaimer">Fictional training scenarios. These conclusions summarize records you recovered; they are not original NASA mission telemetry.</small>
   </footer>
  </section>
 </div>,document.body)
}
