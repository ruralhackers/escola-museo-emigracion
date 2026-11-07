import { C, rng } from './palette'

/** Casa de indiano: two storeys, white glazed gallery, hipped roof and small tower. 260×240 box, ground at y=240. */
export function IndianoHouse({ wall = C.paper, roof = C.roof, tower = true, gallery = true, flip = false }: { wall?: string; roof?: string; tower?: boolean; gallery?: boolean; flip?: boolean }) {
  return (
    <g transform={flip ? 'translate(260 0) scale(-1 1)' : undefined}>
      {tower && (
        <g>
          <rect x="168" y="34" width="56" height="80" fill={wall} />
          <path d="M160 36 L196 8 L232 36 Z" fill={roof} />
          <rect x="186" y="50" width="18" height="26" rx="9" fill={C.ocean} />
          <rect x="186" y="50" width="18" height="26" rx="9" fill="none" stroke={C.white} strokeWidth="3" />
          <rect x="196" y="0" width="2" height="10" fill={C.ink} />
        </g>
      )}
      {/* hipped roof */}
      <path d="M12 96 L52 58 H208 L248 96 Z" fill={roof} />
      <path d="M12 96 L52 58 H70 L34 96Z" fill={C.ink} opacity=".15" />
      {/* body */}
      <rect x="22" y="96" width="216" height="144" fill={wall} />
      <rect x="22" y="96" width="216" height="8" fill={C.ink} opacity=".12" />
      <rect x="22" y="232" width="216" height="8" fill={C.stoneDark} />
      {gallery ? (
        <g>
          {/* white glazed gallery on the upper floor */}
          <rect x="30" y="106" width="200" height="56" fill={C.white} />
          <rect x="34" y="110" width="192" height="48" fill={C.oceanMid} opacity=".85" />
          <g stroke={C.white} strokeWidth="3">
            {Array.from({ length: 9 }).map((_, i) => <line key={i} x1={34 + i * 24} y1="110" x2={34 + i * 24} y2="158" />)}
            <line x1="34" y1="126" x2="226" y2="126" />
            <line x1="34" y1="142" x2="226" y2="142" strokeWidth="1.5" />
          </g>
          <rect x="26" y="160" width="208" height="6" fill={C.white} />
        </g>
      ) : (
        <g>
          {[46, 104, 162].map((x) => (
            <g key={x}>
              <rect x={x} y="114" width="40" height="42" fill={C.ocean} />
              <rect x={x} y="114" width="40" height="42" fill="none" stroke={C.white} strokeWidth="4" />
              <line x1={x + 20} y1="114" x2={x + 20} y2="156" stroke={C.white} strokeWidth="2" />
            </g>
          ))}
        </g>
      )}
      {/* ground floor */}
      {[40, 172].map((x) => (
        <g key={x}>
          <rect x={x} y="182" width="40" height="40" fill={C.ocean} />
          <rect x={x} y="182" width="40" height="40" fill="none" stroke={C.white} strokeWidth="4" />
        </g>
      ))}
      <path d="M110 232 V196 Q130 176 150 196 V232 Z" fill={C.rustDark} />
      <path d="M110 196 Q130 176 150 196" fill="none" stroke={C.white} strokeWidth="4" />
      <rect x="104" y="232" width="52" height="8" fill={C.stone} />
    </g>
  )
}

