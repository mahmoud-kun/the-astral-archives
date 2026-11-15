/**
 * One genuine designer-supplied, ElevenLabs-rendered Kestrel recording.
 * Not part of the 19 original SFX. Not deployed until source MP3 is added.
 * The voice appears to narrate two dialogue turns; artist must confirm
 * speaker identities and exact words before captions are published.
 */
export const EVIDENCE_VOICE = {
  'KES-05': {
    title:'Kestrel — Launch Analyst Review',
    caseId:'KES',
    evidenceId:'KES-05',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-kes-05-analyst-review-v1.mp3',
    source:'ElevenLabs_2026-11-15T05_06_46_Morgan - Deep, Powerful, and Confident_pvc_s50_v3.mp3',
    driveId:'1VwTSpTqpfOUPcEDt4Z8VA3MHel6B_5pa',
    duration:18.599,
    bytes:314523,
    codec:'mp3',
    channels:1,
    mixGain:.3,
    transcriptStatus:'asr-reviewed-not-authoritative',
  },
} as const

export type EvidenceVoiceId=keyof typeof EVIDENCE_VOICE

/** Real recording, bounded to game master slider; source peaks near -0.3dBFS. */
export function evidenceVoiceVolume(id:EvidenceVoiceId,masterVolume:number):number{
  const master=Number.isFinite(masterVolume)?Math.max(0,Math.min(100,masterVolume)):0
  return Number((master/100*EVIDENCE_VOICE[id].mixGain).toFixed(4))
}

/** A file mapping cannot automatically collect/solve this evidence. */
export function isEvidenceVoiceId(id:unknown):id is EvidenceVoiceId{
  return typeof id==='string'&&Object.prototype.hasOwnProperty.call(EVIDENCE_VOICE,id)
}
