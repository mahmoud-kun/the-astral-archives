import test from 'node:test'
import assert from 'node:assert/strict'
import { EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import { countRequiredEvidence, diagnosisIsSupported, discoverEvidence, emptyArchiveState, fileEvidence, rescueIsReady, restoreArchiveState, submitDiagnosis, updateDiagnosis } from '../archive/archiveState.ts'
import { NADIR_CHALLENGES, NADIR_ROOM, REQUIRED_NADIR, emptyNadir, solveNadir,
  restoreNadir, verifyRescuePlan } from './nadirEngine.ts'

const correct={
  'NAD-06': {proof:'rerun',risk:'administrative'},
  'NAD-02': {source:'lbfs',target:'ns',converted:'53.37865938'},
  'NAD-01': {hypothesis:'units',rerun:'53.37865938',comparison:'same',rawReplay:'completed',correctedReplay:'completed'},
  'NAD-04': {producer:'lbfs',consumer:'ns',failure:'contract'},
  'NAD-03': {canonical:'ns',owner:'producer',verification:'rerun'},
  'NAD-05': {first:'export',second:'residual',third:'email',fourth:'closure'},
}

test('Nadir investigation spans all four rooms without invented evidence',()=>{
  assert.deepEqual(new Set(Object.values(NADIR_ROOM)),new Set(['investigation','archive','signal','recordings']))
  assert.equal(REQUIRED_NADIR.length,6)
  assert.equal(new Set(REQUIRED_NADIR).size,6)
  assert.deepEqual(REQUIRED_NADIR.map(id=>EVIDENCE_RECORDS.find(item=>item.id===id)?.required),Array(6).fill(true))
  assert.ok(REQUIRED_NADIR.every(id=>NADIR_CHALLENGES[id].fields.length>=2))
  assert.ok(EVIDENCE_RECORDS.filter(item=>item.caseId==='NAD').every(item=>item.source==='FICTIONAL_SIMULATION'))
})

test('Multi-room correlated analysis cannot skip prerequisite evidence checks',()=>{
  const start=emptyNadir()
  for(const id of ['NAD-01','NAD-03','NAD-05']){
    const attempt=solveNadir(start,id,correct[id])
    assert.equal(attempt.ok,false,`must block ${id} without correlated record`)
    assert.equal(attempt.next.solved.length,0)
  }
  let progress=start
  for(const id of ['NAD-06','NAD-05','NAD-02','NAD-01','NAD-04','NAD-03']){
    const attempt=solveNadir(progress,id,correct[id])
    assert.equal(attempt.ok,true,`expected an evidence-supported outcome for ${id}`)
    progress=attempt.next
  }
  assert.equal(progress.solved.length,6)
  assert.equal(progress.inspected.length,6)
})

test('Numerical challenge rejects wrong impulse even with plausible theory',()=>{
  const rejected=solveNadir(emptyNadir(),'NAD-02',{...correct['NAD-02'],converted:'12'})
  assert.equal(rejected.ok,false)
  assert.equal(rejected.next.solved.length,0)
  const valid=solveNadir(emptyNadir(),'NAD-02',{...correct['NAD-02'],converted:'53.38'})
  assert.equal(valid.ok,true)
})

test('Collecting any six case records unlocks Rescue; filing remains optional',()=>{
  let state=emptyArchiveState()
  for(const id of REQUIRED_NADIR)state=discoverEvidence(state,id)
  assert.equal(countRequiredEvidence(state,'NAD'),0)
  assert.equal(rescueIsReady(state,'NAD'),true)
  for(const id of REQUIRED_NADIR)state=fileEvidence(state,id,'KES')
  assert.equal(countRequiredEvidence(state,'NAD'),0)
  assert.equal(rescueIsReady(state,'NAD'),true)
  for(const id of REQUIRED_NADIR)state=fileEvidence(state,id,'NAD')
  assert.equal(countRequiredEvidence(state,'NAD'),6)
  assert.equal(rescueIsReady(state,'NAD'),true,'six collected records unlock regardless of filing')
})

test('Rescue engineering rerun uses two independent numeric vectors and actual checks',()=>{
  const good={canonical:'ns',converter:'producer',guard:'automated',first:'53.37865938',second:'3.55857729'}
  const ok=verifyRescuePlan(good)
  assert.equal(ok.passed,true)
  assert.equal(ok.report.length,5)
  assert.equal(verifyRescuePlan({...good,second:'0.8'}).passed,false)
  assert.equal(verifyRescuePlan({...good,guard:'meeting'}).passed,false)
  assert.equal(verifyRescuePlan({...good,converter:'both'}).passed,false)
})

test('Restore of corrupted or forged Nadir progress is constrained to known IDs',()=>{
  const r=restoreNadir(JSON.stringify({version:1,inspected:['NAD-02','unknown'],solved:['NAD-02','unknown'],attempts:{'NAD-02':1,'NAD-01':-3},hints:{'NAD-02':500},rescue:{submitted:true,rerunPassed:false}}))
  assert.deepEqual(r.solved,['NAD-02'])
  assert.equal(r.attempts['NAD-01'],undefined)
  assert.equal(r.hints['NAD-02'],undefined)
  assert.equal(restoreNadir('broken').solved.length,0)
})

test('Nadir full state journey: six analyzed records, deliberate collect, wrong filing, refile, rescue and reload',()=>{
  let progress=emptyNadir()
  let archive=emptyArchiveState()
  const order=['NAD-06','NAD-05','NAD-02','NAD-01','NAD-04','NAD-03']
  for(const id of order){
    const verified=solveNadir(progress,id,correct[id])
    assert.equal(verified.ok,true,id+' must be solvable after its prerequisites')
    progress=restoreNadir(JSON.stringify(verified.next))
    assert.equal(archive.discovered.includes(id),false,'solving must not auto-collect '+id)
    const before=countRequiredEvidence(archive,'NAD')
    archive=discoverEvidence(archive,id) // deliberate user COLLECT
    assert.equal(countRequiredEvidence(archive,'NAD'),before,'collection cannot auto-file')
    archive=fileEvidence(archive,id,'KES') // reversible mistake
    assert.equal(countRequiredEvidence(archive,'NAD'),before,'wrong folder cannot grant progress')
    archive=fileEvidence(archive,id,'NAD')
    archive=restoreArchiveState(JSON.stringify(archive))
    assert.equal(countRequiredEvidence(archive,'NAD'),before+1,'re-file must grant exactly one progress point')
  }
  assert.equal(rescueIsReady(archive,'NAD'),true)
  assert.equal(diagnosisIsSupported(archive,'NAD'),false,'diagnosis happens inside Rescue')
  archive=submitDiagnosis(updateDiagnosis(archive,'NAD',{
    technical:{answer:'units',evidenceId:'NAD-02'},
    process:{answer:'no-rerun',evidenceId:'NAD-06'},
    consequence:{answer:'divergence',evidenceId:'NAD-01'},
  }),'NAD')
  assert.equal(diagnosisIsSupported(archive,'NAD'),true)
  const engineering=verifyRescuePlan({
    canonical:'ns',converter:'producer',guard:'automated',
    first:'53.37865938',second:'3.558577292',
  })
  assert.equal(engineering.passed,true)
  assert.equal(verifyRescuePlan({
    canonical:'ns',converter:'producer',guard:'automated',
    first:'53.37865938',second:'0.8',
  }).passed,false,'one correct vector cannot conceal a wrong second vector')
  archive=fileEvidence(archive,'NAD-03',null)
  assert.equal(rescueIsReady(archive,'NAD'),true,'filing changes never erase collected evidence or relock Rescue')
  assert.equal(diagnosisIsSupported(archive,'NAD'),false,'accepted review must not appear verified with 5/6')
  archive=fileEvidence(archive,'NAD-03','NAD')
  assert.equal(rescueIsReady(archive,'NAD'),true,'returning record restores legitimate progress')
  assert.equal(diagnosisIsSupported(archive,'NAD'),true)
})

// Keep this suite under the existing test:nadir command until Main owns package scripts.
import './otherCaseAcceptance.test.mjs'
