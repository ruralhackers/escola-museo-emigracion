import { C } from './palette'

/* All objects drawn in a 100×100 box. */

export function BellowsCamera() {
  return (
    <g>
      <path d="M30 78 L22 96 M50 78 V98 M70 78 L78 96" stroke={C.rustDark} strokeWidth="4" strokeLinecap="round" />
      <rect x="10" y="28" width="26" height="50" rx="3" fill={C.rust} />
      <path d="M36 32 L66 40 V66 L36 74 Z" fill={C.inkSoft} />
      <g stroke={C.ink} strokeWidth="2">{[42, 48, 54, 60].map((x) => <line key={x} x1={x} y1={34 + (x - 36) * 0.27} x2={x} y2={72 - (x - 36) * 0.27} />)}</g>
      <rect x="66" y="38" width="12" height="30" fill={C.brass} />
      <circle cx="86" cy="53" r="10" fill={C.inkSoft} stroke={C.brass} strokeWidth="3" />
      <circle cx="86" cy="53" r="4" fill={C.ocean} />
      <rect x="14" y="20" width="14" height="8" fill={C.ink} />
    </g>
  )
}

export function ModelShip() {
  return (
    <g>
      <rect x="20" y="82" width="60" height="10" fill={C.rust} />
      <path d="M30 82 V72 M70 82 V72" stroke={C.rustDark} strokeWidth="3" />
      <path d="M6 54 L94 50 L86 72 L18 72 Q8 70 6 54Z" fill={C.oceanDeep} />
      <rect x="10" y="66" width="80" height="6" fill={C.stamp} />
      <rect x="22" y="40" width="58" height="12" fill={C.white} />
      {[34, 50, 66].map((x) => <path key={x} d={`M${x} 20 h8 l2 20 h-10z`} fill={C.stamp} />)}
      {[34, 50, 66].map((x) => <rect key={`t${x}`} x={x} y="20" width="8" height="4" fill={C.ink} />)}
    </g>
  )
}

export function Bundle() {
  return (
    <g>
      <rect x="14" y="30" width="72" height="54" fill={C.white} transform="rotate(-4 50 57)" />
      <rect x="12" y="26" width="72" height="54" fill={C.paperDark} transform="rotate(3 50 53)" />
      <rect x="16" y="22" width="70" height="56" fill={C.paper} />
      <g stroke={C.ocean} strokeWidth="1.5" opacity=".7">{[34, 42, 50, 58, 66].map((y) => <path key={y} d={`M24 ${y} h${y % 16 ? 52 : 34}`} />)}</g>
      <rect x="46" y="18" width="8" height="64" fill={C.stamp} />
      <rect x="14" y="46" width="74" height="7" fill={C.stamp} />
      <circle cx="50" cy="50" r="8" fill={C.stamp} stroke={C.rustDark} strokeWidth="2" />
    </g>
  )
}

export function PocketWatch() {
  return (
    <g>
      <path d="M50 4 Q30 4 34 18" fill="none" stroke={C.brass} strokeWidth="3" />
      <rect x="44" y="12" width="12" height="10" rx="3" fill={C.brass} />
      <circle cx="50" cy="58" r="36" fill={C.brass} />
      <circle cx="50" cy="58" r="29" fill={C.white} />
      <g stroke={C.ink} strokeWidth="2">{Array.from({ length: 12 }).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={50 + Math.cos(a) * 23} y1={58 + Math.sin(a) * 23} x2={50 + Math.cos(a) * 27} y2={58 + Math.sin(a) * 27} /> })}</g>
      <line x1="50" y1="58" x2="50" y2="40" stroke={C.ink} strokeWidth="3" strokeLinecap="round" />
      <line x1="50" y1="58" x2="63" y2="64" stroke={C.stamp} strokeWidth="2.5" strokeLinecap="round" className="watch-hand" />
      <circle cx="50" cy="58" r="3" fill={C.ink} />
    </g>
  )
}

export function Chair() {
  return (
    <g>
      <path d="M28 8 V92 M72 8 V92" stroke={C.rust} strokeWidth="7" strokeLinecap="round" />
      <g stroke={C.rustDark} strokeWidth="4">{[18, 30, 42].map((y) => <line key={y} x1="28" y1={y} x2="72" y2={y} />)}</g>
      <path d="M18 56 H82 L76 64 H24Z" fill={C.paperDark} stroke={C.rustDark} strokeWidth="3" />
      <path d="M24 64 L20 96 M76 64 L80 96" stroke={C.rust} strokeWidth="6" strokeLinecap="round" />
      <path d="M26 80 H74" stroke={C.rustDark} strokeWidth="3" />
    </g>
  )
}

export function BookIcon() {
  return (
    <g>
      <rect x="18" y="12" width="64" height="80" rx="3" fill={C.ink} />
      <rect x="18" y="12" width="9" height="80" fill={C.inkSoft} />
      <rect x="32" y="22" width="42" height="26" fill="none" stroke={C.brass} strokeWidth="1.5" />
      <path d="M36 32 h34 M40 40 h26" stroke={C.brass} strokeWidth="3" />
      <path d="M38 70 q12 -8 24 0" stroke={C.brass} strokeWidth="2" fill="none" />
      <rect x="80" y="16" width="5" height="72" fill={C.white} />
    </g>
  )
}

