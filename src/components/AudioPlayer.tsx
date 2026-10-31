import { useEffect, useRef, useState } from 'react'
import { tracks } from '../lib/assets'

export default function AudioPlayer() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.5)
  const ref = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.volume = volume
  }, [volume, index])

  if (tracks.length === 0) {
    return (
      <p className="text-center text-xs text-white/40">
        Add .mp3 files to <code className="text-white/60">public/audio</code> and list them in{' '}
        <code className="text-white/60">src/lib/assets.ts</code> to enable ambience.
      </p>
    )
  }

  const track = tracks[index]
  const src = `${import.meta.env.BASE_URL}${track.src}`

  function toggle() {
    const el = ref.current
    if (!el) return
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      void el.play()
      setPlaying(true)
    }
  }

  function next() {
    setIndex((i) => (i + 1) % tracks.length)
    setPlaying(true)
  }

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-2 backdrop-blur">
      <button
        onClick={toggle}
        className="rounded-full bg-white/20 px-3 py-1 text-sm text-white hover:bg-white/30"
      >
        {playing ? 'Pause' : 'Play'}
      </button>
      <button onClick={next} className="text-sm text-white/70 hover:text-white">
        Next
      </button>
      <span className="flex-1 truncate text-sm text-white/80">{track.name}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="w-20 accent-red-500"
      />
      <audio
        ref={ref}
        src={src}
        loop
        autoPlay={playing}
        onEnded={next}
      />
    </div>
  )
}
