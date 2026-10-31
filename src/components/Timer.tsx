import { useStore } from '../store'
import type { Mode } from '../store'

const LABELS: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
}

function format(total: number): string {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const { mode, remaining, running, settings, completedFocus, start, pause, reset, skip, setMode } =
    useStore()

  const modes: Mode[] = ['focus', 'short', 'long']

  return (
    <section className="flex flex-col items-center gap-6">
      <div className="flex gap-1 rounded-full bg-white/10 p-1 backdrop-blur">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              mode === m ? 'bg-white text-slate-900' : 'text-white/80 hover:text-white'
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      <div className="text-center">
        <div className="font-mono text-8xl font-bold tabular-nums text-white drop-shadow-lg sm:text-9xl">
          {format(remaining)}
        </div>
        <div className="mt-2 text-sm text-white/70">
          Round {(completedFocus % settings.rounds) + 1} of {settings.rounds}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={running ? pause : start}
          className="rounded-xl bg-red-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition hover:bg-red-600 active:scale-95"
        >
          {running ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20"
        >
          Reset
        </button>
        <button
          onClick={skip}
          className="rounded-xl bg-white/10 px-5 py-3 font-medium text-white transition hover:bg-white/20"
        >
          Skip
        </button>
      </div>
    </section>
  )
}
