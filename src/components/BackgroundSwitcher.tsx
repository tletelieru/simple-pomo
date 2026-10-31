import { useStore } from '../store'
import { backgrounds } from '../lib/assets'

export default function BackgroundSwitcher() {
  const { bg, setBg } = useStore()

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-white/60">Background</h2>
      <div className="flex flex-wrap gap-2">
        {backgrounds.map((b, i) => (
          <button
            key={b.name}
            onClick={() => setBg(i)}
            aria-label={b.name}
            style={{ background: b.value }}
            className={`h-9 w-9 rounded-lg ring-2 transition ${
              bg === i ? 'ring-white' : 'ring-transparent hover:ring-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
