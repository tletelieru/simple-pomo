import { describe, expect, it } from 'vitest'
import { parseEmbed } from './embed'

const VIDEO = 'jfKfPfyJRdk'
const LIST = 'PLOzDu-MXXLlixbH1tkx2Jc1K0MOzGq5pQ'
const YOUTUBE = 'https://www.youtube-nocookie.com/embed/'

describe('parseEmbed', () => {
  it('reads every YouTube link shape', () => {
    const src = `${YOUTUBE}${VIDEO}`
    expect(parseEmbed(`https://www.youtube.com/watch?v=${VIDEO}`)?.src).toBe(src)
    expect(parseEmbed(`https://youtu.be/${VIDEO}?si=abc`)?.src).toBe(src)
    expect(parseEmbed(`https://m.youtube.com/watch?v=${VIDEO}`)?.src).toBe(src)
    expect(parseEmbed(`https://music.youtube.com/watch?v=${VIDEO}`)?.src).toBe(src)
    expect(parseEmbed(`https://www.youtube.com/live/${VIDEO}`)?.src).toBe(src)
    expect(parseEmbed(`  https://youtu.be/${VIDEO}  `)?.src).toBe(src)
  })

  it('reads YouTube playlists', () => {
    expect(parseEmbed(`https://music.youtube.com/playlist?list=${LIST}`)?.src).toBe(
      `${YOUTUBE}videoseries?list=${LIST}`,
    )
    expect(parseEmbed(`https://www.youtube.com/watch?v=${VIDEO}&list=${LIST}`)?.src).toBe(
      `${YOUTUBE}${VIDEO}?list=${LIST}`,
    )
  })

  it('reads Spotify links', () => {
    expect(parseEmbed('https://open.spotify.com/playlist/37i9dQZF1DWWQRwui0ExPn?si=1')).toEqual({
      kind: 'spotify',
      src: 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn',
    })
    expect(parseEmbed('https://open.spotify.com/intl-es/album/4aawyAB9vmqN3uQ7FjRGTy')?.src).toBe(
      'https://open.spotify.com/embed/album/4aawyAB9vmqN3uQ7FjRGTy',
    )
  })

  it('reads SoundCloud links without keeping the query', () => {
    expect(parseEmbed('https://soundcloud.com/lofi/sets/focus?si=1')).toEqual({
      kind: 'soundcloud',
      src: 'https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Flofi%2Fsets%2Ffocus',
    })
  })

  it('rejects anything else', () => {
    expect(parseEmbed('')).toBeNull()
    expect(parseEmbed('not a url')).toBeNull()
    expect(parseEmbed('https://example.com/watch?v=abcdefghijk')).toBeNull()
    expect(parseEmbed('https://youtube.com.evil.io/watch?v=abcdefghijk')).toBeNull()
    expect(parseEmbed(`http://www.youtube.com/watch?v=${VIDEO}`)).toBeNull()
    expect(parseEmbed('javascript:alert(1)')).toBeNull()
    expect(parseEmbed('https://www.youtube.com/watch?v="><script>')).toBeNull()
    expect(parseEmbed('https://open.spotify.com/user/someone')).toBeNull()
    expect(parseEmbed('https://soundcloud.com/')).toBeNull()
  })
})
