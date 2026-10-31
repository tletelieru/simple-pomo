import { describe, expect, it } from 'vitest'
import { accentFor, defaultAccent, isHexColor, onColor } from './accent'

describe('accent', () => {
  it('uses the lighter indigo for the default accent on dark', () => {
    expect(accentFor(defaultAccent, 'light')).toBe('#3b4fe4')
    expect(accentFor(defaultAccent, 'dark')).toBe('#8ea1ff')
    expect(accentFor('#14b8a6', 'dark')).toBe('#14b8a6')
  })

  it('accepts only six digit hex colors', () => {
    expect(isHexColor('#3b82f6')).toBe(true)
    expect(isHexColor('#fff')).toBe(false)
    expect(isHexColor('red')).toBe(false)
    expect(isHexColor(3)).toBe(false)
  })

  it('picks a readable text color', () => {
    expect(onColor('#000000')).toBe('#ffffff')
    expect(onColor('#ffffff')).toBe('#17181c')
    expect(onColor('#eab308')).toBe('#17181c')
    expect(onColor('#ef4444')).toBe('#ffffff')
  })
})
