import { useId, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type ChartDatum = YearData['stats']['charts'][number]

interface AnimatedBarChartProps {
  chart: ChartDatum
  locale: Locale
}

export default function AnimatedBarChart({ chart, locale }: AnimatedBarChartProps) {
  const prefersReducedMotion = useReducedMotion()
  const chartId = useId()
  const dictionary = getUiDictionary(locale)
  const max = Math.max(...chart.points.map((point) => point.value))
  const [activePointId, setActivePointId] = useState(chart.points[0]?.id ?? '')

  const average = useMemo(() => {
    const sum = chart.points.reduce((total, point) => total + point.value, 0)
    return chart.points.length === 0 ? 0 : sum / chart.points.length
  }, [chart.points])

  const activePoint =
    chart.points.find((point) => point.id === activePointId) ?? chart.points[0]

  const firstValue = chart.points[0]?.value ?? 0
  const lastValue = chart.points[chart.points.length - 1]?.value ?? 0
  const trendFromStart = lastValue - firstValue
  const trendSign = trendFromStart > 0 ? '+' : ''

  return (
    <div className="bar-chart">
      <p className="bar-chart-title" id={`${chartId}-title`}>
        {chart.title[locale]}
      </p>
      <p className="bar-chart-description" id={`${chartId}-description`}>
        {chart.description[locale]}
      </p>

      <div className="bar-chart-insight">
        <p>
          <strong>{dictionary.chartFocusLabel}:</strong>{' '}
          {activePoint.label[locale]} - {activePoint.value.toLocaleString(toLanguageTag(locale))}
        </p>
        <p>
          <strong>{dictionary.chartAverageLabel}:</strong>{' '}
          {average.toLocaleString(toLanguageTag(locale), {
            maximumFractionDigits: 1,
          })}
        </p>
        <p>
          <strong>{dictionary.chartFromStartLabel}:</strong>{' '}
          {trendSign}
          {trendFromStart.toLocaleString(toLanguageTag(locale))}
        </p>
      </div>

      <div
        className="bar-chart-grid"
        role="group"
        aria-labelledby={`${chartId}-title`}
        aria-describedby={`${chartId}-description ${chartId}-summary`}
      >
        {chart.points.map((point, index) => {
          const width = max === 0 ? 0 : Math.round((point.value / max) * 100)
          const animatedWidth =
            point.value <= 0 ? 0 : width > 0 && width < 6 ? 6 : width

          return (
            <button
              type="button"
              className={`bar-chart-row ${activePointId === point.id ? 'is-active' : ''}`}
              key={point.id}
              aria-pressed={activePointId === point.id}
              onMouseEnter={() => {
                setActivePointId(point.id)
              }}
              onFocus={() => {
                setActivePointId(point.id)
              }}
              onPointerDown={() => {
                setActivePointId(point.id)
              }}
              onClick={() => {
                setActivePointId(point.id)
              }}
            >
              <span className="bar-chart-label">{point.label[locale]}</span>
              <div className="bar-chart-track" aria-hidden="true">
                <motion.div
                  className="bar-chart-fill"
                  initial={prefersReducedMotion ? false : { width: 0 }}
                  whileInView={{ width: `${animatedWidth}%` }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.65,
                    delay: prefersReducedMotion ? 0 : index * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </div>
              <span className="bar-chart-value">
                {point.value.toLocaleString(toLanguageTag(locale))}
              </span>
            </button>
          )
        })}
      </div>

      <ul className="sr-only" id={`${chartId}-summary`}>
        {chart.points.map((point) => (
          <li key={point.id}>
            {point.label[locale]}: {point.value.toLocaleString(toLanguageTag(locale))}
          </li>
        ))}
      </ul>
    </div>
  )
}
