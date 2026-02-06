import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Initialize the logger!
import { initLogger } from 'frontend-terminal-logger'

initLogger({
  level: 'log' // Optional, defaults to 'log'
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
