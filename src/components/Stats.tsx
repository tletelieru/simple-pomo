import { useState } from 'react'
import { useStore } from '../context'
import { useMessages } from '../i18n/react'
import { byCategory, inRange, totalMinutes } from '../lib/stats'
import type { Range } from '../lib/stats'

const RANGES: Range[] = ['today', 'week', 'all']

function human(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export default function Stats() {
  const { sessions, clearStats } = useStore()
  const t = useMessages()
  const [range, setRange] = useState<Range>('today')

  const scoped = inRange(sessions, range)
  const rows = byCategory(scoped)
  const total = totalMinutes(scoped)
  const max = rows.reduce((acc, r) => Math.max(acc, r.minutes), 0)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">{t.stats}</h2>
        <div className="flex gap-1 rounded-full bg-soft p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              aria-pressed={range === r}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                range === r ? 'bg-primary text-on-primary' : 'text-muted hover:text-ink'
              }`}
            >
              {t.ranges[r]}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted">{t.noSessions}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.category} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                <span>{t.defaultCategories[r.category] ?? r.category}</span>
                <span className="text-muted">
                  {human(r.minutes)} · {r.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-soft">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${max ? (r.minutes / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between text-sm text-muted">
        <span>
          {t.total}: {human(total)}
        </span>
        {sessions.length > 0 && (
          <button onClick={clearStats} className="transition hover:text-primary">
            {t.clear}
          </button>
        )}
      </div>
    </section>
  )
}
