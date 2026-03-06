import { Link } from '@tanstack/react-router'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import LanguageSwitcher from '#/components/navigation/LanguageSwitcher'

interface SiteHeaderProps {
  locale: Locale
  dictionary: UiDictionary
}

export default function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="shell site-header-row">
        <Link to="/$locale" params={{ locale }} className="brand-block">
          <span className="brand-dot" aria-hidden="true" />
          <span>
            <strong>{dictionary.siteTitle}</strong>
            <small>{dictionary.siteSubtitle}</small>
          </span>
        </Link>

        <nav aria-label="Primary" className="header-links">
          <Link to="/$locale" params={{ locale }} activeProps={{ className: 'active' }}>
            {dictionary.availableYears}
          </Link>
        </nav>

        <LanguageSwitcher locale={locale} dictionary={dictionary} />
      </div>
    </header>
  )
}
