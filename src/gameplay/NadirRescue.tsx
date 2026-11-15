import { useState } from 'react'
import { CASE_META, EVIDENCE_RECORDS } from '../archive/evidenceRecords'
import { DIAGNOSIS_PROMPTS, countRequiredEvidence, diagnosisIsSupported, rescueIsReady, submitDiagnosis, updateDiagnosis, type CaseDiagnosis, type DiagnosticPart } from '../archive/archiveState'
import { navigateGame } from '../gameNavigation'
import { playGameSound } from '../audio/gameAudio'
import { verifyRescuePlan } from './nadirEngine'
import { updateArchive, updateNadir, useArchiveSave, useNadirSave } from './gameSave'
import './nadirRescue.css'

const PARTS:readonly DiagnosticPart[]=['technical','process','consequence']
const EMPTY:CaseDiagnosis={
 technical:{answer:'',evidenceId:''},process:{answer:'',evidenceId:''},consequence:{answer:'',evidenceId:''}
}
type Plan={canonical:string;converter:string;guard:string;first:string;second:string}
const INITIAL:Plan={canonical:'',converter:'',guard:'',first:'',second:''}
export default function NadirRescue(){
 const archive=useArchiveSave()
 const progress=useNadirSave()
 const required=countRequiredEvidence(archive,'NAD')
 const unlocked=rescueIsReady(archive,'NAD')
 const diagnosed=diagnosisIsSupported(archive,'NAD')
 const [draft,setDraft]=useState<CaseDiagnosis>(archive.diagnosis.NAD??EMPTY)
 const [plan,setPlan]=useState<Plan>(INITIAL)
 const [message,setMessage]=useState('')
 const [testResults,setTestResults]=useState<string[]>([])
 const completed=progress.rescue.rerunPassed&&unlocked
 const sources=EVIDENCE_RECORDS.filter(e=>e.caseId==='NAD'&&e.required&&archive.filed[e.id]==='NAD')
 function amend(part:DiagnosticPart,key:'answer'|'evidenceId',value:string){
  setDraft(s=>({...s,[part]:{...s[part],[key]:value}}));setMessage('')
 }
 function submitReview(){
  const next=updateArchive(s=>submitDiagnosis(updateDiagnosis(s,'NAD',draft),'NAD'))
  const supported=diagnosisIsSupported(next,'NAD')
  playGameSound(supported?'terminal':'error')
  setMessage(supported
    ?'EVIDENCE CHAIN VERIFIED — Engineering reconstruction is now available.'
    :'INCONCLUSIVE REVIEW — At least one causal link is not supported by its cited record. Re-examine the evidence.')
 }
 function tryRerun(){
  if(!diagnosisIsSupported(archive,'NAD'))return
  const result=verifyRescuePlan(plan)
  setTestResults(result.report)
  if(result.passed){
   playGameSound('rescue')
   updateNadir(s=>({...s,rescue:{submitted:true,rerunPassed:true}}))
   setMessage('SIMULATION ACCEPTED: the interface contract and both independent test cases now agree.')
  }else{
   playGameSound('error')
   setMessage('REVIEW REJECTED: one or more engineering verification conditions failed. Inspect the report and rerun.')
  }
 }
 return <main className="nr-root">
  <header className="nr-top"><div><small>THE ASTRAL ARCHIVES / PAST-TIMELINE RESCUE LAB</small><h1>NADIR · INTERFACE REPAIR</h1></div>
   <button onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>← RETURN TO DOSSIERS</button></header>
  <div className="nr-content">
   <section className="nr-summary"><small>MISSION NAD / PHASE B / FICTIONAL ENGINEERING SIMULATION</small>
    <h2>TWO NUMBERS. ONE BROKEN CONTRACT.</h2>
    <p>The original project advanced after an unexplained residual was closed without a reproducible navigation rerun. Before modifying the past, prove the cause and show that a corrected interface survives independent test cases.</p>
    <div className="nr-progress"><span>REQUIRED EVIDENCE</span><strong>{required}/6</strong><div><i style={{width:required/6*100+'%'}}/></div></div>
    <p className="nr-note">Evidence completeness unlocks this workspace. The review board and engineering rerun are challenges INSIDE the Rescue Mission, not extra unlock conditions.</p>
   </section>
   {!unlocked?<section className="nr-work"><h2>ACCESS DENIED · CASE INCOMPLETE</h2><p>Only records correctly filed in Nadir count. Find and file all six required records before engineering access is granted.</p>
    <button onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO EVIDENCE FOLDERS</button></section>
   :<>
    <section className="nr-work">
     <div className="nr-label"><span>PHASE 01</span><strong>CAUSAL REVIEW BOARD</strong><em>{diagnosed?'VERIFIED':'REQUIRES EVIDENCE'}</em></div>
     <p>Establish the technical cause, the process failure, and the consequence. For each conclusion, cite a correctly filed source. A plausible answer unsupported by its citation will not pass.</p>
     {PARTS.map((part,i)=><fieldset key={part} disabled={diagnosed}>
      <legend>{String(i+1).padStart(2,'0')} / {part.toUpperCase()}</legend>
      <label>{DIAGNOSIS_PROMPTS.NAD[part].heading}
       <select value={draft[part].answer} onChange={e=>amend(part,'answer',e.target.value)}>
        <option value="">BUILD A HYPOTHESIS</option>
        {DIAGNOSIS_PROMPTS.NAD[part].choices.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
       </select>
      </label>
      <label>Supporting source
       <select value={draft[part].evidenceId} onChange={e=>amend(part,'evidenceId',e.target.value)}>
        <option value="">CITE REQUIRED EVIDENCE</option>
        {sources.map(e=><option key={e.id} value={e.id}>{e.id} · {e.title}</option>)}
       </select>
      </label>
     </fieldset>)}
     {!diagnosed&&<button className="nr-action" disabled={PARTS.some(p=>!draft[p].answer||!draft[p].evidenceId)} onClick={submitReview}>VERIFY THREE-STEP CAUSAL CHAIN</button>}
     {diagnosed&&<p className="nr-success">REVIEW ACCEPTED — causal claim supported by the filed record.</p>}
    </section>
    <section className={'nr-work '+(!diagnosed?'nr-disabled':'')}>
     <div className="nr-label"><span>PHASE 02</span><strong>PATCH THE INTERFACE</strong><em>{completed?'TESTED':'RUN VERIFICATION'}</em></div>
     <p>Choose a canonical impulse unit and assign exactly one conversion owner. Then calculate the corrected outputs for TWO independent inputs and run the acceptance tests.</p>
     <div className="nr-two">
      <label>Canonical impulse unit<select disabled={!diagnosed||completed} value={plan.canonical} onChange={e=>setPlan(s=>({...s,canonical:e.target.value}))}>
        <option value="">CHOOSE UNIT</option><option value="lbfs">lbf·s</option><option value="ns">N·s</option><option value="n">N</option>
       </select></label>
      <label>Conversion owner<select disabled={!diagnosed||completed} value={plan.converter} onChange={e=>setPlan(s=>({...s,converter:e.target.value}))}>
        <option value="">CHOOSE OWNER</option><option value="none">No conversion</option><option value="producer">Producer/export adapter</option><option value="both">Both teams, undocumented</option>
       </select></label>
     </div>
     <label>Interface acceptance requirement<select disabled={!diagnosed||completed} value={plan.guard} onChange={e=>setPlan(s=>({...s,guard:e.target.value}))}>
       <option value="">DEFINE ACCEPTANCE</option><option value="meeting">Verbal verification</option><option value="automated">Consumer unit check + independent rerun</option><option value="log">No test; retain existing log</option>
     </select></label>
     <div className="nr-test-inputs"><label>CASE A · 12 lbf·s → ? N·s<input disabled={!diagnosed||completed} type="number" step="any" inputMode="decimal" value={plan.first} onChange={e=>setPlan(s=>({...s,first:e.target.value}))} placeholder="Converted impulse"/></label>
      <label>CASE B · 0.8 lbf·s → ? N·s<input disabled={!diagnosed||completed} type="number" step="any" inputMode="decimal" value={plan.second} onChange={e=>setPlan(s=>({...s,second:e.target.value}))} placeholder="Independent test vector"/></label></div>
     <div className="nr-reference">REFERENCE: 1 lbf = 4.448221615 N. Each impulse measurement includes seconds. Numerical tolerance: ±0.02 N·s.</div>
     {diagnosed&&!completed&&<button className="nr-action" disabled={Object.values(plan).some(x=>!x)} onClick={tryRerun}>RUN INDEPENDENT NAVIGATION RECHECK</button>}
     {!!testResults.length&&<div className="nr-report" aria-label="Verification output"><strong>TEST BENCH / RESULTS</strong>{testResults.map(line=><span key={line} className={line.endsWith('PASS')?'passed':'failed'}>{line}</span>)}</div>}
     {completed&&<p className="nr-success">RESCUE SIMULATION VERIFIED — Corrected contract and independently checked unit conversions. This is a fictional engineering outcome, not a NASA mission result.</p>}
    </section>
   </>}
   {message&&<p className="nr-message" role="status">{message}</p>}
   <footer className="nr-foot">CASE {CASE_META.NAD.name.toUpperCase()} / FICTIONAL SIMULATION · ENGINEERING EVIDENCE MUST BE VERIFIED BEFORE RESCUE</footer>
  </div>
 </main>
}
