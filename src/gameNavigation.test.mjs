import { test } from 'node:test'
import assert from 'node:assert/strict'
import { GAME_ROUTE_EVENT, navigateGame, onGameLinkClick } from './gameNavigation.ts'

function withFakeBrowser(run) {
  const previous = globalThis.window
  let address = new URL('https://astral.example/?room=1')
  const pushed = []
  const events = []
  const assigned = []
  globalThis.window = {
    location: {
      get href() { return address.href },
      get origin() { return address.origin },
      get pathname() { return address.pathname },
      get search() { return address.search },
      get hash() { return address.hash },
      assign(value) { assigned.push(value) },
    },
    history: {
      pushState(_state, _unused, target) {
        pushed.push(target)
        address = new URL(target, address)
      },
    },
    dispatchEvent(event) { events.push(event.type) },
  }
  try { run({ pushed, events, assigned, get href() { return address.href } }) }
  finally { globalThis.window = previous }
}

test('in-game route change uses history API; never reloads the document', () => {
  withFakeBrowser(browser => {
    navigateGame('/?folder-lab=1')
    assert.deepEqual(browser.pushed, ['/?folder-lab=1'])
    assert.deepEqual(browser.events, [GAME_ROUTE_EVENT])
    assert.equal(browser.assigned.length, 0)
    assert.equal(browser.href, 'https://astral.example/?folder-lab=1')
  })
})

test('same route is a no-op, and switching back is also client-side', () => {
  withFakeBrowser(browser => {
    navigateGame('/?room=1')
    assert.equal(browser.pushed.length, 0)
    navigateGame('/')
    assert.deepEqual(browser.pushed, ['/'])
    assert.equal(browser.assigned.length, 0)
  })
})

test('normal in-game anchor clicks keep document; modified clicks retain native links', () => {
  withFakeBrowser(browser => {
    let prevented = false
    const regular = {
      button: 0, defaultPrevented: false,
      ctrlKey: false, metaKey: false, altKey: false, shiftKey: false,
      preventDefault() { prevented = true },
    }
    onGameLinkClick(regular, '/')
    assert.equal(prevented, true)
    assert.deepEqual(browser.pushed, ['/'])
    prevented = false
    onGameLinkClick({ ...regular, ctrlKey: true }, '/?room=1')
    assert.equal(prevented, false)
    assert.deepEqual(browser.pushed, ['/'])
  })
})
