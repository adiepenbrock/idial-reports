export const SUPPORTED_LOCALES = ['de', 'en'] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'de'

const localeSet = new Set<string>(SUPPORTED_LOCALES)

export function isLocale(value: string): value is Locale {
  return localeSet.has(value)
}

export function resolveLocaleParam(value: string): Locale | null {
  return isLocale(value) ? value : null
}

export function getOtherLocale(locale: Locale): Locale {
  return locale === 'de' ? 'en' : 'de'
}

export function withLocaleInPath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return `/${locale}`
  }

  if (isLocale(segments[0]) || /^[a-z]{2}$/i.test(segments[0])) {
    segments[0] = locale
    return `/${segments.join('/')}`
  }

  return `/${locale}/${segments.join('/')}`
}

export function toLanguageTag(locale: Locale): string {
  return locale === 'de' ? 'de-DE' : 'en-US'
}
