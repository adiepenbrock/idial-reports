import AnimatedBarChart from '#/components/charts/AnimatedBarChart'
import Reveal from '#/components/motion/Reveal'
import SectionNavigation from '#/components/navigation/SectionNavigation'
import YearNavigation from '#/components/navigation/YearNavigation'
import ReportInsightStrip from '#/components/report/ReportInsightStrip'
import { getReportSectionComponent } from '#/lib/content/loadReports'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { ReportLayoutProps } from '#/lib/layout/types'

function formatPublishedDate(input: string, localeTag: string): string {
  const date = new Date(input)
  if (Number.isNaN(date.valueOf())) return input
  return new Intl.DateTimeFormat(localeTag, { dateStyle: 'long' }).format(date)
}

export default function Year2024Layout({
  report,
  locale,
  dictionary,
  yearSummaries,
}: ReportLayoutProps) {
  const contentLocale = report.locale
  const localeTag = toLanguageTag(contentLocale)
  const meta = report.meta.localeMeta[contentLocale]

  return (
    <div className="report-page custom-2024">
      {/* ── Full-bleed dark hero ── */}
      <Reveal>
        <div className="report-hero-band">
          <div className="shell">
            <section className="report-hero" aria-label={meta.title}>
              <div className="report-hero-eyebrow">
                <p className="meta-label">
                  {dictionary.customDesign} · {dictionary.published}:{' '}
                  {formatPublishedDate(report.meta.publishedAt, localeTag)}
                </p>
                <p className="meta-label" aria-hidden="true">{report.year}</p>
              </div>

              <div className="report-hero-title-wrap">
                <span className="report-hero-year" aria-hidden="true">{report.year}</span>
                <h1>{meta.title}</h1>
              </div>

              <p className="hero-summary">{meta.summary}</p>

              {/* KPI pills — 2024 signature feature */}
              <div className="hero-pill-row">
                {report.data.stats.kpis.map((kpi) => (
                  <span key={kpi.id} className="hero-pill">
                    {kpi.label[contentLocale]}: {kpi.value.toLocaleString(localeTag)}
                  </span>
                ))}
              </div>

              <div className="report-hero-grid" aria-label={dictionary.reportOverviewLabel}>
                <article className="report-hero-stat">
                  <p className="meta-label">{dictionary.articlesMetricLabel}</p>
                  <p>{report.data.articles.length.toLocaleString(localeTag)}</p>
                </article>
                <article className="report-hero-stat">
                  <p className="meta-label">{dictionary.projectsMetricLabel}</p>
                  <p>{report.data.projects.length.toLocaleString(localeTag)}</p>
                </article>
                <article className="report-hero-stat">
                  <p className="meta-label">{dictionary.partnersMetricLabel}</p>
                  <p>{report.data.cooperationPartners.length.toLocaleString(localeTag)}</p>
                </article>
                <article className="report-hero-stat">
                  <p className="meta-label">{dictionary.statsTitle}</p>
                  <p>{report.data.stats.charts.length.toLocaleString(localeTag)}</p>
                </article>
              </div>

              {report.fallbackFrom ? (
                <p className="fallback-note">{dictionary.fallbackNotice}</p>
              ) : null}
            </section>
          </div>
        </div>
      </Reveal>

      {/* ── Report body ── */}
      <div className="shell report-body">
        <YearNavigation
          locale={locale}
          currentYear={report.year}
          yearSummaries={yearSummaries}
          dictionary={dictionary}
        />

        <ReportInsightStrip
          report={report}
          locale={contentLocale}
          dictionary={dictionary}
        />

        <div className="report-grid">
          <SectionNavigation
            sections={report.sections.map((section) => ({
              slug: section.slug,
              label: section.label,
            }))}
            dictionary={dictionary}
          />

          <div className="report-content">
            {report.sections.map((section, index) => {
              const SectionComponent = getReportSectionComponent(
                report.year,
                contentLocale,
                section.slug,
              )

              return (
                <Reveal key={section.key} delay={index * 0.05}>
                  <article
                    id={section.slug}
                    className="report-section-card report-anchor-section"
                  >
                    <header className="section-headline">
                      <h2>{section.label}</h2>
                      <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    </header>

                    <div className="report-prose">
                      <SectionComponent />
                    </div>

                    {section.key === 'stats' ? (
                      <>
                        {report.data.stats.charts.map((chart) => (
                          <AnimatedBarChart
                            key={chart.id}
                            chart={chart}
                            locale={contentLocale}
                          />
                        ))}
                        <div className="kpi-grid">
                          {report.data.stats.kpis.map((kpi) => (
                            <article className="kpi-card" key={kpi.id}>
                              <p className="kpi-title">{kpi.label[contentLocale]}</p>
                              <p className="kpi-value">
                                {kpi.value.toLocaleString(localeTag)}
                                {kpi.unit ? <span>{kpi.unit}</span> : null}
                              </p>
                              <p className="kpi-meta">{kpi.description[contentLocale]}</p>
                            </article>
                          ))}
                        </div>
                      </>
                    ) : null}

                    {section.key === 'articles' ? (
                      <div className="detail-grid">
                        {report.data.articles.map((article) => (
                          <article className="detail-card detail-card-featured" key={article.id}>
                            <h3>{article.title[contentLocale]}</h3>
                            <p>{article.teaser[contentLocale]}</p>
                            <p className="detail-meta">{article.author}</p>
                          </article>
                        ))}
                      </div>
                    ) : null}

                    {section.key === 'projects' ? (
                      <div className="detail-grid two-col">
                        {report.data.projects.map((project) => (
                          <article className="detail-card" key={project.id}>
                            <h3>{project.title[contentLocale]}</h3>
                            <p>{project.summary[contentLocale]}</p>
                            <p className="detail-meta">{project.status[contentLocale]}</p>
                          </article>
                        ))}
                      </div>
                    ) : null}

                    {section.key === 'highlights' ? (
                      <div className="detail-grid">
                        {report.data.highlights.map((highlight) => (
                          <article className="detail-card" key={highlight.id}>
                            <h3>{highlight.title[contentLocale]}</h3>
                            <p>{highlight.detail[contentLocale]}</p>
                          </article>
                        ))}
                      </div>
                    ) : null}

                    {section.key === 'cooperationPartners' ? (
                      <div className="detail-grid two-col">
                        {report.data.cooperationPartners.map((partner) => (
                          <article className="detail-card" key={partner.id}>
                            <h3>{partner.name}</h3>
                            <p>{partner.contribution[contentLocale]}</p>
                          </article>
                        ))}
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
