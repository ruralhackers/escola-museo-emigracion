import { useRef, type ReactNode } from 'react'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import { C } from '../art/palette'
import { Ship } from '../art/Ship'
import { IndianoHouse, School } from '../art/Buildings'
import { Crowd } from '../art/Figures'
import { Envelope, LetterSheet, Postcard, Postmark, Stamp, StampShip } from '../art/Postal'
import { BellowsCamera } from '../art/Objects'
import { SceneCtxProvider, Reveal } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useSceneProgress } from '../lib/useSceneProgress'
import { useT } from '../lib/i18n'

function Photo({ children, tone = C.fogLight }: { children: ReactNode; tone?: string }) {
  return (
    <svg viewBox="0 0 160 180" className="block w-full drop-shadow-[4px_6px_0_rgba(0,0,0,.25)]" aria-hidden="true">
      <rect width="160" height="180" fill={C.white} />
      <rect x="10" y="10" width="140" height="130" fill={tone} />
      <svg x="10" y="10" width="140" height="130" viewBox="0 0 140 130" style={{ filter: 'sepia(.5)' }}>{children}</svg>
    </svg>
  )
}

function TrunkTop() {
  return (
    <svg viewBox="0 0 300 260" className="block w-full drop-shadow-[6px_10px_0_rgba(0,0,0,.28)]" aria-hidden="true">
      {/* open lid seen from above */}
      <rect x="10" y="0" width="280" height="90" rx="8" fill={C.rustDark} />
      <rect x="22" y="10" width="256" height="70" rx="4" fill={C.stamp} />
      <g stroke={C.paper} strokeWidth="2" opacity=".4">{[30, 50, 70].map((y) => <line key={y} x1="22" y1={y} x2="278" y2={y} />)}</g>
      {/* body */}
      <rect x="10" y="96" width="280" height="160" rx="8" fill={C.rust} />
      <rect x="24" y="108" width="252" height="136" rx="4" fill={C.oceanDeep} />
      <g transform="translate(40 118) rotate(-6)"><rect width="90" height="60" fill={C.paperDark} /><path d="M0 0 L45 34 L90 0" fill="none" stroke={C.rust} /></g>
      <g transform="translate(140 150) rotate(8)"><rect width="110" height="76" fill={C.white} /><rect x="8" y="8" width="94" height="50" fill={C.tealLight} /></g>
      <g transform="translate(60 186) rotate(-14)"><rect width="70" height="40" fill={C.brass} /></g>
      {[[10, 96], [272, 96], [10, 238], [272, 238]].map(([x, y], i) => <rect key={i} x={x} y={y} width="18" height="18" fill={C.brass} />)}
      <rect x="70" y="96" width="18" height="160" fill={C.rustDark} />
      <rect x="212" y="96" width="18" height="160" fill={C.rustDark} />
    </svg>
  )
}

type Item = { node: ReactNode; left: string; top: string; w: string; dx: number; dy: number; r0: number; r1: number; z?: number }

function PorqueMark() {
  return <Postmark r={70} text={useT().ui.porque.postmark} />
}

const ITEMS: Item[] = [
  { node: <TrunkTop />, left: '38%', top: '30%', w: 'clamp(180px,22vw,340px)', dx: -2, dy: 26, r0: -4, r1: 6, z: 1 },
  { node: <Photo><rect width="140" height="130" fill={C.fogLight} /><rect y="86" width="140" height="44" fill={C.tealLight} /><g transform="translate(6 40) scale(.16)"><Ship smoke={false} /></g></Photo>, left: '30%', top: '18%', w: 'clamp(90px,10vw,160px)', dx: -22, dy: -10, r0: -8, r1: -22 },
  { node: <Photo tone={C.paper}><g transform="translate(14 22) scale(.42)"><IndianoHouse /></g></Photo>, left: '56%', top: '16%', w: 'clamp(90px,10vw,160px)', dx: 26, dy: -8, r0: 9, r1: 20 },
  { node: <Photo tone={C.fog}><Crowd width={140} base={128} count={9} color={C.inkSoft} minH={50} maxH={70} seed={9} waving={0.2} /></Photo>, left: '24%', top: '52%', w: 'clamp(90px,10vw,160px)', dx: -24, dy: 18, r0: 5, r1: 18 },
  { node: <Photo tone={C.fogLight}><g transform="translate(2 40) scale(.31)"><School /></g></Photo>, left: '62%', top: '50%', w: 'clamp(90px,10vw,160px)', dx: 24, dy: 18, r0: -6, r1: -16 },
  { node: <svg viewBox="0 0 200 260" className="block w-full drop-shadow-[3px_5px_0_rgba(0,0,0,.2)]" aria-hidden="true"><LetterSheet /></svg>, left: '46%', top: '12%', w: 'clamp(80px,9vw,140px)', dx: 6, dy: -30, r0: 3, r1: -12 },
  { node: <svg viewBox="0 0 240 150" className="block w-full drop-shadow-[3px_5px_0_rgba(0,0,0,.2)]" aria-hidden="true"><Envelope /></svg>, left: '18%', top: '34%', w: 'clamp(110px,13vw,210px)', dx: -14, dy: -4, r0: -10, r1: -26 },
  { node: <svg viewBox="0 0 260 170" className="block w-full drop-shadow-[3px_5px_0_rgba(0,0,0,.2)]" aria-hidden="true"><Postcard /></svg>, left: '64%', top: '32%', w: 'clamp(110px,13vw,210px)', dx: 18, dy: -4, r0: 7, r1: 16 },
  { node: <svg viewBox="0 0 120 150" className="block w-full" aria-hidden="true"><Stamp w={120} h={150} color={C.moss}><StampShip w={102} h={132} /></Stamp></svg>, left: '52%', top: '66%', w: 'clamp(50px,5vw,80px)', dx: 10, dy: 28, r0: 12, r1: 40 },
  { node: <svg viewBox="-80 -80 260 160" className="block w-full" aria-hidden="true"><PorqueMark /></svg>, left: '40%', top: '68%', w: 'clamp(90px,10vw,150px)', dx: -8, dy: 30, r0: -10, r1: -30 },
  { node: <svg viewBox="0 0 100 100" className="block w-full" aria-hidden="true"><BellowsCamera /></svg>, left: '70%', top: '68%', w: 'clamp(70px,8vw,120px)', dx: 22, dy: 22, r0: -8, r1: 10 },
]

