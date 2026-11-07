import { C, smoothPath } from './palette'

/** Simplified outline of Galicia in a 200×170 box. A Lama ≈ (66,119). */
export const GALICIA_PATH = smoothPath(
  [
    [124, 1], [150, 14], [174, 22], [185, 34], [188, 68], [196, 94], [185, 127], [177, 157], [150, 164], [131, 166], [104, 158], [85, 153], [56, 158], [33, 164],
    [35, 142], [54, 132], [31, 130], [46, 119], [27, 113], [38, 102], [19, 96], [24, 86], [19, 81], [2, 78], [8, 62], [8, 55], [20, 48], [27, 42], [48, 40], [69, 37],
    [78, 30], [85, 26], [96, 12], [110, 3],
  ],
  true,
  0.35,
)
export const A_LAMA: [number, number] = [70, 117]

export function GaliciaMap({ fill = C.moss, stroke = C.ink, dot = true }: { fill?: string; stroke?: string; dot?: boolean }) {
  return (
    <g>
      <path d={GALICIA_PATH} fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      {dot && (
        <g transform={`translate(${A_LAMA[0]} ${A_LAMA[1]})`}>
          <circle r="11" fill={C.stamp} opacity=".25" className="pulse" />
          <circle r="5" fill={C.stamp} stroke={C.white} strokeWidth="2" />
        </g>
      )}
    </g>
  )
}

/** Simplified South America in a 200×260 box. Amazon ≈ (100,62). */
export const SA_PATH = smoothPath(
  [
    [40, 12], [70, 2], [104, 10], [128, 24], [150, 40], [176, 52], [198, 78], [192, 98], [172, 118], [164, 146], [144, 164], [124, 178], [108, 196], [96, 214], [86, 236], [80, 256],
    [70, 252], [66, 226], [64, 196], [60, 166], [54, 136], [36, 108], [20, 88], [10, 64], [16, 40], [28, 22],
  ],
  true,
  0.45,
)
export function SouthAmericaMap({ fill = C.tropic, stroke = C.ink, river = true }: { fill?: string; stroke?: string; river?: boolean }) {
  return (
    <g>
      <path d={SA_PATH} fill={fill} stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
      {river && <path d="M30 56 Q60 66 86 58 T150 50 T180 60" fill="none" stroke={C.ocean} strokeWidth="3" strokeLinecap="round" />}
    </g>
  )
}

/** Iberian peninsula silhouette (very simplified) in a 220×180 box; Galicia at top-left. */
export const IBERIA_PATH = smoothPath(
  [[10, 18], [40, 6], [100, 14], [150, 18], [190, 34], [214, 52], [196, 80], [182, 110], [160, 140], [120, 168], [80, 174], [40, 160], [30, 120], [16, 90], [6, 50]],
  true,
  0.45,
)
