import test from 'node:test'
import assert from 'node:assert/strict'
import { EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import { DIAGNOSIS_PROMPTS, countRequiredEvidence, diagnosisIsSupported, discoverEvidence, emptyArchiveState, fileEvidence, rescueIsReady, submitDiagnosis, updateDiagnosis } from '../archive/archiveState.ts'
import { CASE_EVIDENCE_TASKS, OTHER_RECORD_IDS, OTHER_CASE_IDS, REQUIRED_OTHER_IDS, allowedOtherHints, caseTaskIntegrity, emptyOtherProgress, hintOther, inspectOther, restoreOtherProgress, solveOther } from './caseEvidenceEngine.ts'
import { isOtherCaseId, readActiveCase } from './caseContext.ts'
import { CASE_RESCUE_COPY, otherRescueCompleted, recordVerifiedRescue, verifyOtherRescue } from './caseRescueEngine.ts'

const happy={
 KES:{architecture:'descope',window:'replanned',slotEvidence:'verified',trajectory:'recalculated',science:'acknowledged',decision:'conditional'},
 LUM:{fixture:'100.0',reference:'independent',report:'raw',compensation:'disabled',opticalTest:'independent',decision:'rework'},
 ORI:{debounce:'300',contact:'independent',altitude:'near',fallback:'recheck',decision:'conditional'},
 AST:{mode:'stagger',retest:'independent',risk:'reopened',audit:'versioned',baseline:'revised',decision:'conditional'},
}

function getAnswers(task){
 return Object.fromEntries(task.fields.map(f=>[f.key,String(f.correct)]))
}
function finishAllEvidence(progress,caseId){
 let state=progress
 const pending=OTHER_RECORD_IDS.filter(id=>id.startsWith(caseId+'-'))
 for(let iteration=0;pending.length&&iteration<10;iteration++){
  for(let i=pending.length-1;i>=0;i--){
   const id=pending[i]
   const result=solveOther(state,id,getAnswers(CASE_EVIDENCE_TASKS[id]))
   if(result.ok){state=result.next;pending.splice(i,1)}
  }
 }
 assert.deepEqual(pending,[],'prerequisite cycle or unsatisfiable task')
 return state
}
test('All 32 new investigations match the immutable eight-per-case evidence registry',()=>{
 assert.deepEqual(caseTaskIntegrity(),[])
 assert.equal(OTHER_RECORD_IDS.length,32)
 assert.equal(new Set(OTHER_RECORD_IDS).size,32)
 assert.equal(REQUIRED_OTHER_IDS.length,24)
 for(const id of OTHER_RECORD_IDS){
  const src=EVIDENCE_RECORDS.find(r=>r.id===id)
  const task=CASE_EVIDENCE_TASKS[id]
  assert.equal(src.source,'FICTIONAL_SIMULATION')
  assert.equal(task.optional,!src.required)
  assert.ok(task.scene.length>35&&task.objective.length>30,'short thematic player-facing hook')
  assert.ok(task.reveal.length>50)
  assert.ok(!task.scene.includes(src.content.slice(0,40)),'rewritten rather than raw record dump')
  assert.ok(task.fields.every(f=>f.kind!=='number'||(f.tolerance>=0&&Number.isFinite(f.correct))))
 }
})

test('Required and optional records are individually solvable after evidence-driven prerequisites',()=>{
 for(const id of OTHER_CASE_IDS){
  const solved=finishAllEvidence(emptyOtherProgress(),id)
  assert.equal(solved.solved.filter(e=>e.startsWith(id+'-')).length,8)
  assert.ok(REQUIRED_OTHER_IDS.filter(e=>e.startsWith(id+'-')).every(e=>solved.solved.includes(e)))
 }
})

test('Wrong engineering units or plausible unsupported theories cannot pass investigation',()=>{
 const s=emptyOtherProgress()
 for(const [id,bad] of [
  ['KES-03',{over:'110',meaning:'stamp'}],
  ['KES-04',{watts:'90',money:'90',review:'both'}],
  ['LUM-01',{nominal:'100.0',proof:'stamp'}],
  ['ORI-01',{duration:'80',meaning:'landed'}],
  ['AST-02',{overcap:'90',overpred:'40',finding:'risk'}],
 ]){
  assert.equal(solveOther(s,id,bad).ok,false,id)
 }
 assert.equal(solveOther(s,'LUM-02',{delta:'0.8',status:'mismatch'}).ok,false,'raw measurement must follow prior drawing analysis')
})

test('Hints are earned only after two/four failed analyses and never restored from forged hints',()=>{
 const id='KES-03'
 let s=emptyOtherProgress()
 assert.equal(allowedOtherHints(0),0)
 assert.equal(hintOther(s,id),s)
 for(let i=0;i<2;i++)s=solveOther(s,id,{over:'9999',meaning:'yes'}).next
 assert.equal((s.attempts[id]??0),2)
 s=hintOther(s,id)
 assert.equal(s.hints[id],1)
 assert.equal(hintOther(s,id),s)
 for(let i=0;i<2;i++)s=solveOther(s,id,{over:'9999',meaning:'yes'}).next
 s=hintOther(s,id)
 assert.equal(s.hints[id],2)
 assert.equal(hintOther(s,id),s)
 const restore=restoreOtherProgress(JSON.stringify({...s,hints:{...s.hints,'AST-02':999},solved:['KES-03','FAKE-09']}))
 assert.deepEqual(restore.solved,['KES-03'])
 assert.equal(restore.hints['AST-02'],undefined)
 assert.equal(restoreOtherProgress('corrupt').solved.length,0)
})

test('All four rescue benches require distinct working engineering states, not answer shortcuts',()=>{
 for(const id of OTHER_CASE_IDS){
  assert.equal(verifyOtherRescue(id,happy[id]).pass,true,id)
  assert.ok(verifyOtherRescue(id,happy[id]).reports.length>=6)
  assert.ok(CASE_RESCUE_COPY[id].limitations.length>45)
 }
 for(const [id,bad] of [
  ['KES',{...happy.KES,window:'old'}],
  ['KES',{...happy.KES,science:'hidden'}],
  ['KES',{...happy.KES,architecture:'heavy'}],
  ['KES',{...happy.KES,slotEvidence:'missing'}],
  ['LUM',{...happy.LUM,fixture:'100.8'}],
  ['LUM',{...happy.LUM,compensation:'enabled'}],
  ['LUM',{...happy.LUM,decision:'flight'}],
  ['ORI',{...happy.ORI,debounce:'80'}],
  ['ORI',{...happy.ORI,contact:'single'}],
  ['ORI',{...happy.ORI,altitude:'none'}],
  ['ORI',{...happy.ORI,fallback:'off'}],
  ['AST',{...happy.AST,mode:'parallel'}],
  ['AST',{...happy.AST,retest:'draft'}],
  ['AST',{...happy.AST,risk:'closed'}],
  ['AST',{...happy.AST,decision:'unconditional'}],
 ]){
  assert.equal(verifyOtherRescue(id,bad).pass,false,id+' should reject unsafe/unsupported path')
 }
})

test('Four complete state journeys: analyze, collect, wrong-folder, refile, cite, rescue, save and relock',()=>{
 for(const caseId of OTHER_CASE_IDS){
  let progress=finishAllEvidence(emptyOtherProgress(),caseId)
  let archive=emptyArchiveState()
  const six=REQUIRED_OTHER_IDS.filter(id=>id.startsWith(caseId+'-'))
  assert.equal(countRequiredEvidence(archive,caseId),0)
  assert.ok(six.every(id=>!archive.discovered.includes(id)),'solving must not auto-collect')
  for(const id of six){
   archive=discoverEvidence(archive,id)
   assert.equal(archive.filed[id],undefined,'collection does not auto-file')
   archive=fileEvidence(archive,id,'NAD')
   assert.equal(countRequiredEvidence(archive,caseId),six.indexOf(id),'wrong folder grants no progress')
   archive=fileEvidence(archive,id,caseId)
  }
  assert.equal(countRequiredEvidence(archive,caseId),6)
  assert.equal(rescueIsReady(archive,caseId),true)
  assert.equal(diagnosisIsSupported(archive,caseId),false)
  const diag=Object.fromEntries(['technical','process','consequence'].map(part=>[
   part,{answer:DIAGNOSIS_PROMPTS[caseId][part].correct,evidenceId:DIAGNOSIS_PROMPTS[caseId][part].supports[0]}
  ]))
  archive=submitDiagnosis(updateDiagnosis(archive,caseId,diag),caseId)
  assert.equal(diagnosisIsSupported(archive,caseId),true)
  assert.equal(otherRescueCompleted(archive,progress,caseId),false)
  assert.equal(recordVerifiedRescue(progress,caseId,{...happy[caseId],decision:'unconditional'}),progress,'invalid plan cannot be saved as passed')
  progress=recordVerifiedRescue(progress,caseId,happy[caseId])
  assert.equal(otherRescueCompleted(archive,progress,caseId),true)
  progress=restoreOtherProgress(JSON.stringify(progress))
  assert.equal(otherRescueCompleted(archive,progress,caseId),true,'restored plan must be reverified')
  archive=fileEvidence(archive,six[5],null)
  assert.equal(otherRescueCompleted(archive,progress,caseId),false,'moving an uncited required record away relocks a passed rescue')
  archive=fileEvidence(archive,six[5],caseId)
  assert.equal(otherRescueCompleted(archive,progress,caseId),true)
  progress={...progress,solved:progress.solved.filter(id=>id!==six[0])}
  assert.equal(otherRescueCompleted(archive,progress,caseId),false,'unanalysed debug-collected evidence cannot finish rescue')
 }
})


test('Save restoration prunes a forged dependent analysis chain but retains complete valid chains',()=>{
 const base={version:1,inspected:[],attempts:{},hints:{},verifiedPlans:{}}
 const forged=restoreOtherProgress(JSON.stringify({...base,solved:['KES-05','KES-06']}))
 assert.deepEqual(forged.solved,[],'KES-05 needs launcher warning; KES-06 then loses both prerequisites')
 const valid=restoreOtherProgress(JSON.stringify({...base,solved:['KES-02','KES-05','KES-06']}))
 assert.deepEqual(valid.solved,['KES-02','KES-05','KES-06'])
})

test('Case navigation preference is a whitelisted UI context, never a forged Rescue or evidence ID',()=>{
 assert.equal(readActiveCase(),null,'Node test environment without window must be safe')
 for(const code of OTHER_CASE_IDS)assert.equal(isOtherCaseId(code),true)
 assert.equal(isOtherCaseId('NAD'),false,'dedicated Nadir evidence remains on original route')
 assert.equal(isOtherCaseId('KES-06'),false)
 assert.equal(isOtherCaseId('__proto__'),false)
 assert.equal(isOtherCaseId(null),false)
})
