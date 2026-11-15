import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  CINEMATIC_FINISHED_EVENT,
  CINEMATIC_REQUEST_EVENT,
  requestCinematic,
} from './cinematicManifest.ts'
import { clearCinematicFlow, requestCinematicFlow } from './cinematicFlow.ts'

const originalWindow = globalThis.window
const originalCustomEvent = globalThis.CustomEvent

class TestCustomEvent extends Event {
  constructor(name, options) {
    super(name)
    this.detail = options?.detail
  }
}
function setup() {
  globalThis.window = new EventTarget()
  globalThis.CustomEvent = TestCustomEvent
}
function finished(id, outcome) {
  window.dispatchEvent(new CustomEvent(CINEMATIC_FINISHED_EVENT, { detail: { id, outcome } }))
}
afterEach(() => {
  clearCinematicFlow()
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
  if (originalCustomEvent === undefined) delete globalThis.CustomEvent
  else globalThis.CustomEvent = originalCustomEvent
})

test('no request is sent if case or rescue guard fails', () => {
  setup()
  let calls = 0
  window.addEventListener(CINEMATIC_REQUEST_EVENT, () => calls++)
  assert.equal(requestCinematicFlow('portalPast', {
    canStart: () => false,
    onAdvance: () => assert.fail('a locked rescue must not advance'),
  }), false)
  assert.equal(calls, 0)
})

test('opening requests once, matches its own completion, and skips only presentation', () => {
  setup()
  const requested = []
  const advanced = []
  window.addEventListener(CINEMATIC_REQUEST_EVENT, event => requested.push(event.detail.id))
  assert.equal(requestCinematicFlow('opening', {
    canStart: () => true,
    onAdvance: outcome => advanced.push(outcome),
  }), true)
  assert.deepEqual(requested, ['opening'])
  assert.equal(requestCinematicFlow('case1Intro', {
    canStart: () => true,
    onAdvance: () => assert.fail('no concurrent flow'),
  }), false)
  finished('portalPast', 'completed')
  finished('opening', 'unrecognized')
  assert.deepEqual(advanced, [])
  finished('opening', 'skipped')
  assert.deepEqual(advanced, ['skipped'])
  finished('opening', 'completed')
  assert.deepEqual(advanced, ['skipped'], 'continuation must be one-shot')
})

test('Return does not advance progress; later request is allowed', () => {
  setup()
  let returns = 0
  let advances = 0
  const options = {
    canStart: () => true,
    onAdvance: () => advances++,
    onReturn: () => returns++,
  }
  assert.equal(requestCinematicFlow('case1Intro', options), true)
  finished('case1Intro', 'returned')
  assert.equal(returns, 1)
  assert.equal(advances, 0)
  assert.equal(requestCinematicFlow('case1Outcome', options), true)
  finished('case1Outcome', 'completed')
  assert.equal(advances, 1)
})

test('unavailable footage advances only after explicit fallback event', () => {
  setup()
  const reasons = []
  assert.equal(requestCinematicFlow('portalPast', {
    canStart: () => true,
    onAdvance: reason => reasons.push(reason),
  }), true)
  assert.deepEqual(reasons, [])
  finished('portalPast', 'unavailable')
  assert.deepEqual(reasons, ['unavailable'])
})

test('cancelled listener never advances after a late cinematic event', () => {
  setup()
  let advanced = false
  assert.equal(requestCinematicFlow('opening', {
    canStart: () => true,
    onAdvance: () => { advanced = true },
  }), true)
  clearCinematicFlow()
  finished('opening', 'completed')
  assert.equal(advanced, false)
})

test('AST 472W outcome is blocked at the direct API and flow layer, not just in UI',()=>{
 setup()
 const calls=[]
 let canStartCalled=false
 let advanced=false
 window.addEventListener(CINEMATIC_REQUEST_EVENT,event=>calls.push(event.detail.id))
 requestCinematic('case5Outcome')
 assert.deepEqual(calls,[])
 assert.equal(requestCinematicFlow('case5Outcome',{
  canStart:()=>{canStartCalled=true;return true},
  onAdvance:()=>{advanced=true},
 }),false)
 assert.equal(canStartCalled,false)
 finished('case5Outcome','completed')
 assert.equal(advanced,false)
 assert.deepEqual(calls,[])
})
