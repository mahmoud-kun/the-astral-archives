import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import RescueWorkbench from './RescueWorkbench'
import FixedRoomAdventure from './FixedRoomAdventure'
import './styles.css'

const params = new URLSearchParams(window.location.search)
const isRescueWorkbench = params.get('workbench') === '1'
const isFixedRoom = params.get('room') === '1'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isFixedRoom ? <FixedRoomAdventure /> : isRescueWorkbench ? <RescueWorkbench /> : <App />}</React.StrictMode>
)
