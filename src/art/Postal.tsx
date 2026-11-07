import { useId, type ReactNode } from 'react'
import { C, safeId } from './palette'

/** Perforated postage stamp. Drawn in a w×h box; children are the stamp picture (0..w,0..h). */
export function Stamp({ w = 120, h = 150, color = C.stamp, children }: { w?: number; h?: number; color?: string; children?: ReactNode }) {
  const id = safeId(useId())
  const r = 4.5
  const step = 12
  const holes: ReactNode[] = []
  for (let x = step / 2; x < w; x += step) {
    holes.push(<circle key={`t${x}`} cx={x} cy={0} r={r} />, <circle key={`b${x}`} cx={x} cy={h} r={r} />)
  }
  for (let y = step / 2; y < h; y += step) {
    holes.push(<circle key={`l${y}`} cx={0} cy={y} r={r} />, <circle key={`r${y}`} cx={w} cy={y} r={r} />)
  }
  return (
    <g>
      <defs>
        <mask id={id}>
          <rect width={w} height={h} fill="#fff" />
          <g fill="#000">{holes}</g>
        </mask>
      </defs>
      <g mask={`url(#${id})`}>
        <rect width={w} height={h} fill={C.white} />
        <rect x="9" y="9" width={w - 18} height={h - 18} fill={color} />
        <g transform="translate(9 9)">{children}</g>
      </g>
    </g>
  )
}

/** Picture for a stamp: steamer on waves (fits ~100×130) */
export function StampShip({ w = 102, h = 132, sky = C.paper }: { w?: number; h?: number; sky?: string }) {
  return (
    <g>
      <rect x="5" y="5" width={w - 10} height={h - 10} fill={sky} />
      <circle cx={w * 0.7} cy={h * 0.3} r={w * 0.12} fill={C.tropic} />
      <g transform={`translate(${w * 0.08} ${h * 0.42}) scale(${(w * 0.84) / 800})`}>
        <path d="M28 186 L776 170 L740 268 L98 268 Q56 262 28 186 Z" fill={C.oceanDeep} />
        <rect x="138" y="140" width="540" height="46" fill={C.oceanDeep} />
        {[262, 372, 482].map((x) => <path key={x} d={`M${x} 40 L${x + 48} 40 L${x + 58} 140 L${x + 9} 140 Z`} fill={C.oceanDeep} />)}
      </g>
      <path d={`M5 ${h * 0.68} q${w / 8} -6 ${w / 4} 0 t${w / 4} 0 t${w / 4} 0 t${w / 4} 0 V${h - 5} H5Z`} fill={C.teal} />
      <text x={w / 2} y={h - 14} textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="10" fill={C.paper}>CORREOS</text>
    </g>
  )
}

/** Circular postmark with text around the ring and wavy cancellation bars. */
export function Postmark({ r = 60, text = 'ESCOLA MUSEO DA EMIGRACIÓN · GAXATE ·', center = '', color = C.stamp, bars = true, strokeWidth = 3 }: { r?: number; text?: string; center?: string; color?: string; bars?: boolean; strokeWidth?: number }) {
  const id = safeId(useId())
  const tr = r - 13
  return (
    <g fill="none" stroke={color} strokeWidth={strokeWidth}>
      <defs>
        <path id={id} d={`M ${-tr} 0 A ${tr} ${tr} 0 1 1 ${tr} 0 A ${tr} ${tr} 0 1 1 ${-tr} 0`} />
      </defs>
      <circle r={r} />
      <circle r={Math.max(2, r > 40 ? r - 24 : r * 0.62)} strokeWidth={strokeWidth * 0.7} />
      <text fill={color} stroke="none" fontFamily="Special Elite, monospace" fontSize={r * 0.17} letterSpacing="1">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      {center && (
        <text fill={color} stroke="none" textAnchor="middle" dominantBaseline="central" fontFamily="Special Elite, monospace" fontSize={r * 0.3}>
          {center}
        </text>
      )}
      {bars && (
        <g strokeWidth={strokeWidth * 0.9}>
          {[-16, -5, 6, 17].map((y) => (
            <path key={y} d={`M${r + 6} ${y} q14 -8 28 0 t28 0 t28 0 t28 0 t28 0`} />
          ))}
        </g>
      )}
    </g>
  )
}

