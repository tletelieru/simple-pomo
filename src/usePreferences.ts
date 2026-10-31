import { useEffect, useState } from 'react'
import { pickLocale, preferredLocaleKey } from './i18n/locales'
import type { Locale } from './i18n/locales'
import { colorModeKey, pageColors, pickColorMode } from './lib/theme'
import type { ColorMode } from './lib/theme'

export function usePreferences() {
  const [locale, setLocale] = useState<Locale>(() =>
    pickLocale(localStorage.getItem(preferredLocaleKey), navigator.languages),
  )
  const [mode, setMode] = useState<ColorMode>(() =>
    pickColorMode(
      localStorage.getItem(colorModeKey),
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  )

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  useEffect(() => {
    document.documentElement.dataset.theme = mode
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', pageColors[mode])
  }, [mode])

  function changeLocale(next: Locale) {
    localStorage.setItem(preferredLocaleKey, next)
    setLocale(next)
  }

  function toggleMode() {
    const next = mode === 'dark' ? 'light' : 'dark'
    localStorage.setItem(colorModeKey, next)
    setMode(next)
  }

  return { locale, mode, changeLocale, toggleMode }
}
