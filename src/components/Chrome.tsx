import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { LANGS, LANG_NAMES, useI18n, useT } from '../lib/i18n'
import { C } from '../art/palette'
import { useMotionMode } from '../lib/motion'
import { lockScroll, scrollToId } from '../lib/scroll'
import { setAmbient } from '../lib/sound'

function go(e: React.MouseEvent, id: string) {
  e.preventDefault()
  scrollToId(id)
}

/** Thin dotted Atlantic route across the top edge; a tiny ship marks the reading position. */
export function ScrollRoute() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const left = useTransform(p, (v) => `calc(${(v * 100).toFixed(2)}% - 14px)`)
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-4" aria-hidden="true">
      <div className="absolute inset-x-0 top-[7px] border-t-2 border-dotted border-ink/20" />
      <motion.div className="absolute left-0 top-[7px] h-0 origin-left border-t-2 border-dotted border-stamp" style={{ scaleX: p, width: '100%' }} />
      <motion.svg viewBox="0 0 28 14" className="absolute top-0 h-[14px] w-[28px]" style={{ left }}>
        <path d="M1 8 H27 L24 13 H4Z" fill={C.oceanDeep} />
        <rect x="8" y="4" width="12" height="4" fill={C.white} />
        <rect x="11" y="0" width="3" height="4" fill={C.stamp} />
        <rect x="16" y="0" width="3" height="4" fill={C.stamp} />
      </motion.svg>
    </div>
  )
}

export function TopBar({ active, onMenu }: { active: string; onMenu: () => void }) {
  const { reduced, toggleReduced } = useMotionMode()
  const { lang, setLang, t } = useI18n()
  const u = t.ui.topbar
  const [sound, setSound] = useState(false)
  const dark = ['viaje'].includes(active)
  const toggleSound = async () => {
    const next = !sound
    setSound(next)
    try { await setAmbient(next) } catch { setSound(false) }
  }
  const pill = `flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium backdrop-blur-sm transition-colors ${dark ? 'bg-ocean-deep/60 text-paper' : 'bg-paper/80 text-ink'}`
  return (
    <header className="fixed inset-x-0 top-3 z-[56] flex items-start justify-between px-3 sm:px-5">
      <a href="#inicio" onClick={(e) => go(e, 'inicio')} className="group block" aria-label={u.home}>
        <svg viewBox="0 0 56 56" className="h-12 w-12 drop-shadow-sm transition-transform group-hover:rotate-[-8deg]" aria-hidden="true">
          <defs>
            <mask id="emlogo">
              <rect width="56" height="56" fill="#fff" />
              {Array.from({ length: 7 }).map((_, i) => (
                <g key={i} fill="#000">
                  <circle cx={4 + i * 8} cy="0" r="2.6" /><circle cx={4 + i * 8} cy="56" r="2.6" />
                  <circle cx="0" cy={4 + i * 8} r="2.6" /><circle cx="56" cy={4 + i * 8} r="2.6" />
                </g>
              ))}
            </mask>
          </defs>
          <rect width="56" height="56" fill={C.white} mask="url(#emlogo)" />
          <rect x="6" y="6" width="44" height="44" fill={C.stamp} />
          <text x="28" y="35" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="20" fill={C.paper}>EM</text>
          <path d="M10 42 q4.5 -3 9 0 t9 0 t9 0 t9 0" stroke={C.paper} strokeWidth="1.5" fill="none" />
        </svg>
      </a>
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button type="button" onClick={toggleReduced} aria-pressed={reduced} className={pill} title={u.reduceMotion}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
            {reduced ? <path d="M5 12h14" /> : <path d="M3 12c3-5 6 5 9 0s6 5 9 0" />}
          </svg>
          <span className="hidden lg:inline">{u.reduceMotion}</span>
          <span className="sr-only lg:hidden">{u.reduceMotion}</span>
        </button>
        <button type="button" onClick={toggleSound} aria-pressed={sound} className={pill} title={sound ? u.soundOff : u.soundOnTitle}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 9h3l4-4v14l-4-4H4z" fill="currentColor" />
            {sound ? <path d="M15 9c1.5 1.5 1.5 4.5 0 6M18 6c3 3 3 9 0 12" /> : <path d="M15 12c1.2-1.4 2.4 1.4 3.6 0s2.4 1.4 3.4 0" />}
          </svg>
          <span className="sr-only">{sound ? u.soundOff : u.soundOn}</span>
        </button>
        <div className={`${pill} !gap-0 !px-1.5`} role="group" aria-label={u.language}>
          {LANGS.map((l, i) => (
            <span key={l} className="flex items-center">
              {i > 0 && <span aria-hidden="true" className="px-0.5 opacity-40">|</span>}
              <button
                type="button"
                onClick={() => setLang(l)}
                aria-current={lang === l ? 'true' : undefined}
                aria-label={LANG_NAMES[l]}
                lang={l}
                title={LANG_NAMES[l]}
                className={`rounded-full px-1.5 py-1 text-xs uppercase tracking-wide transition-colors sm:text-sm ${lang === l ? 'font-bold underline decoration-2 underline-offset-4' : 'opacity-70 hover:opacity-100'}`}
              >
                {l}
              </button>
            </span>
          ))}
        </div>
        <span className="hidden min-[430px]:block"><a href="#apoya" onClick={(e) => go(e, 'apoya')} className="btn-stamp h-10 !py-0 text-sm">{u.support}</a></span>
        <button type="button" onClick={onMenu} className={`${pill} !px-2.5`} aria-haspopup="dialog" aria-label={u.openIndex}>
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h11M4 17h16" />
          </svg>
          <span className="hidden sm:inline">{u.index}</span>
        </button>
      </div>
    </header>
  )
}

