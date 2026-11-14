import React from 'react'
import ReactDOM from 'react-dom/client'
import HomeScreen from './HomeScreen'
import App from './App'
import RescueWorkbench from './RescueWorkbench'
import FixedRoomAdventure from './FixedRoomAdventure'
import InvestigationDesignerScene from './InvestigationDesignerScene'
import ArchiveFolderLab from './archive/ArchiveFolderLab'
import LandscapeGuard from './LandscapeGuard'
import './styles.css'

const params = new URLSearchParams(window.location.search)
const isArchiveFolderLab = params.get('folder-lab') === '1'
const isRescueWorkbench = params.get('workbench') === '1'
const isFixedRoom = params.get('room') === '1'
const isLegacyView = params.get('legacy') === '1'
const isOldFixedRoom = params.get('old-room') === '1'

// Keep the previous screens behind explicit routes for controlled comparison.
// The approved, simple Home Screen is now the default entry.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LandscapeGuard />
    {isArchiveFolderLab ? <ArchiveFolderLab /> : isFixedRoom ? <InvestigationDesignerScene /> : isOldFixedRoom ? <FixedRoomAdventure /> : isRescueWorkbench ? <RescueWorkbench /> : isLegacyView ? <App /> : <HomeScreen />}
  </React.StrictMode>
)
