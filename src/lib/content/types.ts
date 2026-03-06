import type { ComponentType } from 'react'
import type { z } from 'zod'
import type { Locale } from '#/lib/i18n/locale'
import type { SectionKey } from './sectionManifest'
import type { resolvedYearDataSchema, yearMetaSchema } from './schemas'

export type YearMeta = z.infer<typeof yearMetaSchema>
export type YearData = z.infer<typeof resolvedYearDataSchema>

export interface LoadedReportSection {
  key: SectionKey
  slug: string
  label: string
}

/** Used by the module-level body component registry in loadReports.ts */
export interface BodyComponentMap {
  articles: Record<string, ComponentType | null>
  projects: Record<string, ComponentType | null>
  highlights: Record<string, ComponentType | null>
}

export interface LoadedReport {
  year: string
  requestedLocale: Locale
  locale: Locale
  fallbackFrom: Locale | null
  meta: YearMeta
  data: YearData
  sections: LoadedReportSection[]
  availableLocales: Locale[]
}

export interface ReportYearSummary {
  year: string
  publishedAt: string
  title: string
  summary: string
  availableLocales: Locale[]
  articleCount: number
  projectCount: number
  partnerCount: number
  chartCount: number
}
