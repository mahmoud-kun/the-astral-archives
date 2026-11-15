/**
 * The Astral Archives — Rescue Blueprint LAB
 * Every number and incident here is fictional demo content; never present as NASA data.
 * Replace CASES and PARTS with validated mission content while preserving the UI contract.
 */
export type Slot = 'antenna' | 'power' | 'thermal'
export type Protocol = 'eco' | 'balanced' | 'burst'
export type Phase = 'brief' | 'build' | 'result'
export type StatKey = 'signal' | 'power' | 'mass' | 'heat'

export interface Part {
  id: string
  slot: Slot
  name: string
  tag: string
  description: string
  mass: number
  power: number
  heat: number
  signal: number
  capacity: number
}

export interface CaseFile {
  id: string
  code: string
  name: string
  vehicle: string
  distress: string
  objective: string
  hint: string
  accent: string
  signalTarget: number
  massLimit: number
  heatLimit: number
  correctProblem: string
  problems: { id: string; title: string; explanation: string }[]
}

export interface Plan {
  parts: Record<Slot, string>
  transmitter: number
  protocol: Protocol
  problem: string | null
}

export interface Stats {
  signal: number
  power: number
  available: number
  mass: number
  heat: number
}

export interface Outcome {
  success: boolean
  stats: Stats
  explanation: string
  diagnosisCorrect: boolean
}

export const PARTS: Part[] = [
  { id: 'antenna-compact', slot: 'antenna', name: 'Compact dish', tag: 'LIGHTWEIGHT', description: 'Low mass, modest signal gain. Useful when payload limits are tight.', mass: 12, power: 9, heat: 10, signal: 28, capacity: 0 },
  { id: 'antenna-highgain', slot: 'antenna', name: 'High-gain dish', tag: 'FOCUSED', description: 'Stronger link at the cost of added power and thermal load.', mass: 23, power: 20, heat: 18, signal: 45, capacity: 0 },
  { id: 'antenna-array', slot: 'antenna', name: 'Phased array', tag: 'HIGH OUTPUT', description: 'Exceptional range, but heavy and thermally demanding.', mass: 37, power: 28, heat: 27, signal: 60, capacity: 0 },
  { id: 'power-microcell', slot: 'power', name: 'Microcell pack', tag: 'MINIMUM MASS', description: 'Small reserve. Requires careful consumption management.', mass: 12, power: 0, heat: 0, signal: 0, capacity: 75 },
  { id: 'power-extended', slot: 'power', name: 'Extended battery', tag: 'BALANCED', description: 'Greater available power with a noticeable mass increase.', mass: 27, power: 0, heat: 2, signal: 0, capacity: 105 },
  { id: 'power-heavy', slot: 'power', name: 'Reserve array', tag: 'MAX CAPACITY', description: 'High power budget at the cost of valuable payload mass.', mass: 40, power: 0, heat: 4, signal: 0, capacity: 140 },
  { id: 'thermal-passive', slot: 'thermal', name: 'Passive fins', tag: 'NO POWER', description: 'Simple cooling with very low mass and no electrical draw.', mass: 8, power: 0, heat: -14, signal: 0, capacity: 0 },
  { id: 'thermal-radiator', slot: 'thermal', name: 'Radiator loop', tag: 'BALANCED', description: 'Better heat rejection with moderate mass and power.', mass: 19, power: 4, heat: -31, signal: 0, capacity: 0 },
  { id: 'thermal-active', slot: 'thermal', name: 'Active cryo unit', tag: 'MAX COOLING', description: 'Strong thermal protection with a considerable power penalty.', mass: 27, power: 14, heat: -48, signal: 0, capacity: 0 },
]

const commonProblems = [
  { id: 'signal-path', title: 'Signal path instability', explanation: 'The transmission chain may be unable to reach its receiver.' },
  { id: 'power-routing', title: 'Power distribution fault', explanation: 'The communication bus may be competing for available energy.' },
  { id: 'thermal-load', title: 'Thermal overload', explanation: 'Heat may be forcing the transmitter into a protection state.' },
]

