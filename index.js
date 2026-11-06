export const COMPANIES_RESOURCE_ID = 'f004176c-b85f-4542-8901-7b3176f9a054'
export const DATA_API = 'https://data.gov.il/api/3/action'
export const DATASET_URL = 'https://data.gov.il/he/datasets/ministry_of_justice/ica_companies'
export const COMPANY_PREFIXES = ['51', '52', '56']

const DEFAULT_TIMEOUT_MS = 15000
const MAX_NAME_TOKENS = 8
const NAME_MIN_LETTERS = 2

const FIELD = {
  number: 'מספר חברה',
  name: 'שם חברה',
  englishName: 'שם באנגלית',
  type: 'סוג תאגיד',
  status: 'סטטוס חברה',
  subStatus: 'תת סטטוס',
  violation: 'מפרה',
  description: 'תאור חברה',
  purpose: 'מטרת החברה',
  founded: 'תאריך התאגדות',
  government: 'חברה ממשלתית',
  liability: 'מגבלות',
  lastReport: 'שנה אחרונה של דוח שנתי (שהוגש)',
  city: 'שם עיר',
  street: 'שם רחוב',
  house: 'מספר בית',
  zip: 'מיקוד',
  poBox: 'ת.ד.',
  country: 'מדינה',
  careOf: 'אצל',
}

const SEPARATORS = /[\s\-‐-―־./‎‏‪-‮]/g
const HEBREW_LETTER = /[א-ת]/
const LATIN_LETTER = /[a-z]/
const SUFFIX_TOKENS = new Set(['בעמ', 'ltd', 'limited'])
const WEIGHTS = [1, 2, 1, 2, 1, 2, 1, 2, 1]

export const corporatePrefixes = [
  { prefix: '51', label: 'חברה ישראלית', english: 'Israeli company' },
  { prefix: '52', label: 'חברה ישראלית', english: 'Israeli company' },
  { prefix: '53', label: 'שותפות זרה שנרשמה בישראל', english: 'Foreign partnership registered in Israel' },
  { prefix: '54', label: 'שותפות ישראלית', english: 'Israeli partnership' },
  { prefix: '55', label: 'שותפות ישראלית', english: 'Israeli partnership' },
  { prefix: '56', label: 'חברת חוץ שנרשמה בישראל', english: 'Foreign company registered in Israel' },
  { prefix: '58', label: 'עמותה', english: 'Non-profit association (amuta)' },
]

export const statusCatalog = [
  {
    status: 'פעילה',
    tone: 'active',
    text: 'החברה רשומה כפעילה: היא לא נמחקה, לא חוסלה ולא נמצאת בפירוק. זה לא אומר שהיא מנהלת עסקים בפועל.',
  },
  {
    status: 'פעילה זמנית',
    tone: 'caution',
    text: 'חברה שנמחקה או חוסלה והוחזרה למרשם בהחייאה, למשל בצו של בית משפט כדי להשלים פעולה מסוימת. הסטטוס מסמן שהיא לא אמורה לנהל עסקים רגילים.',
  },
  {
    status: 'פעילה/בפירוק - הליך פשרה או הסדר/פירוק זמני',
    tone: 'caution',
    text: 'החברה בהליך של פשרה או הסדר עם הנושים או בעלי המניות, או שמונה לה מפרק זמני.',
  },
  {
    status: 'פעילה/בפירוק - בכינוס נכסים',
    tone: 'caution',
    text: 'מונה לחברה כונס נכסים, שמנהל או מממש נכסים שלה כדי לשלם לנושים.',
  },
  {
    status: 'בפרוק מרצון',
    tone: 'caution',
    text: 'בעלי המניות החליטו לסגור את החברה, והדירקטורים הצהירו שהיא יכולה לשלם את כל החובות שלה. נאמן מוכר את הנכסים, משלם לנושים ומחלק את היתרה.',
  },
  {
    status: 'בפרוק ע״י בימ״ש',
    tone: 'caution',
    text: 'בית משפט הורה לפרק את החברה ומינה נאמן שמנהל את הפירוק. מי שהחברה חייבת לו כסף מגיש תביעת חוב לנאמן.',
  },
  {
    status: 'מחוקה',
    tone: 'ended',
    text: 'רשם החברות מחק את החברה מהמרשם, למשל אחרי שנים בלי אגרה שנתית ובלי דוח שנתי. חברה מחוקה נחשבת מחוסלת.',
  },
  { status: 'מחוסלת מרצון', tone: 'ended', text: 'הפירוק מרצון הסתיים, והרשם רשם את החברה כמחוסלת.' },
  { status: 'חיסול ע״י בימ״ש', tone: 'ended', text: 'הפירוק בבית המשפט הסתיים, ובית המשפט הורה על חיסול החברה.' },
  {
    status: 'מחוסלת עקב מיזוג',
    tone: 'ended',
    text: 'החברה התמזגה לתוך חברה אחרת. הנכסים והחובות שלה עברו לחברה הקולטת, והיא עצמה חוסלה.',
  },
  {
    status: 'נגרעה מהמרשם',
    tone: 'ended',
    text: 'חברת חוץ שהוצאה ממרשם חברות החוץ בישראל. ייתכן שהיא ממשיכה להתקיים במדינה שבה התאגדה.',
  },
]

