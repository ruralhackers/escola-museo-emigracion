import { C, rng } from './palette'

/** Young emigrant seen from behind, suitcase in right hand. 120×300 box, feet at y=300. */
export function Emigrant({ coat = C.inkSoft, walking = false }: { coat?: string; walking?: boolean }) {
  return (
    <g className={walking ? 'walk' : undefined}>
      <ellipse cx="60" cy="298" rx="46" ry="5" fill={C.ink} opacity=".18" />
      {/* legs */}
      <path d="M38 190 L34 292 H50 L58 196 Z" fill={C.oceanDeep} />
      <path d="M62 196 L70 292 H86 L82 190 Z" fill={C.oceanDeep} />
      <rect x="30" y="288" width="22" height="9" rx="3" fill={C.ink} />
      <rect x="68" y="288" width="22" height="9" rx="3" fill={C.ink} />
      {/* coat */}
      <path d="M30 96 Q60 82 90 96 L96 206 Q60 214 24 206 Z" fill={coat} />
      <path d="M60 92 V208" stroke={C.ink} strokeWidth="1.5" opacity=".35" />
      {/* left arm */}
      <path d="M30 100 Q18 140 22 190 L32 190 Q32 146 40 110 Z" fill={coat} />
      <circle cx="27" cy="194" r="6" fill={C.brass} />
      {/* right arm holding suitcase */}
      <path d="M88 100 Q102 140 100 196 L90 196 Q90 150 80 110 Z" fill={coat} />
      <circle cx="95" cy="200" r="6" fill={C.brass} />
      <g transform="translate(66 196) scale(0.3)">
        <path d="M118 44 Q118 12 150 12 Q182 12 182 44" fill="none" stroke={C.rustDark} strokeWidth="14" />
        <rect x="10" y="40" width="280" height="170" rx="14" fill={C.rust} />
        <rect x="10" y="84" width="280" height="10" fill={C.rustDark} />
        <rect x="66" y="40" width="22" height="170" fill={C.rustDark} />
        <rect x="212" y="40" width="22" height="170" fill={C.rustDark} />
        <circle cx="150" cy="150" r="26" fill={C.paper} />
      </g>
      {/* neck + head */}
      <rect x="52" y="76" width="16" height="16" fill={C.brass} />
      <ellipse cx="60" cy="62" rx="20" ry="22" fill="#2B231D" />
      {/* cap */}
      <path d="M36 54 Q38 32 60 32 Q84 32 86 52 Q60 46 36 54 Z" fill={C.ocean} />
      <rect x="57" y="28" width="6" height="5" rx="2" fill={C.ocean} />
      {/* ears */}
      <ellipse cx="40" cy="66" rx="4" ry="6" fill={C.brass} />
      <ellipse cx="80" cy="66" rx="4" ry="6" fill={C.brass} />
    </g>
  )
}

type PersonOpts = { x: number; base: number; h: number; color: string; kind: number; wave?: boolean; hand?: string }

/** Simple flat silhouette person (front-ish), used for crowds. */
export function Person({ x, base, h, color, kind, wave, hand = C.white }: PersonOpts) {
  const s = h / 100
  return (
    <g transform={`translate(${x} ${base - h}) scale(${s})`}>
      <path d="M-16 34 Q0 26 16 34 L20 100 H-20 Z" fill={color} />
      {kind % 3 === 1 && <path d="M-20 70 Q0 64 20 70 L26 100 H-26Z" fill={color} />}
      <circle cx="0" cy="18" r="11" fill={color} />
      {kind % 3 === 0 && <path d="M-15 12 Q0 -4 15 12 Q18 14 21 14 H-21 Q-18 14 -15 12Z" fill={color} />}
      {kind % 3 === 1 && <path d="M-13 20 Q-14 2 0 3 Q14 2 13 20 L10 30 H-10Z" fill={color} />}
      {wave && (
        <g className="wave-arm" style={{ transformOrigin: `${-14}px 38px` }}>
          <path d="M-14 38 L-26 6" stroke={color} strokeWidth="7" strokeLinecap="round" />
          <path d="M-27 6 L-42 -6 L-24 -12 Z" fill={hand} className="hanky" />
        </g>
      )}
    </g>
  )
}

/** A row of people on the quay. */
export function Crowd({ width = 1600, base = 0, count = 40, color = C.ink, seed = 3, minH = 60, maxH = 90, waving = 0.3 }: { width?: number; base?: number; count?: number; color?: string; seed?: number; minH?: number; maxH?: number; waving?: number }) {
  const r = rng(seed)
  const people = Array.from({ length: count }).map((_, i) => {
    const x = (i / count) * width + r() * (width / count) * 0.8
    return { x, h: minH + r() * (maxH - minH), kind: Math.floor(r() * 3), wave: r() < waving }
  })
  return (
    <g>
      {people.map((p, i) => (
        <Person key={i} x={p.x} base={base} h={p.h} color={color} kind={p.kind} wave={p.wave} />
      ))}
    </g>
  )
}

/** Neighbour carrying a stone or a wooden beam (school construction, 1934). 100×180 */
export function Neighbour({ load = 'stone', color = C.inkSoft, flip = false }: { load?: 'stone' | 'wood' | 'basket'; color?: string; flip?: boolean }) {
  return (
    <g transform={flip ? 'translate(100 0) scale(-1 1)' : undefined}>
      <path d="M36 112 L30 178 H42 L50 116 Z" fill={color} />
      <path d="M56 116 L64 178 H76 L70 112 Z" fill={color} />
      <path d="M30 60 Q52 48 72 62 L76 120 H28 Z" fill={color} />
      <circle cx="58" cy="40" r="13" fill={color} />
      <path d="M44 34 Q58 22 72 34 Q76 36 80 36 H40Z" fill={color} />
      {load === 'stone' && (
        <g>
          <path d="M30 64 Q24 42 46 30 L58 30" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M14 30 Q12 10 36 8 Q56 6 60 22 Q62 36 40 38 Q18 40 14 30Z" fill={C.stone} />
          <path d="M22 22 q8 -6 18 -2" stroke={C.stoneDark} strokeWidth="2" fill="none" />
        </g>
      )}
      {load === 'wood' && (
        <g>
          <rect x="-30" y="44" width="170" height="11" rx="3" transform="rotate(-8 50 50)" fill={C.rust} />
          <path d="M70 66 Q84 54 80 44" stroke={color} strokeWidth="9" strokeLinecap="round" fill="none" />
        </g>
      )}
      {load === 'basket' && (
        <g>
          <path d="M40 0 h40 l-6 22 h-28z" fill={C.rust} />
          <path d="M44 8 h32 M46 15 h28" stroke={C.rustDark} strokeWidth="2" />
          <path d="M44 62 Q40 36 50 22" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
        </g>
      )}
    </g>
  )
}
