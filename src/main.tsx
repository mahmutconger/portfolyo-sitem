import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'
import { BrowserRouter } from 'react-router-dom' 
import { IconContext } from '@phosphor-icons/react/dist/lib/context'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IconContext.Provider value={{ weight: 'light' }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </IconContext.Provider>
  </React.StrictMode>,
)
