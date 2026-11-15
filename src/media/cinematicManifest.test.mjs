import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import { CASE_CODES, EVIDENCE_RECORDS } from '../archive/evidenceRecords.ts'
import { INVESTIGATION_CASES } from '../investigationCases.ts'
import {CINEMATICS,CINEMATIC_REQUEST_EVENT,CINEMATIC_FINISHED_EVENT,isCinematicId,isLiveCinematicAllowed,CINEMATIC_LIVE_HOLDS,cinematicVolume} from './cinematicManifest.ts'
test('exactly seventeen Drive-delivered designer films are registered',()=>{
 assert.deepEqual(Object.keys(CINEMATICS),['opening','case1Intro','portalPast','case1Outcome','case1Evidence','case2Intro','case2EmailEvidence','case2UnitsMismatchEvidence','case2Outcome','case3Intro','case3ApprovalEvidence','case3Outcome','case4Intro','case4TestingEvidence','case4Outcome','case5Intro','case5Outcome'])
 assert.equal(isCinematicId('portalPast'),true)
 for(const bad of ['returnPresent','case6Intro','case6Outcome','__proto__','toString',null,undefined,4])assert.equal(isCinematicId(bad),false)
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
test('cinematic gain obeys master mute, audible default level, bounds, and attenuates loud portal',()=>{
 for(const id of Object.keys(CINEMATICS)){
  assert.equal(cinematicVolume(id,0),0)
  assert.equal(cinematicVolume(id,-10),0)
  assert.equal(cinematicVolume(id,NaN),0)
  assert.ok(cinematicVolume(id,40)>.35&&cinematicVolume(id,40)<.95,'Audible default movie mix without clipping')
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
 assert.equal(CINEMATICS.case4Intro.caseId,CASE_CODES[3])
 assert.equal(CINEMATICS.case4Outcome.caseId,CASE_CODES[3])
 assert.equal(CINEMATICS.case5Intro.caseId,CASE_CODES[4])
 assert.equal(CINEMATICS.case5Outcome.caseId,CASE_CODES[4])
})

test('new evidence-context videos only point at already registered evidence, never new IDs',()=>{
 const contexts={
  case1Evidence:'KES-02',
  case2EmailEvidence:'NAD-05',
  case2UnitsMismatchEvidence:'NAD-02',
  case3ApprovalEvidence:'LUM-05',
  case4TestingEvidence:'ORI-05',
 }
 const registered=new Set(EVIDENCE_RECORDS.map(record=>record.id))
 for(const [key,record] of Object.entries(contexts)){
  const clip=CINEMATICS[key]
  assert.equal(clip.mediaRole,'evidence-context')
  assert.equal(clip.recordContext,record)
  assert.ok(registered.has(record))
  assert.equal(clip.caseId,record.slice(0,3))
 }
 assert.equal(new Set(Object.values(contexts)).size,5)
})

test('all seventeen MP4 binaries exist in Git and match the exact designer source hashes',()=>{
 const sha256={
  opening:'d9901146f958577c2bc1aaea065f5fab42c04d5c8f1903a1d67bd038a2604a7d',
  case1Intro:'104f1d20ec8a414a25dc415528d08cf7befe88b005ce7359a4331541aa5003dc',
  portalPast:'32533832d425eb2d7f3d3029bf0c0a47ee306c87a518c933fcfd8d419b70adab',
  case1Outcome:'ff1ad0a5ca82b135e4a308fc9b6a1569858850ec73eb5213d33b8369313f7b7f',
  case1Evidence:'4c02130808babb45ad16e5f02369553e830194c263ed8fdc7ed22b0820476269',
  case2Intro:'864fdd346b545fc099be5c3d8c0559197cdaceabd8024cbcc3f5833e4468066d',
  case2EmailEvidence:'dc4202ad7cc263c284e085384d2162c7cd7e91c7f77c44dc202dd979e1f59b90',
  case2UnitsMismatchEvidence:'9e055432f899d4fa05dc036e2f1526a3c1f5cfc657080d87ba5caa2560d3ce6f',
  case2Outcome:'a7b17c577be210382572536ff3cf3788480ffd1b9af5a5a741751ca686b34a85',
  case3Intro:'a6d90fbe74e441e78c53c5bc2824a96b4b642eef522ff5f34c1b74def42f07c1',
  case3ApprovalEvidence:'fc096e2d5fa1776505c9802641e2fe91d70fa627220853bcfa0cee2e837b6a64',
  case3Outcome:'40f68475ec9f61f7c08dbf963cc4afcd63b2e11ed54f7e4d422dc2cc83141881',
  case4Intro:'b99b015b271bf83aa57977d607a753324708f9e2dcab160528140afb4ffc3c91',
  case4TestingEvidence:'681e2e5765ececff5ce2c38b7d68977445d8f0aa2e974ed361ccaa9f5db60bd9',
  case4Outcome:'3f3e1349d064a1ff2dcc39f7d5ff492e5a81a8f4664eba746e9060064a5fbd1c',
  case5Intro:'685921ef1bda6bd544e62e2769b87160b24e2aaa816782068b22e9aadef00a78',
  case5Outcome:'2682925c5f46cb878143363d7c6b40e306073e0f9326a14840c52d5b9198b27f',
 }
 assert.deepEqual(Object.keys(CINEMATICS),Object.keys(sha256))
 for(const [id,info] of Object.entries(CINEMATICS)){
  const bytes=readFileSync('public'+info.path)
  assert.equal(bytes.byteLength,info.bytes,id+' length')
  assert.equal(bytes.toString('ascii',4,8),'ftyp',id+' MP4 file header')
  assert.equal(createHash('sha256').update(bytes).digest('hex'),sha256[id],id+' source SHA256')
 }
})

test('direct live cinematic events cannot play unapproved AST 472W verified outcome',()=>{
 assert.equal(isLiveCinematicAllowed('case5Outcome'),false)
 assert.match(CINEMATIC_LIVE_HOLDS.case5Outcome,/472 W/)
 assert.match(CINEMATIC_LIVE_HOLDS.case5Outcome,/450 W/)
 for(const key of Object.keys(CINEMATICS).filter(x=>x!=='case5Outcome')){
  assert.equal(isLiveCinematicAllowed(key),true,key)
 }
})
