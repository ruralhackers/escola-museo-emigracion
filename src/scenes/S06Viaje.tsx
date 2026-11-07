import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { C, smoothPath } from '../art/palette'
import { Ship, ShipCutaway } from '../art/Ship'
import { Suitcase } from '../art/Suitcase'
import { Crane, EmigrantHotel, IndianoHouse, Lighthouse, PortCity } from '../art/Buildings'
import { Crowd } from '../art/Figures'
import { Cloud, Gull, Hill, Oak, Palm, wavePath } from '../art/Nature'
import { Compass, Handkerchief, KeyIcon, LetterIcon, Porthole } from '../art/Objects'
import { Postmark, Stamp, StampShip } from '../art/Postal'
import { Art, Reveal } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useT } from '../lib/i18n'

const SKY = [C.fog, C.oceanDeep, C.tropicLight, C.tropic, C.fog, '#E6CD95']
const HORIZON = 576

/* ---------- backdrops for the 6 stops: back (behind sea) and front (in front of the back sea band) ---------- */

function Stars() {
  const pts = Array.from({ length: 60 }).map((_, i) => [(i * 271) % 1600, (i * 137) % 480, (i % 3) + 1])
  return <g fill={C.white}>{pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} opacity={0.4 + (i % 5) / 8} />)}</g>
}

const BACK: ReactNode[] = [
  // 1 · Embarque (Galicia)
  <g key="1">
    <g transform="translate(1000 60) scale(.9)"><Cloud opacity={0.7} /></g>
    <Hill width={1600} base={HORIZON - 30} amp={110} seed={71} fill={C.tealLight} n={6} />
    <Hill width={1600} base={HORIZON} amp={40} seed={72} fill={C.teal} n={8} />
    <g transform="translate(1400 400) scale(.68)"><Lighthouse /></g>
    <Gull x={1200} y={200} /><Gull x={1250} y={180} s={0.7} delay={-0.3} />
  </g>,
  // 2 · Vida a bordo (night)
  <g key="2">
    <Stars />
    <circle cx="1250" cy="170" r="56" fill={C.paper} />
    <circle cx="1272" cy="156" r="56" fill={C.oceanDeep} opacity=".25" />
  </g>,
  // 3 · Recepción en países
  <g key="3">
    <circle cx="300" cy="200" r="90" fill={C.white} opacity=".5" />
    <g transform="translate(200 276)"><PortCity seed={9} /></g>
    <g transform="translate(60 330) scale(1.1)"><Crane color={C.inkSoft} /></g>
    <g transform="translate(1340 330) scale(1.1)"><Crane color={C.inkSoft} /></g>
  </g>,
  // 4 · Hoteles de emigrantes
  <g key="4">
    <g transform="translate(160 100) scale(.8)"><Cloud opacity={0.5} /></g>
    <Hill width={1600} base={HORIZON} amp={40} seed={73} fill={C.mossLight} n={6} />
    <g transform="translate(560 276)"><EmigrantHotel /></g>
    <g transform="translate(250 330)"><Palm /></g>
    <g transform="translate(1210 330)"><Palm /></g>
  </g>,
  // 5 · Viaje de vuelta
  <g key="5">
    <g transform="translate(200 120) scale(1.2)"><Cloud opacity={0.8} /></g>
    <g transform="translate(900 60)"><Cloud opacity={0.6} /></g>
    <Hill width={1600} base={HORIZON} amp={60} seed={74} fill={C.tealLight} n={7} />
    <g transform="translate(1400 400) scale(.6)"><Lighthouse /></g>
    <Gull x={420} y={260} /><Gull x={470} y={240} s={0.7} delay={-0.5} /><Gull x={1100} y={300} s={0.8} delay={-0.2} />
  </g>,
  // 6 · Indianos
  <g key="6">
    <g transform="translate(240 90) scale(.8)"><Cloud opacity={0.6} /></g>
    <Hill width={1600} base={HORIZON - 70} amp={90} seed={75} fill={C.mossLight} n={6} />
    <Hill width={1600} base={HORIZON + 10} amp={30} seed={76} fill={C.moss} n={6} />
    <g transform="translate(600 288) scale(1.2)"><IndianoHouse wall={C.white} /></g>
    <g transform="translate(940 330) scale(1.0)"><Palm /></g>
    {[120, 300, 450].map((x) => <g key={x} transform={`translate(${x} 430) scale(.9)`}><Oak /></g>)}
  </g>,
]

