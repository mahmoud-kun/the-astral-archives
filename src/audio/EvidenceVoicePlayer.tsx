import {useEffect,useRef,useState} from 'react'
import {AUDIO_SETTINGS_EVENT,claimCinematicAudioFocus,getAudioSettings} from './gameAudio'
import {EVIDENCE_VOICE,evidenceVoiceVolume,type EvidenceVoiceId} from './evidenceVoiceManifest'

/**
 * Optional playable source recording for an EXISTING evidence record only.
 * Main mounts it inside its verified KES-05 inspector. This component never
 * marks evidence solved, discovered, filed or rescue-ready.
 */
export default function EvidenceVoicePlayer({id}:{id:EvidenceVoiceId}){
 const recording=EVIDENCE_VOICE[id]
 const audioRef=useRef<HTMLAudioElement|null>(null)
 const releaseRef=useRef<(()=>void)|null>(null)
 const [settings,setSettings]=useState(getAudioSettings)
 const [failed,setFailed]=useState(false)
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
  <audio ref={audioRef} src={recording.path} controls preload="none"
   aria-label={'Play '+recording.evidenceId+' analyst audio'}
   onPlay={()=>{if(!releaseRef.current)releaseRef.current=claimCinematicAudioFocus()}}
   onPause={stopFocus} onEnded={stopFocus}
   onError={()=>{stopFocus();setFailed(true)}}/>
  {failed&&<small role="status">Source recording unavailable. The original evidence text remains accessible.</small>}
  <small>This recording supplements KES-05; playing it does not collect evidence. Speaker-labelled captions await script approval.</small>
 </div>
}
