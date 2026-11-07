import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useAnimate } from 'framer-motion'
import { C } from '../art/palette'
import { Ship } from '../art/Ship'
import { Stamp, StampShip, Postmark } from '../art/Postal'
import { Gull, wavePath } from '../art/Nature'
import { Art, ParallaxLayer, SceneCtxProvider } from '../components/Scene'
import { Kicker } from '../components/Card'
import { useMotionMode } from '../lib/motion'
import { countryName, getCountries } from '../lib/countries'
import { centerOn } from '../lib/scroll'
import { useI18n, type Content } from '../lib/i18n'

const EMAIL = 'mercadodelatiani@gmail.com'
type UI = Content['ui']['form']

type Data = { nombre: string; dni: string; empresa: string; direccion: string; pais: string; telefono: string; email: string; info: boolean; apoyo: boolean; observaciones: string; privacidad: boolean; web: string }
const EMPTY: Data = { nombre: '', dni: '', empresa: '', direccion: '', pais: '', telefono: '', email: '', info: false, apoyo: false, observaciones: '', privacidad: false, web: '' }
type Errors = Partial<Record<keyof Data, string>>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(d: Data, u: UI): Errors {
  const e: Errors = {}
  if (d.nombre.trim().length < 2) e.nombre = u.errName
  if (!d.email.trim()) e.email = u.errEmailMissing
  else if (!EMAIL_RE.test(d.email.trim())) e.email = u.errEmailInvalid
  if (d.telefono && !/^[+()\d\s.-]{6,20}$/.test(d.telefono)) e.telefono = u.errPhone
  if (!d.privacidad) e.privacidad = u.errPrivacy
  return e
}

export function buildMailto(d: Data, c: Content, lang: string) {
  const f = c.form
  const u = c.ui.form
  const yes = (b: boolean) => (b ? '[x]' : '[ ]')
  const lines = [
    `${f.title} · ${f.subtitle}`,
    '',
    `${u.mailName}: ${d.nombre.trim()}`,
    `${u.dni}: ${d.dni.trim() || '—'}`,
    `${u.company}: ${d.empresa.trim() || '—'}`,
    `${u.address}: ${d.direccion.trim() || '—'}`,
    `${u.country}: ${countryName(d.pais, lang) || '—'}`,
    `${u.phone}: ${d.telefono.trim() || '—'}`,
    `${u.email}: ${d.email.trim()}`,
    '',
    `${u.wishes}:`,
    `${yes(d.info)} ${f.wish1}`,
    `${yes(d.apoyo)} ${f.wish2}`,
    '',
    `${u.notes}:`,
    d.observaciones.trim() || '—',
    '',
    `${f.privacy}: ${u.mailYes}`,
  ]
  const subject = `${u.mailSubject} · ${f.title} · ${d.nombre.trim()}`
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
}

const field = 'mt-1 block w-full border-0 border-b-2 border-ink/30 bg-transparent px-1 py-2 font-display text-lg text-ink placeholder:text-ink/35 focus:border-stamp focus:outline-none focus:ring-0'
const lbl = 'font-type text-xs uppercase tracking-[0.18em] text-ink/75'

function Input({ id, label, optional, value, onChange, error, type = 'text', required, autoComplete, hint, inputMode }: { id: keyof Data; label: string; optional: string; value: string; onChange: (v: string) => void; error?: string; type?: string; required?: boolean; autoComplete?: string; hint?: string; inputMode?: 'email' | 'tel' | 'text' }) {
  return (
    <div>
      <label htmlFor={`f-${id}`} className={lbl}>
        {label} {required ? <span className="text-stamp" aria-hidden="true">*</span> : <span className="normal-case tracking-normal text-ink/50">{optional}</span>}
      </label>
      <input
        id={`f-${id}`}
        name={id}
        type={type}
        value={value}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `e-${id}` : hint ? `h-${id}` : undefined}
        className={`${field} ${error ? '!border-stamp' : ''}`}
      />
      {hint && !error && <p id={`h-${id}`} className="mt-1 text-sm text-ink/60">{hint}</p>}
      {error && <p id={`e-${id}`} className="mt-1 text-sm font-medium text-stamp">{error}</p>}
    </div>
  )
}

