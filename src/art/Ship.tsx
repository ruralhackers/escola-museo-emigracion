import { useId } from 'react'
import { C, safeId } from './palette'

/** Transatlantic steamer, side view, bow to the right. Drawn in a 800×300 box. */
const HULL = 'M28 186 L776 170 L740 268 L98 268 Q56 262 28 186 Z'
const FUNNELS = [262, 372, 482]

export function ShipSmoke({ className = 'smoke' }: { className?: string }) {
  return (
    <g className={className} aria-hidden="true">
      {FUNNELS.map((x, i) =>
        [0, 1, 2, 3].map((k) => (
          <circle
            key={`${x}-${k}`}
            className="puff"
            cx={x + 26}
            cy={50}
            r={16 + k * 2}
            fill={k % 2 ? C.fog : C.fogLight}
            style={{ animationDelay: `${-(k * 1.6 + i * 0.7)}s` }}
          />
        )),
      )}
    </g>
  )
}

export function Ship({ smoke = true, flags = true, night = false }: { smoke?: boolean; flags?: boolean; night?: boolean }) {
  const id = safeId(useId())
  const win = night ? C.tropic : C.ocean
  return (
    <g>
      {smoke && <ShipSmoke />}
      {/* masts and rigging */}
      <g stroke={C.ink} strokeLinecap="round">
        <line x1="150" y1="36" x2="150" y2="156" strokeWidth="4" />
        <line x1="662" y1="26" x2="662" y2="156" strokeWidth="4" />
        <line x1="150" y1="70" x2="182" y2="70" strokeWidth="3" />
        <line x1="662" y1="64" x2="630" y2="64" strokeWidth="3" />
      </g>
      <g stroke={C.ink} strokeWidth="1.3" opacity=".75" fill="none">
        <path d="M150 36 L36 186" />
        <path d="M150 36 Q405 48 662 26" />
        <path d="M662 26 L772 172" />
      </g>
      {flags && (
        <g>
          {Array.from({ length: 14 }).map((_, i) => {
            const t = (i + 0.5) / 14
            const x = 150 + t * 512
            const y = 36 + (26 - 36) * t + 4 * Math.sin(Math.PI * t) * 2.4
            const fill = [C.stamp, C.brass, C.paper, C.teal][i % 4]
            return <path key={i} className="flag" d={`M${x - 7} ${y} L${x + 7} ${y} L${x} ${y + 13} Z`} fill={fill} style={{ animationDelay: `${-i * 0.23}s` }} />
          })}
        </g>
      )}
      {/* funnels */}
      {FUNNELS.map((x) => (
        <g key={x}>
          <path d={`M${x} 58 L${x + 48} 58 L${x + 58} 130 L${x + 9} 130 Z`} fill={C.stamp} />
          <path d={`M${x} 58 L${x + 48} 58 L${x + 50} 74 L${x + 2} 74 Z`} fill={C.ink} />
          <path d={`M${x + 34} 74 L${x + 50} 74 L${x + 58} 130 L${x + 42} 130 Z`} fill={C.ink} opacity=".18" />
        </g>
      ))}
      {/* ventilators */}
      {[230, 345, 455, 560].map((x) => (
        <path key={x} d={`M${x} 126 v-16 q0 -8 9 -8 h6 v7 h-6 v17 z`} fill={C.paperDark} />
      ))}
      {/* superstructure */}
      <rect x="196" y="124" width="420" height="28" fill={C.white} />
      <rect x="566" y="100" width="70" height="26" fill={C.white} />
      <rect x="566" y="100" width="70" height="6" fill={C.inkSoft} />
      <rect x="138" y="150" width="540" height="36" fill={C.white} />
      <rect x="138" y="179" width="540" height="7" fill={C.paperDark} />
      <rect x="196" y="146" width="420" height="5" fill={C.paperDark} />
      <g fill={win}>
        {Array.from({ length: 21 }).map((_, i) => (
          <rect key={`u${i}`} x={206 + i * 19.5} y={131} width="9" height="9" rx="1" />
        ))}
        {Array.from({ length: 28 }).map((_, i) => (
          <rect key={`l${i}`} x={148 + i * 18.8} y={158} width="10" height="11" rx="1" />
        ))}
        {[576, 594, 612].map((x) => <rect key={x} x={x} y={110} width="12" height="9" />)}
      </g>
      {/* lifeboats */}
      {[224, 300, 420, 500].map((x) => (
        <path key={x} d={`M${x} 118 h46 q-4 8 -12 8 h-22 q-8 0 -12 -8z`} fill={C.paper} stroke={C.ink} strokeWidth="1.5" />
      ))}
      {/* hull */}
      <defs>
        <clipPath id={`${id}h`}><path d={HULL} /></clipPath>
      </defs>
      <path d={HULL} fill={C.oceanDeep} />
      <g clipPath={`url(#${id}h)`}>
        <rect x="0" y="246" width="800" height="30" fill={C.stamp} />
        <rect x="0" y="243" width="800" height="3" fill={C.paper} opacity=".7" />
        <path d="M600 170 L800 160 L800 280 L740 280 Z" fill={C.ink} opacity=".25" />
      </g>
      <path d="M30 192 L774 176" stroke={C.brass} strokeWidth="2.5" />
      <g fill={C.brass}>
        {Array.from({ length: 25 }).map((_, i) => (
          <circle key={i} cx={96 + i * 25.5} cy={213 - i * 0.45} r="3.6" />
        ))}
      </g>
      {/* anchor */}
      <g transform="translate(712 200)" stroke={C.paper} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M0 -10 V12 M-8 6 Q0 16 8 6 M-5 -4 H5" />
        <circle cx="0" cy="-13" r="3" />
      </g>
    </g>
  )
}

