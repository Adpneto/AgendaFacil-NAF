import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Routes.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { AuthProvider } from './firebaseConfig.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
