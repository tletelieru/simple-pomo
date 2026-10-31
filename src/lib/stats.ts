import type { Session } from '../store'

export type Range = 'today' | 'week' | 'all'

export interface CategoryStat {
  category: string
  count: number
  minutes: number
}

function startOf(range: Range): number {
  if (range === 'all') return 0
  const now = new Date()
  if (range === 'today') {
    now.setHours(0, 0, 0, 0)
    return now.getTime()
  }
  const day = now.getDay()
  const diff = (day + 6) % 7
  now.setHours(0, 0, 0, 0)
  now.setDate(now.getDate() - diff)
  return now.getTime()
}

export function inRange(sessions: Session[], range: Range): Session[] {
  const from = startOf(range)
  return sessions.filter((s) => s.endedAt >= from)
}

export function byCategory(sessions: Session[]): CategoryStat[] {
  const map = new Map<string, CategoryStat>()
  for (const s of sessions) {
    const cur = map.get(s.category) ?? { category: s.category, count: 0, minutes: 0 }
    cur.count += 1
    cur.minutes += s.minutes
    map.set(s.category, cur)
  }
  return [...map.values()].sort((a, b) => b.minutes - a.minutes)
}

export function totalMinutes(sessions: Session[]): number {
  return sessions.reduce((acc, s) => acc + s.minutes, 0)
}
