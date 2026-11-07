import type { ReactNode } from 'react'

export function PaperCard({ children, className = '', tilt = 0, tape = true }: { children: ReactNode; className?: string; tilt?: number; tape?: boolean }) {
  return (
    <div className={`paper-card relative px-6 py-7 sm:px-8 sm:py-9 ${className}`} style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}>
      {tape && <span aria-hidden="true" className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-3deg]" />}
      {children}
    </div>
  )
}

export function Kicker({ n, children, light = false }: { n: number; children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-3 flex items-center gap-3 font-type text-xs uppercase tracking-[0.28em] ${light ? 'text-tropic' : 'text-stamp'}`}>
      <span className={`grid h-7 w-7 place-items-center rounded-full border-2 ${light ? 'border-tropic' : 'border-stamp'} text-[11px] tracking-normal`}>{String(n).padStart(2, '0')}</span>
      {children}
    </p>
  )
}
