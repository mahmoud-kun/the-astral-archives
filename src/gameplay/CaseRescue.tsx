import { useState } from 'react'
import { EVIDENCE_RECORDS } from '../archive/evidenceRecords'
import { DIAGNOSIS_PROMPTS, countRequiredEvidence, diagnosisIsSupported, rescueIsReady, submitDiagnosis, updateDiagnosis, type CaseDiagnosis, type DiagnosticPart } from '../archive/archiveState'
import { navigateGame } from '../gameNavigation'
import { playGameSound } from '../audio/gameAudio'
import { updateArchive, useArchiveSave } from './gameSave'
import { REQUIRED_OTHER_IDS, type OtherCaseId } from './caseEvidenceEngine'
import { updateOtherProgress, useOtherProgress } from './caseSave'
import { CASE_RESCUE_COPY, otherRescueCompleted, recordVerifiedRescue, verifyOtherRescue, type RescueEvaluation, type RescueInputs } from './caseRescueEngine'
import CaseInstrument from './CaseInstrument'
import CaseRescueControl from './CaseRescueControl'
import './nadirRescue.css'
import './caseWork.css'

const PARTS:readonly DiagnosticPart[]=['technical','process','consequence']
function emptyReview():CaseDiagnosis{
 return {technical:{answer:'',evidenceId:''},process:{answer:'',evidenceId:''},consequence:{answer:'',evidenceId:''}}
}

