/**
 * The Astral Archives — optional, lazy, low-bandwidth game audio.
 *
 * The original WAV files are the designer's files from the NASA Drive folder.
 * Additional sci-fi machine/door cues are from Kenney Sci-fi Sounds (CC0);
 * see docs/audio/AUDIO_SOURCES_AND_INTEGRATION_V1.md for provenance.
 *
 * Nothing is loaded or played automatically on page load.
 */
export const AUDIO_SETTINGS_KEY = 'astral-audio-settings-v1'
export const AUDIO_SETTINGS_EVENT = 'astral:audio-settings-change'

export type GameAudioSettings = {
  effects: boolean
  ambient: boolean
  volume: number // 0–100
}
const DEFAULT_SETTINGS: GameAudioSettings = { effects:true, ambient:true, volume:40 }

export const SOUND_PATHS = {
  hover:'/assets/audio/sfx/ui_hover.wav',
  click:'/assets/audio/sfx/ui_click.wav',
  panelOpen:'/assets/audio/sfx/panel_open.wav',
  panelClose:'/assets/audio/sfx/panel_close.wav',
  folderMove:'/assets/audio/sfx/folder_move.wav',
  file:'/assets/audio/sfx/folder_file.wav',
  evidence:'/assets/audio/sfx/evidence_collected.wav',
  error:'/assets/audio/sfx/error_soft.wav',
  signal:'/assets/audio/sfx/signal_alert.wav',
  portal:'/assets/audio/sfx/portal_transition.wav',
  rescue:'/assets/audio/sfx/rescue_unlocked.wav',
  scanner:'/assets/audio/kenney/computer-noise-002.m4a',
  terminal:'/assets/audio/kenney/computer-noise-000.m4a',
  doorOpen:'/assets/audio/kenney/door-open-000.m4a',
  doorClose:'/assets/audio/kenney/door-close-000.m4a',
  engine:'/assets/audio/kenney/space-engine-low-000.m4a',
  energy:'/assets/audio/kenney/force-field-000.m4a',
  metal:'/assets/audio/kenney/impact-metal-000.m4a',
  thruster:'/assets/audio/kenney/thruster-fire-000.m4a',
} as const
export type GameSound = keyof typeof SOUND_PATHS

const LEVEL:Record<GameSound,number>={
  hover:.085, click:.22, panelOpen:.22, panelClose:.2,
  folderMove:.18, file:.22, evidence:.25, error:.1, signal:.07,
  portal:.26, rescue:.25, scanner:.16, terminal:.12,
  doorOpen:.17, doorClose:.15, engine:.09, energy:.15, metal:.15,thruster:.12,
}
const RATE_LIMIT:Partial<Record<GameSound,number>>={hover:110,click:45,scanner:120,signal:900,folderMove:90,file:80,doorOpen:120,doorClose:120}

/** Pure gain helper. Browser playback and slider use the same bounded calculation. */
export function gameSoundVolume(cue:GameSound,masterVolume:number):number{
 const master=typeof masterVolume==='number'&&Number.isFinite(masterVolume)
  ?Math.max(0,Math.min(100,masterVolume)):0
 return Math.min(1,LEVEL[cue]*master/100)
}
function clampNumber(value:unknown, fallback:number){
 return typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(100,Math.round(value))):fallback
}
export function parseAudioSettings(raw:string|null):GameAudioSettings{
 if(!raw)return {...DEFAULT_SETTINGS}
 try{
  const x:unknown=JSON.parse(raw)
  if(!x||typeof x!=='object')return {...DEFAULT_SETTINGS}
  const v=x as Partial<GameAudioSettings>
  return {effects:typeof v.effects==='boolean'?v.effects:DEFAULT_SETTINGS.effects,
   ambient:typeof v.ambient==='boolean'?v.ambient:DEFAULT_SETTINGS.ambient,
   volume:clampNumber(v.volume,DEFAULT_SETTINGS.volume)}
 }catch{return {...DEFAULT_SETTINGS}}
}
export function getAudioSettings():GameAudioSettings{
 try{return parseAudioSettings(window.localStorage.getItem(AUDIO_SETTINGS_KEY))}
 catch{return {...DEFAULT_SETTINGS}}
}
export function setAudioSettings(patch:Partial<GameAudioSettings>):GameAudioSettings{
 const current=getAudioSettings()
 const next:GameAudioSettings={
  effects:typeof patch.effects==='boolean'?patch.effects:current.effects,
  ambient:typeof patch.ambient==='boolean'?patch.ambient:current.ambient,
  volume:clampNumber(patch.volume,current.volume),
 }
 try{window.localStorage.setItem(AUDIO_SETTINGS_KEY,JSON.stringify(next))}catch{/* Private browsing */}
 window.dispatchEvent(new Event(AUDIO_SETTINGS_EVENT))
 return next
}