const typeCatalog = {
  'ישראלית חברה פרטית': { label: 'חברה פרטית', english: 'Private company' },
  'ישראלית חברה ציבורית': { label: 'חברה ציבורית', english: 'Public company' },
  'ישראלית חברה אגח': { label: 'חברת אג״ח', english: 'Bond-issuing company' },
  'חוץ חברה פרטית': { label: 'חברת חוץ', english: 'Foreign company' },
  'חוץ חברה ציבורית': { label: 'חברת חוץ ציבורית', english: 'Foreign public company' },
}

export const violationCatalog = {
  violator: {
    label: 'מפרת חוק',
    text: 'רשם החברות רשם שהחברה לא שילמה אגרה שנתית או לא הגישה דוח שנתי, לפי סעיף 362א לחוק החברות.',
  },
  warning: {
    label: 'התראה לפני רישום כמפרת חוק',
    text: 'רשם החברות רשם התראה שבכוונתו לרשום את החברה כמפרת חוק. אם ההפרה לא תתוקן בתוך 30 ימים, החברה תירשם כמפרה.',
  },
}

export class CompanyLookupError extends Error {
  constructor(code, message) {
    super(message)
    this.name = 'CompanyLookupError'
    this.code = code
  }
}

const digitsOf = (value) => String(value ?? '').replace(SEPARATORS, '')

export function isValidIsraeliId(value) {
  const digits = digitsOf(value)
  if (!/^\d{1,9}$/.test(digits) || /^0+$/.test(digits)) return false
  const sum = [...digits.padStart(9, '0')].reduce((total, char, index) => {
    const product = Number(char) * WEIGHTS[index]
    return total + (product > 9 ? product - 9 : product)
  }, 0)
  return sum % 10 === 0
}

export function entityOf(number) {
  const digits = digitsOf(number)
  return corporatePrefixes.find((item) => digits.startsWith(item.prefix)) ?? null
}

export function checkCompanyNumber(value) {
  const digits = digitsOf(value)
  if (!digits) return { valid: false, reason: 'empty', message: 'לא הוקלד מספר.' }
  if (!/^\d+$/.test(digits)) return { valid: false, reason: 'not-digits', message: 'במספר חברה יש רק ספרות.' }
  if (digits.length !== 9) {
    return { valid: false, reason: 'length', message: `מספר חברה הוא 9 ספרות, והוקלדו ${digits.length}.` }
  }
  if (!isValidIsraeliId(digits)) {
    return { valid: false, reason: 'checksum', message: 'ספרת הביקורת לא מתאימה למספר, כנראה יש בו טעות הקלדה.' }
  }
  if (COMPANY_PREFIXES.includes(digits.slice(0, 2))) return { valid: true, number: digits }
  const entity = entityOf(digits)
  if (entity) {
    return {
      valid: false,
      reason: 'not-a-company',
      entity,
      message: `לפי הקידומת ${entity.prefix}, זה מספר של ${entity.label}, ולא של חברה.`,
    }
  }
  return {
    valid: false,
    reason: 'not-a-company',
    entity: null,
    message: 'מספר שלא מתחיל ב-51, 52 או 56 הוא לא מספר חברה. עוסק שהוא אדם פרטי רשום לפי תעודת הזהות שלו.',
  }
}

