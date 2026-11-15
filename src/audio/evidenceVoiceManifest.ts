/** Five source-exact designer voices for existing canonical Recordings Room evidence.
 * Playing audio is optional and NEVER collects, files or verifies evidence.
 * Word-for-word captions, speaker identities and final mix need designer approval.
 * KES-07 and ORI-08 remain optional text/visual memories without source MP3.
 */
export const EVIDENCE_VOICE = {
  'KES-05': {
    title:"Kestrel — Launch Analyst Review", caseId:'KES', evidenceId:'KES-05',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-kes-05-analyst-review-v1.mp3', source:"ElevenLabs_2026-11-15T05_06_46_Morgan - Deep, Powerful, and Confident_pvc_s50_v3.mp3",
    driveId:'1VwTSpTqpfOUPcEDt4Z8VA3MHel6B_5pa', duration:18.599, bytes:314523,
    sha256:'371cc159f1d5216eac22cefcb0a792e1fa3625187312a46950c332f4a074bfd5', gitBlobSha:'0dcb04c85da8936e0687774659aa92395abd77f9',
    codec:'mp3', channels:1, sampleRate:44100, mixGain:.3, measuredInputLufs:-15.35,
    transcriptStatus:'asr-reviewed-not-authoritative',
  },
  'NAD-07': {
    title:"Nadir — Engineer Review Memory", caseId:'NAD', evidenceId:'NAD-07',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-nad-07-engineer-review-v1.mp3', source:"NAD-07_Engineer_Review_Memory_Full.mp3.mp3",
    driveId:'1KrpnUK0dPE2UuWFiliXHowGnLBlkSFIk', duration:16.274, bytes:277325,
    sha256:'9092ea7105bab1672e521609fc0571b345efc54a328eaeb2bbdff9932e62eb2e', gitBlobSha:'2fbb8d2e9e95300131a70a8e8e4a5139aadb9fd5',
    codec:'mp3', channels:1, sampleRate:44100, mixGain:.36, measuredInputLufs:-16.88,
    transcriptStatus:'pending-transcription-and-speaker-approval',
  },
  'LUM-07': {
    title:"Lumen — Technician Memory Clip", caseId:'LUM', evidenceId:'LUM-07',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-lum-07-technician-memory-v1.mp3', source:"LUM-07_Technician_Memory_Full.mp3  Copy.mp3",
    driveId:'1NWCCbTU3RpM6WqZmMOTS-fgunN13AtE5', duration:17.633, bytes:299059,
    sha256:'e45d14befef10e76e93612e9a0592c8e9d1a8c17de02d0885b0d393f3627a56a', gitBlobSha:'300545170e14cb9df54556ffaaa062d983ee96bd',
    codec:'mp3', channels:1, sampleRate:44100, mixGain:.37, measuredInputLufs:-17.13,
    transcriptStatus:'pending-transcription-and-speaker-approval',
  },
  'ORI-07': {
    title:"Oriole — Flight Director Audio", caseId:'ORI', evidenceId:'ORI-07',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-ori-07-flight-director-v1.mp3', source:"ORI-07_Flight_Director_Audio_Full.mp3.mp3",
    driveId:'1k8QAuX-hwFN7acL-uKqTzRHLWH5_vF3k', duration:23.641, bytes:395190,
    sha256:'a9b87db1f5f2927a8bc0a0f0ec6b48440fd5d12634b8d8c43ca2a08690d1c1b5', gitBlobSha:'28953fc2a4aa262fd13fca2d55d98afb74331ce4',
    codec:'mp3', channels:1, sampleRate:44100, mixGain:.37, measuredInputLufs:-17.24,
    transcriptStatus:'pending-transcription-and-speaker-approval',
  },
  'AST-07': {
    title:"Asterion — Review Board Recording", caseId:'AST', evidenceId:'AST-07',
    mediaRole:'existing-evidence-audio',
    path:'/assets/audio/voice/designer-ast-07-review-board-v1.mp3', source:"AST-07_Review_Board_Recording_Full.mp3.mp3",
    driveId:'1P8uRNZqSnYC1WwrOh3PxvUPGFz1h3aDH', duration:33.724, bytes:556522,
    sha256:'5c40cca743730520066d1f7e6c81c4b549d5534eb2914bc880f007e50dc5f028', gitBlobSha:'b89304792a9982dfc3997612947d2bb3184be9db',
    codec:'mp3', channels:1, sampleRate:44100, mixGain:.34, measuredInputLufs:-16.51,
    transcriptStatus:'pending-transcription-and-speaker-approval',
  },
} as const

export type EvidenceVoiceId = keyof typeof EVIDENCE_VOICE

/** Gains are informed by ffmpeg loudnorm measured I-LUFS (all ~-25.8 at 100% master); 
 * preview-only attenuation, source MP3s remain unchanged. Verify by ear on final device.
 */
export function evidenceVoiceVolume(id:EvidenceVoiceId,masterVolume:number):number{
 const master=Number.isFinite(masterVolume)?Math.max(0,Math.min(100,masterVolume)):0
 return Number((master/100*EVIDENCE_VOICE[id].mixGain).toFixed(4))
}

export function isEvidenceVoiceId(id:unknown):id is EvidenceVoiceId{
 return typeof id==='string'&&Object.prototype.hasOwnProperty.call(EVIDENCE_VOICE,id)
}
