export const C = {
  oceanDeep: '#0F2A3D',
  ocean: '#1F4E6B',
  oceanMid: '#2C5F7C',
  teal: '#3E7C86',
  tealLight: '#6E9EA3',
  fog: '#C9D3D6',
  fogLight: '#DFE5E5',
  paper: '#F1E6CF',
  paperDark: '#E2D1AE',
  white: '#FBF6EA',
  ink: '#1E1B18',
  inkSoft: '#3A3530',
  rust: '#8A4B2A',
  rustDark: '#5E301A',
  stamp: '#B5352B',
  roof: '#9C4A2E',
  brass: '#C29A4B',
  moss: '#5E7A4A',
  mossDark: '#3F5734',
  mossLight: '#8DA06B',
  tropic: '#D9A441',
  tropicLight: '#E9C27A',
  stone: '#B3AE9C',
  stoneDark: '#8F8A78',
} as const

/** deterministic pseudo random generator so illustrations are identical on every render */
export function rng(seed: number) {
  let s = seed % 2147483647
  if (s <= 0) s += 2147483646
  return () => (s = (s * 16807) % 2147483647) / 2147483647
}

/** Catmull-Rom → cubic Bézier path through points */
export function smoothPath(pts: [number, number][], closed = false, t = 0.5) {
  if (pts.length < 2) return ''
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]]
  let d = `M${p[1][0].toFixed(1)} ${p[1][1].toFixed(1)}`
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2]
    const c1x = x1 + ((x2 - x0) / 6) * t * 2, c1y = y1 + ((y2 - y0) / 6) * t * 2
    const c2x = x2 - ((x3 - x1) / 6) * t * 2, c2y = y2 - ((y3 - y1) / 6) * t * 2
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
  }
  return closed ? d + ' Z' : d
}

/** safe id for SVG url(#id) references */
export const safeId = (id: string) => 'i' + id.replace(/[^a-zA-Z0-9_-]/g, '')
