import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { C } from '../art/palette'
import { Ship, ShipSmoke } from '../art/Ship'
import { Suitcase } from '../art/Suitcase'
import { Postcard } from '../art/Postal'
import { Crane, Lighthouse } from '../art/Buildings'
import { Crowd } from '../art/Figures'
import { Cloud, Gull, Hill, Waves } from '../art/Nature'
import { Art, ParallaxLayer, SceneCtxProvider } from '../components/Scene'
import { Obj } from '../components/Obj'
import { useMotionMode } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import { useT } from '../lib/i18n'

/* ---------- Layers (each one can be swapped for a professional illustration) ---------- */

function SkyLayer() {
  return (
    <ParallaxLayer speed={0.15} drift={-160} className="absolute -inset-x-[10%] -top-[10%] bottom-0">
      <Art>
        <circle cx="1180" cy="210" r="70" fill={C.white} opacity=".75" />
        <g transform="translate(120 120) scale(1.1)"><Cloud opacity={0.8} /></g>
        <g transform="translate(900 70) scale(.8)"><Cloud opacity={0.65} /></g>
        <g transform="translate(1320 260) scale(.6)"><Cloud opacity={0.7} /></g>
        <g transform="translate(520 300) scale(.5)"><Cloud opacity={0.5} /></g>
      </Art>
    </ParallaxLayer>
  )
}

function GullsLayer() {
  return (
    <ParallaxLayer speed={0.5} drift={220} className="absolute inset-0">
      <Art>
        <Gull x={280} y={300} s={1.2} />
        <Gull x={340} y={270} s={0.9} delay={-0.4} />
        <Gull x={1260} y={360} s={1} delay={-0.7} />
        <Gull x={1320} y={330} s={0.7} delay={-0.2} />
        <Gull x={980} y={240} s={0.6} delay={-0.5} />
      </Art>
    </ParallaxLayer>
  )
}

function CoastLayer() {
  return (
    <ParallaxLayer speed={0.3} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={640} amp={90} seed={4} fill={C.tealLight} n={6} />
        <Hill width={1600} base={680} amp={50} seed={9} fill={C.teal} n={9} />
      </Art>
      <Obj viewBox="-260 0 380 260" style={{ right: '7%', bottom: '28%', width: 'clamp(90px, 13vw, 210px)' }}>
        <Lighthouse />
      </Obj>
    </ParallaxLayer>
  )
}

function SeaLayer() {
  return (
    <ParallaxLayer speed={0.45} className="absolute inset-0">
      <div className="absolute inset-x-0 -bottom-[40%] top-[66%] overflow-hidden">
        <svg viewBox="0 0 3200 300" preserveAspectRatio="none" className="drift-slow absolute inset-y-0 left-0 h-full w-[200%]" aria-hidden="true">
          <Waves width={3200} y={20} amp={10} len={140} fill={C.teal} crest={C.fogLight} />
        </svg>
      </div>
    </ParallaxLayer>
  )
}

function ShipLayer({ shipScale, smokeStretch }: { shipScale: any; smokeStretch: any }) {
  return (
    <ParallaxLayer speed={0.55} className="absolute inset-0">
       <motion.div className="absolute left-1/2 bottom-[21%]" style={{ width: 'clamp(300px, 44vw, 760px)', x: '-50%', scale: shipScale, transformOrigin: '50% 90%' }}>
        <svg viewBox="0 -60 800 340" className="bob block w-full" style={{ overflow: 'visible' }} aria-hidden="true">
          <motion.g style={{ scaleX: smokeStretch, transformOrigin: '520px 50px' }}>
            <ShipSmoke />
          </motion.g>
          <Ship smoke={false} />
          <path d="M0 262 q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V300 H0Z" fill={C.teal} />
        </svg>
      </motion.div>
    </ParallaxLayer>
  )
}

function QuayLayer() {
  return (
    <ParallaxLayer speed={-0.9} className="absolute inset-0">
      <Art>
        <path d="M-200 790 H1800 V1400 H-200Z" fill={C.stoneDark} />
        <path d="M-200 780 H1800 V800 H-200Z" fill={C.stone} />
        <g fill={C.ink}>
          {[180, 520, 1080, 1420].map((x) => <path key={x} d={`M${x} 780 v-18 q0 -8 10 -8 h4 q10 0 10 8 v18z`} />)}
        </g>
        <path d="M194 760 Q350 830 534 760" stroke={C.rustDark} strokeWidth="4" fill="none" />
        <Crowd width={1600} base={784} count={46} color={C.inkSoft} seed={5} minH={52} maxH={78} waving={0.35} />
      </Art>
      <Obj viewBox="0 0 200 260" style={{ left: '2%', bottom: '12%', width: 'clamp(90px, 12vw, 200px)' }}>
        <Crane color={C.ink} />
      </Obj>
      <Obj viewBox="0 0 200 260" className="scale-x-[-1]" style={{ right: '13%', bottom: '12%', width: 'clamp(70px, 9vw, 150px)' }}>
        <Crane color={C.inkSoft} />
      </Obj>
    </ParallaxLayer>
  )
}

