import { useEffect, useRef, useState } from 'react'
import { useMessages } from '../i18n/react'
import { startAmbience } from '../lib/ambience'
import type { Ambience, AmbienceKind } from '../lib/ambience'
import { tracks } from '../lib/assets'
import { NoiseIcon, PauseIcon, PlayIcon, RainIcon, WavesIcon } from './icons'
import MusicLink from './MusicLink'

const ICONS: Record<AmbienceKind, () => React.JSX.Element> = {
  rain: RainIcon,
  waves: WavesIcon,
  brown: NoiseIcon,
}

export default function AudioPlayer() {
  const t = useMessages()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const ref = useRef<Ambience | null>(null)

  useEffect(() => () => ref.current?.stop(), [])

  function play(i: number) {
    ref.current?.stop()
    ref.current = startAmbience(tracks[i].kind, volume)
    setIndex(i)
    setPlaying(true)
  }

  function stop() {
    ref.current?.stop()
    ref.current = null
    setPlaying(false)
  }

  function changeVolume(value: number) {
    setVolume(value)
    ref.current?.setVolume(value)
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {tracks.map((track, i) => {
          const Icon = ICONS[track.kind]
          return (
            <button
              key={track.kind}
              onClick={() => (playing && index === i ? stop() : play(i))}
              aria-pressed={playing && index === i}
              style={{ background: track.image }}
              className={`flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-xl text-xs font-semibold text-white outline-2 outline-offset-2 transition active:scale-95 ${
                index === i ? 'outline-primary' : 'outline-transparent'
              }`}
            >
              <Icon />
              <span className="max-w-full truncate px-1">{t.tracks[track.kind]}</span>
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => (playing ? stop() : play(index))}
          aria-label={playing ? t.pause : t.play}
          title={playing ? t.pause : t.play}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary transition hover:opacity-90 active:scale-95"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => changeVolume(Number(e.target.value))}
          aria-label={t.volume}
          className="min-w-0 flex-1 accent-[var(--primary)]"
        />
      </div>
      <MusicLink />
    </section>
  )
}
