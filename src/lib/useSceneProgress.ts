import { useEffect, type RefObject } from 'react'
import { animate, useInView, useMotionValue, useScroll, type MotionValue } from 'framer-motion'
import { useMotionMode } from './motion'

/**
 * Unified 0→1 progress for a scene.
 *  - full: driven by scrolling through a tall (pinned) section
 *  - lite: plays once from 0→1 when the chapter enters the viewport
 *  - reduced: jumps straight to the final state (1)
 */
export function useSceneProgress(
  ref: RefObject<HTMLElement | null>,
  opts: { offset?: any; duration?: number } = {},
): MotionValue<number> {
  const { mode } = useMotionMode()
  const { scrollYProgress } = useScroll({ target: ref, offset: opts.offset ?? ['start start', 'end end'] })
  const played = useMotionValue(mode === 'reduced' ? 1 : 0)
  const inView = useInView(ref, { once: true, amount: 0.25 })

  useEffect(() => {
    if (mode === 'reduced') { played.set(1); return }
    if (mode === 'lite' && inView) {
      const c = animate(played, 1, { duration: opts.duration ?? 2.2, ease: [0.22, 1, 0.36, 1] })
      return () => c.stop()
    }
  }, [mode, inView, played, opts.duration])

  return mode === 'full' ? scrollYProgress : played
}
