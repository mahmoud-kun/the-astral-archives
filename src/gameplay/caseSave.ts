import { useEffect, useState } from 'react'
import { OTHER_INVESTIGATION_EVENT, OTHER_INVESTIGATION_KEY, emptyOtherProgress, restoreOtherProgress, type OtherProgress } from './caseEvidenceEngine'

function load():OtherProgress{
 try{return typeof window==='undefined'?emptyOtherProgress():restoreOtherProgress(window.localStorage.getItem(OTHER_INVESTIGATION_KEY))}
 catch{return emptyOtherProgress()}
}
export function readOtherProgress():OtherProgress{return load()}
export function updateOtherProgress(fn:(s:OtherProgress)=>OtherProgress):OtherProgress{
 const current=load()
 const next=fn(current)
 if(next!==current&&typeof window!=='undefined'){
  try{window.localStorage.setItem(OTHER_INVESTIGATION_KEY,JSON.stringify(next))}catch{/* safe in restricted storage */}
  window.dispatchEvent(new Event(OTHER_INVESTIGATION_EVENT))
 }
 return next
}
export function useOtherProgress():OtherProgress{
 const [progress,setProgress]=useState<OtherProgress>(load)
 useEffect(()=>{
  const refresh=()=>setProgress(load())
  const external=(event:StorageEvent)=>{if(!event.key||event.key===OTHER_INVESTIGATION_KEY)refresh()}
  window.addEventListener(OTHER_INVESTIGATION_EVENT,refresh)
  window.addEventListener('storage',external)
  return ()=>{window.removeEventListener(OTHER_INVESTIGATION_EVENT,refresh);window.removeEventListener('storage',external)}
 },[])
 return progress
}
