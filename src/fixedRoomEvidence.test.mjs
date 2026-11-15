import { test } from 'node:test'
import assert from 'node:assert/strict'
import { progressFor, moveEvidence } from './fixedRoomEvidence.ts'

test('uncollected evidence cannot be filed', () => {
  const start = { collected: [], filed: {} }
  assert.deepEqual(moveEvidence(start, 'echo-signal', 'demo-01'), start)
})

test('filing in the wrong folder is saved without granting progress', () => {
  const start = { collected: ['echo-signal'], filed: {} }
  const filed = moveEvidence(start, 'echo-signal', 'demo-02')
  assert.equal(filed.filed['echo-signal'], 'demo-02')
  assert.equal(progressFor(filed.filed, 'demo-01', ['echo-signal','echo-power']), 0)
})

test('moving evidence updates progress and reverses prior credit', () => {
  const start = { collected: ['echo-signal', 'echo-power'], filed: {} }
  const one = moveEvidence(start, 'echo-signal', 'demo-01')
  const two = moveEvidence(one, 'echo-power', 'demo-01')
  assert.equal(progressFor(two.filed, 'demo-01', ['echo-signal','echo-power']), 2)
  const moved = moveEvidence(two, 'echo-signal', 'demo-03')
  assert.equal(progressFor(moved.filed, 'demo-01', ['echo-signal','echo-power']), 1)
  const returned = moveEvidence(moved, 'echo-signal', 'demo-01')
  assert.equal(progressFor(returned.filed, 'demo-01', ['echo-signal','echo-power']), 2)
})

test('unfile removes evidence from folder but keeps item collected', () => {
  const saved = { collected: ['echo-signal'], filed: { 'echo-signal': 'demo-01' } }
  const next = moveEvidence(saved, 'echo-signal', '')
  assert.deepEqual(next.collected, ['echo-signal'])
  assert.equal(next.filed['echo-signal'], undefined)
})
