/**
 * Minimal BibTeX parser sufficient for academic publication lists.
 * Handles nested braces, quoted values, and the most common entry/field types.
 */

export interface Publication {
  key: string
  type: 'article' | 'inproceedings' | 'book' | 'techreport' | 'misc'
  title: string
  /** Authors in display-ready "First Last" form */
  authors: string[]
  year: number
  /** journal, booktitle, school, or howpublished */
  venue: string | null
  doi: string | null
  url: string | null
  pages: string | null
  volume: string | null
  number: string | null
  publisher: string | null
}

// ── Field value extraction ─────────────────────────────────────────────────

/** Map LaTeX accent commands to Unicode characters. */
const LATEX_ACCENTS: Record<string, Record<string, string>> = {
  '"': { a: 'ä', e: 'ë', i: 'ï', o: 'ö', u: 'ü', y: 'ÿ', A: 'Ä', E: 'Ë', I: 'Ï', O: 'Ö', U: 'Ü', Y: 'Ÿ' },
  "'": { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', y: 'ý', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú', Y: 'Ý' },
  '`': { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù', A: 'À', E: 'È', I: 'Ì', O: 'Ò', U: 'Ù' },
  '^': { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û', A: 'Â', E: 'Ê', I: 'Î', O: 'Ô', U: 'Û' },
  '~': { a: 'ã', n: 'ñ', o: 'õ', A: 'Ã', N: 'Ñ', O: 'Õ' },
  'c': { c: 'ç', C: 'Ç' },
}

const LATEX_SYMBOLS: Record<string, string> = {
  'ss': 'ß', 'ae': 'æ', 'oe': 'œ', 'AA': 'Å', 'aa': 'å', 'o': 'ø', 'O': 'Ø',
  'l': 'ł', 'L': 'Ł', 'i': 'ı',
}

/**
 * Decode LaTeX accent/escape sequences to their Unicode equivalents,
 * e.g. {\"u} → ü, {\ss} → ß, {\"O} → Ö.
 */
function decodeLatex(value: string): string {
  // {\"x} or {\'x} style — with braces
  return value
    .replace(/\{\\(['"` ^~c])([a-zA-Z])\}/g, (_, cmd, letter) => LATEX_ACCENTS[cmd]?.[letter] ?? letter)
    // \"x or \'x style — without outer braces
    .replace(/\\(['"` ^~c])\{([a-zA-Z])\}/g, (_, cmd, letter) => LATEX_ACCENTS[cmd]?.[letter] ?? letter)
    .replace(/\\(['"` ^~c])([a-zA-Z])/g, (_, cmd, letter) => LATEX_ACCENTS[cmd]?.[letter] ?? letter)
    // {\ss}, {\ae}, etc.
    .replace(/\{\\([a-zA-Z]+)\}/g, (_, name) => LATEX_SYMBOLS[name] ?? '')
    // \ss, \ae etc. not in braces
    .replace(/\\([a-zA-Z]+)\b/g, (_, name) => LATEX_SYMBOLS[name] ?? '')
    // Escaped special chars
    .replace(/\\([&%$#_{}])/g, '$1')
    .replace(/~~/g, '\u00a0')
    .replace(/~/g, '\u00a0')
}

/**
 * Remove surrounding braces / quotes and flatten inner brace groups,
 * e.g. "{A {LaTeX} Title}" → "A LaTeX Title".
 */
function stripBraces(value: string): string {
  return decodeLatex(value).replace(/\{([^{}]*)\}/g, '$1').replace(/[{}]/g, '').trim()
}

/** Parse a sequence of key = value fields from the text after the cite key. */
function parseFields(content: string): Record<string, string> {
  const fields: Record<string, string> = {}
  let i = 0

  while (i < content.length) {
    // Skip whitespace and field-separating commas
    while (i < content.length && /[\s,]/.test(content[i])) i++
    if (i >= content.length) break

    // Read field name (alphanumeric + hyphen)
    const nameStart = i
    while (i < content.length && /[\w-]/.test(content[i])) i++
    const name = content.slice(nameStart, i).toLowerCase().trim()
    if (!name) { i++; continue }

    // Advance to '='
    while (i < content.length && content[i] !== '=') i++
    if (i >= content.length) break
    i++ // consume '='

    // Skip horizontal whitespace
    while (i < content.length && content[i] === ' ') i++
    if (i >= content.length) break

    // Read value: brace-delimited, quote-delimited, or bare (number)
    let value = ''
    if (content[i] === '{') {
      let depth = 1
      i++ // skip '{'
      const start = i
      while (i < content.length && depth > 0) {
        if (content[i] === '{') depth++
        else if (content[i] === '}') depth--
        i++
      }
      value = content.slice(start, i - 1)
    } else if (content[i] === '"') {
      i++ // skip '"'
      const start = i
      while (i < content.length && content[i] !== '"') i++
      value = content.slice(start, i)
      i++ // skip closing '"'
    } else {
      // Bare value (typically a year number)
      const start = i
      while (i < content.length && content[i] !== ',' && content[i] !== '\n') i++
      value = content.slice(start, i).trim()
    }

    if (name) fields[name] = value
  }

  return fields
}

// ── Author formatting ──────────────────────────────────────────────────────

/**
 * Convert a single raw author token to "First Last" form.
 * Handles both "Last, First" and "First Last" styles.
 */
function formatAuthor(raw: string): string {
  const cleaned = stripBraces(raw).trim()
  if (!cleaned) return ''
  if (cleaned.includes(',')) {
    const [last, first = ''] = cleaned.split(',').map((s) => s.trim())
    return first ? `${first} ${last}` : last
  }
  return cleaned
}

function parseAuthors(authorField: string): string[] {
  return authorField
    .split(/\s+and\s+/i)
    .map(formatAuthor)
    .filter(Boolean)
}

// ── Entry type normalisation ───────────────────────────────────────────────

function normalizeType(raw: string): Publication['type'] {
  switch (raw.toLowerCase()) {
    case 'article':
      return 'article'
    case 'inproceedings':
    case 'conference':
      return 'inproceedings'
    case 'book':
    case 'incollection':
    case 'inbook':
      return 'book'
    case 'techreport':
    case 'report':
      return 'techreport'
    default:
      return 'misc'
  }
}

// ── Main parser ────────────────────────────────────────────────────────────

export function parseBibtex(raw: string): Publication[] {
  const publications: Publication[] = []
  let pos = 0

  while (pos < raw.length) {
    // Find next entry marker
    const atIdx = raw.indexOf('@', pos)
    if (atIdx === -1) break

    // Read entry type
    let i = atIdx + 1
    while (i < raw.length && /\w/.test(raw[i])) i++
    const entryType = raw.slice(atIdx + 1, i).toLowerCase()

    // Skip non-publication entries
    if (['comment', 'string', 'preamble'].includes(entryType)) {
      pos = i
      continue
    }

    // Advance to opening brace
    while (i < raw.length && raw[i] !== '{') i++
    if (i >= raw.length) break
    const contentStart = i + 1

    // Find matching closing brace (depth-aware)
    let depth = 1
    i++
    while (i < raw.length && depth > 0) {
      if (raw[i] === '{') depth++
      else if (raw[i] === '}') depth--
      i++
    }

    const content = raw.slice(contentStart, i - 1)
    pos = i

    // Split off the cite key
    const commaIdx = content.indexOf(',')
    if (commaIdx === -1) continue
    const key = content.slice(0, commaIdx).trim()
    const fields = parseFields(content.slice(commaIdx + 1))

    const title = stripBraces(fields.title ?? '')
    if (!title) continue

    const yearNum = parseInt(fields.year ?? '', 10)
    const venue = fields.journal ?? fields.booktitle ?? fields.school ?? fields.howpublished ?? null

    publications.push({
      key,
      type: normalizeType(entryType),
      title,
      authors: fields.author ? parseAuthors(fields.author) : [],
      year: Number.isNaN(yearNum) ? 0 : yearNum,
      venue: venue ? stripBraces(venue) : null,
      doi: fields.doi?.trim() ?? null,
      url: fields.url?.trim() ?? null,
      pages: fields.pages?.replace(/--+/, '–').trim() ?? null,
      volume: fields.volume?.trim() ?? null,
      number: fields.number?.trim() ?? null,
      publisher: fields.publisher ? stripBraces(fields.publisher) : null,
    })
  }

  // Sort by year descending, then first author ascending
  return publications.sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year
    const aFirst = a.authors[0] ?? ''
    const bFirst = b.authors[0] ?? ''
    return aFirst.localeCompare(bFirst)
  })
}
