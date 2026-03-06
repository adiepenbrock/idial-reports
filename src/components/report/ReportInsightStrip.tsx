import { motion, useReducedMotion } from 'motion/react'
import type { LoadedReport } from '#/lib/content/types'
import type { UiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'

interface ReportInsightStripProps {
  report: LoadedReport
  locale: Locale
  dictionary: UiDictionary
}

function parseDelta(input: string): number | null {
  const normalized = input.replace(',', '.').replace(/[^0-9+-.]/g, '')
  const numeric = Number(normalized)
  return Number.isFinite(numeric) ? numeric : null
}

export default function ReportInsightStrip({
  report,
  locale,
  dictionary,
}: ReportInsightStripProps) {
  const reducedMotion = useReducedMotion()
  const localeTag = toLanguageTag(locale)

  const firstChart = report.data.stats.charts[0]
  const firstValue = firstChart?.points[0]?.value ?? 0
  const lastValue = firstChart?.points[firstChart.points.length - 1]?.value ?? 0
  const growth = lastValue - firstValue
  const growthSign = growth > 0 ? '+' : ''

  const strongestKpi = report.data.stats.kpis.reduce((highest, next) => {
    if (!highest || next.value > highest.value) {
      return next
    }

    return highest
  }, report.data.stats.kpis[0])

  const strongestDelta = parseDelta(strongestKpi.delta)
  const strongestDeltaSign = strongestDelta && strongestDelta > 0 ? '+' : ''

  const tiles = [
    {
      id: 'articles',
      label: dictionary.articlesMetricLabel,
      value: report.data.articles.length.toLocaleString(localeTag),
      meta: `${report.year} ${dictionary.availableYears.toLowerCase()}`,
    },
    {
      id: 'projects',
      label: dictionary.projectsMetricLabel,
      value: report.data.projects.length.toLocaleString(localeTag),
      meta: `${report.data.stats.charts.length} ${dictionary.statsTitle.toLowerCase()}`,
    },
    {
      id: 'partners',
      label: dictionary.partnersMetricLabel,
      value: report.data.cooperationPartners.length.toLocaleString(localeTag),
      meta: dictionary.cooperationPartnersTitle,
    },
    {
      id: 'peak-kpi',
      label: dictionary.peakMetricLabel,
      value: strongestKpi.value.toLocaleString(localeTag),
      meta: `${strongestKpi.label[locale]} ${strongestDelta !== null ? `(${strongestDeltaSign}${strongestDelta})` : ''}`,
    },
    {
      id: 'growth',
      label: dictionary.growthMetricLabel,
      value: `${growthSign}${growth.toLocaleString(localeTag)}`,
      meta: `${firstChart?.title[locale] ?? dictionary.statsTitle}`,
    },
  ]

  return (
    <section className="report-insight-strip" aria-label={dictionary.reportOverviewLabel}>
      {tiles.map((tile, index) => (
        <motion.article
          key={tile.id}
          className="insight-tile"
          initial={
            reducedMotion
              ? undefined
              : {
                  opacity: 0,
                  y: 14,
                }
          }
          whileInView={
            reducedMotion
              ? undefined
              : {
                  opacity: 1,
                  y: 0,
                }
          }
          viewport={{ once: true, amount: 0.45 }}
          transition={{
            duration: reducedMotion ? 0 : 0.45,
            delay: reducedMotion ? 0 : index * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <p className="meta-label">{tile.label}</p>
          <p className="insight-value">{tile.value}</p>
          <p className="insight-meta">{tile.meta}</p>
        </motion.article>
      ))}
    </section>
  )
}
