import { describe, expect, it } from 'vitest'
import { DEFAULT, parseBackup, readTimer, sanitize } from './persist'

describe('sanitize', () => {
  it('falls back to defaults for junk', () => {
    expect(sanitize(null)).toEqual(DEFAULT)
    expect(sanitize('x')).toEqual(DEFAULT)
  })

  it('fills settings missing from older saves', () => {
    const data = sanitize({ settings: { focus: 50 } })
    expect(data.settings.focus).toBe(50)
    expect(data.settings.dim).toBe(DEFAULT.settings.dim)
    expect(data.settings.notify).toBe(false)
  })

  it('clamps out of range settings', () => {
    const { settings } = sanitize({ settings: { focus: 9999, rounds: 0, blur: -1 } })
    expect(settings).toMatchObject({ focus: 120, rounds: 1, blur: 0 })
  })

  it('keeps a valid time display and rejects anything else', () => {
    expect(sanitize({ settings: { timeDisplay: 'minutes' } }).settings.timeDisplay).toBe('minutes')
    expect(sanitize({ settings: { timeDisplay: 'x' } }).settings.timeDisplay).toBe('full')
  })

  it('keeps a valid accent and rejects anything else', () => {
    expect(sanitize({ settings: { accent: '#123abc' } }).settings.accent).toBe('#123abc')
    expect(sanitize({ settings: { accent: 'url(x)' } }).settings.accent).toBe(DEFAULT.settings.accent)
  })

  it('keeps a valid music link and drops anything else', () => {
    const musicUrl = 'https://youtu.be/jfKfPfyJRdk'
    expect(sanitize({ settings: { musicUrl } }).settings.musicUrl).toBe(musicUrl)
    expect(sanitize({ settings: { musicUrl: 'https://evil.io/x' } }).settings.musicUrl).toBe('')
  })

  it('never leaves categories empty and keeps active valid', () => {
    expect(sanitize({ categories: [] }).categories).toEqual(DEFAULT.categories)
    const data = sanitize({ categories: [' A ', 'A', '', 3], activeCategory: 'gone' })
    expect(data.categories).toEqual(['A'])
    expect(data.activeCategory).toBe('A')
  })

  it('drops malformed sessions', () => {
    const good = { id: 'a', category: 'Work', minutes: 25, endedAt: 1 }
    const data = sanitize({ sessions: [good, { id: 'b' }, { ...good, minutes: 'x' }, null] })
    expect(data.sessions).toEqual([good])
  })
})

describe('readTimer', () => {
  it('reads a saved timer', () => {
    const timer = { mode: 'short', endAt: 123, remaining: 60, completedFocus: 2 }
    expect(readTimer(timer)).toEqual(timer)
    expect(readTimer({ ...timer, endAt: null })).toEqual({ ...timer, endAt: null })
  })

  it('rejects anything malformed', () => {
    const timer = { mode: 'short', endAt: null, remaining: 60, completedFocus: 2 }
    expect(readTimer(null)).toBeNull()
    expect(readTimer({ ...timer, mode: 'x' })).toBeNull()
    expect(readTimer({ ...timer, endAt: 'soon' })).toBeNull()
    expect(readTimer({ ...timer, remaining: -1 })).toBeNull()
    expect(readTimer({ ...timer, completedFocus: 1.5 })).toBeNull()
  })
})

describe('parseBackup', () => {
  it('rejects invalid JSON and files that are not backups', () => {
    expect(parseBackup('nope')).toBeNull()
    expect(parseBackup('{}')).toBeNull()
    expect(parseBackup('[]')).toBeNull()
  })

  it('round trips a backup', () => {
    expect(parseBackup(JSON.stringify(DEFAULT))).toEqual(DEFAULT)
  })
})
