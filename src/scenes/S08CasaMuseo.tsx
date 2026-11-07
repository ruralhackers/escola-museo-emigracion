import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { C, smoothPath } from '../art/palette'
import { Reveal, SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useSceneProgress } from '../lib/useSceneProgress'
import { useT } from '../lib/i18n'

type Rect = [number, number, number, number]

// plan geometry (viewBox 1000×700) — illustrative layout of the spaces listed in the project
const ROOMS: Record<string, { r: Rect; fill: string; way: [number, number] }> = {
  recepcion: { r: [60, 560, 200, 90], fill: C.tropicLight, way: [160, 605] },
  paneles: { r: [36, 410, 34, 140], fill: C.paperDark, way: [92, 470] },
  sala: { r: [60, 90, 270, 310], fill: C.paper, way: [195, 245] },
  tienda: { r: [330, 260, 190, 140], fill: C.tropicLight, way: [425, 330] },
  baja: { r: [330, 90, 190, 170], fill: C.fogLight, way: [425, 175] },
  alta: { r: [570, 56, 370, 170], fill: C.fog, way: [755, 140] },
  patio: { r: [570, 262, 370, 260], fill: C.mossLight, way: [755, 392] },
  cafeteria: { r: [300, 460, 220, 190], fill: C.paperDark, way: [410, 555] },
  vivienda: { r: [570, 560, 230, 90], fill: C.paper, way: [685, 605] },
  aseo: { r: [820, 560, 120, 90], fill: C.fogLight, way: [880, 605] },
}
const ORDER = Object.keys(ROOMS) // same order as the spaces in the content files
const ROUTE_PTS: [number, number][] = [[170, 700], ...ORDER.map((id) => ROOMS[id].way)]
const ROUTE = smoothPath(ROUTE_PTS, false, 0.4)

function PlanArt({ active }: { active: string }) {
  const u = useT().ui
  return (
    <g>
      {/* ground & perimeter wall */}
      <rect x="0" y="0" width="1000" height="700" fill={C.mossLight} opacity=".45" />
      <path d="M120 670 H30 V30 H970 V670 H220" fill="none" stroke={C.stoneDark} strokeWidth="14" strokeLinejoin="round" />
      <g fill={C.stone}>{Array.from({ length: 40 }).map((_, i) => <rect key={i} x={30 + i * 24} y="24" width="16" height="12" rx="2" />)}</g>
      {/* exhibition panels along the wall */}
      <g fill={C.ocean}>
        {Array.from({ length: 4 }).map((_, i) => <rect key={`l${i}`} x="40" y={420 + i * 34} width="10" height="26" />)}
        {Array.from({ length: 7 }).map((_, i) => <rect key={`t${i}`} x={80 + i * 64} y="42" width="44" height="10" />)}
        {Array.from({ length: 5 }).map((_, i) => <rect key={`r${i}`} x="950" y={260 + i * 52} width="10" height="36" />)}
      </g>
      {/* rooms */}
      {Object.entries(ROOMS).map(([id, { r, fill }]) => (
        <g key={id}>
          <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={fill} stroke={C.ink} strokeWidth={id === 'alta' ? 3 : 5} strokeDasharray={id === 'alta' ? '12 8' : undefined} />
          {active === id && <rect className="pulse-soft" x={r[0] + 6} y={r[1] + 6} width={r[2] - 12} height={r[3] - 12} fill="none" stroke={C.stamp} strokeWidth="6" />}
        </g>
      ))}
      {/* school building roof hatch & stairs to the upper floor */}
      <path d="M330 90 V400" stroke={C.ink} strokeWidth="5" />
      <g stroke={C.ink} strokeWidth="2">{Array.from({ length: 6 }).map((_, i) => <line key={i} x1={490} y1={110 + i * 10} x2={515} y2={110 + i * 10} />)}</g>
      <path d="M515 100 C560 90 560 120 570 120" stroke={C.ink} strokeWidth="2" strokeDasharray="5 5" fill="none" />
      {/* furniture hints */}
      <g fill={C.rust} opacity=".75">
        {[100, 160, 220, 280].map((x) => <rect key={x} x={x} y="140" width="30" height="8" />)}
        {[100, 160, 220, 280].map((x) => <rect key={`b${x}`} x={x} y="350" width="30" height="8" />)}
        <rect x="350" y="290" width="150" height="10" /><rect x="350" y="360" width="150" height="10" />
        {[600, 650, 700, 750, 800, 850, 900].map((x) => <rect key={`a${x}`} x={x} y="76" width="10" height="120" />)}
      </g>
      <rect x="360" y="110" width="130" height="60" fill={C.ink} />
      <g fill={C.paper}>{[370, 395, 420, 445, 470].map((x) => <rect key={x} x={x} y="190" width="14" height="14" rx="3" />)}</g>
      {/* tent in the patio */}
      <g transform="translate(755 392)">
        <polygon points="0,-100 71,-71 100,0 71,71 0,100 -71,71 -100,0 -71,-71" fill={C.white} stroke={C.ink} strokeWidth="3" />
        <g stroke={C.stamp} strokeWidth="2">{[0, 45, 90, 135].map((a) => <line key={a} x1={-100 * Math.cos((a * Math.PI) / 180)} y1={-100 * Math.sin((a * Math.PI) / 180)} x2={100 * Math.cos((a * Math.PI) / 180)} y2={100 * Math.sin((a * Math.PI) / 180)} />)}</g>
        <circle r="8" fill={C.stamp} />
      </g>
      {/* café tables */}
      <g fill={C.white} stroke={C.ink} strokeWidth="2">{[[350, 520], [430, 510], [370, 600], [460, 600]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="18" />)}</g>
      {/* trees in the garden */}
      <g fill={C.moss}>{[[545, 245], [545, 540], [960, 540], [280, 440]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="14" />)}</g>
      {/* route with arrows */}
      <path d={ROUTE} fill="none" stroke={C.stamp} strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      {ROUTE_PTS.slice(0, -1).map((a, i) => {
        const b = ROUTE_PTS[i + 1]
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
        const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
        return <path key={i} d="M-9 -8 L7 0 L-9 8" transform={`translate(${mx} ${my}) rotate(${ang})`} fill="none" stroke={C.stamp} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      })}
      <text x="170" y="694" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="16" fill={C.ink}>{u.casa.entrance}</text>
      <text x="930" y="250" textAnchor="end" fontFamily="Special Elite, monospace" fontSize="14" fill={C.ink}>{u.casa.upperFloor}</text>
    </g>
  )
}

