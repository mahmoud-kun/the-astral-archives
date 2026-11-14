import { CASE_CODES, EVIDENCE_RECORDS, findEvidence, type ArchiveCaseId } from './evidenceRecords'

export type DiagnosticPart = 'technical' | 'process' | 'consequence'
export type DiagnosticChoice = { id: string; label: string }
export type DiagnosticPrompt = { heading: string; choices: readonly DiagnosticChoice[]; correct: string; supports: readonly string[] }
export type CaseDiagnosis = Record<DiagnosticPart, { answer: string; evidenceId: string }>
export type ArchiveState = {
  version: 1
  discovered: string[]
  filed: Record<string, ArchiveCaseId>
  diagnosis: Partial<Record<ArchiveCaseId, CaseDiagnosis>>
  submitted: ArchiveCaseId[]
}
export const ARCHIVE_SAVE_KEY = 'astral-archive-folder-v1'
export const DEFAULT_ARCHIVE_STATE: ArchiveState = { version: 1, discovered: [], filed: {}, diagnosis: {}, submitted: [] }

export const DIAGNOSIS_PROMPTS: Record<ArchiveCaseId, Record<DiagnosticPart, DiagnosticPrompt>> = {
  KES: {
    technical: { heading: 'What failed in the mission architecture?', correct: 'launch',
      choices: [{id:'launch',label:'The proposed launcher and hardware exceeded real planning constraints'},{id:'science',label:'The science objective itself was technically impossible'},{id:'ground',label:'A ground communications fault interrupted planning'}],
      supports:['KES-02','KES-03','KES-04'] },
    process: { heading: 'Which review breakdown let the plan proceed?', correct: 'summary',
      choices: [{id:'timeline',label:'There was no recorded decision timeline'},{id:'summary',label:'The transition summary downplayed a documented launch warning'},{id:'selection',label:'Science scoring was never performed'}],
      supports:['KES-05','KES-06'] },
    consequence: { heading: 'What was the concrete consequence?', correct: 'infeasible',
      choices: [{id:'data',label:'An operational spacecraft lost transmitted data'},{id:'infeasible',label:'The approved architecture could not satisfy launch and resource constraints'},{id:'image',label:'A telescope returned blurred images'}],
      supports:['KES-03','KES-04'] },
  },
  NAD: {
    technical: { heading: 'What produced two different predicted trajectories?', correct: 'units',
      choices: [{id:'tamper',label:'The source impulse values were deliberately edited'},{id:'units',label:'Identical numerals were interpreted using incompatible impulse units'},{id:'thruster',label:'An onboard thruster physically failed during flight'}],
      supports:['NAD-01','NAD-02','NAD-03','NAD-04'] },
    process: { heading: 'Why was the discrepancy not resolved before closure?', correct: 'no-rerun',
      choices: [{id:'no-rerun',label:'The anomaly was marked closed without a documented rerun'},{id:'no-report',label:'The engineering team never reported the discrepancy'},{id:'no-budget',label:'The instrument was removed from the hardware budget'}],
      supports:['NAD-05','NAD-06'] },
    consequence: { heading: 'What did this cause in the investigation?', correct: 'divergence',
      choices: [{id:'blur',label:'A persistent optical distortion'},{id:'cutoff',label:'Premature descent engine cutoff'},{id:'divergence',label:'Diverging navigation simulation results'}],
      supports:['NAD-01','NAD-02'] },
  },
  LUM: {
    technical: { heading: 'Which technical setting did the measurements reveal?', correct: 'fixture',
      choices: [{id:'fixture',label:'The metrology fixture was offset from nominal'},{id:'radio',label:'A radio interface used incompatible units'},{id:'power',label:'A simultaneous operating mode exceeded the power cap'}],
      supports:['LUM-01','LUM-02','LUM-03'] },
    process: { heading: 'What undermined the inspection result?', correct: 'nominal',
      choices: [{id:'nominal',label:'Nominal values were exported and independent raw checks were waived'},{id:'delay',label:'Ground operations delayed the first science contact'},{id:'replay',label:'The instrument was deliberately rebuilt after launch'}],
      supports:['LUM-04','LUM-06'] },
    consequence: { heading: 'What did the hidden problem affect?', correct: 'optics',
      choices: [{id:'trajectory',label:'Navigation course prediction'},{id:'optics',label:'Optical acceptance reliability and resulting image quality'},{id:'descent',label:'Autonomous touchdown confirmation'}],
      supports:['LUM-02','LUM-05'] },
  },
  ORI: {
    technical: { heading: 'What caused an early touchdown indication?', correct: 'transient',
      choices: [{id:'ground',label:'A ground controller sent a direct engine-off command'},{id:'transient',label:'Leg-deployment transient was accepted as touchdown'},{id:'optical',label:'A camera calibration offset triggered landing'}],
      supports:['ORI-01','ORI-02','ORI-04'] },
    process: { heading: 'What validation gap allowed that risk?', correct: 'coverage',
      choices: [{id:'coverage',label:'Flight logic lacked corroboration and a known transient test was deferred'},{id:'telemetry',label:'All altitude telemetry was permanently unavailable'},{id:'launch',label:'Launcher availability was not assessed'}],
      supports:['ORI-04','ORI-05','ORI-06'] },
    consequence: { heading: 'What was the unsafe behavior?', correct: 'engine',
      choices: [{id:'blur',label:'Images were accepted despite blur'},{id:'engine',label:'Descent engines shut down before confirmed surface contact'},{id:'heat',label:'Thermal load exceeded a bus power cap'}],
      supports:['ORI-02','ORI-03'] },
  },
  AST: {
    technical: { heading: 'What did the thermal-vac evidence show?', correct: 'overdraw',
      choices: [{id:'overdraw',label:'Simultaneous modes caused a power peak above the design cap'},{id:'impulse',label:'Navigation impulse units were mismatched'},{id:'descent',label:'Touchdown logic misread leg vibration'}],
      supports:['AST-02','AST-06'] },
    process: { heading: 'What made the review closure unreliable?', correct: 'archive',
      choices: [{id:'launcher',label:'No alternate launcher slot was allocated'},{id:'archive',label:'Records were changed after review and closure proof was missing'},{id:'mirror',label:'A calibration fixture was incorrectly spaced'}],
      supports:['AST-01','AST-03','AST-04'] },
    consequence: { heading: 'What risk remained at the mission gate?', correct: 'unverified',
      choices: [{id:'unverified',label:'An unresolved over-cap power risk was incorrectly presented as closed'},{id:'lost',label:'The observatory had already been lost during descent'},{id:'none',label:'All operating modes had independently passed the same test'}],
      supports:['AST-02','AST-05','AST-06'] },
  },
}