export function SceneDots({ active }: { active: string }) {
  const t = useT()
  const NAV = t.nav
  return (
    <nav aria-label={t.ui.dots} className="fixed right-3 top-1/2 z-[54] hidden -translate-y-1/2 md:block">
      <ol className="flex flex-col items-end gap-2.5">
        {NAV.map((n, i) => {
          const on = n.id === active
          return (
            <li key={n.id} className="group relative flex items-center">
              <span className="pointer-events-none absolute right-7 whitespace-nowrap rounded-sm bg-ink px-2 py-1 font-type text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                {String(i + 1).padStart(2, '0')} · {n.label}
              </span>
              <a
                href={`#${n.id}`}
                onClick={(e) => go(e, n.id)}
                aria-label={n.label}
                aria-current={on ? 'true' : undefined}
                className="grid h-5 w-5 place-items-center"
              >
                <span className={`block rounded-full border-2 transition-all duration-300 ${on ? 'h-3.5 w-3.5 border-stamp bg-stamp' : 'h-2.5 w-2.5 border-ink/50 bg-paper/70'}`} />
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Full-screen map-index: the scenes as stops on the dotted Atlantic route. */
export function MenuOverlay({ open, onClose, active }: { open: boolean; onClose: () => void; active: string }) {
  const { reduced } = useMotionMode()
  const t = useT()
  const NAV = t.nav
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    lockScroll(true)
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a,button')
        const first = f[0], last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); lockScroll(false) }
  }, [open, onClose])

  // stops along a curve from Galicia (top-right) to South America (bottom-left) and back
  const pts = NAV.map((_, i) => {
    const k = i / (NAV.length - 1)
    const x = 88 - 76 * Math.sin(k * Math.PI * 0.95) * (1 - k * 0.15) - k * 4
    const y = 10 + k * 80
    return [x, y]
  })
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.ui.menu.label}
          className="fixed inset-0 z-[80] overflow-y-auto bg-ocean-deep text-paper"
          initial={{ opacity: 0, clipPath: reduced ? undefined : 'circle(0% at 95% 4%)' }}
          animate={{ opacity: 1, clipPath: reduced ? undefined : 'circle(150% at 95% 4%)' }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.65, 0, 0.35, 1] }}
        >
          <div className="mx-auto flex min-h-full max-w-6xl flex-col px-5 pb-10 pt-6 sm:px-10">
            <div className="flex items-center justify-between">
              <p className="font-type text-sm uppercase tracking-[0.25em] text-tropic">{t.ui.menu.kicker}</p>
              <button ref={closeRef} type="button" onClick={onClose} className="btn-ghost text-paper">
                {t.ui.menu.close} <span aria-hidden="true">✕</span>
              </button>
            </div>
            <div className="relative mt-6 grid flex-1 gap-8 md:grid-cols-[1.1fr_1fr]">
              <svg viewBox="0 0 100 100" className="hidden h-full max-h-[75vh] w-full md:block" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
                <path d="M78 2 Q92 4 98 12 L98 24 Q90 22 84 16 Z" fill={C.moss} opacity=".8" />
                <path d="M8 70 Q20 64 30 72 Q34 86 22 99 L14 99 Q4 86 8 70Z" fill={C.tropic} opacity=".75" />
                <motion.path
                  d={`M${pts.map((p) => p.join(' ')).join(' L')}`}
                  fill="none" stroke={C.paper} strokeWidth=".5" strokeDasharray="1.2 1.2"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.3 }}
                />
                {pts.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={NAV[i].id === active ? 1.8 : 1.1} fill={NAV[i].id === active ? C.stamp : C.paper} />
                ))}
              </svg>
              <ol className="flex flex-col justify-center gap-1">
                {NAV.map((n, i) => (
                  <motion.li key={n.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.04 }}>
                    <a
                      href={`#${n.id}`}
                      onClick={(e) => { e.preventDefault(); onClose(); setTimeout(() => scrollToId(n.id), 60) }}
                      className={`group flex items-baseline gap-4 rounded-sm py-1.5 font-display text-2xl transition-colors hover:text-tropic sm:text-3xl ${n.id === active ? 'text-tropic' : ''}`}
                    >
                      <span className="w-8 font-type text-sm text-paper/60">{String(i + 1).padStart(2, '0')}</span>
                      <span>{n.label}</span>
                    </a>
                  </motion.li>
                ))}
              </ol>
            </div>
            <p className="mt-8 font-display text-lg italic text-paper/80">Escola Museo da Emigración · Galegos: As máns de América</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
