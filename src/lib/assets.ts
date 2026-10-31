export interface Background {
  name: string
  value: string
}

export const backgrounds: Background[] = [
  { name: 'Midnight', value: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #334155 100%)' },
  { name: 'Dusk', value: 'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 55%, #be185d 100%)' },
  { name: 'Forest', value: 'linear-gradient(160deg, #052e16 0%, #14532d 55%, #166534 100%)' },
  { name: 'Ember', value: 'linear-gradient(160deg, #431407 0%, #7c2d12 55%, #b45309 100%)' },
  { name: 'Ocean', value: 'linear-gradient(160deg, #082f49 0%, #0c4a6e 55%, #0e7490 100%)' },
]

export interface Track {
  name: string
  src: string
}

export const tracks: Track[] = []

export function imageBackground(src: string): string {
  return `linear-gradient(rgba(2,6,23,0.55), rgba(2,6,23,0.55)), url(${src}) center/cover no-repeat`
}
