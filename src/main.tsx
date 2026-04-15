import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './i18n'
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 2. App'i BrowserRouter ile sarmalayın */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)