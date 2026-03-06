import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { REQUIRED_SECTIONS } from '#/lib/content/sectionManifest'

interface SiteFooterProps {
  dictionary: UiDictionary
  locale: Locale
}

export default function SiteFooter({ dictionary, locale }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="shell site-footer-inner">
        <div className="site-footer-brand">
          <span className="brand-dot site-footer-dot" aria-hidden="true" />
          <div>
            <strong className="site-footer-title">{dictionary.siteTitle}</strong>
            <span className="site-footer-sub">{dictionary.siteSubtitle}</span>
          </div>
        </div>

        <nav className="site-footer-sections" aria-label={dictionary.sectionsLabel}>
          <p className="meta-label">{dictionary.sectionsLabel}</p>
          <ul>
            {REQUIRED_SECTIONS.map((section) => (
              <li key={section.slug}>
                <span className="site-footer-section-item">{section.labels[locale]}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-footer-copy">
          <span className="meta-label">
            &copy; {year} {dictionary.siteTitle}
          </span>
        </div>
      </div>
    </footer>
  )
}