/** Escuela do Castro: low stone house, tile roof, big white windows. 440×200 box, ground at y=200. */
export function School({ sign = false }: { sign?: boolean }) {
  const r = rng(11)
  const stones = Array.from({ length: 70 }).map(() => ({ x: 26 + r() * 380, y: 82 + r() * 108, w: 12 + r() * 20, h: 7 + r() * 8 }))
  return (
    <g>
      {/* chimney */}
      <rect x="320" y="22" width="22" height="40" fill={C.stoneDark} />
      <rect x="316" y="18" width="30" height="7" fill={C.stone} />
      {/* roof */}
      <path d="M0 82 L56 34 H384 L440 82 Z" fill={C.roof} />
      <g stroke={C.rustDark} strokeWidth="2" opacity=".55" fill="none">
        {[46, 58, 70].map((y) => <line key={y} x1={0 + (82 - y) * 0.9} y1={y} x2={440 - (82 - y) * 0.9} y2={y} />)}
        {Array.from({ length: 30 }).map((_, i) => <line key={i} x1={40 + i * 12.5} y1="38" x2={30 + i * 13} y2="80" />)}
      </g>
      <rect x="0" y="80" width="440" height="6" fill={C.rustDark} />
      {/* wall */}
      <rect x="18" y="86" width="404" height="114" fill={C.stone} />
      <g fill={C.stoneDark} opacity=".45">
        {stones.map((s, i) => <rect key={i} x={s.x} y={s.y} width={s.w} height={s.h} rx="3" />)}
      </g>
      {/* big white windows */}
      {[44, 120, 300, 370].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="100" width="44" height="74" fill={C.white} />
          <rect x={x} y="104" width="36" height="66" fill={C.ocean} />
          <g stroke={C.white} strokeWidth="3">
            <line x1={x + 18} y1="104" x2={x + 18} y2="170" />
            <line x1={x} y1="126" x2={x + 36} y2="126" />
            <line x1={x} y1="148" x2={x + 36} y2="148" />
          </g>
          <rect x={x - 8} y="174" width="52" height="6" fill={C.white} />
        </g>
      ))}
      {/* door */}
      <rect x="196" y="112" width="48" height="88" fill={C.white} />
      <rect x="202" y="118" width="36" height="82" fill={C.rust} />
      <line x1="220" y1="118" x2="220" y2="200" stroke={C.rustDark} strokeWidth="2" />
      <circle cx="232" cy="160" r="2.5" fill={C.brass} />
      <rect x="186" y="196" width="68" height="6" fill={C.stoneDark} />
      {sign && (
        <g className="swing" style={{ transformOrigin: '220px 86px' }}>
          <line x1="160" y1="86" x2="164" y2="100" stroke={C.ink} strokeWidth="2" />
          <line x1="280" y1="86" x2="276" y2="100" stroke={C.ink} strokeWidth="2" />
          <rect x="130" y="98" width="180" height="26" fill={C.oceanDeep} />
          <rect x="134" y="102" width="172" height="18" fill="none" stroke={C.brass} strokeWidth="1.2" />
          <text x="220" y="115.5" textAnchor="middle" fontFamily="Playfair Display, serif" fontSize="11.5" fill={C.brass}>Escola Museo da Emigración</text>
        </g>
      )}
    </g>
  )
}

