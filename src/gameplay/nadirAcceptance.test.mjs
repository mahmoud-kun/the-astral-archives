import test from 'node:test'
import assert from 'node:assert/strict'
import { EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import { countRequiredEvidence, discoverEvidence, emptyArchiveState, fileEvidence, rescueIsReady } from '../archive/archiveState.ts'
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

test('Manual collection and correct filing are separate Rescue prerequisites',()=>{
  let state=emptyArchiveState()
  for(const id of REQUIRED_NADIR)state=discoverEvidence(state,id)
  assert.equal(countRequiredEvidence(state,'NAD'),0)
  assert.equal(rescueIsReady(state,'NAD'),false)
  for(const id of REQUIRED_NADIR)state=fileEvidence(state,id,'KES')
  assert.equal(countRequiredEvidence(state,'NAD'),0)
  assert.equal(rescueIsReady(state,'NAD'),false)
  for(const id of REQUIRED_NADIR)state=fileEvidence(state,id,'NAD')
  assert.equal(countRequiredEvidence(state,'NAD'),6)
  assert.equal(rescueIsReady(state,'NAD'),true,'user-approved rule: 6 correctly filed unlocks rescue; diagnosis is INSIDE rescue')
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
