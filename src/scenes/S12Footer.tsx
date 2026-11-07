import { C } from '../art/palette'
import { wavePath } from '../art/Nature'
import { GaliciaMap } from '../art/Maps'
import { scrollToId } from '../lib/scroll'
import { useT } from '../lib/i18n'

export function Footer() {
  const c = useT()
  const id = c.identity
  const u = c.ui.footer
  return (
    <footer className="on-dark relative overflow-hidden bg-ocean-deep text-paper" aria-labelledby="footer-title">
      <svg viewBox="0 0 1600 160" preserveAspectRatio="none" className="block h-20 w-full sm:h-28" aria-hidden="true">
        <rect width="1600" height="160" fill={C.tealLight} />
        <path d={wavePath(1600, 40, 12, 140, 160)} fill={C.teal} />
        <path d={wavePath(1600, 80, 12, 110, 160)} fill={C.ocean} />
        <path d={wavePath(1600, 120, 10, 160, 160)} fill={C.oceanDeep} />
      </svg>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 pb-14 pt-10 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p id="footer-title" className="font-display text-3xl font-bold">{id.name}</p>
          <p className="mt-1 font-display text-xl italic text-tropic" lang="gl">{id.motto}</p>
          <p className="mt-4 max-w-md text-paper/85">{c.footer.line1}</p>
          <svg viewBox="-10 -10 620 200" className="mt-8 w-full max-w-md" role="img" aria-label={c.ui.art.footerMap}>
            <path d="M30 150 C150 40 380 20 500 90" fill="none" stroke={C.paper} strokeOpacity=".7" strokeWidth="2.5" strokeDasharray="4 8" />
            <path d="M0 120 Q30 110 50 150 Q40 180 20 190 H0Z" fill={C.tropic} opacity=".8" />
            <g transform="translate(480 40) scale(.6)"><GaliciaMap fill={C.moss} stroke={C.paper} /></g>
            <text x="520" y="150" fontFamily="Special Elite, monospace" fontSize="16" fill={C.paper}>Gaxate</text>
          </svg>
        </div>
        <div>
          <h2 className="font-type text-xs uppercase tracking-[0.25em] text-tropic">{u.contact}</h2>
          <address className="mt-4 space-y-2 not-italic">
            <p><span className="text-paper/60">{u.contactPerson}</span> {id.contactName}</p>
            <p><a className="underline decoration-tropic underline-offset-4 hover:text-tropic" href={`mailto:${id.email}`}>{id.email}</a></p>
            <p>{id.address}</p>
            <p className="text-paper/70">{u.seat}</p>
          </address>
          <h2 className="mt-8 font-type text-xs uppercase tracking-[0.25em] text-tropic">{u.credits}</h2>
          <ul className="mt-3 space-y-1 text-sm text-paper/80">
            {c.footer.credits.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
        <nav aria-label={u.navLabel}>
          <h2 className="font-type text-xs uppercase tracking-[0.25em] text-tropic">{u.voyage}</h2>
          <ol className="mt-4 space-y-1.5">
            {c.nav.map((n, i) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => { e.preventDefault(); scrollToId(n.id) }} className="hover:text-tropic">
                  <span className="mr-2 font-type text-xs text-paper/50">{String(i + 1).padStart(2, '0')}</span>{n.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </footer>
  )
}
