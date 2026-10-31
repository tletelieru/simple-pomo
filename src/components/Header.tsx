import { useMessages } from '../i18n/react'
import { locales } from '../i18n/locales'
import type { Locale } from '../i18n/locales'
import type { ColorMode } from '../lib/theme'
import { MoonIcon, SettingsIcon, SunIcon } from './icons'

interface Props {
  locale: Locale
  mode: ColorMode
  onLocale: (locale: Locale) => void
  onToggleMode: () => void
  onSettings: () => void
}

const ICON_BUTTON =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-ink'

export default function Header({ locale, mode, onLocale, onToggleMode, onSettings }: Props) {
  const t = useMessages()
  const modeLabel = mode === 'dark' ? t.toLight : t.toDark

  return (
    <header className="card flex items-center gap-2 rounded-[18px] border border-line bg-paper px-3 py-2">
      <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="" className="h-8 w-8" />
      <p className="min-w-0 flex-1 truncate font-bold tracking-tight">{t.appName}</p>
      <div role="group" aria-label={t.language} className="flex rounded-[10px] border border-line">
        {locales.map((option) => (
          <button
            key={option}
            onClick={() => onLocale(option)}
            aria-pressed={locale === option}
            className={`px-2.5 py-1 text-xs font-bold first:rounded-l-[9px] last:rounded-r-[9px] ${
              locale === option ? 'bg-primary text-on-primary' : 'text-muted'
            }`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
      <button onClick={onToggleMode} aria-label={modeLabel} title={modeLabel} className={ICON_BUTTON}>
        {mode === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
      <button onClick={onSettings} aria-label={t.settings} title={t.settings} className={ICON_BUTTON}>
        <SettingsIcon />
      </button>
    </header>
  )
}
