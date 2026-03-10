import { useId, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type ChartDatum = YearData['stats']['charts'][number]

interface AnimatedColumnChartProps {
  chart: ChartDatum
  locale: Locale
}

export default function AnimatedColumnChart({ chart, locale }: AnimatedColumnChartProps) {
  const prefersReducedMotion = useReducedMotion()
  const chartId = useId()
  const dictionary = getUiDictionary(locale)
  const localeTag = toLanguageTag(locale)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const max = Math.max(...chart.points.map((p) => p.value))
  const firstValue = chart.points[0]?.value ?? 0
  const lastValue = chart.points[chart.points.length - 1]?.value ?? 0
  const overallDelta = lastValue - firstValue
  const overallSign = overallDelta > 0 ? '+' : ''

  return (
    <div className="column-chart" aria-labelledby={`${chartId}-title`}>
      <p className="column-chart-title" id={`${chartId}-title`}>
        {chart.title[locale]}
      </p>
      <p className="column-chart-description">{chart.description[locale]}</p>

      <div className="column-chart-meta">
        <span>
          <strong>{dictionary.chartTrendLabel}:</strong>{' '}
          <span data-positive={overallDelta >= 0}>
            {overallSign}
            {overallDelta.toLocaleString(localeTag)}
            {chart.unit ? ` ${chart.unit}` : ''}
          </span>
        </span>
      </div>

      <div
        className="column-chart-grid"
        role="group"
        aria-labelledby={`${chartId}-title`}
        aria-describedby={`${chartId}-sr`}
      >
        {chart.points.map((point, index) => {
          const prev = chart.points[index - 1]
          const delta = prev !== undefined ? point.value - prev.value : null
          const deltaSign = delta !== null && delta > 0 ? '+' : ''
          const heightPct = max === 0 ? 0 : Math.max((point.value / max) * 100, 4)

          return (
            <div
              key={point.id}
              className={`column-chart-col${hoveredId === point.id ? ' is-active' : ''}`}
              onMouseEnter={() => setHoveredId(point.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span
                className={`column-chart-delta${delta === null ? ' is-placeholder' : delta >= 0 ? ' is-positive' : ' is-negative'}`}
                aria-hidden="true"
              >
                {delta !== null ? `${deltaSign}${delta.toLocaleString(localeTag)}` : ''}
              </span>

              <div className="column-chart-bar-wrap" aria-hidden="true">
                <motion.div
                  className="column-chart-bar"
                  style={{ height: `${heightPct}%`, transformOrigin: 'center bottom' }}
                  initial={prefersReducedMotion ? false : { scaleY: 0, opacity: 0 }}
                  whileInView={{ scaleY: 1, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.65,
                    delay: prefersReducedMotion ? 0 : index * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>

              <span className="column-chart-value">
                {point.value.toLocaleString(localeTag)}
                {chart.unit ? <span className="column-chart-unit"> {chart.unit}</span> : null}
              </span>

              <span className="column-chart-label">{point.label[locale]}</span>
            </div>
          )
        })}
      </div>

      <ul className="sr-only" id={`${chartId}-sr`} aria-label={chart.title[locale]}>
        {chart.points.map((p) => (
          <li key={p.id}>
            {p.label[locale]}: {p.value.toLocaleString(localeTag)}
            {chart.unit ? ` ${chart.unit}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
