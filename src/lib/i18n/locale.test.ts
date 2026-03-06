import { describe, expect, it } from 'vitest'
import {
  DEFAULT_LOCALE,
  resolveLocaleParam,
  toLanguageTag,
  withLocaleInPath,
} from './locale'

describe('locale utilities', () => {
  it('resolves known locale params', () => {
    expect(resolveLocaleParam('de')).toBe('de')
    expect(resolveLocaleParam('en')).toBe('en')
    expect(resolveLocaleParam('fr')).toBeNull()
  })

  it('injects or replaces locale in paths', () => {
    expect(withLocaleInPath('/', DEFAULT_LOCALE)).toBe('/de')
    expect(withLocaleInPath('/en/report/2024', 'de')).toBe('/de/report/2024')
    expect(withLocaleInPath('/fr/report/2024', 'de')).toBe('/de/report/2024')
  })

  it('maps locale to language tags', () => {
    expect(toLanguageTag('de')).toBe('de-DE')
    expect(toLanguageTag('en')).toBe('en-US')
  })
})
