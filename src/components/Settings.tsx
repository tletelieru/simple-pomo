import { useRef } from 'react'
import { useStore } from '../context'
import { useMessages } from '../i18n/react'
import { accents } from '../lib/accent'
import { backgrounds } from '../lib/assets'
import { requestNotifications } from '../lib/notify'
import { LIMITS } from '../lib/persist'
import { timeDisplays } from '../lib/timer'
import type { TimeDisplay } from '../lib/timer'
import BackgroundSwitcher from './BackgroundSwitcher'

interface Props {
  onClose: () => void
}

const NUMS = ['focus', 'short', 'long', 'rounds'] as const
const TOGGLES = ['autoStart', 'sound', 'ringAnimation'] as const
const SLIDERS = [
  { key: 'dim', unit: '%' },
  { key: 'blur', unit: 'px' },
] as const

const CHECKBOX = 'h-5 w-5 accent-[var(--primary)]'
const ACTION =
  'flex-1 rounded-[10px] bg-soft px-4 py-2 text-sm font-semibold transition hover:opacity-80'

export default function Settings({ onClose }: Props) {
  const { settings, bg, updateSettings, exportData, importData } = useStore()
  const t = useMessages()
  const fileRef = useRef<HTMLInputElement>(null)
  const pressedBackdrop = useRef(false)
  const hasImage = Boolean(backgrounds[bg]?.value)

  async function onNotify(enabled: boolean) {
    if (!enabled) {
      updateSettings({ notify: false })
      return
    }
    const granted = await requestNotifications()
    updateSettings({ notify: granted })
    if (!granted) alert(t.notificationsBlocked)
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(String(reader.result))
      if (!ok) alert(t.importFailed)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div
      data-testid="settings-backdrop"
      onPointerDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onClose()
      }}
      className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 p-4 sm:items-center"
    >
      <div className="card max-h-full w-full max-w-md overflow-y-auto rounded-[18px] border border-line bg-paper p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{t.settings}</h2>
          <button onClick={onClose} className="text-sm text-muted hover:text-ink">
            {t.close}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {NUMS.map((key) => (
            <label key={key} className="flex flex-col justify-end gap-1 text-sm text-muted">
              {t.fields[key]}
              <input
                type="number"
                min={LIMITS[key].min}
                max={LIMITS[key].max}
                value={settings[key]}
                onChange={(e) => {
                  const { min, max } = LIMITS[key]
                  updateSettings({ [key]: Math.min(max, Math.max(min, Number(e.target.value) || min)) })
                }}
                className="rounded-[10px] bg-soft px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary"
              />
            </label>
          ))}
        </div>

        <label className="mt-3 flex flex-col gap-1 text-sm text-muted">
          {t.fields.timeDisplay}
          <select
            value={settings.timeDisplay}
            onChange={(e) => updateSettings({ timeDisplay: e.target.value as TimeDisplay })}
            className="rounded-[10px] bg-soft px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-primary"
          >
            {timeDisplays.map((display) => (
              <option key={display} value={display} className="bg-page text-ink">
                {t.timeDisplays[display]}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 flex flex-col gap-2">
          {TOGGLES.map((key) => (
            <label key={key} className="flex items-center justify-between text-sm">
              {t.fields[key]}
              <input
                type="checkbox"
                checked={settings[key]}
                onChange={(e) => updateSettings({ [key]: e.target.checked })}
                className={CHECKBOX}
              />
            </label>
          ))}
          <label className="flex items-center justify-between text-sm">
            {t.fields.notify}
            <input
              type="checkbox"
              checked={settings.notify}
              onChange={(e) => void onNotify(e.target.checked)}
              className={CHECKBOX}
            />
          </label>
        </div>

        <section className="mt-5 flex flex-col gap-2">
          <h3 className="text-sm font-bold">{t.fields.accent}</h3>
          <div className="grid grid-cols-9 gap-1.5">
            {accents.map((a) => (
              <button
                key={a.id}
                onClick={() => updateSettings({ accent: a.hex })}
                aria-label={t.accents[a.id]}
                aria-pressed={settings.accent === a.hex}
                title={t.accents[a.id]}
                style={{ background: a.hex }}
                className={`aspect-square rounded-full outline-2 outline-offset-1 transition ${
                  settings.accent === a.hex ? 'outline-ink' : 'outline-transparent'
                }`}
              />
            ))}
            <input
              type="color"
              value={settings.accent}
              onChange={(e) => updateSettings({ accent: e.target.value })}
              aria-label={t.fields.customAccent}
              title={t.fields.customAccent}
              className="aspect-square h-auto w-full cursor-pointer rounded-full border border-line bg-transparent p-0"
            />
          </div>
        </section>

        <div className="mt-5 flex flex-col gap-3">
          <BackgroundSwitcher />
          {hasImage && (
            <label className="flex items-center justify-between text-sm">
              {t.fields.glass}
              <input
                type="checkbox"
                checked={settings.glass}
                onChange={(e) => updateSettings({ glass: e.target.checked })}
                className={CHECKBOX}
              />
            </label>
          )}
          {hasImage &&
            SLIDERS.map((s) => (
              <label key={s.key} className="flex items-center gap-3 text-sm">
                <span className="w-24">{t.fields[s.key]}</span>
                <input
                  type="range"
                  min={LIMITS[s.key].min}
                  max={LIMITS[s.key].max}
                  value={settings[s.key]}
                  onChange={(e) => updateSettings({ [s.key]: Number(e.target.value) })}
                  className="min-w-0 flex-1 accent-[var(--primary)]"
                />
                <span className="w-12 text-right tabular-nums text-muted">
                  {settings[s.key]}
                  {s.unit}
                </span>
              </label>
            ))}
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={exportData} className={ACTION}>
            {t.exportData}
          </button>
          <button onClick={() => fileRef.current?.click()} className={ACTION}>
            {t.importData}
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onFile} hidden />
        </div>
      </div>
    </div>
  )
}
