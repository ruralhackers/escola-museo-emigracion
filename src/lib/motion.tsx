import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

/**
 * Motion modes
 *  - full:    desktop (>=768px), all parallax layers, pinned scenes, horizontal voyage
 *  - lite:    mobile (<768px), stacked chapters, very light parallax, no pinning
 *  - reduced: prefers-reduced-motion or the "Reducir movimiento" toggle: no parallax, fades only
 */
export type MotionMode = 'full' | 'lite' | 'reduced'

type Ctx = {
  mode: MotionMode
  reduced: boolean
  isDesktop: boolean
  toggleReduced: () => void
}

const MotionCtx = createContext<Ctx>({ mode: 'full', reduced: false, isDesktop: true, toggleReduced: () => {} })

const KEY = 'emg-reduce-motion'

function useMedia(query: string, initial = false) {
  const [match, setMatch] = useState(() => (typeof window === 'undefined' ? initial : window.matchMedia(query).matches))
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatch(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return match
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const systemReduce = useMedia('(prefers-reduced-motion: reduce)')
  const isDesktop = useMedia('(min-width: 768px)', true)
  const [stored, setStored] = useState<string | null>(() => {
    try { return localStorage.getItem(KEY) } catch { return null }
  })
  const reduced = stored === 'on' ? true : stored === 'off' ? false : systemReduce

  const toggleReduced = useCallback(() => {
    const next = reduced ? 'off' : 'on'
    try { localStorage.setItem(KEY, next) } catch { /* ignore */ }
    setStored(next)
  }, [reduced])

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduced)
  }, [reduced])

  const mode: MotionMode = reduced ? 'reduced' : isDesktop ? 'full' : 'lite'
  const value = useMemo(() => ({ mode, reduced, isDesktop, toggleReduced }), [mode, reduced, isDesktop, toggleReduced])
  return <MotionCtx.Provider value={value}>{children}</MotionCtx.Provider>
}

export const useMotionMode = () => useContext(MotionCtx)
