import {useEffect,useRef,useState} from 'react'
import {AUDIO_SETTINGS_EVENT,EVIDENCE_VOICE_STOP_EVENT,claimCinematicAudioFocus,getAudioSettings} from './gameAudio'
import {EVIDENCE_VOICE,evidenceVoiceVolume,type EvidenceVoiceId} from './evidenceVoiceManifest'

/** Prevent overlapping spoken evidence playback in one open game tab. */
export const EVIDENCE_VOICE_PLAY_EVENT='astral:evidence-voice-play'

/**
 * Optional playable source recording for an EXISTING evidence record only.
 * Main mounts it inside the verified evidence inspector for any supported case. This component never
 * marks evidence solved, discovered, filed or rescue-ready.
 */
export default function EvidenceVoicePlayer({id}:{id:EvidenceVoiceId}){
 const recording=EVIDENCE_VOICE[id]
 const audioRef=useRef<HTMLAudioElement|null>(null)
 const releaseRef=useRef<(()=>void)|null>(null)
 const [settings,setSettings]=useState(getAudioSettings)
 const [failed,setFailed]=useState(false)
 useEffect(()=>setFailed(false),[id])
 useEffect(()=>{
  const onVoiceStart=(event:Event)=>{
   const active=(event as CustomEvent<{id:EvidenceVoiceId}>).detail?.id
   if(active&&active!==id)audioRef.current?.pause()
  }
  const stopForCinematic=()=>audioRef.current?.pause()
  window.addEventListener(EVIDENCE_VOICE_PLAY_EVENT,onVoiceStart)
  window.addEventListener(EVIDENCE_VOICE_STOP_EVENT,stopForCinematic)
  return()=>{
   window.removeEventListener(EVIDENCE_VOICE_PLAY_EVENT,onVoiceStart)
   window.removeEventListener(EVIDENCE_VOICE_STOP_EVENT,stopForCinematic)
  }
 },[id])
 useEffect(()=>{
  const update=()=>setSettings(getAudioSettings())
  window.addEventListener(AUDIO_SETTINGS_EVENT,update)
  return ()=>{
   window.removeEventListener(AUDIO_SETTINGS_EVENT,update)
   releaseRef.current?.()
   releaseRef.current=null
  }
 },[])
 useEffect(()=>{
  const audio=audioRef.current
  if(!audio)return
  audio.volume=evidenceVoiceVolume(id,settings.volume)
  audio.muted=!settings.effects||settings.volume===0
 },[id,settings])
 const stopFocus=()=>{
  releaseRef.current?.()
  releaseRef.current=null
 }
 return <div className="al-evidence-voice" aria-label={'Audio evidence '+recording.evidenceId}>
  <strong>{recording.title}</strong>
  <small>EXISTING EVIDENCE {recording.evidenceId} · {recording.duration}s · Optional playback</small>
  <audio key={id} ref={audioRef} src={recording.path} controls preload="none"
   aria-label={'Play '+recording.evidenceId+' analyst audio'}
   onPlay={()=>{
    if(!releaseRef.current)releaseRef.current=claimCinematicAudioFocus()
    window.dispatchEvent(new CustomEvent(EVIDENCE_VOICE_PLAY_EVENT,{detail:{id}}))
   }}
   onPause={stopFocus} onEnded={stopFocus}
   onError={()=>{stopFocus();setFailed(true)}}/>
  {failed&&<small role="status">Source recording unavailable. The original evidence text remains accessible.</small>}
  <small>Optional fictional case recording. Playing it never collects evidence, unlocks rescue or verifies a hypothesis. Exact captions and speaker labels require script approval.</small>
 </div>
}
