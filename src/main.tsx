import React from 'react'
import ReactDOM from 'react-dom/client'
import HomeScreen from './HomeScreen'
import App from './App'
import RescueWorkbench from './RescueWorkbench'
import FixedRoomAdventure from './FixedRoomAdventure'
import './styles.css'

const params = new URLSearchParams(window.location.search)
const isRescueWorkbench = params.get('workbench') === '1'
const isFixedRoom = params.get('room') === '1'
const isLegacyView = params.get('legacy') === '1'

// Keep the previous screens behind explicit routes for controlled comparison.
// The approved, simple Home Screen is now the default entry.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isFixedRoom ? <FixedRoomAdventure /> : isRescueWorkbench ? <RescueWorkbench /> : isLegacyView ? <App /> : <HomeScreen />}
  </React.StrictMode>
)
