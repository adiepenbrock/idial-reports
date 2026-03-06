import { Link, Outlet, createFileRoute, notFound } from '@tanstack/react-router'
import Reveal from '#/components/motion/Reveal'
import { listReportYears, loadReportByYear } from '#/lib/content/loadReports'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import { DEFAULT_LOCALE, resolveLocaleParam } from '#/lib/i18n/locale'

export const Route = createFileRoute('/$locale/report/$year')({
  loader: async ({ params }) => {
    const locale = resolveLocaleParam(params.locale) ?? DEFAULT_LOCALE
    const report = await loadReportByYear(params.year, locale)

    if (!report) {
      throw notFound()
    }

    return {
      locale,
      dictionary: getUiDictionary(locale),
      report,
      yearSummaries: listReportYears(locale),
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.report.meta.localeMeta[loaderData.report.locale].title} - ${loaderData.dictionary.siteTitle}`
          : 'Annual Report',
      },
    ],
  }),
  notFoundComponent: ReportNotFound,
  component: () => <Outlet />,
})

function ReportNotFound() {
  const params = Route.useParams()
  const locale = resolveLocaleParam(params.locale) ?? DEFAULT_LOCALE
  const dictionary = getUiDictionary(locale)

  return (
    <main className="shell report-page">
      <Reveal>
        <section className="hero-panel">
          <h1>{dictionary.reportNotFoundTitle}</h1>
          <p className="hero-summary">{dictionary.reportNotFoundBody}</p>
          <Link to="/$locale" params={{ locale }} className="cta-link">
            {dictionary.backToOverview}
          </Link>
        </section>
      </Reveal>
    </main>
  )
}
