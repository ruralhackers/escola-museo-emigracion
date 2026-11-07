const FEATURED = ['ES', 'AR', 'UY', 'BR', 'VE', 'CU', 'MX']
const ALL =
  'AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW'.split(' ')

// Browsers often ship without Galician country names (they fall back to Spanish),
// so the countries most relevant to Galician emigration get their Galician name here.
const GL: Record<string, string> = {
  ES: 'España', AR: 'Arxentina', UY: 'Uruguai', BR: 'Brasil', VE: 'Venezuela', CU: 'Cuba', MX: 'México',
  DE: 'Alemaña', FR: 'Francia', GB: 'Reino Unido', US: 'Estados Unidos', PT: 'Portugal', CH: 'Suíza', IT: 'Italia',
  NL: 'Países Baixos', BE: 'Bélxica', CL: 'Chile', CO: 'Colombia', PE: 'Perú', PY: 'Paraguai', BO: 'Bolivia',
  EC: 'Ecuador', PA: 'Panamá', DO: 'República Dominicana', PR: 'Porto Rico', CA: 'Canadá', AU: 'Australia',
  AD: 'Andorra', IE: 'Irlanda', MA: 'Marrocos', JP: 'Xapón', CN: 'China', RU: 'Rusia', SE: 'Suecia', NO: 'Noruega',
  DK: 'Dinamarca', GR: 'Grecia', AT: 'Austria', PL: 'Polonia', LU: 'Luxemburgo', MC: 'Mónaco', CR: 'Costa Rica',
  GT: 'Guatemala', HN: 'Honduras', NI: 'Nicaragua', SV: 'O Salvador',
}

function nameOf(code: string, dn: Intl.DisplayNames | null, lang = 'es') {
  if (lang === 'gl' && GL[code]) return GL[code]
  try { return dn?.of(code) ?? code } catch { return code }
}

export type Country = { code: string; name: string }

/** Country names in the visitor's language (gl · es · en), Spanish as fallback. Values are ISO codes. */
export function getCountries(lang: string = 'es') {
  let dn: Intl.DisplayNames | null = null
  try { dn = new Intl.DisplayNames([lang, 'es'], { type: 'region' }) } catch { dn = null }
  const one = (code: string): Country => ({ code, name: nameOf(code, dn, lang) })
  const featured = FEATURED.map(one)
  const rest = ALL.filter((c) => !FEATURED.includes(c))
    .map(one)
    .sort((a, b) => a.name.localeCompare(b.name, lang))
  return { featured, rest }
}

export function countryName(code: string, lang: string = 'es') {
  if (!code) return ''
  let dn: Intl.DisplayNames | null = null
  try { dn = new Intl.DisplayNames([lang, 'es'], { type: 'region' }) } catch { dn = null }
  return nameOf(code, dn, lang)
}