/** Envelope with airmail border, stamp and handwriting. 240×150 box. */
export function Envelope({ open = false, flap = true }: { open?: boolean; flap?: boolean }) {
  return (
    <g>
      <rect width="240" height="150" fill={C.paperDark} />
      <rect x="2" y="2" width="236" height="146" fill="none" stroke={C.stamp} strokeWidth="5" strokeDasharray="14 14" />
      <rect x="2" y="2" width="236" height="146" fill="none" stroke={C.ocean} strokeWidth="5" strokeDasharray="14 14" strokeDashoffset="14" />
      {flap && !open && <path d="M6 8 L120 84 L234 8" fill="none" stroke={C.rust} strokeWidth="1.6" opacity=".55" />}
      {open && <path d="M4 4 L120 -60 L236 4 Z" fill={C.paperDark} stroke={C.rust} strokeWidth="1.2" />}
      <g transform="translate(176 16)">
        <Stamp w={44} h={54}>
          <StampShip w={26} h={36} />
        </Stamp>
      </g>
      <g transform="translate(172 52) rotate(-12)" opacity=".85">
        <Postmark r={22} text="CORREOS · GALICIA ·" bars={false} strokeWidth={1.6} />
      </g>
      <g stroke={C.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".8">
        <path d="M40 92 q8 -6 14 0 t14 0 t16 -2 t14 2 t18 -1 t12 1" />
        <path d="M40 110 q8 -5 16 0 t14 0 t14 -2 t16 2 t12 0" />
        <path d="M40 128 q10 -6 18 0 t16 0 t14 0" />
      </g>
    </g>
  )
}

/** Handwritten letter sheet 200×260 */
export function LetterSheet({ lines = 11 }: { lines?: number }) {
  return (
    <g>
      <rect width="200" height="260" fill={C.white} />
      <rect width="200" height="260" fill="none" stroke={C.paperDark} strokeWidth="2" />
      <g stroke={C.ocean} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".75">
        {Array.from({ length: lines }).map((_, i) => (
          <path key={i} d={`M22 ${34 + i * 19} q8 -5 15 0 t15 0 t15 -1 t15 1 t15 0 t15 -1 t15 1 ${i % 3 === 2 ? '' : 't15 0 t15 0 t14 0'}`} />
        ))}
      </g>
    </g>
  )
}

/** Vintage postcard of a steamer in port, handwritten "1913". 260×170 */
export function Postcard() {
  return (
    <g>
      <rect width="260" height="170" fill={C.white} />
      <rect x="10" y="10" width="240" height="120" fill={C.fogLight} />
      <rect x="10" y="96" width="240" height="34" fill={C.tealLight} />
      <g transform="translate(40 52) scale(0.24)">
        <path d="M28 186 L776 170 L740 268 L98 268 Q56 262 28 186 Z" fill={C.inkSoft} />
        <rect x="138" y="124" width="540" height="62" fill={C.inkSoft} />
        {[262, 372, 482].map((x) => <path key={x} d={`M${x} 40 L${x + 48} 40 L${x + 58} 130 L${x + 9} 130 Z`} fill={C.inkSoft} />)}
        <line x1="150" y1="0" x2="150" y2="150" stroke={C.inkSoft} strokeWidth="8" />
        <line x1="662" y1="0" x2="662" y2="150" stroke={C.inkSoft} strokeWidth="8" />
      </g>
      <path d="M10 112 h60 v-14 h30 v14 h150 v18 H10z" fill={C.stoneDark} />
      <g fill={C.inkSoft}>
        {[24, 34, 46, 58, 68, 80].map((x, i) => <circle key={x} cx={x} cy={104 - (i % 2) * 2} r="3" />)}
      </g>
      <text x="200" y="158" textAnchor="middle" fontFamily="Playfair Display, serif" fontStyle="italic" fontSize="22" fill={C.ocean}>1913</text>
      <path d="M20 150 q10 -5 20 0 t20 0 t20 0 t20 0" stroke={C.ocean} strokeWidth="1.4" fill="none" />
    </g>
  )
}