/** Galician hórreo on stone legs. 220×150, ground at 150. */
export function Horreo() {
  return (
    <g>
      {[30, 80, 140, 190].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} 150 L${x - 5} 104 H${x + 5} L${x + 7} 150 Z`} fill={C.stoneDark} />
          <rect x={x - 13} y="96" width="26" height="8" rx="2" fill={C.stone} />
        </g>
      ))}
      <rect x="14" y="86" width="192" height="12" fill={C.stone} />
      <rect x="18" y="36" width="184" height="52" fill={C.rust} />
      <g stroke={C.rustDark} strokeWidth="3">
        {Array.from({ length: 14 }).map((_, i) => <line key={i} x1={28 + i * 12.5} y1="40" x2={28 + i * 12.5} y2="86" />)}
      </g>
      <rect x="18" y="36" width="10" height="52" fill={C.stone} />
      <rect x="192" y="36" width="10" height="52" fill={C.stone} />
      <path d="M6 40 L110 8 L214 40 Z" fill={C.roof} />
      <path d="M6 40 h208" stroke={C.rustDark} strokeWidth="3" />
      <path d="M14 8 v-16 M8 -2 h12" stroke={C.stone} strokeWidth="4" />
      <path d="M14 30 V8" stroke={C.stone} strokeWidth="5" />
      <path d="M206 30 V2" stroke={C.stone} strokeWidth="5" />
      <circle cx="206" cy="0" r="5" fill={C.stone} />
    </g>
  )
}

/** Lighthouse on a rock. 120×260 box, base at 260. */
export function Lighthouse() {
  return (
    <g>
      <path className="beam" d="M60 46 L-260 0 L-260 70 Z" fill={C.white} opacity=".35" />
      <path d="M0 260 Q10 222 40 216 L84 214 Q112 222 120 260 Z" fill={C.stoneDark} />
      <path d="M40 216 L50 70 H72 L82 216 Z" fill={C.white} />
      <path d="M44 170 L78 170 L80 192 L42 192Z M47 120 H75 L77 142 H45Z" fill={C.stamp} />
      <rect x="44" y="62" width="34" height="10" fill={C.ink} />
      <rect x="49" y="40" width="24" height="22" fill={C.tropic} />
      <path d="M44 40 L61 22 L78 40 Z" fill={C.ink} />
      <line x1="61" y1="22" x2="61" y2="12" stroke={C.ink} strokeWidth="2" />
    </g>
  )
}

/** Quay crane. 160×260, base at 260 */
export function Crane({ color = C.ink }: { color?: string }) {
  return (
    <g stroke={color} strokeWidth="5" fill="none" strokeLinecap="round">
      <path d="M40 260 L60 100 L80 260 M48 200 L72 200 M52 150 L68 150" />
      <rect x="44" y="80" width="40" height="28" fill={color} />
      <path d="M64 84 L190 20 M84 96 L190 20" strokeWidth="4" />
      <path d="M70 92 L100 70 L120 60 L150 44 L170 34" strokeWidth="2" />
      <path d="M186 22 V120" strokeWidth="2" />
      <path d="M180 120 h12 v8 q0 8 -6 8" strokeWidth="3" />
      <path d="M64 80 L30 60 L30 86" strokeWidth="4" />
      <rect x="18" y="80" width="20" height="16" fill={color} />
    </g>
  )
}

/** Generic warm port city skyline for the American arrival. 1200×300, ground at 300. */
export function PortCity({ seed = 7 }: { seed?: number }) {
  const r = rng(seed)
  const colors = [C.tropicLight, C.paper, C.paperDark, C.tropic, C.white]
  const blocks = Array.from({ length: 22 }).map((_, i) => ({
    x: i * 55 + r() * 10,
    w: 44 + r() * 34,
    h: 90 + r() * 150,
    c: colors[Math.floor(r() * colors.length)],
    dome: r() < 0.18,
    roof: r() < 0.3,
  }))
  return (
    <g>
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h} fill={b.c} />
          {b.dome && <path d={`M${b.x + 4} ${300 - b.h} Q${b.x + b.w / 2} ${300 - b.h - b.w * 0.8} ${b.x + b.w - 4} ${300 - b.h} Z`} fill={C.teal} />}
          {b.roof && <path d={`M${b.x - 4} ${300 - b.h} L${b.x + b.w / 2} ${300 - b.h - 24} L${b.x + b.w + 4} ${300 - b.h}Z`} fill={C.roof} />}
          <g fill={C.ocean} opacity=".7">
            {Array.from({ length: Math.floor(b.h / 28) }).map((_, k) => (
              <g key={k}>
                <rect x={b.x + 8} y={300 - b.h + 14 + k * 28} width="8" height="12" />
                <rect x={b.x + b.w - 16} y={300 - b.h + 14 + k * 28} width="8" height="12" />
              </g>
            ))}
          </g>
        </g>
      ))}
    </g>
  )
}

/** Large emigrants' reception hotel, with an open bay showing bunks and lined-up suitcases. 520×300, ground 300 */
export function EmigrantHotel() {
  return (
    <g>
      <rect x="0" y="60" width="520" height="240" fill={C.paper} />
      <path d="M-10 64 H530 L500 40 H20 Z" fill={C.roof} />
      <path d="M200 40 L260 0 L320 40 Z" fill={C.paperDark} />
      <circle cx="260" cy="26" r="9" fill={C.white} stroke={C.ink} strokeWidth="2" />
      <rect x="0" y="60" width="520" height="10" fill={C.paperDark} />
      {/* upper windows */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={22 + i * 42} y="86" width="22" height="34" rx="11" fill={C.ocean} />
      ))}
      {/* open bay with bunks */}
      <rect x="60" y="146" width="400" height="130" fill={C.inkSoft} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <rect x={76 + i * 64} y="164" width="48" height="6" fill={C.rust} />
          <rect x={76 + i * 64} y="200" width="48" height="6" fill={C.rust} />
          <rect x={76 + i * 64} y="236" width="48" height="6" fill={C.rust} />
          <rect x={78 + i * 64} y="157" width="20" height="7" rx="3" fill={C.white} />
          <rect x={78 + i * 64} y="193" width="20" height="7" rx="3" fill={C.white} />
          <rect x={78 + i * 64} y="229" width="20" height="7" rx="3" fill={C.white} />
          <line x1={76 + i * 64} y1="156" x2={76 + i * 64} y2="276" stroke={C.brass} strokeWidth="2" />
          <line x1={124 + i * 64} y1="156" x2={124 + i * 64} y2="276" stroke={C.brass} strokeWidth="2" />
        </g>
      ))}
      <rect x="60" y="146" width="400" height="130" fill="none" stroke={C.white} strokeWidth="6" />
      {/* suitcases lined in front */}
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i} transform={`translate(${44 + i * 40} 268)`}>
          <rect width="32" height="26" rx="3" fill={i % 3 === 0 ? C.rustDark : C.rust} />
          <rect y="9" width="32" height="3" fill={C.brass} />
          <path d="M10 0 q6 -7 12 0" stroke={C.rustDark} strokeWidth="2.5" fill="none" />
        </g>
      ))}
      <rect x="-10" y="294" width="540" height="6" fill={C.stoneDark} />
    </g>
  )
}
