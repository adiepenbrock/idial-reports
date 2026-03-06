import { useId } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import CountUp from '#/components/motion/CountUp'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type Kpi = YearData['stats']['kpis'][number]

interface AnimatedDonutChartProps {
  kpis: Kpi[]
  locale: Locale
  label: string
}

const R = 42
const C = 50
const CIRCUMFERENCE = 2 * Math.PI * R

// Accessible OKLCH-compatible palette that works on light cream background
const RING_COLORS = [
  { stroke: 'var(--accent)',       glow: 'rgba(245,85,0,0.18)' },
  { stroke: 'var(--teal)',         glow: 'rgba(13,197,163,0.18)' },
  { stroke: '#8B5CF6',             glow: 'rgba(139,92,246,0.18)' },
  { stroke: '#0EA5E9',             glow: 'rgba(14,165,233,0.18)' },
  { stroke: '#F59E0B',             glow: 'rgba(245,158,11,0.18)' },
]

interface DonutRingProps {
  kpi: Kpi
  locale: Locale
  localeTag: string
  maxValue: number
  color: (typeof RING_COLORS)[number]
  index: number
  prefersReducedMotion: boolean | null
}

function DonutRing({ kpi, locale, localeTag, maxValue, color, index, prefersReducedMotion }: DonutRingProps) {
  const id = useId()
  const pct = maxValue > 0 ? Math.min(kpi.value / maxValue, 1) : 0
  const fillLength = pct * CIRCUMFERENCE

  return (
    <article className="donut-ring-card" aria-label={kpi.label[locale]}>
      <div className="donut-ring-svg-wrap">
        <svg
          viewBox="0 0 100 100"
          width="100"
          height="100"
          aria-hidden="true"
          style={{ display: 'block', margin: '0 auto' }}
        >
          <defs>
            <filter id={`${id}-glow`}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={C} cy={C} r={R}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.08"
            strokeWidth="7"
          />

          {/* Animated fill arc */}
          <motion.circle
            cx={C} cy={C} r={R}
            fill="none"
            stroke={color.stroke}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            style={{ transformOrigin: '50% 50%', rotate: '-90deg' }}
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            whileInView={{
              strokeDashoffset: prefersReducedMotion ? CIRCUMFERENCE - fillLength : CIRCUMFERENCE - fillLength,
            }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 1.2,
              delay: prefersReducedMotion ? 0 : 0.15 * index,
              ease: [0.16, 1, 0.3, 1],
            }}
            filter={`url(#${id}-glow)`}
          />

          {/* Centre percentage */}
          <text
            x={C} y={C + 4}
            textAnchor="middle"
            fontSize="15"
            fontWeight="700"
            fontFamily="'DM Serif Display', Georgia, serif"
            fill="currentColor"
          >
            {Math.round(pct * 100)}%
          </text>
        </svg>
      </div>

      <p className="donut-ring-value">
        <CountUp value={kpi.value} localeTag={localeTag} />
        {kpi.unit ? <span className="donut-ring-unit"> {kpi.unit}</span> : null}
      </p>
      <p className="donut-ring-label">{kpi.label[locale]}</p>
      {kpi.delta ? <p className="donut-ring-delta">{kpi.delta}</p> : null}
    </article>
  )
}

export default function AnimatedDonutChart({ kpis, locale, label }: AnimatedDonutChartProps) {
  const prefersReducedMotion = useReducedMotion()
  const localeTag = toLanguageTag(locale)
  const maxValue = Math.max(...kpis.map((k) => k.value), 1)

  return (
    <div className="donut-chart-section" aria-label={label}>
      <p className="donut-chart-label meta-label">{label}</p>
      <div className="donut-rings-grid">
        {kpis.map((kpi, index) => (
          <DonutRing
            key={kpi.id}
            kpi={kpi}
            locale={locale}
            localeTag={localeTag}
            maxValue={maxValue}
            color={RING_COLORS[index % RING_COLORS.length]}
            index={index}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </div>
  )
}