function ForegroundLayer() {
  return (
    <>
      <ParallaxLayer speed={-2.2} rotate={[0, -6]} className="pointer-events-none absolute inset-0">
        <Obj viewBox="0 0 300 220" style={{ left: '4%', bottom: '3%', width: 'clamp(96px, 19vw, 320px)' }}>
          <Suitcase labels={4} />
        </Obj>
      </ParallaxLayer>
      <ParallaxLayer speed={-2.8} rotate={[0, 8]} className="pointer-events-none absolute inset-0">
        <Obj viewBox="0 0 260 170" className="hidden drop-shadow-md sm:block" style={{ right: '5%', bottom: '7%', width: 'clamp(120px, 17vw, 280px)', transform: 'rotate(7deg)' }}>
          <Postcard />
        </Obj>
      </ParallaxLayer>
    </>
  )
}

/* ---------- Scene ---------- */

export function S01Puerto() {
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const all = useT()
  const t = all.hero
  const pinned = mode === 'full'
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })
  const shipScale = useTransform(p, [0, 1], pinned ? [1, 0.62] : [1, 1])
  const smokeStretch = useTransform(p, [0, 1], pinned ? [1, 1.8] : [1, 1])
  const textY = useTransform(p, [0, 0.6], pinned ? [0, -120] : [0, 0])
  const textO = useTransform(p, [0, 0.55], pinned ? [1, 0] : [1, 1])

  return (
    <SceneCtxProvider sectionRef={ref} pinned={pinned}>
      <section
        id="inicio"
        ref={ref}
        data-scene="inicio"
        data-bg={C.fog}
        aria-labelledby="inicio-title"
        className="scene relative"
        style={{ height: pinned ? '200vh' : undefined, background: `linear-gradient(${C.fogLight}, ${C.fog} 60%)` }}
      >
        <div className={`${pinned ? 'sticky top-0' : 'relative'} h-[100svh] min-h-[600px] w-full overflow-hidden`}>
          <div role="img" aria-label={all.ui.art.hero} className="absolute inset-0">
            <SkyLayer />
            <GullsLayer />
            <CoastLayer />
            <SeaLayer />
            <ShipLayer shipScale={shipScale} smokeStretch={smokeStretch} />
            <QuayLayer />
            <ForegroundLayer />
          </div>
          <motion.div style={{ y: textY, opacity: textO }} className="relative z-20 mx-auto flex max-w-6xl flex-col items-center px-5 pt-[12vh] text-center sm:pt-[9vh]">
            <p className="font-type text-sm uppercase tracking-[0.35em] text-stamp">{t.kicker}</p>
            <h1 id="inicio-title" className="mt-3 font-display text-[clamp(2.3rem,5.4vw,5.4rem)] font-bold leading-[1.02] text-ink">
              {t.title}
            </h1>
            <p className="mt-2 font-display text-[clamp(1.3rem,2.8vw,2.4rem)] italic text-ocean" lang="gl">{t.motto}</p>
            <p className="mt-4 max-w-xl text-[clamp(1rem,1.4vw,1.2rem)] text-ink/85">{t.lead}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a href="#apoya" onClick={(e) => { e.preventDefault(); scrollToId('apoya') }} className="btn-stamp">{t.cta2}</a>
            </div>
          </motion.div>
          <a
            href="#gaxate"
            onClick={(e) => { e.preventDefault(); scrollToId('gaxate') }}
            className="absolute bottom-[3vh] left-1/2 z-30 flex -translate-x-1/2 flex-col items-center rounded-full bg-paper/85 px-4 py-2 font-type text-sm text-ink shadow-sm backdrop-blur-sm"
          >
            <span>{t.cta} ↓</span>
            <span className="anchor-sway mt-1" aria-hidden="true">
              <svg viewBox="0 0 24 28" className="h-6 w-6" fill="none" stroke={C.ink} strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="4" r="3" /><path d="M12 7v18M6 12h12M3 18q2 7 9 7t9-7" />
              </svg>
            </span>
          </a>
        </div>
      </section>
    </SceneCtxProvider>
  )
}
