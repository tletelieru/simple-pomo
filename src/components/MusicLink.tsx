import { useState } from 'react'
import type { FormEvent } from 'react'
import { useStore } from '../context'
import { useMessages } from '../i18n/react'
import { parseEmbed } from '../lib/embed'
import type { EmbedKind } from '../lib/embed'

const PLAYER_SIZE: Record<EmbedKind, string> = {
  youtube: 'aspect-video',
  spotify: 'h-[152px]',
  soundcloud: 'h-[166px]',
}

export default function MusicLink() {
  const { settings, updateSettings } = useStore()
  const t = useMessages()
  const [value, setValue] = useState('')
  const [invalid, setInvalid] = useState(false)
  const embed = parseEmbed(settings.musicUrl)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!parseEmbed(value)) {
      setInvalid(true)
      return
    }
    updateSettings({ musicUrl: value.trim() })
    setValue('')
    setInvalid(false)
  }

  if (embed) {
    return (
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold">{t.music}</h3>
          <button
            onClick={() => updateSettings({ musicUrl: '' })}
            className="text-sm text-muted transition hover:text-primary"
          >
            {t.musicRemove}
          </button>
        </div>
        <iframe
          key={embed.src}
          src={embed.src}
          title={t.music}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          className={`w-full rounded-xl border-0 ${PLAYER_SIZE[embed.kind]}`}
        />
      </section>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2">
      <label htmlFor="music-link" className="text-sm font-bold">
        {t.music}
      </label>
      <div className="flex gap-2">
        <input
          id="music-link"
          type="url"
          inputMode="url"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setInvalid(false)
          }}
          placeholder={t.musicPlaceholder}
          aria-invalid={invalid}
          className="min-w-0 flex-1 rounded-[10px] bg-soft px-3 py-2 text-sm text-ink outline-none placeholder:text-muted focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="shrink-0 rounded-[10px] bg-soft px-3 py-2 text-sm font-semibold transition hover:opacity-80"
        >
          {t.addCategory}
        </button>
      </div>
      {invalid && <p className="text-sm text-primary">{t.musicInvalid}</p>}
    </form>
  )
}
