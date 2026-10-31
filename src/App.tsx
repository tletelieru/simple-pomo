import { useState } from 'react'
import { StoreProvider, useStore } from './store'
import { backgrounds } from './lib/assets'
import Timer from './components/Timer'
import CategoryPicker from './components/CategoryPicker'
import Stats from './components/Stats'
import Settings from './components/Settings'
import AudioPlayer from './components/AudioPlayer'

function Shell() {
  const { bg } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  const background = backgrounds[bg]?.value ?? backgrounds[0].value

  return (
    <main
      className="min-h-full w-full"
      style={{ background, transition: 'background 0.4s ease' }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col gap-8 px-4 py-6">
        <header className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-white">🍅 Simple Pomodoro</h1>
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20"
          >
            Settings
          </button>
        </header>

        <div className="mt-2">
          <Timer />
        </div>

        <CategoryPicker />

        <div className="rounded-2xl bg-black/20 p-4 backdrop-blur">
          <Stats />
        </div>

        <div className="mt-auto">
          <AudioPlayer />
        </div>
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </main>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
