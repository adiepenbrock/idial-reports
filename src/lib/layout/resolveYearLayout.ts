import DefaultReportLayout from '#/components/layout/default/DefaultReportLayout'
import { layoutRegistry } from './layoutRegistry'

export function resolveYearLayout(year: string) {
  const customLayout = layoutRegistry[year]

  if (customLayout) {
    return {
      Layout: customLayout,
      isCustom: true,
    }
  }

  return {
    Layout: DefaultReportLayout,
    isCustom: false,
  }
}
