import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import Reveal from '#/components/motion/Reveal'
import { getBodyComponent } from '#/lib/content/loadReports'

const yearRoute = getRouteApi('/$locale/report/$year')

export const Route = createFileRoute('/$locale/report/$year/article/$articleId')({
  component: ArticleDetailPage,
})

function ArticleDetailPage() {
  const { locale, dictionary, report } = yearRoute.useLoaderData()
  const { articleId } = Route.useParams()
  const prefersReducedMotion = useReducedMotion()
  const contentLocale = report.locale

  const article = report.data.articles.find((a) => a.id === articleId)

  if (!article) {
    return (
      <main className="shell report-page">
        <Reveal>
          <section className="hero-panel">
            <h1>{dictionary.articleNotFoundTitle}</h1>
            <p className="hero-summary">{dictionary.articleNotFoundBody}</p>
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

  const related = report.data.articles.filter((a) => a.id !== articleId).slice(0, 3)
  const articleIndex = report.data.articles.findIndex((a) => a.id === articleId)
  const totalArticles = report.data.articles.length

  return (
    <div className="detail-page">
      {/* ── Dark hero band ── */}
      <Reveal>
        <div className="report-hero-band">
          <div className="shell">
            <section className="detail-page-hero" aria-label={article.title[contentLocale]}>
              <div className="detail-page-eyebrow">
                <Link
                  to="/$locale/report/$year"
                  params={{ locale, year: report.year }}
                  className="detail-back-link"
                >
                  ← {dictionary.backToReport}
                </Link>
                <p className="meta-label" aria-hidden="true">
                  {report.year} · {String(articleIndex + 1).padStart(2, '0')} / {String(totalArticles).padStart(2, '0')}
                </p>
              </div>

              <div className="detail-page-type-badge">
                <span className="meta-label">{dictionary.articlesMetricLabel}</span>
              </div>

              <h1 className="detail-page-title">{article.title[contentLocale]}</h1>

              <div className="detail-page-context">
                <span className="detail-context-label">{dictionary.authorLabel}</span>
                <span className="detail-context-value">{article.author}</span>
              </div>
            </section>
          </div>
        </div>
      </Reveal>

      {/* ── Article body ── */}
      <div className="shell detail-page-body">
        <Reveal delay={0.1}>
          <article className="article-content">
            <p className="article-lead">{article.teaser[contentLocale]}</p>

            {(() => {
              const BodyComponent = getBodyComponent(report.year, 'articles', articleId, contentLocale)
              return BodyComponent ? (
                <div className="article-body-prose"><BodyComponent /></div>
              ) : null
            })()}

            <div className="article-context-strip">
              <div className="article-context-item">
                <span className="meta-label">{dictionary.authorLabel}</span>
                <span>{article.author}</span>
              </div>
              <div className="article-context-item">
                <span className="meta-label">{dictionary.published}</span>
                <span>{report.year}</span>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ── Related articles ── */}
        {related.length > 0 ? (
          <section className="related-section" aria-label={dictionary.relatedArticlesLabel}>
            <p className="meta-label related-section-label">{dictionary.relatedArticlesLabel}</p>
            <div className="detail-grid two-col">
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
                    to="/$locale/report/$year/article/$articleId"
                    params={{ locale, year: report.year, articleId: rel.id }}
                    className="detail-card detail-card-link"
                  >
                    <h3>{rel.title[contentLocale]}</h3>
                    <p>{rel.teaser[contentLocale]}</p>
                    <p className="detail-meta">{rel.author}</p>
                    <span className="cta-link detail-card-cta">{dictionary.openArticle} →</span>
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
