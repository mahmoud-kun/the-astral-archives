import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { discoverEvidence } from '../archive/archiveState'
import { findEvidence } from '../archive/evidenceRecords'
import { hintNadir, inspectNadir, NADIR_CHALLENGES, solveNadir, type NadirAnswer, type NadirRecord } from './nadirEngine'
import { updateArchive, updateNadir, useArchiveSave, useNadirSave } from './gameSave'
import EvidenceMachine from './EvidenceMachine'
import { playGameSound } from '../audio/gameAudio'
import './nadirPuzzle.css'

function TrajectorySketch({ corrected }: {corrected:boolean}) {
 return <div className="np-chart" aria-label="Schematic comparison of two simulated trajectory outputs">
  <div className="np-chart-head"><span>SIMULATED TRACK OVERLAY</span><span>NOT NASA FLIGHT DATA</span></div>
  <svg viewBox="0 0 520 146" role="img" aria-label={corrected?'Corrected trajectories converge':'Unit-mismatched trajectories diverge'}>
   <g stroke="#668094" opacity=".3" strokeWidth="1">
    <path d="M40 14V130H505M40 40H505M40 72H505M40 104H505M125 14V130M225 14V130M325 14V130M425 14V130"/>
   </g>
   <path d="M40 112C110 101 174 79 237 69S364 41 500 35" fill="none" stroke="#70d4e5" strokeWidth="3"/>
   <path d={corrected?'M40 114C110 103 174 81 237 70S364 42 500 36':'M40 114C110 107 174 99 237 94S364 103 500 115'} fill="none" stroke="#e6a874" strokeWidth="3" strokeDasharray="8 6"/>
   <g fill="#d5e3e9" fontSize="11" fontFamily="monospace"><text x="8" y="15">Δ</text><text x="459" y="143">MODEL t</text></g>
  </svg>
  <div className="np-chart-legend"><span><i className="np-swatch-cyan"/> GROUND MODEL A</span><span><i className="np-swatch-gold"/> SPACECRAFT MODEL B</span></div>
  <small>{corrected?'Corrected equal-impulse model selected — schematic reconciliation':'Two models received incompatible impulse interpretations — schematic divergence'}</small>
 </div>
}

const TIMELINE_EVENTS = [
 {id:'export',label:'Impulse packet exported'},
 {id:'residual',label:'Navigation residual observed'},
 {id:'email',label:'Engineer requests a cross-check'},
 {id:'closure',label:'NAV-042 ticket marked closed'},
] as const
const INITIAL_TIMELINE = ['closure','email','export','residual']

