import { defaultAccent, isHexColor } from './accent'
import { parseEmbed } from './embed'
import { modes, timeDisplays } from './timer'
import type { Mode, TimeDisplay } from './timer'

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
  notify: boolean
  dim: number
  blur: number
  timeDisplay: TimeDisplay
  glass: boolean
  accent: string
  ringAnimation: boolean
  musicUrl: string
}

export interface Persisted {
  categories: string[]
  activeCategory: string
  sessions: Session[]
  settings: Settings
  bg: number
}

export interface SavedTimer {
  mode: Mode
  endAt: number | null
  remaining: number
  completedFocus: number
}

export const DEFAULT: Persisted = {
  categories: ['Work', 'Study', 'Read'],
  activeCategory: 'Work',
  sessions: [],
  settings: {
    focus: 25,
    short: 5,
    long: 15,
    rounds: 4,
    autoStart: false,
    sound: true,
    notify: false,
    dim: 30,
    blur: 0,
    timeDisplay: 'full',
    glass: true,
    accent: defaultAccent,
    ringAnimation: false,
    musicUrl: '',
  },
  bg: 6,
}

type NumericSetting = 'focus' | 'short' | 'long' | 'rounds' | 'dim' | 'blur'

export const LIMITS: Record<NumericSetting, { min: number; max: number }> = {
  focus: { min: 1, max: 120 },
  short: { min: 1, max: 60 },
  long: { min: 1, max: 60 },
  rounds: { min: 1, max: 12 },
  dim: { min: 0, max: 80 },
  blur: { min: 0, max: 20 },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function clampSetting(key: NumericSetting, value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT.settings[key]
  return Math.min(LIMITS[key].max, Math.max(LIMITS[key].min, value))
}

function readBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback
}

function readTimeDisplay(value: unknown): TimeDisplay {
  const match = timeDisplays.find((display) => display === value)
  return match ?? DEFAULT.settings.timeDisplay
}

function readSettings(value: unknown): Settings {
  const s = isRecord(value) ? value : {}
  return {
    focus: clampSetting('focus', s.focus),
    short: clampSetting('short', s.short),
    long: clampSetting('long', s.long),
    rounds: clampSetting('rounds', s.rounds),
    autoStart: readBoolean(s.autoStart, DEFAULT.settings.autoStart),
    sound: readBoolean(s.sound, DEFAULT.settings.sound),
    notify: readBoolean(s.notify, DEFAULT.settings.notify),
    dim: clampSetting('dim', s.dim),
    blur: clampSetting('blur', s.blur),
    timeDisplay: readTimeDisplay(s.timeDisplay),
    glass: readBoolean(s.glass, DEFAULT.settings.glass),
    accent: isHexColor(s.accent) ? s.accent : DEFAULT.settings.accent,
    ringAnimation: readBoolean(s.ringAnimation, DEFAULT.settings.ringAnimation),
    musicUrl: typeof s.musicUrl === 'string' && parseEmbed(s.musicUrl) ? s.musicUrl : '',
  }
}

function readCategories(value: unknown): string[] {
  if (!Array.isArray(value)) return DEFAULT.categories
  const names = value.filter((c): c is string => typeof c === 'string').map((c) => c.trim())
  const unique = [...new Set(names.filter(Boolean))]
  return unique.length ? unique : DEFAULT.categories
}

function isSession(value: unknown): value is Session {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.category === 'string' &&
    typeof value.minutes === 'number' &&
    Number.isFinite(value.minutes) &&
    value.minutes > 0 &&
    typeof value.endedAt === 'number' &&
    Number.isFinite(value.endedAt)
  )
}

function isCount(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

export function readTimer(value: unknown): SavedTimer | null {
  if (!isRecord(value)) return null
  const mode = modes.find((m) => m === value.mode)
  const { remaining, completedFocus } = value
  if (!mode || !isCount(remaining) || !isCount(completedFocus)) return null
  const endAt = isCount(value.endAt) ? value.endAt : null
  if (endAt === null && value.endAt !== null) return null
  return { mode, endAt, remaining, completedFocus }
}

export function sanitize(value: unknown): Persisted {
  const data = isRecord(value) ? value : {}
  const categories = readCategories(data.categories)
  const active = data.activeCategory
  return {
    categories,
    activeCategory: typeof active === 'string' && categories.includes(active) ? active : categories[0],
    sessions: Array.isArray(data.sessions) ? data.sessions.filter(isSession) : [],
    settings: readSettings(data.settings),
    bg: typeof data.bg === 'number' && Number.isInteger(data.bg) && data.bg >= 0 ? data.bg : DEFAULT.bg,
  }
}

export function parseBackup(json: string): Persisted | null {
  try {
    const value: unknown = JSON.parse(json)
    if (!isRecord(value) || !Array.isArray(value.categories) || !Array.isArray(value.sessions)) {
      return null
    }
    return sanitize(value)
  } catch {
    return null
  }
}
