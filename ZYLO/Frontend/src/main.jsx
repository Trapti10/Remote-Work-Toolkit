import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import ContextUser from './Context/ContextUser.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ContextUser>
    <BrowserRouter>
    <App />
  </BrowserRouter>
   </ContextUser>
  </StrictMode>,
)
