import { describe, expect, it } from 'vitest'
import { REQUIRED_SECTION_KEYS, REQUIRED_SECTIONS } from './sectionManifest'
import {
  ContentContractError,
  getMissingSectionSlugs,
  listReportYears,
  loadReportByYear,
  resolveContentLocale,
} from './loadReports'

describe('content loading contract', () => {
  it('lists report years in descending order', () => {
    const years = listReportYears('en').map((item) => item.year)
    expect(years).toEqual(['2025', '2024', '2023'])
  })

  it('loads report with all required sections', async () => {
    const report = await loadReportByYear('2024', 'en')
    expect(report).not.toBeNull()

    expect(report?.sections.map((section) => section.key)).toEqual(
      REQUIRED_SECTION_KEYS,
    )
    expect(report?.fallbackFrom).toBeNull()
    expect(report?.sections[0].label).toBe('Foreword')
  })

  it('uses resolved content locale for section labels', async () => {
    const report = await loadReportByYear('2023', 'de')
    expect(report?.sections[0].label).toBe('Vorwort')
  })

  it('returns null for unknown years', async () => {
    await expect(loadReportByYear('2099', 'de')).resolves.toBeNull()
  })

  it('shows no missing required sections in seeded years', () => {
    expect(getMissingSectionSlugs('2023', 'de')).toEqual([])
    expect(getMissingSectionSlugs('2023', 'en')).toEqual([])
  })

  it('falls back to default locale when requested locale is unavailable', () => {
    const resolution = resolveContentLocale(['de'], 'en')

    expect(resolution).toEqual({
      locale: 'de',
      fallbackFrom: 'en',
    })

    expect(REQUIRED_SECTIONS[0].labels[resolution.locale]).toBe('Vorwort')
  })

  it('throws when no valid content locale is available', () => {
    expect(() => resolveContentLocale([], 'en')).toThrow(ContentContractError)
  })
})
