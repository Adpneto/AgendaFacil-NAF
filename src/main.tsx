import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Routes.tsx'
import { ThemeProvider } from './components/ui/theme-provider.tsx'
import { AuthProvider } from './firebaseConfig.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import Layout from './lib/layout.tsx'
import { Toaster } from './components/ui/toaster.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Layout children={<App />} />
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