export const CASES: CaseFile[] = [
  { id: 'demo-01', code: '01', name: 'Echo Relay', vehicle: 'ORBITAL RELAY / OR-07', distress: 'Our relay beacon is fading at the edge of the observation corridor.', objective: 'Recover a stable long-range uplink without overloading the relay bus.', hint: 'Review the incoming telemetry. Decide what failed before you redesign the payload.', accent: '#7fd5ee', signalTarget: 84, massLimit: 130, heatLimit: 76, correctProblem: 'signal-path', problems: commonProblems },
  { id: 'demo-02', code: '02', name: 'Solstice Array', vehicle: 'SOLAR OBSERVATORY / SO-12', distress: 'Communication has dropped during an unexplained thermal spike.', objective: 'Restore the uplink while controlling the temperature of the service bus.', hint: 'Stronger transmitters are not necessarily safer.', accent: '#efbd80', signalTarget: 70, massLimit: 127, heatLimit: 52, correctProblem: 'thermal-load', problems: commonProblems },
  { id: 'demo-03', code: '03', name: 'Ghost Orbit', vehicle: 'SURVEY ORBITER / GO-03', distress: 'The survey craft is broadcasting an intermittent emergency ping.', objective: 'Rebalance the electrical system and sustain a clear beacon.', hint: 'The easiest antenna replacement could conceal the original fault.', accent: '#c7b1ff', signalTarget: 77, massLimit: 135, heatLimit: 68, correctProblem: 'power-routing', problems: commonProblems },
  { id: 'demo-04', code: '04', name: 'Nebula Probe', vehicle: 'DEEP SPACE SCOUT / NP-22', distress: 'The deep-space probe has lost reliable contact with the station.', objective: 'Increase communication strength within strict spacecraft limits.', hint: 'The mission is too far away for a casual transmission upgrade.', accent: '#79e2c6', signalTarget: 95, massLimit: 138, heatLimit: 81, correctProblem: 'signal-path', problems: commonProblems },
  { id: 'demo-05', code: '05', name: 'Dusk Runner', vehicle: 'AUTONOMOUS SCOUT / DR-09', distress: 'A power bus overload interrupted the vehicle command link.', objective: 'Reconfigure the power subsystem and regain transmission.', hint: 'Reserve capacity matters as much as maximum transmitter output.', accent: '#f3a8a2', signalTarget: 79, massLimit: 137, heatLimit: 70, correctProblem: 'power-routing', problems: commonProblems },
]

export const SLOT_META: Record<Slot, { title: string; short: string; detail: string }> = {
  antenna: { title: 'Antenna array', short: 'COMMUNICATION', detail: 'Controls signal gain, transmission cost and thermal load.' },
  power: { title: 'Power module', short: 'ENERGY SUPPLY', detail: 'Sets the amount of electrical energy available to the relay.' },
  thermal: { title: 'Thermal control', short: 'HEAT MANAGEMENT', detail: 'Keeps the transmitter temperature within engineering limits.' },
}

export const PROTOCOLS: Record<Protocol, { name: string; description: string; signal: number; power: number; heat: number }> = {
  eco: { name: 'Economy', description: 'Cooler, quieter, lower signal.', signal: -8, power: -8, heat: -8 },
  balanced: { name: 'Balanced', description: 'Standard signal protocol.', signal: 0, power: 0, heat: 0 },
  burst: { name: 'Burst', description: 'Extra signal at higher cost.', signal: 14, power: 15, heat: 15 },
}

export function getPart(id: string): Part {
  const part = PARTS.find(item => item.id === id)
  if (!part) throw new Error('Unknown demo component: ' + id)
  return part
}

export function newPlan(): Plan {
  return { parts: { antenna: 'antenna-compact', power: 'power-microcell', thermal: 'thermal-passive' }, transmitter: 50, protocol: 'balanced', problem: null }
}

export function calculate(plan: Plan): Stats {
  const antenna = getPart(plan.parts.antenna)
  const power = getPart(plan.parts.power)
  const thermal = getPart(plan.parts.thermal)
  const mode = PROTOCOLS[plan.protocol]
  const transmitter = Math.max(20, Math.min(100, plan.transmitter))
  return {
    signal: Math.round(antenna.signal + transmitter * 0.35 + mode.signal),
    power: Math.round(16 + transmitter * 0.6 + antenna.power + thermal.power + mode.power),
    available: power.capacity,
    mass: 48 + antenna.mass + power.mass + thermal.mass,
    heat: Math.round(18 + transmitter * 0.5 + antenna.heat + power.heat + thermal.heat + mode.heat),
  }
}

export function limits(caseFile: CaseFile, stats: Stats) {
  return {
    signal: stats.signal >= caseFile.signalTarget,
    power: stats.power <= stats.available,
    mass: stats.mass <= caseFile.massLimit,
    heat: stats.heat <= caseFile.heatLimit,
  }
}

export function execute(caseFile: CaseFile, plan: Plan): Outcome {
  const stats = calculate(plan)
  const checks = limits(caseFile, stats)
  const diagnosisCorrect = plan.problem === caseFile.correctProblem
  const success = diagnosisCorrect && Object.values(checks).every(Boolean)
  const reasons: string[] = []
  if (!diagnosisCorrect) reasons.push('The selected fault diagnosis did not address the simulated root cause.')
  if (!checks.signal) reasons.push('Link strength remained below the required threshold.')
  if (!checks.power) reasons.push('The redesigned system exceeded its available power supply.')
  if (!checks.mass) reasons.push('The payload exceeded the vehicle mass allowance.')
  if (!checks.heat) reasons.push('The thermal system could not reject the remaining heat.')
  return { success, diagnosisCorrect, stats, explanation: success
    ? 'The selected fault and engineering configuration both met the simulated rescue requirements. The communication channel stabilized.'
    : reasons.join(' ') }
}
