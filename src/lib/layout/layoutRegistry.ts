import type { ReportLayoutComponent } from './types'
import Year2024Layout from '#/components/layout/years/year2024/Year2024Layout'

export const layoutRegistry: Partial<Record<string, ReportLayoutComponent>> = {
  '2024': Year2024Layout,
}

export function isCustomLayoutYear(year: string): boolean {
  return Boolean(layoutRegistry[year])
}
