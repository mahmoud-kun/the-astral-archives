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
      <img className="aa-landscape-device" src="/assets/ui/rotate-landscape.svg" alt="" width="320" height="244" draggable={false}/>
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