function Walker({ p, pathRef }: { p: MotionValue<number>; pathRef: React.RefObject<SVGPathElement | null> }) {
  const [pos, setPos] = useState<[number, number]>([170, 700])
  const update = (v: number) => {
    const el = pathRef.current
    if (!el) return
    const L = el.getTotalLength()
    const pt = el.getPointAtLength(Math.max(0, Math.min(1, v)) * L)
    setPos([pt.x, pt.y])
  }
  useMotionValueEvent(p, 'change', update)
  useEffect(() => update(p.get()), []) // eslint-disable-line
  return (
    <g transform={`translate(${pos[0]} ${pos[1]})`}>
      <ellipse cx="0" cy="18" rx="20" ry="6" fill={C.ink} opacity=".2" />
      <circle r="18" fill={C.inkSoft} />
      <path d="M-14 -6 Q0 -22 14 -6Z" fill={C.ink} />
      <rect x="10" y="4" width="20" height="14" rx="2" fill={C.rust} />
      <rect x="10" y="9" width="20" height="2.5" fill={C.brass} />
    </g>
  )
}

function Plan({ p, active, onPick, picked }: { p: MotionValue<number>; active: string; onPick: (id: string) => void; picked: string | null }) {
  const pathRef = useRef<SVGPathElement>(null)
  const all = useT()
  const t = all.casa
  const shown = picked ?? active
  return (
    <div className="relative aspect-[1000/700] w-full overflow-hidden border-[6px] border-white bg-paper shadow-[10px_12px_0_rgba(30,27,24,.15)]">
      <svg viewBox="0 0 1000 700" className="absolute inset-0 h-full w-full" role="img" aria-label={all.ui.art.casaPlan}>
        <PlanArt active={shown} />
        <path ref={pathRef} d={ROUTE} fill="none" stroke="none" />
        <Walker p={p} pathRef={pathRef} />
      </svg>
      {t.spaces.map((s) => {
        const r = ROOMS[s.id].r
        const on = shown === s.id
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            aria-pressed={on}
            aria-controls="ficha-casa"
            aria-label={`${s.n}. ${s.title}`}
            className={`absolute grid place-items-start p-1 text-left transition-colors ${on ? 'bg-stamp/10' : 'hover:bg-ink/5'}`}
            style={{ left: `${(r[0] / 1000) * 100}%`, top: `${(r[1] / 700) * 100}%`, width: `${(r[2] / 1000) * 100}%`, height: `${(r[3] / 700) * 100}%` }}
          >
            <span className={`grid h-6 w-6 place-items-center rounded-full font-type text-xs sm:h-7 sm:w-7 ${on ? 'bg-stamp text-white' : 'bg-ink text-paper'}`}>{s.n}</span>
          </button>
        )
      })}
    </div>
  )
}

