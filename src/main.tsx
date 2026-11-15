import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import HomeScreen from './HomeScreen'
import LandscapeGuard from './LandscapeGuard'
import { GAME_ROUTE_EVENT } from './gameNavigation'
import './styles.css'

// Load each scene only when the player visits it. In particular, legacy
// Three.js experiments must never inflate the first Home Screen download.
const App = lazy(() => import('./App'))
const RescueWorkbench = lazy(() => import('./RescueWorkbench'))
const FixedRoomAdventure = lazy(() => import('./FixedRoomAdventure'))
const InvestigationDesignerScene = lazy(() => import('./InvestigationDesignerScene'))
const ArchiveFolderLab = lazy(() => import('./archive/ArchiveFolderLab'))
const StationRoom = lazy(() => import('./gameplay/StationRoom'))
const EvidenceTray = lazy(() => import('./gameplay/EvidenceTray'))
const NadirRescue = lazy(() => import('./gameplay/NadirRescue'))

function AstralArchives() {
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search)

  useEffect(() => {
    const update = () => setRoute(window.location.pathname + window.location.search)
    window.addEventListener('popstate', update)
    window.addEventListener(GAME_ROUTE_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(GAME_ROUTE_EVENT, update)
    }
  }, [])

  const params = new URLSearchParams(route.split('?')[1] ?? '')
  const isArchiveFolderLab = params.get('folder-lab') === '1'
  const isRescueWorkbench = params.get('workbench') === '1'
  const isFixedRoom = params.get('room') === '1'
  const isLegacyView = params.get('legacy') === '1'
  const isOldFixedRoom = params.get('old-room') === '1'
  const roomParam = params.get('station')
  const station = roomParam === 'signal' || roomParam === 'archive' || roomParam === 'recordings' ? roomParam : null
  const nadirRescue = params.get('rescue') === 'NAD'

  return <>
    <LandscapeGuard />
    <Suspense fallback={<div className="aa-route-loading" role="status" aria-live="polite"><span>THE ASTRAL ARCHIVES</span><strong>ACCESSING STATION RECORDS…</strong></div>}>
    {isArchiveFolderLab ? <ArchiveFolderLab /> :
      nadirRescue ? <NadirRescue /> :
      isFixedRoom ? <InvestigationDesignerScene /> :
      station ? <StationRoom station={station} /> :
      isOldFixedRoom ? <FixedRoomAdventure /> :
      isRescueWorkbench ? <RescueWorkbench /> :
      isLegacyView ? <App /> : <HomeScreen />}
    {(isFixedRoom || station) && <EvidenceTray room={isFixedRoom ? 'investigation' : station!}/>}
    </Suspense>
  </>
}

// Preserve the same document while switching scenes. Browser fullscreen and
// orientation lock are tied to the document, not to the individual React view.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AstralArchives /></React.StrictMode>
)
