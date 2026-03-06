import { Link } from '@tanstack/react-router'
import type { ReportYearSummary } from '#/lib/content/types'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { isCustomLayoutYear } from '#/lib/layout/layoutRegistry'

interface YearNavigationProps {
  locale: Locale
  currentYear: string
  yearSummaries: ReportYearSummary[]
  dictionary: UiDictionary
}

export default function YearNavigation({
  locale,
  currentYear,
  yearSummaries,
  dictionary,
}: YearNavigationProps) {
  return (
    <nav className="year-nav" aria-label={dictionary.yearlyNavigation}>
      <p className="meta-label">{dictionary.yearlyNavigation}</p>
      <div className="year-nav-list">
        {yearSummaries.map((entry) => {
          const isActive = entry.year === currentYear
          const custom = isCustomLayoutYear(entry.year)

          return (
            <Link
              key={entry.year}
              to="/$locale/report/$year"
              params={{ locale, year: entry.year }}
              className={isActive ? 'year-pill year-pill-active' : 'year-pill'}
              aria-current={isActive ? 'page' : undefined}
            >
              <span>{entry.year}</span>
              <small>{custom ? dictionary.customDesign : dictionary.defaultDesign}</small>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
