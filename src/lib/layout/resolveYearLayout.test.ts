import { describe, expect, it } from 'vitest'
import { resolveYearLayout } from './resolveYearLayout'

describe('layout resolver', () => {
  it('uses custom layout for 2024', () => {
    const result = resolveYearLayout('2024')
    expect(result.isCustom).toBe(true)
  })

  it('uses default layout for non-registered years', () => {
    const result = resolveYearLayout('2023')
    expect(result.isCustom).toBe(false)
  })
})
