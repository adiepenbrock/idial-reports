import type { z } from 'zod'
import type { Locale } from '#/lib/i18n/locale'
import type { SectionKey } from './sectionManifest'
import type { yearDataSchema, yearMetaSchema } from './schemas'

export type YearMeta = z.infer<typeof yearMetaSchema>
export type YearData = z.infer<typeof yearDataSchema>

export interface LoadedReportSection {
  key: SectionKey
  slug: string
  label: string
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
