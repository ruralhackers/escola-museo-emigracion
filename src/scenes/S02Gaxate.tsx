import { C } from '../art/palette'
import { Emigrant } from '../art/Figures'
import { Horreo, IndianoHouse } from '../art/Buildings'
import { Cloud, Hill, Mist, Oak, Cypress } from '../art/Nature'
import { GaliciaMap } from '../art/Maps'
import { Art, ParallaxLayer, Reveal, Scene } from '../components/Scene'
import { Obj } from '../components/Obj'
import { Kicker, PaperCard } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { useT } from '../lib/i18n'

function Sky() {
  return (
    <ParallaxLayer speed={0.12} drift={-120} className="absolute -inset-x-[10%] inset-y-0">
      <Art>
        <g transform="translate(200 90) scale(.9)"><Cloud fill={C.white} opacity={0.75} /></g>
        <g transform="translate(1100 150) scale(.7)"><Cloud fill={C.white} opacity={0.6} /></g>
      </Art>
    </ParallaxLayer>
  )
}
function FarHills() {
  return (
    <ParallaxLayer speed={0.25} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={470} amp={130} seed={21} fill={C.tealLight} n={5} />
        <Hill width={1600} base={540} amp={90} seed={22} fill={C.mossLight} n={6} />
      </Art>
    </ParallaxLayer>
  )
}
function MistLayer({ y, drift, op }: { y: number; drift: number; op: number }) {
  return (
    <ParallaxLayer speed={0.4} drift={drift} className="absolute -inset-x-[15%] inset-y-0">
      <Art><Mist width={1600} y={y} opacity={op} /></Art>
    </ParallaxLayer>
  )
}
function Village() {
  const houses = [
    { x: 300, y: 430, s: 0.5, wall: C.paper, tower: true },
    { x: 560, y: 470, s: 0.42, wall: C.tropicLight, tower: false, gallery: true },
    { x: 980, y: 440, s: 0.52, wall: C.white, tower: true, flip: true },
    { x: 1230, y: 480, s: 0.4, wall: C.fogLight, tower: false },
    { x: 760, y: 420, s: 0.36, wall: C.paperDark, tower: true },
  ]
  return (
    <ParallaxLayer speed={0.6} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={600} amp={60} seed={31} fill={C.moss} n={7} />
        {houses.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${h.y + (1 - h.s) * 40}) scale(${h.s})`}>
            <IndianoHouse wall={h.wall} tower={h.tower} gallery={h.gallery !== false} flip={h.flip} />
          </g>
        ))}
        {[220, 470, 700, 900, 1160, 1380].map((x, i) => (
          <g key={x} transform={`translate(${x} ${500 + (i % 2) * 30}) scale(${0.6 + (i % 3) * 0.12})`}>
            {i % 3 === 1 ? <Cypress /> : <Oak />}
          </g>
        ))}
      </Art>
    </ParallaxLayer>
  )
}
function NearField() {
  return (
    <ParallaxLayer speed={1.05} className="absolute inset-0">
      <Art>
        <Hill width={1600} base={760} amp={50} seed={41} fill={C.mossDark} n={5} />
        <path d="M640 1200 C700 900 860 860 880 740 C890 700 860 690 840 680" stroke={C.paperDark} strokeWidth="46" fill="none" strokeLinecap="round" />
        <path d="M640 1200 C700 900 860 860 880 740" stroke={C.stone} strokeWidth="6" strokeDasharray="10 30" fill="none" />
        <g transform="translate(1080 640) scale(.85)"><Horreo /></g>
        <g transform="translate(80 600) scale(1.1)"><Oak fill={C.ink} light={C.mossDark} /></g>
        <g fill={C.mossLight} opacity=".7">
          {[120, 300, 460, 1000, 1300, 1480].map((x) => <path key={x} d={`M${x} 790 l6 -24 l6 24 l6 -18 l6 18z`} />)}
        </g>
      </Art>
    </ParallaxLayer>
  )
}
function Foreground() {
  return (
    <ParallaxLayer speed={1.6} drift={60} scale={[1, 0.82]} className="pointer-events-none absolute inset-0" style={{ transformOrigin: '60% 100%' }}>
      <Obj viewBox="0 0 120 300" style={{ left: '56%', bottom: '2%', width: 'clamp(64px, 8.5vw, 150px)' }}>
        <Emigrant coat={C.inkSoft} />
      </Obj>
    </ParallaxLayer>
  )
}

function MapCutout({ className = '' }: { className?: string }) {
  const all = useT()
  return (
    <figure className={`paper-card relative w-[190px] p-3 sm:w-[220px] ${className}`} style={{ transform: 'rotate(4deg)' }}>
      <span aria-hidden="true" className="tape -top-3 left-6 rotate-[-8deg] !w-16" />
      <svg viewBox="-6 -6 212 182" className="w-full" role="img" aria-label={all.ui.art.galiciaMap}>
        <rect x="-6" y="-6" width="212" height="182" fill={C.fogLight} />
        <GaliciaMap fill={C.mossLight} />
        <text x="82" y="122" fontFamily="Special Elite, monospace" fontSize="10" fill={C.ink}>A Lama</text>
      </svg>
      <figcaption className="mt-1 text-center font-type text-[11px] uppercase tracking-widest text-ink/80">Galicia · A Lama · Gaxate</figcaption>
    </figure>
  )
}

export function S02Gaxate() {
  const { mode } = useMotionMode()
  const all = useT()
  const t = all.gaxate
  const full = mode === 'full'
  return (
    <Scene
      id="gaxate"
      bg={C.fog}
      pin="220vh"
      labelledBy="gaxate-title"
      artLabel={all.ui.art.gaxate}
      textClass="flex items-center px-[5vw]"
      art={
        <div className="absolute inset-0" style={{ background: `linear-gradient(${C.fogLight}, ${C.fog})` }}>
          <Sky />
          <FarHills />
          <MistLayer y={430} drift={180} op={0.45} />
          <Village />
          <MistLayer y={575} drift={-200} op={0.35} />
          <NearField />
          <Foreground />
        </div>
      }
    >
      <Reveal className={full ? 'max-w-[min(520px,42vw)]' : ''}>
        <PaperCard tilt={full ? -1.2 : 0}>
          <Kicker n={2}>{all.ui.kickers.gaxate}</Kicker>
          <h2 id="gaxate-title" className="font-display text-[clamp(1.7rem,3vw,2.6rem)] font-bold leading-tight">{t.title}</h2>
          <p className="mt-4">{t.text}</p>
          <p className="mt-5 border-l-4 border-moss pl-4 font-display text-lg italic text-ink/90">{t.fact}</p>
        </PaperCard>
      </Reveal>
      {full ? (
        <Reveal className="absolute right-[7vw] top-[14vh]" delay={0.2}>
          <MapCutout />
        </Reveal>
      ) : (
        <Reveal className="mt-8 flex justify-center" delay={0.1}>
          <MapCutout />
        </Reveal>
      )}
    </Scene>
  )
}
