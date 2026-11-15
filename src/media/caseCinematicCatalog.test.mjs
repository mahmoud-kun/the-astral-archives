import {test} from 'node:test'
import assert from 'node:assert/strict'
import {CASE_CODES,EVIDENCE_RECORDS} from '../archive/evidenceRecords.ts'
import {CINEMATICS} from './cinematicManifest.ts'
import {CASE_CINEMATIC_CATALOG,caseIntroCinematic,verifiedCaseOutcomeCinematic,evidenceContextCinematic} from './caseCinematicCatalog.ts'

test('all five Bible cases have exactly one authentic intro and one gated outcome film',()=>{
 assert.deepEqual(Object.keys(CASE_CINEMATIC_CATALOG),[...CASE_CODES])
 const seen=new Set()
 for(const caseId of CASE_CODES){
  const entry=CASE_CINEMATIC_CATALOG[caseId]
  for(const id of [entry.intro,entry.outcome]){
   assert.ok(CINEMATICS[id],id)
   assert.equal(CINEMATICS[id].caseId,caseId)
   assert.equal(seen.has(id),false)
   seen.add(id)
  }
  assert.equal(caseIntroCinematic(caseId),entry.intro)
  assert.equal(verifiedCaseOutcomeCinematic(caseId),entry.outcome)
 }
 assert.equal(seen.size,10)
})
test('evidence visual clips only supplement authored records, never create collectible IDs',()=>{
 const existing=new Map(EVIDENCE_RECORDS.map(record=>[record.id,record]))
 let count=0
 for(const caseId of CASE_CODES){
  for(const [evidenceId,clipId] of Object.entries(CASE_CINEMATIC_CATALOG[caseId].evidence)){
   const record=existing.get(evidenceId)
   assert.ok(record,'Unknown new evidence: '+evidenceId)
   assert.equal(record.caseId,caseId)
   assert.equal(CINEMATICS[clipId].caseId,caseId)
   assert.equal(CINEMATICS[clipId].recordContext,evidenceId)
   assert.equal(CINEMATICS[clipId].mediaRole,'evidence-context')
   assert.equal(evidenceContextCinematic(evidenceId),clipId)
   count++
  }
 }
 assert.equal(count,5)
 assert.equal(evidenceContextCinematic('ORI-01'),null)
 assert.equal(evidenceContextCinematic('AST-07'),null)
 assert.equal(evidenceContextCinematic('XYZ-01'),null)
 assert.equal(evidenceContextCinematic('__proto__'),null)
})
