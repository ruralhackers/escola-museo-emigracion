import { useRef } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { C } from '../art/palette'
import { School } from '../art/Buildings'
import { Neighbour } from '../art/Figures'
import { Hill, Oak, Cypress } from '../art/Nature'
import { GaliciaMap, SouthAmericaMap } from '../art/Maps'
import { Envelope } from '../art/Postal'
import { Art, ParallaxLayer, SceneCtxProvider } from '../components/Scene'
import { Obj } from '../components/Obj'
import { Kicker } from '../components/Card'
import { BigPostmark } from '../components/BigPostmark'
import { useMotionMode } from '../lib/motion'
import { useSceneProgress } from '../lib/useSceneProgress'
import { useT } from '../lib/i18n'

const P0 = [108, 118], P1 = [236, -20], P2 = [334, 72]
const bez = (u: number, i: 0 | 1) => (1 - u) * (1 - u) * P0[i] + 2 * (1 - u) * u * P1[i] + u * u * P2[i]

function Forest() {
  return (
    <ParallaxLayer speed={0.2} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={480} amp={110} seed={51} fill={C.mossLight} n={6} />
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 120 - 30} ${400 + (i % 3) * 22}) scale(${0.8 + (i % 4) * 0.12})`}>
            {i % 4 === 2 ? <Cypress fill={C.mossDark} /> : <Oak fill={i % 2 ? C.moss : C.mossDark} light={C.mossLight} />}
          </g>
        ))}
      </Art>
    </ParallaxLayer>
  )
}
function SchoolLayer() {
  return (
    <ParallaxLayer speed={0.55} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={700} amp={30} seed={52} fill={C.moss} n={4} />
      </Art>
      <Obj viewBox="0 0 440 210" style={{ left: '6%', bottom: '25%', width: 'clamp(260px, 42vw, 720px)' }}>
        <School />
      </Obj>
    </ParallaxLayer>
  )
}
function Neighbours() {
  const loads = ['stone', 'wood', 'stone', 'basket', 'stone'] as const
  return (
    <ParallaxLayer speed={1.0} drift={90} className="pointer-events-none absolute inset-0">
      <Art>
        <Hill width={1600} base={800} amp={30} seed={53} fill={C.mossDark} n={4} />
        <g fill={C.stone}>
          {[[90, 780], [130, 790], [110, 770], [1420, 790]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="26" ry="14" />)}
        </g>
      </Art>
      {loads.map((l, i) => (
        <Obj key={i} viewBox="-40 -20 180 200" style={{ left: `${3 + i * 10}%`, bottom: `${8 + (i % 2) * 3}%`, width: 'clamp(56px, 7.5vw, 130px)' }}>
          <Neighbour load={l} color={i % 2 ? C.ink : C.inkSoft} />
        </Obj>
      ))}
    </ParallaxLayer>
  )
}

function LetterRoute({ p }: { p: MotionValue<number> }) {
  const ui = useT().ui
  const draw = useTransform(p, [0.12, 0.5], [0, 1], { clamp: true })
  const u = useTransform(p, [0.12, 0.5], [0, 1], { clamp: true })
  const ex = useTransform(u, (v) => bez(v, 0) - 34)
  const ey = useTransform(u, (v) => bez(v, 1) - 22)
  const er = useTransform(u, [0, 0.5, 1], [-14, 8, -4])
  const eo = useTransform(p, [0.08, 0.14, 0.58, 0.64], [0, 1, 1, 0])
  return (
    <svg viewBox="0 0 400 300" className="block w-full" role="img" aria-label={ui.art.letterMap}>
      <rect width="400" height="300" fill={C.fogLight} />
      <g stroke={C.tealLight} strokeWidth=".8" opacity=".6">
        {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={i * 36} x2="400" y2={i * 36} />)}
        {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2="300" />)}
      </g>
      <g transform="translate(22 62) scale(.86)"><SouthAmericaMap /></g>
      <g transform="translate(300 22) scale(.42)"><GaliciaMap fill={C.mossLight} dot={false} /></g>
      <circle cx={P0[0]} cy={P0[1]} r="4" fill={C.ocean} />
      <text x={P0[0] - 40} y={P0[1] + 22} fontFamily="Special Elite, monospace" fontSize="11" fill={C.ink}>{ui.escuela.amazon}</text>
      <circle cx={P2[0]} cy={P2[1]} r="5" fill={C.stamp} stroke={C.white} strokeWidth="2" />
      <text x={P2[0] - 16} y={P2[1] + 22} fontFamily="Special Elite, monospace" fontSize="11" fill={C.ink}>Gaxate</text>
      <path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke={C.ink} strokeOpacity=".2" strokeWidth="2" strokeDasharray="4 6" />
      <motion.path d={`M${P0} Q${P1} ${P2}`} fill="none" stroke={C.stamp} strokeWidth="2.4" strokeDasharray="4 6" style={{ pathLength: draw }} />
      <motion.g style={{ x: ex, y: ey, rotate: er, opacity: eo }}>
        <g transform="scale(.29)"><Envelope /></g>
      </motion.g>
      <text x="200" y="290" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="10" fill={C.ink} opacity=".6">{ui.escuela.ocean}</text>
    </svg>
  )
}

function Letter({ p, overlay }: { p: MotionValue<number>; overlay: boolean }) {
  const all = useT()
  const t = all.escuela
  const o = useTransform(p, [0.58, 0.7], overlay ? [0, 1] : [1, 1])
  const y = useTransform(p, [0.58, 0.72], overlay ? [60, 0] : [0, 0])
  const r = useTransform(p, [0.58, 0.72], overlay ? [-6, -1.5] : [0, 0])
  return (
    <motion.div style={{ opacity: o, y, rotate: r }} className={overlay ? 'absolute inset-x-[4%] top-[8%]' : 'mt-6'}>
      <div className="paper-card relative bg-[#FBF6EA] px-6 py-6 sm:px-8" style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 30px, rgba(31,78,107,.12) 30px 31px)' }}>
        <p className="font-type text-xs uppercase tracking-[0.25em] text-ocean">{all.ui.escuela.letterKicker}</p>
        <p className="mt-3 font-display text-[clamp(1.05rem,1.4vw,1.3rem)] leading-relaxed">{t.text}</p>
        <p className="mt-4 font-display italic text-stamp">{t.foot}</p>
      </div>
    </motion.div>
  )
}

export function S03Escuela() {
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const full = mode === 'full'
  const p = useSceneProgress(ref)
  const all = useT()
  const t = all.escuela

  const art = (
    <div className="absolute inset-0" style={{ background: `linear-gradient(${C.fogLight}, ${C.paperDark})` }}>
      <Forest />
      <SchoolLayer />
      <Neighbours />
    </div>
  )
  const artLabel = all.ui.art.escuela

  return (
    <SceneCtxProvider sectionRef={ref} pinned={full}>
      <section id="escuela" ref={ref} data-scene="escuela" data-bg={C.paperDark} aria-labelledby="escuela-title" className="scene relative" style={{ height: full ? '280vh' : undefined, backgroundColor: C.paperDark }}>
        {full ? (
          <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden">
            <div role="img" aria-label={artLabel} className="absolute inset-0">{art}</div>
            <div className="absolute left-[10vw] top-[13vh] z-20">
              <BigPostmark p={p} from={0.02} to={0.12} text={t.year} ring={all.ui.escuela.builtIn} />
            </div>
            <div className="absolute right-[5vw] top-1/2 z-20 w-[min(460px,40vw)] -translate-y-1/2">
              <Kicker n={3}>{all.ui.kickers.escuela}</Kicker>
              <h2 id="escuela-title" className="font-display text-[clamp(1.7rem,2.8vw,2.6rem)] font-bold leading-tight">{t.title}</h2>
              <div className="relative mt-5 border-4 border-white shadow-[8px_10px_0_rgba(30,27,24,.15)]">
                <LetterRoute p={p} />
                <Letter p={p} overlay />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div role="img" aria-label={artLabel} className="relative aspect-[4/3] max-h-[80vh] w-full overflow-hidden sm:aspect-[16/10]">
              {art}
              <div className="absolute right-4 top-4 z-10">
                <BigPostmark p={p} from={0} to={0.15} text={t.year} ring={all.ui.escuela.builtIn} size="110px" />
              </div>
            </div>
            <div className="mx-auto max-w-2xl px-5 pb-16 pt-8">
              <Kicker n={3}>{all.ui.kickers.escuela}</Kicker>
              <h2 id="escuela-title" className="font-display text-3xl font-bold leading-tight">{t.title}</h2>
              <div className="mt-5 border-4 border-white"><LetterRoute p={p} /></div>
              <Letter p={p} overlay={false} />
            </div>
          </div>
        )}
      </section>
    </SceneCtxProvider>
  )
}