function EnvelopeArt({ sealed }: { sealed: boolean }) {
  return (
    <svg viewBox="0 -10 240 170" className="block w-full drop-shadow-[6px_10px_0_rgba(0,0,0,.2)]" aria-hidden="true" style={{ overflow: 'visible' }}>
      <rect width="240" height="150" fill={C.paperDark} />
      <rect x="2" y="2" width="236" height="146" fill="none" stroke={C.stamp} strokeWidth="5" strokeDasharray="14 14" />
      <rect x="2" y="2" width="236" height="146" fill="none" stroke={C.ocean} strokeWidth="5" strokeDasharray="14 14" strokeDashoffset="14" />
      <path d="M0 150 L120 70 L240 150" fill="none" stroke={C.rust} strokeWidth="1.2" opacity=".5" />
      <motion.path
        d="M0 0 L120 86 L240 0 Z"
        fill="#D8C59E"
        stroke={C.rust}
        strokeWidth="1.2"
        initial={{ scaleY: -1 }}
        animate={{ scaleY: sealed ? 1 : -1 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
        style={{ transformOrigin: '120px 0px' }}
      />
      <motion.g initial={{ scale: 0 }} animate={{ scale: sealed ? 1 : 0 }} transition={{ delay: 0.4, type: 'spring', stiffness: 400, damping: 14 }} style={{ transformOrigin: '120px 84px' }}>
        <circle cx="120" cy="84" r="17" fill={C.stamp} />
        <circle cx="120" cy="84" r="11" fill="none" stroke="#8E241C" strokeWidth="2" />
        <text x="120" y="89" textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="12" fill="#F6D9C8">EM</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, y: -20 }} animate={{ opacity: sealed ? 1 : 0, y: sealed ? 0 : -20 }} transition={{ delay: 0.6 }}>
        <g transform="translate(182 100)"><Stamp w={44} h={54} color={C.stamp}><StampShip w={26} h={36} /></Stamp></g>
        <g transform="translate(176 128) rotate(-12)" opacity=".8"><Postmark r={20} text="GAXATE · CORREOS · " bars={false} strokeWidth={1.4} /></g>
      </motion.g>
      <g stroke={C.ink} strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".7">
        <path d="M30 112 q8 -5 14 0 t14 0 t16 -2 t14 2" /><path d="M30 128 q8 -5 16 0 t14 0 t14 -2" />
      </g>
    </svg>
  )
}

