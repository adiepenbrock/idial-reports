import { useId, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { getUiDictionary } from '#/lib/i18n/dictionary'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type ChartDatum = YearData['stats']['charts'][number]

interface AnimatedLineChartProps {
  chart: ChartDatum
  locale: Locale
}

const W = 560
const H = 160
const PAD = { top: 18, right: 16, bottom: 36, left: 12 }
const INNER_W = W - PAD.left - PAD.right
const INNER_H = H - PAD.top - PAD.bottom

function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return ''
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpx = ((prev.x + curr.x) / 2).toFixed(2)
    d += ` C ${cpx} ${prev.y.toFixed(2)}, ${cpx} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`
  }
  return d
}

function areaPath(pts: { x: number; y: number }[], bottomY: number): string {
  if (pts.length < 2) return ''
  const line = smoothPath(pts)
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${line} L ${last.x.toFixed(2)} ${bottomY} L ${first.x.toFixed(2)} ${bottomY} Z`
}

export default function AnimatedLineChart({ chart, locale }: AnimatedLineChartProps) {
  const prefersReducedMotion = useReducedMotion()
  const chartId = useId()
  const dictionary = getUiDictionary(locale)
  const localeTag = toLanguageTag(locale)
  const svgRef = useRef<SVGSVGElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const max = useMemo(() => Math.max(...chart.points.map((p) => p.value)), [chart.points])
  const min = useMemo(
    () => Math.max(0, Math.min(...chart.points.map((p) => p.value)) * 0.85),
    [chart.points],
  )
  const range = max - min || 1

  const normalizedPoints = useMemo(
    () =>
      chart.points.map((pt, i) => ({
        ...pt,
        x: PAD.left + (i / Math.max(chart.points.length - 1, 1)) * INNER_W,
        y: PAD.top + INNER_H - ((pt.value - min) / range) * INNER_H,
      })),
    [chart.points, min, range],
  )

  const linePath = useMemo(() => smoothPath(normalizedPoints), [normalizedPoints])
  const fillPath = useMemo(
    () => areaPath(normalizedPoints, PAD.top + INNER_H),
    [normalizedPoints],
  )

  const average = useMemo(() => {
    const sum = chart.points.reduce((t, p) => t + p.value, 0)
    return chart.points.length === 0 ? 0 : sum / chart.points.length
  }, [chart.points])

  const trendValue = chart.points[chart.points.length - 1].value - chart.points[0].value
  const trendSign = trendValue > 0 ? '+' : ''

  const hovered = hoveredIndex !== null ? normalizedPoints[hoveredIndex] : null

  return (
    <div className="line-chart" aria-labelledby={`${chartId}-title`}>
      <p className="line-chart-title" id={`${chartId}-title`}>
        {chart.title[locale]}
      </p>
      <p className="line-chart-desc">{chart.description[locale]}</p>

      <div className="line-chart-meta">
        <span>
          <strong>{dictionary.chartAverageLabel}:</strong>{' '}
          {average.toLocaleString(localeTag, { maximumFractionDigits: 1 })}
          {chart.unit ? ` ${chart.unit}` : ''}
        </span>
        <span>
          <strong>{dictionary.chartTrendLabel}:</strong>{' '}
          <span data-positive={trendValue > 0}>
            {trendSign}
            {trendValue.toLocaleString(localeTag)}
          </span>
        </span>
      </div>

      <div className="line-chart-svg-wrap" role="img" aria-label={chart.title[locale]}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          width="100%"
          height="180"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id={`${chartId}-fill`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id={`${chartId}-line`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--teal)" />
              <stop offset="100%" stopColor="var(--accent)" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD.top + INNER_H * (1 - frac)
            const val = min + range * frac
            return (
              <g key={frac}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.08"
                  strokeWidth="1"
                />
                <text
                  x={PAD.left - 4}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="currentColor"
                  fillOpacity="0.35"
                >
                  {Math.round(val)}
                </text>
              </g>
            )
          })}

          {/* Area fill */}
          <motion.path
            d={fillPath}
            fill={`url(#${chartId}-fill)`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.55, delay: prefersReducedMotion ? 0 : 0.9 }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={`url(#${chartId}-line)`}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={prefersReducedMotion ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: prefersReducedMotion ? 0 : 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Dots */}
          {normalizedPoints.map((pt, i) => (
            <motion.circle
              key={pt.id}
              cx={pt.x}
              cy={pt.y}
              r={hoveredIndex === i ? 6 : 4}
              fill="var(--page-panel)"
              stroke={hoveredIndex === i ? 'var(--accent)' : `url(#${chartId}-line)`}
              strokeWidth="2"
              style={{ cursor: 'pointer' }}
              initial={prefersReducedMotion ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 1.0 + i * 0.06,
                ease: 'backOut',
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
              aria-label={`${pt.label[locale]}: ${pt.value.toLocaleString(localeTag)}${chart.unit ? ` ${chart.unit}` : ''}`}
            />
          ))}

          {/* Hover tooltip */}
          {hovered ? (
            <g>
              <line
                x1={hovered.x}
                y1={PAD.top}
                x2={hovered.x}
                y2={PAD.top + INNER_H}
                stroke="var(--accent)"
                strokeOpacity="0.25"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
              <rect
                x={Math.min(hovered.x + 6, W - 120)}
                y={hovered.y - 22}
                width={114}
                height={26}
                rx="4"
                fill="var(--ink-band)"
                fillOpacity="0.92"
              />
              <text
                x={Math.min(hovered.x + 13, W - 113)}
                y={hovered.y - 4}
                fontSize="10"
                fill="var(--light-1)"
              >
                {hovered.label[locale]}: {hovered.value.toLocaleString(localeTag)}
                {chart.unit ? ` ${chart.unit}` : ''}
              </text>
            </g>
          ) : null}

          {/* X-axis labels */}
          {normalizedPoints.map((pt) => (
            <text
              key={`label-${pt.id}`}
              x={pt.x}
              y={H - 6}
              textAnchor="middle"
              fontSize="9.5"
              fill="currentColor"
              fillOpacity="0.45"
            >
              {pt.label[locale]}
            </text>
          ))}
        </svg>
      </div>

      {/* Screen reader summary */}
      <ul className="sr-only" role="list" aria-label={chart.title[locale]}>
        {chart.points.map((pt) => (
          <li key={pt.id}>
            {pt.label[locale]}: {pt.value.toLocaleString(localeTag)}
            {chart.unit ? ` ${chart.unit}` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
