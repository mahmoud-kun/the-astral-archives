import type { ArchiveEvidenceKind } from '../archive/evidenceRecords'

export default function EvidenceGlyph({kind}:{kind:ArchiveEvidenceKind}){
 const art={
  document:<><path d="M7 3h8l5 5v13H7zM15 3v6h5M10 13h7m-7 4h7"/><path d="M4 8v13h5" strokeOpacity=".5"/></>,
  telemetry:<><path d="M2 19V6m0 13h21M5 14l3-3 3 2 4-7 3 5 4-2"/><circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none"/></>,
  blueprint:<><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M7 9h10M7 14h10M11 5v14m4-14v14M3 9h18" strokeOpacity=".65"/></>,
  recording:<><path d="M3 12h2l2-5 3 10 3-13 3 13 3-7 2 2h1"/><path d="M4 19h16" strokeOpacity=".45"/></>,
 }
 return <span className={'eg-glyph eg-'+kind} aria-hidden="true">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{art[kind]}</svg>
 </span>
}
