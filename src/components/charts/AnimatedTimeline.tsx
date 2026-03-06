import { motion, useReducedMotion } from 'motion/react'
import type { Locale } from '#/lib/i18n/locale'
import { toLanguageTag } from '#/lib/i18n/locale'
import type { YearData } from '#/lib/content/types'

type TimelineEntry = NonNullable<YearData['timeline']>[number]
type TimelineEvent = TimelineEntry['events'][number]
type EventType = NonNullable<TimelineEvent['type']>

export interface AnimatedTimelineProps {
  timeline: NonNullable<YearData['timeline']>
  locale: Locale
  year: string
  label: string
}

const EVENT_TYPE_COLORS: Record<EventType, { bg: string; color: string }> = {
  launch: { bg: '#F55500', color: '#ffffff' },
  publication: { bg: '#0DC5A3', color: '#0C1520' },
  award: { bg: '#F59E0B', color: '#0C1520' },
  milestone: { bg: '#8B5CF6', color: '#ffffff' },
  partnership: { bg: '#0EA5E9', color: '#ffffff' },
  conference: { bg: '#EC4899', color: '#ffffff' },
}

const DEFAULT_TYPE_STYLE = { bg: '#706E68', color: '#ffffff' }

function getTypeStyle(type: EventType | undefined): { bg: string; color: string } {
  if (!type) return DEFAULT_TYPE_STYLE
  return EVENT_TYPE_COLORS[type] ?? DEFAULT_TYPE_STYLE
}

function formatMonthName(month: number, year: string, localeTag: string): string {
  const date = new Date(Number(year), month - 1, 1)
  return new Intl.DateTimeFormat(localeTag, { month: 'long' }).format(date)
}

interface EventCardProps {
  event: TimelineEvent
  locale: Locale
  index: number
  prefersReducedMotion: boolean | null
}

function EventCard({ event, locale, index, prefersReducedMotion }: EventCardProps) {
  const typeStyle = getTypeStyle(event.type)

  return (
    <motion.div
      className="timeline-event-card"
      style={{ borderLeftColor: typeStyle.bg }}
      initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.35,
        delay: prefersReducedMotion ? 0 : index * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {event.type ? (
        <span
          className="timeline-event-type"
          style={{ background: typeStyle.bg, color: typeStyle.color }}
        >
          {event.type}
        </span>
      ) : null}
      <p className="timeline-event-title">{event.title[locale]}</p>
      <p className="timeline-event-desc">{event.description[locale]}</p>
    </motion.div>
  )
}

interface MonthBlockProps {
  entry: TimelineEntry
  locale: Locale
  year: string
  localeTag: string
  monthIndex: number
  prefersReducedMotion: boolean | null
}

function MonthBlock({ entry, locale, year, localeTag, monthIndex, prefersReducedMotion }: MonthBlockProps) {
  const monthName = formatMonthName(entry.month, year, localeTag)

  return (
    <motion.div
      className="timeline-month"
      initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.45,
        delay: prefersReducedMotion ? 0 : monthIndex * 0.06,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="timeline-month-header">
        <div className="timeline-month-dot" aria-hidden="true" />
        <span className="timeline-month-name">{monthName}</span>
        <span className="timeline-month-year">{year}</span>
      </div>
      <div className="timeline-events">
        {entry.events.map((event, eventIndex) => (
          <EventCard
            key={event.id}
            event={event}
            locale={locale}
            index={eventIndex}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default function AnimatedTimeline({ timeline, locale, year, label }: AnimatedTimelineProps) {
  const prefersReducedMotion = useReducedMotion()
  const localeTag = toLanguageTag(locale)

  return (
    <div className="timeline" aria-label={label}>
      <p className="meta-label timeline-section-label" aria-hidden="true">{label}</p>
      <div className="timeline-year-display" aria-hidden="true">{year}</div>

      {timeline.map((entry, monthIndex) => (
        <MonthBlock
          key={entry.month}
          entry={entry}
          locale={locale}
          year={year}
          localeTag={localeTag}
          monthIndex={monthIndex}
          prefersReducedMotion={prefersReducedMotion}
        />
      ))}
    </div>
  )
}
