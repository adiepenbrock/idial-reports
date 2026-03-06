import { createFileRoute, getRouteApi } from '@tanstack/react-router'
import { resolveYearLayout } from '#/lib/layout/resolveYearLayout'

const yearRoute = getRouteApi('/$locale/report/$year')

export const Route = createFileRoute('/$locale/report/$year/')({
  component: ReportPage,
})

function ReportPage() {
  const { locale, dictionary, report, yearSummaries } = yearRoute.useLoaderData()
  const { Layout } = resolveYearLayout(report.year)

  return (
    <Layout
      locale={locale}
      dictionary={dictionary}
      report={report}
      yearSummaries={yearSummaries}
    />
  )
}
