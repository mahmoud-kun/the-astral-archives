/**
 * Player-facing case introductions derived from
 * Nasa/Cases Evidence Production Bible v2 and Cases Game Design v1.1.
 * Each mission, organization and record is fictional.
 * Root causes, responsible characters and final-case resolution are
 * intentionally withheld from the first-room experience.
 */
export const INVESTIGATION_CASES = [
  {
    code: 'KES', id: 'KES', name: 'Kestrel',
    title: 'The Mission That Outgrew Its Plan',
    phase: 'PRE-PHASE A / PHASE A',
    description: 'A promising mission to study unusual meteoroid activity near Vesper was suspended before detailed development.',
    objective: 'Find out why a scientifically strong proposal could not become a workable mission plan.',
    leadRoom: 'Archive Room',
  },
  {
    code: 'NAD', id: 'NAD', name: 'Nadir',
    title: 'Two Numbers for One Interface',
    phase: 'PHASE B',
    description: 'Two spacecraft teams report different navigation results from what appears to be the same maneuver.',
    objective: 'Trace the disagreement back through the simulation outputs and interface records.',
    leadRoom: 'Signal Room',
  },
  {
    code: 'LUM', id: 'LUM', name: 'Lumen',
    title: 'The Telescope That Passed',
    phase: 'PHASE C / PHASE D',
    description: 'An optical observatory passed inspection, but its first image products show an unexpected blur.',
    objective: 'Compare the design, measurements and acceptance records to understand what was missed.',
    leadRoom: 'Archive Room',
  },
  {
    code: 'ORI', id: 'ORI', name: 'Oriole',
    title: 'The Landing Signal',
    phase: 'PHASE D / PHASE E',
    description: 'A robotic lander lost contact during descent. Its sequence log contains conflicting signs of touchdown.',
    objective: 'Reconstruct the landing timeline and identify which signals deserve further investigation.',
    leadRoom: 'Signal Room',
  },
  {
    code: 'AST', id: 'AST', name: 'Asterion',
    title: 'The Stamp in the Archive',
    phase: 'PHASE B / PRELIMINARY DESIGN REVIEW',
    description: 'An observatory project still in preliminary design approaches its PDR as unexplained power-test and revision records require independent review.',
    objective: 'Understand the outstanding risk and examine the reliability of the mission record.',
    leadRoom: 'Archive Room',
  },
] as const

export type InvestigationCase = typeof INVESTIGATION_CASES[number]
export type InvestigationCode = InvestigationCase['code']
export const INVESTIGATION_ACTIVE_CASE_KEY = 'astral-investigation-active-case-v2'

export function isInvestigationCode(value: unknown): value is InvestigationCode {
  return typeof value === 'string' && INVESTIGATION_CASES.some(item => item.code === value)
}