export function KeepBox() {
  return (
    <g>
      <path d="M10 40 L50 24 L90 40 L50 56 Z" fill={C.paperDark} />
      <path d="M10 40 V80 L50 96 V56 Z" fill={C.rust} />
      <path d="M90 40 V80 L50 96 V56 Z" fill={C.rustDark} />
      <path d="M30 32 L70 48 V60" stroke={C.stamp} strokeWidth="5" fill="none" />
      <path d="M22 64 h0" stroke={C.brass} strokeWidth="6" strokeLinecap="round" />
      <text x="28" y="78" fontFamily="Special Elite, monospace" fontSize="9" fill={C.paper} transform="skewY(22) translate(0 -14)">FRÁGIL</text>
    </g>
  )
}

export function Handkerchief() {
  return (
    <g>
      <path className="hanky-wave" d="M20 20 Q50 8 82 20 Q74 50 84 82 Q50 74 18 84 Q28 50 20 20Z" fill={C.white} stroke={C.fog} strokeWidth="2" />
      <path d="M28 28 Q50 20 74 28 Q68 50 76 74 Q50 68 26 76 Q34 50 28 28Z" fill="none" stroke={C.stamp} strokeWidth="2" strokeDasharray="4 3" />
    </g>
  )
}

export function Porthole() {
  return (
    <g>
      <circle cx="50" cy="50" r="44" fill={C.brass} />
      <circle cx="50" cy="50" r="34" fill={C.ocean} />
      <path className="porthole-sea" d="M10 56 q10 -7 20 0 t20 0 t20 0 t20 0 V90 H10Z" fill={C.teal} />
      <circle cx="50" cy="50" r="34" fill="none" stroke={C.rustDark} strokeWidth="3" />
      {Array.from({ length: 8 }).map((_, i) => { const a = (i / 8) * Math.PI * 2; return <circle key={i} cx={50 + Math.cos(a) * 39} cy={50 + Math.sin(a) * 39} r="2.4" fill={C.rustDark} /> })}
      <path d="M30 34 Q40 24 54 24" stroke={C.white} strokeWidth="3" fill="none" opacity=".6" />
    </g>
  )
}

export function KeyIcon() {
  return (
    <g>
      <circle cx="28" cy="50" r="18" fill="none" stroke={C.brass} strokeWidth="8" />
      <rect x="44" y="46" width="48" height="8" fill={C.brass} />
      <rect x="74" y="54" width="7" height="14" fill={C.brass} />
      <rect x="86" y="54" width="6" height="10" fill={C.brass} />
      <path d="M8 30 l-6 -6" stroke={C.stamp} strokeWidth="3" />
      <rect x="-6" y="8" width="22" height="16" rx="3" fill={C.paper} stroke={C.stamp} strokeWidth="2" transform="rotate(-30 5 16)" />
    </g>
  )
}

export function Compass() {
  return (
    <g>
      <circle cx="50" cy="50" r="44" fill={C.brass} />
      <circle cx="50" cy="50" r="36" fill={C.white} />
      <g fontFamily="Special Elite, monospace" fontSize="10" textAnchor="middle" fill={C.ink}>
        <text x="50" y="24">N</text><text x="50" y="84">S</text><text x="80" y="54">E</text><text x="20" y="54">O</text>
      </g>
      <g className="needle" style={{ transformOrigin: '50px 50px' }}>
        <path d="M50 22 L57 50 L50 78 L43 50Z" fill={C.ocean} />
        <path d="M50 22 L57 50 H43Z" fill={C.stamp} />
      </g>
      <circle cx="50" cy="50" r="4" fill={C.ink} />
    </g>
  )
}

export function LetterIcon() {
  return (
    <g>
      <rect x="22" y="14" width="56" height="62" fill={C.white} className="letter-up" />
      <g stroke={C.ocean} strokeWidth="1.5" className="letter-up">{[26, 34, 42].map((y) => <path key={y} d={`M30 ${y} h40`} />)}</g>
      <rect x="10" y="40" width="80" height="50" fill={C.paperDark} />
      <path d="M10 40 L50 70 L90 40" fill="none" stroke={C.rust} strokeWidth="2" />
      <rect x="68" y="46" width="14" height="16" fill={C.stamp} />
    </g>
  )
}

/** Period radio / audioguide with speaker grille. */
export function RadioGuide() {
  return (
    <g>
      <path d="M30 22 Q50 -4 70 22" stroke={C.ink} strokeWidth="5" fill="none" />
      <path d="M8 30 Q8 20 18 20 H82 Q92 20 92 30 V86 H8Z" fill={C.rust} />
      <path d="M16 30 Q16 26 20 26 H58 V80 H16Z" fill={C.paperDark} />
      <g stroke={C.rustDark} strokeWidth="2.5">{[34, 42, 50, 58, 66, 74].map((y) => <line key={y} x1="20" y1={y} x2="54" y2={y} />)}</g>
      <circle cx="74" cy="42" r="9" fill={C.brass} />
      <circle cx="74" cy="68" r="9" fill={C.brass} />
      <line x1="74" y1="42" x2="78" y2="36" stroke={C.ink} strokeWidth="2.5" />
      <rect x="6" y="86" width="88" height="8" rx="2" fill={C.rustDark} />
    </g>
  )
}
