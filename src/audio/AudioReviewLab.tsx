import {useState} from 'react'
import {navigateGame} from '../gameNavigation'
import {getAudioSettings,setAudioSettings,playGameSound,sceneFromSearch,type GameSound,type SoundScene} from './gameAudio'
import './audioReviewLab.css'
import {CinematicPlayer} from '../media/CinematicOverlay'
import {CINEMATICS,type CinematicId} from '../media/cinematicManifest'

const ORIGINAL:readonly {cue:GameSound;label:string;use:string}[]=[
 {cue:'hover',label:'UI Hover',use:'Quiet pointer feedback · 0.10s'},
 {cue:'click',label:'UI Click',use:'Buttons and controls · 0.14s'},
 {cue:'panelOpen',label:'Open Panel',use:'Record and control panels · 0.30s'},
 {cue:'panelClose',label:'Close Panel',use:'Return from an inspector · 0.24s'},
 {cue:'folderMove',label:'Move Folder',use:'Refiling an existing record · 0.34s'},
 {cue:'file',label:'File Evidence',use:'Both correct and wrong filing · 0.33s'},
 {cue:'evidence',label:'Collect Evidence',use:'Explicit evidence pickup · 0.27s'},
 {cue:'error',label:'Soft Error',use:'Investigative hypothesis needs revision · 0.52s'},
 {cue:'signal',label:'Signal Alert',use:'Sharp telemetry warning · 0.40s (reserved)'},
 {cue:'portal',label:'Portal Transition',use:'Original portal cue · 0.90s (needs cinematic layering)'},
 {cue:'rescue',label:'Rescue Unlocked',use:'Completing required dossier evidence · 0.86s'},
]
const KENNEY:readonly {cue:GameSound;label:string;use:string}[]=[
 {cue:'scanner',label:'Equipment Scanner',use:'Computer Noise 3 · science workstation'},
 {cue:'terminal',label:'Terminal Verified',use:'Computer Noise 1 · solved analysis'},
 {cue:'doorOpen',label:'Station Door Open',use:'Kenney sci-fi door mechanism'},
 {cue:'doorClose',label:'Station Door Close',use:'Kenney door return'},
 {cue:'engine',label:'Space Engine Low',use:'Engineering machine / later rescue'},
 {cue:'energy',label:'Energy Field',use:'Time-travel energy · reserved'},
 {cue:'metal',label:'Metal Impact',use:'Materials inspection · reserved'},
 {cue:'thruster',label:'Thruster Firing',use:'Engineering simulation · reserved'},
]
const SCENES:readonly {value:SoundScene;label:string;route:string}[]=[
 {value:'home',label:'Archive home','route':''},
 {value:'investigation',label:'Investigation room',route:'&room=1'},
 {value:'archive',label:'Archive room',route:'&station=archive'},
 {value:'signal',label:'Signal room',route:'&station=signal'},
 {value:'recordings',label:'Recordings room',route:'&station=recordings'},
 {value:'rescue',label:'Rescue laboratory',route:'&rescue=NAD'},
]
export default function AudioReviewLab(){
 const [settings,setSettings]=useState(getAudioSettings)
 const [lastSound,setLastSound]=useState<GameSound|null>(null)
 const [previewClip,setPreviewClip]=useState<CinematicId|null>(null)
 const scene=sceneFromSearch(window.location.search)
 const change=(values:Partial<typeof settings>)=>setSettings(setAudioSettings(values))
 return <main className="al-root">
  <header className="al-head"><div><small>THE ASTRAL ARCHIVES / PRODUCTION PREVIEW</small><h1>SOUND LAB · V1</h1><p>Review individual cues without loading any game backgrounds. Each file downloads only when you press Play.</p></div>
    <button onClick={()=>navigateGame('/')}>← BACK TO HOME</button></header>
  <section className="al-control" aria-label="Audio laboratory controls">
   <label><span>Sound effects</span><input type="checkbox" checked={settings.effects} onChange={e=>change({effects:e.target.checked})}/></label>
   <label><span>Room ambience</span><input type="checkbox" checked={settings.ambient} onChange={e=>change({ambient:e.target.checked})}/></label>
   <label className="al-level"><span>Master volume · {settings.volume}%</span><input aria-label="Sound Lab master volume" type="range" min="0" max="100" step="5" value={settings.volume} onChange={e=>change({volume:Number(e.target.value)})}/></label>
   <label className="al-scene"><span>Ambient preview</span><select aria-label="Ambient scene" value={scene} onChange={e=>{
     const option=SCENES.find(item=>item.value===e.target.value)
     if(option)navigateGame('/?audio-lab=1'+option.route)
    }}>
    {SCENES.map(x=><option key={x.value} value={x.value}>{x.label}</option>)}
   </select></label>
  </section>
  <p className="al-note">Click any audio preview to enable browser sound playback. Station ambience is a subtle synthetic mechanical atmosphere, not external background music. Lower volume before using headphones.</p>
  <div className="al-groups">
   <section className="al-list"><header><h2>DESIGNER ORIGINALS</h2><small>11 WAV · USER'S GOOGLE DRIVE</small></header>
    {ORIGINAL.map(item=><div key={item.cue} className={'al-cue'+(lastSound===item.cue?' al-picked':'')}>
      <div><strong>{item.label}</strong><small>{item.use}</small></div>
      <button type="button" data-sfx="none" disabled={!settings.effects||settings.volume===0} onClick={()=>{playGameSound(item.cue);setLastSound(item.cue)}} aria-label={'Play '+item.label}>▶ PLAY</button>
     </div>)}
   </section>
   <section className="al-list"><header><h2>FREE SCI-FI SUPPLEMENTS</h2><small>8 M4A · KENNEY · CC0 LICENSE</small></header>
    {KENNEY.map(item=><div key={item.cue} className={'al-cue'+(lastSound===item.cue?' al-picked':'')}>
      <div><strong>{item.label}</strong><small>{item.use}</small></div>
      <button type="button" data-sfx="none" disabled={!settings.effects||settings.volume===0} onClick={()=>{playGameSound(item.cue);setLastSound(item.cue)}} aria-label={'Play '+item.label}>▶ PLAY</button>
     </div>)}
    <p className="al-license">Original Kenney Sci-fi Sounds — Creative Commons CC0, commercial game use permitted.
      <a href="https://kenney.nl/assets/sci-fi-sounds" target="_blank" rel="noreferrer">SOURCE & LICENSE</a>
    </p>
   </section>
  </div>
  <section className="al-list" aria-label="Designer cinematic review" style={{margin:'18px auto',maxWidth:'900px'}}>
   <header><h2>DESIGNER CINEMATICS</h2><small>4 MP4 DELIVERED IN DRIVE · PUBLISHING PENDING</small></header>
   {Object.entries(CINEMATICS).map(([id,clip])=><div className="al-cue" key={id}>
    <div><strong>{clip.title}</strong><small>{clip.duration}s · Original preserved in Drive · Local clip required for playback</small></div>
    <button type="button" data-sfx="none" onClick={()=>setPreviewClip(id as CinematicId)}>REVIEW</button>
   </div>)}
  </section>
  {previewClip&&<CinematicPlayer id={previewClip} onFinish={()=>setPreviewClip(null)}/>}
  <footer>PRODUCTION AUDIO PREVIEW · ORIGINAL FILES PRESERVED · ZERO PAID SERVICES</footer>
 </main>
}
