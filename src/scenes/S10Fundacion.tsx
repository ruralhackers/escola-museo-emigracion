import { useRef } from 'react'
import { motion } from 'framer-motion'
import { C } from '../art/palette'
import { ShipSilhouette } from '../art/Ship'
import { Art, ParallaxLayer, SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useT } from '../lib/i18n'

const STAMP_COLORS = [C.stamp, C.ocean, C.moss, C.rust, C.teal]
const SHAPES = ['circle', 'rect', 'oct', 'oval', 'circle'] as const

function StampMark({ i }: { i: number }) {
  const u = useT().ui.fundacion
  const LABELS = u.stamps
  const c = STAMP_COLORS[i]
  const shape = SHAPES[i]
  return (
    <svg viewBox="-60 -60 120 120" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke={c} strokeWidth="4">
        {shape === 'circle' && <><circle r="54" /><circle r="42" strokeWidth="2" /></>}
        {shape === 'rect' && <><rect x="-56" y="-40" width="112" height="80" rx="6" /><rect x="-48" y="-32" width="96" height="64" strokeWidth="2" /></>}
        {shape === 'oct' && <><polygon points="-22,-54 22,-54 54,-22 54,22 22,54 -22,54 -54,22 -54,-22" /><polygon points="-17,-44 17,-44 44,-17 44,17 17,44 -17,44 -44,17 -44,-17" strokeWidth="2" /></>}
        {shape === 'oval' && <><ellipse rx="58" ry="40" /><ellipse rx="48" ry="31" strokeWidth="2" /></>}
      </g>
      <text y="-12" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="11" fill={c}>{u.stampStep} {i + 1}</text>
      <text y="8" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize={LABELS[i].length > 7 ? 12 : 15} fill={c}>{LABELS[i]}</text>
      <text y="26" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="9" fill={c}>GAXATE</text>
    </svg>
  )
}

export function S10Fundacion() {
  const all = useT()
  const t = all.fundacion
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const reduced = mode === 'reduced'
  return (
    <SceneCtxProvider sectionRef={ref} pinned={false}>
      <section id="fundacion" ref={ref} data-scene="fundacion" data-bg={C.paper} aria-labelledby="fundacion-title" className="scene relative overflow-hidden bg-paper pb-16 pt-24 sm:pb-20 sm:pt-32">
        <svg viewBox="0 0 1600 40" preserveAspectRatio="none" className="absolute inset-x-0 top-0 h-6 w-full" aria-hidden="true"><path d="M0 0 H1600 V18 L1560 30 L1500 16 L1440 34 L1380 20 L1300 36 L1240 18 L1160 30 L1080 14 L1000 32 L940 18 L860 34 L780 20 L700 36 L620 16 L540 30 L460 18 L380 34 L300 20 L220 32 L140 16 L60 30 L0 18Z" fill={C.moss} /></svg>
        <div className="absolute inset-0" aria-hidden="true">
          <ParallaxLayer speed={0.6} drift={200} className="absolute inset-0 opacity-[0.08]">
            <Art viewBox="0 0 1600 900" align="xMidYMid slice">
              <g transform="translate(60 520) scale(1.2)"><ShipSilhouette color={C.ocean} /></g>
              <g transform="translate(1000 80) scale(.7)"><ShipSilhouette color={C.ocean} /></g>
            </Art>
          </ParallaxLayer>
        </div>
        <div className="relative z-10 mx-auto max-w-4xl px-5 sm:px-8">
          <div className="text-center">
            <div className="flex justify-center"><Kicker n={10}>{all.ui.kickers.fundacion}</Kicker></div>
            <h2 id="fundacion-title" className="font-display text-[clamp(1.9rem,3.6vw,3.3rem)] font-bold leading-tight">{t.title}</h2>
          </div>
          {/* passport / register page */}
          <div
            className="relative mt-12 border border-teal/40 px-5 py-10 shadow-[10px_12px_0_rgba(30,27,24,.12)] sm:px-12"
            style={{
              backgroundColor: '#EEF0E6',
              backgroundImage: `repeating-radial-gradient(circle at 0 0, transparent 0 18px, rgba(62,124,134,.08) 18px 19px), repeating-radial-gradient(circle at 100% 100%, transparent 0 22px, rgba(181,53,43,.05) 22px 23px)`,
            }}
          >
            <p className="mb-8 flex justify-between font-type text-xs uppercase tracking-[0.25em] text-ocean"><span>{all.ui.fundacion.register}</span><span>Escola Museo da Emigración</span></p>
            <ol className="relative space-y-10 sm:space-y-12">
              <span aria-hidden="true" className="absolute bottom-4 left-[44px] top-4 border-l-2 border-dashed border-ink/30 sm:left-[60px]" />
              {t.steps.map((s, i) => (
                <li key={i} className="relative grid grid-cols-[88px_1fr] items-center gap-5 sm:grid-cols-[120px_1fr] sm:gap-8">
                  <motion.div
                    className="relative h-[88px] w-[88px] bg-[#EEF0E6] sm:h-[120px] sm:w-[120px]"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.9, rotate: -30 }}
                    whileInView={{ opacity: 0.92, scale: 1, rotate: [-8, 6, -5, 7, -4][i] }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={reduced ? { duration: 0.4 } : { duration: 0.32, ease: [0.7, 0, 0.9, 0.5], delay: 0.1 }}
                  >
                    <StampMark i={i} />
                  </motion.div>
                  <motion.p
                    className="text-[1.05rem]"
                    initial={{ opacity: 0, x: reduced ? 0 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <span className="font-type text-xs uppercase tracking-[0.2em] text-ink/60">{all.ui.fundacion.step} {i + 1}</span>
                    <br />
                    <strong className="font-display text-xl">{s.strong}</strong>
                    {s.rest}
                  </motion.p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </SceneCtxProvider>
  )
}
