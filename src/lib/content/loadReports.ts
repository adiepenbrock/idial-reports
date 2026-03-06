import type { ComponentType } from 'react'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '#/lib/i18n/locale'
import { REQUIRED_SECTIONS } from './sectionManifest'
import {
  yearMetaSchema,
  articleMetaSchema,
  projectMetaSchema,
  highlightMetaSchema,
  cooperationPartnerMetaSchema,
  kpiMetaSchema,
  chartMetaSchema,
  timelineEventMetaSchema,
} from './schemas'
import type { BodyComponentMap, LoadedReport, ReportYearSummary, YearData, YearMeta } from './types'

// Module-level body component registry — never included in loader data (not serializable)
const bodyComponentRegistry = new Map<string, Record<Locale, BodyComponentMap>>()

type MdxModule = {
  default: ComponentType
}

interface YearPackage {
  meta: YearMeta
  data: YearData
  sectionComponentsByLocale: Record<Locale, Record<string, ComponentType>>
  availableLocales: Locale[]
}

export class ContentContractError extends Error {
  constructor(
    message: string,
    public readonly details: Record<string, unknown> = {},
  ) {
    super(message)
    this.name = 'ContentContractError'
  }
}

// ── Glob declarations ──────────────────────────────────────────────────────

const rawMetaModules = import.meta.glob('../../content/years/*/meta.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const rawArticleMetaModules = import.meta.glob(
  '../../content/years/*/articles/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawArticleBodyModules = import.meta.glob<MdxModule>(
  '../../content/years/*/articles/*/*.mdx',
  { eager: true },
)

const rawProjectMetaModules = import.meta.glob(
  '../../content/years/*/projects/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawProjectBodyModules = import.meta.glob<MdxModule>(
  '../../content/years/*/projects/*/*.mdx',
  { eager: true },
)

const rawHighlightMetaModules = import.meta.glob(
  '../../content/years/*/highlights/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawHighlightBodyModules = import.meta.glob<MdxModule>(
  '../../content/years/*/highlights/*/*.mdx',
  { eager: true },
)

const rawPartnerMetaModules = import.meta.glob(
  '../../content/years/*/cooperationPartners/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawKpiMetaModules = import.meta.glob(
  '../../content/years/*/stats/kpis/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawChartMetaModules = import.meta.glob(
  '../../content/years/*/stats/charts/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

const rawTimelineEventMetaModules = import.meta.glob(
  '../../content/years/*/timeline/*/events/*/meta.json',
  { eager: true, import: 'default' },
) as Record<string, unknown>

// Section MDX — now under sections/<locale>/<slug>.mdx
const rawMdxModules = import.meta.glob<MdxModule>(
  '../../content/years/*/sections/*/*.mdx',
  { eager: true },
)

// ── Path parsing helpers ───────────────────────────────────────────────────

function extractYear(path: string): string | null {
  const match = path.match(/\/years\/(\d{4})\//)
  return match ? match[1] : null
}

/**
 * Extracts year and item-id from paths like:
 *   ../../content/years/2023/articles/article-foo/meta.json
 * Returns { year: "2023", id: "article-foo" } or null.
 */
function extractYearAndId(
  path: string,
  segment: string,
): { year: string; id: string } | null {
  const re = new RegExp(`/years/(\\d{4})/${segment}/([^/]+)/meta\\.json$`)
  const match = path.match(re)
  if (!match) return null
  return { year: match[1], id: match[2] }
}

/**
 * Extracts year, month, and event-id from timeline event paths like:
 *   ../../content/years/2023/timeline/05/events/tl-2023-05-01/meta.json
 */
function extractTimelineEventParts(
  path: string,
): { year: string; month: string; id: string } | null {
  const match = path.match(/\/years\/(\d{4})\/timeline\/(\d{2})\/events\/([^/]+)\/meta\.json$/)
  if (!match) return null
  return { year: match[1], month: match[2], id: match[3] }
}

/**
 * Extracts year, kpi/chart id from stats sub-paths like:
 *   ../../content/years/2023/stats/kpis/publications/meta.json
 */
function extractStatsId(
  path: string,
  statType: 'kpis' | 'charts',
): { year: string; id: string } | null {
  const re = new RegExp(`/years/(\\d{4})/stats/${statType}/([^/]+)/meta\\.json$`)
  const match = path.match(re)
  if (!match) return null
  return { year: match[1], id: match[2] }
}

/**
 * For body MDX: extracts year, id, and locale from paths like:
 *   ../../content/years/2023/articles/article-foo/de.mdx
 */
function extractBodyParts(
  path: string,
  segment: string,
): { year: string; id: string; locale: Locale } | null {
  const re = new RegExp(`/years/(\\d{4})/${segment}/([^/]+)/(de|en)\\.mdx$`)
  const match = path.match(re)
  if (!match) return null
  return { year: match[1], id: match[2], locale: match[3] as Locale }
}

// ── Per-year collectors ────────────────────────────────────────────────────

type OrderedItem = { order: number }

function sortByOrder<T extends OrderedItem>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order)
}