const activeSounds=new Map<HTMLAudioElement,GameSound>()
let cinematicFocusCount=0
/** Quiet the station and one-shots while a cinematic uses its own soundtrack. */
export function claimCinematicAudioFocus():()=>void{
 cinematicFocusCount++
 stopAllSounds()
 updateAmbience()
 let released=false
 return ()=>{
  if(released)return
  released=true
  cinematicFocusCount=Math.max(0,cinematicFocusCount-1)
  updateAmbience()
 }
}
function stopAllSounds(){
 for(const clip of activeSounds.keys()){
  try{clip.pause();clip.currentTime=0}catch{/* Browser may block seeking */ }
 }
 activeSounds.clear()
}
const lastPlayed=new Map<GameSound,number>()
let context:AudioContext|null=null
let ambianceGain:GainNode|null=null
let lowOsc:OscillatorNode|null=null
let upperOsc:OscillatorNode|null=null
let noiseSource:AudioBufferSourceNode|null=null
let enabledByGesture=false
let soundSerial=0
const SCENE_TONES={
 home:{low:76,high:124,level:.11},
 investigation:{low:67,high:112,level:.17},
 archive:{low:75,high:157,level:.15},
 signal:{low:89,high:203,level:.18},
 recordings:{low:82,high:142,level:.13},
 rescue:{low:57,high:102,level:.18},
} as const
export type SoundScene=keyof typeof SCENE_TONES
export function sceneFromSearch(search:string):SoundScene{
 const q=new URLSearchParams(search.startsWith('?')?search.slice(1):search)
 if(q.get('rescue')==='NAD')return 'rescue'
 if(q.get('folder-lab')==='1')return 'archive'
 if(q.get('station')==='signal')return 'signal'
 if(q.get('station')==='archive')return 'archive'
 if(q.get('station')==='recordings')return 'recordings'
 if(q.get('room')==='1')return 'investigation'
 return 'home'
}

function initializeAmbience(){
 if(typeof window==='undefined'||context)return
 const AudioContextCtor=window.AudioContext
 if(!AudioContextCtor)return
 try{
  const ctx=new AudioContextCtor()
  const master=ctx.createGain()
  master.gain.value=0
  master.connect(ctx.destination)
  const low=ctx.createOscillator(),high=ctx.createOscillator()
  low.type='sine';high.type='triangle'
  const gl=ctx.createGain(),gh=ctx.createGain()
  gl.gain.value=.13;gh.gain.value=.03
  low.connect(gl).connect(master)
  high.connect(gh).connect(master)
  const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=250
  const gn=ctx.createGain();gn.gain.value=.016
  const buffer=ctx.createBuffer(1,Math.round(ctx.sampleRate*2.4),ctx.sampleRate)
  const channel=buffer.getChannelData(0)
  // A repeatable quiet air circulation bed, not a sample of sound in vacuum.
  let seed=2841
  for(let i=0;i<channel.length;i++){
   seed=(Math.imul(1664525,seed)+1013904223)|0
   const windowing=Math.sin(Math.PI*i/(channel.length-1))
   channel[i]=((seed>>>8)/8388607.5-1)*windowing
  }
  const noise=ctx.createBufferSource()
  noise.buffer=buffer;noise.loop=true
  noise.connect(f).connect(gn).connect(master)
  low.start();high.start();noise.start()
  context=ctx;ambianceGain=master;lowOsc=low;upperOsc=high;noiseSource=noise
 }catch{/* Unsupported or blocked WebAudio: one-shots still work. */}
}
function updateAmbience(){
 const ctx=context,gain=ambianceGain
 if(!ctx||!gain)return
 const prefs=getAudioSettings()
 const scene=SCENE_TONES[sceneFromSearch(window.location.search)]
 const audible=enabledByGesture&&prefs.ambient&&prefs.volume>0&&!document.hidden&&cinematicFocusCount===0
 const target=audible?scene.level*(prefs.volume/100):0
 const now=ctx.currentTime
 gain.gain.setTargetAtTime(target,now,.25)
 lowOsc?.frequency.setTargetAtTime(scene.low,now,.3)
 upperOsc?.frequency.setTargetAtTime(scene.high,now,.3)
}
function activateFromGesture(){
 enabledByGesture=true
 initializeAmbience()
 if(context?.state==='suspended')void context.resume().catch(()=>{})
 updateAmbience()
}
export function playGameSound(cue:GameSound){
 if(typeof window==='undefined'||typeof Audio==='undefined')return
 const prefs=getAudioSettings()
 if(!prefs.effects||prefs.volume<=0||document.hidden||cinematicFocusCount>0)return
 const now=performance.now()
 const limit=RATE_LIMIT[cue]??0
 if(limit>0&&now-(lastPlayed.get(cue)??-Infinity)<limit)return
 if(activeSounds.size>=6&&cue==='hover')return
 if(activeSounds.size>=8){
  const oldest=activeSounds.keys().next().value
  if(oldest){oldest.pause();activeSounds.delete(oldest)}
 }
 lastPlayed.set(cue,now)
 try{
  // Lazy: no network request until the actual cue is triggered.
  const audio=new Audio(SOUND_PATHS[cue])
  audio.preload='none'
  audio.volume=gameSoundVolume(cue,prefs.volume)
  audio.dataset.astralSound=cue
  activeSounds.set(audio,cue)
  const cleanup=()=>{activeSounds.delete(audio);audio.removeEventListener('ended',cleanup);audio.removeEventListener('error',cleanup)}
  audio.addEventListener('ended',cleanup,{once:true})
  audio.addEventListener('error',cleanup,{once:true})
  const promise=audio.play()
  if(promise&&typeof promise.catch==='function')void promise.catch(cleanup)
  soundSerial++
 }catch{/* Audio failure must never block gameplay. */}
}
export function gameSoundPlayCount(){return soundSerial}

