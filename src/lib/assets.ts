import type { AmbienceKind } from './ambience'

export type BackgroundId =
  | 'plain'
  | 'midnight'
  | 'dusk'
  | 'forest'
  | 'ember'
  | 'ocean'
  | 'mountains'
  | 'sunset'
  | 'night'

export interface Background {
  id: BackgroundId
  value: string
}

function imageBackground(file: string): string {
  return `url(${import.meta.env.BASE_URL}backgrounds/${file}) center/cover no-repeat`
}

export const backgrounds: Background[] = [
  { id: 'plain', value: '' },
  { id: 'midnight', value: 'linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #334155 100%)' },
  { id: 'dusk', value: 'linear-gradient(160deg, #1e1b4b 0%, #4c1d95 55%, #be185d 100%)' },
  { id: 'forest', value: 'linear-gradient(160deg, #052e16 0%, #14532d 55%, #166534 100%)' },
  { id: 'ember', value: 'linear-gradient(160deg, #431407 0%, #7c2d12 55%, #b45309 100%)' },
  { id: 'ocean', value: 'linear-gradient(160deg, #082f49 0%, #0c4a6e 55%, #0e7490 100%)' },
  { id: 'mountains', value: imageBackground('mountains.svg') },
  { id: 'sunset', value: imageBackground('sunset.svg') },
  { id: 'night', value: imageBackground('night.svg') },
]

export interface Track {
  kind: AmbienceKind
  image: string
}

export const tracks: Track[] = [
  { kind: 'rain', image: 'linear-gradient(160deg, #475569 0%, #1e3a5f 100%)' },
  { kind: 'waves', image: 'linear-gradient(160deg, #0891b2 0%, #1e40af 100%)' },
  { kind: 'brown', image: 'linear-gradient(160deg, #a16207 0%, #57260d 100%)' },
]
