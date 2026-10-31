export const modes = ['focus', 'short', 'long'] as const

export type Mode = (typeof modes)[number]

export const timeDisplays = ['full', 'minutes', 'lastMinute'] as const

export type TimeDisplay = (typeof timeDisplays)[number]

export interface Durations {
  focus: number
  short: number
  long: number
}

export interface Cycle {
  mode: Mode
  completedFocus: number
}

export function minutesFor(mode: Mode, durations: Durations): number {
  return durations[mode]
}

export function formatTime(seconds: number, display: TimeDisplay): string {
  if (display === 'lastMinute' && seconds < 60) return `${seconds} s`
  const m = Math.floor(seconds / 60)
  if (display !== 'full') return `${m} min`
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function nextCycle(
  mode: Mode,
  completedFocus: number,
  rounds: number,
  finished: boolean,
): Cycle {
  if (mode !== 'focus') return { mode: 'focus', completedFocus }
  if (!finished) return { mode: 'short', completedFocus }
  const next = completedFocus + 1
  return { mode: next % rounds === 0 ? 'long' : 'short', completedFocus: next }
}