export function S11Apoya() {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useMotionMode()
  const { lang, t: c } = useI18n()
  const f = c.form
  const u = c.ui.form
  const countries = useMemo(() => getCountries(lang), [lang])
  const [d, setD] = useState<Data>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [phase, setPhase] = useState<'idle' | 'sending' | 'done'>('idle')
  const [sealed, setSealed] = useState(false)
  const [mailto, setMailto] = useState('')
  const [copied, setCopied] = useState(false)
  const [scope, animate] = useAnimate()
  const shipRef = useRef<HTMLDivElement>(null)
  const set = <K extends keyof Data>(k: K) => (v: Data[K]) => { setD((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined })) }

  // re-word any visible validation messages when the language changes
  useEffect(() => {
    setErrors((prev) => {
      const keys = (Object.keys(prev) as (keyof Data)[]).filter((k) => prev[k])
      if (!keys.length) return prev
      const fresh = validate(d, u)
      const next: Errors = {}
      for (const k of keys) if (fresh[k]) next[k] = fresh[k]
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [u])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (phase !== 'idle') return
    const errs = validate(d, u)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      document.getElementById(`f-${first}`)?.focus()
      return
    }
    const isBot = d.web.trim() !== ''
    const link = buildMailto(d, c, lang)
    setMailto(link)
    if (!isBot) {
      // open the visitor's mail client with the letter already written
      window.location.href = link
    }
    setPhase('sending')
    const letter = scope.current?.querySelector('[data-letter]')
    if (letter) centerOn(letter)
    await new Promise((r) => setTimeout(r, reduced ? 0 : 650))
    try {
      if (reduced) {
        await animate('[data-letter]', { opacity: 0 }, { duration: 0.3 })
      } else {
        await animate('[data-letter]', { scaleY: 0.34, y: 40, rotateX: 18 }, { duration: 0.7, ease: [0.65, 0, 0.35, 1] })
        animate('[data-envelope]', { opacity: 1, y: 0 }, { duration: 0.4 })
        await animate('[data-letter]', { scale: 0.42, y: 120, opacity: 0 }, { duration: 0.45, ease: 'easeIn' })
        setSealed(true)
        await new Promise((r) => setTimeout(r, 1000))
        const env = scope.current?.querySelector('[data-envelope]') as HTMLElement | null
        const a = env?.getBoundingClientRect()
        const b = shipRef.current?.getBoundingClientRect()
        const dx = a && b ? b.left + b.width / 2 - (a.left + a.width / 2) : window.innerWidth * 0.38
        const dy = a && b ? b.top + b.height * 0.3 - (a.top + a.height / 2) : -window.innerHeight * 0.4
        await animate('[data-envelope]', { x: [0, dx * 0.4, dx], y: [0, dy - 120, dy], scale: 0.06, rotate: [0, -18, -30], opacity: [1, 1, 0] }, { duration: 1.5, ease: 'easeIn' })
      }
    } catch { /* animation interrupted — still show confirmation */ }
    setPhase('done')
    setTimeout(() => {
      const ok = document.getElementById('carta-ok')
      if (ok) { centerOn(ok); ok.focus({ preventScroll: true }) }
    }, 120)
  }

  function reset() {
    setD(EMPTY)
    setErrors({})
    setSealed(false)
    setPhase('idle')
    setCopied(false)
  }

  async function copy() {
    try {
      const body = decodeURIComponent(mailto.split('body=')[1] ?? '')
      await navigator.clipboard.writeText(`${u.mailTo}: ${EMAIL}\n\n${body}`)
      setCopied(true)
    } catch { setCopied(false) }
  }

  return (
    <SceneCtxProvider sectionRef={ref} pinned={false}>
      <section id="apoya" ref={ref} data-scene="apoya" data-bg={C.fog} aria-labelledby="apoya-title" className="scene relative overflow-hidden pb-40 pt-24 sm:pt-28" style={{ background: `linear-gradient(${C.paper}, ${C.fog} 55%, ${C.tealLight})` }}>
        {/* sea, horizon ship and waves drifting in opposite directions */}
        <div className="absolute inset-0" aria-hidden="true">
          <ParallaxLayer speed={0.2} className="absolute inset-0">
            <Art>
              <Gull x={1180} y={420} s={0.8} /><Gull x={1230} y={400} s={0.6} delay={-0.4} />
            </Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.35} drift={-220} className="absolute -inset-x-[20%] inset-y-0">
            <Art><g className="drift-1600"><path d={wavePath(3400, 610, 10, 110)} fill={C.teal} /></g></Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.35} className="absolute inset-0">
            <div ref={shipRef} className="bob absolute" style={{ right: '5%', bottom: 'calc(32% - 4px)', width: 'clamp(110px, 13vw, 210px)' }}>
              <svg viewBox="0 -60 800 340" className="block w-full" style={{ overflow: 'visible' }}><Ship /></svg>
            </div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.6} drift={220} className="absolute -inset-x-[20%] -bottom-[10%] top-0">
            <Art><g className="drift-1600r"><path d={wavePath(3400, 720, 14, 150)} fill={C.ocean} /></g></Art>
          </ParallaxLayer>
          <ParallaxLayer speed={0.9} drift={-260} className="absolute -inset-x-[20%] -bottom-[20%] top-0">
            <Art><g className="drift-1600"><path d={wavePath(3400, 820, 16, 180)} fill={C.oceanDeep} /></g></Art>
          </ParallaxLayer>
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6" ref={scope} style={{ perspective: 1400 }}>
          <div className="mb-8 text-center">
            <div className="flex justify-center"><Kicker n={11}>{c.ui.kickers.apoya}</Kicker></div>
            <h2 id="apoya-title" className="font-display text-[clamp(1.9rem,3.6vw,3.2rem)] font-bold leading-tight">
              {f.title}
              <span className="block text-[0.6em] font-normal italic text-ocean">{f.subtitle}</span>
            </h2>
            <p className="mt-3 text-lg">{f.lead}</p>
          </div>

          <AnimatePresence>
            {phase === 'done' ? (
              <motion.div key="ok" id="carta-ok" tabIndex={-1} role="status" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="paper-card relative mx-auto max-w-xl px-7 py-9 text-center focus:outline-none">
                <svg viewBox="-60 -60 120 120" className="mx-auto h-24 w-24" aria-hidden="true"><Postmark r={54} text={u.sentPostmark} center="✓" bars={false} /></svg>
                <p className="mt-4 font-display text-2xl font-bold">{f.success}</p>
                <p className="mt-4 text-[0.98rem] text-ink/80">
                  {u.sentBefore}
                  <a className="font-semibold text-stamp underline underline-offset-2" href={mailto}>{u.sentReopen}</a>{u.sentOr}
                  <a className="font-semibold text-stamp underline underline-offset-2" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={copy} className="btn-ghost text-ink">{copied ? u.copied : u.copy}</button>
                  <button type="button" onClick={reset} className="btn-stamp">{u.again}</button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form" className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 mx-auto w-[min(520px,88%)] -translate-y-1/2">
                  <motion.div data-envelope initial={{ opacity: 0, y: 60 }}>
                    <EnvelopeArt sealed={sealed} />
                  </motion.div>
                </div>
                <motion.form
                  data-letter
                  noValidate
                  onSubmit={onSubmit}
                  aria-describedby="form-help"
                  className="relative origin-center bg-[#FBF6EA] px-5 py-8 shadow-[0_2px_0_rgba(0,0,0,.05),12px_14px_0_rgba(30,27,24,.14)] sm:px-12 sm:py-12"
                  style={{ backgroundImage: 'linear-gradient(90deg, transparent 38px, rgba(181,53,43,.25) 38px 40px, transparent 40px)', transformStyle: 'preserve-3d' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-display text-lg italic text-ink/80">{u.salutation1}<br />{u.salutation2}</p>
                    <svg viewBox="0 0 70 86" className="w-14 flex-none rotate-6 sm:w-16" aria-hidden="true"><Stamp w={70} h={86} color={C.ocean}><StampShip w={52} h={68} /></Stamp></svg>
                  </div>
                  <p id="form-help" className="mt-4 text-sm text-ink/65">{u.requiredBefore}<span className="text-stamp">*</span>{u.requiredAfter}</p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-2"><Input id="nombre" optional={u.optional} label={u.name} value={d.nombre} onChange={set('nombre')} error={errors.nombre} required autoComplete="name" /></div>
                    <Input id="dni" optional={u.optional} label={u.dni} value={d.dni} onChange={set('dni')} autoComplete="off" />
                    <Input id="empresa" optional={u.optional} label={u.company} value={d.empresa} onChange={set('empresa')} autoComplete="organization" />
                    <div className="sm:col-span-2"><Input id="direccion" optional={u.optional} label={u.address} value={d.direccion} onChange={set('direccion')} autoComplete="street-address" /></div>
                    <div>
                      <label htmlFor="f-pais" className={lbl}>{u.country} <span className="normal-case tracking-normal text-ink/50">{u.optional}</span></label>
                      <select id="f-pais" name="pais" value={d.pais} onChange={(e) => set('pais')(e.target.value)} className={`${field} cursor-pointer`} autoComplete="country-name">
                        <option value="">{u.countryPlaceholder}</option>
                        <optgroup label={u.countryFeatured}>{countries.featured.map((k) => <option key={`f${k.code}`} value={k.code}>{k.name}</option>)}</optgroup>
                        <optgroup label={u.countryAll}>{countries.rest.map((k) => <option key={k.code} value={k.code}>{k.name}</option>)}</optgroup>
                      </select>
                    </div>
                    <Input id="telefono" optional={u.optional} label={u.phone} type="tel" inputMode="tel" value={d.telefono} onChange={set('telefono')} error={errors.telefono} autoComplete="tel" />
                    <div className="sm:col-span-2"><Input id="email" optional={u.optional} label={u.email} type="email" inputMode="email" value={d.email} onChange={set('email')} error={errors.email} required autoComplete="email" /></div>
                  </div>

                  <fieldset className="mt-8">
                    <legend className={lbl}>{u.wishes}</legend>
                    <div className="mt-3 space-y-3">
                      {([['info', f.wish1], ['apoyo', f.wish2]] as const).map(([k, txt]) => (
                        <label key={k} className="flex cursor-pointer items-start gap-3">
                          <input type="checkbox" checked={d[k]} onChange={(e) => set(k)(e.target.checked)} className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[#B5352B]" />
                          <span>{txt}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="mt-8">
                    <label htmlFor="f-observaciones" className={lbl}>{u.notes} <span className="normal-case tracking-normal text-ink/50">{u.optional}</span></label>
                    <textarea id="f-observaciones" name="observaciones" rows={4} maxLength={1200} value={d.observaciones} onChange={(e) => set('observaciones')(e.target.value)} className={`${field} resize-y leading-[2rem]`} style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 31px, rgba(31,78,107,.18) 31px 32px)' }} />
                  </div>

                  {/* honeypot (hidden from people and assistive tech) */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="f-web">{u.honeypot}</label>
                    <input id="f-web" name="web" tabIndex={-1} autoComplete="off" value={d.web} onChange={(e) => set('web')(e.target.value)} />
                  </div>

                  <div className="mt-8">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input id="f-privacidad" type="checkbox" checked={d.privacidad} onChange={(e) => set('privacidad')(e.target.checked)} aria-invalid={errors.privacidad ? true : undefined} aria-describedby={errors.privacidad ? 'e-privacidad' : 'h-privacidad'} className="mt-1 h-5 w-5 flex-none cursor-pointer accent-[#B5352B]" required />
                      <span>{f.privacy} <span className="text-stamp" aria-hidden="true">*</span></span>
                    </label>
                    {errors.privacidad ? (
                      <p id="e-privacidad" className="mt-1 text-sm font-medium text-stamp">{errors.privacidad}</p>
                    ) : (
                      <p id="h-privacidad" className="mt-1 pl-8 text-sm text-ink/60">{u.privacyHint.replace('{email}', EMAIL)}</p>
                    )}
                  </div>

                  <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                    <p className="font-display text-lg italic text-ink/70">{u.closing}</p>
                    <button type="submit" disabled={phase !== 'idle'} className="btn-stamp text-lg disabled:opacity-70">
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="6" width="18" height="12" /><path d="M3 6l9 7 9-7" /></svg>
                      {f.submit}
                    </button>
                  </div>
                  {Object.keys(errors).some((k) => errors[k as keyof Data]) && (
                    <p role="alert" className="mt-4 text-sm font-medium text-stamp">{u.errorSummary}</p>
                  )}
                </motion.form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </SceneCtxProvider>
  )
}
