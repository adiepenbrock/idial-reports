import type { ComponentType } from 'react'
import type { LoadedReport, ReportYearSummary } from '#/lib/content/types'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'

export interface ReportLayoutProps {
  report: LoadedReport
  locale: Locale
  dictionary: UiDictionary
  yearSummaries: ReportYearSummary[]
}

export type ReportLayoutComponent = ComponentType<ReportLayoutProps>
