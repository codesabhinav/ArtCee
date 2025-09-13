import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { LanguageProvider } from "./contexts/LanguageProvider";

createRoot(document.getElementById('root')).render(
   <GoogleOAuthProvider
    clientId={
      "739675936120-k10o2mgm67i6rhf5f6205rsi9965dk5r.apps.googleusercontent.com"
    }
  >
  <StrictMode>
  <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
  </GoogleOAuthProvider>
)
