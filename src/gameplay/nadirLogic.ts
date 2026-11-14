import type { ArchiveEvidence } from '../archive/evidenceRecords'

export type NadirPuzzleId = 'NAD-01' | 'NAD-02' | 'NAD-03' | 'NAD-04' | 'NAD-05' | 'NAD-06'
export type NadirStation = 'investigation' | 'signal' | 'archive' | 'recordings'
export type PuzzleAnswers = Record<string, string>

export const NADIR_PUZZLE_IDS: readonly NadirPuzzleId[] =
  ['NAD-01', 'NAD-02', 'NAD-03', 'NAD-04', 'NAD-05', 'NAD-06']

export const NADIR_PUZZLE_ROOMS: Record<NadirPuzzleId, NadirStation> = {
  'NAD-01': 'signal', 'NAD-02': 'signal',
  'NAD-03': 'archive', 'NAD-04': 'archive',
  'NAD-05': 'recordings', 'NAD-06': 'investigation',
}
export const NADIR_PUZZLE_STORAGE_KEY = 'astral-nadir-analysis-v1'
export const IMPULSE_CONVERSION = 4.448221615

export interface NadirAnalysisSave {
  version: 1
  solved: NadirPuzzleId[]
}
export const EMPTY_NADIR_SAVE: NadirAnalysisSave = { version: 1, solved: [] }

export function restoreNadirSave(raw: string | null): NadirAnalysisSave {
  if (!raw) return { ...EMPTY_NADIR_SAVE, solved: [] }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !('version' in parsed) || parsed.version !== 1
      || !('solved' in parsed) || !Array.isArray(parsed.solved)) return { ...EMPTY_NADIR_SAVE, solved: [] }
    const valid = (parsed.solved as unknown[]).filter((value): value is NadirPuzzleId =>
      typeof value === 'string' && NADIR_PUZZLE_IDS.some(id => id === value))
    return { version: 1, solved: [...new Set(valid)] }
  } catch { return { ...EMPTY_NADIR_SAVE, solved: [] } }
}
export function solveNadir(save: NadirAnalysisSave, id: NadirPuzzleId): NadirAnalysisSave {
  return save.solved.includes(id) ? save : { version: 1, solved: [...save.solved, id] }
}
export function verifyNadirPuzzle(id: NadirPuzzleId, answers: PuzzleAnswers): boolean {
  switch (id) {
    case 'NAD-02':
      return answers.sourceUnit === 'lbf-s' && answers.consumerUnit === 'N-s'
        && Number.isFinite(Number(answers.correctedImpulse))
        && Math.abs(Number(answers.correctedImpulse) - 12 * IMPULSE_CONVERSION) <= 0.06
    case 'NAD-01':
      return answers.originalViewed === 'yes' && answers.correctedViewed === 'yes'
        && answers.residual === 'converges' && answers.rootCause === 'unit-interpretation'
    case 'NAD-03':
      return answers.interfaceUnit === 'N-s' && answers.conversionOwner === 'producer'
        && answers.verification === 'rerun-with-documented-units'
    case 'NAD-04':
      return answers.producer === 'V3:lbf-s' && answers.consumer === 'V2:N-s'
        && answers.failureMode === 'contract-mismatch'
    case 'NAD-05':
      return answers.first === 'warning' && answers.second === 'review'
        && answers.third === 'closure' && answers.conclusion === 'unresolved-at-closure'
    case 'NAD-06':
      return answers.attachmentCount === '0' && answers.rerun === 'no'
        && answers.auditDecision === 'unsupported-closure'
    default: return false
  }
}

export function isNadirRecord(value: ArchiveEvidence): boolean {
  return value.caseId === 'NAD'
}
