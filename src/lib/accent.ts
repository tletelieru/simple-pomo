import type { ColorMode } from './theme'

export type AccentId = 'indigo' | 'violet' | 'pink' | 'red' | 'orange' | 'amber' | 'green' | 'teal'

export const accents: { id: AccentId; hex: string }[] = [
  { id: 'indigo', hex: '#3b4fe4' },
  { id: 'violet', hex: '#8b5cf6' },
  { id: 'pink', hex: '#ec4899' },
  { id: 'red', hex: '#ef4444' },
  { id: 'orange', hex: '#f97316' },
  { id: 'amber', hex: '#eab308' },
  { id: 'green', hex: '#22c55e' },
  { id: 'teal', hex: '#14b8a6' },
]

export const defaultAccent = accents[0].hex

export function accentFor(accent: string, mode: ColorMode): string {
  return accent === defaultAccent && mode === 'dark' ? '#8ea1ff' : accent
}

export function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
}

export function onColor(hex: string): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#17181c' : '#ffffff'
}