export function emptyArchiveState(): ArchiveState {
  return { version: 1, discovered: [], filed: {}, diagnosis: {}, submitted: [] }
}

function isCaseId(value: unknown): value is ArchiveCaseId {
  return typeof value === 'string' && CASE_CODES.some(code => code === value)
}

export function restoreArchiveState(raw: string | null): ArchiveState {
  if (!raw) return emptyArchiveState()
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null || !('version' in parsed) || parsed.version !== 1) return emptyArchiveState()
    const data = parsed as Record<string, unknown>
    const validIds = new Set(EVIDENCE_RECORDS.map(record => record.id))
    const discovered = Array.isArray(data.discovered)
      ? [...new Set(data.discovered.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
      : []
    const filed: Record<string, ArchiveCaseId> = {}
    if (data.filed && typeof data.filed === 'object' && !Array.isArray(data.filed)) {
      for (const [id, code] of Object.entries(data.filed)) {
        if (discovered.includes(id) && isCaseId(code)) filed[id] = code
      }
    }
    // Do not trust stored diagnosis submissions across malformed or externally edited saves.
    const diagnosis: ArchiveState['diagnosis'] = {}
    if (data.diagnosis && typeof data.diagnosis === 'object' && !Array.isArray(data.diagnosis)) {
      const stored = data.diagnosis as Record<string, unknown>
      for (const code of CASE_CODES) {
        const entry = stored[code]
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) continue
        const record = entry as Record<string, unknown>
        const values: Partial<CaseDiagnosis> = {}
        for (const part of ['technical','process','consequence'] as const) {
          const answer = record[part]
          if (!answer || typeof answer !== 'object') continue
          const a = answer as Record<string, unknown>
          if (typeof a.answer === 'string' && typeof a.evidenceId === 'string' && validIds.has(a.evidenceId)) {
            values[part] = { answer: a.answer, evidenceId: a.evidenceId }
          }
        }
        if (values.technical && values.process && values.consequence) diagnosis[code] = values as CaseDiagnosis
      }
    }
    return { version: 1, discovered, filed, diagnosis,
      submitted: Array.isArray(data.submitted) ? [...new Set(data.submitted.filter(isCaseId))] : [] }
  } catch {
    return emptyArchiveState()
  }
}

export function discoverEvidence(state: ArchiveState, id: string): ArchiveState {
  if (!findEvidence(id) || state.discovered.includes(id)) return state
  return { ...state, discovered: [...state.discovered, id] }
}

export function fileEvidence(state: ArchiveState, id: string, folder: ArchiveCaseId | null): ArchiveState {
  if (!state.discovered.includes(id) || (folder !== null && !isCaseId(folder))) return state
  const filed = { ...state.filed }
  if (folder === null) delete filed[id]
  else filed[id] = folder
  return { ...state, filed }
}

export function countRequiredEvidence(state: ArchiveState, caseId: ArchiveCaseId): number {
  return EVIDENCE_RECORDS.filter(item => item.required && item.caseId === caseId && state.filed[item.id] === caseId).length
}

export function countInFolder(state: ArchiveState, caseId: ArchiveCaseId): number {
  return Object.values(state.filed).filter(id => id === caseId).length
}

export function diagnosisIsSupported(state: ArchiveState, caseId: ArchiveCaseId): boolean {
  const entry = state.diagnosis[caseId]
  if (!entry || !state.submitted.includes(caseId)) return false
  const prompts = DIAGNOSIS_PROMPTS[caseId]
  return (['technical','process','consequence'] as const).every(part => {
    const choice = entry[part]
    return choice.answer === prompts[part].correct &&
      prompts[part].supports.includes(choice.evidenceId) &&
      state.filed[choice.evidenceId] === caseId
  })
}

export function rescueIsReady(state: ArchiveState, caseId: ArchiveCaseId): boolean {
  return countRequiredEvidence(state, caseId) === 6 && diagnosisIsSupported(state, caseId)
}

export function updateDiagnosis(state: ArchiveState, caseId: ArchiveCaseId, diagnosis: CaseDiagnosis): ArchiveState {
  return { ...state, diagnosis: { ...state.diagnosis, [caseId]: diagnosis }, submitted: state.submitted.filter(id => id !== caseId) }
}

export function submitDiagnosis(state: ArchiveState, caseId: ArchiveCaseId): ArchiveState {
  if (countRequiredEvidence(state, caseId) < 6 || !state.diagnosis[caseId]) return state
  return { ...state, submitted: [...new Set([...state.submitted, caseId])] }
}
