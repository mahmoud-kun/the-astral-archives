import {test} from 'node:test'
import assert from 'node:assert/strict'
import {installGameAudio,playGameSound,setAudioSettings,gameSoundVolume,claimCinematicAudioFocus,AUDIO_SETTINGS_KEY} from './gameAudio.ts'

test('settings persistence, live SFX volume, tab mute and cinematic audio focus',()=>{
 const originals={window:globalThis.window,document:globalThis.document,Audio:globalThis.Audio}
 const store=new Map()
 const listeners=new Map()
 const docListeners=new Map()
 const samples=[]
 class FakeAudio{
  constructor(src){this.src=src;this.dataset={};this.volume=0;this.pauseCalls=0;this.events=new Map();samples.push(this)}
  addEventListener(name,fn){this.events.set(name,fn)}
  removeEventListener(name){this.events.delete(name)}
  play(){return Promise.resolve()}
  pause(){this.pauseCalls++}
 }
 const emit=(listeners,event)=>{const entry=listeners.get(event.type);if(entry)entry(event)}
 globalThis.window={
  localStorage:{
   getItem:key=>store.get(key)??null,
   setItem:(key,value)=>store.set(key,value),
  },
  addEventListener:(name,fn)=>listeners.set(name,fn),
  removeEventListener:name=>listeners.delete(name),
  dispatchEvent:event=>emit(listeners,event),
 }
 globalThis.document={
  hidden:false,
  addEventListener:(name,fn)=>docListeners.set(name,fn),
  removeEventListener:name=>docListeners.delete(name),
 }
 globalThis.Audio=FakeAudio
 let cleanup=()=>{}
 try{
  cleanup=installGameAudio()
  assert.deepEqual(setAudioSettings({effects:true,ambient:true,volume:40}),{effects:true,ambient:true,volume:40})
  assert.ok(store.has(AUDIO_SETTINGS_KEY))
  playGameSound('evidence')
  assert.equal(samples.length,1)
  assert.equal(samples[0].volume,gameSoundVolume('evidence',40))
  setAudioSettings({volume:80})
  assert.equal(samples[0].volume,gameSoundVolume('evidence',80),'slider must adjust sounds already playing')
  setAudioSettings({effects:false})
  assert.ok(samples[0].pauseCalls>0,'mute should stop an active sound')
  playGameSound('scanner')
  assert.equal(samples.length,1,'mute prevents new SFX')
  setAudioSettings({effects:true,volume:0})
  playGameSound('doorOpen')
  assert.equal(samples.length,1,'0 master is a complete mute')
  setAudioSettings({volume:40})
  playGameSound('terminal')
  assert.equal(samples.length,2)
  const videoFocus=claimCinematicAudioFocus()
  assert.ok(samples[1].pauseCalls>0,'cinematic focus stops one-shots')
  playGameSound('metal')
  assert.equal(samples.length,2,'cinematic suppresses new effects')
  videoFocus()
  videoFocus()
  playGameSound('metal')
  assert.equal(samples.length,3,'idempotent focus release restores normal sound')
  // Real Nadir/other-case rescue callbacks still emit the legacy "rescue" event.
  // The sound engine chooses the new reward ONLY on a recognized rescue route.
  globalThis.window.location={search:'?rescue=AST'}
  playGameSound('rescue')
  assert.equal(samples.length,4)
  assert.equal(samples[3].src,'/assets/audio/sfx/rescue_completed_original_v1.wav')
  assert.equal(samples[3].dataset.astralSound,'rescueComplete')
  assert.equal(samples[3].volume,gameSoundVolume('rescueComplete',40))
  globalThis.window.location.search='?folder-lab=1'
  playGameSound('rescue')
  assert.equal(samples.length,5)
  assert.equal(samples[4].src,'/assets/audio/sfx/rescue_unlocked.wav','folder unlock must retain original reward')
  globalThis.document.hidden=true
  docListeners.get('visibilitychange')()
  assert.ok(samples[2].pauseCalls>0,'backgrounded tab stops active sound')
 }finally{
  cleanup()
  for(const [key,value] of Object.entries(originals)){
   if(value===undefined)delete globalThis[key]
   else globalThis[key]=value
  }
 }
})
