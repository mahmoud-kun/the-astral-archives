import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import RescueWorkbench from './RescueWorkbench'
import './styles.css'

const isRescueWorkbench = new URLSearchParams(window.location.search).get('workbench') === '1'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{isRescueWorkbench ? <RescueWorkbench /> : <App />}</React.StrictMode>
)