/** Collect and validate all article metas for a given year. */
function collectArticles(year: string) {
  const items: Array<ReturnType<typeof articleMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawArticleMetaModules)) {
    const parts = extractYearAndId(path, 'articles')
    if (!parts || parts.year !== year) continue

    const result = articleMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid article meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect and validate all project metas for a given year. */
function collectProjects(year: string) {
  const items: Array<ReturnType<typeof projectMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawProjectMetaModules)) {
    const parts = extractYearAndId(path, 'projects')
    if (!parts || parts.year !== year) continue

    const result = projectMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid project meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect and validate all highlight metas for a given year. */
function collectHighlights(year: string) {
  const items: Array<ReturnType<typeof highlightMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawHighlightMetaModules)) {
    const parts = extractYearAndId(path, 'highlights')
    if (!parts || parts.year !== year) continue

    const result = highlightMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid highlight meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect and validate all cooperation partner metas for a given year. */
function collectCooperationPartners(year: string) {
  const items: Array<ReturnType<typeof cooperationPartnerMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawPartnerMetaModules)) {
    const parts = extractYearAndId(path, 'cooperationPartners')
    if (!parts || parts.year !== year) continue

    const result = cooperationPartnerMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid cooperation partner meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect and validate KPI metas for a given year. */
function collectKpis(year: string) {
  const items: Array<ReturnType<typeof kpiMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawKpiMetaModules)) {
    const parts = extractStatsId(path, 'kpis')
    if (!parts || parts.year !== year) continue

    const result = kpiMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid KPI meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect and validate chart metas for a given year. */
function collectCharts(year: string) {
  const items: Array<ReturnType<typeof chartMetaSchema.parse>> = []

  for (const [path, raw] of Object.entries(rawChartMetaModules)) {
    const parts = extractStatsId(path, 'charts')
    if (!parts || parts.year !== year) continue

    const result = chartMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid chart meta', {
        path,
        issues: result.error.issues,
      })
    }
    items.push(result.data)
  }

  return sortByOrder(items)
}

/** Collect timeline events for a given year, grouped by month. */
function collectTimeline(year: string): YearData['timeline'] {
  // month string → ordered events
  const byMonth = new Map<
    string,
    Array<ReturnType<typeof timelineEventMetaSchema.parse>>
  >()

  for (const [path, raw] of Object.entries(rawTimelineEventMetaModules)) {
    const parts = extractTimelineEventParts(path)
    if (!parts || parts.year !== year) continue

    const result = timelineEventMetaSchema.safeParse(raw)
    if (!result.success) {
      throw new ContentContractError('Invalid timeline event meta', {
        path,
        issues: result.error.issues,
      })
    }

    const existing = byMonth.get(parts.month) ?? []
    existing.push(result.data)
    byMonth.set(parts.month, existing)
  }

  if (byMonth.size === 0) return undefined

  return [...byMonth.entries()]
    .map(([monthStr, events]) => ({
      month: parseInt(monthStr, 10),
      events: sortByOrder(events),
    }))
    .sort((a, b) => a.month - b.month)
}

