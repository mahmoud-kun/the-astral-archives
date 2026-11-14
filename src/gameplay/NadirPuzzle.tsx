import { useEffect, useState, type FormEvent } from 'react'
import { discoverEvidence } from '../archive/archiveState'
import { findEvidence } from '../archive/evidenceRecords'
import { hintNadir, inspectNadir, NADIR_CHALLENGES, solveNadir, type NadirAnswer, type NadirRecord } from './nadirEngine'
import { updateArchive, updateNadir, useArchiveSave, useNadirSave } from './gameSave'
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

export default function NadirPuzzle({id,onClose}:{id:NadirRecord;onClose:()=>void}){
 const challenge=NADIR_CHALLENGES[id]
 useEffect(()=>{updateNadir(current=>inspectNadir(current,id))},[id])
 const record=findEvidence(id)
 const archive=useArchiveSave()
 const progress=useNadirSave()
 const solved=progress.solved.includes(id)
 const collected=archive.discovered.includes(id)
 const [answer,setAnswer]=useState<NadirAnswer>({})
 const [feedback,setFeedback]=useState('')
 const [submitted,setSubmitted]=useState(false)
 const locked=challenge.requires.filter(prerequisite=>!progress.solved.includes(prerequisite))
 const attempts=progress.attempts[id]??0
 const hintCount=progress.hints[id]??0
 const possibleHints=attempts>=4?2:attempts>=2?1:0

 function submit(event:FormEvent){
  event.preventDefault()
  if(locked.length)return
  const result=solveNadir(progress,id,answer)
  updateNadir(()=>result.next)
  setSubmitted(true)
  setFeedback(result.reason)
 }
 function collect(){
  if(!solved||collected)return
  updateArchive(state=>discoverEvidence(state,id))
  setFeedback('Evidence stored in UNFILED. Decide which mission dossier it belongs to.')
 }
 function change(key:string,value:string){
  setAnswer(old=>({...old,[key]:value}))
  setSubmitted(false)
  setFeedback('')
 }
 const corrected=id==='NAD-01'&&solved

 return <div className="np-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}>
  <section className="np-dialog" role="dialog" aria-modal="true" aria-labelledby="np-title">
   <header className="np-head">
    <div><small>THE ASTRAL ARCHIVES / INVESTIGATIVE ANALYZER</small><strong id="np-title">{id} · {record?.title??'Record'}</strong></div>
    <button onClick={onClose} aria-label="Close evidence analyzer">BACK TO ROOM ×</button>
   </header>
   <div className="np-scroll">
    <div className="np-meta"><span>{challenge.discipline}</span><span>FICTIONAL SIMULATION</span></div>
    <h2>BUILD YOUR CASE</h2>
    <p className="np-objective">{challenge.objective}</p>
    <div className="np-columns">
     <section className="np-sources">
      <h3>RAW RECORDS · READ FIRST</h3>
      {challenge.fragments.map((line,i)=><div className="np-fragment" key={line}><b>FILE {String(i+1).padStart(2,'0')}</b><p>{line}</p></div>)}
      {(id==='NAD-01'||id==='NAD-02')&&<TrajectorySketch corrected={corrected}/>}
      <div className="np-educational"><b>ANALYTICAL NOTE</b><p>Evidence may contain a legitimate observation and an unsupported interpretation. Verify the chain; don't simply choose the most convincing phrase.</p></div>
     </section>
     <section className="np-workbench">
      <h3>WORKBENCH · ENTER YOUR RECONSTRUCTION</h3>
      {locked.length>0?<div className="np-dependency" role="status">
       <b>DEPENDENCY NOT RESOLVED</b>
       <p>Complete the correlated investigation: {locked.join(', ')}. The record can be inspected now, but it cannot be validated until you have the supporting analysis.</p>
      </div>:null}
      <form onSubmit={submit}>
       {challenge.fields.map(field=><label className="np-field" key={field.key}><span>{field.label}</span>
         {field.type==='number'
           ?<input type="number" inputMode="decimal" step="any" value={answer[field.key]??''} placeholder={field.placeholder??''} onChange={e=>change(field.key,e.target.value)} disabled={solved||locked.length>0}/>
           :<select value={answer[field.key]??''} onChange={e=>change(field.key,e.target.value)} disabled={solved||locked.length>0}>
            {field.choices?.map(opt=><option key={opt.value} value={opt.value}>{opt.label}</option>)}
           </select>}
       </label>)}
       {!solved&&<button className="np-primary" type="submit" disabled={locked.length>0||challenge.fields.some(field=>!answer[field.key]?.trim())}>VERIFY ANALYSIS</button>}
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
   <footer className="np-foot">
    <span>{collected?'COLLECTED · UNFILED OR FILED':solved?'READY FOR COLLECTION':'ANALYSIS IN PROGRESS'}</span>
    {solved&&!collected&&<button className="np-primary" onClick={collect}>COLLECT EVIDENCE · {id}</button>}
    {collected&&<strong>✓ EVIDENCE COLLECTED</strong>}
    <button className="np-secondary" onClick={onClose}>RETURN TO STATION</button>
   </footer>
  </section>
 </div>
}
