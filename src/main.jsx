import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SupermarketGame from '../Fastmarket.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SupermarketGame />
  </StrictMode>,
)