/** Cross-section of the same steamer: decks, bunks, dining room and portholes (Vida a bordo). */
export function ShipCutaway() {
  const id = safeId(useId())
  return (
    <g>
      <ShipSmoke />
      <g stroke={C.ink} strokeLinecap="round">
        <line x1="150" y1="36" x2="150" y2="156" strokeWidth="4" />
        <line x1="662" y1="26" x2="662" y2="156" strokeWidth="4" />
      </g>
      <path d="M150 36 Q405 48 662 26" stroke={C.ink} strokeWidth="1.3" fill="none" opacity=".75" />
      {FUNNELS.map((x) => (
        <g key={x}>
          <path d={`M${x} 58 L${x + 48} 58 L${x + 58} 130 L${x + 9} 130 Z`} fill={C.stamp} />
          <path d={`M${x} 58 L${x + 48} 58 L${x + 50} 74 L${x + 2} 74 Z`} fill={C.ink} />
        </g>
      ))}
      <defs>
        <clipPath id={`${id}c`}>
          <path d={`${HULL} M138 124 H678 V190 H138 Z`} />
        </clipPath>
      </defs>
      {/* outer shell */}
      <rect x="138" y="124" width="540" height="64" fill={C.white} />
      <path d={HULL} fill={C.oceanDeep} />
      {/* interior */}
      <g clipPath={`url(#${id}c)`}>
        <rect x="40" y="132" width="730" height="130" fill={C.paper} />
        {/* deck lines */}
        <g stroke={C.ink} strokeWidth="3">
          <line x1="20" y1="186" x2="780" y2="186" />
          <line x1="20" y1="226" x2="780" y2="226" />
        </g>
        {/* bulkheads */}
        <g stroke={C.ink} strokeWidth="2.5">
          {[250, 400, 540].map((x) => <line key={x} x1={x} y1="132" x2={x} y2="268" />)}
        </g>
        {/* upper deck: dining room — table and diners */}
        <rect x="270" y="168" width="110" height="5" fill={C.rust} />
        {[284, 306, 328, 350].map((x, i) => (
          <g key={x} fill={C.inkSoft}>
            <circle cx={x + 6} cy={154} r="5" />
            <rect x={x} y={159} width="12" height="10" rx="3" />
            <rect x={x + 2} y={173} width="3" height="11" />
            {i % 2 === 0 && <circle cx={x + 6} cy={149} r="3" fill={C.stamp} />}
          </g>
        ))}
        <circle cx="325" cy="141" r="6" fill={C.tropic} />
        <line x1="325" y1="132" x2="325" y2="135" stroke={C.ink} strokeWidth="2" />
        {/* bunks */}
        {[60, 140, 420, 470, 560, 610].map((x, i) => (
          <g key={x}>
            <rect x={x} y={196} width="44" height="5" fill={C.rust} />
            <rect x={x} y={212} width="44" height="5" fill={C.rust} />
            <rect x={x + 2} y={190} width="18" height="6" rx="3" fill={i % 2 ? C.fog : C.white} />
            <ellipse cx={x + 28} cy={209} rx="12" ry="4" fill={C.ocean} />
            <line x1={x} y1="188" x2={x} y2="226" stroke={C.ink} strokeWidth="2" />
            <line x1={x + 44} y1="188" x2={x + 44} y2="226" stroke={C.ink} strokeWidth="2" />
          </g>
        ))}
        {/* trunks in the hold */}
        {[80, 120, 160, 200, 430, 480, 600, 640].map((x, i) => (
          <g key={x}>
            <rect x={x} y={248 - (i % 2) * 6} width="30" height={20 + (i % 2) * 6} fill={i % 3 ? C.rust : C.rustDark} />
            <rect x={x} y={252 - (i % 2) * 6} width="30" height="3" fill={C.brass} />
          </g>
        ))}
        {/* engine room */}
        <circle cx="330" cy="250" r="20" fill={C.inkSoft} />
        <circle cx="330" cy="250" r="9" fill={C.stamp} />
        <rect x="270" y="236" width="22" height="30" fill={C.inkSoft} />
        <rect x="360" y="236" width="22" height="30" fill={C.inkSoft} />
        {/* portholes inside out */}
        {[90, 180, 450, 520, 650].map((x) => (
          <g key={x}>
            <circle cx={x} cy={170} r="9" fill={C.ocean} stroke={C.brass} strokeWidth="3" />
            <path d={`M${x - 8} ${173} q4 -3 8 0 t8 0`} stroke={C.fog} strokeWidth="1.5" fill="none" />
          </g>
        ))}
        {/* stairs */}
        <path d="M545 226 l8 -8 h8 l8 -8 h8 l8 -8 h8 l8 -8" stroke={C.ink} strokeWidth="2.5" fill="none" />
      </g>
      <path d="M30 192 L774 176" stroke={C.brass} strokeWidth="2.5" opacity=".6" />
      <path d={`M60 246 L760 246`} stroke={C.stamp} strokeWidth="0" />
      <path d={HULL} fill="none" stroke={C.oceanDeep} strokeWidth="8" />
      <path d="M96 268 L740 268" stroke={C.stamp} strokeWidth="10" />
    </g>
  )
}

/** One-colour silhouette of the steamer (for watermarks). */
export function ShipSilhouette({ color = C.ink }: { color?: string }) {
  return (
    <g fill={color}>
      <path d={HULL} />
      <rect x="138" y="150" width="540" height="36" />
      <rect x="196" y="124" width="420" height="28" />
      <rect x="566" y="100" width="70" height="26" />
      {FUNNELS.map((x) => <path key={x} d={`M${x} 58 L${x + 48} 58 L${x + 58} 130 L${x + 9} 130 Z`} />)}
      <rect x="148" y="36" width="5" height="120" />
      <rect x="660" y="26" width="5" height="130" />
    </g>
  )
}
