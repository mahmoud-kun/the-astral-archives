import {test} from 'node:test'
import assert from 'node:assert/strict'
import {readFileSync,statSync} from 'node:fs'
import {SOUND_PATHS,parseAudioSettings,sceneFromSearch,AUDIO_SETTINGS_KEY} from './gameAudio.ts'

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
  ['?folder-lab=1','archive'],['?rescue=NAD','rescue'],['','home'],
 ])assert.equal(sceneFromSearch(url),scene)
})

test('every registered sound has a real nonempty local binary file',()=>{
 let bytes=0
 assert.equal(Object.keys(SOUND_PATHS).length,19)
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
