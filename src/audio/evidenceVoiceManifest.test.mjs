import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {EVIDENCE_RECORDS} from '../archive/evidenceRecords.ts'
import {EVIDENCE_VOICE,isEvidenceVoiceId,evidenceVoiceVolume} from './evidenceVoiceManifest.ts'

const IDS=['KES-05','NAD-07','LUM-07','ORI-07','AST-07']

test('five real voices belong to existing five-case Recordings Room evidence, no new collectibles',()=>{
 assert.deepEqual(Object.keys(EVIDENCE_VOICE),IDS)
 assert.equal(new Set(IDS).size,5)
 for(const id of IDS){
  const voice=EVIDENCE_VOICE[id]
  const record=EVIDENCE_RECORDS.find(r=>r.id===id)
  assert.ok(record,id+' must be present in canonical source')
  assert.equal(record.caseId,voice.caseId)
  assert.equal(record.room,'Recordings')
  assert.equal(record.kind,'recording')
  assert.equal(voice.evidenceId,id)
  assert.equal(voice.mediaRole,'existing-evidence-audio')
  assert.equal(voice.codec,'mp3')
  assert.equal(voice.channels,1)
  assert.equal(voice.sampleRate,44100)
  assert.match(voice.path,/^\/assets\/audio\/voice\/designer-[a-z0-9-]+-v1\.mp3$/)
  assert.equal(isEvidenceVoiceId(id),true)
 }
 for(const optional of ['KES-07','ORI-08']){
  assert.ok(EVIDENCE_RECORDS.some(r=>r.id===optional&&r.kind==='recording'))
  assert.equal(isEvidenceVoiceId(optional),false,'no invented audio for '+optional)
 }
 for(const invalid of ['KES-09','NAD-05','__proto__','toString',null])assert.equal(isEvidenceVoiceId(invalid),false)
})

test('five voice mixes honor mute, master level and LUFS-aligned source attenuation',()=>{
 const gains={'KES-05':.30,'NAD-07':.36,'LUM-07':.37,'ORI-07':.37,'AST-07':.34}
 for(const id of IDS){
  for(const v of [0,-1,NaN])assert.equal(evidenceVoiceVolume(id,v),0)
  assert.equal(evidenceVoiceVolume(id,40),Number((gains[id]*.4).toFixed(4)))
  assert.equal(evidenceVoiceVolume(id,100),gains[id])
  assert.equal(evidenceVoiceVolume(id,1000),gains[id])
  const mix=EVIDENCE_VOICE[id]
  const expectedLufs=mix.measuredInputLufs+20*Math.log10(mix.mixGain)
  assert.ok(Math.abs(expectedLufs-(-25.8))<.35,id+' balanced source loudness '+expectedLufs)
 }
})

test('all five source MP3 files physically exist with exact Drive SHA256 and Git blob SHA1',()=>{
 let bytes=0
 const paths=new Set()
 for(const id of IDS){
  const voice=EVIDENCE_VOICE[id]
  assert.ok(!paths.has(voice.path),'each recording must be unique')
  paths.add(voice.path)
  const buffer=readFileSync('public'+voice.path)
  assert.equal(buffer.length,voice.bytes,id+' exact original file size')
  assert.equal(buffer.toString('ascii',0,3),'ID3',id+' MP3 ID3 header')
  assert.equal(createHash('sha256').update(buffer).digest('hex'),voice.sha256,id+' source SHA256')
  const prefix=Buffer.concat([Buffer.from('blob '+buffer.length),Buffer.from([0])])
  assert.equal(createHash('sha1').update(prefix).update(buffer).digest('hex'),voice.gitBlobSha,id+' Git blob SHA1')
  assert.ok(voice.duration>10&&voice.duration<40)
  bytes+=buffer.length
 }
 assert.equal(bytes,1842619,'exact total original voice bytes')
})
