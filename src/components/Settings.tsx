import { useRef } from 'react'
import { useStore } from '../store'
import type { Settings as SettingsType } from '../store'
import BackgroundSwitcher from './BackgroundSwitcher'

interface Props {
  onClose: () => void
}

const NUMS: { key: keyof SettingsType; label: string; min: number; max: number }[] = [
  { key: 'focus', label: 'Focus (min)', min: 1, max: 120 },
  { key: 'short', label: 'Short break (min)', min: 1, max: 60 },
  { key: 'long', label: 'Long break (min)', min: 1, max: 60 },
  { key: 'rounds', label: 'Rounds before long', min: 1, max: 12 },
]

export default function Settings({ onClose }: Props) {
  const { settings, updateSettings, exportData, importData } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const ok = importData(String(reader.result))
      if (!ok) alert('Could not import that file.')
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/50 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            Close
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {NUMS.map((n) => (
            <label key={n.key} className="flex flex-col gap-1 text-sm text-white/80">
              {n.label}
              <input
                type="number"
                min={n.min}
                max={n.max}
                value={settings[n.key] as number}
                onChange={(e) =>
                  updateSettings({ [n.key]: Math.max(n.min, Number(e.target.value) || n.min) })
                }
                className="rounded-lg bg-white/10 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-red-500"
              />
            </label>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <label className="flex items-center justify-between text-sm text-white/80">
            Auto-start next
            <input
              type="checkbox"
              checked={settings.autoStart}
              onChange={(e) => updateSettings({ autoStart: e.target.checked })}
              className="h-5 w-5 accent-red-500"
            />
          </label>
          <label className="flex items-center justify-between text-sm text-white/80">
            Completion sound
            <input
              type="checkbox"
              checked={settings.sound}
              onChange={(e) => updateSettings({ sound: e.target.checked })}
              className="h-5 w-5 accent-red-500"
            />
          </label>
        </div>

        <div className="mt-5">
          <BackgroundSwitcher />
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={exportData}
            className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            Export
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            Import
          </button>
          <input ref={fileRef} type="file" accept="application/json" onChange={onFile} hidden />
        </div>
      </div>
    </div>
  )
}
