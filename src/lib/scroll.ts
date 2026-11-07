import Lenis from 'lenis'

let lenis: Lenis | null = null
let raf = 0

export function startLenis() {
  if (lenis) return lenis
  lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), smoothWheel: true, wheelMultiplier: 0.9 })
  const loop = (time: number) => { lenis?.raf(time); raf = requestAnimationFrame(loop) }
  raf = requestAnimationFrame(loop)
  return lenis
}

export function stopLenis() {
  cancelAnimationFrame(raf)
  lenis?.destroy()
  lenis = null
}

export function scrollToId(id: string, opts: { immediate?: boolean } = {}) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis && !opts.immediate) {
    lenis.resize()
    const target = window.scrollY + el.getBoundingClientRect().top
    lenis.scrollTo(target, { duration: 1.6, force: true, easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) })
  } else if (lenis) {
    lenis.resize()
    lenis.scrollTo(window.scrollY + el.getBoundingClientRect().top, { immediate: true, force: true })
  } else {
    const reduce = document.documentElement.classList.contains('reduce-motion')
    el.scrollIntoView({ behavior: opts.immediate || reduce ? 'auto' : 'smooth', block: 'start' })
  }
  history.replaceState(null, '', `#${id}`)
  // move keyboard focus to the scene heading region for screen-reader users
  const focusTarget = el.querySelector<HTMLElement>('h1, h2') ?? el
  if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1')
  focusTarget.focus({ preventScroll: true })
}

export function lockScroll(lock: boolean) {
  if (lenis) lock ? lenis.stop() : lenis.start()
  document.documentElement.style.overflow = lock ? 'hidden' : ''
}

/** Bring an element's centre to the middle of the viewport. */
export function centerOn(el: Element) {
  lenis?.resize()
  const r = el.getBoundingClientRect()
  const offset = r.height / 2 - window.innerHeight / 2
  const target = window.scrollY + r.top + offset
  if (lenis) lenis.scrollTo(target, { duration: 0.9, force: true })
  else window.scrollTo({ top: target, behavior: document.documentElement.classList.contains('reduce-motion') ? 'auto' : 'smooth' })
}
