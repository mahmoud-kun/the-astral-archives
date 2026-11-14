import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CASE_CODES, EVIDENCE_RECORDS } from './evidenceRecords.ts'
import {
  countRequiredEvidence, diagnosisIsSupported, discoverEvidence, emptyArchiveState,
  fileEvidence, rescueIsReady, restoreArchiveState, submitDiagnosis, updateDiagnosis
} from './archiveState.ts'

test('the production bible registry has five cases and exactly 40 distinct records', () => {
  assert.equal(EVIDENCE_RECORDS.length, 40)
  assert.equal(new Set(EVIDENCE_RECORDS.map(record => record.id)).size, 40)
  for (const code of CASE_CODES) {
    const all = EVIDENCE_RECORDS.filter(record => record.caseId === code)
    assert.equal(all.length, 8)
    assert.equal(all.filter(record => record.required).length, 6)
    assert.equal(all.filter(record => !record.required).length, 2)
    assert.ok(all.every(record => record.source === 'FICTIONAL_SIMULATION'))
  }
})

test('undiscovered evidence cannot be filed and wrong filing stays saved without progress', () => {
  const start = emptyArchiveState()
  assert.deepEqual(fileEvidence(start,'NAD-01','NAD'),start)
  const found = discoverEvidence(start,'NAD-01')
  const wrong = fileEvidence(found,'NAD-01','KES')
  assert.equal(wrong.filed['NAD-01'],'KES')
  assert.equal(countRequiredEvidence(wrong,'KES'),0)
  assert.equal(countRequiredEvidence(wrong,'NAD'),0)
  const corrected = fileEvidence(wrong,'NAD-01','NAD')
  assert.equal(countRequiredEvidence(corrected,'NAD'),1)
  const moved = fileEvidence(corrected,'NAD-01',null)
  assert.equal(countRequiredEvidence(moved,'NAD'),0)
  assert.equal(moved.discovered.includes('NAD-01'),true)
})

test('optional evidence never advances required progress', () => {
  const found = discoverEvidence(emptyArchiveState(),'NAD-07')
  assert.equal(countRequiredEvidence(fileEvidence(found,'NAD-07','NAD'),'NAD'),0)
})

function fullNadir() {
  let state = emptyArchiveState()
  for (let n=1;n<=6;n++) {
    const id = 'NAD-0'+n
    state = fileEvidence(discoverEvidence(state,id),id,'NAD')
  }
  return state
}

const diagnosis = {
  technical: { answer: 'units', evidenceId: 'NAD-02' },
  process: { answer: 'no-rerun', evidenceId: 'NAD-06' },
  consequence: { answer: 'divergence', evidenceId: 'NAD-01' },
}

test('Rescue unlocks at 6/6 correct filing; diagnosis is an independent in-rescue review', () => {
  let state = fullNadir()
  assert.equal(countRequiredEvidence(state,'NAD'),6)
  assert.equal(rescueIsReady(state,'NAD'),true)
  assert.equal(diagnosisIsSupported(state,'NAD'),false)
  state = updateDiagnosis(state,'NAD',diagnosis)
  assert.equal(rescueIsReady(state,'NAD'),true)
  state = submitDiagnosis(state,'NAD')
  assert.equal(diagnosisIsSupported(state,'NAD'),true)
  const moved = fileEvidence(state,'NAD-02','KES')
  assert.equal(rescueIsReady(moved,'NAD'),false)
  assert.equal(diagnosisIsSupported(moved,'NAD'),false)
  assert.equal(rescueIsReady(fileEvidence(moved,'NAD-02','NAD'),'NAD'),true)
})

test('unsupported diagnosis never passes review, but does not relock an available rescue', () => {
  let state = fullNadir()
  state = submitDiagnosis(updateDiagnosis(state,'NAD',{
    ...diagnosis, technical: {answer:'tamper',evidenceId:'NAD-02'}
  }),'NAD')
  assert.equal(diagnosisIsSupported(state,'NAD'),false)
  assert.equal(rescueIsReady(state,'NAD'),true)
  state = submitDiagnosis(updateDiagnosis(state,'NAD',{
    ...diagnosis, technical: {answer:'units',evidenceId:'NAD-06'}
  }),'NAD')
  assert.equal(diagnosisIsSupported(state,'NAD'),false)
  assert.equal(rescueIsReady(state,'NAD'),true)
})

test('save restoration validates discovered IDs, folder references and submission shape', () => {
  assert.deepEqual(restoreArchiveState('broken'),emptyArchiveState())
  assert.deepEqual(restoreArchiveState('{"version":99}'),emptyArchiveState())
  const loaded = restoreArchiveState(JSON.stringify({
    version:1,discovered:['NAD-01','NAD-01','fake'],filed:{'NAD-01':'KES','NAD-02':'NAD','fake':'AST'},
    diagnosis:{},submitted:['NAD','invalid']
  }))
  assert.deepEqual(loaded.discovered,['NAD-01'])
  assert.deepEqual(loaded.filed,{'NAD-01':'KES'})
  assert.deepEqual(loaded.submitted,['NAD'])
})
