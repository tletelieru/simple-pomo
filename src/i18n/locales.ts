export const locales = ['en', 'es'] as const

export type Locale = (typeof locales)[number]

export type Localized<T = string> = Record<Locale, T>

export const defaultLocale: Locale = 'en'

export const preferredLocaleKey = 'preferred-lang'

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

export function pickLocale(saved: string | null, browserLanguages: readonly string[]): Locale {
  if (isLocale(saved)) return saved
  for (const language of browserLanguages) {
    const short = language.toLowerCase().split('-')[0]
    if (isLocale(short)) return short
  }
  return defaultLocale
}

export function defineMessages<T>(messages: { en: T; es: NoInfer<T> }): Localized<T> {
  return messages
}
