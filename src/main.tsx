import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.tsx'
import ResourcePreloader from './components/ResourcePreloader.tsx'
import './index.css'
import './styles/accessibility.css'
import './styles/dark-mode.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ResourcePreloader>
          <App />
        </ResourcePreloader>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
