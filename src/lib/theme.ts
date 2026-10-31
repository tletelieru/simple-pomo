export type ColorMode = 'light' | 'dark'

export const colorModeKey = 'color-mode'

export const pageColors: Record<ColorMode, string> = { light: '#f6f6f8', dark: '#17181c' }

export function pickColorMode(saved: string | null, prefersDark: boolean): ColorMode {
  if (saved === 'light' || saved === 'dark') return saved
  return prefersDark ? 'dark' : 'light'
}
