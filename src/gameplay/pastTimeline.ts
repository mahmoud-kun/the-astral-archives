import type { ArchiveCaseId } from '../archive/evidenceRecords.ts'
/** Allowlisted interactive history stages. This module has no save mutations. */
export const PAST_STAGES=[
 {id:'manufacturing',label:'MANUFACTURING',detail:'Materials and structural design'},
 {id:'mission_target',label:'MISSION TARGET',detail:'Objectives and mission constraints'},
 {id:'data_analysis',label:'DATA ANALYSIS',detail:'Mission records and verification'},
 {id:'resources_review',label:'RESOURCES',detail:'Hardware, power and logistics'},
] as const
export type PastRoomId=(typeof PAST_STAGES)[number]['id']
export const PAST_CASES=['KES','NAD','LUM','ORI','AST'] as const satisfies readonly ArchiveCaseId[]
export function isPastRoomId(v:unknown):v is PastRoomId{return typeof v==='string'&&PAST_STAGES.some(s=>s.id===v)}
export function isPastCaseId(v:unknown):v is ArchiveCaseId{return typeof v==='string'&&PAST_CASES.some(c=>c===v)}
export function pastRoute(c:ArchiveCaseId,r:PastRoomId='manufacturing'):string{return '/?past='+encodeURIComponent(r)+'&case='+encodeURIComponent(c)}
