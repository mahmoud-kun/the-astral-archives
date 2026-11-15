import React, { lazy, Suspense, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import HomeScreen from './HomeScreen'
import LandscapeGuard from './LandscapeGuard'
import { GAME_ROUTE_EVENT } from './gameNavigation'
import { installGameAudio } from './audio/gameAudio'
import { isOtherCaseId } from './gameplay/caseContext'
import {isPastRoomId,isPastCaseId} from './gameplay/pastTimeline'
import CinematicOverlay from './media/CinematicOverlay'
import RoomTutorial,{type TourKey} from './gameplay/RoomTutorial'
import './styles.css'

// Load each scene only when the player visits it. In particular, legacy
// Three.js experiments must never inflate the first Home Screen download.
const InvestigationDesignerScene = lazy(() => import('./InvestigationDesignerScene'))
const ArchiveFolderLab = lazy(() => import('./archive/ArchiveFolderLab'))
const StationRoom = lazy(() => import('./gameplay/StationRoom'))
const EvidenceTray = lazy(() => import('./gameplay/EvidenceTray'))
const NadirRescue = lazy(() => import('./gameplay/NadirRescue'))
const CaseRescue = lazy(() => import('./gameplay/CaseRescue'))
const PastTimelineHub = lazy(() => import('./gameplay/PastTimelineHub'))
const AudioReviewLab = lazy(() => import('./audio/AudioReviewLab'))

function AstralArchives() {
  const [route, setRoute] = useState(() => window.location.pathname + window.location.search)

  useEffect(() => installGameAudio(), [])

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
  const isAudioLab = params.get('audio-lab') === '1'
  const isArchiveFolderLab = params.get('folder-lab') === '1'
  const isFixedRoom = params.get('room') === '1'
  const roomParam = params.get('station')
  const station = roomParam === 'signal' || roomParam === 'archive' || roomParam === 'recordings' ? roomParam : null
  const pastRoomParam = params.get('past')
  const pastCaseParam = params.get('case')
  const pastRoom = isPastRoomId(pastRoomParam) ? pastRoomParam : null
  const pastCase = isPastCaseId(pastCaseParam) ? pastCaseParam : null
  const rescueCase = params.get('rescue')
  const nadirRescue = rescueCase === 'NAD'
  const otherCaseRescue = isOtherCaseId(rescueCase) ? rescueCase : null
  const tutorialRoom:TourKey|null = isFixedRoom?'investigation':station?station:pastRoom&&pastCase?('past-'+pastRoom) as TourKey:null

  return <>
    <LandscapeGuard />
    <Suspense fallback={<div className="aa-route-loading" role="status" aria-live="polite"><span>THE ASTRAL ARCHIVES</span><strong>ACCESSING STATION RECORDS…</strong></div>}>
    {isAudioLab ? <AudioReviewLab /> :
      isArchiveFolderLab ? <ArchiveFolderLab /> :
      nadirRescue ? <NadirRescue /> :
      otherCaseRescue ? <CaseRescue key={otherCaseRescue} caseId={otherCaseRescue}/> :
      pastRoom && pastCase ? <PastTimelineHub key={pastRoom+pastCase} room={pastRoom} caseId={pastCase}/> :
      isFixedRoom ? <InvestigationDesignerScene /> :
      station ? <StationRoom station={station} /> :
      <HomeScreen />}
    {(isFixedRoom || station) && <EvidenceTray room={isFixedRoom ? 'investigation' : station!}/>}
    </Suspense>
    <RoomTutorial roomKey={tutorialRoom}/>
    <CinematicOverlay />
  </>
}

// Preserve the same document while switching scenes. Browser fullscreen and
// orientation lock are tied to the document, not to the individual React view.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><AstralArchives /></React.StrictMode>
)
