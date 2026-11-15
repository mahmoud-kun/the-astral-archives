import type {GameSound} from './gameAudio'

/** Original lightweight Web Audio interaction score. No sampled sci-fi
 * explosions or third-party assets; envelopes are soft and never clip.
 * Uses a single user-unlocked AudioContext, and degrades to existing clips
 * when AudioContext is unavailable.
 */
type Voice={hz:number;end?:number;delay?:number;length?:number;gain?:number;wave?:OscillatorType}
type Cue={duration:number;voices:readonly Voice[];filter?:number}
const CUES:Record<GameSound,Cue>={
 hover:{duration:.11,filter:1250,voices:[{hz:523,end:540,wave:'sine',gain:.26,length:.10}]},
 click:{duration:.15,filter:1600,voices:[{hz:392,end:450,wave:'sine',gain:.6},{hz:588,end:610,wave:'triangle',gain:.13,delay:.018}]},
 panelOpen:{duration:.36,filter:1800,voices:[{hz:330,end:392,wave:'sine',gain:.48,length:.33},{hz:495,end:659,wave:'triangle',gain:.22,delay:.08,length:.25}]},
 panelClose:{duration:.29,filter:1500,voices:[{hz:540,end:390,wave:'sine',gain:.44,length:.27},{hz:650,end:480,wave:'triangle',gain:.12,length:.18}]},
 folderMove:{duration:.23,filter:1350,voices:[{hz:290,end:345,wave:'sine',gain:.54,length:.21},{hz:480,end:510,wave:'triangle',gain:.10,delay:.04,length:.12}]},
 file:{duration:.40,filter:1800,voices:[{hz:392,end:395,wave:'sine',gain:.34,length:.33},{hz:587,end:591,wave:'sine',gain:.34,delay:.06,length:.29},{hz:784,end:794,wave:'triangle',gain:.18,delay:.1,length:.25}]},
 evidence:{duration:.76,filter:2100,voices:[{hz:523,end:523,wave:'sine',gain:.28,length:.50},{hz:784,end:790,wave:'sine',gain:.32,delay:.09,length:.54},{hz:1047,end:1047,wave:'triangle',gain:.11,delay:.21,length:.44}]},
 error:{duration:.29,filter:800,voices:[{hz:244,end:217,wave:'sine',gain:.46,length:.25},{hz:356,end:310,wave:'triangle',gain:.11,delay:.04,length:.22}]},
 signal:{duration:.63,filter:1600,voices:[{hz:440,end:450,wave:'sine',gain:.34,length:.14},{hz:554,end:550,wave:'sine',gain:.33,delay:.20,length:.14},{hz:659,end:655,wave:'sine',gain:.24,delay:.39,length:.19}]},
 portal:{duration:1.25,filter:2200,voices:[{hz:88,end:216,wave:'sine',gain:.30,length:1.1},{hz:176,end:432,wave:'triangle',gain:.24,length:.96},{hz:523,end:659,wave:'sine',gain:.20,delay:.23,length:.82},{hz:784,end:880,wave:'sine',gain:.12,delay:.52,length:.69}]},
 rescue:{duration:.91,filter:2100,voices:[{hz:392,end:392,wave:'sine',gain:.28,length:.36},{hz:523,end:523,wave:'sine',gain:.27,delay:.15,length:.45},{hz:659,end:659,wave:'sine',gain:.26,delay:.32,length:.50}]},
 rescueComplete:{duration:1.75,filter:2300,voices:[{hz:261.63,wave:'sine',gain:.26,length:1.18},{hz:329.63,wave:'sine',gain:.22,delay:.14,length:1.16},{hz:392,wave:'sine',gain:.22,delay:.26,length:1.20},{hz:523.25,wave:'triangle',gain:.09,delay:.44,length:1.19}]},
 scanner:{duration:.36,filter:1700,voices:[{hz:410,end:590,wave:'sine',gain:.32,length:.27},{hz:820,end:920,wave:'triangle',gain:.07,delay:.09,length:.21}]},
 terminal:{duration:.26,filter:1500,voices:[{hz:330,end:370,wave:'sine',gain:.37,length:.22},{hz:550,end:565,wave:'triangle',gain:.10,delay:.04,length:.16}]},
 doorOpen:{duration:.62,filter:1100,voices:[{hz:132,end:181,wave:'sine',gain:.37,length:.53},{hz:270,end:360,wave:'triangle',gain:.16,delay:.09,length:.46}]},
 doorClose:{duration:.51,filter:1050,voices:[{hz:185,end:120,wave:'sine',gain:.38,length:.46},{hz:335,end:223,wave:'triangle',gain:.13,length:.35}]},
 engine:{duration:.56,filter:690,voices:[{hz:78,end:93,wave:'sine',gain:.45,length:.51},{hz:156,end:171,wave:'triangle',gain:.11,length:.48}]},
 energy:{duration:.59,filter:2000,voices:[{hz:440,end:630,wave:'sine',gain:.31,length:.48},{hz:880,end:1000,wave:'triangle',gain:.10,delay:.04,length:.46}]},
 metal:{duration:.46,filter:1800,voices:[{hz:313,end:308,wave:'sine',gain:.28,length:.39},{hz:523,end:519,wave:'triangle',gain:.18,delay:.013,length:.31}]},
 thruster:{duration:.73,filter:750,voices:[{hz:105,end:70,wave:'sine',gain:.43,length:.66},{hz:210,end:140,wave:'triangle',gain:.17,delay:.02,length:.58}]},
}
export function playAstralSynth(ctx:AudioContext,cue:GameSound,volume:number):boolean{
 if(ctx.state!=='running'||!Number.isFinite(volume)||volume<=0)return false
 const patch=CUES[cue]
 if(!patch)return false
 try{
  const now=ctx.currentTime+.008
  const master=ctx.createGain()
  master.gain.value=Math.min(.3,Math.max(0,volume))*.90
  const lowpass=ctx.createBiquadFilter()
  lowpass.type='lowpass'
  lowpass.frequency.value=patch.filter??1900
  lowpass.Q.value=.45
  master.connect(lowpass).connect(ctx.destination)
  for(const voice of patch.voices){
   const start=now+(voice.delay??0)
   const length=voice.length??patch.duration
   const oscillator=ctx.createOscillator()
   oscillator.type=voice.wave??'sine'
   oscillator.frequency.setValueAtTime(voice.hz,start)
   if(voice.end&&voice.end!==voice.hz)oscillator.frequency.exponentialRampToValueAtTime(voice.end,start+length)
   const envelope=ctx.createGain()
   const peak=Math.max(.001,Math.min(.85,voice.gain??.4))
   const attack=Math.min(.024,length*.18)
   envelope.gain.setValueAtTime(.0001,start)
   envelope.gain.linearRampToValueAtTime(peak,start+attack)
   envelope.gain.exponentialRampToValueAtTime(.0001,start+length)
   oscillator.connect(envelope).connect(master)
   oscillator.start(start)
   oscillator.stop(start+length+.012)
   oscillator.onended=()=>{oscillator.disconnect();envelope.disconnect()}
  }
  return true
 }catch{
  return false
 }
}
