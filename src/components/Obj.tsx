import type { CSSProperties, ReactNode } from 'react'

/** An absolutely positioned illustration piece (own viewBox, responsive width). */
export function Obj({ viewBox, style, className = '', children }: { viewBox: string; style?: CSSProperties; className?: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} className={`absolute ${className}`} style={{ overflow: 'visible', ...style }} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}
