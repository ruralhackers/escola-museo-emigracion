import { C, rng, smoothPath } from './palette'

/** Rolling hill band across width; returns closed path down to `bottom`. */
export function hillPath(width: number, base: number, amp: number, seed: number, bottom = 2000, n = 7) {
  const r = rng(seed)
  const pts: [number, number][] = []
  for (let i = 0; i <= n; i++) pts.push([(i / n) * width, base - r() * amp])
  return `${smoothPath(pts)} L${width} ${bottom} L0 ${bottom} Z`
}

export function Hill({ width = 1600, base = 600, amp = 120, seed = 1, fill = C.moss, n = 7 }: { width?: number; base?: number; amp?: number; seed?: number; fill?: string; n?: number }) {
  return <path d={hillPath(width, base, amp, seed, 2000, n)} fill={fill} />
}

/** Round oak. 120×160 box, ground at 160 */
export function Oak({ fill = C.mossDark, light = C.moss }: { fill?: string; light?: string }) {
  return (
    <g>
      <path d="M54 160 L56 96 H66 L68 160Z" fill={C.rustDark} />
      <path d="M60 110 L40 90 M62 104 L84 86" stroke={C.rustDark} strokeWidth="5" />
      <circle cx="60" cy="58" r="44" fill={fill} />
      <circle cx="28" cy="80" r="26" fill={fill} />
      <circle cx="92" cy="78" r="28" fill={fill} />
      <circle cx="46" cy="44" r="22" fill={light} opacity=".55" />
    </g>
  )
}

/** Tall slim tree (cypress-like). 50×180 */
export function Cypress({ fill = C.mossDark }: { fill?: string }) {
  return <path d="M25 0 Q46 70 40 170 H10 Q4 70 25 0Z" fill={fill} />
}

/** Palm tree typical of indiano gardens. 160×260, ground at 260 */
export function Palm({ trunk = C.rust, leaf = C.moss }: { trunk?: string; leaf?: string }) {
  return (
    <g>
      <path d="M76 260 Q70 160 84 60 L92 60 Q82 160 90 260Z" fill={trunk} />
      <g className="sway" style={{ transformOrigin: '88px 60px' }}>
        {[
          'M88 60 Q40 30 0 62 Q44 46 88 64Z',
          'M88 60 Q130 26 160 60 Q124 44 88 64Z',
          'M88 60 Q70 10 30 4 Q72 24 86 62Z',
          'M88 60 Q110 10 150 8 Q108 26 90 62Z',
          'M88 60 Q50 70 24 112 Q58 80 88 64Z',
          'M88 60 Q130 74 148 116 Q118 82 88 64Z',
        ].map((d, i) => <path key={i} d={d} fill={i % 2 ? leaf : C.mossDark} />)}
      </g>
    </g>
  )
}

export function Cloud({ fill = C.white, opacity = 1 }: { fill?: string; opacity?: number }) {
  return (
    <g fill={fill} opacity={opacity}>
      <rect x="0" y="40" width="260" height="34" rx="17" />
      <circle cx="80" cy="42" r="30" />
      <circle cx="140" cy="34" r="38" />
      <circle cx="196" cy="48" r="24" />
    </g>
  )
}

/** Seagull in flight; flaps with CSS. */
export function Gull({ x, y, s = 1, delay = 0, color = C.ink }: { x: number; y: number; s?: number; delay?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="gull" style={{ animationDelay: `${delay}s` }} d="M-22 0 Q-11 -10 0 2 Q11 -10 22 0" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/** A band of flat waves `width` wide (draw twice as wide as needed when drifting). */
export function wavePath(width: number, y: number, amp: number, len: number, bottom = 2000) {
  let d = `M0 ${y}`
  for (let x = 0; x < width; x += len) d += ` q${len / 4} ${-amp} ${len / 2} 0 t${len / 2} 0`
  return d + ` L${width} ${bottom} L0 ${bottom} Z`
}

export function Waves({ width = 3200, y = 0, amp = 12, len = 120, fill = C.teal, crest }: { width?: number; y?: number; amp?: number; len?: number; fill?: string; crest?: string }) {
  return (
    <g>
      <path d={wavePath(width, y, amp, len)} fill={fill} />
      {crest && (
        <g stroke={crest} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".7">
          {Array.from({ length: Math.floor(width / (len * 2.5)) }).map((_, i) => (
            <path key={i} d={`M${i * len * 2.5 + len * 0.6} ${y + amp * 1.6} q${len / 8} -6 ${len / 4} 0`} />
          ))}
        </g>
      )}
    </g>
  )
}

/** Flat mist bands */
export function Mist({ width = 1600, y = 0, color = C.fogLight, opacity = 0.7 }: { width?: number; y?: number; color?: string; opacity?: number }) {
  return (
    <g fill={color} opacity={opacity}>
      <rect x={width * 0.05} y={y} width={width * 0.42} height="26" rx="13" />
      <rect x={width * 0.32} y={y + 34} width={width * 0.5} height="20" rx="10" />
      <rect x={width * 0.62} y={y + 6} width={width * 0.34} height="22" rx="11" />
    </g>
  )
}