export const cleanText = (value) =>
  String(value ?? '')
    .replace(/([א-ת])~(?=[א-ת])/g, '$1״')
    .replace(/~/g, '"')
    .replace(/\s+/g, ' ')
    .trim()

const isoDateOf = (value) => {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(cleanText(value))
  if (!match) return ''
  return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`
}

const yearOf = (value) => {
  const year = Number(value)
  return Number.isInteger(year) && year > 1900 ? year : null
}

const violationOf = (value) => {
  if (value === 'מפרה') return 'violator'
  if (value === 'התראה') return 'warning'
  return 'none'
}

export const statusInfo = (status) =>
  statusCatalog.find((entry) => entry.status === status) ?? { status, tone: 'unknown', text: '' }

export const typeInfo = (type) => typeCatalog[type] ?? { label: type, english: '' }

export function toCompany(record) {
  const status = cleanText(record[FIELD.status])
  const type = cleanText(record[FIELD.type])
  const violation = violationOf(cleanText(record[FIELD.violation]))
  const baseTone = statusInfo(status).tone
  const subStatuses = cleanText(record[FIELD.subStatus])
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
  const country = cleanText(record[FIELD.country])
  return {
    number: cleanText(record[FIELD.number]),
    name: cleanText(record[FIELD.name]),
    englishName: cleanText(record[FIELD.englishName]),
    type,
    typeLabel: typeInfo(type).label,
    status,
    tone: baseTone === 'active' && violation !== 'none' ? 'caution' : baseTone,
    subStatuses: [...new Set(subStatuses)],
    violation,
    description: cleanText(record[FIELD.description]),
    purpose: cleanText(record[FIELD.purpose]),
    founded: isoDateOf(record[FIELD.founded]),
    government: cleanText(record[FIELD.government]) === 'כן',
    limitedLiability: cleanText(record[FIELD.liability]) === 'מוגבלת',
    lastReportYear: yearOf(record[FIELD.lastReport]),
    address: {
      street: [cleanText(record[FIELD.street]), cleanText(record[FIELD.house])].filter(Boolean).join(' '),
      city: cleanText(record[FIELD.city]),
      zip: cleanText(record[FIELD.zip]),
      country,
    },
    careOf: cleanText(record[FIELD.careOf]),
    poBox: cleanText(record[FIELD.poBox]),
  }
}

const tokensOf = (raw) =>
  String(raw ?? '')
    .normalize('NFC')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean)

const withoutSuffixes = (tokens) =>
  tokens.filter((token, index) => {
    if (SUFFIX_TOKENS.has(token)) return false
    if (token === 'בע' && tokens[index + 1] === 'מ') return false
    if (token === 'מ' && tokens[index - 1] === 'בע') return false
    return true
  })

export function buildNameQuery(raw) {
  const tokens = withoutSuffixes(tokensOf(raw))
  const hebrew = tokens.some((token) => HEBREW_LETTER.test(token))
  const usable = (hebrew ? tokens.filter((token) => !LATIN_LETTER.test(token)) : tokens).slice(0, MAX_NAME_TOKENS)
  if (usable.join('').length < NAME_MIN_LETTERS) return null
  const english = !hebrew && usable.some((token) => LATIN_LETTER.test(token))
  const last = usable.length - 1
  const tsquery = usable.map((token, index) => (index === last && token.length > 1 ? `${token}:*` : token)).join(' & ')
  return { field: english ? FIELD.englishName : FIELD.name, tsquery }
}

const searchUrl = (params) =>
  `${DATA_API}/datastore_search?${new URLSearchParams({
    resource_id: COMPANIES_RESOURCE_ID,
    fields: Object.values(FIELD).join(','),
    include_total: 'false',
    ...params,
  })}`

const withTimeout = (signal, timeoutMs) => {
  const timeout = AbortSignal.timeout(timeoutMs)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

async function fetchRecords(url, { signal, timeoutMs = DEFAULT_TIMEOUT_MS, fetch: fetcher = globalThis.fetch } = {}) {
  let response
  try {
    response = await fetcher(url, { signal: withTimeout(signal, timeoutMs), headers: { Accept: 'application/json' } })
  } catch (error) {
    if (signal?.aborted) throw error
    if (error?.name === 'TimeoutError') throw new CompanyLookupError('timeout', 'data.gov.il did not answer in time')
    throw new CompanyLookupError('network', 'Could not reach data.gov.il')
  }
  if (response.status === 403 || response.status === 429) {
    throw new CompanyLookupError('blocked', 'data.gov.il is rate limiting requests')
  }
  if (!response.ok) throw new CompanyLookupError('server', `data.gov.il answered ${response.status}`)
  let data
  try {
    data = await response.json()
  } catch {
    throw new CompanyLookupError('format', 'data.gov.il returned something that is not JSON')
  }
  if (data?.success !== true || !Array.isArray(data?.result?.records)) {
    throw new CompanyLookupError('format', 'Unexpected data.gov.il response')
  }
  return data.result.records
}

export async function getCompany(number, options = {}) {
  const check = checkCompanyNumber(number)
  if (!check.valid) throw new CompanyLookupError('invalid-number', check.message)
  const records = await fetchRecords(
    searchUrl({ filters: JSON.stringify({ [FIELD.number]: Number(check.number) }), limit: '1' }),
    options,
  )
  return records.length ? toCompany(records[0]) : null
}

const toneOrder = { active: 0, caution: 1, unknown: 2, ended: 3 }

const rankByName = (companies, raw) => {
  const first = withoutSuffixes(tokensOf(raw))[0] ?? ''
  const english = !HEBREW_LETTER.test(raw) && LATIN_LETTER.test(String(raw).toLowerCase())
  const leadingMatch = (company) => {
    const leading = tokensOf(english ? company.englishName : company.name)[0] ?? ''
    if (!first || !leading.startsWith(first)) return 2
    return leading === first ? 0 : 1
  }
  return companies
    .map((company, index) => ({ company, index, leading: leadingMatch(company), tone: toneOrder[company.tone] }))
    .sort((a, b) => a.leading - b.leading || a.tone - b.tone || a.index - b.index)
    .map((entry) => entry.company)
}

export async function searchCompanies(name, options = {}) {
  const { limit = 20 } = options
  const query = buildNameQuery(name)
  if (!query) return []
  const records = await fetchRecords(
    searchUrl({
      q: JSON.stringify({ [query.field]: query.tsquery }),
      plain: 'false',
      sort: `"${FIELD.type}" desc, "קוד סטטוס חברה" asc`,
      limit: String(Math.max(limit, 100)),
    }),
    options,
  )
  return rankByName(records.map(toCompany), name).slice(0, limit)
}

export async function getDataDate(options = {}) {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, fetch: fetcher = globalThis.fetch } = options
  const response = await fetcher(`${DATA_API}/resource_show?id=${COMPANIES_RESOURCE_ID}`, {
    signal: withTimeout(signal, timeoutMs),
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) return null
  const data = await response.json()
  const modified = data?.result?.last_modified
  return modified ? new Date(/Z$|[+-]\d{2}:?\d{2}$/.test(modified) ? modified : `${modified}Z`) : null
}
