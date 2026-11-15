import { test } from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {EVIDENCE_RECORDS} from '../archive/evidenceRecords.ts'
import {EVIDENCE_VOICE,isEvidenceVoiceId,evidenceVoiceVolume} from './evidenceVoiceManifest.ts'
test('one KES-05 source voice accompanies a real preexisting evidence record, not a new collectible',()=>{
 assert.deepEqual(Object.keys(EVIDENCE_VOICE),['KES-05'])
 const voice=EVIDENCE_VOICE['KES-05']
 const canonical=EVIDENCE_RECORDS.find(r=>r.id===voice.evidenceId)
 assert.ok(canonical)
 assert.equal(canonical.caseId,'KES')
 assert.equal(voice.mediaRole,'existing-evidence-audio')
 assert.equal(voice.driveId,'1VwTSpTqpfOUPcEDt4Z8VA3MHel6B_5pa')
 assert.match(voice.path,/^\/assets\/audio\/voice\/designer-[a-z0-9-]+-v1\.mp3$/)
 assert.equal(voice.bytes,314523)
 assert.ok(voice.duration>18&&voice.duration<19)
 assert.equal(isEvidenceVoiceId('KES-05'),true)
 for(const bad of ['KES-09','NAD-05','__proto__','toString',null])assert.equal(isEvidenceVoiceId(bad),false)
})
test('source recording respects master volume and is quieter than original peak',()=>{
 for(const volume of [0,-1,NaN])assert.equal(evidenceVoiceVolume('KES-05',volume),0)
 assert.equal(evidenceVoiceVolume('KES-05',40),0.12)
 assert.equal(evidenceVoiceVolume('KES-05',100),0.3)
 assert.equal(evidenceVoiceVolume('KES-05',1000),0.3)
})

test('KES-05 MP3 binary is physically committed and source-exact',()=>{
 const voice=EVIDENCE_VOICE['KES-05']
 const bytes=readFileSync('public'+voice.path)
 assert.equal(bytes.byteLength,voice.bytes)
 assert.equal(bytes.toString('ascii',0,3),'ID3')
 assert.equal(createHash('sha256').update(bytes).digest('hex'),'371cc159f1d5216eac22cefcb0a792e1fa3625187312a46950c332f4a074bfd5')
})
