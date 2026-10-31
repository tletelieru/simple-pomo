import { describe, expect, it } from 'vitest'
import { formatTime, minutesFor, nextCycle } from './timer'

describe('formatTime', () => {
  it('shows minutes and seconds', () => {
    expect(formatTime(1493, 'full')).toBe('24:53')
    expect(formatTime(59, 'full')).toBe('00:59')
  })

  it('shows only the current minute', () => {
    expect(formatTime(1500, 'minutes')).toBe('25 min')
    expect(formatTime(1499, 'minutes')).toBe('24 min')
    expect(formatTime(1493, 'minutes')).toBe('24 min')
    expect(formatTime(59, 'minutes')).toBe('0 min')
  })

  it('switches to seconds in the last minute', () => {
    expect(formatTime(61, 'lastMinute')).toBe('1 min')
    expect(formatTime(60, 'lastMinute')).toBe('1 min')
    expect(formatTime(59, 'lastMinute')).toBe('59 s')
  })
})

describe('nextCycle', () => {
  it('goes to a short break after a finished focus', () => {
    expect(nextCycle('focus', 0, 4, true)).toEqual({ mode: 'short', completedFocus: 1 })
  })

  it('goes to a long break every N rounds', () => {
    expect(nextCycle('focus', 3, 4, true)).toEqual({ mode: 'long', completedFocus: 4 })
  })

  it('does not count a skipped focus', () => {
    expect(nextCycle('focus', 3, 4, false)).toEqual({ mode: 'short', completedFocus: 3 })
  })

  it('returns to focus after any break', () => {
    expect(nextCycle('short', 1, 4, true).mode).toBe('focus')
    expect(nextCycle('long', 4, 4, false).mode).toBe('focus')
  })

  it('completes a full cycle', () => {
    let cycle = { mode: 'focus' as const, completedFocus: 0 } as ReturnType<typeof nextCycle>
    const modes: string[] = []
    for (let i = 0; i < 8; i++) {
      cycle = nextCycle(cycle.mode, cycle.completedFocus, 4, true)
      modes.push(cycle.mode)
    }
    expect(modes).toEqual(['short', 'focus', 'short', 'focus', 'short', 'focus', 'long', 'focus'])
  })
})

describe('minutesFor', () => {
  it('reads the duration of the mode', () => {
    expect(minutesFor('long', { focus: 25, short: 5, long: 15 })).toBe(15)
  })
})
