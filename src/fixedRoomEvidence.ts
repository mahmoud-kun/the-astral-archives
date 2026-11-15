/**
 * Pure, data-driven rules for the present-day evidence filing interaction.
 * Wrong-folder filing is intentionally preserved without a correctness warning.
 */
export type EvidenceId = 'echo-signal' | 'echo-power'
export type SaveData = { collected: EvidenceId[]; filed: Partial<Record<EvidenceId, string>> }

export function progressFor(filed: SaveData['filed'], missionId: string, required: readonly EvidenceId[]): number {
  return required.filter(id => filed[id] === missionId).length
}

export function moveEvidence(state: SaveData, id: EvidenceId, destination: string): SaveData {
  if (!state.collected.includes(id)) return state
  const filed = { ...state.filed }
  if (destination) filed[id] = destination
  else delete filed[id]
  return { ...state, filed }
}
