import { describe, expect, it } from 'vitest'
import { Route as LocaleRoute } from './$locale/route'
import { Route as ReportRoute } from './$locale/report/$year'

describe('route-level behavior', () => {
  it('redirects invalid locale segments to default locale path', () => {
    const beforeLoad = LocaleRoute.options.beforeLoad

    expect(beforeLoad).toBeTypeOf('function')

    let caught: unknown

    try {
      beforeLoad?.({
        params: { locale: 'fr' },
        location: { pathname: '/fr/report/2024' },
      } as never)
    } catch (error) {
      caught = error
    }

    expect(caught).toBeTruthy()
    expect(JSON.stringify(caught)).toContain('/de/report/2024')
  })

  it('loads report data for known years', async () => {
    const loader = ReportRoute.options.loader
    expect(loader).toBeTypeOf('function')

    const data = await loader?.({
      params: { locale: 'en', year: '2024' },
    } as never)

    expect(data?.report.year).toBe('2024')
    expect(data?.report.locale).toBe('en')
  })

  it('throws notFound for unknown years', async () => {
    const loader = ReportRoute.options.loader

    let caught: unknown

    try {
      await loader?.({
        params: { locale: 'en', year: '2099' },
      } as never)
    } catch (error) {
      caught = error
    }

    expect(caught).toBeTruthy()
    expect(
      typeof caught === 'object' && caught !== null && 'isNotFound' in caught,
    ).toBe(true)
  })
})
