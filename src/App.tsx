import { useCallback, useEffect, useState } from 'react'
import { Preloader } from './components/Preloader'
import { MenuOverlay, SceneDots, ScrollRoute, TopBar } from './components/Chrome'
import { useMotionMode } from './lib/motion'
import { useT } from './lib/i18n'
import { scrollToId, startLenis, stopLenis } from './lib/scroll'
import { S01Puerto } from './scenes/S01Puerto'
import { S02Gaxate } from './scenes/S02Gaxate'
import { S03Escuela } from './scenes/S03Escuela'
import { S04PorQue } from './scenes/S04PorQue'
import { S05Propuesta } from './scenes/S05Propuesta'
import { S06Viaje } from './scenes/S06Viaje'
import { S07Maleta } from './scenes/S07Maleta'
import { S08CasaMuseo } from './scenes/S08CasaMuseo'
import { S09Ruta } from './scenes/S09Ruta'
import { S11Apoya } from './scenes/S11Apoya'
import { Footer } from './scenes/S12Footer'

export default function App() {
  const { reduced } = useMotionMode()
  const t = useT()
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState('inicio')
  const [bg, setBg] = useState('#C9D3D6')
  const [menu, setMenu] = useState(false)

  // smooth inertial scrolling (off with reduced motion)
  useEffect(() => {
    if (reduced) { stopLenis(); return }
    startLenis()
    return () => stopLenis()
  }, [reduced])

  // active scene → hash, dots and page colour
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-scene]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const id = (e.target as HTMLElement).dataset.scene!
            setActive(id)
            setBg((e.target as HTMLElement).dataset.bg || '#F1E6CF')
          }
        }
      },
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!ready) return
    const cur = location.hash.slice(1)
    if (cur !== active) history.replaceState(null, '', active === 'inicio' && !cur ? location.pathname + location.search : `#${active}`)
  }, [active, ready])

  const onDone = useCallback(() => {
    setReady(true)
    const h = decodeURIComponent(location.hash.slice(1))
    if (h && document.getElementById(h)) requestAnimationFrame(() => scrollToId(h, { immediate: true }))
  }, [])

  useEffect(() => {
    document.documentElement.style.backgroundColor = bg
  }, [bg])

  return (
    <div className="grain">
      <a href="#contenido" className="skip-link" onClick={(e) => { e.preventDefault(); scrollToId('inicio') }}>
        {t.ui.skip}
      </a>
      {!ready && <Preloader onDone={onDone} />}
      <div aria-hidden="true" className="fixed inset-0 -z-10 transition-colors duration-1000" style={{ backgroundColor: bg }} />
      <ScrollRoute />
      <TopBar active={active} onMenu={() => setMenu(true)} />
      <SceneDots active={active} />
      <MenuOverlay open={menu} onClose={() => setMenu(false)} active={active} />
      <main id="contenido">
        <S01Puerto />
        <S02Gaxate />
        <S03Escuela />
        <S04PorQue />
        <S05Propuesta />
        <S06Viaje />
        <S07Maleta />
        <S08CasaMuseo />
        <S09Ruta />
        <S11Apoya />
      </main>
      <Footer />
    </div>
  )
}
