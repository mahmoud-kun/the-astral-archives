import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { discoverEvidence } from '../archive/archiveState'
import { findEvidence } from '../archive/evidenceRecords'
import { playGameSound } from '../audio/gameAudio'
import { updateArchive, useArchiveSave } from './gameSave'
import { CASE_EVIDENCE_TASKS, hintOther, inspectOther, solveOther, type CaseAnswer, type OtherRecordId } from './caseEvidenceEngine'
import { updateOtherProgress, useOtherProgress } from './caseSave'
import CaseInstrument from './CaseInstrument'
import './nadirPuzzle.css'
import './caseWork.css'

export default function CasePuzzle({id,onClose}:{id:OtherRecordId;onClose:()=>void}){
 const task=CASE_EVIDENCE_TASKS[id]
 const record=findEvidence(id)
 const progress=useOtherProgress()
 const archive=useArchiveSave()
 const solved=progress.solved.includes(id)
 const collected=archive.discovered.includes(id)
 const [answer,setAnswer]=useState<CaseAnswer>({})
 const [submitted,setSubmitted]=useState(false)
 const [message,setMessage]=useState('')
 const [step,setStep]=useState<'inspect'|'analyze'>('inspect')
 const dialogRef=useRef<HTMLElement>(null)
 const scrollRef=useRef<HTMLDivElement>(null)
 const closeRef=useRef<HTMLButtonElement>(null)
 const onCloseRef=useRef(onClose)
 onCloseRef.current=onClose
 useEffect(()=>{updateOtherProgress(p=>inspectOther(p,id))},[id])
 useEffect(()=>{
  const before=document.activeElement instanceof HTMLElement?document.activeElement:null
  closeRef.current?.focus()
  const escape=(event:globalThis.KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onCloseRef.current()}
  }
  window.addEventListener('keydown',escape,true)
  return ()=>{window.removeEventListener('keydown',escape,true);before?.focus()}
 },[])
 function handleDialogKey(event:KeyboardEvent<HTMLElement>){
  if(event.key!=='Tab')return
  const controls=[...(dialogRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), select:not(:disabled), summary, a[href]')??[])]
    .filter(el=>el.getClientRects().length>0)
  if(!controls.length)return
  const first=controls[0],last=controls[controls.length-1]
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 }
 const missing=task.requires.filter(req=>!progress.solved.includes(req))
 const attempts=progress.attempts[id]??0
 const hints=progress.hints[id]??0
 const available=attempts>=4?2:attempts>=2?1:0
 const ready=missing.length===0&&task.fields.every(field=>answer[field.key]?.trim())
 function chooseStep(next:'inspect'|'analyze'){
  setStep(next)
  if(scrollRef.current)scrollRef.current.scrollTop=0
 }
 function submit(event:FormEvent){
  event.preventDefault()
  if(!ready||solved)return
  const result=solveOther(progress,id,answer)
  updateOtherProgress(()=>result.next)
  setSubmitted(true)
  setMessage(result.reason)
  playGameSound(result.ok?'terminal':'error')
 }
 function collect(){
  if(!solved||collected)return
  updateArchive(state=>discoverEvidence(state,id))
  playGameSound('evidence')
  setMessage('This verified record is now UNFILED. You choose which Mission Folder receives it.')
 }
 function setField(key:string,value:string){
  setAnswer(a=>({...a,[key]:value}))
  setSubmitted(false);setMessage('')
 }
 return createPortal(<div className="np-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose()}}>
  <section className="np-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cw-puzzle-title" onKeyDown={handleDialogKey}>
   <header className="np-head">
    <div><small>THE ASTRAL ARCHIVES / EVIDENCE ANALYZER</small><strong id="cw-puzzle-title">{id} · {record?.title??'Investigation'}</strong></div>
    <button type="button" ref={closeRef} data-sfx="panelClose" aria-label="Close evidence analyzer" onClick={onClose}>BACK TO ROOM ×</button>
   </header>
   <div ref={scrollRef} className={'np-scroll np-step-'+step}>
    <div className="np-meta"><span>{task.room.toUpperCase()} / {id.slice(0,3)}</span><span>FICTIONAL SIMULATION</span></div>
    <h2>{task.optional?'FOLLOW THE MEMORY':'RECONSTRUCT THE EVIDENCE'}</h2>
    <p className="np-objective">{task.objective}</p>
    <nav className="np-mobile-steps" aria-label="Evidence analyzer steps">
     <button type="button" className={step==='inspect'?'current':''} aria-current={step==='inspect'?'step':undefined} onClick={()=>chooseStep('inspect')}><span>01</span> INSPECT</button>
     <button type="button" className={step==='analyze'?'current':''} aria-current={step==='analyze'?'step':undefined} onClick={()=>chooseStep('analyze')}><span>02</span> ANALYZE</button>
    </nav>
    <div className={'np-columns np-mobile-'+step}>
     <section className="np-sources">
      <h3>{task.optional?'MEMORY FRAGMENT':'CASE INSTRUMENT'}</h3>
      <p className="cw-scene">{task.scene}</p>
      <CaseInstrument caseId={id.slice(0,3) as 'KES'|'LUM'|'ORI'|'AST'} plan={answer}/>
      <details className="np-source-drawer">
       <summary><span>OPEN RECORD FRAGMENTS</span><small>{task.fragments.length} INSPECTABLE SIGNALS</small></summary>
       <div className="np-source-drawer-body">{task.fragments.map((text,i)=>
        <div className="np-fragment" key={i}><b>TRACE {String(i+1).padStart(2,'0')}</b><p>{text}</p></div>)}</div>
      </details>
      {task.optional&&<p className="cw-caution">SUBJECTIVE RECONSTRUCTION · This clue cannot independently prove a technical cause or personal responsibility.</p>}
      <details className="np-source-drawer np-method"><summary><span>SCIENTIFIC METHOD</span><small>OPTIONAL REFERENCE</small></summary>
       <div className="np-source-drawer-body"><p className="cw-method">Separate observations from claims. Reconcile units, process timestamps and the conditions of any test before you declare an anomaly closed.</p></div>
      </details>
     </section>
     <section className="np-workbench">
      <h3>RECONSTRUCTION / ACTIVE WORKBENCH</h3>
      {missing.length>0&&<div className="np-dependency" role="status"><b>CORRELATED EVIDENCE REQUIRED</b><p>Check {missing.join(', ')} before verifying this record. You may inspect these sources now, but cannot certify a dependent inference in isolation.</p></div>}
      <form id={'cw-analyze-'+id} onSubmit={submit}>
       {task.fields.map(field=><label className="np-field" key={field.key}><span>{field.label}</span>
        {field.kind==='number'?<input type="number" inputMode="decimal" step="any" value={answer[field.key]??''} onChange={e=>setField(field.key,e.target.value)} disabled={solved||missing.length>0} aria-label={field.label+' ('+field.unit+')'}/>
         :<select value={answer[field.key]??''} onChange={e=>setField(field.key,e.target.value)} disabled={solved||missing.length>0}>
          <option value="">CHOOSE YOUR INTERPRETATION</option>
          {field.choices.map(([value,label])=><option key={value} value={value}>{label}</option>)}
         </select>}
       </label>)}
       {!solved&&<button type="submit" className="np-primary np-form-submit" disabled={!ready}>VERIFY RECONSTRUCTION</button>}
      </form>
      {submitted&&!solved&&message&&<p className="np-error" role="status">{message} · Attempt {attempts}</p>}
      {solved&&<div className="np-success" role="status"><strong>EVIDENCE VERIFIED</strong><p>{task.reveal}</p><p>Collection is a separate action. The archive will not file this record automatically.</p></div>}
      <div className="np-hint-zone"><strong>ASSISTANCE / EARNED FROM ATTEMPTS</strong>
       <p>Retry freely. The first hint becomes available after two attempts; the second after four.</p>
       {hints>0&&<div className="np-hints">{task.clues.slice(0,hints).map((hint,i)=><p key={i}><b>HINT {i+1}</b>{hint}</p>)}</div>}
       {!solved&&hints<2&&<button className="np-secondary" type="button" disabled={hints>=available} onClick={()=>updateOtherProgress(s=>hintOther(s,id))}>{hints>=available?'HINT LOCKED · TRY THE EVIDENCE':'UNLOCK NEXT HINT'}</button>}
      </div>
     </section>
    </div>
   </div>
   <footer className={'np-foot'+(!solved||collected?' np-foot-nonaction':'')+(step==='analyze'?' np-step-analyze':'')}>
    <span>{collected?'COLLECTED · MOVE FREELY BETWEEN FOLDERS':solved?'VERIFIED · READY TO COLLECT':'INVESTIGATION IN PROGRESS'}</span>
    {!solved&&<button type="submit" form={'cw-analyze-'+id} className="np-primary np-mobile-verify" disabled={!ready}>VERIFY RECONSTRUCTION</button>}
    {solved&&!collected&&<button type="button" className="np-primary" data-sfx="none" onClick={collect}>COLLECT EVIDENCE · {id}</button>}
    {collected&&<strong>EVIDENCE COLLECTED</strong>}
    <button type="button" className="np-secondary" data-sfx="panelClose" onClick={onClose}>RETURN TO STATION</button>
   </footer>
  </section>
 </div>,document.body)
}
