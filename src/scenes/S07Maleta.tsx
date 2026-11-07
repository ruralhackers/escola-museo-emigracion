import { useRef, type ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { C } from '../art/palette'
import { SuitcaseFront, SuitcaseLabels } from '../art/Suitcase'
import { BellowsCamera, BookIcon, Bundle, Chair, KeepBox, ModelShip, PocketWatch } from '../art/Objects'
import { Stamp, StampShip, Postmark } from '../art/Postal'
import { GaliciaMap, SouthAmericaMap } from '../art/Maps'
import { Art, ParallaxLayer, Reveal, SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useSceneProgress } from '../lib/useSceneProgress'
import { useT } from '../lib/i18n'

const ICONS: ReactNode[] = [<BellowsCamera />, <ModelShip />, <Bundle />, <PocketWatch />, <Chair />, <BookIcon />, <KeepBox />]
const ANG = [-168, -142, -116, -90, -64, -38, -12]

function Tag({ i, label }: { i: number; label: string }) {
  return (
    <div className="label-swing relative w-[clamp(112px,11vw,164px)] origin-top">
      <svg viewBox="0 0 160 200" className="block w-full drop-shadow-[4px_6px_0_rgba(30,27,24,.22)]" aria-hidden="true">
        <path d="M80 -30 Q70 -10 80 18" stroke={C.ink} strokeWidth="2" fill="none" />
        <path d="M24 10 H136 L156 32 V190 H4 V32 Z" fill={[C.paper, C.white, C.paperDark][i % 3]} />
        <circle cx="80" cy="26" r="7" fill="none" stroke={C.ink} strokeWidth="2" />
        <circle cx="80" cy="26" r="11" fill="none" stroke={C.brass} strokeWidth="3" />
        <rect x="4" y="160" width="152" height="30" fill={i % 2 ? C.stamp : C.ocean} />
        <g transform="translate(30 46)"><svg width="100" height="100" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>{ICONS[i]}</svg></g>
      </svg>
      <span className="absolute inset-x-0 bottom-[3.5%] text-center font-type text-[clamp(0.72rem,0.85vw,0.85rem)] uppercase tracking-wider text-paper">{label}</span>
    </div>
  )
}

function FlyingTag({ i, p, label }: { i: number; p: MotionValue<number> }& { label: string }) {
  const start = 0.28 + i * 0.075
  const a = (ANG[i] * Math.PI) / 180
  const dx = Math.cos(a) * 39
  const dy = Math.sin(a) * 37
  const x = useTransform(p, [start, start + 0.16], ['0vw', `${dx}vw`])
  const y = useTransform(p, [start, start + 0.08, start + 0.16], ['0vh', `${dy - 10}vh`, `${dy}vh`])
  const scale = useTransform(p, [start, start + 0.16], [0.15, 1])
  const rotate = useTransform(p, [start, start + 0.16], [i % 2 ? 40 : -40, (i - 3) * 3])
  const opacity = useTransform(p, [start, start + 0.03], [0, 1])
  return (
    <motion.li className="absolute left-0 top-0" style={{ x, y, scale, rotate, opacity }}>
      <div className="-translate-x-1/2 -translate-y-1/2"><Tag i={i} label={label} /></div>
    </motion.li>
  )
}

function OpeningSuitcase({ p, children }: { p: MotionValue<number>; children?: ReactNode }) {
  const rotateX = useTransform(p, [0.06, 0.26], [0, -168])
  const glow = useTransform(p, [0.12, 0.3], [0, 1])
  return (
    <div className="relative mx-auto aspect-[300/220] w-[clamp(240px,30vw,440px)]" style={{ perspective: 1100 }}>
      {/* interior / open mouth */}
      <motion.svg viewBox="0 40 300 56" className="absolute left-0 top-[18.2%] h-[25.5%] w-full" aria-hidden="true" style={{ opacity: glow }}>
        <path d="M14 96 L26 46 H274 L286 96Z" fill={C.oceanDeep} />
        <path d="M26 46 H274 L278 60 H22Z" fill={C.stamp} />
        <g stroke={C.paper} strokeWidth="1.5" opacity=".35">{[60, 100, 140, 180, 220, 260].map((x) => <line key={x} x1={x} y1="60" x2={x - 4} y2="96" />)}</g>
        <ellipse cx="150" cy="80" rx="90" ry="10" fill={C.tropic} opacity=".35" />
      </motion.svg>
      {/* body */}
      <svg viewBox="0 92 300 128" className="absolute bottom-0 left-0 h-[58.2%] w-full" aria-hidden="true">
        <SuitcaseFront bodyOnly />
        <SuitcaseLabels n={3} />
      </svg>
      {children}
      {/* lid */}
      <motion.div className="absolute left-0 top-0 h-[41.8%] w-full" style={{ rotateX, transformOrigin: '50% 43.5%', transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 300 92" className="absolute inset-0 h-full w-full" style={{ backfaceVisibility: 'hidden' }} aria-hidden="true">
          <path d="M118 44 Q118 12 150 12 Q182 12 182 44" fill="none" stroke={C.rustDark} strokeWidth="11" strokeLinecap="round" />
          <rect x="108" y="36" width="20" height="12" rx="3" fill={C.brass} />
          <rect x="172" y="36" width="20" height="12" rx="3" fill={C.brass} />
          <SuitcaseFront lidOnly />
          <g transform="translate(0 -6)"><SuitcaseLabels n={0} /></g>
        </svg>
        <svg viewBox="0 40 300 52" className="absolute left-0 top-[43.5%] h-[56.5%] w-full" style={{ transform: 'rotateX(180deg)', backfaceVisibility: 'hidden' }} aria-hidden="true">
          <path d="M24 40 H276 Q290 40 290 54 V92 H10 V54 Q10 40 24 40 Z" fill={C.rustDark} />
          <rect x="22" y="46" width="256" height="42" rx="4" fill={C.stamp} />
          <rect x="60" y="56" width="180" height="26" rx="3" fill={C.paperDark} />
          <path d="M60 56 L150 72 L240 56" stroke={C.rust} strokeWidth="1.5" fill="none" />
        </svg>
      </motion.div>
    </div>
  )
}

function Backdrop() {
  const u = useT().ui
  return (
    <>
      <ParallaxLayer speed={0.2} className="absolute inset-0">
        <Art viewBox="0 0 1600 900" align="xMidYMid slice">
          <g opacity=".22">
            <g transform="translate(120 260) scale(1.5)"><SouthAmericaMap fill={C.tropic} river={false} /></g>
            <g transform="translate(1180 120) scale(1.2)"><GaliciaMap fill={C.moss} dot={false} /></g>
            <path d="M1260 260 C1000 300 700 380 340 520" stroke={C.ink} strokeWidth="4" strokeDasharray="10 14" fill="none" />
          </g>
          <g stroke={C.ink} strokeOpacity=".07">{Array.from({ length: 20 }).map((_, i) => <line key={i} x1={i * 90} y1="0" x2={i * 90} y2="900" />)}</g>
        </Art>
      </ParallaxLayer>
      <ParallaxLayer speed={0.7} drift={-120} className="absolute inset-0">
        <Art viewBox="0 0 1600 900" align="xMidYMid slice">
          {[[80, 140, -12, C.ocean], [1400, 520, 10, C.moss], [1460, 120, -6, C.stamp], [160, 640, 14, C.teal]].map(([x, y, r, c], i) => (
            <g key={i} transform={`translate(${x} ${y}) rotate(${r}) scale(.7)`}><Stamp w={120} h={150} color={c as string}><StampShip w={102} h={132} /></Stamp></g>
          ))}
          <g transform="translate(1240 760) rotate(-14)" opacity=".7"><Postmark r={60} text={u.coleccion.postmark} /></g>
        </Art>
      </ParallaxLayer>
    </>
  )
}

export function S07Maleta() {
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const full = mode === 'full'
  const p = useSceneProgress(ref, { duration: 1.6 })
  const all = useT()
  const t = all.coleccion
  const label = all.ui.art.coleccion

  return (
    <SceneCtxProvider sectionRef={ref} pinned={full}>
      <section id="coleccion" ref={ref} data-scene="coleccion" data-bg={C.paperDark} aria-labelledby="coleccion-title" className="scene relative" style={{ height: full ? '300vh' : undefined, background: `radial-gradient(ellipse at 50% 70%, ${C.paper}, ${C.paperDark})` }}>
        {full ? (
          <div className="sticky top-0 h-[100svh] min-h-[640px] overflow-hidden">
            <div role="img" aria-label={label} className="absolute inset-0"><Backdrop /></div>
            <div className="absolute left-[5vw] top-[11vh] z-20 max-w-[28vw]">
              <Kicker n={7}>{all.ui.kickers.coleccion}</Kicker>
              <h2 id="coleccion-title" className="sr-only">{all.ui.kickers.coleccion}</h2>
            </div>
            <div className="absolute inset-x-0 bottom-[5vh] z-10">
              <OpeningSuitcase p={p}>
                <ul className="absolute left-1/2 top-[22%] z-10" aria-label={all.ui.coleccion.itemsLabel}>
                  {t.items.map((it, i) => <FlyingTag key={it} i={i} p={p} label={it} />)}
                </ul>
              </OpeningSuitcase>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden px-5 pb-20 pt-16">
            <div className="absolute inset-0" aria-hidden="true"><Backdrop /></div>
            <div className="relative mx-auto max-w-xl text-center">
              <div className="flex justify-center"><Kicker n={7}>{all.ui.kickers.coleccion}</Kicker></div>
              <h2 id="coleccion-title" className="sr-only">{all.ui.kickers.coleccion}</h2>
            </div>
            <div role="img" aria-label={label} className="relative mt-24"><OpeningSuitcase p={p} /></div>
            <ul className="relative mx-auto mt-10 grid max-w-xl grid-cols-2 justify-items-center gap-x-4 gap-y-10 sm:grid-cols-3" aria-label={all.ui.coleccion.itemsLabel}>
              {t.items.map((it, i) => (
                <Reveal as="li" key={it} delay={0.15 + i * 0.06}>
                  <div style={{ transform: `rotate(${(i % 3) * 3 - 3}deg)` }}><Tag i={i} label={it} /></div>
                </Reveal>
              ))}
            </ul>
          </div>
        )}
      </section>
    </SceneCtxProvider>
  )
}
