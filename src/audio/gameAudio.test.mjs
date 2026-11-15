import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,statSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {SOUND_PATHS,parseAudioSettings,sceneFromSearch,isRescueAudioRoute,soundForInteraction,AUDIO_SETTINGS_KEY,gameSoundVolume} from './gameAudio.ts'

test('audio settings are versioned, private-safe and bounded',()=>{
 assert.equal(AUDIO_SETTINGS_KEY,'astral-audio-settings-v1')
 assert.deepEqual(parseAudioSettings(null),{effects:true,ambient:true,volume:40})
 assert.deepEqual(parseAudioSettings('not json'),{effects:true,ambient:true,volume:40})
 assert.deepEqual(parseAudioSettings(JSON.stringify({effects:false,ambient:false,volume:900})),{effects:false,ambient:false,volume:100})
 assert.equal(parseAudioSettings(JSON.stringify({volume:-25})).volume,0)
 assert.equal(parseAudioSettings(JSON.stringify({volume:'LOUD'})).volume,40)
})

test('each station has an independently selectable quiet ambience scene',()=>{
 for(const [url,scene] of [
  ['?room=1','investigation'],['?station=archive','archive'],
  ['?station=signal','signal'],['?station=recordings','recordings'],
  ['?folder-lab=1','archive'],['?rescue=NAD','rescue'],
  ['?rescue=KES','rescue'],['?rescue=LUM','rescue'],['?rescue=ORI','rescue'],['?rescue=AST','rescue'],
  ['?rescue=UNKNOWN','home'],['?rescue=NADDD','home'],['','home'],
 ])assert.equal(sceneFromSearch(url),scene)
})

test('every registered sound has a real nonempty local binary file',()=>{
 let bytes=0
 assert.equal(Object.keys(SOUND_PATHS).length,20)
 for(const [cue,path] of Object.entries(SOUND_PATHS)){
  assert.match(path,/^\/assets\/audio\/(sfx|kenney)\/[a-z0-9_\-]+\.(wav|m4a)$/)
  const full='public'+path
  const stat=statSync(full)
  assert.ok(stat.size>1500&&stat.size<160_000,cue+': unexpected sound file size '+stat.size)
  const b=readFileSync(full)
  if(path.endsWith('.wav')){
   assert.equal(b.toString('ascii',0,4),'RIFF',cue+': invalid WAV magic')
   assert.equal(b.toString('ascii',8,12),'WAVE',cue+': invalid WAVE type')
  }else{
   assert.equal(b.toString('ascii',4,8),'ftyp',cue+': invalid MPEG-4 container')
  }
  bytes+=stat.size
 }
 assert.ok(bytes<1_100_000,'Audio is too heavy for low-bandwidth experience: '+bytes)
})

import '../media/cinematicManifest.test.mjs'
import '../media/cinematicFlow.test.mjs'
import '../media/caseCinematicCatalog.test.mjs'
import './evidenceVoiceManifest.test.mjs'
import './audioRuntime.test.mjs'

test('every cue remains quiet at 40 percent and fully mutes at zero',()=>{
 for(const cue of Object.keys(SOUND_PATHS)){
  assert.equal(gameSoundVolume(cue,0),0)
  assert.ok(gameSoundVolume(cue,40)>0&&gameSoundVolume(cue,40)<0.2)
  assert.ok(gameSoundVolume(cue,100)<=1)
 }
})

test('all five rescue scenes share rescue ambience without accepting unknown routes',()=>{
 for(const code of ['KES','NAD','LUM','ORI','AST']){
  assert.equal(isRescueAudioRoute('?rescue='+code),true,code)
  assert.equal(sceneFromSearch('?rescue='+code),'rescue')
 }
 for(const bad of ['','?rescue=','?rescue=AAA','?rescue=ori','?room=1']){
  assert.equal(isRescueAudioRoute(bad),false,bad)
 }
})
test('verified rescue and folder unlock remain distinct without leaking filing correctness',()=>{
 for(const code of ['KES','NAD','LUM','ORI','AST'])
  assert.equal(soundForInteraction('rescue','?rescue='+code),'rescueComplete',code)
 assert.equal(soundForInteraction('rescue','?folder-lab=1&return=archive'),'rescue')
 assert.equal(soundForInteraction('rescue','?audio-lab=1&rescue=AST'),'rescue','lab must preview original sound')
 assert.equal(soundForInteraction('file','?folder-lab=1'),'file','never leak incorrect filing')
})
test('signal chime is reserved for an actual Signal Room evidence hotspot, not any click',()=>{
 assert.equal(soundForInteraction('scanner','?station=signal','NAD-01'),'signal')
 assert.equal(soundForInteraction('scanner','?station=signal','ORI-01'),'signal')
 assert.equal(soundForInteraction('scanner','?station=signal','AST-02'),'signal')
 assert.equal(soundForInteraction('scanner','?station=signal'),'scanner')
 assert.equal(soundForInteraction('scanner','?station=archive','NAD-01'),'scanner')
 assert.equal(soundForInteraction('scanner','?station=signal','DEMO-01'),'scanner')
 assert.equal(soundForInteraction('click','?station=signal','ORI-01'),'click')
})
test('unique original rescue-complete cue is an exact nonclipping PCM WAV, source SHA unchanged',()=>{
 const path='public'+SOUND_PATHS.rescueComplete
 const buffer=readFileSync(path)
 assert.equal(buffer.byteLength,60020)
 assert.equal(buffer.toString('ascii',0,4),'RIFF')
 assert.equal(buffer.toString('ascii',8,12),'WAVE')
 assert.equal(buffer.readUInt32LE(24),22050)
 assert.equal(buffer.readUInt16LE(22),1)
 assert.equal(buffer.readUInt16LE(34),16)
 assert.equal(buffer.readUInt32LE(40),59976)
 const gitBlob=createHash('sha1').update(Buffer.from('blob '+buffer.length)).update(Buffer.from([0])).update(buffer).digest('hex')
 assert.equal(gitBlob,'eb2b01e5b755f35d9fc2a5aedbf7c0c8965ae0d3')
})
