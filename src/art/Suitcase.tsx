import { C } from './palette'

/** Antique leather & wood suitcase, front view, 300×220 box. */
export function Suitcase({ labels = 3, handle = true }: { labels?: number; handle?: boolean }) {
  return (
    <g>
      {handle && (
        <g>
          <path d="M118 44 Q118 12 150 12 Q182 12 182 44" fill="none" stroke={C.rustDark} strokeWidth="11" strokeLinecap="round" />
          <rect x="108" y="36" width="20" height="12" rx="3" fill={C.brass} />
          <rect x="172" y="36" width="20" height="12" rx="3" fill={C.brass} />
        </g>
      )}
      <SuitcaseFront />
      <SuitcaseLabels n={labels} />
    </g>
  )
}

export function SuitcaseFront({ lidOnly = false, bodyOnly = false }: { lidOnly?: boolean; bodyOnly?: boolean }) {
  return (
    <g>
      {!lidOnly && (
        <g>
          <path d="M10 92 H290 V196 Q290 210 276 210 H24 Q10 210 10 196 Z" fill={C.rust} />
          <rect x="10" y="200" width="280" height="10" rx="5" fill={C.rustDark} opacity=".5" />
          {/* wood slats */}
          <rect x="10" y="140" width="280" height="8" fill={C.rustDark} opacity=".55" />
          {/* straps */}
          {[66, 212].map((x) => (
            <g key={x}>
              <rect x={x} y="92" width="22" height="118" fill={C.rustDark} />
              <rect x={x - 3} y="112" width="28" height="20" rx="3" fill="none" stroke={C.brass} strokeWidth="4" />
            </g>
          ))}
          {/* corners */}
          <path d="M10 180 V196 Q10 210 24 210 H40 V200 H24 Q20 200 20 196 V180 Z" fill={C.brass} />
          <path d="M290 180 V196 Q290 210 276 210 H260 V200 H276 Q280 200 280 196 V180 Z" fill={C.brass} />
          {/* locks */}
          <rect x="118" y="88" width="16" height="18" rx="2" fill={C.brass} />
          <rect x="166" y="88" width="16" height="18" rx="2" fill={C.brass} />
          <circle cx="126" cy="99" r="2.4" fill={C.ink} />
          <circle cx="174" cy="99" r="2.4" fill={C.ink} />
        </g>
      )}
      {!bodyOnly && (
        <g>
          <path d="M24 40 H276 Q290 40 290 54 V92 H10 V54 Q10 40 24 40 Z" fill={C.rust} />
          <rect x="10" y="84" width="280" height="8" fill={C.rustDark} />
          {[66, 212].map((x) => <rect key={x} x={x} y="40" width="22" height="52" fill={C.rustDark} />)}
          <path d="M10 70 V54 Q10 40 24 40 H40 V50 H24 Q20 50 20 54 V70 Z" fill={C.brass} />
          <path d="M290 70 V54 Q290 40 276 40 H260 V50 H276 Q280 50 280 54 V70 Z" fill={C.brass} />
        </g>
      )}
    </g>
  )
}

export function SuitcaseLabels({ n = 3 }: { n?: number }) {
  const all = [
    <g key="a" className="swing" style={{ transformOrigin: '128px 128px' }}>
      <circle cx="128" cy="160" r="30" fill={C.paper} />
      <circle cx="128" cy="160" r="24" fill="none" stroke={C.stamp} strokeWidth="2" />
      <text x="128" y="157" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="10" fill={C.stamp}>GALICIA</text>
      <path d="M110 165 h36" stroke={C.stamp} strokeWidth="1.5" />
      <text x="128" y="176" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="7" fill={C.ink}>VAPOR</text>
    </g>,
    <g key="b" transform="rotate(-9 248 160)">
      <rect x="222" y="146" width="56" height="32" rx="4" fill={C.tropic} />
      <rect x="226" y="150" width="48" height="24" rx="2" fill="none" stroke={C.ink} strokeWidth="1" />
      <text x="250" y="166" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="8.5" fill={C.ink}>AMÉRICA</text>
    </g>,
    <g key="c" transform="rotate(7 40 150)">
      <ellipse cx="42" cy="152" rx="22" ry="15" fill={C.teal} />
      <text x="42" y="155" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="7.5" fill={C.paper}>GAXATE</text>
    </g>,
    <g key="d" transform="rotate(-4 180 62)">
      <rect x="150" y="50" width="56" height="26" fill={C.white} />
      <rect x="150" y="50" width="56" height="7" fill={C.stamp} />
      <text x="178" y="71" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="7" fill={C.ink}>EQUIPAJE</text>
    </g>,
    <g key="e" transform="rotate(10 250 62)">
      <circle cx="250" cy="62" r="15" fill={C.brass} />
      <circle cx="250" cy="62" r="10" fill="none" stroke={C.ink} strokeWidth="1" />
      <path d="M243 62 h14 M250 55 v14" stroke={C.ink} strokeWidth="1" />
    </g>,
    <g key="f" transform="rotate(-12 60 62)">
      <rect x="34" y="52" width="50" height="22" rx="11" fill={C.ocean} />
      <text x="59" y="66" textAnchor="middle" fontFamily="Special Elite, monospace" fontSize="7" fill={C.paper}>A BORDO</text>
    </g>,
  ]
  return <g>{all.slice(0, n)}</g>
}
