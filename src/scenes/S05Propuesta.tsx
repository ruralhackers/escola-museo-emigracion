import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { C } from '../art/palette'
import { School } from '../art/Buildings'
import { Cloud, Hill, Oak, Gull } from '../art/Nature'
import { Art, ParallaxLayer, SceneCtxProvider } from '../components/Scene'
import { Obj } from '../components/Obj'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useT } from '../lib/i18n'


function BookCover({ small = false }: { small?: boolean }) {
  const motto = useT().identity.motto
  return (
    <div className={`relative flex h-full w-full flex-col items-center justify-center bg-[#141210] px-6 text-center ${small ? 'py-10' : ''}`} style={{ boxShadow: 'inset 0 0 0 10px #141210, inset 0 0 0 12px #C29A4B, inset 0 0 0 18px #141210, inset 0 0 0 19px rgba(194,154,75,.6)' }}>
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/60 to-transparent" />
      <p className="font-display text-[clamp(1.6rem,3vw,2.8rem)] italic leading-tight text-brass" lang="gl">
        {motto.split(': ')[0]}:<br />{motto.split(': ')[1]}
      </p>
      <svg viewBox="0 0 120 40" className="mt-5 w-28" aria-hidden="true">
        <path d="M5 30 q14 -10 28 0 t28 0 t28 0 t28 0" stroke={C.brass} strokeWidth="2" fill="none" />
        <path d="M30 22 L90 20 L84 28 L36 28Z" fill={C.brass} />
        <rect x="52" y="10" width="6" height="10" fill={C.brass} /><rect x="64" y="10" width="6" height="10" fill={C.brass} />
      </svg>
    </div>
  )
}

function LeftPage() {
  const t = useT().propuesta
  return (
      <div className="relative h-full bg-[#FBF6EA] px-6 py-8 sm:px-10 sm:py-10" style={{ boxShadow: 'inset -18px 0 30px -20px rgba(0,0,0,.35)' }}>
        <h3 className="font-display text-2xl font-bold text-stamp">{t.proposalTitle}</h3>
        <p className="mt-3 text-[1.02rem]">{t.proposal}</p>
        <p className="absolute bottom-3 left-0 right-0 text-center font-type text-xs text-ink/50" aria-hidden="true">— i —</p>
      </div>
  )
}
function RightPage() {
  const t = useT().propuesta
  return (
      <div className="relative h-full bg-[#FBF6EA] px-6 py-8 sm:px-10 sm:py-10" style={{ boxShadow: 'inset 18px 0 30px -20px rgba(0,0,0,.35)' }}>
        <h3 className="font-display text-2xl font-bold text-stamp">{t.objectiveTitle}</h3>
        <ul className="mt-3 space-y-4 text-[0.98rem]">
          {t.objectives.map((o, i) => (
            <li key={i} className="flex gap-3"><span aria-hidden="true" className="mt-2 h-2 w-2 flex-none rotate-45 bg-brass" />{o}</li>
          ))}
        </ul>
        <p className="absolute bottom-3 left-0 right-0 text-center font-type text-xs text-ink/50" aria-hidden="true">— ii —</p>
      </div>
  )
}
function Pages() {
  return (<><LeftPage /><RightPage /></>)
}

function OpeningBook() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 25%'] })
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 20 })
  const rotateY = useTransform(p, [0.15, 0.85], [0, -180])
  const x = useTransform(p, [0.15, 0.85], ['-25%', '0%'])
  const leftO = useTransform(p, [0.4, 0.75], [0, 1])
  return (
    <div ref={ref} className="relative mx-auto w-[min(1100px,94vw)]" style={{ perspective: 2200 }}>
      <motion.div className="relative grid grid-cols-2 shadow-[0_30px_40px_-20px_rgba(0,0,0,.45)]" style={{ x }}>
        <motion.div style={{ opacity: leftO }}><LeftPage /></motion.div>
        <div><RightPage /></div>
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2"
          style={{ rotateY, transformOrigin: '0% 50%', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
          aria-hidden="true"
        >
          <BookCover />
        </motion.div>
      </motion.div>
    </div>
  )
}
export function S05Propuesta() {
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const full = mode === 'full'
  const all = useT()
  return (
    <SceneCtxProvider sectionRef={ref} pinned={false}>
      <section id="propuesta" ref={ref} data-scene="propuesta" data-bg={C.tropicLight} aria-labelledby="propuesta-title" className="scene relative overflow-hidden" style={{ background: `linear-gradient(${C.tropic} 0%, ${C.tropicLight} 35%, ${C.paper} 75%)` }}>
        <div role="img" aria-label={all.ui.art.propuesta} className="absolute inset-x-0 top-0 h-[78vh] min-h-[520px]">
          <ParallaxLayer speed={0.15} drift={-100} className="absolute -inset-x-[10%] inset-y-0">
            <Art>
              <circle cx="800" cy="230" r="120" fill={C.white} opacity=".35" />
              <circle cx="800" cy="230" r="80" fill={C.white} opacity=".45" />
              <g transform="translate(160 120) scale(.8)"><Cloud fill={C.white} opacity={0.5} /></g>
              <g transform="translate(1180 170) scale(.7)"><Cloud fill={C.white} opacity={0.45} /></g>
              <Gull x={520} y={200} s={0.8} /><Gull x={560} y={180} s={0.6} delay={-0.4} />
            </Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.3} className="absolute inset-0">
            <Art>
              <Hill width={1600} base={700} amp={110} seed={61} fill={C.mossLight} n={5} />
              {[100, 300, 1250, 1450].map((x, i) => <g key={x} transform={`translate(${x} ${560 + (i % 2) * 20}) scale(.9)`}><Oak /></g>)}
            </Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.55} className="absolute inset-0">
            <Obj viewBox="0 0 440 210" style={{ left: '50%', bottom: '10%', width: 'clamp(280px, 46vw, 760px)', transform: 'translateX(-50%)' }}>
              <School sign />
            </Obj>
          </ParallaxLayer>
          <ParallaxLayer speed={0.9} className="absolute inset-0">
            <Art><Hill width={1600} base={860} amp={30} seed={62} fill={C.moss} n={4} /></Art>
          </ParallaxLayer>
        </div>

        <div className="relative z-10 px-4 pt-[12vh] text-center">
          <div className="mx-auto w-fit rounded-full bg-paper/85 px-4 py-1"><Kicker n={5}>{all.ui.kickers.propuesta}</Kicker></div>
          <h2 id="propuesta-title" className="mx-auto mt-2 max-w-3xl font-display text-[clamp(1.9rem,4vw,3.4rem)] font-bold leading-tight text-ink">
            {all.identity.name}
          </h2>
        </div>

        <div className="relative z-10 pb-24 pt-[44vh]">
          {full ? (
            <OpeningBook />
          ) : (
            <div className="mx-auto w-[min(640px,92vw)] shadow-[0_30px_40px_-20px_rgba(0,0,0,.45)]">
              <div className="aspect-[4/3]"><BookCover small /></div>
              <div className="grid"><Pages /></div>
            </div>
          )}
        </div>
      </section>
    </SceneCtxProvider>
  )
}
