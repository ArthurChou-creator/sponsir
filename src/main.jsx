import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { WalletProvider } from './contexts/WalletContext.jsx'
import { CartProvider } from './contexts/CartContext.jsx'
import { OrganizerProvider } from './contexts/OrganizerContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WalletProvider>
      <CartProvider>
        <OrganizerProvider>
          <App />
        </OrganizerProvider>
      </CartProvider>
    </WalletProvider>
  </StrictMode>,
)
