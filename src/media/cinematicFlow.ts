import {
  CINEMATIC_FINISHED_EVENT,
  isCinematicId,
  requestCinematic,
  type CinematicFinished,
  type CinematicId,
  type CinematicOutcome,
} from './cinematicManifest.ts'

type AdvanceOutcome = Exclude<CinematicOutcome, 'returned'>

/**
 * Main-owned views select a valid scene and guard; Chat B owns only the media
 * presentation and its completion handoff. This module never navigates or
 * writes gameplay/save progress.
 *
 * Mount <CinematicOverlay /> at the persistent root BEFORE requesting a flow.
 */
export type CinematicFlowOptions = {
  /** Re-read authoritative state at click time, not an old UI snapshot. */
  canStart: () => boolean
  /** Called for completed, skipped and user-acknowledged unavailable video. */
  onAdvance: (outcome: AdvanceOutcome) => void
  /** Called only when the player explicitly chooses Return. */
  onReturn?: () => void
}

let activeFlow: { id: CinematicId; listener: (event: Event) => void } | null = null

/**
 * Request a single cinematic and register its continuation in one operation.
 * Returns false if no browser, a cinematic is already pending, or gate fails.
 * Skip advances only the presentation: authorization always belongs to Main.
 */
export function requestCinematicFlow(id: CinematicId, options: CinematicFlowOptions): boolean {
  if (typeof window === 'undefined' || activeFlow || !isCinematicId(id)) return false
  if (!options.canStart()) return false

  const handleFinished = (event: Event) => {
    const detail = (event as CustomEvent<Partial<CinematicFinished>>).detail
    if (!detail || detail.id !== id) return
    const outcome = detail.outcome
    if (outcome !== 'completed' && outcome !== 'skipped' &&
        outcome !== 'returned' && outcome !== 'unavailable') return

    clearCinematicFlow()
    if (outcome === 'returned') options.onReturn?.()
    else options.onAdvance(outcome)
  }

  activeFlow = { id, listener: handleFinished }
  window.addEventListener(CINEMATIC_FINISHED_EVENT, handleFinished)
  requestCinematic(id)
  return true
}

/** Cancel only the continuation listener, e.g. if Main unmounts its controller. */
export function clearCinematicFlow(): void {
  const pending = activeFlow
  activeFlow = null
  if (pending && typeof window !== 'undefined') {
    window.removeEventListener(CINEMATIC_FINISHED_EVENT, pending.listener)
  }
}
