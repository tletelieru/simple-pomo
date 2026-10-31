import { useState } from 'react'
import { useStore } from '../store'
import { byCategory, inRange, totalMinutes } from '../lib/stats'
import type { Range } from '../lib/stats'

const RANGES: { key: Range; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'all', label: 'All' },
]

function human(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

export default function Stats() {
  const { sessions, clearStats } = useStore()
  const [range, setRange] = useState<Range>('today')

  const scoped = inRange(sessions, range)
  const rows = byCategory(scoped)
  const total = totalMinutes(scoped)
  const max = rows.reduce((acc, r) => Math.max(acc, r.minutes), 0)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">Stats</h2>
        <div className="flex gap-1 rounded-full bg-white/10 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                range === r.key ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="py-4 text-center text-sm text-white/50">No focus sessions yet.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.category} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm text-white/90">
                <span>{r.category}</span>
                <span className="text-white/60">
                  {human(r.minutes)} · {r.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-500"
                  style={{ width: `${max ? (r.minutes / max) * 100 : 0}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between pt-1 text-sm text-white/70">
        <span>Total: {human(total)}</span>
        {sessions.length > 0 && (
          <button onClick={clearStats} className="text-white/50 transition hover:text-red-400">
            Clear
          </button>
        )}
      </div>
    </section>
  )
}