/** Populate the module-level body component registry for a given year. */
function registerBodyComponents(year: string): void {
  const byLocale: Record<Locale, BodyComponentMap> = {
    de: { articles: {}, projects: {}, highlights: {} },
    en: { articles: {}, projects: {}, highlights: {} },
  }

  const segments = ['articles', 'projects', 'highlights'] as const

  for (const segment of segments) {
    const moduleMap =
      segment === 'articles'
        ? rawArticleBodyModules
        : segment === 'projects'
          ? rawProjectBodyModules
          : rawHighlightBodyModules

    for (const [path, mod] of Object.entries(moduleMap)) {
      const parts = extractBodyParts(path, segment)
      if (!parts || parts.year !== year) continue

      byLocale[parts.locale][segment][parts.id] = mod.default ?? null
    }
  }

  bodyComponentRegistry.set(year, byLocale)
}

// ── Main index builder ─────────────────────────────────────────────────────

function buildYearPackageIndex(): Map<string, YearPackage> {
  const years = new Set<string>()

  for (const path of Object.keys(rawMetaModules)) {
    const year = extractYear(path)
    if (year) years.add(year)
  }

  const index = new Map<string, YearPackage>()

  for (const year of years) {
    const metaPath = `../../content/years/${year}/meta.json`
    const rawMeta = rawMetaModules[metaPath]

    if (!rawMeta) {
      throw new ContentContractError('Year meta.json is missing', { year })
    }

    const metaResult = yearMetaSchema.safeParse(rawMeta)
    if (!metaResult.success) {
      throw new ContentContractError('Invalid year meta schema', {
        year,
        issues: metaResult.error.issues,
      })
    }

    if (String(metaResult.data.year) !== year) {
      throw new ContentContractError('Meta year value does not match folder', {
        year,
        metaYear: metaResult.data.year,
      })
    }

    // Collect all content types
    const articles = collectArticles(year)
    const projects = collectProjects(year)
    const highlights = collectHighlights(year)
    const cooperationPartners = collectCooperationPartners(year)
    const kpis = collectKpis(year)
    const charts = collectCharts(year)
    const timeline = collectTimeline(year)

    if (articles.length === 0) {
      throw new ContentContractError('Year has no articles', { year })
    }
    if (projects.length === 0) {
      throw new ContentContractError('Year has no projects', { year })
    }
    if (highlights.length === 0) {
      throw new ContentContractError('Year has no highlights', { year })
    }
    if (cooperationPartners.length === 0) {
      throw new ContentContractError('Year has no cooperation partners', { year })
    }
    if (kpis.length === 0) {
      throw new ContentContractError('Year has no KPIs', { year })
    }
    if (charts.length === 0) {
      throw new ContentContractError('Year has no charts', { year })
    }

    // Strip 'order' from items for the assembled YearData
    const data: YearData = {
      stats: {
        kpis: kpis.map(({ order: _order, ...rest }) => rest),
        charts: charts.map(({ order: _order, ...rest }) => rest),
      },
      articles: articles.map(({ order: _order, ...rest }) => rest),
      projects: projects.map(({ order: _order, ...rest }) => rest),
      highlights: highlights.map(({ order: _order, ...rest }) => rest),
      cooperationPartners: cooperationPartners.map(({ order: _order, ...rest }) => rest),
      timeline,
    }

    // Section MDX — now under sections/<locale>/<slug>.mdx
    const sectionComponentsByLocale = {
      de: {},
      en: {},
    } as Record<Locale, Record<string, ComponentType>>

    for (const locale of SUPPORTED_LOCALES) {
      for (const section of REQUIRED_SECTIONS) {
        const sectionPath = `../../content/years/${year}/sections/${locale}/${section.slug}.mdx`
        const module = rawMdxModules[sectionPath]

        if (module?.default) {
          sectionComponentsByLocale[locale][section.slug] = module.default
        }
      }
    }

    const availableLocales = SUPPORTED_LOCALES.filter(
      (locale) =>
        getMissingSectionSlugsForPackage({ sectionComponentsByLocale }, locale).length === 0,
    )

    // Register body components in the module-level registry (not in loader data)
    registerBodyComponents(year)

    index.set(year, {
      meta: metaResult.data,
      data,
      sectionComponentsByLocale,
      availableLocales,
    })
  }

  return index
}

function getMissingSectionSlugsForPackage(
  yearPackage: Pick<YearPackage, 'sectionComponentsByLocale'>,
  locale: Locale,
): string[] {
  const sectionMap = yearPackage.sectionComponentsByLocale[locale]

  return REQUIRED_SECTIONS.filter((section) => !sectionMap[section.slug]).map(
    (section) => section.slug,
  )
}

