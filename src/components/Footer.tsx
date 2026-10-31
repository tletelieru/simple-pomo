import { useMessages } from '../i18n/react'
import { GitHubIcon } from './icons'

const GITHUB_URL = 'https://github.com/tletelieru'
const SITE_URL = 'https://tletelieru.github.io/tletelieru/'

export default function Footer() {
  const t = useMessages()

  return (
    <footer className="flex items-center justify-center gap-2">
      <span className="card rounded-full bg-paper px-3 py-1 text-sm text-muted">
        {t.developedBy}{' '}
        <a href={SITE_URL} target="_blank" rel="noreferrer" className="text-primary hover:underline">
          tletelieru
        </a>
      </span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        title="GitHub"
        className="card flex h-8 w-8 items-center justify-center rounded-full bg-paper text-muted hover:text-ink"
      >
        <GitHubIcon />
      </a>
    </footer>
  )
}
