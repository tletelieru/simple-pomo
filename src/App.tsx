import { useEffect, useState } from 'react'
import { useStore } from './context'
import { LocaleContext } from './i18n/react'
import type { Locale } from './i18n/locales'
import { accentFor, onColor } from './lib/accent'
import { backgrounds } from './lib/assets'
import type { ColorMode } from './lib/theme'
import { StoreProvider } from './store'
import { usePreferences } from './usePreferences'
import AudioPlayer from './components/AudioPlayer'
import CategoryPicker from './components/CategoryPicker'
import Footer from './components/Footer'
import Header from './components/Header'
import Settings from './components/Settings'
import Stats from './components/Stats'
import Timer from './components/Timer'

interface ShellProps {
  locale: Locale
  mode: ColorMode
  onLocale: (locale: Locale) => void
  onToggleMode: () => void
}

const CARD = 'card rounded-[18px] border border-line bg-paper p-5'

function Shell(props: ShellProps) {
  const { bg, settings } = useStore()
  const [showSettings, setShowSettings] = useState(false)
  const background = backgrounds[bg]?.value ?? ''
  const glass = settings.glass && Boolean(background)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.glass = String(glass)
    const primary = accentFor(settings.accent, props.mode)
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--on-primary', onColor(primary))
  }, [glass, settings.accent, props.mode])

  return (
    <>
      {background && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute -inset-10"
            style={{ background, filter: `blur(${settings.blur}px)` }}
          />
          <div
            className={`absolute inset-0 ${props.mode === 'dark' ? 'bg-black' : 'bg-white'}`}
            style={{ opacity: settings.dim / 100 }}
          />
        </div>
      )}

      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col gap-4 p-4 lg:max-w-4xl">
        <Header {...props} onSettings={() => setShowSettings(true)} />

        <main className="grid flex-1 grid-cols-[minmax(0,1fr)] content-start gap-4 lg:grid-cols-2 lg:content-center">
          <div className={`${CARD} flex flex-col gap-6`}>
            <Timer />
            <CategoryPicker />
          </div>
          <div className="flex flex-col gap-4">
            <div className={CARD}>
              <Stats />
            </div>
            <div className={CARD}>
              <AudioPlayer />
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </>
  )
}

export default function App() {
  const { locale, mode, changeLocale, toggleMode } = usePreferences()

  return (
    <LocaleContext value={locale}>
      <StoreProvider>
        <Shell locale={locale} mode={mode} onLocale={changeLocale} onToggleMode={toggleMode} />
      </StoreProvider>
    </LocaleContext>
  )
}
