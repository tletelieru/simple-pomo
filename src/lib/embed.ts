export type EmbedKind = 'youtube' | 'spotify' | 'soundcloud'

export interface Embed {
  kind: EmbedKind
  src: string
}

const YOUTUBE_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']
const SOUNDCLOUD_HOSTS = ['soundcloud.com', 'www.soundcloud.com', 'm.soundcloud.com', 'on.soundcloud.com']
const YOUTUBE_ID = /^[\w-]{6,64}$/
const SPOTIFY_PATH = /^\/(?:intl-[a-z]{2}\/)?(track|album|playlist|episode|show|artist)\/([A-Za-z0-9]{10,40})\/?$/

function youtubeEmbed(video: string | null, list: string | null): Embed | null {
  const validVideo = video && YOUTUBE_ID.test(video) ? video : null
  const validList = list && YOUTUBE_ID.test(list) ? list : null
  const base = 'https://www.youtube-nocookie.com/embed/'
  if (validVideo) {
    const query = validList ? `?list=${validList}` : ''
    return { kind: 'youtube', src: `${base}${validVideo}${query}` }
  }
  if (validList) return { kind: 'youtube', src: `${base}videoseries?list=${validList}` }
  return null
}

function parseYoutube(url: URL): Embed | null {
  const list = url.searchParams.get('list')
  const [, section, id] = url.pathname.split('/')
  if (section === 'live' || section === 'shorts' || section === 'embed') {
    return youtubeEmbed(id ?? null, list)
  }
  return youtubeEmbed(url.searchParams.get('v'), list)
}

export function parseEmbed(value: string): Embed | null {
  let url: URL
  try {
    url = new URL(value.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null

  if (YOUTUBE_HOSTS.includes(url.hostname)) return parseYoutube(url)
  if (url.hostname === 'youtu.be') {
    return youtubeEmbed(url.pathname.slice(1), url.searchParams.get('list'))
  }

  if (url.hostname === 'open.spotify.com') {
    const match = SPOTIFY_PATH.exec(url.pathname)
    if (!match) return null
    return { kind: 'spotify', src: `https://open.spotify.com/embed/${match[1]}/${match[2]}` }
  }

  if (SOUNDCLOUD_HOSTS.includes(url.hostname) && url.pathname.length > 1) {
    const track = encodeURIComponent(`${url.origin}${url.pathname}`)
    return { kind: 'soundcloud', src: `https://w.soundcloud.com/player/?url=${track}` }
  }

  return null
}