export default function CaseRescue({caseId}:{caseId:OtherCaseId}){
 const archive=useArchiveSave()
 const progress=useOtherProgress()
 const content=CASE_RESCUE_COPY[caseId]
 const count=countRequiredEvidence(archive,caseId)
 const unlocked=rescueIsReady(archive,caseId)
 const diagnosed=diagnosisIsSupported(archive,caseId)
 const analysisComplete=REQUIRED_OTHER_IDS.filter(id=>id.startsWith(caseId+'-')).every(id=>progress.solved.includes(id))
 const completed=otherRescueCompleted(archive,progress,caseId)
 const [review,setReview]=useState<CaseDiagnosis>(archive.diagnosis[caseId]??emptyReview())
 const [form,setForm]=useState<RescueInputs>({})
 const [tested,setTested]=useState<{signature:string;result:RescueEvaluation}|null>(null)
 const [message,setMessage]=useState('')
 const sources=EVIDENCE_RECORDS.filter(r=>r.caseId===caseId&&r.required&&archive.filed[r.id]===caseId)
 const filled=content.fields.every(field=>typeof form[field.key]==='string'&&form[field.key].trim().length>0)
 const stillTested=tested?.signature===JSON.stringify(form)
 function amendReview(part:DiagnosticPart,key:'answer'|'evidenceId',value:string){
  setReview(s=>({...s,[part]:{...s[part],[key]:value}}))
  setMessage('')
 }
 function submitReview(){
  if(!unlocked||!analysisComplete)return
  const next=updateArchive(s=>submitDiagnosis(updateDiagnosis(s,caseId,review),caseId))
  const valid=diagnosisIsSupported(next,caseId)
  playGameSound(valid?'terminal':'error')
  setMessage(valid
   ?'The three-link causal chain is supported. Engineering intervention is now available.'
   :'The causal chain has an unsupported claim or citation. Re-examine the inspected records.')
 }
 function change(key:string,value:string){
  setForm(s=>({...s,[key]:value}))
  setTested(null)
  setMessage('')
 }
 function runVerification(){
  if(!unlocked||!analysisComplete||!diagnosed||!filled)return
  const result=verifyOtherRescue(caseId,form)
  setTested({signature:JSON.stringify(form),result})
  playGameSound(result.pass?'terminal':'error')
  setMessage(result.pass
   ?'SIMULATED TEST VECTORS PASSED. The review board can now consider this documented design change.'
   :'TEST REJECTED. Review each independent result; revise and run the simulation again.')
 }
 function signDecision(){
  if(!unlocked||!analysisComplete||!diagnosed||!stillTested||!tested.result.pass)return
  const next=updateOtherProgress(s=>recordVerifiedRescue(s,caseId,form))
  const valid=otherRescueCompleted(archive,next,caseId)
  playGameSound(valid?'rescue':'error')
  setMessage(valid
   ?'ALTERNATE BRANCH ACCEPTED / '+tested.result.artifactId+' / Independent tests preserved in the simulation.'
   :'The rescue prerequisites changed; restore the required evidence and rerun.')
 }
 return <main className="nr-root cw-rescue">
  <header className="nr-top"><div><small>THE ASTRAL ARCHIVES / {caseId==='AST'?'CURRENT DEVELOPMENT REVIEW':'ALTERNATE TIMELINE RESCUE'}</small>
   <h1>{caseId} · {content.title}</h1></div>
   <button type="button" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO DOSSIERS</button>
  </header>
  <div className="nr-content">
   <section className="nr-summary"><small>{caseId} / {content.phase} / FICTIONAL ENGINEERING SIMULATION</small>
    <h2>{content.scene}</h2><p>{content.lead}</p>
    <div className="nr-progress"><span>REQUIRED, CORRECTLY FILED</span><strong>{count}/6</strong>
     <div><i style={{width:count/6*100+'%'}}/></div></div>
    <p className="nr-note">Six filed records unlock Rescue. A supported diagnosis and independently tested design are verified INSIDE this workstation.</p>
    <p className="cw-limit"><strong>SCIENTIFIC BOUNDARY</strong>{content.limitations}</p>
    {unlocked&&<CaseInstrument caseId={caseId} plan={form}/>}
   </section>
   {!unlocked?<section className="nr-work"><h2>RESCUE LOCKED</h2><p>There are only {count} of six correctly filed required records. Return to the physical mission folders. Incorrect filing is retained silently and can be moved without penalty.</p>
    <button type="button" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>OPEN MISSION FOLDERS</button>
   </section>:<>
    <section className="nr-work">
     <div className="nr-label"><span>01 / BOARD</span><strong>TRACE THE CAUSAL CHAIN</strong><em>{diagnosed?'VERIFIED':'NEEDS EVIDENCE'}</em></div>
     <p>The engineering fault, review failure and consequence are separate claims. Link each to a real collected record; a plausible guess without its citation will not be accepted.</p>
     {!analysisComplete&&<p className="cw-caution" role="status">ANALYSIS NOT COMPLETE. The six records were filed, but at least one source has not passed its physical station analyzer. Return to that evidence; direct debug intake must never substitute for verification.</p>}
     {PARTS.map((part,i)=><fieldset key={part} disabled={diagnosed||!analysisComplete}>
      <legend>{String(i+1).padStart(2,'0')} / {part.toUpperCase()}</legend>
      <label>{DIAGNOSIS_PROMPTS[caseId][part].heading}<select value={review[part].answer} onChange={e=>amendReview(part,'answer',e.target.value)}>
       <option value="">FORM A TESTABLE HYPOTHESIS</option>
       {DIAGNOSIS_PROMPTS[caseId][part].choices.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
      </select></label>
      <label>Evidence supporting this conclusion<select value={review[part].evidenceId} onChange={e=>amendReview(part,'evidenceId',e.target.value)}>
       <option value="">CITE A VERIFIED RECORD</option>
       {sources.map(record=><option key={record.id} value={record.id}>{record.id} · {record.title}</option>)}
      </select></label>
     </fieldset>)}
     {!diagnosed&&<button className="nr-action" type="button" disabled={!analysisComplete||PARTS.some(p=>!review[p].answer||!review[p].evidenceId)} onClick={submitReview}>SUBMIT EVIDENCE-BACKED DIAGNOSIS</button>}
     {diagnosed&&<p className="nr-success">CAUSAL CHAIN CONFIRMED · Independent engineering verification can begin.</p>}
    </section>
    <section className={'nr-work '+(!diagnosed?'nr-disabled':'')}>
     <div className="nr-label"><span>02 / REPLAY</span><strong>RECONFIGURE & TEST</strong><em>{completed?'ACCEPTED':'VERIFICATION REQUIRED'}</em></div>
     <p>Every setting changes the fictional engineering scenario. Run the replay, read individual results and only then present the review recommendation.</p>
     <div className="cw-rescue-fields">{content.fields.map(field=><CaseRescueControl
      key={field.key} caseId={caseId} field={field} value={form[field.key]??''}
      disabled={!diagnosed||completed} onChange={value=>change(field.key,value)}/>)}</div>
     {diagnosed&&!completed&&<button className="nr-action" type="button" disabled={!filled} onClick={runVerification}>RUN FULL ENGINEERING TEST SUITE</button>}
     {tested&&stillTested&&<div className="nr-report" aria-label="Simulated independent engineering test output">
      <strong>SIMULATED TEST ARTIFACT / {tested.result.artifactId}</strong>
      {tested.result.reports.map(report=><div className={'cw-test-result '+(report.pass?'passed':'failed')} key={report.name}>
       <b>{report.pass?'PASS':'FAIL'} · {report.name}</b><span>{report.detail}</span>
      </div>)}
     </div>}
     {tested&&stillTested&&tested.result.pass&&!completed&&<button className="nr-action" type="button" onClick={signDecision}>SUBMIT ENGINEERING REVIEW DECISION</button>}
     {completed&&<div className="cw-outcome" role="status"><strong>ALTERNATE BRANCH / VERIFIED IN SIMULATION</strong><p>{content.completion}</p><p>{content.limitations}</p>
      <button className="nr-action" type="button" onClick={()=>navigateGame('/?folder-lab=1&return=investigation')}>RETURN TO CASE FILES</button></div>}
    </section>
   </>}
   {message&&<p className="nr-message" role="status">{message}</p>}
   <footer className="nr-foot">{caseId} / FICTIONAL SIMULATION · HISTORICAL NASA FAILURES ARE REFERENCES, NOT EDITABLE TELEMETRY OR DIRECTLY RECREATED EVENTS.</footer>
  </div>
 </main>
}
