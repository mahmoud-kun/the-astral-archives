import { useEffect, useState } from 'react'
import { ARCHIVE_SAVE_KEY, discoverEvidence, restoreArchiveState, type ArchiveState } from '../archive/archiveState'
import { findEvidence } from '../archive/evidenceRecords'
import { NADIR_PUZZLE_STORAGE_KEY, restoreNadirSave, solveNadir, type NadirAnalysisSave, type NadirPuzzleId } from './nadirLogic'

export const EVIDENCE_CHANGE_EVENT = 'astral:evidence-changed'
export const NADIR_PROGRESS_EVENT = 'astral:nadir-progress-changed'

export function readArchiveSave(): ArchiveState {
  try { return restoreArchiveState(localStorage.getItem(ARCHIVE_SAVE_KEY)) }
  catch { return restoreArchiveState(null) }
}

export function saveArchive(state: ArchiveState): void {
  try {
    const json = JSON.stringify(state)
    if (localStorage.getItem(ARCHIVE_SAVE_KEY) !== json) {
      localStorage.setItem(ARCHIVE_SAVE_KEY, json)
      window.dispatchEvent(new Event(EVIDENCE_CHANGE_EVENT))
    }
  } catch { /* storage denied: preserve current session state inside mounted UI */ }
}

export function collectEvidenceManually(id: string): boolean {
  if (!findEvidence(id)) return false
  const before = readArchiveSave()
  if (before.discovered.includes(id)) return true
  const next = discoverEvidence(before, id)
  saveArchive(next)
  return readArchiveSave().discovered.includes(id)
}

export function useLiveArchive(): ArchiveState {
  const [archive, setArchive] = useState(readArchiveSave)
  useEffect(() => {
    const sync = () => setArchive(readArchiveSave())
    window.addEventListener(EVIDENCE_CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVIDENCE_CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return archive
}

export function readNadirProgress(): NadirAnalysisSave {
  try { return restoreNadirSave(localStorage.getItem(NADIR_PUZZLE_STORAGE_KEY)) }
  catch { return restoreNadirSave(null) }
}
export function saveNadirProgress(value: NadirAnalysisSave): void {
  try {
    const json = JSON.stringify(value)
    if (localStorage.getItem(NADIR_PUZZLE_STORAGE_KEY) !== json) {
      localStorage.setItem(NADIR_PUZZLE_STORAGE_KEY, json)
      window.dispatchEvent(new Event(NADIR_PROGRESS_EVENT))
    }
  } catch { /* session-only fallback */ }
}
export function completeNadirPuzzle(id: NadirPuzzleId): void {
  saveNadirProgress(solveNadir(readNadirProgress(), id))
}
export function useNadirProgress(): NadirAnalysisSave {
  const [progress, setProgress] = useState(readNadirProgress)
  useEffect(() => {
    const sync = () => setProgress(readNadirProgress())
    window.addEventListener(NADIR_PROGRESS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(NADIR_PROGRESS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return progress
}
