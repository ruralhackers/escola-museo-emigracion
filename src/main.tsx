import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'
import { MotionProvider, useMotionMode } from './lib/motion'
import { I18nProvider } from './lib/i18n'

function Root() {
  const { reduced } = useMotionMode()
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      <App />
    </MotionConfig>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <MotionProvider>
        <Root />
      </MotionProvider>
    </I18nProvider>
  </StrictMode>,
)