export default function NadirPuzzle({id,onClose}:{id:NadirRecord;onClose:()=>void}){
 const challenge=NADIR_CHALLENGES[id]
 useEffect(()=>{updateNadir(current=>inspectNadir(current,id))},[id])
 const record=findEvidence(id)
 const archive=useArchiveSave()
 const progress=useNadirSave()
 const solved=progress.solved.includes(id)
 const collected=archive.discovered.includes(id)
 const initialAnswer: NadirAnswer = id==='NAD-05'
  ? {first:INITIAL_TIMELINE[0],second:INITIAL_TIMELINE[1],third:INITIAL_TIMELINE[2],fourth:INITIAL_TIMELINE[3]} : {}
 const [answer,setAnswer]=useState<NadirAnswer>(initialAnswer)
 const [timeline,setTimeline]=useState<string[]>([...INITIAL_TIMELINE])
 const [replayMode,setReplayMode]=useState<'unrun'|'raw'|'corrected'>('unrun')
 const [feedback,setFeedback]=useState('')
 const [submitted,setSubmitted]=useState(false)
 const [mobileStep,setMobileStep]=useState<'inspect'|'analyze'>('inspect')
 const closeButtonRef=useRef<HTMLButtonElement>(null)
 const workScrollRef=useRef<HTMLDivElement>(null)
 const latestCloseRef=useRef(onClose)
 latestCloseRef.current=onClose
 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement ? document.activeElement : null
  closeButtonRef.current?.focus()
  const escape=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){
    event.preventDefault()
    event.stopPropagation()
    latestCloseRef.current()
   }
  }
  window.addEventListener('keydown',escape,true)
  return ()=>{window.removeEventListener('keydown',escape,true);previous?.focus()}
 },[])
 function chooseMobileStep(step:'inspect'|'analyze'){
  setMobileStep(step)
  if(workScrollRef.current)workScrollRef.current.scrollTop=0
 }

 const locked=challenge.requires.filter(prerequisite=>!progress.solved.includes(prerequisite))
 const attempts=progress.attempts[id]??0
 const hintCount=progress.hints[id]??0
 const possibleHints=attempts>=4?2:attempts>=2?1:0
 const cannotVerify=locked.length>0||challenge.fields.some(field=>!answer[field.key]?.trim())||
  (id==='NAD-01'&&(!answer.rawReplay||!answer.correctedReplay))

 function submit(event:FormEvent){
  event.preventDefault()
  if(locked.length)return
  const result=solveNadir(progress,id,answer)
  updateNadir(()=>result.next)
  setSubmitted(true)
  setFeedback(result.reason)
  playGameSound(result.ok?'terminal':'error')
 }
 function collect(){
  if(!solved||collected)return
  updateArchive(state=>discoverEvidence(state,id))
  playGameSound('evidence')
  setFeedback('Evidence stored in UNFILED. Decide which mission dossier it belongs to.')
 }
 function change(key:string,value:string){
  setAnswer(old=>key==='rerun'?{...old,[key]:value,correctedReplay:''}:{...old,[key]:value})
  if(key==='rerun')setReplayMode(v=>v==='corrected'?'raw':v)
  setSubmitted(false)
  setFeedback('')
 }
 function replayTrajectory(mode:'raw'|'corrected'){
  if(id!=='NAD-01'||solved||locked.length>0)return
  if(mode==='corrected'&&answer.rawReplay!=='completed')return
  if(mode==='corrected'&&(!answer.rerun?.trim()||!Number.isFinite(Number(answer.rerun))))return
  setReplayMode(mode)
  setAnswer(old=>({...old,[mode==='raw'?'rawReplay':'correctedReplay']:'completed'}))
  setSubmitted(false)
  setFeedback('')
 }
 function moveTimeline(index:number,delta:number){
  const target=index+delta
  if(target<0||target>=timeline.length||solved||locked.length>0)return
  const order=[...timeline];[order[index],order[target]]=[order[target],order[index]]
  setTimeline(order)
  setAnswer(old=>({...old,first:order[0],second:order[1],third:order[2],fourth:order[3]}))
  setSubmitted(false);setFeedback('')
 }
 const referenceImpulse=53.37865938
 const candidateImpulse=Number(answer.rerun)
 const corrected=id==='NAD-01'&&(solved||(replayMode==='corrected'&&Number.isFinite(candidateImpulse)&&Math.abs(candidateImpulse-referenceImpulse)<=.02))

 return createPortal(<div className="np-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="np-dialog" role="dialog" aria-modal="true" aria-labelledby="np-title">
   <header className="np-head">
    <div><small>THE ASTRAL ARCHIVES / INVESTIGATIVE ANALYZER</small><strong id="np-title">{id} · {record?.title??'Record'}</strong></div>
    <button ref={closeButtonRef} data-sfx="panelClose" onClick={onClose} aria-label="Close evidence analyzer">BACK TO ROOM ×</button>
   </header>
   <div ref={workScrollRef} className={'np-scroll np-step-'+mobileStep}>
    <div className="np-meta"><span>{challenge.discipline}</span><span>FICTIONAL SIMULATION</span></div>
    <h2>BUILD YOUR CASE</h2>
    <p className="np-objective">{challenge.objective}</p>
    <nav className="np-mobile-steps" aria-label="Investigation workstation steps">
     <button type="button" aria-current={mobileStep==='inspect'?'step':undefined} className={mobileStep==='inspect'?'current':''} onClick={()=>chooseMobileStep('inspect')}>
      <span>01</span> INSPECT INSTRUMENT
     </button>
     <button type="button" aria-current={mobileStep==='analyze'?'step':undefined} className={mobileStep==='analyze'?'current':''} onClick={()=>chooseMobileStep('analyze')}>
      <span>02</span> RUN ANALYSIS
     </button>
    </nav>
    <div className={'np-columns np-mobile-'+mobileStep}>
     <section className="np-sources">
      <h3>INVESTIGATION INSTRUMENT</h3>
      <EvidenceMachine id={id} answer={answer} onChange={change} disabled={solved||locked.length>0}/>
      <details className="np-source-drawer">
       <summary><span>OPEN PRIMARY RECORDS</span><small>{challenge.fragments.length} SOURCE FRAGMENTS</small></summary>
       <div className="np-source-drawer-body">
        {challenge.fragments.map((line,i)=><div className="np-fragment" key={line}><b>FILE {String(i+1).padStart(2,'0')}</b><p>{line}</p></div>)}
       </div>
      </details>
      {id==='NAD-01'&&<TrajectorySketch corrected={corrected}/>}
      {id==='NAD-01'&&<div className="np-replay" aria-label="Interactive trajectory comparison console">
       <strong>REPLAY CONSOLE · TWO RUNS REQUIRED</strong>
       <div>
        <button type="button" onClick={()=>replayTrajectory('raw')} disabled={solved||locked.length>0}>RUN BASELINE MODEL</button>
        <button type="button" onClick={()=>replayTrajectory('corrected')}
         disabled={solved||locked.length>0||answer.rawReplay!=='completed'||!answer.rerun?.trim()}>
         RUN MODEL WITH MY IMPULSE
        </button>
       </div>
       <small role="status">{solved?'REPLAY VERIFIED':replayMode==='unrun'
        ?'Start with the baseline, calculate a corrected impulse in the workbench, then rerun.'
        :replayMode==='raw'?'BASELINE RECORDED · Enter a physically equivalent impulse and rerun.'
        :corrected?'REPLAY RECORDED · The simulated tracks now converge.'
        :'REPLAY RECORDED · Tracks still diverge. Recheck your converted input and repeat.'}</small>
      </div>}
      <details className="np-source-drawer np-method">
       <summary><span>INVESTIGATION METHOD</span><small>OPTIONAL REFERENCE</small></summary>
       <div className="np-educational"><b>SCIENCE NOTE</b><p>Evidence may contain a legitimate observation and an unsupported interpretation. Verify the chain and reproduce the measurement before choosing a conclusion.</p></div>
      </details>
     </section>
     <section className="np-workbench">
      <h3>WORKBENCH · ENTER YOUR RECONSTRUCTION</h3>
      {locked.length>0?<div className="np-dependency" role="status">
       <b>DEPENDENCY NOT RESOLVED</b>
       <p>Complete the correlated investigation: {locked.join(', ')}. The record can be inspected now, but it cannot be validated until you have the supporting analysis.</p>
      </div>:null}
      <form id={'np-analyze-'+id} onSubmit={submit}>
       {id==='NAD-05'?<div className="np-timeline" aria-label="Reconstruct the historical order using move buttons">
         <p>MOVE THE EVENTS INTO CAUSAL ORDER. The order you build is submitted as your evidence timeline.</p>
         {timeline.map((eventId,index)=>{
          const event=TIMELINE_EVENTS.find(item=>item.id===eventId)
          return <div className="np-timeline-event" key={eventId}>
           <b>{String(index+1).padStart(2,'0')}</b>
           <span>{event?.label}</span>
           <button type="button" onClick={()=>moveTimeline(index,-1)} disabled={index===0||solved||locked.length>0} aria-label={'Move '+event?.label+' earlier'}>↑</button>
           <button type="button" onClick={()=>moveTimeline(index,1)} disabled={index===timeline.length-1||solved||locked.length>0} aria-label={'Move '+event?.label+' later'}>↓</button>
          </div>
         })}
        </div>:challenge.fields.map(field=>{
         const instrumentControlled=(id==='NAD-04'&&(field.key==='producer'||field.key==='consumer'))||
           (id==='NAD-03'&&(field.key==='owner'||field.key==='canonical'))
         if(instrumentControlled)return null
         return <label className="np-field" key={field.key}><span>{field.label}</span>
         {field.type==='number'
           ?<input type="number" inputMode="decimal" step="any" value={answer[field.key]??''} placeholder={field.placeholder??''} onChange={e=>change(field.key,e.target.value)} disabled={solved||locked.length>0}/>
           :<select value={answer[field.key]??''} onChange={e=>change(field.key,e.target.value)} disabled={solved||locked.length>0}>
            {field.choices?.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}
           </select>}
       </label>})}
       {!solved&&<button className="np-primary np-form-submit" type="submit" disabled={cannotVerify}>VERIFY ANALYSIS</button>}
      </form>
      {submitted&&!solved&&feedback&&<p className="np-error" role="status">{feedback} · Attempt {attempts}</p>}
      {solved&&<div className="np-success" role="status"><strong>ANALYSIS VERIFIED</strong><p>You've reconstructed the evidence chain. Collection is a separate, deliberate step.</p></div>}
      <div className="np-hint-zone">
       <strong>FIELD ASSISTANCE</strong>
       <p>Hints unlock only after attempts. You can retry without penalties.</p>
       {hintCount>0&&<div className="np-hints">{challenge.clues.slice(0,hintCount).map((h,i)=><p key={i}><b>HINT {i+1}</b> {h}</p>)}</div>}
       {!solved&&hintCount<2&&<button className="np-secondary" disabled={hintCount>=possibleHints} onClick={()=>updateNadir(s=>hintNadir(s,id))} type="button">
        {hintCount>=possibleHints?'HINT LOCKED · TRY THE ANALYSIS':'UNLOCK NEXT HINT'}
       </button>}
      </div>
     </section>
    </div>
   </div>
   <footer className={'np-foot'+(!solved||collected?' np-foot-nonaction':'')+(mobileStep==='analyze'?' np-step-analyze':'')}>
    <span>{collected?'COLLECTED · UNFILED OR FILED':solved?'READY FOR COLLECTION':'ANALYSIS IN PROGRESS'}</span>
    {!solved&&<button type="submit" form={'np-analyze-'+id} disabled={cannotVerify} className="np-primary np-mobile-verify">VERIFY ANALYSIS</button>}
    {solved&&!collected&&<button className="np-primary" data-sfx="none" onClick={collect}>COLLECT EVIDENCE · {id}</button>}
    {collected&&<strong>✓ EVIDENCE COLLECTED</strong>}
    <button className="np-secondary" data-sfx="panelClose" onClick={onClose}>RETURN TO STATION</button>
   </footer>
  </section>
 </div>, document.body)
}
