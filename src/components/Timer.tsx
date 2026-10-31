import { useStore } from '../context'
import { useMessages } from '../i18n/react'
import { accentFor } from '../lib/accent'
import { formatTime, minutesFor, modes } from '../lib/timer'
import { floatingSupported, useFloatingTimer } from '../useFloatingTimer'
import { FloatingIcon } from './icons'

const RADIUS = 46
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function Timer() {
  const {
    mode,
    view,
    sessionActive,
    remaining,
    running,
    settings,
    completedFocus,
    start,
    resume,
    pause,
    reset,
    skip,
    setMode,
  } = useStore()
  const t = useMessages()
  const viewing = view === mode
  const total = minutesFor(mode, settings) * 60
  const sessionLeft = total ? Math.min(1, remaining / total) : 0
  const sessionPaused = sessionActive && !running
  const sessionTime = formatTime(remaining, settings.timeDisplay)
  const paused = viewing && sessionPaused
  const left = viewing ? sessionLeft : 1
  const time = viewing
    ? sessionTime
    : formatTime(minutesFor(view, settings) * 60, settings.timeDisplay)
  const { videoRef, active: floatingActive, toggle: toggleFloating } = useFloatingTimer(
    {
      time: sessionTime,
      label: sessionPaused ? t.paused : t.modes[mode],
      progress: sessionLeft,
      accent: accentFor(settings.accent, 'dark'),
    },
    running,
    resume,
    pause,
    () => alert(t.floatingFailed),
  )
  const floatingLabel = floatingActive ? t.closeFloating : t.openFloating

  return (
    <section className="flex flex-col items-center gap-5">
      {sessionActive && !viewing && (
        <button
          onClick={() => setMode(mode)}
          className="flex w-full items-center gap-2 rounded-[10px] border border-primary px-3 py-2 text-sm font-semibold"
        >
          <span
            className={`h-2 w-2 shrink-0 rounded-full bg-primary ${running ? 'animate-pulse' : ''}`}
          />
          <span className="min-w-0 flex-1 truncate text-left">
            {t.modes[mode]} · {sessionPaused ? t.paused : sessionTime}
          </span>
          <span className="shrink-0 text-primary">{t.back}</span>
        </button>
      )}
      <div className="flex w-full gap-1 rounded-full bg-soft p-1">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={view === m}
            className={`min-w-0 flex-1 truncate rounded-full px-1 py-1.5 text-[13px] font-semibold transition ${
              view === m ? 'bg-primary text-on-primary' : 'text-muted hover:text-ink'
            }`}
          >
            {t.modes[m]}
          </button>
        ))}
      </div>

      <div className="relative aspect-square w-full max-w-72">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="50" cy="50" r={RADIUS} fill="none" strokeWidth="3" className="stroke-soft" />
          <circle
            cx="50"
            cy="50"
            r={RADIUS}
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - left)}
            className="stroke-primary transition-[stroke-dashoffset] duration-300"
          />
          {settings.ringAnimation && running && viewing && (
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`10 ${CIRCUMFERENCE - 10}`}
              className="ring-comet"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <div className="text-6xl font-bold tracking-tight tabular-nums sm:text-7xl">
            {time}
          </div>
          <div className="text-sm text-muted">
            {paused ? t.paused : t.round((completedFocus % settings.rounds) + 1, settings.rounds)}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center gap-2">
        <button
          onClick={running && viewing ? pause : start}
          className="min-w-0 flex-1 rounded-[10px] bg-primary px-2 py-3 font-semibold text-on-primary transition hover:opacity-90 active:scale-95"
        >
          {running && viewing ? t.pause : paused ? t.resume : t.start}
        </button>
        <button
          onClick={reset}
          disabled={!viewing}
          className="shrink-0 rounded-[10px] bg-soft px-2 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
        >
          {t.reset}
        </button>
        <button
          onClick={skip}
          disabled={!viewing}
          className="shrink-0 rounded-[10px] bg-soft px-2 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-40"
        >
          {t.skip}
        </button>
        {floatingSupported() && (
          <button
            onClick={() => void toggleFloating()}
            aria-label={floatingLabel}
            aria-pressed={floatingActive}
            title={floatingLabel}
            className={`flex shrink-0 items-center justify-center rounded-[10px] p-3 transition hover:opacity-80 ${
              floatingActive ? 'bg-primary text-on-primary' : 'bg-soft'
            }`}
          >
            <FloatingIcon />
          </button>
        )}
      </div>
      <video
        ref={videoRef}
        muted
        playsInline
        className="pointer-events-none fixed h-px w-px opacity-0"
      />
    </section>
  )
}
