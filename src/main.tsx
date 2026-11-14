import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import HomeScreen from './HomeScreen'
import App from './App'
import RescueWorkbench from './RescueWorkbench'
import FixedRoomAdventure from './FixedRoomAdventure'
import InvestigationDesignerScene from './InvestigationDesignerScene'
import ArchiveFolderLab from './archive/ArchiveFolderLab'
import LandscapeGuard from './LandscapeGuard'
import StationRoom from './gameplay/StationRoom'
import EvidenceTray from './gameplay/EvidenceTray'
import NadirRescue from './gameplay/NadirRescue'
import { GAME_ROUTE_EVENT } from './gameNavigation'
import './styles.css'

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
    {isArchiveFolderLab ? <ArchiveFolderLab /> :
      nadirRescue ? <NadirRescue /> :
      isFixedRoom ? <InvestigationDesignerScene /> :
      station ? <StationRoom station={station} /> :
      isOldFixedRoom ? <FixedRoomAdventure /> :
      isRescueWorkbench ? <RescueWorkbench /> :
      isLegacyView ? <App /> : <HomeScreen />}
    {(isFixedRoom || station) && <EvidenceTray room={isFixedRoom ? 'investigation' : station!}/>}

  </>
}

// Preserve the same document while switching scenes. Browser fullscreen and
// orientation lock are tied to the document, not to the individual React view.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AstralArchives /></React.StrictMode>
)
