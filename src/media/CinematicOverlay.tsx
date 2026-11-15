import {useCallback,useEffect,useRef,useState} from 'react'
import {AUDIO_SETTINGS_EVENT,claimCinematicAudioFocus,getAudioSettings} from '../audio/gameAudio'
import {CINEMATICS,CINEMATIC_REQUEST_EVENT,cinematicVolume,dispatchCinematicFinished,isCinematicId,isLiveCinematicAllowed,type CinematicId,type CinematicOutcome} from './cinematicManifest'
import './cinematicOverlay.css'

type ClipStatus='loading'|'paused'|'playing'|'ended'|'error'|'reduced-motion'

/** Pure media layer: cannot write evidence, navigate, or unlock a rescue. */
export function CinematicPlayer({id,onFinish}:{id:CinematicId;onFinish:(outcome:CinematicOutcome)=>void}){
 const clip=CINEMATICS[id]
 const videoRef=useRef<HTMLVideoElement|null>(null)
 const skipRef=useRef<HTMLButtonElement|null>(null)
 const doneRef=useRef(false)
 const [settings,setSettings]=useState(getAudioSettings)
 const [soundRequested,setSoundRequested]=useState(false)
 const [reducedMotion]=useState(()=>typeof window!=='undefined'&&typeof window.matchMedia==='function'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)
 const [status,setStatus]=useState<ClipStatus>(reducedMotion?'reduced-motion':'loading')
 const [duration,setDuration]=useState<number>(clip.duration)
 const [position,setPosition]=useState(0)
 const [fullscreenError,setFullscreenError]=useState(false)
 const [attempted,setAttempted]=useState(false)
 const volume=cinematicVolume(id,settings.volume)
 const allowedSound=settings.effects&&volume>0
 const muted=!soundRequested||!allowedSound

 useEffect(()=>{
  const previous=document.activeElement instanceof HTMLElement?document.activeElement:null
  skipRef.current?.focus()
  const releaseFocus=claimCinematicAudioFocus()
  const onSettings=()=>setSettings(getAudioSettings())
  window.addEventListener(AUDIO_SETTINGS_EVENT,onSettings)
  return ()=>{
   releaseFocus()
   window.removeEventListener(AUDIO_SETTINGS_EVENT,onSettings)
   previous?.focus()
  }
 },[])

 useEffect(()=>{
  const video=videoRef.current
  if(!video)return
  video.volume=volume
  video.muted=muted
 },[volume,muted])

 useEffect(()=>{
  const onHidden=()=>{
   if(document.hidden){videoRef.current?.pause();setStatus(s=>s==='playing'?'paused':s)}
  }
  document.addEventListener('visibilitychange',onHidden)
  return ()=>document.removeEventListener('visibilitychange',onHidden)
 },[])

 useEffect(()=>{
  if(reducedMotion)return
  const video=videoRef.current
  if(!video)return
  // Muted autoplay only. If blocked, the explicit Play control remains.
  setAttempted(true)
  const playback=video.play()
  if(playback)void playback.catch(()=>setStatus(s=>s==='loading'?'paused':s))
 },[id,reducedMotion])

 const finish=useCallback((outcome:CinematicOutcome)=>{
  if(doneRef.current)return
  doneRef.current=true
  videoRef.current?.pause()
  onFinish(outcome)
 },[onFinish])

 useEffect(()=>{
  const onKey=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();finish('skipped')}
  }
  window.addEventListener('keydown',onKey)
  return ()=>window.removeEventListener('keydown',onKey)
 },[finish])

 const play=()=>{
  const video=videoRef.current
  if(!video)return
  if(video.ended||status==='ended')video.currentTime=0
  setAttempted(true)
  setStatus('loading')
  const result=video.play()
  if(result)void result.catch(()=>setStatus('paused'))
 }
 const replay=()=>{
  const video=videoRef.current
  if(!video)return
  video.pause()
  video.currentTime=0
  setPosition(0)
  play()
 }
 const toggleFullscreen=()=>{
  const video=videoRef.current
  if(!video||document.fullscreenElement)return
  const iosVideo=video as HTMLVideoElement & {webkitEnterFullscreen?:()=>void}
  if(typeof video.requestFullscreen==='function'){
   void video.requestFullscreen().catch(()=>setFullscreenError(true))
  }else if(typeof iosVideo.webkitEnterFullscreen==='function'){
   try{iosVideo.webkitEnterFullscreen()}catch{setFullscreenError(true)}
  }else setFullscreenError(true)
 }
 const unavailable=status==='error'
 const isDone=status==='ended'
 return <div className="cm-backdrop" role="dialog" aria-modal="true" aria-label={clip.title}>
  <section className="cm-panel">
   <header className="cm-header"><div><small>THE ASTRAL ARCHIVES · CINEMATIC RECORD</small><h2>{clip.title}</h2></div>
    <button ref={skipRef} type="button" data-sfx="none" onClick={()=>finish('skipped')}>SKIP <span aria-hidden="true">×</span></button>
   </header>
   <div className="cm-stage">
    <video ref={videoRef} className="cm-video" src={clip.path} preload="metadata" playsInline
     controls={false} muted={muted} disablePictureInPicture
     onLoadedMetadata={e=>{const d=e.currentTarget.duration;if(Number.isFinite(d)&&d>0)setDuration(d)}}
     onTimeUpdate={e=>setPosition(e.currentTarget.currentTime)}
     onPlaying={()=>setStatus('playing')}
     onPause={()=>setStatus(s=>s==='playing'?'paused':s)}
     onWaiting={()=>setStatus(s=>s==='ended'?s:'loading')}
     onEnded={()=>setStatus('ended')}
     onError={()=>setStatus('error')}
     aria-label={clip.title}/>
    {(status==='reduced-motion'||status==='paused'||status==='ended'||unavailable)&&<div className="cm-overlay-message" role="status">
      {unavailable?<><strong>VIDEO UNAVAILABLE</strong><p>This designer clip did not load. Your investigation save is unchanged.</p></>:
       isDone?<><strong>RECORDING COMPLETE</strong><p>Replay the clip or continue.</p></>:
       status==='reduced-motion'?<><strong>REDUCED MOTION ENABLED</strong><p>Playback starts only after you select Play.</p></>:
       <><strong>PLAYBACK PAUSED</strong><p>Select Play to resume this recording.</p></>}
      {!unavailable&&!isDone&&<button type="button" data-sfx="none" onClick={play}>PLAY RECORDING</button>}
     </div>}
    {status==='loading'&&attempted&&<span className="cm-loading" role="status">LOADING RECORDING…</span>}
   </div>
   <footer className="cm-controls">
    <div className="cm-transport">
     <button data-sfx="none" type="button" disabled={unavailable} onClick={()=>{if(status==='playing'){videoRef.current?.pause();setStatus('paused')}else play()}}>{status==='playing'?'PAUSE':'PLAY'}</button>
     <button data-sfx="none" type="button" disabled={unavailable} onClick={replay}>REPLAY</button>
     <span className="cm-time" aria-label="Playback progress">{Math.floor(position)} / {Math.ceil(duration)}s</span>
    </div>
    <div className="cm-actions">
     <button data-sfx="none" type="button" disabled={!allowedSound||unavailable} onClick={()=>setSoundRequested(v=>!v)} aria-pressed={soundRequested&&allowedSound}>{soundRequested&&allowedSound?'MUTE VIDEO':'ENABLE VIDEO SOUND'}</button>
     <button data-sfx="none" type="button" disabled={unavailable} onClick={toggleFullscreen}>FULLSCREEN</button>
     <button data-sfx="none" type="button" onClick={()=>finish('returned')}>RETURN</button>
     <button data-sfx="none" type="button" className="cm-primary" onClick={()=>finish(unavailable?'unavailable':isDone?'completed':'skipped')}>{unavailable?'CONTINUE WITHOUT VIDEO':isDone?'CONTINUE':'SKIP & CONTINUE'}</button>
    </div>
   </footer>
   {fullscreenError&&<p className="cm-info" role="status">Fullscreen is unavailable in this browser. Inline playback remains available.</p>}
   <p className="cm-info">Optional playback · Master volume and Sound Effects toggle apply · This player never changes evidence or rescue gates.</p>
  </section>
 </div>
}

/** Mount once in the shared root after Main approves the patch. */
export default function CinematicOverlay(){
 const [active,setActive]=useState<CinematicId|null>(null)
 const activeRef=useRef<CinematicId|null>(null)
 useEffect(()=>{
  const onRequest=(event:Event)=>{
   const id=(event as CustomEvent<{id?:unknown}>).detail?.id
   if(!isCinematicId(id)||!isLiveCinematicAllowed(id)||activeRef.current)return
   activeRef.current=id
   setActive(id)
  }
  window.addEventListener(CINEMATIC_REQUEST_EVENT,onRequest)
  return ()=>window.removeEventListener(CINEMATIC_REQUEST_EVENT,onRequest)
 },[])
 const handleFinish=(outcome:CinematicOutcome)=>{
  const id=activeRef.current
  activeRef.current=null
  setActive(null)
  if(id)dispatchCinematicFinished({id,outcome})
 }
 return active?<CinematicPlayer key={active} id={active} onFinish={handleFinish}/>:null
}
