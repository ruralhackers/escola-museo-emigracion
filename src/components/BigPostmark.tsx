import { motion, useTransform, type MotionValue } from 'framer-motion'

/** A large HTML postmark (real text) that "stamps" when progress crosses [from, to]. */
export function BigPostmark({ p, from, to, text, ring, className = '', size = 'clamp(120px, 14vw, 200px)', color = '#B5352B' }: { p: MotionValue<number>; from: number; to: number; text: string; ring: string; className?: string; size?: string; color?: string }) {
  const scale = useTransform(p, [from, to], [2.2, 1], { clamp: true })
  const opacity = useTransform(p, [from, from + (to - from) * 0.4], [0, 0.92], { clamp: true })
  return (
    <motion.div className={`pointer-events-none grid place-items-center rounded-full ${className}`} style={{ width: size, height: size, scale, opacity, rotate: -12, border: `4px solid ${color}`, color, boxShadow: `inset 0 0 0 8px transparent, inset 0 0 0 11px ${color}` }}>
      <div className="text-center">
        <p className="font-type text-[clamp(0.55rem,0.8vw,0.75rem)] uppercase tracking-[0.25em]">{ring}</p>
        <p className="font-type text-[clamp(2rem,4.2vw,3.6rem)] leading-none">{text}</p>
        <p className="font-type text-[clamp(0.55rem,0.8vw,0.75rem)] uppercase tracking-[0.25em]">Gaxate</p>
      </div>
    </motion.div>
  )
}
