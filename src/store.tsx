import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { StoreContext } from './context'
import type { Store } from './context'
import { useMessages } from './i18n/react'
import { sendNotification } from './lib/notify'
import { DEFAULT, parseBackup, readTimer, sanitize } from './lib/persist'
import type { Persisted, SavedTimer, Session, Settings } from './lib/persist'
import { minutesFor, nextCycle } from './lib/timer'
import type { Mode } from './lib/timer'

const KEY = 'simple-pomo:v1'
const TIMER_KEY = 'simple-pomo:timer:v1'
const MAX_LATE_MS = 120000

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? sanitize(JSON.parse(raw)) : DEFAULT
  } catch {
    return DEFAULT
  }
}

function loadTimer(): SavedTimer | null {
  try {
    const raw = localStorage.getItem(TIMER_KEY)
    return raw ? readTimer(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

function secondsUntil(endAt: number): number {
  return Math.ceil((endAt - Date.now()) / 1000)
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new Ctx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7)
    osc.start()
    osc.stop(ctx.currentTime + 0.72)
  } catch {
    void 0
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const t = useMessages().notification
  const [persisted, setPersisted] = useState<Persisted>(load)
  const [saved] = useState(loadTimer)
  const [mode, setModeState] = useState<Mode>(saved?.mode ?? 'focus')
  const [view, setView] = useState<Mode>(saved?.mode ?? 'focus')
  const [endAt, setEndAt] = useState<number | null>(saved?.endAt ?? null)
  const [remaining, setRemaining] = useState(() => {
    if (!saved) return persisted.settings.focus * 60
    return saved.endAt === null ? saved.remaining : Math.max(0, secondsUntil(saved.endAt))
  })
  const [completedFocus, setCompletedFocus] = useState(saved?.completedFocus ?? 0)
  const running = endAt !== null
  const sessionActive = running || remaining < minutesFor(mode, persisted.settings) * 60

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(persisted))
    } catch {
      void 0
    }
  }, [persisted])

  const pausedSeconds = running ? 0 : remaining
  useEffect(() => {
    try {
      const timer: SavedTimer = { mode, endAt, remaining: pausedSeconds, completedFocus }
      localStorage.setItem(TIMER_KEY, JSON.stringify(timer))
    } catch {
      void 0
    }
  }, [mode, endAt, pausedSeconds, completedFocus])

  const patch = useCallback((p: Partial<Persisted>) => {
    setPersisted((prev) => ({ ...prev, ...p }))
  }, [])

  const advance = (finished: boolean, finishedAt = Date.now()) => {
    const { settings } = persisted
    const next = nextCycle(mode, completedFocus, settings.rounds, finished)
    const seconds = minutesFor(next.mode, settings) * 60

    if (finished) {
      if (settings.sound) beep()
      if (settings.notify) {
        void sendNotification(
          mode === 'focus' ? t.focusDone : t.breakDone,
          next.mode === 'focus' ? t.toFocus : t.toBreak,
        )
      }
    }

    if (finished && mode === 'focus') {
      setPersisted((prev) => {
        const session: Session = {
          id: uid(),
          category: prev.activeCategory,
          minutes: prev.settings.focus,
          endedAt: finishedAt,
        }
        return { ...prev, sessions: [...prev.sessions, session] }
      })
    }

    setModeState(next.mode)
    setView(next.mode)
    setCompletedFocus(next.completedFocus)
    const late = Date.now() - finishedAt > MAX_LATE_MS
    const keepGoing = settings.autoStart && (finished || running) && !late
    const nextEnd = keepGoing ? finishedAt + seconds * 1000 : null
    setRemaining(nextEnd === null ? seconds : Math.max(0, secondsUntil(nextEnd)))
    setEndAt(nextEnd)
  }

  const advanceRef = useRef(advance)
  useEffect(() => {
    advanceRef.current = advance
  })

  useEffect(() => {
    if (endAt === null) return
    const id = window.setInterval(() => {
      const left = secondsUntil(endAt)
      if (left <= 0) {
        window.clearInterval(id)
        advanceRef.current(true, endAt)
      } else {
        setRemaining(left)
      }
    }, 250)
    return () => window.clearInterval(id)
  }, [endAt])

  const resume = () => {
    const seconds = remaining > 0 ? remaining : minutesFor(mode, persisted.settings) * 60
    setRemaining(seconds)
    setEndAt(Date.now() + seconds * 1000)
  }

  const start = () => {
    if (view === mode) {
      resume()
      return
    }
    const seconds = minutesFor(view, persisted.settings) * 60
    setModeState(view)
    setRemaining(seconds)
    setEndAt(Date.now() + seconds * 1000)
  }

  const pause = () => setEndAt(null)

  const reset = () => {
    setEndAt(null)
    setRemaining(minutesFor(mode, persisted.settings) * 60)
  }

  const skip = () => advance(false)

  const setMode = (m: Mode) => {
    setView(m)
    if (sessionActive) return
    setModeState(m)
    setRemaining(minutesFor(m, persisted.settings) * 60)
  }

  const setActiveCategory = useCallback((c: string) => patch({ activeCategory: c }), [patch])

  const addCategory = useCallback((c: string) => {
    const name = c.trim()
    if (!name) return
    setPersisted((prev) =>
      prev.categories.includes(name) ? prev : { ...prev, categories: [...prev.categories, name] },
    )
  }, [])

  const removeCategory = useCallback((c: string) => {
    setPersisted((prev) => {
      if (prev.categories.length <= 1) return prev
      const categories = prev.categories.filter((x) => x !== c)
      const activeCategory = prev.activeCategory === c ? categories[0] : prev.activeCategory
      return { ...prev, categories, activeCategory }
    })
  }, [])

  const updateSettings = useCallback((p: Partial<Settings>) => {
    setPersisted((prev) => ({ ...prev, settings: { ...prev.settings, ...p } }))
  }, [])

  const settingsRef = useRef(persisted.settings)
  useEffect(() => {
    const prev = settingsRef.current
    settingsRef.current = persisted.settings
    if (!running && minutesFor(mode, prev) !== minutesFor(mode, persisted.settings)) {
      setRemaining(minutesFor(mode, persisted.settings) * 60)
    }
  }, [persisted.settings, mode, running])

  const setBg = useCallback((i: number) => patch({ bg: i }), [patch])

  const clearStats = useCallback(() => patch({ sessions: [] }), [patch])

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(persisted, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'simple-pomo-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [persisted])

  const importData = useCallback((json: string): boolean => {
    const backup = parseBackup(json)
    if (!backup) return false
    setPersisted(backup)
    return true
  }, [])

  const value: Store = {
    ...persisted,
    mode,
    view,
    sessionActive,
    running,
    remaining,
    completedFocus,
    start,
    resume,
    pause,
    reset,
    skip,
    setMode,
    setActiveCategory,
    addCategory,
    removeCategory,
    updateSettings,
    setBg,
    clearStats,
    exportData,
    importData,
  }

  return <StoreContext value={value}>{children}</StoreContext>
}