const FRONT: ReactNode[] = [
  <g key="1">
    <path d={`M-50 ${HORIZON + 60} H520 L560 ${HORIZON + 90} V1300 H-50Z`} fill={C.stoneDark} />
    <path d={`M-50 ${HORIZON + 50} H520 L560 ${HORIZON + 70} V${HORIZON + 90} H-50Z`} fill={C.stone} />
    <Crowd width={500} base={HORIZON + 62} count={18} color={C.ink} minH={70} maxH={100} waving={0.7} seed={13} />
  </g>,
  <g key="2" />,
  <g key="3">
    <path d={`M1100 ${HORIZON + 70} H1700 V1300 H1060Z`} fill={C.stoneDark} />
    <g transform="translate(1120 0)"><Crowd width={460} base={HORIZON + 72} count={14} color={C.rustDark} minH={60} maxH={90} waving={0.3} seed={17} /></g>
  </g>,
  <g key="4">
    <path d={`M-50 ${HORIZON + 30} H1650 V${HORIZON + 50} H-50Z`} fill={C.stone} />
  </g>,
  <g key="5" />,
  <g key="6">
    <path d={`M-50 ${HORIZON + 6} Q800 ${HORIZON - 6} 1650 ${HORIZON + 6} V${HORIZON + 200} Q1200 ${HORIZON + 230} 800 ${HORIZON + 210} T-50 ${HORIZON + 220} Z`} fill={C.moss} />
    <path d={`M765 ${HORIZON + 4} C760 ${HORIZON + 80} 640 ${HORIZON + 120} 600 ${HORIZON + 210}`} stroke={C.paperDark} strokeWidth="34" fill="none" strokeLinecap="round" />
    <g fill={C.stone}>{Array.from({ length: 16 }).map((_, i) => <rect key={i} x={40 + i * 30} y={HORIZON + 30 + (i % 2) * 3} width="26" height="18" rx="5" />)}</g>
    <g fill={C.stone}>{Array.from({ length: 16 }).map((_, i) => <rect key={i} x={880 + i * 30} y={HORIZON + 30 + (i % 2) * 3} width="26" height="18" rx="5" />)}</g>
    <g transform="translate(806 520) scale(.3)"><Suitcase labels={6} /></g>
    <g fill={C.stamp}>{[200, 260, 1100, 1180, 1300].map((x) => <circle key={x} cx={x} cy={HORIZON + 120} r="6" />)}</g>
  </g>,
]

function StopObject({ i }: { i: number }) {
  const all = useT()
  const t = all.viaje
  const [on, setOn] = useState(false)
  const icons = [<Handkerchief />, <Porthole />, <g><g transform="translate(14 8)"><Stamp w={72} h={84} color={C.stamp}><StampShip w={54} h={66} /></Stamp></g><g transform="translate(70 74) rotate(-15)"><Postmark r={24} text={all.ui.viaje.arrival} bars={false} strokeWidth={2} /></g></g>, <KeyIcon />, <Compass />, <LetterIcon />]
  return (
    <button
      type="button"
      className="obj grid h-20 w-20 flex-none place-items-center rounded-full bg-paper/90 p-2 shadow-md"
      aria-pressed={on}
      aria-label={`${t.stops[i].object}: ${all.ui.viaje.interactive}`}
      title={t.stops[i].object}
      onClick={() => setOn((v) => !v)}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true" style={{ overflow: 'visible' }}>{icons[i]}</svg>
    </button>
  )
}

function StopPoster({ i, dark = false }: { i: number; dark?: boolean }) {
  const all = useT()
  const s = all.viaje.stops[i]
  return (
    <div className="flex items-start gap-4">
      <div className={`poster max-w-[360px] px-6 py-5 ${dark ? 'bg-ocean-deep text-paper' : 'bg-paper text-ink'}`}>
        <p className={`font-type text-xs uppercase tracking-[0.3em] ${dark ? 'text-tropic' : 'text-stamp'}`}>{all.ui.viaje.stop} {String(i + 1).padStart(2, '0')} / 06</p>
        <h3 className="mt-1 font-display text-[clamp(1.7rem,2.8vw,2.6rem)] font-bold leading-tight">{s.title}</h3>
        <p className="mt-2 text-[1.02rem]">{s.caption}</p>
      </div>
      <StopObject i={i} />
    </div>
  )
}

function Sea({ night, children }: { night?: MotionValue<number> | number; children?: ReactNode }) {
  return (
    <Art>
      <g className="drift-1600"><path d={wavePath(3400, HORIZON, 8, 100)} fill={C.teal} /></g>
      {children}
      {night !== undefined && <motion.rect x="-400" y={HORIZON - 10} width="2400" height="1200" fill={C.oceanDeep} style={{ opacity: night as any }} />}
    </Art>
  )
}
function SeaFront() {
  return (
    <Art>
      <g className="drift-1600r"><path d={wavePath(3400, HORIZON + 230, 14, 160)} fill={C.ocean} /></g>
      <g className="drift-1600" opacity=".8">
        <path d={wavePath(3400, HORIZON + 280, 10, 120)} fill={C.oceanDeep} />
      </g>
    </Art>
  )
}

