import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, type MotionValue } from 'framer-motion'
import { C, smoothPath } from '../art/palette'
import { SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useSceneProgress } from '../lib/useSceneProgress'
import { useT } from '../lib/i18n'

type Rect = [number, number, number, number]
type Pt = [number, number]

const VB = { w: 1000, h: 740 }

// Illustrated plan matched to the project drawing: irregular plot, slanted left wall,
// road along the bottom, reception at the bottom right, panels on the bottom and left walls.
const ROOMS: Record<string, { r: Rect; fill: string; dash?: boolean }> = {
  recepcion: { r: [788, 524, 168, 72], fill: C.tropicLight },
  paneles: { r: [145, 498, 270, 92], fill: C.paperDark },
  baja: { r: [258, 128, 142, 96], fill: C.fogLight },
  alta: { r: [400, 128, 152, 96], fill: C.fog, dash: true },
  sala: { r: [258, 224, 294, 158], fill: C.paper },
  aseo: { r: [258, 382, 96, 74], fill: C.fogLight },
  tienda: { r: [354, 382, 198, 74], fill: C.tropicLight },
  patio: { r: [518, 122, 214, 248], fill: C.mossLight },
  cafeteria: { r: [518, 382, 168, 88], fill: C.paperDark },
  vivienda: { r: [748, 118, 188, 248], fill: C.tropic },
}

// Visit order follows the arrows: entrance, west along the bottom, up the left wall,
// across the top, then down into the buildings.
const ROUTE_PTS: Pt[] = [
  [872, 560],
  [700, 548],
  [480, 542],
  [280, 540],
  [155, 455],
  [185, 280],
  [230, 130],
  [340, 96],
  [329, 176],
  [476, 176],
  [405, 303],
  [306, 419],
  [453, 419],
  [625, 246],
  [602, 426],
  [842, 242],
]
const VISIT: { id: string; i: number }[] = [
  { id: 'recepcion', i: 0 },
  { id: 'paneles', i: 3 },
  { id: 'baja', i: 8 },
  { id: 'alta', i: 9 },
  { id: 'sala', i: 10 },
  { id: 'aseo', i: 11 },
  { id: 'tienda', i: 12 },
  { id: 'patio', i: 13 },
  { id: 'cafeteria', i: 14 },
  { id: 'vivienda', i: 15 },
]
const ROUTE = smoothPath(ROUTE_PTS, false, 0.35)

function roomAt(v: number) {
  const idx = Math.round(Math.max(0, Math.min(1, v)) * (ROUTE_PTS.length - 1))
  let id = VISIT[0].id
  for (const step of VISIT) if (step.i <= idx) id = step.id
  return id
}

function panelsAlong(a: Pt, b: Pt, n: number, inset: number) {
  const dx = b[0] - a[0], dy = b[1] - a[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L, uy = dy / L
  const nx = uy, ny = -ux
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.6) / (n + 0.3)
    return { x: a[0] + dx * t + nx * inset, y: a[1] + dy * t + ny * inset, ang }
  })
}

