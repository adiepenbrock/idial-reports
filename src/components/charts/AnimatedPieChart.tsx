import { useId, useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type ChartDatum = YearData['stats']['charts'][number]

interface AnimatedPieChartProps {
  chart: ChartDatum
  locale: Locale
}

const CX = 100
const CY = 100
const R_OUTER = 80
const R_INNER = 52
const STROKE_R = (R_OUTER + R_INNER) / 2       // 66
const STROKE_W = R_OUTER - R_INNER              // 28
const CIRCUMFERENCE = 2 * Math.PI * STROKE_R   // ≈ 414.7
const GAP_DEG = 1.5                             // degree gap between slices

const SLICE_COLORS = ['#F55500', '#0DC5A3', '#8B5CF6', '#0EA5E9', '#F59E0B', '#EC4899']

export default function AnimatedPieChart({ chart, locale }: AnimatedPieChartProps) {
  const prefersReducedMotion = useReducedMotion()
  const chartId = useId()
  const localeTag = toLanguageTag(locale)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const total = useMemo(() => chart.points.reduce((s, p) => s + p.value, 0), [chart.points])

  const slices = useMemo(() => {
    let cumAngle = 0
    return chart.points.map((point, i) => {
      const pct = total > 0 ? point.value / total : 0
      const angleDeg = pct * 360
      const startAngle = cumAngle + GAP_DEG / 2
      const sweepDeg = Math.max(0, angleDeg - GAP_DEG)
      const fillLen = (sweepDeg / 360) * CIRCUMFERENCE
      cumAngle += angleDeg
      return {
        ...point,
        pct,
        startAngle,
        fillLen,
        color: SLICE_COLORS[i % SLICE_COLORS.length],
      }
    })
  }, [chart.points, total])

  const hovered = slices.find((s) => s.id === hoveredId) ?? null

  return (
    <div className="pie-chart" aria-labelledby={`${chartId}-title`}>
      <p className="pie-chart-title" id={`${chartId}-title`}>
        {chart.title[locale]}
      </p>
      <p className="pie-chart-description">{chart.description[locale]}</p>

      <div className="pie-chart-body">
        <div className="pie-chart-svg-wrap" role="img" aria-label={chart.title[locale]}>
          <svg
            viewBox="0 0 200 200"
            width="200"
            height="200"
            style={{ display: 'block', overflow: 'visible' }}
          >
            {slices.map((slice, i) => (
              <motion.circle
                key={slice.id}
                cx={CX}
                cy={CY}
                r={STROKE_R}
                fill="none"
                stroke={slice.color}
                strokeWidth={STROKE_W}
                strokeLinecap="butt"
                strokeDasharray={`${slice.fillLen} ${CIRCUMFERENCE}`}
                transform={`rotate(${slice.startAngle - 90}, ${CX}, ${CY})`}
                style={{
                  opacity: hoveredId === null || hoveredId === slice.id ? 1 : 0.35,
                  cursor: 'pointer',
                  transition: 'opacity 150ms ease',
                }}
                initial={{ strokeDashoffset: slice.fillLen }}
                whileInView={{ strokeDashoffset: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.75,
                  delay: prefersReducedMotion ? 0 : i * 0.09,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onMouseEnter={() => setHoveredId(slice.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(slice.id)}
                onBlur={() => setHoveredId(null)}
                tabIndex={0}
                aria-label={`${slice.label[locale]}: ${Math.round(slice.pct * 100)}%`}
              />
            ))}

            {/* Center content */}
            <text
              x={CX}
              y={CY - 4}
              textAnchor="middle"
              fontSize="19"
              fontWeight="400"
              fontFamily="'DM Serif Display', Georgia, serif"
              fill="var(--ink)"
              style={{ pointerEvents: 'none' }}
            >
              {hovered
                ? `${Math.round(hovered.pct * 100)}%`
                : total.toLocaleString(localeTag)}
            </text>
            <text
              x={CX}
              y={CY + 13}
              textAnchor="middle"
              fontSize="8.5"
              fill="var(--ink-muted)"
              style={{ pointerEvents: 'none' }}
            >
              {hovered ? hovered.label[locale] : (chart.unit ?? '')}
            </text>
          </svg>
        </div>

        <ul className="pie-chart-legend" role="list">
          {slices.map((slice) => (
            <li
              key={slice.id}
              className={`pie-chart-legend-item${hoveredId === slice.id ? ' is-active' : ''}`}
              onMouseEnter={() => setHoveredId(slice.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className="pie-chart-legend-dot" style={{ background: slice.color }} />
              <span className="pie-chart-legend-label">{slice.label[locale]}</span>
              <span className="pie-chart-legend-pct">{Math.round(slice.pct * 100)}%</span>
              <span className="pie-chart-legend-value">
                {slice.value.toLocaleString(localeTag)}
                {chart.unit ? ` ${chart.unit}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <ul className="sr-only" role="list" aria-label={chart.title[locale]}>
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
