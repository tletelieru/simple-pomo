# Simple Pomodoro

A simple, installable Pomodoro timer with per-category stats. Fully frontend, no backend —
data is stored in the browser (localStorage) with JSON export/import. Deploys to GitHub Pages.

The lightweight sibling of the larger "Pomodoro / Solanum" project.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- `vite-plugin-pwa` (installable, offline)
- ESLint (typescript-eslint, flat config)
- pnpm

## Features

- Focus / short break / long break with configurable durations and auto-cycle
- Tag each focus session with a category; stats per category (today / week / all-time)
- Settings: durations, rounds, time display, auto-start, completion sound, notification
- Main color picker
- Background switcher with dim, blur and glass cards
- Optional ambience player (rain, waves, brown noise), independent of the timer
- Your own music: paste a YouTube, Spotify or SoundCloud link
- Light and dark theme, English and Spanish (same `color-mode` and `preferred-lang` keys as chat-stats)
- Floating timer (video Picture-in-Picture) where the browser supports it
- Export / import your data as JSON

## Develop

```bash
pnpm install
pnpm gen:icons   # generate PWA icons from public/favicon.svg
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Lint and test

```bash
pnpm lint
pnpm test
```

## Deploy to GitHub Pages

Pushes to `main` run `.github/workflows/deploy.yml`, which checks the code and publishes
`dist/`. `vite.config.ts` sets `base: '/simple-pomo/'`, so rename it if the repo name differs.

## Assets

No third-party media is bundled. See `CREDITS.md` for vetted free sources and how to add
background images and ambience.