function PlanArt({ active }: { active: string }) {
  const u = useT().ui
  const leftPanels = panelsAlong([236, 118], [78, 612], 8, 26)
  const bottomPanels = panelsAlong([110, 628], [760, 586], 8, 24)
  return (
    <g>
      <path d="M248 108 L952 86 L974 560 L58 632 Z" fill={C.mossLight} opacity=".55" />
      {/* lower floor plate, hatched like the project plan */}
      <path d="M258 382 H936 V548 L168 590 Z" fill="url(#plan-hatch)" />
      <path d="M248 108 L58 632 L748 584" fill="none" stroke={C.stoneDark} strokeWidth="16" strokeLinejoin="round" strokeLinecap="butt" />
      <path d="M868 576 L974 560 L952 86 L248 108" fill="none" stroke={C.stoneDark} strokeWidth="16" strokeLinejoin="round" strokeLinecap="butt" />
      <g fill={C.stone}>{Array.from({ length: 28 }).map((_, i) => <rect key={i} x={250 + i * 24} y="74" width="16" height="12" rx="2" />)}</g>
      {/* building mass on the right, under and beside the lodging */}
      <path d="M748 382 H936 V530 L686 548 V470 H748 Z" fill={C.paperDark} stroke={C.ink} strokeWidth="4" />
      <path d="M836 382 V530 M748 456 H836" fill="none" stroke={C.ink} strokeWidth="3" />
      {/* exhibition panels along the slanted left wall and the bottom wall */}
      <g fill={C.ocean}>
        {[...leftPanels, ...bottomPanels].map((p, i) => (
          <rect key={i} x={-15} y={-5} width="30" height="10" transform={`translate(${p.x} ${p.y}) rotate(${p.ang})`} />
        ))}
      </g>
      {Object.entries(ROOMS).map(([id, { r, fill, dash }]) => (
        <g key={id}>
          {id !== 'paneles' && <rect x={r[0]} y={r[1]} width={r[2]} height={r[3]} fill={fill} stroke={C.ink} strokeWidth={dash ? 3 : 5} strokeDasharray={dash ? '10 7' : undefined} />}
          {active === id && <rect className="pulse-soft" x={r[0] + 6} y={r[1] + 6} width={r[2] - 12} height={r[3] - 12} fill="none" stroke={C.stamp} strokeWidth="6" />}
        </g>
      ))}
      {/* screen and shelves in the archives; stairs up to the dashed upper floor */}
      <rect x="286" y="150" width="86" height="48" fill={C.ink} />
      <g fill={C.paper}>{[292, 312, 332, 352].map((x) => <rect key={x} x={x} y="206" width="12" height="12" rx="2" />)}</g>
      <g fill={C.rust} opacity=".8">{[418, 446, 474, 502].map((x) => <rect key={x} x={x} y="148" width="8" height="58" />)}</g>
      <g stroke={C.ink} strokeWidth="2">{Array.from({ length: 5 }).map((_, i) => <line key={i} x1="388" y1={146 + i * 8} x2="408" y2={146 + i * 8} />)}</g>
      {/* rows of seats in the main hall */}
      <g fill={C.rust} opacity=".7">{[280, 340, 400, 460].map((x) => <rect key={x} x={x} y="268" width="42" height="8" />)}{[280, 340, 400, 460].map((x) => <rect key={`b${x}`} x={x} y="340" width="42" height="8" />)}</g>
      {/* marquee in the courtyard */}
      <g transform="translate(625 246)">
        <polygon points="0,-78 55,-55 78,0 55,55 0,78 -55,55 -78,0 -55,-55" fill={C.white} stroke={C.ink} strokeWidth="3" />
        <g stroke={C.stamp} strokeWidth="2">{[0, 45, 90, 135].map((a) => <line key={a} x1={-78 * Math.cos((a * Math.PI) / 180)} y1={-78 * Math.sin((a * Math.PI) / 180)} x2={78 * Math.cos((a * Math.PI) / 180)} y2={78 * Math.sin((a * Math.PI) / 180)} />)}</g>
        <circle r="7" fill={C.stamp} />
      </g>
      <g fill={C.white} stroke={C.ink} strokeWidth="2">{[[560, 418], [640, 430], [575, 448]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="12" />)}</g>
      <g fill={C.moss}>{[[200, 400], [700, 200], [900, 340]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="12" />)}</g>
      <path d={ROUTE} fill="none" stroke={C.stamp} strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      {ROUTE_PTS.slice(0, -1).map((a, i) => {
        const b = ROUTE_PTS[i + 1]
        const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
        const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
        return <path key={i} d="M-9 -8 L7 0 L-9 8" transform={`translate(${mx} ${my}) rotate(${ang})`} fill="none" stroke={C.stamp} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      })}
      <g transform="translate(818 600)" stroke={C.stamp} strokeWidth="4" strokeLinecap="round">
        <line x1="-12" y1="0" x2="12" y2="0" /><line x1="0" y1="-12" x2="0" y2="12" />
      </g>
      <text x="860" y="632" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="13" fill={C.ink}>{u.casa.entrance}</text>
      <text x="476" y="214" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="11" fill={C.ink}>{u.casa.upperFloor}</text>
      <text x="600" y="68" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="13" fill={C.inkSoft}>{u.casa.wall}</text>
      <text x="990" y="340" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="13" fill={C.inkSoft} transform="rotate(90 990 340)">{u.casa.wall}</text>
      <text fontFamily="Special Elite, monospace" fontSize="13" fill={C.inkSoft} transform="translate(118 390) rotate(-72)">{u.casa.wall}</text>
      <path id="plan-road" d="M30 700 L980 648" fill="none" />
      <text fontFamily="Special Elite, monospace" fontSize="16" fill={C.ink} letterSpacing="8">
        <textPath href="#plan-road" startOffset="18%">{u.casa.road}</textPath>
      </text>
      <path d="M24 688 L990 632" fill="none" stroke={C.ink} strokeWidth="2.5" />
      <path d="M24 706 L990 650" fill="none" stroke={C.ink} strokeWidth="1" opacity=".35" />
    </g>
  )
}

function Walker({ p, pathRef }: { p: MotionValue<number>; pathRef: React.RefObject<SVGPathElement | null> }) {
  const [pos, setPos] = useState<[number, number]>(ROUTE_PTS[0])
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
    <div className="relative aspect-[1000/740] w-full overflow-hidden border-[6px] border-white bg-paper shadow-[10px_12px_0_rgba(30,27,24,.15)]">
      <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="absolute inset-0 h-full w-full" role="img" aria-label={all.ui.art.casaPlan}>
        <defs>
          <pattern id="plan-hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={C.rust} strokeOpacity="0.35" strokeWidth="2" />
          </pattern>
        </defs>
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
            style={{ left: `${(r[0] / VB.w) * 100}%`, top: `${(r[1] / VB.h) * 100}%`, width: `${(r[2] / VB.w) * 100}%`, height: `${(r[3] / VB.h) * 100}%` }}
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
  const [active, setActive] = useState(VISIT[0].id)
  const [picked, setPicked] = useState<string | null>(null)
  useMotionValueEvent(p, 'change', (v) => {
    if (!full) return
    const id = roomAt(v)
    if (id !== active) { setActive(id); setPicked(null) }
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
                <div className="mx-auto w-full" style={{ maxWidth: 'calc((100svh - 140px) * 1000 / 740)' }}>
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
      </section>
    </SceneCtxProvider>
  )
}