/** A single delegated listener prevents 200+ button-specific hover handlers. */
export function installGameAudio():()=>void{
 let hovered:Element|null=null
 const onPointerDown=()=>activateFromGesture()
 const onKeyDown=(event:KeyboardEvent)=>{
  if(event.key==='Enter'||event.key===' ')activateFromGesture()
 }
 const onClick=(event:MouseEvent)=>{
  const target=event.target
  if(!(target instanceof Element))return
  activateFromGesture()
  const control=target.closest('button,a,[role="button"]') as HTMLElement|null
  if(!control||control.getAttribute('aria-disabled')==='true'||('disabled' in control&&control.disabled))return
  const raw=control.dataset.sfx
  if(raw==='none')return
  const sound=raw&&Object.prototype.hasOwnProperty.call(SOUND_PATHS,raw)?raw as GameSound:'click'
  playGameSound(sound)
 }
 const onHover=(event:PointerEvent)=>{
  if(event.pointerType!=='mouse'&&event.pointerType!=='pen')return
  const target=event.target
  if(!(target instanceof Element))return
  const button=target.closest('button,a,[role="button"]')
  if(!button||button===hovered||button.contains(event.relatedTarget as Node)||('disabled' in button&&(button as HTMLButtonElement).disabled))return
  hovered=button
  playGameSound('hover')
 }
 const onLeave=(event:PointerEvent)=>{
  if(!(event.target instanceof Element))return
  if(hovered&&event.target.contains(hovered))hovered=null
 }
 const onChange=()=>{
  const prefs=getAudioSettings()
  if(!prefs.effects||prefs.volume<=0||document.hidden||cinematicFocusCount>0){
   stopAllSounds()
  }else{
   for(const [clip,cue] of activeSounds)clip.volume=gameSoundVolume(cue,prefs.volume)
  }
  updateAmbience()
 }
 const onNavigate=()=>updateAmbience()
 document.addEventListener('pointerdown',onPointerDown,{capture:true,passive:true})
 document.addEventListener('keydown',onKeyDown,true)
 document.addEventListener('click',onClick,true)
 document.addEventListener('pointerover',onHover)
 document.addEventListener('pointerout',onLeave)
 document.addEventListener('visibilitychange',onChange)
 window.addEventListener(AUDIO_SETTINGS_EVENT,onChange)
 window.addEventListener('astral:route-change',onNavigate)
 window.addEventListener('popstate',onNavigate)
 return ()=>{
  document.removeEventListener('pointerdown',onPointerDown,true)
  document.removeEventListener('keydown',onKeyDown,true)
  document.removeEventListener('click',onClick,true)
  document.removeEventListener('pointerover',onHover)
  document.removeEventListener('pointerout',onLeave)
  document.removeEventListener('visibilitychange',onChange)
  window.removeEventListener(AUDIO_SETTINGS_EVENT,onChange)
  window.removeEventListener('astral:route-change',onNavigate)
  window.removeEventListener('popstate',onNavigate)
  stopAllSounds()
  if(ambianceGain&&context)ambianceGain.gain.setTargetAtTime(0,context.currentTime,.05)
 }
}
