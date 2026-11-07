import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import es from '../content/es.json'
import gl from '../content/gl.json'
import en from '../content/en.json'

/**
 * Languages
 *  - gl · es · en, switcher order GL | ES | EN
 *  - priority: ?lang= in the URL → saved choice (localStorage) → browser language → Spanish
 */
export type Lang = 'gl' | 'es' | 'en'
export type Content = typeof es
export const LANGS: Lang[] = ['gl', 'es', 'en']
export const LANG_NAMES: Record<Lang, string> = { gl: 'Galego', es: 'Español', en: 'English' }
const CONTENT: Record<Lang, Content> = { es, gl: gl as Content, en: en as Content }
const KEY = 'eme-lang'
const isLang = (v: unknown): v is Lang => v === 'gl' || v === 'es' || v === 'en'

function detect(): Lang {
  if (typeof window === 'undefined') return 'es'
  try {
    const q = new URLSearchParams(window.location.search).get('lang')?.toLowerCase()
    if (isLang(q)) {
      try { localStorage.setItem(KEY, q) } catch { /* ignore */ }
      return q
    }
  } catch { /* ignore */ }
  try {
    const saved = localStorage.getItem(KEY)
    if (isLang(saved)) return saved
  } catch { /* ignore */ }
  const prefs = (navigator.languages?.length ? navigator.languages : [navigator.language]).filter(Boolean)
  const first = (prefs[0] || '').toLowerCase()
  if (first.startsWith('gl')) return 'gl'
  if (first.startsWith('es')) return 'es'
  if (first.startsWith('en')) return 'en'
  return 'es'
}

type Ctx = { lang: Lang; t: Content; setLang: (l: Lang) => void }
const I18nCtx = createContext<Ctx>({ lang: 'es', t: es, setLang: () => {} })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detect)
  const t = CONTENT[lang]

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    try { localStorage.setItem(KEY, l) } catch { /* ignore */ }
    // keep a shared ?lang= link in sync with the visible language
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', l)
        history.replaceState(history.state, '', url.pathname + url.search + url.hash)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.meta.ogDescription)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', t.meta.locale)
  }, [lang, t])

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}

export function useI18n() {
  return useContext(I18nCtx)
}

/** Shorthand: the whole content object for the active language. */
export function useT() {
  return useContext(I18nCtx).t
}
