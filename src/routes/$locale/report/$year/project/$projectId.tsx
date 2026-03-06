import { Link, createFileRoute, getRouteApi } from '@tanstack/react-router'
import { motion, useReducedMotion } from 'motion/react'
import Reveal from '#/components/motion/Reveal'
import { getBodyComponent } from '#/lib/content/loadReports'

const yearRoute = getRouteApi('/$locale/report/$year')

export const Route = createFileRoute('/$locale/report/$year/project/$projectId')({
  component: ProjectDetailPage,
})

/** First 1–2 meaningful chars of a name as a monogram */
function monogram(name: string): string {
  const words = name.trim().split(/\s+/)
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function ProjectDetailPage() {
  const { locale, dictionary, report } = yearRoute.useLoaderData()
  const { projectId } = Route.useParams()
  const prefersReducedMotion = useReducedMotion()
  const contentLocale = report.locale

  const project = report.data.projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <main className="shell report-page">
        <Reveal>
          <section className="hero-panel">
            <h1>{dictionary.projectNotFoundTitle}</h1>
            <p className="hero-summary">{dictionary.projectNotFoundBody}</p>
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

  const related = report.data.projects.filter((p) => p.id !== projectId).slice(0, 3)
  const projectIndex = report.data.projects.findIndex((p) => p.id === projectId)
  const totalProjects = report.data.projects.length

  return (
    <div className="detail-page">
      {/* ── Teal hero band ── */}
      <Reveal>
        <div className="report-hero-band teal-hero">
          <div className="shell">
            <section className="detail-page-hero" aria-label={project.title[contentLocale]}>
              <div className="detail-page-eyebrow">
                <Link
                  to="/$locale/report/$year"
                  params={{ locale, year: report.year }}
                  className="detail-back-link"
                >
                  ← {dictionary.backToReport}
                </Link>
                <p className="meta-label" aria-hidden="true">
                  {report.year} · {String(projectIndex + 1).padStart(2, '0')} / {String(totalProjects).padStart(2, '0')}
                </p>
              </div>

              <div className="detail-page-type-badge detail-page-type-badge--project">
                <span className="meta-label">{dictionary.projectsMetricLabel}</span>
              </div>

              <h1 className="detail-page-title">{project.title[contentLocale]}</h1>

              <div className="detail-page-context">
                <span className="detail-context-label">{dictionary.statusLabel}</span>
                <span className="detail-context-value detail-context-status">
                  {project.status[contentLocale]}
                </span>
                {project.funding?.period ? (
                  <>
                    <span className="detail-context-separator" aria-hidden="true">·</span>
                    <span className="detail-context-label">{dictionary.fundingPeriodLabel}</span>
                    <span className="detail-context-value">{project.funding.period}</span>
                  </>
                ) : null}
                {project.funding?.projectNumber ? (
                  <>
                    <span className="detail-context-separator" aria-hidden="true">·</span>
                    <span className="detail-context-label">{dictionary.projectNumberLabel}</span>
                    <span className="detail-context-value project-number-hero">
                      {project.funding.projectNumber}
                    </span>
                  </>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </Reveal>

      {/* ── Project body ── */}
      <div className="shell detail-page-body">

        {/* Emphasized summary + body text */}
        <Reveal delay={0.06}>
          <div className="project-lead-block">
            <p className="project-lead-text">{project.summary[contentLocale]}</p>
          </div>
        </Reveal>

        {(() => {
          const BodyComponent = getBodyComponent(report.year, 'projects', projectId, contentLocale)
          return BodyComponent ? (
            <Reveal delay={0.09}>
              <article className="article-content project-body">
                <div className="project-body-prose"><BodyComponent /></div>
              </article>
            </Reveal>
          ) : null
        })()}

        {/* External links */}
        {project.links && project.links.length > 0 ? (
          <Reveal delay={0.11}>
            <section className="project-links-section" aria-label={dictionary.projectLinksLabel}>
              <p className="meta-label project-links-label">{dictionary.projectLinksLabel}</p>
              <ul className="project-links-list">
                {project.links.map((link) => (
                  <li key={link.url} className="project-link-item">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-link"
                    >
                      <span className="project-link-icon" aria-hidden="true">↗</span>
                      {link.label[contentLocale]}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ) : null}

        {/* Funding + Partners */}
        <div className="project-meta-row">

          {/* Funding card */}
          {project.funding ? (
            <Reveal delay={0.12}>
              <section className="project-funding-card" aria-label={dictionary.fundingLabel}>
                <p className="project-meta-section-label meta-label">{dictionary.fundingLabel}</p>

                {project.funding.projectNumber ? (
                  <div className="project-number-block">
                    <span className="meta-label project-number-label">{dictionary.projectNumberLabel}</span>
                    <span className="project-number-value">{project.funding.projectNumber}</span>
                  </div>
                ) : null}

                <div className="project-funding-funder">
                  <div className="project-funder-logo" aria-hidden="true">
                    {monogram(project.funding.source)}
                  </div>
                  <div>
                    <p className="project-funder-name">{project.funding.source}</p>
                    {project.funding.programme ? (
                      <p className="project-funder-programme">{project.funding.programme}</p>
                    ) : null}
                  </div>
                </div>

                <dl className="project-funding-details">
                  {project.funding.amount ? (
                    <div className="project-funding-detail">
                      <dt>{dictionary.fundingAmountLabel}</dt>
                      <dd>{project.funding.amount}</dd>
                    </div>
                  ) : null}
                  {project.funding.period ? (
                    <div className="project-funding-detail">
                      <dt>{dictionary.fundingPeriodLabel}</dt>
                      <dd>{project.funding.period}</dd>
                    </div>
                  ) : null}
                  {project.funding.grantId ? (
                    <div className="project-funding-detail">
                      <dt>{dictionary.fundingGrantIdLabel}</dt>
                      <dd className="project-funding-grant-id">{project.funding.grantId}</dd>
                    </div>
                  ) : null}
                </dl>
              </section>
            </Reveal>
          ) : null}

          {/* Partners card */}
          {project.partners && project.partners.length > 0 ? (
            <Reveal delay={0.16}>
              <section className="project-partners-card" aria-label={dictionary.projectPartnersLabel}>
                <div className="project-partners-header">
                  <p className="project-meta-section-label meta-label">{dictionary.projectPartnersLabel}</p>
                  <span className="project-partners-count">{project.partners.length}</span>
                </div>

                <ul className="project-partners-grid">
                  {project.partners.map((partner, i) => (
                    <motion.li
                      key={partner.name}
                      className="partner-card"
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.3,
                        delay: prefersReducedMotion ? 0 : i * 0.06,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div className="partner-card-logo" aria-hidden="true">
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt={partner.name} className="partner-logo-img" />
                        ) : (
                          <span className="partner-logo-monogram">{monogram(partner.name)}</span>
                        )}
                      </div>
                      <div className="partner-card-info">
                        {partner.url ? (
                          <a
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="partner-name partner-name-link"
                          >
                            {partner.name}
                            <span className="partner-external-icon" aria-hidden="true">↗</span>
                          </a>
                        ) : (
                          <p className="partner-name">{partner.name}</p>
                        )}
                        {partner.role ? (
                          <p className="partner-role">{partner.role[contentLocale]}</p>
                        ) : null}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ) : null}

        </div>

        {/* ── Team ── */}
        {project.team && project.team.length > 0 ? (
          <Reveal delay={0.14}>
            <section className="project-team-section" aria-label={dictionary.projectTeamLabel}>
              <p className="meta-label project-team-label">{dictionary.projectTeamLabel}</p>
              <ul className="project-team-grid">
                {project.team.map((member) => {
                  const initials = member.name
                    .trim()
                    .split(/\s+/)
                    .filter((w) => w.length > 0)
                    .slice(0, 2)
                    .map((w) => w[0].toUpperCase())
                    .join('')
                  return (
                    <li key={member.name} className="team-member-card">
                      <div className="team-member-avatar" aria-hidden="true">
                        {member.avatarUrl ? (
                          <img src={member.avatarUrl} alt={member.name} className="team-member-avatar-img" />
                        ) : (
                          <span className="team-member-initials">{initials}</span>
                        )}
                      </div>
                      <div className="team-member-info">
                        <p className="team-member-name">{member.name}</p>
                        <p className="team-member-role">{member.role[contentLocale]}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          </Reveal>
        ) : null}

        {/* ── Related projects ── */}
        {related.length > 0 ? (
          <section className="related-section" aria-label={dictionary.relatedProjectsLabel}>
            <p className="meta-label related-section-label">{dictionary.relatedProjectsLabel}</p>
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
                    to="/$locale/report/$year/project/$projectId"
                    params={{ locale, year: report.year, projectId: rel.id }}
                    className="detail-card detail-card-link"
                  >
                    <h3>{rel.title[contentLocale]}</h3>
                    <p>{rel.summary[contentLocale]}</p>
                    <p className="detail-meta">{rel.status[contentLocale]}</p>
                    <span className="cta-link detail-card-cta">{dictionary.openProject} →</span>
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
