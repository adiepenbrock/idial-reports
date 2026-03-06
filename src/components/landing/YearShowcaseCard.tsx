import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { isCustomLayoutYear } from '#/lib/layout/layoutRegistry'
import type { ReportYearSummary } from '#/lib/content/types'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'

interface YearShowcaseCardProps {
  entry: ReportYearSummary
  index: number
  locale: Locale
  dictionary: UiDictionary
}

export default function YearShowcaseCard({
  entry,
  index,
  locale,
  dictionary,
}: YearShowcaseCardProps) {
  const custom = isCustomLayoutYear(entry.year)

  return (
    <motion.article
      layout
      className="year-card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{
        duration: 0.40,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Top row: year display + badge */}
      <div className="year-card-head">
        <p className="meta-label" aria-hidden="true">{entry.year}</p>
        <span
          className={
            custom ? 'design-badge design-badge-custom' : 'design-badge design-badge-default'
          }
        >
          {custom ? dictionary.customDesign : dictionary.defaultDesign}
        </span>
      </div>

      {/* Large editorial year number */}
      <div className="year-card-year-display" aria-hidden="true">
        {entry.year}
      </div>

      <hr className="year-card-divider" />

      {/* Report title and summary */}
      <h3>{entry.title}</h3>
      <p>{entry.summary}</p>

      {/* Footer: stats + locale chips + CTA */}
      <div className="year-card-footer">
        <div>
          <div className="year-card-stats" aria-label={dictionary.reportOverviewLabel}>
            <span>
              <strong>{entry.articleCount}</strong>{' '}{dictionary.articlesMetricLabel}
            </span>
            <span>
              <strong>{entry.projectCount}</strong>{' '}{dictionary.projectsMetricLabel}
            </span>
            <span>
              <strong>{entry.partnerCount}</strong>{' '}{dictionary.partnersMetricLabel}
            </span>
          </div>

          <div className="locale-chip-row" aria-label={dictionary.availableInLabel}>
            {entry.availableLocales.map((entryLocale) => (
              <span className="locale-chip" key={`${entry.year}-${entryLocale}`}>
                {entryLocale.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <Link
          to="/$locale/report/$year"
          params={{ locale, year: entry.year }}
          className="cta-link"
          aria-label={`${dictionary.openReport} ${entry.year}`}
        >
          {dictionary.openReport}
          <svg
            aria-hidden="true"
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
          >
            <path
              d="M1 5h12M8 1l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </motion.article>
  )
}
