import { createContext, useContext, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useMotionMode } from '../lib/motion'

type SceneCtxT = { ref: RefObject<HTMLElement | null>; pinned: boolean }
const SceneCtx = createContext<SceneCtxT | null>(null)
export const useScene = () => useContext(SceneCtx)

/**
 * A full-viewport "tableau". In full mode the stage is sticky inside a tall section (pinned);
 * in lite/reduced modes it becomes a stacked chapter: illustration box first, text below.
 */
export function Scene({
  id,
  bg,
  dark = false,
  pin = '200vh',
  art,
  artLabel,
  children,
  textClass = 'flex items-center justify-center',
  stackedAspect = 'aspect-[4/3] sm:aspect-[16/10]',
  labelledBy,
}: {
  id: string
  bg: string
  dark?: boolean
  pin?: string | 'none'
  art: ReactNode
  artLabel: string
  children?: ReactNode
  textClass?: string
  stackedAspect?: string
  labelledBy?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { mode } = useMotionMode()
  const isFull = mode === 'full'
  const pinned = isFull && pin !== 'none'
  const sectionStyle: CSSProperties = { backgroundColor: bg }
  if (pinned) sectionStyle.height = pin

  return (
    <SceneCtx.Provider value={{ ref, pinned }}>
      <section
        id={id}
        ref={ref}
        data-scene={id}
        data-bg={bg}
        aria-labelledby={labelledBy}
        className={`scene relative ${dark ? 'text-paper' : 'text-ink'}`}
        style={sectionStyle}
      >
        {isFull ? (
          <div className={`${pinned ? 'sticky top-0' : 'relative'} h-[100svh] min-h-[560px] w-full overflow-hidden`}>
            <div role="img" aria-label={artLabel} className="absolute inset-0">
              {art}
            </div>
            <div className={`absolute inset-0 z-20 ${textClass}`}>{children}</div>
          </div>
        ) : (
          <div className="relative">
            <div role="img" aria-label={artLabel} className={`relative w-full overflow-hidden ${stackedAspect} max-h-[80vh]`}>
              {art}
            </div>
            <div className="relative z-10 mx-auto max-w-2xl px-5 pb-16 pt-8 sm:px-8">{children}</div>
          </div>
        )}
      </section>
    </SceneCtx.Provider>
  )
}

/**
 * Parallax layer à la boy-coy: each layer has its own speed multiplier and inertia (spring).
 *  speed: vertical travel factor (sky .2 · far .4 · mid .7 · near 1.1 · foreground 1.6–2)
 *  drift: horizontal travel in px over the scene (negative = leftwards)
 */
export function ParallaxLayer({
  speed = 0.5,
  drift = 0,
  scale,
  rotate,
  className = 'absolute inset-0',
  style,
  children,
  z,
}: {
  speed?: number
  drift?: number
  scale?: [number, number]
  rotate?: [number, number]
  className?: string
  style?: CSSProperties
  children: ReactNode
  z?: number
}) {
  const ctx = useScene()
  const { mode } = useMotionMode()
  const { scrollYProgress } = useScroll({
    target: ctx?.ref,
    offset: ctx?.pinned ? ['start start', 'end end'] : ['start end', 'end start'],
  })
  const k = mode === 'full' ? 1 : mode === 'lite' ? 0.25 : 0
  const dist = ctx?.pinned ? 260 : 160
  const spring = { stiffness: 80, damping: 20, mass: 0.6 }
  const y = useSpring(useTransform(scrollYProgress, [0, 1], ctx?.pinned ? [0, -110 * speed * k] : [dist * speed * k * 0.5, -dist * speed * k * 0.5]), spring)
  const x = useSpring(useTransform(scrollYProgress, [0, 1], [0, drift * (mode === 'reduced' ? 0 : mode === 'lite' ? 0.4 : 1)]), spring)
  const sc = useTransform(scrollYProgress, [0, 1], scale && mode === 'full' ? scale : [1, 1])
  const rot = useTransform(scrollYProgress, [0, 1], rotate && mode === 'full' ? rotate : [0, 0])
  if (mode === 'reduced') {
    return (
      <div className={className} style={{ ...style, zIndex: z }} aria-hidden="true">
        {children}
      </div>
    )
  }
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      style={{ ...style, zIndex: z, y, x, scale: sc, rotate: rot, willChange: mode === 'full' ? 'transform' : undefined }}
    >
      {children}
    </motion.div>
  )
}

/** Full-bleed SVG canvas for a layer. */
export function Art({
  children,
  viewBox = '0 0 1600 900',
  align = 'xMidYMax slice',
  className = 'absolute inset-0 h-full w-full',
}: {
  children: ReactNode
  viewBox?: string
  align?: string
  className?: string
}) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio={align} className={className} style={{ overflow: 'visible' }} aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}

/** Fade/slide in when visible (opacity only with reduced motion). */
export function Reveal({ children, delay = 0, className, y = 28, as = 'div' }: { children: ReactNode; delay?: number; className?: string; y?: number; as?: 'div' | 'li' | 'p' }) {
  const { mode } = useMotionMode()
  const M = as === 'li' ? motion.li : as === 'p' ? motion.p : motion.div
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: mode === 'reduced' ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: mode === 'reduced' ? 0.4 : 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}

export function SceneCtxProvider({ sectionRef, pinned, children }: { sectionRef: RefObject<HTMLElement | null>; pinned: boolean; children: ReactNode }) {
  return <SceneCtx.Provider value={{ ref: sectionRef, pinned }}>{children}</SceneCtx.Provider>
}
