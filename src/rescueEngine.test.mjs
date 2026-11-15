import { test } from 'node:test'
import assert from 'node:assert/strict'
import { CASES, PARTS, calculate, execute, limits, newPlan } from './rescueEngine.ts'

test('five distinct fictional cases with swappable stable IDs', () => {
  assert.equal(CASES.length, 5)
  assert.equal(new Set(CASES.map(item => item.id)).size, 5)
  assert.equal(new Set(PARTS.map(item => item.id)).size, PARTS.length)
})

test('transmitter adjustment affects link and power and heat', () => {
  const low = calculate({ ...newPlan(), transmitter: 20 })
  const high = calculate({ ...newPlan(), transmitter: 100 })
  assert.ok(high.signal > low.signal)
  assert.ok(high.power > low.power)
  assert.ok(high.heat > low.heat)
})

test('part selection changes mass and capability', () => {
  const start = calculate(newPlan())
  const upgraded = calculate({ ...newPlan(), parts: { antenna:'antenna-highgain', power:'power-extended', thermal:'thermal-radiator' } })
  assert.ok(upgraded.mass > start.mass)
  assert.ok(upgraded.signal > start.signal)
  assert.ok(upgraded.available > start.available)
  assert.ok(upgraded.heat < start.heat)
})

test('a feasible correctly diagnosed rescue can succeed', () => {
  const plan = { ...newPlan(), transmitter:80, protocol:'burst', problem:'signal-path', parts:{ antenna:'antenna-highgain', power:'power-extended', thermal:'thermal-radiator' } }
  const result = execute(CASES[0], plan)
  assert.equal(result.success, true)
  assert.equal(Object.values(limits(CASES[0], result.stats)).every(Boolean), true)
})

test('wrong diagnosis fails even if all observable stats are within limits', () => {
  const plan = { ...newPlan(), transmitter:80, protocol:'burst', problem:'thermal-load', parts:{ antenna:'antenna-highgain', power:'power-extended', thermal:'thermal-radiator' } }
  const result = execute(CASES[0], plan)
  assert.equal(result.success, false)
  assert.equal(result.diagnosisCorrect, false)
})

test('large link output can violate limits; execution reports those failures', () => {
  const plan = { ...newPlan(), transmitter:100, protocol:'burst', problem:'signal-path', parts:{ antenna:'antenna-array', power:'power-microcell', thermal:'thermal-passive' } }
  const result = execute(CASES[0], plan)
  assert.equal(result.success, false)
  assert.equal(result.stats.power > result.stats.available, true)
  assert.ok(result.explanation.includes('power'))
})
