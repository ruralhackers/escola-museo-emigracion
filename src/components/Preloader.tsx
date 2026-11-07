import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { C } from '../art/palette'
import { Postmark, Stamp, StampShip } from '../art/Postal'
import { useMotionMode } from '../lib/motion'
import { useT } from '../lib/i18n'

/** Scene 0 · a stamp being franked by the museum postmark. Max 2.5 s, skippable. */
export function Preloader({ onDone }: { onDone: () => void }) {
  const { reduced } = useMotionMode()
  const t = useT()
  const total = reduced ? 700 : 2100
  const [pct, setPct] = useState(0)
  const [phase, setPhase] = useState<'load' | 'peel' | 'gone'>('load')

  useEffect(() => {
    const start = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setPhase('peel')
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [total])

  useEffect(() => {
    if (phase === 'peel') {
      const t = setTimeout(() => setPhase('gone'), reduced ? 150 : 380)
      return () => clearTimeout(t)
    }
    if (phase === 'gone') onDone()
  }, [phase, onDone, reduced])

  useEffect(() => {
    const skip = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') setPhase('gone') }
    window.addEventListener('keydown', skip)
    return () => window.removeEventListener('keydown', skip)
  }, [])

  return (
    <AnimatePresence>
      {phase !== 'gone' && (
        <motion.div
          key="pre"
          className="fixed inset-0 z-[90] flex cursor-pointer flex-col items-center justify-center bg-paper"
          role="dialog"
          aria-label={t.ui.preloader.label}
          onClick={() => setPhase('gone')}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="relative"
            animate={phase === 'peel' ? { y: -80, rotate: -14, opacity: 0, scale: 0.9 } : { y: 0, rotate: -3 }}
            transition={{ duration: 0.5, ease: [0.6, 0, 0.4, 1] }}
          >
            <svg viewBox="-20 -20 300 300" className="h-[min(56vw,300px)] w-[min(56vw,300px)]" aria-hidden="true">
              <g transform="translate(55 30)">
                <Stamp w={150} h={190} color={C.ocean}>
                  <StampShip w={132} h={172} />
                </Stamp>
              </g>
              <motion.g
                initial={reduced ? { opacity: 0.9 } : { scale: 2.6, opacity: 0, rotate: -40 }}
                animate={{ scale: 1, opacity: 0.88, rotate: -12 }}
                transition={reduced ? { duration: 0.2 } : { delay: 0.55, duration: 0.28, ease: [0.7, 0, 0.9, 0.4] }}
                style={{ transformOrigin: '150px 140px' }}
              >
                <g transform="translate(150 140)">
                  <Postmark r={70} text="ESCOLA MUSEO DA EMIGRACIÓN · GAXATE · " center="GAXATE" bars={false} strokeWidth={3.4} />
                </g>
              </motion.g>
              {!reduced && (
                <motion.circle
                  cx="150" cy="140" r="70" fill="none" stroke={C.stamp} strokeWidth="2"
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1.6], opacity: [0, 0.5, 0] }}
                  transition={{ delay: 0.83, duration: 0.6 }}
                  style={{ transformOrigin: '150px 140px' }}
                />
              )}
            </svg>
          </motion.div>
          <p className="mt-6 font-type text-lg tracking-widest text-ink" aria-live="polite">
            {String(pct).padStart(3, '0')} %
          </p>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setPhase('gone') }}
            className="absolute bottom-8 font-type text-sm uppercase tracking-[0.2em] text-ink/70 underline-offset-4 hover:underline"
          >
            {t.ui.preloader.skip}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
