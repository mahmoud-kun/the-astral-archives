import type { MouseEvent } from 'react'

/**
 * Route between Astral Archives screens without replacing the HTML document.
 * Keeping the same document preserves fullscreen and orientation lock when
 * the browser supports them; a full location.assign() cannot do that.
 */
export const GAME_ROUTE_EVENT = 'astral:route-change'

export function navigateGame(route: string): void {
  const next = new URL(route, window.location.href)
  if (next.origin !== window.location.origin) {
    window.location.assign(next.href)
    return
  }

  const current = window.location.pathname + window.location.search + window.location.hash
  const target = next.pathname + next.search + next.hash
  if (target === current) return

  window.history.pushState({}, '', target)
  window.dispatchEvent(new Event(GAME_ROUTE_EVENT))
}

export function onGameLinkClick(event: MouseEvent<HTMLAnchorElement>, route: string): void {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
      event.ctrlKey || event.shiftKey || event.altKey) return
  event.preventDefault()
  navigateGame(route)
}