function Ficha({ id }: { id: string }) {
  const all = useT()
  const t = all.casa
  const s = t.spaces.find((x) => x.id === id) ?? t.spaces[0]
  return (
    <div id="ficha-casa" aria-live="polite" className="relative min-h-[220px]">
      <AnimatePresence mode="wait">
        <motion.article
          key={s.id}
          initial={{ opacity: 0, y: 16, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="relative border border-ocean/30 bg-[#FBF6EA] p-6 shadow-[6px_8px_0_rgba(30,27,24,.14)]"
        >
          <p className="flex justify-between font-type text-xs uppercase tracking-[0.2em] text-ocean"><span>{all.ui.casa.fileCard}</span><span>{String(s.n).padStart(2, '0')} / {t.spaces.length}</span></p>
          <h3 className="mt-3 font-display text-2xl font-bold leading-snug">{s.title}</h3>
          <p className="mt-3">{s.text}</p>
        </motion.article>
      </AnimatePresence>
    </div>
  )
}

export function S08CasaMuseo() {
  const ref = useRef<HTMLDivElement>(null)
  const { mode } = useMotionMode()
  const full = mode === 'full'
  const p = useSceneProgress(ref as any, { offset: full ? ['start start', 'end end'] : undefined, duration: 6 })
  const [active, setActive] = useState(ORDER[0])
  const [picked, setPicked] = useState<string | null>(null)
  useMotionValueEvent(p, 'change', (v) => {
    if (!full) return
    const i = Math.min(ORDER.length - 1, Math.max(0, Math.round(v * (ROUTE_PTS.length - 1)) - 1))
    if (ORDER[i] !== active) { setActive(ORDER[i]); setPicked(null) }
  })
  const all = useT()
  const t = all.casa
  const header = useMemo(() => (
    <>
      <Kicker n={8}>{all.ui.kickers.casa}</Kicker>
      <h2 id="casa-title" className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-bold leading-tight">{t.title}</h2>
      <p className="mt-2 text-ink/85">{t.lead}</p>
    </>
  ), [all, t])

  return (
    <SceneCtxProvider sectionRef={ref as any} pinned={full}>
      <section id="casa-museo" data-scene="casa-museo" data-bg={C.fogLight} aria-labelledby="casa-title" className="scene relative" style={{ background: `linear-gradient(${C.fogLight}, ${C.paper})` }}>
        <div ref={ref} style={{ height: full ? '280vh' : undefined }}>
          {full ? (
            <div className="sticky top-0 flex h-[100svh] min-h-[640px] items-center overflow-hidden px-[5vw] pt-16">
              <div className="grid w-full grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] items-center gap-[4vw]">
                <div className="mx-auto w-full" style={{ maxWidth: 'calc((100svh - 140px) * 1000 / 700)' }}>
                  <Plan p={p} active={active} picked={picked} onPick={setPicked} />
                </div>
                <div>
                  {header}
                  <div className="mt-6"><Ficha id={picked ?? active} /></div>
                  <ol className="mt-5 flex flex-wrap gap-1.5" aria-label={all.ui.casa.spacesLabel}>
                    {t.spaces.map((s) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => setPicked(s.id)} className={`rounded-full border px-2.5 py-0.5 font-type text-[11px] ${(picked ?? active) === s.id ? 'border-stamp bg-stamp text-white' : 'border-ink/30 hover:border-ink'}`}>{s.n}. {s.title.split(':')[0].split(' / ')[0]}</button>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-4 pb-6 pt-16 sm:px-8">
              <div className="mx-auto max-w-2xl">{header}</div>
              <div className="mx-auto mt-6 max-w-3xl"><Plan p={p} active={active} picked={picked} onPick={setPicked} /></div>
              <div className="mx-auto mt-6 max-w-2xl"><Ficha id={picked ?? active} /></div>
            </div>
          )}
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-8">
          <Reveal><h3 className="text-center font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-bold">{t.sectionsTitle}</h3></Reveal>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.sections.map((s, i) => (
              <Reveal as="li" key={s.title} delay={(i % 3) * 0.1}>
                <article className="h-full border-t-4 border-stamp bg-white/60 p-6">
                  <h4 className="font-display text-xl font-bold leading-snug">{s.title}</h4>
                  {s.text && <p className="mt-2 text-[0.98rem] text-ink/85">{s.text}</p>}
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </SceneCtxProvider>
  )
}
