import type { Locale } from '#/lib/i18n/locale'

export const REQUIRED_SECTION_KEYS = [
  'foreword',
  'articles',
  'stats',
  'projects',
  'highlights',
  'cooperationPartners',
] as const

export type SectionKey = (typeof REQUIRED_SECTION_KEYS)[number]

export interface SectionManifestItem {
  key: SectionKey
  slug: string
  required: true
  labels: Record<Locale, string>
}

export const REQUIRED_SECTIONS: readonly SectionManifestItem[] = [
  {
    key: 'foreword',
    slug: 'foreword',
    required: true,
    labels: {
      de: 'Vorwort',
      en: 'Foreword',
    },
  },
  {
    key: 'articles',
    slug: 'articles',
    required: true,
    labels: {
      de: 'Artikel',
      en: 'Articles',
    },
  },
  {
    key: 'stats',
    slug: 'stats',
    required: true,
    labels: {
      de: 'Statistiken',
      en: 'Stats',
    },
  },
  {
    key: 'projects',
    slug: 'projects',
    required: true,
    labels: {
      de: 'Projekte',
      en: 'Projects',
    },
  },
  {
    key: 'highlights',
    slug: 'highlights',
    required: true,
    labels: {
      de: 'Highlights',
      en: 'Highlights',
    },
  },
  {
    key: 'cooperationPartners',
    slug: 'cooperation-partners',
    required: true,
    labels: {
      de: 'Kooperationspartner',
      en: 'Cooperation Partners',
    },
  },
] as const

const sectionByKey = Object.fromEntries(
  REQUIRED_SECTIONS.map((item) => [item.key, item]),
) as Record<SectionKey, SectionManifestItem>

export function getSectionByKey(key: SectionKey): SectionManifestItem {
  return sectionByKey[key]
}
