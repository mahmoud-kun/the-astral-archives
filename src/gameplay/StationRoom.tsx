import { useEffect, useState } from 'react'
import { navigateGame } from '../gameNavigation'
import NadirPuzzle from './NadirPuzzle'
import { useArchiveSave, useNadirSave } from './gameSave'
import { NADIR_ROOM, stationLabel, stationRoute, type NadirRecord, type StationId } from './nadirEngine'
import './stationRoom.css'

type OtherStation = Exclude<StationId,'investigation'>
type Hotspot = {id:NadirRecord;name:string;rect:[number,number,number,number];hint:string}
const ROOM_SCENES:Record<OtherStation,{asset:string;description:string;hotspots:readonly Hotspot[]}> = {
 signal:{
  asset:'/assets/rooms/Signal_Original_REFERENCE.png',description:'Telemetry and communication analysis',
  hotspots:[
   {id:'NAD-01',name:'NAVIGATION TRACK COMPARISON',rect:[29,30,41,31],hint:'Central signal display'},
   {id:'NAD-02',name:'RAW IMPULSE EXPORT 0038',rect:[42,61,17,13],hint:'Receiver and message equipment'},
  ],
 },
 archive:{
  asset:'/assets/rooms/Archive_Original_REFERENCE.png',description:'Mission records, interface contracts and systems history',
  hotspots:[
   {id:'NAD-03',name:'INTERFACE CONTROL ICD-07',rect:[69,31,29,24],hint:'Primary mission archive display'},
   {id:'NAD-04',name:'SOFTWARE EXPORT TRACE',rect:[25,47,26,23],hint:'Central processing desk'},
   {id:'NAD-08',name:'IMPULSE REFERENCE',rect:[2,58,15,23],hint:'Physical filing drawers'},
  ],
 },
 recordings:{
  asset:'/assets/rooms/Recordings_Original_REFERENCE.png',description:'Recovered communications and review chronology',
  hotspots:[
   {id:'NAD-05',name:'ENGINEER ANOMALY EMAIL',rect:[70,18,25,33],hint:'Recovered correspondence on playback display'},
   {id:'NAD-07',name:'REVIEW MEMORY CLIP',rect:[11,37,25,25],hint:'Left recording rack and waveform station'},
  ],
 },
}

export default function StationRoom({station}:{station:OtherStation}){
 const scene=ROOM_SCENES[station]
 const [selected,setSelected]=useState<NadirRecord|null>(null)
 const archive=useArchiveSave()
 const research=useNadirSave()
 useEffect(()=>setSelected(null),[station])
 useEffect(()=>{
  if(!selected)return
  const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setSelected(null)}
  window.addEventListener('keydown',close)
  return ()=>window.removeEventListener('keydown',close)
 },[selected])
 return <main className="sr-root" aria-label={stationLabel(station)+' Room'}>
  <div className="sr-space" aria-hidden="true"/>
  <section className="sr-stage" aria-label={scene.description}>
   <img className="sr-plate" src={scene.asset} alt={stationLabel(station)+' space station room with interactive equipment'} decoding="async"/>
   {scene.hotspots.map(spot=>{
    const solved=research.solved.includes(spot.id)
    const collected=archive.discovered.includes(spot.id)
    return <button key={spot.id} className={'sr-hotspot'+(collected?' sr-collected':'')} style={{
      left:spot.rect[0]+'%',top:spot.rect[1]+'%',width:spot.rect[2]+'%',height:spot.rect[3]+'%',
     }} title={spot.hint} aria-label={spot.name+(collected?', evidence collected':solved?', analyzed':'')}
      onClick={()=>setSelected(spot.id)}>
      <span className="sr-hotspot-label">{spot.name}{collected?' · COLLECTED':solved?' · READY TO COLLECT':''}</span>
     </button>
   })}
  </section>
  <header className="sr-head">
   <button className="sr-back" onClick={()=>navigateGame(stationRoute('investigation'))}>← INVESTIGATION</button>
   <div className="sr-heading"><small>STATION / PRESENT TIMELINE / {stationLabel(station).toUpperCase()}</small><strong>{stationLabel(station).toUpperCase()} ROOM</strong></div>
   <nav className="sr-nav" aria-label="Station rooms">
    {(['investigation','archive','signal','recordings'] as const).map(item=><button key={item} className={station===item?'current':''} disabled={station===item} onClick={()=>navigateGame(stationRoute(item))}>{stationLabel(item)}</button>)}
   </nav>
  </header>
  <div className="sr-instruction"><strong>HOVER / TAP THE EQUIPMENT</strong><span>Investigative tools · all records are fictional training simulations</span></div>
  <footer className="sr-foot"><span>NADIR / EVIDENCE INVESTIGATION</span><span>INSPECT → ANALYZE → MANUALLY COLLECT → FILE</span></footer>
  {selected&&NADIR_ROOM[selected]===station&&<NadirPuzzle key={selected} id={selected} onClose={()=>setSelected(null)}/>}
 </main>
}
