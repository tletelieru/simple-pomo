import { createContext, useContext } from 'react'
import type { Persisted, Settings } from './lib/persist'
import type { Mode } from './lib/timer'

export type { Session, Settings } from './lib/persist'
export type { Mode } from './lib/timer'

export interface Store extends Persisted {
  mode: Mode
  view: Mode
  sessionActive: boolean
  running: boolean
  remaining: number
  completedFocus: number
  start: () => void
  resume: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  setMode: (mode: Mode) => void
  setActiveCategory: (c: string) => void
  addCategory: (c: string) => void
  removeCategory: (c: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  setBg: (i: number) => void
  clearStats: () => void
  exportData: () => void
  importData: (json: string) => boolean
}

export const StoreContext = createContext<Store | null>(null)

export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
