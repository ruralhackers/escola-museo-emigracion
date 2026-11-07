import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { C, smoothPath } from '../art/palette'
import { RadioGuide } from '../art/Objects'
import { Hill, Cloud } from '../art/Nature'
import { Art, ParallaxLayer, Reveal, SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { scrollToId } from '../lib/scroll'
import { useT } from '../lib/i18n'

const HOUSES: [number, number][] = [[150, 420], [260, 300], [420, 250], [560, 330], [700, 220], [820, 340]]
const PATH = smoothPath([[60, 500], ...HOUSES, [930, 440]], false, 0.5)

function VillageMap({ draw }: { draw: any }) {
  const u = useT().ui
  return (
    <svg viewBox="0 0 1000 600" className="block w-full" role="img" aria-label={u.art.rutaMap}>
      <rect width="1000" height="600" fill={C.paper} />
      <g opacity=".9">
        <path d="M0 0 H1000 V600 H0Z" fill={C.mossLight} opacity=".35" />
        {[[80, 120, 90], [880, 120, 110], [500, 520, 140], [940, 560, 80], [60, 300, 60]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={C.moss} opacity=".35" />)}
      </g>
      {/* fields */}
      <g stroke={C.moss} strokeWidth="1.5" opacity=".5">
        {Array.from({ length: 10 }).map((_, i) => <line key={i} x1={600 + i * 12} y1="440" x2={640 + i * 12} y2="560" />)}
        {Array.from({ length: 8 }).map((_, i) => <line key={`b${i}`} x1={120 + i * 14} y1="80" x2={160 + i * 14} y2="180" />)}
      </g>
      {/* river */}
      <path d="M0 560 C200 520 300 590 500 560 S800 500 1000 540" stroke={C.teal} strokeWidth="14" fill="none" opacity=".7" />
      {/* road */}
      <path d={PATH} stroke={C.paperDark} strokeWidth="26" fill="none" strokeLinecap="round" />
      <path d={PATH} stroke={C.ink} strokeOpacity=".2" strokeWidth="3" strokeDasharray="2 10" fill="none" />
      <motion.path d={PATH} stroke={C.stamp} strokeWidth="4" strokeDasharray="2 10" strokeLinecap="round" fill="none" style={{ pathLength: draw }} />
      {/* trees */}
      <g>
        {[[330, 170], [360, 200], [610, 210], [760, 420], [200, 520], [880, 260], [480, 380], [100, 220]].map(([x, y], i) => (
          <g key={i}><circle cx={x} cy={y} r="18" fill={C.mossDark} /><circle cx={x - 5} cy={y - 5} r="8" fill={C.moss} /></g>
        ))}
      </g>
      {/* numbered indiano houses (top view: hipped roof + white gallery) */}
      {HOUSES.map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y - 52})`}>
          <rect x="-34" y="-22" width="68" height="44" fill={C.roof} />
          <path d="M-34 -22 L-14 0 H14 L34 -22 M-34 22 L-14 0 M14 0 L34 22" stroke={C.rustDark} strokeWidth="2" fill="none" />
          <rect x="-34" y="22" width="68" height="8" fill={C.white} stroke={C.ink} strokeWidth="1" />
          {i % 2 === 0 && <rect x="22" y="-36" width="18" height="18" fill={C.roof} stroke={C.rustDark} strokeWidth="2" />}
          <circle cx="-42" cy="-30" r="15" fill={C.stamp} stroke={C.white} strokeWidth="3" />
          <text x="-42" y="-25" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="15" fill={C.white}>{i + 1}</text>
        </g>
      ))}
      <g transform="translate(940 60)">
        <circle r="30" fill={C.white} stroke={C.ink} strokeWidth="2" />
        <path d="M0 -24 L6 0 L0 24 L-6 0Z" fill={C.ink} /><path d="M0 -24 L6 0 H-6Z" fill={C.stamp} />
        <text y="-34" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="14" fill={C.ink}>N</text>
      </g>
      <text x="40" y="50" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="34" fill={C.ink}>Gaxate</text>
      <text x="40" y="76" fontFamily="Special Elite, monospace" fontSize="14" fill={C.ink} opacity=".7">{u.ruta.parish}</text>
    </svg>
  )
}

function Radio() {
  return (
    <svg viewBox="-20 -20 200 140" className="block w-full" aria-hidden="true">
      <RadioGuide />
      <g stroke={C.stamp} strokeWidth="4" fill="none" strokeLinecap="round">
        {[0, 1, 2].map((i) => (
          <path key={i} className="soundwave" style={{ animationDelay: `${i * 0.5}s` }} d={`M${104 + i * 16} ${30 - i * 10} Q${120 + i * 22} 52 ${104 + i * 16} ${76 + i * 10}`} />
        ))}
      </g>
    </svg>
  )
}

export function S09Ruta() {
  const all = useT()
  const t = all.ruta
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'center 45%'] })
  const draw = useTransform(scrollYProgress, [0, 1], mode === 'reduced' ? [1, 1] : [0, 1])
  return (
    <SceneCtxProvider sectionRef={ref} pinned={false}>
      <section id="ruta" ref={ref} data-scene="ruta" data-bg={C.mossLight} aria-labelledby="ruta-title" className="scene relative overflow-hidden py-24 sm:py-32" style={{ background: `linear-gradient(${C.paper}, ${C.mossLight} 70%, ${C.moss})` }}>
        <div className="absolute inset-0" aria-hidden="true">
          <ParallaxLayer speed={0.3} drift={-140} className="absolute -inset-x-[10%] inset-y-0">
            <Art>
              <g transform="translate(100 90) scale(.8)"><Cloud opacity={0.7} /></g>
              <g transform="translate(1200 150) scale(.6)"><Cloud opacity={0.6} /></g>
            </Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.8} className="absolute inset-0">
            <Art>
              <Hill width={1600} base={820} amp={90} seed={91} fill={C.moss} n={6} />
              <Hill width={1600} base={880} amp={50} seed={92} fill={C.mossDark} n={8} />
            </Art>
          </ParallaxLayer>
        </div>
        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <div className="relative rotate-[-1deg] border-[6px] border-white shadow-[10px_12px_0_rgba(30,27,24,.18)]">
              <VillageMap draw={draw} />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <Kicker n={9}>{all.ui.kickers.ruta}</Kicker>
              <h2 id="ruta-title" className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-bold leading-tight">{t.title}</h2>
              <p className="mt-4">{t.text}</p>
            </Reveal>
            <Reveal delay={0.15} className="mt-6 flex items-center gap-5">
              <div className="w-28 flex-none sm:w-36"><Radio /></div>
              <a href="#apoya" onClick={(e) => { e.preventDefault(); scrollToId('apoya') }} className="btn-stamp">{t.cta} →</a>
            </Reveal>
          </div>
        </div>
      </section>
    </SceneCtxProvider>
  )
}
