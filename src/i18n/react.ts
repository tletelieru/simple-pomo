import { createContext, useContext } from 'react'
import { defaultLocale } from './locales'
import type { Locale } from './locales'
import { messages } from './messages'

export const LocaleContext = createContext<Locale>(defaultLocale)

export function useLocale(): Locale {
  return useContext(LocaleContext)
}

export function useMessages() {
  return messages[useLocale()]
}
