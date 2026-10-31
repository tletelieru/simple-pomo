import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useStore } from './context'
import { DEFAULT } from './lib/persist'
import { StoreProvider } from './store'

function setup(settings: Partial<typeof DEFAULT.settings> = {}) {
  localStorage.setItem(
    'simple-pomo:v1',
    JSON.stringify({ ...DEFAULT, settings: { ...DEFAULT.settings, sound: false, ...settings } }),
  )
  const wrapper = ({ children }: { children: ReactNode }) => <StoreProvider>{children}</StoreProvider>
  return renderHook(() => useStore(), { wrapper }).result
}

function saveTimer(timer: object) {
  localStorage.setItem('simple-pomo:timer:v1', JSON.stringify(timer))
}

function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000)
  })
}

describe('timer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stops after a focus without auto-start and records the session', () => {
    const store = setup({ focus: 1 })
    act(() => store.current.start())
    advance(61)
    expect(store.current.mode).toBe('short')
    expect(store.current.running).toBe(false)
    expect(store.current.sessions).toHaveLength(1)
  })

  it('keeps counting down into the next mode with auto-start', () => {
    const store = setup({ focus: 1, short: 5, autoStart: true })
    act(() => store.current.start())
    advance(61)
    expect(store.current.mode).toBe('short')
    expect(store.current.running).toBe(true)
    advance(10)
    expect(store.current.remaining).toBeLessThan(300)
    advance(300)
    expect(store.current.mode).toBe('focus')
    expect(store.current.running).toBe(true)
  })

  it('does not record a skipped focus', () => {
    const store = setup()
    act(() => store.current.start())
    advance(5)
    act(() => store.current.skip())
    expect(store.current.mode).toBe('short')
    expect(store.current.sessions).toHaveLength(0)
    expect(store.current.completedFocus).toBe(0)
  })

  it('restarts the countdown when skipping a running timer with auto-start', () => {
    const store = setup({ short: 5, autoStart: true })
    act(() => store.current.start())
    advance(5)
    act(() => store.current.skip())
    advance(5)
    expect(store.current.mode).toBe('short')
    expect(store.current.remaining).toBe(295)
  })

  it('stays paused when skipping a paused timer with auto-start', () => {
    const store = setup({ autoStart: true })
    act(() => store.current.skip())
    expect(store.current.running).toBe(false)
  })

  it('resumes from where it was paused', () => {
    const store = setup({ focus: 1 })
    act(() => store.current.start())
    advance(10)
    act(() => store.current.pause())
    advance(30)
    expect(store.current.remaining).toBe(50)
    act(() => store.current.start())
    advance(10)
    expect(store.current.remaining).toBe(40)
  })

  it('keeps a running focus while looking at another mode', () => {
    const store = setup({ focus: 25, short: 5 })
    act(() => store.current.start())
    advance(10)
    act(() => store.current.setMode('short'))
    expect(store.current.view).toBe('short')
    expect(store.current.mode).toBe('focus')
    expect(store.current.running).toBe(true)
    advance(10)
    expect(store.current.remaining).toBe(1480)
    act(() => store.current.setMode('focus'))
    expect(store.current.view).toBe('focus')
    expect(store.current.remaining).toBe(1480)
  })

  it('keeps a paused focus while looking at another mode', () => {
    const store = setup()
    act(() => store.current.start())
    advance(10)
    act(() => store.current.pause())
    act(() => store.current.setMode('long'))
    expect(store.current.mode).toBe('focus')
    expect(store.current.remaining).toBe(1490)
  })

  it('replaces the running focus when starting another mode', () => {
    const store = setup({ short: 5 })
    act(() => store.current.start())
    advance(10)
    act(() => store.current.setMode('short'))
    act(() => store.current.start())
    expect(store.current.mode).toBe('short')
    expect(store.current.running).toBe(true)
    expect(store.current.remaining).toBe(300)
    expect(store.current.sessions).toHaveLength(0)
  })

  it('changes mode directly when nothing is in progress', () => {
    const store = setup({ short: 5 })
    act(() => store.current.setMode('short'))
    expect(store.current.mode).toBe('short')
    expect(store.current.remaining).toBe(300)
  })

  it('follows the cycle when a session ends in another view', () => {
    const store = setup({ focus: 1 })
    act(() => store.current.start())
    act(() => store.current.setMode('long'))
    advance(61)
    expect(store.current.mode).toBe('short')
    expect(store.current.view).toBe('short')
    expect(store.current.sessions).toHaveLength(1)
  })

  it('restores a running timer after a reload', () => {
    saveTimer({ mode: 'focus', endAt: Date.now() + 90000, remaining: 0, completedFocus: 1 })
    const store = setup()
    expect(store.current.running).toBe(true)
    expect(store.current.remaining).toBe(90)
    expect(store.current.completedFocus).toBe(1)
    advance(10)
    expect(store.current.remaining).toBe(80)
  })

  it('restores a paused timer after a reload', () => {
    saveTimer({ mode: 'short', endAt: null, remaining: 100, completedFocus: 2 })
    const store = setup()
    expect(store.current.mode).toBe('short')
    expect(store.current.view).toBe('short')
    expect(store.current.running).toBe(false)
    expect(store.current.remaining).toBe(100)
  })

  it('saves the timer so it can be restored', () => {
    const store = setup()
    act(() => store.current.start())
    const saved = JSON.parse(localStorage.getItem('simple-pomo:timer:v1') ?? '{}')
    expect(saved.endAt).toBe(Date.now() + 1500000)
  })

  it('records a focus that ended while away with its real end time', () => {
    const endAt = Date.now() - 30000
    saveTimer({ mode: 'focus', endAt, remaining: 0, completedFocus: 0 })
    const store = setup()
    advance(1)
    expect(store.current.sessions).toHaveLength(1)
    expect(store.current.sessions[0].endedAt).toBe(endAt)
    expect(store.current.mode).toBe('short')
    expect(store.current.running).toBe(false)
  })

  it('counts the next block from the real end time with auto-start', () => {
    saveTimer({ mode: 'focus', endAt: Date.now() - 30000, remaining: 0, completedFocus: 0 })
    const store = setup({ short: 5, autoStart: true })
    advance(1)
    expect(store.current.mode).toBe('short')
    expect(store.current.running).toBe(true)
    expect(store.current.remaining).toBeLessThanOrEqual(270)
  })

  it('does not keep auto-starting when away for long', () => {
    saveTimer({ mode: 'focus', endAt: Date.now() - 3600000, remaining: 0, completedFocus: 0 })
    const store = setup({ autoStart: true })
    advance(5)
    expect(store.current.sessions).toHaveLength(1)
    expect(store.current.running).toBe(false)
  })

  it('ignores a corrupt saved timer', () => {
    localStorage.setItem('simple-pomo:timer:v1', 'nope')
    const store = setup({ focus: 25 })
    expect(store.current.mode).toBe('focus')
    expect(store.current.remaining).toBe(1500)
  })

  it('keeps at least one category', () => {
    const store = setup()
    act(() => {
      DEFAULT.categories.forEach((c) => store.current.removeCategory(c))
    })
    expect(store.current.categories).toHaveLength(1)
    expect(store.current.activeCategory).toBe(store.current.categories[0])
  })
})