function Scattered({ p, scatter }: { p: MotionValue<number>; scatter: boolean }) {
  return (
    <>
      {ITEMS.map((it, i) => <ScatterItem key={i} it={it} p={p} scatter={scatter} />)}
    </>
  )
}
function ScatterItem({ it, p, scatter }: { it: Item; p: MotionValue<number>; scatter: boolean }) {
  const k = scatter ? 1 : 0.35
  const x = useTransform(p, [0, 0.55], ['0vw', `${it.dx * k}vw`])
  const y = useTransform(p, [0, 0.55], ['0vh', `${it.dy * k}vh`])
  const rotate = useTransform(p, [0, 0.55], [it.r0, it.r1])
  return (
    <motion.div className="absolute" style={{ left: it.left, top: it.top, width: it.w, x, y, rotate, zIndex: it.z ?? 2 }}>
      {it.node}
    </motion.div>
  )
}

function Quote({ p, full }: { p: MotionValue<number>; full: boolean }) {
  const t = useT().porque
  const o = useTransform(p, [0.3, 0.5], full ? [0, 1] : [1, 1])
  const s = useTransform(p, [0.3, 0.55], full ? [0.92, 1] : [1, 1])
  return (
    <motion.blockquote style={{ opacity: o, scale: s }} className={`paper-card relative mx-auto max-w-3xl px-6 py-6 sm:px-8 sm:py-7 ${full ? '' : 'mt-0'}`}>
      <p className="leading-[1.6]">
        {t.quoteBefore}
        <strong className="font-bold">{t.quoteStrong}</strong>
        {t.quoteAfter}
      </p>
    </motion.blockquote>
  )
}

const tableBg = {
  backgroundColor: '#6E3A20',
  backgroundImage: `repeating-linear-gradient(92deg, rgba(0,0,0,.08) 0 2px, transparent 2px 38px), repeating-linear-gradient(88deg, rgba(255,255,255,.05) 0 1px, transparent 1px 90px), radial-gradient(ellipse at 50% 40%, #8A4B2A, #5E301A 80%)`,
}

export function S04PorQue() {
  const ref = useRef<HTMLDivElement>(null)
  const { mode } = useMotionMode()
  const full = mode === 'full'
  const p = useSceneProgress(ref as any)
  const all = useT()
  const label = all.ui.art.porque

  return (
    <SceneCtxProvider sectionRef={ref as any} pinned={full}>
      <section id="por-que" data-scene="por-que" data-bg={C.paper} aria-labelledby="porque-title" className="scene relative bg-paper">
        <div ref={ref} style={{ height: full ? '230vh' : undefined }} className="relative">
          {full ? (
            <div className="sticky top-0 h-[100svh] min-h-[600px] overflow-hidden" style={tableBg}>
              <div role="img" aria-label={label} className="absolute inset-0"><Scattered p={p} scatter /></div>
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
                <div className="mb-4 rounded-full bg-paper/90 px-4 py-1"><Kicker n={4}>{all.ui.kickers.porque}</Kicker></div>
                <h2 id="porque-title" className="sr-only">{all.ui.kickers.porque}</h2>
                <Quote p={p} full />
              </div>
            </div>
          ) : (
            <div className="pb-16">
              <div role="img" aria-label={label} className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10]" style={tableBg}>
                <Scattered p={p} scatter={false} />
              </div>
              <div className="relative z-10 -mt-10 px-4">
                <div className="mx-auto mb-4 w-fit rounded-full bg-paper px-4 py-1"><Kicker n={4}>{all.ui.kickers.porque}</Kicker></div>
                <h2 id="porque-title" className="sr-only">{all.ui.kickers.porque}</h2>
                <Reveal><Quote p={p} full={false} /></Reveal>
              </div>
            </div>
          )}
        </div>
      </section>
    </SceneCtxProvider>
  )
}
