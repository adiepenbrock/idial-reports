import type { ComponentType } from 'react'
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type Locale } from '#/lib/i18n/locale'
import { REQUIRED_SECTIONS } from './sectionManifest'
import { yearDataSchema, yearMetaSchema } from './schemas'
import type { LoadedReport, ReportYearSummary, YearData, YearMeta } from './types'

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

const rawMetaModules = import.meta.glob('../../content/years/*/meta.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const rawDataModules = import.meta.glob('../../content/years/*/data.json', {
  eager: true,
  import: 'default',
}) as Record<string, unknown>

const rawMdxModules = import.meta.glob<MdxModule>('../../content/years/*/*/*.mdx', {
  eager: true,
})

function extractYear(path: string): string | null {
  const match = path.match(/\/years\/(\d{4})\//)
  return match ? match[1] : null
}

function buildYearPackageIndex(): Map<string, YearPackage> {
  const years = new Set<string>()

  for (const path of Object.keys(rawMetaModules)) {
    const year = extractYear(path)
    if (year) {
      years.add(year)
    }
  }

  const index = new Map<string, YearPackage>()

  for (const year of years) {
    const metaPath = `../../content/years/${year}/meta.json`
    const dataPath = `../../content/years/${year}/data.json`
    const rawMeta = rawMetaModules[metaPath]
    const rawData = rawDataModules[dataPath]

    if (!rawMeta || !rawData) {
      throw new ContentContractError('Year package is incomplete', {
        year,
        missingMeta: !rawMeta,
        missingData: !rawData,
      })
    }

    const metaResult = yearMetaSchema.safeParse(rawMeta)
    if (!metaResult.success) {
      throw new ContentContractError('Invalid year meta schema', {
        year,
        issues: metaResult.error.issues,
      })
    }

    const dataResult = yearDataSchema.safeParse(rawData)
    if (!dataResult.success) {
      throw new ContentContractError('Invalid year data schema', {
        year,
        issues: dataResult.error.issues,
      })
    }

    if (String(metaResult.data.year) !== year) {
      throw new ContentContractError('Meta year value does not match folder', {
        year,
        metaYear: metaResult.data.year,
      })
    }

    const sectionComponentsByLocale = {
      de: {},
      en: {},
    } as Record<Locale, Record<string, ComponentType>>

    for (const locale of SUPPORTED_LOCALES) {
      for (const section of REQUIRED_SECTIONS) {
        const sectionPath = `../../content/years/${year}/${locale}/${section.slug}.mdx`
        const module = rawMdxModules[sectionPath]

        if (module?.default) {
          sectionComponentsByLocale[locale][section.slug] = module.default
        }
      }
    }

    const availableLocales = SUPPORTED_LOCALES.filter(
      (locale) =>
        getMissingSectionSlugsForPackage({ sectionComponentsByLocale }, locale).length ===
        0,
    )

    index.set(year, {
      meta: metaResult.data,
      data: dataResult.data,
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
