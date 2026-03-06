import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from 'motion/react'
import { useMemo, useState } from 'react'
import YearShowcaseCard from '#/components/landing/YearShowcaseCard'
import CountUp from '#/components/motion/CountUp'
import Reveal from '#/components/motion/Reveal'
import { listReportYears } from '#/lib/content/loadReports'
import { REQUIRED_SECTIONS } from '#/lib/content/sectionManifest'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import { DEFAULT_LOCALE, resolveLocaleParam, toLanguageTag } from '#/lib/i18n/locale'
import { isCustomLayoutYear } from '#/lib/layout/layoutRegistry'

type DesignFilter = 'all' | 'custom' | 'default'

export const Route = createFileRoute('/$locale/')({
  loader: ({ params }) => {
    const locale = resolveLocaleParam(params.locale) ?? DEFAULT_LOCALE

    return {
      locale,
      dictionary: getUiDictionary(locale),
      years: listReportYears(locale),
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.dictionary.siteTitle} - ${loaderData?.dictionary.availableYears}`,
      },
    ],
  }),
  component: LocalizedHome,
})

function LocalizedHome() {
  const { locale, dictionary, years } = Route.useLoaderData()
  const [designFilter, setDesignFilter] = useState<DesignFilter>('all')

  const totalArticles = useMemo(
    () => years.reduce((total, entry) => total + entry.articleCount, 0),
    [years],
  )

  const totalProjects = useMemo(
    () => years.reduce((total, entry) => total + entry.projectCount, 0),
    [years],
  )

  const totalPartners = useMemo(
    () => years.reduce((total, entry) => total + entry.partnerCount, 0),
    [years],
  )

  const filteredYears = useMemo(() => {
    return years.filter((entry) => {
      if (designFilter === 'all') return true
      const custom = isCustomLayoutYear(entry.year)
      return designFilter === 'custom' ? custom : !custom
    })
  }, [designFilter, years])

  return (
    <div className="landing-page">
      {/* ── Full-bleed dark hero band ── */}
      <div className="landing-hero-band">
        <div className="shell">
          <Reveal>
            <section className="landing-hero" aria-label={dictionary.landingTitle}>
              <p className="meta-label landing-eyebrow">{dictionary.siteTitle}</p>

              <h1 className="landing-display-title">
                {dictionary.landingTitle}
              </h1>

              <p className="landing-lead">{dictionary.landingIntro}</p>

              {/* Horizontal stats bar */}
              <div className="landing-stats-bar" aria-label={dictionary.landingMetricsTitle}>
                <div className="landing-stat">
                  <span className="landing-stat-value">
                    <CountUp value={years.length} localeTag={toLanguageTag(locale)} />
                  </span>
                  <span className="landing-stat-label">{dictionary.yearsPublishedLabel}</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-value">
                    <CountUp value={totalArticles} localeTag={toLanguageTag(locale)} />
                  </span>
                  <span className="landing-stat-label">{dictionary.articlesMetricLabel}</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-value">
                    <CountUp value={totalProjects} localeTag={toLanguageTag(locale)} />
                  </span>
                  <span className="landing-stat-label">{dictionary.projectsMetricLabel}</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-value">
                    <CountUp value={REQUIRED_SECTIONS.length} localeTag={toLanguageTag(locale)} />
                  </span>
                  <span className="landing-stat-label">{dictionary.sectionCoverageLabel}</span>
                </div>
                <div className="landing-stat">
                  <span className="landing-stat-value">
                    <CountUp value={totalPartners} localeTag={toLanguageTag(locale)} />
                  </span>
                  <span className="landing-stat-label">{dictionary.partnersMetricLabel}</span>
                </div>
              </div>
            </section>
          </Reveal>
        </div>
      </div>

      {/* ── Report catalog ── */}
      <div className="shell">
        <Reveal delay={0.06}>
          <section className="landing-catalog">
            <div className="landing-catalog-header">
              <h2 className="landing-catalog-title">{dictionary.availableYears}</h2>

              <div className="landing-toolbar">
                <div className="landing-filter" role="group" aria-label={dictionary.availableYears}>
                  <button
                    type="button"
                    className={designFilter === 'all' ? 'filter-chip is-active' : 'filter-chip'}
                    aria-pressed={designFilter === 'all'}
                    onClick={() => setDesignFilter('all')}
                  >
                    {dictionary.filterAllLabel}
                  </button>
                  <button
                    type="button"
                    className={designFilter === 'custom' ? 'filter-chip is-active' : 'filter-chip'}
                    aria-pressed={designFilter === 'custom'}
                    onClick={() => setDesignFilter('custom')}
                  >
                    {dictionary.filterCustomLabel}
                  </button>
                  <button
                    type="button"
                    className={
                      designFilter === 'default' ? 'filter-chip is-active' : 'filter-chip'
                    }
                    aria-pressed={designFilter === 'default'}
                    onClick={() => setDesignFilter('default')}
                  >
                    {dictionary.filterDefaultLabel}
                  </button>
                </div>

                <p className="landing-showing">
                  {dictionary.showingLabel}: <strong>{filteredYears.length}</strong>
                </p>
              </div>
            </div>

            <div className="year-card-grid">
              <AnimatePresence mode="popLayout">
                {filteredYears.map((entry, index) => (
                  <YearShowcaseCard
                    key={entry.year}
                    entry={entry}
                    index={index}
                    locale={locale}
                    dictionary={dictionary}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
