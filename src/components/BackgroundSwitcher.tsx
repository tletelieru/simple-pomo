import { useStore } from '../context'
import { useMessages } from '../i18n/react'
import { backgrounds } from '../lib/assets'

export default function BackgroundSwitcher() {
  const { bg, setBg } = useStore()
  const t = useMessages()

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-bold">{t.background}</h3>
      <div className="grid grid-cols-9 gap-1.5">
        {backgrounds.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setBg(i)}
            aria-label={t.backgrounds[b.id]}
            aria-pressed={bg === i}
            title={t.backgrounds[b.id]}
            style={{ background: b.value || 'var(--page)' }}
            className={`aspect-square rounded-lg border border-line outline-2 outline-offset-1 transition ${
              bg === i ? 'outline-primary' : 'outline-transparent'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
