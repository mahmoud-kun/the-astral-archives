import {test} from 'node:test'
import assert from 'node:assert/strict'
import { CASE_CODES, EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import { INVESTIGATION_CASES } from '../investigationCases.ts'
import {CINEMATICS,CINEMATIC_REQUEST_EVENT,CINEMATIC_FINISHED_EVENT,isCinematicId,cinematicVolume} from './cinematicManifest.ts'
test('only twelve actually delivered designer films are registered',()=>{
 assert.deepEqual(Object.keys(CINEMATICS),['opening','case1Intro','portalPast','case1Outcome','case1Evidence','case2Intro','case2EmailEvidence','case2UnitsMismatchEvidence','case2Outcome','case3Intro','case3ApprovalEvidence','case3Outcome'])
 assert.equal(isCinematicId('portalPast'),true)
 for(const bad of ['returnPresent','case4Intro','case5Outcome','__proto__','toString',null,undefined,4])assert.equal(isCinematicId(bad),false)
 assert.equal(CINEMATIC_REQUEST_EVENT,'astral:cinematic-request')
 assert.equal(CINEMATIC_FINISHED_EVENT,'astral:cinematic-finished')
})
test('all cinema metadata uses local versioned MP4 paths and authentic source IDs',()=>{
 const ids=new Set()
 for(const [key,info] of Object.entries(CINEMATICS)){
  assert.ok(!ids.has(info.driveId),key);ids.add(info.driveId)
  assert.match(info.path,/^\/assets\/video\/designer-[a-z0-9-]+-v1\.mp4$/)
  assert.equal(info.path.includes('drive.google'),false)
  assert.ok(info.duration>0&&info.duration<30)
  assert.ok(info.bytes>1000000)
 }
})
test('cinematic gain obeys master mute, bounds, and attenuates loud portal',()=>{
 for(const id of Object.keys(CINEMATICS)){
  assert.equal(cinematicVolume(id,0),0)
  assert.equal(cinematicVolume(id,-10),0)
  assert.equal(cinematicVolume(id,NaN),0)
  assert.ok(cinematicVolume(id,40)>0&&cinematicVolume(id,40)<0.4)
  assert.ok(cinematicVolume(id,1000)<=1)
 }
 assert.ok(cinematicVolume('portalPast',40)<cinematicVolume('case1Intro',40))
})

test('Evidence Production Bible v2 defines the stable mission order and Case 01 maps to Kestrel',()=>{
 const expected=['KES','NAD','LUM','ORI','AST']
 assert.deepEqual([...CASE_CODES],expected)
 assert.deepEqual(INVESTIGATION_CASES.map(c=>c.code),expected)
 assert.equal(CINEMATICS.case1Intro.caseId,CASE_CODES[0])
 assert.equal(CINEMATICS.case1Outcome.caseId,CASE_CODES[0])
 assert.equal(CINEMATICS.case2Intro.caseId,CASE_CODES[1])
 assert.equal(CINEMATICS.case2Outcome.caseId,CASE_CODES[1])
 assert.equal(CINEMATICS.case3Intro.caseId,CASE_CODES[2])
 assert.equal(CINEMATICS.case3Outcome.caseId,CASE_CODES[2])
})

test('new evidence-context videos only point at already registered evidence, never new IDs',()=>{
 const contexts={
  case1Evidence:'KES-02',
  case2EmailEvidence:'NAD-05',
  case2UnitsMismatchEvidence:'NAD-02',
  case3ApprovalEvidence:'LUM-05',
 }
 const registered=new Set(EVIDENCE_RECORDS.map(record=>record.id))
 for(const [key,record] of Object.entries(contexts)){
  const clip=CINEMATICS[key]
  assert.equal(clip.mediaRole,'evidence-context')
  assert.equal(clip.recordContext,record)
  assert.ok(registered.has(record))
  assert.equal(clip.caseId,record.slice(0,3))
 }
 assert.equal(new Set(Object.values(contexts)).size,4)
})
