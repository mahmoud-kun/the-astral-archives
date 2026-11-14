import { test } from 'node:test'
import assert from 'node:assert/strict'
import { INVESTIGATION_CASES, isInvestigationCode } from './investigationCases.ts'

test('five distinct fictional investigations, with unique stable codes', () => {
  assert.equal(INVESTIGATION_CASES.length, 5)
  assert.deepEqual(INVESTIGATION_CASES.map(c => c.code), ['KES', 'NAD', 'LUM', 'ORI', 'AST'])
  assert.equal(new Set(INVESTIGATION_CASES.map(c => c.code)).size, 5)
})

test('every first-room dossier has a readable spoiler-free mission brief', () => {
  for (const c of INVESTIGATION_CASES) {
    assert.ok(c.title.length > 10, c.code)
    assert.ok(c.description.length > 35, c.code)
    assert.ok(c.objective.length > 35, c.code)
    assert.ok(['Archive Room', 'Signal Room'].includes(c.leadRoom), c.code)
    assert.doesNotMatch(c.description + c.objective, /Elias Rook|deliberate tampering|culprit/i)
  }
})

test('saved active case accepts only the five registry codes', () => {
  for (const c of INVESTIGATION_CASES) assert.ok(isInvestigationCode(c.code))
  for (const invalid of ['demo-01', '', 'NADI', null, 44, {}, 'KES;']) assert.equal(isInvestigationCode(invalid), false)
})
