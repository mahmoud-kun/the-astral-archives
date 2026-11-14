import { useEffect, useState } from 'react'
import { ARCHIVE_SAVE_KEY, emptyArchiveState, restoreArchiveState, type ArchiveState } from '../archive/archiveState'
import { ARCHIVE_PROGRESS_EVENT, NADIR_PROGRESS_EVENT, NADIR_SAVE_KEY, emptyNadir, restoreNadir, type NadirProgress } from './nadirEngine'

function readStorage(key:string):string|null {
 try{return window.localStorage.getItem(key)}catch{return null}
}
export function readArchive():ArchiveState{return restoreArchiveState(readStorage(ARCHIVE_SAVE_KEY))}
export function readNadir():NadirProgress{return restoreNadir(readStorage(NADIR_SAVE_KEY))}
function writeSave(key:string,eventName:string,value:unknown):void {
 try{window.localStorage.setItem(key,JSON.stringify(value))}catch{/* Storage may be disabled */}
 window.dispatchEvent(new Event(eventName))
}
export function updateArchive(fn:(current:ArchiveState)=>ArchiveState):ArchiveState{
 const before=readArchive()
 const after=fn(before)
 if(after!==before)writeSave(ARCHIVE_SAVE_KEY,ARCHIVE_PROGRESS_EVENT,after)
 return after
}
export function updateNadir(fn:(current:NadirProgress)=>NadirProgress):NadirProgress{
 const before=readNadir()
 const after=fn(before)
 if(after!==before)writeSave(NADIR_SAVE_KEY,NADIR_PROGRESS_EVENT,after)
 return after
}
function useGameSave<T>(key:string,eventName:string,reader:()=>T):T{
 const [data,setData]=useState<T>(reader)
 useEffect(()=>{
  const refresh=()=>setData(reader())
  const storage=(event:StorageEvent)=>{if(!event.key||event.key===key)refresh()}
  window.addEventListener(eventName,refresh)
  window.addEventListener('storage',storage)
  return ()=>{window.removeEventListener(eventName,refresh);window.removeEventListener('storage',storage)}
 },[key,eventName,reader])
 return data
}
export function useArchiveSave(){return useGameSave(ARCHIVE_SAVE_KEY,ARCHIVE_PROGRESS_EVENT,readArchive)}
export function useNadirSave(){return useGameSave(NADIR_SAVE_KEY,NADIR_PROGRESS_EVENT,readNadir)}
export function ensureArchiveInitialized():ArchiveState{
 return typeof window==='undefined'?emptyArchiveState():readArchive()
}
export function ensureNadirInitialized():NadirProgress{
 return typeof window==='undefined'?emptyNadir():readNadir()
}
