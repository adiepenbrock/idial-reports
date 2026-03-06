import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import Reveal from '#/components/motion/Reveal'

const yearRoute = getRouteApi('/$locale/report/$year')

export const Route = createFileRoute('/$locale/report/$year/highlight/$highlightId')({
  component: HighlightDetailPage,
})

function HighlightDetailPage() {
  const { locale, dictionary, report } = yearRoute.useLoaderData()
  const { highlightId } = Route.useParams()
  const prefersReducedMotion = useReducedMotion()
  const contentLocale = report.locale

  const highlight = report.data.highlights.find((h) => h.id === highlightId)

  if (!highlight) {
    return (
      <main className="shell report-page">
        <Reveal>
          <section className="hero-panel">
            <h1>{dictionary.highlightNotFoundTitle}</h1>
            <p className="hero-summary">{dictionary.highlightNotFoundBody}</p>
            <Link
              to="/$locale/report/$year"
              params={{ locale, year: report.year }}
              className="cta-link"
            >
              {dictionary.backToReport}
            </Link>
          </section>
        </Reveal>
      </main>
    )
  }

  const related = report.data.highlights.filter((h) => h.id !== highlightId).slice(0, 3)
  const highlightIndex = report.data.highlights.findIndex((h) => h.id === highlightId)
  const totalHighlights = report.data.highlights.length

  return (
    <div className="detail-page">
      {/* ── Dark hero band ── */}
      <Reveal>
        <div className="report-hero-band">
          <div className="shell">
            <section className="detail-page-hero" aria-label={highlight.title[contentLocale]}>
              <div className="detail-page-eyebrow">
                <Link
                  to="/$locale/report/$year"
                  params={{ locale, year: report.year }}
                  className="detail-back-link"
                >
                  ← {dictionary.backToReport}
                </Link>
                <p className="meta-label" aria-hidden="true">
                  {report.year} · {String(highlightIndex + 1).padStart(2, '0')} / {String(totalHighlights).padStart(2, '0')}
                </p>
              </div>

              <div className="detail-page-type-badge detail-page-type-badge--highlight">
                <span className="meta-label">{dictionary.relatedHighlightsLabel.split(' ')[2] ?? 'Highlights'}</span>
              </div>

              <h1 className="detail-page-title">{highlight.title[contentLocale]}</h1>
            </section>
          </div>
        </div>
      </Reveal>

      {/* ── Highlight body ── */}
      <div className="shell detail-page-body">
        <Reveal delay={0.1}>
          <article className="article-content">
            <p className="article-lead">{highlight.detail[contentLocale]}</p>

            {highlight.body ? (
              <p className="highlight-body">{highlight.body[contentLocale]}</p>
            ) : null}

            {highlight.tags && highlight.tags.length > 0 ? (
              <div className="highlight-tags">
                <span className="meta-label highlight-tags-label">{dictionary.tagsLabel}</span>
                <div className="highlight-tags-list">
                  {highlight.tags.map((tag) => (
                    <span key={tag} className="tag-chip">{tag}</span>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="article-context-strip">
              <div className="article-context-item">
                <span className="meta-label">{dictionary.published}</span>
                <span>{report.year}</span>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Related highlights ── */}
        {related.length > 0 ? (
          <section className="related-section" aria-label={dictionary.relatedHighlightsLabel}>
            <p className="meta-label related-section-label">{dictionary.relatedHighlightsLabel}</p>
            <div className="detail-grid">
              {related.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.38,
                    delay: prefersReducedMotion ? 0 : i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to="/$locale/report/$year/highlight/$highlightId"
                    params={{ locale, year: report.year, highlightId: rel.id }}
                    className="detail-card detail-card-link"
                  >
                    <h3>{rel.title[contentLocale]}</h3>
                    <p>{rel.detail[contentLocale]}</p>
                    <span className="cta-link detail-card-cta">{dictionary.openHighlight} →</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
