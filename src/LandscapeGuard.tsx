import { useState } from 'react'
import './landscapeGuard.css'

/**
 * A mobile-web app cannot reliably force screen rotation on page load.
 * Offer a landscape fullscreen attempt from a real user gesture, and keep a
 * non-blocking, accurate manual-rotation fallback for unsupported browsers.
 */
export default function LandscapeGuard() {
  const [error, setError] = useState(false)

  async function requestLandscape() {
    setError(false)
    try {
      if (!document.fullscreenElement) {
        if (!document.documentElement.requestFullscreen) throw new Error('Fullscreen unavailable')
        await document.documentElement.requestFullscreen()
      }
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (mode: 'landscape') => Promise<void>
      }
      if (typeof orientation?.lock !== 'function') throw new Error('Orientation lock unavailable')
      await orientation.lock('landscape')
    } catch {
      setError(true)
    }
  }

  return <div className="aa-landscape-guard" role="dialog" aria-modal="true" aria-labelledby="aa-landscape-title">
    <div className="aa-landscape-panel">
      <div className="aa-landscape-brand">THE ASTRAL ARCHIVES <span>/ DISPLAY ALIGNMENT</span></div>
      <svg className="aa-landscape-device" viewBox="0 0 160 112" fill="none" aria-hidden="true">
        <rect x="45" y="22" width="70" height="111" rx="10" stroke="#e9b982" strokeWidth="3" strokeDasharray="5 5" transform="rotate(-28 80 77)"/>
        <rect x="20" y="27" width="120" height="65" rx="9" fill="#0c2e42" stroke="#73dee8" strokeWidth="3"/>
        <rect x="29" y="35" width="102" height="49" rx="4" fill="#124154" stroke="#386c80"/>
        <path d="M35 72l24-22 18 13 26-18 19 12" stroke="#e9b982" strokeWidth="3" strokeLinecap="round"/>
        <path d="M79 15l10-7-1 13" stroke="#e9b982" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="80" cy="88" r="2.5" fill="#73dee8"/>
      </svg>
      <p className="aa-landscape-kicker">LANDSCAPE REQUIRED</p>
      <h2 id="aa-landscape-title">ROTATE YOUR DEVICE</h2>
      <p className="aa-landscape-copy">The Astral Archives is designed for a horizontal, cinematic view. Turn on Auto-rotate and hold your phone sideways.</p>
      <button type="button" className="aa-landscape-action" onClick={requestLandscape}>
        TRY LANDSCAPE FULLSCREEN
      </button>
      <p className="aa-landscape-help" role={error ? 'status' : undefined}>
        {error ? 'Your browser cannot rotate the screen automatically. Turn on Auto-rotate and rotate your phone manually.' : 'If your browser supports it, this can rotate the game automatically.'}
      </p>
    </div>
  </div>
}
