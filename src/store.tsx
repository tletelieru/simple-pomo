import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { ReactNode } from 'react'

export type Mode = 'focus' | 'short' | 'long'

export interface Session {
  id: string
  category: string
  minutes: number
  endedAt: number
}

export interface Settings {
  focus: number
  short: number
  long: number
  rounds: number
  autoStart: boolean
  sound: boolean
}

export interface Persisted {
  categories: string[]
  activeCategory: string
  sessions: Session[]
  settings: Settings
  bg: number
}

const KEY = 'simple-pomo:v1'

const DEFAULT: Persisted = {
  categories: ['Work', 'Study', 'Read'],
  activeCategory: 'Work',
  sessions: [],
  settings: { focus: 25, short: 5, long: 15, rounds: 4, autoStart: false, sound: true },
  bg: 0,
}

function load(): Persisted {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT
    const parsed = JSON.parse(raw) as Partial<Persisted>
    return {
      ...DEFAULT,
      ...parsed,
      settings: { ...DEFAULT.settings, ...parsed.settings },
      categories: parsed.categories?.length ? parsed.categories : DEFAULT.categories,
    }
  } catch {
    return DEFAULT
  }
}

function minutesFor(mode: Mode, s: Settings): number {
  if (mode === 'focus') return s.focus
  if (mode === 'short') return s.short
  return s.long
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

export interface Store {
  categories: string[]
  activeCategory: string
  sessions: Session[]
  settings: Settings
  bg: number
  mode: Mode
  running: boolean
  remaining: number
  completedFocus: number
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  setMode: (mode: Mode) => void
  setActiveCategory: (c: string) => void
  addCategory: (c: string) => void
  removeCategory: (c: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  setBg: (i: number) => void
  clearStats: () => void
  exportData: () => void
  importData: (json: string) => boolean
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(load)
  const [mode, setModeState] = useState<Mode>('focus')
  const [running, setRunning] = useState(false)
  const [remaining, setRemaining] = useState(persisted.settings.focus * 60)
  const [completedFocus, setCompletedFocus] = useState(0)
  const endRef = useRef<number>(0)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(persisted))
    } catch {
      void 0
    }
  }, [persisted])

  const patch = useCallback((p: Partial<Persisted>) => {
    setPersisted((prev) => ({ ...prev, ...p }))
  }, [])

  const complete = useCallback(() => {
    if (persisted.settings.sound) beep()
    setPersisted((prev) => {
      if (mode === 'focus') {
        const session: Session = {
          id: uid(),
          category: prev.activeCategory,
          minutes: prev.settings.focus,
          endedAt: Date.now(),
        }
        return { ...prev, sessions: [...prev.sessions, session] }
      }
      return prev
    })

    if (mode === 'focus') {
      const next = completedFocus + 1
      setCompletedFocus(next)
      const nextMode: Mode = next % persisted.settings.rounds === 0 ? 'long' : 'short'
      setModeState(nextMode)
      setRemaining(minutesFor(nextMode, persisted.settings) * 60)
    } else {
      setModeState('focus')
      setRemaining(persisted.settings.focus * 60)
    }
    setRunning(persisted.settings.autoStart)
  }, [mode, completedFocus, persisted.settings])

  useEffect(() => {
    if (!running) return
    endRef.current = Date.now() + remaining * 1000
    const id = window.setInterval(() => {
      const left = Math.round((endRef.current - Date.now()) / 1000)
      if (left <= 0) {
        setRemaining(0)
        window.clearInterval(id)
        complete()
      } else {
        setRemaining(left)
      }
    }, 250)
    return () => window.clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const start = useCallback(() => {
    if (remaining <= 0) setRemaining(minutesFor(mode, persisted.settings) * 60)
    setRunning(true)
  }, [remaining, mode, persisted.settings])

  const pause = useCallback(() => setRunning(false), [])

  const reset = useCallback(() => {
    setRunning(false)
    setRemaining(minutesFor(mode, persisted.settings) * 60)
  }, [mode, persisted.settings])

  const skip = useCallback(() => {
    setRunning(false)
    complete()
  }, [complete])

  const setMode = useCallback(
    (m: Mode) => {
      setRunning(false)
      setModeState(m)
      setRemaining(minutesFor(m, persisted.settings) * 60)
    },
    [persisted.settings],
  )

  const setActiveCategory = useCallback((c: string) => patch({ activeCategory: c }), [patch])

  const addCategory = useCallback(
    (c: string) => {
      const name = c.trim()
      if (!name) return
      setPersisted((prev) =>
        prev.categories.includes(name)
          ? prev
          : { ...prev, categories: [...prev.categories, name] },
      )
    },
    [],
  )

  const removeCategory = useCallback((c: string) => {
    setPersisted((prev) => {
      const categories = prev.categories.filter((x) => x !== c)
      const activeCategory =
        prev.activeCategory === c ? categories[0] ?? '' : prev.activeCategory
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
    try {
      const parsed = JSON.parse(json) as Partial<Persisted>
      setPersisted({
        ...DEFAULT,
        ...parsed,
        settings: { ...DEFAULT.settings, ...parsed.settings },
        categories: parsed.categories?.length ? parsed.categories : DEFAULT.categories,
      })
      return true
    } catch {
      return false
    }
  }, [])

  const value: Store = {
    ...persisted,
    mode,
    running,
    remaining,
    completedFocus,
    start,
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

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
