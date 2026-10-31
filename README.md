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
- Settings: durations, rounds, auto-start, completion sound
- Background switcher (gradients out of the box)
- Optional ambience player (add your own tracks — see `CREDITS.md`)
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

## Lint

```bash
pnpm lint
```

## Deploy to GitHub Pages

`vite.config.ts` sets `base: '/simple-pomo/'`. Rename it if the repo name differs.
Build and publish `dist/` with a GitHub Actions workflow (Pages) or push `dist/` to the
`gh-pages` branch. Then enable Pages in the repo settings.

## Assets

No third-party media is bundled by default. See `CREDITS.md` for vetted free sources and
how to add background images and ambience tracks.
