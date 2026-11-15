import type {OtherRecordId} from './caseEvidenceEngine'

/** Only authored physical placement changes. Stable evidence IDs, saves,
 * case ownership, wording, audio links, and any-six-of-eight rescue gate stay untouched.
 * Each record is exposed via exactly one supported room object.
 */
export type EvidenceStation='investigation'|'archive'|'signal'|'recordings'
export type EvidencePlacement={station:EvidenceStation;objectId:string}
export const OTHER_EVIDENCE_PLACEMENTS:Record<OtherRecordId,EvidencePlacement>={
 'KES-01':{station:'archive',objectId:'archive_shelving'},
 'KES-02':{station:'investigation',objectId:'center_terminal'},
 'KES-03':{station:'signal',objectId:'telemetry_console_left'},
 'KES-04':{station:'signal',objectId:'telemetry_console_right'},
 'KES-05':{station:'recordings',objectId:'audio_analysis_terminal'},
 'KES-06':{station:'investigation',objectId:'evidence_board'},
 'KES-07':{station:'recordings',objectId:'video_playback_console'},
 'KES-08':{station:'archive',objectId:'archive_shelving'},
 'LUM-01':{station:'archive',objectId:'archive_shelving'},
 'LUM-02':{station:'signal',objectId:'telemetry_console_left'},
 'LUM-03':{station:'investigation',objectId:'center_terminal'},
 'LUM-04':{station:'archive',objectId:'archive_shelving'},
 'LUM-05':{station:'signal',objectId:'telemetry_console_right'},
 'LUM-06':{station:'investigation',objectId:'evidence_board'},
 'LUM-07':{station:'recordings',objectId:'audio_analysis_terminal'},
 'LUM-08':{station:'recordings',objectId:'video_playback_console'},
 'ORI-01':{station:'signal',objectId:'telemetry_console_left'},
 'ORI-02':{station:'signal',objectId:'telemetry_console_right'},
 'ORI-03':{station:'archive',objectId:'archive_shelving'},
 'ORI-04':{station:'investigation',objectId:'center_terminal'},
 'ORI-05':{station:'archive',objectId:'archive_shelving'},
 'ORI-06':{station:'investigation',objectId:'evidence_board'},
 'ORI-07':{station:'recordings',objectId:'audio_analysis_terminal'},
 'ORI-08':{station:'recordings',objectId:'video_playback_console'},
 'AST-01':{station:'archive',objectId:'archive_shelving'},
 'AST-02':{station:'signal',objectId:'telemetry_console_left'},
 'AST-03':{station:'archive',objectId:'archive_shelving'},
 'AST-04':{station:'investigation',objectId:'evidence_board'},
 'AST-05':{station:'recordings',objectId:'audio_analysis_terminal'},
 'AST-06':{station:'signal',objectId:'telemetry_console_right'},
 'AST-07':{station:'recordings',objectId:'video_playback_console'},
 'AST-08':{station:'investigation',objectId:'center_terminal'},
}

export function recordsAtObject(station:EvidenceStation,objectId:string):OtherRecordId[]{
 return (Object.entries(OTHER_EVIDENCE_PLACEMENTS) as [OtherRecordId,EvidencePlacement][])
   .filter(([,p])=>p.station===station&&p.objectId===objectId)
   .map(([id])=>id)
}

export function hasRecordsAtObject(station:EvidenceStation,objectId:string):boolean{
 return recordsAtObject(station,objectId).length>0
}