const yearPackages = buildYearPackageIndex()

function getYearPackage(year: string): YearPackage | null {
  return yearPackages.get(year) ?? null
}

function resolveLocaleForYear(
  yearPackage: YearPackage,
  requestedLocale: Locale,
): { locale: Locale; fallbackFrom: Locale | null } {
  const availableLocales = SUPPORTED_LOCALES.filter(
    (locale) => getMissingSectionSlugsForPackage(yearPackage, locale).length === 0,
  )

  return resolveContentLocale(availableLocales, requestedLocale)
}

export function resolveContentLocale(
  availableLocales: readonly Locale[],
  requestedLocale: Locale,
): { locale: Locale; fallbackFrom: Locale | null } {
  if (availableLocales.includes(requestedLocale)) {
    return {
      locale: requestedLocale,
      fallbackFrom: null,
    }
  }

  if (availableLocales.includes(DEFAULT_LOCALE)) {
    return {
      locale: DEFAULT_LOCALE,
      fallbackFrom: requestedLocale,
    }
  }

  throw new ContentContractError('Required section contract failed for all locales', {
    requestedLocale,
    defaultLocale: DEFAULT_LOCALE,
    availableLocales,
  })
}

export function getMissingSectionSlugs(year: string, locale: Locale): string[] {
  const yearPackage = getYearPackage(year)

  if (!yearPackage) {
    return []
  }

  return getMissingSectionSlugsForPackage(yearPackage, locale)
}

export function getReportSectionComponent(
  year: string,
  locale: Locale,
  slug: string,
): ComponentType {
  const yearPackage = getYearPackage(year)

  if (!yearPackage) {
    throw new ContentContractError('Unknown report year when resolving section component', {
      year,
      locale,
      slug,
    })
  }

  const component = yearPackage.sectionComponentsByLocale[locale][slug]

  if (!component) {
    throw new ContentContractError('Missing section component for resolved locale', {
      year,
      locale,
      slug,
    })
  }

  return component
}

export function listReportYears(locale: Locale): ReportYearSummary[] {
  return [...yearPackages.entries()]
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, yearPackage]) => {
      const localeForSummary = yearPackage.availableLocales.includes(locale)
        ? locale
        : DEFAULT_LOCALE

      return {
        year,
        publishedAt: yearPackage.meta.publishedAt,
        title: yearPackage.meta.localeMeta[localeForSummary].title,
        summary: yearPackage.meta.localeMeta[localeForSummary].summary,
        availableLocales: yearPackage.availableLocales,
        articleCount: yearPackage.data.articles.length,
        projectCount: yearPackage.data.projects.length,
        partnerCount: yearPackage.data.cooperationPartners.length,
        chartCount: yearPackage.data.stats.charts.length,
      }
    })
}

export async function loadReportByYear(
  year: string,
  requestedLocale: Locale,
): Promise<LoadedReport | null> {
  const yearPackage = getYearPackage(year)

  if (!yearPackage) {
    return null
  }

  const localeResolution = resolveLocaleForYear(yearPackage, requestedLocale)
  const sectionLocaleComponents =
    yearPackage.sectionComponentsByLocale[localeResolution.locale]

  const sections = REQUIRED_SECTIONS.map((section) => {
    if (!sectionLocaleComponents[section.slug]) {
      throw new ContentContractError('Required section component is missing', {
        year,
        locale: localeResolution.locale,
        section: section.slug,
      })
    }

    return {
      key: section.key,
      slug: section.slug,
      label: section.labels[localeResolution.locale],
    }
  })

  return {
    year,
    requestedLocale,
    locale: localeResolution.locale,
    fallbackFrom: localeResolution.fallbackFrom,
    meta: yearPackage.meta,
    data: yearPackage.data,
    sections,
    availableLocales: yearPackage.availableLocales,
  }
}

/**
 * Look up the MDX body component for a content item.
 * Call at render time — not included in loader data (not serializable).
 */
export function getBodyComponent(
  year: string,
  type: keyof BodyComponentMap,
  id: string,
  locale: Locale,
): ComponentType | null {
  return bodyComponentRegistry.get(year)?.[locale]?.[type]?.[id] ?? null
}