/* ---------- top progress: dotted Atlantic loop ---------- */
const ROUTE_PTS: [number, number][] = [[560, 34], [420, 46], [250, 50], [90, 44], [40, 28], [200, 14], [380, 12], [560, 34]]
const ROUTE = smoothPath(ROUTE_PTS)
const STOP_AT = [0, 2, 3, 4, 5, 7]

function RouteBar({ p }: { p: MotionValue<number> }) {
  const pathRef = useRef<SVGPathElement>(null)
  const [pos, setPos] = useState({ x: 560, y: 34, a: 180 })
  useMotionValueEvent(p, 'change', (v) => {
    const el = pathRef.current
    if (!el) return
    const L = el.getTotalLength()
    const a = el.getPointAtLength(Math.max(0, Math.min(1, v)) * L)
    const b = el.getPointAtLength(Math.min(L, Math.max(0, Math.min(1, v)) * L + 2))
    setPos({ x: a.x, y: a.y, a: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI })
  })
  return (
    <div className="pointer-events-none absolute left-1/2 top-[68px] z-30 w-[min(620px,62vw)] -translate-x-1/2 rounded-full bg-paper/80 px-6 py-1 backdrop-blur-sm" aria-hidden="true">
      <svg viewBox="0 0 600 64" className="w-full">
        <path d="M600 0 Q578 20 590 64" fill={C.mossLight} opacity=".7" />
        <path d="M0 18 Q30 40 14 64 H0Z" fill={C.tropic} opacity=".7" />
        <path d={ROUTE} fill="none" stroke={C.ink} strokeOpacity=".25" strokeWidth="2" strokeDasharray="3 6" />
        <motion.path ref={pathRef} d={ROUTE} fill="none" stroke={C.stamp} strokeWidth="2.4" strokeDasharray="3 6" style={{ pathLength: p }} />
        {STOP_AT.map((k, i) => (
          <g key={i}>
            <circle cx={ROUTE_PTS[k][0]} cy={ROUTE_PTS[k][1]} r="5" fill={C.paper} stroke={C.ink} strokeWidth="1.5" />
            <text x={ROUTE_PTS[k][0]} y={ROUTE_PTS[k][1] + (i === 4 || i === 5 ? -9 : 17)} textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="10" fill={C.ink}>{i + 1}</text>
          </g>
        ))}
        <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.a})`}>
          <path d="M-10 -2 H10 L7 4 H-7Z" fill={C.oceanDeep} />
          <rect x="-5" y="-6" width="8" height="4" fill={C.stamp} />
        </g>
      </svg>
    </div>
  )
}

/* ---------- pinned horizontal voyage (desktop) ---------- */
function PinnedVoyage() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.5 })
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1]
  const x = useTransform(p, [0, 1], ['0vw', '-500vw'])
  const farX = useTransform(p, [0, 1], ['0vw', '-160vw'])
  const sky = useTransform(p, stops, SKY)
  const night = useTransform(p, [0.08, 0.2, 0.3], [0, 0.55, 0])
  const cut = useTransform(p, [0.12, 0.16, 0.25, 0.29], [0, 1, 1, 0])
  const ext = useTransform(cut, (v) => 1 - v)
  const flip = useTransform(p, [0.66, 0.72], [1, -1])
  const shipScale = useTransform(p, [0, 0.5, 0.6, 0.7, 1], [1, 1, 0.82, 1, 1])
  const shipO = useTransform(p, [0.9, 0.98], [1, 0])
  const gang = useTransform(p, [0, 0.07], [1, 0])
  const bagX = useTransform(p, [0, 0.06], [0, 120])
  const bagY = useTransform(p, [0, 0.06], [0, -70])
  const all = useT()
  const t = all.viaje

  return (
    <div ref={ref} id="viaje-strip" style={{ height: '600vh' }} className="relative">
      <motion.div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden" style={{ backgroundColor: sky }}>
        <RouteBar p={p} />
        <div role="img" aria-label={all.ui.art.viaje} className="absolute inset-0">
          {/* far parallax strip */}
          <motion.div className="absolute inset-y-0 left-0 w-[300vw]" style={{ x: farX }}>
            <svg viewBox="0 0 4800 900" preserveAspectRatio="xMinYMax slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <g key={i} transform={`translate(${i * 420 + 80} ${90 + (i % 3) * 60}) scale(${0.5 + (i % 2) * 0.3})`}><Cloud opacity={0.35} /></g>
              ))}
            </svg>
          </motion.div>
          {/* back strip */}
          <motion.div className="absolute inset-y-0 left-0 flex w-[600vw]" style={{ x }}>
            {BACK.map((b, i) => <div key={i} className="relative h-full w-screen flex-none"><Art>{b}</Art></div>)}
          </motion.div>
          <div className="absolute inset-0"><Sea night={night} /></div>
          {/* front strip (quays, ground) */}
          <motion.div className="absolute inset-y-0 left-0 flex w-[600vw]" style={{ x }}>
            {FRONT.map((b, i) => <div key={i} className="relative h-full w-screen flex-none"><Art>{b}</Art></div>)}
          </motion.div>
          {/* centred ship */}
          <motion.div className="absolute bottom-[11%] left-1/2" style={{ width: 'clamp(320px, 42vw, 700px)', x: '-50%', opacity: shipO, scale: shipScale }}>
            <motion.div style={{ scaleX: flip }}>
              <svg viewBox="0 -70 800 350" className="bob block w-full" style={{ overflow: 'visible' }} aria-hidden="true">
                <motion.g style={{ opacity: gang }}>
                  <path d="M-260 300 L120 186" stroke={C.rust} strokeWidth="12" />
                  <path d="M-260 280 L120 166" stroke={C.ink} strokeWidth="2" />
                  <motion.g style={{ x: bagX, y: bagY }}><g transform="translate(-170 196) scale(.22)"><Suitcase labels={2} /></g></motion.g>
                </motion.g>
                <motion.g style={{ opacity: ext }}><Ship /></motion.g>
                <motion.g style={{ opacity: cut }}><ShipCutaway /></motion.g>
              </svg>
            </motion.div>
          </motion.div>
          <div className="absolute inset-0"><SeaFront /></div>
        </div>
        {/* posters move with the strip */}
        <motion.div className="absolute inset-y-0 left-0 z-20 flex w-[600vw]" style={{ x }}>
          {t.stops.map((_, i) => (
            <div key={i} className="relative h-full w-screen flex-none">
              <div className={`absolute top-[15vh] ${i % 2 ? 'right-[7vw]' : 'left-[7vw]'}`}>
                <StopPoster i={i} dark={i === 1} />
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ---------- stacked chapters (mobile / reduced motion) ---------- */
function StackedVoyage() {
  const all = useT()
  const t = all.viaje
  return (
    <ol className="space-y-14 pb-20">
      {t.stops.map((s, i) => (
        <li key={s.title}>
          <Reveal>
            <div role="img" aria-label={all.ui.art.viajeStop.replace('{title}', s.title)} className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9]" style={{ backgroundColor: SKY[i] }}>
              <Art>{BACK[i]}</Art>
              <Sea night={i === 1 ? 0.55 : undefined} />
              <Art>{FRONT[i]}</Art>
              {i !== 5 && (
                <svg viewBox="0 -70 800 350" className="absolute bottom-[8%] left-1/2 w-[min(64%,640px)]" style={{ overflow: 'visible', transform: `translateX(-50%) ${i === 4 ? 'scaleX(-1)' : ''}` }} aria-hidden="true">
                  {i === 1 ? <ShipCutaway /> : <Ship />}
                </svg>
              )}
              <SeaFront />
            </div>
            <div className="mx-auto -mt-8 max-w-xl px-5"><StopPoster i={i} dark={i === 1} /></div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}

export function S06Viaje() {
  const { mode } = useMotionMode()
  const all = useT()
  const t = all.viaje
  return (
    <section id="viaje" data-scene="viaje" data-bg={C.oceanDeep} aria-labelledby="viaje-title" className="scene relative bg-ocean-deep text-paper">
      <div className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8">
        <svg viewBox="0 0 1600 200" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-24 w-full opacity-30" aria-hidden="true">
          <path d={wavePath(1600, 120, 14, 120, 200)} fill={C.teal} />
        </svg>
        <Reveal className="relative mx-auto max-w-3xl text-center">
          <div className="flex justify-center"><Kicker n={6} light>{all.ui.kickers.viaje}</Kicker></div>
          <h2 id="viaje-title" className="font-display text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-tight">{t.title}</h2>
          <p className="mt-5 text-[1.1rem] text-paper/90">{t.lead}</p>
          <ol className="mt-8 flex flex-wrap justify-center gap-2 font-type text-xs uppercase tracking-widest text-paper/80" aria-label={all.ui.viaje.stopsLabel}>
            {t.stops.map((s, i) => <li key={s.title} className="rounded-full border border-paper/30 px-3 py-1">{i + 1}. {s.title}</li>)}
          </ol>
          {mode === 'full' && <p className="mt-8 font-type text-sm text-tropic">{all.ui.viaje.keepScrolling}</p>}
        </Reveal>
      </div>
      {mode === 'full' ? <PinnedVoyage /> : <StackedVoyage />}
    </section>
  )
}
