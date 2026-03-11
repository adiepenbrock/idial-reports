import { Link } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import AnimatedBarChart from '#/components/charts/AnimatedBarChart'
import AnimatedColumnChart from '#/components/charts/AnimatedColumnChart'
import AnimatedDonutChart from '#/components/charts/AnimatedDonutChart'
import AnimatedLineChart from '#/components/charts/AnimatedLineChart'
import AnimatedPieChart from '#/components/charts/AnimatedPieChart'
import AnimatedTimeline from '#/components/charts/AnimatedTimeline'
import CountUp from '#/components/motion/CountUp'
import Reveal from '#/components/motion/Reveal'
import YearNavigation from '#/components/navigation/YearNavigation'
import PublicationsList from '#/components/report/PublicationsList'
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
  const shouldReduceMotion = useReducedMotion()

  const heroStats = [
    { label: dictionary.articlesMetricLabel, value: report.data.articles.length },
    { label: dictionary.projectsMetricLabel, value: report.data.projects.length },
    { label: dictionary.partnersMetricLabel, value: report.data.cooperationPartners.length },
    { label: dictionary.statsTitle, value: report.data.stats.charts.length },
  ]

  return (
    <div className="report-page custom-2024">

      {/* ══════════════════════════════════════════════
          CINEMATIC HERO — full viewport dark scene
      ══════════════════════════════════════════════ */}
      <section className="y24-hero" aria-label={meta.title}>

        {/* Animated orb mesh */}
        <div className="y24-hero-mesh" aria-hidden="true">
          <div className="y24-orb y24-orb-1" />
          <div className="y24-orb y24-orb-2" />
          <div className="y24-orb y24-orb-3" />
          <div className="y24-grid-dots" />
          <div className="y24-scan-line" />
        </div>

        {/* Giant watermark year */}
        <span className="y24-hero-watermark" aria-hidden="true">2024</span>

        <div className="shell y24-hero-inner">

          {/* Eyebrow row */}
          <motion.div
            className="y24-hero-eyebrow"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <span className="y24-badge">
              <span className="y24-badge-dot" aria-hidden="true" />
              {dictionary.customDesign}
            </span>
            <span className="y24-eyebrow-sep" aria-hidden="true">—</span>
            <span className="y24-eyebrow-date">
              {dictionary.published}:{' '}
              {formatPublishedDate(report.meta.publishedAt, localeTag)}
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            className="y24-hero-title"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            {meta.title}
          </motion.h1>

          {/* Summary */}
          <motion.p
            className="y24-hero-summary"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: 'easeOut' }}
          >
            {meta.summary}
          </motion.p>

          {/* Animated stat counters */}
          <motion.div
            className="y24-hero-stats"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            aria-label={dictionary.reportOverviewLabel}
          >
            {heroStats.map((stat, i) => (
              <motion.article
                key={stat.label}
                className="y24-hero-stat"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.55 + i * 0.07 }}
              >
                <span className="y24-hero-stat-value">
                  <CountUp value={stat.value} localeTag={localeTag} />
                </span>
                <span className="y24-hero-stat-label">{stat.label}</span>
              </motion.article>
            ))}
          </motion.div>

          {/* KPI pill strip */}
          <motion.div
            className="y24-kpi-strip"
            initial={shouldReduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.82 }}
          >
            {report.data.stats.kpis.map((kpi) => (
              <span key={kpi.id} className="y24-kpi-pill">
                <span className="y24-kpi-pill-dot" aria-hidden="true" />
                {kpi.label[contentLocale]}
                <strong>{kpi.value.toLocaleString(localeTag)}</strong>
              </span>
            ))}
          </motion.div>

          {report.fallbackFrom ? (
            <p className="fallback-note y24-fallback-note">{dictionary.fallbackNotice}</p>
          ) : null}
        </div>

        {/* Animated scroll cue */}
        <motion.div
          className="y24-scroll-cue"
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        >
          <span className="y24-scroll-line" />
          <span className="y24-scroll-label">scroll</span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          YEAR NAVIGATION
      ══════════════════════════════════════════════ */}
      <div className="y24-year-nav-bar">
        <div className="shell">
          <YearNavigation
            locale={locale}
            currentYear={report.year}
            yearSummaries={yearSummaries}
            dictionary={dictionary}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION INDEX — horizontal pill nav
      ══════════════════════════════════════════════ */}
      <nav className="y24-section-index" aria-label="Section index">
        <div className="shell y24-section-index-inner">
          {report.sections.map((section, i) => (
            <a key={section.key} href={`#${section.slug}`} className="y24-section-index-link">
              <span className="y24-section-index-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="y24-section-index-label">{section.label}</span>
            </a>
          ))}
          {report.data.timeline && report.data.timeline.length > 0 && (
            <a href="#timeline" className="y24-section-index-link">
              <span className="y24-section-index-num">
                {String(report.sections.length + 1).padStart(2, '0')}
              </span>
              <span className="y24-section-index-label">{dictionary.timelineLabel}</span>
            </a>
          )}
          {report.data.publications && report.data.publications.length > 0 && (
            <a href="#publications" className="y24-section-index-link">
              <span className="y24-section-index-num">
                {String(report.sections.length + (report.data.timeline?.length ? 2 : 1)).padStart(2, '0')}
              </span>
              <span className="y24-section-index-label">{dictionary.publicationsLabel}</span>
            </a>
          )}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          SECTIONS
      ══════════════════════════════════════════════ */}
      <div className="y24-sections">
        {report.sections.map((section, index) => {
          const SectionComponent = getReportSectionComponent(
            report.year,
            contentLocale,
            section.slug,
          )

          return (
            <Reveal key={section.key} delay={0.05}>
              <section
                id={section.slug}
                className={`y24-section y24-section--${section.key} report-anchor-section`}
              >
                {/* Section header band */}
                <div className="y24-section-header-band">
                  <div className="shell">
                    <div className="y24-section-header-inner">
                      <span className="y24-section-num" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="y24-section-title">{section.label}</h2>
                    </div>
                  </div>
                </div>

                {/* Section content */}
                <div className="shell y24-section-body">

                  {/* MDX prose intro */}
                  <div className="y24-prose">
                    <SectionComponent />
                  </div>

                  {/* ── STATS ── */}
                  {section.key === 'stats' && (
                    <div className="y24-stats-content">
                      <AnimatedDonutChart
                        kpis={report.data.stats.kpis}
                        locale={contentLocale}
                        label={dictionary.kpiComparisonLabel}
                      />

                      <div className="y24-kpi-grid">
                        {report.data.stats.kpis.map((kpi, i) => (
                          <motion.article
                            key={kpi.id}
                            className="y24-kpi-card"
                            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.07 }}
                          >
                            <div className="y24-kpi-card-topbar" aria-hidden="true" />
                            <p className="y24-kpi-label">{kpi.label[contentLocale]}</p>
                            <p className="y24-kpi-value">
                              <CountUp value={kpi.value} localeTag={localeTag} />
                              {kpi.unit ? <span className="y24-kpi-unit">{kpi.unit}</span> : null}
                            </p>
                            <p className="y24-kpi-desc">{kpi.description[contentLocale]}</p>
                          </motion.article>
                        ))}
                      </div>

                      <div className="y24-charts">
                        {report.data.stats.charts.map((chart, chartIndex) => {
                          const type = chart.type ?? (chartIndex === 0 ? 'line' : 'bar')
                          return (
                            <div key={chart.id} className="y24-chart-wrap">
                              {type === 'column' && <AnimatedColumnChart chart={chart} locale={contentLocale} />}
                              {type === 'pie' && <AnimatedPieChart chart={chart} locale={contentLocale} />}
                              {type === 'line' && <AnimatedLineChart chart={chart} locale={contentLocale} />}
                              {type === 'bar' && <AnimatedBarChart chart={chart} locale={contentLocale} />}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* ── ARTICLES ── */}
                  {section.key === 'articles' && (
                    <div className="y24-articles-grid">
                      {report.data.articles.map((article, i) => (
                        <motion.div
                          key={article.id}
                          initial={shouldReduceMotion ? false : { opacity: 0, x: i % 2 === 0 ? -28 : 28 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.55, delay: i * 0.1 }}
                        >
                          <Link
                            to="/$locale/report/$year/article/$articleId"
                            params={{ locale, year: report.year, articleId: article.id }}
                            className="y24-article-card"
                          >
                            <span className="y24-article-index" aria-hidden="true">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <div className="y24-article-card-body">
                              <h3 className="y24-article-title">{article.title[contentLocale]}</h3>
                              <p className="y24-article-teaser">{article.teaser[contentLocale]}</p>
                              <div className="y24-article-meta">
                                <span className="y24-article-author">{article.author}</span>
                                <span className="y24-article-cta">{dictionary.openArticle} →</span>
                              </div>
                            </div>
                            <div className="y24-article-card-accent" aria-hidden="true" />
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* ── PROJECTS ── */}
                  {section.key === 'projects' && (
                    <div className="y24-projects-grid">
                      {report.data.projects.map((project, i) => (
                        <motion.div
                          key={project.id}
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                          <Link
                            to="/$locale/report/$year/project/$projectId"
                            params={{ locale, year: report.year, projectId: project.id }}
                            className="y24-project-card"
                          >
                            <div className="y24-project-card-inner">
                              <div className="y24-project-card-glow" aria-hidden="true" />
                              <span className="y24-project-status">{project.status[contentLocale]}</span>
                              <h3 className="y24-project-title">{project.title[contentLocale]}</h3>
                              <p className="y24-project-summary">{project.summary[contentLocale]}</p>
                              <span className="y24-project-cta">{dictionary.openProject} →</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* ── HIGHLIGHTS ── */}
                  {section.key === 'highlights' && (
                    <div className="y24-highlights-grid">
                      {report.data.highlights.map((highlight, i) => (
                        <motion.div
                          key={highlight.id}
                          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.45, delay: i * 0.09 }}
                        >
                          <Link
                            to="/$locale/report/$year/highlight/$highlightId"
                            params={{ locale, year: report.year, highlightId: highlight.id }}
                            className="y24-highlight-card"
                          >
                            <span className="y24-highlight-num" aria-hidden="true">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <h3 className="y24-highlight-title">{highlight.title[contentLocale]}</h3>
                            <p className="y24-highlight-detail">{highlight.detail[contentLocale]}</p>
                            <span className="y24-highlight-cta">{dictionary.openHighlight} →</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* ── PARTNERS ── */}
                  {section.key === 'cooperationPartners' && (
                    <div className="y24-partners-grid">
                      {report.data.cooperationPartners.map((partner, i) => (
                        <motion.article
                          key={partner.id}
                          className="y24-partner-card"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                        >
                          <div className="y24-partner-monogram" aria-hidden="true">
                            {partner.name.slice(0, 2).toUpperCase()}
                          </div>
                          <h3 className="y24-partner-name">{partner.name}</h3>
                          <p className="y24-partner-contribution">{partner.contribution[contentLocale]}</p>
                        </motion.article>
                      ))}
                    </div>
                  )}

                </div>
              </section>
            </Reveal>
          )
        })}
      </div>

      {/* ══════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════ */}
      {report.data.timeline && report.data.timeline.length > 0 ? (
        <Reveal>
          <section id="timeline" className="y24-timeline-section report-anchor-section">
            <div className="y24-section-header-band">
              <div className="shell">
                <div className="y24-section-header-inner">
                  <span className="y24-section-num" aria-hidden="true">
                    {String(report.sections.length + 1).padStart(2, '0')}
                  </span>
                  <h2 className="y24-section-title">{dictionary.timelineLabel}</h2>
                </div>
              </div>
            </div>
            <div className="shell y24-section-body">
              <AnimatedTimeline
                timeline={report.data.timeline}
                locale={contentLocale}
                year={report.year}
                label={dictionary.timelineLabel}
              />
            </div>
          </section>
        </Reveal>
      ) : null}

      {/* ══════════════════════════════════════════════
          PUBLICATIONS
      ══════════════════════════════════════════════ */}
      {report.data.publications && report.data.publications.length > 0 ? (
        <Reveal>
          <section id="publications" className="y24-section report-anchor-section">
            <div className="y24-section-header-band">
              <div className="shell">
                <div className="y24-section-header-inner">
                  <span className="y24-section-num" aria-hidden="true">
                    {String(report.sections.length + (report.data.timeline?.length ? 2 : 1)).padStart(2, '0')}
                  </span>
                  <h2 className="y24-section-title">{dictionary.publicationsLabel}</h2>
                </div>
              </div>
            </div>
            <div className="shell y24-section-body">
              <PublicationsList
                publications={report.data.publications}
                dictionary={dictionary}
              />
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  )
}
